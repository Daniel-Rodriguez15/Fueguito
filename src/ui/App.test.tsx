import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AppDependencies } from './App'
import { App } from './App'

function createTestDeps(): AppDependencies {
  return {
    truthOrDare: {
      draw: (kind) => ({ kind, text: `sample ${kind}` }),
    },
    random: () => 0.5,
  }
}

describe('App', () => {
  it('renders the home screen with the app title', () => {
    render(<App deps={createTestDeps()} />)
    expect(screen.getByRole('heading', { name: 'Fueguito' })).toBeInTheDocument()
  })

  it('lists the three games on the home screen', () => {
    render(<App deps={createTestDeps()} />)
    expect(screen.getByRole('button', { name: /Verdad o Reto/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pico Botella/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Dados/ })).toBeInTheDocument()
  })

  it('navigates to a game and back home', async () => {
    const user = userEvent.setup()
    render(<App deps={createTestDeps()} />)

    await user.click(screen.getByRole('button', { name: /Verdad o Reto/ }))
    expect(screen.getByRole('heading', { name: 'Verdad o Reto' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '← Volver' }))
    expect(screen.getByRole('heading', { name: 'Fueguito' })).toBeInTheDocument()
  })
})
