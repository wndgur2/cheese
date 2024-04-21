
function LongBtn({colored, children}){

    return (
        <div style={{
            backgroundColor: `${colored?"#FFD56A":"#FEFBF6"}`,
            borderRadius: "40px",
            display:"flex",
            margin: "2vh 0px",
            padding: "2vh 6vw 2vh 6vw",
            alignItems:"center",
            gap: "6vw",
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.10)",
        }}>
            {children}
        </div>
    )
}

export default LongBtn;