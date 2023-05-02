function setMatrixUniforms(){
    // mvMatrix
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
    // nMatrix = transpose(inverse(mvMatrix))
    mat4.inverse(mvMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);
    // v2wMatrix = inverse(vMatrix)
    mat4.inverse(vMatrix, v2wMatrix);

    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    gl.uniformMatrix4fv(shaderProgram.v2wMatrixUniform, false, v2wMatrix);
}

function drawCube(){
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, CubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, CubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, CubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CubeVertexIndexBuffer);

    setMatrixUniforms();

    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);

    // texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texUniform);
    gl.uniform1i(shaderProgram.textureUniform, 0);

    // cube map texture
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    gl.uniform1i(shaderProgram.cubeMap_textureUniform, 1);

    gl.drawElements(gl.TRIANGLES, CubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawLoaded(){
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, modelVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, modelVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, modelVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelVertexIndexBuffer);

    setMatrixUniforms();

    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);

    // texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texUniform);
    gl.uniform1i(shaderProgram.textureUniform, 0);

    // cube map texture
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    gl.uniform1i(shaderProgram.cubeMap_textureUniform, 1);

    gl.drawElements(gl.TRIANGLES, modelVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function setMaterial(){
    gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], mat_ambient[3]);
    gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], mat_diffuse[3]);
    gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], mat_specular[3]);
    gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shininess[0]);
}

function createCube(size){  
    var rad = size / 2; 
    var vertices = [
          rad, rad, rad,    -rad, rad, rad,     -rad, -rad, rad,    rad, -rad, rad, // front 
          rad, rad, rad,    rad, -rad, rad,     rad, -rad, -rad,    rad, rad, -rad, // right
          rad, -rad, -rad,  rad, rad, -rad,     -rad, rad, -rad,    -rad,-rad,-rad,// back
          -rad, rad, rad,   -rad, -rad, rad,    -rad, rad, -rad,    -rad, -rad, -rad,// left
          rad, rad, rad,    -rad, rad, rad,     rad, rad, -rad,     -rad, rad, -rad, // up 
          -rad, -rad, rad,  rad, -rad, rad,     rad, -rad, -rad,    -rad, -rad, -rad// bottom 
    ];
    CubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    CubeVertexPositionBuffer.itemSize = 3;
    CubeVertexPositionBuffer.numItems = 24;


    var texcoords = [
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  0.0, 1.0, // front 
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  0.0, 0.0, // right
        1.0, 1.0,   1.0, 0.0,   0.0, 0.0,  0.0, 1.0, // back
        0.0, 0.0,   0.0, 1.0,   1.0, 0.0,  1.0, 1.0, // left
        1.0, 0.0,   0.0, 0.0,   1.0, 1.0,  0.0, 1.0, // up 
        0.0, 1.0,   1.0, 1.0,   1.0, 0.0,  0.0, 0.0// bottom 
    ];
    CubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    CubeVertexTextureCoordBuffer.itemSize = 2;
    CubeVertexTextureCoordBuffer.numItems = 24;

    var normals = [
          0.0, 0.0, 1.0,    0.0, 0.0, 1.0,     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // front 
          1.0, 0.0, 0.0,    1.0, 0.0, 0.0,     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // right
          0.0, 0.0, -1.0,   0.0, 0.0, -1.0,    0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  // back
          -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0, // left
          0.0, 1.0, 0.0,    0.0, 1.0, 0.0,     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // up
          0.0, -1.0, 0.0,   0.0, -1.0, 0.0,    0.0, -1.0, 0.0,  0.0, -1.0, 0.0,// bottom 
    ];
    CubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    CubeVertexNormalBuffer.itemSize = 3;
    CubeVertexNormalBuffer.numItems = 24;

    var indices = [
        0, 1, 2,        0, 2, 3, // front
        4, 5, 6,        4, 6, 7, // right
        8, 10, 9,       8, 11, 10, // back
        12, 14, 15,     12, 15, 13, // left
        16, 19, 18,     16, 17, 19, // up 
        20, 23, 22,     20, 22, 21  // bottom
    ];
    CubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    CubeVertexIndexBuffer.itemSize = 1;
    CubeVertexIndexBuffer.numItems = 36;
}
