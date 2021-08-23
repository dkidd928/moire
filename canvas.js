//hook DOM objects
const canvas            = document.getElementById('canvas');
const alpha             = document.getElementById('alpha');
const mode              = document.getElementById('mode');
const screensInput      = document.getElementById('screens');
const screensContainer  = document.getElementById("screensContainer");
const cwInput           = document.getElementById("clockwise");
const ccwInput          = document.getElementById("counterClockwise");
const animateSw         = document.getElementById("animateSw");


//set up screenArr to keep track of all generated screens
const screensArr    = [];


//set mins and maxs
const rowsMin       = 0;
const rowsMax       = 1600;
const columnsMin    = 0;
const columnsMax    = 1600;
const spreadMin     = 0;
const spreadMax     = 50;
const dotSizeMin    = 0;
const dotSizeMax    = 50;
const angleMin      = 0;
const angleMax      = 180;
const screensMin    = 0;
const screensMax    = 4;


//define palettes
const colors    = ['#00FFFF', '#FF00FF', '#FFFF00', '#000000'];
const cmyk      = ["#FCEE0B","#B9529F","#6FCCDD",'#000000'];
var palette     = colors;


//set up canvas width and height
var cWidth      = window.innerWidth  - 2; //subtracting 2 for drawn border
var cHeight     = window.innerHeight - 162; //subtracting 2 for drawn border and 87 for ui area
canvas.width    = cWidth;
canvas.height   = cHeight;


//hook canvas context
var ctx = canvas.getContext('2d');


//calculate center of canvas
var centerX = canvas.width/2;
var centerY = canvas.height/2;


var isAnimating = false;

//BEGIN-setup initial values-----------------------------------//
screensInput.value              = 4;
screensInput.oldvalue           = 4;
var screens                     = screensInput.value;
mode.value                      = "source-over";
ctx.globalCompositeOperation    = mode.value; //set blend mode
alpha.value                     = getRandomInt(75,100);
alpha.nextElementSibling.value  = alpha.value +"%";
ctx.globalAlpha                 = alpha.valueAsNumber * 0.01;
var rotationDirection           = "ccw";
cwInput.checked                 = false;
ccwInput.checked                = true;
//END---setup initial values-----------------------------------//


//BEGIN-functions called by Screens class----------------------//
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRotationDirection(angle) {
    if (rotationDirection == "ccw") {
        let convertedAngle = (-angle)%360;
        return convertedAngle;
    }
    else {
        return angle;
    }
}


function clear() {
    ctx.clearRect(0, 0, cWidth, cHeight);
}


function drawDots(screen) {
    for (var i = 0; i < screen.columns; i++) {
        for (var j = 0; j < screen.rows; j++) {
            ctx.beginPath();
            ctx.arc(i*(screen.spread+screen.dotSize)+screen.radius, j*(screen.spread+screen.dotSize)+screen.radius, screen.radius, 0, (Math.PI*2));
            ctx.fillStyle = screen.color;
            ctx.fill();
        }
    }
}
//END---functions called by Screens class----------------------//


function redrawScreens() {
    clear();
    screensArr.forEach((screen) => { screen.draw();});
}

function animate() {
    if (isAnimating) {
        requestAnimationFrame(animate);
        redrawScreens();
        screensArr.forEach((screen,index) => {
            if (Math.round(screen.angle) == 180) {
                screen.angle = 0;
            }
            screen.angle += (index*.2) +.1;
        });
    }
}

function play() {
    isAnimating = true;
    animate();
}

function pause() {
    isAnimating = false;
}



function isValidColor(colorInput) {
    const regex = new RegExp("#?[0-9|A-F|a-f]{6}");
    if (regex.test(colorInput.value)) {
        if (!(colorInput.value.slice(0,1) == '#')) {
            colorInput.value = '#' + colorInput.value;
        }
        return true;
    }
    else {
        return false;
    }
}


function updateRotation(){
    if (!cwInput.checked && ccwInput.checked) {
        rotationDirection = "ccw";
    }
    else if (!ccwInput.checked && cwInput.checked) {
        rotationDirection = "cw";
    }
    else {
        rotationDirection = "ccw";
    }
    redrawScreens();
}


function generateScreenId() {
    return "xxxxxx".replace(/x/g,function(c){var r = Math.random()*16|0,v = c == 'x' ? r : (r & 0x3 | 0x8);return v.toString(16)});
}


