'use client'

import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import myCheeseStyles from "./myCheese.module.css";
import axios from "axios";
import Photograph from "@/components/myCheese/Photograph";
import Timelapse from "@/components/myCheese/Timelapse";
import Share from "@/components/myCheese/Share";
import Payment from "@/components/myCheese/Payment";

async function getUserData(id, auth, refresh, router){
  try{
    const res = await axios.get(`http://${process.env.NEXT_PUBLIC_API}/customer/${id}`, {
      headers:{
        "Content-Type": "application/json",
        authorization: auth,
        "refresh-token": refresh,
      }
    })
    let shares = res.data.data.shares?.reverse();
    shares = shares?.filter((share)=>share.sharedPhotoMap);
    return {
      cloudSize: res.data.data.cloudSize,
      photographs: res.data.data.photographs?.reverse(),
      timelapses: res.data.data.timelapses?.reverse(),
      shares: shares,
      payments: res.data.data.payments?.reverse(),
    }
  } catch(error){
    signOut({callbackUrl: "/home/signin?callbackUrl=/home/myCheese"});
    return ;
  }
}

async function getBranchData(){
  try{
    const res = await axios.get(`http://${process.env.NEXT_PUBLIC_API}/branch`);
    // console.log(res);
    return res.data;
  } catch(error){
    console.log(error);
    return ;
  }
}

export default function MyCheese(){
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/home/signin?callbackUrl=/home/myCheese");
    },
  });

  const router = useRouter();
  const [isMore, setIsMore] = useState(false);
  const [userData, setUserData] = useState();
  const [nav, setNav] = useState("photograph");
  const [branches, setBranches] = useState({});

  useEffect(()=>{
    if(session.status == "unauthenticated") router.replace("/login");
    else if(session.status == "authenticated"){
      getUserData(session.data.user.id,
        session.data.user.authorization,
        session.data.user["refresh-token"],
        router
      )
      .then((res)=>{
        setUserData(res);
      })
      getBranchData().then((res)=>{
        setBranches(res.data);
      });
    }
  }, [session.status]);
  
  const handleLeaveMember = ()=>{
    if(confirm("정말 탈퇴하시겠습니까?")){
      axios.delete(`http://${process.env.NEXT_PUBLIC_API}/customer/${session.data.user.id}`, {
        headers:{
          "Content-Type": "application/json",
          authorization: session.data.user.authorization,
          "refresh-token": session.data.user["refresh-token"],
        }
      }).then((res)=>{
        console.log(res);
        if(res.status==200){
          alert("탈퇴되었습니다.");
          signOut({callbackUrl: "/home"});
        }
      }).catch((error)=>{
        console.log(error);
        alert("탈퇴에 실패하였습니다.");
      });
    }
  }

  const renderChild = ()=>{
    if(nav == "photograph") return <Photograph photographs={userData.photographs} branches={branches} userData={userData} setUserData = {setUserData}/>;
    else if(nav == "timelapse") return <Timelapse timelapses={userData.timelapses} branches={branches} userData={userData} setUserData = {setUserData}/>;
    else if(nav == "share") return <Share shares={userData.shares} branches={branches} userData={userData} setUserData = {setUserData}/>;
    else if(nav == "payment") return <Payment payments={userData.payments} branches={branches}/>;
  }

  const handleClickMore = (e)=>{
    if(e.target.className.split(" ").includes("moreButton")) setIsMore(true);
    else setIsMore(false);
  }

  const changePassword = ()=>{
    let password = prompt("변경할 비밀번호를 입력해주세요.");
    if(!password) return;
    while(password.length < 6){
      password = prompt("비밀번호는 6자리 이상이어야 합니다.");
      if(!password) return;
    }
    if(password){
      axios.put(`http://${process.env.NEXT_PUBLIC_API}/customer/${session.data.user.id}`, null, {
        headers:{
          "Content-Type": "application/json",
          authorization: session.data.user.authorization,
          "refresh-token": session.data.user["refresh-token"],
        }, params:{
          password: password,
        }
      }).then((res)=>{
        console.log(res);
        if(res.status==200)
          alert("비밀번호가 변경되었습니다.");
      })
    }
  }

  return (
    <div onClick={handleClickMore}>
      <div style={{
        position:"fixed",
        top:0,
        left:0,
        height:"27vh",
        width:"100%",
        backgroundColor:"#FEFBF6",
      }}>
        <div className={myCheeseStyles.userInfo}>
          {userData?
            <div style={{
              display:"flex",
              flexDirection:"column",
              justifyContent: "space-between",
              height:"100%",
            }}>
              <p className={myCheeseStyles.name}>{session.data?.user.name}</p>
              <p className={myCheeseStyles.meta}>{session.data?.user.email}</p>
              <div style={{display:"flex", justifyContent:"space-between", gap:"3vw"}}>
                <p className={myCheeseStyles.meta}>{`${parseFloat(userData?.cloudSize*1000).toFixed(2)} MB`}</p>
                <p className={myCheeseStyles.meta}>/</p>
                <p className={myCheeseStyles.meta}>5 GB</p>
              </div>
            </div>:<div>
              <span>불러오는중...</span>
            </div>
          }

          <div>
            {isMore? 
            <div id={myCheeseStyles.more} className={`${myCheeseStyles.more} moreButton`}>
              <p onClick={changePassword}>비밀번호 변경</p>
              <p onClick={()=>{ signOut({callbackUrl: "/home"})}}>로그아웃</p>
              <p onClick={handleLeaveMember}>회원 탈퇴</p>
            </div>
            :
              <img src="/myCheese/more.png" width={"40"} className="moreButton"/>
            }
          </div>
        </div>
        <div className={myCheeseStyles.navs}>
          <div className={`${myCheeseStyles.nav} ${nav=="photograph"?myCheeseStyles.focused:""}`}
            onClick={()=>{setNav("photograph")}}
          >
            사진
          </div>
          <div
            className={`${myCheeseStyles.nav} ${nav=="timelapse"?myCheeseStyles.focused:""}`}
            onClick={()=>{setNav("timelapse")}}
          >
            타임랩스
          </div>
          <div className={`${myCheeseStyles.nav} ${nav=="share"?myCheeseStyles.focused:""}`}
            onClick={()=>{setNav("share")}}
          >
            공유사진
          </div>
          <div className={`${myCheeseStyles.nav} ${nav=="payment"?myCheeseStyles.focused:""}`}
            onClick={()=>{setNav("payment")}}
          >
            결제내역
          </div>
        </div>
      </div>
      <div style={{
        marginTop:"27vh",
        overflowY:"scroll",
        height:"calc(100vh - 27vh - 64px)",
      }}
      >
        {userData? renderChild():<></>}
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  )
}