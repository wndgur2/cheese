'use client';

import BigButton from "../../components/BigButton";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheeseMap() {
  // view에 사용될 변수들
  const locations = {"한경대 안성캠퍼스": "경기도 안성시 중앙로 327",
    "중앙대 안성캠퍼스":"경기도 안성시 대덕면 서동대로 4726",
    "평택 스타필드": "경기도 안성시 공도읍 서동대로 3930-39"
  };
  const [distances, setDistances] = useState([]);

  useEffect(()=>{
    const positions = [[37.7282592, 126.7050989],[37.7272592, 126.7077989],[37.7102592, 126.7067989]];
    let markers = [], infoWindows = [];

    var mapOptions = {
      center: new naver.maps.LatLng(37.7222592, 126.7027989),
      zoom: 15
    };

    const icon = {
      url: "/cheese_2.png",
      size: new naver.maps.Size(32, 32),
      scaledSize: new naver.maps.Size(32, 32)
    }

    var map = new naver.maps.Map('map', mapOptions);
    let i = 0;

    function markerClickHandler(idx) {
      return function(e) {
          var marker = markers[idx],
              infoWindow = infoWindows[idx];

          if (infoWindow.getMap()) {
              infoWindow.close();
          } else {
              infoWindow.open(map, marker);
          }
      }
    }

    for (const [key, value] of Object.entries(locations)){
      const contentString = 
        `<div style="padding:8px; border-radius:20px; background-color:#FFFFFF;">
          <a href="/locations/${i}" style="color: black; text-decoration: none;">
            ${Object.keys(locations)[i]}
          </a>
        </div>`;

      const position = new naver.maps.LatLng(positions[i][0], positions[i][1])

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
      i++;
    }

    for (i=0; i<markers.length; i++) { // 마커에 클릭 리스너 달기
      naver.maps.Event.addListener(markers[i], 'click', markerClickHandler(i));
    }
    
    // 현재위치 조회, 지도 이동, 지점과 거리 계산
    // navigator.geolocation.getCurrentPosition((pos) => {
    //     const current_position = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //     map.morph(current_position, 16);

    //     let new_distances = [];
    //     positions.map((poss)=>{
    //       let distance = Math.sqrt(
    //         Math.pow((Math.cos(current_position.lat())*6400*2*3.14/360)*
    //           Math.abs(current_position.lng() - poss[1]), 2)
    //         +
    //         Math.pow(111* Math.abs(current_position.lat() - poss[0]), 2)
    //       );
    //       new_distances.push(distance);
    //     })
    //     setDistances(new_distances);
    //   }
    // );
  },[]);

  return (
    <div>
      <div id="map" style={{width:"100%", height:"400px"}}></div>

      {Object.keys(locations).map((location, i)=>{
          return (
              <div key={i}>
                  <Link href={`/location/${i}`} style={{textDecoration: "none", color:"black"}}>
                    {
                      distances[i]?
                        <BigButton title={location + " " + distanceToString(distances[i])}
                        content={locations[location]} />
                        :
                        <BigButton title={location}
                        content={locations[location]} />
                    }
                  </Link>
              </div>
          )
      })}
    </div>
  )
}

function distanceToString(distance){
  let p = "km";
  if(distance < 1) {
    distance *= 1000;
    p = 'm';
  }
  distance = parseFloat(distance.toFixed(2));
  return distance.toString() + p
}