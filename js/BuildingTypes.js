export const ZoningTypes = {
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
            { label: 'Typologi', text: 'Gles småhusbebyggelse' },
            { label: 'Exempel', text: 'Bergsbrunna / Nåntuna' },
            {
                label: 'Layout & Skala',
                text: 'Friliggande villor och egnahem på stora tomter, inbäddade i generösa privata trädgårdar (ofta 800–1200 kvm).'
            },
            {
                label: 'Täthetsförklaring',
                text: 'En mycket stor andel av marken utgörs av privat tomtmark och asfalterade lokalgator. Detta sprider ut befolkningen och ger en låg bruttotäthet på cirka 15 bostäder per hektar.'
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
            { label: 'Typologi', text: 'Tät småhusbebyggelse / Trädgårdsstad' },
            { label: 'Exempel', text: 'Kungsgärdet / Inre Svartbäcken' },
            {
                label: 'Layout & Skala',
                text: 'Tidigt 1900-talsideal. Husen placeras tätt mot gatan för att skapa ett intimt gaturum och omsluter lummiga, sammanhängande innergårdar.'
            },
            {
                label: 'Täthetsförklaring',
                text: 'Genom smalare gator, mindre tomtstorlekar och smarta inslag av parhus samt tvåvånings trädgårdsstadshus, dubbleras tätheten jämfört med traditionella villaområden utan att förlora småskaligheten.'
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

export const StaticFeatures = {
    EMPTY: { id: 'empty', density: 0, colorClass: 'cell-empty' },
    BOULEVARD: { id: 'boulevard', density: 0, colorClass: 'cell-boulevard', buildable: false },
    STATION: { id: 'station', density: 0, colorClass: 'cell-station', buildable: false },
    BLOCKED: { id: 'blocked', density: 0, colorClass: 'cell-blocked', buildable: false }
};
