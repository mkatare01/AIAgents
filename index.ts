import { executeAutomationPipeline } from "./createsAgents/agent.js";

async function main() {
  console.log("=================================================");
  console.log("🚀 STARTING AI GIT AND PLAYWRIGHT AUTOMATION LOOP");
  console.log("=================================================\n");

  const workflowConfig = {
    repositoryUrl: "https://github.com/mkatare01/AIAgents",
    commitMessage: "ai(patch): automated functional layout updates",
    pullRequestTitle: "🤖 AI Patch: Core Integration Processing Updates"
  };

  const runtimeResult = await executeAutomationPipeline(workflowConfig);

  if (runtimeResult.success) {
    console.log("\n=================================================");
    if (runtimeResult.link) {
      console.log(`🎉 RUN SUCCESSFUL: PR Created & Merged at ${runtimeResult.link}`);
    } else {
      console.log(`🎉 RUN SUCCESSFUL: ${runtimeResult.reason ?? "Pipeline completed with no PR to create."}`);
    }
    console.log("=================================================");
  } else {
    console.error(`\n❌ RUN FAILED: Pipeline halted during: ${runtimeResult.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal unhandled panic captured in root execution lifecycle script:", err);
  process.exit(1);
});
