import { ZoningTypes } from './BuildingTypes.js';

export const PLAN_PARAM = 'p';
const VERSION = 1;

const ZONE_ID_TO_CODE = {
    smahus: 1,
    klassisk: 2,
    lamellhus: 3,
    hoghus: 4,
    tata: 5,
    mycket: 6
};

const CODE_TO_ZONE = {};
for (const zone of Object.values(ZoningTypes)) {
    const code = ZONE_ID_TO_CODE[zone.id];
    if (code) CODE_TO_ZONE[code] = zone;
}

function toBase64Url(bytes) {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
    if (!str || !/^[A-Za-z0-9_-]+$/.test(str)) return null;

    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    try {
        const binary = atob(padded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    } catch {
        return null;
    }
}

export function encodePlan(grid, cols, rows) {
    const deltas = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = grid[y][x];
            if (cell.buildable === false) continue;
            if (cell.id === ZoningTypes.WOODLAND.id) continue;

            const code = ZONE_ID_TO_CODE[cell.id];
            if (!code) continue;

            deltas.push({ index: y * cols + x, code });
        }
    }

    const bytes = new Uint8Array(3 + deltas.length * 3);
    bytes[0] = VERSION;
    bytes[1] = (deltas.length >> 8) & 0xff;
    bytes[2] = deltas.length & 0xff;

    deltas.forEach((delta, i) => {
        const offset = 3 + i * 3;
        bytes[offset] = (delta.index >> 8) & 0xff;
        bytes[offset + 1] = delta.index & 0xff;
        bytes[offset + 2] = delta.code;
    });

    return toBase64Url(bytes);
}

export function decodePlan(encoded) {
    const bytes = fromBase64Url(encoded);
    if (!bytes || bytes.length < 3 || bytes[0] !== VERSION) return null;

    const count = (bytes[1] << 8) | bytes[2];
    if (count < 0 || bytes.length !== 3 + count * 3) return null;

    const deltas = [];

    for (let i = 0; i < count; i++) {
        const offset = 3 + i * 3;
        const index = (bytes[offset] << 8) | bytes[offset + 1];
        const code = bytes[offset + 2];
        const zone = CODE_TO_ZONE[code];

        if (!zone) return null;
        deltas.push({ index, zone });
    }

    return deltas;
}

export function applyPlanToGameState(gameState, encoded) {
    const deltas = decodePlan(encoded);
    if (!deltas) return false;

    const { cols, rows } = gameState;
    const maxCells = cols * rows;

    gameState.resetToInitial();

    for (const { index, zone } of deltas) {
        if (index < 0 || index >= maxCells) return false;

        const x = index % cols;
        const y = Math.floor(index / cols);
        const cell = gameState.grid[y][x];

        if (cell.buildable === false) continue;
        gameState.grid[y][x] = { ...zone };
    }

    gameState.calculateTotal();
    return true;
}

export function buildShareUrl(grid, cols, rows) {
    const url = new URL(window.location.href);
    url.searchParams.set(PLAN_PARAM, encodePlan(grid, cols, rows));
    return url.toString();
}

export function loadPlanFromUrl(gameState) {
    const encoded = new URL(window.location.href).searchParams.get(PLAN_PARAM);
    if (!encoded) return false;
    return applyPlanToGameState(gameState, encoded);
}
