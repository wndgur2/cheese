'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import queueStyle from "../queue.module.css";
import axios from "axios";

export default function PrinterQueue() {
  let router = useRouter();
  const [queueLength, setQueueLength] = useState(1);

  useEffect(()=>{
    let branch = JSON.parse(localStorage.getItem("branch"));
    if(!branch){
      router.push("/home/cheeseMap");
    }
    // axios.get(`http://${process.env.NEXT_PUBLIC_API}/printerQueue/${branch.id}`, {
    //   params: { device: localStorage.getItem("uuid") }
    // }).then(res=>{
    //   setQueueLength(res.data.data['length_queue']);
    // } ).catch(err=>{
    //   console.log(err);
    // })
  },[]);

  return (
    <div className="container">
      <div className={queueStyle.textBox}>
        <span style={{fontWeight: 700}}>인화 대기중</span><span>입니다.</span> <br/>
        {/* <span>내 앞에 대기자가</span>&nbsp;
        <span style={{fontWeight: 700}}>{queueLength-1}명</span>&nbsp;<span>있어요.</span> */}
      </div>
      <div className={queueStyle.dots}>
        <div className={queueStyle.dot} id={queueStyle.d1} />
        <div className={queueStyle.dot} id={queueStyle.d2} />
        <div className={queueStyle.dot} id={queueStyle.d3} />
      </div>
    </div>
  )
}
