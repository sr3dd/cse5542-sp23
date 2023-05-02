# CSE5542 Spring 2023 Lab 3

## 1. How to Use Program

Open ```index.html``` in your browser

From terminal:

Mac OS
```
cd <directory-with-files>
open index.html
```
Windows
```
start index.html
```

1. User can operate in 2 modes (shape rendering types):
   1. Lines - draws lines instead of triangle faces
   2. Triangles - draws triangles
2. W/S/A/D: move the object forward/backward/left/right
3. left/right arrow keys: rotate the gun mount
4. up/down arrow keys: adjust the elevation angle
5. P/p: pitch up/down
6. Y/y: yaw left/right
7. R/r: rotate camera counterclock/clock-wise
   
## 2. Tasks Accomplished

### General
- [x] Created a 3D scene - a tank with multiple primitive 3D components (3 cubes, a sphere and cylinder)
  - The Tank consists of the tank base which can move around in space and top of it are mounted:
    - A cabin
    - A cabin latch door to grant access to the tank cabin through rotation
    - a cannon mount sphere which can rotate for correct cannon aim
      - a cannon mounted to the cannon mount sphere controlled by the rotation of the sphere only
- [x] Added a camera
- [x] Implemented a cube primitive defined by size
- [x] Implemented a cylinder primitive defined by base radius, top radius, height, number of slices, and number of stacks
- [x] Implemented a sphere primitive defined by radius, number of slices, number of stacks
- [x] Color was defined as a uniform to the fragment shader instead of per-vertex coloring
- [x] Allow the object to roam around the space with the w/a/s/d control keys
- [x] Allow the user to control the camera to look up/down (pitch), left/right (yaw), and clock/counterclockwise (roll) using keystrokes P/p, Y/y, and R/r for the camera’s pitch, yaw, and roll control.

### Bonus
None attempted

## 3. Development and Testing

Developed on Firefox, version 110.0b9 (macOS ventura)

Tested on:
- Firefox

---
