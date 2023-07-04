"use client";

import { useState, useEffect, useRef} from "react";
import RTCVideo from './camera';

export default function Home() {
  let localStream;
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  let myPeerConnection;
  const [localUserName, setLocalUserName] = useState();
  const [localRoom, setLocalRoom] = useState("99");

  let socket;

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
    socket = new WebSocket("ws://localhost:8080/signal");

    // add an event listener to get to know when a connection is open
    socket.onopen = function() {
      console.log('WebSocket connection opened to Room: #' + localRoom + " from " + localStorage.getItem("uuid"));
      // send a message to the server to join selected room with Web Socket
      sendToServer({
        from: localStorage.getItem("uuid"),
        type: 'join',
        data: localRoom
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

    setLocalUserName(localStorage.getItem("uuid"));

    //방 만들기
    // postRoom().then((data)=>{
    //   console.log(data);
    // })
  },[]);
  

  // room POST 메서드 구현
  async function postRoom(url = 'http://0.0.0.0:8080/room', data = {uuid: localStorage.getItem("uuid"), id:2, action:'create'}) {
    const formData = new FormData();
    formData.append("action", data.action);
    formData.append("uuid", data.uuid);
    formData.append("id", data.id);

    // 옵션 기본 값은 *로 강조
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE 등
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formData, // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
    });
    return response; // JSON 응답을 네이티브 JavaScript 객체로 파싱
  }

  function stop() {
    // send a message to the server to remove this client from the room clients list
    console.log("Send 'leave' message to server");
    sendToServer({
      from: localStorage.getItem("uuid"),
      type: 'leave',
      data: localRoom
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

  // create peer connection, get media, start negotiating when second participant appears
  function handlePeerConnection(message) {
      createPeerConnection();
      getMedia(mediaConstraints);
      console.log(message);
      console.log(message.data==="true");
      if (message.data === "true") {
          myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
      }
  }

  function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection(peerConnectionConfig);

    // event handlers for the ICE negotiation process
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent;

    // the following events are optional and could be realized later if needed
    // myPeerConnection.onremovetrack = handleRemoveTrackEvent;
    // myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    // myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    // myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
  }
  // add MediaStream to local video element and to the Peer
  function getLocalMediaStream(mediaStream) {
      localStream = mediaStream;
      localVideoRef.current.srcObject = mediaStream;
      localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
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
    remoteVideoRef.current.srcObject = event.streams[0];
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
              try {
                  localVideo = localStream;
              } catch (error) {
                  // localVideo.src = window.URL.createObjectURL(stream);
              }

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


  return (
    <div>
      <p>take photos. {localUserName}</p>
      <video ref={localVideoRef} autoPlay playsInline></video>
      <video ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  );
}
