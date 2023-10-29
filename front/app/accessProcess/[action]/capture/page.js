'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import captureStyles from "./capture.module.css";
import apStyles from "../ap.module.css";
import Branch from '@/entity/Branch';

export default function Amount(props) {
    const router = useRouter();
    /**
     * @type {[Branch, Function]}
     */
    const [branch, setBranch] = useState();
    const [amount, setAmount] = useState(0);
    const action = props.params.action;

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

    const handleInputChange = (e)=>{
        const inputVal = e.target.value;
        if(e.target.validity.valid)
            if(inputVal.length <=2)
                setAmount(inputVal);
    }

    const handleAbort = (e)=>{
        console.log(e);
    }

    const handleCapture = ()=>{
        localStorage.setItem("amount", amount);
        router.push("/capture");
    }

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
        <span className='subtitle'>에서</span>
        
        <div className={captureStyles.inputAmount}>
            <input
                id={captureStyles.captureAmount}
                type='number'
                value={amount}
                max={40}
                min={0}
                maxLength={"2"}
                pattern="[0-9]*"
                onChange={handleInputChange}
                onAbort={handleAbort}
            />
            <span className={captureStyles.inputInfo}>
                장 촬영할게요.
            </span>
        </div>

    {amount>0?
        <div className="next" onClick={handleCapture}>
            <span style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 1.4,
                paddingRight:20,
                textAlign:"right",
                width: "100%",
            }}>{amount*branch.shooting_cost}원 결제하기</span>
        </div>:
            <div className={`next ${apStyles.disabled}`}>
                <span style={{
                    fontSize: 19,
                    fontWeight: 400,
                    letterSpacing: 0.2,
                    textAlign:"center",
                    width: "100%",
                    color:"#666",
                }}>장 수를 입력해주세요</span>
            </div>
        }
    </div>
  )
}
