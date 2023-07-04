'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  let session = useSession();
  let router = useRouter();
  useEffect(()=>{
    if(session.status=="authenticated") router.back();
  }, [session.status]);
  return (// rest api : /customer
    <div>
        <form method="POST" action="/api/auth/signup">
          <input name="name" type="text" placeholder="이름" /> 
          <input name="email" type="text" placeholder="이메일" />
          <input name="password" type="password" placeholder="비번" />
          <button type="submit">id/pw 가입요청</button>
        </form>
    </div>
  )
  }