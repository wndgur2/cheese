import Item from "@/components/Item";
import ItemList from "@/components/ItemList";

export default function Filter() {
    return (
      <div>
          <ItemList>
              <tr>
                  <Item src={"/edit/frame/frame_1.png"}/>
                  <Item src={"/edit/frame/frame_1.png"}/>
                  <Item src={"/edit/frame/frame_1.png"}/>
              </tr>
              <tr>
                  <Item src={"/edit/frame/frame_1.png"}/>
                  <Item src={"/edit/frame/frame_1.png"}/>
                  <Item src={"/edit/frame/frame_1.png"}/>
              </tr>
          </ItemList>
      </div>
    )
  }
  