//BEGIN-on- functions------------------------------------------//
animateSw.onclick         = function() {
                            if (animateSw.value == "Animate") {

                                isAnimating = true;
                                animate();
                                animateSw.value = "Stop";
                            }
                            else {
                                isAnimating = false;
                                animateSw.value = "Animate";
                            }
                         };

screensInput.onfocus      = function() {
                            screensInput.oldvalue = screensInput.value;
                         };


screensInput.onchange   = function() {
                            if(checkScreenInput(screensInput)) {
                                screensInput.oldvalue = screensInput.value;
                                redrawScreens();
                            }
                            else {
                                screensInput.value = screensInput.oldvalue;
                            }
                         };

mode.onchange           = function() {
                            ctx.globalCompositeOperation = mode.value;
                            redrawScreens();
                         };

alpha.onchange          = function() {
                            ctx.globalAlpha = alpha.valueAsNumber * 0.01;
                            alpha.nextElementSibling.value = alpha.value+'%';
                            redrawScreens();
                         };

ccwInput.onchange       = function() {
                            updateRotation();
                         };

cwInput.onchange        = function() {
                            updateRotation();
                         };
//END---on- functions------------------------------------------//


//BEGIN-buildScreen function-----------------------------------//
function buildScreen(screen) {
    screensArr.push(screen);

    let id = "screen-"+screen.id;
    //create new screen div, set id
    let newScreen = document.createElement("div");
    newScreen.setAttribute("id", id);
    newScreen.setAttribute("class", "screen");

    //create and append controls to new screen div
    let anonDiv = document.createElement("div");
    newScreen.appendChild(anonDiv);

    let floatDiv = document.createElement("div");
    anonDiv.setAttribute("class", "colorFloat");
    anonDiv.appendChild(floatDiv);


    let colorInputLabel = document.createElement("label");
    colorInputLabel.setAttribute("for", id+"-color");
    colorInputLabel.innerText = "Color:"
    floatDiv.appendChild(colorInputLabel);

    let colorInput = document.createElement("input");
    colorInput.setAttribute("id", id+"-color");
    colorInput.setAttribute("class", "colorValue");
    colorInput.setAttribute("type", "text");
    colorInput.setAttribute("maxlength", 7);
    colorInput.value = screen.color;
    screen.colorInput = colorInput;
    floatDiv.appendChild(colorInput);

    colorInput.onfocus = function() {
        colorInput.oldvalue = colorInput.value;
     };

    colorInput.onchange = function() {
        if (isValidColor(colorInput)) {
            screen.color = colorInput.value;
            colorPicker.value = colorInput.value;
            colorInput.oldvalue = colorInput.value;
            redrawScreens();
        }
        else {
            alert("Please enter a hex color value using six hexadecimal digits");
            colorInput.value = colorInput.oldvalue;
        }
     };

    let colorPicker = document.createElement("input");
    colorPicker.setAttribute("id", id+"-colorPicker");
    colorPicker.setAttribute("class", "picker");
    colorPicker.setAttribute("type", "color");
    colorPicker.value = screen.color;
    screen.colorPicker = colorPicker;
    floatDiv.appendChild(colorPicker);
    floatDiv.append(document.createElement("br"));
    floatDiv.append(document.createElement("br"));

    colorPicker.onchange = function() {
        screen.color = colorPicker.value;
        colorInput.value = colorPicker.value;
        redrawScreens();
     };

    let rowsInputLabel = document.createElement("label");
    rowsInputLabel.setAttribute("for", id+"-rows");
    rowsInputLabel.innerText = "Number of rows:"
    newScreen.appendChild(rowsInputLabel);

    let rowsInput = document.createElement("input");
    rowsInput.setAttribute("id", id+"-rows");
    rowsInput.setAttribute("type", "number");
    rowsInput.setAttribute("min", rowsMin);
    rowsInput.setAttribute("max", rowsMax);
    rowsInput.value = screen.rows;
    screen.rowsInput = rowsInput;
    newScreen.appendChild(rowsInput);
    newScreen.append(document.createElement("br"));

    screen.rowsInput.onchange = function() {
        screen.rows = screen.rowsInput.valueAsNumber;
        screen.updateDrawnDimensions();
        redrawScreens();
    };

    let columnsInputLabel = document.createElement("label");
    columnsInputLabel.setAttribute("for", id+"-columns");
    columnsInputLabel.innerText = "Number of columns:";
    newScreen.appendChild(columnsInputLabel);

    let columnsInput = document.createElement("input");
    columnsInput.setAttribute("id", id+"-columns");
    columnsInput.setAttribute("type", "number");
    columnsInput.setAttribute("min", columnsMin);
    columnsInput.setAttribute("max", columnsMax);
    columnsInput.value = screen.columns;
    screen.columnsInput = columnsInput;
    newScreen.appendChild(columnsInput);
    newScreen.append(document.createElement("br"));

    screen.columnsInput.onchange = function() {
        screen.columns = screen.columnsInput.valueAsNumber;
        screen.updateDrawnDimensions();
        redrawScreens();
     };

    let spreadInputLabel = document.createElement("label");
    spreadInputLabel.setAttribute("for", id+"-spread");
    spreadInputLabel.innerText = "Spread:";
    newScreen.appendChild(spreadInputLabel);

    let spreadInput = document.createElement("input");
    spreadInput.setAttribute("id", id+"-spread");
    spreadInput.setAttribute("type", "range");
    spreadInput.setAttribute("min", spreadMin);
    spreadInput.setAttribute("max", spreadMax);
    spreadInput.value = screen.spread;
    screen.spreadInput = spreadInput;
    newScreen.appendChild(spreadInput);
    newScreen.appendChild(document.createElement("output"));
    spreadInput.nextElementSibling.value = spreadInput.value;
    newScreen.append(document.createElement("br"));

    screen.spreadInput.onchange = function() {
        screen.spread = screen.spreadInput.valueAsNumber;
        screen.spreadInput.nextElementSibling.value = screen.spreadInput.value;
        screen.updateDrawnDimensions();
        redrawScreens();
     };

    let dotSizeInputLabel = document.createElement("label");
    dotSizeInputLabel.setAttribute("for", id+"-dotSize");
    dotSizeInputLabel.innerText = "Dot size:";
    newScreen.appendChild(dotSizeInputLabel);

    let dotSizeInput = document.createElement("input");
    dotSizeInput.setAttribute("id", id+"-dotSize");
    dotSizeInput.setAttribute("type", "range");
    dotSizeInput.setAttribute("min", dotSizeMin);
    dotSizeInput.setAttribute("max", dotSizeMax);
    dotSizeInput.value = screen.dotSize;
    screen.dotSizeInput = dotSizeInput;
    newScreen.appendChild(dotSizeInput);
    newScreen.appendChild(document.createElement("output"));
    dotSizeInput.nextElementSibling.value = dotSizeInput.value;
    newScreen.append(document.createElement("br"));

    screen.dotSizeInput.onchange = function() {
        screen.dotSize = dotSizeInput.valueAsNumber;
        screen.radius = screen.dotSize/2;
        screen.dotSizeInput.nextElementSibling.value = screen.dotSizeInput.value;
        screen.updateDrawnDimensions();
        redrawScreens();
     };

    let angleInputLabel = document.createElement("label");
    angleInputLabel.setAttribute("for", id+"-angle");
    angleInputLabel.innerText = "Angle:";
    newScreen.appendChild(angleInputLabel);

    let angleInput = document.createElement("input");
    angleInput.setAttribute("id", id+"-angle");
    angleInput.setAttribute("type", "range");
    angleInput.setAttribute("min", angleMin);
    angleInput.setAttribute("max", angleMax);
    angleInput.value = screen.angle;
    screen.angleInput = angleInput;
    newScreen.appendChild(angleInput);
    newScreen.appendChild(document.createElement("output"));
    angleInput.nextElementSibling.value = angleInput.value +"\u00B0";
    newScreen.append(document.createElement("br"));

    screen.angleInput.onchange = function() {
        screen.angle = screen.angleInput.valueAsNumber;
        screen.angleInput.nextElementSibling.value = screen.angleInput.value +"\u00B0";
        screen.updateDrawnDimensions();
        redrawScreens();
     };

    // var alphaInputLabel = document.createElement("label");
    // alphaInputLabel.setAttribute("for", id+"-alpha");
    // alphaInputLabel.innerText = "Alpha:";
    // newScreen.appendChild(alphaInputLabel);

    // var alphaInput = document.createElement("input");
    // alphaInput.setAttribute("id", id+"-angle");
    // alphaInput.setAttribute("type", "range");
    // alphaInput.setAttribute("min", alphaMin);
    // alphaInput.setAttribute("max", alphaMax);
    // alphaInput.value = screen.alpha;
    // screen.alphaInput. alphaInput;
    // newScreen.appendChild(alphaInput);
    // newScreen.appendChild(document.createElement("output"));
    // alphaInput.nextElementSibling.value = alphaInput.value;
    // newScreen.append(document.createElement("br"));

    //append fully built screen to screensContainer
    screensContainer.appendChild(newScreen);
}
//END---buildScreen function-----------------------------------//



