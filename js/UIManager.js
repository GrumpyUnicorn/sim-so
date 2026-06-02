import {
    CONGESTION_SCALE_MAX,
    CONGESTION_THRESHOLDS,
    SCALE_TOOLTIPS,
    ZONING_IDS,
    ZoningTypes
} from './BuildingTypes.js';

export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeTool = ZoningTypes.SMAHUS; // Default tool
        this.gridElement = document.getElementById('game-grid');
        this.dwellingsElement = document.getElementById('total-dwellings');
        this.toolsContainer = document.getElementById('tools-container');
        this.tooltip = document.getElementById('cell-tooltip');
        this.congestionMeter = document.getElementById('congestion-meter');
        this.congestionIndicator = document.getElementById('congestion-indicator');
        this.zoneSweet = document.getElementById('zone-sweet');
        this.zoneBilvagg = document.getElementById('zone-bilvagg');
        this.zoneKollektivvagg = document.getElementById('zone-kollektivvagg');

        this.isGridlocked = false;
        
        this.cellElements = [];
        this.isMouseDown = false;
        
        this.initTools();
        this.initGrid();
        this.initCongestionMeter();
        this.setupEventListeners();
        this.updateCongestionMeter();
    }

    initCongestionMeter() {
        const bindScaleTooltip = (el, text) => {
            el.addEventListener('mouseenter', (e) => this.showScaleTooltip(text, e));
            el.addEventListener('mousemove', (e) => this.moveTooltip(e));
            el.addEventListener('mouseleave', () => this.hideTooltip());
        };
        bindScaleTooltip(this.zoneSweet, SCALE_TOOLTIPS.sweet);
        bindScaleTooltip(this.zoneBilvagg, SCALE_TOOLTIPS.bilvagg);
        bindScaleTooltip(this.zoneKollektivvagg, SCALE_TOOLTIPS.kollektivvagg);
    }

    showScaleTooltip(text, e) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--scale';
        this.tooltip.textContent = text;
        this.tooltip.style.display = 'block';
        requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
        this.moveTooltip(e);
    }

    updateCongestionMeter() {
        const total = this.gameState.totalDwellings;
        const pct = Math.min(100, (total / CONGESTION_SCALE_MAX) * 100);
        this.congestionIndicator.style.left = `${pct}%`;

        const overBilvagg = total > CONGESTION_THRESHOLDS.BILVAGG;
        const overKollektivvagg = total > CONGESTION_THRESHOLDS.KOLLEKTIVVAGG;

        this.isGridlocked = overKollektivvagg;

        this.congestionMeter.classList.toggle('congestion-meter--bilvagg-warning', overBilvagg && !overKollektivvagg);
        this.congestionMeter.classList.toggle('congestion-meter--kollektivvagg-warning', overKollektivvagg);
        this.congestionMeter.classList.toggle('congestion-meter--gridlocked', this.isGridlocked);

        if (overKollektivvagg) {
            this.checkTrafficCrisis(total);
        } else if (overBilvagg) {
            this.checkTrafficCrisis(total);
        }
    }

    checkTrafficCrisis(totalBostader) {
        if (totalBostader > CONGESTION_THRESHOLDS.KOLLEKTIVVAGG) {
            console.warn(`[Kollektivväggen] ${totalBostader} bostäder — systemkollaps för gummihjul. Spårväg krävs.`);
        } else if (totalBostader > CONGESTION_THRESHOLDS.BILVAGG) {
            console.warn(`[Bilväggen] ${totalBostader} bostäder — bilkörfälten har slagit i taket.`);
        }
    }

    initTools() {
        Object.values(ZoningTypes).forEach(zone => {
            const btn = document.createElement('button');
            btn.className = `tool-btn ${this.activeTool.id === zone.id ? 'active' : ''}`;
            btn.dataset.toolId = zone.id;
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = zone.name;
            
            const colorBox = document.createElement('div');
            colorBox.className = `tool-color-box ${zone.colorClass} cell-tier-${zone.density}`;

            btn.appendChild(nameSpan);
            btn.appendChild(colorBox);

            btn.addEventListener('mouseenter', (e) => this.showZoneTooltip(zone, e));
            btn.addEventListener('mousemove', (e) => this.moveTooltip(e));
            btn.addEventListener('mouseleave', () => this.hideTooltip());

            btn.addEventListener('click', () => this.setActiveTool(zone, btn));
            this.toolsContainer.appendChild(btn);
        });
    }

    getTierClassForCell(cellData) {
        if (!cellData || !ZONING_IDS.has(cellData.id)) return '';
        return `cell-tier-${cellData.density}`;
    }

    setActiveTool(zone, btnElement) {
        this.activeTool = zone;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    initGrid() {
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gameState.cols}, 1fr)`;
        // 11 rows total: 3 normal, 1 half-height (boulevard), 7 normal
        this.gridElement.style.gridTemplateRows = `repeat(3, 1fr) 0.5fr repeat(7, 1fr)`;

        for (let y = 0; y < this.gameState.rows; y++) {
            const rowElements = [];
            for (let x = 0; x < this.gameState.cols; x++) {
                const cell = document.createElement('div');
                const cellData = this.gameState.grid[y][x];
                const tierClass = this.getTierClassForCell(cellData);
                cell.className = `grid-cell ${cellData.colorClass} ${tierClass}`.trim();
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                cell.addEventListener('mouseenter', (e) => this.handleCellTooltip(x, y, e));
                cell.addEventListener('mousemove', (e) => this.moveTooltip(e));
                cell.addEventListener('mouseleave', () => this.hideTooltip());

                // Event listeners for drawing
                cell.addEventListener('mousedown', (e) => this.handleCellInteraction(x, y, cell, e));
                cell.addEventListener('mouseenter', (e) => this.handleCellEnter(x, y, cell, e));

                this.gridElement.appendChild(cell);
                rowElements.push(cell);
            }
            this.cellElements.push(rowElements);
        }
    }

    setupEventListeners() {
        // Track mouse down state for drag-to-draw
        document.addEventListener('mousedown', () => this.isMouseDown = true);
        document.addEventListener('mouseup', () => this.isMouseDown = false);

        // Prevent default drag behavior to avoid interfering with drawing
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }

    handleCellInteraction(x, y, cellElement, e) {
        // Only trigger on left click
        if (e.button !== 0) return;
        this.applyZone(x, y, cellElement, true);
    }

    handleCellEnter(x, y, cellElement, e) {
        if (this.isMouseDown) {
            this.applyZone(x, y, cellElement, false);
            this.handleCellTooltip(x, y, e);
        }
    }

    handleCellTooltip(x, y, e) {
        const cellData = this.gameState.grid[y][x];
        if (cellData?.name) this.showTooltip(cellData.name, e);
    }

    showTooltip(text, e) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip';
        const label = document.createElement('span');
        label.textContent = text;
        this.tooltip.appendChild(label);
        this.tooltip.style.display = 'block';
        requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
        this.moveTooltip(e);
    }

    showZoneTooltip(zone, e) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--zone';
        const density = document.createElement('span');
        density.className = 'tooltip-density';
        density.textContent = `${zone.density} Bostäder per hektar`;
        this.tooltip.appendChild(density);
        this.tooltip.classList.add('cell-tooltip--detailed');
        (zone.tooltip || []).forEach((section) => {
            const block = document.createElement('div');
            block.className = 'tooltip-section';
            const label = document.createElement('span');
            label.className = 'tooltip-label';
            label.textContent = `${section.label}: `;
            const text = document.createElement('span');
            text.className = 'tooltip-text';
            text.textContent = section.text;
            block.appendChild(label);
            block.appendChild(text);
            this.tooltip.appendChild(block);
        });
        this.tooltip.style.display = 'flex';
        requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const offset = 14;
        this.tooltip.style.left = (e.clientX + offset) + 'px';
        this.tooltip.style.top = (e.clientY + offset) + 'px';
    }

    hideTooltip() {
        this.tooltip.style.opacity = '0';
        this.tooltip.style.display = 'none';
    }

    applyZone(x, y, cellElement, isClick = false) {
        if (this.gameState.setZone(x, y, this.activeTool, isClick)) {
            const cellData = this.gameState.grid[y][x];
            // Update cell visual
            const tierClass = this.getTierClassForCell(cellData);
            cellElement.className = `grid-cell ${cellData.colorClass} ${tierClass}`.trim();
            // Update counter
            this.updateCounter();
        }
    }

    updateCounter() {
        this.dwellingsElement.textContent = this.gameState.totalDwellings.toLocaleString('sv-SE');
        this.updateCongestionMeter();
    }
}
