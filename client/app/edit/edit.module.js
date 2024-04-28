import axios from "axios";
import JSZip from "jszip";

const MARGIN = 1.1;
const LINE_WIDTH = 0.003;
const HITBOX_SIZE = 0.12;

function convertXY(width, height, inputX, inputY) {
    let x = Math.round((inputX * width) / Layer.preview.offsetWidth);
    let y = Math.round((inputY * height) / Layer.preview.offsetHeight);
    return { x, y };
}

class Page {
    static setBrushColor(color) {
        this.brushColor = color;
    }
    static setBrushSize(size) {
        this.brushSize = size;
    }

    static init() {
        Layer.init();
        this.touchLayer = new Layer("hitbox"); // to draw hitbox && listen touch events
        this.touchLayer.canvas.style.zIndex = 3;
        this.touchLayer.canvas.style.pointerEvents = "none";
        this.touchLayer.canvas.style.visibility = "hidden";
    }

    static disableTouchLayer() {
        console.log("disable touchlayer");
        this.touchLayer.canvas.style.pointerEvents = "none";
        this.touchLayer.canvas.style.visibility = "hidden";
    }

    static setTouchLayer(page_, type, setObjectEditting, setLoading) {
        if (!page_) return;
        if (!type) this.disableTouchLayer();
        console.log("setTouchLayer", type);
        this.touchLayer.canvas.style.pointerEvents = "auto";
        this.touchLayer.canvas.style.visibility = "visible";
        this.touchLayer.canvas.width = page_.width;
        this.touchLayer.canvas.height = page_.height;
        this.touchLayer.ctx.lineWidth = page_.lineWidth;
        this.state = type;

        switch (type) {
            case "crop":
                const imageLayer = page_.getLayer("image");
                this.touchLayer.x = imageLayer.x;
                this.touchLayer.y = imageLayer.y;
                this.touchLayer.width = imageLayer.image.width;
                this.touchLayer.height = imageLayer.image.height;
                this.touchLayer.lineLength = page_.lineWidth * 10;
                this.drawCropBox();

                this.touchLayer.canvas.ontouchstart = (e) => {
                    page_.handleCropTouchStart(e);
                };
                this.touchLayer.canvas.ontouchmove = (e) => {
                    page_.handleCropTouchMove(e);
                };
                break;

            case "pen" || "eraser" || "bucket":
                this.touchLayer.canvas.ontouchstart = (e) => {
                    page_.handleDrawTouchStart(e);
                };
                this.touchLayer.canvas.ontouchmove = (e) => {
                    page_.handleDrawTouchMove(e);
                };
                this.touchLayer.canvas.ontouchend = () => {
                    page_.handleDrawTouchEnd();
                };
                break;

            case "sticker":
                this.touchLayer.canvas.ontouchstart = (e) => {
                    page_.handleStickerTouchStart(e);
                };
                this.touchLayer.canvas.ontouchmove = (e) => {
                    page_.handleStickerTouchMove(e);
                };
                this.touchLayer.canvas.ontouchend = () => {
                    page_.handleStickerTouchEnd();
                };
                break;

            case "text":
                this.touchLayer.canvas.ontouchstart = (e) => {
                    page_.handleTextTouchStart(e);
                };
                this.touchLayer.canvas.ontouchmove = (e) => {
                    page_.handleTextTouchMove(e);
                };
                this.touchLayer.canvas.ontouchend = () => {
                    page_.handleTextTouchEnd();
                };
                break;

            case "object":
                this.touchLayer.canvas.ontouchstart = (e) => {
                    page_.handleObjectTouchStart(e);
                };
                page_.setObjectEditting = setObjectEditting;
                page_.setLoading = setLoading;
            default:
                break;
        }
    }

