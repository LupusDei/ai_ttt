import { test, expect, type Page } from "@playwright/test";

// Helper to get all cells by absolute position (0-8)
// Board layout:
// 0 1 2
// 3 4 5
// 6 7 8
function getCell(page: Page, position: number) {
  const grid = page.getByRole("grid", { name: /tic-tac-toe game board/i });
  return grid.getByRole("button").nth(position);
}

test.describe("Human vs Human Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays game title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Tic-Tac-Toe"
    );
  });

  test("shows setup screen with mode options", async ({ page }) => {
    await expect(page.getByText("Human vs Human")).toBeVisible();
    await expect(page.getByText("Human vs Computer")).toBeVisible();
    await expect(page.getByText("Computer vs Computer")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Game" })).toBeVisible();
  });

  test("starts a game when clicking Start Game", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Board should be visible
    await expect(page.getByRole("grid", { name: /tic-tac-toe game board/i })).toBeVisible();
    // Status should show X's turn
    await expect(page.getByRole("status")).toHaveText("Player X's turn");
  });

  test("places X on first click", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    await getCell(page, 0).click();

    // First cell should have X
    await expect(getCell(page, 0)).toHaveText("X");
    // Turn should switch to O
    await expect(page.getByRole("status")).toHaveText("Player O's turn");
  });

  test("alternates between X and O", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // X plays at position 0
    await getCell(page, 0).click();
    await expect(page.getByRole("button", { name: /contains X/ })).toHaveCount(1);

    // O plays at position 1
    await getCell(page, 1).click();
    await expect(page.getByRole("button", { name: /contains O/ })).toHaveCount(1);
  });

  test("X wins with top row", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play winning sequence for X on top row (0, 1, 2)
    // X at 0, O at 3, X at 1, O at 4, X at 2 - wins
    await getCell(page, 0).click(); // X at 0
    await getCell(page, 3).click(); // O at 3
    await getCell(page, 1).click(); // X at 1
    await getCell(page, 4).click(); // O at 4
    await getCell(page, 2).click(); // X at 2 - wins

    await expect(page.getByRole("status")).toHaveText("Player X wins!");
    await expect(page.getByRole("button", { name: "New Game" })).toBeVisible();
  });

  test("O wins with diagonal", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play winning sequence for O on diagonal (0, 4, 8)
    // X at 1, O at 0, X at 2, O at 4, X at 6, O at 8 - wins
    await getCell(page, 1).click(); // X at 1
    await getCell(page, 0).click(); // O at 0
    await getCell(page, 2).click(); // X at 2
    await getCell(page, 4).click(); // O at 4
    await getCell(page, 6).click(); // X at 6
    await getCell(page, 8).click(); // O at 8 - wins

    await expect(page.getByRole("status")).toHaveText("Player O wins!");
  });

  test("detects draw", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Play draw game - final board:
    // X X O
    // O O X
    // X O X
    await getCell(page, 0).click(); // X at 0
    await getCell(page, 4).click(); // O at 4 (center)
    await getCell(page, 8).click(); // X at 8 (opposite corner)
    await getCell(page, 2).click(); // O at 2 (block X diagonal)
    await getCell(page, 6).click(); // X at 6 (corner)
    await getCell(page, 3).click(); // O at 3 (block X column)
    await getCell(page, 5).click(); // X at 5
    await getCell(page, 7).click(); // O at 7 (block X)
    await getCell(page, 1).click(); // X at 1 (last cell)

    await expect(page.getByRole("status")).toHaveText("It's a draw!");
  });

  test("prevents clicking occupied cells", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Click first cell - X
    await getCell(page, 0).click();
    await expect(page.getByRole("status")).toHaveText("Player O's turn");

    // Try clicking same cell (now has X) - should not change turn
    // Use force: true since the cell is disabled
    await getCell(page, 0).click({ force: true });
    await expect(page.getByRole("status")).toHaveText("Player O's turn");
  });

  test("resets game on New Game click after win", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Quick X win on top row (0, 1, 2)
    await getCell(page, 0).click(); // X at 0
    await getCell(page, 3).click(); // O at 3
    await getCell(page, 1).click(); // X at 1
    await getCell(page, 4).click(); // O at 4
    await getCell(page, 2).click(); // X at 2 - wins

    await expect(page.getByRole("status")).toHaveText("Player X wins!");

    // Click New Game
    await page.getByRole("button", { name: "New Game" }).click();

    // Should be back to setup
    await expect(page.getByText("Human vs Human")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Game" })).toBeVisible();
  });

  test("disables cells after game ends", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // Quick X win on top row (0, 1, 2)
    await getCell(page, 0).click(); // X at 0
    await getCell(page, 3).click(); // O at 3
    await getCell(page, 1).click(); // X at 1
    await getCell(page, 4).click(); // O at 4
    await getCell(page, 2).click(); // X at 2 - wins

    // Count empty cells after game
    const emptyCellsAfterWin = await page.getByRole("button", { name: /: empty/ }).count();

    // Try clicking empty cell after game ends - should not add marks
    // Use force: true since cells are disabled after game ends
    if (emptyCellsAfterWin > 0) {
      await getCell(page, 5).click({ force: true }); // Try to click an empty cell
      // Count should remain the same
      await expect(page.getByRole("button", { name: /: empty/ })).toHaveCount(emptyCellsAfterWin);
    }
  });

  test("shows winning cells with highlight", async ({ page }) => {
    await page.getByRole("button", { name: "Start Game" }).click();

    // X wins with top row (positions 0, 1, 2)
    await getCell(page, 0).click(); // X at 0
    await getCell(page, 3).click(); // O at 3
    await getCell(page, 1).click(); // X at 1
    await getCell(page, 4).click(); // O at 4
    await getCell(page, 2).click(); // X at 2 - wins

    // Winning cells (positions 0, 1, 2) should have green styling
    await expect(getCell(page, 0)).toHaveClass(/bg-green/);
    await expect(getCell(page, 1)).toHaveClass(/bg-green/);
    await expect(getCell(page, 2)).toHaveClass(/bg-green/);
  });
});
