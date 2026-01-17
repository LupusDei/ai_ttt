import { memo, useCallback } from 'react';
import type React from 'react';
import type { Player } from '../../core/types.ts';

interface PlayerSelectorProps {
  value: Player;
  onChange: (player: Player) => void;
}

export const PlayerSelector = memo(function PlayerSelector({ value, onChange }: PlayerSelectorProps): React.JSX.Element {
  const handleClickX = useCallback(() => onChange('X'), [onChange]);
  const handleClickO = useCallback(() => onChange('O'), [onChange]);

  return (
    <div className="flex flex-col gap-2">
      <span id="player-selector-label" className="text-sm text-gray-400">Play as:</span>
      <div role="group" aria-labelledby="player-selector-label" className="flex gap-2">
        <button
          type="button"
          onClick={handleClickX}
          className={`px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            value === 'X'
              ? 'bg-blue-600 text-white shadow-[0_0_0_3px_#60a5fa]'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'X'}
        >
          Play as X
        </button>
        <button
          type="button"
          onClick={handleClickO}
          className={`px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            value === 'O'
              ? 'bg-blue-600 text-white shadow-[0_0_0_3px_#60a5fa]'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'O'}
        >
          Play as O
        </button>
      </div>
      <span id="player-selector-hint" className="text-xs text-gray-500">Note: X always goes first</span>
    </div>
  );
});
