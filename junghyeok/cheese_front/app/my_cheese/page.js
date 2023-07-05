'use client';
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
      Photos
    </div>
  )
}
