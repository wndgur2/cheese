'use client';

import BigButton from "../../components/BigButton";
import { useEffect } from "react";
import Link from "next/link";

export default function CheeseMap() {
  const locations = {"한경대 안성캠퍼스": "경기도 안성시 중앙로 327",
    "중앙대 안성캠퍼스":"경기도 안성시 대덕면 서동대로 4726",
    "평택 스타필드": "경기도 어딘가"
  };
  const positions = [[37.7282592, 126.7050989],[37.7272592, 126.7077989],[37.7302592, 126.7067989]];
  let markers = [];
  let infoWindows = [];

  useEffect(()=>{

    var mapOptions = {
      center: new naver.maps.LatLng(37.7222592, 126.7027989),
      zoom: 15
    };
  
    var map = new naver.maps.Map('map', mapOptions);
    let i = 0;

    for (const [key, value] of Object.entries(locations)){
      const contentString = 
      `<div>
        <a href="/locations/0">
          ${Object.keys(locations)[i]}
        </a>
      </div>`;

      const position = new naver.maps.LatLng(positions[i][0], positions[i][1])

      var marker = new naver.maps.Marker({
        position: position,
        map: map,
        animation: naver.maps.Animation.DROP
      });

      markers.push(marker);

      var infoWindow = new naver.maps.InfoWindow({
        content: contentString,

        maxWidth: 140,
        backgroundColor: "#eee",
        borderColor: "#2db400",
        borderWidth: 5,
        anchorSize: new naver.maps.Size(30, 30),
        anchorSkew: true,
        anchorColor: "#eee",
        clickable: true,
    
        pixelOffset: new naver.maps.Point(20, -20)
      })
      infoWindows.push(infoWindow);
      i++;
    }
    // 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
    function getClickHandler(seq) {
      return function(e) {
          var marker = markers[seq],
              infoWindow = infoWindows[seq];

          if (infoWindow.getMap()) {
              infoWindow.close();
          } else {
              infoWindow.open(map, marker);
          }
      }
    }
    for (i=0; i<markers.length; i++) {
      naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }
  
    navigator.geolocation.getCurrentPosition((pos) => {
        const current_position = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.morph(current_position, 16);
      }
    );
  },[]);

  return (
    <div>
      <div id="map" style={{width:"100%", height:"400px"}}></div>

      {Object.keys(locations).map((location, i)=>{
          return (
              <div key={i}>
                  <Link href={`/location/${i}`} style={{textDecoration: "none", color:"black"}}>
                    <BigButton title={location} content={locations[location]} />
                  </Link>
              </div>
          )
      })}
    </div>
  )
}