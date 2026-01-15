import type { AIStrategy } from './types.ts';
import type { Board, Player, Position } from '../core/types.ts';
import { getEmptyCells, setCell, checkWinner } from '../core/board.ts';

/**
 * Finds a winning move for the given player if one exists
 */
function findWinningMove(board: Board, player: Player): Position | null {
  const emptyCells = getEmptyCells(board);

  for (const pos of emptyCells) {
    const testBoard = setCell(board, pos, player);
    if (checkWinner(testBoard) === player) {
      return pos;
    }
  }

  return null;
}

/**
 * Fun AI Strategy - beatable AI that makes basic moves
 *
 * Logic:
 * 1. Take immediate win if available
 * 2. Block opponent's immediate win
 * 3. Otherwise pick a random empty cell
 */
export const funStrategy: AIStrategy = {
  name: 'Fun AI',
  difficulty: 'fun',

  getMove(board: Board, player: Player): Position {
    const emptyCells = getEmptyCells(board);

    if (emptyCells.length === 0) {
      throw new Error('No valid moves available');
    }

    // 1. Check for immediate win
    const winningMove = findWinningMove(board, player);
    if (winningMove) {
      return winningMove;
    }

    // 2. Block opponent's winning move
    const opponent: Player = player === 'X' ? 'O' : 'X';
    const blockingMove = findWinningMove(board, opponent);
    if (blockingMove) {
      return blockingMove;
    }

    // 3. Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  },
};
