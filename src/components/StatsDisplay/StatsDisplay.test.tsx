import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatsDisplay } from './StatsDisplay.tsx';

describe('StatsDisplay', () => {
  const defaultStats = { wins: 0, losses: 0, draws: 0 };
  const mockOnReset = vi.fn();

  it('displays wins count', () => {
    render(<StatsDisplay stats={{ wins: 5, losses: 0, draws: 0 }} onReset={mockOnReset} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Wins')).toBeInTheDocument();
  });

  it('displays losses count', () => {
    render(<StatsDisplay stats={{ wins: 0, losses: 3, draws: 0 }} onReset={mockOnReset} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Losses')).toBeInTheDocument();
  });

  it('displays draws count', () => {
    render(<StatsDisplay stats={{ wins: 0, losses: 0, draws: 2 }} onReset={mockOnReset} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Draws')).toBeInTheDocument();
  });

  it('displays all stats together', () => {
    render(<StatsDisplay stats={{ wins: 10, losses: 5, draws: 3 }} onReset={mockOnReset} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides reset button when no games played', () => {
    render(<StatsDisplay stats={defaultStats} onReset={mockOnReset} />);

    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  it('shows reset button when games have been played', () => {
    render(<StatsDisplay stats={{ wins: 1, losses: 0, draws: 0 }} onReset={mockOnReset} />);

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<StatsDisplay stats={{ wins: 1, losses: 0, draws: 0 }} onReset={mockOnReset} />);

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
