import { describe, it, expect } from 'vitest';
import type { AIStrategy, AIDifficultyLevel } from './types.ts';
import type { Board } from '../core/types.ts';
import { createEmptyBoard } from '../core/types.ts';

describe('AIStrategy interface', () => {
  it('accepts a valid strategy implementation', () => {
    const mockStrategy: AIStrategy = {
      name: 'Test Strategy',
      difficulty: 'fun',
      getMove: (board: Board) => {
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
      getMove: (board: Board) => {
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

    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, 'O'],
    ];

    const move = mockStrategy.getMove(board, 'X');
    expect(move).toEqual({ row: 1, col: 1 });
  });
});

describe('AIDifficultyLevel type', () => {
  it('accepts fun difficulty', () => {
    const difficulty: AIDifficultyLevel = 'fun';
    expect(difficulty).toBe('fun');
  });

  it('accepts god difficulty', () => {
    const difficulty: AIDifficultyLevel = 'god';
    expect(difficulty).toBe('god');
  });
});
