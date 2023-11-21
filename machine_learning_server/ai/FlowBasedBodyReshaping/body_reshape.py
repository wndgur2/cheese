import re
from ai.FlowBasedBodyReshaping.reshape_base_algos.body_retoucher import BodyRetoucher
import time
import cv2
import argparse
import numpy as np
import glob
import tqdm
import os
from ai.FlowBasedBodyReshaping.config.test_config import TESTCONFIG, load_config
import toml


config_file = './ai/FlowBasedBodyReshaping/config/test_demo_setting.toml'


def recurve_search(root_path, all_paths, suffix=[]):
    for file in os.listdir(root_path):
        target_file = os.path.join(root_path, file)
        if os.path.isfile(target_file):
            (path, extension) = os.path.splitext(target_file)
            
            if extension in suffix:
                all_paths.append(target_file)
        else:
            recurve_search(target_file, all_paths, suffix)


def body_reshape_process(image_list):
    pred_image = []
    gender = None
    
    with open(config_file) as f:
        load_config(toml.load(f))

    print('TEST CONFIG: \n{}'.format(TESTCONFIG))
    print("loading model:{}".format(TESTCONFIG.reshape_ckpt_path))

    ret = BodyRetoucher.init(reshape_ckpt_path=TESTCONFIG.reshape_ckpt_path,
                             pose_estimation_ckpt=TESTCONFIG.pose_estimation_ckpt,
                             device=0, log_level='error',
                             log_path='test_log.txt',
                             debug_level=0)
    if ret == 0:
        print('init done')
    else:
        print('init error:{}'.format(ret))
        exit(0)

    image_list['img']

    for img, gender in zip(image_list['img'], image_list['gender']):

        pred, flow = BodyRetoucher.reshape_body(gender, img, degree=TESTCONFIG.degree)
        pred_image.append(pred)

    BodyRetoucher.release()
    print('all done')
    return pred_image

if __name__ == "__main__":
    body_reshape_process()