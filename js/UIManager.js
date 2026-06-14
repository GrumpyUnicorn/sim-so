import { formatMirroredStationsnaraParagraph } from './ComparisonStations.js';
import { FAQ_ITEMS } from './Faq.js';
import { buildShareUrl, getSharedGreetingFromUrl } from './PlanShare.js';
import {
    FYRSPARSAVTALET_TOOLTIP,
    GRONSKA_TOOLTIP,
    updateFyrsparsavtaletIndicator,
    updateGreenspaceIndicator,
    updateStationsnaraIndicator
} from './InfoIndicators.js';
import { StaticFeatures, ZONING_IDS, ZoningTypes } from './BuildingTypes.js';

const ACTION_TOOLTIPS = {
    reset: 'Återställ sydöstra till skog och börja om ditt stadsplanerande.',
    share: 'När du är nöjd med din plan för sydöstra Uppsalas utveckling kan du dela den med vänner via en länk.',
    faq: 'Frågor och svar om den här webbsidan.'
};

export class UIManager {
    constructor(gameState, { showSharedGreeting = true, readOnly = false } = {}) {
        this.gameState = gameState;
        this.showSharedGreeting = showSharedGreeting;
        this.readOnly = readOnly;
        this.activeTool = ZoningTypes.SMAHUS; // Default tool
        this.gridElement = document.getElementById('game-grid');
        this.dwellingsElement = document.getElementById('total-dwellings');
        this.toolsContainer = document.getElementById('tools-container');
        this.tooltip = document.getElementById('cell-tooltip');
        this.gronskaIndicator = document.getElementById('indicator-gronska');
        this.fyrsparsavtaletIndicator = document.getElementById('indicator-fyrsparsavtalet');
        this.stationsnaraIndicator = document.getElementById('indicator-stationsnara');
        this.stationsnaraCountElement = document.getElementById('stationsnara-count');
        this.stationsnaraComparisonElement = document.getElementById('stationsnara-comparison');
        this.stationsnaraState = null;
        this.stationBuilding = document.querySelector('.station-building');
        this.resetButton = document.getElementById('action-reset');
        this.shareButton = document.getElementById('action-share');
        this.faqButton = document.getElementById('action-faq');
        this.faqDialog = document.getElementById('faq-dialog');
        this.faqDialogContent = document.getElementById('faq-dialog-content');
        this.faqDialogClose = document.getElementById('faq-dialog-close');
        this.shareDialog = document.getElementById('share-dialog');
        this.shareDialogName = document.getElementById('share-dialog-name');
        this.shareDialogMessage = document.getElementById('share-dialog-message');
        this.shareDialogLink = document.getElementById('share-dialog-link');
        this.shareDialogCopy = document.getElementById('share-dialog-copy');
        this.shareDialogClose = document.getElementById('share-dialog-close');
        this.shareDialogFeedback = document.getElementById('share-dialog-feedback');
        this.sharedGreeting = document.getElementById('shared-greeting');
        this.sharedGreetingText = document.getElementById('shared-greeting-text');
        this.boardReadonlyOverlay = document.getElementById('board-readonly-overlay');

        this.cellElements = [];
        this.isMouseDown = false;
        this.faqRendered = false;

        this.initTools();
        this.initGrid();
        this.initInfoIndicatorTooltips();
        this.initActionButtons();
        this.initStationTooltip();
        this.setupEventListeners();
        this.updateCounter();
        if (this.showSharedGreeting) this.showSharedGreetingIfPresent();
        if (this.readOnly) this.applyReadOnlyMode();
    }

    applyReadOnlyMode() {
        if (this.boardReadonlyOverlay) this.boardReadonlyOverlay.hidden = false;

        const toolbar = document.getElementById('toolbar');
        if (toolbar) toolbar.setAttribute('aria-hidden', 'true');

        [this.resetButton, this.shareButton].forEach((button) => {
            if (!button) return;
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
        });

        document.querySelectorAll('.tool-btn').forEach((button) => {
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
        });
    }

