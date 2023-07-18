'use client'

function Palette({ disabled }) {
    const colors = ["#FF0000", "#AA0000", "#FF00AA",
     "#FFAA00", "#AAFF00", "#00AA00", "#00FFAA", "#AA00FF",
     "#00AAFF", "#0000FF", "#0000AA", "#FFFFFF", "#000000", "url('/edit/draw/colormap.png')"]
    return (
        <div style={{
            display:"flex",
            flexWrap: "wrap",
            gap: "calc(2vw - 2px)",
            margin:"0px 3vw",
            justifyContent:"space-around"
        }}>{   
            colors.map((color, i)=>
                disabled?
                    <div key={i} style={{
                        background: "#CCC",
                        width:"9vw",
                        height:"9vw",
                        margin: "1px",
                        borderRadius:"10vw",
                    }}/>
                :
                    <div key={i} style={{
                        background: color,
                        width:"9vw",
                        height:"9vw",
                        borderRadius:"10vw",
                        backgroundSize: "cover",
                        border: color=="#FFFFFF"? "solid":"",
                        margin: color=="#FFFFFF"?"":"1px",
                        borderColor: "#999",
                    }}
                />
            )
        }</div>
    )
}
export default Palette;