import os
import random
import shutil

def split_dataset(image_dir, val_ratio=0.15, test_ratio=0.15):
    # 이미지 파일 목록 가져오기
    image_files = os.listdir(image_dir)
    random.shuffle(image_files)

    # 데이터셋 폴더 생성
    os.makedirs('train', exist_ok=True)
    os.makedirs('val', exist_ok=True)
    os.makedirs('test', exist_ok=True)

    # 검증 세트 분할
    val_size = int(len(image_files) * val_ratio)
    val_files = image_files[:val_size]
    for file in val_files:
        shutil.copy(os.path.join(image_dir, file), os.path.join('val', file))

    # 테스트 세트 분할
    test_size = int(len(image_files) * test_ratio)
    test_files = image_files[val_size : val_size + test_size]
    for file in test_files:
        shutil.copy(os.path.join(image_dir, file), os.path.join('test', file))

    # 학습 세트 분할
    train_files = image_files[val_size + test_size :]
    for file in train_files:
        shutil.copy(os.path.join(image_dir, file), os.path.join('train', file))

# 이미지 파일이 있는 디렉토리 경로 설정
image_dir = './images'

# 이미지 파일을 검증 세트와 테스트 세트로 분할
split_dataset(image_dir, val_ratio=0.2, test_ratio=0.2)

import os
os.system("python ./yolov5/train.py --img 640 --batch 16 --epochs 20 --data ./data.yaml --cfg ./yolov5/models/yolov5s.yaml --weights yolov5s.pt --name yolov5_people")
