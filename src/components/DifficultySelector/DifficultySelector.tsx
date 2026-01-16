import { memo, useCallback } from 'react';
import type React from 'react';
import type { AIDifficulty } from '../../core/types.ts';

interface DifficultySelectorProps {
  value: AIDifficulty;
  onChange: (difficulty: AIDifficulty) => void;
}

function getDifficultyDescription(value: AIDifficulty): string {
  switch (value) {
    case 'easy':
      return 'Random moves - very easy to beat';
    case 'fun':
      return 'Blocks and wins - but beatable';
    case 'god':
      return 'Unbeatable perfect play';
  }
}

export const DifficultySelector = memo(function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps): React.JSX.Element {
  const handleClickEasy = useCallback(() => onChange('easy'), [onChange]);
  const handleClickFun = useCallback(() => onChange('fun'), [onChange]);
  const handleClickGod = useCallback(() => onChange('god'), [onChange]);

  return (
    <div className="flex flex-col gap-2">
      <span id="difficulty-selector-label" className="text-sm text-gray-400">AI Difficulty:</span>
      <div role="group" aria-labelledby="difficulty-selector-label" aria-describedby="difficulty-description" className="flex gap-2">
        <button
          type="button"
          onClick={handleClickEasy}
          className={`px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            value === 'easy'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'easy'}
        >
          Easy
        </button>
        <button
          type="button"
          onClick={handleClickFun}
          className={`px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
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
          onClick={handleClickGod}
          className={`px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            value === 'god'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={value === 'god'}
        >
          God
        </button>
      </div>
      <span id="difficulty-description" className="text-xs text-gray-500" aria-live="polite">{getDifficultyDescription(value)}</span>
    </div>
  );
});
