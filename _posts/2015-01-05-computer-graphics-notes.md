---
published: false
date: 2014-01-05 18:00
layout: post
excerpt: All my notes from my interterm computer graphics class at Chapman University.  Professor is Dr. Linstead.  Main topic is the OpenGL library.
title: Computer Graphics Notes
photo: /images/master-cheif.jpg
---

# Day 1

Text Books

* "Computer Graphics with OpenGL" by Hearn and Baker Fourth Edition 2010 (HB)  
* "OpenGL Programming Guide" by Shreiner Eighth Edition. Addison-Wesley 2013 (RB) AKA "The Red Book"  

Classmates

* Kelly  
* Christin 
* Katie  

Cathod Ray Tube (CRT)
: The display is phospher coated
: You hit pixels with an electon gun in the back
: All inside of a vacuum

How do you render an image on the CRT? Well, if we want a persistent image on the screen, we need to keep re-drawing the screen over and over again (hitting the phospher pixels with the electron gun).  This time period is known as the refresh rate.  These old school screens sweep the screen from left to right and top to bottom.  A row is considered a scan line.  The information for the scan lines go into a frame buffer.  The frame buffer is used to put the information on the screen.

The memory size of the frame buffer depends on the number of bits needed per pixel and the number of pixels on the screen.

1 bit/pixel = bitmap
many bits/pixel = pixmap

Humans perceive a continues image at 24 frames per second (hertz).  So you need to redraw your screen at at least 24 times each second.

### System Architecture

In the old von-neumann architechture, the Video Controller shares the system memory.  That leads to a bottleneck of resources. Now we have Graphics cards with their own dedicated memory, frame buffer, it's own processor, and viewing coordinates.  The frame buffer is encoded as a linked list.

### Things Graphics Libraries Need

*  A Coordinate System  
    * Draw everything by describing geometrically  
* Right Hand Cartesian Coordinates  
* Scene  
    1. Draw individual objects (using local coordinates)
    2. Place into a schene (using world coordinates)
    3. Transfer to the device (using device coordinates)
* mc -> wc -> vc -> pc -> nc (normalized coords) -> dc (device coords)  

### OpenGL Library

It acutally consists of three modules

* GL - Core - Primitives  
* GLU - Utitlity - Viewing/Projection  
* GLUT - Windowing toolkit  


# Day 2

Primitives
: Low Level components
: E.G. GL_LINES, GL_POINTS

Scan Conversion
: What pixels to activate to render the primitive
: Specify using cartesian points
: Within a bounding box

Screen Coordinates
: The actual locations on the monitoer
: setPixel(x,y,color)
: getPixel(...)

We plot the verticies, then those points are connected with the specified primitive.

### Line Drawings

We always have to approximate a line as best we can the.  When this is wrong, we get what we call "jaggies".  First Take a rough approximation, then smooth it out.  This smoothing out is called anti-aliasing.

*SI form of line: y = mx +b*
endpoint (Xstart, Ystart) (Yend, Yend)
m = rise/run = (Ydelta/Xdelta)
b = Ystart - mXstart
deltaY = m * deltaX
deltaX =  deltaY / m

DDA
: Digital Differential 

: Sample X or Y
: if |m| < 1 then sample X
: if |m| > 1 then sample Y

Sampling means that that is axis we are looping through one increment at a time.  We want to sample the one with the most slope so that we get a high-fidelity image)

So a sample DDA function might look like this...

```c++
void dda(int xo, int yo, int xc, int yc) {
    int dx = xe - xs;
    int dy = ye - ys;
    int steps, k;
    float x_inc, y_inc;
    int x = xs;
    int y = ys;

    if (fabs(dx) > fabs(dy)) {
        steps = fabs(dx);
    } else {
        steps = fabs(dy);
    }

    x_inc = fabs(dx) / fabs(steps);
    y_inc = fabs(q / float(steps);

    setPixel(x, y);
    for (k = 0; k < steps; ++k) {
        x += x_inc;
        y += y_inc;
        setPixel(round(x), round(y));
    }
}
```

The above algorithm has limitations when it comes to curves.

Bresenhams line drawing algorithms is actually the one that gets used.  It makes better decisions between competing pixels.

Cosider a positive slope < 1 (x dominates)
* Start from left, sample x, choose pixel whose scanline y value is closest to truth.  If  (xk, yk) is displayed, choose y for Xk+1 = Xk + 1

The code for choosing the best y is something like this.

*Note*: Teach yourself this code.

p means parameter that will be either positive or negative
k is the position on the sample axis

Assume |m| < 1

1.  Input endpoints and store left endpoint (xe, ye)
2.  Plot left endpoing
3.  Calculate detla_x, delta_y, 2 * delta_y, 2 * delta_y - 2 * delta_x, Po
    * That is because they are all constants
4. Let k = 0, start a long line performing descisions (test Pk)

```c++
if (p_k < 0) {
    plot(x_k + 1, y_k);
    Pk+1 = p_k + (2 * delta_y);
} else {
    plot(x_k + 1, y_k + 1);
    Pk+1 = Pk + (2 * delta_y) - (2 * delta_x);
}
```

# Day 3

### Fonts

There are two times of Character primitives

1. Bit map
2. Stroke

Strokes are vectorized and scaleable.  Glut gives us a few methods for these types.

```c++
glutBitmapCharater(font, char);
// Origin = lower left

glutStrokeCharacter(font, char);
// Space using transformations
// constrcut in line segments
// can use different angles
// linear algebra can be applied
```


# Day 4

### Color in OpenGL

```c++
glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);  
// First param is the biffering, second is the color mode
```

