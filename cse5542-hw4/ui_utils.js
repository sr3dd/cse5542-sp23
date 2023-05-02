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
Assigns actions to user character input from keyboard
*/
function onKeyDown(event) {
    console.log(event.key);

    switch(event.keyCode){
        case 87:
            // Move object forward
              console.log('enter W');
              z_step -= lateral_step;
              drawScene();
              break;
        case 65:
            // Move object to left
            console.log('A');
            x_step -= lateral_step;
            drawScene();
            break;
        case 83:
            // Move object to right
            console.log('S');
            z_step += lateral_step;
            drawScene();
            break;
        case 68:
            // Move object backwards along Z
            console.log('D');
            x_step += lateral_step;
            drawScene();
            break;
        case 38: 
            // rotate cannon mount
            console.log('up arrow');
            cannon_deg += angle_inc;
            drawScene();
            break; 
        case 40: 
            // rotate cannon mount
            console.log('down arrow');
            cannon_deg -= angle_inc;
            drawScene();
            break;   
        case 37:
            // rotate cabin latch
            console.log('left arrow');
            latch_deg += angle_inc;
            drawScene();
            break;  
        case 39:
            // rotate cabin latch
            console.log('right arrow');
            latch_deg -= angle_inc;
            drawScene();
            break;
        case 82: 
            mat4.identity(roll);
            if (event.shiftKey) {
                console.log('R, rotate clockwise');
                mat4.rotate(roll, degToRad(-angle_inc), [0, 0, 1], roll);                 
            }
            else {
                console.log('r, rotate counterclockwise');
                mat4.rotate(roll, degToRad(angle_inc), [0, 0, 1], roll);        
            }
            mat4.multiply(roll, vMatrix, vMatrix); 
            drawScene();
            break;
        case 80:
            mat4.identity(pitch);
            if (event.shiftKey) {
                console.log('P, pitch up');
                mat4.rotate(pitch, degToRad(-angle_inc/5), [1, 0, 0], pitch);
            } 
            else {
                console.log('p, pitch down');
                mat4.rotate(pitch, degToRad(angle_inc/5), [1, 0, 0], pitch)
            } 
            mat4.multiply(pitch, vMatrix, vMatrix);
            drawScene();
            break;
        case 89:
            mat4.identity(yaw);
            if (event.shiftKey) {
                console.log('Y, look to left');
                mat4.rotate(yaw, degToRad(-angle_inc/5), [0, 1, 0], yaw);
            }  
            else {
                console.log('y, look to right');
                mat4.rotate(yaw, degToRad(angle_inc/5), [0, 1, 0], yaw);
            } 
            mat4.multiply(yaw, vMatrix, vMatrix);
            drawScene();
            break; 
        case 74:
            if (event.shiftKey){
                console.log('J, move light -X');
                world_light_position[0] -= 0.4;
            }
            else{
                console.log('j, move light +X');
                world_light_position[0] += 0.4;
            } 
            drawScene();
            break;
        case 75:
            if (event.shiftKey){
                console.log('K, move light -Y');
                world_light_position[1] -= 0.4;
            }
            else{
                console.log('k, move light +Y');
                world_light_position[1] += 0.4;
            } 
            drawScene();
            break;
        case 76:
            if (event.shiftKey){
                console.log('L, move light -Z');
                world_light_position[2] -= 0.4;
            }
            else{
                console.log('l, move light +Z');
                world_light_position[2] += 0.4;
            } 
            drawScene();
            break;
        case 66:
            if (event.shiftKey){
                console.log('B, move model -X');
                model_position[0] -= 0.4;
            }
            else{
                console.log('b, move model +X');
                model_position[0] += 0.4;
            } 
            drawScene();
            break;
        case 78:
            if (event.shiftKey){
                console.log('N, move model -Y');
                model_position[1] -= 0.4;
            }
            else{
                console.log('n, move model +Y');
                model_position[1] += 0.4;
            } 
            drawScene();
            break;
        case 77:
            if (event.shiftKey){
                console.log('M, move model -Z');
                model_position[2] -= 0.4;
            }
            else{
                console.log('m, move model +Z');
                model_position[2] += 0.4;
            } 
            drawScene();
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
