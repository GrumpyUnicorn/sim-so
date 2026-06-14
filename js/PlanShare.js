import { ZoningTypes } from './BuildingTypes.js';

export const PLAN_PARAM = 'p';

const PLAN_VERSION = 2;
const SHARE_VERSION = 3;
const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 500;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

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

function getZoneCode(cell) {
    if (cell.id === ZoningTypes.WOODLAND.id) return 0;
    return ZONE_ID_TO_CODE[cell.id] ?? null;
}

function forEachBuildableCell(grid, cols, rows, callback) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = grid[y][x];
            if (cell.buildable === false) continue;
            callback(cell, x, y);
        }
    }
}

function buildRuns(grid, cols, rows) {
    const runs = [];
    let runCode = null;
    let runLength = 0;
    let buildableCount = 0;

    forEachBuildableCell(grid, cols, rows, (cell) => {
        const code = getZoneCode(cell);
        if (code === null) return;

        buildableCount += 1;

        if (code === runCode) {
            runLength += 1;
        } else {
            if (runLength > 0) runs.push({ length: runLength, code: runCode });
            runCode = code;
            runLength = 1;
        }
    });

    if (runLength > 0) runs.push({ length: runLength, code: runCode });

    const usedCells = runs.reduce((sum, run) => sum + run.length, 0);
    if (usedCells !== buildableCount) return null;

    return runs;
}

function packRun(length, code) {
    if (length < 1 || length > 0x0fff || code < 0 || code > 0x07) return null;
    return (length << 4) | code;
}

function unpackRun(packed) {
    return {
        length: packed >> 4,
        code: packed & 0x0f
    };
}

function encodePlanBytes(grid, cols, rows) {
    const runs = buildRuns(grid, cols, rows);
    if (!runs) return null;

    const bytes = new Uint8Array(3 + runs.length * 2);
    bytes[0] = PLAN_VERSION;
    bytes[1] = (runs.length >> 8) & 0xff;
    bytes[2] = runs.length & 0xff;

    for (let i = 0; i < runs.length; i++) {
        const packed = packRun(runs[i].length, runs[i].code);
        if (packed === null) return null;

        const offset = 3 + i * 2;
        bytes[offset] = (packed >> 8) & 0xff;
        bytes[offset + 1] = packed & 0xff;
    }

    return bytes;
}

function decodePlanBytes(bytes) {
    if (!bytes || bytes.length < 3 || bytes[0] !== PLAN_VERSION) return null;

    const runCount = (bytes[1] << 8) | bytes[2];
    if (runCount < 1 || bytes.length !== 3 + runCount * 2) return null;

    const runs = [];

    for (let i = 0; i < runCount; i++) {
        const offset = 3 + i * 2;
        const packed = (bytes[offset] << 8) | bytes[offset + 1];
        const run = unpackRun(packed);

        if (run.length < 1 || (run.code !== 0 && !(run.code in CODE_TO_ZONE))) return null;
        runs.push(run);
    }

    return runs;
}

function encodeUtf8Section(text, maxLength) {
    const trimmed = text.trim().slice(0, maxLength);
    return textEncoder.encode(trimmed);
}

function readUtf8Section(bytes, offset) {
    if (offset + 2 > bytes.length) return null;

    const length = (bytes[offset] << 8) | bytes[offset + 1];
    const start = offset + 2;
    const end = start + length;

    if (length < 0 || end > bytes.length) return null;

    return {
        text: textDecoder.decode(bytes.subarray(start, end)),
        nextOffset: end
    };
}

