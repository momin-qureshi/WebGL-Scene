class Square2D {


  static vertexPositions = [
    vec3(-5, -0.5, -5),
    vec3(-5, -0.5, 5),
    vec3(5, -0.5, 5),
    vec3(-5, -0.5, -5),
    vec3(5, -0.5, -5),
    vec3(5, -0.5, 5),
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
    }

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
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);

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

  constructor() {
    this.vertexPositions = Square2D.vertexPositions;
    for (let i = 0; i < 0; i ++) {
      this.vertexPositions = this.subdivide(this.vertexPositions);
    }
    this.texture = this.loadTexture(gl, './textures/grass.jpg');
  
    this.textureCoordinates = [];
    for (let i = 0; i < this.vertexPositions.length; i += 3) {
      
      this.textureCoordinates.push(0, 0);
      this.textureCoordinates.push(0, 1);
      this.textureCoordinates.push(1, 1);
      this.textureCoordinates.push(0, 0);
      this.textureCoordinates.push(1, 0);
      this.textureCoordinates.push(1, 1);
    }
  }

  subdivide(vertexPositions) {

    let newVertices = [];
    // iterate over each face and divide into 4
    for (let i = 0; i < vertexPositions.length; i = i + 6) {
      let x1 = vertexPositions[i][0];
      let z1 = vertexPositions[i][2];

      let x2 = vertexPositions[i + 2][0];
      let z2 = vertexPositions[i + 2][2];

      let midx = (x1 + x2) / 2;
      let midz = (z1 + z2) / 2;

      // top left face
      newVertices.push(vec3(x1, -0.5, z1));
      newVertices.push(vec3(x1, -0.5, midz));
      newVertices.push(vec3(midx, -0.5, midz));

      newVertices.push(vec3(x1, -0.5, z1));
      newVertices.push(vec3(midx, -0.5, z1));
      newVertices.push(vec3(midx, -0.5, midz));
      
      // top right face
      newVertices.push(vec3(midx, -0.5, z1));
      newVertices.push(vec3(midx, -0.5, midz));
      newVertices.push(vec3(x2, -0.5, midz));

      newVertices.push(vec3(midx, -0.5, z1));
      newVertices.push(vec3(x2, -0.5, z1));
      newVertices.push(vec3(x2, -0.5, midz));

      // bottom left face
      newVertices.push(vec3(x1, -0.5, midz));
      newVertices.push(vec3(x1, -0.5, z2));
      newVertices.push(vec3(midx, -0.5, z2));

      newVertices.push(vec3(x1, -0.5, midz));
      newVertices.push(vec3(midx, -0.5, midz));
      newVertices.push(vec3(midx, -0.5, z2));

      // bottom right face
      newVertices.push(vec3(midx, -0.5, midz));
      newVertices.push(vec3(midx, -0.5, z2));
      newVertices.push(vec3(x2, -0.5, z2));

      newVertices.push(vec3(midx, -0.5, midz));
      newVertices.push(vec3(x2, -0.5, midz));
      newVertices.push(vec3(x2, -0.5, z2));
      
    }
    return newVertices;
  }

  draw(vMat) {
    // Load the data into the GPU
    var mMat = translate(0,0,0);

    var mvMatrix = mult(vMat, mMat);
    
    World.setmvMatrixUniform(flatten(mvMatrix));

    let normalMatrix = inverse4(mMat);
    normalMatrix = transpose(normalMatrix);
    World.setNormalMatrixUniform(flatten(normalMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, World.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array(flatten(this.vertexPositions.map(_ => vec3(0, 1, 0)))),
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
      flatten(this.vertexPositions.map(_ => vec4(0, 1, 0, 1))),
      gl.STATIC_DRAW
    );
    World.vertexAttribPointerColor();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                gl.STATIC_DRAW);
    World.vertexAttribPointerTexture();
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(World.uSampler, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositions.length);
  }
}
