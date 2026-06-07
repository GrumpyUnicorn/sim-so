/** Meters per grid cell (≈ 1 ha tiles; density is quoted per hectare). */
export const METERS_PER_CELL = 100;

/** Max distance to green space for the 3-30-300 greenspace rule. */
export const PARK_ACCESS_RADIUS_M = 300;

export const GRONSKA_TOOLTIP = {
    intro: 'För att dina invånare ska må bra och staden ska klara klimatkrisen måste du uppfylla tre gröna mål:',
    goals: [
        {
            label: '3 träd',
            text: 'Varje invånare ska kunna se minst 3 träd från sitt fönster.'
        },
        {
            label: '30 % krontäckning',
            text: 'Minst 30 % av varje stadsdel måste täckas av lummiga trädkronor.'
        },
        {
            label: '300 meter',
            text: 'Ingen invånare ska ha mer än 300 meter till närmaste park.'
        }
    ],
    footer: 'I spelet antas 3 och 30 hanteras lokalt, men 300-målet är ditt ansvar. För att rymma lek, vila, motion och biologisk mångfald duger inte småparker.'
};

const PARK_CELL_IDS = new Set(['woodland', 'pond']);

function isParkCell(cell) {
    return cell && PARK_CELL_IDS.has(cell.id);
}

function isResidentialCell(cell) {
    return cell && (cell.density || 0) > 0;
}

function distanceMeters(x1, y1, x2, y2) {
    const dx = (x1 - x2) * METERS_PER_CELL;
    const dy = (y1 - y2) * METERS_PER_CELL;
    return Math.hypot(dx, dy);
}

/**
 * True when every residential cell has park (woodland/pond) within 300 m.
 * Vacuously true if there are no dwellings yet.
 */
export function allDwellingsWithinParkRadius(grid, cols, rows) {
    const parks = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (isParkCell(grid[y][x])) parks.push({ x, y });
        }
    }

    const residential = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (isResidentialCell(grid[y][x])) residential.push({ x, y });
        }
    }

    if (residential.length === 0) return true;
    if (parks.length === 0) return false;

    return residential.every(({ x, y }) =>
        parks.some((park) => distanceMeters(x, y, park.x, park.y) <= PARK_ACCESS_RADIUS_M)
    );
}

export function updateGreenspaceIndicator(element, grid, cols, rows) {
    if (!element) return;

    const ok = allDwellingsWithinParkRadius(grid, cols, rows);
    setIndicatorState(element, ok);
}

/** Fyrspårsavtalet: green once total new dwellings exceeds this threshold. */
export const FYRSPARSAVTALET_DWELLING_THRESHOLD = 21500;

export function isFyrsparsavtaletMet(totalDwellings) {
    return totalDwellings > FYRSPARSAVTALET_DWELLING_THRESHOLD;
}

export function updateFyrsparsavtaletIndicator(element, totalDwellings) {
    if (!element) return;
    setIndicatorState(element, isFyrsparsavtaletMet(totalDwellings));
}

function setIndicatorState(element, ok) {
    element.classList.toggle('info-indicator--ok', ok);
    element.classList.toggle('info-indicator--fail', !ok);
    element.setAttribute('aria-pressed', ok ? 'true' : 'false');
}
