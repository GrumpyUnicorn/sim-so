import {
    FYRSPARSAVTALET_TOOLTIP,
    GRONSKA_TOOLTIP,
    updateFyrsparsavtaletIndicator,
    updateGreenspaceIndicator
} from './InfoIndicators.js';
import { ZONING_IDS, ZoningTypes } from './BuildingTypes.js';

export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeTool = ZoningTypes.SMAHUS; // Default tool
        this.gridElement = document.getElementById('game-grid');
        this.dwellingsElement = document.getElementById('total-dwellings');
        this.toolsContainer = document.getElementById('tools-container');
        this.tooltip = document.getElementById('cell-tooltip');
        this.gronskaIndicator = document.getElementById('indicator-gronska');
        this.fyrsparsavtaletIndicator = document.getElementById('indicator-fyrsparsavtalet');

        this.cellElements = [];
        this.isMouseDown = false;

        this.initTools();
        this.initGrid();
        this.initInfoIndicatorTooltips();
        this.setupEventListeners();
        this.updateInfoIndicators();
    }

    initInfoIndicatorTooltips() {
        if (this.gronskaIndicator) {
            this.gronskaIndicator.addEventListener('mouseenter', (e) => this.showGronskaTooltip(e));
            this.gronskaIndicator.addEventListener('mousemove', (e) => this.moveTooltip(e));
            this.gronskaIndicator.addEventListener('mouseleave', () => this.hideTooltip());
        }
        if (this.fyrsparsavtaletIndicator) {
            this.fyrsparsavtaletIndicator.addEventListener('mouseenter', (e) => this.showFyrsparsavtaletTooltip(e));
            this.fyrsparsavtaletIndicator.addEventListener('mousemove', (e) => this.moveTooltip(e));
            this.fyrsparsavtaletIndicator.addEventListener('mouseleave', () => this.hideTooltip());
        }
    }

    showGronskaTooltip(e) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--zone cell-tooltip--detailed';

        const intro = document.createElement('p');
        intro.className = 'tooltip-section';
        intro.textContent = GRONSKA_TOOLTIP.intro;
        this.tooltip.appendChild(intro);

        GRONSKA_TOOLTIP.goals.forEach((goal) => {
            const block = document.createElement('div');
            block.className = 'tooltip-section';
            const label = document.createElement('span');
            label.className = 'tooltip-label';
            label.textContent = `${goal.label}: `;
            const text = document.createElement('span');
            text.className = 'tooltip-text';
            text.textContent = goal.text;
            block.appendChild(label);
            block.appendChild(text);
            this.tooltip.appendChild(block);
        });

        const footer = document.createElement('p');
        footer.className = 'tooltip-section';
        footer.textContent = GRONSKA_TOOLTIP.footer;
        this.tooltip.appendChild(footer);

        this.tooltip.style.display = 'flex';
        requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
        this.moveTooltip(e);
    }

    showFyrsparsavtaletTooltip(e) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--zone cell-tooltip--detailed';

        FYRSPARSAVTALET_TOOLTIP.forEach((paragraph) => {
            const block = document.createElement('p');
            block.className = 'tooltip-section';
            block.textContent = paragraph;
            this.tooltip.appendChild(block);
        });

        this.tooltip.style.display = 'flex';
        requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
        this.moveTooltip(e);
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
        this.updateInfoIndicators();
    }

    updateInfoIndicators() {
        const { grid, cols, rows, totalDwellings } = this.gameState;
        updateGreenspaceIndicator(this.gronskaIndicator, grid, cols, rows);
        updateFyrsparsavtaletIndicator(this.fyrsparsavtaletIndicator, totalDwellings);
    }
}
