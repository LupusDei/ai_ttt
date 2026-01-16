import { memo, useCallback } from 'react';
import type { ReactElement } from 'react';
import type { GameMode } from '../../core/types';

export interface ModeSelectorProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

const modes: { value: GameMode; label: string }[] = [
  { value: 'hvh', label: 'Human vs Human' },
  { value: 'hvc', label: 'Human vs Computer' },
  { value: 'cvc', label: 'Computer vs Computer' },
];

export const ModeSelector = memo(function ModeSelector({ value, onChange }: ModeSelectorProps): ReactElement {
  const handleClick = useCallback(
    (mode: GameMode): (() => void) => (): void => onChange(mode),
    [onChange]
  );
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-400">Game Mode:</span>
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={handleClick(mode.value)}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            value === mode.value
              ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === mode.value}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
});
