'use client';

import { SessionProvider } from 'next-auth/react';
import NavBtn from '@/components/NavBtn';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import homeStyles from "./home.module.css";
import Link from 'next/link';

export default function HomeLayout({ children }) {
  const pathname = usePathname();

  const [hideNavbar, setHideNavbar] = useState(false);
  const [top, setTop] = useState(0);

  const navs = [
    {src: "/home_x4.png", width:"32px", href:"/home", name: "홈", active: "home"},
    {src: "/edit_x4.png", width:"32px", href:"/edit", name: "편집", active: "edit"},
    {src: "/cheese_120.png", width:"32px", href:"/accessProcess/capture", name: "촬영", active: "capture"},
    {src: "/print_x4.png", width:"32px", href:"/accessProcess/print", name: "인화", active: "print"},
    {src: "/my_x4.png", width:"32px", href:"/home/myCheese", name: "내치즈", active: "myCheese"},
  ];

  const handleBodyScroll = (curTop)=>{
    if(curTop > top) setHideNavbar(true);
    else setHideNavbar(false);
    setTop(curTop);
  }

  return (
    <div>
      <div
        style={{
          overflowY:"scroll",
          height:"calc(100vh - 64px)",
          backgroundColor:"#FEFBF6",
        }}
        // style={{height:"calc(100vh - 64px)", overflowY:"scroll"}}
        // onScroll={(e)=>{handleBodyScroll(e.target.scrollTop)}}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>
      <div className={homeStyles.navbar}
        style={{bottom:hideNavbar?-64:0}}
      >
        {navs.map((nav)=>{
          return(
            <Link href={nav.href} key={nav.name}>
              <NavBtn
                accentColor={"#EEE"}
                active={pathname.split("/")[pathname.split("/").length-1]==nav.active}
                src={nav.src} width={nav.width}>
                  {nav.name}
              </NavBtn>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
