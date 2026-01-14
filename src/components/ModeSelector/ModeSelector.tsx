import type { ReactElement } from 'react';

/** Play mode options for the game */
export type PlayMode = 'hvh' | 'hvc' | 'cvc';

export interface ModeSelectorProps {
  value: PlayMode;
  onChange: (mode: PlayMode) => void;
}

const modes: { value: PlayMode; label: string }[] = [
  { value: 'hvh', label: 'Human vs Human' },
  { value: 'hvc', label: 'Human vs Computer' },
  { value: 'cvc', label: 'Computer vs Computer' },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            value === mode.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
