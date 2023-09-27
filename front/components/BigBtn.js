import Link from "next/link";

function BigBtn({enabled, href, src, text, iconWidth, iconHeight, children}) {
    return (
        <Link href={enabled? href:""}>
            <div
                style={{
                    display: "flex",
            }}>
                <button style={{
                    justifyContent:"center",
                    alignItems:"center",
                    borderRadius: "16px",
                    backgroundColor: `${enabled? "#FFD56A":"#FEFBF6"}`,
                    border: "none",
                    boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                    width: "42vw",
                    height: "13vh",
                    lineHeight:"normal",
                }}>
                    <img
                        src={src}
                        alt={text}
                        width={iconWidth} height={iconHeight}
                    />
                    {children &&
                        <p style={{
                            fontSize: "15px",
                            margin:"1vh 0px 0px 0px"
                        }}>{children}</p>
                    }
                </button>
            </div>
        </Link>
    )
}

export default BigBtn;