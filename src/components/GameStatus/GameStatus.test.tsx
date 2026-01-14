import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GameStatus } from './GameStatus.tsx';

describe('GameStatus', () => {
  it('displays setup message when phase is setup', () => {
    render(<GameStatus currentPlayer="X" winner={null} phase="setup" />);

    expect(screen.getByRole('status')).toHaveTextContent(/configure your game/i);
  });

  it('displays current player turn when phase is playing', () => {
    render(<GameStatus currentPlayer="X" winner={null} phase="playing" />);

    expect(screen.getByRole('status')).toHaveTextContent(/player x's turn/i);
  });

  it('displays O turn when O is current player', () => {
    render(<GameStatus currentPlayer="O" winner={null} phase="playing" />);

    expect(screen.getByRole('status')).toHaveTextContent(/player o's turn/i);
  });

  it('displays winner message when X wins', () => {
    render(<GameStatus currentPlayer="X" winner="X" phase="finished" />);

    expect(screen.getByRole('status')).toHaveTextContent(/player x wins/i);
  });

  it('displays winner message when O wins', () => {
    render(<GameStatus currentPlayer="O" winner="O" phase="finished" />);

    expect(screen.getByRole('status')).toHaveTextContent(/player o wins/i);
  });

  it('displays draw message when game ends in draw', () => {
    render(<GameStatus currentPlayer="X" winner={null} phase="finished" />);

    expect(screen.getByRole('status')).toHaveTextContent(/draw/i);
  });

  it('has aria-live attribute for accessibility', () => {
    render(<GameStatus currentPlayer="X" winner={null} phase="playing" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