    initStationTooltip() {
        const text = StaticFeatures.STATION.tooltip;
        if (!this.stationBuilding || !text) return;

        this.stationBuilding.addEventListener('mouseenter', () => this.showStationTooltip(text));
        this.stationBuilding.addEventListener('mouseleave', () => this.hideTooltip());
    }

    showStationTooltip(text) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--station';
        const label = document.createElement('span');
        label.textContent = text;
        this.tooltip.appendChild(label);
        this.tooltip.style.display = 'block';
        requestAnimationFrame(() => {
            this.positionStationTooltip();
            this.tooltip.style.opacity = '1';
        });
    }

    clampTooltipPosition(left, top, margin = 8) {
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const tipRect = this.tooltip.getBoundingClientRect();

        return {
            left: Math.max(margin, Math.min(left, viewportWidth - tipRect.width - margin)),
            top: Math.max(margin, Math.min(top, viewportHeight - tipRect.height - margin))
        };
    }

    positionTooltipNearCursor(e, offset = 14, margin = 8) {
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const tipRect = this.tooltip.getBoundingClientRect();

        let left = e.clientX + offset;
        let top = e.clientY + offset;

        if (left + tipRect.width > viewportWidth - margin) {
            left = e.clientX - tipRect.width - offset;
        }
        if (top + tipRect.height > viewportHeight - margin) {
            top = e.clientY - tipRect.height - offset;
        }

        const clamped = this.clampTooltipPosition(left, top, margin);
        this.tooltip.style.left = `${clamped.left}px`;
        this.tooltip.style.top = `${clamped.top}px`;
    }

    positionStationTooltip() {
        if (!this.stationBuilding) return;

        const margin = 8;
        const offset = 12;
        const stationRect = this.stationBuilding.getBoundingClientRect();
        const tipRect = this.tooltip.getBoundingClientRect();

        let left = stationRect.left - tipRect.width - offset;
        let top = stationRect.top + (stationRect.height - tipRect.height) / 2;

        if (left < margin) {
            left = stationRect.right + offset;
        }

        const clamped = this.clampTooltipPosition(left, top, margin);
        this.tooltip.style.left = `${clamped.left}px`;
        this.tooltip.style.top = `${clamped.top}px`;
    }

    positionTooltipNearElement(element, margin = 8, gap = 10) {
        const rect = element.getBoundingClientRect();
        const tipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;

        let left = rect.right + gap;
        let top = rect.top + (rect.height - tipRect.height) / 2;

        if (left + tipRect.width > viewportWidth - margin) {
            left = rect.left - tipRect.width - gap;
        }

        const clamped = this.clampTooltipPosition(left, top, margin);
        this.tooltip.style.left = `${clamped.left}px`;
        this.tooltip.style.top = `${clamped.top}px`;
    }

    initInfoIndicatorTooltips() {
        if (this.gronskaIndicator) {
            this.gronskaIndicator.addEventListener('mouseenter', (e) => this.showGronskaTooltip(e));
            this.gronskaIndicator.addEventListener('mousemove', (e) => this.positionTooltipNearCursor(e));
            this.gronskaIndicator.addEventListener('mouseleave', () => this.hideTooltip());
        }
        if (this.fyrsparsavtaletIndicator) {
            this.fyrsparsavtaletIndicator.addEventListener('mouseenter', (e) => this.showFyrsparsavtaletTooltip(e));
            this.fyrsparsavtaletIndicator.addEventListener('mousemove', (e) => this.positionTooltipNearCursor(e));
            this.fyrsparsavtaletIndicator.addEventListener('mouseleave', () => this.hideTooltip());
        }
        if (this.stationsnaraIndicator) {
            this.stationsnaraIndicator.addEventListener('mouseenter', (e) => this.showStationsnaraTooltip(e));
            this.stationsnaraIndicator.addEventListener('mousemove', (e) => this.positionTooltipNearCursor(e));
            this.stationsnaraIndicator.addEventListener('mouseleave', () => this.hideTooltip());
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
        requestAnimationFrame(() => {
            this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
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
        requestAnimationFrame(() => {
            this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
    }

    showStationsnaraTooltip(e) {
        const state = this.stationsnaraState;
        if (!state) return;

        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--zone cell-tooltip--detailed';

        const description = document.createElement('p');
        description.className = 'tooltip-section';
        description.textContent = state.station.description;
        this.tooltip.appendChild(description);

        const mirrorNote = document.createElement('p');
        mirrorNote.className = 'tooltip-section';
        mirrorNote.textContent = formatMirroredStationsnaraParagraph(state.count);
        this.tooltip.appendChild(mirrorNote);

        this.tooltip.style.display = 'flex';
        requestAnimationFrame(() => {
            this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
    }

    initActionButtons() {
        this.bindActionTooltip(this.resetButton, ACTION_TOOLTIPS.reset);
        this.bindActionTooltip(this.shareButton, ACTION_TOOLTIPS.share, true);
        this.bindActionTooltip(this.faqButton, ACTION_TOOLTIPS.faq, true);

        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetGrid());
        }
        if (this.shareButton) {
            this.shareButton.addEventListener('click', () => this.handleSharePlan());
        }
        if (this.faqButton) {
            this.faqButton.addEventListener('click', () => this.openFaqDialog());
        }
        if (this.faqDialogClose) {
            this.faqDialogClose.addEventListener('click', () => this.closeFaqDialog());
        }
        if (this.faqDialog) {
            this.faqDialog.addEventListener('click', (e) => {
                if (e.target === this.faqDialog) this.closeFaqDialog();
            });
            this.faqDialog.addEventListener('cancel', (e) => {
                e.preventDefault();
                this.closeFaqDialog();
            });
        }
        if (this.shareDialogClose) {
            this.shareDialogClose.addEventListener('click', () => this.closeShareDialog());
        }
        if (this.shareDialogCopy) {
            this.shareDialogCopy.addEventListener('click', () => this.copyShareLink());
        }
        if (this.shareDialogName) {
            this.shareDialogName.addEventListener('input', () => this.updateShareLink());
        }
        if (this.shareDialogMessage) {
            this.shareDialogMessage.addEventListener('input', () => this.updateShareLink());
        }
        if (this.shareDialog) {
            this.shareDialog.addEventListener('click', (e) => {
                if (e.target === this.shareDialog) this.closeShareDialog();
            });
            this.shareDialog.addEventListener('cancel', (e) => {
                e.preventDefault();
                this.closeShareDialog();
            });
        }
    }

    bindActionTooltip(button, text, anchorToButton = false) {
        if (!button) return;
        button.addEventListener('mouseenter', (e) => this.showActionTooltip(text, e, anchorToButton ? button : null));
        button.addEventListener('mousemove', (e) => {
            if (anchorToButton) this.positionActionTooltip(anchorToButton);
            else this.positionTooltipNearCursor(e);
        });
        button.addEventListener('mouseleave', () => this.hideTooltip());
    }

    showActionTooltip(text, e, anchorButton = null) {
        this.tooltip.replaceChildren();
        this.tooltip.className = 'cell-tooltip cell-tooltip--station';
        const label = document.createElement('span');
        label.textContent = text;
        this.tooltip.appendChild(label);
        this.tooltip.style.display = 'block';
        requestAnimationFrame(() => {
            if (anchorButton) this.positionActionTooltip(anchorButton);
            else this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
    }

    positionActionTooltip(button) {
        const margin = 8;
        const gap = 8;
        const buttonRect = button.getBoundingClientRect();
        const tipRect = this.tooltip.getBoundingClientRect();

        let left = buttonRect.right - tipRect.width;
        let top = buttonRect.top - tipRect.height - gap;

        if (top < margin) {
            top = buttonRect.bottom + gap;
        }

        if (left < margin) {
            left = buttonRect.left;
        }

        const clamped = this.clampTooltipPosition(left, top, margin);
        this.tooltip.style.left = `${clamped.left}px`;
        this.tooltip.style.top = `${clamped.top}px`;
    }

    resetGrid() {
        if (this.readOnly) return;

        this.gameState.resetToInitial();

        for (let y = 0; y < this.gameState.rows; y++) {
            for (let x = 0; x < this.gameState.cols; x++) {
                const cellData = this.gameState.grid[y][x];
                const cellElement = this.cellElements[y]?.[x];
                if (!cellElement) continue;
                const tierClass = this.getTierClassForCell(cellData);
                cellElement.className = `grid-cell ${cellData.colorClass} ${tierClass}`.trim();
            }
        }

        this.updateCounter();
    }

    handleSharePlan() {
        if (this.readOnly) return;
        this.openShareDialog();
    }

    openShareDialog() {
        if (!this.shareDialog || !this.shareDialogLink) return;

        if (this.shareDialogName) this.shareDialogName.value = '';
        if (this.shareDialogMessage) this.shareDialogMessage.value = '';
        this.updateShareLink();
        this.shareDialogFeedback.hidden = true;
        this.hideTooltip();
        this.shareDialog.showModal();
    }

    updateShareLink() {
        if (!this.shareDialogLink) return;

        const { grid, cols, rows } = this.gameState;
        const name = this.shareDialogName?.value ?? '';
        const message = this.shareDialogMessage?.value ?? '';
        this.shareDialogLink.value = buildShareUrl(grid, cols, rows, { name, message });
    }

    showSharedGreetingIfPresent() {
        const { name, message } = getSharedGreetingFromUrl();
        if (!name && !message) return;
        if (!this.sharedGreeting || !this.sharedGreetingText) return;

        if (name && message) {
            this.sharedGreetingText.textContent = `${name} delade sin plan med hälsningen: ”${message}”`;
        } else if (name) {
            this.sharedGreetingText.textContent = `${name} delade sin plan för sydöstra Uppsala.`;
        } else {
            this.sharedGreetingText.textContent = `Hälsning: ”${message}”`;
        }

        this.sharedGreeting.hidden = false;
    }

    closeShareDialog() {
        this.shareDialog?.close();
    }

    async copyShareLink() {
        if (!this.shareDialogLink) return;

        const link = this.shareDialogLink.value;

        try {
            await navigator.clipboard.writeText(link);
        } catch {
            this.shareDialogLink.focus();
            this.shareDialogLink.select();
            document.execCommand('copy');
        }

        if (this.shareDialogFeedback) {
            this.shareDialogFeedback.hidden = false;
            window.setTimeout(() => {
                this.shareDialogFeedback.hidden = true;
            }, 2000);
        }
    }

    renderFaqContent() {
        if (!this.faqDialogContent || this.faqRendered) return;

        FAQ_ITEMS.forEach((item) => {
            const block = document.createElement('section');
            block.className = 'faq-item';

            const question = document.createElement('h3');
            question.className = 'faq-item__question';
            question.textContent = item.question;

            const answer = document.createElement('p');
            answer.className = 'faq-item__answer';
            answer.textContent = item.answer;

            block.appendChild(question);
            block.appendChild(answer);
            this.faqDialogContent.appendChild(block);
        });

        this.faqRendered = true;
    }

    openFaqDialog() {
        if (!this.faqDialog) return;
        this.renderFaqContent();
        this.hideTooltip();
        this.faqDialog.showModal();
    }

    closeFaqDialog() {
        this.faqDialog?.close();
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

            btn.addEventListener('mouseenter', (e) => this.showZoneTooltip(zone, e, btn));
            btn.addEventListener('mousemove', () => this.positionTooltipNearElement(btn));
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
        if (this.readOnly) return;

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
                cell.addEventListener('mousemove', (e) => this.positionTooltipNearCursor(e));
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
        if (this.readOnly) return;

        // Only trigger on left click
        if (e.button !== 0) return;
        this.applyZone(x, y, cellElement, true);
    }

    handleCellEnter(x, y, cellElement, e) {
        if (this.readOnly) return;

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
        requestAnimationFrame(() => {
            this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
    }

    showZoneTooltip(zone, e, anchorElement = null) {
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
        requestAnimationFrame(() => {
            if (anchorElement) this.positionTooltipNearElement(anchorElement);
            else this.positionTooltipNearCursor(e);
            this.tooltip.style.opacity = '1';
        });
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
        this.stationsnaraState = updateStationsnaraIndicator(
            this.stationsnaraCountElement,
            this.stationsnaraComparisonElement,
            grid,
            cols,
            rows
        );
    }
}
