function Title({size, letterSpacing, children}) {
    return (
        <span style={{
            fontSize:`${size}px`,
            fontWeight: "700",
            letterSpacing: `${letterSpacing?letterSpacing:"1.82px"}`,
            margin: "0px",
            fontStyle: "normal",
            lineHeight: "normal",
            color: "#212121",
            whiteSpace: "nowrap",
        }}>
            {children}
        </span>
    )
}
export default Title;