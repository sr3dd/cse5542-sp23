var gl, shaderProgram, canvas;
var figures = [];
// Setting default figure type to 'point'
var figureShape = "point";
// Setting default figure color to 'red'
var figureColor = [1.0, 0.0, 0.0];
// Setting default transform mode to local
var global_transform = false;
// Setting default selection mode to false
var selection_mode = false;

var selected_figure_index = -1;

// VBOs
var pointVertexBuffer;
var lineVertexBuffer;
var squareVertexBuffer;
var triangleVertexBuffer;
var circleVertexBuffer;

var prevMouseX = 0, prevMouseY = 0;

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
Initialize and setup VBOs for each permitted shape
*/
function initBuffers(){
    var point = createFigure("point");
    pointVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point.positionArray), gl.STATIC_DRAW);
    pointVertexBuffer.itemSize = point.itemSize;
    pointVertexBuffer.numItems = point.numItems;
    pointVertexBuffer.type = point.primitive;

    var line = createFigure("line");
    lineVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.positionArray), gl.STATIC_DRAW);
    lineVertexBuffer.itemSize = line.itemSize;
    lineVertexBuffer.numItems = line.numItems;
    lineVertexBuffer.type = line.primitive;

    var square = createFigure("square");
    squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square.positionArray), gl.STATIC_DRAW);
    squareVertexBuffer.itemSize = square.itemSize;
    squareVertexBuffer.numItems = square.numItems;
    squareVertexBuffer.type = square.primitive;

    var triangle = createFigure("triangle");
    triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle.positionArray), gl.STATIC_DRAW);
    triangleVertexBuffer.itemSize = triangle.itemSize;
    triangleVertexBuffer.numItems = triangle.numItems;
    triangleVertexBuffer.type = triangle.primitive;
}

/*
Render figure using existing VBO based on figure shape, details
*/
function render(figure) {
    var vertexBuffer;

    switch(figure.shape){
        case "point":
            vertexBuffer = pointVertexBuffer;
            break;
        case "horizontal":
        case "vertical":
            vertexBuffer = lineVertexBuffer;
            break;
        case "square":
            vertexBuffer = squareVertexBuffer;
            break;
        case "triangle":
            vertexBuffer = triangleVertexBuffer;
             break;
        case "circle":
            vertexBuffer = circleVertexBuffer;
            break;
        default:
            console.log("Invalid shape for figure");
            break;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(shaderProgram.modelUniformMatrix, false, figure.matrix);
    gl.uniform4f(shaderProgram.colorUniformLocation, figure.color[0], 
                                    figure.color[1], figure.color[2], 1);
    gl.drawArrays(vertexBuffer.type, 0, vertexBuffer.numItems);
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

window.onload = function () {
    canvas = document.getElementById("2d_transform-canvas");
    // init GL context, shaders and shader program
    initGL(canvas);
    shaderProgram = initShaders();

    // Get GLSL attributes and uniforms from shader source
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    shaderProgram.modelUniformMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");

    // Set shader uniforms
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // set canvas BG color to yellow
    gl.clearColor(1.0, 1.0, 0.0, 1.0);

    // set up VBOs for each of the permitted 2D shapes
    initBuffers();

    // display canvas
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
