import { StaticFeatures, ZoningTypes } from './BuildingTypes.js';

export class GameState {
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

        // Station is visually positioned outside the grid on the East border.

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