palette.forEach((color,index) => {
    addScreen(palette[index]);
    redrawScreens();
    });

function getRandomHexColor() {
    let hexArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    let hexColor = "";
    for (let i = 0; i < 6;i++) {
        hexColor += hexArr[getRandomInt(0,15)];
    }
    return '#' + hexColor;
}


function addScreen(color = getRandomHexColor(), angle = getRandomInt(0,180)) {
    let newScreen = new Screen(color, 50, 50, 5, 4, angle);
    buildScreen(newScreen);
}


function removeScreen() {
    let popped = screensArr.pop();
    screensContainer.removeChild(screensContainer.lastChild);
    console.log("removed "+popped.color + " screen");

}


function checkScreenInput(screensInput) {
    if (screensInput.valueAsNumber > screensMax) {
        return false;
    }
    else if (screensInput.valueAsNumber < screensMin) {
        return false;
    }
    else{
        if (screensInput.valueAsNumber > screensInput.oldvalue) {
            let calls = screensInput.valueAsNumber - screensInput.oldvalue;
            for (let i = 0; i < calls; i++) {
                addScreen();
            }
        }
        if (screensInput.oldvalue > screensInput.valueAsNumber) {
            let calls = screensInput.oldvalue - screensInput.valueAsNumber;
            for (let i = 0; i < calls; i++) {
                if (screensArr.length > 0) {
                    removeScreen(screensArr[screensArr.length-1]);
                }
            }
        }
        return true;
    }
}


