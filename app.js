const ZoningTypes = {
    WOODLAND: { id: 'woodland', name: 'Woodland/Park', density: 0, colorClass: 'cell-woodland', colorHex: '#8ab060' },
    SMAHUS: { id: 'smahus', name: 'Småhus', density: 15, colorClass: 'cell-smahus', colorHex: '#f2c94c' },
    RADHUS: { id: 'radhus', name: 'Radhus', density: 30, colorClass: 'cell-radhus', colorHex: '#f2994a' },
    KLASSISK: { id: 'klassisk', name: 'Klassisk trädgårdstad', density: 50, colorClass: 'cell-klassisk', colorHex: '#d4a373' },
    HOGHUS: { id: 'hoghus', name: 'Höghus', density: 100, colorClass: 'cell-hoghus', colorHex: '#56ccf2' },
    TATA_HOGHUS: { id: 'tata', name: 'Täta höghus', density: 150, colorClass: 'cell-tata', colorHex: '#2f80ed' },
    MYCKET_TATA: { id: 'mycket', name: 'Mycket täta höghus', density: 250, colorClass: 'cell-mycket', colorHex: '#9b51e0' }
};

const StaticFeatures = {
    EMPTY: { id: 'empty', density: 0, colorClass: 'cell-empty' },
    BOULEVARD: { id: 'boulevard', density: 0, colorClass: 'cell-boulevard', buildable: false, name: 'Boulevard' },
    STATION: { id: 'station', density: 0, colorClass: 'cell-station', buildable: false, name: 'Station' },
    BLOCKED: { id: 'blocked', density: 0, colorClass: 'cell-blocked', buildable: false, name: 'Existerande Sävja' },
    POND: { id: 'pond', density: 0, colorClass: 'cell-pond', buildable: false, name: 'Stordammen' }
};

class GameState {
    constructor(cols = 26, rows = 10) {
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.totalDwellings = 0;
        
        this.initGrid();
        this.applyStaticFeatures();
        this.calculateTotal();
    }

    initGrid() {
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                row.push({ ...ZoningTypes.WOODLAND });
            }
            this.grid.push(row);
        }
    }

    applyStaticFeatures() {
        const BOULEVARD_ROW = 3;
        
        // Boulevard: horizontal road spanning all cols
        for (let x = 0; x < this.cols; x++) {
            this.grid[BOULEVARD_ROW][x] = { ...StaticFeatures.BOULEVARD };
        }

        // Station is now visually positioned outside the grid on the East Border

        // Blocked Areas: Nuvarande Sävja
        // 3 squares just south of the boulevard (row 4), with 2 squares of wood to the left (cols 2, 3, 4)
        this.grid[BOULEVARD_ROW + 1][2] = { ...StaticFeatures.BLOCKED };
        this.grid[BOULEVARD_ROW + 1][3] = { ...StaticFeatures.BLOCKED };
        this.grid[BOULEVARD_ROW + 1][4] = { ...StaticFeatures.BLOCKED };

        // Additional Sävja north of the boulevard: from 1-based (x:3, y:1) to (x:5, y:2)
        // Which translates to 0-based indices: cols 2-4, rows 0-1
        for (let y = 0; y <= 1; y++) {
            for (let x = 2; x <= 4; x++) {
                this.grid[y][x] = { ...StaticFeatures.BLOCKED };
            }
        }

        // Stordammen (Beautiful Forest Pond)
        // 9 squares in from the right (col 17) and occupying the bottom two squares (rows 9-10)
        const stordammenCol = 26 - 9; // 17
        this.grid[9][stordammenCol] = { ...StaticFeatures.POND };
        this.grid[10][stordammenCol] = { ...StaticFeatures.POND };
    }

    setZone(x, y, zoneType, isClick = false) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
        
        const cell = this.grid[y][x];
        
        // Cannot build over static unbuildable features
        if (cell.buildable === false) {
            return false;
        }

        // Toggle back to woodland on click if it's already the selected zone
        if (isClick && cell.id === zoneType.id && cell.id !== ZoningTypes.WOODLAND.id) {
            this.grid[y][x] = { ...ZoningTypes.WOODLAND };
        } else {
            this.grid[y][x] = { ...zoneType };
        }
        
        this.calculateTotal();
        return true;
    }

    calculateTotal() {
        let total = 0;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                total += this.grid[y][x].density || 0;
            }
        }
        this.totalDwellings = total;
    }
}

class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeTool = ZoningTypes.SMAHUS; // Default tool
        this.gridElement = document.getElementById('game-grid');
        this.dwellingsElement = document.getElementById('total-dwellings');
        this.toolsContainer = document.getElementById('tools-container');
        this.tooltip = document.getElementById('cell-tooltip');
        
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
        // 11 rows total: 3 normal, 1 half-height (boulevard), 7 normal
        this.gridElement.style.gridTemplateRows = `repeat(3, 1fr) 0.5fr repeat(7, 1fr)`;

        for (let y = 0; y < this.gameState.rows; y++) {
            const rowElements = [];
            for (let x = 0; x < this.gameState.cols; x++) {
                const cell = document.createElement('div');
                const cellData = this.gameState.grid[y][x];
                cell.className = `grid-cell ${cellData.colorClass}`;
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Tooltip on hover for named static features
                if (cellData.name) {
                    cell.addEventListener('mouseenter', (e) => this.showTooltip(cellData.name, e));
                    cell.addEventListener('mousemove', (e) => this.moveTooltip(e));
                    cell.addEventListener('mouseleave', () => this.hideTooltip());
                }

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
        }
    }

    showTooltip(text, e) {
        this.tooltip.textContent = text;
        this.tooltip.style.display = 'block';
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
            cellElement.className = `grid-cell ${cellData.colorClass}`;
            // Update counter
            this.updateCounter();
        }
    }

    updateCounter() {
        this.dwellingsElement.textContent = this.gameState.totalDwellings.toLocaleString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState(26, 11);
    const uiManager = new UIManager(gameState);

    // Splash screen dismiss on click
    const splash = document.getElementById('splash-screen');
    splash.addEventListener('click', () => {
        splash.classList.add('hidden');
        setTimeout(() => { splash.style.display = 'none'; }, 400);
    });
});
