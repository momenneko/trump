console.log('にゃ〜ん')
const canvasW = 58 * 5;
const canvasH = 89 * 5;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var dragging = false;

window.onload = () => {
    init();
}

function drawTrump(ctx,x,y,w,h) {
    const corner = w / 10; 
    ctx.beginPath();
    ctx.moveTo(x+corner, y);
    ctx.lineTo(x+w-corner, y);
    ctx.arc(x+w-corner, y+corner, corner, 270 * Math.PI / 180, 0, false);
    ctx.lineTo(x+w, y+h-corner);
    ctx.arc(x+w-corner, y+h-corner, corner, 0, 90 * Math.PI / 180, false);
    ctx.lineTo(x+corner, y+h);
    ctx.arc(x+corner, y+h-corner, corner, 90 * Math.PI / 180, 180 * Math.PI / 180, false);
    ctx.lineTo(x, y+corner);
    ctx.arc(x+corner, y+corner, corner, 180 * Math.PI / 180, 270 * Math.PI / 180, false);
    
    ctx.closePath;
    ctx.stroke();
}
function init() {
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mousemove", onMouseMove, false);
    drawTrump(ctx, 0,0,58 * 5,89 * 5);
    ctx.beginPath();
    console.log('init');
}
function onMouseDown(e) {
    console.log(e);
    dragging = true;
}
function onMouseUp(e) {
    console.log(e);
    dragging = false;
}

function onMouseMove(e) {
    console.log(e);
    if (dragging) {
        
    }
}
function clear() {
    clearRect(0,0,canvasW,canvasH);
}

