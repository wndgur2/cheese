"use client";
import { useEffect, useRef, useState } from "react";
import shareStyles from "./share.module.css";
import axios from "axios";
import Share from "@/entity/Share";
import CheeseMapBtn from "@/components/CheeseMapBtn";

export default function SharePage() {
    const [location, setLocation] = useState();
    const [isLocated, setIsLocated] = useState(false);
    const [indexes, setIndexes] = useState([]);
    const [branch, setBranch] = useState();
    const [shares, setShares] = useState([]);
    const [page, setPage] = useState(1);
    const [end, setEnd] = useState(false);
    const sharesContainer = useRef();

    let offset = 0;

    async function getShares(page, branchId) {
        console.log("GET SHARES: ", page);
        let shares_ = [...shares];
        try {
            const res = await axios.get(
                `http://${process.env.NEXT_PUBLIC_API}/share/page/${page}`,
                {
                    params: {
                        branchId: branchId ? branchId : null,
                    },
                }
            );
            // console.log("share data: ", res.data.data);
            if (res.data.data) setPage(page);
            else setEnd(true);
            res.data.data?.map((share) => {
                if (!share.sharedPhotoMap) {
                    console.log(share.shareId, "No photo");
                    return;
                }
                shares_.push(
                    new Share(
                        share.shareId,
                        share.customerId,
                        share.nickname,
                        share.branchId,
                        share.createdAt,
                        share.sharedPhotoMap
                    )
                );
            });
            setShares(shares_);
            // getCustomerNames();
        } catch (error) {
            console.log(error);
        }
    }

    const handlePhotoSlide = (e, i) => {
        let newIndexes = indexes;
        newIndexes[i] = Math.round(e.target.scrollLeft / e.target.offsetWidth);
        setIndexes([...newIndexes]);
    };

    const handleMainScroll = (e) => {
        if (end) return;
        if (
            e.target.scrollTop >=
            (e.target.scrollHeight - e.target.offsetHeight) * 0.9
        ) {
            offset = e.target.scrollTop;
            getShares(page + 1, branch ? branch.id : null);
        }
    };

    const renderDots = (n, index) => {
        const result = [];
        for (let i = 0; i < n; ++i) {
            if (i == index) {
                result.push(<span key={i} className="dotFilled" />);
            } else {
                result.push(<span key={i} className="dot" />);
            }
        }
        return result;
    };

    useEffect(() => {
        let localBranch = JSON.parse(localStorage.getItem("branch"));
        if (localBranch) {
            setBranch(localBranch);
            getShares(page, localBranch.id);
        } else {
            getShares(page);
        }
    }, []);

    useEffect(() => {
        setIndexes(new Array(shares.length).fill(0));
    }, [shares]);

    return (
        <div>
            <div
                className="alignCenter"
                style={{
                    padding: "3vh 2vh 2vh 2vh",
                    height: "10vh",
                }}
            >
                <div style={{ width: "80%" }}>
                    {isLocated ? (
                        <div style={{ whiteSpace: "nowrap" }}>
                            <span className="title">{location}</span>
                            <span style={{ fontSize: 24 }}>에서</span> <br />
                        </div>
                    ) : (
                        <div>
                            <span className="title">
                                {branch ? branch.name : "치즈한장"}
                            </span>
                            <span style={{ fontSize: 24 }}>에서</span>
                            <br />
                        </div>
                    )}
                    <span
                        className="subtitle"
                        style={{
                            fontSize: 22,
                            fontWeight: 400,
                            letterSpacing: 1,
                        }}
                    >
                        최근에 공유된 사진이에요.
                    </span>
                </div>
                <CheeseMapBtn />
            </div>
            <div
                ref={sharesContainer}
                style={{
                    width: "100%",
                    overflowY: "scroll",
                    height: "calc(85vh - 64px)",
                }}
                onScroll={handleMainScroll}
            >
                {shares.map((share, i) => (
                    <div key={i} className={shareStyles.share}>
                        <div className={shareStyles.info}>
                            <span
                                style={{
                                    fontWeight: 400,
                                    fontSize: "2vh",
                                    fontColor: "#333",
                                }}
                            >
                                {share.nickname}
                            </span>
                            <span
                                style={{
                                    fontWeight: 200,
                                    fontSize: "1.8vh",
                                    fontColor: "#212121",
                                }}
                            >
                                {dateToString(share.createdAt)}
                            </span>
                        </div>
                        <div
                            className={shareStyles.images}
                            onScroll={(e) => handlePhotoSlide(e, i)}
                        >
                            {Object.values(share.sharedPhotoMap).map(
                                (photo, j) => (
                                    <img
                                        className={shareStyles.image}
                                        src={
                                            "data:image/png;base64," +
                                            photo.photoImage
                                        }
                                        key={j}
                                    />
                                )
                            )}
                        </div>
                        <div className="dotsWrapper">
                            <div className="dots">
                                {renderDots(
                                    Object.keys(share.sharedPhotoMap).length,
                                    indexes[i]
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {end ? (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "1.8vh",
                            fontWeight: 400,
                            color: "#888",
                            marginTop: "5vh",
                            marginBottom: "5vh",
                        }}
                    >
                        사진을 더 공유해주세요!
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

function dateToString(createdAt) {
    const date = new Date(createdAt);
    const now = new Date();
    const minDiff = (now - date) / (1000 * 60);
    if (minDiff < 10) return `방금 전`;
    if (minDiff < 60) return `${Math.round(minDiff)}분 전`;
    if (minDiff < 60 * 24) return `${Math.round(minDiff / 60)}시간 전`;
    if (minDiff < 60 * 24 * 7) return `${Math.round(minDiff / (60 * 24))}일 전`;
    return `${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
}
