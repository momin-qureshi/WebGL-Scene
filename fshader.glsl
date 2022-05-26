#version 300 es
precision mediump float;
in vec4 vColor;
in vec3 vLighting;
in vec2 vTextureCoord;

out vec4 fColor;

uniform sampler2D uSampler;

void main()
{
    fColor = texture(uSampler, vTextureCoord) * vec4(vLighting, 1.0);
}
