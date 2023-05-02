function GetCube(size){  
    // x/y/z value based edge of cube centred at (0,0,0)
    var val = size / 2; 
    var vertex = {}, index = {};
    
    vertex.vertices = [
         val,  val, -val,
         -val,  val, -val, 
         -val, -val, -val,
         val, -val, -val,
         val,  val,  val,
         -val,  val,  val, 
         -val, -val,  val,
         val, -val,  val
     
     ];
    vertex.itemSize = 3;
    vertex.numItems = 8;

    index.indices = [0,1,2,
        0,2,3,
        0,3,7,
        0,7,4,
        6,2,3,
        6,3,7,
        5,1,2,
        5,2,6,
        5,1,0,
        5,0,4,
        5,6,7,
        5,7,4];
        
    index.itemSize = 1;
    index.numItems = 36;

    return {vertex, index};
}

function GetCylinder(topRadius, baseRadius, height, nSlice = 10, nStack = 30){
    var vertex = {}, index = {};
    vertex.vertices = [];
    index.indices = [];

    // vertices
    var radius = baseRadius;
    var sampleNum = 20;
    var halfHeight = height / 2;
    var circle_vertices = Array.from(Array(sampleNum).keys()).map((v, idx) => {
        let reg = 2 * Math.PI * idx / sampleNum;
        return [radius*Math.cos(reg)/2, radius*Math.sin(reg)/2];
    });
    var vertices = circle_vertices.map((v, idx) => {
        return [halfHeight, v[0], v[1]];
    });
    vertices = vertices.concat(circle_vertices.map((v, idx) => {
        return [-halfHeight, v[0], v[1]];
    }));
    
    vertex.vertices = vertices.flat();
    vertex.itemSize = 3;
    vertex.numItems = sampleNum * 2;
    bRad = topRadius
    sl = nSlice?nStack:0;

    //indices 
    var indices = Array.from(Array(sampleNum-1).keys()).map((v, idx) => {
        return [
            idx, idx+sampleNum, idx+sampleNum+1,
            idx, idx+1, idx+sampleNum+1,
        ];
    }).concat([
        sampleNum-1, 2*sampleNum-1, sampleNum,
        sampleNum-1, 0, sampleNum
    ]).flat();

    index.indices = indices;
    index.itemSize = 1;
    index.numItems = vertex.numItems * 3;

    return {vertex, index};
}

// Code to draw sphere partially borrowed from here:
// https://github.com/davidwparker/programmingtil-webgl/tree/master/0078-3d-sphere
// index computation for 3d sphere from a stackoverflow link

function GetSphere(radius, nSlice=20, nStack = 20) {
    var vertex = {}, index = {};
    vertex.vertices = [];
    index.indices = [];
    
    var aStep = Math.PI*2 / nSlice;
    var hStep = Math.PI / nStack;

    // vertices
    vertex.vertices.push(0.0, -radius, 0.0);
    for (var j = 1; j < nStack; j++){
        var h = -Math.PI/2 + hStep*j;
        for (var i = 0; i < nSlice; i++){
            var a = i * aStep;
            vertex.vertices.push(Math.cos(h) * Math.cos(a) * radius);
            vertex.vertices.push(Math.sin(h) * radius);
            vertex.vertices.push(Math.cos(h) * Math.sin(a) * radius);
        }        
    }
    vertex.vertices.push(0.0, radius, 0.0);

    vertex.itemSize = 3;
    vertex.numItems = nSlice * (nStack-1) + 2;

    // indices 
    for (var i = 0; i < nSlice; i++)
        index.indices.push(0, 1 + i, 1 + (i+1)%nSlice);
    for (var j = 0;  j < nStack-2; j++){
        for (var i=0; i<nSlice; i++){
            var start = j * nSlice + 1 + i;
            var next =  j * nSlice + 1 + (i+1)%nSlice;
            index.indices.push(start, next, start+nSlice);
            index.indices.push(next, next+nSlice, start+nSlice);
        }
    } 
    for (var i = 0; i < nSlice; i++){
        var start = (nStack-2) * nSlice + 1 + i;
        var next =  (nStack-2) * nSlice + 1 + (i+1)%nSlice;
        index.indices.push(start, next, nSlice * (nStack-1) + 1); 
    }   

    index.itemSize = 1;
    index.numItems = index.indices.length;

    return {vertex, index};
}
