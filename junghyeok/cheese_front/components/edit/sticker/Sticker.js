import { Page } from "@/app/edit/edit.module";
import Item from "@/components/Item";
import ItemList from "@/components/ItemList";
import { useEffect } from "react";

export default function Sticker({page}) {
    const stickers = [
        "/edit/sticker/sticker_1.png",
        "/edit/sticker/sticker_2.png",
        "/edit/sticker/sticker_3.png",
        "/edit/sticker/sticker_4.png",
        "/edit/sticker/sticker_5.png",
        "/edit/sticker/sticker_6.png",
        "/edit/sticker/sticker_7.png",
        "/edit/sticker/sticker_8.png"
    ]

    function renderItems(){
        let el = [];
        for(let i=0; i<Math.ceil(stickers.length/3); ++i){
            el.push(<tr key={i}>{renderRow(i)}</tr>);
        }
        return el;
    }

    function renderRow(i){
        let el = [];
        stickers.slice(i*3, (i+1)*3).forEach((src)=>{
            el.push(<Item key={src} src={src} handleClick={()=>{page?.addSticker(src)}} />)
        })
        return el;
    }

    useEffect(()=>{
      if(page)
        Page.setTouchLayer(page, "sticker");
    }, [page])
  
    return (
        <div>
            <ItemList>
                {renderItems()}
            </ItemList>
        </div>
    )
  }
  