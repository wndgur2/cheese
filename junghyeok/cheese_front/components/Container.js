function Container({ paddingTop, children }) {
    return (
        <div style={{
            backgroundColor:"#FEFBF6",
            padding: `${paddingTop} 20px 0px 20px`,
            overflowY: "scroll",
            height: "calc(100vh - 94px)",
        }}>
            {children}
        </div>
    )
}
export default Container;