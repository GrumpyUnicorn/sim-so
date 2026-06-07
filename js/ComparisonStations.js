/** Reference stations for comparing dwellings within 400 m of the rail. */
export const COMPARISON_STATIONS = [
    {
        name: 'Kymlinge',
        dwellings: 0,
        description:
            'Kymlinge är en ofärdig spökstation omgiven helt av ett skyddat naturreservat.'
    },
    {
        name: 'Skyttorp',
        dwellings: 150,
        description:
            'Skyttorp är en landsbygdsstation dominerad av öppna fält och småhus.'
    },
    {
        name: 'Storvreta',
        dwellings: 450,
        description:
            'Storvreta är en traditionell trädgårdsförort med främst friliggande villor.'
    },
    {
        name: 'Enskede gård',
        dwellings: 600,
        description:
            'Enskede gård är en historisk lågdens trädgårdsstad med exklusiva friliggande och parhus.'
    },
    {
        name: 'Häggvik',
        dwellings: 850,
        description:
            'Häggvik är under omvandling från gamla motorvägskorsningar och handelsplatser till ny bebyggelse.'
    },
    {
        name: 'Knivsta',
        dwellings: 1100,
        description:
            'Knivsta är ett snabbväxande pendlarcentrum som expanderar med moderna flerbostadshus i medelhöjd.'
    },
    {
        name: 'Märsta',
        dwellings: 1500,
        description:
            'Märsta är en pendlarstation i linjes ände, uppdelad mellan bostäder, bangårdar och industri i utkanterna.'
    },
    {
        name: 'Rotebro',
        dwellings: 1800,
        description:
            'Rotebro är ett förortscentrum med ett koncentrerat kluster av flerbostadshus.'
    },
    {
        name: 'Upplands Väsby',
        dwellings: 2300,
        description:
            'Upplands Väsby är ett regionalt förortscentrum med täta 4–8 våningshus nära spåren.'
    },
    {
        name: 'Rinkeby',
        dwellings: 2900,
        description:
            'Rinkeby är en tätt bebyggd stadsdel med enhetliga 6–8 vånings flerbostadshus.'
    },
    {
        name: 'Sollentuna',
        dwellings: 3600,
        description:
            'Sollentuna är en station med höghus byggda direkt ovanpå ett stort kommersiellt köpcentrum.'
    },
    {
        name: 'Solna Centrum',
        dwellings: 5500,
        description:
            'Solna Centrum är ett högt urbaniserat centrum med täta, massiva bostadskvarter ovanför en tunnelbanehubb.'
    }
];

/**
 * Pick the highest reference station whose dwelling bar has been passed.
 * E.g. 0–149 → Kymlinge, 150+ → Skyttorp, 450+ → Storvreta, and so on.
 */
export function findClosestComparisonStation(dwellings) {
    let matched = COMPARISON_STATIONS[0];

    for (const station of COMPARISON_STATIONS) {
        if (dwellings >= station.dwellings) {
            matched = station;
        }
    }

    return matched;
}

/** Reference station if the same west-side density were mirrored east of the tracks. */
export function findMirroredComparisonStation(westSideDwellings) {
    return findClosestComparisonStation(westSideDwellings * 2);
}

export function formatMirroredStationsnaraParagraph(westSideDwellings) {
    const mirrored = findMirroredComparisonStation(westSideDwellings);
    const mirroredCount = westSideDwellings * 2;

    return (
        'I spelet bygger du endast på västra sidan av spåren. Om samma bebyggelse och täthet ' +
        `speglades på östra sidan kring den planerade Bergsbrunna stationen skulle det motsvara ` +
        `${mirrored.name} – med cirka ${mirroredCount.toLocaleString('sv-SE')} bostäder inom 400 meter.`
    );
}
