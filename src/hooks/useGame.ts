import { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import type {
  GameState,
  GameMode,
  Player,
  AIDifficulty,
  Position,
} from '../core/types';
import { createInitialGameState, createEmptyBoard } from '../core/types';
import { setCell, getGameResult } from '../core/board';
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
      const result = getGameResult(newBoard);

      if (result.winner || result.isDraw) {
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
  /** Whether it's currently the AI's turn (in HvC or CvC mode) */
  isAITurn: boolean;
  /** Whether the game is in Computer vs Computer mode */
  isCvC: boolean;
  /** Whether CvC auto-play is paused */
  isPaused: boolean;
  /** Toggle pause state for CvC mode */
  togglePause: () => void;
}

/** Hook for managing tic-tac-toe game state */
export function useGame(aiDelay: number = DEFAULT_AI_DELAY): UseGameReturn {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());
  const [isPaused, setIsPaused] = useState(false);
  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((config: GameConfig) => {
    setIsPaused(false);
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
    setIsPaused(false);
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const isPlaying = state.phase === 'playing';
  const isFinished = state.phase === 'finished';
  const isCvC = state.mode === 'cvc';
  const isHumanTurn =
    isPlaying && state.mode === 'hvc' && state.currentPlayer === state.humanPlayer;
  const isAITurn =
    isPlaying &&
    (state.mode === 'cvc' || (state.mode === 'hvc' && state.currentPlayer !== state.humanPlayer));

  // Auto-trigger AI moves in HvC and CvC modes (respects pause in CvC)
  useEffect(() => {
    if (!isAITurn) {
      return;
    }

    // In CvC mode, respect the pause state
    if (isCvC && isPaused) {
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
  }, [isAITurn, isCvC, isPaused, state.board, state.currentPlayer, state.difficulty, aiDelay]);

  return {
    state,
    startGame,
    makeMove,
    resetGame,
    isPlaying,
    isFinished,
    isHumanTurn,
    isAITurn,
    isCvC,
    isPaused,
    togglePause,
  };
}
