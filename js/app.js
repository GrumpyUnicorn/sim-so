import { GameState } from './GameState.js';
import { getSharedGreetingFromUrl, loadPlanFromUrl } from './PlanShare.js';
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

function initSharedSplashContent() {
    const { name, message } = getSharedGreetingFromUrl();
    if (!name && !message) return false;

    const thirdBubble = document.querySelector('.splash-bubble--third p');
    const fourthBubble = document.querySelector('.splash-bubble--fourth p');
    const fifthBubble = document.querySelector('.splash-bubble--fifth');

    if (!thirdBubble || !fourthBubble || !fifthBubble) return false;

    if (name && message) {
        thirdBubble.textContent =
            `${name} har använt den här förenklade stadsplaningssimulatorn för att göra ett eget förslag. ${name} beskriver sitt förslag så här: "${message}".`;
    } else if (name) {
        thirdBubble.textContent =
            `${name} har använt den här förenklade stadsplaningssimulatorn för att göra ett eget förslag. Klicka för att se det.`;
    } else {
        thirdBubble.textContent =
            `Den som skickade den här länken till dig har använt den här förenklade stadsplaningssimulatorn för att göra ett eget förslag som den beskriver så här: "${message}"`;
    }

    fourthBubble.textContent =
        'Du kan också planera en stad du tror bli bra och se hur många bostäder det blir. Simulatorn förenklar naturligtvis – i verkligheten är området naturligtvis inte en stor rektangel.';
    fifthBubble.style.display = 'none';

    return true;
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
    const hasSharedGreeting = initSharedSplashContent();
    initSplashScreen();
    initTileThemeSelector();

    const gameState = new GameState(26, 11);
    loadPlanFromUrl(gameState);
    const uiManager = new UIManager(gameState, { showSharedGreeting: !hasSharedGreeting });
});
