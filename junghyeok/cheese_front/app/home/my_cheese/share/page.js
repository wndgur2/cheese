'use client';
import { useState } from "react";
import myCheeseStyles from "../myCheese.module.css";

export default function Timelapse() {

  const photographs = [
    {
      src:"/samples/불상.jpeg",
      branch: "한경대 안성캠점",
      createdAt: "2023년 3월 9일 18:19"
    }, {
      src:"/samples/불상.jpeg",
      branch: "중앙대 안성캠점",
      createdAt: "2022년 12월 8일 17:00"
    }, {
      src:"/samples/불상.jpeg",
      branch: "한경대 안성캠점",
      createdAt: "2023년 3월 9일 18:19"
    }, {
      src:"/samples/불상.jpeg",
      branch: "중앙대 안성캠점",
      createdAt: "2022년 12월 8일 17:00"
    }, {
      src:"/samples/불상.jpeg",
      branch: "한경대 안성캠점",
      createdAt: "2023년 3월 9일 18:19"
    }, {
      src:"/samples/불상.jpeg",
      branch: "중앙대 안성캠점",
      createdAt: "2022년 12월 8일 17:00"
    }, {
      src:"/samples/불상.jpeg",
      branch: "한경대 안성캠점",
      createdAt: "2023년 3월 9일 18:19"
    },
  ];

  const [selected, setSelected] = useState([]);
  
  const handleImageClick = (i)=>{
    let newSelected;
    if(selected.includes(i)){
      newSelected = selected.filter(
        (v)=>v!=i
      )
    } else{
      newSelected = selected;
      newSelected.push(i);
    }
    setSelected([...newSelected]);
  }
  const renderImages = ()=>{
    const result = [];
    for(let i=0; i<photographs.length; i+=2){
      result.push(
        <tr key={i} className={myCheeseStyles.tr}>
          <td className={myCheeseStyles.td}
            onClick={()=>{handleImageClick(i)}}>
            <img
              className={
                `${selected.includes(i)?myCheeseStyles.selected:""}
                ${myCheeseStyles.image}`
              }
              src={photographs[i].src} />
          </td>
          {photographs[i+1] &&
            <td className={myCheeseStyles.td}
              onClick={()=>{handleImageClick(i+1)}}>
              <img
                className={
                  `${selected.includes(i+1)?myCheeseStyles.selected:""}
                  ${myCheeseStyles.image}`
                }
                src={photographs[i+1].src} />
            </td>
          }
        </tr>
      )
    }
    return result;
  }
  return (
    <div
    onScroll={(e)=>{console.log("SCROLL")}}
    >
      <table cellSpacing={0} cellPadding={0}
      style={{
        width:"100%",
        borderCollapse:"collapse",
      }}>
        <tbody>
          {renderImages()}
        </tbody>
      </table>
      <br/>
      <br/>
      <br/>
      {
        selected.length?
        <div className={myCheeseStyles.info}>
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            height: "5vh",
          }}>
            <div style={{
              display:"flex",
              justifyContent:"space-between",
              width: "50vw",
            }}>
              <div className={myCheeseStyles.infoIconWrapper}>
                <img className={myCheeseStyles.infoIcon} src="/myCheese/save.png"/>
                <span>저장</span>
              </div>
              <div className={myCheeseStyles.infoIconWrapper}>
                <img className={myCheeseStyles.infoIcon} src="/myCheese/delete.png"/>
                <span>삭제</span>
              </div>
            </div>
          </div>
        </div>
        :<></>
      }
    </div>
  )
}