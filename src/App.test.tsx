import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite + React')
  })

  it('increments counter on button click', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 0')

    await user.click(button)
    expect(button).toHaveTextContent('count is 1')

    await user.click(button)
    expect(button).toHaveTextContent('count is 2')
  })
})