function parseSharePayload(encoded) {
    const bytes = fromBase64Url(encoded);
    if (!bytes || bytes.length < 3) return null;

    if (bytes[0] === SHARE_VERSION) {
        if (bytes.length < 5) return null;

        const planLength = (bytes[1] << 8) | bytes[2];
        const planStart = 3;
        const planEnd = planStart + planLength;

        if (planLength < 3 || planEnd > bytes.length) return null;

        const runs = decodePlanBytes(bytes.subarray(planStart, planEnd));
        if (!runs) return null;

        let offset = planEnd;
        const nameSection = readUtf8Section(bytes, offset);
        if (!nameSection) return null;

        offset = nameSection.nextOffset;
        const messageSection = readUtf8Section(bytes, offset);
        if (!messageSection) return null;

        if (messageSection.nextOffset !== bytes.length) return null;

        return {
            runs,
            name: nameSection.text,
            message: messageSection.text
        };
    }

    if (bytes[0] === PLAN_VERSION) {
        const runs = decodePlanBytes(bytes);
        if (!runs) return null;

        return {
            runs,
            name: '',
            message: ''
        };
    }

    return null;
}

function applyRunsToGameState(gameState, runs) {
    const { cols, rows } = gameState;
    gameState.resetToInitial();

    let runIndex = 0;
    let remainingInRun = runs[0]?.length ?? 0;

    forEachBuildableCell(gameState.grid, cols, rows, (cell, x, y) => {
        if (remainingInRun === 0) {
            runIndex += 1;
            remainingInRun = runs[runIndex]?.length ?? 0;
        }

        const run = runs[runIndex];
        if (!run || remainingInRun === 0) return;

        if (run.code !== 0) {
            const zone = CODE_TO_ZONE[run.code];
            if (!zone) return;
            gameState.grid[y][x] = { ...zone };
        }

        remainingInRun -= 1;
    });

    const appliedCells = runs.reduce((sum, run) => sum + run.length, 0);
    const buildableCount = gameState.grid.flat().filter((cell) => cell.buildable !== false).length;
    if (appliedCells !== buildableCount) return false;

    gameState.calculateTotal();
    return true;
}

export function encodeSharePayload(grid, cols, rows, { name = '', message = '' } = {}) {
    const planBytes = encodePlanBytes(grid, cols, rows);
    if (!planBytes) return '';

    const nameBytes = encodeUtf8Section(name, MAX_NAME_LENGTH);
    const messageBytes = encodeUtf8Section(message, MAX_MESSAGE_LENGTH);

    const bytes = new Uint8Array(3 + planBytes.length + 4 + nameBytes.length + messageBytes.length);
    bytes[0] = SHARE_VERSION;
    bytes[1] = (planBytes.length >> 8) & 0xff;
    bytes[2] = planBytes.length & 0xff;
    bytes.set(planBytes, 3);

    let offset = 3 + planBytes.length;
    bytes[offset] = (nameBytes.length >> 8) & 0xff;
    bytes[offset + 1] = nameBytes.length & 0xff;
    bytes.set(nameBytes, offset + 2);

    offset += 2 + nameBytes.length;
    bytes[offset] = (messageBytes.length >> 8) & 0xff;
    bytes[offset + 1] = messageBytes.length & 0xff;
    bytes.set(messageBytes, offset + 2);

    return toBase64Url(bytes);
}

export function buildShareUrl(grid, cols, rows, { name = '', message = '' } = {}) {
    const url = new URL(window.location.href);
    url.searchParams.set(PLAN_PARAM, encodeSharePayload(grid, cols, rows, { name, message }));
    url.searchParams.delete('n');
    url.searchParams.delete('m');
    return url.toString();
}

export function getSharedGreetingFromUrl() {
    const encoded = new URL(window.location.href).searchParams.get(PLAN_PARAM);
    if (!encoded) return { name: '', message: '' };

    const payload = parseSharePayload(encoded);
    if (!payload) return { name: '', message: '' };

    return {
        name: payload.name,
        message: payload.message
    };
}

export function loadPlanFromUrl(gameState) {
    const encoded = new URL(window.location.href).searchParams.get(PLAN_PARAM);
    if (!encoded) return false;

    const payload = parseSharePayload(encoded);
    if (!payload) return false;

    return applyRunsToGameState(gameState, payload.runs);
}
