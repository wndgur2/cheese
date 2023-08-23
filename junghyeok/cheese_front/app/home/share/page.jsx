'use client'
import BigBtn from "@/components/BigBtn";
import { useEffect, useState } from "react";
import shareStyles from "./share.module.css";
import axios from "axios";
import Share from "@/entity/Share";

export default function MyCheese() {
  const [location, setLocation] = useState();
  const [isLocated, setIsLocated] = useState(false);
  const [indexes, setIndexes] = useState([]);
  const [branch, setBranch] = useState();
  const [shares, setShares] = useState([]);
  const [page, setPage] = useState(1);
  const [customerNames, setCustomerNames] = useState([]);

  // async function getCustomerNames(){
  //   let names = [];
  //   try{
  //     for(let i=0; i<shares.length; i++){
  //       const res = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API}/customer/${shares[i].customerId}`,{
  //           params: {
  //             customerId: shares[i].customerId,
  //           }
  //         }
  //       );
  //       names.push(res.data.data.name);
  //     }
  //     setCustomerNames(names);
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }

  async function getShares(page, branchId) {
      let shares = [];
      try{
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/share/page/${page}`,
          {
            params: {
              branchId: branchId?branchId:null,
            }
          }
        );
        // console.log("share data: ", res.data.data);
        res.data.data?.map((share)=>{
          if(!share.sharedPhotoMap) {
            console.log("No photo");
            return;
          }
          shares.push(new Share(share.shareId, share.customerId, share.branchId, share.createdAt, share.sharedPhotoMap));
        })
        setShares(shares);
        // getCustomerNames();
        return shares;
      }
      catch(error){
        console.log(error);
      }
    }

  const handleScrollEvent = (e, i)=>{
    let newIndexes = indexes;
    newIndexes[i] = Math.round(e.target.scrollLeft / e.target.offsetWidth);
    setIndexes([...newIndexes]);
  }

  const renderDots = (n, index)=>{
    const result = [];
    for(let i=0; i<n; ++i){
      if(i==index){
        result.push(<span key={i} className="dotFilled"/>);
      } else{
        result.push(<span key={i} className="dot"/>);
      }
    }
    return result;
  }

  useEffect(()=>{
    let localBranch = JSON.parse(localStorage.getItem("branch"));
    if (localBranch){
      setBranch(localBranch);
      getShares(page, localBranch.id)
    } else{
      getShares(page);
    }
  }, []);

  useEffect(()=>{
    setIndexes(new Array(shares.length).fill(0));
  }, [shares])
  
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
              <span className="title">{branch?branch.name:"치즈한장"}</span>
              <span style={{fontSize:24}}>에서</span><br/>
            </div>
          }
            <span className="subtitle" style={{fontSize:22, fontWeight:400, letterSpacing: 1}}>최근에 공유된 사진이에요.</span>
        </div>
        <BigBtn  enabled="true"
          href="/home/cheeseMap"
          src="/map_x4.png"
          size="60px"
          iconWidth="26px"
          iconHeight="23px"
        />
      </div>
      <div style={{width:"100%", marginTop: "2vh"}}>
        {
          shares.map((share, i)=>
            <div key={i} className={shareStyles.share}>
              <div className={shareStyles.info}>
                <span style={{fontWeight:400, fontSize:"5vw", fontColor:"#333"}}>
                  {share.customerId}
                </span>
                <span style={{fontWeight:200, fontSize:"4vw", fontColor:"#212121"}}>
                  {new Date(share.createdAt).toUTCString().split(' ').slice(0, 4).join(' ')}
                </span>
              </div>
              <div
                className={shareStyles.images}
                onScroll={(e)=>handleScrollEvent(e, i)}
              >
                {Object.values(share.sharedPhotoMap).map((photo, j)=>
                  <img
                    className={shareStyles.image}
                    src={"data:image/png;base64," + photo.photoImage} key={j}
                  />
                )}
              </div>
              <div className="dotsWrapper">
                <div className="dots">
                  {renderDots(Object.keys(share.sharedPhotoMap).length, indexes[i])}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
