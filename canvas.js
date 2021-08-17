var canvas = document.getElementById('canvas');
var alpha = document.getElementById('alpha');
var mode = document.getElementById('mode');
// var screensInput = document.getElementById('screens'); //not implemented yet
var spreadInput = document.getElementById('spread');
var angleInput = document.getElementById('angle');
var dotSizeInput =  document.getElementById('dotSize');
var rowsInput = document.getElementById('rows');
var columnsInput = document.getElementById('columns');
// var proof = document.getElementById('proof');

//set initial values of sliders
// screensInput.value = 4; //4
columnsInput.value = 60; //18
rowsInput.value = 60;    //18
spreadInput.value = 24;   //24
dotSizeInput.value = 4;  //4
angleInput.value = 15;    //15

//show initial value of sliders
spreadInput.nextElementSibling.value = spreadInput.value;       //leave as string
dotSizeInput.nextElementSibling.value = dotSizeInput.value;     //leave as string
angleInput.nextElementSibling.value = angleInput.value +"\u00B0"; //leave as string
alpha.nextElementSibling.value = alpha.value;                   //leave as string

var cWidth = window.innerWidth - 2; //subtracting 2 for drawn border
var cHeight = window.innerHeight - 162; //subtracting 2 for drawn border and 87 for ui area

canvas.width = cWidth;
canvas.height = cHeight;

var ctx = canvas.getContext('2d');

//calculate center of canvas
var centerX = canvas.width/2;
var centerY = canvas.height/2;

//set up default values
var dotSize = dotSizeInput.valueAsNumber;
var radius = dotSize/2;
var spread = spreadInput.valueAsNumber; //spread should be distance from one dot's edge to the next dot's edge
var angle = angleInput.valueAsNumber*(Math.PI/180);
var rows = rowsInput.valueAsNumber;
var columns = columnsInput.valueAsNumber;
ctx.globalCompositeOperation = mode.value; //set blend mode


var colors = ['yellow', 'magenta', 'cyan', 'black'];
var cmyk = ["#FCEE0B","#B9529F","#6FCCDD",'black'];
var palette = colors;

var drawnWidth = ((dotSize+spread)*columns)-spread;
var drawnHeight = ((dotSize+spread)*rows)-spread;
var displacementX = (drawnWidth/2);
var displacementY = (drawnHeight/2);

function updateDrawnDimensions(){
    drawnWidth = ((dotSize+spread)*columns)-spread;
    drawnHeight = ((dotSize+spread)*rows)-spread;
    displacementX = (drawnWidth/2);
    displacementY = (drawnHeight/2);
}

spreadInput.onchange = function() {
                    spread = spreadInput.valueAsNumber;
                    spreadInput.nextElementSibling.value = spreadInput.value;
                    updateDrawnDimensions();
                    update();
}

angleInput.onchange = function() {
                    angle = angleInput.valueAsNumber*(Math.PI/180)
                    angleInput.nextElementSibling.value = angleInput.value +"\u00B0";
                    updateDrawnDimensions();
                    update();
                 };

dotSizeInput.onchange = function() {
                    dotSize = dotSizeInput.valueAsNumber;
                    radius = dotSize/2;
                    dotSizeInput.nextElementSibling.value = dotSizeInput.value;
                    updateDrawnDimensions();
                    update();
                 };

rowsInput.onchange = function() {
                    rows = rowsInput.valueAsNumber;
                    updateDrawnDimensions();
                    update();
                 };

columnsInput.onchange = function() {
                    columns = columnsInput.valueAsNumber;
                    updateDrawnDimensions();
                    update();
                 };

// proof.onchange = function() {
//                     if (proof.checked) {
//                         palette = cmyk;
//                     }
//                     else {
//                         palette = colors;
//                     }
//                     update();
//                  };

alpha.onchange = function() {
                    ctx.globalAlpha = alpha.valueAsNumber * 0.01;
                    alpha.nextElementSibling.value = alpha.value;
                    update();
                 };
mode.onchange = function() {
                    ctx.globalCompositeOperation = mode.value
                    update();
                 };

function drawDots(color) {
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            ctx.beginPath();
            ctx.arc(i*(spread+dotSize)+radius, j*(spread+dotSize)+radius, radius, 0, (Math.PI*2));
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
}

function clear() {
    ctx.clearRect(0, 0, cWidth, cHeight);
}

function drawCenter() {
    ctx.beginPath();
    ctx.moveTo(centerX,0);
    ctx.lineTo(centerX,canvas.height);
    ctx.moveTo(0,centerY);
    ctx.lineTo(canvas.width,centerY);
    ctx.stroke();
}

function update() {
    clear();
    ctx.save();
    palette.forEach((color,index) => {
        
        ctx.translate(centerX-displacementX, centerY-displacementY);
        drawDots(palette[index]);
        ctx.translate(-(centerX-displacementX),-(centerY-displacementY));
        ctx.translate(centerX-displacementX+(0.5*drawnWidth), centerY-displacementY+(0.5*drawnHeight));
        ctx.rotate(angle);
        ctx.translate(-(centerX-displacementX+(0.5*drawnWidth)), -(centerY-displacementY+(0.5*drawnHeight)));
        });
    ctx.restore();
}

update();


// function proofTest() {
//     clear();
//     ctx.save();
//     ctx.rotate(angle);
//     drawCircle(palette[0], radius*5, radius*0.75);
//     ctx.globalCompositeOperation = mode.value
//     drawCircle(palette[1], radius*5, radius*1.25);
//     ctx.globalCompositeOperation = mode.value
//     drawCircle(palette[2], radius*4.5, radius);
//     ctx.restore();
// }