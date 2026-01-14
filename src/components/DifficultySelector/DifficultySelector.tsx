import type React from 'react';
import type { AIDifficultyLevel } from '../../ai/types.ts';

interface DifficultySelectorProps {
  value: AIDifficultyLevel;
  onChange: (difficulty: AIDifficultyLevel) => void;
}

export function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-400">AI Difficulty:</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('fun')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            value === 'fun'
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'fun'}
        >
          Fun
        </button>
        <button
          type="button"
          onClick={() => onChange('god')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            value === 'god'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'god'}
        >
          God
        </button>
      </div>
      <span className="text-xs text-gray-500">
        {value === 'fun' ? 'Beatable AI that makes mistakes' : 'Unbeatable perfect play'}
      </span>
    </div>
  );
}
