'use client'

function Palette({ color, setColor, disabled }) {
    const colors = ["#FF0000", "#AA0000", "#FF00AA",
     "#FFAA00", "#AAFF00", "#00AA00", "#00FFAA", "#AA00FF",
     "#00AAFF", "#0000FF", "#0000AA", "#FFFFFF", "#000000"]
    return (
        <div style={{
            display:"flex",
            flexWrap: "wrap",
            gap: "calc(2vw - 2px)",
            margin:"0px 4vw",
            justifyContent:"space-around"
        }}>{   
            colors.map((c, i)=>
                    <div key={i} style={{
                        width:"9vw",
                        height:"9vw",
                        borderRadius:"10vw",
                        background: disabled? "#CCC": c,
                        outlineStyle: (c==color||c=="#FFFFFF") && !disabled? "solid":"",
                        outlineColor: "#666",
                        outlineWidth: "1.5px",
                    }}
                        onClick= {disabled ? ()=>{}:()=>setColor(c)}
                        />
                        )
                    }
                    {disabled? 
                        <div style={{
                            width:"9vw",
                            height:"9vw",
                            borderRadius:"10vw",
                            backgroundColor: "#CCC",
                        }}
                        />:
                        <div style={{
                            width:"9vw",
                            height:"9vw",
                            borderRadius:"10vw",
                            backgroundImage: "url('/edit/draw/colormap.png')",
                            backgroundSize:"cover",
                            outlineStyle: ((color=="url('/edit/draw/colormap.png')"))? "solid":"",
                            outlineColor: "#666",
                            outlineWidth: "1.5px",
                        }}
                            onClick= {()=>setColor("url('/edit/draw/colormap.png')")}
                        />
                    }
        </div>
    )
}
export default Palette;