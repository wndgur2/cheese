'use client';

import NavBtn from "@/components/NavBtn";
import editStyles from "../../components/edit/edit.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Trim from "../../components/edit/trim/Trim";
import Ai from "../../components/edit/ai/Ai";
import Sticker from "../../components/edit/sticker/Sticker";
import Frame from "../../components/edit/frame/Frame";
import Draw from "../../components/edit/draw/Draw";
import Filter from "../../components/edit/filter/Filter";
import Adjust from "../../components/edit/adjust/Adjust";
import Text from "../../components/edit/text/Text";
import { Page } from "./edit.module";

import JSZip from "jszip"
import Script from "next/script";

export default function Edit({searchParams}) {
  const router = useRouter();

  const [nav, setNav] = useState("Ai");
  const [scrollTop, setScrollTop] = useState(0);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [pageIndex, setPageIndex] = useState(-1);
  const [pages, setPages] = useState([]);

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
        return <Ai page = {pages[pageIndex]} />
      case "Trim":
        return <Trim page = {pages[pageIndex]} />
      case "Draw":
        return <Draw page = {pages[pageIndex]} />
      case "Frame":
        return <Frame page = {pages[pageIndex]} />
      case "Sticker":
        return <Sticker page = {pages[pageIndex]} />
      case "Text":
        return <Text page = {pages[pageIndex]} />
      case "Filter":
        return <Filter page = {pages[pageIndex]} />
      case "Adjust":
        return <Adjust page = {pages[pageIndex]} />
      default:
        break;
    }
  }

  const save = async ()=>{
    console.log("Save");
    let files = [];

    const promises = pages.map(async (p) => {
      const imageBlob = await fetch(p.save()).then(response => response.blob());
      files.push(new File([imageBlob], 'filename.jpg'));
      console.log(files);
    });

    await Promise.all(promises);

    const zip = new JSZip();

    files.forEach((file, i)=>{
      zip.file("photo" + i + ".png", file, { base64: true });
    })
    zip.generateAsync({ type: 'blob' }).then(function(content) {
      saveAs(content, 'Cheese.zip');
    });
  }

  // event handlers
  const handleBodyScroll = (curTop)=>{
    console.log("SCROLL");
    if(curTop > scrollTop) setHideNavbar(true);
    else setHideNavbar(false);
    setScrollTop(curTop);
  }

  const handleFileChange = (files)=>{ // 이미지들로 각 page를 생성
    let newPages = [...pages];
    for(let file of files){
      const reader = new FileReader();

      reader.onload = (e) => {
        newPages.push(new Page(e.target.result));
      }
      reader.onloadend = () => {
        setPages([...newPages]);
      }

      reader.readAsDataURL(file);
    };
  }

  const handlePageCopy = ()=>{
    let newPages = [...pages];
    newPages.push(pages[pageIndex].copy());
    setPages([...newPages])
  }

  const handlePageDelete = ()=>{
    let newPages = [...pages];
    newPages[pageIndex].delete();
    
    if(pages.length == 1) setPageIndex(-1);
    else if(pages.length-1 > pageIndex) pages[pageIndex+1].show();
    else if(pages.length >= 2) setPageIndex(pageIndex-1);

    newPages = newPages.filter((v, i)=> (i != pageIndex))
    setPages([...newPages])
  }

  const handlePageClick = (i)=>{
    pages[pageIndex]?.hide();
    setPageIndex(i);
    pages[i].show();
  }

  // useEffects

  useEffect(()=>{
    Page.init();
    if(searchParams.photos=="true"){
      let newPages = [];
      for(let photo of JSON.parse(localStorage.getItem("photos"))){
        newPages.push(new Page(photo));
      }
      setPages([...newPages]);
    } else{
      addButton.current.click();
    }
  }, [])

  useEffect(()=>{
    switch(nav){
      case "Trim":
        Page.disableTouchLayer();
        break;
      case "Draw":
        Page.setTouchLayer(pages[pageIndex], "pen");
        break;
      case "Sticker":
        Page.setTouchLayer(pages[pageIndex], "sticker");
        break;
      case "Text":
        Page.setTouchLayer(pages[pageIndex], "text");
        break;
      default:
        Page.setTouchLayer(pages[pageIndex], "");
        break;
    }
  }, [nav])

  useEffect(()=>{
    if(pageIndex >= 0){
      pages[pageIndex].show();
    }
  }, [pageIndex])

  useEffect(()=>{
    if(pageIndex==-1){
      if(pages.length>0){
        setPageIndex(0);
      }
    }
  }, [pages])

  return (
    <div>
      <Script src="http://cdn.jsdelivr.net/g/filesaver.js" />
      <div className={editStyles.topContainer}>
        <div style={{ display:"flex", justifyContent:"space-between"}}>
          <img id={editStyles.add} src="/edit/add.png"
            onClick={()=>{addButton.current.click();}}
          />
          <div id={editStyles.album}>
            <input
                type="file" multiple
                style={{display:"none"}}
                ref={addButton}
                onChange={(e)=>{
                  handleFileChange(e.target.files);
                  e.target.value = '';
                }}
                accept="image/png, image/jpeg"
            />

            {pages.map((page, i)=>{
              return (
                i==pageIndex?
                  <div id={editStyles.curWrapper} key={i}>
                    <img id={editStyles.curPage} src={page.src}/>
                    <div id={editStyles.pageControlWrapper}>
                      <div id={editStyles.pageControl}>
                        <img className={editStyles.control} src="/edit/copy.png"
                          onClick={()=>{handlePageCopy()}}
                        />
                        <img className={editStyles.control} src="/edit/delete.png"
                          onClick={()=>{handlePageDelete()}}
                        />
                      </div>
                    </div>
                  </div>
                :
                  <img
                    className={editStyles.page} 
                    key={i}
                    src={page.src}
                    onClick={()=>{handlePageClick(i)}}
                  />
              )
            })}
          </div>
          <div className="alignCenter"
            onClick={()=>{
              if(confirm("정말 종료하시겠습니까?"))
                router.push("/home");
            }}>
            <img src="/edit/exit.png" width={60} />
          </div>
        </div>
        
        <div className={editStyles.preview} id="preview">
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
              <div className="alignCenter" onClick={save}>
                <img src="/edit/save.png" width={60} /><a id="link"></a>
              </div>
            </div>
          </div>

          <div
            className={editStyles.editBody}
            style={{overflowY:"scroll"}}
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
