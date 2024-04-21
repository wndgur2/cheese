'use client';

import ImageText from "@/components/ImageText";
import Tilter from "@/components/Tilter";
import editStyles from "../edit.module.css";
import { useEffect, useState } from "react";
import { Page } from "@/app/edit/edit.module";
import RotateBtn from "@/components/RotateBtn";

/** @param {{page:Page}} page */
export default function Trim({page}) {
  const [isCroping, setIsCroping] = useState(false);
  const [cropIndex, setCropIndex] = useState(-1);
  const [rotateVal, setRotateVal] = useState(page?.rotation);
  const [signal, setSignal] = useState(false);

  const cropOptions = [
    {
      src: "/edit/trim/free.png",
      text: "자유롭게",
      ratio: null
    },
    // {
    //   src: "/edit/trim/1_1.png",
    //   text: "1:1",
    //   ratio: [1, 1]
    // }, {
    //   src: "/edit/trim/4_3.png",
    //   text: "4:3",
    //   ratio: [4, 3]
    // }, {
    //   src: "/edit/trim/16_9.png",
    //   text: "16:9",
    //   ratio: [16, 9]
    // }, {
    //   src: "/edit/trim/16_10.png",
    //   text: "16:10",
    //   ratio: [16, 10]
    // },
  ]

  const handleCropClick = (ratio, i)=>{
    if(page){
      Page.setTouchLayer(page, "crop");
      setIsCroping(true);
      setCropIndex(i)
    }
  }

  useEffect(()=>{
    if(page){
      setIsCroping(false);
      if(isCroping)
        Page.disableTouchLayer();
    }
  }, [page]);

  useEffect(()=>{
    page?.rotate(rotateVal);
  }, [rotateVal]);

  return (
    <div>
      <div className={editStyles.editWrapper}>
        <span style={{
          width:"100%",
          textAlign:"center"
        }}>자르기</span>
        <div style={{
          display:"flex",
          overflowX: "scroll",
          alignItems:"baseline",
          justifyContent:"center",
          width: "100%",
          marginTop: "3vh",
        }}>
          {cropOptions.map((v, i)=>
            (!isCroping || i==cropIndex) &&
              <div key={i} onClick={()=>{handleCropClick(v.ratio, i)}}>
                <ImageText src={v.src} width="30vw" size={"17vw"}>{v.text}</ImageText>
              </div>
          )}
          {
            isCroping &&
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"50vw", marginLeft:"10vw"}}>
              <div onClick={()=>{setIsCroping(false);page.crop();setRotateVal(0);setSignal(!signal);}}>
                <ImageText src={"/edit/trim.png"} width="30vw" size={"17vw"}>자르기</ImageText>
              </div>
              <div onClick={()=>{setIsCroping(false);Page.disableTouchLayer();}}>
                <ImageText src={"/edit/delete.png"} width="30vw" size={"17vw"}>취소</ImageText>
              </div>
            </div>
          }
        </div>
      </div>
      <div className={editStyles.editWrapper}>
        <span>회전</span>
        <Tilter value={rotateVal} setValue={setRotateVal} page={page} signal={signal} />
        <p style={{
          textAlign:"center",
          margin:"0px",
        }}>{rotateVal}°</p>
        </div>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          margin: "0px 4vw"
        }}>
        <div onClick={()=>{page?.rotate(90, true)}}>
          <RotateBtn src={"/edit/trim/rotate_anticlock.png"} iconWidth={32} size={52} />
        </div>
        <div onClick={()=>{page?.rotate(-90, true)}}>
          <RotateBtn src={"/edit/trim/rotate_clock.png"} iconWidth={32} size={52} />
        </div>
      </div>
    </div>
  )
}
