---
name: run-agents
description: Run and drive the Playwright test-automation suite in this repo (target site is Rahul Shetty's AutomationPractice page). Use when asked to run the tests, install/build this project, launch a browser against the practice page, take a screenshot, or interact live with the site (radio buttons, checkboxes, alerts, iframe, tables, window/tab switching).
---

This repo has no app of its own to build - it's a Playwright test suite
(`tests/*.spec.ts`) that drives the live 3rd-party site
`https://rahulshettyacademy.com/AutomationPractice/`. Two ways to "run" it:
execute the automated suite with `npx playwright test`, or drive the live
page interactively via the `Playwright` MCP server already wired up in
`.mcp.json` (in Claude Code these show up as `mcp__Playwright__browser_*`
tools - the off-the-shelf equivalent of `chromium-cli` for this repo, no
custom driver script needed). Prefer the MCP tools when debugging a
specific locator/assertion; run the suite to confirm a fix.

All paths below are relative to the repo root (where `package.json` lives).

## Prerequisites

Node.js + npm. Playwright's browsers ship inside `node_modules/playwright-core`
in this checkout - no separate OS packages were needed to run headed
chromium on this machine. (Firefox and webkit are blocked here for
environment reasons unrelated to this project - see Gotchas - and are no
longer configured.)

```powershell
npm install
npx playwright --version
# -> Version 1.63.0
```

## Run the suite (agent path)

```powershell
npx playwright test --reporter=line
```

`playwright.config.ts` now defines a single project, `chromium` (headed,
maximized) - `firefox` and `webkit` were removed after both turned out to
be broken on this machine, not in the test code (see Gotchas). The
default reporter is `html`; a run writes/updates `playwright-report/index.html`,
and traces on first retry land in `test-results/`.

Run a single spec:

```powershell
npx playwright test tests/automation-practice-form-controls.spec.ts --reporter=line
```

`npm test` maps to `playwright test --project=chromium --headed` (see
`package.json`) - equivalent to the command above now that chromium is
the only project.

## Drive the live page interactively (agent path)

`.mcp.json` already configures `@playwright/mcp`, so there's nothing to
build - just use its tools. The loop that works:

1. `browser_navigate` -> `https://rahulshettyacademy.com/AutomationPractice/`
2. `browser_snapshot` -> returns an accessibility tree with element refs
   (e.g. `e17`, `f3e43`). Refs are only valid for the snapshot they came
   from - re-snapshot after any navigation, reload, or DOM change before
   clicking a stale ref.
3. Act on a ref from the latest snapshot: `browser_click` (`target` = the
   ref/selector, `element` = a human-readable description of what you're
   clicking - don't swap them), or `browser_evaluate` to read/set DOM
   state directly (e.g. checking `input.checked`) when you need ground
   truth a locator assertion doesn't give you.
4. `browser_take_screenshot` (`fullPage: true`) for visual proof - lands
   under `.playwright-mcp/` by default.

Verified this session: navigated to the practice page, took
`.playwright-mcp/skill-verification.png` (full-page screenshot showing
every example section - radio/checkbox/dropdown, alert/confirm, window/tab
switching, both web tables, mouse hover, iframe), and used
`browser_evaluate` on `input[type="radio"]` / `input[type="checkbox"]` to
confirm the DOM's actual `checked` state when a locator-based click
appeared to do nothing.

## Test

Same command as "Run the suite" above - the specs are the tests, there's
no separate unit-test layer.

```powershell
npx playwright test --reporter=line
```

Expect all specs green except `iFrame content interaction` in
`tests/automation-practice-hover-and-iframe.spec.ts`, which is
`test.fixme()`'d (see Gotchas) and reports as skipped, not failed.

The default full-suite run opens 6 concurrent headed+maximized chromium
windows (one per worker) on this machine, and that occasionally crashes
or times out one of them - seen so far as a `hover()` timeout in
`automation-practice-hover-and-iframe.spec.ts` and a
`Protocol error (Runtime.callFunctionOn): Internal server error, session
closed` in `automation-practice-web-table.spec.ts`. Both passed
immediately when re-run alone. If a spec fails on a full run, re-run just
that file before assuming it's a real regression:

```powershell
npx playwright test tests/<the-failing-spec>.spec.ts --reporter=line
```

## Gotchas

- **`webkit` is blocked by a Windows Application Control policy on this
  machine, not missing/corrupt.** It used to be a project in
  `playwright.config.ts`; every launch failed with
  `browserType.launch: Target page, context or browser has been closed`
  (webkit process exiting immediately, exit code `0xC0E90002`, no crash
  log). Reinstalling (`npx playwright install webkit` - even a clean
  `Remove-Item` + reinstall) didn't fix it; Playwright's own dependency
  check then started reporting `icutu77.dll`/`crypto-57.dll` as "missing"
  even though both files are physically present in
  `%LOCALAPPDATA%\ms-playwright\webkit-2359\`. Loading either DLL
  directly with `LoadLibraryEx` (via a tiny `Add-Type` P/Invoke wrapper)
  returned Win32 error `4551`, whose message is literally *"An
  Application Control policy has blocked this file."* This is a
  machine-level security policy (WDAC/AppLocker), not something
  `npm`/`playwright install` can work around - that's why `webkit` is
  gone from the config rather than "fixed."
- **`firefox` launches fine but every `page.goto()` to an external site
  fails with `NS_ERROR_FAILURE`**, even though `tests/seed.spec.ts`
  (which never navigates) passes. This reproduced on every spec, 100% of
  the time, across multiple full-suite runs - not flaky. Root cause
  wasn't pinned down further before `firefox` was dropped from
  `playwright.config.ts`; if resurrecting it, start by checking the
  same Application Control angle (policy blocking Firefox's own DLLs or
  its network stack) before assuming it's a test problem.
- **Radio/checkbox `<label for="...">` doesn't match its input's `id` on
  the live page.** A real click on the label text
  (`page.getByText('Radio2').click()`) leaves the input unchecked -
  confirmed live with `browser_evaluate` reading `.checked`
  before/after. Click the `input[type=radio|checkbox]` element itself
  (or use `.check()`), not the label text.
- **The iframe's origin is down.** `<iframe src="https://legacy.rahulshettyacademy.com/">`
  - navigating there directly returns `net::ERR_CONNECTION_TIMED_OUT`.
  No locator fix will make its content appear; that assertion is
  `test.fixme()`'d, not worked around.
- **"Open Window" and "Open Tab" both lead to `qaclickacademy.com`,
  which currently serves a Cloudflare 526 "Invalid SSL certificate"
  page.** The popup/tab still opens with a different URL (switching
  mechanics work), but plain `waitForLoadState()` is fragile against a
  3rd-party page in this state - use `waitForLoadState('domcontentloaded')`
  so a slow/broken destination can't burn the whole test timeout.
- **`.ui-menu-item` suggestions for "Ind" match 3 countries**: British
  Indian Ocean Territory, India, and Indonesia - `hasText: 'India'`
  substring-matches "Indian" too and trips Playwright's strict-mode
  check. Filter with an exact match (e.g. `hasText: /^India$/`).

## Troubleshooting

- **`browser_click` -> "does not match any elements"**: passed the
  human-readable description as `target` instead of `element` - `target`
  wants the element ref/selector, `element` wants the description. Swap
  them.
- **`browser_tabs` -> "Invalid arguments for tool"**: it requires an
  explicit `action` (`list` / `new` / `close` / `select`); calling it
  with no arguments errors.
- **`browser_click`/`browser_snapshot` -> "Ref not found in the current
  page snapshot"**: the page navigated or reloaded since the ref was
  captured. Call `browser_snapshot` again and use a fresh ref.
