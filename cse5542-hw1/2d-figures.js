var pointCoords = [0.0, 0.0];
var verticalCoords = [
    0.0, -0.1,
    0.0, 0.1
];
var horizontalCoords = [
    -0.1, 0.0,
    0.1, 0.0
];
var triangleCoords = [
    0.0, 0.1,
    -0.1, -0.1,
    0.1, -0.1
];
var squareCoords = [
    -0.1, -0.1,
    0.1, -0.1,
    -0.1, 0.1, 
    0.1, -0.1,
    -0.1, 0.1,
    0.1, 0.1
];

// generating triangle coordinates for circle with radius 0.1 and 
// 30 triangles (which gives a reasonably smooth triangle on tested resolutions:
// 1. 3440x1440
// 2. 1920x1080
var circleCoords = generateCircleCoord(0.1, 30);

/*
Creates a figure object with information for shaders - 
1. vertex coordinates
2. uniform offset
3. number of points in figure (items)
4. primitive type
5. uniform color
*/ 
function createFigure(x, y, figure){
    var coords, items, type;

    switch(figure){
        case "point":
            coords = pointCoords;
            items = 1;
            type = gl.POINTS
            break;
        case "vertical":
            coords = verticalCoords;
            items = 2;
            type = gl.LINES
            break;
        case "horizontal":
            coords = horizontalCoords;
            items = 2;
            type = gl.LINES;
            break;
        case "triangle":
            coords = triangleCoords;
            items = 3;
            type = gl.TRIANGLES;
            break;
        case "circle":
            coords = circleCoords;
            items = circleCoords.length/2;
            type = gl.TRIANGLES;
            break;
        case "square":
            coords = squareCoords;
            items = 6;
            type = gl.TRIANGLES;
            break;
    }

    return {
        positionArray: coords,
        offset: [x, y],
        color: [figureColor.r, figureColor.g, figureColor.b],
        numItems: items,
        primitive: type
    }
}

/*
Generates 2-D circle coordinates centred at (0,0)
radius: radius of circle
steps: number of triangles to use (step angle = 360/steps)
*/
function generateCircleCoord(radius, steps){
    // step_angle = 2*pi/steps
    var angle = (2.0 * Math.PI) / steps;
    // circle center
    var centerX = 0.0;
    var centerY = 0.0;
    
    var vertices = [];
    // second coordinate of triangle
    var prevX = centerX;
    var prevY = centerY - radius;

    for(var i=0; i<=steps; i++){
        // Using circle parametric equation
        // x = rsin(theta)
        // y = rcos(theta)
        // theta -> angle subtended between radius and y-axis
        var newX = radius * Math.sin(angle*i);
        var newY = -radius * Math.cos(angle*i);

        // coordinates of triangle
        vertices.push(centerX);
        vertices.push(centerY);
        vertices.push(prevX);
        vertices.push(prevY);
        vertices.push(newX);
        vertices.push(newY);

        prevX = newX;
        prevY = newY;
    }

    return vertices;
}