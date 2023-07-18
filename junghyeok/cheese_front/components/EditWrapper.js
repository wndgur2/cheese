function EditWrapper(props) {
    return (
        <div style={{
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.1)",
            backgroundColor:"RGB(220,220,220)",
            borderRadius: "12px",
            background: "#FEFBF6",
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"space-around",
            alignItems:"center",
            padding: "1.5vh 3vw 2vh 3vw",
            margin:"2vh 1vw",
            color: "#212121",
            fontSize: "16px",
            fontWeight: "500",
        }}>
            {props.children}
        </div>
    )
}

export default EditWrapper;