var gl, shaderProgram, canvas;

// Setting default mode to drawing lines
var draw_lines = false;


// VBOs
var CubeVertexPositionBuffer;
var CubeVertexIndexBuffer;
var CylinderVertexPositionBuffer;
var CylinderVertexIndexBuffer;
var SphereVertexPositionBuffer;
var SphereVertexIndexBuffer;

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
    // Initialize Cube VBO
    var cube = GetCube(1);
    CubeVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertex.vertices), gl.STATIC_DRAW);
    CubeVertexPositionBuffer.itemSize = cube.vertex.itemSize;
    CubeVertexPositionBuffer.numItems = cube.vertex.numItems;
    CubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.index.indices), gl.STATIC_DRAW);
    CubeVertexIndexBuffer.itemSize = cube.index.itemSize
    CubeVertexIndexBuffer.numItems = cube.index.numItems;

    // Initialize Cylinder VBO
    var cylinder = GetCylinder(1, 1, 1);
    CylinderVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CylinderVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder.vertex.vertices), gl.STATIC_DRAW);
    CylinderVertexPositionBuffer.itemSize = cylinder.vertex.itemSize;
    CylinderVertexPositionBuffer.numItems = cylinder.vertex.numItems;
    CylinderVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CylinderVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinder.index.indices), gl.STATIC_DRAW);
    CylinderVertexIndexBuffer.itemSize = cylinder.index.itemSize
    CylinderVertexIndexBuffer.numItems = cylinder.index.numItems;

    // Initialize Sphere VBO
    var sphere = GetSphere(1);
    SphereVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.vertex.vertices), gl.STATIC_DRAW);
    SphereVertexPositionBuffer.itemSize = sphere.vertex.itemSize;
    SphereVertexPositionBuffer.numItems = sphere.vertex.numItems;
    SphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.index.indices), gl.STATIC_DRAW);
    SphereVertexIndexBuffer.itemSize = sphere.index.itemSize
    SphereVertexIndexBuffer.numItems = sphere.index.numItems;
}

function setUniforms(modelViewMatrix, color){
    gl.uniformMatrix4fv(shaderProgram.modelViewUniformMatrix, false, modelViewMatrix);    
    gl.uniformMatrix4fv(shaderProgram.projectionUniformMatrix, false, pMatrix);
    gl.uniform4fv(shaderProgram.colorUniform, color);
}

