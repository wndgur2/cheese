from color_matcher import ColorMatcher
from color_matcher.io_handler import load_img_file, save_img_file

import cv2
import numpy as np


def extract_color(ori_img_path, target_img_path, default_or_hm): # default 필터를 선택한 경우 1을 반환한다고 가정
    cm = ColorMatcher()
    # default인 경우 - 수치값이 추출 가능한 경우
    if default_or_hm: 
        edit_img = cm.transfer(src=ori_img_path, ref=target_img_path, method='default')
        diff_brightness, diff_chroma, diff_r, diff_g, diff_b = extract_color_by_picture(ori_img_path, edit_img)
        return edit_img, diff_brightness, diff_chroma, diff_r, diff_g, diff_b
    
    # hm-mkl-hm인 경우 - 수치값 추출이 불가능한 대신 이쁜 필터 추출
    else:
        edit_img = cm.transfer(src=ori_img_path, ref=target_img_path, method='hm-mkl-hm')
        return edit_img        


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
    return round((o_mean_brightness - e_mean_brightness)*100)


def calculate_mean_chroma(original_hsv, edited_hsv):
    o_hsv = original_hsv[:,:,1]
    e_hsv = edited_hsv[:, :, 1]
    o_mean_chroma= np.mean(o_hsv)
    e_mean_chroma = np.mean(e_hsv)
    return round((o_mean_chroma - e_mean_chroma)*100)


def calculate_rgb_difference(image1, image2):
    # 이미지를 numpy 배열로 변환
    arr1 = np.array(image1)
    arr2 = np.array(image2)

    # R, G, B 채널별로 차이 계산
    diff_r = np.mean(arr1[:, :, 0] - arr2[:, :, 0])
    diff_g = np.mean(arr1[:, :, 1] - arr2[:, :, 1])
    diff_b = np.mean(arr1[:, :, 2] - arr2[:, :, 2])
    r = round(diff_r / 10)
    g = round(diff_g / 10)
    b = round(diff_b / 10)
    return r, g, b


def extract_color_by_picture(original_img, edited_image):
    # 이미지 밝기 계산
    original_b, edited_b = RGB_to_HSV(original_img, edited_image)
    diff_brightness = calculate_mean_brightness(original_b, edited_b)
    print('밝기 차이', diff_brightness)


    # 이미지 채도 계산
    diff_chroma = calculate_mean_chroma(original_b, edited_b)
    print('채도 차이', diff_chroma)


    # RGB 값 차이 계산
    diff_r, diff_g, diff_b = calculate_rgb_difference(original_img, edited_image)
    
    return diff_brightness, diff_chroma, diff_r, diff_g, diff_b


if __name__ == "__main__":
    extract_color()