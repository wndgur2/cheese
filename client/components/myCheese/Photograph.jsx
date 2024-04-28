"use client";
import { useEffect, useState } from "react";
import myCheeseStyles from "../../app/home/myCheese/myCheese.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";
import dataURItoBlob from "@/disabled_apis/dataUriToBlob";
import savePhotosOnDevice from "@/disabled_apis/savePhotosOnDevice";
import deletePhotos from "@/disabled_apis/deletePhotos";
import { useRouter } from "next/navigation";

export default function Photograph({
    photographs,
    branches,
    userData,
    setUserData,
}) {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/home/signin?callbackUrl=/home/myCheese");
        },
    });

    const [selected, setSelected] = useState([]);
    const [isAllSameBranch, setIsAllSameBranch] = useState(true);
    const [isAllSameDate, setIsAllSameDate] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!selected.length) return;
        setIsAllSameBranch(true);
        setIsAllSameDate(true);
        const currentBranchId = photographs[selected[0]].branchId;
        const currentDate = new Date(photographs[selected[0]].createdAt)
            .toUTCString()
            .split(" ")
            .slice(0, 4)
            .join(" ");
        for (let i = 1; i < selected.length; i++) {
            if (photographs[selected[i]].branchId != currentBranchId) {
                setIsAllSameBranch(false);
            }
            if (
                new Date(photographs[selected[i]].createdAt)
                    .toUTCString()
                    .split(" ")
                    .slice(0, 4)
                    .join(" ") != currentDate
            ) {
                setIsAllSameDate(false);
            }
        }
    }, [selected]);

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
        const photos = selected.map(
            (i) => "data:image/png;base64," + photographs[i].photoImage
        );
        savePhotosOnDevice(photos);
    };

    const shareSelected = () => {
        // branch 같은지 검사
        const currentBranchId = photographs[selected[0]].branchId;
        for (let i = 0; i < selected.length; i++) {
            if (photographs[selected[i]].branchId != currentBranchId) {
                alert("같은 장소의 사진만 함께 공유할 수 있어요.");
                return;
            }
        }

        if (!confirm("선택한 사진을 공유할까요?")) return;
        // 서버에 share post 요청
        const url = `http://${process.env.NEXT_PUBLIC_API}/share/${session.data.user.id}`;
        const data = new FormData();
        selected.forEach((i) => {
            data.append(
                "photo",
                dataURItoBlob(
                    "data:image/png;base64," + photographs[i].photoImage
                )
            );
            // data.append("photo", photographs.length[i]);
        });
        axios
            .post(url, data, {
                headers: {
                    authorization: session.data.user.authorization,
                    "refresh-token": session.data.user["refresh-token"],
                },
            })
            .then((res) => {
                alert("사진을 공유했어요.");
            })
            .catch((err) => {
                alert("사진 공유 오류. 재로그인이 필요합니다.");
            });
    };

    const editSelected = () => {
        let photos = selected.map(
            (i) => "data:image/png;base64," + photographs[i].photoImage
        );
        localStorage.setItem("photos", JSON.stringify(photos));
        router.push("/edit?photos=true");
    };

    const deleteSelected = () => {
        if (!confirm("선택한 사진을 삭제할까요?")) return;

        selected.map((i) => {
            deletePhotos(photographs[i].photographId, session);
        });
        let newPhotographs = photographs.filter(
            (v, i) => !selected.includes(i)
        );
        setUserData({ ...userData, photographs: newPhotographs });
        alert(`사진 ${selected.length}장을 삭제했어요.`);
        setSelected([]);
    };

    const renderRow = (i) => {
        if (!photographs[i]) return <></>;
        let result = [];
        result.push(
            <td
                align="center"
                key={i}
                onClick={() => {
                    handleImageClick(i);
                }}
            >
                <div
                    className={`${myCheeseStyles.imageWrapper} ${
                        selected.includes(i) ? myCheeseStyles.selected : ""
                    }`}
                >
                    <img
                        className={`${myCheeseStyles.image}`}
                        src={
                            "data:image/png;base64," + photographs[i].photoImage
                        }
                    />
                </div>
            </td>
        );
        return result;
    };

    const renderImages = () => {
        const result = [];
        for (let i = 0; i < photographs.length; i += 2) {
            result.push(
                <tr
                    key={i}
                    // className={myCheeseStyles.tr}
                >
                    {renderRow(i)}
                    {renderRow(i + 1)}
                </tr>
            );
        }
        return result;
    };

    return (
        <div id={myCheeseStyles.photoWrapper}>
            <table className={myCheeseStyles.table} cellSpacing={"10"}>
                <tbody>
                    {photographs ? (
                        renderImages()
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
                                    아직 촬영한 사진이 없어요
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
                                                photographs[selected[0]]
                                                    .branchId
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
                                    {new Date(
                                        photographs[selected[0]].createdAt
                                    )
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
                            justifyContent: "space-between",
                            height: "5vh",
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
                        {isAllSameBranch && (
                            <div
                                className={myCheeseStyles.infoIconWrapper}
                                onClick={shareSelected}
                            >
                                <img
                                    className={myCheeseStyles.infoIcon}
                                    src="/myCheese/share.png"
                                />
                                <span>공유</span>
                            </div>
                        )}
                        <div
                            className={myCheeseStyles.infoIconWrapper}
                            onClick={editSelected}
                        >
                            <img
                                className={myCheeseStyles.infoIcon}
                                src="/myCheese/edit.png"
                            />
                            <span>편집</span>
                        </div>
                        <div className={myCheeseStyles.infoIconWrapper}>
                            <img
                                className={myCheeseStyles.infoIcon}
                                src="/myCheese/print.png"
                            />
                            <span>인화</span>
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
            ) : (
                <></>
            )}
        </div>
    );
}
