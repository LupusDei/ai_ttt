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
  const { state, startGame, makeMove, resetGame, isPlaying, isFinished, isAITurn } = useGame();

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Tic-Tac-Toe</h1>

      {state.phase === 'setup' ? (
        <div className="flex flex-col gap-6 items-center">
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
        <div className="flex flex-col gap-6 items-center">
          <GameStatus
            currentPlayer={state.currentPlayer}
            winner={state.result?.winner ?? null}
            phase={state.phase}
          />

          <Board
            board={state.board}
            onCellClick={handleCellClick}
            winningLine={state.result?.winningLine}
            disabled={!isPlaying || isAITurn}
          />

          {isAITurn && (
            <div className="text-gray-400 text-sm animate-pulse">AI is thinking...</div>
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
