import Item from "@/components/Item";
import ItemList from "@/components/ItemList";

export default function Sticker() {
    return (
      <div>
          <ItemList>
              <tr>
                  <Item src={"/edit/sticker/sticker_1.png"}/>
                  <Item src={"/edit/sticker/sticker_2.png"}/>
                  <Item src={"/edit/sticker/sticker_3.png"}/>
              </tr>
              <tr>
                  <Item src={"/edit/sticker/sticker_4.png"}/>
                  <Item src={"/edit/sticker/sticker_5.png"}/>
                  <Item src={"/edit/sticker/sticker_6.png"}/>
              </tr>
          </ItemList>
      </div>
    )
  }
  