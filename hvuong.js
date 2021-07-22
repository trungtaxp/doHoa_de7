/* Created by A36000 & A37181 
░█████╗░██████╗░░█████╗░░█████╗░░█████╗░░█████╗░  ░░░░░░  ░█████╗░██████╗░███████╗░░███╗░░░█████╗░░░███╗░░
██╔══██╗╚════██╗██╔═══╝░██╔══██╗██╔══██╗██╔══██╗  ░░░░░░  ██╔══██╗╚════██╗╚════██║░████║░░██╔══██╗░████║░░
███████║░█████╔╝██████╗░██║░░██║██║░░██║██║░░██║  █████╗  ███████║░█████╔╝░░░░██╔╝██╔██║░░╚█████╔╝██╔██║░░
██╔══██║░╚═══██╗██╔══██╗██║░░██║██║░░██║██║░░██║  ╚════╝  ██╔══██║░╚═══██╗░░░██╔╝░╚═╝██║░░██╔══██╗╚═╝██║░░
██║░░██║██████╔╝╚█████╔╝╚█████╔╝╚█████╔╝╚█████╔╝  ░░░░░░  ██║░░██║██████╔╝░░██╔╝░░███████╗╚█████╔╝███████╗
╚═╝░░╚═╝╚═════╝░░╚════╝░░╚════╝░░╚════╝░░╚════╝░  ░░░░░░  ╚═╝░░╚═╝╚═════╝░░░╚═╝░░░╚══════╝░╚════╝░╚══════╝
Copyright © 2021 A36000 & A37181. All rights reserved. */

/*------------------------------------------------------------
|                   Thông tin phiên bản                       |
|                                                             |
| ➤ version 1.0 - sửa hàm collision (kiểm tra va chạm)        |
| ➤ version 1.1 - fix lỗi va chạm (2 hình giao nhau)          |
| ➤ version 1.2 - loại bỏ trục toạ độ Oxy                     |
| ➤ version 1.3 - điều chỉnh tốc độ và chú thích code         |
| ➤ version 1.4 - chưa cập nhật...                            |
-------------------------------------------------------------*/

"use strict";                               // tất cả các dòng code ở phía dưới "use strict" sẽ được quản lý một cách nghiêm ngặt hơn về cú pháp. (ví dụ: x = 9; console.log(window.x); => bị lỗi x chưa được định nghĩa)

var canvas;
var gl;

var program;

var vertices = [];

// hình vuông 1
var uX1;                                    // biến uniform gắn với vertex shader
var x1 = setRandom(-1000,900);              // toạ độ x ban đầu (ramdom)
var x1_speed = -13.0;                       // tốc độ di chuyển
var uY1;                                    // biến uniform gắn với vertex shader
var y1 = setRandom(-600,500);               // toạ độ y ban đầu (ramdom)
var y1_speed = -13.0;                       // tốc độ di chuyển


// hình vuông 2
var uX2;                                    // ~ ~ ~
var x2 = setRandom(-1000,900);              
var x2_speed = -13.0;
var uY2;
var y2 = setRandom(-600,500);
var y2_speed = -13.0;

// hình vuông 3
var uX3;                                    // ~ ~ ~
var x3 = setRandom(-1000,900);
var x3_speed = -13.0;
var uY3;
var y3 = setRandom(-600,500);
var y3_speed = -13.0;


var drawStatus;                             // trạng thái

