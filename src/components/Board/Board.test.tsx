import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Board } from './Board';
import type { BoardGrid } from '../../core/types';

const emptyBoard: BoardGrid = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const partialBoard: BoardGrid = [
  ['X', 'O', null],
  [null, 'X', null],
  [null, null, 'O'],
];

describe('Board', () => {
  it('renders a 3x3 grid of cells', () => {
    render(<Board board={emptyBoard} onCellClick={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
  });

  it('renders cell values correctly', () => {
    render(<Board board={partialBoard} onCellClick={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('X');
    expect(buttons[1]).toHaveTextContent('O');
    expect(buttons[2]).toHaveTextContent('');
    expect(buttons[4]).toHaveTextContent('X');
    expect(buttons[8]).toHaveTextContent('O');
  });

  it('calls onCellClick with correct row and column', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Board board={emptyBoard} onCellClick={handleClick} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // Row 0, Col 0
    expect(handleClick).toHaveBeenCalledWith(0, 0);

    await user.click(buttons[4]); // Row 1, Col 1
    expect(handleClick).toHaveBeenCalledWith(1, 1);

    await user.click(buttons[8]); // Row 2, Col 2
    expect(handleClick).toHaveBeenCalledWith(2, 2);
  });

  it('disables cells that are already occupied', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Board board={partialBoard} onCellClick={handleClick} />);

    const buttons = screen.getAllByRole('button');
    // Cell at [0,0] has 'X' - should be disabled
    await user.click(buttons[0]);
    expect(handleClick).not.toHaveBeenCalled();

    // Cell at [0,2] is empty - should be clickable
    await user.click(buttons[2]);
    expect(handleClick).toHaveBeenCalledWith(0, 2);
  });

  it('disables all cells when disabled prop is true', () => {
    render(<Board board={emptyBoard} onCellClick={() => {}} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('highlights winning cells', () => {
    const winningLine = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ];
    render(<Board board={partialBoard} onCellClick={() => {}} winningLine={winningLine} />);

    const buttons = screen.getAllByRole('button');
    // Winning cells should have green styling
    expect(buttons[0]).toHaveClass('bg-green-900');
    expect(buttons[4]).toHaveClass('bg-green-900');
    expect(buttons[8]).toHaveClass('bg-green-900');

    // Non-winning cells should not have green styling
    expect(buttons[1]).not.toHaveClass('bg-green-900');
    expect(buttons[2]).not.toHaveClass('bg-green-900');
  });

  it('has accessible grid role', () => {
    render(<Board board={emptyBoard} onCellClick={() => {}} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByLabelText('Tic-tac-toe board')).toBeInTheDocument();
  });
});
