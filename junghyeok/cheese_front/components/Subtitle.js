function Subtitle({size, letterSpacing, children}) {
    return (
        <span style={{
            fontSize:`${size}px`,
            fontWeight: "300",
            letterSpacing: `${letterSpacing}px`,
            margin: "0px",
            fontStyle: "normal",
            lineHeight: "normal",
            color: "#444444"
        }}>
            {children}
        </span>
    )
}
export default Subtitle;