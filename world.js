class World {
  static shaderProgram = -1;
  static positionBuffer = -1;
  static colorBuffer = -1;
  static indexBuffer = -1;
  static normalBuffer = -1;
  static lightOn = true;


  static initialize() {
    World.shaderProgram = initShaders(gl, "/vshader.glsl", "/fshader.glsl");
    gl.useProgram(World.shaderProgram);

    World.vertexPositionAttribute = gl.getAttribLocation(
      World.shaderProgram,
      "aPosition"
    );

    gl.enableVertexAttribArray(World.vertexPositionAttribute);
    World.vertexColorAttribute = gl.getAttribLocation(
      World.shaderProgram,
      "aColor"
    );
    gl.enableVertexAttribArray(World.vertexColorAttribute);

    World.vertexNormalAttribute = gl.getAttribLocation(
      World.shaderProgram,
      "aNormal"
    );
    gl.enableVertexAttribArray(World.vertexNormalAttribute);

    World.vertexTextureAttribute = gl.getAttribLocation(
      World.shaderProgram, 
      'aTextureCoord'
    );
    gl.enableVertexAttribArray(World.vertexTextureAttribute);


    World.pMatrixUniform = gl.getUniformLocation(
      World.shaderProgram,
      "uPMatrix"
    );

    World.mvMatrixUniform = gl.getUniformLocation(
      World.shaderProgram,
      "uMVMatrix"
    );

    World.lightVectorUniform = gl.getUniformLocation(
      World.shaderProgram,
      "uLightDirection"
    );

    World.lightToggle = gl.getUniformLocation(
      World.shaderProgram,
      "uFlashLightToggle"
    );
    World.uSampler = gl.getUniformLocation(
      World.shaderProgram,
      "uSampler"
    )


    World.lightOn = false;
    World.toggleLight();

    World.normalMatrix = gl.getUniformLocation(World.shaderProgram, 'uNormalMatrix'),



    World.positionBuffer = gl.createBuffer();
    World.colorBuffer = gl.createBuffer();
    World.indexBuffer = gl.createBuffer();
    World.normalBuffer = gl.createBuffer();
    World.textureCoordBuffer = gl.createBuffer();

    gl.useProgram(World.shaderProgram);
      
    World.skyboxShaderProgram = initShaders(gl, "/skyboxvshader.glsl", "/skyboxfshader.glsl");

    World.skyboxPositionAttribute = gl.getAttribLocation(
      World.skyboxShaderProgram,
      "a_position"
    );

    gl.enableVertexAttribArray(World.skyboxPositionAttribute);

    // uniform samplerCube u_skybox;
    // uniform mat4 u_viewDirectionProjectionInverse;
    
    World.uSkyboxCube = gl.getUniformLocation(
      World.skyboxShaderProgram,
      "u_skybox"
    );

    World.uSkyboxVDPI = gl.getUniformLocation(
      World.skyboxShaderProgram,
      "u_viewDirectionProjectionInverse"
    );

    // create buffers and fill with vertex data
    World.skyboxPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, World.skyboxPositionBuffer);
    var positions = new Float32Array(
      [
        -1, -1, 
         1, -1, 
        -1,  1, 
        -1,  1,
         1, -1,
         1,  1,
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Create a texture.
    World.skyboxTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, World.skyboxTexture);

    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: './skybox/posx.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: './skybox/negx.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: './skybox/posy.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: './skybox/negy.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: './skybox/posz.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: './skybox/negz.jpg',
      },
    ];
    faceInfos.forEach((faceInfo) => {
      const {target, url} = faceInfo;

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      // setup each face so it's immediately renderable
      gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, World.skyboxTexture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  }

  constructor() {
    if (World.shaderProgram == -1) World.initialize();
  }

  static setPMatrixUniform(pMatrix) {
    gl.uniformMatrix4fv(World.pMatrixUniform, false, pMatrix);
  }

  static setmvMatrixUniform(mvMatrix) {
    gl.uniformMatrix4fv(World.mvMatrixUniform, false, mvMatrix);
  }

  static setNormalMatrixUniform(normalMatrix) {
    gl.uniformMatrix4fv(World.normalMatrix, false, normalMatrix);
  }

  static setLightVectorUniform(x, y, z) {
    gl.uniform3f(World.lightVectorUniform, x, y, z);
  }

  static toggleLight() {
    World.lightOn = !World.lightOn;
    gl.uniform1i(World.lightToggle, World.lightOn);
  }

  static vertexAttribPointerPosition() {
    gl.vertexAttribPointer(
      World.vertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  static vertexAttribPointerColor() {
    gl.vertexAttribPointer(
      World.vertexColorAttribute,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  static vertexAttribPointerNormal() {
    gl.vertexAttribPointer(World.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  }

  static vertexAttribPointerTexture() {
    gl.vertexAttribPointer(World.vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);
  }
  


  static render(vMat) {

    var viewDirectionProjectionInverseMatrix =
        inverse(vMat);
    
    gl.useProgram(World.skyboxShaderProgram);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, World.skyboxPositionBuffer);
    gl.vertexAttribPointer(World.skyboxPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(World.uSkyboxVDPI, false, flatten(viewDirectionProjectionInverseMatrix));

        // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, World.skyboxTexture);
    gl.uniform1i(World.uSkyboxCube, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(World.shaderProgram);

  }

}
