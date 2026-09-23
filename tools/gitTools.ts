import { execSync, execFileSync } from 'child_process';

export interface GitResult {
  success: boolean;
  branchName?: string;
  error?: string;
  noChanges?: boolean;
}

const GIT_TIMEOUT_MS = 30000;
// Prevent git from opening an interactive/GUI credential prompt (which would
// otherwise hang this process indefinitely with no output); fail fast instead.
const GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: '0' };

function describeExecError(error: any): string {
  // execFileSync attaches child output as Buffers on the thrown error, but
  // git writes some messages (e.g. "nothing to commit") to stdout, not stderr.
  const stdout = error.stdout ? error.stdout.toString().trim() : "";
  const stderr = error.stderr ? error.stderr.toString().trim() : "";
  return [stderr, stdout].filter(Boolean).join("\n") || error.message || String(error);
}

export function executeGitWorkflow(commitMessage: string): GitResult {
  try {
    // 1. Get current branch dynamically
    const branchName = execSync('git rev-parse --abbrev-ref HEAD', { timeout: GIT_TIMEOUT_MS }).toString().trim();
    console.log(`[Git UI] Active branch detected: [${branchName}]`);

    if (branchName === 'main' || branchName === 'master') {
      throw new Error("Safety Block: Committing directly to protected target branches is prohibited.");
    }

    // 2. Stage workspace updates
    console.log("[Git UI] Staging changes...");
    // 🚀 Using execFileSync completely bypasses terminal shell interpretation
    execFileSync('git', ['add', '.'], { timeout: GIT_TIMEOUT_MS, env: GIT_ENV });

    // 3. Commit changes
    console.log(`[Git UI] Committing changes with message: "${commitMessage}"`);
    try {
      execFileSync('git', ['commit', '-m', commitMessage], { timeout: GIT_TIMEOUT_MS, env: GIT_ENV });
    } catch (commitError: any) {
      if (/nothing to commit/i.test(describeExecError(commitError))) {
        console.log("[Git UI] Nothing to commit — workspace already matches remote. Skipping push.");
        return { success: true, branchName, noChanges: true };
      }
      throw commitError;
    }

    // 4. Push branch tracking upstream origin
    console.log(`[Git UI] Pushing branch upstream to remote...`);
    execFileSync('git', ['push', 'origin', branchName], { timeout: GIT_TIMEOUT_MS, env: GIT_ENV });

    return { success: true, branchName };
  } catch (error: any) {
    return { success: false, error: describeExecError(error) };
  }
}