//BEGIN-ancillary/unused/unimplemented-------------------------//
function drawCenter() {
    ctx.beginPath();
    ctx.moveTo(centerX,0);
    ctx.lineTo(centerX,canvas.height);
    ctx.moveTo(0,centerY);
    ctx.lineTo(canvas.width,centerY);
    ctx.stroke();
}

function destroyScreens(){
    while (screensContainer.firstChild) {
        screensContainer.removeChild(screensContainer.lastChild);
    }
    clear();
}



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


// proof.onchange = function() {
//                     if (proof.checked) {
//                         palette = cmyk;
//                     }
//                     else {
//                         palette = colors;
//                     }
//                     update();
//                  };

//END---ancillary/unused/unimplemented-------------------------//


//BEGIN-Screen class-------------------------------------------//
function Screen(color, rows, columns, spread, dotSize, angle) {
    this.id      = generateScreenId();
    this.color   = color;
    this.rows    = rows;
    this.columns = columns;
    this.spread  = spread;
    this.dotSize = dotSize;
    this.radius  = this.dotSize/2;
    this.angle   = angle;

    this.drawnWidth    = ((this.dotSize+this.spread)*this.columns)-this.spread;
    this.drawnHeight   = ((this.dotSize+this.spread)*this.rows)-this.spread;
    this.displacementX = (this.drawnWidth/2);
    this.displacementY = (this.drawnHeight/2);

    this.rowsInput    = null;
    this.columnsInput = null;
    this.spreadInput  = null;
    this.dotSizeInput = null;
    this.angleInput   = null;

    this.updateDrawnDimensions = function() {
        this.drawnWidth    = ((this.dotSize+this.spread)*this.columns)-this.spread;
        this.drawnHeight   = ((this.dotSize+this.spread)*this.rows)-this.spread;
        this.displacementX = (this.drawnWidth/2);
        this.displacementY = (this.drawnHeight/2);
    }

    this.draw = function() {
        ctx.save();
        ctx.translate(centerX-this.displacementX+(0.5*this.drawnWidth), centerY-this.displacementY+(0.5*this.drawnHeight));
        ctx.rotate(getRotationDirection(this.angle)*Math.PI/180);
        ctx.translate(-(centerX-this.displacementX+(0.5*this.drawnWidth)), -(centerY-this.displacementY+(0.5*this.drawnHeight)));
        ctx.translate(centerX-this.displacementX, centerY-this.displacementY);
        drawDots(this);
        ctx.translate(-(centerX-this.displacementX),-(centerY-this.displacementY));
        ctx.restore();
    }
}
//END---Screen class-------------------------------------------//