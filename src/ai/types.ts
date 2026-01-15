import type { AIDifficulty, Board, Player, Position } from '../core/types.ts';

/**
 * Interface for AI strategy implementations
 */
export interface AIStrategy {
  /** Human-readable name of the strategy */
  readonly name: string;

  /** The difficulty level this strategy represents */
  readonly difficulty: AIDifficulty;

  /**
   * Calculates the best move for the given player on the board
   * @param board - Current game board state
   * @param player - The player (X or O) to make a move for
   * @returns The position where the AI wants to place its mark
   */
  getMove(board: Board, player: Player): Position;
}
