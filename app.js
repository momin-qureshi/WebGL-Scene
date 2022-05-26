var canvas;

var gl;

var world;

var sq;
var py;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);

  world = new World();

  cu1 = new Cube3D(vec3(2, 0, 0));
  cu2 = new Cube3D(vec3(3, 0, 0));
  cu3 = new Cube3D(vec3(2.5, 1, 0));

  cu = new RainbowCube(vec3(0, 3, 0))
  sq = new Square2D();

  wall1 = new Wall2D(vec3(-1, 2, 0), 0, 0, 0);
  wall2 = new Wall2D(vec3(-1, -0.5, -1.5), 90, 0, 0);
  wall3 = new Wall2D(vec3(-3.5, -0.5, 0), 0, 0, 90);
  wall4 = new Wall2D(vec3(0.5, -0.5, 0), 0, 0, 90);
  render();
};

async function render() {
  var y = 0.0;

  var pMatrix = perspective(45, 1.0, 0.1, 100.0);
  World.setPMatrixUniform(flatten(pMatrix));


  var x = 0;
  var z = 10.0;
  var y = 4;
  var xRot = 10;
  var yRot = 0;
  var zRot = 0;

  var vMat;

  // register keyboard press listener
  document.addEventListener("keydown", function(key) {
    if (key.key == "W" || key.key == "w") {
      y += 0.05;
    } else if (key.key == "S" || key.key == "s") {
      y -= 0.05;
    } else if (key.key == "A" || key.key == "a") {
      x -= 0.05;
    } else if (key.key == "D" || key.key == "d") {
      x += 0.05;
    } else if (key.key == "Q" || key.key == "q") {
      z -= 0.05;
    } else if (key.key == "E" || key.key == "e") {
      z += 0.05;
    } else if (key.key == "Z") {
      zRot += 1;
    } else if (key.key == 'z') {
      zRot -= 1;
    } else if (key.key == 'X') {
      xRot += 1;
    } else if (key.key == 'x') {
      xRot -= 1;
    } else if (key.key == 'C') {
      yRot += 1;
    } else if (key.key == 'c') {
      yRot -= 1;
    }
    else if(key.key == " ") {
      World.toggleLight();
    }
  });

  const delay = ms => new Promise(res => setTimeout(res, ms));

  let lightRot = 0.0;

  while (true) {
    var vMat = mat4();
    vMat = mult(vMat, rotateX(xRot));
    vMat = mult(vMat, translate(-x, -y, -z));
    vMat = mult(vMat, rotateY(yRot));
    vMat = mult(vMat, rotateZ(zRot));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    World.setLightVectorUniform(Math.cos(lightRot), Math.sin(lightRot), 2);
    lightRot += 0.05;
    if (lightRot > Math.PI * 2) {
      lightRot = 0;
    }
    sq.draw(vMat);
    cu1.draw(vMat);
    cu2.draw(vMat);
    cu3.draw(vMat);

    wall1.draw(vMat)
    wall2.draw(vMat)
    wall3.draw(vMat)
    wall4.draw(vMat)

    cu.draw(vMat);
    World.render(vMat);
    await delay(30);
  }
}
