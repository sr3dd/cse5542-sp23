// Lab 5 - 3D Models and Texture Mapping
var gl;
var shaderProgram;

// Cube VBOs
var CubeVertexPositionBuffer;
var CubeVertexTextureCoordBuffer; 
var CubeVertexIndexBuffer;
var CubeVertexNormalBuffer;

// Model VBOs
var modelVertexPositionBuffer;
var modelVertexTextureCoordBuffer; 
var modelVertexNormalBuffer;
var modelVertexIndexBuffer; 

var modelTexture;

// Skybox textures (+/- xyz)
var skyboxTexture_px;
var skyboxTexture_nx;
var skyboxTexture_py;
var skyboxTexture_ny;
var skyboxTexture_pz;
var skyboxTexture_nz;

// variable to hold current texture
var texUniform;

// variable for cube map
var cubemapTexture;

// 0 - only lighting
// 1 - lighting + texture
// 2 - only texture
// 3 - cube mapping
var use_texture;


function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viweportHeight = canvas.height; 
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var vMatrix = mat4.create();
var mMatrix = mat4.create();
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var nMatrix = mat4.create();

// view to world space ==> (inverse(viewMatrix))
var v2wMatrix = mat4.create();

var yawMatrix = mat4.create();
var pitchMatrix = mat4.create();
var rollMatrix = mat4.create();

// camera zoom position
var cameraFrontMatrix = mat4.create();

// Viewing 
mat4.lookAt(camera_pos, [0,0,0], [0,1,0], vMatrix);

// Projection
mat4.perspective(60, 1.0, 0.1, 100, pMatrix);

var matrixStack = []; 

// for animation
let previousTime = 0.0;
let degreesPerSecond = 90.0;

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viweportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
    // light 
    gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(shaderProgram.light_colorUniform, light_color[0], light_color[1], light_color[2], light_color[3]);
    
    // draw skybox 
    drawSkybox();

    // draw light cube
    drawLightSource();

    // set model material properites and textures
    mat_ambient = [0.2, 0.2, 0.1, 1]; 
    mat_diffuse= [0.3, 0.4, 0.1, 1]; 
    mat_specular = [.5, .6, .2, 1]; 
    mat_shininess = [0.3]; 
    setMaterial();

    use_texture = tank_texture_mode;
    texUniform = modelTexture;

    mat4.identity(mMatrix); 
    mat4.translate(mMatrix, [global_x, 0, global_z], mMatrix);

    // Tank Fleet
    pushMatrix(mMatrix);
        mat4.scale(mMatrix, [model_scale, model_scale, model_scale], mMatrix);
        mat4.translate(mMatrix, [0, -y_pos/2, 0], mMatrix);
        mat4.rotate(mMatrix, degToRad(global_angle), [0, 1, 0], mMatrix);
        drawLoaded();
        // Sentry Tank
        pushMatrix(mMatrix);
            mat4.rotate(mMatrix, degToRad(sentry_angle), [0, 1, 0], mMatrix);
            mat4.translate(mMatrix, [-tank_offset, 0, 0], mMatrix);
            drawLoaded();
        mat4.set(popMatrix(), mMatrix); 
    mat4.set(popMatrix(), mMatrix); 
    
    if(animation_mode != 0){
        // Global tank fleet rotation - Patrol mode
        if(animation_mode == 1){
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Basic_2D_animation_example
            requestAnimationFrame((currentTime) => {
                const deltaAngle =
                  ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
            
                global_angle = (global_angle + deltaAngle) % 360;
            
                previousTime = currentTime;
                drawScene();
              });
        }
        // Sentry tank rotation - Sentry mode
        if(animation_mode == 2){
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Basic_2D_animation_example
            requestAnimationFrame((currentTime) => {
                const deltaAngle =
                  ((currentTime - previousTime) / 1000.0) * degreesPerSecond;
            
                  sentry_angle = (sentry_angle + deltaAngle) % 360;
            
                previousTime = currentTime;
                drawScene();
              });
        }
    }
}

// Reference: https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
function drawSkybox(){
    setMaterial();
    // skybox cubes need to be rendered with only their textures
    use_texture = 2;

    // posx
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [skyDis, 0, 0], mMatrix);
    mat4.scale(mMatrix, [1, 2*skyDis, 2*skyDis], mMatrix);
    texUniform = skyboxTexture_px;
    drawCube();

    // negx
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-skyDis, 0, 0], mMatrix);
    mat4.scale(mMatrix, [1, 2*skyDis, 2*skyDis], mMatrix);
    texUniform = skyboxTexture_nx;
    drawCube();

    // posy 
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [0, skyDis, 0], mMatrix);
    mat4.scale(mMatrix, [2*skyDis, 1, 2*skyDis], mMatrix);
    texUniform = skyboxTexture_py;
    drawCube();

    // negy
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [0, -skyDis, 0], mMatrix);
    mat4.scale(mMatrix, [2*skyDis, 1, 2*skyDis], mMatrix);
    texUniform = skyboxTexture_ny;
    drawCube();

    // posz 
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [0, 0, skyDis], mMatrix);
    mat4.scale(mMatrix, [2*skyDis, 2*skyDis, 1], mMatrix);
    texUniform = skyboxTexture_pz;
    drawCube();

    // negz
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [0, 0, -skyDis], mMatrix);
    mat4.scale(mMatrix, [2*skyDis, 2*skyDis, 1], mMatrix);
    texUniform = skyboxTexture_nz;
    drawCube();
}

function drawLightSource(){
    mat4.identity(mMatrix); 
    use_texture = 0;

    // setting light cube properties
    mat_ambient = [1.0, 1.0, 1.0, 1]; 
    mat_diffuse= [0.0, 0.0, 0, 1]; 
    mat_specular = [.0, .0, .0, 1]; 
    mat_shininess = [0.0];
    setMaterial();

    pushMatrix(mMatrix);
      mat4.translate(mMatrix, [light_pos[0], light_pos[1], light_pos[2]], mMatrix);
      mat4.scale(mMatrix, [light_size, light_size, light_size]);
      drawCube();
    mat4.set(popMatrix(), mMatrix); 
}

window.onload = function () {
    var canvas = document.getElementById("texture-canvas");
    initGL(canvas);
    initShaders();
    
    gl.enable(gl.DEPTH_TEST);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "aTexture");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");

    shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "lPosition");
    shaderProgram.light_colorUniform = gl.getUniformLocation(shaderProgram, "light_color");
    
    shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "aCoeff");
    shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "dCoeff");
    shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "sCoeff");
    shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

    initCubeMap('skybox/PiazzaDelPopolo1');
    shaderProgram.cubeMap_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");

    initTextures();
    shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "myTexture");
    shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");

    initJSON("model/tank2");
    
    createCube(1);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    document.addEventListener('keydown', onKeyDown, false);
}
