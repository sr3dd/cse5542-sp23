function ModeTank(mode){
    tank_texture_mode = mode;
    drawScene();
}

function ModeAnimate(mode){
    animation_mode = mode;
    drawScene();
}

function Reset(){
    tank_texture_mode = 0;
    animation_mode = 0;
    y_pos = 1.0;
    tank_offset = 1.0;
    sentry_angle = 0.0;
    global_angle = 0.0;
    light_pos = [0.0, 2, 0.0, 1.0]
    
    camera_pos = [3,2,7];
    mat4.lookAt(camera_pos, [0,0,0], [0,1,0], vMatrix);

    drawScene();
}

function pushMatrix(m){
    var m2 = mat4.create(m);
    matrixStack.push(m2);
}

function popMatrix(){
    return matrixStack.pop();
}  

function vector(a, b){
    return [-a[0]+b[0], -a[1]+b[1], -a[2]+b[2]];
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
