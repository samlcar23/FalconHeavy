/**
 * Created by Hans Dulimarta.
 */
let canvas;
let gl;
let allObjs = [];
var toggleBtn;
let mouse;
var dragging = false;
var radioBtn;
var selector = "camera";
let rocket;
let car;
let scenery;


function main() {
    canvas = document.getElementById("my-canvas");

    //for mouse control
    mouse = document.getElementById("my-canvas");

    //toggle button for controls table
    toggleBtn = document.getElementById("toggle");

    //radio button for what to control
    radioBtn = ('input[name=control]');


    setupListeners();

    /* setup window resize listener */
    window.addEventListener('resize', resizeWindow);

    gl = WebGLUtils.create3DContext(canvas, null);
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then (prog => {

            /* put all one-time initialization logic here */
            gl.useProgram (prog);
            gl.clearColor (0, 0, 0, 1);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.cullFace(gl.BACK);

            /* the vertex shader defines TWO attribute vars and ONE uniform var */
            let posAttr = gl.getAttribLocation (prog, "vertexPos");
            let colAttr = gl.getAttribLocation (prog, "vertexCol");
            Object3D.linkShaderAttrib({
                positionAttr: posAttr,
                colorAttr: colAttr
            });
            let modelUnif = gl.getUniformLocation (prog, "modelCF");
            projUnif = gl.getUniformLocation (prog, "projection");
            viewUnif = gl.getUniformLocation (prog, "view");
            Object3D.linkShaderUniform({
                projection: projUnif,
                view: viewUnif,
                model: modelUnif
            });
            gl.enableVertexAttribArray (posAttr);
            gl.enableVertexAttribArray (colAttr);
            projMat = mat4.create();
            gl.uniformMatrix4fv (projUnif, false, projMat);
            viewMat = mat4.lookAt(mat4.create(),
                vec3.fromValues (0, -30, 10),  // eye coord
                vec3.fromValues (1, 1, 10),  // gaze point
                vec3.fromValues (0, 0, 1)   // Z is up
            );
            gl.uniformMatrix4fv (viewUnif, false, viewMat);

            /* recalculate new viewport */
            resizeWindow();

            createObject();

            /* initiate the render request */
            window.requestAnimFrame(drawScene);
        });
}

function drawScene() {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    /* in the following three cases we rotate the coordinate frame by 1 degree */
    for (var k = 0; k < allObjs.length; k++)
        allObjs[k].draw(gl);

}


function createObject() {

    //create a starry sky

    //white
    var white = vec3.fromValues(1, 1, 1);
    //mars red?
    var red = vec3.fromValues(.5, 0, 0);

    //random xyz coordinates confined to an area
    var x;
    var y;
    var z;

    for(var i = 0;i < 100; i++){
        let sphere = new Sphere(gl, {
            radius: getRandomArbitrary(.07, .12),
            splitDepth: 5,
            northColor: white,
            equatorColor: white,
            southColor: white
        });

        //get random coordinates
        x = getRandomInt(-60, 60);
        y = getRandomInt(-20, 40);
        z = getRandomInt(40, 60);

        mat4.translate(sphere.coordFrame, sphere.coordFrame, vec3.fromValues(x, y, z));

        allObjs.push(sphere);
    }

    let mars = new Sphere(gl, {
        radius: .2,
        splitDepth: 5,
        northColor: red,
        equatorColor: red,
        southColor: red
    });
    mat4.translate(mars.coordFrame, mars.coordFrame, vec3.fromValues(-5, -5, 55));


    rocket = new FalconHeavy(gl);
    car = new Tesla(gl);
    scenery = new Scenery(gl);
    let car2 = new Tesla(gl);
    let rocket2 = new FalconHeavy(gl);

    //set rocket straight to axes
    mat4.rotateZ(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(45));

    //move car forward, back, and down
    mat4.translate(car.coordFrame, car.coordFrame, vec3.fromValues(-15, -5, -1.6));
    mat4.rotateZ(car.coordFrame, car.coordFrame, glMatrix.toRadian(-45));

    //scale car2
    mat4.scale(car2.coordFrame, car2.coordFrame, vec3.fromValues(.3, .3, .3));
    mat4.translate(car2.coordFrame, car2.coordFrame, vec3.fromValues(-5, -20, -2.5));

    //scale rocket2
    mat4.scale(rocket2.coordFrame, rocket2.coordFrame, vec3.fromValues(.3, .3, .3));
    mat4.translate(rocket2.coordFrame, rocket2.coordFrame, vec3.fromValues(-50, -5, -6));

    allObjs.push(rocket, car, scenery, mars, car2, rocket2);
}

