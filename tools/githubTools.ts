import { Stagehand } from "@browserbasehq/stagehand";
import dotenv from "dotenv";

dotenv.config();

export interface GithubAgentOptions {
  repoUrl: string;       // e.g., "https://github.com"
  branchName: string;    // The branch pushed by gitTools
  prTitle: string;
}

export async function runGithubWorkflowAgent(options: GithubAgentOptions) {
  const stagehand = new Stagehand({
    env: "LOCAL",
    modelName: "gpt-4o",
    modelClientOptions: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  });

  await stagehand.init();

  const page = stagehand.page; // 👈 Gets the Stagehand-enhanced Playwright page instance
  const context = stagehand.context;

  // Inject session cookies to bypass login / 2FA screens
  if (process.env.GITHUB_SESSION_COOKIE) {
    await context.addCookies([{
      name: "user_session",
      value: process.env.GITHUB_SESSION_COOKIE,
      domain: ".github.com",
      path: "/",
      secure: true,
      httpOnly: true
    }]);
  }

  try {
    // ---- STEP 1: CREATE PULL REQUEST ----
    const compareUrl = `${options.repoUrl}/compare/main...${options.branchName}`;
    console.log(`[GitHub Agent] Directing browser to: ${compareUrl}`);
    await page.goto(compareUrl);
    await page.waitForLoadState("domcontentloaded");

    console.log("[GitHub Agent] Filling out Pull Request form details...");
    await page.act(`Type "${options.prTitle}" into the Pull Request title input field`);
    await page.act('Type "Automated changes pushed and verified by AI dev agent." into the Pull Request body text area');

    console.log("[GitHub Agent] Submitting form...");
    await page.act("Click the green button named 'Create pull request'");

    // Wait for the URL redirect to capture the finalized PR web link
    const escapedRepoUrl = options.repoUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await page.waitForURL(new RegExp(`${escapedRepoUrl}/pull/\\d+`));
    const createdPrUrl = page.url();
    console.log(`[GitHub Agent] Pull Request generated successfully at: ${createdPrUrl}`);

    // ---- STEP 2: MERGE PULL REQUEST ----
    console.log("[GitHub Agent] Waiting for initial code validation parsing...");
    await page.waitForTimeout(3000);

    console.log("[GitHub Agent] Initiating semantic merge process...");
    await page.act("Find and click the green button named 'Merge pull request' or 'Squash and merge'");

    console.log("[GitHub Agent] Confirming transactional merge...");
    await page.act("Click on the 'Confirm merge' or 'Confirm squash and merge' button");

    await page.waitForTimeout(2000); // Allow UI transaction window to refresh status
    return { success: true, prUrl: createdPrUrl };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  } finally {
    await stagehand.close();
  }
}
