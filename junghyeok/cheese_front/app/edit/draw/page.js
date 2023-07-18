'use client';

import EditWrapper from "@/components/EditWrapper";
import ImageText from "@/components/ImageText";
import Palette from "@/components/Palette";
import Range from "@/components/Range";
import { useState } from "react";

export default function Draw() {
  const pages = ["pen", "eraser", "bucket"];
  const [page, setPage] = useState(pages[0]);
  const [brushSize, setBrushSize] = useState(12);
  return (
    <div>
      <EditWrapper>
        <div style={{width:"100%"}}>
          <Range
            disabled={page=="bucket"}
            value={brushSize}
            setValue={setBrushSize}
          >
              px
          </Range>
        </div>
        <br/>
          <Palette disabled={page=="eraser"}/>
        <br/>
      </EditWrapper>

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
              className='navWrapper' 
              id={page==page_?"selected":""}
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
