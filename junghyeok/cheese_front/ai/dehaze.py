import cv2
import numpy as np
import image_dehazer

def dehaze_image(HazeImg):
    # Haze 제거
    HazeCorrectedImg, HazeMap = image_dehazer.remove_haze(HazeImg, regularize_lambda=0.30, sigma=1.50, delta=0.70, showHazeTransmissionMap=False)

    # HazeMap 전처리
    HazeMap = cv2.normalize(src=HazeMap, dst=None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    HazeMap = cv2.bitwise_not(HazeMap)

    # HazeMap 형태 변경
    HazeMap_color = np.expand_dims(HazeMap, axis=2)
    HazeMap_color = np.repeat(HazeMap_color, 3, axis=2)

    # 알파 채널을 255로 채워진 투명한 이미지 생성
    alpha = np.ones_like(HazeMap) * 255

    # 알파 채널을 HazeMap_color에 병합하여 투명한 이미지 생성
    HazeMap_alpha = cv2.merge([HazeMap_color, alpha])
    HazeMap_alpha = HazeMap_alpha[:, :, :3]


    opacity = 0.6 # 0.6이 기본값 -> 0으로 감소
    enhanced_image = cv2.addWeighted(HazeCorrectedImg, 1-opacity, HazeMap_alpha, opacity, 0)
    blurred_image = cv2.bilateralFilter(enhanced_image, -1, 10, 5)

    return blurred_image


if __name__ == "__main__":
    dehaze_image()