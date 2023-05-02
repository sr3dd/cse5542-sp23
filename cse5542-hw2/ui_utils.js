/*
Event handling function - mouse button depressed
*/
function onDocumentMouseUp(event) {
    canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false);
    canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false);
    canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false);
}

/*
Event handling function - mouse cursor leaves canvas area
*/
function onDocumentMouseOut(event) {
    canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false);
    canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false);
    canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false);
}

/*
Function to disable global transformation and selection mode
*/
function resetToDraw(){
    global_transform = false;
    selection_mode = false;
}

/*
Assigns actions to user character input from keyboard
*/
function onKeyDown(event) {
    console.log(event.key);

    switch(event.keyCode){
        case 68:
            // Re-draws the canvas with the same state
            console.log("Re-displaying the screen");
            resetToDraw();
            drawScene();
            break;
        case 67:
            // Clears all figures and re-draws the canvas (blank canvas)
            console.log("Clearing the screen");
            figures = [];
            resetToDraw();
            drawScene();
            break;
        case 80:
            // Sets the figure type to be drawn to 'point'
            console.log("Drawing points");
            figureShape = "point"
            resetToDraw();
            break;
        case 72:
            // Sets the figure type to be drawn to 'horizontal'
            console.log("Draw a horizontal line");
            figureShape = "horizontal";
            resetToDraw();
            break;
        case 86:
            // Sets the figure type to be drawn to 'vertical'
            console.log("Draw a vertical line");
            figureShape = "vertical";
            resetToDraw();
            break;
        case 84:
            // Sets the figure type to be drawn to 'triangle'
            console.log("Draw a triangle");
            figureShape = "triangle";
            resetToDraw();
            break;
        case 81:
            // Sets the figure type to be drawn to 'square'
            console.log("Draw a square");
            figureShape = "square";
            resetToDraw();
            break;
        case 82:
            setColor("red");
            break;
        case 71:
            setColor("green");
            break;
        case 66:
            setColor("blue");
            break;
        case 87:
            if(event.shiftKey){
                // turns on Global tranformation mode
                console.log("Entered Global Transformation mode (this will turn off selection mode automatically)");
                global_transform = true;
                selection_mode = false;
            }
            else{
                console.log("No longer in Global Tranformation mode");
                global_transform = false;
            }
            break;
        case 83:
            if(event.shiftKey){
                // Scaling up of object
                scale("up");
            }
            else{
                // Scaling down of object
                scale("down");
            }
            break;
        case 77:
            if(event.shiftKey){
                // turns on  Selection mode
                console.log('Entered Selection mode (this will turn off global mode automatically)');
                selection_mode = true;
                selected_figure_index
                global_transform = false;
            }
            else{
                console.log('No longer in Selection mode');
                selection_mode = false;
            }
            break;
        case 76:
            console.log("Printing current state of Canvas:")
            console.log(`Selected color: ${figureColor}`)
            console.log(`Selected figure: ${figureShape}`)
            console.log(`Global transformation mode: ${global_transform}`)
            console.log(`Selection mode: ${selection_mode}`)
            console.log(`Selected figure ${selected_figure_index}`)
            break;
    }  
}

/*
Event handling for movement of mouse
Mouse movement in lab 2 causes rotation - global, local or selection modes
*/
function onDocumentMouseMove(event){
    // get mouse coordinates after movement
    var mouseX = event.clientX;
    var mouseY = event.ClientY;

    var diffX = mouseX - prevMouseX;
    // get angle of rotation
    Z_angle = diffX/5;
    // store mouse coordinates for next sequence
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    // local rotation
    if (!global_transform && !selection_mode){
       mat4.rotate(figures[figures.length-1].matrix, degToRad(Z_angle), [0, 0, 1]);
    }
    // global rotation
    if(global_transform && !selection_mode){
       rad = degToRad(Z_angle);
       var rotation_matrix = [
           Math.cos(rad), -Math.sin(rad), 0.0, 0.0,
           Math.sin(rad), Math.cos(rad), 0.0, 0.0,
           0.0, 0.0, 1.0, 0.0,
           0.0, 0.0, 0.0, 1.0
         ]            
       for (var i = 0; i < figures.length; i++)
           mvMatrix = mat4.multiply(rotation_matrix, figures[i].matrix, figures[i].matrix);
    } 
    // rotation of selected object
    if (selection_mode && selected_figure_index != -1){
        mat4.rotate(figures[selected_figure_index].matrix, degToRad(Z_angle), [0, 0, 1]);
    }

    drawScene();
}

/*
Function that triggers on mouse input
*/
function onmousedown(event) {
    event.preventDefault();
    // adding event listeners for: 
    // mouse movement - rotation
    // mouseup/mousedown - stop rotation
    canvas.addEventListener( 'mousemove', onDocumentMouseMove, false);
    canvas.addEventListener( 'mouseup', onDocumentMouseUp, false);
    canvas.addEventListener( 'mouseout', onDocumentMouseOut, false);

    // get cursor coordinates as GL coordinates
    var clickGLCoords = pixelInputToGLCoord(event, canvas); 

    // Draw a figure only if not in global transformation or selection mode
    // Drawing possible only in local mode
    if(!global_transform && !selection_mode){
        var figure = {};
        figure.shape = figureShape;
        figure.color = figureColor;

        var mvMatrix = mat4.create();
        mat4.identity(mvMatrix);
        var trans = [0,0,0];
        trans[0] = clickGLCoords.x; 
        trans[1] = clickGLCoords.y;
        trans[2] = 0.0; 
        mvMatrix = mat4.translate(mvMatrix, trans);
        // rotate horizontal line by 90 deg to get vertical line
        if (figure.shape == "vertical"){
            mvMatrix = mat4.rotate(mvMatrix, degToRad(90.0), [0, 0, 1]); 
        }
        mvMatrix = mat4.rotate(mvMatrix, degToRad(0.0), [0, 0, 1]);
        // store this matrix for later use by shader
        figure.matrix = mvMatrix;
        // add this figure to list of all existing figures
        figures.push(figure)
        drawScene();
    }
    // if mouse click registered in selection mode
    // picking the object closest to mouse click coordinates
    if(selection_mode){
        var min_dist = 10.0;
        var argmin_dist = -1;

        for (var i=0; i < figures.length; i++){
            var origin = quat4.create([0.0, 0.0, 0.0, 1.0]);
            var center = quat4.create();
            mat4.multiplyVec4(figures[i].matrix, origin, center);
            var center_x = center[0];
            var center_y = center[1];

            if ((clickGLCoords.x-center_x)*(clickGLCoords.x-center_x) + (clickGLCoords.y-center_y)*(clickGLCoords.y-center_y) < min_dist){
                min_dist = (clickGLCoords.x-center_x)*(clickGLCoords.x-center_x) + (clickGLCoords.y-center_y)*(clickGLCoords.y-center_y);
                argmin_dist = i;
            }
        }

        if (min_dist < 0.05 * 0.05){
            selected_figure_index = argmin_dist;
        }

        console.log(`Selected figure ${selected_figure_index}`)
    }  
}
