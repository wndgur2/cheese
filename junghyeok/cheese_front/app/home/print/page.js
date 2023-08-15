'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import printStyle from "./print.module.css";

export default function Print() {
  let router = useRouter();
  useEffect(()=>{
    if(!localStorage.getItem("location")){
      router.push("/home/cheese_map");
    }
  },[]);
  return (
    <div className="container">
      <p className={printStyle.text}>사진을 인화중입니다.</p>
      <div className={printStyle.dots}>
        <div className={printStyle.dot} id={printStyle.d1} />
        <div className={printStyle.dot} id={printStyle.d2} />
        <div className={printStyle.dot} id={printStyle.d3} />
      </div>
    </div>
  )
}
