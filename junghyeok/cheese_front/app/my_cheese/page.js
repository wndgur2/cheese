'use client';
import LogoutBtn from "@/components/LogoutBtn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  let session = useSession();
  let router = useRouter();

  useEffect(()=>{
    if(session.status == "unauthenticated") router.replace("/login");
  }, [session.status]);
  return (
    <div>
      <br/>
        <p>{session.data?.user.name}</p>
        <p>{session.data?.user.email}</p>
        <LogoutBtn></LogoutBtn>
    </div>
  )
}
