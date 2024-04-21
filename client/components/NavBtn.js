import Link from "next/link";

function NavBtn({active, src, width, children, accentColor, accentFontColor}) {
  return (
    <div style={{
      lineHeight:"10px",
      height: "56px",
      alignItems:"center",
      width: "56px",
      backgroundColor:`${active?accentColor:""}`,
      borderRadius: "24px",
    }}>
      <div style={{
        height: "70%",
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
      }}>
        <img src={src} width={width}/>
      </div>
      <div style={{
        display:"flex",
        width:"100%",
        height: "30%",
        alignItems:"start",
        justifyContent:"center",
      }}>
        <p style={{
          margin:0,
          color:`${accentFontColor}`
        }}>{children}</p>
      </div>
    </div>
  )
}
export default NavBtn;