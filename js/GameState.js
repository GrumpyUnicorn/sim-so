import { StaticFeatures, ZoningTypes } from './BuildingTypes.js';

export class GameState {
    constructor(cols = 26, rows = 10) {
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.totalDwellings = 0;
        
        this.initGrid();
        this.applyStaticFeatures();
    }

    initGrid() {
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                row.push({ ...StaticFeatures.EMPTY });
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

        // Station: intersects Boulevard and East border (col 25)
        this.grid[BOULEVARD_ROW][this.cols - 1] = { ...StaticFeatures.STATION };

        // Blocked Areas: North-West (Sävja)
        // Let's block rows 0-1, cols 0-4
        for(let y = 0; y <= 1; y++) {
            for(let x = 0; x <= 4; x++) {
                this.grid[y][x] = { ...StaticFeatures.BLOCKED };
            }
        }

        // Blocked Areas: South-East (Stordammen)
        // Let's block rows 8-9, cols 21-25
        for(let y = 8; y <= 9; y++) {
            for(let x = 21; x <= 25; x++) {
                this.grid[y][x] = { ...StaticFeatures.BLOCKED };
            }
        }
    }

    setZone(x, y, zoneType) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
        
        const cell = this.grid[y][x];
        
        // Cannot build over static unbuildable features
        if (cell.buildable === false) {
            return false;
        }

        this.grid[y][x] = { ...zoneType };
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
