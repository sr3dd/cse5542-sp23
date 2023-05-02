# CSE5542 Spring 2023 Lab 2

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

1. User can operate in 3 modes:
   1. Global
   2. Local
   3. Selection
2. New objects can be drawn only when in Local mode (i.e. Global and Selection modes are disabled)
3. Selecting a new shape (p, h, v, t or q keystroke) automatically causes the program to go into local mode so a new object can be drawn
4. In global mode:
   1. s/S for scaling down or up (all objects)
   2. mouse down+move for rotation
5. In selection mode:
   1. mouse click on object to select it
   2. s/S for scaling down or up selected object
   3. mouse movement for rotation of selected object
   4. r/g/b for setting color of selected object
6. In local mode:
   1. mouse click to draw object centered at cursor + movement for rotation
   2. s/S for scaling up or down last added object
7. 'd' for re-displaying the scene
8. 'c' for clearing the scene
9. 'l'/'L' for getting current state of the canvas:
   1.  the selected global color
   2.  the selected global shape
   3.  global tranformation mode enabled/disabled
   4.  selection mode enabled/disabled
   5.  selected object (none selected if value is -1)
   
## 2. Tasks Accomplished

### General
- [x] Create a single VBO for each shape - point, line, triangle, and square
- [x] ‘p’, ‘h’, ‘v’, ‘t’, ‘q’, to draw a point, horizontal line, vertical line, triangle, or square
- [x] Allow the user to continue to hold the mouse button, move the cursor to rotate the shape you just drew, and stop rotating as you release the left mouse button
- [x] Press ‘S’ to enlarge the current shape and ‘s’ to shrink the current shape
- [x] Press ‘W’ to indicate your want global transformation (transform all shapes). And use the left mouse button to rotate and ‘S’ and ‘s’ to scale up and down. Press ‘w' to turn off the global transformation
- [x] Press the key ‘d’ to re-display the screen
- [x] Press 'r’, 'g' or 'b' for changing the color
- [x] Press key ‘c’ to clear the screen

### Bonus
- [x] Selection Mode: Press 'M' to enable/'m' to disable
  - [x] Click on a shape previously defined and use the mouse to rotate, ‘s/S’ to scale, and ‘r/g/b’ to recolor.
- [ ] Write your own matrix arithmetic instead of using a third-party library like glMatrix or glm-js 

## 3. Development and Testing

Developed on Firefox, version 110.0b9 (macOS ventura)

Tested on:
- Firefox

---
