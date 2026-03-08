import{W as ze}from"./three.module-1IXlXC5N.js";import{m as De}from"./morphologyMapper-DirS7Qm3.js";import{c as Z,B as le,a as W,A as oe,b as ce,m as I,h as Re,x as ee,$ as ge,y as ye,M as E,d as xe,ab as Ae,D as ke,u as Pe,aS as Te,L as $,w as he,f as de,N as Ie,K as J,C as Ee,V,Q as K,S as ue,P as Le,dh as Ne,aQ as He}from"./three.core-Bozt1HMY.js";import{g as _e}from"./initialOrbit-BPNXFfis.js";const b=Math.PI*2,L={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,dustHueRange:[240,280],brightHueRange:[10,45],hiiRegionChance:.15}},me=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function D(l){const e=L.visual.dustFraction,o=L.visual.brightFraction;return l<e?"dust":l>1-o?"bright":"star"}function R(l){switch(l){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function A(l,e,o){const t=L.visual;if(l==="dust")return t.dustHueRange[0]+Math.random()*(t.dustHueRange[1]-t.dustHueRange[0]);if(l==="bright")return t.brightHueRange[0]+Math.random()*(t.brightHueRange[1]-t.brightHueRange[0]);const n=Math.pow(e,.6);let a=0;for(const h of me)a+=h.wInner*(1-n)+h.wOuter*n;let i=Math.random()*a;for(const h of me)if(i-=h.wInner*(1-n)+h.wOuter*n,i<=0)return h.hue+(Math.random()-.5)*h.spread;return 42}function k(l){const{baseSpeed:e,falloff:o,referenceRadius:t}=L.rotation;return e/Math.pow(Math.max(l,t)/t,o)}function Oe(l){return l.galaxyRadius*.06}function Fe(l,e){const o=Oe(e);return l.filter(t=>t.radius>=o)}function ne(l){const e=Math.random()*b,o=Math.sqrt(Math.random())*l,t=(Math.random()-.5)*l*.08,n=D(Math.random()),a=R(n),i=o/l;return{radius:o,angle:e,y:t,rotationSpeed:k(o),hue:A(n,i),brightness:a.brightness,size:a.size,alpha:a.alpha,layer:n,twinklePhase:Math.random()*b}}function fe(l,e){const o=[],t=l.morphology,n=l.galaxyRadius,a=t.numArms,i=Math.floor(e/a),h=t.armWidth*n,d=t.spiralTightness,m=t.spiralStart*n,c=t.irregularity,s=t.barLength>0,v=t.barLength*n,g=2.5,f=Math.min(Math.max(m,s?v*.5:0),n*.98),r=f*f,p=n*n;for(let u=0;u<a;u++){const y=u/a*b;for(let S=0;S<i;S++){const M=Math.sqrt(Math.random()*(p-r)+r),w=Math.max(m,.001),N=Math.log(Math.max(M/w,1))/Math.max(d,.001)*g+y,X=M/n*.5+.5,Y=(Math.random()-.5+Math.random()-.5)*h*X,q=N+Math.PI/2,x=c*(Math.random()-.5)*30,C=Math.cos(N)*(M+x)+Math.cos(q)*Y,P=Math.sin(N)*(M+x)+Math.sin(q)*Y,H=M/n,_=n*L.visual.diskThicknessRatio*(1-H*.7),O=(Math.random()-.5)*_,z=Math.sqrt(C*C+P*P),F=Math.atan2(P,C),U=z/n,T=k(z),B=D(Math.random()),G=R(B),j=A(B,U);o.push({radius:z,angle:F,y:O,rotationSpeed:T,hue:j,brightness:G.brightness,size:G.size,alpha:G.alpha,layer:B,twinklePhase:Math.random()*b})}}return o}function Ue(l,e){const o=[],t=l.galaxyRadius,n=l.morphology.barLength*t,a=l.morphology.barWidth*t;for(let i=0;i<e;i++){const h=(Math.random()-.5)*2*n,d=(Math.random()-.5)*a,m=h,c=d,s=Math.sqrt(m*m+c*c);if(s>t)continue;const v=Math.atan2(c,m),g=D(Math.random()),f=R(g),r=A(g,.1);o.push({radius:s,angle:v,y:(Math.random()-.5)*t*.04,rotationSpeed:k(s),hue:r,brightness:f.brightness,size:f.size,alpha:f.alpha,layer:g,twinklePhase:Math.random()*b})}return o}function pe(l,e){const o=[],t=l.morphology.bulgeRadius*l.galaxyRadius;for(let n=0;n<e;n++){const a=Math.pow(Math.random(),.6)*t,i=Math.random()*b,h=(Math.random()-.5)*t*.5,d=a/t,m=1+(1-d)*.5,c=D(Math.random()),s=R(c);o.push({radius:a,angle:i,y:h,rotationSpeed:k(a)*.5,hue:A(c,.1),brightness:Math.min(s.brightness*m,.95),size:s.size*(1+(1-d)*.3),alpha:Math.min(s.alpha*m,.95),layer:c,twinklePhase:Math.random()*b})}return o}function Be(l,e){const o=[],t=l.galaxyRadius,n=l.morphology.axisRatio;for(let a=0;a<e;a++){const i=Math.random(),h=Math.random(),d=Math.pow(i,.4)*t,m=h*b,c=d*Math.cos(m),s=d*Math.sin(m)*n,v=Math.sqrt(c*c+s*s),g=Math.atan2(s,c),f=v/t,r=D(Math.random()),p=R(r),u=A(r,f);o.push({radius:v,angle:g,y:(Math.random()-.5)*t*.1*(1-f*.5),rotationSpeed:k(v)*.3,hue:u,brightness:p.brightness,size:p.size,alpha:p.alpha,layer:r,twinklePhase:Math.random()*b})}return o}function Ge(l,e){const o=[],t=l.galaxyRadius,n=l.morphology.bulgeRadius*t;for(let a=0;a<e;a++){const i=Math.pow(Math.random(),.55)*t,h=Math.random()*b,d=i/t,m=t*.06*Math.pow(Math.max(1-d,0),2),c=(Math.random()-.5)*m,s=Math.max(0,Math.min(1,1-i/Math.max(n,1))),v=1+s*.4,g=D(Math.random()),f=R(g);o.push({radius:i,angle:h,y:c,rotationSpeed:k(i)*(s>0?.5:1),hue:A(g,d*.2),brightness:Math.min(f.brightness*v,.95),size:f.size*(1+s*.3),alpha:Math.min(f.alpha*v,.95),layer:g,twinklePhase:Math.random()*b})}return o}function Ve(l,e){const o=[],t=l.galaxyRadius,n=l.morphology.irregularity,a=l.morphology.clumpCount,i=[];for(let h=0;h<a;h++){const d=h/a*b+Math.random()*.5,m=(.2+Math.random()*.6)*t;i.push({x:Math.cos(d)*m,z:Math.sin(d)*m,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<L.visual.hiiRegionChance})}for(let h=0;h<e;h++){let d,m;if(Math.random()<1-n){const p=Math.floor(Math.random()*a),u=i[p],y=()=>(Math.random()-.5+Math.random()-.5)*2;d=u.x+y()*u.sigma,m=u.z+y()*u.sigma,u.isHII&&Math.random()<.4}else{const p=Math.random()*b,u=Math.sqrt(Math.random())*t;d=Math.cos(p)*u+(Math.random()-.5)*60,m=Math.sin(p)*u+(Math.random()-.5)*60}const c=Math.sqrt(d*d+m*m);if(c>t*1.1)continue;const s=Math.atan2(m,d),v=c/t,g=D(Math.random()),f=R(g),r=A(g,v);o.push({radius:c,angle:s,y:(Math.random()-.5)*t*.12,rotationSpeed:k(c)*(.5+Math.random()*.5),hue:r,brightness:f.brightness,size:f.size,alpha:f.alpha,layer:g,twinklePhase:Math.random()*b})}return o}function We(l){const e=l.morphology,o=l.starCount,t=l.galaxyRadius;let n=[];const a=e.barLength>0,i=e.numArms>0,h=e.clumpCount>0&&e.irregularity>0,d=e.ellipticity>0&&!i&&!a&&!h,m=!i&&!a&&!h&&e.ellipticity===0&&e.bulgeFraction>0;if(d)n.push(...Be(l,o));else if(m)n.push(...Ge(l,o));else if(h){const c=Math.floor(o*e.fieldStarFraction),s=o-c;n.push(...Ve(l,s));for(let v=0;v<c;v++)n.push(ne(t))}else if(a&&i){const c=Math.floor(o*.25),s=o-c;n.push(...Ue(l,c));const v=Math.floor(s*.9);n.push(...fe(l,v));const g=e.bulgeRadius*t;if(g>0){const r=Math.min(.2,.08+.18*(g/t)),p=Math.floor(o*r);n.push(...pe(l,p))}const f=Math.floor(s*.1);for(let r=0;r<f;r++)n.push(ne(t))}else if(i){const c=e.fieldStarFraction,s=Math.floor(o*(1-c));n.push(...fe(l,s));const v=e.bulgeRadius*t;if(v>0){const f=Math.min(.25,.1+.2*(v/t)),r=Math.floor(o*f);n.push(...pe(l,r))}const g=Math.floor(o*c);for(let f=0;f<g;f++)n.push(ne(t))}return Fe(n,l)}const Xe=`attribute float aSize;
attribute vec4 aColor;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Give the fragment shader more room for a broad corona while still capping
  // the largest sprites before they become giant soft blobs.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 24.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;
}
`,Ye=`precision highp float;

varying vec4 vColor;

float saturate(float value) {
    return clamp(value, 0.0, 1.0);
}

void main() {
    vec2 coord = gl_PointCoord * 2.0 - vec2(1.0);
    float dist = length(coord);

    if (dist > 1.0) {
        discard;
    }

    float edge = 1.0 - smoothstep(0.62, 1.0, dist);
    float core = exp(-dist * dist * 34.0);
    float innerCorona = exp(-dist * dist * 5.2) * 0.42;
    float outerCorona = exp(-dist * dist * 1.55) * 0.28;

    // Subtle diffraction-style streaking to keep bright stars lively without
    // turning the whole sprite into a fuzzy disc.
    float rays = pow(max(0.0, 1.0 - abs(coord.x * coord.y) * 7.0), 5.0);
    rays *= exp(-dist * dist * 5.0) * 0.07;

    float corona = innerCorona + outerCorona + rays;
    vec3 coronaColor = mix(vColor.rgb * 1.32, vec3(1.0), 0.12);
    vec3 coreColor = mix(coronaColor, vec3(1.0), 0.92);
    vec3 litRgb = coronaColor * corona + coreColor * (core * 1.35);
    float alpha = vColor.a * saturate((core * 1.2 + innerCorona + outerCorona * 0.95 + rays) * edge);

    // Keep the output un-premultiplied so additive blending preserves hue and
    // does not effectively square the alpha contribution.
    gl_FragColor = vec4(litRgb, alpha);
}
`;function qe(l,e,o){l/=360;const t=e*Math.min(o,1-o),n=a=>{const i=(a+l*12)%12;return o-t*Math.max(Math.min(i-3,9-i,1),-1)};return[n(0),n(8),n(4)]}function je(l){switch(l){case"dust":return .3;case"star":return .65;case"bright":return .5}}function Ze(l,e){switch(l){case"dust":return e*.4;case"star":return e*.6;case"bright":return e*.85}}class Qe{constructor(e,o=600){this.stars=e,this.baseDistance=o;const t=e.length,n=new Float32Array(t*3),a=new Float32Array(t*4),i=new Float32Array(t*4),h=new Float32Array(t);this.angleOffsets=new Float32Array(t),this.baseAlphas=new Float32Array(t);for(let c=0;c<t;c++){const s=e[c],v=s.radius*Math.cos(s.angle),g=s.radius*Math.sin(s.angle);n[c*3]=v,n[c*3+1]=s.y,n[c*3+2]=g;const f=je(s.layer),r=Ze(s.layer,s.brightness),[p,u,y]=qe(s.hue,f,r);a[c*4]=i[c*4]=p,a[c*4+1]=i[c*4+1]=u,a[c*4+2]=i[c*4+2]=y,a[c*4+3]=s.alpha,i[c*4+3]=0,h[c]=s.size,this.angleOffsets[c]=s.angle,this.baseAlphas[c]=s.alpha}const d=new Z(n,3),m=new Z(h,1);this.backgroundGeometry=new le,this.backgroundGeometry.setAttribute("position",d),this.backgroundGeometry.setAttribute("aColor",new Z(a,4)),this.backgroundGeometry.setAttribute("aSize",m),this.foregroundGeometry=new le,this.foregroundGeometry.setAttribute("position",d),this.foregroundGeometry.setAttribute("aColor",new Z(i,4)),this.foregroundGeometry.setAttribute("aSize",m),this.material=new W({vertexShader:Xe,fragmentShader:Ye,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:o}},transparent:!0,depthWrite:!1,blending:oe}),this.foregroundMaterial=this.material.clone(),this.foregroundMaterial.uniforms={uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:o}},this.points=new ce(this.backgroundGeometry,this.material),this.points.frustumCulled=!1,this.foregroundPoints=new ce(this.foregroundGeometry,this.foregroundMaterial),this.foregroundPoints.frustumCulled=!1,this.foregroundPoints.renderOrder=2}update(e,o,t,n,a,i,h,d){const m=this.stars,c=m.length,s=this.backgroundGeometry.getAttribute("position"),v=this.backgroundGeometry.getAttribute("aColor"),g=this.foregroundGeometry.getAttribute("aColor"),f=s.array,r=v.array,p=g.array,u=t.matrixWorldInverse.elements,y=t.projectionMatrix.elements,S=u[14],M=t.position.length(),w=I.smoothstep(1-Math.abs(t.position.y)/Math.max(M,1e-4),.55,.95),te=I.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),w),N=I.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),w),X=I.lerp(.75,1.2,w),Y=Math.max(i*X/Math.max(h*.5,1),.04),q=Math.max(i*X/Math.max(d*.5,1),.04);for(let x=0;x<c;x++){const C=m[x];this.angleOffsets[x]+=C.rotationSpeed*e;const P=this.angleOffsets[x];f[x*3]=C.radius*Math.cos(P),f[x*3+2]=C.radius*Math.sin(P);let H=this.baseAlphas[x];if(C.layer==="bright"){const Ce=Math.sin(o*2+C.twinklePhase)*.15+.85;H*=Ce}const _=f[x*3],O=f[x*3+1],z=f[x*3+2],F=u[0]*_+u[4]*O+u[8]*z+u[12],U=u[1]*_+u[5]*O+u[9]*z+u[13],T=u[2]*_+u[6]*O+u[10]*z+u[14],B=y[0]*F+y[4]*U+y[8]*T+y[12],G=y[1]*F+y[5]*U+y[9]*T+y[13],j=y[3]*F+y[7]*U+y[11]*T+y[15],ae=j!==0?1/j:0,be=B*ae,Me=G*ae,se=(be-n)/Y,ie=(Me-a)/q,Se=1-I.smoothstep(.75,1.25,Math.sqrt(se*se+ie*ie)),we=I.smoothstep(T-S,te,te+N),re=Se*we;r[x*4+3]=H*(1-re),p[x*4+3]=H*re}s.needsUpdate=!0,v.needsUpdate=!0,g.needsUpdate=!0}dispose(){this.backgroundGeometry.dispose(),this.foregroundGeometry.dispose(),this.material.dispose(),this.foregroundMaterial.dispose()}}class Ke{constructor(e){const t=document.createElement("canvas");t.width=512,t.height=512;const n=t.getContext("2d"),a=512/2,i=512/2,h=n.createRadialGradient(a,i,0,a,i,a*.3);h.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),h.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),h.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),h.addColorStop(1,"hsla(20, 50%, 30%, 0)"),n.fillStyle=h,n.fillRect(0,0,512,512);const d=n.createRadialGradient(a,i,0,a,i,a*.7);d.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),d.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),d.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),d.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=d,n.fillRect(0,0,512,512);const m=n.createRadialGradient(a,i,0,a,i,a);m.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),m.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),m.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=m,n.fillRect(0,0,512,512);const c=new Re(t);c.needsUpdate=!0;const s=e*3,v=new ee(s,s);this.material=new ge({map:c,transparent:!0,depthWrite:!1,blending:oe,side:ye}),this.mesh=new E(v,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var e;(e=this.material.map)==null||e.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const $e=`precision highp float;

varying vec3 vDirection;

void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Je=`precision highp float;

varying vec3 vDirection;

uniform float uTime;
uniform float uSeed;
uniform float uNebulaIntensity;

#define PI 3.14159265359
#define TAU 6.28318530718

// Noise constants
const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;
const int FBM_MAX_OCTAVES = 8;

// Nebula structure
const float NEBULA_SCALE = 0.5;
const float NEBULA_DETAIL = 2.0;
const int SPIRAL_NOISE_ITER = 5;
const float NUDGE = 3.0;
const float DENSITY_THRESHOLD = 0.02;
const float DENSITY_FALLOFF = 0.5;

// =============================================================================
// HASH FUNCTIONS
// =============================================================================

float seedHash(float seed) {
  vec3 p3 = fract(vec3(seed) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

// =============================================================================
// SIMPLEX NOISE 3D
// =============================================================================

vec3 mod289_3(vec3 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 mod289_4(vec4 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 permute_4(vec4 x) {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3D(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289_3(i);
  vec4 p = permute_4(permute_4(permute_4(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;

  return NOISE_OUTPUT_SCALE_3D * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// =============================================================================
// FBM (variable octaves)
// =============================================================================

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  vec3 shift = vec3(100.0);

  for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise3D(p * frequency);
    p += shift;
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

// =============================================================================
// SPIRAL NOISE — creates organic filamentary structure
// =============================================================================

float spiralNoise(vec3 p, float seed) {
  float normalizer = 1.0 / sqrt(1.0 + NUDGE * NUDGE);
  float n = 1.5 - seed * 0.5;
  float iter = 2.0;

  for (int i = 0; i < SPIRAL_NOISE_ITER; i++) {
    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xy += vec2(p.y, -p.x) * NUDGE;
    p.xy *= normalizer;
    p.xz += vec2(p.z, -p.x) * NUDGE;
    p.xz *= normalizer;
    iter *= 1.5 + seed * 0.2;
  }

  return n;
}

// =============================================================================
// NEBULA DENSITY — heterogeneous with bright/dark regions
// =============================================================================

float nebulaDensity(vec3 p, float seed) {
  float k = 1.5 + seed * 0.5;
  float spiral = spiralNoise(p * NEBULA_SCALE, seed);
  float detail = fbm3D(p * NEBULA_DETAIL, 4) * 0.35;
  float fine = fbm3D(p * NEBULA_DETAIL * 3.0, 2) * 0.15;
  return k * (0.5 + spiral * 0.5 + detail + fine);
}

float densityVariation(vec3 p, float seed) {
  float largeBright = fbm3D(p * 0.3 + seed * 50.0, 2);
  largeBright = smoothstep(-0.4, 0.4, largeBright);
  float mediumVar = fbm3D(p * 0.8 + seed * 30.0, 2);
  mediumVar = mediumVar * 0.5 + 0.5;
  return 0.3 + largeBright * (0.4 + mediumVar * 0.3);
}

float voidMask(vec3 p, float seed) {
  float voidNoise = fbm3D(p * 0.6 + seed * 70.0, 2);
  float voids = smoothstep(-0.5, 0.3, voidNoise);
  float smallVoids = fbm3D(p * 1.5 + seed * 90.0, 2);
  smallVoids = smoothstep(-0.5, 0.2, smallVoids);
  return 0.55 + voids * smallVoids * 0.45;
}

float brightRegions(vec3 p, float seed) {
  float patch1 = fbm3D(p * 0.5 + seed * 40.0, 2);
  patch1 = pow(max(patch1 + 0.3, 0.0), 2.0);
  float cores = fbm3D(p * 1.5 + seed * 60.0, 2);
  cores = pow(max(cores + 0.5, 0.0), 3.0) * 0.5;
  return patch1 + cores;
}

// =============================================================================
// EMISSION COLORS — physically-inspired nebula palette
// =============================================================================

vec3 nebulaEmissionColor(float hue, float variation) {
  vec3 hAlpha = vec3(0.9, 0.3, 0.35);   // H-alpha red
  vec3 oiii   = vec3(0.2, 0.7, 0.65);   // OIII teal
  vec3 sii    = vec3(0.8, 0.25, 0.2);   // SII deep red
  vec3 hBeta  = vec3(0.3, 0.5, 0.8);    // H-beta blue

  vec3 color;
  if (hue < 0.25) {
    color = mix(hAlpha, oiii, hue / 0.25);
  } else if (hue < 0.5) {
    color = mix(oiii, hBeta, (hue - 0.25) / 0.25);
  } else if (hue < 0.75) {
    color = mix(hBeta, sii, (hue - 0.5) / 0.25);
  } else {
    color = mix(sii, hAlpha, (hue - 0.75) / 0.25);
  }

  color += (variation - 0.5) * 0.15;
  return color;
}

// =============================================================================
// STAR COLOR FROM TEMPERATURE
// =============================================================================

vec3 starColorFromTemp(float temp) {
  if (temp < 0.2) {
    return mix(vec3(1.0, 0.6, 0.4), vec3(1.0, 0.75, 0.5), temp / 0.2);
  } else if (temp < 0.4) {
    return mix(vec3(1.0, 0.75, 0.5), vec3(1.0, 0.9, 0.75), (temp - 0.2) / 0.2);
  } else if (temp < 0.6) {
    return mix(vec3(1.0, 0.9, 0.75), vec3(1.0, 1.0, 1.0), (temp - 0.4) / 0.2);
  } else if (temp < 0.8) {
    return mix(vec3(1.0, 1.0, 1.0), vec3(0.85, 0.9, 1.0), (temp - 0.6) / 0.2);
  } else {
    return mix(vec3(0.85, 0.9, 1.0), vec3(0.7, 0.8, 1.0), (temp - 0.8) / 0.2);
  }
}

// =============================================================================
// STAR SCINTILLATION
// =============================================================================

float starScintillation(float baseIntensity, float starHash, float time) {
  if (baseIntensity < 0.5) return baseIntensity;
  float scint = 1.0;
  scint += 0.03 * sin(time * 1.5 + starHash * TAU);
  scint += 0.02 * sin(time * 2.7 + starHash * TAU * 1.3);
  return baseIntensity * scint;
}

// =============================================================================
// DISTANT GAS CLOUD — background nebula patches
// =============================================================================

vec4 distantGasCloud(vec3 dir, float seed, vec3 cloudCenter, float cloudSize, vec3 cloudColor) {
  float dist = length(dir - cloudCenter);
  float mask = 1.0 - smoothstep(0.0, cloudSize, dist);
  mask = pow(max(mask, 0.0), 1.5);

  if (mask < 0.01) return vec4(0.0);

  vec3 localPos = (dir - cloudCenter) / cloudSize;
  float noise = fbm3D(localPos * 3.0 + seed * 10.0, 3) * 0.5 + 0.5;
  float detail = fbm3D(localPos * 8.0 + seed * 20.0, 2) * 0.5 + 0.5;

  float voidNoise = fbm3D(localPos * 2.0 + seed * 30.0, 2);
  float voids = smoothstep(-0.3, 0.2, voidNoise);

  float brightCore = fbm3D(localPos * 4.0 + seed * 40.0, 2);
  brightCore = pow(max(brightCore + 0.4, 0.0), 2.5);

  float density = mask * noise * (0.7 + detail * 0.3) * voids;
  density += brightCore * mask * 0.3;

  float edge = smoothstep(0.0, 0.3, mask) * (1.0 - smoothstep(0.7, 1.0, mask));
  density *= 0.4 + edge * 0.6;

  float colorVar = fbm3D(localPos * 2.5 + seed * 15.0, 2) * 0.15;
  vec3 variedColor = cloudColor * (0.85 + colorVar * 2.0);
  variedColor = mix(variedColor, cloudColor * 1.3, brightCore);

  vec3 color = variedColor * (0.12 + density * 0.28);

  return vec4(color, density * 0.45);
}

// =============================================================================
// EMISSION KNOT — compact bright HII region
// =============================================================================

vec4 emissionKnot(vec3 dir, float seed, vec3 center, float size, vec3 knotColor) {
  float dist = length(dir - center);
  float mask = 1.0 - smoothstep(0.0, size, dist);
  mask = pow(max(mask, 0.0), 2.0);

  if (mask < 0.01) return vec4(0.0);

  vec3 localPos = (dir - center) / size;
  float noise = fbm3D(localPos * 5.0 + seed * 25.0, 2) * 0.5 + 0.5;
  float density = mask * noise;

  float core = exp(-dist * 30.0 / size) * 0.8;
  density += core;

  vec3 color = knotColor * density * 0.6;
  return vec4(color, min(density * 0.5, 1.0));
}

// =============================================================================
// DISTANT GALAXY — tiny background smudge
// =============================================================================

vec3 distantGalaxy(vec3 dir, float seed, vec3 center, float size) {
  float dist = length(dir - center);
  if (dist > size * 2.0) return vec3(0.0);

  vec3 toCenter = dir - center;
  vec3 tiltAxis = normalize(hash33(vec3(seed * 100.0)) - 0.5);

  float diskDist = length(toCenter - tiltAxis * dot(toCenter, tiltAxis));
  float heightDist = abs(dot(toCenter, tiltAxis));

  float angle = atan(toCenter.y, toCenter.x);
  float spiral = sin(angle * 2.0 + diskDist * 20.0 / size + seed * TAU) * 0.5 + 0.5;

  float disk = exp(-diskDist * 8.0 / size) * exp(-heightDist * 40.0 / size);
  float bulge = exp(-dist * 15.0 / size) * 0.8;

  float brightness = (disk * (0.3 + spiral * 0.7) + bulge) * 0.15;

  vec3 galaxyColor = mix(vec3(1.0, 0.9, 0.7), vec3(0.9, 0.85, 1.0), seedHash(seed + 0.5));
  return galaxyColor * brightness;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
  vec3 dir = normalize(vDirection);
  float time = uTime * 0.35;
  float realTime = uTime;

  // Seed-derived parameters for this galaxy's sky
  float sh1 = seedHash(uSeed);
  float sh2 = seedHash(uSeed + 1.0);
  float sh3 = seedHash(uSeed + 2.0);
  float sh4 = seedHash(uSeed + 3.0);
  float sh5 = seedHash(uSeed + 4.0);
  float sh6 = seedHash(uSeed + 5.0);

  float flowTime = uTime * 0.008;

  // Animated position for main nebula
  vec3 animPos = dir + vec3(
    flowTime * 0.03 * (sh1 - 0.5),
    flowTime * 0.03 * 0.5,
    flowTime * 0.03 * (sh2 - 0.5)
  );

  // === DEEP SPACE BACKGROUND ===
  vec3 finalColor = vec3(0.005, 0.005, 0.008);

  // === DISTANT GALAXIES (very far background) ===
  int numGalaxies = 2 + int(sh5 * 3.0);
  for (int i = 0; i < 4; i++) {
    if (i >= numGalaxies) break;
    float galSeed = seedHash(uSeed + float(i) * 7.0 + 100.0);
    vec3 galCenter = normalize(vec3(
      seedHash(galSeed) - 0.5,
      seedHash(galSeed + 0.1) - 0.5,
      seedHash(galSeed + 0.2) - 0.5
    ));
    float galSize = 0.03 + seedHash(galSeed + 0.3) * 0.04;
    finalColor += distantGalaxy(dir, galSeed, galCenter, galSize);
  }

  // === STARS — 4 layers, jittered positions to break grid artifacts ===
  float starField = 0.0;
  vec3 starColor = vec3(1.0);

  // Bright stars (sparse, vivid color, scintillation)
  vec3 starCell1 = floor(dir * 180.0);
  float starHash1 = seedHash(dot(starCell1, vec3(127.1, 311.7, 74.7)) + uSeed);
  if (starHash1 > 0.993) {
    vec3 jitter1 = hash33(starCell1 + uSeed) * 0.8 + 0.1;
    vec3 starCenter = (starCell1 + jitter1) / 180.0;
    float dist = length(dir - normalize(starCenter));
    float star = exp(-dist * 800.0) * (0.6 + starHash1 * 0.4);
    star = starScintillation(star, starHash1, realTime);
    starField = star;
    starColor = starColorFromTemp(seedHash(starHash1 * 77.7));
  }

  // Medium stars
  vec3 starCell2 = floor(dir * 320.0);
  float starHash2 = seedHash(dot(starCell2, vec3(93.1, 157.3, 211.7)) + uSeed * 2.0);
  if (starHash2 > 0.988) {
    vec3 jitter2 = hash33(starCell2 + uSeed + 7.0) * 0.8 + 0.1;
    vec3 starCenter2 = (starCell2 + jitter2) / 320.0;
    float dist2 = length(dir - normalize(starCenter2));
    float star2 = exp(-dist2 * 1000.0) * (0.35 + starHash2 * 0.35);
    if (star2 > starField) {
      starField = star2;
      starColor = starColorFromTemp(seedHash(starHash2 * 77.7));
    }
  }

  // Faint stars (dense layer)
  vec3 starCell3 = floor(dir * 520.0);
  float starHash3 = seedHash(dot(starCell3, vec3(41.1, 89.3, 173.7)) + uSeed * 3.0);
  if (starHash3 > 0.978) {
    vec3 jitter3 = hash33(starCell3 + uSeed + 13.0) * 0.8 + 0.1;
    vec3 starCenter3 = (starCell3 + jitter3) / 520.0;
    float dist3 = length(dir - normalize(starCenter3));
    float faint = exp(-dist3 * 1400.0) * 0.25;
    starField = max(starField, faint);
  }

  // Very faint stars (densest layer — fills the sky)
  vec3 starCell4 = floor(dir * 850.0);
  float starHash4 = seedHash(dot(starCell4, vec3(17.3, 43.7, 97.1)) + uSeed * 4.0);
  if (starHash4 > 0.970) {
    vec3 jitter4 = hash33(starCell4 + uSeed + 19.0) * 0.8 + 0.1;
    vec3 starCenter4 = (starCell4 + jitter4) / 850.0;
    float dist4 = length(dir - normalize(starCenter4));
    starField = max(starField, exp(-dist4 * 2000.0) * 0.1);
  }

  finalColor += starColor * starField;

  // === DISTANT GAS CLOUDS (background nebula patches) ===
  int numClouds = 3 + int(sh4 * 4.0);
  for (int i = 0; i < 6; i++) {
    if (i >= numClouds) break;
    float cloudSeed = seedHash(uSeed + float(i) * 13.0 + 50.0);
    vec3 cloudCenter = normalize(vec3(
      seedHash(cloudSeed) - 0.5,
      seedHash(cloudSeed + 0.1) - 0.5,
      seedHash(cloudSeed + 0.2) - 0.5
    ));
    float cloudSize = 0.15 + seedHash(cloudSeed + 0.3) * 0.25;
    float cloudHue = fract(sh1 + 0.3 + seedHash(cloudSeed + 0.4) * 0.4);
    vec3 cloudColor = nebulaEmissionColor(cloudHue, seedHash(cloudSeed + 0.5));
    vec4 cloud = distantGasCloud(dir, cloudSeed, cloudCenter, cloudSize, cloudColor);
    finalColor = mix(finalColor, finalColor + cloud.rgb * uNebulaIntensity, cloud.a);
  }

  // (dark nebulae removed — they created unwanted dark spots in the backdrop)

  // === MAIN NEBULA — spiral noise with heterogeneous density ===
  vec3 lightDir = normalize(vec3(sh1 - 0.5, 0.3, sh2 - 0.5));

  float mainDensity = nebulaDensity(animPos * 2.0, sh1);
  float offsetDensity = nebulaDensity(animPos * 2.0 + lightDir * 0.15, sh1);
  float density = mainDensity * 0.65 + offsetDensity * 0.35;

  // Heterogeneous density: bright regions + voids
  float variation = densityVariation(animPos, sh1);
  density *= 0.3 + variation * 1.2;

  float voids = voidMask(animPos, sh2);
  density *= voids;

  float brightSpots = brightRegions(animPos, sh3);
  density += brightSpots * 0.4;

  float cloudMask = smoothstep(DENSITY_THRESHOLD, DENSITY_THRESHOLD + DENSITY_FALLOFF, density);
  cloudMask *= 0.85;

  // Color variation across nebula
  float colorNoise = fbm3D(animPos * 1.2 + vec3(sh3 * 10.0), 3);
  colorNoise = colorNoise * 0.5 + 0.5;
  float regionalHue = fbm3D(animPos * 0.4 + sh4 * 20.0, 2) * 0.3;
  float hue = fract(sh1 + colorNoise * 0.25 + regionalHue);
  vec3 nebulaColor = nebulaEmissionColor(hue, colorNoise);

  // Brightness
  float hotspots = fbm3D(animPos * 2.5 + sh6 * 30.0, 2);
  hotspots = pow(max(hotspots + 0.3, 0.0), 2.0);

  float brightness = 0.5 + cloudMask * 0.8;
  brightness *= 0.85 + sh4 * 0.3;
  brightness *= 0.6 + brightSpots * 1.2;
  brightness *= 0.8 + hotspots * 0.8;
  brightness *= 0.7 + variation * 0.8;
  nebulaColor *= brightness;

  // Structure detail
  float structure = fbm3D(animPos * 4.0, 2) * 0.5 + 0.5;
  nebulaColor *= 0.85 + structure * 0.3;

  // Edge glow (ionization fronts)
  float edgeGlow = pow(max(cloudMask, 0.0), 0.6) - pow(max(cloudMask, 0.0), 1.8);
  nebulaColor += nebulaColor * edgeGlow * 0.5;

  float brightEdge = pow(max(brightSpots - 0.2, 0.0), 0.5);
  nebulaColor += nebulaEmissionColor(hue + 0.1, 0.8) * brightEdge * 0.3;

  // Dust lanes
  float dustLane = fbm3D(animPos * 1.5 + vec3(sh2 * 5.0), 3);
  dustLane = smoothstep(0.2, 0.5, dustLane);
  nebulaColor *= 0.5 + dustLane * 0.5;

  // Void regions dim
  nebulaColor *= 0.2 + voids * 0.8;

  float nebulaAlpha = cloudMask * 0.7 * voids;

  // === EMISSION KNOTS ===
  int numKnots = 2 + int(sh3 * 4.0);
  for (int i = 0; i < 5; i++) {
    if (i >= numKnots) break;
    float knotSeed = seedHash(uSeed + float(i) * 23.0 + 300.0);
    vec3 knotCenter = normalize(vec3(
      (seedHash(knotSeed) - 0.5) * 0.8,
      (seedHash(knotSeed + 0.1) - 0.5) * 0.8,
      0.5 + seedHash(knotSeed + 0.2) * 0.3
    ));
    float knotSize = 0.02 + seedHash(knotSeed + 0.3) * 0.03;
    float knotHue = fract(sh1 + 0.15 + seedHash(knotSeed + 0.4) * 0.2);
    vec3 knotColor = nebulaEmissionColor(knotHue, 0.7) * 1.5;
    vec4 knot = emissionKnot(dir, knotSeed, knotCenter, knotSize, knotColor);
    nebulaColor += knot.rgb;
    nebulaAlpha = max(nebulaAlpha, knot.a);
  }

  // === COMBINE NEBULA WITH BACKGROUND ===
  float obscuration = nebulaAlpha * 0.8 * uNebulaIntensity;
  finalColor = mix(finalColor, nebulaColor, obscuration);

  // Stars punch through slightly
  finalColor += starColor * starField * (1.0 - obscuration) * 0.3;


  // === FINAL ADJUSTMENTS ===
  // Subtle vignette on vertical extremes
  float vignette = 1.0 - pow(max(abs(dir.y) - 0.10, 0.0), 2.0) * 0.08;
  finalColor *= vignette;

  // Dim for intergalactic backdrop: this sky should feel remote and subdued,
  // with nebula light reading as far-off emission rather than a local glow.
  finalColor *= 0.45;
  finalColor = clamp(finalColor, 0.0, 1.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;class et{constructor(e,o){const t=e*12,n=new xe(t,192,128);this.material=new W({vertexShader:$e,fragmentShader:Je,uniforms:{uTime:{value:0},uSeed:{value:o},uNebulaIntensity:{value:2.4}},side:Ae,depthWrite:!1,depthTest:!1}),this.mesh=new E(n,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(e,o){this.material.uniforms.uTime.value=e,this.mesh.position.copy(o.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const tt=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,nt=`precision highp float;

varying vec2 vUV;

uniform mat4 uInvViewProj;     // inverse(projectionMatrix * viewMatrix)
uniform float uTime;
uniform float uGalaxyRadius;   // world-space galaxy radius
uniform float uSeed;
uniform float uNebulaIntensity;
uniform float uGalaxyRotation;
uniform float uAxisRatio;       // b/a axis ratio (1.0 = circular, <1 = elongated)
uniform sampler2D uDensityMap;

#define PI 3.14159265359
#define TAU 6.28318530718

// ─── Noise helpers ───────────────────────────────────────────────────────────

const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;
const float FBM_LACUNARITY = 2.0;
const float FBM_PERSISTENCE = 0.5;
const float NUDGE = 3.0;

vec3 mod289_3(vec3 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 mod289_4(vec4 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 permute_4(vec4 x) {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3D(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289_3(i);
  vec4 p = permute_4(permute_4(permute_4(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;

  return NOISE_OUTPUT_SCALE_3D * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = FBM_PERSISTENCE;
  float frequency = 1.0;
  vec3 shift = vec3(100.0);

  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise3D(p * frequency);
    p += shift;
    frequency *= FBM_LACUNARITY;
    amplitude *= FBM_PERSISTENCE;
  }

  return value;
}

float spiralNoise(vec3 p, float seed) {
  float normalizer = 1.0 / sqrt(1.0 + NUDGE * NUDGE);
  float n = 1.5 - seed * 0.5;
  float iter = 2.0;

  for (int i = 0; i < 5; i++) {
    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xy += vec2(p.y, -p.x) * NUDGE;
    p.xy *= normalizer;
    p.xz += vec2(p.z, -p.x) * NUDGE;
    p.xz *= normalizer;
    iter *= 1.5 + seed * 0.2;
  }

  return n;
}

float nebulaDensity(vec3 p, float seed) {
  float k = 1.5 + seed * 0.5;
  float spiral = spiralNoise(p * 0.5, seed);
  float detail = fbm3D(p * 2.0, 4) * 0.35;
  float fine = fbm3D(p * 6.0, 2) * 0.15;
  return k * (0.5 + spiral * 0.5 + detail + fine);
}

// ─── Emission line colors ────────────────────────────────────────────────────

vec3 nebulaEmissionColor(float hue, float variation) {
  vec3 hAlpha = vec3(0.9, 0.3, 0.35);
  vec3 oiii   = vec3(0.2, 0.7, 0.65);
  vec3 sii    = vec3(0.8, 0.25, 0.2);
  vec3 hBeta  = vec3(0.3, 0.5, 0.8);

  vec3 color;
  if (hue < 0.25) {
    color = mix(hAlpha, oiii, hue / 0.25);
  } else if (hue < 0.5) {
    color = mix(oiii, hBeta, (hue - 0.25) / 0.25);
  } else if (hue < 0.75) {
    color = mix(hBeta, sii, (hue - 0.5) / 0.25);
  } else {
    color = mix(sii, hAlpha, (hue - 0.75) / 0.25);
  }

  color += (variation - 0.5) * 0.15;
  return color;
}

// ─── Main ────────────────────────────────────────────────────────────────────

void main() {
  // Convert UV to NDC [-1, 1]
  vec2 ndc = vUV * 2.0 - 1.0;

  // Unproject two points on the ray using inverse view-projection matrix
  vec4 nearClip = uInvViewProj * vec4(ndc, -1.0, 1.0);
  vec4 farClip  = uInvViewProj * vec4(ndc,  1.0, 1.0);
  vec3 nearWorld = nearClip.xyz / nearClip.w;
  vec3 farWorld  = farClip.xyz / farClip.w;

  // Ray direction
  vec3 rayDir = normalize(farWorld - nearWorld);

  // Intersect ray with galaxy plane (y = 0)
  // nearWorld.y + t * rayDir.y = 0
  if (abs(rayDir.y) < 0.0001) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float t = -nearWorld.y / rayDir.y;
  if (t < 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 hitPoint = nearWorld + t * rayDir;
  float worldX = hitPoint.x;
  float worldZ = hitPoint.z;

  // Apply axis ratio (elliptical galaxies are elongated along X)
  float galaxyZ = worldZ / uAxisRatio;

  // Galaxy-plane radius (using stretched coords for elliptical shape)
  float r = length(vec2(worldX, galaxyZ));
  float rNorm = r / uGalaxyRadius;

  // Early out
  if (rNorm > 1.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Radial fade
  float radialMask = smoothstep(0.05, 0.15, rNorm) * (1.0 - smoothstep(0.85, 1.15, rNorm));

  // Angle in galaxy plane (using stretched coords)
  float angle = atan(galaxyZ, worldX) - uGalaxyRotation;

  // Per-galaxy seed fractional values for variety
  float seedA = fract(uSeed * 0.61803398875);  // golden ratio
  float seedB = fract(uSeed * 0.41421356237);  // sqrt(2)-1

  // 3D noise sample position
  vec3 samplePos = vec3(
    cos(angle) * rNorm * 3.0,
    sin(angle) * rNorm * 3.0,
    seedA * 100.0
  );

  // Star density from CPU-generated texture
  // Use original (un-stretched) world coords to match actual star positions
  float rawR = length(vec2(worldX, worldZ));
  float rawRNorm = rawR / uGalaxyRadius;
  float rawAngle = atan(worldZ, worldX) - uGalaxyRotation;
  vec2 restPos = vec2(cos(rawAngle), sin(rawAngle)) * rawRNorm;
  vec2 densityUV = restPos / 1.3 * 0.5 + 0.5;
  float starDensity = texture2D(uDensityMap, densityUV).r;

  // Nebula density — covers entire galaxy, intensified in dense regions
  float noiseDensity = nebulaDensity(samplePos, seedA);
  noiseDensity = max(noiseDensity, 0.0);

  // Base nebula everywhere, boosted by star density in arms/core
  // Low-density areas get dark patches via noise, not hard cutoff
  float densityBoost = mix(0.35, 1.0, pow(starDensity, 0.4));
  float density = noiseDensity * densityBoost * radialMask;
  density = smoothstep(0.05, 0.65, density);

  // Emission line color — seedB gives each galaxy a distinct base hue
  float colorNoise = fbm3D(samplePos * 1.2 + seedB * 100.0, 2) * 0.5 + 0.5;
  float hue = fract(seedB + colorNoise * 0.35 + rNorm * 0.1);
  vec3 color = nebulaEmissionColor(hue, colorNoise);

  // Brightness variation
  float brightness = 0.5 + 0.5 * fbm3D(samplePos * 2.0 + seedA * 80.0, 2);
  color *= max(brightness, 0.0);

  // Final alpha
  float alpha = clamp(density * uNebulaIntensity, 0.0, 1.0);

  // Premultiplied alpha
  gl_FragColor = vec4(color * alpha, alpha);
}
`;class ot{constructor(e,o,t){const a=new Float32Array(65536),i=o*1.3;for(let s=0;s<e.length;s++){const v=e[s],g=Math.cos(v.angle)*v.radius,f=Math.sin(v.angle)*v.radius,r=Math.floor((g/i*.5+.5)*255),p=Math.floor((f/i*.5+.5)*255);r>=0&&r<256&&p>=0&&p<256&&(a[p*256+r]+=1)}const h=new Float32Array(256*256);for(let s=0;s<3;s++){const v=s%2===0?a:h,g=s%2===0?h:a;for(let f=0;f<256;f++)for(let r=0;r<256;r++){let p=0,u=0;for(let y=-2;y<=2;y++)for(let S=-2;S<=2;S++){const M=r+S,w=f+y;M>=0&&M<256&&w>=0&&w<256&&(p+=v[w*256+M],u++)}g[f*256+r]=p/u}}a.set(h);let d=0;for(let s=0;s<a.length;s++)a[s]>d&&(d=a[s]);const m=new Uint8Array(256*256);if(d>0)for(let s=0;s<a.length;s++)m[s]=Math.min(255,Math.floor(a[s]/d*255));this.densityTexture=new ke(m,256,256,Pe,Te),this.densityTexture.minFilter=$,this.densityTexture.magFilter=$,this.densityTexture.wrapS=he,this.densityTexture.wrapT=he,this.densityTexture.needsUpdate=!0;const c=new ee(2,2);this.material=new W({vertexShader:tt,fragmentShader:nt,uniforms:{uInvViewProj:{value:new de},uTime:{value:0},uGalaxyRadius:{value:o},uSeed:{value:t},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:oe}),this.mesh=new E(c,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(e,o,t,n,a){const i=this.material.uniforms;i.uTime.value=e,i.uGalaxyRotation.value=t,i.uGalaxyRadius.value=n,i.uAxisRatio.value=a;const h=new de;h.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse),i.uInvViewProj.value.copy(h).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const at=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,st=`precision highp float;

varying vec2 vUV;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiltX;
uniform float uRotY;
uniform float uLOD;

const float PI = 3.1415926;

/**
 * 3D hash for ray jitter — maps vec3 to float.
 */
float hash13(vec3 p) {
    p = fract(p * vec3(0.16532, 0.17369, 0.15787));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

/**
 * 2D hash — maps vec2 to float (matched to WebGPU tsl-helpers).
 */
float hash2d(vec2 p) {
    return fract(cos(dot(p, vec2(2.31, 53.21)) * 124.123) * 412.0);
}

/**
 * 2D value noise with smooth bilinear interpolation.
 */
float noise2d(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash2d(i), hash2d(i + vec2(1.0, 0.0)), u.x),
        mix(hash2d(i + vec2(0.0, 1.0)), hash2d(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

void main() {
    vec2 pp = vUV * 2.0 - 1.0;
    float screenR = length(pp);

    if (screenR > 1.0) discard;

    // ─── Camera ──────────────────────────────────────────────────────────
    vec3 lookAt = vec3(0.0, -0.1, 0.0);
    float eyer = 2.0;
    float eyea = uRotY;
    float eyea2 = uTiltX + 1.2;

    vec3 ro = vec3(
        eyer * cos(eyea) * sin(eyea2),
        eyer * cos(eyea2),
        eyer * sin(eyea) * sin(eyea2)
    );

    vec3 front = normalize(lookAt - ro);
    vec3 left = normalize(cross(normalize(vec3(0.0, 1.0, -0.1)), front));
    vec3 up = normalize(cross(front, left));
    vec3 rd = normalize(front * 1.5 + left * pp.x + up * pp.y);

    // ─── Black hole parameters (matched to WebGPU singularity model) ────
    float originRadius = 0.13;
    float power = 0.3;
    float bandWidth = 0.04;
    float stepSize = mix(0.018, 0.012, uLOD);

    vec3 rayPos = ro;
    vec3 rayDir = rd;

    rayPos += rayDir * hash13(rd + uTime) * 0.01;

    float intensity = mix(0.3, 1.0, uLOD);
    float animSpeed = mix(0.005, 0.02, uLOD);
    float grainMix = mix(0.1, 0.5, uLOD);

    vec3 col = vec3(0.0);
    float alphaAcc = 0.0;
    float captured = 0.0;

    vec3 cInner = vec3(1.0, 0.65, 0.18);
    vec3 cMid = vec3(1.0, 0.35, 0.05);
    vec3 cOuter = vec3(0.4, 0.08, 0.01);
    vec3 emissionColor = vec3(0.25, 0.15, 0.05);
    float diskRotSpeed = uTime * animSpeed * 30.0;

    // ─── Ray march with direction-based gravity steering ────────────────
    for (int i = 0; i < 200; i++) {
        vec3 rNorm = normalize(rayPos);
        float rLen = length(rayPos);
        float steerMag = stepSize * power / max(rLen * rLen, 0.001);
        vec3 steeredDir = normalize(rayDir - rNorm * steerMag);

        vec3 advance = rayDir * stepSize;
        rayPos += advance;

        float rLenNow = length(rayPos);
        if (rLenNow < originRadius) {
            captured = 1.0;
            break;
        }

        // ─── Volumetric accretion disk ──────────────────────────────────
        float xyLen = length(vec2(rayPos.x, rayPos.z));

        float yNorm = rayPos.y / bandWidth;
        float yBand = max(0.0, 1.0 - yNorm * yNorm);

        float radialFade = smoothstep(1.3, 0.16, xyLen);
        float diskMask = yBand * radialFade;

        float diskAngle = atan(-rayPos.x, -rayPos.z);
        float rotAngle = diskAngle + diskRotSpeed;
        vec2 noiseUV = vec2(xyLen * 8.0, rotAngle * 5.0);

        float turbulence = max(0.0, noise2d(noiseUV * vec2(0.1, 0.5)) + 0.05);
        float grain = noise2d(noiseUV * vec2(1.5, 3.0) + 77.0);
        float diskTex = turbulence * (1.0 - grainMix + grainMix * grain);

        float doppler = 1.0 + cos(rotAngle) * 0.7;

        float rampInput = clamp(xyLen + (diskTex - 0.78) * 1.5, 0.0, 1.0);
        vec3 diskColor = mix(
            mix(cInner, cMid, smoothstep(0.05, 0.425, rampInput)),
            cOuter,
            smoothstep(0.425, 1.0, rampInput)
        );

        float texBright = max(diskTex, 0.3);
        vec3 emissiveCol = diskColor * texBright * doppler * 3.5
                         + emissionColor * diskMask * 0.8;

        float diskAlpha = diskMask * clamp(texBright * 2.0, 0.0, 1.0);

        float oneMinusA = 1.0 - alphaAcc;
        float weight = oneMinusA * diskAlpha;
        col = mix(col, emissiveCol, weight);
        alphaAcc = clamp(mix(alphaAcc, 1.0, diskAlpha), 0.0, 1.0);

        // Second advance + direction update (singularity double-step)
        rayPos += advance;
        rayDir = steeredDir;

        if (dot(rayPos, rayPos) > 16.0 && dot(rayDir, rayPos) > 0.0) {
            break;
        }
    }

    col *= intensity;

    // ─── Output ─────────────────────────────────────────────────────────
    float feather = 1.0 - smoothstep(0.3, 1.0, screenR);
    col *= feather;
    float alpha = max(alphaAcc * feather, captured);

    gl_FragColor = vec4(col, alpha);
}
`;class it{constructor(e,o=60){this.apparentPx=0,this.quadSize=o;const t=new xe(1,4,4),n=new ge({visible:!1});this.depthMesh=new E(t,n),this.depthMesh.layers.set(2),this.material=new W({vertexShader:at,fragmentShader:st,uniforms:{uResolution:{value:new J(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ie,side:ye}),this.mesh=new E(new ee(1,1),this.material),this.mesh.scale.set(o,o,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(e,o,t,n,a){if(this.material.uniforms.uTime.value=e,this.material.uniforms.uTiltX.value=o,this.material.uniforms.uRotY.value=t,a){const i=a.getSize(new J),h=a.getPixelRatio();this.material.uniforms.uResolution.value.set(i.x*h,i.y*h)}if(n){this.mesh.quaternion.copy(n.quaternion);const i=n.position.length(),d=(n.fov??60)*Math.PI/180,m=this.material.uniforms.uResolution.value.y;this.apparentPx=this.quadSize/i*(m/(2*Math.tan(d/2)));const c=Math.min(Math.max((this.apparentPx-6)/220,0),1);this.material.uniforms.uLOD.value=c}}getLOD(){return this.material.uniforms.uLOD.value}getApparentPx(){return this.apparentPx}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const rt=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,lt=`precision highp float;

uniform sampler2D uSceneTexture;
uniform vec2      uBHScreenPos;   // black hole position in UV space (0–1)
uniform float     uLensStrength;  // 0 = no distortion, ~0.03 = max
uniform float     uLensZoom;      // 0 = distant, 1 = close-up
uniform float     uAspectRatio;   // width / height

varying vec2 vUV;

vec3 gradeIntergalacticBackdrop(vec3 color) {
  float peak = max(color.r, max(color.g, color.b));
  float floor = min(color.r, min(color.g, color.b));
  float saturation = peak - floor;

  // Target diffuse, colorful nebula glow more than star-like highlights.
  float nebulaMask = smoothstep(0.06, 0.30, saturation);
  nebulaMask *= 1.0 - smoothstep(0.28, 0.95, peak);

  vec3 graded = pow(max(color, 0.0), vec3(1.14));
  return graded * mix(0.90, 0.45, nebulaMask);
}

void main() {
  // Vector from this pixel to the black hole center
  vec2 toBH = uBHScreenPos - vUV;
  toBH.x *= uAspectRatio;              // work in circular space

  float dist = length(toBH);
  vec2  dir  = toBH / max(dist, 0.0001);

  // Expand the field as we approach the black hole so the warped background
  // remains visible instead of getting swallowed by the black hole overlay.
  float radius = mix(0.20, 0.40, uLensZoom);
  float falloff = smoothstep(radius, 0.0, dist); // 1 at center, 0 at radius
  falloff *= falloff;                             // squared for steep drop-off
  float innerRadius = mix(0.012, 0.05, uLensZoom);
  float innerMask = smoothstep(innerRadius, innerRadius * 2.8, dist);
  float softDist = max(dist, mix(0.028, 0.04, uLensZoom));
  float deflection = uLensStrength * falloff * innerMask * (mix(0.11, 0.22, uLensZoom) / softDist);

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);
  color.rgb = gradeIntergalacticBackdrop(color.rgb);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = mix(0.024, 0.09, uLensZoom);
  float ringWidth = mix(0.008, 0.024, uLensZoom);
  float ring = exp(-pow((dist - ringRadius) / ringWidth, 2.0));
  ring *= falloff * innerMask * uLensStrength * mix(10.0, 16.0, uLensZoom);
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.14;

  gl_FragColor = color;
}
`,ve=new V(0,1,0),Q=new K;class mt{constructor(e,o){this.animationId=0,this.clock=new Ee,this.galaxyRotation=0,this._bhScreenVec=new V,this.orbitQuat=new K,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new ze({canvas:e,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.scene=new ue,this.renderer.setClearColor(0,1),this.params=De(o);const t=We(this.params),n=this.params.galaxyRadius;this.baseDistance=n*1.7;const a=e.clientWidth/e.clientHeight;this.camera=new Le(60,a,.1,this.baseDistance*20),this.backdrop=new et(this.baseDistance,o.pgc),this.scene.add(this.backdrop.mesh),this.particles=new Qe(t,this.baseDistance),this.scene.add(this.particles.points),this.scene.add(this.particles.foregroundPoints),this.haze=new Ke(n),this.scene.add(this.haze.mesh),this.nebula=new ot(t,n,o.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new it(null,n*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.backdrop.mesh.layers.set(1),this.particles.points.layers.set(1),this.particles.foregroundPoints.layers.set(2),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const i=e.clientWidth,h=e.clientHeight;this.galaxyRT=new Ne(i*window.devicePixelRatio,h*window.devicePixelRatio,{minFilter:$,magFilter:$}),this.lensingMaterial=new W({vertexShader:rt,fragmentShader:lt,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new J(.5,.5)},uLensStrength:{value:0},uLensZoom:{value:0},uAspectRatio:{value:i/h}},depthTest:!1,depthWrite:!1});const d=new E(new ee(2,2),this.lensingMaterial);this.lensingScene=new ue,this.lensingScene.add(d),this.lensingCamera=new He(-1,1,1,-1,0,1);const c=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=c,this.targetZoom=c;const{initRotY:s,initTiltX:v}=_e(o.pgc),g=new K().setFromAxisAngle(new V(1,0,0),v),f=new K().setFromAxisAngle(ve,s);this.orbitQuat.multiplyQuaternions(f,g),this.onPointerDown=r=>{this.isPinching||(this.isDragging=!0,this.lastX=r.clientX,this.lastY=r.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=r=>{if(this.isPinching||!this.isDragging)return;const p=r.clientX-this.lastX,u=r.clientY-this.lastY;this.velocityX=p*.005,this.velocityY=u*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=r.clientX,this.lastY=r.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=r=>{r.preventDefault();const p=this.targetZoom*.12;this.targetZoom+=r.deltaY>0?-p:p,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=r=>{if(r.touches.length===2){r.preventDefault(),this.isPinching=!0,this.isDragging=!1;const p=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY;this.lastPinchDist=Math.sqrt(p*p+u*u)}},this.onTouchMove=r=>{if(r.touches.length===2){r.preventDefault();const p=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY,y=Math.sqrt(p*p+u*u),S=(y-this.lastPinchDist)*.01;this.lastPinchDist=y,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+S))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},e.addEventListener("pointerdown",this.onPointerDown),e.addEventListener("pointermove",this.onPointerMove),e.addEventListener("pointerup",this.onPointerUp),e.addEventListener("pointercancel",this.onPointerCancel),e.addEventListener("pointerleave",this.onPointerUp),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("touchstart",this.onTouchStart,{passive:!1}),e.addEventListener("touchmove",this.onTouchMove,{passive:!1}),e.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const r=e.clientWidth,p=e.clientHeight;if(r===0||p===0)return;this.renderer.setSize(r,p,!1),this.camera.aspect=r/p,this.camera.updateProjectionMatrix();const u=this.renderer.getPixelRatio();this.galaxyRT.setSize(r*u,p*u),this.lensingMaterial.uniforms.uAspectRatio.value=r/p}),this.resizeObserver.observe(e)}applyOrbitDelta(e,o){Q.setFromAxisAngle(ve,-e),this.orbitQuat.premultiply(Q);const t=new V(1,0,0).applyQuaternion(this.orbitQuat);Q.setFromAxisAngle(t,-o),this.orbitQuat.premultiply(Q),this.orbitQuat.normalize()}renderGalaxyPostPass(e,o,t,n){this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(e,o),this.lensingMaterial.uniforms.uLensStrength.value=t,this.lensingMaterial.uniforms.uLensZoom.value=n,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera)}start(){this.clock.start();const e=()=>{this.animationId=requestAnimationFrame(e);const o=this.clock.getDelta(),t=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const n=this.baseDistance/this.zoom,a=new V(0,0,n).applyQuaternion(this.orbitQuat);this.camera.position.copy(a),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const i=Math.min(this.zoom/20,1),h=.02+.18*i*i;this.galaxyRotation+=o*h;const d=this.camera.position,m=Math.sqrt(d.x*d.x+d.z*d.z),c=Math.atan2(d.y,m),s=Math.atan2(d.x,d.z);this.backdrop.update(t,this.camera),this.blackHole.update(t,c,s,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const v=this._bhScreenVec.x*.5+.5,g=this._bhScreenVec.y*.5+.5,f=this.renderer.getSize(new J),r=this.renderer.getPixelRatio();this.particles.update(o,t,this.camera,this._bhScreenVec.x,this._bhScreenVec.y,this.blackHole.getApparentPx(),f.x*r,f.y*r);const p=this.params.morphology.ellipticity>0?this.params.morphology.axisRatio:1;this.nebula.update(t,this.camera,this.galaxyRotation,this.params.galaxyRadius,p);{const u=this.blackHole.getLOD(),y=u*u*.045;this.renderGalaxyPostPass(v,g,y,u)}this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0};e()}dispose(){cancelAnimationFrame(this.animationId);const e=this.renderer.domElement;e.removeEventListener("pointerdown",this.onPointerDown),e.removeEventListener("pointermove",this.onPointerMove),e.removeEventListener("pointerup",this.onPointerUp),e.removeEventListener("pointercancel",this.onPointerCancel),e.removeEventListener("pointerleave",this.onPointerUp),e.removeEventListener("wheel",this.onWheel),e.removeEventListener("touchstart",this.onTouchStart),e.removeEventListener("touchmove",this.onTouchMove),e.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}export{mt as GalaxyScene};
