'use client';
import Range from "@/components/Range";
import { useState } from "react";
import editStyles from "../edit.module.css";

export default function Adjust() {
  const [brightness, setBrightness] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [contrast, setContrast] = useState(50);
  return (
    <div>
      <div className={editStyles.editWrapper}>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          width:"100%",
          padding:"0px 4vw",
      }}>
          <div className={editStyles.editEntity}>
            <span style={{
                fontSize: "16px",
                margin:"10px 14px",
            }}>자동 조정</span></div>
          <div className={editStyles.editEntity}>
            <span style={{
                fontSize: "16px",
                margin:"10px 14px",
            }}>초기화</span>
          </div>
        </div>
        <div style={{
          width:"100%",
          textAlign:"center"
        }}>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>밝기</p>
          <Range value={brightness} setValue={setBrightness} fixThumbSize={true}>
            %</Range>
        </div>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>채도</p>
            <Range value={saturation} setValue={setSaturation} fixThumbSize={true}>
              %</Range>
        </div>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>밝기</p>
          <Range value={brightness} setValue={setBrightness} fixThumbSize={true}>
            %</Range>
        </div>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>채도</p>
            <Range value={saturation} setValue={setSaturation} fixThumbSize={true}>
              %</Range>
        </div>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>밝기</p>
          <Range value={brightness} setValue={setBrightness} fixThumbSize={true}>
            %</Range>
        </div>
        <div style={{width:"100%"}}>
          <p style={{margin:"0px 0px -2vh 0px"}}>채도</p>
            <Range value={saturation} setValue={setSaturation} fixThumbSize={true}>
              %</Range>
        </div>
        </div>
        
      </div>
    </div>
  )
}