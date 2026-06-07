import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';

const TILE_THEME_STORAGE_KEY = 'sim-se-tile-theme';
const DEFAULT_TILE_THEME = 'topdown';
const BOULEVARD_STORAGE_KEY = 'sim-se-boulevard';
const DEFAULT_BOULEVARD = 'rak';
const BOULEVARD_MODES = new Set(['rak', 'bruten']);
const KOLLEKTIVTRAFIK_STORAGE_KEY = 'sim-se-kollektivtrafik';
const DEFAULT_KOLLEKTIVTRAFIK = 'buss';
const KOLLEKTIVTRAFIK_MODES = new Set(['buss', 'brt', 'sparvagn']);

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

function initSegmentFlipper(flipperId, storageKey, defaultMode, validModes) {
    const flipper = document.getElementById(flipperId);
    if (!flipper) return;

    const options = [...flipper.querySelectorAll('.segment-flipper__option[data-mode]')];
    const saved = localStorage.getItem(storageKey);
    const initialMode = validModes.has(saved) ? saved : defaultMode;

    function setMode(mode) {
        if (!validModes.has(mode)) return;

        options.forEach((option) => {
            const active = option.dataset.mode === mode;
            option.classList.toggle('segment-flipper__option--active', active);
            option.setAttribute('aria-checked', active ? 'true' : 'false');
        });

        flipper.dataset.mode = mode;
        localStorage.setItem(storageKey, mode);
    }

    options.forEach((option) => {
        option.addEventListener('click', () => setMode(option.dataset.mode));
    });

    setMode(initialMode);
}

document.addEventListener('DOMContentLoaded', () => {
    initTileThemeSelector();
    initSegmentFlipper('boulevard-flipper', BOULEVARD_STORAGE_KEY, DEFAULT_BOULEVARD, BOULEVARD_MODES);
    initSegmentFlipper(
        'kollektivtrafik-flipper',
        KOLLEKTIVTRAFIK_STORAGE_KEY,
        DEFAULT_KOLLEKTIVTRAFIK,
        KOLLEKTIVTRAFIK_MODES
    );

    const gameState = new GameState(26, 11);
    const uiManager = new UIManager(gameState);
});
