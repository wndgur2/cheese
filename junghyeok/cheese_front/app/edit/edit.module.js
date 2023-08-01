/** @type {Element} */
let canvasDom;
/** @type {Page} */
let currentPage;
/** @type {Array.<Page>} */
let pages = [];
/** @type {Element} */
let canvasWrapper;

const CANVAS_MARGIN = 1.08;

function createNewLayer(type=""){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvasWrapper.appendChild(canvas);

    return {canvas:canvas, ctx:ctx, type:type};
}

function cloneCanvas(oldCanvas) {
    let newCanvas = document.createElement('canvas');
    let ctx = newCanvas.getContext('2d');

    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    ctx.drawImage(oldCanvas, 0, 0);

    return newCanvas;
}

class Page{
    constructor(src){
        this.state = [];
        this.rotation = 0;
        this.rotateOffset = 0;

        this.pen = {x:0, y:0};

        this.image = new Image();
        this.image.src = src;

        this.baseLayer = createNewLayer("base");
        this.baseLayer.canvas.style.visibility = 'hidden';

        this.layers = [this.baseLayer];

        this.image.onload = ()=>{
            this.setCanvas(this.baseLayer.canvas);
            this.baseLayer.ctx.drawImage(this.image, this.imageX, this.imageY);
        }
    }

    setCanvas(canvas){
        const canvasRatio = canvasDom.offsetHeight/canvasDom.offsetWidth;
        if(this.image.width * canvasRatio > this.image.height){
            canvas.width = this.image.width * CANVAS_MARGIN;
            canvas.height = canvasDom.offsetHeight * CANVAS_MARGIN * this.image.width/canvasDom.offsetWidth;
        } else{
            canvas.height = this.image.height * CANVAS_MARGIN;
            canvas.width = canvasDom.offsetWidth * CANVAS_MARGIN * this.image.height/canvasDom.offsetHeight;
        }
        
        this.lineWidth = (canvas.width > canvas.height? canvas.width:canvas.height)/200;
        this.imageX = canvas.width/2 - this.image.width/2;
        this.imageY = canvas.height/2 - this.image.height/2;
    }

    hide(){
        this.layers.map((layer)=>{
            layer.canvas.style.visibility = 'hidden';
        })
    }

    startCrop(ratio){
        this.cropBoxLayer = createNewLayer("crop");
        this.cropBoxLayer.canvas.addEventListener('touchstart', handleCropBoxTouchStart);
        this.cropBoxLayer.canvas.addEventListener('touchmove', handleCropBoxTouchMove);
        this.cropBoxLayer.canvas.style.zIndex = this.layers.length;
        this.layers.push(this.cropBoxLayer);
        this.setCanvas(this.cropBoxLayer.canvas);

        this.cropBox = {
            x: this.imageX,
            y: this.imageY,
            width: this.image.width,
            height: this.image.height
        };

        this.drawCropBox();
    }

    crop(){
        if(!this.state.includes("crop")) return;
        this.layers.forEach(({canvas, ctx, type}, i) =>{
            switch(type){
                case "draw":
                    this.baseLayer.ctx.drawImage(canvas, 0, 0)
                    break;
                default:
                    break;
            }
        })

        // 기존 layer 에서 자를 부분 이미지 추출하기
        let croppedCanvas = document.createElement('canvas');
        let croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = this.cropBox.width;
        croppedCanvas.height = this.cropBox.height;
        croppedCtx.drawImage(
            this.baseLayer.canvas,
            this.cropBox.x,
            this.cropBox.y,
            this.cropBox.width,
            this.cropBox.height,
            0, 0, this.cropBox.width, this.cropBox.height
        );
        this.image = new Image();
        this.image.src = croppedCanvas.toDataURL();

        // 기존 layer clear하고 cropped image 그리기
        this.baseLayer.ctx.clearRect(0, 0, this.baseLayer.canvas.width, this.baseLayer.canvas.height);

        this.image.onload = ()=>{
            // this.setCanvas(this.baseLayer.canvas);
            this.layers.slice(0, this.layers.length).forEach((v)=>{this.setCanvas(v.canvas)})
            this.baseLayer.ctx.drawImage(this.image, this.imageX, this.imageY);
        }

        //cropbox layer 제거
        this.cropBoxLayer.canvas.remove();
        this.layers = this.layers.filter((v, i)=>i!=this.layers.length-1);
        this.state = this.state.filter((v)=>v!="crop");
    }

    cancelCrop(){
        if(this.state.includes("crop")){
            this.layers[this.layers.length-1].canvas.remove();
            this.layers = this.layers.filter((v, i)=>i!=this.layers.length-1);
            this.state = this.state.filter((v)=>v!="crop");
        }
    }

