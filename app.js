const ZoningTypes = {
    WOODLAND: {
        id: 'woodland',
        name: 'Natur & Park',
        density: 0,
        colorClass: 'cell-woodland',
        colorHex: '#8ab060',
        tooltip: [
            { label: 'Typologi', text: 'Obebyggd mark / Rekreation' },
            { label: 'Exempel', text: 'Lunsens naturreservat / Stordammen' },
            {
                label: 'Layout & Skala',
                text: 'Skog, ängar och anlagda grönområden som bevaras för rekreation, dagvattenhantering och biologisk mångfald.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Ingen bostadsbebyggelse. Agerar som en grön lunga och skyddszon för de intilliggande stadsdelarna.'
            }
        ]
    },
    SMAHUS: {
        id: 'smahus',
        name: 'Småhus & Egnahem',
        density: 15,
        colorClass: 'cell-smahus',
        colorHex: '#f2c94c',
        tooltip: [
            { label: 'Typologi', text: 'Klassisk småhusbebyggelse / Egnahem' },
            { label: 'Exempel', text: 'Äldre delarna av Bergsbrunna / Nåntuna' },
            {
                label: 'Layout & Skala',
                text: 'Friliggande trävillor och egnahemshus på väl tilltagna tomter. Området präglas av uppvuxna, lummiga trädgårdar med fruktträd, häckar och gott om plats för privat grönska och egenodling.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Fokus ligger på den privata trädgårdsstaden och självständigt boende i fristående hus. Den låga tätheten på ca 15 bostäder per hektar beror på de generösa tomtstorlekarna, vilket ger en luftig struktur med mycket luft, solljus och privat sfär för varje hushåll.'
            }
        ]
    },
    KLASSISK: {
        id: 'klassisk',
        name: 'Klassisk trädgårdsstad',
        density: 30,
        colorClass: 'cell-radhus',
        colorHex: '#f2994a',
        tooltip: [
            { label: 'Typologi', text: 'Äkta trädgårdsstad / Småskalig urbanism' },
            { label: 'Exempel', text: 'Kungsgärdet / Inre Svartbäcken' },
            {
                label: 'Layout & Skala',
                text: 'Inspirerad av engelsk Arts & Crafts-filosofi och hantverksideal. Husen har varierade, omsorgsfullt utformade fasader och placeras tätt mot smala, svängda gator. Detta maximerar utrymmet på baksidan för lummiga privata trädgårdstäppor som sömlöst möter större, gemensamma parkalléer och gröna innergårdar.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Genom att minska de privata tomterna till förmån för gemensamma och tillgängliga grönområden uppnås en urban karaktär. Den medvetna balansen mellan privat sfär och delad grönska gör att området når 30 bostäder per hektar utan att förlora sin lummiga småskalighet.'
            }
        ]
    },
    LAMELLHUS: {
        id: 'lamellhus',
        name: 'Lamellhus i park',
        density: 50,
        colorClass: 'cell-klassisk',
        colorHex: '#d4a373',
        tooltip: [
            { label: 'Typologi', text: 'Låghusområde / Grannskapsenhet' },
            { label: 'Exempel', text: 'Tuna Backar / Sala Backe (lägre delarna)' },
            {
                label: 'Layout & Skala',
                text: 'Klassiska trevånings smalhus (lamellhus) från folkhemsperioden, placerade ljust och luftigt i terrängen, omgivna av stora allmänna parkytor.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Flerbostadshus i tre våningar är mycket yteffektiva, men den totala tätheten per hektar landar på den gyllene medelvägen runt 50 eftersom en så stor andel av marken avsätts till gemensamma, öppna parkrum.'
            }
        ]
    },
    SKIVHUS: {
        id: 'hoghus',
        name: 'Skivhus i park (Miljonprogram)',
        density: 100,
        colorClass: 'cell-hoghus',
        colorHex: '#56ccf2',
        tooltip: [
            { label: 'Typologi', text: 'Öppen kvartersstad / Hus i park' },
            { label: 'Exempel', text: 'Gottsunda (höghusdelarna)' },
            {
                label: 'Layout & Skala',
                text: 'Monumentala skivhus i betong (6–8 våningar) utspridda i landskapet.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Trots höga hus hålls bruttotätheten nere kring 100 bostäder/hektar på grund av stora öppna parkytor, breda matargator och massiva ytparkeringar som kräver enorma mängder mark.'
            }
        ]
    },
    KVARTERSSTAD: {
        id: 'tata',
        name: 'Sluten kvartersstad (Innerstad)',
        density: 150,
        colorClass: 'cell-tata',
        colorHex: '#2f80ed',
        tooltip: [
            { label: 'Typologi', text: 'Sluten kvartersstad' },
            { label: 'Exempel', text: 'Industristaden / Kungsängen' },
            {
                label: 'Layout & Skala',
                text: 'Sammanhängande stadsblock i 5–7 våningar direkt mot gatan, med skyddade innergårdar.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Genom att bygga tätt mot gatan och gömma parkering i underjordiska garage, maximeras markanvändningen. Detta ger en avsevärt högre täthet per hektar än utspridda skivhus, trots något färre våningar.'
            }
        ]
    },
    HYPERTAT: {
        id: 'mycket',
        name: 'Hypertät urbanism',
        density: 250,
        colorClass: 'cell-mycket',
        colorHex: '#9b51e0',
        tooltip: [
            { label: 'Typologi', text: 'Mycket täta höghuskvarter' },
            { label: 'Exempel', text: 'Hagastaden (Stockholm)' },
            {
                label: 'Layout & Skala',
                text: 'Storskaliga stenstadskvarter med torn och höghus (10–15+ våningar) i extremt tätt rutnät.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Representerar den absolut tätaste formen av modern stadsbyggnad i Sverige. Kräver massiva infrastrukturella investeringar (ofta byggt på däck över vägar/spår) och minimerar avståndet mellan byggnaderna.'
            }
        ]
    }
};

