var gl, shaderProgram, canvas;

// Setting default mode to drawing lines
var draw_lines = false;

// set up the parameters for lighting 
var light_ambient = [0.1, 0.1, 0.1]; 
var light_diffuse = [.8, .8, .8];
var light_specular = [1, 1, 1]; 
var world_light_position = [4, 1, 3];   // world space position
var light_size = 0.2;

var mat_ambient = [0.7, 0.7, 0.7, 1]; 
var mat_diffuse = [1, 1, 0, 1]; 
var mat_specular = [.9, .9, .9, 1]; 
var mat_shine = [50]; 

var model_base = 10;
var model_size = 1;
var model_position = [3,0,3.5];

// VBOs
// Cube primitive
var CubeVertexPositionBuffer;
var CubeVertexNormalBuffer;
var CubeVertexIndexBuffer;

// Cylinder primitive
var CylinderVertexPositionBuffer;
var CylinderVertexNormalBuffer;
var CylinderVertexIndexBuffer;

// Sphere primitive
var SphereVertexPositionBuffer;
var SphereVertexNormalBuffer;
var SphereVertexIndexBuffer;

// External Model VBOs
var ModelVertexPositionBuffer;
var ModelVertexNormalBuffer;
var ModelVertexIndexBuffer; 

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
    
    // Initialize external object buffer
    // 3D model of tank downloaded from:
    // https://rigmodels.com/model.php?view=Tank-3d-model__LINQSS8FNN3UF1XOZM6LIC43A

    initModel("model/tank.json");

    // Initialize Cube VBO
    var cube = GetCube(1);
    // vertices
    CubeVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertex.vertices), gl.STATIC_DRAW);
    CubeVertexPositionBuffer.itemSize = cube.vertex.itemSize;
    CubeVertexPositionBuffer.numItems = cube.vertex.numItems;
    // normals
    CubeVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.normal.normals), gl.STATIC_DRAW);
    CubeVertexNormalBuffer.itemSize = cube.normal.itemSize;
    CubeVertexNormalBuffer.numItems = cube.normal.numItems;
    // indices
    CubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.index.indices), gl.STATIC_DRAW);
    CubeVertexIndexBuffer.itemSize = cube.index.itemSize
    CubeVertexIndexBuffer.numItems = cube.index.numItems;

    // Initialize Cylinder VBO
    var cylinder = GetCylinder(1, 1, 1);
    // vertices
    CylinderVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CylinderVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder.vertex.vertices), gl.STATIC_DRAW);
    CylinderVertexPositionBuffer.itemSize = cylinder.vertex.itemSize;
    CylinderVertexPositionBuffer.numItems = cylinder.vertex.numItems;
    // normals
    CylinderVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CylinderVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinder.normal.normals), gl.STATIC_DRAW);
    CylinderVertexNormalBuffer.itemSize = cylinder.normal.itemSize;
    CylinderVertexNormalBuffer.numItems = cylinder.normal.numItems;
    // indices
    CylinderVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CylinderVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinder.index.indices), gl.STATIC_DRAW);
    CylinderVertexIndexBuffer.itemSize = cylinder.index.itemSize
    CylinderVertexIndexBuffer.numItems = cylinder.index.numItems;

    // Initialize Sphere VBO
    var sphere = GetSphere(1);
    // vertices
    SphereVertexPositionBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.vertex.vertices), gl.STATIC_DRAW);
    SphereVertexPositionBuffer.itemSize = sphere.vertex.itemSize;
    SphereVertexPositionBuffer.numItems = sphere.vertex.numItems;
    // normals
    SphereVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.normal.normals), gl.STATIC_DRAW);
    SphereVertexNormalBuffer.itemSize = sphere.normal.itemSize;
    SphereVertexNormalBuffer.numItems = sphere.normal.numItems;
    // indices
    SphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.index.indices), gl.STATIC_DRAW);
    SphereVertexIndexBuffer.itemSize = sphere.index.itemSize
    SphereVertexIndexBuffer.numItems = sphere.index.numItems;
}

function setUniforms(modelViewMatrix, normalMatrix, color = mat_diffuse){
    gl.uniformMatrix4fv(shaderProgram.modelViewUniformMatrix, false, modelViewMatrix);    
    gl.uniformMatrix4fv(shaderProgram.projectionUniformMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalUniformMatrix, false, normalMatrix);
    gl.uniform3f(shaderProgram.diffuseCoeffUniform, color[0], color[1], color[2]);
}

