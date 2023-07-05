import Link from "next/link";

export default function EditLayout({ children }) {
    return (
      <div>
        편집 화면
        {children}

        <Link href="/edit/ai"> AI </Link>
        <Link href="/edit/trim"> 다듬기 </Link>
        <Link href="/edit/draw"> 그리기 </Link>
        <Link href="/edit/frame"> 프레임 </Link>
        <Link href="/edit/sticker"> 스티커 </Link>
        <Link href="/edit/text"> 텍스트 </Link>
        <Link href="/edit/filter"> 필터 </Link>
        <Link href="/edit/adjust"> 조정 </Link>
      </div>
    )
  }
  