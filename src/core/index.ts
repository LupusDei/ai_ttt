// Core game logic exports
export type {
  Player,
  CellValue,
  Position,
  BoardGrid,
  GameMode,
  HumanPlayer,
  AIDifficulty,
  GamePhase,
  GameResult,
  GameState,
} from './types.ts';

export { BOARD_SIZE } from './types.ts';

export {
  createEmptyBoard,
  createInitialGameState,
  getCell,
  setCell,
  getEmptyCells,
  cloneBoard,
  getGameResult,
  checkWinner,
  getWinningLine,
  isBoardFull,
  isDraw,
} from './board.ts';
