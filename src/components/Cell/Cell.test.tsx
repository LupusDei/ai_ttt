import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Cell } from './Cell';

describe('Cell', () => {
  it('renders X value', () => {
    render(<Cell value="X" onClick={() => {}} row={0} col={0} />);
    expect(screen.getByRole('button')).toHaveTextContent('X');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Row 1, Column 1: contains X');
  });

  it('renders O value', () => {
    render(<Cell value="O" onClick={() => {}} row={1} col={2} />);
    expect(screen.getByRole('button')).toHaveTextContent('O');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Row 2, Column 3: contains O');
  });

  it('renders empty cell', () => {
    render(<Cell value={null} onClick={() => {}} row={0} col={1} />);
    expect(screen.getByRole('button')).toHaveTextContent('');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Row 1, Column 2: empty');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Cell value={null} onClick={handleClick} row={0} col={0} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Cell value={null} onClick={handleClick} disabled row={0} col={0} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled state styling', () => {
    render(<Cell value={null} onClick={() => {}} disabled row={0} col={0} />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed');
  });

  it('applies winning state styling', () => {
    render(<Cell value="X" onClick={() => {}} isWinning row={0} col={0} />);
    expect(screen.getByRole('button')).toHaveClass('bg-green-900');
    expect(screen.getByRole('button')).toHaveClass('border-green-500');
  });

  it('applies X color styling', () => {
    render(<Cell value="X" onClick={() => {}} row={0} col={0} />);
    expect(screen.getByRole('button')).toHaveClass('text-blue-400');
  });

  it('applies O color styling', () => {
    render(<Cell value="O" onClick={() => {}} row={0} col={0} />);
    expect(screen.getByRole('button')).toHaveClass('text-red-400');
  });

  it('applies pop-in animation to value', () => {
    render(<Cell value="X" onClick={() => {}} row={0} col={0} />);
    const span = screen.getByText('X');
    expect(span).toHaveClass('animate-pop-in');
  });

  it('applies pulse-win animation to winning cells', () => {
    render(<Cell value="X" onClick={() => {}} isWinning row={0} col={0} />);
    expect(screen.getByRole('button')).toHaveClass('animate-pulse-win');
  });

  it('includes winning state in aria-label', () => {
    render(<Cell value="X" onClick={() => {}} isWinning row={2} col={2} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Row 3, Column 3: contains X, winning cell');
  });
});
