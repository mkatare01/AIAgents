import { exec } from "child_process";

export function runPlaywrightTests(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("npx playwright test", (error, stdout, stderr) => {
      if (error) {
        resolve(stdout + "\n" + stderr);
        return;
      }

      resolve(stdout);
    });
  });
}