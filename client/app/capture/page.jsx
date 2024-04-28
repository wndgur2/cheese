"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import captureStyles from "./capture.module.css";
import queueStyle from "../home/queue.module.css";
import TextBtn from "@/components/TextBtn";
import axios from "axios";
import savePhotosOnDevice from "@/disabled_apis/savePhotosOnDevice";
import savePhotosOnCloud from "@/disabled_apis/savePhotosOnCloud";
import sharePhotos from "@/disabled_apis/sharePhotos";
import saveTimelapseOnCloud from "@/disabled_apis/saveTimelapseOnCloud";
import savePhotosIdx from "@/disabled_apis/savePhotosIdx";

function getPose(imageUrl, setPose) {
    try {
        const data = new FormData();
        fetch(imageUrl)
            .then((r) => r.blob())
            .then((blob) => {
                data.append("image", blob);
                axios
                    .post(
                        `http://${process.env.NEXT_PUBLIC_AI_API}/ai/pose_estimation`,
                        data,
                        {
                            responseType: "blob",
                        }
                    )
                    .then((res) => {
                        let url = URL.createObjectURL(res.data);
                        setPose(url);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    } catch (err) {
        console.log(err);
    }
}

function getQueue(roomN, uuid, setQueueLength, socket, setQueueRequests) {
    console.log("GET QUEUE.;");
    axios
        .get(`http://${process.env.NEXT_PUBLIC_API}/cameraQueue/${roomN}`, {
            params: { device: uuid },
        })
        .then((res) => {
            let len = res.data.data["length_queue"];
            setQueueLength(len);
            if (len > 0) setQueueRequests((reqs) => reqs + 1);
            else {
                socket.send(
                    JSON.stringify({
                        from: uuid,
                        type: "camera_join",
                        data: roomN,
                    })
                );
                console.log("JOIN MESSAGE SENT");
            }
            return len;
        })
        .catch((err) => {
            console.log(err);
        });
}

export default function Capture() {
    const session = useSession({ required: false });

    const [amount, setAmount] = useState(0);
    const [capturedAmount, setCapturedAmount] = useState(0);
    const [timer, setTimer] = useState(60);
    const [mediaRecorderR, setMediaRecorderR] = useState(null);
    const [capturesR, setCapturesR] = useState([]);
    const [pose, setPose] = useState(null);
    const [socketR, setSocketR] = useState(null);
    const [isStart, setIsStart] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [startRecord, setStartRecord] = useState(false);
    const [queueLength, setQueueLength] = useState(1);
    const [queueRequests, setQueueRequests] = useState(0);
    const [blobs_recorded, setBlobs_recorded] = useState([]);

    const remoteVideoRef = useRef();
    const shutter = useRef();
    const fullscreen = useRef();
    const router = useRouter();

    // streaming variables
    let mediaRecorder, socket, roomN, myPeerConnection, uuid, tId;

    // WebRTC STUN servers
    const peerConnectionConfig = {
        iceServers: [
            { urls: "stun:stun.stunprotocol.org:3478" },
            { urls: "stun:stun.l.google.com:19302" },
        ],
    };

    // WebRTC media
    const mediaConstraints = { offerToReceiveVideo: true };

    useEffect(() => {
        window.onbeforeunload = function () {
            stop(socket);
        };
        const observer = new PerformanceObserver((list) => {
            let reloaded = 0;
            list.getEntries().forEach((entry) => {
                if (entry.type === "reload" && ++reloaded == 2) router.back();
            });
        });
        observer.observe({ type: "navigation", buffered: true });

        let branch = JSON.parse(localStorage.getItem("branch"));
        if (!branch) router.push("/home/cheeseMap");
        else roomN = branch.id;
        uuid = localStorage.getItem("uuid");
        setAmount(localStorage.getItem("amount"));

        socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API}/signal`);
        setSocketListeners(socket);
        setSocketR(socket);
        getQueue(roomN, uuid, setQueueLength, socket, setQueueRequests);
        return () => {
            stop(socket);
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        if (isStart) return;
        if (queueLength == 0) setIsStart(true);
    }, [queueLength]);

    useEffect(() => {
        if (isStart) return;
        if (queueRequests == 0) return;
        setTimeout(() => {
            getQueue(
                JSON.parse(localStorage.getItem("branch")).id,
                localStorage.getItem("uuid"),
                setQueueLength,
                socketR,
                setQueueRequests
            );
        }, 1000);
    }, [queueRequests]);

    useEffect(() => {
        if (!isStart) return;
        if (amount == 0) return;
        if (capturedAmount >= amount) endCapture();
    }, [capturedAmount]);

    // Started capturing
    useEffect(() => {
        if (!isStart) return;
        if (isEnd) return;
        let fullscreenRequest =
            fullscreen.current.requestFullscreen ||
            fullscreen.current.webkitEnterFullScreen ||
            fullscreen.current.webkitRequestFullscreen ||
            fullscreen.current.msRequestFullscreen ||
            fullscreen.current.mozRequestFullscreen;
        fullscreenRequest
            .call(fullscreen.current)
            .then(() => {
                console.log("fullscreen");
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isStart]);

    useEffect(() => {
        if (!isStart) return;
        if (!startRecord) return;
        if (isEnd) return;
        if (!remoteVideoRef.current.srcObject) return;
        tId = setTimeout(() => {
            setTimer(timer - 1);
        }, 1000);
        mediaRecorder = new MediaRecorder(remoteVideoRef.current.srcObject);
        setMediaRecorderR(mediaRecorder);
        mediaRecorder.ondataavailable = function (event) {
            if (event.data && event.data.size > 0) {
                setBlobs_recorded((blobs) => {
                    let newBlobs = [...blobs];
                    newBlobs.push(event.data);
                    return newBlobs;
                });
            }
        };
        mediaRecorder.start(1000);
    }, [startRecord]);

    useEffect(() => {
        if (!isStart) return;
        if (isEnd) return;
        else if (timer == 0) {
            handleShutterClick();
            setTimer(60);
        } else {
            tId = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            if (startRecord) {
                // capture from video
                var canvas = document.createElement("canvas");
                var video = remoteVideoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas
                    .getContext("2d")
                    .drawImage(
                        video,
                        0,
                        0,
                        video.videoWidth,
                        video.videoHeight
                    );
                const url = canvas.toDataURL("image/jpeg");
                // getPose(url, setPose);
            }
        }
    }, [timer]);

    function capturePhoto() {
        var canvas = document.createElement("canvas");
        var video = remoteVideoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
            .getContext("2d")
            .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const url = canvas.toDataURL("image/jpeg");
        let newCaptures = [...capturesR];
        newCaptures.push(url);
        setCapturesR(newCaptures);
    }

    function shutterEffect() {
        if (!shutter.current) return;
        let audio = new Audio("/capture/shutter1.mp3");
        audio.play();
        shutter.current.style.opacity = 1;
        setTimeout(() => {
            shutter.current.style.opacity = 0;
        }, 300);
    }

    function handleShutterClick() {
        shutterEffect();
        capturePhoto();
        setCapturedAmount(capturedAmount + 1);
        clearTimeout(tId);
        setTimer(60);
    }

    function handleSharePhoto() {
        if (session.status == "unauthenticated") {
            alert("로그인이 필요해요.");
            router.push("/home/signin?callbackUrl=/home/myCheese?save=true");
        } else {
            sharePhotos(capturesR, session);
            alert("사진을 공유했어요.");
            router.push("/home/share");
        }
    }

    function endCapture() {
        const branch = JSON.parse(localStorage.getItem("branch"));
        const roomN = branch.id;
        const cost = branch.shooting_cost * amount;
        setIsEnd(true);
        mediaRecorderR?.stop();
        let blob = new Blob(blobs_recorded, {
            type: "video/webm",
        });

        setCapturesR((cptrs) => {
            savePhotosOnDevice(cptrs, blob);
            savePhotosIdx(cptrs);
            return cptrs;
        });

        if (session.status == "authenticated") {
            console.log("blob: ", blob);
            saveTimelapseOnCloud(roomN, blob, session);
            setCapturesR((cptrs) => {
                savePhotosOnCloud(roomN, cptrs, session);
                return cptrs;
            });

            // post timelapse video to server
            // const videoUrl = process.env.NEXT_PUBLIC_API + `/cloud/${session.data.user.id}/timelapse`;
            // post payment data to server
            const paymentUrl = `http://${process.env.NEXT_PUBLIC_API}/branch/${roomN}/payment`;
            axios
                .post(paymentUrl, null, {
                    headers: {
                        authorization: session.data.user.authorization,
                        "refresh-token": session.data.user["refresh-token"],
                    },
                    params: {
                        customerId: session.data.user.id,
                        cost: cost,
                        amount: capturedAmount,
                        photo_or_print: true,
                    },
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        }
    }

    function createVideoElement() {
        if (remoteVideoRef.current)
            document
                .getElementById("video")
                .removeChild(remoteVideoRef.current);
        let videoElement = document.createElement("video");
        videoElement.setAttribute("autoplay", "");
        videoElement.setAttribute("playsinline", "");
        videoElement.setAttribute("muted", "");
        videoElement.setAttribute("id", captureStyles.stream);
        document.getElementById("video").appendChild(videoElement);
        remoteVideoRef.current = videoElement;
    }

    // 소켓 리스너 정의
    function setSocketListeners(socket) {
        // add an event listener to get to know when a connection is open
        socket.onopen = function () {
            console.log(
                "WebSocket connection opened to Room: #" +
                    roomN +
                    " from " +
                    localStorage.getItem("uuid")
            );
            // send a message to the server to join selected room with Web Socket
            sendToServer({
                from: uuid,
                type: "join_camera_queue",
                data: roomN,
            });
            handlePeerConnection();
        };

        // a listener for the socket being closed event
        socket.onclose = function (message) {
            console.log("Socket has been closed." + message);
        };

        // an event listener to handle socket errors
        socket.onerror = function (message) {
            handleErrorMessage("Error: " + message);
        };

        /**
         * @shlee, 메세지 수정 (백엔드 메세지 참조)
         * sendToServer (보내는 메세지) 형식도 확인
         */
        //webrtc_client
        socket.onmessage = function (msg) {
            let message = JSON.parse(msg.data);
            console.log(message);
            switch (message.type) {
                case "device_camera_offer":
                    console.log("Signal OFFER received");
                    handleOfferMessage(message);
                    break;
                case "device_camera_answer":
                    console.log("Signal ANSWER received");
                    handleAnswerMessage(message);
                    break;
                case "device_camera_ice":
                    console.log("Signal ICE Candidate received");
                    handleNewICECandidateMessage(message);
                    break;
                default:
                    handleErrorMessage(
                        "Wrong type message received from server"
                    );
            }
        };
    }

    // 함수들 정의
    function handleErrorMessage(message) {
        console.error(message);
    }

    // use JSON format to send WebSocket message {from, type, data}
    function sendToServer(msg) {
        try {
            let msgJSON = JSON.stringify(msg);
            if (socket) socket.send(msgJSON);
            else socketR.send(msgJSON);
        } catch (err) {
            console.log(err);
        }
    }

    // create peer connection, get media, start negotiating when second participant appears
    function handlePeerConnection(message) {
        createPeerConnection();
        // getMedia(mediaConstraints);
        // if (message.data === "true") {
        myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
        // }
    }

    function createPeerConnection() {
        myPeerConnection = new RTCPeerConnection(peerConnectionConfig);

        // event handlers for the ICE negotiation process
        myPeerConnection.onicecandidate = handleICECandidateEvent;
        myPeerConnection.ontrack = handleTrackEvent;
    }

    // handle get media error
    function handleGetUserMediaError(error) {
        console.log("navigator.getUserMedia error: ", error);
        switch (error.name) {
            case "NotFoundError":
                alert(
                    "Unable to open your call because no camera and/or microphone were found."
                );
                break;
            case "SecurityError":
            case "PermissionDeniedError":
                // Do nothing; this is the same as the user canceling the call.
                break;
            default:
                alert(
                    "Error opening your camera and/or microphone: " +
                        error.message
                );
                break;
        }
        stop();
    }

    // send ICE candidate to the peer through the server
    function handleICECandidateEvent(event) {
        if (event.candidate) {
            sendToServer({
                from: localStorage.getItem("uuid"),
                type: "camera_ice",
                candidate: event.candidate,
            });
            console.log("ICE Candidate Event: ICE candidate sent");
        }
    }

    function handleTrackEvent(event) {
        console.log("Track Event: set stream to remote video element");
        if (remoteVideoRef.current) {
            console.log("EVENT STREAMS: ", event.streams);
            remoteVideoRef.current.srcObject = event.streams[0];
            setStartRecord(true);
        }
    }

    // WebRTC called handler to begin ICE negotiation
    // 1. create a WebRTC offer
    // 2. set local media description
    // 3. send the description as an offer on media format, resolution, etc
    function handleNegotiationNeededEvent() {
        myPeerConnection
            .createOffer(mediaConstraints)
            .then(function (offer) {
                return myPeerConnection.setLocalDescription(offer);
            })
            .then(function () {
                sendToServer({
                    from: localStorage.getItem("uuid"),
                    type: "camera_offer",
                    sdp: myPeerConnection.localDescription,
                });
                console.log("Negotiation Needed Event: SDP offer sent");
            })
            .catch(function (reason) {
                // an error occurred, so handle the failure to connect
                handleErrorMessage("failure to connect error: ", reason);
            });
    }

    function handleOfferMessage(message) {
        console.log("Accepting Offer Message");
        let desc = new RTCSessionDescription(message.sdp);
        myPeerConnection
            .setRemoteDescription(desc)
            .then(function () {
                return myPeerConnection.createAnswer();
            })
            .then(function (answer) {
                return myPeerConnection.setLocalDescription(answer);
            })
            .then(function () {
                console.log("Sending answer packet back to other peer");
                sendToServer({
                    from: localStorage.getItem("uuid"),
                    type: "camera_answer",
                    sdp: myPeerConnection.localDescription,
                });
            })
            .catch(handleGetUserMediaError)
            .catch(handleErrorMessage);
    }

    function handleAnswerMessage(message) {
        console.log("The peer has accepted request");

        // Configure the remote description, which is the SDP payload
        // in our "video-answer" message.
        // myPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp)).catch(handleErrorMessage);
        myPeerConnection
            .setRemoteDescription(message.sdp)
            .catch(handleErrorMessage);
    }

    function handleNewICECandidateMessage(message) {
        let candidate = new RTCIceCandidate(message.candidate);
        console.log(
            "Adding received ICE candidate: " + JSON.stringify(candidate)
        );
        myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
    }

    function stop() {
        // send a message to the server to remove this client from the room clients list
        console.log("Send 'leave' message to server");
        sendToServer(
            {
                from: localStorage.getItem("uuid"),
                type: "leave",
                data: roomN,
            },
            socket
        );

        if (myPeerConnection) {
            console.log("Close the RTCPeerConnection");

            // disconnect all our event listeners
            myPeerConnection.onicecandidate = null;
            myPeerConnection.ontrack = null;
            myPeerConnection.onnegotiationneeded = null;
            myPeerConnection.oniceconnectionstatechange = null;
            myPeerConnection.onsignalingstatechange = null;
            myPeerConnection.onicegatheringstatechange = null;
            myPeerConnection.onnotificationneeded = null;
            myPeerConnection.onremovetrack = null;

            // close the peer connection
            myPeerConnection.close();
            myPeerConnection = null;

            console.log("Close the socket");
            if (socket != null) {
                socket.close();
            }
        }
    }

    return (
        <div>
            {isStart ? (
                <div ref={fullscreen}>
                    <div
                        ref={shutter}
                        className={captureStyles.shutterEffect}
                    ></div>
                    <div id="video">
                        {startRecord ? (
                            <></>
                        ) : (
                            <div className="loader" style={{ zIndex: 2 }}>
                                <img src="/cheese_512.png" width={"50%"} />
                            </div>
                        )}
                        <video
                            ref={remoteVideoRef}
                            id={captureStyles.stream}
                            autoPlay
                            playsInline
                            muted
                        ></video>
                    </div>
                    <div className={captureStyles.rotate}>
                        {pose ? (
                            <img
                                style={{
                                    position: "absolute",
                                    top: "78vh",
                                    left: "-4vw",
                                    maxWidth: "32vh",
                                    maxHeight: "32vw",
                                    mixBlendMode: "lighten",
                                    transformOrigin: "center",
                                    transform: "rotate(90deg)",
                                }}
                                src={pose}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className={captureStyles.functions}
                        style={{ top: "76vh", paddingBottom: "8vh" }}
                    >
                        <div
                            className={captureStyles.shutter}
                            onClick={handleShutterClick}
                        >
                            <img
                                id={captureStyles.shutter}
                                src="/capture/shutter.png"
                            />
                        </div>
                        <div className={captureStyles.timer}>
                            <img
                                id={captureStyles.timer}
                                src="/capture/timer.png"
                            />
                            <span>{timer}</span>
                        </div>
                        <div className={captureStyles.amount}>
                            <span>
                                {capturedAmount + 1 <= amount
                                    ? capturedAmount + 1
                                    : amount}
                                /{amount}
                            </span>
                        </div>
                    </div>
                    {isEnd ? (
                        <div className={captureStyles.alertWrapper}>
                            <div className="alert">
                                <span className="title">촬영이 끝났어요.</span>{" "}
                                <br />
                                <span className="subtitle">
                                    사진을 기기에 저장할게요.
                                </span>{" "}
                                <br />
                                <br />
                                <TextBtn
                                    href={"/edit?photos=true"}
                                    color="#FFD56A"
                                    content="촬영한 사진을 바로 편집해보세요."
                                >
                                    바로 편집하기
                                </TextBtn>
                                <TextBtn
                                    href={
                                        "/accessProcess/print/print?photos=true"
                                    }
                                    color="#FFD56A"
                                    content="촬영한 사진을 바로 인화하세요."
                                >
                                    바로 인화하기
                                </TextBtn>
                                <div onClick={handleSharePhoto}>
                                    <TextBtn
                                        color="#FFD56A"
                                        content="촬영한 사진을 공유해보세요."
                                    >
                                        사진 공유하기
                                    </TextBtn>
                                </div>
                                <TextBtn href={"/home"} color="#FEFBF6">
                                    홈으로
                                </TextBtn>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="container">
                    <div className={queueStyle.textBox}>
                        <span style={{ fontWeight: 700 }}>촬영 대기중</span>
                        <span>입니다.</span> <br />
                        <span>내 앞에 대기자가</span>&nbsp;
                        <span style={{ fontWeight: 700 }}>{queueLength}명</span>
                        &nbsp;<span>있어요.</span>
                    </div>
                    <div className={queueStyle.dots}>
                        <div className={queueStyle.dot} id={queueStyle.d1} />
                        <div className={queueStyle.dot} id={queueStyle.d2} />
                        <div className={queueStyle.dot} id={queueStyle.d3} />
                    </div>
                </div>
            )}
        </div>
    );
}
