"use client";

import TextBtn from "@/components/TextBtn";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function Action() {
    const action = useParams().action;

    const router = useRouter();
    const [branch, setBranch] = useState("...");
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (!isMapLoaded) return;
        let branch_ = JSON.parse(localStorage.getItem("branch"));
        if (!branch_) {
            router.replace("/home/cheeseMap");
            return;
        }

        if (action == "capture") localStorage.setItem("action", "capture");
        else if (action == "print") localStorage.setItem("action", "print");
        else {
            console.log("ERR [...action] page: Wrong action given.");
            router.push("/home");
        }

        setBranch(branch_);
        let mapOptions = {
            center: new naver.maps.LatLng(37.7222592, 126.7027989),
            zoom: 15,
        };
        const icon = {
            url: "/cheese_120.png",
            size: new naver.maps.Size(32, 32),
            scaledSize: new naver.maps.Size(32, 32),
        };
        var map = new naver.maps.Map("map", mapOptions);
        new naver.maps.Marker({
            position: new naver.maps.LatLng(
                branch_.latitude,
                branch_.longitude
            ),
            map: map,
            animation: naver.maps.Animation.DROP,
            icon: icon,
        });
        map.morph(
            new naver.maps.LatLng(branch_.latitude, branch_.longitude),
            16
        );
    }, [isMapLoaded]);

    return (
        <div>
            <Script
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP}`}
                onReady={() => {
                    setIsMapLoaded(true);
                }}
            ></Script>
            <div
                onClick={() => {
                    router.back();
                }}
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                }}
            >
                <img src="/back.png" width={28} />
            </div>
            <p
                style={{
                    fontSize: "24px",
                    fontWeight: "500",
                    color: "#343434",
                    marginTop: 0,
                }}
            >
                {action == "print" ? "인화" : "촬영"} 장소를 확인하세요.
            </p>
            <span className="title">치즈한장 {branch?.name}</span> <br />
            <span className="subtitle">{branch?.address}</span>
            <div
                id="map"
                style={{
                    width: "100%",
                    height: "300px",
                    margin: "3vh 0px 4vh 0px",
                    borderRadius: 10,
                    boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
                }}
            ></div>
            <TextBtn
                href="/home/cheeseMap"
                content="치즈맵에서 지점을 변경하세요."
            >
                현재 위치가 아닌가요?
            </TextBtn>
            <Link href={"/accessProcess/" + action + "/" + action}>
                <div className="next">
                    <p
                        style={{
                            fontSize: 20,
                            fontWeight: 500,
                            letterSpacing: 1.4,
                        }}
                    >
                        다음
                    </p>
                </div>
            </Link>
        </div>
    );
}
