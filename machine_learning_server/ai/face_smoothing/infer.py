import os
import argparse
import yaml
import time

import cv2
import matplotlib.pyplot as plt

from ai.face_smoothing.detector.detect import detect_face
from ai.face_smoothing.detector.smooth import smooth_face

from ai.face_smoothing.utils.image import (load_image, 
                         save_image, 
                         check_img_size,
                         get_height_and_width,
                         process_image)


def load_configs():
    with open('ai/face_smoothing/configs/configs.yaml', 'r') as file:
        return yaml.load(file, Loader=yaml.FullLoader)


def skin_care(input_path):
    # Start measuring time
    tic = time.perf_counter()
    # Load project configurations
    cfg = load_configs()
    # Load the network
    net = cv2.dnn.readNetFromTensorflow(cfg['net']['model_file'], 
                                        cfg['net']['cfg_file'])
    # Input and load image
    input_img = input_path

    # input_img = load_image(input_file)
    # Process image
    output_img = process_image(input_img, cfg, net)
    # Save final image to specified output filename
    #out_filename = os.path.join(output_path , cfg['image']['output'])
    # Check for --show-detections flag

    #img_saved = save_image(out_filename, output_img[6])

    toc = time.perf_counter()
    print(f"Operation ran in {toc - tic:0.4f} seconds")
    return output_img[6]


if __name__ == '__main__':
    skin_care()