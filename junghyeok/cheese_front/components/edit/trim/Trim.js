'use client';

import BigBtn from "@/components/BigBtn";
import ImageText from "@/components/ImageText";
import Tilter from "@/components/Tilter";
import editStyles from "../edit.module.css";
import { useEffect, useState } from "react";
import { cropStart, crop, cancelCrop, rotate, rotateFixed, getRotation } from "../../../app/edit/edit.module";

export default function Trim({pageIndex}) {
  const [isCroping, setIsCroping] = useState(false);
  const [cropIndex, setCropIndex] = useState(-1);
  const [rotateVal, setRotateVal] = useState(0);

  const crops = [
    {
      src: "/edit/trim/free.png",
      text: "자유롭게",
      ratio: null
    }, {
      src: "/edit/trim/1_1.png",
      text: "1:1",
      ratio: [1, 1]
    }, {
      src: "/edit/trim/4_3.png",
      text: "4:3",
      ratio: [4, 3]
    }, {
      src: "/edit/trim/16_9.png",
      text: "16:9",
      ratio: [16, 9]
    }, {
      src: "/edit/trim/16_10.png",
      text: "16:10",
      ratio: [16, 10]
    },
  ]

  const handleCropClick = (ratio, i)=>{
    setIsCroping(true);
    setCropIndex(i)
    cropStart(ratio);
  }

  useEffect(()=>{
    rotate(rotateVal);
  }, [rotateVal]);

  useEffect(()=>{
    setIsCroping(false);
    setRotateVal(getRotation(pageIndex));
  }, [pageIndex])

  return (
    <div>
      <div className={editStyles.editWrapper}>
        <span style={{
          width:"100%",
          textAlign:"center"
        }}>사진 비율</span>
        <div style={{
          display:"flex",
          overflowX: "scroll",
          alignItems:"baseline",
          width: "100%",
          marginTop: "3vh",
        }}>
          {crops.map((v, i)=>
            (!isCroping || i==cropIndex) &&
              <div key={i} onClick={()=>{handleCropClick(v.ratio, i)}}>
                <ImageText src={v.src} width="30vw" size={"17vw"}>{v.text}</ImageText>
              </div>
          )}
          {
            isCroping &&
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"50vw", marginLeft:"10vw"}}>
              <div onClick={()=>{setIsCroping(false); crop();}}>
                <ImageText src={"/edit/trim.png"} width="30vw" size={"17vw"}>자르기</ImageText>
              </div>
              <div onClick={()=>{setIsCroping(false); cancelCrop();}}>
                <ImageText src={"/edit/delete.png"} width="30vw" size={"17vw"}>취소</ImageText>
              </div>
            </div>
          }
        </div>
      </div>
      <div className={editStyles.editWrapper}>
        <span>회전</span>
        <Tilter value={rotateVal} setValue={setRotateVal} />
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
        <div onClick={()=>{rotateFixed(90)}}>
          <BigBtn src={"/edit/trim/rotate_anticlock.png"} iconWidth={32} size={52} />
        </div>
        <div onClick={()=>{rotateFixed(-90)}}>
          <BigBtn src={"/edit/trim/rotate_clock.png"} iconWidth={32} size={52} />
        </div>
      </div>
    </div>
  )
}
