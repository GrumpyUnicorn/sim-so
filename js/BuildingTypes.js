export const ZoningTypes = {
    WOODLAND: { id: 'woodland', name: 'Woodland/Park', density: 0, colorClass: 'cell-woodland', colorHex: '#8ab060' },
    SMAHUS: { id: 'smahus', name: 'Småhus', density: 15, colorClass: 'cell-smahus', colorHex: '#f2c94c' },
    RADHUS: { id: 'radhus', name: 'Radhus', density: 30, colorClass: 'cell-radhus', colorHex: '#f2994a' },
    KLASSISK: { id: 'klassisk', name: 'Klassisk trädgårdstad', density: 50, colorClass: 'cell-klassisk', colorHex: '#d4a373' },
    HOGHUS: { id: 'hoghus', name: 'Höghus', density: 100, colorClass: 'cell-hoghus', colorHex: '#56ccf2' },
    TATA_HOGHUS: { id: 'tata', name: 'Täta höghus', density: 150, colorClass: 'cell-tata', colorHex: '#2f80ed' },
    MYCKET_TATA: { id: 'mycket', name: 'Mycket täta höghus', density: 250, colorClass: 'cell-mycket', colorHex: '#9b51e0' }
};

export const StaticFeatures = {
    EMPTY: { id: 'empty', density: 0, colorClass: 'cell-empty' },
    BOULEVARD: { id: 'boulevard', density: 0, colorClass: 'cell-boulevard', buildable: false },
    STATION: { id: 'station', density: 0, colorClass: 'cell-station', buildable: false },
    BLOCKED: { id: 'blocked', density: 0, colorClass: 'cell-blocked', buildable: false }
};
