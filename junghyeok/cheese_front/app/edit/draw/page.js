'use client';

import ImageText from "@/components/ImageText";
import Palette from "@/components/Palette";
import Range from "@/components/Range";
import { useState } from "react";
import drawStyles from './draw.module.css';
import editStyles from "../edit.module.css";

export default function Draw() {
  const pages = ["pen", "eraser", "bucket"];
  const [page, setPage] = useState(pages[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [color, setColor] = useState("#000000");
  return (
    <div>
      <div className={editStyles.editWrapper}>
        <div style={{width:"100%"}}>
          <Range
            color={color}
            disabled={page=="bucket"}
            value={brushSize}
            setValue={setBrushSize}
          >
              px
          </Range>
        </div>
        <br/>
          <Palette color={color} setColor={setColor} disabled={page=="eraser"}/>
        <br/>
      </div>

      <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"start",
        height:"30%",
        margin:"0px 8vw"
      }}>
        <div style={{
            width:"100%",
            display:"flex",
            justifyContent:"space-around",
            alignItems:"center",
            marginTop:"1vh"
        }}>
          {pages.map((page_, i)=>
            <div
              key={i}
              className={drawStyles.navWrapper}
              id={page==page_?`${drawStyles.selected}`:""}
              onClick={()=>{ setPage(page_)}}
            >
              <ImageText 
                src={`/edit/draw/${page_}.png`}
                width={28}
              ></ImageText>
            </div>
          )}
        </div>
      </div>
    </div>
    
  )
}
