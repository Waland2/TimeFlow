'use client';

export default function CardEdit({ card, onOpenEditPopup, onOpenDeletePopup }) {
    return (
        <div className='card-edit'>
            <div className="edit-bar">
                <span
                    className='card-edit-icon'
                    onClick={() => onOpenEditPopup(card)}
                    title="edit card"
                >
                    <img src="/icons/edit.svg" alt="edit" width={22} height={22} />
                </span>

                <span
                    className='card-edit-icon'
                    onClick={() => onOpenDeletePopup(card)}
                    title="delete card"
                >
                    <img src="/icons/delete.svg" alt="edit" width={22} height={22} />

                </span>
            </div>
            <span className='card-edit-name'>{card.name}</span>
        </div>
    );
}
