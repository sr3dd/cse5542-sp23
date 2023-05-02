# CSE5542 Spring 2023 Lab 4

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

1. User can operate in 2 modes (shape rendering types):
   1. Lines - draws lines instead of triangle faces
   2. Triangles - draws triangles
2. W/S/A/D: move the object forward/backward/left/right
3. left/right arrow keys: rotate the gun mount
4. up/down arrow keys: adjust the elevation angle
5. P/p: pitch up/down
6. Y/y: yaw left/right
7. R/r: rotate camera counterclock/clock-wise
8. J/j: Move light source along X-axis
9. K/k: Move light source along Y-axis
10. L/l: Move light source along Z-axis
11. B/b: Move model along X-axis
12. N/n: Move model along Y-axis
13. M/m: Move model along Z-axis
   
## 2. Tasks Accomplished

### General
- [x] Enhanced the 3D scene from Lab 3: 
  1.  retained the model from lab 3 
      - The Tank consists of the tank base which can move around in space and top of it are mounted:
      - A cabin
      - A cabin latch door to grant access to the tank cabin through rotation
      - a cannon mount sphere which can rotate for correct cannon aim
      - a cannon mounted to the cannon mount sphere controlled by the rotation of the sphere only
  2.  imported an additional triangular model that has a higher complexity.
      - Added a 3D tank model with more than 14k triangles from [rigmodels.com](https://rigmodels.com/model.php?view=Tank-3d-model__LINQSS8FNN3UF1XOZM6LIC43A)

- [x] Allow my model to roam around the space with the w/a/s/d control keys, similar to Lab 3
- [x] Allow the user to control the camera to look up/down (pitch), left/right (yaw), and clock/counterclockwise (roll) using keystrokes P/p, Y/y, and R/r for the camera’s pitch, yaw, and roll control, same as Lab 3
- [x] Allow the external 3D model to roam around the XYZ-space with the B/b/N/n/M/m control keys
- [x] Allow the light source to be moved in the XYZ-space with the J/j/K/k/L/l keys

### Bonus
None attempted

## 3. Development and Testing

Developed on Firefox, version 112.0b9 (macOS ventura)

Tested on:
- Firefox

---
