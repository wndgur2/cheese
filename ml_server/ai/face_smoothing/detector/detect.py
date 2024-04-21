import cv2

from ai.face_smoothing.utils import image


def detect_face(cfg, net, input_img):
    # Get height and width
    img_height, img_width = image.get_height_and_width(input_img)
    # Prepare image for net
    blob = cv2.dnn.blobFromImage(input_img, 
                                 1.0, 
                                 cfg['image']['size'], 
                                 cfg['image']['mean'], 
                                 False, 
                                 False)
    # Set the input for the net and run forward pass
    net.setInput(blob)
    detections = net.forward()
    detected_img = input_img.copy()
    # Given all detections
    bboxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        conf_threshold = cfg['net']['conf_threshold']
        # If detection is above threshold append to list
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * img_width)
            y1 = int(detections[0, 0, i, 4] * img_height)
            x2 = int(detections[0, 0, i, 5] * img_width)
            y2 = int(detections[0, 0, i, 6] * img_height)
            bboxes.append([x1, y1, x2, y2])

            top_left, btm_right = (x1, y1), (x2, y2)
            # Draw bbox to image
            cv2.rectangle(detected_img, 
                          top_left, 
                          btm_right, 
                          cfg['image']['bbox_color'], 
                          2)
    return detected_img, bboxes



