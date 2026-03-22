import{c as se,B as ge,a as Q,A as ve,b as xe,n as H,p as ke,l as ce,I as Ae,x as De,M as B,d as Re,aE as Te,D as Pe,g as Ie,aI as Ee,i as re,j as ye,f as be,N as _e,k as le,C as Le,V as Z,Q as ie,W as Oe,S as Se,P as Ne,aJ as He,O as Be}from"./three-Bsxc-RuM.js";import{m as Fe}from"./morphologyMapper-DY_wjh1a.js";import{d as Ue,c as Ge,b as Ve,r as Xe,g as Ye,a as We}from"./qualityDetect-CC9xKtzo.js";const z=Math.PI*2,he={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustHueRange:[240,280],brightHueRange:[10,45],hiiRegionChance:.15}};function R(i,e){if(!e||e.projectedStrength===0)return i;const t=Math.cos(e.projectedAngle),s=Math.sin(e.projectedAngle),n=i.x*t+i.z*s,a=i.z*t-i.x*s,o=e.projectedAxisRatio*e.projectedStrength+(1-e.projectedStrength),l=a*o;return{x:n*t-l*s,y:i.y,z:n*s+l*t}}function A(i,e,t){return i+(e-i)*t}function Me(i){return Math.max(0,Math.min(1,i))}function q(i,e,t){return Math.max(e,Math.min(t,i))}const oe=[{hue:10,spread:8,sat:.85,wInner:.58,wOuter:.3},{hue:25,spread:8,sat:.6,wInner:.2,wOuter:.15},{hue:48,spread:5,sat:.22,wInner:.1,wOuter:.1},{hue:55,spread:4,sat:.12,wInner:.05,wOuter:.1},{hue:215,spread:15,sat:.25,wInner:.05,wOuter:.22},{hue:225,spread:10,sat:.45,wInner:.02,wOuter:.13}];function k(i,e=null){const t=Me((e==null?void 0:e.dustMix)??.5),s=Me(((e==null?void 0:e.hotMix)??.5)*.7),n=A(.55,.76,t),a=A(.02,.08,s);return i<n?"dust":i>1-a?"bright":"star"}function T(i,e=null){switch(i){case"dust":const t=A(.95,1.35,(e==null?void 0:e.dustMix)??.5),s=A(.9,1.2,(e==null?void 0:e.dustLaneStrength)??0);return{size:(.8+Math.random()*1.5)*t,brightness:(.08+Math.random()*.16)*t,alpha:(.12+Math.random()*.2)*s};case"bright":const n=A(.9,1.4,(e==null?void 0:e.hotMix)??.5);return{size:(4+Math.random()*6)*n,brightness:(.64+Math.random()*.16)*n,alpha:(.56+Math.random()*.24)*A(.95,1.2,(e==null?void 0:e.clumpBoost)??0)};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function P(i,e,t=null){const s=he.visual;if(i==="dust")return{hue:s.dustHueRange[0]+Math.random()*(s.dustHueRange[1]-s.dustHueRange[0]),sat:.3};if(i==="bright")return Math.random()<.6?{hue:s.brightHueRange[0]+Math.random()*(s.brightHueRange[1]-s.brightHueRange[0]),sat:.5}:{hue:200+Math.random()*30,sat:.35};const n=Math.pow(e,.6),a=((t==null?void 0:t.hotMix)??.5-.5)*.16,o=q(A(.58,.3,n)-a,.12,.8),l=q(A(.78,.45,n)-a*.75,.22,.9),p=q(A(.88,.55,n)-a*.45,.35,.96),v=q(A(.93,.65,n)-a*.25,.45,.98),m=q(A(.98,.87,n)-a*.1,.7,.995),h=oe[5].wInner*(1-n)+oe[5].wOuter*n,x=[o,l,p,v,m,h];let d=0;for(const g of x)d+=g;let f=Math.random()*d;for(let g=0;g<oe.length;g++)if(f-=x[g],f<=0){const r=oe[g];return{hue:r.hue+(Math.random()-.5)*r.spread,sat:r.sat}}return{hue:48,sat:.22}}function I(i){const{baseSpeed:e,falloff:t,referenceRadius:s}=he.rotation;return e/Math.pow(Math.max(i,s)/s,t)}function je(i){return i.galaxyRadius*.06}function qe(i,e){const t=je(e);return i.filter(s=>s.radius>=t)}function fe(i,e=null){const t=Math.random()*z,s=Math.sqrt(Math.random())*i;let n=(Math.random()-.5)*i*.08;const a=k(Math.random(),e),o=T(a,e),l=s/i,p=P(a,l,e),v=Math.cos(t)*s,m=Math.sin(t)*s,h=R({x:v,y:n,z:m},e),x=Math.sqrt(h.x*h.x+h.z*h.z),d=Math.atan2(h.z,h.x);return{radius:x,angle:d,y:h.y,rotationSpeed:I(x),hue:p.hue,sat:p.sat,brightness:o.brightness,size:o.size,alpha:o.alpha,layer:a,twinklePhase:Math.random()*z}}function we(i,e,t=null){const s=[],n=(t==null?void 0:t.armScatterScale)??1,a=(t==null?void 0:t.diskThicknessScale)??1,o=i.morphology,l=i.galaxyRadius,p=o.numArms,v=Math.floor(e/p),m=o.armWidth*l,h=o.spiralTightness,x=o.spiralStart*l,d=o.irregularity,f=o.barLength>0,g=o.barLength*l,r=2.5,c=Math.min(Math.max(x,f?g*.5:0),l*.98),u=c*c,S=l*l;for(let b=0;b<p;b++){const y=b/p*z;for(let M=0;M<v;M++){const C=Math.sqrt(Math.random()*(S-u)+u),K=Math.max(x,.001),de=Math.log(Math.max(C/K,1))/Math.max(h,.001)*r,ue=(Math.random()-.5)*.3,w=de+y+ue,D=C/l*.5+.5,F=(Math.random()-.5+Math.random()-.5)*m*D*n,E=w+Math.PI/2,_=d*(Math.random()-.5)*30,U=Math.cos(w)*(C+_)+Math.cos(E)*F,G=Math.sin(w)*(C+_)+Math.sin(E)*F,V=C/l,L=l*he.visual.diskThicknessRatio*(1-V*.7)*a;let me=(Math.random()-.5)*L;const X=R({x:U,y:me,z:G},t);let O=X.x,J=X.y,Y=X.z;const W=Math.sqrt(O*O+Y*Y),ee=Math.atan2(Y,O),te=W/l,pe=I(W),j=k(Math.random(),t),N=T(j,t),ne=P(j,te,t);s.push({radius:W,angle:ee,y:J,rotationSpeed:pe,hue:ne.hue,sat:ne.sat,brightness:N.brightness,size:N.size,alpha:N.alpha,layer:j,twinklePhase:Math.random()*z})}}return s}function Ze(i,e,t=null){const s=[],n=i.galaxyRadius,a=i.morphology.barLength*n,o=i.morphology.barWidth*n;for(let l=0;l<e;l++){const p=(Math.random()-.5)*2*a,v=(Math.random()-.5)*o;let m=p,h=v,x=(Math.random()-.5)*n*.04;if(Math.sqrt(m*m+h*h)>n)continue;const f=R({x:m,y:x,z:h},t),g=f.x,r=f.y,c=f.z,u=Math.sqrt(g*g+c*c),S=Math.atan2(c,g),b=k(Math.random(),t),y=T(b,t),M=P(b,.1,t);s.push({radius:u,angle:S,y:r,rotationSpeed:I(u),hue:M.hue,sat:M.sat,brightness:y.brightness,size:y.size,alpha:y.alpha,layer:b,twinklePhase:Math.random()*z})}return s}function Ce(i,e,t=null){const s=[],n=i.morphology.bulgeRadius*i.galaxyRadius,a=(t==null?void 0:t.bulgeBoost)??0;for(let o=0;o<e;o++){const l=Math.pow(Math.random(),.6)*n,p=Math.random()*z;let v=(Math.random()-.5)*n*.5;const m=l/n,h=1+(1-m)*(.4+a*.2),x=k(Math.random(),t),d=T(x,t),f=Math.cos(p)*l,g=Math.sin(p)*l,r=R({x:f,y:v,z:g},t),c=Math.sqrt(r.x*r.x+r.z*r.z),u=Math.atan2(r.z,r.x),S=P(x,.1,t);s.push({radius:c,angle:u,y:r.y,rotationSpeed:I(c)*.5,hue:S.hue,sat:S.sat,brightness:Math.min(d.brightness*h,.95),size:d.size*(1+(1-m)*.3),alpha:Math.min(d.alpha*h,.95),layer:x,twinklePhase:Math.random()*z})}return s}function Qe(i,e,t=null){const s=[],n=i.galaxyRadius,a=i.morphology.axisRatio;for(let o=0;o<e;o++){const l=Math.random(),p=Math.random(),v=Math.pow(l,.4)*n,m=p*z;let h=v*Math.cos(m),x=v*Math.sin(m)*a,d=(Math.random()-.5)*n*.1*(1-v/n*.5);const f=R({x:h,y:d,z:x},t),g=Math.sqrt(f.x*f.x+f.z*f.z),r=Math.atan2(f.z,f.x),c=g/n,u=k(Math.random(),t),S=T(u,t),b=P(u,c,t);s.push({radius:g,angle:r,y:f.y,rotationSpeed:I(g)*.3,hue:b.hue,sat:b.sat,brightness:S.brightness,size:S.size,alpha:S.alpha,layer:u,twinklePhase:Math.random()*z})}return s}function Ke(i,e,t=null){const s=[],n=i.galaxyRadius,a=i.morphology.bulgeRadius*n;for(let o=0;o<e;o++){const l=Math.pow(Math.random(),.55)*n,p=Math.random()*z,v=l/n,m=(t==null?void 0:t.diskThicknessScale)??1,x=n*.06*Math.pow(Math.max(1-v,0),2)*m;let d=(Math.random()-.5)*x;const f=Math.max(0,Math.min(1,1-l/Math.max(a,1))),g=1+f*.4;let r=Math.cos(p)*l,c=Math.sin(p)*l;const u=R({x:r,y:d,z:c},t),S=Math.sqrt(u.x*u.x+u.z*u.z),b=Math.atan2(u.z,u.x),y=k(Math.random(),t),M=T(y,t),C=P(y,v*.2,t);s.push({radius:S,angle:b,y:u.y,rotationSpeed:I(S)*(f>0?.5:1),hue:C.hue,sat:C.sat,brightness:Math.min(M.brightness*g,.95),size:M.size*(1+f*.3),alpha:Math.min(M.alpha*g,.95),layer:y,twinklePhase:Math.random()*z})}return s}function $e(i,e,t=null){const s=[],n=i.galaxyRadius,a=i.morphology.irregularity,o=i.morphology.clumpCount,l=(t==null?void 0:t.clumpBoost)??0,p=[];for(let v=0;v<o;v++){const m=v/o*z+Math.random()*.5,h=(.2+Math.random()*.6)*n;p.push({x:Math.cos(m)*h,z:Math.sin(m)*h,sigma:(30+Math.random()*80)*(1-l*.3),weight:.5+Math.random(),isHII:Math.random()<he.visual.hiiRegionChance})}for(let v=0;v<e;v++){let m,h;if(Math.random()<1-a){const b=Math.floor(Math.random()*o),y=p[b],M=()=>(Math.random()-.5+Math.random()-.5)*2;m=y.x+M()*y.sigma,h=y.z+M()*y.sigma,y.isHII&&Math.random()<.4}else{const b=Math.random()*z,y=Math.sqrt(Math.random())*n;m=Math.cos(b)*y+(Math.random()-.5)*60,h=Math.sin(b)*y+(Math.random()-.5)*60}let x=(Math.random()-.5)*n*.12;const d=R({x:m,y:x,z:h},t),f=Math.sqrt(d.x*d.x+d.z*d.z);if(f>n*1.1)continue;const g=Math.atan2(d.z,d.x),r=f/n,c=k(Math.random(),t),u=T(c,t),S=P(c,r,t);s.push({radius:f,angle:g,y:d.y,rotationSpeed:I(f)*(.5+Math.random()*.5),hue:S.hue,sat:S.sat,brightness:u.brightness,size:u.size,alpha:u.alpha,layer:c,twinklePhase:Math.random()*z})}return s}function Je(i){const e=i.morphology,t=i.starCount,s=i.galaxyRadius,n=Ue(i.bandProfile)??null;let a=[];const o=e.barLength>0,l=e.numArms>0,p=e.clumpCount>0&&e.irregularity>0,v=e.ellipticity>0&&!l&&!o&&!p,m=!l&&!o&&!p&&e.ellipticity===0&&e.bulgeFraction>0;if(v)a.push(...Qe(i,t,n));else if(m)a.push(...Ke(i,t,n));else if(p){const h=Math.floor(t*e.fieldStarFraction),x=t-h;a.push(...$e(i,x,n));for(let d=0;d<h;d++)a.push(fe(s,n))}else if(o&&l){const h=Math.floor(t*.25),x=t-h;a.push(...Ze(i,h,n));const d=Math.floor(x*.9);a.push(...we(i,d,n));const f=e.bulgeRadius*s;if(f>0){const r=Math.min(.2,.08+.18*(f/s)),c=Math.floor(t*r);a.push(...Ce(i,c,n))}const g=Math.floor(x*.1);for(let r=0;r<g;r++)a.push(fe(s,n))}else if(l){const h=e.fieldStarFraction,x=Math.floor(t*(1-h));a.push(...we(i,x,n));const d=e.bulgeRadius*s;if(d>0){const g=Math.min(.25,.1+.2*(d/s)),r=Math.floor(t*g);a.push(...Ce(i,r,n))}const f=Math.floor(t*h);for(let g=0;g<f;g++)a.push(fe(s,n))}return qe(a,i)}const et=`attribute float aSize;
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
`,tt=`precision highp float;

varying vec4 vColor;
uniform sampler2D uGlowTex;

void main() {
    vec4 glow = texture2D(uGlowTex, gl_PointCoord);

    // glow.a = pre-baked alpha envelope
    float alpha = vColor.a * glow.a;
    if (alpha < 0.004) discard;

    // glow.r = corona intensity, glow.g = core intensity
    vec3 coronaColor = mix(vColor.rgb * 1.32, vec3(1.0), 0.12);
    vec3 coreColor   = mix(coronaColor, vec3(1.0), 0.92);
    vec3 litRgb = coronaColor * glow.r + coreColor * (glow.g * 1.35);

    gl_FragColor = vec4(litRgb, alpha);
}
`;function nt(i,e,t){i/=360;const s=e*Math.min(t,1-t),n=a=>{const o=(a+i*12)%12;return t-s*Math.max(Math.min(o-3,9-o,1),-1)};return[n(0),n(8),n(4)]}function st(i,e){switch(i){case"dust":return e*.4;case"star":return e*.6;case"bright":return e*.85}}class ot{constructor(e,t=600){this.stars=e,this.baseDistance=t;const s=e.length,n=new Float32Array(s*3),a=new Float32Array(s*4),o=new Float32Array(s*4),l=new Float32Array(s);this.angleOffsets=new Float32Array(s),this.baseAlphas=new Float32Array(s);for(let m=0;m<s;m++){const h=e[m],x=h.radius*Math.cos(h.angle),d=h.radius*Math.sin(h.angle);n[m*3]=x,n[m*3+1]=h.y,n[m*3+2]=d;const f=h.sat,g=st(h.layer,h.brightness),[r,c,u]=nt(h.hue,f,g);a[m*4]=o[m*4]=r,a[m*4+1]=o[m*4+1]=c,a[m*4+2]=o[m*4+2]=u,a[m*4+3]=h.alpha,o[m*4+3]=0,l[m]=h.size,this.angleOffsets[m]=h.angle,this.baseAlphas[m]=h.alpha}const p=new se(n,3),v=new se(l,1);this.backgroundGeometry=new ge,this.backgroundGeometry.setAttribute("position",p),this.backgroundGeometry.setAttribute("aColor",new se(a,4)),this.backgroundGeometry.setAttribute("aSize",v),this.foregroundGeometry=new ge,this.foregroundGeometry.setAttribute("position",p),this.foregroundGeometry.setAttribute("aColor",new se(o,4)),this.foregroundGeometry.setAttribute("aSize",v),this.glowTexture=Ge(),this.material=new Q({vertexShader:et,fragmentShader:tt,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:t},uGlowTex:{value:this.glowTexture}},transparent:!0,depthWrite:!1,blending:ve}),this.foregroundMaterial=this.material.clone(),this.foregroundMaterial.uniforms={uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:t},uGlowTex:{value:this.glowTexture}},this.points=new xe(this.backgroundGeometry,this.material),this.points.frustumCulled=!1,this.foregroundPoints=new xe(this.foregroundGeometry,this.foregroundMaterial),this.foregroundPoints.frustumCulled=!1,this.foregroundPoints.renderOrder=2}update(e,t,s,n,a,o,l,p){const v=this.stars,m=v.length,h=this.backgroundGeometry.getAttribute("position"),x=this.backgroundGeometry.getAttribute("aColor"),d=this.foregroundGeometry.getAttribute("aColor"),f=h.array,g=x.array,r=d.array,c=s.matrixWorldInverse.elements,u=s.projectionMatrix.elements,S=c[14],b=s.position.length(),y=H.smoothstep(1-Math.abs(s.position.y)/Math.max(b,1e-4),.55,.95),M=H.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),y),C=H.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),y),K=H.lerp(.75,1.2,y),de=Math.max(o*K/Math.max(l*.5,1),.04),ue=Math.max(o*K/Math.max(p*.5,1),.04);for(let w=0;w<m;w++){const D=v[w];this.angleOffsets[w]+=D.rotationSpeed*e;const F=this.angleOffsets[w];f[w*3]=D.radius*Math.cos(F),f[w*3+2]=D.radius*Math.sin(F);let E=this.baseAlphas[w];if(D.layer==="bright"){const ne=Math.sin(t*2+D.twinklePhase)*.15+.85;E*=ne}const _=f[w*3],U=f[w*3+1],G=f[w*3+2],V=c[0]*_+c[4]*U+c[8]*G+c[12],$=c[1]*_+c[5]*U+c[9]*G+c[13],L=c[2]*_+c[6]*U+c[10]*G+c[14],me=u[0]*V+u[4]*$+u[8]*L+u[12],X=u[1]*V+u[5]*$+u[9]*L+u[13],O=u[3]*V+u[7]*$+u[11]*L+u[15],J=O!==0?1/O:0,Y=me*J,W=X*J,ee=(Y-n)/de,te=(W-a)/ue,pe=1-H.smoothstep(.75,1.25,Math.sqrt(ee*ee+te*te)),j=H.smoothstep(L-S,M,M+C),N=pe*j;g[w*4+3]=E*(1-N),r[w*4+3]=E*N}h.needsUpdate=!0,x.needsUpdate=!0,d.needsUpdate=!0}dispose(){this.backgroundGeometry.dispose(),this.foregroundGeometry.dispose(),this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}class at{constructor(e){const s=document.createElement("canvas");s.width=512,s.height=512;const n=s.getContext("2d"),a=512/2,o=512/2,l=n.createRadialGradient(a,o,0,a,o,a*.3);l.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),l.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),l.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),l.addColorStop(1,"hsla(20, 50%, 30%, 0)"),n.fillStyle=l,n.fillRect(0,0,512,512);const p=n.createRadialGradient(a,o,0,a,o,a*.7);p.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),p.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),p.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),p.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=p,n.fillRect(0,0,512,512);const v=n.createRadialGradient(a,o,0,a,o,a);v.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),v.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),v.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=v,n.fillRect(0,0,512,512);const m=new ke(s);m.needsUpdate=!0;const h=e*3,x=new ce(h,h);this.material=new Ae({map:m,transparent:!0,depthWrite:!1,blending:ve,side:De}),this.mesh=new B(x,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var e;(e=this.material.map)==null||e.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const it=`precision highp float;

varying vec3 vDirection;

void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,rt=`precision highp float;

varying vec3 vDirection;

uniform float uTime;
uniform float uSeed;
uniform float uNebulaIntensity;

#define PI 3.14159265359
#define TAU 6.28318530718

// Quality LOD — set by ShaderMaterial at construction
// Defaults are desktop values; mobile overrides via ShaderMaterial.defines
#ifndef SPIRAL_NOISE_ITER
#define SPIRAL_NOISE_ITER 5
#endif
#ifndef MAX_GALAXIES
#define MAX_GALAXIES 4
#endif
#ifndef MAX_CLOUDS
#define MAX_CLOUDS 6
#endif
#ifndef MAX_KNOTS
#define MAX_KNOTS 5
#endif
#ifndef STAR_LAYERS
#define STAR_LAYERS 4
#endif
#ifndef FBM_DETAIL_OCTAVES
#define FBM_DETAIL_OCTAVES 4
#endif

// Noise constants
const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;
const int FBM_MAX_OCTAVES = 8;

// Nebula structure
const float NEBULA_SCALE = 0.5;
const float NEBULA_DETAIL = 2.0;
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
  float detail = fbm3D(p * NEBULA_DETAIL, FBM_DETAIL_OCTAVES) * 0.35;
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
// EMISSION COLORS — IQ cosine palette with seed-driven phase
// Replaces fixed 4-color cycle with unique palette per galaxy.
// Formula: color(t) = a + b * cos(2π * (c*t + d))
// Phase vector d is derived from uSeed → every galaxy sky is unique.
// Reference: Inigo Quilez, "Procedural Color Palettes"
// =============================================================================

vec3 nebulaEmissionColor(float hue, float variation) {
  // Seed-driven phase offset — this is what creates per-galaxy variety
  float s1 = seedHash(uSeed + 10.0);
  float s2 = seedHash(uSeed + 20.0);
  float s3 = seedHash(uSeed + 30.0);

  // a = brightness center, b = contrast amplitude
  // Tuned for nebula aesthetics: rich darks, saturated mids, bright peaks
  vec3 a = vec3(0.5, 0.4, 0.5);
  vec3 b = vec3(0.5, 0.4, 0.45);
  // c ≈ 1.0 = one smooth color cycle; slight desync on blue for richer hues
  vec3 c = vec3(1.0, 1.0, 0.8);
  vec3 d = vec3(s1, s2, s3);

  vec3 color = a + b * cos(6.283185 * (c * hue + d));
  color += (variation - 0.5) * 0.12;
  return max(color, vec3(0.0));
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
  for (int i = 0; i < MAX_GALAXIES; i++) {
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

#if STAR_LAYERS >= 3
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
#endif

#if STAR_LAYERS >= 4
  // Very faint stars (densest layer — fills the sky)
  vec3 starCell4 = floor(dir * 850.0);
  float starHash4 = seedHash(dot(starCell4, vec3(17.3, 43.7, 97.1)) + uSeed * 4.0);
  if (starHash4 > 0.970) {
    vec3 jitter4 = hash33(starCell4 + uSeed + 19.0) * 0.8 + 0.1;
    vec3 starCenter4 = (starCell4 + jitter4) / 850.0;
    float dist4 = length(dir - normalize(starCenter4));
    starField = max(starField, exp(-dist4 * 2000.0) * 0.1);
  }
#endif

  finalColor += starColor * starField;

  // === DISTANT GAS CLOUDS (background nebula patches) ===
  int numClouds = 3 + int(sh4 * 4.0);
  for (int i = 0; i < MAX_CLOUDS; i++) {
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

#if STAR_LAYERS >= 3
  // Dust lanes (skipped on mobile — subtle detail, expensive FBM call)
  float dustLane = fbm3D(animPos * 1.5 + vec3(sh2 * 5.0), 3);
  dustLane = smoothstep(0.2, 0.5, dustLane);
  nebulaColor *= 0.5 + dustLane * 0.5;
#endif

  // Void regions dim
  nebulaColor *= 0.2 + voids * 0.8;

  float nebulaAlpha = cloudMask * 0.7 * voids;

  // === EMISSION KNOTS ===
  int numKnots = 2 + int(sh3 * 4.0);
  for (int i = 0; i < MAX_KNOTS; i++) {
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
`;class lt{constructor(e,t,s){const n=e*12,a=s==="mobile",o=a?[48,32]:[192,128],l=new Re(n,o[0],o[1]);this.material=new Q({vertexShader:it,fragmentShader:rt,defines:{SPIRAL_NOISE_ITER:a?3:5,MAX_GALAXIES:a?2:4,MAX_CLOUDS:a?3:6,MAX_KNOTS:a?2:5,STAR_LAYERS:a?2:4,FBM_DETAIL_OCTAVES:a?2:4},uniforms:{uTime:{value:0},uSeed:{value:t},uNebulaIntensity:{value:2.4}},side:Te,depthWrite:!1,depthTest:!1}),this.mesh=new B(l,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(e,t){this.material.uniforms.uTime.value=e,this.mesh.position.copy(t.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const ct=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,ht=`precision highp float;

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

// Quality LOD — overridden by ShaderMaterial.defines
#ifndef FBM_MAX_OCTAVES
#define FBM_MAX_OCTAVES 4
#endif
#ifndef SPIRAL_ITERS
#define SPIRAL_ITERS 5
#endif

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

  for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
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

  for (int i = 0; i < SPIRAL_ITERS; i++) {
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
`;class dt{constructor(e,t,s,n){const o=new Float32Array(65536),l=t*1.3;for(let d=0;d<e.length;d++){const f=e[d],g=Math.cos(f.angle)*f.radius,r=Math.sin(f.angle)*f.radius,c=Math.floor((g/l*.5+.5)*255),u=Math.floor((r/l*.5+.5)*255);c>=0&&c<256&&u>=0&&u<256&&(o[u*256+c]+=1)}const p=new Float32Array(256*256);for(let d=0;d<3;d++){const f=d%2===0?o:p,g=d%2===0?p:o;for(let r=0;r<256;r++)for(let c=0;c<256;c++){let u=0,S=0;for(let b=-2;b<=2;b++)for(let y=-2;y<=2;y++){const M=c+y,C=r+b;M>=0&&M<256&&C>=0&&C<256&&(u+=f[C*256+M],S++)}g[r*256+c]=u/S}}o.set(p);let v=0;for(let d=0;d<o.length;d++)o[d]>v&&(v=o[d]);const m=new Uint8Array(256*256);if(v>0)for(let d=0;d<o.length;d++)m[d]=Math.min(255,Math.floor(o[d]/v*255));this.densityTexture=new Pe(m,256,256,Ie,Ee),this.densityTexture.minFilter=re,this.densityTexture.magFilter=re,this.densityTexture.wrapS=ye,this.densityTexture.wrapT=ye,this.densityTexture.needsUpdate=!0;const h=new ce(2,2),x=n==="mobile";this.material=new Q({vertexShader:ct,fragmentShader:ht,defines:{FBM_MAX_OCTAVES:x?2:4,SPIRAL_ITERS:x?3:5},uniforms:{uInvViewProj:{value:new be},uTime:{value:0},uGalaxyRadius:{value:t},uSeed:{value:s},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:ve}),this.mesh=new B(h,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(e,t,s,n,a){const o=this.material.uniforms;o.uTime.value=e,o.uGalaxyRotation.value=s,o.uGalaxyRadius.value=n,o.uAxisRatio.value=a;const l=new be;l.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),o.uInvViewProj.value.copy(l).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ut=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,mt=`precision highp float;

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
`;class pt{constructor(e,t=60){this.apparentPx=0,this.quadSize=t;const s=new Re(1,4,4),n=new Ae({visible:!1});this.depthMesh=new B(s,n),this.depthMesh.layers.set(2),this.material=new Q({vertexShader:ut,fragmentShader:mt,uniforms:{uResolution:{value:new le(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:_e,side:De}),this.mesh=new B(new ce(1,1),this.material),this.mesh.scale.set(t,t,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(e,t,s,n,a){if(this.material.uniforms.uTime.value=e,this.material.uniforms.uTiltX.value=t,this.material.uniforms.uRotY.value=s,a){const o=a.getSize(new le),l=a.getPixelRatio();this.material.uniforms.uResolution.value.set(o.x*l,o.y*l)}if(n){this.mesh.quaternion.copy(n.quaternion);const o=n.position.length(),p=(n.fov??60)*Math.PI/180,v=this.material.uniforms.uResolution.value.y;this.apparentPx=this.quadSize/o*(v/(2*Math.tan(p/2)));const m=Math.min(Math.max((this.apparentPx-6)/220,0),1);this.material.uniforms.uLOD.value=m}}getLOD(){return this.material.uniforms.uLOD.value}getApparentPx(){return this.apparentPx}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const ft=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,vt=`precision highp float;

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
`,ze=new Z(0,1,0),ae=new ie;class bt{constructor(e,t){this.animationId=0,this.clock=new Le,this.galaxyRotation=0,this._bhScreenVec=new Z,this.orbitQuat=new ie,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new Oe({canvas:e,antialias:!0,alpha:!0});const s=We();this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Ve(s))),this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.scene=new Se,this.renderer.setClearColor(0,1),this.params=Fe(t);const n=Je(this.params),a=this.params.galaxyRadius;this.baseDistance=a*1.7;const o=e.clientWidth/e.clientHeight;this.camera=new Ne(60,o,.1,this.baseDistance*20),this.backdrop=new lt(this.baseDistance,t.pgc,s),this.scene.add(this.backdrop.mesh),this.particles=new ot(n,this.baseDistance),this.scene.add(this.particles.points),this.scene.add(this.particles.foregroundPoints),this.haze=new at(a),this.scene.add(this.haze.mesh),this.nebula=new dt(n,a,t.pgc,s),this.scene.add(this.nebula.mesh),this.blackHole=new pt(null,a*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.backdrop.mesh.layers.set(1),this.particles.points.layers.set(1),this.particles.foregroundPoints.layers.set(2),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const l=e.clientWidth,p=e.clientHeight;this.rtScaleFactor=Xe(s),this.galaxyRT=new He(l*this.renderer.getPixelRatio()*this.rtScaleFactor,p*this.renderer.getPixelRatio()*this.rtScaleFactor,{minFilter:re,magFilter:re}),this.lensingMaterial=new Q({vertexShader:ft,fragmentShader:vt,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new le(.5,.5)},uLensStrength:{value:0},uLensZoom:{value:0},uAspectRatio:{value:l/p}},depthTest:!1,depthWrite:!1});const v=new B(new ce(2,2),this.lensingMaterial);this.lensingScene=new Se,this.lensingScene.add(v),this.lensingCamera=new Be(-1,1,1,-1,0,1);const h=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=h,this.targetZoom=h;const{initRotY:x,initTiltX:d}=Ye(t),f=new ie().setFromAxisAngle(new Z(1,0,0),d),g=new ie().setFromAxisAngle(ze,x);this.orbitQuat.multiplyQuaternions(g,f),this.onPointerDown=r=>{this.isPinching||(this.isDragging=!0,this.lastX=r.clientX,this.lastY=r.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=r=>{if(this.isPinching||!this.isDragging)return;const c=r.clientX-this.lastX,u=r.clientY-this.lastY;this.velocityX=c*.005,this.velocityY=u*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=r.clientX,this.lastY=r.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=r=>{r.preventDefault();const c=this.targetZoom*.12;this.targetZoom+=r.deltaY>0?-c:c,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=r=>{if(r.touches.length===2){r.preventDefault(),this.isPinching=!0,this.isDragging=!1;const c=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY;this.lastPinchDist=Math.sqrt(c*c+u*u)}},this.onTouchMove=r=>{if(r.touches.length===2){r.preventDefault();const c=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY,S=Math.sqrt(c*c+u*u),b=(S-this.lastPinchDist)*.01;this.lastPinchDist=S,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+b))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},e.addEventListener("pointerdown",this.onPointerDown),e.addEventListener("pointermove",this.onPointerMove),e.addEventListener("pointerup",this.onPointerUp),e.addEventListener("pointercancel",this.onPointerCancel),e.addEventListener("pointerleave",this.onPointerUp),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("touchstart",this.onTouchStart,{passive:!1}),e.addEventListener("touchmove",this.onTouchMove,{passive:!1}),e.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const r=e.clientWidth,c=e.clientHeight;if(r===0||c===0)return;this.renderer.setSize(r,c,!1),this.camera.aspect=r/c,this.camera.updateProjectionMatrix();const u=this.renderer.getPixelRatio();this.galaxyRT.setSize(r*u*this.rtScaleFactor,c*u*this.rtScaleFactor),this.lensingMaterial.uniforms.uAspectRatio.value=r/c}),this.resizeObserver.observe(e)}applyOrbitDelta(e,t){ae.setFromAxisAngle(ze,-e),this.orbitQuat.premultiply(ae);const s=new Z(1,0,0).applyQuaternion(this.orbitQuat);ae.setFromAxisAngle(s,-t),this.orbitQuat.premultiply(ae),this.orbitQuat.normalize()}renderGalaxyPostPass(e,t,s,n){this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(e,t),this.lensingMaterial.uniforms.uLensStrength.value=s,this.lensingMaterial.uniforms.uLensZoom.value=n,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera)}start(){this.clock.start();const e=()=>{this.animationId=requestAnimationFrame(e);const t=this.clock.getDelta(),s=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const n=this.baseDistance/this.zoom,a=new Z(0,0,n).applyQuaternion(this.orbitQuat);this.camera.position.copy(a),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const o=Math.min(this.zoom/20,1),l=.02+.18*o*o;this.galaxyRotation+=t*l;const p=this.camera.position,v=Math.sqrt(p.x*p.x+p.z*p.z),m=Math.atan2(p.y,v),h=Math.atan2(p.x,p.z);this.backdrop.update(s,this.camera),this.blackHole.update(s,m,h,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const x=this._bhScreenVec.x*.5+.5,d=this._bhScreenVec.y*.5+.5,f=this.renderer.getSize(new le),g=this.renderer.getPixelRatio();this.particles.update(t,s,this.camera,this._bhScreenVec.x,this._bhScreenVec.y,this.blackHole.getApparentPx(),f.x*g,f.y*g);const r=this.params.morphology.ellipticity>0?this.params.morphology.axisRatio:1;this.nebula.update(s,this.camera,this.galaxyRotation,this.params.galaxyRadius,r);{const c=this.blackHole.getLOD(),u=c*c*.045;this.renderGalaxyPostPass(x,d,u,c)}this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0};e()}dispose(){cancelAnimationFrame(this.animationId);const e=this.renderer.domElement;e.removeEventListener("pointerdown",this.onPointerDown),e.removeEventListener("pointermove",this.onPointerMove),e.removeEventListener("pointerup",this.onPointerUp),e.removeEventListener("pointercancel",this.onPointerCancel),e.removeEventListener("pointerleave",this.onPointerUp),e.removeEventListener("wheel",this.onWheel),e.removeEventListener("touchstart",this.onTouchStart),e.removeEventListener("touchmove",this.onTouchMove),e.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}export{bt as GalaxyScene};
