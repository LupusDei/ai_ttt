// AI logic exports
export type { AIStrategy, AIDifficultyLevel } from './types.ts';
export { funStrategy } from './fun.ts';
export { godStrategy } from './god.ts';

import type { AIStrategy, AIDifficultyLevel } from './types.ts';
import { funStrategy } from './fun.ts';
import { godStrategy } from './god.ts';

/**
 * Factory function to get an AI strategy by difficulty level
 */
export function getStrategy(difficulty: AIDifficultyLevel): AIStrategy {
  switch (difficulty) {
    case 'fun':
      return funStrategy;
    case 'god':
      return godStrategy;
    default: {
      const _exhaustive: never = difficulty;
      throw new Error(`Unknown difficulty: ${String(_exhaustive)}`);
    }
  }
}
