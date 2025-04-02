import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell,
    Legend,
} from 'recharts';

import { format, parseISO } from 'date-fns';
import MyLegend from './MyLegend';
import MyTooltip from './MyTooltip';

import {
    getCategoryColorMap
} from '@/utils/chart';
import MyLabelList from './MyLabelList';

export default function ActivityChartBarWeek({ data }) {

    const colorMap = getCategoryColorMap(data);
    let maxIndex = 0;
    const transformData = (data) => {

        return data.map(entry => {
            const result = { day: entry.day };
            entry.intervals.forEach((interval, index) => {
                // console.log(interval)
                maxIndex = Math.max(maxIndex, index + 1);
                result[`name__${index + 1}`] = interval.name;
                // console.log(interval.end, interval.start, interval.end - interval.start);
                result[`len__${index + 1}`] = interval.end - interval.start;
                result[`color__${index + 1}`] = colorMap[interval.name];
                // result[`color__${index + 1}`] = getColorFromString(interval.name);
            });
            return result;
        });
    }

    const modData = transformData(data);
    console.log("MODED DATA HERE")
    console.log(modData)

    return (

        <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
                data={modData}
                layout="vertical"
                margin={{ top: 30, right: 10, bottom: 25, left: 0 }}
                barCategoryGap={0}
            >
                <XAxis
                    type="number"
                    domain={[0, 24]}
                    // ticks={[0, 4, 8, 12, 16, 20, 24]}
                    // ticks={[0, 3, 6, 9, 12, 15, 28, 21, 24]}
                    tickCount={11}
                    tick={{ fontSize: 15 }}
                    tickFormatter={(value) => `${value}h`}
                />
                <YAxis
                    dataKey="day"
                    type="category"
                    tickFormatter={(value) => {
                        const date = parseISO(value);
                        return format(date, 'EEE'); 
                    }} />

                <Tooltip
                    content={<MyTooltip />}
                />


                <Legend content={<MyLegend colorMap={colorMap} />} />


                {
                    Array.from({ length: maxIndex }, (_, i) => {

                        const index = i + 1;
                        const key = `len__${index}`;
                        const nameKey = `name__${index}`;
                        const colorKey = `color__${index}`;

                        return (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                            >
                                {
                                    modData.map((entry, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={entry[colorKey]}
                                            name={entry[nameKey]}
                                            stroke="#232323"
                                            strokeWidth={1}
                                        />
                                    ))
                                }

                                <LabelList
                                    dataKey={key}
                                    content={<MyLabelList />}
                                />
                            </Bar>
                        );
                    })


                }
            </BarChart>
        </ResponsiveContainer>

    );
}
