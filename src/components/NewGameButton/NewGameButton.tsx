import { memo } from 'react';
import type React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
}

export const NewGameButton = memo(function NewGameButton({ onClick }: NewGameButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      New Game
    </button>
  );
});
