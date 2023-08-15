"use client";

import { useRef } from 'react';
import RTCVideo from './camera';

export default function Home() {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const joinButtonRef = useRef();
    const disconnectButtonRef = useRef();

    // WebRTC STUN servers
    const peerConnectionConfig = {
    'iceServers': [
            {'urls': 'stun:stun.stunprotocol.org:3478'},
            {'urls': 'stun:stun.l.google.com:19302'},
        ]
    };
    const pc = new RTCPeerConnection(peerConnectionConfig);
    let localStream = null;
    let remoteStream = null;

    const joinHandler = async () => {
        console.log('Connect.');
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
    
        remoteStream = new MediaStream();
    
        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
    
        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };
        localVideoRef.current.srcObject = localStream;
        remoteVideoRef.current.srcObject = remoteStream;
    };

    const hangupHandler = () => {
        console.log('Disconnect.');
        localStream.getTracks().forEach((track) => track.stop());
        remoteStream.getTracks().forEach((track) => track.stop());
    };

    const answerHandler = async () => {
        console.log('Joining the call.');
        const callId = callInputRef.current.value;

        pc.onicecandidate = (event) => {
            event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
        console.log('pc', pc);

        const callData = (await callDoc.get()).data();

        const offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await callDoc.update({ answer });
    
        offerCandidates.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                console.log(change);
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    return (
        <div>
            <div className="videos">
                <span>
                    <h1 id="subtitle">
                    <span> Local Stream</span>
                    </h1>
                    <video
                    className="webcamVideo"
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    ></video>
                </span>
                <span>
                    <h1 id="subtitle">
                    <span> Remote Stream</span>
                    </h1>
                    <video
                    className="webcamVideo"
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    ></video>
                </span>
            </div>
            <button
                onClick={joinHandler}
                ref={joinButtonRef}
            >
                Join
            </button>
            <button
                onClick={hangupHandler}
                ref={disconnectButtonRef}
            >
                Disconnect
            </button>
        </div>
    );
}