    drawCropBox(){
        let ctx = this.cropBoxLayer.ctx;

        ctx.fillStyle = "#0000004A";
        ctx.fillRect(0, 0, this.layers[0].canvas.width, this.layers[0].canvas.height);
        ctx.clearRect(this.cropBox.x,this.cropBox.y,this.cropBox.width,this.cropBox.height);
    
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = this.lineWidth;
        let lineLength = this.lineWidth * 10;

        ctx.beginPath();
    
        ctx.moveTo(this.cropBox.x + lineLength, this.cropBox.y);
        ctx.lineTo(this.cropBox.x, this.cropBox.y);
        ctx.lineTo(this.cropBox.x, this.cropBox.y + lineLength);
    
        ctx.moveTo(this.cropBox.x + lineLength, this.cropBox.y + this.cropBox.height);
        ctx.lineTo(this.cropBox.x, this.cropBox.y + this.cropBox.height);
        ctx.lineTo(this.cropBox.x, this.cropBox.y + this.cropBox.height - lineLength);
    
        ctx.moveTo(this.cropBox.x + this.cropBox.width - lineLength, this.cropBox.y);
        ctx.lineTo(this.cropBox.x + this.cropBox.width, this.cropBox.y);
        ctx.lineTo(this.cropBox.x + this.cropBox.width, this.cropBox.y + lineLength);
    
        ctx.moveTo(this.cropBox.x + this.cropBox.width - lineLength, this.cropBox.y + this.cropBox.height);
        ctx.lineTo(this.cropBox.x + this.cropBox.width, this.cropBox.y + this.cropBox.height);
        ctx.lineTo(this.cropBox.x + this.cropBox.width, this.cropBox.y + this.cropBox.height - lineLength);
    
        ctx.stroke();
    }

    handleCropTouchStart(xy){
        this.touchedXY = xy;
        const hitBoxSize = this.lineWidth * 40;
        
        let isResize = false;

        [
            {x: this.cropBox.x, y: this.cropBox.y},
            {x: this.cropBox.x, y: this.cropBox.y+this.cropBox.height},
            {x: this.cropBox.x+this.cropBox.width, y: this.cropBox.y},
            {x: this.cropBox.x+this.cropBox.width, y: this.cropBox.y+this.cropBox.height},
        ]
        .map((v, i)=>{
            if(xy.x > v.x-hitBoxSize/2 && xy.x < v.x+hitBoxSize/2){
                if(xy.y > v.y-hitBoxSize/2 && xy.y < v.y+hitBoxSize/2){
                    this.touchState = "resize";
                    this.cropBox.resizing_i = i;
                    isResize = true;
                    return;
                }
            }
        })
        if(!isResize){
            if(xy.x > this.cropBox.x && xy.x < this.cropBox.x + this.cropBox.width){
                if(xy.y > this.cropBox.y && xy.y < this.cropBox.y + this.cropBox.height){
                    this.touchState = "move";
                    return;
                }
            }
            this.touchState = "";
        }
    }

    handleCropTouchMove(xy){
        let lastLayer = this.layers[this.layers.length-1];
        lastLayer.ctx.clearRect(0, 0, lastLayer.canvas.width, lastLayer.canvas.height);

        switch (this.touchState) {
            case "resize":
                switch (this.cropBox.resizing_i) {
                    case 0:
                        this.cropBox.x += xy.x - this.touchedXY.x;
                        this.cropBox.y += xy.y - this.touchedXY.y;
                        this.cropBox.width -= xy.x - this.touchedXY.x;
                        this.cropBox.height -= xy.y - this.touchedXY.y;
                        break;
                    case 1:
                        this.cropBox.x += xy.x - this.touchedXY.x;
                        this.cropBox.width -= xy.x - this.touchedXY.x;
                        this.cropBox.height += xy.y - this.touchedXY.y;
                        break;
                    case 2:
                        this.cropBox.y += xy.y - this.touchedXY.y;
                        this.cropBox.width += xy.x - this.touchedXY.x;
                        this.cropBox.height -= xy.y - this.touchedXY.y;
                        break;
                    case 3:
                        this.cropBox.width += xy.x - this.touchedXY.x;
                        this.cropBox.height += xy.y - this.touchedXY.y;
                        break;
                
                    default:
                        break;
                }
                this.touchedXY = xy;
                break;
            
            case "move":
                this.cropBox.x += xy.x - this.touchedXY.x;
                this.cropBox.y += xy.y - this.touchedXY.y;
                this.touchedXY = xy;
                break;
        
            default:
                break;
        }

        this.drawCropBox();
    }

    handleDrawTouchStart(xy, color, strokeWidth){
        if(!this.state.includes("draw")) {
            this.state.push("draw");
            this.drawLayer = createNewLayer("draw");
            this.setCanvas(this.drawLayer.canvas);
            this.drawLayer.canvas.style.zIndex = this.layers.length;
            this.layers.push(this.drawLayer);
        }

        this.drawLayer.ctx.lineCap = 'round';
        this.drawLayer.ctx.lineWidth = strokeWidth;
        if(color){
            this.drawLayer.ctx.globalCompositeOperation="source-over";
            this.drawLayer.ctx.strokeStyle = color;
        }
        else this.drawLayer.ctx.globalCompositeOperation="destination-out";

        this.pen.x = xy.x;
        this.pen.y = xy.y;
    }

