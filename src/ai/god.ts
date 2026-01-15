import type { AIStrategy } from './types.ts';
import type { Board, Player, Position } from '../core/types.ts';
import { getEmptyCells, setCell, checkWinner, isDraw } from '../core/board.ts';

/**
 * Minimax algorithm with alpha-beta pruning
 * Returns the score of the board state for the maximizing player
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player
): number {
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';
  const winner = checkWinner(board);

  // Terminal states
  if (winner === aiPlayer) {
    return 10 - depth; // Prefer faster wins
  }
  if (winner === opponent) {
    return depth - 10; // Prefer slower losses
  }
  if (isDraw(board)) {
    return 0;
  }

  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return 0;
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const pos of emptyCells) {
      const newBoard = setCell(board, pos, aiPlayer);
      const score = minimax(newBoard, depth + 1, false, alpha, beta, aiPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const pos of emptyCells) {
      const newBoard = setCell(board, pos, opponent);
      const score = minimax(newBoard, depth + 1, true, alpha, beta, aiPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minScore;
  }
}

/**
 * God AI Strategy - unbeatable AI using minimax with alpha-beta pruning
 *
 * This AI will always either win or draw. It cannot be beaten.
 */
export const godStrategy: AIStrategy = {
  name: 'God AI',
  difficulty: 'god',

  getMove(board: Board, player: Player): Position {
    const emptyCells = getEmptyCells(board);

    if (emptyCells.length === 0) {
      throw new Error('No valid moves available');
    }

    // If board is empty, pick center (optimal first move)
    if (emptyCells.length === 9) {
      return { row: 1, col: 1 };
    }

    let bestMove: Position = emptyCells[0];
    let bestScore = -Infinity;

    for (const pos of emptyCells) {
      const newBoard = setCell(board, pos, player);
      const score = minimax(newBoard, 0, false, -Infinity, Infinity, player);

      if (score > bestScore) {
        bestScore = score;
        bestMove = pos;
      }
    }

    return bestMove;
  },
};
