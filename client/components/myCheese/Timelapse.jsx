"use client";
import { useState } from "react";
import myCheeseStyles from "../../app/home/myCheese/myCheese.module.css";
import deleteTimelapse from "@/disabled_apis/deleteTimelapse";
import { useSession } from "next-auth/react";
import saveTimelapseOnDevice from "@/disabled_apis/saveTimelapsesOnDevice";

export default function Timelapse({ timelapses, setUserData, userData }) {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/home/signin?callbackUrl=/home/myCheese");
        },
    });
    const [selected, setSelected] = useState([]);
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
        const data = selected.map(
            (i) => "data:video/mpeg;base64," + timelapses[i].video
        );
        saveTimelapseOnDevice(data);
    };

    const deleteSelected = () => {
        if (!confirm("선택한 영상을 삭제할까요?")) return;

        selected.map((i) => {
            deleteTimelapse(timelapses[i].timelapseId, session);
        });
        let newTimelapses = timelapses.filter((v, i) => !selected.includes(i));
        setUserData({ ...userData, timelapses: newTimelapses });
        alert(`영상 ${selected.length}개를 삭제했어요.`);
        setSelected([]);
    };

    const renderRow = (i) => {
        if (!timelapses[i]) return <></>;
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
                    <video
                        className={`${myCheeseStyles.image}`}
                        loop={true}
                        onClick={(e) => {
                            e.target.paused
                                ? e.target.play()
                                : e.target.pause();
                        }}
                    >
                        <source
                            src={
                                "data:video/mpeg;base64," +
                                timelapses[i].video +
                                "#t=0.3"
                            }
                            type="video/webm"
                        />
                    </video>
                </div>
            </td>
        );
        return result;
    };

    const renderImages = () => {
        const result = [];
        for (let i = 0; i < timelapses.length; i += 2) {
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
        <div>
            <table className={myCheeseStyles.table} cellSpacing={"10"}>
                <tbody>
                    {timelapses ? (
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
                                    아직 촬영된 영상이 없어요
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
