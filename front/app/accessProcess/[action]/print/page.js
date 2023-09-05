'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import printStyles from "./print.module.css";
import apStyles from "../ap.module.css";
import axios from 'axios';

export default function Amounts(props) {
    const action = props.params.action;
    const router = useRouter();

    const input = useRef();
    const [branch, setBranch] = useState("...");
    const [amounts, setAmounts] = useState([]);
    const [fileObjs, setFileObjs] = useState([]);

    const handleAddClick = (i)=>{
        let newAmounts = amounts;
        if(newAmounts[i] >= 40) newAmounts[i] = 40;
        else newAmounts[i] += 1;
        setAmounts([...newAmounts]);
    }

    const handleDecreaseClick = (i)=>{
        let newAmounts = amounts;
        if(newAmounts[i] <= 0) newAmounts[i] = 0;
        else newAmounts[i] -= 1;
        setAmounts([...newAmounts]);
    }

    const handleInputChange = (files)=>{
        let newFileObjs = [...fileObjs];
        let newAmounts = amounts;
        for(let file of files){
            const reader = new FileReader();
            reader.onload = (e) => {
                newFileObjs.push(e.target.result);
                newAmounts.push(1);
            }
            reader.onloadend = (e) => {
                setFileObjs([...newFileObjs]);
                setAmounts(newAmounts);
            }
            reader.readAsDataURL(file);
        };
    }

    const handlePrint = ()=>{
        // make multipart form data
        let formData = new FormData();
        for(let i=0; i<fileObjs.length; i++){
            formData.append("photos", fileObjs[i]);
        }
        // post print request to server
        axios.post(`http://${process.env.NEXT_PUBLIC_API}/printerQueue/${branch.id}`, null, {
            params:{
                device: localStorage.getItem("uuid"),
            },
        }).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        }).finally(()=>{
            router.push("/home/print");
        });
    }

    useEffect(()=>{
        let branch_ = JSON.parse(localStorage.getItem("branch"));
        if(!branch_){
            router.push("/home/cheeseMap");
        }

        if(action=="capture") localStorage.setItem("action", "capture");
        else if(action=="print") localStorage.setItem("action", "print");
        else{
            console.log("ERR [...action] page: Wrong action given.");
            router.push("/home");
        }
        
        setBranch(branch_);
    },[]);

  return (
    <div>
        <div
            onClick={()=>{router.back()}}
            style={{
                position:"absolute",
                top: 16,
                left: 16,
        }}>
            <img src='/back.png' width={28}/>
        </div>

        <span className='title'>{branch?.name}</span>
        <span style={{fontSize:26}}>에서</span>
        <p style={{margin:0, fontSize:24}}>인화할 사진을 추가해주세요.</p>
        {
            fileObjs.map((obj, i)=>
                <div className={printStyles.imageBox} key={i}>
                    <div className={printStyles.imageWrapper}>
                        <img src={obj} width={"100%"} style={{objectFit:"cover", height:"100%"}} alt="" />
                    </div>
                    <div className={printStyles.amountPicker}>
                        <img 
                            src="/print/add_white.png"
                            width={"70%"}
                            onClick={()=>handleAddClick(i)}
                        />
                        <div className={printStyles.amountWrapper}>
                            <p id={printStyles.amount}>{amounts[i]}</p>
                        </div>
                        <img 
                            src="/print/decrease_white.png"
                            width={"70%"}
                            onClick={()=>handleDecreaseClick(i)}
                        />
                    </div>
                </div>
            )
        }

        <input
            type="file" multiple
            style={{display:"none"}}
            ref={input}
            onChange={(e)=>{handleInputChange(e.target.files)}}
            accept="image/png, image/jpeg"
        />

        <div htmlFor="fileInput" className={printStyles.imageBox} onClick={()=>{input.current.click();}}>
            <img src="/print/add.png" width={"50vw"} alt="인화할 사진 추가하기" />
        </div>
        <br/>
        <br/>
        {amounts.reduce((a, b) => a + b, 0)*1200 ?
        <div onClick={handlePrint}>
            <div className="next">
                <span style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: 1.4,
                    paddingRight:20,
                    textAlign:"right",
                    width: "100%",
                }}>{amounts.reduce((a, b) => a + b, 0)*1200}원 결제하기</span>
            </div>
        </div>:
            <div className={`next ${apStyles.disabled}`}>
                <span style={{
                    fontSize: 19,
                    fontWeight: 400,
                    letterSpacing: 0.2,
                    textAlign:"center",
                    width: "100%",
                    color:"#AAA",
                }}>인화할 사진이 없어요</span>
            </div>
        }
    </div>
  )
}
