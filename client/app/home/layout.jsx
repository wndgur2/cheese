"use client";

import { SessionProvider } from "next-auth/react";
import NavBtn from "@/components/NavBtn";
import { usePathname } from "next/navigation";
import homeStyles from "./home.module.css";
import Link from "next/link";

export default function HomeLayout({ children }) {
    const pathname = usePathname();

    const navs = [
        {
            src: "/home_x4.png",
            width: "32px",
            href: "/home",
            name: "홈",
            active: ["home"],
        },
        {
            src: "/edit_x4.png",
            width: "32px",
            href: "/edit",
            name: "편집",
            active: ["edit"],
        },
        {
            src: "/cheese_empty_120.png",
            width: "32px",
            href: "/accessProcess/capture",
            name: "촬영",
            active: ["capture"],
        },
        {
            src: "/print_x4.png",
            width: "32px",
            href: "/accessProcess/print",
            name: "인화",
            active: ["print", "printQueue"],
        },
        {
            src: "/my_x4.png",
            width: "32px",
            href: "/home/myCheese",
            name: "내치즈",
            active: ["myCheese", "signin"],
        },
    ];

    return (
        <div>
            <div
                style={{
                    height: "calc(100vh - 64px)",
                    backgroundColor: "#FEFBF6",
                }}
            >
                <SessionProvider>{children}</SessionProvider>
            </div>
            <div className={homeStyles.navbar}>
                {navs.map((nav) => {
                    return (
                        <Link href={nav.href} key={nav.name}>
                            <NavBtn
                                accentColor={"#EAEAEA"}
                                active={nav.active.includes(
                                    pathname.split("/")[
                                        pathname.split("/").length - 1
                                    ]
                                )}
                                src={nav.src}
                                width={nav.width}
                            >
                                {nav.name}
                            </NavBtn>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