const CONGESTION_SCALE_MAX = 25000;
const CONGESTION_THRESHOLDS = { BILVAGG: 12000, KOLLEKTIVVAGG: 18000 };

const SCALE_TOOLTIPS = {
    sweet: 'Status: Optimal balans.\nBoulevards kapacitet matchar stadsdelens storlek perfekt. Bilarna flyter i sina 2+2 körfält, och eftersom bussarna har en helt renodlad fil når alla Bergsbrunna station i tid. Ingen tung spårinfrastruktur behövs överhuvudtaget.',
    bilvagg: 'Status: Bilkörfälten har slagit i taket.\nDu har byggt bortom den glesa idyllen. De vanliga körfälten står helt stilla under rusningstid. Men tack vare att bussfilen är fredad från bilar tar sig kollektivtrafiken fortfarande fram – ett klockrent bevis på att planeringen håller, än så länge.',
    kollektivvagg: 'Status: Systemkollaps för gummihjul.\nNu är tätheten så extrem (miljonprogram och hypertäta höghus) att vanliga bussar inte längre kan svälja mängden resenärer. Bussarna börjar klumpa ihop sig och systemet kollapsar. Boulevarden MÅSTE konverteras till spårväg (Light Rail) för att klara trycket.'
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
        this.congestionMeter = document.getElementById('congestion-meter');
        this.congestionIndicator = document.getElementById('congestion-indicator');
        this.congestionAlert = document.getElementById('congestion-alert');
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
            this.congestionAlert.hidden = false;
            this.congestionAlert.textContent =
                'Kollektivväggen nådd! Boulevarden MÅSTE konverteras till spårväg (Light Rail).';
            this.checkTrafficCrisis(total);
        } else if (overBilvagg) {
            this.congestionAlert.hidden = false;
            this.congestionAlert.textContent =
                'Bilväggen nådd! Bilkörfälten står stilla under rusningstid.';
            this.checkTrafficCrisis(total);
        } else {
            this.congestionAlert.hidden = true;
            this.congestionAlert.textContent = '';
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
            colorBox.className = 'tool-color-box';
            colorBox.style.backgroundColor = zone.colorHex;

            btn.appendChild(nameSpan);
            btn.appendChild(colorBox);

            btn.addEventListener('mouseenter', (e) => this.showZoneTooltip(zone, e));
            btn.addEventListener('mousemove', (e) => this.moveTooltip(e));
            btn.addEventListener('mouseleave', () => this.hideTooltip());

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
            cellElement.className = `grid-cell ${cellData.colorClass}`;
            // Update counter
            this.updateCounter();
        }
    }

    updateCounter() {
        this.dwellingsElement.textContent = this.gameState.totalDwellings.toLocaleString('sv-SE');
        this.updateCongestionMeter();
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
