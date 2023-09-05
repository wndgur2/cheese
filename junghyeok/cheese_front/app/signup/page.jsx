'use client';
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUp() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState("");
  const [nicknameMes, setNicknameMes] = useState("");
  const [emailMes, setEmailMes] = useState("");
  const router = useRouter();

  async function enroll(){
    try{
      await axios.post(`http://${process.env.NEXT_PUBLIC_API}/customer`, null, {
        params:{
          email:email,
          nickname:nickname,
          password:password,
        }
      })
      router.push("/home/signin");
    } catch(error){
      console.log("SignUp ERROR", error);
      if(error.response.data.message.includes("닉네임")){
        setNicknameMes("벌써 사용중인 닉네임이에요");
        setEmailMes("");
      } else if(error.response.data.message.includes("이메일")){
        setEmailMes("벌써 사용중인 이메일이에요");
        setNicknameMes("");
      } else{
        setEmailMes(error.response.data.message);
      }
    }
  }

  useEffect(()=>{
    if(!nickname){
      setError("닉네임이 없어요");
      return;
    }
    if(!email){
      setError("이메일이 없어요");
      return;
    }
    if(!password){
      setError("비밀번호가 없어요");
      return;
    }
    if(password.length < 6){
      setError("비밀번호가 너무 짧아요");
      return;
    }
    if(password != passwordCheck){
      setError("확인 비밀번호가 달라요");
      return;
    }
    setError("");
  }, [nickname, email, password, passwordCheck])

  return (
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

      <Input maxLength={20} onChange={(e)=>{setNickname(e.target.value)}} src="/signin/user.png" name="name" type="text">닉네임</Input>
      <p className="error" style={{ margin: "0vh 0vw 3vh 0vw"}}>
        {nicknameMes}
      </p>
      <Input maxLength={40} onChange={(e)=>{setEmail(e.target.value)}} src="/signin/user.png" name="email" type="email">이메일</Input>
      {/* <LongBtn>
        <p style={{
          margin:0, fontSize:18, fontWeight:400, letterSpacing:"1.8px",
          textAlign: "center", width: "100%",
        }}>
          인증번호 전송
        </p></LongBtn>
      <Input maxLength={40} onChange={(e)=>{set(e.target.value)}} src="/signup/key.png" name="auth" type="text">인증번호</Input> */}
      <p className="error" style={{ margin: "0vh 0vw 3vh 0vw"}}>
        {emailMes}
      </p>
      <Input maxLength={30} onChange={(e)=>{setPassword(e.target.value)}} src="/signin/lock.png" name="password" type="password">비밀번호</Input>
      <Input maxLength={30} onChange={(e)=>{setPasswordCheck(e.target.value)}} src="/signin/lock.png" name="passwordCheck" type="password">비밀번호 확인</Input>
      <br />
      {error?
        <div className={`next`} style={{backgroundColor: "#EAEAEA"}}>
          <span style={{
            fontSize: "4vw",
            fontWeight: 400,
            letterSpacing: 1,
            textAlign:"center",
            width: "100%",
            color:"#999",
          }}>{error}</span>
        </div>:
        <div className="next" onClick={()=>{enroll()}}>
            <p style={{
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: 1.4,
            }}>가입완료</p>
        </div>
      }
    </div>
  )
}