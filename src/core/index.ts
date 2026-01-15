// Core game logic exports
export type {
  Player,
  Cell,
  Position,
  Board,
  GameMode,
  HumanPlayer,
  AIDifficulty,
  GamePhase,
  GameResult,
  GameState,
} from './types.ts';

export { createEmptyBoard, createInitialGameState } from './types.ts';

export {
  createBoard,
  getCell,
  setCell,
  getEmptyCells,
  cloneBoard,
  checkWinner,
  getWinningLine,
} from './board.ts';
