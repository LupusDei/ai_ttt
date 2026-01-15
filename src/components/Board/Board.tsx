import type React from 'react';
import type { Board as BoardType, Position } from '../../core/types';
import { Cell } from '../Cell';

export interface BoardProps {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  winningLine?: Position[] | null;
  disabled?: boolean;
}

function isWinningCell(row: number, col: number, winningLine?: Position[] | null): boolean {
  if (!winningLine) return false;
  return winningLine.some((pos) => pos.row === row && pos.col === col);
}

export function Board({
  board,
  onCellClick,
  winningLine,
  disabled = false,
}: BoardProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-1" role="grid" aria-label="Tic-tac-toe board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            disabled={disabled || cell !== null}
            isWinning={isWinningCell(rowIndex, colIndex, winningLine)}
          />
        ))
      )}
    </div>
  );
}
