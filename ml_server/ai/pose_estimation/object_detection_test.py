import threading
import cv2
# import streamlit as st
# from streamlit_webrtc import WebRtcMode, webrtc_streamer
import torch
from PIL import Image
import numpy as np
# import queue
# import av
# from typing import List, NamedTuple

lock = threading.Lock()
img_container = {"img": None}

model = torch.hub.load('ultralytics/yolov5', 'custom',
        path='./ai/FlowBasedBodyReshaping/models/best.pt')


def objects_detected(img):
    output = model(img)
    objects_num = output.pandas().xyxy[0].shape[0]

    image = pose_recommendation(objects_num)
    return image


# 사람 수에 따른 포즈 추천
def pose_recommendation(num):
    if num == 1:
        pose_img = cv2.imread('./ai/pose_estimation/cheese_pose_image/image1.PNG')
    elif num == 2:
        pose_img = cv2.imread('./ai/pose_estimation/cheese_pose_image/image2.PNG')
    elif num == 3:
        pose_img = cv2.imread('./ai/pose_estimation/cheese_pose_image/image3.PNG')
    elif num == 4:
        pose_img = cv2.imread('./ai/pose_estimation/cheese_pose_image/image4.PNG')
    else :
        pose_img = cv2.imread('./ai/pose_estimation/cheese_pose_image/image0.PNG')
    return pose_img


# webrtc_ctx = webrtc_streamer(
#     key="object-detection",
#     mode=WebRtcMode.SENDRECV,
#     video_frame_callback=video_frame_callback,
#     media_stream_constraints={"video": True, "audio": False},
#     async_processing=Tgerue,
# )


# object_num_space = st.empty()

# while webrtc_ctx.state.playing:
#     with lock:
#         img = img_container["img"]
#     if img is None:
#         continue
#     num = objects_detected(img)
#     pose_img = pose_recommendation(num)

#     with object_num_space.container():
#         st.write("객체 개수", num)
#         if pose_img is not None:
#             st.image(pose_img)
