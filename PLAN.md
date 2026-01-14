# Tic-Tac-Toe Game Implementation Plan

## Overview

Build a polished tic-tac-toe SPA with TypeScript, React, and Vite featuring:
- 3 game modes: Human vs Human, Human vs Computer, Computer vs Computer
- Player selection (X/O, where O always goes first)
- 2 AI difficulty levels: Fun (beatable) and God (unbeatable)
- Clean architecture with high test coverage

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: CSS transitions/keyframes (native)
- **Unit/Integration Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

## Architecture

```
src/
├── core/                    # Pure TypeScript game logic (NO React)
│   ├── types.ts            # Board, Player, GameState types
│   ├── board.ts            # Board operations, win detection
│   ├── game.ts             # Game state machine
│   └── index.ts            # Public API
├── ai/                      # AI strategies (NO React)
│   ├── types.ts            # Strategy interface
│   ├── fun.ts              # Beatable AI
│   ├── god.ts              # Minimax unbeatable AI
│   └── index.ts            # Strategy factory
├── components/              # React UI components
│   ├── Board/              # Game board grid
│   ├── Cell/               # Individual cell
│   ├── ModeSelector/       # Game mode picker
│   ├── PlayerSelector/     # X/O selection
│   ├── DifficultySelector/ # AI difficulty picker
│   ├── GameStatus/         # Current status display
│   └── App/                # Root component
├── hooks/                   # Custom React hooks
│   └── useGame.ts          # Game state management hook
├── styles/                  # Global styles & animations
└── main.tsx                # Entry point
```

## Key Design Decisions

1. **Separation of Concerns**: Core game logic is pure TypeScript with no React dependencies - enables easy testing and potential reuse
2. **Strategy Pattern for AI**: Interface-based AI allows adding new strategies without changing existing code
3. **Component Composition**: Small, focused components that can be developed/tested independently
4. **CSS-first Animations**: Use CSS transitions/animations for performance

---

## Epics & Tasks

### Epic 1: Project Foundation
**Dependencies: None | Enables: All other epics**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E1-T1 | `ai_ttt-qek` | Initialize Vite + React + TypeScript project | Start |
| E1-T2 | `ai_ttt-233` | Configure ESLint with strict TypeScript rules | After T1 |
| E1-T3 | `ai_ttt-ztv` | Configure Prettier | After T1 |
| E1-T4 | `ai_ttt-8ay` | Set up Vitest + React Testing Library | After T1 |
| E1-T5 | `ai_ttt-9xl` | Install and configure Tailwind CSS | After T1 |
| E1-T6 | `ai_ttt-171` | Set up Playwright for E2E testing | After T1 |
| E1-T7 | `ai_ttt-570` | Create directory structure (empty files/exports) | After T1 |
| E1-T8 | `ai_ttt-fzs` | Add .gitignore, update package.json scripts | After T1 |

**T2-T8 can run in parallel after T1**

---

### Epic 2: Core Game Types & Board Logic
**Dependencies: Epic 1 | Enables: Epic 3, Epic 5**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E2-T1 | `ai_ttt-xyf` | Define core types (Player, Cell, Board, GameState, GameMode) | Start |
| E2-T2 | `ai_ttt-4if` | Implement board operations (create, getCell, setCell, getEmptyCells) | After T1 |
| E2-T3 | `ai_ttt-cmx` | Implement win detection (checkWinner, getWinningLine) | After T2 |
| E2-T4 | `ai_ttt-w2q` | Implement draw detection (isBoardFull) | After T2 |
| E2-T5 | `ai_ttt-m39` | Write comprehensive unit tests for board logic | After T2-T4 |

**T3 and T4 can run in parallel**

---

### Epic 3: AI Strategies
**Dependencies: Epic 2 | Enables: Epic 5**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E3-T1 | `ai_ttt-khv` | Define AIStrategy interface and AIConfig type | Start |
| E3-T2 | `ai_ttt-6n1` | Implement "Fun" AI (opportunistic wins/blocks, otherwise random) | After T1 |
| E3-T3 | `ai_ttt-5js` | Implement "God" AI (minimax with alpha-beta pruning) | After T1 |
| E3-T4 | `ai_ttt-m9f` | Create strategy factory (getStrategy by difficulty) | After T2, T3 |
| E3-T5 | `ai_ttt-mav` | Write unit tests for AI (verify god never loses, fun can be beaten) | After T2, T3 |

**T2 and T3 can run in parallel**

---

