const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const undo = document.getElementById("undo");

const INITIAL_COLOR = "2c2c2c";
const CANVA_SIZE = 700;

canvas.width = CANVA_SIZE;
canvas.height = CANVA_SIZE;

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

ctx.fillStyle="white";
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.fillRect(0, 0, CANVA_SIZE, CANVA_SIZE);
ctx.lineWidth = 2.5;


let filling = false;


let previous = { x: 0, y: 0 };
let drawing = false;
let pathsry = [];
let points = [];
let mouse = { x: 0, y: 0 };


// a function to detect the mouse position




function handleCanvasClick(){
  if(filling){
      ctx.fillRect(0,0,CANVA_SIZE,CANVA_SIZE);
  }
}
function handleCM(event){
  event.preventDefault();
}
function handleColorClick(event){
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}
function handeRangeChange(event){
  const size = event.target.value;
  ctx.lineWidth = size;
}
function handleModeClick(){
  if(filling === true){
      filling = false;
      mode.innerText = "Fill"
  }else{
      filling = true;
      mode.innerText = "Paint";
  }
}

function handleSaveClick(){
  const image = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS";
  link.click();
}



if (canvas) {
  
  function oMousePos(canvas, evt) {
    let ClientRect = canvas.getBoundingClientRect();
    return { //objeto
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
  }



  canvas.addEventListener('mousedown', function (e) {
    drawing = true;
    previous = { x: mouse.x, y: mouse.y };
    mouse = oMousePos(canvas, e);
    points = [];
    points.push({ x: mouse.x, y: mouse.y })
  });

  canvas.addEventListener('mousemove', function (e) {
    if (drawing) {
      previous = { x: mouse.x, y: mouse.y };
      mouse = oMousePos(canvas, e);
      // saving the points in the points array
      points.push({ x: mouse.x, y: mouse.y })
      // drawing a line from the previous point to the current point
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }, false);


  canvas.addEventListener('mouseup', function () {
    drawing = false;
    // Adding the path to the array or the paths
    pathsry.push(points);
  }, false);

  function stopPainting(){
    drawing=false;
}




  canvas.addEventListener("mouseleave", stopPainting);

  canvas.addEventListener("click",handleCanvasClick);
  canvas.addEventListener("contextmenu",handleCM);

}


function drawPaths() {
  // delete everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw all the paths in the paths array
  pathsry.forEach(path => {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  })
}

function Undo() {
  // remove the last path from the paths array
  pathsry.splice(-1, 1);
  // draw all the paths in the paths array
  drawPaths();
}


undo.addEventListener("click", Undo);


Array.from(colors).forEach(color => 
  color.addEventListener("click",handleColorClick));
if(range){
  range.addEventListener("input", handeRangeChange)
}
if(mode){
  mode.addEventListener("click",handleModeClick);
}
if(saveBtn){
  saveBtn.addEventListener("click",handleSaveClick);
}

