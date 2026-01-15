import type { ReactElement } from 'react';
import { useState } from 'react';
import type { GameMode, Player, AIDifficulty } from './core/types';
import { useGame } from './hooks';
import {
  Board,
  ModeSelector,
  PlayerSelector,
  DifficultySelector,
  GameStatus,
  NewGameButton,
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
        Tic-Tac-Toe
      </h1>

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
            <div className="text-sm text-gray-400">
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
          {isAITurn && !isPaused && (
            <div className="text-gray-400 text-sm animate-pulse">{getAIThinkingMessage()}</div>
          )}

          {/* CvC pause/resume controls */}
          {isCvC && isPlaying && (
            <button
              type="button"
              onClick={togglePause}
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
          {isCvC && isPaused && isPlaying && (
            <div className="text-yellow-400 text-sm font-medium">Game Paused</div>
          )}

          {isFinished && (
            <div className="mt-4">
              <NewGameButton onClick={handleNewGame} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
