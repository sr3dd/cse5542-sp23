// VERTEX Shader
attribute vec4 aPosition;
uniform mat4 uModelViewMatrix; 

void main() {
    gl_PointSize = 5.0;
    gl_Position = uModelViewMatrix * aPosition;
}
