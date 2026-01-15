// AI logic exports
export type { AIStrategy } from './types.ts';
export { easyStrategy } from './easy.ts';
export { funStrategy } from './fun.ts';
export { godStrategy } from './god.ts';

import type { AIDifficulty } from '../core/types.ts';
import type { AIStrategy } from './types.ts';
import { easyStrategy } from './easy.ts';
import { funStrategy } from './fun.ts';
import { godStrategy } from './god.ts';

/**
 * Factory function to get an AI strategy by difficulty level
 */
export function getStrategy(difficulty: AIDifficulty): AIStrategy {
  switch (difficulty) {
    case 'easy':
      return easyStrategy;
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
