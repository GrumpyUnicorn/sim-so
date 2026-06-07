import { findClosestComparisonStation } from './ComparisonStations.js';

/** Meters per grid cell (≈ 1 ha tiles; density is quoted per hectare). */
export const METERS_PER_CELL = 100;

/** Max distance to green space for the 3-30-300 greenspace rule. */
export const PARK_ACCESS_RADIUS_M = 300;

/** Max distance to Bergsbrunna station for stationsnära bostäder. */
export const STATION_NEAR_RADIUS_M = 400;

/** Station sits on the boulevard, just east of the grid (0-based row index). */
export const STATION_GRID_Y = 3;

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

/** Distance from a cell to the southern border (Lunsens naturreservat), treated as greenery. */
function distanceToSouthBorderMeters(y, rows) {
    return (rows - y) * METERS_PER_CELL;
}

function isWithinParkRadius(x, y, parks, rows) {
    if (distanceToSouthBorderMeters(y, rows) <= PARK_ACCESS_RADIUS_M) return true;
    return parks.some((park) => distanceMeters(x, y, park.x, park.y) <= PARK_ACCESS_RADIUS_M);
}

/**
 * True when every residential cell has park (woodland/pond) or the southern border within 300 m.
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

    return residential.every(({ x, y }) => isWithinParkRadius(x, y, parks, rows));
}

export function updateGreenspaceIndicator(element, grid, cols, rows) {
    if (!element) return;

    const ok = allDwellingsWithinParkRadius(grid, cols, rows);
    setIndicatorState(element, ok);
}

export const FYRSPARSAVTALET_TOOLTIP = [
    'I december 2017 skrevs “Fyrspårsavtalet”. I korthet ställde den socialdemokratiskt ledda regeringen ett ultimatum till den socialdemokratiskt ledda Uppsala kommun. Om ni inte startar ett massivt och tätt bostadsbyggande på 33.000 nya bostäder (utöver de 20.000+ ni redan planerat) så kommer vi inte att bygga fyra järnvägsspår från länsgränsen (söder om Knivsta).',
    '21.500 av dessa nya bostäder ska enligt avtalet ligga i spelområdet. Om du bygger färre än 21.500 bostäder så uppfyller du inte avtalets intentioner.'
];

/** Fyrspårsavtalet: green once total new dwellings exceeds this threshold. */
export const FYRSPARSAVTALET_DWELLING_THRESHOLD = 21500;

export function isFyrsparsavtaletMet(totalDwellings) {
    return totalDwellings >= FYRSPARSAVTALET_DWELLING_THRESHOLD;
}

export function updateFyrsparsavtaletIndicator(element, totalDwellings) {
    if (!element) return;
    setIndicatorState(element, isFyrsparsavtaletMet(totalDwellings));
}

/** Sum dwellings on cells within 400 m of the station (east of boulevard). */
export function countDwellingsNearStation(grid, cols, rows) {
    const stationX = cols;
    const stationY = STATION_GRID_Y;
    let total = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const density = grid[y][x].density || 0;
            if (density <= 0) continue;
            if (distanceMeters(x, y, stationX, stationY) <= STATION_NEAR_RADIUS_M) {
                total += density;
            }
        }
    }

    return total;
}

export function updateStationsnaraIndicator(valueElement, comparisonElement, grid, cols, rows) {
    if (!valueElement) return null;

    const count = countDwellingsNearStation(grid, cols, rows);
    const station = findClosestComparisonStation(count);

    valueElement.textContent = count.toLocaleString('sv-SE');
    if (comparisonElement) {
        comparisonElement.textContent = `(${station.name})`;
    }

    return { station, count };
}

/** Stationsnära bostäder count at half weight for boulevard traffic impact. */
export const STATION_NEAR_TRAFFIC_WEIGHT = 0.5;

/** Effective dwelling count for Trafikläge (stationsnära at 50%). */
export function countTrafficImpactDwellings(totalDwellings, stationsnaraDwellings) {
    return totalDwellings - stationsnaraDwellings * (1 - STATION_NEAR_TRAFFIC_WEIGHT);
}

/** Trafikläge thresholds based on traffic-weighted dwellings. */
export const TRAFIKLAGE_GREEN_MAX = 7000;
export const TRAFIKLAGE_YELLOW_MAX = 12000;

export const TRAFIKLAGE_LABELS = {
    ok: 'Trafiken flyter på',
    warn: 'Bilköer',
    fail: 'systemkolaps'
};

/** @returns {'ok' | 'warn' | 'fail'} */
export function getTrafiklageLevel(trafficDwellings) {
    if (trafficDwellings <= TRAFIKLAGE_GREEN_MAX) return 'ok';
    if (trafficDwellings <= TRAFIKLAGE_YELLOW_MAX) return 'warn';
    return 'fail';
}

export function updateTrafiklageIndicator(element, statusElement, grid, cols, rows, totalDwellings) {
    if (!element) return;

    const stationsnara = countDwellingsNearStation(grid, cols, rows);
    const trafficDwellings = countTrafficImpactDwellings(totalDwellings, stationsnara);
    const level = getTrafiklageLevel(trafficDwellings);
    element.classList.toggle('info-indicator--ok', level === 'ok');
    element.classList.toggle('info-indicator--warn', level === 'warn');
    element.classList.toggle('info-indicator--fail', level === 'fail');
    element.setAttribute('aria-pressed', level === 'ok' ? 'true' : 'false');

    if (statusElement) {
        statusElement.textContent = TRAFIKLAGE_LABELS[level];
    }
}

function setIndicatorState(element, ok) {
    element.classList.toggle('info-indicator--ok', ok);
    element.classList.toggle('info-indicator--fail', !ok);
    element.setAttribute('aria-pressed', ok ? 'true' : 'false');
}
