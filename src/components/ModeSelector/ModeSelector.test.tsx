import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ModeSelector } from './ModeSelector.tsx';

describe('ModeSelector', () => {
  it('renders all three mode buttons', () => {
    const onChange = vi.fn();
    render(<ModeSelector value="hvh" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Human vs Human' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Human vs Computer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Computer vs Computer' })).toBeInTheDocument();
  });

  it('highlights the currently selected mode', () => {
    const onChange = vi.fn();
    render(<ModeSelector value="hvc" onChange={onChange} />);

    const hvcButton = screen.getByRole('button', { name: 'Human vs Computer' });
    const hvhButton = screen.getByRole('button', { name: 'Human vs Human' });

    expect(hvcButton).toHaveClass('bg-blue-600');
    expect(hvhButton).toHaveClass('bg-gray-200');
  });

  it('calls onChange when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ModeSelector value="hvh" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Human vs Computer' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hvc');
  });

  it('calls onChange with cvc when Computer vs Computer is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ModeSelector value="hvh" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Computer vs Computer' }));

    expect(onChange).toHaveBeenCalledWith('cvc');
  });

  it('calls onChange with hvh when Human vs Human is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ModeSelector value="cvc" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Human vs Human' }));

    expect(onChange).toHaveBeenCalledWith('hvh');
  });

  it('updates visual state when value prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(<ModeSelector value="hvh" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Human vs Human' })).toHaveClass('bg-blue-600');

    rerender(<ModeSelector value="cvc" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Human vs Human' })).toHaveClass('bg-gray-200');
    expect(screen.getByRole('button', { name: 'Computer vs Computer' })).toHaveClass('bg-blue-600');
  });
});
