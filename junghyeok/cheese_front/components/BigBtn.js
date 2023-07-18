import Link from "next/link";

function BigBtn({enabled, href, size, src, text, iconWidth, iconHeight, children}) {
    return (
        <Link href={enabled? href:""}>
            <div
                style={{
                    display: "flex",
            }}>
                <button style={{
                    justifyContent:"center",
                    alignItems:"center",
                    borderRadius: "40px",
                    backgroundColor: `${enabled? "#FFD56A":"#FEFBF6"}`,
                    border: "none",
                    boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                    width: size,
                    height: size,
                    margin:0,
                    padding:0,
                    lineHeight:"normal",
                }}>
                    <img
                        src={src}
                        alt={text}
                        width={iconWidth} height={iconHeight}
                    />
                    <p style={{
                        fontSize: "14px",
                        margin:0
                    }}>{children}</p>
                </button>
            </div>
        </Link>
    )
}

export default BigBtn;