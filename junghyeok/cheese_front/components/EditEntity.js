function EditEntity(props) {
    return (
        <div style={{
            backgroundColor:"RGB(220,220,220)",
            borderRadius: "12px",
            border: "1px solid #ddd",
            background: "#FEFBF6",
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"space-around",
            alignItems:"center",
            margin:"1vh 0px",
            padding: "1vh 4vw 1vh 4vw",
            color: "#212121",
            fontSize: "16px",
            fontWeight: "500",
        }}>
            {props.children}
        </div>
    )
}

export default EditEntity;