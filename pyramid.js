class PyramidGL {

  static vertexPositions = [
    // APEX
    vec3(0.0, 0.5, 0.0),
    // BASE
    vec3(-0.5, -0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(-0.5, -0.5, -0.5),
  ];

  static vertexIndices = [0, 1, 2,  0, 2, 3,  0, 3, 4,  0, 4, 1];

  static vertexColors = [
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
  ];

  draw(vMat) {
    gl.useProgram(World.currentShaderProgram);

    // Load the data into the GPU
    var mMat = translate(0,0,0);

    var mvMatrix = mult(vMat, mMat);
    
    World.setmvMatrixUniform(flatten(mvMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, World.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(PyramidGL.vertexIndices.map(v => PyramidGL.vertexPositions[v])),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerPosition();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(PyramidGL.vertexIndices.map(v => PyramidGL.vertexColors[v])),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerColor();

    gl.drawArrays(gl.TRIANGLES, 0, 12);

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(PyramidGL.vertexIndices.map(v => vec4(0,0,0,1))),
      gl.STATIC_DRAW
    );
    World.vertexAttribPointerColor();
    gl.drawArrays(gl.LINES, 0, 12);
  }
}
