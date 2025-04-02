import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
const rawRows = [
    [
        { name: "Test", start: 0.0, end: 3.5 },
        { name: "test2", start: 3.5, end: 10.75 },
        { name: "Test", start: 10.75, end: 24.0 },
    ],
    [
        { name: "other", start: 0.0, end: 12.0 },
        { name: "test2", start: 12.0, end: 24.0 },
    ],
    [
        { name: "Test", start: 0.0, end: 3.5 },
        { name: "test2", start: 3.5, end: 10.75 },
        { name: "Test", start: 10.75, end: 24.0 },
    ]
];
const data = [
    
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, fl: 1 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const Test = () => {
    return (
        <ResponsiveContainer width={600} height={400}>
            <BarChart
                layout="vertical"
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 100,
                    bottom: 5,
                }}
                barCategoryGap={0}
            >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Legend />
                <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                <Bar dataKey="fl" stackId="a" fill="#888400" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default Test;
