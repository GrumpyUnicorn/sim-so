import { ZoningTypes } from './BuildingTypes.js';

export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeTool = ZoningTypes.SMAHUS; // Default tool
        this.gridElement = document.getElementById('game-grid');
        this.dwellingsElement = document.getElementById('total-dwellings');
        this.toolsContainer = document.getElementById('tools-container');
        
        this.cellElements = [];
        this.isMouseDown = false;
        
        this.initTools();
        this.initGrid();
        this.setupEventListeners();
    }

    initTools() {
        Object.values(ZoningTypes).forEach(zone => {
            const btn = document.createElement('button');
            btn.className = `tool-btn ${this.activeTool.id === zone.id ? 'active' : ''}`;
            btn.dataset.toolId = zone.id;
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = zone.name;
            
            const colorBox = document.createElement('div');
            colorBox.className = 'tool-color-box';
            colorBox.style.backgroundColor = zone.colorHex;

            btn.appendChild(nameSpan);
            btn.appendChild(colorBox);

            btn.addEventListener('click', () => this.setActiveTool(zone, btn));
            this.toolsContainer.appendChild(btn);
        });
    }

    setActiveTool(zone, btnElement) {
        this.activeTool = zone;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    initGrid() {
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gameState.cols}, 1fr)`;
        this.gridElement.style.gridTemplateRows = `repeat(${this.gameState.rows}, 1fr)`;

        for (let y = 0; y < this.gameState.rows; y++) {
            const rowElements = [];
            for (let x = 0; x < this.gameState.cols; x++) {
                const cell = document.createElement('div');
                cell.className = `grid-cell ${this.gameState.grid[y][x].colorClass}`;
                cell.dataset.x = x;
                cell.dataset.y = y;
                
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
    }

    handleCellInteraction(x, y, cellElement, e) {
        // Only trigger on left click
        if (e.button !== 0) return;
        this.applyZone(x, y, cellElement);
    }

    handleCellEnter(x, y, cellElement, e) {
        if (this.isMouseDown) {
            this.applyZone(x, y, cellElement);
        }
    }

    applyZone(x, y, cellElement) {
        if (this.gameState.setZone(x, y, this.activeTool)) {
            // Update cell visual
            cellElement.className = `grid-cell ${this.gameState.grid[y][x].colorClass}`;
            // Update counter
            this.updateCounter();
        }
    }

    updateCounter() {
        this.dwellingsElement.textContent = this.gameState.totalDwellings.toLocaleString();
    }
}
