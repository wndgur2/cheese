'use client';
import { useEffect, useState } from "react";
import myCheeseStyles from "../../app/home/myCheese/myCheese.module.css"

export default function Share({shares}) {
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
  
  const renderRow = (i)=>{
    if(i>=shares.length) return (<></>);
    let result = [];
    result.push(
      <td key={i} className={myCheeseStyles.td}
        onClick={()=>{handleImageClick(i)}}>
        <img
          className={
            `${selected.includes(i)?myCheeseStyles.selected:""}
            ${myCheeseStyles.image}`
          }
          src={"data:image/png;base64," + Object.values(shares[i].sharedPhotoMap)[0].photoImage} />
      </td>
    );
    return result;
  }

  const renderImages = ()=>{
    const result = [];
    for(let i=0; i<shares.length; i+=2){
      result.push(
        <tr key={i} className={myCheeseStyles.tr}>
          {renderRow(i)}
          {renderRow(i+1)}
        </tr>
      )
    }
    return result;
  }

  return (
    <div>
      <table cellSpacing={0} cellPadding={0}
      style={{
        width:"100%",
        borderCollapse:"collapse",
      }}>
        <tbody>
          {shares?renderImages():<></>}
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