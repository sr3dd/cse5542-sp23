
/*
Assigns actions to user character input from keyboard
*/
function onKeyDown(event) {
    console.log(event.keyCode);
    switch(event.keyCode)  {
        case 87:
            console.log('W');
            global_z -= move_step;
            drawScene();
            break;
        case 83:
            console.log('S');
            global_z += move_step;
            drawScene();
            break;
        case 65:
            console.log('A');
            global_x -= move_step;
            drawScene();
            break;
        case 68:
            console.log('D');
            global_x += move_step;
            drawScene();
            break;
        case 38: 
            console.log('up arrow');
            global_angle += angle_step;
            drawScene();
            break; 
        case 40: 
            console.log('down arrow');
            global_angle -= angle_step;
            drawScene();
            break;   
        case 37:
            console.log('left arrow');
            sentry_angle -= angle_step;
            drawScene();
            break;  
        case 39:
            console.log('right arrow');
            sentry_angle += angle_step;;
            drawScene();
            break;   
        case 82: 
            mat4.identity(rollMatrix);
            if (event.shiftKey) {
                console.log('enter R, clockwise');
                mat4.rotate(rollMatrix, degToRad(-pry_step), [0, 0, 1], rollMatrix);                 
            }
            else {
                console.log('enter r, counterclockwise');
                mat4.rotate(rollMatrix, degToRad(pry_step), [0, 0, 1], rollMatrix);        
            }
            mat4.multiply(rollMatrix, vMatrix, vMatrix); 
            drawScene();
            break;
        case 80:
            mat4.identity(pitchMatrix);
            if (event.shiftKey) {
                console.log('enter P, look up');
                mat4.rotate(pitchMatrix, degToRad(-pry_step/5), [1, 0, 0], pitchMatrix);
            } 
            else {
                console.log('enter p, look down');
                mat4.rotate(pitchMatrix, degToRad(pry_step/5), [1, 0, 0], pitchMatrix)
            } 
            mat4.multiply(pitchMatrix, vMatrix, vMatrix);
            drawScene();
            break;
        case 89:
            mat4.identity(yawMatrix);
            if (event.shiftKey) {
                console.log('enter Y, look left');
                mat4.rotate(yawMatrix, degToRad(-pry_step/5), [0, 1, 0], yawMatrix);
            }  
            else {
                console.log('enter y, look right');
                mat4.rotate(yawMatrix, degToRad(pry_step/5), [0, 1, 0], yawMatrix);
            } 
            mat4.multiply(yawMatrix, vMatrix, vMatrix);
            drawScene();
            break;
        case 70:
            mat4.identity(cameraFrontMatrix);
            if (event.shiftKey) {
                console.log('enter F, look front');
                mat4.translate(cameraFrontMatrix, [0, 0, zoom_step], cameraFrontMatrix);
            } 
            else {
                console.log('enter f, look back');
                mat4.translate(cameraFrontMatrix, [0, 0, -zoom_step], cameraFrontMatrix);
            } 
            mat4.multiply(cameraFrontMatrix, vMatrix, vMatrix);
            drawScene();
            break;
        case 74:
            if (event.shiftKey) {
                console.log('enter J');
                light_pos[0] += 0.03
            } 
            else {
                console.log('enter j');
                light_pos[0] -= 0.03;
            } 
            drawScene();
            break;
        case 75:
            if (event.shiftKey) {
                console.log('enter K');
                light_pos[1] += 0.03
            } 
            else {
                console.log('enter k');
                light_pos[1] -= 0.03;
            } 
            drawScene();
            break;
        case 76:
            if (event.shiftKey) {
                console.log('enter L');
                light_pos[2] += 0.03
            } 
            else {
                console.log('enter l');
                light_pos[2] -= 0.03;
            } 
            drawScene();
            break;
    }
}

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