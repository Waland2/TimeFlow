'use client';

import api from '@/lib/axios';
import { useEffect, useState } from 'react';
import '@/styles/dashboard.css';
import '@/styles/cards.css';
import "react-datepicker/dist/react-datepicker.css";

import ActivityChartBarWeek from '@/components/ActivityChartBarWeek/ActivityChartBarWeek';
import AverageChartBar from '@/components/AverageChartBar';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { getDailyIntervals } from '@/utils/chart';

import EditFlowPopup from '@/components/EditFlowPopup';

export default function Dashboard() {
    const [flows, setFlows] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [selectedCard, setSelectedCard] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [maxAllowedDate, setMaxAllowedDate] = useState(null);

    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
        api.get("flow/get").then((res) => {
            const parsedFlows = res.data.map((flow) => ({
                ...flow,
                start: new Date(flow.start + "Z"),
                end: flow.end ? new Date(flow.end + "Z") : new Date(),
            }));
            setFlows(getDailyIntervals(parsedFlows));
            console.log(parsedFlows)
            console.log(getDailyIntervals(parsedFlows))
        });

        api.get("card/get").then((res) => {
            setCardData(res.data);
        });
    }, [isLoading]);

    const openPopup = () => {
        setSelectedCard("");
        setStartTime(null);
        setEndTime(null);
        setMaxAllowedDate(new Date());
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };


    return (
        <>
            <div className='flow-edit'>
                <button className='edit-btn' onClick={openPopup}>
                    Redact flows
                </button>
            </div>

            <div className='dashboard'>
                <div className='activity-chart week-bar-chart'>
                    {flows?.length === 0 ? "Loading" : <ActivityChartBarWeek data={flows} />}
                </div>

                <div className='activity-chart avg-bar-chart'>
                    {flows?.length === 0 ? "Loading" : <AverageChartBar data={flows} />}
                </div>
            </div>


            
            <EditFlowPopup
                show={showPopup}
                onClose={closePopup}
                cardData={cardData}
                selectedCard={selectedCard}
                onChangeCard={setSelectedCard}
                startTime={startTime}
                onChangeStartTime={setStartTime}
                endTime={endTime}
                onChangeEndTime={setEndTime}
                maxAllowedDate={maxAllowedDate}
            />
        </>
    );
}
