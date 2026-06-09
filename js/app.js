import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';

const TILE_THEME_STORAGE_KEY = 'sim-se-tile-theme';
const DEFAULT_TILE_THEME = 'topdown';

function initTileThemeSelector() {
    const select = document.getElementById('tile-theme-select');
    if (!select) return;

    const saved = localStorage.getItem(TILE_THEME_STORAGE_KEY) || DEFAULT_TILE_THEME;
    const theme = select.querySelector(`option[value="${saved}"]`) ? saved : DEFAULT_TILE_THEME;

    document.documentElement.dataset.tileTheme = theme;
    select.value = theme;

    select.addEventListener('change', () => {
        document.documentElement.dataset.tileTheme = select.value;
        localStorage.setItem(TILE_THEME_STORAGE_KEY, select.value);
    });
}

function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    splash.addEventListener('click', () => {
        splash.classList.add('hidden');
        setTimeout(() => { splash.style.display = 'none'; }, 400);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initTileThemeSelector();

    const gameState = new GameState(26, 11);
    const uiManager = new UIManager(gameState);
});
