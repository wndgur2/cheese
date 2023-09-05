'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import printStyle from "./print.module.css";
import axios from "axios";

export default function Print() {
  let router = useRouter();
  useEffect(()=>{
    let branch = JSON.parse(localStorage.getItem("branch"));
    if(!branch){
      router.push("/home/cheeseMap");
    }

    axios.get(`http://${process.env.NEXT_PUBLIC_API}/printerQueue/${branch.id}`, {
      params: {
        device: localStorage.getItem("uuid")
      }
    }).then(res=>{
      console.log(res);
    } ).catch(err=>{
      console.log(err);
    })
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
