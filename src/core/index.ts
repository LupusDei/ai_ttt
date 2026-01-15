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

export { BOARD_SIZE, createEmptyBoard, createInitialGameState } from './types.ts';

export {
  createBoard,
  getCell,
  setCell,
  getEmptyCells,
  cloneBoard,
  checkWinner,
  getWinningLine,
  isBoardFull,
  isDraw,
} from './board.ts';
