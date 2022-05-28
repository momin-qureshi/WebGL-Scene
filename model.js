class Model3D {
  
  constructor(filepath, position) {
    var smf_file = loadFileAJAX(filepath);

    let vertexPositions = [];
    let vertexIndices = [];
    let vertexColors = [];

    var lines = smf_file.split("\n");
    for (var line = 0; line < lines.length; line++) {

      var strings = lines[line].trimRight().split(" ");
      switch (strings[0]) {
        case "v":
          vertexPositions.push(vec3(parseFloat(strings[1]), parseFloat(strings[2]), parseFloat(strings[3])));
          break;

        case "f":
          vertexIndices.push(parseInt(strings[1]) - 1);
          vertexIndices.push(parseInt(strings[2]) - 1);
          vertexIndices.push(parseInt(strings[3]) - 1);
          vertexColors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
          break;
      }
    }

    this.vertexPositions = vertexPositions;
    this.vertexIndices = vertexIndices;
    this.vertexColors = vertexColors;

    this.position = position;
  }

  draw(vMat) {

    // Load the data into the GPU
    var mMat = translate(this.position[0], this.position[1], this.position[2]);
    var mvMatrix = mult(vMat, mMat);
    
    World.setmvMatrixUniform(flatten(mvMatrix));

    
    let normalMatrix = inverse4(mMat);
    normalMatrix = transpose(normalMatrix);

    World.setNormalMatrixUniform(flatten(normalMatrix));
  
    gl.bindBuffer(gl.ARRAY_BUFFER, World.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array(this.vertexPositions),
      gl.STATIC_DRAW
    );
    
    World.vertexAttribPointerNormal();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(this.vertexPositions),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerPosition();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(this.vertexColors),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerColor();


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, World.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.vertexIndices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(Cube3D.vertexIndices.map(v => vec4(1, 1, 0, 1))),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerColor();


    gl.bindBuffer(gl.ARRAY_BUFFER, World.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertexPositions)),
                gl.STATIC_DRAW);
    World.vertexAttribPointerTexture();
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(World.uSampler, 0);

    gl.drawElements(gl.TRIANGLES, this.vertexIndices.length, gl.UNSIGNED_INT, 0);
  }
}
