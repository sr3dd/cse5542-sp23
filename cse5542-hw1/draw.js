var gl, shaderProgram, canvas;
var figures = [];
// Setting default figure type to 'point'
var setFigure = "point";
// Setting default figure color to 'red'
var figureColor = {r: 1.0, g: 0.0, b: 0.0 };

/* 
Initialize webGL context
*/
function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {

            }
    if (!gl) {
        alert("Could not initialise WebGL");
    }
}

/*
Render figure given 2-D coordinates and color information
*/
function render(figure) {
    // Get aspect ratio of the canvas
    var aspectRatio = gl.canvas.width/gl.canvas.height;

    // Get GLSL attributes and uniforms from shader source
    var uniformAspectPosition = gl.getUniformLocation(shaderProgram, "uAspectRatio"); 
    var vertexPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    var offsetUniformPosition = gl.getUniformLocation(shaderProgram, "uOffset");
    var colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");

    // Set shader uniforms
    gl.uniform1f(uniformAspectPosition, aspectRatio);
    gl.uniform2f(offsetUniformPosition, figure.offset[0], figure.offset[1]);
    gl.uniform4f(colorUniformLocation, figure.color[0], figure.color[1], figure.color[2], 1); 
    
    // Create, bind and populate vertex buffers
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(figure.positionArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexPosition);
    // Tell shader how to extract vertex info from buffer
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    // Draw figure
    gl.drawArrays(figure.primitive, 0, figure.numItems);
}

/*
Draws to canvas
*/
function drawScene() {
    // resizes canvas if window size has changed
    resizeCanvasToDisplaySize(gl.canvas);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(shaderProgram);
    // Loops over each figure to be rendered
    figures.forEach(render);
}

/*
Function to resize canvas based on window size

Code adapted from : WebGLFundamentals 
(https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html)

*/
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = window.innerWidth;
    const displayHeight = window.innerHeight;
 
    // Check if the canvas is not the same size.
    const needResize = canvas.width  != displayWidth || 
                     canvas.height != displayHeight;
 
    if (needResize) {
        // set canvas width and height to that of window
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
}

/*
Convert pixel coordinates (0-canvas.width, 0-canvas.height) to
WebGL coordinates (-1 to 1, -1 to 1)

event - mouse click on canvas
*/
function pixelInputToGLCoord(event, canvas) {
    // get pixel coordinates of mouse-click
    var x = event.clientX;
    var y = event.clientY;

    // get canvas center 
    var midX = canvas.width/2;
    var midY = canvas.height/2;

    // get position relative to viewport
    var rect = event.target.getBoundingClientRect();

    // converting to GL coordinates
    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;

    return {x:x,y:y};
}

/*
Triggers on mouse input
1. Convert mouse click coordinates to GL coordinates
2. Create a new figure centered at above coordinates
3. Draw to canvas
*/
function onmousedown(event) {
    var centerPoint = pixelInputToGLCoord(event, canvas);
    figures.push(createFigure(centerPoint.x, centerPoint.y, setFigure));
    drawScene();
}

/*
Assigns actions to user character input from keyboard
*/
function onKeyDown(event) {
    console.log(event.key);

    switch(event.key){
        case 'd':
            // Re-draws the canvas with the same state
            console.log("Re-displaying the screen");
            drawScene();
            break;
        case 'c':
            // Clears all figures and re-draws the canvas (blank canvas)
            console.log("Clearing the screen");
            figures = [];
            drawScene();
            break;
        case 'p':
            // Sets the figure type to be drawn to 'point'
            console.log("Drawing points");
            setFigure = "point"
            break;
        case 'h':
            // Sets the figure type to be drawn to 'horizontal'
            console.log("Draw a horizontal line");
            setFigure = "horizontal";
            break;
        case 'v':
            // Sets the figure type to be drawn to 'vertical'
            console.log("Draw a vertical line");
            setFigure = "vertical";
            break;
        case 't':
            // Sets the figure type to be drawn to 'triangle'
            console.log("Draw a triangle");
            setFigure = "triangle";
            break;
        case 'q':
            // Sets the figure type to be drawn to 'square'
            console.log("Draw a square");
            setFigure = "square";
            break;
        case 's':
            // Sets the figure type to be drawn to 'circle'
            console.log("Draw a circle");
            setFigure = "circle";
            break;
        case 'r':
            // Sets the global figure color to be drawn from now on to 'red'
            console.log("Setting color to red");
            figureColor.r = 1.0, figureColor.g = 0.0, figureColor.b = 0.0;
            break;
        case 'g':
            // Sets the global figure color to be drawn from now on to 'green'
            console.log("Setting color to green");
            figureColor.r = 0.0, figureColor.g = 1.0, figureColor.b = 0.0;
            break;
        case 'b':
            // Sets the global figure color to be drawn from now on to 'blue'
            console.log("Setting color to blue");
            figureColor.r = 0.0, figureColor.g = 0.0, figureColor.b = 1.0;
            break;
        default:
            console.log(`No action assigned to '${event.key}'`);
            break
    }
}

window.onload = function () {
    canvas = document.getElementById("draw-canvas");
    // init GL context, shaders and shader program
    initGL(canvas);
    shaderProgram = initShaders();
    // set canvas BG color to yellow
    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    // display canvas on load
    drawScene();
    // event listeners for keyboard and mouse input
    canvas.addEventListener('mousedown', onmousedown);
    document.addEventListener('keydown', onKeyDown);
}

window.onresize = function () {
    // re-draw canvas on window resize
    // drawScene() also adjusts canvas size and fixes the scaling of
    // vertex positions associated with each figure
    drawScene();
}
