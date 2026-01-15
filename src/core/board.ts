import type { Board, Cell, Player, Position } from './types.ts';
import { createEmptyBoard } from './types.ts';

/**
 * Creates a new empty board
 */
export function createBoard(): Board {
  return createEmptyBoard();
}

/**
 * Gets the cell value at the specified position
 */
export function getCell(board: Board, position: Position): Cell {
  return board[position.row][position.col];
}

/**
 * Sets a cell value at the specified position (immutable - returns new board)
 */
export function setCell(board: Board, position: Position, value: Cell): Board {
  const newBoard = cloneBoard(board);
  newBoard[position.row][position.col] = value;
  return newBoard;
}

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: Board): Position[] {
  const emptyCells: Position[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
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
export function cloneBoard(board: Board): Board {
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
 * Checks if there's a winner on the board
 * @returns The winning player or null if no winner
 */
export function checkWinner(board: Board): Player | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = getCell(board, a);
    const cellB = getCell(board, b);
    const cellC = getCell(board, c);

    if (cellA !== null && cellA === cellB && cellB === cellC) {
      return cellA;
    }
  }
  return null;
}

/**
 * Gets the winning line positions if there's a winner
 * @returns Array of positions forming the winning line, or null if no winner
 */
export function getWinningLine(board: Board): Position[] | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const cellA = getCell(board, a);
    const cellB = getCell(board, b);
    const cellC = getCell(board, c);

    if (cellA !== null && cellA === cellB && cellB === cellC) {
      return line;
    }
  }
  return null;
}

/**
 * Checks if the board is completely filled
 */
export function isBoardFull(board: Board): boolean {
  return getEmptyCells(board).length === 0;
}

/**
 * Checks if the game is a draw (board full with no winner)
 */
export function isDraw(board: Board): boolean {
  return isBoardFull(board) && checkWinner(board) === null;
}
