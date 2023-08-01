import ImageText from "@/components/ImageText";
import LongBtn from "@/components/LongBtn";
import editStyles from "../edit.module.css";

export default function Ai() {
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
            <ImageText src="/edit/ai/check_all.png" width={40}>전체 보정</ImageText>
            <div style={{
              display:"flex",
            }}>
              <ImageText src="/edit/ai/face.png" width={40}>피부 보정</ImageText>
              <ImageText src="/edit/ai/body.png" width={40}>체형 보정</ImageText>
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
  