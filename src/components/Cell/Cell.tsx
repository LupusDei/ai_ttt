import type React from 'react';
import type { CellValue } from '../../core/types';

export interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled?: boolean;
  isWinning?: boolean;
}

export function Cell({ value, onClick, disabled = false, isWinning = false }: CellProps): React.JSX.Element {
  const baseClasses =
    'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-3xl sm:text-4xl md:text-5xl font-bold flex items-center justify-center border-2 border-gray-600 rounded-lg transition-all duration-200 ease-out';

  const stateClasses = disabled
    ? 'cursor-not-allowed opacity-70'
    : 'cursor-pointer hover:bg-gray-700 hover:border-gray-500 hover:scale-105 hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900';

  const winningClasses = isWinning ? 'bg-green-900 border-green-500 animate-pulse-win' : 'bg-gray-800';

  const valueClasses = value === 'X' ? 'text-blue-400' : value === 'O' ? 'text-red-400' : '';

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses} ${winningClasses} ${valueClasses}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell contains ${value}` : 'Empty cell'}
    >
      {value && <span className="animate-pop-in">{value}</span>}
    </button>
  );
}
