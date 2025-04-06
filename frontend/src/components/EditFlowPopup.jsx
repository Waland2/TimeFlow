'use client';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '@/lib/axios';

export default function EditFlowPopup({
    show,
    onClose,
    cardData,
    selectedCard,
    onChangeCard,
    startTime,
    onChangeStartTime,
    endTime,
    onChangeEndTime,
    maxAllowedDate
}) {
    if (!show) return null;
    const filterFutureTime = (pickerValue) => {
        if (!maxAllowedDate || !pickerValue) return true;
        const sameDay =
            pickerValue.getFullYear() === maxAllowedDate.getFullYear() &&
            pickerValue.getMonth() === maxAllowedDate.getMonth() &&
            pickerValue.getDate() === maxAllowedDate.getDate();
        if (sameDay) {
            return pickerValue <= maxAllowedDate;
        }
        return true;
    };


    const handlePopupSubmit = async () => {
        try {
            await api.post('flow/edit', {
                card_id: Number(selectedCard),
                start: startTime ? startTime.toISOString() : null,
                end: endTime ? endTime.toISOString() : null
            });
            onClose();
        } catch (error) {
            console.error('Error editing flow:', error);
        }
    };


    return (
        <div className='popup-overlay' onClick={onClose}>
            <div className='popup' onClick={(e) => e.stopPropagation()}>
                <h3>Create new timeflow</h3>

                <label>Card</label>
                <select
                    value={selectedCard}
                    onChange={(e) => onChangeCard(e.target.value)}
                >
                    <option value="" disabled>Select a card</option>
                    {cardData.map((card) => (
                        <option key={card.id} value={card.id}>
                            {card.name}
                        </option>
                    ))}
                </select>

                <label>Start Time</label>
                <DatePicker
                    selected={startTime}
                    onChange={onChangeStartTime}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="yyyy-MM-dd HH:mm"
                    maxDate={maxAllowedDate}
                    filterTime={filterFutureTime}
                    timeFormat="HH:mm"
                    placeholderText="Select start time"
                />

                <label>End Time</label>
                <DatePicker
                    selected={endTime}
                    onChange={onChangeEndTime}
                    showTimeSelect
                    timeIntervals={5}
                    dateFormat="yyyy-MM-dd HH:mm"
                    maxDate={maxAllowedDate}
                    filterTime={filterFutureTime}
                    timeFormat="HH:mm"
                    placeholderText="Select end time"
                />

                <div className='popup-delete-btns' style={{ marginTop: '1rem' }}>
                    <button className='submit-btn' onClick={onClose}>
                        Cancel
                    </button>
                    <button className='delete-submit-btn' onClick={handlePopupSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
