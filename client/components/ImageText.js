function ImageText({ size, active, src, width, children }) {
    return (
        <div
            style={{
                lineHeight: "10px",
                alignItems: "center",
                backgroundColor: `${active ? "#EEEEEE" : ""}`,
                borderRadius: 22,
            }}
        >
            <div
                style={{
                    display: "flex",
                    height: "40px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img src={src} width={width} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        color: "#212121",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: 400,
                        margin: 0,
                        lineHeight: "normal",
                        width: `${size ? size : "10vh"}`,
                    }}
                >
                    {children}
                </p>
            </div>
        </div>
    );
}
export default ImageText;
