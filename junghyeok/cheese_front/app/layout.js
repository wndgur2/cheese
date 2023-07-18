'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      <Script
        strategy="beforeInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
      ></Script>
      <Script
        src={"https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js"}
        integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh" crossorigin="anonymous">
      </Script>
      </head>
      <body className={inter.className} style={{
        margin:"0px",
        overflow:"hidden",
      }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
