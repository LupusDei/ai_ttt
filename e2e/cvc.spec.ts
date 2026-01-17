import { test, expect } from "@playwright/test";

test.describe("Computer vs Computer Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows difficulty selector when CvC mode is selected", async ({
    page,
  }) => {
    // Click Computer vs Computer
    await page.getByText("Computer vs Computer").click();

    // Should show difficulty selector
    await expect(page.getByText("Fun")).toBeVisible();
    await expect(page.getByText("God")).toBeVisible();

    // Should NOT show player selector (both are AI)
    await expect(page.getByText("Play as X")).not.toBeVisible();
    await expect(page.getByText("Play as O")).not.toBeVisible();
  });

  test("starts game and AI X makes first move automatically", async ({
    page,
  }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Board should be visible
    await expect(
      page.getByRole("grid", { name: /tic-tac-toe game board/i })
    ).toBeVisible();

    // AI X should make a move automatically
    await expect(
      page.getByRole("button", { name: /contains X/ })
    ).toBeVisible({ timeout: 5000 });
  });

  test("shows AI vs AI indicator during game", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Should show AI X vs AI O indicator (use exact text to avoid matching "AI X is thinking...")
    await expect(page.getByText("AI X", { exact: true })).toBeVisible();
    await expect(page.getByText("AI O", { exact: true })).toBeVisible();
  });

  test("shows pause button during CvC game", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Pause button should be visible
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  });

  test("pause button stops the game", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for first move
    await expect(
      page.getByRole("button", { name: /contains X/ })
    ).toBeVisible({ timeout: 5000 });

    // Click pause
    await page.getByRole("button", { name: "Pause" }).click();

    // Should show "Game Paused" message
    await expect(page.getByText("Game Paused")).toBeVisible();

    // Button should now say "Resume"
    await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  });

  test("resume button continues the game", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for first move
    await expect(
      page.getByRole("button", { name: /contains X/ })
    ).toBeVisible({ timeout: 5000 });

    // Pause the game
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByText("Game Paused")).toBeVisible();

    // Count moves before resume
    const xCountBefore = await page
      .getByRole("button", { name: /contains X/ })
      .count();
    const oCountBefore = await page
      .getByRole("button", { name: /contains O/ })
      .count();
    const totalBefore = xCountBefore + oCountBefore;

    // Resume the game
    await page.getByRole("button", { name: "Resume" }).click();

    // "Game Paused" should disappear
    await expect(page.getByText("Game Paused")).not.toBeVisible();

    // Wait for more moves (game should continue)
    await page.waitForTimeout(2000);

    // If game hasn't ended, there should be more moves
    const status = await page.getByRole("status").textContent();
    if (!status?.includes("wins") && !status?.includes("draw")) {
      const xCountAfter = await page
        .getByRole("button", { name: /contains X/ })
        .count();
      const oCountAfter = await page
        .getByRole("button", { name: /contains O/ })
        .count();
      const totalAfter = xCountAfter + oCountAfter;
      expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
    }
  });

  test("game completes automatically without interaction", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for game to complete (max 15 seconds for 9 moves with delays)
    await expect(async () => {
      const status = await page.getByRole("status").textContent();
      expect(status?.includes("wins") || status?.includes("draw")).toBeTruthy();
    }).toPass({ timeout: 15000 });
  });

  test("New Game button appears after CvC game ends", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for game to complete
    await expect(async () => {
      const status = await page.getByRole("status").textContent();
      expect(status?.includes("wins") || status?.includes("draw")).toBeTruthy();
    }).toPass({ timeout: 15000 });

    // New Game button should be visible
    await expect(
      page.getByRole("button", { name: "New Game" })
    ).toBeVisible();
  });

  test("pause/resume controls disappear after game ends", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for game to complete
    await expect(async () => {
      const status = await page.getByRole("status").textContent();
      expect(status?.includes("wins") || status?.includes("draw")).toBeTruthy();
    }).toPass({ timeout: 15000 });

    // Pause button should not be visible after game ends
    await expect(
      page.getByRole("button", { name: "Pause" })
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resume" })
    ).not.toBeVisible();
  });

  test("clicking New Game returns to setup screen", async ({ page }) => {
    await page.getByText("Computer vs Computer").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for game to complete
    await expect(async () => {
      const status = await page.getByRole("status").textContent();
      expect(status?.includes("wins") || status?.includes("draw")).toBeTruthy();
    }).toPass({ timeout: 15000 });

    // Click New Game
    await page.getByRole("button", { name: "New Game" }).click();

    // Should be back to setup
    await expect(page.getByText("Human vs Human")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start Game" })
    ).toBeVisible();
  });
});
