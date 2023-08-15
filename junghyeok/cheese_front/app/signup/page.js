'use client';
import Input from "@/components/Input";
import LongBtn from "@/components/LongBtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [isFinish, setIsFinish] = useState(false);
  const router = useRouter();
  return (// rest api : /auth
    <div className="container" style={{paddingTop: "4vh"}}>
      <div
          onClick={()=>{router.back()}}
          style={{
          position:"absolute",
          top: 16,
          left: 16,
      }}>
          <img src='/back.png' width={28}/>
      </div>
      <div style={{
        display:"flex",
        alignItems:"center",
        width: "100%",
        margin: "3vh 0px 6vh 0px",
        gap: 12,
      }}>
        <span className="title" style={{letterSpacing:3, fontSize:32}}>
          가입
        </span>
      </div>

      <form method="POST" action="/api/auth/signup">
        <Input src="/signin/user.png" name="name" type="text">닉네임</Input>
        <Input src="/signin/user.png" name="email" type="email">이메일</Input>
        <br/>
        <LongBtn>
          <p style={{
            margin:0, fontSize:18, fontWeight:400, letterSpacing:"1.8px",
            textAlign: "center", width: "100%",
          }}>
            인증번호 전송
          </p></LongBtn>
        <Input src="/signup/key.png" name="auth" type="text">인증번호</Input>
        <br/>
        <Input src="/signin/lock.png" name="password" type="password">비밀번호</Input>
        <Input src="/signin/lock.png" name="passwordCheck" type="password">비밀번호 확인</Input>
        <br />
      </form>
      
      {isFinish?
        <Link href="/home/signin">
          <div className="next">
              <p style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 1.4,
              }}>가입완료</p>
          </div>
        </Link>:
          <div className={`next`} style={{backgroundColor: "#EAEAEA"}}>
            <span style={{
              fontSize: 19,
              fontWeight: 400,
              letterSpacing: 0.2,
              textAlign:"center",
              width: "100%",
              color:"#AAA",
            }}>가입 완료</span>
          </div>
      }
    </div>
  )
}