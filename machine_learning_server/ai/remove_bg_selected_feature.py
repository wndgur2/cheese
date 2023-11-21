import os
import cv2
import torch
import numpy as np
import streamlit as st
from io import BytesIO
from PIL import Image
from streamlit.runtime.scriptrunner import get_script_run_ctx

from streamlit_image_coordinates import streamlit_image_coordinates
import matplotlib.pyplot as plt

from lama_cleaner.model_manager import ModelManager
from lama_cleaner.schema import Config, HDStrategy, LDMSampler
from transformers import AutoProcessor, AutoModelForUniversalSegmentation


def get_inpaint_config(**kwargs):
    data = dict(
        ldm_steps=1,
        ldm_sampler=LDMSampler.plms,
        hd_strategy=HDStrategy.ORIGINAL,
        hd_strategy_crop_margin=32,
        hd_strategy_crop_trigger_size=200,
        hd_strategy_resize_limit=200,
    )
    data.update(**kwargs)
    return Config(**data)

def load_models(device='cpu'):
    segment_processor = AutoProcessor.from_pretrained("facebook/mask2former-swin-base-coco-panoptic")
    segment_model = AutoModelForUniversalSegmentation.from_pretrained("facebook/mask2former-swin-base-coco-panoptic")
    _ = segment_model.eval().requires_grad_(False).to(device)

    inpaint_config = get_inpaint_config()
    inpaint_model = ModelManager('lama', device=device)
    return segment_processor, segment_model, inpaint_config, inpaint_model


def run_segment(pil_image, segment_processor, segment_model):
    segment_inputs = segment_processor(images=pil_image, task_inputs=["panoptic"], return_tensors="pt").to('cpu')
    segment_outputs = segment_model(**segment_inputs)
    segment_outputs = segment_processor.post_process_panoptic_segmentation(segment_outputs, target_sizes=[pil_image.size[::-1]])[0]
    segmentation = segment_outputs['segmentation']
    return segmentation


def run_inpaint(np_image, mask, inpaint_config, inpaint_model):
    dilated_mask = cv2.dilate(mask, None, iterations=3) 
    outputs = inpaint_model(np_image, dilated_mask, inpaint_config)
    outputs = outputs[:,:,[2,1,0]].astype(np.uint8)
    return outputs


def remove_background(image, x, y):
    segment_processor, segment_model, inpaint_config, inpaint_model = load_models(device='cpu')

    pil_image = Image.open(image).convert("RGB")
    np_image = np.array(pil_image)

    segmentation = run_segment(pil_image, segment_processor, segment_model)
    instance_id = segmentation[y, x].item()

    mask = torch.where(segmentation==instance_id, 1, 0)
    mask = mask.cpu().numpy() * 255.

    inpainted_image = run_inpaint(np_image, mask, inpaint_config, inpaint_model)
    inpainted_image = Image.fromarray(inpainted_image)

    mask = mask.astype(np.uint8)
    masked_image = cv2.bitwise_and(np_image, np_image, mask=mask)
    masked_image = cv2.GaussianBlur(masked_image, (9, 9), 0)

    masked_image = Image.fromarray(masked_image)

    return inpainted_image, masked_image


if __name__ == '__main__':    
    remove_background()
