'use client';
import Range from "@/components/Range";
import { useEffect, useState } from "react";
import editStyles from "../edit.module.css";

export default function Adjust({page}) {
  const 밝기= useState(page?page.filter.brightness/2:50);
  const 채도= useState(page?page.filter.saturate/2:50);
  const 대비= useState(page?page.filter.contrast/2:50);
  const 그레이스케일= useState(page?page.filter.grayscale:0);
  const 블러= useState(page?page.filter.blur:0);
  const filters = [{
    name: "밝기",
    value: 밝기[0],
    setVal: 밝기[1],
  }, {
    name: "채도",
    value: 채도[0],
    setVal: 채도[1],
  }, {
    name: "대비",
    value: 대비[0],
    setVal: 대비[1],
  }, {
    name: "그레이스케일",
    value: 그레이스케일[0],
    setVal: 그레이스케일[1],
  }, {
    name: "블러",
    value: 블러[0],
    setVal: 블러[1],
  }];

  function handleResetFilter(){
    밝기[1](50);
    채도[1](50);
    대비[1](50);
    그레이스케일[1](0);
    블러[1](0);
  }
    
  useEffect(()=>{
    if(!page) return;
    밝기[1](page.filter.brightness/2);
    채도[1](page.filter.saturate/2);
    대비[1](page.filter.contrast/2);
    그레이스케일[1](page.filter.grayscale);
    블러[1](page.filter.blur);
  }, [page]);
    
  useEffect(()=>{
    const filter_ = {
      brightness: 밝기[0]*2,
      saturate: 채도[0]*2,
      contrast: 대비[0]*2,
      grayscale: 그레이스케일[0],
      blur: 블러[0],
    }
    page?.setFilter(filter_);
  }, [밝기[0], 채도[0], 대비[0], 그레이스케일[0], 블러[0]]);

  return (
    <div>
      <div className={editStyles.editWrapper}>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          width:"calc(100% - 8vw)",
          padding:"0px 4vw",
        }}>
          <div className={editStyles.editEntity}>
            <span style={{
                fontSize: "16px",
                margin:"10px 14px",
            }}>자동 조정</span></div>
          <div className={editStyles.editEntity} onClick={handleResetFilter}>
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
            {filters.map((f, i)=>{
              return (
                <div key={i}>
                  <p style={{margin:"0px 0px -2vh 0px"}}>{f.name}</p>
                  <Range value={f.value} setValue={f.setVal} fixThumbSize={true}>
                    %</Range>
                </div>
              )
            })}
        </div>
        
      </div>
    </div>
  )
}