'use client';

import Subtitle from '@/components/Subtitle';
import TextBtn from '@/components/TextBtn';
import Title from '@/components/Title';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Action() {
    const pathname = usePathname();
    const router = useRouter();
    const [location, setLocation] = useState("...");

    const action = pathname.split('/')[3];
    
    const locations = {"한경대 안성캠퍼스점": "경기도 안성시 중앙로 327",
        "중앙대 안성캠퍼스점":"경기도 안성시 대덕면 서동대로 4726",
        "평택 스타필드점": "경기도 안성시 공도읍 서동대로 3930-39"
    };

    useEffect(()=>{
        let cur_location = localStorage.getItem("location");
        if(!cur_location){
            router.push("/home/cheese_map");
        }

        if(action=="capture"){
            localStorage.setItem("action", "capture");
        } else if(action=="print"){
            localStorage.setItem("action", "print");
        } else{
            console.log("ERR [...action] page: Wrong action given.");
            router.push("/home");
        }
        
        setLocation(cur_location);
        const positions = [[37.7282592, 126.7050989],[37.7272592, 126.7077989],[37.7102592, 126.7067989]];
        let mapOptions = {
            center: new naver.maps.LatLng(37.7222592, 126.7027989),
            zoom: 15
        };
        const icon = {
            url: "/cheese_120.png",
            size: new naver.maps.Size(32, 32),
            scaledSize: new naver.maps.Size(32, 32)
        }
        var map = new naver.maps.Map('map', mapOptions);
        new naver.maps.Marker({
            position: new naver.maps.LatLng(positions[0][0], positions[0][1]),
            map: map,
            animation: naver.maps.Animation.DROP,
            icon: icon
        });
        map.morph(new naver.maps.LatLng(positions[0][0], positions[0][1]), 16);
    },[]);

  return (
    <div>
        <div
            onClick={()=>{router.back()}}
            style={{
            position:"absolute",
            top: 16,
            left: 16,
        }}>
            <img src='/back.png' width={28}/>
        </div>
        <p style={{
            fontSize:"24px",
            fontWeight:"500",
            color:"#343434",
            marginTop:0
        }}>{action=="print"?"인화":"촬영"} 장소를 확인하세요.</p>
        <Title size={26}>{location}</Title> <br/>
        <Subtitle size={22} letterSpacing={1.82}>{locations[location]}</Subtitle>
        <div id="map" style={{
            width:"100%", height:"300px",
            margin: "20px 0px 20px 0px",
            borderRadius: 10,
            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)"
        }}></div>
        <TextBtn href="/home/cheese_map"
        content="치즈맵에서 지점을 변경하세요.">현재 위치가 아닌가요?</TextBtn>

        <Link href={"/"+action}>
            <div style={{
                position:"absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "64px",
                backgroundColor: "#FFD56A",

                display:"flex",
                alignItems:"center",
                justifyContent:"center",
            }}>
                <span style={{
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: 1.4
                }}>다음</span>
            </div>
        </Link>
    </div>
  )
}
