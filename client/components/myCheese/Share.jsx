"use client";
import { useEffect, useState } from "react";
import myCheeseStyles from "../../app/home/myCheese/myCheese.module.css";
import deleteShare from "@/disabled_apis/deleteShare";
import { useSession } from "next-auth/react";
import savePhotosOnDevice from "@/disabled_apis/savePhotosOnDevice";

export default function Shares({ shares, userData, setUserData, branches }) {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/home/signin?callbackUrl=/home/myCheese");
        },
    });
    const [selected, setSelected] = useState([]);
    const [isAllSameBranch, setIsAllSameBranch] = useState(true);
    const [isAllSameDate, setIsAllSameDate] = useState(true);

    const handleImageClick = (i) => {
        let newSelected;
        if (selected.includes(i)) {
            newSelected = selected.filter((v) => v != i);
        } else {
            newSelected = selected;
            newSelected.push(i);
        }
        setSelected([...newSelected]);
    };

    const saveSelected = () => {
        const data = selected.map((i) =>
            Object.values(shares[i].sharedPhotoMap).map(
                (v) => "data:image/png;base64," + v.photoImage
            )
        );
        savePhotosOnDevice(data.flat());
    };

    const deleteSelected = () => {
        if (!confirm("선택한 공유글을 삭제할까요?")) return;

        selected.map((i) => {
            deleteShare(shares[i].shareId, session);
        });
        let newShares = shares.filter((v, i) => !selected.includes(i));
        setUserData({ ...userData, shares: newShares });
        alert(`공유글 ${selected.length}개를 삭제했어요.`);
        setSelected([]);
    };

    const renderImage = (i) => {
        if (i >= shares.length) return <></>;
        let result = [];
        result.push(
            <td
                key={i}
                onClick={() => {
                    handleImageClick(i);
                }}
            >
                <div className={myCheeseStyles.photoAmount}>
                    {Object.keys(shares[i].sharedPhotoMap).length}
                </div>
                <div
                    className={`${myCheeseStyles.imageWrapper} ${
                        selected.includes(i) ? myCheeseStyles.selected : ""
                    }`}
                >
                    <img
                        className={`${myCheeseStyles.image}`}
                        src={
                            "data:image/png;base64," +
                            Object.values(shares[i].sharedPhotoMap)[0]
                                .photoImage
                        }
                    />
                </div>
            </td>
        );
        return result;
    };

    const renderShares = () => {
        const result = [];
        for (let i = 0; i < shares.length; i += 2) {
            result.push(
                <tr key={i} className={myCheeseStyles.tr}>
                    {renderImage(i)}
                    {renderImage(i + 1)}
                </tr>
            );
        }
        return result;
    };

    useEffect(() => {
        if (!selected.length) return;
        setIsAllSameBranch(true);
        setIsAllSameDate(true);
        const currentBranchId = shares[selected[0]].branchId;
        const currentDate = new Date(shares[selected[0]].createdAt)
            .toUTCString()
            .split(" ")
            .slice(0, 4)
            .join(" ");
        for (let i = 1; i < selected.length; i++) {
            if (shares[selected[i]].branchId != currentBranchId) {
                setIsAllSameBranch(false);
            }
            if (
                new Date(shares[selected[i]].createdAt)
                    .toUTCString()
                    .split(" ")
                    .slice(0, 4)
                    .join(" ") != currentDate
            ) {
                setIsAllSameDate(false);
            }
        }
    }, [selected]);

    return (
        <div>
            <table className={myCheeseStyles.table} cellSpacing={"10"}>
                <tbody>
                    {shares?.length ? (
                        renderShares()
                    ) : (
                        <tr>
                            <td>
                                <div
                                    style={{
                                        width: "100vw",
                                        textAlign: "center",
                                        fontSize: "4vw",
                                        fontWeight: 400,
                                        color: "#888",
                                        margin: "5vh 0px 5vh 0px",
                                    }}
                                >
                                    아직 공유한 사진이 없어요
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <br />
            <br />
            {selected.length ? (
                <div className={myCheeseStyles.info}>
                    {isAllSameBranch && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "4vh",
                                marginBottom: "3vh",
                            }}
                        >
                            <span
                                style={{
                                    height: "3.1vh",
                                    fontSize: "2.8vh",
                                    fontWeight: 500,
                                    color: "#212121",
                                }}
                            >
                                {isAllSameBranch &&
                                    branches
                                        .map((b) => {
                                            if (
                                                b.branchId ==
                                                shares[selected[0]].branchId
                                            )
                                                return b.name;
                                        })
                                        .join("")}
                            </span>
                            {isAllSameDate && (
                                <span
                                    style={{
                                        height: "3.1vh",
                                        fontSize: "2vh",
                                        fontWeight: 300,
                                        color: "#444",
                                    }}
                                >
                                    {new Date(shares[selected[0]].createdAt)
                                        .toUTCString()
                                        .split(" ")
                                        .slice(0, 4)
                                        .join(" ")}
                                </span>
                            )}
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "5vh",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "50vw",
                            }}
                        >
                            <div
                                className={myCheeseStyles.infoIconWrapper}
                                onClick={saveSelected}
                            >
                                <img
                                    className={myCheeseStyles.infoIcon}
                                    src="/myCheese/save.png"
                                />
                                <span>저장</span>
                            </div>
                            <div
                                className={myCheeseStyles.infoIconWrapper}
                                onClick={deleteSelected}
                            >
                                <img
                                    className={myCheeseStyles.infoIcon}
                                    src="/myCheese/delete.png"
                                />
                                <span>삭제</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
