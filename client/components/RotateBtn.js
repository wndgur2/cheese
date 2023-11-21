function RotateBtn({src}) {
    return (
        <div style={{ display: "flex" }}>
            <button style={{
                justifyContent:"center",
                alignItems:"center",
                borderRadius: "60px",
                backgroundColor: "#FEFBF6",
                border: "none",
                boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                width: "18vw",
                height: "18vw",
                lineHeight:"normal",
            }}>
                <img
                    src={src}
                    width={32} height={32}
                />
            </button>
        </div>
    )
}

export default RotateBtn;