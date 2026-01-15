import type { AIStrategy } from './types.ts';
import type { BoardGrid, Player, Position } from '../core/types.ts';
import { getEmptyCells } from '../core/board.ts';

/**
 * Easy AI Strategy - makes frequent mistakes and is very beatable
 *
 * Logic:
 * - Always picks a random empty cell (no strategy at all)
 * - Never blocks, never looks for wins
 * - Perfect for beginners or just having fun
 */
export const easyStrategy: AIStrategy = {
  name: 'Easy AI',
  difficulty: 'easy',

  getMove(board: BoardGrid, _player: Player): Position {
    void _player; // Player parameter unused for easy AI (pure random)
    const emptyCells = getEmptyCells(board);

    if (emptyCells.length === 0) {
      throw new Error('No valid moves available');
    }

    // Always pick a random empty cell - no strategy
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  },
};
