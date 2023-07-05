'use client'

import { SessionProvider } from "next-auth/react"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutBtn from "@/components/LogoutBtn";

export default function Layout({ children }){
  let session = useSession();
  let router = useRouter();

  useEffect(()=>{
    if(session.status == "unauthenticated") router.replace("/login");
  }, [session.status]);
  return (
    <SessionProvider>
      <p>{session.data?.user.name}</p>
      <p>{session.data?.user.email}</p>
      <LogoutBtn></LogoutBtn><br/>
      <Link href="/my_cheese"> 사진 </Link>
      <Link href="/my_cheese/timelapse"> 타임랩스 </Link>
      <Link href="/my_cheese/share"> 공유사진 </Link>
      <Link href="/my_cheese/payment"> 결제내역 </Link>
      {children}
    </SessionProvider>
  )
}