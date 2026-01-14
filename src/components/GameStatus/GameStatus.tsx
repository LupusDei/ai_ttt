import type React from 'react';
import type { Player, GamePhase } from '../../core/types.ts';

interface GameStatusProps {
  currentPlayer: Player;
  winner: Player | null;
  phase: GamePhase;
}

export function GameStatus({
  currentPlayer,
  winner,
  phase,
}: GameStatusProps): React.JSX.Element {
  const getStatusMessage = (): string => {
    if (phase === 'setup') {
      return 'Configure your game and press Start';
    }

    if (phase === 'finished') {
      if (winner) {
        return `Player ${winner} wins!`;
      }
      return "It's a draw!";
    }

    return `Player ${currentPlayer}'s turn`;
  };

  const getStatusStyle = (): string => {
    if (phase === 'finished') {
      if (winner) {
        return 'text-green-400';
      }
      return 'text-yellow-400';
    }
    return 'text-white';
  };

  return (
    <div
      className={`text-2xl font-bold text-center py-4 ${getStatusStyle()}`}
      role="status"
      aria-live="polite"
    >
      {getStatusMessage()}
    </div>
  );
}
