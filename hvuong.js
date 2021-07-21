"use strict";

var canvas;
var gl;

var program;

var vertices = [];

// hình vuông 1
var uX1;                                    // biến uniform gắn với vertex shader
var x1 = setRandom(-1000, 900);              // toạ độ x ban đầu (ramdom)
var x1_speed = -10.0;                       // tốc độ di chuyển
var uY1;                                    // biến uniform gắn với vertex shader
var y1 = setRandom(-600, 500);               // toạ độ y ban đầu (ramdom)
var y1_speed = -10.0;                       // tốc độ di chuyển


// hình vuông 2
var uX2;                                    // ~ ~ ~
var x2 = setRandom(-1000, 900);
var x2_speed = -10.0;
var uY2;
var y2 = setRandom(-600, 500);
var y2_speed = -10.0;

// hình vuông 3
var uX3;                                    // ~ ~ ~
var x3 = setRandom(-1000, 900);
var x3_speed = -10.0;
var uY3;
var y3 = setRandom(-600, 500);
var y3_speed = -10.0;


var uDrawStatus;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');

    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var uResolution = gl.getUniformLocation(program, "uResolution");
    gl.uniform2f(uResolution, canvas.width, canvas.height);

    uX1 = gl.getUniformLocation(program, "uX1");
    uY1 = gl.getUniformLocation(program, "uY1");
    uX2 = gl.getUniformLocation(program, "uX2");
    uY2 = gl.getUniformLocation(program, "uY2");
    uX3 = gl.getUniformLocation(program, "uX3");
    uY3 = gl.getUniformLocation(program, "uY3");

    uDrawStatus = gl.getUniformLocation(program, "uDrawStatus");

    // hình vuông
    vertices = [
        vec2(0.0, 0.0),
        vec2(0.0, 100.0),
        vec2(100.0, 100.0),
        vec2(100.0, 0.0)
    ];

    // vẽ hình vuông
    render();

};

// vẽ trục toạ độ (bỏ)

/*function setToaDo(x, y) {
    var vertices = [
        vec2(x, -canvas.height), 
        vec2(x, canvas.height), 
        vec2(-canvas.width, y), 
        vec2(canvas.width, y)
    ];
    supportRender(vertices);
    gl.uniform1i(uDrawStatus, 0);
    gl.drawArrays(gl.LINES, 0, vertices.length);
}*/

// render
function render() {

    // vẽ màn hình viewport
    gl.clearColor(1.0, 1.0, 1.0, 1.0);      // background canvas (màu trắng)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // setToaDo(0,0);                       // vẽ trục toạ độ (bỏ)

    // hình 1 di chuyển
    x1 = x1 + x1_speed;                     // di chuyển đến toạ độ mới (x - 10)
    y1 = y1 + y1_speed;                     // di chuyển đến toạ độ mới (y - 10)
    if (x1 > 900 || x1 < -1000) {            // nếu toạ độ x sau khi di chuyển va vào khung thì đổi dấu x_speed (di chuyển ngược lại) 
        x1_speed = -x1_speed;
    }
    if (y1 > 500 || y1 < -600) {             // nếu toạ độ y sau khi di chuyển va vào khung thì đổi dấu y_speed (di chuyển ngược lại)
        y1_speed = -y1_speed;
    }

    // hình 2 di chuyển
    x2 = x2 + x2_speed;                     // ~ ~ ~
    y2 = y2 + y2_speed;
    if (x2 > 900 || x2 < -1000) {
        x2_speed = -x2_speed;
    }
    if (y2 > 500 || y2 < -600) {
        y2_speed = -y2_speed;
    }

    // hình 3 di chuyển
    x3 = x3 + x3_speed;                     // ~ ~ ~
    y3 = y3 + y3_speed;
    if (x3 > 900 || x3 < -1000) {
        x3_speed = -x3_speed;
    }
    if (y3 > 500 || y3 < -600) {
        y3_speed = -y3_speed;
    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x1, y1], [x2, y2])) {

        if (Math.abs(y1 - y2) >= Math.abs(x1 - x2)) {       // nếu hình 1 và hình 2 chạm nhau theo chiều dọc (ví dụ hình 1 ở trên và hình 2 ở dưới) thì ta có khoảng cách từ y1 -> y2 luôn luôn lớn hơn hoặc bằng (chỉ bằng khi 2 góc của 2 hình chạm nhau) khoảng cách từ x1 -> x2 => điều kiện
            y1_speed = -y1_speed;                       // sau khi va chạm thì hình 1 di chuyển ngược lại
            y2_speed = -y2_speed;                       // sau khi va chạm thì hình 2 di chuyển ngược lại

        }
        if (Math.abs(x1 - x2) >= Math.abs(y1 - y2)) {       // nếu hình 1 và hình 2 chạm nhau theo chiều ngang (vị dụ hình 1 ở bên trái và hình 2 ở bên phải) thì ta có khoảng cái từ x1 -> x2 luôn luôn lớn hơn hoặc bằng (chỉ bằng khi 2 góc của 2 hình chạm nhau) khoảng cách từ y1 -> y2 => điều kiện
            x1_speed = -x1_speed;                       // sau khi va chạm thì hình 1 di chuyển ngược lại
            x2_speed = -x2_speed;                       // sau khi va chạm thì hình 2 di chuyển ngược lại
        }

    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x1, y1], [x3, y3])) {
        if (Math.abs(y1 - y3) >= Math.abs(x1 - x3)) {         // ~ ~ ~
            y1_speed = -y1_speed;
            y3_speed = -y3_speed;

        }
        if (Math.abs(x1 - x3) >= Math.abs(y1 - y3)) {         // ~ ~ ~
            x1_speed = -x1_speed;
            x3_speed = -x3_speed;
        }
    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x2, y2], [x3, y3])) {
        if (Math.abs(y2 - y3) >= Math.abs(x2 - x3)) {         // ~ ~ ~
            y2_speed = -y2_speed;
            y3_speed = -y3_speed;
        }
        if (Math.abs(x2 - x3) >= Math.abs(y2 - y3)) {         // ~ ~ ~
            x2_speed = -x2_speed;
            x3_speed = -x3_speed;
        }

    }

    // vẽ hình theo từng trạng thái
    gl.uniform1f(uX1, x1);
    gl.uniform1f(uY1, y1);
    gl.uniform1i(uDrawStatus, 1);
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);

    gl.uniform1f(uX2, x2);
    gl.uniform1f(uY2, y2);
    gl.uniform1i(uDrawStatus, 2);
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);

    gl.uniform1f(uX3, x3);
    gl.uniform1f(uY3, y3);
    gl.uniform1i(uDrawStatus, 3);
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);
    // Animation
    requestAnimationFrame(render);
}

// Support Render

function supportRender(vertices) {
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
}

function setRectangle(v1, v2, v3, v4) {
    var vertices = [v1, v2, v3, v4];

    supportRender(vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
}

// random
function setRandom(min, max) {                              //trả về một số nguyên ngẫu nhiên giữa 2 số được chỉ định. Giá trị không thấp hơn min và nhỏ hơn (nhưng không bằng) max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// va chạm
function collision(a, b) {
    var x = a[0] - b[0];
    var y = a[1] - b[1];
    var h = 100;

    if (Math.abs(x) > h || Math.abs(y) > h) {
        return false;
    } else {
        return true;
    }
}