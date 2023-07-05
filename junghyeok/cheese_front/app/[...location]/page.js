'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const locations = ["한경대 안성캠퍼스", "중앙대 안성캠퍼스", "평택 스타필드"]
  useEffect(()=>{
    console.log(pathname);
    const location = locations[pathname.split('/')[2]];
    if(location){
      localStorage.setItem("location", location);
      router.push("/");
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
