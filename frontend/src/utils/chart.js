
const niceColors = [
    "#ec5a5c",
    "#5b8bd1",
    "#f89c3d",
    "#84cbc7",
    "#66b55a",
    "#f2d44f",
    "#c186bb",
    "#ffadb3",
    "#af8766"
];

export function fallbackColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 60%)`;
}

export function getSortedData(data) {
    const result = data.reduce((acc, day) => {
        day.intervals.forEach(interval => {
            const name = interval.name;
            const duration = interval.end - interval.start;
            acc[name] = (acc[name] || 0) + duration;
        });
        return acc;
    }, {});

    const sorted = Object.entries(result)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return sorted;
}

export function getCategoryColorMap(data) {
    const sortedData = getSortedData(data);
    const colorMap = {};

    sortedData.forEach((item, i) => {
        const name = item.name;
        if (name === 'Void') {
            colorMap[name] = 'transparent';
        } else {
            colorMap[name] = i < niceColors.length
                ? niceColors[i]
                : fallbackColor(name);
        }
    });

    return colorMap;
}
