'use client';

import './globals.css'
import { Noto_Sans_KR } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';

const noto_Sans_KR = Noto_Sans_KR({
  subsets: ['latin'],
  weight:['300', '400', '500', '700']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <Script
          src={"https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js"}
          integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh" crossorigin="anonymous">
        </Script> */}
      </head>
      <body className={noto_Sans_KR.className}>
        <SessionProvider>
          {children} 
        </SessionProvider>
      </body>
    </html>
  )
}
