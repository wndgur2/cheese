'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export default function Home() {
  const [uid, setUid] = useState();
  const [location, setLocation] = useState();
  const [isLocated, setIsLocated] = useState(false);
  let session  = useSession();

  useEffect(()=>{
    let loc = localStorage.getItem("location");
    if(loc != null){
      setLocation(loc);
      setIsLocated(true);
    }

    if (localStorage.getItem("uuid") === null)
      localStorage.setItem("uuid", guid());
    setUid(localStorage.getItem("uuid"));
}, []);

  return (
    <div>
      <p>uid : {uid}</p>
      <p>session.status : {session.status}</p>
      { isLocated?
        <div><p>현재 위치 : {location}</p><button onClick={()=>{
            localStorage.removeItem("location");
            setIsLocated(false);
          }
        }>위치 없애기</button></div>:
        <div>현재 위치 없음 : <Link href="/cheese_map">지점을 선택해주세요.</Link><br/></div>
      }

      <br/>
      {isLocated?<Link href="/edit"> 편집 </Link>:<span>편집</span>}
      <Link href="/capture"> 촬영 </Link>
      {isLocated?<Link href="/print"> 인화 </Link>:<span>인화</span>}
      
      <br/>
      <br/>
      <Link href="/share">공유한 사진</Link>
    </div>
  )
}
