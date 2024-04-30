"use client";

function Palette({ color, setColor, disabled }) {
    const colors = [
        "#FF0000",
        "#FF00AA",
        "#FFAA00",
        "#AAFF00",
        "#00AA00",
        "#00FFAA",
        "#AA00FF",
        "#00AAFF",
        "#0000FF",
        "#0000AA",
        "#FFFFFF",
        "#000000",
    ];
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "calc(2vh - 4px)",
                margin: "2vh 0vh",
                justifyContent: "center",
                width: "100%",
            }}
        >
            {colors.map((c, i) => (
                <div
                    key={i}
                    style={{
                        width: "12%",
                        aspectRatio: "1/1",
                        borderRadius: "120px",
                        background: disabled ? "#CCC" : c,
                        outlineStyle:
                            (c == color || c == "#FFFFFF") && !disabled
                                ? "solid"
                                : "",
                        outlineColor: "#666",
                        outlineWidth: "1.5px",
                    }}
                    onClick={disabled ? () => {} : () => setColor(c)}
                />
            ))}
        </div>
    );
}
export default Palette;
