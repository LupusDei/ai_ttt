import type { ReactElement } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { GameMode, Player, AIDifficulty } from './core/types';
import { useGame, useStats } from './hooks';
import {
  Board,
  ModeSelector,
  PlayerSelector,
  DifficultySelector,
  GameStatus,
  NewGameButton,
  Fireworks,
  StatsDisplay,
} from './components';
import './App.css';

function App(): ReactElement {
  const {
    state,
    startGame,
    makeMove,
    resetGame,
    isPlaying,
    isFinished,
    isAITurn,
    isCvC,
    isPaused,
    togglePause,
  } = useGame();

  const { stats, recordResult, resetStats } = useStats();
  const hasRecordedResult = useRef(false);

  // Record game result when HvC game finishes
  useEffect(() => {
    if (isFinished && state.mode === 'hvc' && state.result && !hasRecordedResult.current) {
      hasRecordedResult.current = true;
      recordResult(state.result, state.humanPlayer);
    }
  }, [isFinished, state.mode, state.result, state.humanPlayer, recordResult]);

  // Reset the recorded flag when starting a new game
  useEffect(() => {
    if (state.phase === 'setup') {
      hasRecordedResult.current = false;
    }
  }, [state.phase]);

  // Setup form state
  const [selectedMode, setSelectedMode] = useState<GameMode>('hvh');
  const [selectedPlayer, setSelectedPlayer] = useState<Player>('X');
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('fun');

  const handleStartGame = (): void => {
    startGame({
      mode: selectedMode,
      humanPlayer: selectedPlayer,
      difficulty: selectedDifficulty,
    });
  };

  const handleCellClick = (row: number, col: number): void => {
    // Don't allow moves during AI turn or when game is not playing
    if (isAITurn || !isPlaying) {
      return;
    }
    makeMove({ row, col });
  };

  const handleNewGame = (): void => {
    resetGame();
  };

  const showPlayerSelector = selectedMode === 'hvc';
  const showDifficultySelector = selectedMode === 'hvc' || selectedMode === 'cvc';

  // Get AI thinking message with visual distinction for CvC mode
  const getAIThinkingMessage = (): string => {
    if (isCvC) {
      return `AI ${state.currentPlayer} is thinking...`;
    }
    return 'AI is thinking...';
  };

  return (
    <div className="min-h-screen min-h-dvh w-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
          Tic-Tac-Toe
        </h1>

        {/* Stats display - shown when in HvC mode or when stats exist */}
        {(selectedMode === 'hvc' || state.mode === 'hvc') && (
          <div className="mb-4 sm:mb-6">
            <StatsDisplay stats={stats} onReset={resetStats} />
          </div>
        )}

        {state.phase === 'setup' ? (
          <div className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-sm px-4">
            <ModeSelector value={selectedMode} onChange={setSelectedMode} />

            {showPlayerSelector && (
              <PlayerSelector value={selectedPlayer} onChange={setSelectedPlayer} />
            )}

            {showDifficultySelector && (
              <DifficultySelector value={selectedDifficulty} onChange={setSelectedDifficulty} />
            )}

            <button
              type="button"
              onClick={handleStartGame}
              className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-md px-4">
            <GameStatus
              currentPlayer={state.currentPlayer}
              winner={state.result?.winner ?? null}
              phase={state.phase}
            />

            {/* CvC mode indicator */}
            {isCvC && isPlaying && (
              <div className="text-sm text-gray-400" aria-live="polite">
                <span
                  className={`font-bold ${state.currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}`}
                >
                  AI {state.currentPlayer}
                </span>{' '}
                vs{' '}
                <span
                  className={`font-bold ${state.currentPlayer === 'X' ? 'text-red-400' : 'text-blue-400'}`}
                >
                  AI {state.currentPlayer === 'X' ? 'O' : 'X'}
                </span>
              </div>
            )}

            <Board
              board={state.board}
              onCellClick={handleCellClick}
              winningLine={state.result?.winningLine}
              disabled={!isPlaying || isAITurn}
            />

            {/* AI thinking indicator */}
            <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
              {isAITurn && !isPaused && (
                <span className="text-gray-400 text-sm animate-pulse">{getAIThinkingMessage()}</span>
              )}
            </div>

            {/* CvC pause/resume controls */}
            {isCvC && isPlaying && (
              <button
                type="button"
                onClick={togglePause}
                aria-label={isPaused ? 'Resume game' : 'Pause game'}
                className={`px-6 py-2 font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isPaused
                    ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500'
                }`}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}

            {/* Paused indicator */}
            <div aria-live="assertive" className="min-h-[1.25rem]">
              {isCvC && isPaused && isPlaying && (
                <span className="text-yellow-400 text-sm font-medium">Game Paused</span>
              )}
            </div>

            {isFinished && (
              <div className="mt-4">
                <NewGameButton onClick={handleNewGame} />
              </div>
            )}
          </div>
        )}

        {/* Fireworks celebration when someone wins */}
        <Fireworks isActive={isFinished && state.result?.winner !== null} winner={state.result?.winner ?? null} />
      </main>
    </div>
  );
}

export default App;
