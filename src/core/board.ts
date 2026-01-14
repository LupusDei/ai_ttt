import type { Board, Cell, Position } from './types.ts';
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
