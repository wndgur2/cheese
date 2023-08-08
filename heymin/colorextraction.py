from color_matcher import ColorMatcher
from color_matcher.io_handler import load_img_file, save_img_file

import cv2
import numpy as np


def RGB_to_HSV(original_image, edited_image):
    if original_image is None or edited_image is None:
        raise ValueError("이미지 파일을 로드할 수 없습니다.")

    # 이미지 깊이 변환
    original_image = original_image.astype(np.float32) / 255.0
    edited_image = edited_image.astype(np.float32) / 255.0

    # Convert images to HSV format
    original_hsv = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV)
    edited_hsv = cv2.cvtColor(edited_image, cv2.COLOR_BGR2HSV)
    return original_hsv, edited_hsv

def calculate_mean_brightness(original_hsv, edited_hsv):
    o_hsv = original_hsv[:,:,2]
    e_hsv = edited_hsv[:, :, 2]
    o_mean_brightness = np.mean(o_hsv)
    e_mean_brightness = np.mean(e_hsv)
    return o_mean_brightness - e_mean_brightness

def calculate_mean_chroma(original_hsv, edited_hsv):
    o_hsv = original_hsv[:,:,1]
    e_hsv = edited_hsv[:, :, 1]
    o_mean_brightness = np.mean(o_hsv)
    e_mean_brightness = np.mean(e_hsv)
    return o_mean_brightness - e_mean_brightness

def calculate_rgb_difference(image1, image2):
    # 이미지를 numpy 배열로 변환
    arr1 = np.array(image1)
    arr2 = np.array(image2)

    # R, G, B 채널별로 차이 계산
    diff_r = np.mean(arr1[:, :, 0] - arr2[:, :, 0])
    diff_g = np.mean(arr1[:, :, 1] - arr2[:, :, 1])
    diff_b = np.mean(arr1[:, :, 2] - arr2[:, :, 2])

    return diff_r, diff_g, diff_b

# 일단 아무것도 변경하지말고 R,G,B값만 적용해보기
def apply_effect(original_image, brightness_diff, saturation_diff, red_diff, green_diff, blue_diff):
    original_image = original_image.astype(np.float32) / 255.0
    edited_hsv = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV)
    edited_hsv[:, :, 2] += brightness_diff
    edited_hsv[:, :, 1] += saturation_diff
    edited_hsv = np.clip(edited_hsv, 0, 255)
    edited_bgr = cv2.cvtColor(edited_hsv, cv2.COLOR_HSV2BGR)
    edited_bgr[:, :, 2] += red_diff
    edited_bgr[:, :, 1] += green_diff
    edited_bgr[:, :, 0] += blue_diff
    edited_bgr = np.clip(edited_bgr, 0, 255)
    return edited_bgr.astype(np.uint8)


# 이미지 파일
original_images = load_img_file('C:/Users/goaeh/Desktop/블로그/56/2.jpeg')
#edited_image = load_img_file('C:/Users/goaeh/Desktop/color_matcher/defaultresult.png')
edited_image = load_img_file('C:/Users/goaeh/Desktop/블로그/56/3.jpeg')


# 이미지 밝기 계산
original_b, edited_b = RGB_to_HSV(original_images, edited_image)
original_brightness = calculate_mean_brightness(original_b, edited_b)
print('밝기 차이',original_brightness)

# 이미지 채도 계산
original_chroma = calculate_mean_chroma(original_b, edited_b)
print('채도 차이',original_chroma)

# RGB 값 차이 계산
diff_r, diff_g, diff_b = calculate_rgb_difference(original_images, edited_image)
print(diff_r)  # [255, 255, 128]
print(diff_g)  # [0, 255, 128]
print(diff_b)  # [0, 255, 128]


applied_effect_image = apply_effect(original_images, original_brightness, original_chroma, diff_r, diff_g, diff_b)

#applied_image = cv2.add()

cv2.imshow('Original Image', original_images)
cv2.imshow('Edited Image', edited_image)
cv2.imshow('Applied Effect Image', applied_effect_image)
cv2.waitKey(0)
cv2.destroyAllWindows()