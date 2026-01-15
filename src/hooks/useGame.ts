import { useReducer, useCallback, useEffect, useRef } from 'react';
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
import { getStrategy } from '../ai';

/** Default delay before AI makes a move (ms) */
const DEFAULT_AI_DELAY = 500;

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
  /** Whether it's currently the human player's turn (in HvC mode) */
  isHumanTurn: boolean;
  /** Whether it's currently the AI's turn (in HvC mode) */
  isAITurn: boolean;
}

/** Hook for managing tic-tac-toe game state */
export function useGame(aiDelay: number = DEFAULT_AI_DELAY): UseGameReturn {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());
  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((config: GameConfig) => {
    dispatch({ type: 'START_GAME', config });
  }, []);

  const makeMove = useCallback((position: Position) => {
    dispatch({ type: 'MAKE_MOVE', position });
  }, []);

  const resetGame = useCallback(() => {
    // Clear any pending AI move
    if (aiMoveTimeoutRef.current !== null) {
      clearTimeout(aiMoveTimeoutRef.current);
      aiMoveTimeoutRef.current = null;
    }
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const isPlaying = state.phase === 'playing';
  const isFinished = state.phase === 'finished';
  const isHumanTurn =
    isPlaying && state.mode === 'hvc' && state.currentPlayer === state.humanPlayer;
  const isAITurn =
    isPlaying &&
    (state.mode === 'cvc' || (state.mode === 'hvc' && state.currentPlayer !== state.humanPlayer));

  // Auto-trigger AI moves in HvC and CvC modes
  useEffect(() => {
    if (!isAITurn) {
      return;
    }

    const strategy = getStrategy(state.difficulty);
    const aiMove = strategy.getMove(state.board, state.currentPlayer);

    aiMoveTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'MAKE_MOVE', position: aiMove });
      aiMoveTimeoutRef.current = null;
    }, aiDelay);

    return (): void => {
      if (aiMoveTimeoutRef.current !== null) {
        clearTimeout(aiMoveTimeoutRef.current);
        aiMoveTimeoutRef.current = null;
      }
    };
  }, [isAITurn, state.board, state.currentPlayer, state.difficulty, aiDelay]);

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
