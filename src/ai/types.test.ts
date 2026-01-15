import { describe, it, expect } from 'vitest';
import type { AIStrategy } from './types.ts';
import type { AIDifficulty, BoardGrid } from '../core/types.ts';
import { createEmptyBoard } from '../core/types.ts';

describe('AIStrategy interface', () => {
  it('accepts a valid strategy implementation', () => {
    const mockStrategy: AIStrategy = {
      name: 'Test Strategy',
      difficulty: 'fun',
      getMove: (board: BoardGrid) => {
        // Simple mock: return first empty cell
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
              return { row, col };
            }
          }
        }
        return { row: 0, col: 0 };
      },
    };

    expect(mockStrategy.name).toBe('Test Strategy');
    expect(mockStrategy.difficulty).toBe('fun');

    const board = createEmptyBoard();
    const move = mockStrategy.getMove(board, 'X');
    expect(move).toEqual({ row: 0, col: 0 });
  });

  it('strategy returns valid position on partially filled board', () => {
    const mockStrategy: AIStrategy = {
      name: 'Center Finder',
      difficulty: 'god',
      getMove: (board: BoardGrid) => {
        // Try center first
        if (board[1][1] === null) {
          return { row: 1, col: 1 };
        }
        // Otherwise find any empty
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
              return { row, col };
            }
          }
        }
        return { row: 0, col: 0 };
      },
    };

    const board: BoardGrid = [
      ['X', null, null],
      [null, null, null],
      [null, null, 'O'],
    ];

    const move = mockStrategy.getMove(board, 'X');
    expect(move).toEqual({ row: 1, col: 1 });
  });
});

describe('AIDifficulty type', () => {
  it('accepts fun difficulty', () => {
    const difficulty: AIDifficulty = 'fun';
    expect(difficulty).toBe('fun');
  });

  it('accepts god difficulty', () => {
    const difficulty: AIDifficulty = 'god';
    expect(difficulty).toBe('god');
  });
});
