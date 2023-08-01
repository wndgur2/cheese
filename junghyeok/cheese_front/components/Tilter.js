'use client';

import { useEffect, useRef, useState } from "react";
import styles from "./tilter.module.css";

const length = 183;
const mid = parseInt(length/2);
let scrollMid = 0;

function Tilter({value, setValue}) {
    const tilter = useRef();
    let iter = new Array(length);

    for(let i=0; i<length; i++)
        iter[i] = i;
    
    useEffect(()=>{
        scrollMid = (tilter.current.scrollWidth-tilter.current.offsetWidth)/2;
        tilter.current.scrollTo(scrollMid, 0);
        setValue(fineTune(tilter.current.scrollLeft));
    }, []);
    
    return (
        <div style={{width:"100%"}}>
            <div className={styles.tilter}
                id="tilt"
                ref={tilter}
                style={{
                    display: "flex",
                    overflowX:"scroll",
                    gap: "7px",
                    alignItems:"center",
                    margin: "2vh 0px 1vh 0px",
                }} onScroll={(s)=>{
                    setValue(fineTune(s.target.scrollLeft))
            }}>
                {iter.map((v)=>{
                    return (
                        <img
                            className={styles.line}
                            key={v}
                            src="/edit/trim/line.png"
                            width={2}
                            height={v==mid?28:14}
                            style={{
                                visibility: `${(v < parseInt(length / 9)||
                                    (v > parseInt(length / 10 * 9)))
                                    ?"hidden":"visible"}`
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function fineTune(value){
    value = parseInt((value - scrollMid)/7);
    if(value > 90) return 90;
    if(value < -90) return -90;
    return value;
}

function valueToScroll(value){
    return value * 7 + scrollMid;
}

export default Tilter;