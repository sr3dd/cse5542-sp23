function GetCube(size){  
    // x/y/z value based edge of cube centred at (0,0,0)
    var val = size / 2; 
    var vertex = {}, normal = {}, index = {};
    
    vertex.vertices  = [
         val,  val, -val, // v0
         -val,  val, -val, // v1
         -val, -val, -val, // v2
         val, -val, -val, // v3
         val,  val,  val, // v4
         -val,  val,  val, // v5
         -val, -val,  val, // v6
         val, -val,  val // v7
     ];

     index.indices = [
        0,1,2, // back - first
        0,2,3, // back - second
        0,3,7, // right - first
        0,7,4, // right - second
        6,2,3, // bottom - first
        6,3,7, // bottom - second
        5,1,2, // left - first
        5,2,6, // left - second
        5,1,0, // top - first
        5,0,4, // top - second
        5,6,7, // front - first
        5,7,4 // front - second
    ];    
    index.itemSize = 1;
    index.numItems = 36;

    // vertex.vertices = [
    //     val, val, -val,     -val,  val, -val,     -val, -val, -val,     val, -val, -val, // back
    //     val,  val, -val,    val, -val, -val,    val,  val,  val,    val, -val,  val,    // right
    //     -val, -val,  val,   -val, -val, -val,   val, -val, -val,    val, -val,  val,    // bottom
    //     -val,  val,  val,   -val,  val, -val,   -val, -val, -val,   -val, -val,  val,   // left
    //     -val,  val,  val,   val,  val, -val,    -val,  val, -val,   val,  val,  val,    // top
    //     -val,  val,  val,   val,  val,  val,    -val, -val,  val,   val, -val,  val     // front
    // ];

    //console.log(vertex.vertices.length);
    vertex.itemSize = 3;
    vertex.numItems = 8;

    // based on above triangle face directions we get the normals

    normal.normals = [
        val,  val, -val, // v0
        -val,  val, -val, // v1
        -val, -val, -val, // v2
        val, -val, -val, // v3
        val,  val,  val, // v4
        -val,  val,  val, // v5
        -val, -val,  val, // v6
        val, -val,  val // v7
    ];
    // normal.normals = [
    //     [0.0, 0.0, -1.0], // back
    //     [1.0, 0.0, 0.0], // right
    //     [0.0, -1.0, 0.0], // bottom
    //     [-1.0, 0.0, 0.0], // left
    //     [0.0, 1.0, 0.0], // top
    //     [0.0, 0.0, 1.0] //front
    // ];

    // normal.normals = [
    //     0.0, 0.0, -1.0,     0.0, 0.0, -1.0,     0.0, 0.0, -1.0,     0.0, 0.0, -1.0,     // back
    //     1.0, 0.0, 0.0,      1.0, 0.0, 0.0,      1.0, 0.0, 0.0,      1.0, 0.0, 0.0,      // right
    //     0.0, -1.0, 0.0,     0.0, -1.0, 0.0,     0.0, -1.0, 0.0,     0.0, -1.0, 0.0,     // bottom
    //     -1.0, 0.0, 0.0,     -1.0, 0.0, 0.0,     -1.0, 0.0, 0.0,     -1.0, 0.0, 0.0,     // left
    //     0.0, 1.0, 0.0,      0.0, 1.0, 0.0,      0.0, 1.0, 0.0,      0.0, 1.0, 0.0,      // top
    //     0.0, 0.0, 1.0,      0.0, 0.0, 1.0,      0.0, 0.0, 1.0,      0.0, 0.0, 1.0       // front
    // ];

    normal.itemSize = 3;
    normal.numItems = 8;

    return {vertex, normal, index};
}

function GetCylinder(topRadius, baseRadius, height, nSlice = 10, nStack = 30){
    var vertex = {}, normal = {}, index = {};
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

    // normals
    normal.normals = vertex.vertices.map((v, idx) => {
        if (idx % 3 == 0) return 0;
        return v;
    });
      
    normal.itemSize = vertex.itemSize;
    normal.numItems = vertex.numItems;

    // indices 
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

    return {vertex, normal, index};
}

// Code to draw sphere partially borrowed from here:
// https://github.com/davidwparker/programmingtil-webgl/tree/master/0078-3d-sphere
// index computation for 3d sphere from a stackoverflow link

function GetSphere(radius, nSlice=20, nStack = 20) {
    var vertex = {}, normal = {}, index = {};
    vertex.vertices = [];
    normal.normals = [];
    index.indices = [];
    
    var aStep = Math.PI*2 / nSlice;
    var hStep = Math.PI / nStack;

    // vertices
    vertex.vertices.push(0.0, -radius, 0.0);
    normal.normals.push(0.0, -1.0, 0.0);
    for (var j = 1; j < nStack; j++){
        var h = -Math.PI/2 + hStep*j;
        for (var i = 0; i < nSlice; i++){
            var a = i * aStep;
            // vertex positions
            vertex.vertices.push(Math.cos(h) * Math.cos(a) * radius);
            vertex.vertices.push(Math.sin(h) * radius);
            vertex.vertices.push(Math.cos(h) * Math.sin(a) * radius);
            // normals
            normal.normals.push(Math.cos(h) * Math.cos(a));
            normal.normals.push(Math.sin(h));
            normal.normals.push(Math.cos(h) * Math.sin(a));
        }        
    }
    vertex.vertices.push(0.0, radius, 0.0);
    normal.normals.push(0.0, 1.0, 0.0);

    vertex.itemSize = 3;
    vertex.numItems = nSlice * (nStack-1) + 2;

    normal.itemSize = 3;
    normal.numItems = nSlice * (nStack-1) + 2;

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

    return {vertex, normal, index};
}
