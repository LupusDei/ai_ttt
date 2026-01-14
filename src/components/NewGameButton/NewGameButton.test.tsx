import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NewGameButton } from './NewGameButton.tsx';

describe('NewGameButton', () => {
  it('renders a button with "New Game" text', () => {
    render(<NewGameButton onClick={() => {}} />);

    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<NewGameButton onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: /new game/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick multiple times on multiple clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<NewGameButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /new game/i });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
