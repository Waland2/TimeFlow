
const niceColors = [
    "#5b8bd1",
    "#f89c3d",
    "#ec5a5c",
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


export function getDailyIntervals(data) {
    const daysMap = {};

    if (!data || data.length === 0) return [];

    const minStart = new Date(Math.min(...data.map(({ start }) => new Date(start))));
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);

    data.forEach(({ start, end, card }) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        let current = new Date(startDate);

        while (current < endDate) {
            const dayStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
            const dayStart = new Date(current);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(current);
            dayEnd.setHours(24, 0, 0, 0);

            const intervalStart = new Date(Math.max(current, dayStart));
            const intervalEnd = new Date(Math.min(endDate, dayEnd));

            const startHours = (intervalStart - dayStart) / 3600000;
            const endHours = (intervalEnd - dayStart) / 3600000;

            if (!daysMap[dayStr]) {
                daysMap[dayStr] = [];
            }

            daysMap[dayStr].push({
                start: startHours,
                end: endHours,
                name: card.name,
            });

            current = dayEnd;
        }
    });

    const fullRangeMap = {};
    const fullStart = new Date(tenDaysAgo);
    fullStart.setHours(0, 0, 0, 0);
    const fullEnd = new Date(now);
    fullEnd.setHours(0, 0, 0, 0);

    let d = new Date(fullStart);
    while (d <= fullEnd) {
        const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!daysMap[dayStr]) {
            fullRangeMap[dayStr] = [{ start: 0, end: 24, name: 'Void' }];
        } else {
            fullRangeMap[dayStr] = daysMap[dayStr];
        }
        d.setDate(d.getDate() + 1);
    }

    return Object.keys(fullRangeMap)
        .sort()
        .map(day => {
            const intervals = fullRangeMap[day].sort((a, b) => a.start - b.start);
            const result = [];

            let currentTime = 0;
            intervals.forEach(interval => {
                if (interval.start > currentTime) {
                    result.push({
                        start: currentTime,
                        end: interval.start,
                        name: 'Void',
                    });
                }
                result.push(interval);
                currentTime = Math.max(currentTime, interval.end);
            });

            if (currentTime < 24) {
                result.push({
                    start: currentTime,
                    end: 24,
                    name: 'Void',
                });
            }

            return {
                day,
                intervals: result,
            };
        });
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

    const filteredData = sortedData.filter(item => item.name !== 'Void');

    filteredData.forEach((item, i) => {
        colorMap[item.name] = i < niceColors.length
            ? niceColors[i]
            : fallbackColor(item.name);
    });

    const voidItem = sortedData.find(item => item.name === 'Void');
    if (voidItem) {
        colorMap['Void'] = 'transparent';
    }

    return colorMap;
}
