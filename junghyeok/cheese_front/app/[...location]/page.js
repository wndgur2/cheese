'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const locations = ["한경대 안성캠퍼스", "중앙대 안성캠퍼스", "평택 스타필드"]
  useEffect(()=>{
    const location = locations[pathname.split('/')[2]];
    localStorage.setItem("location", location);
    router.push("/");
  }, []);
  
  return (
    <div>
      <p>위치 설정중...</p>
    </div>
  )
}
