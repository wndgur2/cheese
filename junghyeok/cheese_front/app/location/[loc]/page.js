'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Location(props) {
  const router = useRouter();
  const locations = ["한경대 안성캠퍼스점", "중앙대 안성캠퍼스점", "평택 스타필드점"]
  useEffect(()=>{
    const location = locations[props.params.loc];
    if(location){
      localStorage.setItem("location", location);
      router.push("/home");
    } else{
      console.log("ERR [...location].js: No location code given");
      router.back();
    }
  }, []);
  
  return (
    <div>
      <p>위치 설정중...</p>
    </div>
  )
}
