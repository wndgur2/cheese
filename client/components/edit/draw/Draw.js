"use client";

import ImageText from "@/components/ImageText";
import Palette from "@/components/Palette";
import Range from "@/components/Range";
import { useEffect, useState } from "react";
import drawStyles from "./draw.module.css";
import editStyles from "../edit.module.css";
import { Page } from "@/app/edit/edit.module";

export default function Draw({ page }) {
    const MAX_BRUSH_SIZE = 500;
    const states = ["pen", "eraser"];
    // const states = ["pen", "eraser", "bucket"];
    const [state, setState] = useState(states[0]);
    const [brushSize, setBrushSize] = useState(12);
    const [color, setColor] = useState("#000000");

    useEffect(() => {
        if (page) Page.setTouchLayer(page, state);
    }, [page, state]);

    useEffect(() => {
        Page.setBrushSize((brushSize / 100) * MAX_BRUSH_SIZE);
    }, [brushSize]);

    useEffect(() => {
        Page.setBrushColor(color);
    }, [color]);

    return (
        <div>
            <div className={editStyles.editWrapper}>
                <div style={{ width: "80%" }}>
                    <Range
                        color={color}
                        disabled={state == "bucket"}
                        value={brushSize}
                        setValue={setBrushSize}
                    >
                        px
                    </Range>
                </div>
                <Palette
                    color={color}
                    setColor={setColor}
                    disabled={state == "eraser"}
                />
                <br />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    height: "30%",
                    margin: "0px 4vh",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "1vh",
                    }}
                >
                    {states.map((page_, i) => (
                        <div
                            key={i}
                            className={drawStyles.navWrapper}
                            id={state == page_ ? `${drawStyles.selected}` : ""}
                            onClick={() => {
                                setState(page_);
                            }}
                        >
                            <ImageText
                                src={`/edit/draw/${page_}.png`}
                                width={28}
                            ></ImageText>
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <br />
            <br />
        </div>
    );
}
