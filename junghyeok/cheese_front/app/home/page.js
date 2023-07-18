'use client';

import BigBtn from '@/components/BigBtn';
import Title from '@/components/Title';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import './style.css';
import TextBtn from '@/components/TextBtn';
import Subtitle from '@/components/Subtitle';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
      <div style={{display:"flex"}}>
        <div style={{display:"inline-block", width:"75%"}}>
          {isLocated?
            <div>
              <Title size="28">{location}</Title> <br/>
              <Subtitle size="20" letterSpacing="1.82">경기도 안성시 중앙로 327</Subtitle>
            </div>
            :
            <div>
              <Title size={28}>치즈한장</Title> <br/>
              <Subtitle size="18" letterSpacing="1.82">선택된 지점이 없어요.</Subtitle>
            </div>}
        </div>
        <div style={{display:"inline-block", width:"25%", height:"100%"}}>
          <div style={{display:"flex", justifyContent:"right", alignItems:"center"}}>
            <BigBtn enabled="true"
              href="/home/cheese_map"
              src="/map_x4.png"
              size="60px"
              iconWidth="26px"
              iconHeight="23px"
            />
          </div>
        </div>
      </div>
      {/* <p>session.status : {session.status}</p> */}
      { isLocated?
        <img src='./sample.jpeg' width={"100%"}
        style={{
          borderRadius:"5px",
          margin:"20px 0 0 0",
          maxHeight:"180px",
          objectFit: "cover"
        }}/>
        :
        <TextBtn href="/home/cheese_map" color="#FFD56A"
          type="big"
          content="현장에서 촬영과 인화를 할 수 있어요.">
            지점을 선택해주세요.
        </TextBtn>
      }

      <div className='bigBtnWrapper'>
        <BigBtn enabled={isLocated}
          href="/access_process/action/capture"
          src="/cheese_empty_37_30_x4.png"
          size="80px"
          iconWidth="37px"
          iconHeight="30px"
        >촬영</BigBtn>
        <BigBtn
          enabled={isLocated}
          href="/access_process/action/print"
          src="/print_x4.png"
          size="80px"
          iconWidth="37px"
          iconHeight="32px"
        >인화</BigBtn>
        <BigBtn
          enabled={true}
          href="/edit"
          src="/edit_x4.png"
          size="80px"
          iconWidth="37px"
          iconHeight="30px"
        >편집</BigBtn>
      </div>
      
      <TextBtn content="사진 아이디어를 얻어보세요." href="/home/share">
        공유한 사진 구경하기
      </TextBtn>
      <div style={{
        display:"flex",
        gap:"10px",
        overflowX:"scroll",
      }}>
        <img src='/sample.jpeg' key={1}
          style={{
            maxHeight:"180px",
            borderRadius:"5px",
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
            objectFit: "cover",
            width: "70vw",
        }}/>
        <img src='/sample.jpeg' key={2}
          style={{
            maxHeight:"180px",
            borderRadius:"5px",
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
            objectFit: "cover",
            width: "70vw",
        }}/>
        <img src='/sample.jpeg' key={3}
          style={{
            maxHeight:"180px",
            borderRadius:"5px",
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
            objectFit: "cover",
            width: "70vw",
        }}/>
      </div>
      {isLocated?
        <button onClick={()=>{
          localStorage.removeItem("location");
        }}>위치 없애기</button>:<></>
      }
    </div>
  )
}