"use client";

import Palette from "@/components/Palette";
import { useEffect, useRef, useState } from "react";
import textStyles from "./text.module.css";
import editStyles from "../edit.module.css";
import {
    Noto_Sans_KR,
    Roboto,
    Nanum_Myeongjo,
    Nanum_Gothic,
    Gowun_Batang,
} from "next/font/google";
import { Page } from "@/app/edit/edit.module";
import Range from "@/components/Range";

const noto_Sans_KR = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});
const nanum_Myeongjo = Nanum_Myeongjo({
    subsets: ["latin"],
    weight: ["400", "700"],
});
const nanum_Gothic = Nanum_Gothic({
    subsets: ["latin"],
    weight: ["400", "700"],
});
const gowun_Batang = Gowun_Batang({
    subsets: ["latin"],
    weight: ["400", "700"],
});

// className={noto_Sans_KR.className}

export default function Text({ page }) {
    const fontsElement = useRef();
    const [color, setColor] = useState("#000000");
    const fonts = [
        {
            name: "나눔고딕",
            class: nanum_Gothic,
        },
        {
            name: "나눔명조",
            class: nanum_Myeongjo,
        },
        {
            name: "Noto_Sans",
            class: noto_Sans_KR,
        },
        {
            name: "Roboto",
            class: roboto,
        },
        {
            name: "Batang",
            class: gowun_Batang,
        },
    ];
    const [text, setText] = useState("");
    const [bold, setBold] = useState(false);
    const [strike, setStrike] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [font, setFont] = useState(fonts[0]);

    const [fontSize, setFontSize] = useState(50);

    const handleFontClick = (font) => {
        setFont(font);
    };

    const setTextBold = () => {
        setBold(!bold);
    };
    const setTextStrike = () => {
        if (!strike && underline) setUnderline(!underline);
        setStrike(!strike);
    };
    const setTextUnderline = () => {
        if (!underline && strike) setStrike(!strike);
        setUnderline(!underline);
    };

    useEffect(() => {}, []);

    useEffect(() => {
        if (page) Page.setTouchLayer(page, "text");
    }, [page]);

    return (
        <div>
            <div className={editStyles.editWrapper}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <div style={{ width: "50%" }}>
                        <Range
                            min={30}
                            fixThumbSize={true}
                            value={fontSize}
                            setValue={setFontSize}
                        />
                    </div>
                    <div className={textStyles.fontsWrapper}>
                        <div className={textStyles.fonts} ref={fontsElement}>
                            {fonts.map((fontObject, key) => (
                                <div
                                    key={key}
                                    onClick={() => {
                                        handleFontClick(fontObject);
                                    }} // onscroll, target scrollTop / offsetheight = i
                                    className={`${textStyles.fontWrapper} ${fontObject.class.className}`}
                                >
                                    <p
                                        className={
                                            font.name == fontObject.name
                                                ? textStyles.selected
                                                : ""
                                        }
                                        style={{
                                            margin: 0,
                                            width: "100%",
                                        }}
                                    >
                                        {fontObject.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        height: "6vh",
                        padding: "0 2vh",
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "1vh",
                    }}
                >
                    <input
                        type="text"
                        className={`${textStyles.textInput} ${
                            font.class.className
                        } ${bold ? textStyles.bold : ""} ${
                            strike ? textStyles.strike : ""
                        } ${underline ? textStyles.underline : ""}`}
                        placeholder="텍스트를 입력하세요."
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                    />
                    <img
                        onClick={setTextBold}
                        src="/edit/text/B.png"
                        width={26}
                        height={26}
                    />
                    <img
                        onClick={() => {
                            page.addText(
                                text,
                                bold,
                                strike,
                                underline,
                                font,
                                color,
                                fontSize + 30
                            );
                        }}
                        src="/edit/text/+.png"
                        width={24}
                        height={24}
                    />
                </div>
                <Palette color={color} setColor={setColor} />
            </div>
            <br />
        </div>
    );
}
