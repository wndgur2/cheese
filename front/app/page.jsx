'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  let router = useRouter();
  console.log("/로 접근함!");
  useEffect(()=>{
    // window.onload = ()=>{
    //   Kakao.init('c089c8172def97eb00c07217cae17495');
    // }
    router.replace("/home");
  }, []);

  return (
    <div>
      <div style={{
        width: "100vw",
        height: "100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
      }}>
        <img src='/cheese_512.png' width={"50%"} />
      </div>
    </div>
  )
}
