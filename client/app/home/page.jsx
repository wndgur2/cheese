"use client";

import { useEffect, useState } from "react";
import homeStyles from "./home.module.css";
import TextBtn from "@/components/TextBtn";
import axios from "axios";
import SharedPhoto from "@/entity/SharedPhoto";
import Branch from "@/entity/Branch";
import CheeseMapBtn from "@/components/CheeseMapBtn";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

async function getSharedPhotos(setPhotos, index, branchId) {
    let photos = [];
    try {
        const res = await axios.get(
            `http://${process.env.NEXT_PUBLIC_API}/share/page/${index}`,
            {
                params: {
                    branchId: branchId ? branchId : null,
                },
            }
        );
        // console.log("share data: ", res.data.data);
        res.data.data?.map((share) => {
            if (!share.sharedPhotoMap) {
                console.log("No photo");
                return;
            }
            const photo =
                share.sharedPhotoMap[Object.keys(share.sharedPhotoMap)[0]];
            photos.push(
                new SharedPhoto(
                    photo.photographId,
                    photo.customerId,
                    photo.branchId,
                    photo.createdAt,
                    photo.photoImage
                )
            );
        });
        setPhotos(photos);
        return photos;
    } catch (error) {
        console.log(error);
    }
}

async function getBranch(setBranch, branchId) {
    try {
        const res = await (
            await fetch(
                `http://${process.env.NEXT_PUBLIC_API}/branch/${branchId}`
            )
        ).json();
        // console.log(res);

        const branch = new Branch(
            res.data.branchId,
            res.data.name,
            res.data.longitude,
            res.data.latitude,
            res.data.shootingCost,
            res.data.printingCost,
            res.data.paperAmount
        );
        branch.getAddress().then(() => {
            localStorage.setItem("branch", JSON.stringify(branch));
            setBranch(branch);
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data");
    }
}

export default function Home() {
    const [branch, setBranch] = useState();
    const [isLocated, setIsLocated] = useState(false);
    const [photos, setPhotos] = useState([]);
    const params = useSearchParams();

    useEffect(() => {
        let localBranch = JSON.parse(localStorage.getItem("branch"));
        let paramBranchId = params.get("branchId");
        if (paramBranchId) {
            getBranch(setBranch, paramBranchId);
            getSharedPhotos(setPhotos, 1, paramBranchId);
        } else if (localBranch) {
            setBranch(localBranch);
            getSharedPhotos(setPhotos, 1, localBranch.id);
        } else {
            getSharedPhotos(setPhotos, 1);
        }

        if (localStorage.getItem("uuid") === null)
            localStorage.setItem("uuid", guid());
    }, []);

    useEffect(() => {
        if (!branch) return;
        setIsLocated(true);
    }, [branch]);

    return (
        <div
            className="container"
            style={{ height: "calc(100vh - 64px)", overflowY: "scroll" }}
        >
            <div className="alignCenter" style={{ width: "100%" }}>
                <div style={{ width: "80%", paddingLeft: "1vw" }}>
                    {branch ? (
                        <div>
                            <span className="title">
                                {branch.name.length < 7 ? "치즈한장" : ""}{" "}
                                {branch.name}
                            </span>{" "}
                            <br />
                            <span
                                className="subtitle"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                {branch.address.length < 12
                                    ? branch.address
                                    : branch.address.slice(0, 12).trim() +
                                      "..."}
                            </span>
                        </div>
                    ) : (
                        <div>
                            <span className="title">치즈한장</span> <br />
                            <span className="subtitle">
                                선택된 지점이 없어요.
                            </span>
                        </div>
                    )}
                </div>
                <CheeseMapBtn />
            </div>
            {isLocated ? (
                photos.length ? (
                    <img
                        src={"data:image/png;base64," + photos[0].photoImage}
                        width={"100%"}
                        style={{
                            borderRadius: "10px",
                            margin: "2.5vh 0 2.5vh 0",
                            maxHeight: "30vh",
                            objectFit: "cover",
                            boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                        }}
                    />
                ) : (
                    <img
                        src={"/samples/placeholder.jpeg"}
                        width={"100%"}
                        style={{
                            borderRadius: "10px",
                            margin: "2.5vh 0 2.5vh 0",
                            maxHeight: "30vh",
                            objectFit: "cover",
                            boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                        }}
                    ></img>
                )
            ) : (
                <>
                    <img
                        src={"/samples/placeholder.jpeg"}
                        width={"100%"}
                        style={{
                            borderRadius: "10px",
                            margin: "2.5vh 0 0 0",
                            maxHeight: "30vh",
                            objectFit: "cover",
                            boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                        }}
                    ></img>
                    <TextBtn
                        href="/home/cheeseMap"
                        color="#FFD56A"
                        type="big"
                        content="현장에서 촬영과 인화를 할 수 있어요."
                    >
                        지점을 선택해주세요.
                    </TextBtn>
                </>
            )}

            <div className={homeStyles.bigBtnWrapper}>
                <BigBtn
                    enabled={isLocated}
                    href="/accessProcess/capture"
                    src="/cheese_empty_37_30_x4.png"
                >
                    촬영
                </BigBtn>
                <BigBtn
                    enabled={isLocated}
                    href="/accessProcess/print"
                    src="/print_x4.png"
                >
                    인화
                </BigBtn>
            </div>

            <TextBtn content="사진 아이디어를 얻어보세요." href="/home/share">
                공유한 사진 구경하기
            </TextBtn>
            <div
                style={{
                    display: "flex",
                    justifyContent: "safe center",
                    gap: "10px",
                    overflowX: "scroll",
                    marginTop: "2.5vh",
                }}
            >
                {photos.slice(1, 5).map((photo, i) => {
                    return (
                        <img
                            src={"data:image/png;base64," + photo.photoImage}
                            key={i}
                            style={{
                                maxWidth: "80vw",
                                maxHeight: "30vh",
                                borderRadius: "10px",
                                boxShadow:
                                    "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
                                objectFit: "cover",
                            }}
                        />
                    );
                })}
            </div>
            <br />
            <br />
            <br />
        </div>
    );
}

function BigBtn({ enabled, href, src, children }) {
    return (
        <Link
            href={enabled ? href : ""}
            style={{
                width: "45%",
                height: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                }}
            >
                <button
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "14px",
                        backgroundColor: `${enabled ? "#FFD56A" : "#FEFBF6"}`,
                        border: "none",
                        boxShadow: "1px 1px 10px 1px rgba(0, 0, 0, 0.10)",
                        width: "100%",
                        height: "100%",
                        lineHeight: "normal",
                    }}
                >
                    <div
                        style={{
                            width: "36%",
                            height: "36%",
                            backgroundImage: "url(" + src + ")",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}
                    />
                    {children ? (
                        <p
                            style={{
                                fontSize: "2vh",
                                margin: "1vh 0px 0px 0px",
                            }}
                        >
                            {children}
                        </p>
                    ) : (
                        <></>
                    )}
                </button>
            </div>
        </Link>
    );
}
