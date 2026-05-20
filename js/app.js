import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState(26, 10);
    const uiManager = new UIManager(gameState);
});
