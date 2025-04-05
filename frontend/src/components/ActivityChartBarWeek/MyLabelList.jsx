const MyLabelList = (props) => {
    const { x, y, width, height, value } = props;

    if (width < 30) {
        return null;
    }

    return (
        <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="black"
            fontSize={14}
            fontWeight={400}
        >
            
            {(value >= 0.5 && value != 24)  ? `${Number(value.toFixed(1))}h` : ""}
        </text>
    );
};

export default MyLabelList;
