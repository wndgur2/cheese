'use client';

import { useEffect, useState } from "react";
import TextBtn from "@/components/TextBtn";
import Branch from "@/entity/Branch";
import Script from "next/script";

async function getData(url, setBranches) {
  let branches = [];
  try{
    const res = await (await fetch(url)).json();

    const promises = res.data.map(async (branch)=>{
      const newBranch = new Branch(branch.id, branch.name, branch.longitude, branch.latitude, branch.shootingCost, branch.printingCost, branch.paperAmount);
      await newBranch.getAddress();
      branches.push(newBranch);
    })
    await Promise.all(promises);

    setBranches(branches);
    return branches;
  }
  catch(error){
    console.log(error);
    throw new Error('Failed to fetch data')
  }
}

export default function CheeseMap() {
  const [branches, setBranches] = useState([]);
  const [currentPosition, setCurrentPosition] = useState();
  const [ready, setReady] = useState(false);

  let markers = [], infoWindows = [], i=0, map, icon;

  useEffect(()=>{
    console.log(ready);
    if(!ready) return;
    icon = {
      url: "/cheese_120.png",
      size: new naver.maps.Size(32, 32),
      scaledSize: new naver.maps.Size(32, 32)
    };
    initMap();
    getData(`${process.env.NEXT_PUBLIC_API}/branch`, setBranches).then((res)=>{
      if(res==[]) return;
      console.log(res);
      for (const branch of res){
        const contentString = 
          `<div style="padding:8px; border-radius:20px; background-color:#FFFFFF;">
            <a href="/location/${i++}" style="color: black; text-decoration: none;">
              ${branch.name}
            </a>
          </div>`;
    
        const position = new naver.maps.LatLng(branch.latitude, branch.longitude);
    
        markers.push(new naver.maps.Marker({
          position: position,
          map: map,
          animation: naver.maps.Animation.DROP,
          icon: icon
        }));
    
        infoWindows.push(
          new naver.maps.InfoWindow({
            content: contentString,
            backgroundColor:"#fff0",
            maxWidth: 160,
            borderWidth: 0,
            anchorSize: new naver.maps.Size(20, 1),
            anchorColor: "#FFFFFF",
            clickable: true,
            pixelOffset: new naver.maps.Point(20, -20)
          }
        ));
      }
      for (i=0; i<markers.length; i++) { // 마커에 클릭 리스너 달기
        naver.maps.Event.addListener(markers[i], 'click', markerClickHandler(i));
      }
    })
  },[ready]);

  // map thing
  function initMap(){
    let mapOptions = {
      center: new naver.maps.LatLng(37.7222592, 126.7027989),
      zoom: 5
    };
    map = new naver.maps.Map('map', mapOptions);

    navigator.geolocation.getCurrentPosition((pos) => {
      const current_position = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      map.morph(current_position, 5);
      setCurrentPosition(current_position);
    });
  }

  function markerClickHandler(idx) {
    return ()=>{
      var marker = markers[idx],
        infoWindow = infoWindows[idx];

      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    }
  }

  function setCurrentBranch(branch){
    localStorage.setItem("branch", JSON.stringify(branch));
  }

  return (
    <div className="container">
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_PUBLIC}`}
        onReady={()=>{
          setReady(true);
        }}
      ></Script>
      <span className="title" style={{fontSize:30}}>치즈맵</span> <br/>
      <span className="subtitle" style={{letterSpacing:0}}>지점을 선택하고 현장 기능을 이용하세요.</span>
      <div id="map" style={{
        width:"100%", height:"300px",
        borderRadius: 10,
        boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
        margin: "5vh 0px 5vh 0px",
      }}></div>

      {branches.map((branch, i)=>{
        return (
          <div key={i} onClick={()=>{setCurrentBranch(branch)}}>
            <TextBtn href={"/home"} color="#FFD56A"
            substring = {getDistance(branch.longitude, branch.latitude)}
            content={branch.address}>{branch.name}</TextBtn>
          </div>
        )
      })}
    </div>
  )

  function getDistance(longitude, latitude){
    if(!currentPosition) return;
    let distance = Math.sqrt(
      Math.pow(
        (Math.cos(currentPosition.lat())*6400*2*3.14/360)*
        Math.abs(currentPosition.lng() - longitude), 2
      ) + Math.pow(111* Math.abs(currentPosition.lat() - latitude), 2)
    );
  
    let p = "km";
    if(distance < 1) {
      distance *= 1000;
      p = 'm';
    }
    distance = parseFloat(distance.toFixed(0));
  
    return distance.toString() + p
  }
}