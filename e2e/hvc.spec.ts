import { test, expect, type Page } from "@playwright/test";

// Helper to get all cells by absolute position (0-8)
// Board layout:
// 0 1 2
// 3 4 5
// 6 7 8
function getCell(page: Page, position: number) {
  const grid = page.getByRole("grid", { name: /tic-tac-toe board/i });
  return grid.getByRole("button").nth(position);
}

test.describe("Human vs Computer Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows player selector when HvC mode is selected", async ({ page }) => {
    // Click Human vs Computer
    await page.getByText("Human vs Computer").click();

    // Should show player selector
    await expect(page.getByText("Play as X")).toBeVisible();
    await expect(page.getByText("Play as O")).toBeVisible();

    // Should show difficulty selector
    await expect(page.getByText("Fun")).toBeVisible();
    await expect(page.getByText("God")).toBeVisible();
  });

  test("starts game with human as X (human goes first)", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Board should be visible
    await expect(
      page.getByRole("grid", { name: /tic-tac-toe board/i })
    ).toBeVisible();
    // Status should show X's turn (human)
    await expect(page.getByRole("status")).toHaveText("Player X's turn");

    // All cells should be empty initially
    await expect(
      page.getByRole("button", { name: "Empty cell" })
    ).toHaveCount(9);
  });

  test("human as X can make first move", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Human plays at center
    await getCell(page, 4).click();

    // Cell should have X
    await expect(getCell(page, 4)).toHaveText("X");
  });

  test("AI plays automatically after human move", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Human plays at center
    await getCell(page, 4).click();

    // Wait for AI to make a move (should see an O appear)
    await expect(
      page.getByRole("button", { name: "Cell contains O" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("starts game with human as O (AI goes first)", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as O").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for AI (X) to make the first move
    await expect(
      page.getByRole("button", { name: "Cell contains X" })
    ).toBeVisible({ timeout: 5000 });

    // Then it should be O's turn (human)
    await expect(page.getByRole("status")).toHaveText("Player O's turn");
  });

  test("human as O can make a move after AI", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as O").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Wait for AI (X) to make the first move
    await expect(
      page.getByRole("button", { name: "Cell contains X" })
    ).toBeVisible({ timeout: 5000 });

    // Human plays at an empty cell
    await page.getByRole("button", { name: "Empty cell" }).first().click();

    // Should see an O appear
    await expect(
      page.getByRole("button", { name: "Cell contains O" })
    ).toBeVisible();
  });

  test("difficulty selector shows Easy, Fun and God options", async ({
    page,
  }) => {
    await page.getByText("Human vs Computer").click();

    // Check all difficulty options
    const easyButton = page.getByRole("button", { name: "Easy" });
    const funButton = page.getByRole("button", { name: "Fun" });
    const godButton = page.getByRole("button", { name: "God" });

    await expect(easyButton).toBeVisible();
    await expect(funButton).toBeVisible();
    await expect(godButton).toBeVisible();

    // Click Easy to select it
    await easyButton.click();

    // Start game should still work
    await page.getByRole("button", { name: "Start Game" }).click();
    await expect(
      page.getByRole("grid", { name: /tic-tac-toe board/i })
    ).toBeVisible();
  });

  test("game can be completed with win or draw", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByText("Fun").click(); // Use fun mode for easier testing
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play until game ends - make moves and wait for AI response
    let gameEnded = false;
    let maxMoves = 9;

    while (!gameEnded && maxMoves > 0) {
      const status = await page.getByRole("status").textContent();

      if (status?.includes("wins") || status?.includes("draw")) {
        gameEnded = true;
        break;
      }

      // If it's X's turn (human), make a move
      if (status?.includes("X's turn")) {
        const emptyCells = page.getByRole("button", { name: "Empty cell" });
        const count = await emptyCells.count();
        if (count > 0) {
          await emptyCells.first().click();
        }
      }

      // Wait a bit for AI
      await page.waitForTimeout(500);
      maxMoves--;
    }

    // Game should have ended
    const finalStatus = await page.getByRole("status").textContent();
    expect(
      finalStatus?.includes("wins") || finalStatus?.includes("draw")
    ).toBeTruthy();
  });

  test("New Game button appears after game ends", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByText("Fun").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play until game ends
    let maxMoves = 9;
    while (maxMoves > 0) {
      const status = await page.getByRole("status").textContent();
      if (status?.includes("wins") || status?.includes("draw")) break;

      if (status?.includes("X's turn")) {
        const emptyCells = page.getByRole("button", { name: "Empty cell" });
        const count = await emptyCells.count();
        if (count > 0) {
          await emptyCells.first().click();
        }
      }
      await page.waitForTimeout(300);
      maxMoves--;
    }

    // New Game button should be visible
    await expect(
      page.getByRole("button", { name: "New Game" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("clicking New Game returns to setup screen", async ({ page }) => {
    await page.getByText("Human vs Computer").click();
    await page.getByText("Play as X").click();
    await page.getByText("Fun").click();
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play until game ends
    let maxMoves = 9;
    while (maxMoves > 0) {
      const status = await page.getByRole("status").textContent();
      if (status?.includes("wins") || status?.includes("draw")) break;

      if (status?.includes("X's turn")) {
        const emptyCells = page.getByRole("button", { name: "Empty cell" });
        const count = await emptyCells.count();
        if (count > 0) {
          await emptyCells.first().click();
        }
      }
      await page.waitForTimeout(300);
      maxMoves--;
    }

    // Click New Game
    await page.getByRole("button", { name: "New Game" }).click();

    // Should be back to setup
    await expect(page.getByText("Human vs Human")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start Game" })
    ).toBeVisible();
  });
});
