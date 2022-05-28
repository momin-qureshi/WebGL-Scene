class IcoSphere {
  static icosahedronElements() {
    // create 12 vertices of a icosahedron
    let t = (1.0 + Math.sqrt(5.0)) / 2.0,
      positions = [
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,
        0,

        0,
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,

        t,
        0,
        -1,
        t,
        0,
        1,
        -t,
        0,
        -1,
        -t,
        0,
        1,
      ],
      indices = [
        0,
        11,
        5,
        0,
        5,
        1,
        0,
        1,
        7,
        0,
        7,
        10,
        0,
        10,
        11, // 5 faces around point 0
        1,
        5,
        9,
        5,
        11,
        4,
        11,
        10,
        2,
        10,
        7,
        6,
        7,
        1,
        8, // 5 adjacent faces
        3,
        9,
        4,
        3,
        4,
        2,
        3,
        2,
        6,
        3,
        6,
        8,
        3,
        8,
        9, // 5 faces around point 3
        4,
        9,
        5,
        2,
        4,
        11,
        6,
        2,
        10,
        8,
        6,
        7,
        9,
        8,
        1, // 5 adjacent faces
      ];

    return [positions, indices];
  }

  static icosahedronVertices() {
    let [positions, indices] = IcoSphere.icosahedronElements(),
      indices_length = indices.length,
      vertices = [],
      colors = [];

    for (let i = 0; i < indices_length; i = i + 3) {
      let faceVertices = IcoSphere.getFaceVertices(i, indices, positions);
      Array.prototype.push.apply(vertices, faceVertices);
    }

    return vertices;
  }

  static splitVertices(vertices) {
    let newVertices = [],
      midpoints = {},
      vertices_length = vertices.length;

    // iterate through each face to divide it into 4 faces
    for (let i = 0; i < vertices_length; i = i + 9) {
      // each face is 9 vertices
      let v1_x = vertices[i],
        v1_y = vertices[i + 1],
        v1_z = vertices[i + 2],
        v2_x = vertices[i + 3],
        v2_y = vertices[i + 4],
        v2_z = vertices[i + 5],
        v3_x = vertices[i + 6],
        v3_y = vertices[i + 7],
        v3_z = vertices[i + 8];

      let [v12_x, v12_y, v12_z] = IcoSphere.getMidpoint(
          v1_x,
          v1_y,
          v1_z,
          v2_x,
          v2_y,
          v2_z,
          midpoints
        ),
        [v23_x, v23_y, v23_z] = IcoSphere.getMidpoint(
          v2_x,
          v2_y,
          v2_z,
          v3_x,
          v3_y,
          v3_z,
          midpoints
        ),
        [v31_x, v31_y, v31_z] = IcoSphere.getMidpoint(
          v3_x,
          v3_y,
          v3_z,
          v1_x,
          v1_y,
          v1_z,
          midpoints
        );

      let splitVertices = [
          v1_x,
          v1_y,
          v1_z,
          v12_x,
          v12_y,
          v12_z,
          v31_x,
          v31_y,
          v31_z,

          v12_x,
          v12_y,
          v12_z,
          v2_x,
          v2_y,
          v2_z,
          v23_x,
          v23_y,
          v23_z,

          v31_x,
          v31_y,
          v31_z,
          v23_x,
          v23_y,
          v23_z,
          v3_x,
          v3_y,
          v3_z,

          v12_x,
          v12_y,
          v12_z,
          v23_x,
          v23_y,
          v23_z,
          v31_x,
          v31_y,
          v31_z,
        ];
      Array.prototype.push.apply(newVertices, splitVertices);
    }

    return newVertices;
  }

  static getFaceVertices(index, indices, positions) {
    let face = [indices[index], indices[index + 1], indices[index + 2]],
      iterator = [3 * face[0], 3 * face[1], 3 * face[2]];
    return [
      positions[iterator[0]],
      positions[iterator[0] + 1],
      positions[iterator[0] + 2],
      positions[iterator[1]],
      positions[iterator[1] + 1],
      positions[iterator[1] + 2],
      positions[iterator[2]],
      positions[iterator[2] + 1],
      positions[iterator[2] + 2],
    ];
  }

  static midpoint(a_x, a_y, a_z, b_x, b_y, b_z) {
    return [(a_x + b_x) / 2, (a_y + b_y) / 2, (a_z + b_z) / 2];
  }

  static pointToKey(p_x, p_y, p_z) {
    return (
      p_x.toPrecision(6) + "," + p_y.toPrecision(6) + "," + p_z.toPrecision(6)
    );
  }

  static getMidpoint(a_x, a_y, a_z, b_x, b_y, b_z, midpoints) {
    let [p_x, p_y, p_z] = IcoSphere.midpoint(a_x, a_y, a_z, b_x, b_y, b_z),
      pointKey = IcoSphere.pointToKey(p_x, p_y, p_z),
      cachedPoint = midpoints[pointKey];
    if (cachedPoint) {
      return cachedPoint;
    } else {
      return (midpoints[pointKey] = [p_x, p_y, p_z]);
    }
  }

  static getPointIndexOf(p_x, p_y, p_z, points) {
    let index = -1,
      x_index,
      y_index,
      z_index;
    if ((x_index = points.indexOf(p_x)) > -1) {
      if ((y_index = points.indexOf(p_y)) > -1) {
        if ((z_index = points.indexOf(p_z)) > -1) {
          // 3 vertices found and they are siblings
          if (z_index - y_index === 1 && y_index - x_index === 1) {
            index = x_index;
          }
        }
      }
    }
    return index;
  }

  static subDivide(positions, indices) {
    let newIndices = [],
      newPositions = [],
      midpoints = {},
      indices_length = indices.length;

    // iterate through each face to divide it into 4 faces
    for (let i = 0; i < indices_length; i = i + 3) {
      let [v1_x, v1_y, v1_z, v2_x, v2_y, v2_z, v3_x, v3_y, v3_z] =
        IcoSphere.getFaceVertices(i, indices, positions);

      let [v12_x, v12_y, v12_z] = IcoSphere.getMidpoint(
          v1_x,
          v1_y,
          v1_z,
          v2_x,
          v2_y,
          v2_z,
          midpoints
        ),
        [v23_x, v23_y, v23_z] = IcoSphere.getMidpoint(
          v2_x,
          v2_y,
          v2_z,
          v3_x,
          v3_y,
          v3_z,
          midpoints
        ),
        [v31_x, v31_y, v31_z] = IcoSphere.getMidpoint(
          v3_x,
          v3_y,
          v3_z,
          v1_x,
          v1_y,
          v1_z,
          midpoints
        );

      let calculatedPositions = [
          v1_x,
          v1_y,
          v1_z,
          v2_x,
          v2_y,
          v2_z,
          v3_x,
          v3_y,
          v3_z,
          v12_x,
          v12_y,
          v12_z,
          v23_x,
          v23_y,
          v23_z,
          v31_x,
          v31_y,
          v31_z,
        ],
        filteredPositions = [],
        pointIndices = [];
      // check for already existing points to reduce result size
      for (let i = 0; i < 18; i = i + 3) {
        let index = IcoSphere.getPointIndexOf(
          calculatedPositions[i],
          calculatedPositions[i + 1],
          calculatedPositions[i + 2],
          newPositions
        );
        if (index === -1) {
          // return new length => get new index
          index = (filteredPositions.push(calculatedPositions[i]) - 1) / 3;
          filteredPositions.push(calculatedPositions[i + 1]);
          filteredPositions.push(calculatedPositions[i + 2]);
        }
        pointIndices.push(index);
      }

      Array.prototype.push.apply(newPositions, filteredPositions);
      Array.prototype.push.apply(newIndices, pointIndices);
    }

    return [newPositions, newIndices];
  }

  static normalize(x, y, z) {
    let length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0) {
      return [0, 0, 0];
    }
    return [x / length, y / length, z / length];
  }

  constructor(split_level) {
    if (split_level < 1) {
      split_level = 1;
    }

    let positions = IcoSphere.icosahedronVertices();
    this.length = 60;

    for (let iteration = split_level; iteration > 1; iteration--) {
      positions = IcoSphere.splitVertices(positions);
      this.length *= 4;
    }

    let positions_length = positions.length;
    for (let i = 0; i < positions_length; i = i + 3) {
      let [x, y, z] = IcoSphere.normalize(positions[i], positions[i + 1], positions[i + 2]);
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
    }
    this.positions = new Float32Array(positions);

    this.colors = []
    for (var i = 0; i < this.length; i++) {
        this.colors.push(1.0);
        this.colors.push(1.0);
        this.colors.push(0.0);
        this.colors.push(1.0);
    }
    this.colors = new Float32Array(this.colors);

    
    this.normalMap = [];
    
    for (let i = 0; i < this.positions.length; i += 3) {
      this.normalMap.push(this.positions[i]);
      this.normalMap.push(this.positions[i + 1]);
      this.normalMap.push(this.positions[i + 2]);
    }
    this.normalMap = new Float32Array(this.normalMap);
  }

  draw(vMat) {

    // Load the data into the GPU
    var mMat = translate(0, 0, 0);

    var mvMatrix = mult(vMat, mMat);

    World.setmvMatrixUniform(flatten(mvMatrix));
    
    let normalMatrix = inverse4(mMat);
    normalMatrix = transpose(normalMatrix);
    World.setNormalMatrixUniform(flatten(normalMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, World.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      this.normalMap,
      gl.STATIC_DRAW
    );
    World.vertexAttribPointerNormal();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.positions,
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerPosition();

    gl.bindBuffer(gl.ARRAY_BUFFER, World.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.colors,
      gl.STATIC_DRAW
    );

    World.vertexAttribPointerColor();

    gl.drawArrays(gl.TRIANGLES, 0, this.length);

  }
}
