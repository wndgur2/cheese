import ImageText from "@/components/ImageText";
import LongBtn from "@/components/LongBtn";
import editStyles from "../edit.module.css";
import axios from "axios";

export default function Ai({page}) {

  async function retouchSkin(){
    const data = new FormData();
    let blob = await fetch(page.src).then(r => r.blob());
    data.append('file', blob);
    try{
      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_AI_API}/ai/skin_smoothing`,
        data, {
          responseType: 'blob',
      })
      if(confirm("피부 보정을 적용하시겠습니까?")){
        page.setImage(URL.createObjectURL(res.data));
        page.src = URL.createObjectURL(res.data);
      }
    } catch(err) {
      console.log(err);
    }
  }
  
  async function retouchBody(){
    const data = new FormData();
    let blob = await fetch(page.src).then(r => r.blob());
    data.append('file', blob);
    try{
      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_AI_API}/ai/body_reshape`,
        data, {
          responseType: 'blob',
      })
      if(confirm("체형 보정을 적용하시겠습니까?")){
        page.setImage(URL.createObjectURL(res.data));
        page.src = URL.createObjectURL(res.data);
      }
    } catch(err) {
      console.log(err);
    }
  }
  
  async function retouchAll(){
    if(!confirm("전체 보정을 적용하시겠습니까?")) return;

    const data = new FormData();
    let blob = await fetch(page.src).then(r => r.blob());
    data.append('file', blob);
    try{
      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_AI_API}/ai/skin_smoothing`,
        data, {
          responseType: 'blob',
      })
      page.setImage(URL.createObjectURL(res.data));
      page.src = URL.createObjectURL(res.data);
      console.log("skin retouched.");
    } catch(err) {
      console.log(err);
    }

    const retouchedData = new FormData();
    retouchedData.append('file', await fetch(page.src).then(r => r.blob()));

    try{
      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_AI_API}/ai/body_reshape`,
      retouchedData, {
          responseType: 'blob',
      })
      page.setImage(URL.createObjectURL(res.data));
      page.src = URL.createObjectURL(res.data);
      console.log("body reshaped.");
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className={editStyles.editWrapper}>
        <span>자동 편집</span>
        <div style={{
          display:"flex",
          width:"100%",
          margin: "2.1vh 0px 1vh 0px",
          justifyContent:"space-between",
        }}>
          <div onClick={retouchAll}>
            <ImageText src="/edit/ai/check_all.png" width={40}>전체 보정</ImageText>
          </div>
          <div style={{
            display:"flex",
          }}>
            <div onClick={retouchSkin}>
              <ImageText src="/edit/ai/face.png" width={40}>피부 보정</ImageText>
            </div>
            <div onClick={retouchBody}>
              <ImageText src="/edit/ai/body.png" width={40}>체형 보정</ImageText>
            </div>
            <ImageText src="/edit/ai/filter.png" width={40}>필터 생성</ImageText>
          </div>
        </div>
      </div>
      <LongBtn>
        <img src="/edit/ai/object.png" width={32} />
        <span style={{
          fontSize:16,
          color: "#212121",
          fontWeight: 500
        }}>피사체 편집하기</span>
      </LongBtn>
      <LongBtn>
        <img src="/edit/ai/extract_filter.png" width={32} />
        <span style={{
          fontSize:16,
          color: "#212121",
          fontWeight: 500
        }}>다른 사진에서 필터 추출해오기</span>
      </LongBtn>
    </div>
  )
}
  