Buffering options are:
* `GLUT_RGB`  
* `GLUT_RGBA`  
* `GLUTINDEX` you use your own color table

You can turn on color blending like so.

```c++
glEnable(GL_BLEND);
// This enables gradients
```

### Anti-Aliasing

NyQuist teaches us how to sample things.  

f_s = 2 * f_max;

nsfeed to increase an increase in sampling rate.  

One thing you can do is blur out the bad jagged pixels on the edges of the line to make it look smooth.  There are two ways to do this:

1. SuperSampling
:Depending on how much the shape "touches" the pixel determines its color intensity.

Pixel Phasing
: Tweaks the actual laser that shoots light into the pixel

2. Subpixel Weighting
: More weight in "subpixels" near center

# Day 5

### Mid-term Review


Outline
1. Graphic Libs -> Displays, CRT, LCD, Pixels, Color
2. Primitives
    * Frame buffers
    * Line drawing
3. Attributes Enabling
    * Fill over
    * Boundary Fill
4. Anti-aliazing
    * Super sampling
5. Menus
6. OpenGL
    * Write a "main" function
    * callbacks
    * color modes / states
    * Push matrix, pop matrix



Raster Scan Display
Scan Line: one scan row
Pixel: picture element (pel)
Color Buffer: Stores the color information
Frame Buffer: Everything need to display thing
Aspect Ratio: Scan Lines/ Pixels Columns and/or vice versa
Depth: Number of bits per pixel
Bitmap: 1 bit per pixel
Pixmap: many bits per pixel
Horizontal Retrace: When the electron beem returns to its left position
Vertical Retrace: When the electron beem returns to the top


When modeling a schene in a programming language, you first define local cordinates for each reference frame.  When those objects are placed in a schene, the local/modeling/master coordinates are transfered into world coordinates.  We then put it in the viewing pipeline.  The world coordinates are converted to viewing coordinates.  The viewing coordinates are based on the position of the "camera" in the schene so that we can represent 3D data in a 2D space.  Then viewing coordinates are which are then converted into normalized coordinates (-1 to 1 or 0 to 1).  Normalized coordinates or Normalized Device Coordinates are usful in that it makes the graphics package independent of a specific device.  Then normalized coordinates get converted into the device coordinates or screen coordinates.

The different parts of OpenGL are
1. GL - Core with the primatives
2. GLU - Utility Viewing/Projection
3. GLUT - Windowing


DDA stands for digital differential analyzer
Bresenhams is a better algorithm

GL core primitives
GLU utility projection/viewing
GLUT windowing

# Day 5
A horrible mid-term

# Day 6

### Linear Algebra Review

Matrixes

Grab a row and you have a row vector  
Grab a column and you have a column vector  

*Matrix A + Matrix B*
Add each element together

*3 * Matrix A*
Multiple each element by 3

*Matrix A * Matrix B*
AB != BA  
A = m by n
B = p by q

C = AB
C is m by q
n == p

Rows is always first, columns is always second

Study dot products
Study cross products
Study matrix multiplication

Transpose inverse the matrix

##### Geometric Transformations

* Translation
    - Add offsets to coords to move to the new coord position
    - moving along straight line
    - new_point = old_point + translation
    - referred to as a rigid body transformation
* Rotation
    - rotate by a rotation angle around a rotaion axis
    - all points rotate around the same angle and the same axis
    - for 2D, rotation axis is perpendiculat to the xy plane
    - pick a pivot point
    - SIMPLIFICATION
    - translate the pivot point to origin (0,0)
    - the math is easier
    - LEARN THIS
* Scaling
    - multiply by scaling factors
    - if sx = sy then you have uniform scaling
    - but if you do that, you will change both the size and the location
    - so you need to correct with a fixed reference point
    - To do it right you can use homogeneous coordinates
    - mapping: (x,y) -> (xh, yh, h)
    - h is the homogeneous parameter
    - if 2D we set h to 1


# Day 9 

### Color Models

* Visible color is 3.8 x 10^14 hz (reds) through 7.9 x 10^14th hz (violets)
* Frequency corresponds to spectral color
* White - all frequencies
    - Reflected: The dominant frequency is perceived (also known as hue)

### Characteristics
* Brightness: luminance, total light energy
* Purity/Saturation: how close is it to a pure spectral color
* Chromaticity: Pruity & hue

### RGB

Additive color model.
Typically used for emissive displays
C(lamda) = (R,G,B) = R(R) + G(G) + B(B)

### CMYK

Subtractive color model.  It is reflected light, which a combonation of pigments.
Used for print, typesetting / photo

[C,M,Y] = [1,1,1] - [R,G,B]

### YIQ

NTSC encoding (the encoding for US. UK uses pal)

Y = Brightness
I & Q = hue & purity
I = orange/cayan - flesh tones
Q = green magenta

Y = .299R + .587G + .114B
I = R - Y
Q = B - Y

# Day (Who Knows Any More)

How to determine if an object is in the viewing window.  This problem is called the *clipping* problem.

1. Figure out what's completely outside (cheap)
2. Figure out whats completely inside (cheap)
3. Figure out partial includes (hard)

Cohen-sutherland (CS)

Extend the lines of the viewbox into infinity.  Each spot is assigned a region. Top, Bottom, Right Left (TBRL) 0 means it is in, 1 means it is out

To see if a line is partially in, look at the end points of the line.

If there is a one in the same position on either endpoint, then you know it is all the way out.  AKA if you AND the two region codes together, you get any 1 for the and, then you know you are outside.  You know that something is completly inbound if you OR them and get false.