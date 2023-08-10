'use client'
import Item from "@/components/Item";
import ItemList from "@/components/ItemList";

export default function Frame({page}) {
    const frames = [
        "/edit/frame/frame_1.png",
        "/edit/frame/frame_2.png",
        "/edit/frame/frame_3.png",
        "/edit/frame/frame_4.png",
        "/edit/frame/frame_5.png",
        "/edit/frame/frame_6.png",
        "/edit/frame/frame_7.png",
        "/edit/frame/frame_8.png",
        "/edit/frame/frame_9.png",
    ]

    function renderItems(){
        let el = [];
        for(let i=0; i<Math.ceil(frames.length/3); ++i){
            el.push(<tr key={i}>{renderRow(i)}</tr>);
        }
        return el;
    }

    function renderRow(i){
        let el = [];
        frames.slice(i*3, (i+1)*3).forEach((src)=>{
            el.push(<Item key={src} src={src} handleClick={()=>{page?.setFrame(src);}} />)
        })
        return el;
    }
    return (
        <div>
            <ItemList>
                {renderItems()}
            </ItemList>
        </div>
    )
  }
  