    handleDrawTouchMove(xy){
        this.drawLayer.ctx.beginPath();
      
        this.drawLayer.ctx.moveTo(this.pen.x, this.pen.y);
        this.drawLayer.ctx.lineTo(xy.x, xy.y);
        this.pen.x = xy.x;
        this.pen.y = xy.y;
      
        this.drawLayer.ctx.stroke();
    }

    handleBucketTouch(xy, color){
        console.log("startBucket");
    }

    rotate(d, fix=false){
        if(d==this.rotation) return;
        if(!this.state.includes("rotate")) this.state.push("rotate");
        this.layers.forEach(({canvas, ctx})=>{
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate((d-(this.rotation)) * Math.PI/180);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            
            let tmpCanvas = cloneCanvas(canvas);
            ctx.clearRect(-canvas.width, -canvas.height, canvas.width*3, canvas.height*3);
            ctx.drawImage(tmpCanvas, 0, 0);
            ctx.restore();
            tmpCanvas.remove();
        })

        if(!fix) this.rotation = d;
    }

    setFrame(src){
        if(!this.state.includes("frame")){
            this.state.push("frame");
            let newLayer = createNewLayer("frame");
            this.setCanvas(newLayer.canvas);
            this.frameLayer = newLayer;
            this.layers.splice(0, 0, newLayer);
            this.layers.forEach((v, i)=>{
                v.canvas.style.zIndex = i;
            })
        }
        
        // drawFrame
        let newImage = new Image();
        newImage.src = src;
        newImage.onload = ()=>{
            console.log(this.layers);
            this.frameLayer.ctx.drawImage(newImage, 0, 0, this.frameLayer.canvas.width, this.frameLayer.canvas.height);
        }
    }
}

function initCanvas(canvas_){
    canvasDom = canvas_.current;
    canvasWrapper = document.getElementById("preview")
}

function addPage(src){
    let newPage = new Page(src);
    pages.push(newPage);
}

function deletePage(pageIdx){
    pages[pageIdx].hide();
    pages = pages.filter((v, i)=>i!=pageIdx);
}

function loadPage(pageIdx){
    cancelCrop();
    currentPage?.hide();

    currentPage = pages[pageIdx];
    let page = pages[pageIdx];
    if(!page){
        console.log("drawPage no page.");
        return;
    }

    page.layers.map((layer)=>{
        layer.canvas.style.visibility = 'visible';
    })
}

function cropStart(ratio) {
    if(!currentPage || pages.length==0){ return;}
    if(!currentPage.state.includes("crop")){
        currentPage.startCrop(ratio);
        currentPage.state.push("crop");
    }
}

function hideCurrentCanvas(){
    currentPage?.hide();
}

function crop(){
    currentPage?.crop();
}

function cancelCrop(){
    currentPage?.cancelCrop();
}

function rotate(d){
    currentPage?.rotate(d);
}

function rotateFixed(d){
    currentPage?.rotate(currentPage.rotation + d, true);
}

function getRotation(pageIndex){
    return pages[pageIndex]?.rotation;
}

function setFrame(src){
    currentPage?.setFrame(src);
}

export {
    initCanvas, cropStart, crop, cancelCrop, hideCurrentCanvas,
    addPage, deletePage, loadPage, rotate, rotateFixed, getRotation,
    handlePenTouchStart, handleDrawTouchMove, handleEraserTouchStart, handleBucketTouchStart,
    setFrame
};

function handleCropBoxTouchStart(e){
    currentPage?.handleCropTouchStart(convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop));
}

function handleCropBoxTouchMove(e){
    currentPage?.handleCropTouchMove(convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop));
}

function handlePenTouchStart(e, color, strokeWidth){
    currentPage?.handleDrawTouchStart(
        convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop),
        color, strokeWidth
    );
}

function handleEraserTouchStart(e, strokeWidth){
    currentPage?.handleDrawTouchStart(
        convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop),
        "", strokeWidth
    );
}

function handleBucketTouchStart(e, color){
    currentPage?.handleBucketTouch(
        convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop),
        color
    );
}

function handleDrawTouchMove(e){
    currentPage?.handleDrawTouchMove(convertXYToCanvasSize(e.touches[0].clientX, e.touches[0].clientY - e.target.offsetTop));
}

function convertXYToCanvasSize(x, y){
    let newX = Math.round(x * currentPage.layers[0].canvas.width/canvasDom.offsetWidth);
    let newY = Math.round(y * currentPage.layers[0].canvas.height/canvasDom.offsetHeight);
    return {x: newX, y: newY};
}