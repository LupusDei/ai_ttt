import type { BoardGrid, CellValue, GameResult, Player, Position } from './types.ts';
import { BOARD_SIZE, createEmptyBoard } from './types.ts';

/**
 * Creates a new empty board
 */
export function createBoard(): BoardGrid {
  return createEmptyBoard();
}

/**
 * Gets the cell value at the specified position
 */
export function getCell(board: BoardGrid, position: Position): CellValue {
  return board[position.row][position.col];
}

/**
 * Sets a cell value at the specified position (immutable - returns new board)
 */
export function setCell(board: BoardGrid, position: Position, value: CellValue): BoardGrid {
  const newBoard = cloneBoard(board);
  newBoard[position.row][position.col] = value;
  return newBoard;
}

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: BoardGrid): Position[] {
  const emptyCells: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
}

/**
 * Creates a deep clone of the board
 */
export function cloneBoard(board: BoardGrid): BoardGrid {
  return [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
  ];
}

/** All possible winning lines (rows, columns, diagonals) */
const WINNING_LINES: Position[][] = [
  // Rows
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
  [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
  [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
  // Columns
  [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
  [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
  [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
  // Diagonals
  [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
  [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
];

/**
 * Gets the complete game result in a single pass.
 * Consolidates winner detection, winning line, and draw check.
 */
export function getGameResult(board: BoardGrid): GameResult {
  // Check for a winner
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = getCell(board, a);
    const cellB = getCell(board, b);
    const cellC = getCell(board, c);

    if (cellA !== null && cellA === cellB && cellB === cellC) {
      return {
        winner: cellA,
        winningLine: line,
        isDraw: false,
      };
    }
  }

  // No winner - check for draw
  const boardFull = getEmptyCells(board).length === 0;
  return {
    winner: null,
    winningLine: null,
    isDraw: boardFull,
  };
}

/**
 * Checks if there's a winner on the board
 * @returns The winning player or null if no winner
 */
export function checkWinner(board: BoardGrid): Player | null {
  return getGameResult(board).winner;
}

/**
 * Gets the winning line positions if there's a winner
 * @returns Array of positions forming the winning line, or null if no winner
 */
export function getWinningLine(board: BoardGrid): Position[] | null {
  return getGameResult(board).winningLine;
}

/**
 * Checks if the board is completely filled
 */
export function isBoardFull(board: BoardGrid): boolean {
  return getEmptyCells(board).length === 0;
}

/**
 * Checks if the game is a draw (board full with no winner)
 */
export function isDraw(board: BoardGrid): boolean {
  return getGameResult(board).isDraw;
}
