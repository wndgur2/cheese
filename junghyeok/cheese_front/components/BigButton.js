function BigButton(props) {
    return (
        <div style={{backgroundColor:"RGB(220,220,220)"}}>
            <p>{props.title}</p>
            <p>{props.content}</p>
        </div>
    )
}

export default BigButton;