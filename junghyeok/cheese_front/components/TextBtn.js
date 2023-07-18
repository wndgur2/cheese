import Link from "next/link";

function TextBtn(props) {
    return (
        <Link href={props.href} style={{textDecoration: "none", color:"black"}}>
            <div style={{
                display:"flex",
                backgroundColor:props.color,
                borderRadius:"8px",
                padding: props.type=="big"? "20px" : "12px 20px 12px 20px",
                margin: props.type=="big"? "30px 0 30px 0" : "20px 0 20px 0",
                height: "50px",
                alignItems: "center",
                boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.10)",
                justifyContent:"space-between",
                }}>
                <div>
                    <span style={{color: "#212121", fontSize:"18px",
                        marginRight: "10px", fontWeight: 400}}>
                        {props.children}
                    </span>
                    <span style={{color: "#444444", fontSize:"14px",
                        fontWeight: 400}}>
                        {props.substring}
                    </span> <br/>
                    <span style={{fontSize:"16px", fontWeight: 200}}>
                        {props.content}
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
            </div>
        </Link>
    )
}

export default TextBtn;