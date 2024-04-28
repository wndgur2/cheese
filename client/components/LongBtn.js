function LongBtn({ colored, children, onclick }) {
    return (
        <div
            style={{
                backgroundColor: `${colored ? "#FFD56A" : "#FEFBF6"}`,
                borderRadius: "40px",
                display: "flex",
                margin: "1vh 0px",
                padding: "1vh 1.5vh",
                alignItems: "center",
                justifyContent: "center",
                gap: "3vh",
                boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.10)",
                width: "86%",
                height: "5vh",
            }}
            onClick={onclick}
        >
            {children}
        </div>
    );
}

export default LongBtn;
