"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import captureStyles from "./capture.module.css";
import apStyles from "../ap.module.css";
import Branch from "@/entity/Branch";

export default function Amount() {
    const router = useRouter();
    /**
     * @type {[Branch, Function]}
     */
    const [branch, setBranch] = useState();
    const [amount, setAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let branch_ = JSON.parse(localStorage.getItem("branch"));
        if (!branch_) {
            router.replace("/home/cheeseMap");
        }

        setBranch(branch_);
    }, []);

    const handleInputChange = (e) => {
        let newErrorMessage = "";
        const inputVal = e.target.value;
        if (Number.parseInt(inputVal) > 10) {
            newErrorMessage = "10장 이하만 가능해요.";
        } else if (Number.parseInt(inputVal) < 1) {
            newErrorMessage = "1장 이상만 가능해요.";
        }
        setErrorMessage(newErrorMessage);
        if (newErrorMessage) return;
        setAmount(inputVal);
    };

    const handleCapture = () => {
        localStorage.setItem("amount", Number.parseInt(amount).toString());
        router.push("/capture");
    };

    return (
        <div>
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

            <span className="title">{branch?.name}</span>
            <span className="subtitle">에서</span>

            <div className={captureStyles.inputAmount}>
                <input
                    id={captureStyles.captureAmount}
                    type="number"
                    value={amount}
                    min={0}
                    maxLength={"2"}
                    pattern="[0-9]*"
                    onChange={handleInputChange}
                    placeholder="0"
                    onAbortCapture={() => {
                        console.log("abortCapture");
                    }}
                    onAbort={() => {
                        console.log("abort");
                    }}
                />
                <span className={captureStyles.inputInfo}>장 촬영할게요.</span>
            </div>
            <p className="error" style={{ margin: "4vh 0vw 3vh 0vw" }}>
                {errorMessage}
            </p>

            {amount > 0 ? (
                <div className="next" onClick={handleCapture}>
                    <span
                        style={{
                            fontSize: 22,
                            fontWeight: 500,
                            letterSpacing: 1.4,
                            paddingRight: 20,
                            textAlign: "right",
                            width: "100%",
                        }}
                    >
                        {amount * branch.shooting_cost}원 결제하기
                    </span>
                </div>
            ) : (
                <div className={`next ${apStyles.disabled}`}>
                    <span
                        style={{
                            fontSize: 19,
                            fontWeight: 400,
                            letterSpacing: 0.2,
                            textAlign: "center",
                            width: "100%",
                            color: "#666",
                        }}
                    >
                        장 수를 입력해주세요
                    </span>
                </div>
            )}
        </div>
    );
}
