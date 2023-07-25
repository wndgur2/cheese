'use client';

import NavBtn from "@/components/NavBtn";
import editStyles from "./edit.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function EditLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [preview, setPreview] = useState(0);
  const [fileObjs, setFileObjs] = useState([]);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [top, setTop] = useState(0);

  const addButton = useRef();

  const navs = [
    ["ai", "AI"],
    ["trim", "다듬기"],
    ["draw", "그리기"],
    ["frame", "프레임"],
    ["sticker", "스티커"],
    ["text", "텍스트"],
    ["filter", "필터"],
    ["adjust", "조정"],
  ];

  const handleBodyScroll = (curTop)=>{
    if(curTop > top){
      setHideNavbar(true);
    } else{
      setHideNavbar(false);
    }
    setTop(curTop);
  }

  const handleInputChange = (files)=>{
    let newFileObjs = [...fileObjs];
    for(let file of files){
      const reader = new FileReader();
      reader.onload = (e) => {
        newFileObjs.push(e.target.result);
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
  }

  const handleDeletePage = (index)=>{
    let newFileObjs = [...fileObjs];
    newFileObjs = newFileObjs.filter(
      (v, i)=>{
        return (i != index);
      }
    )
    setFileObjs([...newFileObjs])
  }

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
              onChange={(e)=>{handleInputChange(e.target.files)}}
              accept="image/png, image/jpeg"
          />

          {fileObjs.map((src, i)=>{
            return (
              i==preview?
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
                  onClick={()=>{setPreview(i)}}
                />
            )
          })}
        </div>
        
        <div id={editStyles.preview}>
          { preview==null?
            <></>:
            <img id={editStyles.previewImage} src={fileObjs[preview]} width={"100%"}/>
          }
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
            {children}
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
            <NavBtn
              key={i}
              src={`/edit/${pathname.split("/")[2]==name[0]?name[0]+"_accent":name[0]}.png`}
              width="24"
              active={pathname.split("/")[2]==name[0]}
              href={`/edit/${name[0]}`}
              accentColor="#2A2A2A"
              accentFontColor={pathname.split("/")[2]==name[0]?"#FFD56A":""}
            >
              {name[1]}
            </NavBtn>
          )
        })}
      </div>
    </div>
  )
}
