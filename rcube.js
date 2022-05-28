class RainbowCube {
  static vertexPositions = [
    vec3(-0.5, -0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(-0.5, -0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
  ];

  static vertexIndices = [
    0, 2, 1, 0, 3, 2,

    7, 5, 6, 7, 4, 5,

    0, 7, 3, 0, 4, 7,

    1, 6, 5, 1, 2, 6,

    0, 5, 4, 0, 1, 5,

    3, 6, 2, 3, 7, 6,
  ];

  static vertexNormals = [
    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, -1.0,

    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    0.0, -1.0, 0.0, 0.0,

    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    0.0, 0.0, -1.0, 0.0,

    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
  ];

  static textureCoordinates = [
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  //
  // Initialize a texture and load an image.
  // When the image finished loading copy it into the texture.
  //
  loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    let isPowerOf2 = (value) => {
      return (value & (value - 1)) == 0;
    };

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
    return texture;
  }

  constructor(position) {
    this.x = 0;
    this.y = 0;
    this.z = 0; // Load texture
    this.texture = this.loadTexture(gl, "./textures/rainbow.jpg");
    this.position = position;
    console.log(this.position);
    this.angle = 0;
  }

  draw(vMat) {
    // Load the data into the GPU
    var mMat = mat4();
    mMat = mult(
      mMat,
      translate(this.position[0] + Math.cos(this.angle), this.position[1] + Math.sin(this.angle), this.position[2] - Math.tan(this.angle))
    );
    this.angle += 0.02;
    mMat = mult(mMat, rotateY(this.y));
    mMat = mult(mMat, rotateX(this.x));
    mMat = mult(mMat, rotateZ(this.z));
    var mvMatrix = mult(vMat, mMat);

    World.setmvMatrixUniform(flatten(mvMatrix));

    let normalMatrix = inverse4(mMat);
    normalMatrix = transpose(normalMatrix);

    World.setNormalMatrixUniform(flatten(normalMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, World.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(Cube3D.vertexNormals),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerNormal();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(Cube3D.vertexIndices.map((i) => Cube3D.vertexPositions[i])),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerPosition();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(Cube3D.vertexIndices.map((v) => vec4(1, 1, 0, 1))),
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerColor();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.textureCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(Cube3D.textureCoordinates),
      gl.STATIC_DRAW
    );
    World.vertexAttribPointerTexture();
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(World.uSampler, 0);

    gl.drawArrays(gl.TRIANGLES, 0, Cube3D.vertexIndices.length);

    this.x++;
    this.y++;
    this.z++;
  }
}
