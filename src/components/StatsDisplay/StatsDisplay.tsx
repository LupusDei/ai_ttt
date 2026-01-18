import { memo } from 'react';
import type React from 'react';
import type { PlayerStats } from '../../core/types.ts';

export interface StatsDisplayProps {
  stats: PlayerStats;
  onReset: () => void;
}

export const StatsDisplay = memo(function StatsDisplay({
  stats,
  onReset,
}: StatsDisplayProps): React.JSX.Element {
  const totalGames = stats.wins + stats.losses + stats.draws;

  return (
    <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
      <div className="flex gap-4">
        <span>
          <span className="text-green-400 font-bold">{stats.wins}</span> Wins
        </span>
        <span>
          <span className="text-red-400 font-bold">{stats.losses}</span> Losses
        </span>
        <span>
          <span className="text-yellow-400 font-bold">{stats.draws}</span> Draws
        </span>
      </div>
      {totalGames > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
          aria-label="Reset statistics"
        >
          Reset Stats
        </button>
      )}
    </div>
  );
});
