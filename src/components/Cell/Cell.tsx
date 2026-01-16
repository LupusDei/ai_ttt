import type React from 'react';
import type { CellValue } from '../../core/types';

export interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled?: boolean;
  isWinning?: boolean;
  row: number;
  col: number;
}

export function Cell({ value, onClick, disabled = false, isWinning = false, row, col }: CellProps): React.JSX.Element {
  const baseClasses =
    'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold flex items-center justify-center border-2 border-gray-600 rounded-lg transition-all duration-200 ease-out';

  const stateClasses = disabled
    ? 'cursor-not-allowed opacity-70'
    : 'cursor-pointer hover:bg-gray-700 hover:border-gray-500 hover:scale-105 hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900';

  const winningClasses = isWinning ? 'bg-green-900 border-green-500 animate-pulse-win' : 'bg-gray-800';

  const valueClasses = value === 'X' ? 'text-blue-400' : value === 'O' ? 'text-red-400' : '';

  // Human-readable position (1-indexed)
  const position = `Row ${row + 1}, Column ${col + 1}`;
  const cellState = value ? `contains ${value}` : 'empty';
  const winningState = isWinning ? ', winning cell' : '';

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses} ${winningClasses} ${valueClasses}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${position}: ${cellState}${winningState}`}
    >
      {value && <span className="animate-pop-in">{value}</span>}
    </button>
  );
}
