# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UNNO is a browser-based UNO variant game where a human player competes against an AI opponent. The game is a simple, static web application optimized for mobile devices and deployed via GitHub Pages.

## Architecture

This is a vanilla JavaScript/HTML/CSS application with no build process or dependencies:

- `index.html` - Main HTML structure with splash screen, game board, and player hand
- `script.js` - Game logic including deck management, player/AI turns, and UI interactions
- `style.css` - Responsive styling with animated gradient background and mobile-optimized card layouts
- `images/package.png` - Logo used for splash screen and corner branding

## Key Components

### Game State Management
Game state is managed through global variables in `script.js`:
- `deck` - Array of remaining cards
- `playerHand` - Player's cards array
- `aiHand` - AI opponent's cards array  
- `discard` - Discard pile array

### Core Game Flow
1. `init()` creates deck, deals cards, starts game
2. Player clicks cards to play or uses draw button
3. `aiTurn()` handles AI opponent logic
4. `canPlay()` validates card plays against top discard card
5. `reshuffle()` rebuilds deck from discard pile when needed

### UI Features
- Splash screen animation on load
- Responsive card layouts for mobile
- Corner logo after splash
- Status messages for turn indication

## Development

To develop locally:
```bash
# No build process - simply open in browser
open index.html
```

## Deployment

Deployment is automated via GitHub Actions:
- Pushes to `main` branch trigger deployment to GitHub Pages
- The workflow uploads the entire repository as static files
- No build step required - files are served directly

## File Structure

```
/
├── index.html          # Main game interface
├── script.js          # Game logic and state management
├── style.css          # Responsive styling
├── images/
│   └── package.png    # Logo/branding image
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Pages deployment
```