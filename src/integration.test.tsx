import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

/**
 * Integration tests for the complete Tic-Tac-Toe application.
 * These tests verify the interaction between components and game logic.
 *
 * Note: AI timing tests are covered in useGame.test.ts with fake timers.
 * These tests focus on UI integration without timing dependencies.
 */
describe('Integration Tests', () => {
  describe('Human vs Human Mode', () => {
    it('plays a complete game where X wins', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start HvH game
      await user.click(screen.getByText('Start Game'));

      // Get all cells
      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with top row: X(0,0), O(1,0), X(0,1), O(1,1), X(0,2)
      await user.click(cells[0]); // X at (0,0)
      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");

      await user.click(cells[3]); // O at (1,0)
      expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");

      await user.click(cells[1]); // X at (0,1)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[2]); // X at (0,2) - wins

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('plays a complete game where O wins', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // O wins with middle row: X(0,0), O(1,0), X(0,1), O(1,1), X(2,2), O(1,2)
      await user.click(cells[0]); // X at (0,0)
      await user.click(cells[3]); // O at (1,0)
      await user.click(cells[1]); // X at (0,1)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[8]); // X at (2,2)
      await user.click(cells[5]); // O at (1,2) - wins

      expect(screen.getByRole('status')).toHaveTextContent('Player O wins!');
    });

    it('plays a complete game resulting in a draw', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Draw game pattern
      await user.click(cells[0]); // X at (0,0)
      await user.click(cells[1]); // O at (0,1)
      await user.click(cells[2]); // X at (0,2)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[3]); // X at (1,0)
      await user.click(cells[5]); // O at (1,2)
      await user.click(cells[7]); // X at (2,1)
      await user.click(cells[6]); // O at (2,0)
      await user.click(cells[8]); // X at (2,2) - draw

      expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    });

    it('prevents clicking occupied cells', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      await user.click(cells[0]); // X at (0,0)
      expect(cells[0]).toHaveTextContent('X');

      // Try clicking the same cell - should remain X and stay O's turn
      await user.click(cells[0]);
      expect(cells[0]).toHaveTextContent('X');
      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    });

    it('allows starting new game after win', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Quick X win
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      expect(screen.getByText('Player X wins!')).toBeInTheDocument();

      // Start new game
      await user.click(screen.getByText('New Game'));

      // Should be back to setup
      expect(screen.getByText('Human vs Human')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('disables cells after game ends', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Quick X win
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      // Try clicking an empty cell after game ends
      await user.click(cells[6]);

      // Cell should still be empty
      expect(cells[6]).toHaveTextContent('');
    });
  });

  describe('Mode Selection', () => {
    it('shows player selector only for HvC mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      // HvH mode - no player selector
      expect(screen.queryByText('Play as:')).not.toBeInTheDocument();

      // Switch to HvC mode
      await user.click(screen.getByText('Human vs Computer'));
      expect(screen.getByText('Play as:')).toBeInTheDocument();

      // Switch to CvC mode - no player selector
      await user.click(screen.getByText('Computer vs Computer'));
      expect(screen.queryByText('Play as:')).not.toBeInTheDocument();
    });

    it('shows difficulty selector for HvC and CvC modes', async () => {
      const user = userEvent.setup();
      render(<App />);

      // HvH mode - no difficulty selector
      expect(screen.queryByText('AI Difficulty:')).not.toBeInTheDocument();

      // Switch to HvC mode
      await user.click(screen.getByText('Human vs Computer'));
      expect(screen.getByText('AI Difficulty:')).toBeInTheDocument();

      // Switch to CvC mode - still has difficulty selector
      await user.click(screen.getByText('Computer vs Computer'));
      expect(screen.getByText('AI Difficulty:')).toBeInTheDocument();

      // Switch back to HvH mode - no difficulty selector
      await user.click(screen.getByText('Human vs Human'));
      expect(screen.queryByText('AI Difficulty:')).not.toBeInTheDocument();
    });

    it('allows selecting player in HvC mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Human vs Computer'));

      // Default is X
      expect(screen.getByText('Play as X')).toHaveAttribute('aria-pressed', 'true');

      // Select O
      await user.click(screen.getByText('Play as O'));
      expect(screen.getByText('Play as O')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText('Play as X')).toHaveAttribute('aria-pressed', 'false');
    });

    it('allows selecting difficulty', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Human vs Computer'));

      // Default is Fun
      expect(screen.getByText('Fun')).toHaveAttribute('aria-pressed', 'true');

      // Select God
      await user.click(screen.getByText('God'));
      expect(screen.getByText('God')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText('Fun')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Board Rendering', () => {
    it('renders 9 cells in HvH mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const grid = screen.getByRole('grid', { name: /tic-tac-toe board/i });
      expect(grid).toBeInTheDocument();

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
      expect(cells.length).toBe(9);
    });

    it('alternates X and O on consecutive clicks', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      await user.click(cells[0]);
      expect(cells[0]).toHaveTextContent('X');

      await user.click(cells[1]);
      expect(cells[1]).toHaveTextContent('O');

      await user.click(cells[2]);
      expect(cells[2]).toHaveTextContent('X');
    });
  });

  describe('Winning Line Highlighting', () => {
    it('highlights winning cells when game is won', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with top row
      await user.click(cells[0]); // X at (0,0)
      await user.click(cells[3]); // O at (1,0)
      await user.click(cells[1]); // X at (0,1)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[2]); // X at (0,2) - wins

      // Check that winning cells have winning styling
      const allCells = screen.getAllByRole('button').filter(
        (btn) => btn.textContent === 'X' || btn.textContent === 'O' || btn.textContent === ''
      );

      // First three cells (top row) should have winning class
      const winningCells = allCells.filter((cell) =>
        cell.className.includes('bg-green') || cell.className.includes('winning')
      );

      expect(winningCells.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Core Functions Integration', () => {
    it('correctly detects and displays row win via getGameResult', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with middle row (row 1)
      await user.click(cells[3]); // X at (1,0)
      await user.click(cells[0]); // O at (0,0)
      await user.click(cells[4]); // X at (1,1)
      await user.click(cells[1]); // O at (0,1)
      await user.click(cells[5]); // X at (1,2) - row 1 win

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('correctly detects and displays column win via getGameResult', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with left column (col 0)
      await user.click(cells[0]); // X at (0,0)
      await user.click(cells[1]); // O at (0,1)
      await user.click(cells[3]); // X at (1,0)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[6]); // X at (2,0) - col 0 win

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('correctly detects and displays main diagonal win via getGameResult', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with main diagonal
      await user.click(cells[0]); // X at (0,0)
      await user.click(cells[1]); // O at (0,1)
      await user.click(cells[4]); // X at (1,1)
      await user.click(cells[2]); // O at (0,2)
      await user.click(cells[8]); // X at (2,2) - diagonal win

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('correctly detects and displays anti-diagonal win via getGameResult', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with anti-diagonal
      await user.click(cells[2]); // X at (0,2)
      await user.click(cells[0]); // O at (0,0)
      await user.click(cells[4]); // X at (1,1)
      await user.click(cells[1]); // O at (0,1)
      await user.click(cells[6]); // X at (2,0) - anti-diagonal win

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('correctly uses setCell to update board immutably', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Make some moves and verify the board updates correctly
      await user.click(cells[0]); // X at (0,0)
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[1]).toHaveTextContent('');

      await user.click(cells[1]); // O at (0,1)
      expect(cells[0]).toHaveTextContent('X'); // Previous cell unchanged
      expect(cells[1]).toHaveTextContent('O');

      await user.click(cells[4]); // X at (1,1)
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[1]).toHaveTextContent('O');
      expect(cells[4]).toHaveTextContent('X');
    });

    it('correctly uses getEmptyCells to determine available moves', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Fill 8 cells to near-full board
      await user.click(cells[0]); // X
      await user.click(cells[1]); // O
      await user.click(cells[2]); // X
      await user.click(cells[4]); // O
      await user.click(cells[3]); // X
      await user.click(cells[5]); // O
      await user.click(cells[7]); // X
      await user.click(cells[6]); // O

      // 8 cells filled, only cell 8 should be empty
      expect(cells[8]).toHaveTextContent('');

      // Final move should end game
      await user.click(cells[8]); // X - this should be a draw
      expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    });

    it('correctly integrates checkWinner to stop game after win', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins quickly
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      // Verify game is stopped - clicking should not change anything
      const emptyCell = cells[6];
      await user.click(emptyCell);
      expect(emptyCell).toHaveTextContent('');

      // Status should still show X wins
      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });
  });

  describe('Game Status Display', () => {
    it('shows setup message initially', () => {
      render(<App />);
      // Setup phase shows mode selection, not status
      expect(screen.getByText('Human vs Human')).toBeInTheDocument();
    });

    it('shows current player turn during game', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
      await user.click(cells[0]);

      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    });

    it('shows winner message when game ends', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('shows draw message when game ends in draw', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Draw game
      await user.click(cells[0]); // X
      await user.click(cells[1]); // O
      await user.click(cells[2]); // X
      await user.click(cells[4]); // O
      await user.click(cells[3]); // X
      await user.click(cells[5]); // O
      await user.click(cells[7]); // X
      await user.click(cells[6]); // O
      await user.click(cells[8]); // X - draw

      expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    });
  });
});
