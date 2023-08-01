'use client';

import NavBtn from "@/components/NavBtn";
import editStyles from "../../components/edit/edit.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { addPage, hideCurrentCanvas, deletePage, initCanvas, loadPage } from "./edit.module";
import Trim from "../../components/edit/trim/Trim";
import Ai from "../../components/edit/ai/Ai";
import Sticker from "../../components/edit/sticker/Sticker";
import Frame from "../../components/edit/frame/Frame";
import Draw from "../../components/edit/draw/Draw";
import Filter from "../../components/edit/filter/Filter";
import Adjust from "../../components/edit/adjust/Adjust";
import Text from "../../components/edit/text/Text";

export default function Edit() {
  const router = useRouter();
  const canvas = useRef();

  const [nav, setNav] = useState("Ai");

  const [pageIndex, setPageIndex] = useState(-1);
  const [fileObjs, setFileObjs] = useState([]);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [top, setTop] = useState(0);

  const addButton = useRef();

  const navs = [
    ["Ai", "AI"],
    ["Trim", "다듬기"],
    ["Draw", "그리기"],
    ["Frame", "프레임"],
    ["Sticker", "스티커"],
    ["Text", "텍스트"],
    ["Filter", "필터"],
    ["Adjust", "조정"],
  ];

  const renderChild = ()=>{
    switch (nav) {
      case "Ai":
        return <Ai pageIndex={pageIndex} />
      case "Trim":
        return <Trim pageIndex={pageIndex} />
      case "Draw":
        return <Draw pageIndex={pageIndex} />
      case "Frame":
        return <Frame pageIndex={pageIndex} />
      case "Sticker":
        return <Sticker pageIndex={pageIndex} />
      case "Text":
        return <Text pageIndex={pageIndex} />
      case "Filter":
        return <Filter pageIndex={pageIndex} />
      case "Adjust":
        return <Adjust pageIndex={pageIndex} />
      default:
        break;
    }
  }

  const handlePageClick = (i)=>{
    setPageIndex(i);
  }

  const handleBodyScroll = (curTop)=>{
    if(curTop > top) setHideNavbar(true);
    else setHideNavbar(false);
    setTop(curTop);
  }

  const handleInputChange = (files)=>{
    let newFileObjs = [...fileObjs];
    for(let file of files){
      const reader = new FileReader();
      reader.onload = (e) => {
        newFileObjs.push(e.target.result);
        addPage(e.target.result);
      }
      reader.onloadend = () => {
        setFileObjs([...newFileObjs]);
      }
      reader.readAsDataURL(file);
    };
  }

  const handleCopyPage = (index)=>{
    let newFileObjs = [...fileObjs];
    newFileObjs.push(newFileObjs[index]);
    setFileObjs([...newFileObjs])
    addPage(newFileObjs[index]);
  }

  const handleDeletePage = (index)=>{
    let newFileObjs = [...fileObjs];
    newFileObjs = newFileObjs.filter((v, i)=> (i != index))
    setFileObjs([...newFileObjs])
    deletePage(index);
  }

  useEffect(()=>{
    initCanvas(canvas);
    setFileObjs([]);
    setPageIndex(-1);
  }, [])

  useEffect(()=>{
    if(pageIndex==-1 && fileObjs.length>0){ // case: first page added
      setPageIndex(0);
      return;
    }
    
    if(fileObjs.length>0){
      if(pageIndex>=fileObjs.length){ // case: delete last page
        setPageIndex(fileObjs.length-1);
        return;
      }
      loadPage(pageIndex); // case: normal add/delete
    } else{ // case: at first / all pages deleted
      setPageIndex(-1);
    }
  }, [fileObjs])

  useEffect(()=>{
    if(pageIndex == -1){
      hideCurrentCanvas();
      return;
    }
    loadPage(pageIndex);
  }, [pageIndex])

  return (
    <div>
      <div className={editStyles.topContainer}>
        <div id={editStyles.album}>
          <img id={editStyles.add} src="/edit/add.png"
            onClick={()=>{addButton.current.click();}}
          />
          <input
              type="file" multiple
              style={{display:"none"}}
              ref={addButton}
              onChange={(e)=>{
                handleInputChange(e.target.files);
                e.target.value = '';
              }}
              accept="image/png, image/jpeg"
          />

          {fileObjs.map((src, i)=>{
            return (
              i==pageIndex?
                <div id={editStyles.curWrapper} key={i}>
                  <img id={editStyles.curPage} src={src}/>
                  <div id={editStyles.pageControlWrapper}>
                    <div id={editStyles.pageControl}>
                      <img className={editStyles.control} src="/edit/copy.png"
                        onClick={()=>{handleCopyPage(i)}}
                      />
                      <img className={editStyles.control} src="/edit/delete.png"
                        onClick={()=>{handleDeletePage(i)}}
                      />
                    </div>
                  </div>
                </div>
              :
                <img
                  className={editStyles.page}
                  key={i}
                  src={src}
                  onClick={()=>{handlePageClick(i)}}
                />
            )
          })}
        </div>
        
        <div className={editStyles.preview} id="preview">
          <canvas ref={canvas}/>
        </div>
        
        <div>
          <div className="alignCenter" id={editStyles.functionBar}>
            <div className="alignCenter" style={{ gap:10 }}>
              <div className="alignCenter">
                <div className="alignCenter" id={editStyles.undoWrapper}>
                  <img src="/edit/undo.png" width={24} />
                </div>
                <div className="alignCenter" id={editStyles.doWrapper}>
                  <img src="/edit/redo.png" width={24} />
                </div>
              </div>

              <div className="alignCenter">
                <img src="/edit/reset.png" width={60} />
              </div>
            </div>

            <div className="alignCenter" style={{gap:10}}>
              <div className="alignCenter">
                <img src="/edit/save.png" width={60} />
              </div>
              <div className="alignCenter"
                onClick={()=>{
                  router.push("/home");
              }}>
                <img src="/edit/exit.png" width={60} />
              </div>
            </div>
          </div>

          <div
            className={editStyles.editBody}
            onScroll={(e)=>{handleBodyScroll(e.target.scrollTop)}}
          >
            {renderChild()}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        </div>
      </div>
      <div
        id={editStyles.navBar}
        style={{
          bottom:hideNavbar?"-64px":"0px",
        }}>
        {navs.map((name, i)=>{
          return (
            <div 
              key={i}
              onClick={()=>{setNav(name[0])}}>
              <NavBtn
                src={`/edit/${nav==name[0]?name[0]+"_accent":name[0]}.png`}
                width="24"
                active={nav==name[0]}
                accentColor="#2A2A2A"
                accentFontColor={nav==name[0]?"#FFD56A":""}
              >
                {name[1]}
              </NavBtn>
            </div>
          )
        })}
      </div>
    </div>
  )
}
