# Suspect Everyone

A digital adaptation of the mystery board game "Suspect Everyone" by Maureen and Mike Birdsall.

## Overview

Suspect Everyone is a strategic deduction game where players take on the roles of either a Detective trying to catch a killer, or the Killer trying to eliminate suspects before being caught.

## Game Modes

### Detective Mode
- **Objective**: Catch the killer before 6 people are murdered
- **Actions**: Move the board, reveal alibis, attempt arrests
- **Win Condition**: Successfully arrest the killer

### Killer Mode  
- **Objective**: Kill 6 people or eliminate the detective
- **Actions**: Move the board, change identity, eliminate suspects
- **Win Condition**: Kill 6 people or kill the detective

## Technical Architecture

### Components

- **GameBoard**: Reusable 7x7 grid component used by both game modes
- **Tile**: Individual suspect cards with images and status indicators
- **Move Buttons**: Directional controls for shifting rows and columns
- **Evidence/Alibi**: Character selection and management components

### Services

- **GameService**: Mode-agnostic utilities for game logic including:
  - Board movement and manipulation
  - Character randomization and shuffling
  - Location finding and adjacency calculations
  - Game state management

### Game Flow

1. **Initialization**: Characters are shuffled and placed on a 5x5 grid
2. **Turn-based Play**: Players alternate moving the board and taking actions
3. **Board Movement**: Rows and columns can be shifted, moving all characters
4. **Win Conditions**: Game ends when detective catches killer or killer reaches objective

## Development

Built with:
- **Next.js** - React framework
- **React Bootstrap** - UI components  
- **CSS Modules** - Component styling
- **JSDoc** - Code documentation

### Installation

Tested on node.js version 12.18.3+ and npm version 6.14.6+.

1. Clone the repository:

```bash
git clone https://github.com/modnar1226/suspect-everyone.git
cd suspect-everyone
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Server will start on http://localhost:3000

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run docs       # Generate JSDoc documentation
npm run docs:watch # Generate docs with file watching
```

## Game Rules

1. **Board Movement**: Each turn, players may shift any row or column once
2. **Detective Actions**: Reveal alibis, attempt arrests on adjacent suspects
3. **Killer Actions**: Eliminate adjacent suspects, change identity to avoid detection
4. **Alibis**: Protect suspects from being killed or provide cover for the killer

## Documentation

Generate code documentation with JSDoc:

```bash
npm run docs
```

Documentation will be generated in the `./docs/` directory.

## Original Game

This digital version is based on the original board game created by Maureen Birdsall and her husband Mike. The React implementation was created by Ian Greene in November 2020.
