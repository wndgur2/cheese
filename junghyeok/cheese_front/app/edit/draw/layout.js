'use client';

import './styles.css';
import NavImgBtn from '@/components/NavImgBtn';
import { usePathname } from "next/navigation";

export default function DrawLayout({children}) {
    const pathname = usePathname();
    return (
        <div style={{height:"100%"}}>
            <div style={{height:"70%", margin:0}}>   
                {children}
            </div>
        </div>
  )
}