window.onload = function init() {                                       // khi trình duyệt đã load xong mọi thứ thì những đoạn code nằm bên trong window.onload mới được chạy và hàm init() cụ thể có thể được sử dụng để khởi tạo toàn bộ trang web
    canvas = document.getElementById("hcn");                            // chuẩn bị canvas và get WebGL context
    gl = canvas.getContext('webgl2');                                   // ~ ~ ~


    gl.viewport(0, 0, canvas.width, canvas.height);                     // thiết lập viewport
    gl.clearColor(1.0, 1.0, 1.0, 1.0);                                  // set màu cho canvas (màu trắng)
    gl.clear(gl.COLOR_BUFFER_BIT);                                      // ~ ~ ~

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var uResolution = gl.getUniformLocation(program, "uResolution");    // Lấy uniform location (vị trí thống nhất) của program
    gl.uniform2f(uResolution, canvas.width, canvas.height);             // ~ ~ ~
    
    uX1 = gl.getUniformLocation(program, "uX1");                        // Lấy uniform location (vị trí thống nhất) của program
    uY1 = gl.getUniformLocation(program, "uY1");                        // ~ ~ ~
    uX2 = gl.getUniformLocation(program, "uX2");                        // ~ ~ ~
    uY2 = gl.getUniformLocation(program, "uY2");                        // ~ ~ ~
    uX3 = gl.getUniformLocation(program, "uX3");                        // ~ ~ ~
    uY3 = gl.getUniformLocation(program, "uY3");                        // ~ ~ ~ 
    
    drawStatus = gl.getUniformLocation(program, "drawStatus"); 
    
    vertices = [                                                        // hình vuông
        vec2(0.0, 0.0),
        vec2(0.0, 100.0),
        vec2(100.0, 100.0),
        vec2(100.0, 0.0)
    ];
    
    render();                                                           // vẽ hình vuông
    
};

// vẽ trục toạ độ (bỏ)

/*function setToaDo(x, y) {
    var vertices = [
        vec2(x, -canvas.height), 
        vec2(x, canvas.height), 
        vec2(-canvas.width, y), 
        vec2(canvas.width, y)
    ];
    spRender(vertices);
    gl.uniform1i(drawStatus, 0);
    gl.drawArrays(gl.LINES, 0, vertices.length);
}*/

// render
function render() {

    // vẽ màn hình viewport
    gl.clearColor(1.0, 1.0, 1.0, 1.0);      // set màu cho canvas (màu trắng)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // setToaDo(0,0);                       // vẽ trục toạ độ (bỏ)
    
    // hình 1 di chuyển
    x1 = x1 + x1_speed;                     // di chuyển đến toạ độ mới (x - 10)
    y1 = y1 + y1_speed;                     // di chuyển đến toạ độ mới (y - 10)
    if(x1 > 900 || x1 < -1000) {            // nếu toạ độ x sau khi di chuyển va vào khung thì đổi dấu x_speed (di chuyển ngược lại) 
        x1_speed = -x1_speed;
    }
    if(y1 > 500 || y1 < -600) {             // nếu toạ độ y sau khi di chuyển va vào khung thì đổi dấu y_speed (di chuyển ngược lại)
        y1_speed = -y1_speed;
    }
    
    // hình 2 di chuyển
    x2 = x2 + x2_speed;                     // ~ ~ ~
    y2 = y2 + y2_speed;
    if(x2 > 900|| x2 < -1000) {
        x2_speed = -x2_speed;
    }
    if(y2> 500|| y2 < -600) {
        y2_speed = -y2_speed;
    }
    
    // hình 3 di chuyển
    x3 = x3 + x3_speed;                     // ~ ~ ~
    y3 = y3 + y3_speed;
    if(x3 > 900 || x3 < -1000) {
        x3_speed = -x3_speed;
    }
    if(y3 > 500 || y3 < -600) {
        y3_speed = -y3_speed;
    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x1, y1], [x2, y2])){                 // điều kiện đúng

        if (Math.abs(y1-y2) >= Math.abs(x1-x2)) {       // nếu hình 1 và hình 2 chạm nhau theo chiều dọc (ví dụ hình 1 ở trên và hình 2 ở dưới) thì ta có khoảng cách từ y1 -> y2 luôn luôn lớn hơn hoặc bằng (chỉ bằng khi 2 góc của 2 hình chạm nhau) khoảng cách từ x1 -> x2 => điều kiện
            y1_speed = -y1_speed;                       // sau khi va chạm thì hình 1 di chuyển ngược lại
            y2_speed = -y2_speed;                       // sau khi va chạm thì hình 2 di chuyển ngược lại

        }
        if (Math.abs(x1-x2) >= Math.abs(y1-y2)) {       // nếu hình 1 và hình 2 chạm nhau theo chiều ngang (vị dụ hình 1 ở bên trái và hình 2 ở bên phải) thì ta có khoảng cái từ x1 -> x2 luôn luôn lớn hơn hoặc bằng (chỉ bằng khi 2 góc của 2 hình chạm nhau) khoảng cách từ y1 -> y2 => điều kiện
            x1_speed = -x1_speed;                       // sau khi va chạm thì hình 1 di chuyển ngược lại
            x2_speed = -x2_speed;                       // sau khi va chạm thì hình 2 di chuyển ngược lại
        }
            
    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x1, y1], [x3, y3])) {
        if (Math.abs(y1-y3) >= Math.abs(x1-x3)) {         // ~ ~ ~
            y1_speed = -y1_speed;
            y3_speed = -y3_speed;

        }
        if (Math.abs(x1-x3) >= Math.abs(y1-y3)) {         // ~ ~ ~
            x1_speed = -x1_speed;
            x3_speed = -x3_speed;
        }
    }

    // hình 1 và hình 2 va chạm với nhau
    if (collision([x2, y2], [x3, y3])) {
        if (Math.abs(y2-y3) >= Math.abs(x2-x3)) {         // ~ ~ ~
            y2_speed = -y2_speed;
            y3_speed = -y3_speed;
        }
        if (Math.abs(x2-x3) >= Math.abs(y2-y3)) {         // ~ ~ ~
            x2_speed = -x2_speed;
            x3_speed = -x3_speed;
        }
            
    }

    // vẽ hình theo từng trạng thái                                     // phương thức của API WebGL chỉ định giá trị của các biến thống nhất
    gl.uniform1f(uX1, x1);                                              // chuyền toạ độ x1 (float) vào biến uX1
    gl.uniform1f(uY1, y1);                                              // chuyền toạ độ y1 (float) vào biến uY1
    gl.uniform1i(drawStatus, 1);                                        // trạng thái hình 1 = 1(int) => kiểm tra điều kiện ở vertex-shader
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);

    gl.uniform1f(uX2, x2);                                              // ~ ~ ~
    gl.uniform1f(uY2, y2);
    gl.uniform1i(drawStatus, 2);
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);   // trạng thái hình 2 = 2(int) => kiểm tra điều kiện ở vertex-shader

    gl.uniform1f(uX3, x3);                                              // ~ ~ ~
    gl.uniform1f(uY3, y3);
    gl.uniform1i(drawStatus, 3);
    setRectangle(vertices[0], vertices[1], vertices[2], vertices[3]);   // trạng thái hình 3 = 3(int) => kiểm tra điều kiện ở vertex-shader

    requestAnimationFrame(render);                                      // animation (yêu cầu khung animation)
}

