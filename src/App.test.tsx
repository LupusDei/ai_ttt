import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

describe('App', () => {
  describe('setup screen', () => {
    it('renders the game title', () => {
      render(<App />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tic-Tac-Toe');
    });

    it('shows setup screen initially', () => {
      render(<App />);
      expect(screen.getByText('Human vs Human')).toBeInTheDocument();
      expect(screen.getByText('Human vs Computer')).toBeInTheDocument();
      expect(screen.getByText('Computer vs Computer')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('shows player selector when HvC mode is selected', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Human vs Computer'));

      expect(screen.getByText('Play as:')).toBeInTheDocument();
      expect(screen.getByText('Play as X')).toBeInTheDocument();
      expect(screen.getByText('Play as O')).toBeInTheDocument();
    });

    it('shows difficulty selector when HvC mode is selected', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Human vs Computer'));

      expect(screen.getByText('AI Difficulty:')).toBeInTheDocument();
      expect(screen.getByText('Fun')).toBeInTheDocument();
      expect(screen.getByText('God')).toBeInTheDocument();
    });

    it('shows difficulty selector when CvC mode is selected', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Computer vs Computer'));

      expect(screen.getByText('AI Difficulty:')).toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('transitions from setup to playing when game starts', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Initially in setup - mode selector visible
      expect(screen.getByText('Human vs Human')).toBeInTheDocument();
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();

      await user.click(screen.getByText('Start Game'));

      // Now in playing - board visible, mode selector gone
      expect(screen.getByRole('grid', { name: /tic-tac-toe board/i })).toBeInTheDocument();
      expect(screen.queryByText('Human vs Human')).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    });

    it('transitions from playing to finished when game ends', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      // Playing state
      expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
      expect(screen.queryByText('New Game')).not.toBeInTheDocument();

      // Play to win
      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      // Finished state
      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
      expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('transitions from finished back to setup on new game', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      // Play to win
      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
      await user.click(cells[0]); // X
      await user.click(cells[3]); // O
      await user.click(cells[1]); // X
      await user.click(cells[4]); // O
      await user.click(cells[2]); // X wins

      // Click New Game
      await user.click(screen.getByText('New Game'));

      // Back to setup
      expect(screen.getByText('Human vs Human')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('HvH game flows', () => {
    it('plays a full HvH game to X win', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // X wins with top row
      await user.click(cells[0]); // X at (0,0)
      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");

      await user.click(cells[3]); // O at (1,0)
      expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");

      await user.click(cells[1]); // X at (0,1)
      await user.click(cells[4]); // O at (1,1)
      await user.click(cells[2]); // X at (0,2) - wins

      expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
      expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('plays a full HvH game to O win', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // O wins with first column
      await user.click(cells[4]); // X at center
      await user.click(cells[0]); // O at (0,0)
      await user.click(cells[1]); // X at (0,1)
      await user.click(cells[3]); // O at (1,0)
      await user.click(cells[2]); // X at (0,2)
      await user.click(cells[6]); // O at (2,0) - wins

      expect(screen.getByRole('status')).toHaveTextContent('Player O wins!');
    });

    it('plays a full HvH game to draw', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      // Play to draw:
      // X O X
      // X O O
      // O X X
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
      expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('prevents clicking on occupied cells', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByText('Start Game'));

      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

      await user.click(cells[0]); // X at (0,0)
      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");

      // Try to click same cell again
      await user.click(cells[0]);

      // Should still be O's turn (click was ignored)
      expect(screen.getByRole('status')).toHaveTextContent("Player O's turn");
    });
  });

  describe('HvC game flows', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('AI responds after human move in HvC mode (Fun difficulty)', () => {
      render(<App />);

      // Select HvC mode
      fireEvent.click(screen.getByText('Human vs Computer'));
      fireEvent.click(screen.getByText('Start Game'));

      // Human plays X (first)
      const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
      fireEvent.click(cells[4]); // X at center

      // Wait for AI response
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // AI should have made a move (O)
      const filledCells = screen.getAllByRole('button').filter((btn) => btn.textContent !== '');
      expect(filledCells.length).toBe(2); // X and O
    });

    it('AI plays first when human chooses O in HvC mode', () => {
      render(<App />);

      // Select HvC mode, choose to play as O
      fireEvent.click(screen.getByText('Human vs Computer'));
      fireEvent.click(screen.getByText('Play as O'));
      fireEvent.click(screen.getByText('Start Game'));

      // Wait for AI to make first move
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // AI should have made a move (X)
      const filledCells = screen.getAllByRole('button').filter((btn) => btn.textContent !== '');
      expect(filledCells.length).toBe(1);
      expect(filledCells[0]).toHaveTextContent('X');
    });

    it('allows selecting God difficulty', () => {
      render(<App />);

      fireEvent.click(screen.getByText('Human vs Computer'));
      fireEvent.click(screen.getByText('God'));
      fireEvent.click(screen.getByText('Start Game'));

      // Game should start successfully
      expect(screen.getByRole('grid', { name: /tic-tac-toe board/i })).toBeInTheDocument();
    });
  });

  describe('CvC game flows', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows pause button in CvC mode', () => {
      render(<App />);

      fireEvent.click(screen.getByText('Computer vs Computer'));
      fireEvent.click(screen.getByText('Start Game'));

      expect(screen.getByText('Pause')).toBeInTheDocument();
    });

    it('pauses and resumes AI play in CvC mode', () => {
      render(<App />);

      fireEvent.click(screen.getByText('Computer vs Computer'));
      fireEvent.click(screen.getByText('Start Game'));

      // Pause immediately
      fireEvent.click(screen.getByText('Pause'));
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Game Paused')).toBeInTheDocument();

      // Advance time - no moves should happen
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const filledWhilePaused = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent !== '' && btn.textContent !== 'Resume');
      expect(filledWhilePaused.length).toBe(0);

      // Resume
      fireEvent.click(screen.getByText('Resume'));
      expect(screen.getByText('Pause')).toBeInTheDocument();

      // Now AI should play
      act(() => {
        vi.advanceTimersByTime(600);
      });

      const filledAfterResume = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent === 'X' || btn.textContent === 'O');
      expect(filledAfterResume.length).toBeGreaterThan(0);
    });

    it('shows AI distinction in CvC mode', () => {
      render(<App />);

      fireEvent.click(screen.getByText('Computer vs Computer'));
      fireEvent.click(screen.getByText('Start Game'));

      // Should show AI vs AI indicator (use getAllByText since "AI X" appears in thinking message too)
      const aiXElements = screen.getAllByText(/AI X/);
      const aiOElements = screen.getAllByText(/AI O/);
      expect(aiXElements.length).toBeGreaterThanOrEqual(1);
      expect(aiOElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
