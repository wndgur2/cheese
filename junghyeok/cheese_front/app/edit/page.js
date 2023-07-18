'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Edit() {
  let router = useRouter();
  useEffect(()=>{
    router.replace("/edit/ai");
  },[]);
  return (
    <div>
      ...
    </div>
  )
}
