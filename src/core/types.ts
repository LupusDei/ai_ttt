/**
 * Core type definitions for the Tic-Tac-Toe game
 */

/** The two players in the game */
export type Player = 'X' | 'O';

/** A cell can be empty (null) or occupied by a player */
export type CellValue = Player | null;

/** Position on the board (0-2 for row and column) */
export interface Position {
  row: number;
  col: number;
}

/** The 3x3 game board represented as a 2D array */
export type BoardGrid = [[CellValue, CellValue, CellValue], [CellValue, CellValue, CellValue], [CellValue, CellValue, CellValue]];

/** Game mode options */
export type GameMode = 'hvh' | 'hvc' | 'cvc';

/** Which player the human controls in HvC mode */
export type HumanPlayer = Player;

/** AI difficulty levels */
export type AIDifficulty = 'fun' | 'god';

/** Current phase of the game */
export type GamePhase = 'setup' | 'playing' | 'finished';

/** Result of a finished game */
export interface GameResult {
  winner: Player | null;
  winningLine: Position[] | null;
  isDraw: boolean;
}

/** Complete game state */
export interface GameState {
  board: BoardGrid;
  currentPlayer: Player;
  phase: GamePhase;
  mode: GameMode;
  humanPlayer: HumanPlayer;
  difficulty: AIDifficulty;
  result: GameResult | null;
}

/** Creates an empty 3x3 board */
export function createEmptyBoard(): BoardGrid {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

/** Creates the initial game state */
export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'X',
    phase: 'setup',
    mode: 'hvh',
    humanPlayer: 'X',
    difficulty: 'fun',
    result: null,
  };
}
