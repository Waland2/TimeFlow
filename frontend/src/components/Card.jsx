'use client';

export default function Card({card, isActive, activateCard}) {
    const handleClick = () => {
        activateCard(card);
    }
    return (
        <span onClick={handleClick} className={'card ' + (isActive ? 'active' : '')}>{card.name}</span>
    );
}
