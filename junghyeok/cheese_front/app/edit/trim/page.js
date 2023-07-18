import BigBtn from "@/components/BigBtn";
import EditWrapper from "@/components/EditWrapper";
import ImageText from "@/components/ImageText";
import Tilter from "@/components/Tilter";

export default function Trim() {
  return (
    <div>
      <EditWrapper>
        <span style={{
          width:"100%",
          textAlign:"center"
        }}>사진 비율</span>
        <div style={{
          display:"flex",
          overflowX: "scroll",
          alignItems:"baseline",
          width: "100%",
        }}>
          <ImageText src="/edit/trim/free.png" width="30vw" size={"17vw"}>자유롭게</ImageText>
          <ImageText src="/edit/trim/1_1.png" width="30vw" size={"17vw"}>1:1</ImageText>
          <ImageText src="/edit/trim/4_3.png" width="30vw" size={"17vw"}>4:3</ImageText>
          <ImageText src="/edit/trim/16_9.png" width="30vw" size={"17vw"}>16:9</ImageText>
          <ImageText src="/edit/trim/16_10.png" width="30vw" size={"17vw"}>16:10</ImageText>
        </div>
      </EditWrapper>
      <EditWrapper>
        <span>회전</span>
        <Tilter />
      </EditWrapper>
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        margin: "0px 4vw"
      }}>
        <BigBtn src={"/edit/trim/rotate_anticlock.png"} iconWidth={32} size={52}></BigBtn>
        <BigBtn src={"/edit/trim/rotate_clock.png"} iconWidth={32} size={52}></BigBtn>
      </div>
    </div>
  )
}
