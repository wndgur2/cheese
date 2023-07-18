'use client';

import { useEffect, useState } from "react";
import styles from "./tilter.module.css";

const length = 183;
const mid = parseInt(length/2);
const scrollInitial =  parseInt(length * 3.48);

function Tilter() { //! USE USEREF!!!
    const [tilter, setTilter] = useState();
    const [scrollLeft, setScrollLeft] = useState(0);
    let iter = new Array(length);

    for(let i=0; i<length; i++)
        iter[i] = i;
    
    useEffect(()=>{
        setTilter(document.getElementById("tilt"));
    }, []);

    useEffect(()=>{
        if(tilter?.scrollTo){
            tilter.scrollTo(scrollInitial, 0);
            setScrollLeft(fineTune(tilter.scrollLeft));
        }
    }, [tilter]);
    
    return (
        <div style={{
            width:"100%"
        }}>
            <div className={styles.tilter} id="tilt" style={{
                display: "flex",
                overflowX:"scroll",
                gap: "7px",
                alignItems:"center",
                margin: "2vh 0px 1vh 0px",
            }} onScroll={(s)=>{
                setScrollLeft(fineTune(s.target.scrollLeft))
            }}>
                {iter.map((v)=>{
                    return (
                        <img key={v}
                            src="/edit/trim/line.png"
                            width={2}
                            height={v==mid?28:14}
                            style={{
                                visibility: `${(v < parseInt(length / 8.8)||
                                    (v > parseInt(length / 10 * 8.8)))
                                    ?"hidden":"visible"}`
                            }}
                        />
                    )
                })}
            </div>
            <p style={{
                textAlign:"center",
                margin:"0px",
            }}>{scrollLeft}°</p>
        </div>
    )
}

function fineTune(value){
    value = parseInt((value - scrollInitial)/7);
    if(value > 90) return 90;
    if(value < -90) return -90;
    return value;
}

export default Tilter;