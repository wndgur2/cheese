"use client";

import { useEffect, useRef, useState} from "react";
import captureStyles from "./capture.module.css";
import TextBtn from "@/components/TextBtn";
import axios from "axios";
import { useSession } from "next-auth/react";
import savePhotosOnDevice from "@/api/savePhotosOnDevice";
import savePhotosOnCloud from "@/api/savePhotosOnCloud";
import sharePhotos from "@/api/sharePhotos";
import { useRouter } from "next/navigation";
import saveTimelapseOnCloud from "@/api/saveTimelapseOnCloud";

const LOCAL_TEST = false;

function addToQueue(roomN, uuid) {
  // send post request to server to add to queue
  const url = `http://${process.env.NEXT_PUBLIC_API}/cameraQueue/${roomN}`;
  axios.post(url, null, {
    params: {
      device: uuid,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function enterRoom(roomN, uuid) {
  // send post request to server to enter the room
  const url = `http://172.30.1.62:8080/branch/${roomN}/stream`;
  // const url = `http://${process.env.NEXT_PUBLIC_API}/branch/${roomN}/stream`;
  axios.post(url, null, {
    params: {
      device: uuid,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function exitRoom(roomN, uuid) {
  // send post request to server to exit the room
  const url = `http://${process.env.NEXT_PUBLIC_API}/branch/${roomN}/stream`;
  axios.delete(url, {
    params: {
      device: uuid,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}


export default function Capture(props) {
  const session = useSession({
    required: false,
    onUnauthenticated() {
      // redirect("/home/signin");
    },
  });

  const [amount, setAmount] = useState(0);
  const [capturedAmount, setCapturedAmount] = useState(0);
  const [time, setTime] = useState(15);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [isEnd, setIsEnd] = useState(false);
  const remoteVideoRef = useRef();
  const localVideoRef = useRef();
  const shutter = useRef();
  const router = useRouter();

  // streaming variables
  let localStream, socket, roomN, myPeerConnection, uuid, tId;
  let blobs_recorded = [];

  // WebRTC STUN servers
  const peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
  };

  // WebRTC media
  const mediaConstraints = {
    audio: false,
    video: true
  };
  
  useEffect(()=>{
    uuid = localStorage.getItem("uuid");
    roomN = JSON.parse(localStorage.getItem("branch")).id;

    addToQueue(roomN, uuid);
    enterRoom(roomN, uuid);

    setAmount(props.searchParams.amount);

    socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API}/signal`);

    setSocketListeners(socket);
  },[]);

  useEffect(()=>{
    if(amount==0) return;
    if(capturedAmount >= amount) {
      endCapture();
      exitRoom(JSON.parse(localStorage.getItem("branch")).id, localStorage.getItem("uuid"));
    }
  }, [capturedAmount])

  useEffect(()=>{
    if(isEnd) clearTimeout(tId);
    else if(time==0) {
      handleShutterClick();
      setTime(15);
    } else{
      tId = setTimeout(()=>{
        setTime(time-1);
      }, 1000);
    }
  }, [time]);


  function capturePhoto() {
    var canvas = document.createElement("canvas");
    if(LOCAL_TEST) var video = localVideoRef.current;
    else var video = remoteVideoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const url = canvas.toDataURL("image/jpeg");
    let newCaptures = [...captures];
    newCaptures.push(url);
    // console.log(url);
    setCaptures(newCaptures);
  }

  function shutterEffect(){
    shutter.current.style.opacity = 1;
    setTimeout(()=>{
      shutter.current.style.opacity = 0;
    }, 300);
  }

  function handleShutterClick() {
    shutterEffect();
    capturePhoto();
    setCapturedAmount(capturedAmount+1);
    clearTimeout(tId);
    setTime(15);
    // console.log(captures);
  }

  function handleSharePhoto() {
    if(session.status == "unauthenticated") {
      alert("로그인이 필요해요.");
      router.push("/home/signin?callbackUrl=/home/myCheese?save=true");
    } else{
      sharePhotos(captures, session);
      alert("사진을 공유했어요.");
      router.push("/home/share");
    }
  }
  
  function endCapture() {
    const branch = JSON.parse(localStorage.getItem("branch"));
    const roomN = branch.id;
    const cost = branch.shooting_cost * amount;
    setIsEnd(true);
    mediaRecorder?.stop(); 

    localStorage.setItem("photos", JSON.stringify(captures));

    if(session.status == "authenticated") {
      savePhotosOnCloud(roomN, captures, session);
      
      // post timelapse video to server
      // const videoUrl = process.env.NEXT_PUBLIC_API + `/cloud/${session.data.user.id}/timelapse`;

      // post payment data to server
      const paymentUrl = `http://${process.env.NEXT_PUBLIC_API}/branch/${roomN}/payment`;
      axios.post(paymentUrl, null, {
        headers: {
          authorization: session.data.user.authorization,
          "refresh-token": session.data.user["refresh-token"],
        },
        params:{
          customerId: session.data.user.id,
          cost: cost,
          amount: capturedAmount,
          photo_or_print: true,
        }
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }

  return (
    <div>
      <div ref={shutter} className={captureStyles.shutterEffect}></div>
      { LOCAL_TEST ?
        <video id={captureStyles.stream} ref={localVideoRef} autoPlay playsInline></video>:
        <video id={captureStyles.stream} ref={remoteVideoRef} autoPlay playsInline></video>
      }
      <div className={captureStyles.functions}>
        <div className={captureStyles.rotate}>
          <img id={captureStyles.rotate} src="/capture/rotate.png" />
        </div>
        <div className={captureStyles.shutter} 
          onClick={handleShutterClick}>
          <img id={captureStyles.shutter} src="/capture/shutter.png" />
        </div>
        <div className={captureStyles.timer}>
          <img id={captureStyles.timer} src="/capture/timer.png" />
          <span>{time}</span>
        </div>
        <div className={captureStyles.amount}>
          <span>{capturedAmount+1 <= amount ? capturedAmount+1:amount}/{amount}</span>
        </div>
      </div>
      {capturedAmount ==amount &&
        <div className={captureStyles.alertWrapper}>
          <div className="alert">
            <span className='title'>촬영이 끝났어요.</span> <br/>
            <span className='subtitle'>사진을 기기에 저장할게요.</span> <br/><br/>
            <TextBtn href={"/edit?photos=true"} color="#FFD56A" content="촬영한 사진을 바로 편집해보세요.">바로 편집하기</TextBtn>
            <TextBtn href={"/home"} color="#FFD56A" content="촬영한 사진을 바로 인화하세요.">바로 인화하기</TextBtn>
            <div onClick={handleSharePhoto}><TextBtn color="#FFD56A" content="촬영한 사진을 공유해보세요.">사진 공유하기</TextBtn></div>
            <TextBtn href={"/home"} color="#FEFBF6">홈으로</TextBtn>
          </div>
        </div>
      }
    </div>
  );

  // 소켓 리스너 정의
  function setSocketListeners(socket) {
    // add an event listener to get to know when a connection is open
    socket.onopen = function() {
      console.log('WebSocket connection opened to Room: #' + roomN + " from " + localStorage.getItem("uuid"));
      // send a message to the server to join selected room with Web Socket
      sendToServer({
        from: localStorage.getItem("uuid"),
        type: 'join',
        data: roomN
      });
    };

    // a listener for the socket being closed event
    socket.onclose = function(message) {
      console.log('Socket has been closed');
    };

    // an event listener to handle socket errors
    socket.onerror = function(message) {
      handleErrorMessage("Error: " + message);
    };

    //webrtc_client
    socket.onmessage = function(msg) {
      let message = JSON.parse(msg.data);
      switch (message.type) {
        case "text":
          console.log('Text message from ' + message.from + ' received: ' + message.data);
          break;
        case "offer":
          console.log('Signal OFFER received');
          handleOfferMessage(message);
          break;
        case "answer":
          console.log('Signal ANSWER received');
          handleAnswerMessage(message);
          break;
        case "ice":
          console.log('Signal ICE Candidate received');
          handleNewICECandidateMessage(message);
          break;
        case "join":
          console.log('Client is starting to ' + (message.data === "true)" ? 'negotiate' : 'wait for a peer'));
          handlePeerConnection(message);
          break;
        default:
          handleErrorMessage('Wrong type message received from server');
      }
    };
  }

  // 함수들 정의
  function handleErrorMessage(message) {
    console.error(message);
  }

  // use JSON format to send WebSocket message
  function sendToServer(msg) {
    let msgJSON = JSON.stringify(msg);
    socket.send(msgJSON);
  }

  // initialize media stream
  function getMedia(constraints) {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(getLocalMediaStream).catch(handleGetUserMediaError);
  }
  
  // add MediaStream to local video element and to the Peer
  function getLocalMediaStream(mediaStream) {
      localStream = mediaStream;
      if(LOCAL_TEST) {
        localVideoRef.current.srcObject = mediaStream;
        
        // record video
        let mediaRecorder_ = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
        mediaRecorder_.ondataavailable = (event) => {
          if (event.data.size > 0) {
            blobs_recorded.push(event.data);
          }
        };

        mediaRecorder_.onstop = () => {
          setCaptures((cptrs)=>{
            savePhotosOnDevice(cptrs, new Blob(blobs_recorded, { type: 'video/webm' }));
            if(session.status == "authenticated")
              saveTimelapseOnCloud(roomN, new Blob(blobs_recorded, { type: 'video/webm' }), session);
            return cptrs;
          })
        };
        
        mediaRecorder_.start(1000);

        setMediaRecorder(mediaRecorder_);
      }
      localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
  }

  // create peer connection, get media, start negotiating when second participant appears
  function handlePeerConnection(message) {
    createPeerConnection();
    getMedia(mediaConstraints);
    console.log(message);
    // console.log(message.data==="true");
    if (message.data === "true") {
        myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    }
  }

  function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection(peerConnectionConfig);

    // event handlers for the ICE negotiation process
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent;
  }

  // handle get media error
  function handleGetUserMediaError(error) {
      console.log('navigator.getUserMedia error: ', error);
      switch(error.name) {
          case "NotFoundError":
              alert("Unable to open your call because no camera and/or microphone were found.");
              break;
          case "SecurityError":
          case "PermissionDeniedError":
              // Do nothing; this is the same as the user canceling the call.
              break;
          default:
              alert("Error opening your camera and/or microphone: " + error.message);
              break;
      }
      stop();
  }

  // send ICE candidate to the peer through the server
  function handleICECandidateEvent(event) {
    if (event.candidate) {
      sendToServer({
        from: localStorage.getItem("uuid"),
        type: 'ice',
        candidate: event.candidate
      });
      console.log('ICE Candidate Event: ICE candidate sent');
    }
  }

  function handleTrackEvent(event) {
    console.log('Track Event: set stream to remote video element');
    if(remoteVideoRef.current){
      console.log("EVENT STREAMS: ", event.streams);
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  }

  // WebRTC called handler to begin ICE negotiation
  // 1. create a WebRTC offer
  // 2. set local media description
  // 3. send the description as an offer on media format, resolution, etc
  function handleNegotiationNeededEvent() {
    myPeerConnection.createOffer().then(function(offer) {
      return myPeerConnection.setLocalDescription(offer);
    })
    .then(function() {
      sendToServer({
        from: localStorage.getItem("uuid"),
        type: 'offer',
        sdp: myPeerConnection.localDescription
      });
      console.log('Negotiation Needed Event: SDP offer sent');
    })
    .catch(function(reason) {
      // an error occurred, so handle the failure to connect
      handleErrorMessage('failure to connect error: ', reason);
    });
  }

  function handleOfferMessage(message) {
      console.log('Accepting Offer Message');
      console.log(message);
      let desc = new RTCSessionDescription(message.sdp);
      //TODO test this
      if (desc != null && message.sdp != null) {
          console.log('RTC Signalling state: ' + myPeerConnection.signalingState);
          myPeerConnection.setRemoteDescription(desc)
          .then(function () {
              console.log("Set up local media stream");
              return navigator.mediaDevices.getUserMedia(mediaConstraints);
          })
          .then(function (stream) {
              console.log("-- Local video stream obtained");
              localStream = stream;

              // try {
              //     localVideo = localStream;
              // } catch (error) {
              //     // localVideo.src = window.URL.createObjectURL(stream);
              // }

              console.log("-- Adding stream to the RTCPeerConnection");
              localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
          })
          .then(function () {
              console.log("-- Creating answer");
              // Now that we've successfully set the remote description, we need to
              // start our stream up locally then create an SDP answer. This SDP
              // data describes the local end of our call, including the codec
              // information, options agreed upon, and so forth.
              return myPeerConnection.createAnswer();
          })
          .then(function (answer) {
              console.log("-- Setting local description after creating answer");
              // We now have our answer, so establish that as the local description.
              // This actually configures our end of the call to match the settings
              // specified in the SDP.
              return myPeerConnection.setLocalDescription(answer);
          })
          .then(function () {
              console.log("Sending answer packet back to other peer");
              sendToServer({
                  from: localStorage.getItem("uuid"),
                  type: 'answer',
                  sdp: myPeerConnection.localDescription
              });

          })
          // .catch(handleGetUserMediaError);
          .catch(handleErrorMessage)
      }
  }

  function handleAnswerMessage(message) {
    console.log("The peer has accepted request");

    // Configure the remote description, which is the SDP payload
    // in our "video-answer" message.
    // myPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp)).catch(handleErrorMessage);
    myPeerConnection.setRemoteDescription(message.sdp).catch(handleErrorMessage);
  }

  function handleNewICECandidateMessage(message) {
    let candidate = new RTCIceCandidate(message.candidate);
    console.log("Adding received ICE candidate: " + JSON.stringify(candidate));
    myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
  }

  function stop() {
    // send a message to the server to remove this client from the room clients list
    console.log("Send 'leave' message to server");
    sendToServer({
      from: localStorage.getItem("uuid"),
      type: 'leave',
      data: roomN
    });

    if (myPeerConnection) {
      console.log('Close the RTCPeerConnection');

      // disconnect all our event listeners
      myPeerConnection.onicecandidate = null;
      myPeerConnection.ontrack = null;
      myPeerConnection.onnegotiationneeded = null;
      myPeerConnection.oniceconnectionstatechange = null;
      myPeerConnection.onsignalingstatechange = null;
      myPeerConnection.onicegatheringstatechange = null;
      myPeerConnection.onnotificationneeded = null;
      myPeerConnection.onremovetrack = null;

      // Stop the videos (엘리먼트 변경은 알아서 될듯?)
      // if (remoteVideo) {
      //     remoteVideo.getTracks().forEach(track => track.stop());
      // }
      // if (localVideo) {
      //     localVideo.getTracks().forEach(track => track.stop());
      // }

      // remoteVideo.src = null;
      // localVideo.src = null;

      // close the peer connection
      myPeerConnection.close();
      myPeerConnection = null;

      console.log('Close the socket');
      if (socket != null) {
          socket.close();
      }
    }
  }
}