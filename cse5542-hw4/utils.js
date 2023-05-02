/*
Function to compute the normal matrix: N-matrix = transpose(inverse(MV-matrix))
*/
function computeNormalMatrix(model) {
    xMatrix = mat4.create();
    mat4.identity(xMatrix);
    xMatrix = mat4.multiply(xMatrix, model); 	
    xMatrix = mat4.inverse(xMatrix);
    xMatrix = mat4.transpose(xMatrix);
    return xMatrix;
}

/*
Function to read a JSON file containing an external 3d model
Code taken from the Dr. Han-Wei Shen and Dr. Guo's CS5542 course
repository at https://github.com/hguo/WebGL-tutorial
*/

function initModel(file_path){
    var request = new XMLHttpRequest();
    request.open("GET", file_path);
    request.onreadystatechange = 
      function (){
          if (request.readyState == 4){
              console.log("state = " + request.readyState);
              LoadModel(JSON.parse(request.responseText));
          }
      }
    request.send();
}

/*
Function to load the vertices, indices, texture-coords and normals from the 
JSON file into VBOs
Code taken from the Dr. Han-Wei Shen and Dr. Guo's CS5542 course
repository at https://github.com/hguo/WebGL-tutorial
*/

function LoadModel(data){
    var vertices = [];
    for (var i = 0; i < data.vertices.length; i++){
        vertices.push(data.vertices[i] * model_size);
    }
    
    for (var i = 0; i < vertices.length; i+=3){
        if (vertices[i+1] < model_base)
            model_base = vertices[i+1];
    }

    ModelVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ModelVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    ModelVertexPositionBuffer.itemSize = 3;
    ModelVertexPositionBuffer.numItems = vertices.length / 3;

    var indices = [];
    for (var i = 0; i < data.faces.length; i += 11){
        indices.push(data.faces[i+1]);
        indices.push(data.faces[i+2]);
        indices.push(data.faces[i+3]);
    }

    ModelVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ModelVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    ModelVertexIndexBuffer.itemSize = 1;
    ModelVertexIndexBuffer.numItems = indices.length;

    // Code to compute normals 
    var normals = [];
    for (var i = 0; i < data.vertices.length; i++){
        normals.push(0.0);
    }
    for (var i = 0; i < indices.length; i+=3){
        var p1 = [
            data.vertices[indices[i]*3], 
            data.vertices[indices[i]*3+1], 
            data.vertices[indices[i]*3+2]
        ];
        var p2 = [
            data.vertices[indices[i+1]*3], 
            data.vertices[indices[i+1]*3+1], 
            data.vertices[indices[i+1]*3+2]
        ];
        var p3 = [
            data.vertices[indices[i+2]*3], 
            data.vertices[indices[i+2]*3+1], 
            data.vertices[indices[i+2]*3+2]
        ];
        var v1 = vector(p1, p2);
        var v2 = vector(p1, p3);
        var nn = vec3.cross(v1, v2);
        normals[indices[i]*3] += nn[0];  normals[indices[i]*3+1] += nn[1]; normals[indices[i]*3+2] += nn[2];
        normals[indices[i+1]*3] += nn[0];  normals[indices[i+1]*3+1] += nn[1]; normals[indices[i+1]*3+2] += nn[2];
        normals[indices[i+2]*3] += nn[0];  normals[indices[i+2]*3+1] += nn[1]; normals[indices[i+2]*3+2] += nn[2];
    }

    ModelVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ModelVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    ModelVertexNormalBuffer.itemSize = 3;
    ModelVertexNormalBuffer.numItems = normals.length / 3;

    drawScene();
}

// Function to create a vector of 2 points
function vector(a, b){
    return [-a[0]+b[0], -a[1]+b[1], -a[2]+b[2]];
}

/*
Function to convert degrees to radians
*/
function degToRad(degrees) {
    return degrees * Math.PI / 180;
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
Function to scale based on string specifying "up" or "down" scaling
*/
function scale(type){
    var scale, scaleMatrix;

    switch(type){
        case "up":
            var scale = [1.1, 1.1, 1.1];
            var scaleMatrix = [
                1.1, 0.0, 0.0, 0.0,
                0.0, 1.1, 0.0, 0.0,
                0.0, 0.0, 1.1, 0.0,
                0.0, 0.0, 0.0, 1.0
            ]
            break;
        case "down":
            var scale = [0.9, 0.9, 0.9];
            var scaleMatrix = [
                0.9, 0.0, 0.0, 0.0,
                0.0, 0.9, 0.0, 0.0,
                0.0, 0.0, 0.9, 0.0,
                0.0, 0.0, 0.0, 1.0
            ]
            break;
    }
    // scaling in local transformation mode
    // scales only recently added object
    if (!global_transform && !selection_mode){
        figures[figures.length-1].matrix = mat4.scale(figures[figures.length-1].matrix, scale);
    } 
    // scaling selected object only
    if (selection_mode && selected_figure_index != -1){
        figures[selected_figure_index].matrix = mat4.scale(figures[selected_figure_index].matrix, scale);
    }
    // scaling in global transformation mode
    // scales all objects added to canvas
    if(global_transform){
        for (var i = 0; i < figures.length; i++){
        mvMatrix = mat4.multiply(scaleMatrix, figures[i].matrix, figures[i].matrix);
        }
    }

    drawScene();
}

/*
Function to set color of objects on canvas
*/
function setColor(strColor){
    var color;

    switch(strColor){
        case "red":
            color = [1.0, 0.0, 0.0];
            break;
        case "green":
            color = [0.0, 1.0, 0.0];
            break;
        case "blue":
            color = [0.0, 0.0, 1.0];
            break;
        default:
            break;
    }
    // changes color of selected figure in selection mode
    if(selection_mode && selected_figure_index != -1){
        figures[selected_figure_index].color = color;
        console.log(`Set color of ${selected_figure_index} figure to ${color}`);
        drawScene();
    }
    // sets global color for new objects
    else{
        figureColor = color;
        console.log(`Set global figure color to ${color}`);
    }
}
