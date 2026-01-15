import { useReducer, useCallback } from 'react';
import type {
  GameState,
  GameMode,
  Player,
  AIDifficulty,
  Position,
  GameResult,
} from '../core/types';
import { createInitialGameState, createEmptyBoard } from '../core/types';
import { setCell, checkWinner, getWinningLine, isDraw } from '../core/board';

/** Configuration for starting a new game */
export interface GameConfig {
  mode: GameMode;
  humanPlayer: Player;
  difficulty: AIDifficulty;
}

/** Action types for the game reducer */
type GameAction =
  | { type: 'START_GAME'; config: GameConfig }
  | { type: 'MAKE_MOVE'; position: Position }
  | { type: 'RESET_GAME' };

/** Switches to the other player */
function getNextPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

/** Game state reducer */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        board: createEmptyBoard(),
        currentPlayer: 'X',
        phase: 'playing',
        mode: action.config.mode,
        humanPlayer: action.config.humanPlayer,
        difficulty: action.config.difficulty,
        result: null,
      };
    }

    case 'MAKE_MOVE': {
      if (state.phase !== 'playing') {
        return state;
      }

      const { row, col } = action.position;
      if (state.board[row][col] !== null) {
        return state;
      }

      const newBoard = setCell(state.board, action.position, state.currentPlayer);
      const winner = checkWinner(newBoard);
      const winningLine = getWinningLine(newBoard);
      const gameIsDraw = isDraw(newBoard);

      if (winner || gameIsDraw) {
        const result: GameResult = {
          winner,
          winningLine,
          isDraw: gameIsDraw,
        };
        return {
          ...state,
          board: newBoard,
          phase: 'finished',
          result,
        };
      }

      return {
        ...state,
        board: newBoard,
        currentPlayer: getNextPlayer(state.currentPlayer),
      };
    }

    case 'RESET_GAME': {
      return createInitialGameState();
    }

    default:
      return state;
  }
}

/** Return type for the useGame hook */
export interface UseGameReturn {
  /** Current game state */
  state: GameState;
  /** Start a new game with the given configuration */
  startGame: (config: GameConfig) => void;
  /** Make a move at the given position */
  makeMove: (position: Position) => void;
  /** Reset the game to initial state */
  resetGame: () => void;
  /** Whether the game is currently in progress */
  isPlaying: boolean;
  /** Whether the game has finished */
  isFinished: boolean;
  /** Whether it's currently the human player's turn (in PvE mode) */
  isHumanTurn: boolean;
  /** Whether it's currently the AI's turn (in PvE mode) */
  isAITurn: boolean;
}

/** Hook for managing tic-tac-toe game state */
export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());

  const startGame = useCallback((config: GameConfig) => {
    dispatch({ type: 'START_GAME', config });
  }, []);

  const makeMove = useCallback((position: Position) => {
    dispatch({ type: 'MAKE_MOVE', position });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const isPlaying = state.phase === 'playing';
  const isFinished = state.phase === 'finished';
  const isHumanTurn =
    isPlaying && state.mode === 'hvc' && state.currentPlayer === state.humanPlayer;
  const isAITurn =
    isPlaying &&
    (state.mode === 'cvc' || (state.mode === 'hvc' && state.currentPlayer !== state.humanPlayer));

  return {
    state,
    startGame,
    makeMove,
    resetGame,
    isPlaying,
    isFinished,
    isHumanTurn,
    isAITurn,
  };
}
