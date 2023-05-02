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
