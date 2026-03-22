function e(n){return n<0?[.55,0,1]:n<2e3?[0,0,1]:n<4e3?[0,.75,1]:n<6e3?[0,.8,0]:n<8e3?[1,1,0]:n<1e4?[1,0,0]:n<12e3?[.8,0,0]:n<14e3?[1,.55,0]:[.55,.27,.07]}const t=`precision highp float;

attribute vec3 aColor;
attribute float aSize;

uniform float uPixelRatio;
uniform float uTime;

varying vec3 vColor;

void main() {
  vColor = aColor;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Fixed screen-space size with subtle distance attenuation
  // Closer points slightly larger for depth perception
  float dist = length(mvPosition.xyz);
  float attenuation = 300.0 / max(dist, 1.0);
  float size = aSize * uPixelRatio * (0.8 + clamp(attenuation, 0.0, 1.5));

  gl_PointSize = max(1.5 * uPixelRatio, size);
  gl_Position = projectionMatrix * mvPosition;
}
`,i=`precision highp float;

varying vec3 vColor;

void main() {
  // Soft circular point with glow
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);

  // Core + halo falloff
  float core = exp(-dist * dist * 18.0);
  float halo = 1.0 - smoothstep(0.1, 0.5, dist);

  float alpha = core * 0.8 + halo * 0.3;
  if (alpha < 0.01) discard;

  // Bright core fading to colored halo
  vec3 color = mix(vColor, vec3(1.0), core * 0.4);

  gl_FragColor = vec4(color, alpha);
}
`,o=2557,a=[{name:"Milky Way",sgx:0,sgy:0,sgz:0},{name:"Andromeda (M31)",sgx:0,sgy:0,sgz:0,pgc:o},{name:"Virgo",sgx:-200,sgy:1100,sgz:0},{name:"Centaurus",sgx:-3200,sgy:3200,sgz:0},{name:"Hydra",sgx:-2800,sgy:3800,sgz:0},{name:"Great Attractor",sgx:-4200,sgy:1800,sgz:0},{name:"Perseus-Pisces",sgx:-4800,sgy:4500,sgz:0},{name:"Coma",sgx:-300,sgy:6800,sgz:0}];export{a as S,e as a,i as f,t as v};
