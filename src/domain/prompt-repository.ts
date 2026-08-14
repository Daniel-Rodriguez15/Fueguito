import type { Prompt } from './truth-or-dare'

/** Port: where game prompts come from. Implemented in infrastructure. */
export interface PromptRepository {
  getPrompts(): readonly Prompt[]
}
