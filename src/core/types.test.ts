import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  createInitialGameState,
  type BoardGrid,
  type GameState,
} from './types.ts';

describe('createEmptyBoard', () => {
  it('creates a 3x3 board', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(3);
    expect(board[0]).toHaveLength(3);
    expect(board[1]).toHaveLength(3);
    expect(board[2]).toHaveLength(3);
  });

  it('creates a board with all null cells', () => {
    const board = createEmptyBoard();
    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });

  it('returns a new board instance each time', () => {
    const board1 = createEmptyBoard();
    const board2 = createEmptyBoard();
    expect(board1).not.toBe(board2);
  });
});

describe('createInitialGameState', () => {
  it('creates a valid initial game state', () => {
    const state = createInitialGameState();

    expect(state.board).toBeDefined();
    expect(state.currentPlayer).toBe('X');
    expect(state.phase).toBe('setup');
    expect(state.mode).toBe('hvh');
    expect(state.humanPlayer).toBe('X');
    expect(state.difficulty).toBe('fun');
    expect(state.result).toBeNull();
  });

  it('starts with an empty board', () => {
    const state = createInitialGameState();

    for (const row of state.board) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });

  it('returns a new state instance each time', () => {
    const state1 = createInitialGameState();
    const state2 = createInitialGameState();
    expect(state1).not.toBe(state2);
    expect(state1.board).not.toBe(state2.board);
  });
});

describe('Type definitions', () => {
  it('Board type accepts valid 3x3 arrays', () => {
    const validBoard: BoardGrid = [
      ['X', 'O', null],
      [null, 'X', 'O'],
      ['O', null, 'X'],
    ];
    expect(validBoard).toBeDefined();
  });

  it('GameState type accepts valid state objects', () => {
    const validState: GameState = {
      board: createEmptyBoard(),
      currentPlayer: 'O',
      phase: 'playing',
      mode: 'hvc',
      humanPlayer: 'X',
      difficulty: 'god',
      result: null,
    };
    expect(validState).toBeDefined();
  });

  it('GameState with result accepts winner data', () => {
    const stateWithWinner: GameState = {
      board: [
        ['X', 'X', 'X'],
        ['O', 'O', null],
        [null, null, null],
      ],
      currentPlayer: 'O',
      phase: 'finished',
      mode: 'hvh',
      humanPlayer: 'X',
      difficulty: 'fun',
      result: {
        winner: 'X',
        winningLine: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        isDraw: false,
      },
    };
    expect(stateWithWinner.result?.winner).toBe('X');
    expect(stateWithWinner.result?.winningLine).toHaveLength(3);
    expect(stateWithWinner.result?.isDraw).toBe(false);
  });

  it('GameState with result accepts draw data', () => {
    const stateWithDraw: GameState = {
      board: [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
      ],
      currentPlayer: 'O',
      phase: 'finished',
      mode: 'hvh',
      humanPlayer: 'X',
      difficulty: 'fun',
      result: {
        winner: null,
        winningLine: null,
        isDraw: true,
      },
    };
    expect(stateWithDraw.result?.winner).toBeNull();
    expect(stateWithDraw.result?.winningLine).toBeNull();
    expect(stateWithDraw.result?.isDraw).toBe(true);
  });
});
