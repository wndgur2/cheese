'use client';

import Link from 'next/link'
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
      <Script
        strategy="beforeInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
      ></Script>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <br/>
        <div>
          <Link href="/"> 홈 </Link>
          <Link href="/edit/ai"> 편집 </Link>
          <Link href="/access_process/action/capture"> 촬영 </Link>
          <Link href="/access_process/action/print"> 인화 </Link>
          <Link href="/my_cheese"> 내치즈 </Link>
          <Link href="/cheese_map"> 치즈맵 </Link>
        </div>
      </body>
    </html>
  )
}
