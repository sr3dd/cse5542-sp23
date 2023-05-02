// camera position
var camera_pos = [3,2,7];

// light properties
// light position in world
var light_pos = [0.0, 2, 0.0, 1.0]; 
var light_size = 0.2;
var light_color = [1.0,1.0,1.0,1.0];

// material properties
var mat_ambient = [0.0, 0.2, 0, 1]; 
var mat_diffuse = [0.0, 0.0, 0.0, 0.0]; 
var mat_specular = [0.5, 0.5, 0.5, 1]; 
var mat_shininess = [50.0]; 

// tank model variables
var model_base = 10;
var model_size = 0.3;
var model_scale = 3;
// global tank model position
var global_x = 0.0;
var global_z = 0.0;
var y_pos = 1.0;
var tank_offset = 1.0;
// tank model rotation angles
var sentry_angle = 0.0;
var global_angle = 0.0;

// skybox dimension and placing
var skyDis = 50.0;

var angle_step = 0.3;
var move_step = 0.03;
var zoom_step = 0.1;
var pry_step = 3.0;

var tank_texture_mode = 0;

var animation_mode = 0;
