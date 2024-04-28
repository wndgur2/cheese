import ImageText from "@/components/ImageText";
import LongBtn from "@/components/LongBtn";
import editStyles from "../edit.module.css";
import axios from "axios";
import { useState } from "react";
import { Page } from "@/app/edit/edit.module";

export default function Ai({ page, setLoading }) {
    const [extracting, setExtracting] = useState(false);
    const [objectEditting, setObjectEditting] = useState(false);

    async function retouchAll() {
        if (!page) return;
        if (!confirm("전체 보정을 적용하시겠습니까?")) return;

        retouchBody();
        retouchSkin();
        autoFilter();
    }

    function confirmRetouchSkin() {
        if (!page) return;
        if (confirm("피부를 보정할까요?")) {
            retouchSkin();
        }
    }

    async function retouchSkin() {
        const data = new FormData();
        let blob = await fetch(page.src).then((r) => r.blob());
        data.append("file", blob);
        setLoading(true);
        try {
            const res = await axios.post(
                `http://${process.env.NEXT_PUBLIC_AI_API}/ai/skin_smoothing`,
                data,
                {
                    responseType: "blob",
                }
            );
            page.setImage(URL.createObjectURL(res.data));
            page.src = URL.createObjectURL(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function confirmRetouchBody() {
        if (!page) return;
        if (confirm("체형을 보정할까요?")) {
            retouchBody();
        }
    }

    async function retouchBody() {
        if (!page) return;
        const data = new FormData();
        let blob = await fetch(page.src).then((r) => r.blob());
        data.append("file", blob);
        setLoading(true);
        try {
            const res = await axios.post(
                `http://${process.env.NEXT_PUBLIC_AI_API}/ai/body_reshape`,
                data,
                {
                    responseType: "blob",
                }
            );
            page.setImage(URL.createObjectURL(res.data));
            page.src = URL.createObjectURL(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function confirmAutoFilter() {
        if (!page) return;
        if (confirm("색감을 보정할까요?")) {
            autoFilter();
        }
    }

    async function autoFilter() {
        if (!page) return;
        const data = new FormData();
        let blob = await fetch(page.src).then((r) => r.blob());
        data.append("file", blob);
        setLoading(true);
        try {
            const res = await axios.post(
                `http://${process.env.NEXT_PUBLIC_AI_API}/ai/color_filter`,
                data,
                {
                    responseType: "blob",
                }
            );
            page.setImage(URL.createObjectURL(res.data));
            page.src = URL.createObjectURL(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function chooseExtractionMethod() {
        if (!page) return;
        setExtracting(true);
    }

    async function getFilteredImage(isValueExtraction) {
        // select an image from device
        if (!page) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (isValueExtraction) extractValue(e.target.result);
                else extractMood(e.target.result);
            };
            reader.readAsDataURL(file);
        };
    }

    async function extractMood(filtered_src) {
        // replace image
        const data = new FormData();
        let original_image = await fetch(page.src).then((r) => r.blob());
        data.append("original_image", original_image);

        // blob2
        let filtered_image = await fetch(filtered_src).then((r) => r.blob());
        data.append("filtered_image", filtered_image);

        try {
            const res = await axios.post(
                `http://${process.env.NEXT_PUBLIC_AI_API}/ai/filter_generate`,
                data,
                {
                    responseType: "blob",
                }
            );
            if (confirm("추출한 필터를 적용하시겠습니까?")) {
                page.setImage(URL.createObjectURL(res.data));
                page.src = URL.createObjectURL(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function extractValue(filtered_src) {
        // replace image
        const data = new FormData();
        let original_image = await fetch(page.src).then((r) => r.blob());
        data.append("original_image", original_image);

        // blob2
        let filtered_image = await fetch(filtered_src).then((r) => r.blob());
        data.append("filtered_image", filtered_image);

        try {
            const res = await axios.post(
                `http://${process.env.NEXT_PUBLIC_AI_API}/ai/filter_generate_with_value`,
                data
            );

            const filter_ = {
                brightness: 100 + res.data.brightness * 2,
                saturate: 100 + res.data.chroma * 2,
                contrast: 100,
                grayscale: 0,
                blur: 0,
            };
            page.setFilter(filter_);
            // if(confirm("추출한 필터를 적용하시겠습니까?")){
            //   page.setImage(URL.createObjectURL(res.data));
            //   page.src = URL.createObjectURL(res.data);
            // }
        } catch (err) {
            console.log(err);
        }
    }

    function startObjectEdit() {
        if (!page) return;
        setObjectEditting(true);
        Page.setTouchLayer(page, "object", setObjectEditting, setLoading);
    }

    function cancelObjectEdit() {
        setObjectEditting(false);
        Page.disableTouchLayer();
    }

    return (
        <div
            style={{
                paddingTop: "4vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className={editStyles.editWrapper}>
                <span>자동 편집</span>
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        margin: "2.1vh 0px 1vh 0px",
                        justifyContent: "space-around",
                    }}
                >
                    <div onClick={retouchAll}>
                        <ImageText src="/edit/ai/check_all.png" width={40}>
                            전체 보정
                        </ImageText>
                    </div>
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <div onClick={confirmRetouchSkin}>
                            <ImageText src="/edit/ai/face.png" width={40}>
                                피부 보정
                            </ImageText>
                        </div>
                        <div onClick={confirmRetouchBody}>
                            <ImageText src="/edit/ai/body.png" width={40}>
                                체형 보정
                            </ImageText>
                        </div>
                        <div onClick={confirmAutoFilter}>
                            <ImageText src="/edit/ai/filter.png" width={32}>
                                색감 보정
                            </ImageText>
                        </div>
                    </div>
                </div>
            </div>
            {objectEditting ? (
                <LongBtn onclick={cancelObjectEdit}>
                    <img src="/edit/ai/object.png" width={32} />
                    <span
                        style={{
                            fontSize: 16,
                            color: "#212121",
                            fontWeight: 500,
                        }}
                    >
                        삭제할 피사체를 터치하세요.
                    </span>
                </LongBtn>
            ) : (
                <LongBtn onclick={startObjectEdit}>
                    <img src="/edit/ai/object.png" width={32} />
                    <span
                        style={{
                            fontSize: 16,
                            color: "#212121",
                            fontWeight: 500,
                        }}
                    >
                        피사체 삭제하기
                    </span>
                </LongBtn>
            )}
            <LongBtn onclick={chooseExtractionMethod}>
                <img src="/edit/ai/extract_filter.png" width={32} />
                <span
                    style={{
                        fontSize: 16,
                        color: "#212121",
                        fontWeight: 500,
                    }}
                >
                    다른 사진에서 필터 추출해오기
                </span>
            </LongBtn>
            {extracting && (
                <div>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 50,
                            width: "100%",
                            height: "100vh",
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => {
                            setExtracting(false);
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            zIndex: 50,

                            display: "flex",
                            width: "52vh",
                            height: "24vh",
                            justifyContent: "space-around",
                            alignItems: "center",

                            borderRadius: "5vw",
                            transform: "translate(-50%, -50%)",
                            boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.08)",
                            backgroundColor: "#F9F7F6",
                        }}
                    >
                        <button
                            className={editStyles.extractBtn}
                            onClick={() => {
                                getFilteredImage(true);
                                setExtracting(false);
                            }}
                        >
                            <img src="/edit/ai/filter.png" width={36} />
                            기본 추출
                        </button>
                        <button
                            className={editStyles.extractBtn}
                            onClick={() => {
                                getFilteredImage(false);
                                setExtracting(false);
                            }}
                        >
                            <img src="/edit/ai/extract_filter.png" width={36} />
                            분위기 추출
                        </button>
                    </div>
                </div>
            )}
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}
