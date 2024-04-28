"use client";

import NavBtn from "@/components/NavBtn";
import editStyles from "../../components/edit/edit.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Trim from "../../components/edit/trim/Trim";
import Ai from "../../components/edit/ai/Ai";
import Sticker from "../../components/edit/sticker/Sticker";
import Frame from "../../components/edit/frame/Frame";
import Draw from "../../components/edit/draw/Draw";
import Filter from "../../components/edit/filter/Filter";
import Adjust from "../../components/edit/adjust/Adjust";
import Text from "../../components/edit/text/Text";
import { Page } from "./edit.module";

import JSZip from "jszip";
import Script from "next/script";
import savePhotosIdx from "@/api/savePhotosIdx";
import loadPhotosIdx from "@/api/loadPhotosIdx";

export default function Edit({ searchParams }) {
    const router = useRouter();
    const [nav, setNav] = useState("Ai");
    const [scrollTop, setScrollTop] = useState(0);
    const [hideNavbar, setHideNavbar] = useState(false);
    const [pageIndex, setPageIndex] = useState(-1);
    const [pages, setPages] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fullscreen = useRef();
    const addButton = useRef();

    const navs = [
        ["Ai", "AI"],
        ["Trim", "다듬기"],
        ["Draw", "그리기"],
        ["Frame", "프레임"],
        ["Sticker", "스티커"],
        ["Text", "텍스트"],
        ["Filter", "필터"],
        ["Adjust", "조정"],
    ];

    const renderChild = () => {
        switch (nav) {
            case "Ai":
                return <Ai page={pages[pageIndex]} setLoading={setLoading} />;
            case "Trim":
                return <Trim page={pages[pageIndex]} />;
            case "Draw":
                return <Draw page={pages[pageIndex]} />;
            case "Frame":
                return <Frame page={pages[pageIndex]} />;
            case "Sticker":
                return <Sticker page={pages[pageIndex]} />;
            case "Text":
                return <Text page={pages[pageIndex]} />;
            case "Filter":
                return <Filter page={pages[pageIndex]} />;
            case "Adjust":
                return <Adjust page={pages[pageIndex]} />;
            default:
                break;
        }
    };

    function loadCaptures(captures) {
        let newPages = [];
        for (let photo of captures) newPages.push(new Page(photo));
        setPages([...newPages]);
    }

    async function getResultImages() {
        let files = [];
        const promises = pages.map(async (p) => {
            const url = await fetch(p.save()).then((response) => response.url);
            files.push(url);
        });
        await Promise.all(promises);
        return files;
    }

    async function getResultBlobs() {
        let files = [];
        const promises = pages.map(async (p) => {
            const imageBlob = await fetch(p.save()).then((response) =>
                response.blob()
            );
            files.push(new File([imageBlob], "filename.jpg"));
        });
        await Promise.all(promises);
        return files;
    }

    async function printResults() {
        const images = await getResultImages();
        savePhotosIdx(images, () => {
            router.push("/accessProcess/print/print?photos=true");
        });
    }

    const save = async () => {
        console.log("Save");
        const zip = new JSZip();
        const files = await getResultBlobs();
        console.log(files);
        files.forEach((file, i) => {
            zip.file("photo" + i + ".png", file, { base64: true });
        });
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "Cheese.zip");
        });
    };

    // event handlers
    const handleBodyScroll = (curTop) => {
        if (curTop > scrollTop) setHideNavbar(true);
        else setHideNavbar(false);
        setScrollTop(curTop);
    };

    const handleFileChange = (files) => {
        // 이미지들로 각 page를 생성
        let newPages = [...pages];
        for (let file of files) {
            const reader = new FileReader();

            reader.onload = (e) => {
                newPages.push(new Page(e.target.result));
            };
            reader.onloadend = () => {
                setPages([...newPages]);
            };

            reader.readAsDataURL(file);
        }
    };

    const handlePageCopy = () => {
        let newPages = [...pages];
        newPages.push(pages[pageIndex].copy());
        setPages([...newPages]);
    };

    const handlePageDelete = () => {
        let newPages = [...pages];
        newPages[pageIndex].delete();

        if (pages.length == 1) setPageIndex(-1);
        else if (pages.length - 1 > pageIndex) pages[pageIndex + 1].show();
        else if (pages.length >= 2) setPageIndex(pageIndex - 1);

        newPages = newPages.filter((v, i) => i != pageIndex);
        setPages([...newPages]);
    };

    const handlePageClick = (i) => {
        pages[pageIndex]?.hide();
        setPageIndex(i);
    };

    // useEffects
    useEffect(() => {
        window.onbeforeunload = (e) => {
            // 이것만 하고 자동 저장
            e.preventDefault();
            return true;
        };
        Page.init();
        if (searchParams.photos == "true") loadPhotosIdx(loadCaptures);
        else addButton.current.click();

        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        switch (nav) {
            case "Trim":
                Page.disableTouchLayer();
                break;
            case "Draw":
                Page.setTouchLayer(pages[pageIndex], "pen");
                break;
            case "Sticker":
                Page.setTouchLayer(pages[pageIndex], "sticker");
                break;
            case "Text":
                Page.setTouchLayer(pages[pageIndex], "text");
                break;
            default:
                Page.setTouchLayer(pages[pageIndex], "");
                break;
        }
    }, [nav]);

    useEffect(() => {
        if (pageIndex < 0) return;
        pages[pageIndex].show();
    }, [pageIndex]);

    useEffect(() => {
        if (pageIndex == -1) {
            if (pages.length > 0) {
                setPageIndex(0);
            }
        }
        return () => {
            //save pages in localstorage
        };
    }, [pages]);

    return (
        <div ref={fullscreen}>
            <Script src="http://cdn.jsdelivr.net/g/filesaver.js" />
            <div className={editStyles.topContainer}>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <img
                        id={editStyles.add}
                        src="/edit/add.png"
                        onClick={() => {
                            addButton.current.click();
                        }}
                    />
                    <div id={editStyles.album}>
                        <input
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            ref={addButton}
                            onChange={(e) => {
                                handleFileChange(e.target.files);
                                e.target.value = "";
                            }}
                            accept="image/png, image/jpeg"
                        />

                        {pages.map((page, i) => {
                            return i == pageIndex ? (
                                <div id={editStyles.curWrapper} key={i}>
                                    <img
                                        id={editStyles.curPage}
                                        src={page.src}
                                    />
                                    <div id={editStyles.pageControlWrapper}>
                                        <div id={editStyles.pageControl}>
                                            <img
                                                className={editStyles.control}
                                                src="/edit/copy.png"
                                                onClick={() => {
                                                    handlePageCopy();
                                                }}
                                            />
                                            <img
                                                className={editStyles.control}
                                                src="/edit/delete.png"
                                                onClick={() => {
                                                    handlePageDelete();
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    className={editStyles.page}
                                    key={i}
                                    src={page.src}
                                    onClick={() => {
                                        handlePageClick(i);
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div
                        className="alignCenter"
                        onClick={(e) => {
                            if (
                                confirm(
                                    "편집 내용이 사라져요. 정말 나가시겠습니까?"
                                )
                            )
                                router.push("/home");
                        }}
                    >
                        <img src="/edit/exit.png" width={60} />
                    </div>
                </div>
                <div className={editStyles.preview} id="preview" />
                <div>
                    <div className="alignCenter" id={editStyles.functionBar}>
                        <div className="alignCenter" style={{ gap: 10 }}>
                            <div
                                className="alignCenter"
                                onClick={() => {
                                    if (isFullscreen) {
                                        document.exitFullscreen();
                                        setIsFullscreen(false);
                                    } else {
                                        fullscreen.current.requestFullscreen();
                                        setIsFullscreen(true);
                                    }
                                }}
                                style={{
                                    backgroundColor: "#fefbf6",
                                    borderRadius: "30px",
                                    boxShadow:
                                        "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
                                    height: "48px",
                                    padding: "0.5vh 1vh",
                                }}
                            >
                                <span style={{ fontSize: "2vh" }}>
                                    전체화면
                                </span>
                                {/* <img src="/edit/reset.png" width={60} onClick={()=>{fullscreen.current.requestFullscreen();}}/> */}
                            </div>
                        </div>
                        <div className="alignCenter" style={{ gap: 10 }}>
                            <div className="alignCenter" onClick={printResults}>
                                <img src="/edit/print.png" width={60} />
                                <a id="link"></a>
                            </div>
                            <div className="alignCenter" onClick={save}>
                                <img src="/edit/save.png" width={60} />
                                <a id="link"></a>
                            </div>
                        </div>
                    </div>
                    <div
                        className={editStyles.editBody}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflowY: "scroll",
                        }}
                        onScroll={(e) => {
                            handleBodyScroll(e.target.scrollTop);
                        }}
                    >
                        {loading ? (
                            <div>
                                <div
                                    className="loader"
                                    style={{
                                        position: "relative",
                                        height: "0vh",
                                    }}
                                >
                                    <img src="/cheese_512.png" width={"30vh"} />
                                </div>
                                <p
                                    style={{
                                        width: "100%",
                                        textAlign: "center",
                                        marginTop: "30vh",
                                    }}
                                >
                                    처리중이에요
                                </p>
                            </div>
                        ) : (
                            renderChild()
                        )}
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
            <div
                id={editStyles.navBar}
                style={{
                    bottom: hideNavbar ? "-64px" : "0px",
                }}
            >
                {navs.map((name, i) => {
                    return (
                        <div
                            key={i}
                            onClick={() => {
                                setNav(name[0]);
                            }}
                        >
                            <NavBtn
                                src={`/edit/${
                                    nav == name[0]
                                        ? name[0] + "_accent"
                                        : name[0]
                                }.png`}
                                width="24"
                                active={nav == name[0]}
                                accentColor="#2A2A2A"
                                accentFontColor={
                                    nav == name[0] ? "#FFD56A" : ""
                                }
                            >
                                {name[1]}
                            </NavBtn>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
