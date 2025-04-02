export default function MyLegend({ colorMap }) {
    const payload = Object.entries(colorMap)
        .filter(([name]) => name !== "Void")
        .map(([name, color]) => ({
            value: name,
            color,
            type: 'circle',
        }));

    return (
        <ul style={{ listStyle: 'none', marginLeft: 20, padding: 0, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {payload.map((entry, index) => (
                <li key={`legend-item-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            marginLeft: 5,
                            backgroundColor: entry.color,
                            borderRadius: '20%',
                            border: "solid black 1px",
                            marginRight: 6,
                        }}
                    />
                    <span style={{ fontSize: 14 }}>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
}