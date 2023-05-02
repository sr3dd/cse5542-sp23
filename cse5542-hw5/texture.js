function initTextures() {
    modelTexture = gl.createTexture();
    modelTexture.image = new Image();
    modelTexture.image.onload = function(){
        handleTextureLoaded(modelTexture);
    }
    modelTexture.image.src = "model/d6165025.jpg";

    skyboxTexture_px = gl.createTexture();
    skyboxTexture_px.image = new Image();
    skyboxTexture_px.image.onload = function(){
        handleTextureLoaded(skyboxTexture_px);
    }
    skyboxTexture_px.image.src = cubemapTexture.px.src;

    skyboxTexture_nx = gl.createTexture();
    skyboxTexture_nx.image = new Image();
    skyboxTexture_nx.image.onload = function(){
        handleTextureLoaded(skyboxTexture_nx);
    }
    skyboxTexture_nx.image.src = cubemapTexture.nx.src;

    skyboxTexture_py = gl.createTexture();
    skyboxTexture_py.image = new Image();
    skyboxTexture_py.image.onload = function(){
        handleTextureLoaded(skyboxTexture_py);
    }
    skyboxTexture_py.image.src = cubemapTexture.py.src;

    skyboxTexture_ny = gl.createTexture();
    skyboxTexture_ny.image = new Image();
    skyboxTexture_ny.image.onload = function(){
        handleTextureLoaded(skyboxTexture_ny);
    }
    skyboxTexture_ny.image.src = cubemapTexture.ny.src;

    skyboxTexture_pz = gl.createTexture();
    skyboxTexture_pz.image = new Image();
    skyboxTexture_pz.image.onload = function(){
        handleTextureLoaded(skyboxTexture_pz);
    }
    skyboxTexture_pz.image.src = cubemapTexture.pz.src;

    skyboxTexture_nz = gl.createTexture();
    skyboxTexture_nz.image = new Image();
    skyboxTexture_nz.image.onload = function(){
        handleTextureLoaded(skyboxTexture_nz);
    }
    skyboxTexture_nz.image.src = cubemapTexture.nz.src;

    console.log("loading texture....")
}

function handleTextureLoaded(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initCubeMap(sky_dir){
    cubemapTexture = gl.createTexture();

    cubemapTexture.px = new Image();
    cubemapTexture.px.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'px');
    }
    cubemapTexture.px.src = `${sky_dir}/posx.jpg`;

    cubemapTexture.nx = new Image();
    cubemapTexture.nx.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'nx');
    }
    cubemapTexture.nx.src = `${sky_dir}/negx.jpg`;

    cubemapTexture.py = new Image();
    cubemapTexture.py.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'py');
    }
    cubemapTexture.py.src = `${sky_dir}/posy.jpg`;

    cubemapTexture.ny = new Image();
    cubemapTexture.ny.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'ny');
    }
    cubemapTexture.ny.src = `${sky_dir}/negy.jpg`;

    cubemapTexture.pz = new Image();
    cubemapTexture.pz.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'pz');
    }
    cubemapTexture.pz.src = `${sky_dir}/posz.jpg`;

    cubemapTexture.nz = new Image();
    cubemapTexture.nz.onload = function(){
        handleCubemapTextureLoaded(cubemapTexture, 'nz');
    }
    cubemapTexture.nz.src = `${sky_dir}/negz.jpg`;

    console.log("loading cubemap texture...");
}

function handleCubemapTextureLoaded(texture, type){
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    switch (type){
        case 'px':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, 
                gl.UNSIGNED_BYTE, texture.px);
            break;
        case 'nx':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, texture.nx);
            break;
        case 'py':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, texture.py);
            break;
        case 'ny':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, texture.ny);
            break;
        case 'pz':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, texture.pz);
            break;
        case 'nz':
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, texture.nz);
            break;
    } 
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function initJSON(name){
    var request = new XMLHttpRequest();
    request.open("GET", name+".json");
    request.onreadystatechange = 
      function (){
          if (request.readyState == 4){
              console.log("state = " + request.readyState);
              handleLoaded(JSON.parse(request.responseText), name);
          }
      }
    request.send();
}

function handleLoaded(data, name){
    console.log("int handleLoaded");
    var vertices = [];
    for (var i = 0; i < data.vertices.length; i++){
        vertices.push(data.vertices[i] * model_size);
    }
    for (var i = 0; i < vertices.length; i+=3){
        if (vertices[i+1] < model_base)
            model_base = vertices[i+1];
    }
    modelVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    modelVertexPositionBuffer.itemSize = 3;
    modelVertexPositionBuffer.numItems = vertices.length / 3;

    var texcoords = [];
    for (var i = 0; i < data.uvs[0].length; i+=2){
        texcoords.push(data.uvs[0][i]);
        texcoords.push(-data.uvs[0][i+1]);
    }
    modelVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    modelVertexTextureCoordBuffer.itemSize = 2;
    modelVertexTextureCoordBuffer.numItems = texcoords.length / 2;

    var indices = [];
    for (var i = 0; i < data.faces.length; i += 11){
        indices.push(data.faces[i+1]);
        indices.push(data.faces[i+2]);
        indices.push(data.faces[i+3]);
    }
    modelVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    modelVertexIndexBuffer.itemSize = 1;
    modelVertexIndexBuffer.numItems = indices.length;

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
    modelVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    modelVertexNormalBuffer.itemSize = 3;
    modelVertexNormalBuffer.numItems = normals.length / 3;

    drawScene();
}
