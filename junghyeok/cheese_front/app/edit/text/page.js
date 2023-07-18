import EditEntity from "@/components/EditEntity";
import EditWrapper from "@/components/EditWrapper";
import Palette from "@/components/Palette";
import './styles.css';

export default function Text() {
    return (
      <div>
        <EditWrapper>
          <div style={{
            margin: "1vh 0px 2vh 0px"
          }}>
            <EditEntity>
              <div style={{
                display:"flex",
                gap:"2vw"
              }}>
                <img src="/edit/text/+.png" width={24} />
                <img src="/edit/text/B.png" width={24} />
                <img src="/edit/text/S.png" width={24} />
                <img src="/edit/text/U.png" width={24} />
              </div>
              <div className="font">
                <img src="/edit/text/fonts2.png" style={{
                  position:"absolute",
                  zIndex:1,
                  left:"50%",
                  height:"inherit",
                  width:"inherit",
                  pointerEvents: "none",
                  objectFit: "cover"
                }}></img>
                <br/>
                <p style={{ margin:0 }}>나눔 고딕</p>
                <p style={{ margin:0 }}>나눔 명조</p>
                <p style={{ margin:0 }}>Roboto</p>
                <p style={{ margin:0 }}>Gulim</p>
                <p style={{ margin:0 }}>Batang</p>
                <br/>
              </div>
            </EditEntity>
          </div>
          
          <Palette />
        </EditWrapper>
      </div>
    )
  }
  