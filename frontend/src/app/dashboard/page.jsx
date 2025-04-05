'use client';

import api from '@/lib/axios';
import { useEffect, useState } from 'react';
import '@/styles/dashboard.css';

import ActivityChartBarWeek from '@/components/ActivityChartBarWeek/ActivityChartBarWeek';
import AverageChartBar from '@/components/AverageChartBar';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';



export default function Dashboard() {
    const [flows, setFlows] = useState([]);
    const router = useRouter();

    const { user, isLoading } = useUser();

    useEffect(() => {
        console.log(user, isLoading)
        if (!isLoading && !user) { router.push("/auth/login") }
        api.get("flow/get")
            .then((res) => {
                const parsedFlows = res.data.map((flow) => ({
                    ...flow,
                    start: new Date(flow.start + "Z"),
                    end: flow.end ? new Date(flow.end + "Z") : new Date(),
                }));

                setFlows(transformData(parsedFlows));
                console.log(parsedFlows);
                console.log(transformData(parsedFlows));
            });
    }, [isLoading]);


    function transformData(data) {
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
    

    return (
        <div className='activity-chart'>
            {flows?.length === 0 ? "Loading" : (<>

                <ActivityChartBarWeek data={flows} />
                <AverageChartBar data={flows} />
            </>
            )}
            {/* <Test /> */}

        </div>
    );
}

