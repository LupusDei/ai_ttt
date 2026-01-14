import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DifficultySelector } from './DifficultySelector.tsx';

describe('DifficultySelector', () => {
  it('renders both difficulty options', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: /fun/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /god/i })).toBeInTheDocument();
  });

  it('shows Fun as selected when value is fun', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    const funButton = screen.getByRole('button', { name: /fun/i });
    const godButton = screen.getByRole('button', { name: /god/i });

    expect(funButton).toHaveAttribute('aria-pressed', 'true');
    expect(godButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows God as selected when value is god', () => {
    render(<DifficultySelector value="god" onChange={() => {}} />);

    const funButton = screen.getByRole('button', { name: /fun/i });
    const godButton = screen.getByRole('button', { name: /god/i });

    expect(funButton).toHaveAttribute('aria-pressed', 'false');
    expect(godButton).toHaveAttribute('aria-pressed', 'true');
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

  it('displays description for fun difficulty', () => {
    render(<DifficultySelector value="fun" onChange={() => {}} />);

    expect(screen.getByText(/beatable ai that makes mistakes/i)).toBeInTheDocument();
  });

  it('displays description for god difficulty', () => {
    render(<DifficultySelector value="god" onChange={() => {}} />);

    expect(screen.getByText(/unbeatable perfect play/i)).toBeInTheDocument();
  });
});