    static drawCropBox() {
        // x, y에 width,height만큼 cropbox 그리기
        const canvas = this.touchLayer.canvas;
        const ctx = this.touchLayer.ctx;
        const lineLength = this.touchLayer.lineLength;

        const x = this.touchLayer.x;
        const y = this.touchLayer.y;
        const width = this.touchLayer.width;
        const height = this.touchLayer.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0000004A";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(x, y, width, height);

        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = this.touchLayer.lineWidth;

        ctx.beginPath();

        ctx.moveTo(x + lineLength, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + lineLength);

        ctx.moveTo(x + lineLength, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + height - lineLength);

        ctx.moveTo(x + width - lineLength, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + lineLength);

        ctx.moveTo(x + width - lineLength, y + height);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + width, y + height - lineLength);

        ctx.stroke();
    }

    static drawBox(layer) {
        // const centerX = layer.width / 2;
        // const centerY = layer.height / 2;

        // this.touchLayer.ctx.save();
        // this.touchLayer.ctx.translate(centerX, centerY);
        // this.touchLayer.ctx.rotate((layer.rotation + layer.baseRotation) * Math.PI/180);
        // this.touchLayer.ctx.translate(-centerX, -centerY);

        this.touchLayer.clear();
        this.touchLayer.ctx.strokeStyle = "#FFC121";
        this.touchLayer.ctx.strokeRect(
            layer.x,
            layer.y,
            layer.width,
            layer.height
        );
        // this.touchLayer.ctx.restore();
    }

    // static stopDraw(){
    //     console.log("stopDraw");
    // }

    /** @param {Page} page */
    constructor(src, page) {
        if (page) console.log("page copy construction.");
        this.src = src;
        this.state = "";
        this.touched = { x: 0, y: 0 };
        this.layers = [];
        this.rotation = page ? page.rotation : 0;
        this.width = page ? page.width : 0;
        this.height = page ? page.height : 0;
        this.lineWidth = page ? page.lineWidth : 10;
        this.filter = {
            brightness: 100,
            contrast: 100,
            blur: 0,
            grayscale: 0,
            saturate: 100,
        };

        let image = new Image();
        image.src = src;
        image.onload = () => {
            if (page) {
                this.layers.push(...page.layers.map((layer) => layer.copy()));
            } else {
                this.createImageLayer(image);
                /** @type {Array{Layer}} */
            }
            this.hide();
            this.draw();
        };
    }

    /** @returns {Layer} */
    getLayer(type) {
        if (!type) console.log("getLayer: No type");
        let resultLayer;
        this.layers.forEach((layer) => {
            if (layer.type == type) resultLayer = layer;
        });
        return resultLayer;
    }

    /** @returns {Array{Layer}} */
    getLayers(type) {
        if (!type) console.log("getLayer: No type");
        let resultLayers = [];
        this.layers.forEach((layer) => {
            if (layer.type == type) resultLayers.push(layer);
        });
        return resultLayers;
    }

    createImageLayer(image) {
        console.log(Layer.preview.offsetWidth);
        if (image.width > image.height) {
            this.width = image.width;
            this.height =
                (image.width * Layer.preview.offsetHeight) /
                Layer.preview.offsetWidth;
        } else {
            this.height = image.height;
            this.width =
                (image.height * Layer.preview.offsetWidth) /
                Layer.preview.offsetHeight;
        }
        this.width *= MARGIN;
        this.height *= MARGIN;
        this.lineWidth = parseInt((this.width + this.height) * LINE_WIDTH);

        this.layers = [
            new Layer(
                "image",
                this.src,
                this.width,
                this.height,
                0,
                0,
                image.width,
                image.height
            ),
        ];
    }

    setImage(src) {
        this.src = src;
        this.getLayer("image").setImage(src);
    }

    draw() {
        this.layers.forEach((layer) => {
            layer.draw();
        });
    }

    show() {
        this.layers.forEach((layer, i) => {
            layer.canvas.style.visibility = "visible";
        });
    }

    hide() {
        this.layers.forEach((layer, i) => {
            layer.canvas.style.visibility = "hidden";
        });
        Page.touchLayer.canvas.style.pointerEvents = "none";
        Page.touchLayer.canvas.style.visibility = "hidden";
    }

    copy() {
        let clone = new Page(this.src, this);
        return clone;
    }

    delete() {
        this.hide();
        this.layers.forEach((layer) => {
            layer.canvas.remove();
        });
        return;
    }

    crop() {
        this.layers.sort((a, b) => {
            console.log(a.type, b.type);
            const a_z = a.canvas.style.zIndex;
            const b_z = b.canvas.style.zIndex;
            if (a_z > b_z) return 1;
            else if (a_z < b_z) return -1;
            else return 0;
        });
        const baseLayer = this.layers[0];
        this.layers.slice(1).forEach((layer) => {
            baseLayer.ctx.drawImage(layer.canvas, 0, 0);
            layer.canvas.remove();
        });

        // 기존 layer에서 부분 이미지 추출하기
        let croppedCanvas = document.createElement("canvas");
        let croppedCtx = croppedCanvas.getContext("2d");
        croppedCanvas.width = Page.touchLayer.width;
        croppedCanvas.height = Page.touchLayer.height;
        croppedCtx.drawImage(
            baseLayer.canvas,
            Page.touchLayer.x,
            Page.touchLayer.y,
            Page.touchLayer.width,
            Page.touchLayer.height,
            0,
            0,
            Page.touchLayer.width,
            Page.touchLayer.height
        );
        baseLayer.canvas.remove();

        // imagelayer 세팅
        let image = new Image();
        this.src = croppedCanvas.toDataURL();
        image.src = this.src;

        image.onload = () => {
            this.createImageLayer(image, this.src);
        };

        this.rotation = 0;
        this.draw();
        croppedCanvas.remove();
        Page.disableTouchLayer();
    }

    rotate(d, fix = false) {
        console.log("rotate");
        this.layers.forEach((layer) => {
            if (layer.type == "image" || layer.type == "draw")
                layer.rotate(d - this.rotation, fix);
        });
        if (!fix) this.rotation = d;
        this.draw();
    }

    setFrame(src) {
        let frameLayer = this.getLayer("frame");
        if (!frameLayer) {
            console.log("frameLayer created");
            frameLayer = new Layer(
                "frame",
                src,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height,
                0,
                0,
                0
            );
            this.layers.push(frameLayer);
        } else {
            frameLayer.src = src;
            frameLayer.draw();
        }
    }

    addSticker(src) {
        console.log("stickerLayer created");
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const stickerLayer = new Layer(
                "sticker",
                src,
                this.width,
                this.height,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                2
            );
            this.layers.push(stickerLayer);
        };
    }

    addText(text, bold, strike, underline, font, color, size) {
        console.log("textLayer created");
        const textLayer = new Layer(
            "text",
            text,
            this.width,
            this.height,
            this.getLayer("image").width / 2,
            this.getLayer("image").height / 2,
            0,
            size * 2,
            0,
            0,
            2
        );
        textLayer.drawText(text, bold, strike, underline, font, color);
        this.layers.push(textLayer);
    }

    /** @param {{brightness, contrast, blur, saturate, grayscale}}  filter */
    setFilter(filter) {
        this.filter = filter;
        const filterString = `
            blur(${filter.blur}px)
            brightness(${filter.brightness / 100})
            contrast(${filter.contrast / 100})
            saturate(${filter.saturate / 100})
            grayscale(${filter.grayscale / 100})`;
        this.layers.forEach((layer) => {
            layer.ctx.filter = filterString;
        });
        this.draw();
    }

    save() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;

        this.layers.sort((a, b) => {
            const a_z = a.canvas.style.zIndex;
            const b_z = b.canvas.style.zIndex;
            if (a_z > b_z) return 1;
            else if (a_z < b_z) return -1;
            else return 0;
        });

        this.layers.forEach((layer) => {
            ctx.drawImage(layer.canvas, 0, 0);
        });
        const url = canvas.toDataURL("image/png");
        return url;
    }

    handleCropTouchStart(e) {
        console.log("CropTouch");
        const { x, y } = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );
        this.touched.x = x;
        this.touched.y = y;
        this.state = "";
        const hitBoxSize = this.width * HITBOX_SIZE;
        [
            { x: Page.touchLayer.x, y: Page.touchLayer.y },
            {
                x: Page.touchLayer.x,
                y: Page.touchLayer.y + Page.touchLayer.height,
            },
            {
                x: Page.touchLayer.x + Page.touchLayer.width,
                y: Page.touchLayer.y,
            },
            {
                x: Page.touchLayer.x + Page.touchLayer.width,
                y: Page.touchLayer.y + Page.touchLayer.height,
            },
        ].map((edge, i) => {
            if (
                x > edge.x - hitBoxSize / 2 &&
                x < edge.x + hitBoxSize / 2 &&
                y > edge.y - hitBoxSize / 2 &&
                y < edge.y + hitBoxSize / 2
            ) {
                this.state = "resize";
                this.edge = i;
                return;
            }
        });

        if (this.state != "resize") {
            if (
                x > Page.touchLayer.x &&
                x < Page.touchLayer.x + Page.touchLayer.width
            ) {
                if (
                    y > Page.touchLayer.y &&
                    y < Page.touchLayer.y + Page.touchLayer.height
                ) {
                    this.state = "move";
                    return;
                }
            }
            this.state = "";
        }
    }

    handleCropTouchMove(e) {
        const { x, y } = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );

        switch (this.state) {
            case "resize":
                switch (this.edge) {
                    case 0:
                        Page.touchLayer.x += x - this.touched.x;
                        Page.touchLayer.y += y - this.touched.y;
                        Page.touchLayer.width -= x - this.touched.x;
                        Page.touchLayer.height -= y - this.touched.y;
                        break;
                    case 1:
                        Page.touchLayer.x += x - this.touched.x;
                        Page.touchLayer.width -= x - this.touched.x;
                        Page.touchLayer.height += y - this.touched.y;
                        break;
                    case 2:
                        Page.touchLayer.y += y - this.touched.y;
                        Page.touchLayer.width += x - this.touched.x;
                        Page.touchLayer.height -= y - this.touched.y;
                        break;
                    case 3:
                        Page.touchLayer.width += x - this.touched.x;
                        Page.touchLayer.height += y - this.touched.y;
                        break;

                    default:
                        break;
                }
                this.touched = { x: x, y: y };
                break;

            case "move":
                Page.touchLayer.x += x - this.touched.x;
                Page.touchLayer.y += y - this.touched.y;
                this.touched = { x: x, y: y };
                break;

            default:
                break;
        }

        Page.drawCropBox();
    }

    handleDrawTouchStart(e) {
        this.touched = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );

        let drawLayer = this.getLayer("draw");
        if (!drawLayer) {
            console.log("drawLayer created.");
            drawLayer = new Layer(
                "draw",
                "",
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height,
                this.rotation
            );
            this.layers.push(drawLayer);
        }
        drawLayer.ctx.lineCap = "round";
        drawLayer.ctx.strokeStyle = Page.brushColor;
        drawLayer.ctx.lineWidth = Page.brushSize;

        switch (Page.state) {
            case "pen":
                drawLayer.ctx.globalCompositeOperation = "source-over";
                break;
            case "eraser":
                drawLayer.ctx.globalCompositeOperation = "destination-out";
                break;
            case "bucket":
                break;

            default:
                break;
        }
    }

    handleDrawTouchMove(e) {
        // draw layer xy에 그림.
        const { x, y } = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );
        const drawLayer = this.getLayer("draw");
        drawLayer.ctx.beginPath();

        drawLayer.ctx.moveTo(this.touched.x, this.touched.y);
        drawLayer.ctx.lineTo(x, y);
        this.touched.x = x;
        this.touched.y = y;

        drawLayer.ctx.stroke();
    }

    handleDrawTouchEnd() {
        const drawLayer = this.getLayer("draw");
        if (!drawLayer) return;
        drawLayer.ctx.globalCompositeOperation = "source-over";
        drawLayer.src = drawLayer.canvas.toDataURL();
        drawLayer.baseRotation = -drawLayer.rotation;
    }

    handleStickerTouchStart(e) {
        console.log("sticker touch");
        this.touched = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );
        const { x, y } = this.touched;
        const hitBoxSize = this.width * HITBOX_SIZE;
        const stickerLayers = this.getLayers("sticker");
        let exitFunction = false;

        if (this.selectedSticker) {
            [
                { x: this.selectedSticker.x, y: this.selectedSticker.y },
                {
                    x: this.selectedSticker.x,
                    y: this.selectedSticker.y + this.selectedSticker.height,
                },
                {
                    x: this.selectedSticker.x + this.selectedSticker.width,
                    y: this.selectedSticker.y,
                },
                {
                    x: this.selectedSticker.x + this.selectedSticker.width,
                    y: this.selectedSticker.y + this.selectedSticker.height,
                },
            ].map((edge, i) => {
                // selected sticker의 모서리 클릭인지
                if (
                    x > edge.x - hitBoxSize / 2 &&
                    x < edge.x + hitBoxSize / 2
                ) {
                    if (
                        y > edge.y - hitBoxSize / 2 &&
                        y < edge.y + hitBoxSize / 2
                    ) {
                        this.state = "resize";
                        this.edge = i;
                        exitFunction = true;
                        return;
                    }
                }
            });
        }
        if (exitFunction) return;

        stickerLayers.forEach((sticker) => {
            if (x > sticker.x && x < sticker.x + sticker.width) {
                if (y > sticker.y && y < sticker.y + sticker.height) {
                    this.state = "move";
                    this.selectedSticker = sticker;
                    Page.drawBox(this.selectedSticker);
                    exitFunction = true;
                }
            }
        });
        if (exitFunction) return;
        if (this.selectedSticker) {
            Page.touchLayer.clear();
            this.selectedSticker = null;
        }
    }

    handleStickerTouchMove(e) {
        if (!this.selectedSticker) return;
        const { x, y } = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );

        switch (this.state) {
            case "resize":
                switch (this.edge) {
                    case 0:
                        this.selectedSticker.x += x - this.touched.x;
                        this.selectedSticker.y += y - this.touched.y;
                        this.selectedSticker.width -= x - this.touched.x;
                        this.selectedSticker.height -= y - this.touched.y;
                        break;
                    case 1:
                        this.selectedSticker.x =
                            this.selectedSticker.x + x - this.touched.x;
                        this.selectedSticker.width -= x - this.touched.x;
                        this.selectedSticker.height += y - this.touched.y;
                        break;
                    case 2:
                        this.selectedSticker.y =
                            this.selectedSticker.y + y - this.touched.y;
                        this.selectedSticker.width += x - this.touched.x;
                        this.selectedSticker.height -= y - this.touched.y;
                        break;
                    case 3:
                        this.selectedSticker.width += x - this.touched.x;
                        this.selectedSticker.height += y - this.touched.y;
                        break;

                    default:
                        break;
                }
                break;

            case "move":
                this.selectedSticker.x += x - this.touched.x;
                this.selectedSticker.y += y - this.touched.y;
                break;

            default:
                break;
        }

        // draw sticker
        this.selectedSticker.clear();
        this.selectedSticker.draw();

        // draw sticker box
        Page.drawBox(this.selectedSticker);

        this.touched = { x, y };
    }

    handleStickerTouchEnd() {}

    handleTextTouchStart(e) {
        console.log("text touch");
        this.touched = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );
        const { x, y } = this.touched;
        const textLayers = this.getLayers("text");
        let exitFunction = false;

        // const hitBoxSize = this.width * HITBOX_SIZE;
        // if(this.selectedText){
        //     [
        //         {x: this.selectedText.x, y: this.selectedText.y},
        //         {x: this.selectedText.x, y: this.selectedText.y+this.selectedText.height},
        //         {x: this.selectedText.x+this.selectedText.width, y: this.selectedText.y},
        //         {x: this.selectedText.x+this.selectedText.width, y: this.selectedText.y + this.selectedText.height},
        //     ].map( (edge, i)=>{ // selected sticker의 모서리 클릭인지
        //         if(x > edge.x-hitBoxSize/2 && x < edge.x+hitBoxSize/2){
        //             if(y > edge.y-hitBoxSize/2 && y < edge.y+hitBoxSize/2){
        //                 this.state = "resize";
        //                 this.edge = i;
        //                 exitFunction = true;
        //                 return;
        //             }
        //         }
        //     })
        // }
        // if(exitFunction) return;

        textLayers.forEach((sticker) => {
            if (x > sticker.x && x < sticker.x + sticker.width) {
                if (y > sticker.y && y < sticker.y + sticker.height) {
                    this.state = "move";
                    this.selectedText = sticker;
                    Page.drawBox(this.selectedText);
                    exitFunction = true;
                }
            }
        });
        if (exitFunction) return;
        if (this.selectedText) {
            Page.touchLayer.clear();
            this.selectedText = null;
        }
    }

    handleTextTouchMove(e) {
        if (!this.selectedText) return;
        const { x, y } = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );

        // switch (this.state) {
        //     case "resize":
        //         switch (this.edge) {
        //             case 0:
        //                 this.selectedText.x += x - this.touched.x;
        //                 this.selectedText.y += y - this.touched.y;
        //                 this.selectedText.width -= x - this.touched.x;
        //                 this.selectedText.height -= y - this.touched.y;
        //                 break;
        //             case 1:
        //                 this.selectedText.x = this.selectedText.x + x - this.touched.x;
        //                 this.selectedText.width -= x - this.touched.x;
        //                 this.selectedText.height += y - this.touched.y;
        //                 break;
        //             case 2:
        //                 this.selectedText.y = this.selectedText.y + y - this.touched.y;
        //                 this.selectedText.width += x - this.touched.x;
        //                 this.selectedText.height -= y - this.touched.y;
        //                 break;
        //             case 3:
        //                 this.selectedText.width += x - this.touched.x;
        //                 this.selectedText.height += y - this.touched.y;
        //                 break;

        //             default:
        //                 break;
        //         }
        //         break;

        // case "move":
        this.selectedText.x += x - this.touched.x;
        this.selectedText.y += y - this.touched.y;
        //         break;

        //     default:
        //         break;
        // }

        // draw sticker
        this.selectedText.clear();
        this.selectedText.draw();

        // draw sticker box
        Page.drawBox(this.selectedText);

        this.touched = { x, y };
    }

    handleTextTouchEnd() {}

    async handleObjectTouchStart(e) {
        console.log("object touch");
        this.setObjectEditting(false);
        this.setLoading(true);
        Page.disableTouchLayer();
        this.touched = convertXY(
            this.width,
            this.height,
            e.touches[0].clientX,
            e.touches[0].clientY - e.target.offsetTop
        );
        const { x, y } = this.touched;
        console.log(x, y);

        const data = new FormData();
        let blob = await fetch(this.src).then((r) => r.blob());
        data.append("file", blob);
        try {
            const res = await axios.post(
                `http://${
                    process.env.NEXT_PUBLIC_AI_API
                }/ai/object_remove?x=${parseInt(
                    x - this.getLayer("image").x
                )}&y=${parseInt(y - this.getLayer("image").y)}`,
                data,
                { responseType: "blob" }
            );
            // unzip res.data
            const zip = new JSZip();
            const zipFiles = await zip.loadAsync(res.data);

            const fileData = await zipFiles.files["edited_image.jpg"].async(
                "blob"
            );
            console.log(fileData);
            // const blob2 = await fetch(`data:image/jpeg;base64,${fileData}`).then(r => r.blob());
            // console.log(blob2);

            this.setImage(URL.createObjectURL(fileData));
            this.src = URL.createObjectURL(fileData);
        } catch (err) {
            console.log(err);
        } finally {
            this.setLoading(false);
        }
    }
}

