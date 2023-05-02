# CSE5542 Spring 2023 Lab 5

## 1. How to Use Program

Open ```index.html``` in your browser

From terminal:

Mac OS/Linux
```bash
cd <directory-with-files>

#start a local server in this directory

python -m http.server 8080

```
Navigate to ```localhost:8080``` in browser

1. W/S/A/D: move the tank fleet forward/backward/left/right
2. left/right arrow keys: rotate sentry tank around the patrol tank
3. up/down arrow keys: rotate both the patrol and sentry tanks together
4. P/p: pitch up/down
5. Y/y: yaw left/right
6. R/r: rotate camera counterclock/clock-wise
7. J/j: Move light source along X-axis
8. K/k: Move light source along Y-axis
9.  L/l: Move light source along Z-axis
   
## 2. Tasks Accomplished

### General
- [x] Texture mapping:  Enhance scene with a texture-mapped 3D model using GLSL shaders. 
  - Added a 3D tank model with more than 14k triangles from [rigmodels.com](https://rigmodels.com/model.php?view=Tank-3d-model__LINQSS8FNN3UF1XOZM6LIC43A)
  - Added texture to this tank model
  - User can select lighting/texture/environment mapped textures

- [x] Environment Cube Mapping
  - [x] Draw six walls to represent your environment, and map the six face textures of the cube map to the walls. 
  - [x] Perform environment cube mapping on a object in the scene. 
  
- [x] Self-animation showcasing model hierarchy, lighting, textures.

### Bonus
None attempted

## 3. Development and Testing

Developed on Firefox, version 112.0b9 (macOS ventura)

Tested on:
- Firefox
- Chrome

---
