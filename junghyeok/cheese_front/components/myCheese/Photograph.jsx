'use client';
import { useEffect, useState } from "react";
import myCheeseStyles from "../../app/home/myCheese/myCheese.module.css"
import { useSession } from "next-auth/react";
import axios from "axios";
import dataURItoBlob from "@/util/dataUriToBlob";

export default function Photograph({photographs, branches}) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/home/signin?callbackUrl=/home/myCheese");
    },
  });

  const [selected, setSelected] = useState([]);
  const [isAllSameBranch, setIsAllSameBranch] = useState(true);
  const [isAllSameDate, setIsAllSameDate] = useState(true);

  useEffect(()=>{
    if(selected.length <= 1){
      setIsAllSameBranch(true);
      setIsAllSameDate(true);
    }
  }, [selected]);
  
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
    if(selected.length){
      if(photographs[selected[0]].branchId != photographs[i].branchId)
        setIsAllSameBranch(false);
      if(new Date(photographs[selected[0]].createdAt).toUTCString().split(' ').slice(0, 4).join()
      != new Date(photographs[i].createdAt).toUTCString().split(' ').slice(0, 4).join())
        setIsAllSameDate(false);
    }
    setSelected([...newSelected]);
  }

  const shareSelected = ()=>{
    // branch 같은지 검사
    const currentBranchId = photographs[selected[0]].branchId;
    for(let i=0; i<selected.length; i++){
      if(photographs[selected[i]].branchId != currentBranchId){
        alert("같은 장소의 사진만 함께 공유할 수 있어요.");
        return ;
      }
    }

    // 서버에 share post 요청
    const url = `${process.env.NEXT_PUBLIC_API}/share/${session.data.user.id}`;
    const data = new FormData();
    selected.forEach((i)=>{
      data.append("photo", dataURItoBlob("data:image/png;base64," + photographs[i].photoImage));
      // data.append("photo", photographs.length[i]);
    })
    axios.post(url, data, {
      headers:{
        authorization: session.data.user.authorization,
        "refresh-token": session.data.user["refresh-token"],
      }}
    ).then((res)=>{ console.log(res); })
    .catch((err)=>{ console.log(err); })
  }

  const renderRow = (i, className)=>{
    if(i>=photographs.length.length) return (<></>);
    let result = [];
    result.push(
      <td align="center" key={i}
        onClick={()=>{handleImageClick(i)}}>
          <div className={
            `${className} ${myCheeseStyles.imageWrapper} ${selected.includes(i)?myCheeseStyles.selected:""}`
          }>
            <img
              className={
                `${myCheeseStyles.image}`
              }
              src={"data:image/png;base64," + photographs[i].photoImage} />
          </div>
      </td>
    );
    return result;
  }

  const renderImages = ()=>{
    const result = [];
    for(let i=0; i<photographs.length; i+=2){
      result.push(
        <tr key={i}
          // className={myCheeseStyles.tr}
        >
          {renderRow(i, myCheeseStyles.left)}
          {renderRow(i+1, myCheeseStyles.right)}
        </tr>
      )
    }
    return result;
  }

  return (
    <div id={myCheeseStyles.photoWrapper}>
      <table className={myCheeseStyles.table} cellSpacing={"10"}
      style={{
        borderCollapse:"collapse",
      }}>
        <tbody style={{
        }}>
          {photographs.length? renderImages():<></>}
        </tbody>
      </table>
      <br/>
      <br/>
      <br/>
      {
        selected.length?
        <div className={myCheeseStyles.info}>
          {isAllSameBranch &&
            <div style={{
              display:"flex",
              alignItems:"baseline",
              justifyContent:"space-between",
              width:"100%",
              height:"4vh",
              marginBottom:"3vh",
            }}>
                <span style={{
                  height: "3.1vh",
                  fontSize: "2.8vh",
                  fontWeight: 500,
                  color: "#212121",
            }}>
                  {
                    isAllSameBranch &&
                    branches.map((b)=>{
                      if(b.branchId == photographs[selected[0]].branchId) return b.name;
                    }).join('')
                  }
                </span>
              {
                isAllSameDate &&
                <span style={{
                  height: "3.1vh",
                  fontSize: "2vh",
                  fontWeight: 300,
                  color: "#444",
                }}>{new Date(photographs[selected[0]].createdAt).toUTCString().split(' ').slice(0, 4).join(' ')}</span>
              }
            </div>
          }
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            height: "5vh",
          }}>
            <div className={myCheeseStyles.infoIconWrapper}>
              <img className={myCheeseStyles.infoIcon} src="/myCheese/save.png"/>
              <span>저장</span>
            </div>
            { isAllSameBranch &&
            <div className={myCheeseStyles.infoIconWrapper} onClick={shareSelected}>
              <img className={myCheeseStyles.infoIcon} src="/myCheese/share.png"/>
              <span>공유</span>
            </div>}
            <div className={myCheeseStyles.infoIconWrapper}>
              <img className={myCheeseStyles.infoIcon} src="/myCheese/edit.png"/>
              <span>편집</span>
            </div>
            <div className={myCheeseStyles.infoIconWrapper}>
              <img className={myCheeseStyles.infoIcon} src="/myCheese/print.png"/>
              <span>인화</span>
            </div>
            <div className={myCheeseStyles.infoIconWrapper}>
              <img className={myCheeseStyles.infoIcon} src="/myCheese/delete.png"/>
              <span>삭제</span>
            </div>
          </div>
        </div>
        :<></>
      }
    </div>
  )
}