class Layer {
    static init() {
        this.preview = document.getElementById("preview");
    }

    constructor(
        type_,
        src_,
        canvasWidth_ = 0,
        canvasHeight_ = 0,
        x_ = 0,
        y_ = 0,
        width_ = 0,
        height_ = 0,
        rotation_ = 0,
        rightAngle_ = 0,
        zIndex_ = 1
    ) {
        this.type = type_;
        this.src = src_;
        this.x = x_;
        this.y = y_;
        this.width = width_;
        this.height = height_;
        this.rotation = rotation_;
        this.baseRotation = rightAngle_;

        this.canvas = document.createElement("canvas");
        this.canvas.width = canvasWidth_;
        this.canvas.height = canvasHeight_;
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = zIndex_;
        this.ctx = this.canvas.getContext("2d");
        if (type_ == "text") {
            this.text = src_;
        } else if (src_) {
            let image = new Image();
            image.src = src_;
            image.onload = () => {
                this.image = image;
                // this.width = image.width;
                // this.height = image.height;
                this.x = (this.canvas.width - this.width) / 2;
                this.y = (this.canvas.height - this.height) / 2;
                this.draw();
            };
        }

        Layer.preview.appendChild(this.canvas);
    }

    setImage(src) {
        let image = new Image();
        // console.log(this.src, " to ", src);
        this.src = src;
        image.src = src;
        image.onload = () => {
            this.image = image;
            this.draw();
        };
    }

