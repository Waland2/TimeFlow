import { format, parseISO } from 'date-fns';



export default function MyTooltip({label, payload}) {
    if (!payload || payload.length === 0) return null;

    const date = parseISO(label);
    const dayLabel = format(date, 'd MMMM yyyy, EEE');

    const categoryMap = {};

    payload.forEach(item => {
        const index = item.dataKey.split('__')[1];
        const name = item.payload[`name__${index}`];
        const value = item.value;

        if (!categoryMap[name]) {
            categoryMap[name] = 0;
        }
        categoryMap[name] += value;
    });

    const sorted = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .filter(({ name }) => name !== "Void")
        .sort((a, b) => b.value - a.value);

    return (
        <div style={{
            background: "#f0f8ff",
            padding: "10px",
            border: "2px solid #3399ff",
            fontSize: "14px",
            borderRadius: "6px",
            boxShadow: "0 0 6px rgba(0,0,0,0.2)"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{dayLabel}</div>
            {sorted.map(({ name, value }) => (
                <div key={name}>{name} : {Number(value.toFixed(1))}h</div>
            ))}
        </div>
    );
}