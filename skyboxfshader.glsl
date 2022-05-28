#version 300 es
precision mediump float;

uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;

in vec4 v_position;
out vec4 fColor;
void main() {
  vec4 t = u_viewDirectionProjectionInverse * v_position;
  fColor = texture(u_skybox, normalize(t.xyz / t.w));
}