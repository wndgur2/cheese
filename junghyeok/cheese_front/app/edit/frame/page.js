'use client'
import Item from "@/components/Item";
import ItemList from "@/components/ItemList";

export default function Frame() {
    return (
        <div>
            <ItemList>
                <tr>
                    <Item src={"/edit/frame/frame_1.png"}/>
                    <Item src={"/edit/frame/frame_2.png"}/>
                    <Item src={"/edit/frame/frame_3.png"}/>
                </tr>
                <tr>
                    <Item src={"/edit/frame/frame_4.png"}/>
                    <Item src={"/edit/frame/frame_5.png"}/>
                    <Item src={"/edit/frame/frame_6.png"}/>
                </tr>
            </ItemList>
        </div>
    )
  }
  