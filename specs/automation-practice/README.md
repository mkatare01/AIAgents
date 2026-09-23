# Automation Practice Test Plan

## Application Overview

QA exploration of Rahul Shetty's Automation Practice page, organized into a dedicated spec folder with scenarios for controls, dialogs, dynamic elements, tables, hover, and iframe interactions.

## Test Scenarios

### 1. Automation Practice Core Flows

**Seed:** `tests/seed.spec.ts`

#### 1.1. Form controls and selection state

**File:** `tests/automation-practice-form-controls.spec.ts`

**Steps:**
  1. Load the Practice Page in a fresh browser session.
    - expect: The page title is Practice Page and key sections are visible.
  2. Select a radio option such as Radio2.
    - expect: Only the selected radio remains active and the UI reflects the chosen value.
  3. Type a country name like 'Ind' in the suggestion box.
    - expect: Matching country suggestions appear and the user can choose one.
  4. Choose an option from the dropdown list, such as Option2.
    - expect: The selected dropdown value updates to Option2.
  5. Select multiple checkboxes such as Option1 and Option3.
    - expect: Both boxes show as checked and remain independently selectable.

#### 1.2. Alert and confirmation dialog handling

**File:** `tests/automation-practice-alerts.spec.ts`

**Steps:**
  1. Enter a customer name in the alert input and click Alert.
    - expect: A browser alert dialog appears with the entered name in the message.
  2. Accept the alert.
    - expect: The alert closes and the page remains interactive.
  3. Click Confirm and choose Cancel.
    - expect: The confirmation dialog appears, the cancel action is accepted, and the page state remains stable.
  4. Click Confirm again and accept it.
    - expect: The confirmation result is accepted and the correct text or status is reflected by the page.

#### 1.3. Window and tab switching

**File:** `tests/automation-practice-window-switching.spec.ts`

**Steps:**
  1. Click Open Window.
    - expect: A new browser window opens and the page content changes to the new tab or window context.
  2. Return focus to the original page and verify the Practice Page remains loaded.
    - expect: The original page is still available and no crash occurs.
  3. Click Open Tab from the tab example section.
    - expect: A new tab opens to the QAClickAcademy site or expected target page.
  4. Verify the new tab loads successfully and can be closed.
    - expect: The user can navigate the new tab and return to the original page without broken state.

#### 1.4. Dynamic hide/show and total amount checks

**File:** `tests/automation-practice-dynamic-elements.spec.ts`

**Steps:**
  1. In the Hide/Show Example, type text in the input and click Hide.
    - expect: The input is hidden from view and the Hide button is no longer the active control.
  2. Click Show.
    - expect: The input becomes visible again with the typed value preserved or re-displayed as expected.
  3. Review the Web Table Fixed header section and note the displayed total amount.
    - expect: The page shows the total amount collected as a static value and the section remains stable.
  4. Compare the displayed total with the table values if a tester is validating calculations.
    - expect: The total value matches the expected sum or the discrepancy is clearly identified as a defect.

#### 1.5. Web table validation

**File:** `tests/automation-practice-web-table.spec.ts`

**Steps:**
  1. Examine the main Web Table Example and identify rows and columns.
    - expect: Table headers and data rows are visible and readable in a fresh state.
  2. Find a known entry or record in the table and verify the expected text across columns.
    - expect: The row contains the right data values and the table is not empty or misaligned.
  3. Scroll or navigate within the table if needed to inspect more rows.
    - expect: The table remains accessible and the layout is usable without overlapping elements.
  4. Check for broken or missing cells in a random row.
    - expect: No row is partially blank or malformed in a way that blocks validation.

#### 1.6. Mouse hover and iframe interaction

**File:** `tests/automation-practice-hover-and-iframe.spec.ts`

**Steps:**
  1. Hover over the Mouse Hover button and inspect the visible action area.
    - expect: The hover state is visually triggered and any related menu or interaction becomes visible.
  2. Switch into the embedded iframe and inspect the content inside it.
    - expect: The iframe loads and the embedded page content is accessible without the outer page breaking.
  3. Attempt to interact with visible iframe elements if present.
    - expect: The tester can move focus into the iframe and interact with the content in a controlled way.
  4. Return to the main page after iframe interaction.
    - expect: The outer page remains available and no session or focus issue occurs.