// hỗ trợ Render
function spRender(vertices) {
    var vBuffer = gl.createBuffer();                                    // tạo buffer object (vertex buffer object được sử dụng để lưu trữ data tương ứng với đỉnh)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                            // bind buffer object với một mảng buffer rỗng
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);  // lưu trữ dữ liệu các đỉnh vào buffer (chuyền data vertices vào buffer)

    var aPosition = gl.getAttribLocation(program, "aPosition");         // Lấy attribute location (vị trí thuộc tính) của program
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);        // ~ ~ ~
    gl.enableVertexAttribArray(aPosition);                              // ~ ~ ~
}

function setRectangle(v1, v2, v3, v4) { 
    var vertices = [v1, v2, v3, v4];                                    // tạo đỉnh
    spRender(vertices);                                                 // render
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);                 // vẽ hình (ở đây là hình chữ nhật)
}

// random
function setRandom(min, max) {                          // trả về một số nguyên ngẫu nhiên giữa 2 số được chỉ định. Giá trị không thấp hơn min và nhỏ hơn (nhưng không bằng) max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// va chạm
function collision(a, b) {
    var x = a[0] - b[0];                                // khoảng cách giữa 2 hình theo trục hoành
    var y = a[1] - b[1];                                // khoảnh cách giữa 2 hình theo trục tung
    var h = 100;                                        // độ dài cạnh 
    
    if (Math.abs(x) > h || Math.abs(y) > h) {           // nếu khoảng cách giữa 2 hình lớn hơn độ dài cạnh thì 2 hình đó không va chạm và ngược lại
        return false;
    } else {
        return true;
    }
}