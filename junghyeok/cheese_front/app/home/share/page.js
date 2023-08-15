'use client'
import BigBtn from "@/components/BigBtn";
import { useEffect, useRef, useState } from "react";
import shareStyles from "./share.module.css";

export default function MyCheese() {
  const [location, setLocation] = useState();
  const [isLocated, setIsLocated] = useState(false);
  const [indexes, setIndexes] = useState([0,0,0,0]);

  const shareSamples = [
    {
      nickname:"햄도라지",
      createdAt:"3분 전",
      images:["/samples/혜민스님.jpeg", "/samples/하루네컷3.jpeg", "/samples/알고리즘.jpeg"],
    },
    {
      nickname:"혜수_라구",
      createdAt:"31분 전",
      images:["/samples/주성이.jpeg", "/samples/여름이.jpeg"],
    },
    {
      nickname:"햄도라지",
      createdAt:"3분 전",
      images:["/samples/혜민스님.jpeg", "/samples/하루네컷3.jpeg", "/samples/알고리즘.jpeg"],
    },
    {
      nickname:"혜수_라구",
      createdAt:"31분 전",
      images:["/samples/주성이.jpeg", "/samples/여름이.jpeg"],
    },
  ];

  const handleScrollEvent = (e, i)=>{
    let newIndexes = indexes;
    newIndexes[i] = Math.round(e.target.scrollLeft / e.target.offsetWidth);
    setIndexes([...newIndexes]);
  }

  const renderDots = (n, index)=>{
    const result = [];
    for(let i=0; i<n; ++i){
      if(i==index){
        result.push(<span key={i} className="dotFilled" />);
      } else{
        result.push(<span key={i} className="dot" />);
      }
    }
    return result;
  }

  useEffect(()=>{
    let loc = localStorage.getItem("location");
    if(loc != null){
      setLocation(loc);
      setIsLocated(true);
    }
  }, []);
  
  return (
    <div style={{paddingTop:"4vh"}}>
      <div className='alignCenter'
        style={{
          padding:"0px 3vw",
        }}>
        <div style={{width:"100%"}}>
          {isLocated?
            <div style={{whiteSpace: "nowrap"}}>
              <span className="title">
                {location}
              </span>
              <span style={{fontSize:24}}>
                에서
              </span> <br/>
            </div>
            :
            <div>
              <span className="title">치즈한장</span>
              <span style={{fontSize:24}}>에서</span><br/>
            </div>
          }
            <span className="subtitle" style={{fontSize:22, fontWeight:400, letterSpacing: 1}}>최근에 공유된 사진이에요.</span>
        </div>
        <BigBtn  enabled="true"
          href="/home/cheese_map"
          src="/map_x4.png"
          size="60px"
          iconWidth="26px"
          iconHeight="23px"
        />
      </div>
      <div style={{width:"100%", marginTop: "2vh"}}>
        {
          shareSamples.map((share, i)=>
            <div key={i} className={shareStyles.share}>
              <div className={shareStyles.info}>
                <span style={{fontWeight:400, fontSize:17, fontColor:"#333"}}>
                  {share.nickname}
                </span>
                <span style={{fontWeight:200, fontSize:15, fontColor:"#424242"}}>
                  {share.createdAt}
                </span>
              </div>
              <div
                className={shareStyles.images}
                onScroll={(e)=>handleScrollEvent(e, i)}
              >
                {share.images.map((src, j)=>
                  <img
                    className={shareStyles.image}
                    src={src} key={j}
                  />
                )}
              </div>
              <div className="dotsWrapper">
                <div className="dots">
                  {renderDots(share.images.length, indexes[i])}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