/*
Render figure using existing VBO based on figure shape, details
*/
function render(figure, modelViewMatrix, color) {
    var vertexBuffer, indexBuffer;

    switch(figure){
        case "cube":
            vertexBuffer = CubeVertexPositionBuffer;
            indexBuffer = CubeVertexIndexBuffer;
            break;
        case "cylinder":
            vertexBuffer = CylinderVertexPositionBuffer;
            indexBuffer = CylinderVertexIndexBuffer;
            break;
        case "sphere":
            vertexBuffer = SphereVertexPositionBuffer;
            indexBuffer = SphereVertexIndexBuffer;
            break;
        default:
            console.log("Invalid shape for figure");
            break;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    setUniforms(modelViewMatrix, color);
    
    if(draw_lines){
        gl.drawElements(gl.LINE_LOOP, indexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
    }
    else{
        gl.drawElements(gl.TRIANGLES, indexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
    }
}

var vMatrix = mat4.create();
var mMatrix = mat4.create();
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var x_step = 0.0;
var z_step = 0.0;
var lateral_step = 0.02

var yaw = mat4.create();
var pitch = mat4.create();
var roll = mat4.create();

var camPosition = [5, 2, 6];
var camCenter = [0, 0, 0];
var camUp = [0, 1, 0];
// Model to View 
mat4.lookAt(camPosition, camCenter, camUp, vMatrix);

// View to Projection 
mat4.perspective(60, 1.0, 0.1, 100, pMatrix);

// car cube 
var tank_length = 5.0;
var tank_width  = 2.0;
var tank_height = 1.0;

// rotations for mount and latch
cannon_deg = 0;
latch_deg = 0;

// angle step
angle_inc = 5;

// base cylinder 
var cabinHeight = 0.1;
var cabinRad = 1;
// cannon mount sphere  
var cannonHeight = 0.1;
// mount-cannon join
var mountBase = 0.2;
var cannonDegree = -45.0;

/*
Draws to canvas
*/
function drawScene() {

    var matrixStack = [];

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    
    mat4.identity(mMatrix); 
    // Object - TANK
    mat4.translate(mMatrix, [x_step, 0, z_step], mMatrix);

    pushMatrix(matrixStack, mMatrix);
        // tank base
        pushMatrix(matrixStack, mMatrix);
        mat4.scale(mMatrix, [tank_width, tank_height, tank_length], mMatrix);
        mat4.multiply(vMatrix, mMatrix, mvMatrix);
        render("cube", mvMatrix, [0.3, 0.9, 0, 1.0]);
        mat4.set(popMatrix(matrixStack), mMatrix); 
        // cabin
        mat4.translate(mMatrix, [0, 0.5, 0], mMatrix);
        pushMatrix(matrixStack, mMatrix);
            // cabin opening - black to emphasis cabin hole
            mat4.translate(mMatrix, [0, -0.02, 0], mMatrix);
            mat4.scale(mMatrix, [cabinRad+0.5, cabinHeight, cabinRad], mMatrix);
            mat4.translate(mMatrix, [0, 0, 1.5], mMatrix);
            mat4.multiply(vMatrix, mMatrix, mvMatrix);
            render("cube", mvMatrix, [0.0, 0.0, 0.0, 1.0]);
        mat4.set(popMatrix(matrixStack), mMatrix);
        pushMatrix(matrixStack, mMatrix);
        // cabin latch - rotates to show cabin opening
            mat4.rotate(mMatrix, degToRad(latch_deg), [0,0,1], mMatrix);
            mat4.scale(mMatrix, [cabinRad+0.4, cabinHeight, cabinRad-0.01], mMatrix);
            mat4.translate(mMatrix, [0, 0, 1.5], mMatrix);
            mat4.multiply(vMatrix, mMatrix, mvMatrix);
            render("cube", mvMatrix, [1.0, 1.0, 1.0, 1.0]);
        mat4.set(popMatrix(matrixStack), mMatrix);

        // cannon-mount sphere
        mat4.translate(mMatrix, [0, cannonHeight/2+mountBase/2, 0], mMatrix);
        mat4.rotate(mMatrix, degToRad(cannonDegree), [1,0,0], mMatrix);
        pushMatrix(matrixStack, mMatrix);
            mat4.scale(mMatrix, [0.6, 0.6, 0.6], mMatrix);
            mat4.translate(mMatrix, [0, 0, -0.4], mMatrix);
            mat4.rotate(mMatrix, degToRad(-25), [0,1,0], mMatrix);
            mat4.rotate(mMatrix, degToRad(cannon_deg), [1,1,1], mMatrix);
            mat4.multiply(vMatrix, mMatrix, mvMatrix);
            render("sphere", mvMatrix, [0.0, 0.0, 1.0, 1.0]);
            mat4.translate(mMatrix, [2.8, 0, 0], mMatrix);
            pushMatrix(matrixStack, mMatrix);
            // cannon
                mat4.scale(mMatrix, [4, 0.4, 0.5], mMatrix);
                mat4.rotate(mMatrix, degToRad(45), [1,0,0], mMatrix);
                mat4.multiply(vMatrix, mMatrix, mvMatrix);
                render("cylinder", mvMatrix, [0.0, 1.0, 1.0, 1.0]);
            mat4.set(popMatrix(matrixStack), mMatrix);
        mat4.set(popMatrix(matrixStack), mMatrix); 
}

window.onload = function () {
    canvas = document.getElementById("3d_transform-canvas");
    // init GL context, shaders and shader program
    initGL(canvas);
    shaderProgram = initShaders();
    gl.useProgram(shaderProgram);
    gl.enable(gl.DEPTH_TEST);

    // Get GLSL attributes and uniforms from vertex shader source
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.modelViewUniformMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.projectionUniformMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

    // Get GLSL attributes and uniforms from fragment shader source
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

    // set canvas BG color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // set up VBOs for each of the permitted 2D shapes
    initBuffers();

    // display canvas
    drawScene();

    document.addEventListener('keydown', onKeyDown);
}

function pushMatrix(stack, matrix) {
    stack.push(mat4.create(matrix)); 
}

function popMatrix(stack) {
    return(stack.pop()); 
}

function geometry(type) {

    if (type == 1){
        draw_lines = true;
    }
    else
        draw_lines = false;

    drawScene();
} 
