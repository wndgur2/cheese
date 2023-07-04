'use client';
import LoginBtn from "@/components/LoginBtn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  let session = useSession();
  let router = useRouter();

  useEffect(()=>{
    if(session.status == "authenticated") {
      console.log("already logged in with: " + session.data.user.name);
      router.push("/");
    }
  }, [session.status]);
  return (// rest api : /auth
    <div>
        <LoginBtn></LoginBtn>
        <form method="POST" action="/api/auth/signin">
          <input name="email" type="text" placeholder="이메일" />
          <input name="password" type="password" placeholder="비번" />
          <button type="submit">로그인</button>
        </form>
    </div>
  )
}