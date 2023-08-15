import threading
import cv2
import streamlit as st
import torch
from streamlit_webrtc import WebRtcMode, webrtc_streamer
from PIL import Image
import numpy as np
import queue
import av
from typing import List, NamedTuple

lock = threading.Lock()
img_container = {"img": None}

model = torch.hub.load('ultralytics/yolov5', 'custom',
        path='./yolov5/runs/train/yolov5_people/weights/best.pt')

def get_bounding_boxes(img):
    # Run inference
    output = model(img)
    # 감지된 객체 정보 가져오기
    detections = output.pandas().xyxy[0]

    # 바운딩 박스 정보를 (xmin, ymin, xmax, ymax) 형태로 반환
    bounding_boxes = []
    for index, detection in detections.iterrows():
        xmin, ymin, xmax, ymax = detection["xmin"], detection["ymin"], detection["xmax"], detection["ymax"]
        bounding_boxes.append((xmin, ymin, xmax, ymax))

    return print(bounding_boxes)


def video_frame_callback(frame):
    image = frame.to_ndarray(format="bgr24")
    with lock:
        img_container["img"] = image

        return frame

# 사람 수 탐지
def objects_detected(img):
    # Run inference
    output = model(img)
    # 감지된 객체 개수 출력
    objects_num = output.pandas().xyxy[0].shape[0]
    print(objects_num)
    return objects_num


# 사람 수에 따른 포즈 추천
def pose_recommendation(num):
    if num == 1:
        pose_img = Image.open('./치즈한장_자세_이미지/슬라이드1.PNG')
    else:
        pose_img = Image.open('./치즈한장_자세_이미지/슬라이드2.PNG')
    return pose_img

webrtc_ctx = webrtc_streamer(
    key="object-detection",
    mode=WebRtcMode.SENDRECV,
    video_frame_callback=video_frame_callback,
    media_stream_constraints={"video": True, "audio": False},
    async_processing=True,
)


object_num_space = st.empty()

while webrtc_ctx.state.playing:
    with lock:
        img = img_container["img"]
    if img is None:
        continue
    num = objects_detected(img)
    pose_img = pose_recommendation(num)

    with object_num_space.container():
        st.write("객체 개수", num)
        if pose_img is not None:
            st.image(pose_img)
