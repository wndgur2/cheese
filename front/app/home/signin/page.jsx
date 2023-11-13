'use client';

import Input from "@/components/Input";
import LongBtn from "@/components/LongBtn";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const callbackUrl = useSearchParams().get("callbackUrl");
  let session = useSession();
  let router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(e){
    if(email == "" || password == ""){
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    const res = await signIn("cheese", {redirect:false}, {email, password});
    console.log(res);
    if(res.error == null){
      window.location.href=callbackUrl? callbackUrl:"/home";
    } else{
      setError("회원 정보가 일치하지 않습니다.");
    }
  }

  useEffect(()=>{
    if(session.status == "authenticated") {
      console.log("already logged in with: " + session.data.user.name);
      router.push("/home");
    }
  }, [session.status]);

  useEffect(()=>{
    setError("");
  }, [email, password]);

  return (// rest api : /auth
    <div className="container" style={{overflowY:"scroll", height:"calc(100vh - 64px)"}}>
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
          <span className="title" style={{letterSpacing:3, fontSize:32}}>치즈한장</span>
        </div>
      </div>

      <Input value={email} onChange={(e)=>{setEmail(e.target.value)}} src="/signin/user.png" name="email" type="text">이메일</Input>
      <Input value={password} onChange={(e)=>{setPassword(e.target.value)}} src="/signin/lock.png" name="password" type="password">비밀번호</Input>
      <p style={{
        margin:"3vh 0vw", width:"100%", minHeight:"3vh", textAlign:"center", alignItems:"center",
        color:"#FF0000", fontSize: 16, fontWeight: 300,
      }}>
        {error}
      </p>
      <div onClick={login}>
        <LongBtn colored="true">
          <p style={{
            margin:0, fontSize:18, fontWeight:400, letterSpacing:"1.8px",
            textAlign: "center", width: "100%",
          }}>
            로그인
          </p>
        </LongBtn>
      </div>
      <div
        style={{marginTop:"15px"}}
        onClick={()=>{router.push("/signup")}}
      >
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
      <br/>
      <br/>
      <br/>
    </div>
  )
}