/*
Render figure using existing VBO based on figure shape, details
*/
function render(figure, modelViewMatrix, normalMatrix, color) {
    var vertexBuffer, normalBuffer, indexBuffer;

    switch(figure){
        case "cube":
            vertexBuffer = CubeVertexPositionBuffer;
            normalBuffer = CubeVertexNormalBuffer;
            indexBuffer = CubeVertexIndexBuffer;
            break;
        case "cylinder":
            vertexBuffer = CylinderVertexPositionBuffer;
            normalBuffer = CylinderVertexNormalBuffer;
            indexBuffer = CylinderVertexIndexBuffer;
            break;
        case "sphere":
            vertexBuffer = SphereVertexPositionBuffer;
            normalBuffer = SphereVertexNormalBuffer;
            indexBuffer = SphereVertexIndexBuffer;
            break;
        default:
            console.log("Invalid shape for figure");
            break;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                                vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                                normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    setUniforms(modelViewMatrix, normalMatrix, color);
    
    if(draw_lines){
        gl.drawElements(gl.LINE_LOOP, indexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
    }
    else{
        gl.drawElements(gl.TRIANGLES, indexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
    }
}

function renderModel(mvMatrix, nMatrix, color){
    gl.bindBuffer(gl.ARRAY_BUFFER, ModelVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, ModelVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ModelVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, ModelVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ModelVertexIndexBuffer);

    setUniforms(mvMatrix, nMatrix, color);

    gl.drawElements(gl.TRIANGLES, ModelVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

var translation = [0, 0, 0];
var scale = 1;

var vMatrix = mat4.create();
var mMatrix = mat4.create();
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var nMatrix = mat4.create();

var x_step = 0.0;
var z_step = 0.0;
var lateral_step = 0.02

var yaw = mat4.create();
var pitch = mat4.create();
var roll = mat4.create();

var camPosition = [6, 2, 8];
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
    mat4.translate(mMatrix, translation);
    mat4.scale(mMatrix, [scale, scale, scale]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);

    // this coeff and intensity is only for the light source - white light
    gl.uniform3f(shaderProgram.ambientCoeffUniform, 1, 1, 1);
    gl.uniform3f(shaderProgram.ambientIntensityUniform, 1, 1, 1);

    gl.uniform3f(shaderProgram.diffuseCoeffUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2]); 
    gl.uniform3f(shaderProgram.specularCoeffUniform, mat_specular[0], mat_specular[1], mat_specular[2]); 
    gl.uniform1f(shaderProgram.materialShineUniform, mat_shine[0]);
    gl.uniform3f(shaderProgram.diffuseIntensityUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2]); 
    gl.uniform3f(shaderProgram.specularIntensityUniform, light_specular[0], light_specular[1], light_specular[2]); 

    gl.uniform3f(shaderProgram.lightPositionUniform, world_light_position[0], world_light_position[1], world_light_position[2]); 	
    
    mat4.identity(mMatrix); 

    pushMatrix(matrixStack, mMatrix);
      mat4.translate(mMatrix, [world_light_position[0], world_light_position[1], world_light_position[2]], mMatrix);
      mat4.scale(mMatrix, [light_size, light_size, light_size], mMatrix);
      mat4.multiply(vMatrix, mMatrix, mvMatrix);
      nMatrix = computeNormalMatrix(mvMatrix);
      render("sphere", mvMatrix, nMatrix);
    mat4.set(popMatrix(matrixStack), mMatrix);

    // resetting ambient coeff and intensity for all other objects
    gl.uniform3f(shaderProgram.ambientCoeffUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2]); 
    gl.uniform3f(shaderProgram.ambientIntensityUniform, light_ambient[0], light_ambient[1], light_ambient[2]); 
    
    pushMatrix(matrixStack, mMatrix);
      mat4.translate(mMatrix, model_position, mMatrix);
      mat4.scale(mMatrix, [1, 1, 1], mMatrix);
      mat4.multiply(vMatrix, mMatrix, mvMatrix);
      nMatrix = computeNormalMatrix(mvMatrix);
      renderModel(mvMatrix, nMatrix, [0.4, 0.6, 0.7]);
    mat4.set(popMatrix(matrixStack), mMatrix);

    // Object - TANK
    mat4.translate(mMatrix, [x_step, 0, z_step], mMatrix);

    pushMatrix(matrixStack, mMatrix);
        // tank base
        pushMatrix(matrixStack, mMatrix);
        mat4.scale(mMatrix, [tank_width, tank_height, tank_length], mMatrix);
        mat4.multiply(vMatrix, mMatrix, mvMatrix);
        nMatrix = computeNormalMatrix(mvMatrix);
        render("cube", mvMatrix, nMatrix, [0.3, 0.9, 0, 1.0]);
        mat4.set(popMatrix(matrixStack), mMatrix); 
        // cabin
        mat4.translate(mMatrix, [0, 0.5, 0], mMatrix);
        pushMatrix(matrixStack, mMatrix);
            // cabin opening - black to emphasis cabin hole
            mat4.translate(mMatrix, [0, -0.02, 0], mMatrix);
            mat4.scale(mMatrix, [cabinRad+0.5, cabinHeight, cabinRad], mMatrix);
            mat4.translate(mMatrix, [0, 0, 1.5], mMatrix);
            mat4.multiply(vMatrix, mMatrix, mvMatrix);
            nMatrix = computeNormalMatrix(mvMatrix);
            render("cube", mvMatrix, nMatrix, [0.0, 0.0, 0.0, 1.0]);
        mat4.set(popMatrix(matrixStack), mMatrix);
        pushMatrix(matrixStack, mMatrix);
        // cabin latch - rotates to show cabin opening
            mat4.rotate(mMatrix, degToRad(latch_deg), [0,0,1], mMatrix);
            mat4.scale(mMatrix, [cabinRad+0.4, cabinHeight, cabinRad-0.01], mMatrix);
            mat4.translate(mMatrix, [0, 0, 1.5], mMatrix);
            mat4.multiply(vMatrix, mMatrix, mvMatrix);
            nMatrix = computeNormalMatrix(mvMatrix);
            render("cube", mvMatrix, nMatrix, [1.0, 1.0, 1.0, 1.0]);
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
            nMatrix = computeNormalMatrix(mvMatrix);
            render("sphere", mvMatrix, nMatrix, [0.0, 0.0, 1.0, 1.0]);
            mat4.translate(mMatrix, [2.8, 0, 0], mMatrix);
            pushMatrix(matrixStack, mMatrix);
            // cannon
                mat4.scale(mMatrix, [4, 0.4, 0.5], mMatrix);
                mat4.rotate(mMatrix, degToRad(45), [1,0,0], mMatrix);
                mat4.multiply(vMatrix, mMatrix, mvMatrix);
                nMatrix = computeNormalMatrix(mvMatrix);
                render("cylinder", mvMatrix, nMatrix, [0.0, 1.0, 1.0, 1.0]);
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

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // Matrix uniforms to Vertex Shader
    shaderProgram.modelViewUniformMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.projectionUniformMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.normalUniformMatrix = gl.getUniformLocation(shaderProgram, "uNormalMatrix");

    // Light properties as uniform variables in shader
    shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "lPosition");
    shaderProgram.ambientIntensityUniform = gl.getUniformLocation(shaderProgram, "uAmbientIntensity");	
    shaderProgram.diffuseIntensityUniform = gl.getUniformLocation(shaderProgram, "uDiffuseIntensity");
    shaderProgram.specularIntensityUniform = gl.getUniformLocation(shaderProgram, "uSpecularIntensity");
    
    // Material properties as uniform variables in shader
    shaderProgram.ambientCoeffUniform = gl.getUniformLocation(shaderProgram, "uAmbientCoeff");	
    shaderProgram.diffuseCoeffUniform = gl.getUniformLocation(shaderProgram, "uDiffuseCoeff");
    shaderProgram.specularCoeffUniform = gl.getUniformLocation(shaderProgram, "uSpecularCoeff");
    shaderProgram.materialShineUniform = gl.getUniformLocation(shaderProgram, "uShininess");

    // set canvas BG color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // set up VBOs for each of the permitted 2D shapes
    initBuffers();

    // display canvas
    //drawScene();

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
