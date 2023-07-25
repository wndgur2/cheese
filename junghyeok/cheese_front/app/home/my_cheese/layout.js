'use client'

import { SessionProvider } from "next-auth/react"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutBtn from "@/components/LogoutBtn";
import myCheeseStyles from "./myCheese.module.css";

export default function Layout({ children }){
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/home/signin");
    },
  });
  const router = useRouter();
  const pathname = usePathname();
  const [isMore, setIsMore] = useState(false);

  const handleClickMore = (e)=>{
    if(e.target.className.split(" ").includes("moreButton")) setIsMore(true);
    else setIsMore(false);
  }

  useEffect(()=>{
    if(session.status == "unauthenticated") router.replace("/login");
  }, [session.status]);
  return (
    <div onClick={handleClickMore}>
      <div style={{
        position:"fixed",
        top:0,
        left:0,
        height:"30vh",
        width:"100%",
        backgroundColor:"#FEFBF6",
      }}>
        <div className={myCheeseStyles.userInfo}>
          <div>
            <p className={myCheeseStyles.name}>{session.data?.user.name}
            </p>
            <p className={myCheeseStyles.email}>{session.data?.user.email}
            </p>
            <br/>
            <LogoutBtn></LogoutBtn>
            <br/>
          </div>
          <div>
            {isMore? 
            <div id={myCheeseStyles.more} className={`${myCheeseStyles.more} moreButton`}>
              <p className="moreButton">이름 변경</p>
              <p className="moreButton">비밀번호 변경</p>
              <p className="moreButton">회원 탈퇴</p>
            </div>
            :
              <img src="/myCheese/more.png" width={"36"}
                className="moreButton"
              />
            }
          </div>
        </div>
        <div className={myCheeseStyles.navs}>
          <div className={`${myCheeseStyles.nav} ${pathname.split('/')[3]?"":myCheeseStyles.focused}`}>
            <Link href="/home/my_cheese"> 사진 </Link>
          </div>
          <div className={`${myCheeseStyles.nav} ${pathname.split('/')[3]=="timelapse"?myCheeseStyles.focused:""}`}>
            <Link href="/home/my_cheese/timelapse"> 타임랩스 </Link>
          </div>
          <div className={`${myCheeseStyles.nav} ${pathname.split('/')[3]=="share"?myCheeseStyles.focused:""}`}>
            <Link href="/home/my_cheese/share"> 공유사진 </Link>
          </div>
          <div className={`${myCheeseStyles.nav} ${pathname.split('/')[3]=="payment"?myCheeseStyles.focused:""}`}>
            <Link href="/home/my_cheese/payment"> 결제내역 </Link>
          </div>
        </div>
      </div>
      <div style={{
        marginTop:"30vh",
      }}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </div>
    </div>
  )
}