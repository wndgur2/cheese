import cv2
import os
import torch

from ai.FlowBasedBodyReshaping.gender_detection.gender_detection_test import predict_gender
from ai.FlowBasedBodyReshaping.body_reshape import body_reshape_process


model = torch.hub.load('ultralytics/yolov5', 'custom', path='./ai/FlowBasedBodyReshaping/models/best.pt')


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

    return bounding_boxes


def get_bounding_box_image(img):
    bounding_box_images = []
    bounding_boxes = get_bounding_boxes(img)
    for bbox in bounding_boxes:
        xmin, ymin, xmax, ymax = bbox
        # 바운딩 박스 좌표를 정수형으로 변환
        xmin, ymin, xmax, ymax = int(xmin), int(ymin), int(xmax), int(ymax)

        # 원본 이미지에서 바운딩 박스에 해당하는 영역을 잘라내기
        bounding_box_image = img[ymin:ymax, xmin:xmax]
        bounding_box_images.append(bounding_box_image)

    return bounding_box_images, bounding_boxes


def reshape_body_get_image(img):
    bbox_images, bounding_boxes = get_bounding_box_image(img)

    image_list = {
        'img': [],
        'gender': []
    }

    for i, bbox_image in enumerate(bbox_images):
        person_gender = predict_gender(bbox_image)
        image_list['img'].append(bbox_image)
        image_list['gender'].append(person_gender)

    pred_image = body_reshape_process(image_list)
    reshape_body_img = img.copy()

    for i, bounding_box in enumerate(bounding_boxes):
        # 보정된 결과 이미지를 person bounding box에 복원
        xmin, ymin, xmax, ymax = bounding_box
        # 바운딩 박스 좌표를 정수형으로 변환
        xmin, ymin, xmax, ymax = int(xmin), int(ymin), int(xmax), int(ymax)
        reshape_body_img[ymin:ymax, xmin:xmax] = pred_image[i]

    return reshape_body_img # 보정된 결과


# Image_path = "./test_cases/fatpeople.png"

# result_img = reshape_body_get_image(Image_path)
# resized_result_img = cv2.resize(result_img, (0, 0), fx=1/3, fy=1/3)

# cv2.imshow("Reshaped Image", resized_result_img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()


if __name__ == "__main__":
    reshape_body_get_image()