### Epic 4: UI Components
**Dependencies: Epic 1 | Can parallel with: Epic 2, Epic 3**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E4-T1 | `ai_ttt-ygi` | Create Cell component (X/O display, click handler, hover states) | Start |
| E4-T2 | `ai_ttt-fel` | Create Board component (3x3 grid of Cells, winning line highlight) | After T1 |
| E4-T3 | `ai_ttt-7oe` | Create ModeSelector component (HvH, HvC, CvC buttons) | Start |
| E4-T4 | `ai_ttt-tr9` | Create PlayerSelector component (X/O choice) | Start |
| E4-T5 | `ai_ttt-5c3` | Create DifficultySelector component (Fun/God toggle) | Start |
| E4-T6 | `ai_ttt-643` | Create GameStatus component (turn indicator, winner/draw display) | Start |
| E4-T7 | `ai_ttt-89p` | Create NewGameButton component | Start |
| E4-T8 | `ai_ttt-2mg` | Implement CSS animations (cell pop-in, winning line, transitions) | After T1-T2 |
| E4-T9 | `ai_ttt-8ti` | Write component tests | After all above |

**T1, T3, T4, T5, T6, T7 can all start in parallel**

---

### Epic 5: Game State Management & Integration
**Dependencies: Epic 2, Epic 3, Epic 4 | Enables: Epic 6**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E5-T1 | `ai_ttt-ems` | Create useGame hook (state, actions, computed values) | Start |
| E5-T2 | `ai_ttt-zep` | Implement game state machine (setup -> playing -> ended) | After T1 |
| E5-T3 | `ai_ttt-pa9` | Integrate AI with game flow (auto-move with delay) | After T1, T2 |
| E5-T4 | `ai_ttt-ebw` | Wire up App component with all pieces | After T1-T3 |
| E5-T5 | `ai_ttt-ae1` | Handle Computer vs Computer auto-play | After T3, T4 |
| E5-T6 | `ai_ttt-x62` | Write integration tests | After T4, T5 |

---

### Epic 6: Polish & Final Testing
**Dependencies: Epic 5**

| ID | Bead | Task | Parallel? |
|----|------|------|-----------|
| E6-T1 | `ai_ttt-m7v` | Finalize responsive layout (mobile, tablet, desktop) | Start |
| E6-T2 | `ai_ttt-47d` | Add subtle hover/focus animations with Tailwind | Start |
| E6-T3 | `ai_ttt-by8` | Performance audit (React profiler, animation smoothness) | After T1, T2 |
| E6-T4 | `ai_ttt-3rd` | Accessibility audit (keyboard nav, ARIA labels, screen reader) | After T1, T2 |
| E6-T5 | `ai_ttt-rsr` | Playwright E2E: Human vs Human full game flow | Start |
| E6-T6 | `ai_ttt-t2y` | Playwright E2E: Human vs Computer (both difficulties) | Start |
| E6-T7 | `ai_ttt-n30` | Playwright E2E: Computer vs Computer auto-play | Start |
| E6-T8 | `ai_ttt-un5` | Cross-browser testing (Chrome, Firefox, Safari) | After T5-T7 |

**E2E tests (T5-T7) can run in parallel with polish tasks (T1-T4)**

---

## Parallel Work Streams

Multiple agents can work simultaneously on these independent tracks:

```
Agent 1: Epic 1 (Foundation) → Epic 2 (Core Logic) → Epic 5-T1,T2 (Game State)
Agent 2: [wait for E1] → Epic 4-T1,T2,T8 (Board UI) → Epic 5-T4 (Integration)
Agent 3: [wait for E2] → Epic 3 (AI) → Epic 5-T3,T5 (AI Integration)
Agent 4: [wait for E1] → Epic 4-T3,T4,T5,T6,T7 (Other UI Components)
```

---

## Type Definitions (Reference)

```typescript
// core/types.ts
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[][];  // 3x3
type Position = { row: number; col: number };
type GameMode = 'human-vs-human' | 'human-vs-computer' | 'computer-vs-computer';
type GamePhase = 'setup' | 'playing' | 'ended';
type AIDifficulty = 'fun' | 'god';

interface GameState {
  board: Board;
  currentPlayer: Player;
  phase: GamePhase;
  winner: Player | 'draw' | null;
  winningLine: Position[] | null;
  mode: GameMode;
  humanPlayer: Player | null;
  aiDifficulty: AIDifficulty;
}

// ai/types.ts
interface AIStrategy {
  name: string;
  getMove(board: Board, player: Player): Position;
}
```

---

## Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Core Logic | Vitest | 100% - all board operations, win detection |
| AI Strategies | Vitest | 100% - verify correctness, god unbeatable |
| Components | React Testing Library | High - user interactions, rendering |
| Integration | Vitest + RTL | Key flows - mode selection, full games |
| E2E | Playwright | Full game flows - all 3 modes, both AI difficulties |

---

## Quality Gates

Before any merge:
```bash
npm run build      # TypeScript compiles cleanly
npm run lint       # No ESLint errors
npm run test       # All unit/integration tests pass
npm run test:e2e   # All Playwright E2E tests pass
```

---

## Verification

After implementation, verify:
1. `npm run dev` starts the app
2. Can play Human vs Human game to completion
3. Can play Human vs Computer (both difficulties)
4. God mode AI is unbeatable (play multiple games)
5. Fun mode AI can be beaten
6. Computer vs Computer runs automatically
7. All animations are smooth
8. All tests pass with `npm test`
