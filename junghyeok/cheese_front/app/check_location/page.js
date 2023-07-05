'use client';

import BigButton from "../../components/BigButton";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckLocation() {
  // view에 사용될 변수들
  const locations = {"한경대 안성캠퍼스": "경기도 안성시 중앙로 327",
    "중앙대 안성캠퍼스":"경기도 안성시 대덕면 서동대로 4726",
    "평택 스타필드": "경기도 안성시 공도읍 서동대로 3930-39"
  };
  const [location, setLocation] = useState("...");
  useEffect(()=>{
    setLocation(localStorage.getItem("location"));
    const positions = [[37.7282592, 126.7050989],[37.7272592, 126.7077989],[37.7102592, 126.7067989]];
    let mapOptions = {
      center: new naver.maps.LatLng(37.7222592, 126.7027989),
      zoom: 15
    };
    const icon = {
      url: "/cheese_2.png",
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
      <h1>{location}</h1>
      <h3>{locations[location]}</h3>
      <div id="map" style={{width:"100%", height:"400px"}}></div>
      <Link href={"/cheese_map"} style={{textDecoration: "none", color:"black"}}>
        <BigButton title={"현재 위치가 아닌가요?"}
        content={"치즈맵에서 지점을 변경하세요."} />
      </Link>
    </div>
  )
}