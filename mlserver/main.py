from fastapi import FastAPI, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
from fastapi.responses import JSONResponse
import zipfile

import cv2
import numpy as np

from ai.face_smoothing.infer import skin_care
from ai.FlowBasedBodyReshaping.multi_people_reshape import reshape_body_get_image
from ai.colorextraction import extract_color
from ai.dehaze import dehaze_image
from ai.pose_estimation.object_detection_test import objects_detected
from ai.remove_bg_selected_feature import remove_background

from fastapi.responses import StreamingResponse


app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",
    "*",
    "http://192.168.0.15",
    "http://192.168.0.15:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def file_to_image(file):
    pil_image = Image.open(BytesIO(file))
    np_image = np.array(pil_image)
    image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
    return image


def image_to_file(image):
    bgr_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(bgr_image)

    edited_image_byte = BytesIO()
    pil_image.save(edited_image_byte, format="JPEG")

    edited_image_byte_data = edited_image_byte.getvalue()
    return edited_image_byte_data


@app.get("/")
def read_root():
    return {"치즈한장 AI Fast API SERVER"}


@app.post("/ai/skin_smoothing")
async def smoothing_skin_by_image(file: UploadFile):

    image_bytes = await file.read()
    image = file_to_image(image_bytes)
    edited_image = skin_care(image)
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)

    data = image_to_file(edited_image)

    return StreamingResponse(BytesIO(data), media_type="image/jpeg")


@app.post("/ai/body_reshape")
async def reshape_body_by_gender(file: UploadFile):
    image_bytes = await file.read()
    image = file_to_image(image_bytes)
    edited_image = reshape_body_get_image(image)
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)

    data = image_to_file(edited_image)

    return StreamingResponse(BytesIO(data), media_type="image/jpeg")


@app.post("/ai/filter_generate")
async def generate_filter_by_image(original_image: UploadFile, filtered_image: UploadFile):
    ori_image_bytes = await original_image.read()
    fil_image_bytes = await filtered_image.read()
    ori_image = file_to_image(ori_image_bytes)
    fil_image = file_to_image(fil_image_bytes)

    edited_image = extract_color(ori_image, fil_image, 0)

    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)
    fi_data = edited_image.astype(np.uint8)
    data = image_to_file(fi_data)

    return StreamingResponse(BytesIO(data), media_type="image/jpeg")


@app.post("/ai/filter_generate_with_value")
async def generate_filter_by_image(original_image: UploadFile, filtered_image: UploadFile):
    ori_image_bytes = await original_image.read()
    fil_image_bytes = await filtered_image.read()
    ori_image = file_to_image(ori_image_bytes)
    fil_image = file_to_image(fil_image_bytes)
    
    edited_image, brightness, chroma, r, g, b = extract_color(ori_image, fil_image, 1)
    
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)
    
    edited_image_bytes = edited_image.astype(np.uint8)
    data = image_to_file(edited_image_bytes)
    
    response_data = {
        "img_path": filepath,
        "brightness": brightness,
        "chroma": chroma,
        "r": r,
        "g": g,
        "b": b
    }
    
    return JSONResponse(content=response_data)


@app.post("/ai/color_filter")
async def extracter_filter_by_image(file: UploadFile):
    image_bytes = await file.read()
    image = file_to_image(image_bytes)
    out = image.astype(float)
    out = ((out / 255) ** (1 / 1.1)) * 255
    edited_image = out.astype(np.uint8)
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)

    data = image_to_file(edited_image)

    return Response(content=data, media_type="image/jpg")


@app.post("/ai/dehaze_apply")
async def apply_dehaze(file: UploadFile):
    image_bytes = await file.read()
    image = file_to_image(image_bytes)
    edited_image = dehaze_image(image)
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)

    data = image_to_file(edited_image)

    return StreamingResponse(BytesIO(data), media_type="image/jpeg")


@app.post("/ai/object_remove")
async def select_object_add_inpainting(file: UploadFile, x: int, y: int):
    image_bytes = BytesIO(await file.read())
    edited_image, object_image = remove_background(image_bytes, x, y)

    edited_image_byte = BytesIO()
    edited_image.save(edited_image_byte, format="JPEG")
    
    object_image_byte = BytesIO()
    object_image.save(object_image_byte, format="JPEG")

    zip_buffer = create_zip(edited_image_byte, object_image_byte)

    return StreamingResponse(content=zip_buffer, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=images.zip"})


@app.post("/ai/pose_estimation")
async def select_object_add_inpainting(image: UploadFile):
    image_bytes = await image.read()
    image = file_to_image(image_bytes)
    edited_image = objects_detected(image)
    filepath = 'edit_image.jpg'
    cv2.imwrite(filepath, edited_image)
    data = image_to_file(edited_image)
    return StreamingResponse(BytesIO(data), media_type="image/jpeg")


def create_zip(edited_image_bytes, object_image_bytes):
    zip_buffer = BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('edited_image.jpg', edited_image_bytes.getvalue())
        zipf.writestr('object_image.jpg', object_image_bytes.getvalue())
    
    zip_buffer.seek(0)
    return zip_buffer
