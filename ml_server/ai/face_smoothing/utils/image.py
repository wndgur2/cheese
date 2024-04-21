# System imports
import os

# Third-party imports
import cv2
import numpy as np

from ai.face_smoothing.detector import detect, smooth


def resize_image(image, width=None, height=None):
    dim = None
    (h, w) = image.shape[:2]
    if width is None and height is None:
        return image
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    else:
        r = width / float(w)
        dim = (width, int(h * r))
    resized = cv2.resize(image, 
                         dim, 
                         interpolation=cv2.INTER_AREA)
    return resized


def check_img_size(img):
    # Retrieve image size
    height, width = img.shape[:2]
    # If image h is > 720 or w is > 1080, resize
    if height > 720 or width > 1080:
        img = resize_image(img, 
                           width=720 if width > 720 else None, 
                           height=1080 if height > 1080 else None)
    return img


def process_image(input_img, cfg, net):
    # Make sure image is less than 1081px wide
    input_img = check_img_size(input_img)
    # Detect face
    detected_img, bboxes = detect.detect_face(cfg, net, input_img)
    # Smooth face and return steps
    output_img, roi_img, hsv_mask, smoothed_roi = smooth.smooth_face(cfg,
                                                                     input_img, 
                                                                     bboxes)
    # Draw bboxes on output_img
    output_w_bboxes = draw_bboxes(output_img, cfg, bboxes)
    return (input_img, detected_img, roi_img, hsv_mask, 
            smoothed_roi, output_w_bboxes, output_img)


def load_image(path):
    return cv2.imread(path)


def create_img_output_path(filename):
    counter = 0
    # Add brackets and extension to filename
    filename = filename + '{}.jpg'
    # If a file of this name exists increase the counter by 1
    while os.path.isfile(filename.format(counter)):
        counter += 1
    # Apply counter to filename
    filename = filename.format(counter)
    return filename.format(counter)


def save_image(filename, img):
    # Create filename
    filename = create_img_output_path(filename)
    # Save image
    return cv2.imwrite(filename, img)


def get_height_and_width(img):
    return img.shape[0], img.shape[1]


def concat_imgs(imgs):
    return np.concatenate(imgs, axis=1)


def draw_bboxes(output_img, cfg, bboxes):
    # Create copy of image
    output_w_bboxes = output_img.copy()
    # Get height and width
    img_height, img_width = get_height_and_width(output_w_bboxes)
    # Draw bboxes
    for i in range(len(bboxes)):
        top_left = (bboxes[i][0], bboxes[i][1])
        btm_right = (bboxes[i][2], bboxes[i][3])
        cv2.rectangle(output_w_bboxes, 
                      top_left, 
                      btm_right, 
                      cfg['image']['bbox_color'], 
                      2)
    return output_w_bboxes
