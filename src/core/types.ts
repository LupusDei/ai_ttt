/**
 * Core type definitions for the Tic-Tac-Toe game
 */

/** The two players in the game */
export type Player = 'X' | 'O';

/** A cell can be empty (null) or occupied by a player */
export type Cell = Player | null;

/** Position on the board (0-2 for row and column) */
export interface Position {
  row: number;
  col: number;
}

/** The 3x3 game board represented as a 2D array */
export type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

/** Game mode options */
export type GameMode = 'pvp' | 'pve';

/** Which player the human controls in PvE mode */
export type HumanPlayer = Player;

/** AI difficulty levels */
export type AIDifficulty = 'easy' | 'medium' | 'hard';

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
  board: Board;
  currentPlayer: Player;
  phase: GamePhase;
  mode: GameMode;
  humanPlayer: HumanPlayer;
  difficulty: AIDifficulty;
  result: GameResult | null;
}

/** Creates an empty 3x3 board */
export function createEmptyBoard(): Board {
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
    mode: 'pvp',
    humanPlayer: 'X',
    difficulty: 'medium',
    result: null,
  };
}
