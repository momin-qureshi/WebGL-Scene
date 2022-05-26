#version 300 es

in vec3 aPosition;
in vec3 aNormal;
in vec4 aColor;
in vec2 aTextureCoord;

out vec4 vColor;
out vec3 vLighting;
out vec2 vTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 uLightDirection;

uniform bool uFlashLightToggle;

void main()
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);

    vColor = aColor;
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(0.6,0.6,0.6);
    highp vec3 directionalVector = normalize(uLightDirection);

    highp vec4 transformedNormal = uNormalMatrix * vec4(aNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

    highp vec4 mv = uMVMatrix * vec4(aPosition, 1.0);
    mv.z = 0.0;

    highp vec3 pointLight = vec3(0, 0, 0);
    if (uFlashLightToggle) {
        pointLight = 4.0 / length(mv * mv) * vec3(0.2, 0.2, 0.2);
    }

    vLighting = ambientLight + (directionalLightColor * directional) + pointLight;
    vTextureCoord = aTextureCoord;


}
