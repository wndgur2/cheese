import Link from "next/link";

function TextBtn({color, type, substring, content, href, children}) {
    function render(){
        return (
            <div style={{
                display:"flex",
                alignItems: "center",
                justifyContent:"space-between",
                margin: type=="big"? "3.2vh 0 3.2vh 0" : "2.2vh 0 2.2vh 0",
                padding: type=="big"? "2.6vh 5vw 2.6vh 5vw" : "1.8vh 4vw 1.8vh 4vw",
                backgroundColor:color,
                boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.10)",
                borderRadius:"8px",
                }}>
                <div>
                    <span style={{color: "#212121", fontSize:"18px",
                        marginRight: "10px", fontWeight: 400}}>
                        {children}
                    </span>
                    <span style={{color: "#444", fontSize:"14px",
                        fontWeight: 400}}>
                        {substring}
                    </span> <br/>
                    <span style={{fontSize:"16px", fontWeight: 200}}>
                        {content}
                    </span>
                </div>
                <div style={{
                    display: "inline-block",
                    width:"2vw"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                    }}>
                        <img src="/arrow_right.png" width={"28px"}/>
                    </div>
                </div>
            </div>)
    }
    return (
        <div>
        {href ?
            <Link href={href} style={{textDecoration: "none", color:"black"}}>
                {render()}
            </Link>
        :   <div>
                {render()}
            </div>
    }</div>
    )
}

export default TextBtn;