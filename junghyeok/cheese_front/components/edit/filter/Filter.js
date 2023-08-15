'use client'
import Item from "@/components/Item";
import ItemList from "@/components/ItemList";

export default function Frame({page}) {
    const filters = [{
            src: "/edit/filter/original.png",
            brightness: 100,
            contrast: 100,
            blur: 0,
            grayscale: 0,
            saturate: 100
        },{
            src: "/edit/frame/frame_1.png",
            brightness: 120,
            contrast: 120,
            blur: 0,
            grayscale: 0,
            saturate: 130
        },{
            src: "/edit/frame/frame_2.png",
            brightness: 100,
            contrast: 150,
            blur: 0,
            grayscale: 100,
            saturate: 100
        },{
            src: "/edit/frame/frame_3.png",
            brightness: 100,
            contrast: 100,
            blur: 0,
            grayscale: 0,
            saturate: 200
        },{
            src: "/edit/frame/frame_4.png",
            brightness: 100,
            contrast: 100,
            blur: 10,
            grayscale: 0,
            saturate: 100
        },
    ]
    
    function handleFilterClick(filter){
        page?.setFilter({
            brightness: filter.brightness,
            contrast: filter.contrast,
            blur: filter.blur,
            grayscale: filter.grayscale,
            saturate: filter.saturate,
        });
    }

    function renderItems(){
        let el = [];
        for(let i=0; i<Math.ceil(filters.length/3); ++i){
            el.push(<tr key={i}>{renderRow(i)}</tr>);
        }
        return el;
    }

    function renderRow(i){
        let el = [];
        filters.slice(i*3, (i+1)*3).forEach((filter)=>{
            el.push(<Item key={filter.src} src={filter.src} handleClick={()=>{handleFilterClick(filter)}} />)
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
  