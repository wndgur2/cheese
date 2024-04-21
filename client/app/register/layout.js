'use client'

import { SessionProvider } from "next-auth/react"

export default function Layout({ children }){
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}