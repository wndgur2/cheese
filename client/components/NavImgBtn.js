import Link from "next/link";

function NavImgBtn({href, active, src, width, children}) {
  return (
    <Link href={href}>
      <div style={{
        lineHeight:"10px",
        height: "46px",
        alignItems:"center",
        width: "46px",
        backgroundColor:`${active?"#EEEEEE":""}`,
        borderRadius: 22,
      }}>
        <div style={{
          height: "100%",
          display: "flex",
          alignItems:"center",
          justifyContent:"center",
        }}>
          <img src={src} width={width}
          />
        </div>
      </div>
    </Link>
  )
}
export default NavImgBtn;