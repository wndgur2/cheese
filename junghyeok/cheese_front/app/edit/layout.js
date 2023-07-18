'use client';

import NavBtn from "@/components/NavBtn";
import "./styles.css";
import { usePathname, useRouter } from "next/navigation";

export default function EditLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  let i =0;
  let images = ["/sample.jpeg", "/sample.jpeg", "/sample.jpeg", "/sample.jpeg", "/sample.jpeg"];

  const navs = [
    ["ai", "AI"],
    ["trim", "다듬기"],
    ["draw", "그리기"],
    ["frame", "프레임"],
    ["sticker", "스티커"],
    ["text", "텍스트"],
    ["filter", "필터"],
    ["adjust", "조정"],
  ];

  return (
    <div>
      <div style={{
        backgroundColor:"#F9F7F6",
        height:"calc(100vh - 64px)",
      }}>
        <div style={{
          display:"flex",
          gap:"10px",
          overflowX:"scroll",
          padding: "1vh 2vw",
          height: "8vh",
        }}>
         <img src="/edit/add.png" width={60} />
          {images.map((src)=>{
            i++;
            return <img key={i} src={src} width={"32%"} />
          })}
        </div>
        
        <div style={{
          backgroundColor: "#000",
          height:"35vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <img src="/sample.jpeg" width={"100%"}/>
        </div>
        
        <div style={{
          padding:"0px 2vw"
        }}>

          <div className="alignCenter" style={{
            width:"100%", height:"48px",
            justifyContent:"space-between",
            margin: "1vh 0px"
          }}>
            <div className="alignCenter" style={{
              gap:10,
            }}>
              <div className="alignCenter">
                <div className="alignCenter" style={{
                  backgroundColor:"#FEFBF6",
                  width:"60px", height:"48px",
                  borderRadius:"30px 0px 0px 30px",
                  borderRightColor: "#CCCCCC",
                  borderRightWidth: "0.5px",
                  borderRightStyle: "solid",
                  boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.05)",
                  justifyContent:"center",
                }}>
                  <div className="alignCenter">
                    <img src="/edit/undo.png" width={24} />
                  </div>
                </div>
                <div className="alignCenter" style={{
                  backgroundColor:"#FEFBF6",
                  width:"60px",
                  height:"48px",
                  borderRadius:"0px 30px 30px 0px",
                  boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.05)",
                  justifyContent:"center",
                }}>
                  <div className="alignCenter">
                    <img src="/edit/redo.png" width={24} />
                  </div>
                </div>
              </div>

              <div className="alignCenter">
                <img src="/edit/reset.png" width={60} />
              </div>
              
            </div>

            <div className="alignCenter" style={{gap:10}}>
              <div className="alignCenter">
                <img src="/edit/save.png" width={60} />
              </div>

              <div className="alignCenter"
                onClick={()=>{
                  router.push("/home");
              }}>
                <img src="/edit/exit.png" width={60} />
              </div>
            </div>
          </div>

          <div style={{
            overflowY:"scroll",
            overflowX:"visible",
            height:"calc(55vh - 112px)"
          }}>
            {children}
            <br/>
          </div>
        </div>
      </div>
      
      <div style={{
        position: "absolute",
        display:"flex",
        gap: 12,
        alignItems:"center",
        width:"100%",
        height:"64px",
        bottom:"0px",
        left:"0px",
        fontSize: "12px",
        fontWeight: 350,
        letterSpacing: "0.6px",
        backgroundColor:"#FEFBF6",
        boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, 0.05)",
        overflowX: "scroll"
      }}>
        {navs.map((name, i)=>{
          return (
            <NavBtn
              key={i}
              src={`/edit/${pathname.split("/")[2]==name[0]?name[0]+"_accent":name[0]}.png`}
              width="24"
              active={pathname.split("/")[2]==name[0]}
              href={`/edit/${name[0]}`}
              accentColor="#2A2A2A"
              accentFontColor={pathname.split("/")[2]==name[0]?"#FFD56A":""}
            >
              {name[1]}
            </NavBtn>
          )
        })}
      </div>
    </div>
  )
}
