'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Print() {
  let router = useRouter();
  useEffect(()=>{
    if(!localStorage.getItem("location")){
      router.push("/home/cheese_map");
    }
  },[]);
  return (
    <div>
      <p>print photos.</p>
    </div>
  )
}
