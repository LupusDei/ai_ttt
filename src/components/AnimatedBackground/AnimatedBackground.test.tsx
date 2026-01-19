import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedBackground } from './AnimatedBackground';

describe('AnimatedBackground', () => {
  it('renders without crashing', () => {
    render(<AnimatedBackground />);

    expect(screen.getByTestId('animated-background')).toBeInTheDocument();
  });

  it('has aria-hidden for accessibility', () => {
    render(<AnimatedBackground />);

    expect(screen.getByTestId('animated-background')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('renders animated gradient element', () => {
    render(<AnimatedBackground />);

    expect(screen.getByTestId('animated-gradient')).toBeInTheDocument();
  });

  it('renders gradient overlay element', () => {
    render(<AnimatedBackground />);

    expect(screen.getByTestId('gradient-overlay')).toBeInTheDocument();
  });

  it('renders particles container', () => {
    render(<AnimatedBackground />);

    expect(screen.getByTestId('particles-container')).toBeInTheDocument();
  });

  it('renders multiple particles', () => {
    render(<AnimatedBackground />);

    const particles = screen.getAllByTestId('particle');
    expect(particles.length).toBeGreaterThan(0);
  });
});
