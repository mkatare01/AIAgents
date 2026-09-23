import { executeGitWorkflow } from "../tools/gitTools.js";
import { runGithubWorkflowAgent } from "../tools/githubTools.js";

export interface AgentConfiguration {
  repositoryUrl: string;
  pullRequestTitle: string;
  commitMessage: string;
}

export async function executeAutomationPipeline(config: AgentConfiguration) {
  console.log("⚡ [Agent Engine] Starting Stage 1: Local Workspace Push");
  const gitStep = executeGitWorkflow(config.commitMessage);

  if (!gitStep.success || !gitStep.branchName) {
    console.error(`❌ [Agent Engine] Terminal workflow broke: ${gitStep.error}`);
    return { success: false, reason: "Git Stage Failed" };
  }

  if (gitStep.noChanges) {
    console.log(`✅ [Agent Engine] No new changes to publish on branch: ${gitStep.branchName}\n`);
    return { success: true, reason: "No Changes To Publish" };
  }
  console.log(`✅ [Agent Engine] Changes successfully synchronized onto remote branch: ${gitStep.branchName}\n`);

  console.log("⚡ [Agent Engine] Starting Stage 2: Browser AI Operations");
  const githubStep = await runGithubWorkflowAgent({
    repoUrl: config.repositoryUrl,
    branchName: gitStep.branchName,
    prTitle: config.pullRequestTitle
  });

  if (!githubStep.success) {
    console.error(`❌ [Agent Engine] Browser operational layer failed: ${githubStep.error}`);
    return { success: false, reason: "GitHub UI Stage Failed" };
  }

  return { success: true, link: githubStep.prUrl };
}
