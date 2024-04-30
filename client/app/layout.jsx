"use client";

import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const noto_Sans_KR = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={noto_Sans_KR.className}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
