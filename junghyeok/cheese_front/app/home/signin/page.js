'use client';

import Input from "@/components/Input";
import LongBtn from "@/components/LongBtn";
import Title from "@/components/Title";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  let session = useSession();
  let router = useRouter();

  useEffect(()=>{
    if(session.status == "authenticated") {
      console.log("already logged in with: " + session.data.user.name);
      router.back();
    }
  }, [session.status]);
  return (// rest api : /auth
    <div>
      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        width: "100%",
        margin: "3vh 0px 6vh 0px",
        gap: 12,
      }}>
        <div>
          <img src="/cheese_thin.png" width={"64px"}/>
        </div>
        <div>
          <Title size={30} letterSpacing={"3px"}>치즈한장</Title>
        </div>
      </div>

      <form method="POST" action="/api/auth/signin">
        <Input src="/signin/user.png" name="email" type="text">이메일</Input>
        <Input src="/signin/lock.png" name="password" type="password">비밀번호</Input>
        <br />
        <LongBtn colored="true" type="submit">
          <p style={{
            margin:0, fontSize:18, fontWeight:400, letterSpacing:"1.8px",
            textAlign: "center", width: "100%",
          }}>
            로그인
          </p>
        </LongBtn>
      </form>
      <div style={{marginTop:"15px"}}>
        <LongBtn colored="true" type="submit">
          <p style={{
            margin:0, fontSize:18, fontWeight:400, letterSpacing:"1.8px",
            textAlign: "center", width: "100%",
          }}>
            가입
          </p>
        </LongBtn>
      </div>

      <p style={{
        textAlign:"center",
        color:"#505050",
        fontSize: 16,
        fontWeight: 300,
        margin: "8% 0px 4% 0px",
      }}>간편 로그인</p>

      <div style={{
        display:"flex",
        justifyContent:"space-around"
      }}>
        <img src="/signin/google.png" width={80} onClick={()=>{ signIn("google", {callbackUrl: "/home"}) }} />
        <img src="/signin/kakao.png" width={80} onClick={()=>{ signIn("kakao", {callbackUrl: "/home"}) }} />
        <img src="/signin/naver.png" width={80} onClick={()=>{ signIn("github", {callbackUrl: "/home"}) }} />
      </div>
      <div style={{
          display:"flex",
          justifyContent:"space-evenly",
          alignItems: "center",
          backgroundColor: "#FBF8F2",
          letterSpacing: "0.7px",
          fontWeight: 350,
          fontSize: 16,
          borderRadius: "100px",
          boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.10)",
          margin: "12% 0px 12% 0px"
        }}>
        <p style={{margin:"18px", color:"#5F5F5F"}}> 아이디 찾기 </p>
        <img src="/signin/line.png" width="1px" height="20px" />
        <p style={{margin:"18px", color:"#5F5F5F"}}> 비밀번호 찾기 </p>
      </div>
    </div>
  )
}