'use client';

import Palette from "@/components/Palette";
import { useEffect, useRef, useState } from "react";
import textStyles from './text.module.css';
import editStyles from '../edit.module.css';

export default function Text() {
  const fontsElement = useRef();
  const [color, setColor] = useState("#000000");
  const fonts = ["나눔고딕", "나눔명조", "Roboto", "Gulim", "Batang"]

  useEffect(()=>{
  }, []);
  return (
    <div>
      <div className={editStyles.editWrapper}>
        <div style={{
          margin: "1vh 0px 3vh 0px",
          width: "90%",
        }}>
          <div className={editStyles.editEntity}
            style={{ width: "100%", padding:0 }}
          >
            <div style={{
              display:"flex",
              gap:"3vw",
              height: "8vh",
              alignItems:"center",
              justifyContent:"space-around",
            }}>
              <img src="/edit/text/+.png" width={24} height={24} />
              <img src="/edit/text/B.png" width={24} height={24} />
              <img src="/edit/text/S.png" width={24} height={24} />
              <img src="/edit/text/U.png" width={24} height={24} />
            </div>
            <div
              className={textStyles.fontsWrapper}
            >
              <img src="/edit/text/fonts2.png"
              style={{
                position:"absolute",
                zIndex:1,
                left:"50%",
                height:"inherit",
                width:"inherit",
                pointerEvents: "none",
                objectFit: "cover"
              }}></img>
              <div
                className={textStyles.fonts}
                ref={fontsElement}
              >
                {fonts.map((font, key)=>
                  <div
                    key={key}
                    className={textStyles.fontWrapper}
                  >
                    <p style={{
                      margin:0,
                      width:"100%",
                    }}>
                      {font}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Palette color={color} setColor={setColor} />
        <br/>
      </div>
    </div>
  )
}