function setupListeners(){
    //keydown control
    window.addEventListener('keydown', event => {
        var key = String.fromCharCode(event.keyCode);

        if(selector === "camera"){
            controlCamera(key);
        } else if(selector === "rocket"){
            controlRocket(key);
        } else if(selector === "car"){
            controlCar(key);
        } else {
            console.log("Something has gone horribly wrong");
        }

        if(event.keyCode === 49){
            console.log("number pressed");
            viewMat = mat4.lookAt(mat4.create(),
                vec3.fromValues (-30, -15, 25),  // eye coord
                vec3.fromValues (1, 1, 2),  // gaze point
                vec3.fromValues (0, 0, 1)   // Z is up
            );
        } else if(event.keyCode === 50){
            console.log("number pressed");
            viewMat = mat4.lookAt(mat4.create(),
                vec3.fromValues (0, -3, -.2),  // eye coord
                vec3.fromValues (-.2, 1, 25),  // gaze point
                vec3.fromValues (0, 0, 1)   // Z is up
            );
        } else if(event.keyCode === 51){
            console.log("number pressed");
            viewMat = mat4.lookAt(mat4.create(),
                vec3.fromValues (20, -20, 3),  // eye coord
                vec3.fromValues (1, 1, 10),  // gaze point
                vec3.fromValues (0, 0, 1)   // Z is up
            );
        }else{

        }
        gl.uniformMatrix4fv (viewUnif, false, viewMat);
        window.requestAnimFrame(drawScene);

    });

    //mouse controls
    mouse.addEventListener ('mousedown', event => {
        dragging = true;
        console.log("Mouse down", dragging);
        console.log(`Mouse down at ${event.offsetX} ${event.offsetY}`);
    });

    mouse.addEventListener ('mouseup', event => {
        dragging = false;
        console.log("Mouse up", dragging);
        console.log(`Mouse up at ${event.offsetX} ${event.offsetY}`);

    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function resizeWindow() {
  let w = window.innerWidth - 16;
  let h = 0.75 * window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  mat4.perspective (projMat, glMatrix.toRadian(60), w/h, 0.05, 80);
  gl.uniformMatrix4fv (projUnif, false, projMat);
  gl.viewport(0, 0, w, h);
}

function toggleTable() {
    var x = document.getElementById("tableView");
    if (x.style.display === "none") {
        x.style.display = "block";
        toggleBtn.value = "Hide Controls";
    } else {
        x.style.display = "none";
        toggleBtn.value = "Show Controls";
    }
}

function objectSelect() {

    if (document.getElementById('car').checked) {
        selector = "car";
        console.log(selector);
    } else if (document.getElementById('rocket').checked) {
        selector = "rocket";

        //camera snap to rocket
        // viewMat = mat4.lookAt(mat4.create(),
        //     vec3.fromValues (0, -20, 10),  // eye coord
        //     vec3.fromValues (1, 1, 10),  // gaze point
        //     vec3.fromValues (0, 0, 1)   // Z is up
        // );

        console.log(selector);
    } else if (document.getElementById('camera').checked) {
        selector = "camera";
        console.log(selector);
    } else {
        console.log("Error in objectSelect()");
    }

    document.getElementById(selector).blur();
}

function controlCar(key){
    var temp = mat4.create();

    switch (key) {
        case 'W':
            //Pitch down
            mat4.rotateY(car.coordFrame, car.coordFrame, glMatrix.toRadian(1));

            break;
        case 'A':
            //Bank left
            mat4.rotateX(car.coordFrame, car.coordFrame, glMatrix.toRadian(-1));

            break;
        case 'S':
            //Pitch up
            mat4.rotateY(car.coordFrame, car.coordFrame, glMatrix.toRadian(-1));

            break;
        case 'D':
            //Bank right
            mat4.rotateX(car.coordFrame, car.coordFrame, glMatrix.toRadian(1));

            break;
        case 'Q':
            //Yaw left
            mat4.rotateZ(car.coordFrame, car.coordFrame, glMatrix.toRadian(1));

            break;
        case 'E':
            //Yaw right
            mat4.rotateZ(car.coordFrame, car.coordFrame, glMatrix.toRadian(-1));

            break;
        case '&':
            //forward
            mat4.translate(car.coordFrame, car.coordFrame, vec3.fromValues(0.1, 0, 0));

            //move camera to follow
            // translation = vec3.fromValues(0, -0.1, 0);
            // mat4.fromTranslation(temp, translation);
            // mat4.multiply(viewMat, temp, viewMat);
            break;
        case '(':
            //Backward
            mat4.translate(car.coordFrame, car.coordFrame, vec3.fromValues(-0.1, 0, 0));

            //move camera to follow
            // translation = vec3.fromValues(0, 0.1, 0);
            // mat4.fromTranslation(temp, translation);
            // mat4.multiply(viewMat, temp, viewMat);
            break;
        case '%':
            //left
            mat4.translate(car.coordFrame, car.coordFrame, vec3.fromValues(0, 0.1, 0));

            break;
        case "'":
            //right
            mat4.translate(car.coordFrame, car.coordFrame, vec3.fromValues(0, -0.1, 0));

            break;
    }
    gl.uniformMatrix4fv (viewUnif, false, viewMat);
    window.requestAnimFrame(drawScene);
}

function controlRocket(key){
    var temp = mat4.create();

    switch (key) {
        case 'W':
            //Pitch down
            mat4.rotateX(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(-1));
            mat4.rotateY(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(1));

            break;
        case 'A':
            //Bank left
            mat4.rotateX(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(-1));
            mat4.rotateY(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(-1));

            break;
        case 'S':
            //Pitch up
            mat4.rotateX(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(1));
            mat4.rotateY(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(-1));

            break;
        case 'D':
            //Bank right
            mat4.rotateX(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(1));
            mat4.rotateY(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(1));

            break;
        case 'Q':
            //Yaw left
            mat4.rotateZ(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(1));

            break;
        case 'E':
            //Yaw right
            mat4.rotateZ(rocket.coordFrame, rocket.coordFrame, glMatrix.toRadian(-1));

            break;
        case '&':
            //up
            mat4.translate(rocket.coordFrame, rocket.coordFrame, vec3.fromValues(0, 0, 0.1));

            //move camera to follow
            // translation = vec3.fromValues(0, -0.1, 0);
            // mat4.fromTranslation(temp, translation);
            // mat4.multiply(viewMat, temp, viewMat);
            break;
        case '(':
            //down
            mat4.translate(rocket.coordFrame, rocket.coordFrame, vec3.fromValues(0, 0, -0.1));

            //move camera to follow
            // translation = vec3.fromValues(0, 0.1, 0);
            // mat4.fromTranslation(temp, translation);
            // mat4.multiply(viewMat, temp, viewMat);
            break;
        case '%':
            //left
            mat4.translate(rocket.coordFrame, rocket.coordFrame, vec3.fromValues(-0.1, 0.1, 0));

            break;
        case "'":
            //right
            mat4.translate(rocket.coordFrame, rocket.coordFrame, vec3.fromValues(0.1, -0.1, 0));

            break;
    }
    gl.uniformMatrix4fv (viewUnif, false, viewMat);
    window.requestAnimFrame(drawScene);
}

function controlCamera(key){
    var temp = mat4.create();

    switch (key) {
        case 'W':
            //Pitch down
            mat4.fromXRotation(temp, 0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case 'A':
            //Bank left
            mat4.fromZRotation(temp, -0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case 'S':
            //Pitch up
            mat4.fromXRotation(temp, -0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case 'D':
            //Bank right
            mat4.fromZRotation(temp, 0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case 'Q':
            //Yaw left
            mat4.fromYRotation(temp, -0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case 'E':
            //Yaw right
            mat4.fromYRotation(temp, 0.1);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case '&':
            //forward
            translation = vec3.fromValues(0, 0, .1);
            mat4.fromTranslation(temp, translation);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case '(':
            //reverse
            translation = vec3.fromValues(0, 0, -.1);
            mat4.fromTranslation(temp, translation);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case '%':
            //left
            translation = vec3.fromValues(.1, 0, 0);
            mat4.fromTranslation(temp, translation);
            mat4.multiply(viewMat, temp, viewMat);
            break;
        case "'":
            //right
            translation = vec3.fromValues(-.1, 0, 0);
            mat4.fromTranslation(temp, translation);
            mat4.multiply(viewMat, temp, viewMat);
            break;
    }
    gl.uniformMatrix4fv (viewUnif, false, viewMat);
    window.requestAnimFrame(drawScene);
}