    copy() {
        console.log("cloning rotation: ", this.rotation);
        let clone = new Layer(
            this.type,
            this.src,
            this.canvas.width,
            this.canvas.height,
            this.x,
            this.y,
            this.width,
            this.height,
            this.rotation,
            this.baseRotation
        );

        return clone;
    }

    draw() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(((this.rotation + this.baseRotation) * Math.PI) / 180);
        this.ctx.translate(-centerX, -centerY);

        if (this.type == "text") {
            this.clear();
            this.ctx.fillText(this.text, this.x, this.y + this.height - 12);
            this.ctx.restore();
        } else {
            let image = new Image();
            image.src = this.src;
            image.onload = () => {
                this.clear();
                this.ctx.drawImage(
                    image,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
                this.ctx.restore();
            };
        }
    }

    clear() {
        this.ctx.clearRect(
            -this.canvas.width,
            -this.canvas.height,
            this.canvas.width * 3,
            this.canvas.height * 3
        );
    }

    rotate(d, fixed) {
        if (fixed) this.baseRotation += d;
        else this.rotation += d;
    }

    drawText(text, bold, strike, underline, font, color) {
        // console.log(font);
        this.ctx.font = `${bold ? "bold" : ""} ${this.height}px ${
            font.class.style.fontFamily
        }`;
        // this.ctx.font = `${bold? "bold":""} 248px ${font.style.fontFamily}`;
        // console.log(this.ctx.font);
        // console.log(this.ctx.textBaseline)
        // if(strike) this.ctx.font += " strike";
        // if(underline) this.ctx.font += " underline";
        this.ctx.lineWidth = 10;
        this.ctx.textAlign = "cetner";
        this.ctx.fillStyle = color;
        this.width = this.ctx.measureText(text).width;
        this.ctx.fillText(text, this.x, this.y + this.height - 12);
    }
}

export { Page };
