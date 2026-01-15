import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
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

  it('starts a game when Start Game is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Start Game'));

    // Should show the board
    expect(screen.getByRole('grid', { name: /tic-tac-toe board/i })).toBeInTheDocument();
    // Should show game status
    expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
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

  it('plays a full HvH game to win', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start game
    await user.click(screen.getByText('Start Game'));

    // Get all cells
    const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');

    // Play X wins with top row: X at (0,0), O at (1,0), X at (0,1), O at (1,1), X at (0,2)
    await user.click(cells[0]); // X at (0,0)
    await user.click(cells[3]); // O at (1,0)
    await user.click(cells[1]); // X at (0,1)
    await user.click(cells[4]); // O at (1,1)
    await user.click(cells[2]); // X at (0,2) - wins

    // Check winner display
    expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');

    // New Game button should appear
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('resets game when New Game is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start game
    await user.click(screen.getByText('Start Game'));

    // Get all cells and play to win
    const cells = screen.getAllByRole('button').filter((btn) => btn.textContent === '');
    await user.click(cells[0]); // X at (0,0)
    await user.click(cells[3]); // O at (1,0)
    await user.click(cells[1]); // X at (0,1)
    await user.click(cells[4]); // O at (1,1)
    await user.click(cells[2]); // X at (0,2) - wins

    // Click New Game
    await user.click(screen.getByText('New Game'));

    // Should be back to setup screen
    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('Human vs Human')).toBeInTheDocument();
  });
});
