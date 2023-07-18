'use client';

import { SessionProvider } from 'next-auth/react';
import Container from '@/components/Container';
import NavBtn from '@/components/NavBtn';
import { usePathname } from 'next/navigation';


export default function HomeLayout({ children }) {
  const pathname = usePathname();

  const navs = [
    {src: "/home_x4.png", width:"32px", href:"/home", name: "홈"},
    {src: "/edit_x4.png", width:"32px", href:"/edit", name: "편집"},
    {src: "/cheese_120.png", width:"32px", href:"/access_process/action/capture", name: "촬영"},
    {src: "/print_x4.png", width:"32px", href:"/access_process/action/print", name: "인화"},
    {src: "/my_x4.png", width:"32px", href:"/home/my_cheese", name: "내치즈"},
  ];

  return (
    <div>
      <Container paddingTop="30px">
        <SessionProvider>
          {children}
        </SessionProvider>
      </Container>
      <div style={{
        position: "absolute",
        display:"flex",
        justifyContent:"space-around",
        alignItems:"center",
        width:"100%",
        maxWidth: "520px",
        height:"64px",
        bottom:"0px",
        fontSize: "12px",
        fontWeight: 350,
        letterSpacing: "0.6px",
        backgroundColor:"#FEFBF6",
        boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, 0.05)",
      }}>
        {navs.map((nav)=>{
          return(
            <NavBtn key={nav.name}
              accentColor={"#EEE"}
              active={pathname==nav.href}
              src={nav.src} width={nav.width}
              href={nav.href}>
                {nav.name}
              </NavBtn>
          )
        })}
      </div>
    </div>
  )
}
