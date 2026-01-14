import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PlayerSelector } from './PlayerSelector.tsx';

describe('PlayerSelector', () => {
  it('renders both player options', () => {
    render(<PlayerSelector value="X" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: /play as x/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play as o/i })).toBeInTheDocument();
  });

  it('shows X as selected when value is X', () => {
    render(<PlayerSelector value="X" onChange={() => {}} />);

    const xButton = screen.getByRole('button', { name: /play as x/i });
    const oButton = screen.getByRole('button', { name: /play as o/i });

    expect(xButton).toHaveAttribute('aria-pressed', 'true');
    expect(oButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows O as selected when value is O', () => {
    render(<PlayerSelector value="O" onChange={() => {}} />);

    const xButton = screen.getByRole('button', { name: /play as x/i });
    const oButton = screen.getByRole('button', { name: /play as o/i });

    expect(xButton).toHaveAttribute('aria-pressed', 'false');
    expect(oButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange with X when X button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PlayerSelector value="O" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /play as x/i }));

    expect(handleChange).toHaveBeenCalledWith('X');
  });

  it('calls onChange with O when O button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PlayerSelector value="X" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /play as o/i }));

    expect(handleChange).toHaveBeenCalledWith('O');
  });

  it('displays note about X going first', () => {
    render(<PlayerSelector value="X" onChange={() => {}} />);

    expect(screen.getByText(/x always goes first/i)).toBeInTheDocument();
  });
});
