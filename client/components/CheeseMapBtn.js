import Link from "next/link";

function CheeseMapBtn() {
    return (
        <Link
            href={"/home/cheeseMap"}
            style={{
                width: "10vh",
                height: "10vh",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                }}
            >
                <button
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "3vh",
                        backgroundColor: "#FFD56A",
                        border: "none",
                        boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                        width: "100%",
                        height: "100%",
                        margin: 0,
                        padding: 0,
                        lineHeight: "normal",
                    }}
                >
                    <img src={"/map_x4.png"} width={"26px"} height={"23px"} />
                    <p
                        style={{
                            fontSize: "15px",
                            margin: "0.5vh 0px 0px 0px",
                        }}
                    >
                        치즈맵
                    </p>
                </button>
            </div>
        </Link>
    );
}

export default CheeseMapBtn;
