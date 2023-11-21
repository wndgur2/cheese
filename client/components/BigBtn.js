import Link from "next/link";

function BigBtn({enabled, href, src, children}) {
    return (
        <Link href={enabled? href:""}>
            <div
                style={{
                    display: "flex",
            }}>
                <button style={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    borderRadius: "14px",
                    backgroundColor: `${enabled? "#FFD56A":"#FEFBF6"}`,
                    border: "none",
                    boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                    width: "43vw",
                    height: "13vh",
                    lineHeight:"normal",
                }}>
                    <div style={{
                        width:"36%",
                        height:"36%",
                        backgroundImage:"url("+src+")",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                        }} />
                    {children?
                        <p style={{
                            fontSize: "4vw",
                            margin:"1vh 0px 0px 0px"
                        }}>{children}</p>:
                        <></>
                    }
                </button>
            </div>
        </Link>
    )
}

export default BigBtn;