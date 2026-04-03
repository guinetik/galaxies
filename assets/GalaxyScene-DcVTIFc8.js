import{c as nt,B as vt,a as lt,A as ft,b as yt,n as E,p as Dt,l as ht,I as Pt,x as At,M as j,D as Ct,g as kt,aK as Tt,i as it,j as xt,f as Mt,d as Lt,N as Bt,k as rt,C as It,V as Z,Q as ot,W as _t,S as bt,P as Ft,aL as Gt,O as Et}from"./three-CWiM2Iz1.js";import{m as Ot}from"./morphologyMapper-DY_wjh1a.js";import{d as Ut,c as Vt,b as Nt,r as Wt,g as Xt,a as Ht}from"./qualityDetect-DhuW2FJQ.js";import{G as Yt}from"./GalaxyBackdrop-ClWBe1Hp.js";const R=Math.PI*2,ct={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustHueRange:[240,280],brightHueRange:[10,45],hiiRegionChance:.15}};function D(o,t){if(!t||t.projectedStrength===0)return o;const e=Math.cos(t.projectedAngle),s=Math.sin(t.projectedAngle),n=o.x*e+o.z*s,i=o.z*e-o.x*s,a=t.projectedAxisRatio*t.projectedStrength+(1-t.projectedStrength),h=i*a;return{x:n*e-h*s,y:o.y,z:n*s+h*e}}function P(o,t,e){return o+(t-o)*e}function wt(o){return Math.max(0,Math.min(1,o))}function q(o,t,e){return Math.max(t,Math.min(e,o))}const st=[{hue:10,spread:8,sat:.85,wInner:.58,wOuter:.3},{hue:25,spread:8,sat:.6,wInner:.2,wOuter:.15},{hue:48,spread:5,sat:.22,wInner:.1,wOuter:.1},{hue:55,spread:4,sat:.12,wInner:.05,wOuter:.1},{hue:215,spread:15,sat:.25,wInner:.05,wOuter:.22},{hue:225,spread:10,sat:.45,wInner:.02,wOuter:.13}];function C(o,t=null){const e=wt((t==null?void 0:t.dustMix)??.5),s=wt(((t==null?void 0:t.hotMix)??.5)*.7),n=P(.55,.76,e),i=P(.02,.08,s);return o<n?"dust":o>1-i?"bright":"star"}function k(o,t=null){switch(o){case"dust":const e=P(.95,1.35,(t==null?void 0:t.dustMix)??.5),s=P(.9,1.2,(t==null?void 0:t.dustLaneStrength)??0);return{size:(.8+Math.random()*1.5)*e,brightness:(.08+Math.random()*.16)*e,alpha:(.12+Math.random()*.2)*s};case"bright":const n=P(.9,1.4,(t==null?void 0:t.hotMix)??.5);return{size:(4+Math.random()*6)*n,brightness:(.64+Math.random()*.16)*n,alpha:(.56+Math.random()*.24)*P(.95,1.2,(t==null?void 0:t.clumpBoost)??0)};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function T(o,t,e=null){const s=ct.visual;if(o==="dust")return{hue:s.dustHueRange[0]+Math.random()*(s.dustHueRange[1]-s.dustHueRange[0]),sat:.3};if(o==="bright")return Math.random()<.6?{hue:s.brightHueRange[0]+Math.random()*(s.brightHueRange[1]-s.brightHueRange[0]),sat:.5}:{hue:200+Math.random()*30,sat:.35};const n=Math.pow(t,.6),i=((e==null?void 0:e.hotMix)??.5-.5)*.16,a=q(P(.58,.3,n)-i,.12,.8),h=q(P(.78,.45,n)-i*.75,.22,.9),p=q(P(.88,.55,n)-i*.45,.35,.96),f=q(P(.93,.65,n)-i*.25,.45,.98),m=q(P(.98,.87,n)-i*.1,.7,.995),c=st[5].wInner*(1-n)+st[5].wOuter*n,y=[a,h,p,f,m,c];let d=0;for(const v of y)d+=v;let g=Math.random()*d;for(let v=0;v<st.length;v++)if(g-=y[v],g<=0){const r=st[v];return{hue:r.hue+(Math.random()-.5)*r.spread,sat:r.sat}}return{hue:48,sat:.22}}function L(o){const{baseSpeed:t,falloff:e,referenceRadius:s}=ct.rotation;return t/Math.pow(Math.max(o,s)/s,e)}function qt(o){return o.galaxyRadius*.06}function Zt(o,t){const e=qt(t);return o.filter(s=>s.radius>=e)}function gt(o,t=null){const e=Math.random()*R,s=Math.sqrt(Math.random())*o;let n=(Math.random()-.5)*o*.08;const i=C(Math.random(),t),a=k(i,t),h=s/o,p=T(i,h,t),f=Math.cos(e)*s,m=Math.sin(e)*s,c=D({x:f,y:n,z:m},t),y=Math.sqrt(c.x*c.x+c.z*c.z),d=Math.atan2(c.z,c.x);return{radius:y,angle:d,y:c.y,rotationSpeed:L(y),hue:p.hue,sat:p.sat,brightness:a.brightness,size:a.size,alpha:a.alpha,layer:i,twinklePhase:Math.random()*R}}function St(o,t,e=null){const s=[],n=(e==null?void 0:e.armScatterScale)??1,i=(e==null?void 0:e.diskThicknessScale)??1,a=o.morphology,h=o.galaxyRadius,p=a.numArms,f=Math.floor(t/p),m=a.armWidth*h,c=a.spiralTightness,y=a.spiralStart*h,d=a.irregularity,g=a.barLength>0,v=a.barLength*h,r=2.5,l=Math.min(Math.max(y,g?v*.5:0),h*.98),u=l*l,b=h*h;for(let M=0;M<p;M++){const x=M/p*R;for(let w=0;w<f;w++){const z=Math.sqrt(Math.random()*(b-u)+u),Q=Math.max(y,.001),dt=Math.log(Math.max(z/Q,1))/Math.max(c,.001)*r,ut=(Math.random()-.5)*.3,S=dt+x+ut,A=z/h*.5+.5,O=(Math.random()-.5+Math.random()-.5)*m*A*n,B=S+Math.PI/2,I=d*(Math.random()-.5)*30,U=Math.cos(S)*(z+I)+Math.cos(B)*O,V=Math.sin(S)*(z+I)+Math.sin(B)*O,N=z/h,_=h*ct.visual.diskThicknessRatio*(1-N*.7)*i;let mt=(Math.random()-.5)*_;const W=D({x:U,y:mt,z:V},e);let F=W.x,K=W.y,X=W.z;const H=Math.sqrt(F*F+X*X),J=Math.atan2(X,F),tt=H/h,pt=L(H),Y=C(Math.random(),e),G=k(Y,e),et=T(Y,tt,e);s.push({radius:H,angle:J,y:K,rotationSpeed:pt,hue:et.hue,sat:et.sat,brightness:G.brightness,size:G.size,alpha:G.alpha,layer:Y,twinklePhase:Math.random()*R})}}return s}function jt(o,t,e=null){const s=[],n=o.galaxyRadius,i=o.morphology.barLength*n,a=o.morphology.barWidth*n;for(let h=0;h<t;h++){const p=(Math.random()-.5)*2*i,f=(Math.random()-.5)*a;let m=p,c=f,y=(Math.random()-.5)*n*.04;if(Math.sqrt(m*m+c*c)>n)continue;const g=D({x:m,y,z:c},e),v=g.x,r=g.y,l=g.z,u=Math.sqrt(v*v+l*l),b=Math.atan2(l,v),M=C(Math.random(),e),x=k(M,e),w=T(M,.1,e);s.push({radius:u,angle:b,y:r,rotationSpeed:L(u),hue:w.hue,sat:w.sat,brightness:x.brightness,size:x.size,alpha:x.alpha,layer:M,twinklePhase:Math.random()*R})}return s}function zt(o,t,e=null){const s=[],n=o.morphology.bulgeRadius*o.galaxyRadius,i=(e==null?void 0:e.bulgeBoost)??0;for(let a=0;a<t;a++){const h=Math.pow(Math.random(),.6)*n,p=Math.random()*R;let f=(Math.random()-.5)*n*.5;const m=h/n,c=1+(1-m)*(.4+i*.2),y=C(Math.random(),e),d=k(y,e),g=Math.cos(p)*h,v=Math.sin(p)*h,r=D({x:g,y:f,z:v},e),l=Math.sqrt(r.x*r.x+r.z*r.z),u=Math.atan2(r.z,r.x),b=T(y,.1,e);s.push({radius:l,angle:u,y:r.y,rotationSpeed:L(l)*.5,hue:b.hue,sat:b.sat,brightness:Math.min(d.brightness*c,.95),size:d.size*(1+(1-m)*.3),alpha:Math.min(d.alpha*c,.95),layer:y,twinklePhase:Math.random()*R})}return s}function Qt(o,t,e=null){const s=[],n=o.galaxyRadius,i=o.morphology.axisRatio;for(let a=0;a<t;a++){const h=Math.random(),p=Math.random(),f=Math.pow(h,.4)*n,m=p*R;let c=f*Math.cos(m),y=f*Math.sin(m)*i,d=(Math.random()-.5)*n*.1*(1-f/n*.5);const g=D({x:c,y:d,z:y},e),v=Math.sqrt(g.x*g.x+g.z*g.z),r=Math.atan2(g.z,g.x),l=v/n,u=C(Math.random(),e),b=k(u,e),M=T(u,l,e);s.push({radius:v,angle:r,y:g.y,rotationSpeed:L(v)*.3,hue:M.hue,sat:M.sat,brightness:b.brightness,size:b.size,alpha:b.alpha,layer:u,twinklePhase:Math.random()*R})}return s}function $t(o,t,e=null){const s=[],n=o.galaxyRadius,i=o.morphology.bulgeRadius*n;for(let a=0;a<t;a++){const h=Math.pow(Math.random(),.55)*n,p=Math.random()*R,f=h/n,m=(e==null?void 0:e.diskThicknessScale)??1,y=n*.06*Math.pow(Math.max(1-f,0),2)*m;let d=(Math.random()-.5)*y;const g=Math.max(0,Math.min(1,1-h/Math.max(i,1))),v=1+g*.4;let r=Math.cos(p)*h,l=Math.sin(p)*h;const u=D({x:r,y:d,z:l},e),b=Math.sqrt(u.x*u.x+u.z*u.z),M=Math.atan2(u.z,u.x),x=C(Math.random(),e),w=k(x,e),z=T(x,f*.2,e);s.push({radius:b,angle:M,y:u.y,rotationSpeed:L(b)*(g>0?.5:1),hue:z.hue,sat:z.sat,brightness:Math.min(w.brightness*v,.95),size:w.size*(1+g*.3),alpha:Math.min(w.alpha*v,.95),layer:x,twinklePhase:Math.random()*R})}return s}function Kt(o,t,e=null){const s=[],n=o.galaxyRadius,i=o.morphology.irregularity,a=o.morphology.clumpCount,h=(e==null?void 0:e.clumpBoost)??0,p=[];for(let f=0;f<a;f++){const m=f/a*R+Math.random()*.5,c=(.2+Math.random()*.6)*n;p.push({x:Math.cos(m)*c,z:Math.sin(m)*c,sigma:(30+Math.random()*80)*(1-h*.3),weight:.5+Math.random(),isHII:Math.random()<ct.visual.hiiRegionChance})}for(let f=0;f<t;f++){let m,c;if(Math.random()<1-i){const M=Math.floor(Math.random()*a),x=p[M],w=()=>(Math.random()-.5+Math.random()-.5)*2;m=x.x+w()*x.sigma,c=x.z+w()*x.sigma,x.isHII&&Math.random()<.4}else{const M=Math.random()*R,x=Math.sqrt(Math.random())*n;m=Math.cos(M)*x+(Math.random()-.5)*60,c=Math.sin(M)*x+(Math.random()-.5)*60}let y=(Math.random()-.5)*n*.12;const d=D({x:m,y,z:c},e),g=Math.sqrt(d.x*d.x+d.z*d.z);if(g>n*1.1)continue;const v=Math.atan2(d.z,d.x),r=g/n,l=C(Math.random(),e),u=k(l,e),b=T(l,r,e);s.push({radius:g,angle:v,y:d.y,rotationSpeed:L(g)*(.5+Math.random()*.5),hue:b.hue,sat:b.sat,brightness:u.brightness,size:u.size,alpha:u.alpha,layer:l,twinklePhase:Math.random()*R})}return s}function Jt(o){const t=o.morphology,e=o.starCount,s=o.galaxyRadius,n=Ut(o.bandProfile)??null;let i=[];const a=t.barLength>0,h=t.numArms>0,p=t.clumpCount>0&&t.irregularity>0,f=t.ellipticity>0&&!h&&!a&&!p,m=!h&&!a&&!p&&t.ellipticity===0&&t.bulgeFraction>0;if(f)i.push(...Qt(o,e,n));else if(m)i.push(...$t(o,e,n));else if(p){const c=Math.floor(e*t.fieldStarFraction),y=e-c;i.push(...Kt(o,y,n));for(let d=0;d<c;d++)i.push(gt(s,n))}else if(a&&h){const c=Math.floor(e*.25),y=e-c;i.push(...jt(o,c,n));const d=Math.floor(y*.9);i.push(...St(o,d,n));const g=t.bulgeRadius*s;if(g>0){const r=Math.min(.2,.08+.18*(g/s)),l=Math.floor(e*r);i.push(...zt(o,l,n))}const v=Math.floor(y*.1);for(let r=0;r<v;r++)i.push(gt(s,n))}else if(h){const c=t.fieldStarFraction,y=Math.floor(e*(1-c));i.push(...St(o,y,n));const d=t.bulgeRadius*s;if(d>0){const v=Math.min(.25,.1+.2*(d/s)),r=Math.floor(e*v);i.push(...zt(o,r,n))}const g=Math.floor(e*c);for(let v=0;v<g;v++)i.push(gt(s,n))}return Zt(i,o)}const te=`attribute float aSize;
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
`,ee=`precision highp float;

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
`;function ne(o,t,e){o/=360;const s=t*Math.min(e,1-e),n=i=>{const a=(i+o*12)%12;return e-s*Math.max(Math.min(a-3,9-a,1),-1)};return[n(0),n(8),n(4)]}function se(o,t){switch(o){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class ae{constructor(t,e=600){this.stars=t,this.baseDistance=e;const s=t.length,n=new Float32Array(s*3),i=new Float32Array(s*4),a=new Float32Array(s*4),h=new Float32Array(s);this.angleOffsets=new Float32Array(s),this.baseAlphas=new Float32Array(s);for(let m=0;m<s;m++){const c=t[m],y=c.radius*Math.cos(c.angle),d=c.radius*Math.sin(c.angle);n[m*3]=y,n[m*3+1]=c.y,n[m*3+2]=d;const g=c.sat,v=se(c.layer,c.brightness),[r,l,u]=ne(c.hue,g,v);i[m*4]=a[m*4]=r,i[m*4+1]=a[m*4+1]=l,i[m*4+2]=a[m*4+2]=u,i[m*4+3]=c.alpha,a[m*4+3]=0,h[m]=c.size,this.angleOffsets[m]=c.angle,this.baseAlphas[m]=c.alpha}const p=new nt(n,3),f=new nt(h,1);this.backgroundGeometry=new vt,this.backgroundGeometry.setAttribute("position",p),this.backgroundGeometry.setAttribute("aColor",new nt(i,4)),this.backgroundGeometry.setAttribute("aSize",f),this.foregroundGeometry=new vt,this.foregroundGeometry.setAttribute("position",p),this.foregroundGeometry.setAttribute("aColor",new nt(a,4)),this.foregroundGeometry.setAttribute("aSize",f),this.glowTexture=Vt(),this.material=new lt({vertexShader:te,fragmentShader:ee,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:e},uGlowTex:{value:this.glowTexture}},transparent:!0,depthWrite:!1,blending:ft}),this.foregroundMaterial=this.material.clone(),this.foregroundMaterial.uniforms={uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:e},uGlowTex:{value:this.glowTexture}},this.points=new yt(this.backgroundGeometry,this.material),this.points.frustumCulled=!1,this.foregroundPoints=new yt(this.foregroundGeometry,this.foregroundMaterial),this.foregroundPoints.frustumCulled=!1,this.foregroundPoints.renderOrder=2}update(t,e,s,n,i,a,h,p){const f=this.stars,m=f.length,c=this.backgroundGeometry.getAttribute("position"),y=this.backgroundGeometry.getAttribute("aColor"),d=this.foregroundGeometry.getAttribute("aColor"),g=c.array,v=y.array,r=d.array,l=s.matrixWorldInverse.elements,u=s.projectionMatrix.elements,b=l[14],M=s.position.length(),x=E.smoothstep(1-Math.abs(s.position.y)/Math.max(M,1e-4),.55,.95),w=E.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),x),z=E.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),x),Q=E.lerp(.75,1.2,x),dt=Math.max(a*Q/Math.max(h*.5,1),.04),ut=Math.max(a*Q/Math.max(p*.5,1),.04);for(let S=0;S<m;S++){const A=f[S];this.angleOffsets[S]+=A.rotationSpeed*t;const O=this.angleOffsets[S];g[S*3]=A.radius*Math.cos(O),g[S*3+2]=A.radius*Math.sin(O);let B=this.baseAlphas[S];if(A.layer==="bright"){const et=Math.sin(e*2+A.twinklePhase)*.15+.85;B*=et}const I=g[S*3],U=g[S*3+1],V=g[S*3+2],N=l[0]*I+l[4]*U+l[8]*V+l[12],$=l[1]*I+l[5]*U+l[9]*V+l[13],_=l[2]*I+l[6]*U+l[10]*V+l[14],mt=u[0]*N+u[4]*$+u[8]*_+u[12],W=u[1]*N+u[5]*$+u[9]*_+u[13],F=u[3]*N+u[7]*$+u[11]*_+u[15],K=F!==0?1/F:0,X=mt*K,H=W*K,J=(X-n)/dt,tt=(H-i)/ut,pt=1-E.smoothstep(.75,1.25,Math.sqrt(J*J+tt*tt)),Y=E.smoothstep(_-b,w,w+z),G=pt*Y;v[S*4+3]=B*(1-G),r[S*4+3]=B*G}c.needsUpdate=!0,y.needsUpdate=!0,d.needsUpdate=!0}dispose(){this.backgroundGeometry.dispose(),this.foregroundGeometry.dispose(),this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}class oe{constructor(t){const s=document.createElement("canvas");s.width=512,s.height=512;const n=s.getContext("2d"),i=512/2,a=512/2,h=n.createRadialGradient(i,a,0,i,a,i*.3);h.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),h.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),h.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),h.addColorStop(1,"hsla(20, 50%, 30%, 0)"),n.fillStyle=h,n.fillRect(0,0,512,512);const p=n.createRadialGradient(i,a,0,i,a,i*.7);p.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),p.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),p.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),p.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=p,n.fillRect(0,0,512,512);const f=n.createRadialGradient(i,a,0,i,a,i);f.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),f.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),f.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=f,n.fillRect(0,0,512,512);const m=new Dt(s);m.needsUpdate=!0;const c=t*3,y=new ht(c,c);this.material=new Pt({map:m,transparent:!0,depthWrite:!1,blending:ft,side:At}),this.mesh=new j(y,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ie=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,re=`precision highp float;

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
`;class le{constructor(t,e,s,n){const a=new Float32Array(65536),h=e*1.3;for(let d=0;d<t.length;d++){const g=t[d],v=Math.cos(g.angle)*g.radius,r=Math.sin(g.angle)*g.radius,l=Math.floor((v/h*.5+.5)*255),u=Math.floor((r/h*.5+.5)*255);l>=0&&l<256&&u>=0&&u<256&&(a[u*256+l]+=1)}const p=new Float32Array(256*256);for(let d=0;d<3;d++){const g=d%2===0?a:p,v=d%2===0?p:a;for(let r=0;r<256;r++)for(let l=0;l<256;l++){let u=0,b=0;for(let M=-2;M<=2;M++)for(let x=-2;x<=2;x++){const w=l+x,z=r+M;w>=0&&w<256&&z>=0&&z<256&&(u+=g[z*256+w],b++)}v[r*256+l]=u/b}}a.set(p);let f=0;for(let d=0;d<a.length;d++)a[d]>f&&(f=a[d]);const m=new Uint8Array(256*256);if(f>0)for(let d=0;d<a.length;d++)m[d]=Math.min(255,Math.floor(a[d]/f*255));this.densityTexture=new Ct(m,256,256,kt,Tt),this.densityTexture.minFilter=it,this.densityTexture.magFilter=it,this.densityTexture.wrapS=xt,this.densityTexture.wrapT=xt,this.densityTexture.needsUpdate=!0;const c=new ht(2,2),y=n==="mobile";this.material=new lt({vertexShader:ie,fragmentShader:re,defines:{FBM_MAX_OCTAVES:y?2:4,SPIRAL_ITERS:y?3:5},uniforms:{uInvViewProj:{value:new Mt},uTime:{value:0},uGalaxyRadius:{value:e},uSeed:{value:s},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:ft}),this.mesh=new j(c,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,e,s,n,i){const a=this.material.uniforms;a.uTime.value=t,a.uGalaxyRotation.value=s,a.uGalaxyRadius.value=n,a.uAxisRatio.value=i;const h=new Mt;h.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),a.uInvViewProj.value.copy(h).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const he=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ce=`precision highp float;

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
`;class de{constructor(t,e=60){this.apparentPx=0,this.quadSize=e;const s=new Lt(1,4,4),n=new Pt({visible:!1});this.depthMesh=new j(s,n),this.depthMesh.layers.set(2),this.material=new lt({vertexShader:he,fragmentShader:ce,uniforms:{uResolution:{value:new rt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Bt,side:At}),this.mesh=new j(new ht(1,1),this.material),this.mesh.scale.set(e,e,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,e,s,n,i){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=e,this.material.uniforms.uRotY.value=s,i){const a=i.getSize(new rt),h=i.getPixelRatio();this.material.uniforms.uResolution.value.set(a.x*h,a.y*h)}if(n){this.mesh.quaternion.copy(n.quaternion);const a=n.position.length(),p=(n.fov??60)*Math.PI/180,f=this.material.uniforms.uResolution.value.y;this.apparentPx=this.quadSize/a*(f/(2*Math.tan(p/2)));const m=Math.min(Math.max((this.apparentPx-6)/220,0),1);this.material.uniforms.uLOD.value=m}}getLOD(){return this.material.uniforms.uLOD.value}getApparentPx(){return this.apparentPx}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const ue=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,me=`precision highp float;

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
`,Rt=new Z(0,1,0),at=new ot;class ye{constructor(t,e){this.animationId=0,this.clock=new It,this.galaxyRotation=0,this._bhScreenVec=new Z,this.orbitQuat=new ot,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new _t({canvas:t,antialias:!0,alpha:!0});const s=Ht();this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Nt(s))),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new bt,this.renderer.setClearColor(0,1),this.params=Ot(e);const n=Jt(this.params),i=this.params.galaxyRadius;this.baseDistance=i*1.7;const a=t.clientWidth/t.clientHeight;this.camera=new Ft(60,a,.1,this.baseDistance*20),this.backdrop=new Yt(this.baseDistance,e.pgc,s),this.scene.add(this.backdrop.mesh),this.particles=new ae(n,this.baseDistance),this.scene.add(this.particles.points),this.scene.add(this.particles.foregroundPoints),this.haze=new oe(i),this.scene.add(this.haze.mesh),this.nebula=new le(n,i,e.pgc,s),this.scene.add(this.nebula.mesh),this.blackHole=new de(null,i*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.backdrop.mesh.layers.set(1),this.particles.points.layers.set(1),this.particles.foregroundPoints.layers.set(2),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const h=t.clientWidth,p=t.clientHeight;this.rtScaleFactor=Wt(s),this.galaxyRT=new Gt(h*this.renderer.getPixelRatio()*this.rtScaleFactor,p*this.renderer.getPixelRatio()*this.rtScaleFactor,{minFilter:it,magFilter:it}),this.lensingMaterial=new lt({vertexShader:ue,fragmentShader:me,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new rt(.5,.5)},uLensStrength:{value:0},uLensZoom:{value:0},uAspectRatio:{value:h/p}},depthTest:!1,depthWrite:!1});const f=new j(new ht(2,2),this.lensingMaterial);this.lensingScene=new bt,this.lensingScene.add(f),this.lensingCamera=new Et(-1,1,1,-1,0,1);const c=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=c,this.targetZoom=c;const{initRotY:y,initTiltX:d}=Xt(e),g=new ot().setFromAxisAngle(new Z(1,0,0),d),v=new ot().setFromAxisAngle(Rt,y);this.orbitQuat.multiplyQuaternions(v,g),this.onPointerDown=r=>{this.isPinching||(this.isDragging=!0,this.lastX=r.clientX,this.lastY=r.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=r=>{if(this.isPinching||!this.isDragging)return;const l=r.clientX-this.lastX,u=r.clientY-this.lastY;this.velocityX=l*.005,this.velocityY=u*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=r.clientX,this.lastY=r.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=r=>{r.preventDefault();const l=this.targetZoom*.12;this.targetZoom+=r.deltaY>0?-l:l,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=r=>{if(r.touches.length===2){r.preventDefault(),this.isPinching=!0,this.isDragging=!1;const l=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY;this.lastPinchDist=Math.sqrt(l*l+u*u)}},this.onTouchMove=r=>{if(r.touches.length===2){r.preventDefault();const l=r.touches[0].clientX-r.touches[1].clientX,u=r.touches[0].clientY-r.touches[1].clientY,b=Math.sqrt(l*l+u*u),M=(b-this.lastPinchDist)*.01;this.lastPinchDist=b,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+M))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const r=t.clientWidth,l=t.clientHeight;if(r===0||l===0)return;this.renderer.setSize(r,l,!1),this.camera.aspect=r/l,this.camera.updateProjectionMatrix();const u=this.renderer.getPixelRatio();this.galaxyRT.setSize(r*u*this.rtScaleFactor,l*u*this.rtScaleFactor),this.lensingMaterial.uniforms.uAspectRatio.value=r/l}),this.resizeObserver.observe(t)}applyOrbitDelta(t,e){at.setFromAxisAngle(Rt,-t),this.orbitQuat.premultiply(at);const s=new Z(1,0,0).applyQuaternion(this.orbitQuat);at.setFromAxisAngle(s,-e),this.orbitQuat.premultiply(at),this.orbitQuat.normalize()}renderGalaxyPostPass(t,e,s,n){this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(t,e),this.lensingMaterial.uniforms.uLensStrength.value=s,this.lensingMaterial.uniforms.uLensZoom.value=n,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera)}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const e=this.clock.getDelta(),s=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const n=this.baseDistance/this.zoom,i=new Z(0,0,n).applyQuaternion(this.orbitQuat);this.camera.position.copy(i),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const a=Math.min(this.zoom/20,1),h=.02+.18*a*a;this.galaxyRotation+=e*h;const p=this.camera.position,f=Math.sqrt(p.x*p.x+p.z*p.z),m=Math.atan2(p.y,f),c=Math.atan2(p.x,p.z);this.backdrop.update(s,this.camera),this.blackHole.update(s,m,c,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const y=this._bhScreenVec.x*.5+.5,d=this._bhScreenVec.y*.5+.5,g=this.renderer.getSize(new rt),v=this.renderer.getPixelRatio();this.particles.update(e,s,this.camera,this._bhScreenVec.x,this._bhScreenVec.y,this.blackHole.getApparentPx(),g.x*v,g.y*v);const r=this.params.morphology.ellipticity>0?this.params.morphology.axisRatio:1;this.nebula.update(s,this.camera,this.galaxyRotation,this.params.galaxyRadius,r);{const l=this.blackHole.getLOD(),u=l*l*.045;this.renderGalaxyPostPass(y,d,u,l)}this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}export{ye as GalaxyScene};
