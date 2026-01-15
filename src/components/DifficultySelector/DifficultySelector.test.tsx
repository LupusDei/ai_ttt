import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DifficultySelector } from './DifficultySelector.tsx';

describe('DifficultySelector', () => {
  it('renders all difficulty options', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fun/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /god/i })).toBeInTheDocument();
  });

  it('shows Easy as selected when value is easy', () => {
    render(<DifficultySelector value="easy" onChange={() => {}} />);

    const easyButton = screen.getByRole('button', { name: /easy/i });
    const funButton = screen.getByRole('button', { name: /fun/i });
    const godButton = screen.getByRole('button', { name: /god/i });

    expect(easyButton).toHaveAttribute('aria-pressed', 'true');
    expect(funButton).toHaveAttribute('aria-pressed', 'false');
    expect(godButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows Fun as selected when value is fun', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    const easyButton = screen.getByRole('button', { name: /easy/i });
    const funButton = screen.getByRole('button', { name: /fun/i });
    const godButton = screen.getByRole('button', { name: /god/i });

    expect(easyButton).toHaveAttribute('aria-pressed', 'false');
    expect(funButton).toHaveAttribute('aria-pressed', 'true');
    expect(godButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows God as selected when value is god', () => {
    render(<DifficultySelector value="god" onChange={() => {}} />);

    const easyButton = screen.getByRole('button', { name: /easy/i });
    const funButton = screen.getByRole('button', { name: /fun/i });
    const godButton = screen.getByRole('button', { name: /god/i });

    expect(easyButton).toHaveAttribute('aria-pressed', 'false');
    expect(funButton).toHaveAttribute('aria-pressed', 'false');
    expect(godButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange with easy when Easy button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DifficultySelector value="fun" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /easy/i }));

    expect(handleChange).toHaveBeenCalledWith('easy');
  });

  it('calls onChange with fun when Fun button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DifficultySelector value="god" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /fun/i }));

    expect(handleChange).toHaveBeenCalledWith('fun');
  });

  it('calls onChange with god when God button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DifficultySelector value="fun" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /god/i }));

    expect(handleChange).toHaveBeenCalledWith('god');
  });

  it('displays description for easy difficulty', () => {
    render(<DifficultySelector value="easy" onChange={() => {}} />);

    expect(screen.getByText(/random moves/i)).toBeInTheDocument();
  });

  it('displays description for fun difficulty', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    expect(screen.getByText(/blocks and wins/i)).toBeInTheDocument();
  });

  it('displays description for god difficulty', () => {
    render(<DifficultySelector value="god" onChange={() => {}} />);

    expect(screen.getByText(/unbeatable perfect play/i)).toBeInTheDocument();
  });
});
