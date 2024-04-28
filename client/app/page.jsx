"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    let router = useRouter();
    useEffect(() => {
        router.replace("/home");
    }, []);

    return (
        <div>
            <div className="loader">
                <img src="/cheese_512.png" width={"50%"} />
            </div>
        </div>
    );
}
