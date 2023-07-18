'use client'

import { SessionProvider } from "next-auth/react"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutBtn from "@/components/LogoutBtn";

export default function Layout({ children }){
  let session = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/home/signin");
    },
  });
  let router = useRouter();

  useEffect(()=>{
    if(session.status == "unauthenticated") router.replace("/login");
  }, [session.status]);
  return (
    <div>
      <p style={{
        color: "#333",
        fontSize: "20px",
        fontWeight: "500",
        letterSpacing: "0.6px",
        margin:0
      }}>{session.data?.user.name}
      </p>

      <p style={{
        color: "#333",
        fontSize: "16px",
        fontHeight: "300",
        letterSpacing: "0.48px",
      }}>{session.data?.user.email}
      </p>

      <LogoutBtn></LogoutBtn><br/>

      <div style={{
        display:"flex",
        width:"100%",
        justifyContent:"space-between",
        alignItems:"center",
        textAlign:"center",
        borderRadiusTop:"17px",
        background: "#FEFBF6",
        boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
        fontSize: "14px"
      }}>
        <div style={{borderBottom:"solid", width:"20%"}}>
          <Link href="/home/my_cheese"> 사진 </Link>
        </div>
        <div style={{borderBottom:"solid", width:"20%"}}>
          <Link href="/home/my_cheese/timelapse"> 타임랩스 </Link>
        </div>
        <div style={{borderBottom:"solid", width:"20%"}}>
          <Link href="/home/my_cheese/share"> 공유사진 </Link>
        </div>
        <div style={{borderBottom:"solid", width:"20%"}}>
          <Link href="/home/my_cheese/payment"> 결제내역 </Link>
        </div>
      </div>
      <SessionProvider>
      {children}
      </SessionProvider>
    </div>
  )
}