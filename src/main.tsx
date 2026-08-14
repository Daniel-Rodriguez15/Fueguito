import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTruthOrDareGame } from '@/application/truth-or-dare-game'
import { createStaticPromptRepository } from '@/infrastructure/static-prompt-repository'
import { App, type AppDependencies } from './ui/App'

const random = Math.random
const deps: AppDependencies = {
  truthOrDare: createTruthOrDareGame(createStaticPromptRepository(), random),
  random,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App deps={deps} />
  </StrictMode>,
)
