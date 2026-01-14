import { describe, it, expect } from 'vitest';
import {
  createBoard,
  getCell,
  setCell,
  getEmptyCells,
  cloneBoard,
} from './board.ts';
import type { Board } from './types.ts';

describe('createBoard', () => {
  it('creates a 3x3 empty board', () => {
    const board = createBoard();
    expect(board).toHaveLength(3);
    for (const row of board) {
      expect(row).toHaveLength(3);
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });
});

describe('getCell', () => {
  it('returns the cell value at the given position', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    expect(getCell(board, { row: 0, col: 0 })).toBe('X');
    expect(getCell(board, { row: 0, col: 1 })).toBe('O');
    expect(getCell(board, { row: 0, col: 2 })).toBeNull();
    expect(getCell(board, { row: 1, col: 1 })).toBe('X');
    expect(getCell(board, { row: 2, col: 0 })).toBe('O');
  });
});

describe('setCell', () => {
  it('sets the cell value at the given position', () => {
    const board = createBoard();
    const newBoard = setCell(board, { row: 1, col: 1 }, 'X');
    expect(getCell(newBoard, { row: 1, col: 1 })).toBe('X');
  });

  it('returns a new board (immutable)', () => {
    const board = createBoard();
    const newBoard = setCell(board, { row: 0, col: 0 }, 'O');
    expect(newBoard).not.toBe(board);
    expect(getCell(board, { row: 0, col: 0 })).toBeNull();
    expect(getCell(newBoard, { row: 0, col: 0 })).toBe('O');
  });

  it('can set a cell to null', () => {
    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ];
    const newBoard = setCell(board, { row: 0, col: 0 }, null);
    expect(getCell(newBoard, { row: 0, col: 0 })).toBeNull();
  });
});

describe('getEmptyCells', () => {
  it('returns all empty positions on an empty board', () => {
    const board = createBoard();
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(9);
  });

  it('returns correct positions for a partially filled board', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(4);
    expect(emptyCells).toContainEqual({ row: 0, col: 2 });
    expect(emptyCells).toContainEqual({ row: 1, col: 0 });
    expect(emptyCells).toContainEqual({ row: 1, col: 2 });
    expect(emptyCells).toContainEqual({ row: 2, col: 1 });
  });

  it('returns empty array for a full board', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(0);
  });
});

describe('cloneBoard', () => {
  it('creates a deep copy of the board', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    const cloned = cloneBoard(board);
    expect(cloned).toEqual(board);
    expect(cloned).not.toBe(board);
  });

  it('modifications to clone do not affect original', () => {
    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ];
    const cloned = cloneBoard(board);
    cloned[0][1] = 'O';
    expect(board[0][1]).toBeNull();
    expect(cloned[0][1]).toBe('O');
  });
});
