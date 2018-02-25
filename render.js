/**
 * Created by Hans Dulimarta.
 */
let canvas;
let gl;
let allObjs = [];
var toggleBtn;


function main() {
  canvas = document.getElementById("my-canvas");

  //toggle button for controls table
  toggleBtn = document.querySelector('input');
  toggleBtn.addEventListener('click', toggleTable);

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
      vec3.fromValues (-13, -13, 10),  // eye coord
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

    //var color = vec3.fromValues(.1, .3, .7);

    // let scale = new PolygonalPrism(gl, {
    //     topRadius: .5,
    //     bottomRadius: .5,
    //     numSides: 15,
    //     height: 1,
    //     topColor: color,
    //     bottomColor: color
    // });
    //let sphere = new Sphere(gl, {radius: 0.2, splitDepth: 4});

    //mat4.translate(scale.coordFrame, scale.coordFrame, vec3.fromValues(1, 1, 0));
    //mat4.translate(sphere.coordFrame, sphere.coordFrame, vec3.fromValues(.3, .3, 0));

    let rocket = new FalconHeavy(gl);

    allObjs.push(rocket);
}

function setupListeners(){
    //keydown control
    window.addEventListener('keydown', event => {
        var key = String.fromCharCode(event.keyCode);

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
    });
}


function resizeWindow() {
  let w = window.innerWidth - 16;
  let h = 0.75 * window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  mat4.perspective (projMat, glMatrix.toRadian(60), w/h, 0.05, 20);
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
