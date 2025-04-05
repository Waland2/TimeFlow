import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell,
} from 'recharts';

import { getCategoryColorMap, getSortedData } from '@/utils/chart';

export default function AverageChartBar({ data }) {
    const colorMap = getCategoryColorMap(data);

    let modData = getSortedData(data).filter(obj => obj.name !== "Void");

    const total = modData.reduce((acc, item) => acc + item.value, 0);
    const rawPercents = modData.map(item => (item.value / total) * 100);

    const rounded = rawPercents.map(v => Math.round(v * 100) / 100);

    const roundedSum = rounded.reduce((a, b) => a + b, 0);
    const diff = Math.round((100 - roundedSum) * 100) / 100;
    rounded[rounded.length - 1] += diff;

    const transformed = [{
        name: "AVG",
        ...modData.reduce((acc, item, index) => {
            const i = index + 1;
            acc[`name__${i}`] = item.name;
            acc[`len__${i}`] = rounded[index];
            acc[`color__${i}`] = colorMap[item.name];
            return acc;
        }, {})
    }];


    const barCount = modData.length;

    const CustomLabel = (props) => {
        const { x, y, width, height, value } = props;

        if (width < 45) {
            return null;
        }

        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                fontSize={13}
                fontWeight={400}
            >
                {value.length > 5 ? value.slice(0, 5) + '...' : value}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        return (
            <div
                style={{
                    background: "#f0f8ff",
                    padding: "10px",
                    border: "2px solid #3399ff",
                    fontSize: "14px",
                    borderRadius: "6px",
                    boxShadow: "0 0 6px rgba(0,0,0,0.2)"
                }}
            >
                {payload.map((entry, index) => {
                    const nameField = entry.dataKey.replace('len__', 'name__');
                    const categoryName = entry.payload[nameField];
                    const value = Number(entry.value.toFixed(1));
                    return (
                        <div key={`tooltip-item-${index}`}>
                            {categoryName}: {value}%
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={100}>
            <BarChart
                data={transformed}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
                barCategoryGap={0}
            >
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickCount={11}
                    tickFormatter={(tick) => `${tick.toFixed(0)}%`}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 14 }}
                />

                <Tooltip content={<CustomTooltip />} />

                {
                    Array.from({ length: barCount }, (_, i) => {
                        const index = i + 1;
                        const lenKey = `len__${index}`;
                        const nameKey = `name__${index}`;
                        const colorKey = `color__${index}`;

                        return (
                            <Bar key={lenKey} dataKey={lenKey} stackId="a">
                                {
                                    transformed.map((entry, j) => (
                                        <Cell
                                            key={`cell-${j}`}
                                            fill={entry[colorKey]}
                                            name={entry[nameKey]}
                                            stroke="black"
                                            strokeWidth={1}
                                        />
                                    ))
                                }
                                <LabelList
                                    dataKey={nameKey}
                                    content={<CustomLabel />}
                                />
                            </Bar>
                        );
                    })
                }
            </BarChart>
        </ResponsiveContainer>
    );
}
