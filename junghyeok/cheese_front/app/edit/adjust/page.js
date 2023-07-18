'use client';
import EditEntity from "@/components/EditEntity";
import EditWrapper from "@/components/EditWrapper";
import Range from "@/components/Range";
import { useState } from "react";

export default function Adjust() {
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  return (
      <EditWrapper>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          width:"100%",
          padding:"0px 2vw",
      }}>
          <EditEntity>자동 조정</EditEntity>
          <EditEntity>초기화</EditEntity>
        </div>
        <div style={{
          width:"100%",
          textAlign:"center"
        }}>
          <div style={{width:"100%"}}>
            <p style={{margin:0}}>밝기</p>
            <Range value={brightness} setValue={setBrightness}>
              %</Range>
          </div>
        </div>
        
      </EditWrapper>
    )
  }
  