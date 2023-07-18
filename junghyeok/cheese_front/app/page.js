'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  let router = useRouter();
  console.log("/로 접근함!");
  useEffect(()=>{
    window.onload = ()=>{
      Kakao.init('c089c8172def97eb00c07217cae17495');
    }
    router.replace("/home");
  }, []);

  return (
    <div>
      loading...
    </div>
  )
}
