import{d as et,o as _t,a as Pt,c as P,r as ht,b as D,e as mt,f as l,t as h,h as p,l as X,i as T,F as ut,j as wt,p as K,m as Q,T as At,w as St,g as Tt,q as Ft,k as It}from"./index-APlq4EMG.js";import{B as Bt,a as dt,b as at,A as pt,c as Ot,f as Nt,g as st,h as zt,D as Rt,M as Y,i as Gt,R as Ut,U as Vt,L as tt,j as vt,k as yt,d as Lt,N as Et,l as gt,C as Ht,V as $,Q as J,W as Wt,S as xt,P as qt,m as Xt,O as $t,_ as nt}from"./_plugin-vue_export-helper-DK3xp8Ih.js";import{a as ft,u as Yt}from"./galaxy-CMN4ctQM.js";function w(e,t,n){return e+(t-e)*n}function j(e,t,n){return Math.max(t,Math.min(n,e))}function jt(e){let t=e|0;return()=>{t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Zt(e,t){switch(e){case"elliptical":return{type:"elliptical",hubbleStage:0,eNumber:Math.round(t()*7),barStrength:null,ringType:null};case"lenticular":return{type:"lenticular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};case"barred":return{type:"barred",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:t()>.5?"strong":"weak",ringType:null};case"irregular":return{type:"irregular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};default:return{type:"spiral",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:null,ringType:null}}}function Qt(e){const t=jt(e.pgc),n=ft(e.pgc),o=.5+t()*1,i=j(300*o,150,450),r=j(Math.round(6e4*(.7+t()*.6)),42e3,78e3),s=Zt(n,t);switch(s.type){case"spiral":{const a=j((s.hubbleStage-1)/8,0,1);return{type:"spiral",numArms:s.hubbleStage<=2?2:s.hubbleStage<=5?Math.round(w(2,4,t())):Math.round(w(2,6,t())),starCount:r,galaxyRadius:i,armWidth:i*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:i*w(.35,.05,a),irregularity:w(0,.3,a)}}case"barred":{const a=j((s.hubbleStage-1)/8,0,1),d=s.barStrength==="strong",c=t();return{type:"barred",numArms:s.hubbleStage<=2?2:Math.round(w(2,4,t())),starCount:r,galaxyRadius:i,armWidth:i*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:i*w(.35,.05,a),barLength:i*(d?w(.3,.6,c):w(.15,.3,c)),barWidth:i*w(.05,.12,t()),irregularity:w(0,.3,a)}}case"elliptical":{const a=s.eNumber??3;return{type:"elliptical",starCount:r,galaxyRadius:i,ellipticity:a/10,axisRatio:1-a/10}}case"lenticular":return{type:"lenticular",starCount:r,galaxyRadius:i,bulgeRadius:i*w(.3,.5,t()),bulgeFraction:w(.4,.7,t()),diskThickness:w(.05,.15,t())};case"irregular":return{type:"irregular",starCount:r,galaxyRadius:i,irregularity:w(.5,1,t()),clumpCount:Math.round(w(3,12,t()))}}}const S=Math.PI*2,A={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,hiiHueRange:[320,340],fieldHueRange:[10,30],dustHueRange:[240,280],hiiRegionChance:.15}},bt=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function F(e){const t=A.visual.dustFraction,n=A.visual.brightFraction;return e<t?"dust":e>1-n?"bright":"star"}function I(e){switch(e){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function O(e,t,n){const o=A.visual;if(n)return o.hiiHueRange[0]+Math.random()*(o.hiiHueRange[1]-o.hiiHueRange[0]);if(e==="dust")return o.dustHueRange[0]+Math.random()*(o.dustHueRange[1]-o.dustHueRange[0]);const i=Math.pow(t,.6);let r=0;for(const a of bt)r+=a.wInner*(1-i)+a.wOuter*i;let s=Math.random()*r;for(const a of bt)if(s-=a.wInner*(1-i)+a.wOuter*i,s<=0)return a.hue+(Math.random()-.5)*a.spread;return 42}function B(e){const{baseSpeed:t,falloff:n,referenceRadius:o}=A.rotation;return t/Math.pow(Math.max(e,o)/o,n)}function Jt(e){return e.galaxyRadius*.06}function Kt(e,t){const n=Jt(t);return e.filter(o=>o.radius>=n)}function Ct(e){const t=Math.random()*S,n=Math.sqrt(Math.random())*e,o=(Math.random()-.5)*e*.08,i=F(Math.random()),r=I(i);return{radius:n,angle:t,y:o,rotationSpeed:B(n),hue:A.visual.fieldHueRange[0]+Math.random()*(A.visual.fieldHueRange[1]-A.visual.fieldHueRange[0]),brightness:r.brightness,size:r.size,alpha:r.alpha,layer:i,twinklePhase:Math.random()*S}}function te(e){const t=[],n=e.numArms||2,o=e.starCount||15e3,i=Math.floor(o*(1-(e.fieldStarFraction||.15))),r=Math.floor(i/n),s=e.galaxyRadius||350,a=e.armWidth||40,d=e.spiralTightness||.25,c=(e.spiralStart||.086)*s,f=e.irregularity||0,u=A.visual.hiiRegionChance,v=10;for(let g=0;g<n;g++){const x=g/n*S,b=new Set;for(let M=0;M<v;M++)Math.random()<u&&b.add(M);for(let M=0;M<r;M++){const _=M/r,z=_*S*2.5,C=c*Math.exp(d*z);if(C>s)continue;const R=z+x,k=(Math.random()-.5+Math.random()-.5)*a,N=R+Math.PI/2,L=(Math.random()-.5)*20,E=f*(Math.random()-.5)*30,G=Math.cos(R)*(C+L+E)+Math.cos(N)*k,U=Math.sin(R)*(C+L+E)+Math.sin(N)*k,H=s*A.visual.diskThicknessRatio*(1-_*.7),ot=(Math.random()-.5)*H,W=Math.sqrt(G*G+U*U),q=Math.atan2(U,G),it=W/s,rt=B(W),V=F(Math.random()),lt=Math.floor(_*v),kt=b.has(lt)&&Math.random()<.4,ct=I(V),Dt=O(V,it,kt);t.push({radius:W,angle:q,y:ot,rotationSpeed:rt,hue:Dt,brightness:ct.brightness,size:ct.size,alpha:ct.alpha,layer:V,twinklePhase:Math.random()*S})}}const m=e.bulgeRadius||0;if(m>0){const g=Math.floor(o*.35);for(let x=0;x<g;x++){const b=Math.pow(Math.random(),.6)*m,M=Math.random()*S,_=(Math.random()-.5)*m*.5,z=b/m,C=1+(1-z)*.5,R=F(Math.random()),k=I(R);t.push({radius:b,angle:M,y:_,rotationSpeed:B(b)*.5,hue:O(R,.1,!1),brightness:Math.min(k.brightness*C,.95),size:k.size*(1+(1-z)*.3),alpha:Math.min(k.alpha*C,.95),layer:R,twinklePhase:Math.random()*S})}}const y=Math.floor(o*(e.fieldStarFraction||.15));for(let g=0;g<y;g++)t.push(Ct(s));return t}function ee(e){const t=[],n=e.numArms||2,o=e.galaxyRadius||350,i=e.barLength||120,r=e.barWidth||25,s=e.armWidth||45,a=e.spiralTightness||.28,d=(e.spiralStart||.143)*o,c=e.starCount||16e3,f=A.visual.hiiRegionChance,u=10,v=Math.floor(c*.25);for(let g=0;g<v;g++){const x=(Math.random()-.5)*2*i,b=(Math.random()-.5)*r,M=x,_=b,z=Math.sqrt(M*M+_*_);if(z>o)continue;const C=Math.atan2(_,M),R=F(Math.random()),k=I(R),N=O(R,.1,!1);t.push({radius:z,angle:C,y:(Math.random()-.5)*o*.04,rotationSpeed:B(z),hue:N,brightness:k.brightness,size:k.size,alpha:k.alpha,layer:R,twinklePhase:Math.random()*S})}for(let g=0;g<n;g++){const x=g/n*S,b=Math.floor((c-v)*.9/n),M=new Set;for(let _=0;_<u;_++)Math.random()<f&&M.add(_);for(let _=0;_<b;_++){const z=_/b,C=z*S*2.5,R=d*Math.exp(a*C);if(R>o||R<i*.5)continue;const k=C+x,N=(Math.random()-.5+Math.random()-.5)*s,L=k+Math.PI/2,E=(Math.random()-.5)*20,G=Math.cos(k)*(R+E)+Math.cos(L)*N,U=Math.sin(k)*(R+E)+Math.sin(L)*N,H=Math.sqrt(G*G+U*U),ot=Math.atan2(U,G),W=H/o,q=F(Math.random()),it=Math.floor(z*u),rt=M.has(it)&&Math.random()<.4,V=I(q),lt=O(q,W,rt);t.push({radius:H,angle:ot,y:(Math.random()-.5)*o*A.visual.diskThicknessRatio*(1-z*.7),rotationSpeed:B(H),hue:lt,brightness:V.brightness,size:V.size,alpha:V.alpha,layer:q,twinklePhase:Math.random()*S})}}const m=e.bulgeRadius||0;if(m>0){const g=Math.floor(c*.3);for(let x=0;x<g;x++){const b=Math.pow(Math.random(),.6)*m,M=Math.random()*S,_=(Math.random()-.5)*m*.5,z=b/m,C=1+(1-z)*.5,R=F(Math.random()),k=I(R);t.push({radius:b,angle:M,y:_,rotationSpeed:B(b)*.5,hue:O(R,.1,!1),brightness:Math.min(k.brightness*C,.95),size:k.size*(1+(1-z)*.3),alpha:Math.min(k.alpha*C,.95),layer:R,twinklePhase:Math.random()*S})}}const y=Math.floor((c-v)*.1);for(let g=0;g<y;g++)t.push(Ct(o));return t}function ae(e){const t=[],n=e.galaxyRadius||300,o=e.bulgeRadius||80,i=e.bulgeFraction||.4,r=n*A.visual.diskThicknessRatio*.5,s=e.starCount||28e3,a=Math.floor(s*i);for(let f=0;f<a;f++){const u=Math.pow(Math.random(),.6)*o,v=Math.random()*S,m=(Math.random()-.5)*o*.6,y=u/o,g=1+(1-y)*.5,x=F(Math.random()),b=I(x);t.push({radius:u,angle:v,y:m,rotationSpeed:B(u)*.5,hue:O(x,.1,!1),brightness:Math.min(b.brightness*g,.95),size:b.size*(1+(1-y)*.3),alpha:Math.min(b.alpha*g,.95),layer:x,twinklePhase:Math.random()*S})}const d=s-a,c=n/3;for(let f=0;f<d;f++){const u=Math.random(),v=-Math.log(1-u*.95)*c;if(v>n){f--;continue}const m=Math.random()*S,y=v/n,g=(Math.random()-.5)*r*(1-y*.5),x=F(Math.random()),b=I(x);t.push({radius:v,angle:m,y:g,rotationSpeed:B(v),hue:O(x,y*.3,!1),brightness:b.brightness,size:b.size,alpha:b.alpha,layer:x,twinklePhase:Math.random()*S})}return t}function se(e){const t=[],n=e.galaxyRadius||320,o=e.axisRatio||.7,i=e.starCount||12e3;for(let r=0;r<i;r++){const s=Math.random(),a=Math.random(),d=Math.pow(s,.4)*n,c=a*S,f=d*Math.cos(c),u=d*Math.sin(c)*o,v=Math.sqrt(f*f+u*u),m=Math.atan2(u,f),y=v/n,g=F(Math.random()),x=I(g),b=O(g,y,!1);t.push({radius:v,angle:m,y:(Math.random()-.5)*n*.1*(1-y*.5),rotationSpeed:B(v)*.3,hue:b,brightness:x.brightness,size:x.size,alpha:x.alpha,layer:g,twinklePhase:Math.random()*S})}return t}function ne(e){const t=[],n=e.galaxyRadius||280,o=e.irregularity||.8,i=e.clumpCount||5,r=[];for(let a=0;a<i;a++){const d=a/i*S+Math.random()*.5,c=(.2+Math.random()*.6)*n;r.push({x:Math.cos(d)*c,z:Math.sin(d)*c,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<A.visual.hiiRegionChance})}const s=e.starCount||1e4;for(let a=0;a<s;a++){let d,c,f=!1;if(Math.random()<1-o){const b=Math.floor(Math.random()*i),M=r[b],_=()=>(Math.random()-.5+Math.random()-.5)*2;d=M.x+_()*M.sigma,c=M.z+_()*M.sigma,f=M.isHII&&Math.random()<.4}else{const b=Math.random()*S,M=Math.sqrt(Math.random())*n;d=Math.cos(b)*M+(Math.random()-.5)*60,c=Math.sin(b)*M+(Math.random()-.5)*60}const u=Math.sqrt(d*d+c*c);if(u>n*1.1)continue;const v=Math.atan2(c,d),m=u/n,y=F(Math.random()),g=I(y),x=O(y,m,f);t.push({radius:u,angle:v,y:(Math.random()-.5)*n*.12,rotationSpeed:B(u)*(.5+Math.random()*.5),hue:x,brightness:g.brightness,size:g.size,alpha:g.alpha,layer:y,twinklePhase:Math.random()*S})}return t}function oe(e){let t;switch(e.type){case"spiral":t=te(e);break;case"barred":t=ee(e);break;case"lenticular":t=ae(e);break;case"elliptical":t=se(e);break;case"irregular":t=ne(e);break}return Kt(t,e)}const ie=`attribute float aSize;
attribute vec4 aColor;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Scale point size relative to camera base distance so stars stay
  // proportionally sized regardless of galaxy radius.
  gl_PointSize = aSize * uPixelRatio * (uBaseDistance * 1.5 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`,re=`precision highp float;

varying vec4 vColor;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
        discard;
    }

    // Sharp bright core (white-hot center)
    float core = smoothstep(0.18, 0.0, dist);

    // Soft halo with moderate falloff
    float halo = exp(-dist * dist * 18.0);

    // Anti-aliased edge
    float edge = smoothstep(0.5, 0.4, dist);

    // Combine: core dominates center, halo provides glow
    float intensity = max(core, halo * 0.6) * edge;

    // Core shifts toward white, halo carries the star color
    vec3 litRgb = mix(vColor.rgb, vec3(1.0), core * 0.6);
    float alpha = vColor.a * intensity;

    // Output premultiplied alpha
    gl_FragColor = vec4(litRgb * alpha, alpha);
}
`;function le(e,t,n){e/=360;const o=t*Math.min(n,1-n),i=r=>{const s=(r+e*12)%12;return n-o*Math.max(Math.min(s-3,9-s,1),-1)};return[i(0),i(8),i(4)]}function ce(e){switch(e){case"dust":return .3;case"star":return .65;case"bright":return .5}}function de(e,t){switch(e){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class he{constructor(t,n=600){this.stars=t;const o=t.length,i=new Float32Array(o*3),r=new Float32Array(o*4),s=new Float32Array(o);this.angleOffsets=new Float32Array(o),this.baseAlphas=new Float32Array(o);for(let a=0;a<o;a++){const d=t[a],c=d.radius*Math.cos(d.angle),f=d.radius*Math.sin(d.angle);i[a*3]=c,i[a*3+1]=d.y,i[a*3+2]=f;const u=ce(d.layer),v=de(d.layer,d.brightness),[m,y,g]=le(d.hue,u,v);r[a*4]=m,r[a*4+1]=y,r[a*4+2]=g,r[a*4+3]=d.alpha,s[a]=d.size,this.angleOffsets[a]=d.angle,this.baseAlphas[a]=d.alpha}this.geometry=new Bt,this.geometry.setAttribute("position",new dt(i,3)),this.geometry.setAttribute("aColor",new dt(r,4)),this.geometry.setAttribute("aSize",new dt(s,1)),this.material=new at({vertexShader:ie,fragmentShader:re,uniforms:{uPixelRatio:{value:window.devicePixelRatio},uBaseDistance:{value:n}},transparent:!0,depthWrite:!1,blending:pt}),this.points=new Ot(this.geometry,this.material)}update(t,n){const o=this.stars,i=o.length,r=this.geometry.getAttribute("position"),s=this.geometry.getAttribute("aColor"),a=r.array,d=s.array;for(let c=0;c<i;c++){const f=o[c];this.angleOffsets[c]+=f.rotationSpeed*t;const u=this.angleOffsets[c];if(a[c*3]=f.radius*Math.cos(u),a[c*3+2]=f.radius*Math.sin(u),f.layer==="bright"){const v=Math.sin(n*2+f.twinklePhase)*.15+.85;d[c*4+3]=this.baseAlphas[c]*v}}r.needsUpdate=!0,s.needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}class ue{constructor(t){const o=document.createElement("canvas");o.width=512,o.height=512;const i=o.getContext("2d"),r=512/2,s=512/2,a=i.createRadialGradient(r,s,0,r,s,r*.3);a.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),a.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),a.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),a.addColorStop(1,"hsla(20, 50%, 30%, 0)"),i.fillStyle=a,i.fillRect(0,0,512,512);const d=i.createRadialGradient(r,s,0,r,s,r*.7);d.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),d.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),d.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),d.addColorStop(1,"hsla(0, 0%, 0%, 0)"),i.fillStyle=d,i.fillRect(0,0,512,512);const c=i.createRadialGradient(r,s,0,r,s,r);c.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),c.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),c.addColorStop(1,"hsla(0, 0%, 0%, 0)"),i.fillStyle=c,i.fillRect(0,0,512,512);const f=new Nt(o);f.needsUpdate=!0;const u=t*3,v=new st(u,u);this.material=new zt({map:f,transparent:!0,depthWrite:!1,blending:pt,side:Rt}),this.mesh=new Y(v,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ge=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,me=`precision highp float;

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
`;class pe{constructor(t,n,o){const r=new Float32Array(65536),s=n*1.3;for(let u=0;u<t.length;u++){const v=t[u],m=Math.cos(v.angle)*v.radius,y=Math.sin(v.angle)*v.radius,g=Math.floor((m/s*.5+.5)*255),x=Math.floor((y/s*.5+.5)*255);g>=0&&g<256&&x>=0&&x<256&&(r[x*256+g]+=1)}const a=new Float32Array(256*256);for(let u=0;u<3;u++){const v=u%2===0?r:a,m=u%2===0?a:r;for(let y=0;y<256;y++)for(let g=0;g<256;g++){let x=0,b=0;for(let M=-2;M<=2;M++)for(let _=-2;_<=2;_++){const z=g+_,C=y+M;z>=0&&z<256&&C>=0&&C<256&&(x+=v[C*256+z],b++)}m[y*256+g]=x/b}}r.set(a);let d=0;for(let u=0;u<r.length;u++)r[u]>d&&(d=r[u]);const c=new Uint8Array(256*256);if(d>0)for(let u=0;u<r.length;u++)c[u]=Math.min(255,Math.floor(r[u]/d*255));this.densityTexture=new Gt(c,256,256,Ut,Vt),this.densityTexture.minFilter=tt,this.densityTexture.magFilter=tt,this.densityTexture.wrapS=vt,this.densityTexture.wrapT=vt,this.densityTexture.needsUpdate=!0;const f=new st(2,2);this.material=new at({vertexShader:ge,fragmentShader:me,uniforms:{uInvViewProj:{value:new yt},uTime:{value:0},uGalaxyRadius:{value:n},uSeed:{value:o},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:pt}),this.mesh=new Y(f,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,n,o,i,r){const s=this.material.uniforms;s.uTime.value=t,s.uGalaxyRotation.value=o,s.uGalaxyRadius.value=i,s.uAxisRatio.value=r;const a=new yt;a.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),s.uInvViewProj.value.copy(a).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const fe=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ve=`precision highp float;

varying vec2 vUV;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiltX;
uniform float uRotY;
uniform float uLOD;  // 0 = far (dim, simple), 1 = close (full detail)

const float pi = 3.1415927;

// ─── Noise (replaces iChannel1 texture) ─────────────────────────────────────

float hash13(vec3 p) {
    p = fract(p * vec3(0.16532, 0.17369, 0.15787));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

float hash(vec2 x) { return fract(cos(dot(x.xy, vec2(2.31, 53.21)) * 124.123) * 412.0); }

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// ─── Distance fields ────────────────────────────────────────────────────────

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// ─── Main ───────────────────────────────────────────────────────────────────

void main() {
    vec2 pp = vUV * 2.0 - 1.0;

    float screenR = length(pp);
    if (screenR > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // ─── Camera ─────────────────────────────────────────────────────────

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

    // ─── Black hole parameters ──────────────────────────────────────────

    vec3 bh = vec3(0.0);
    float bhr = 0.3;
    float bhmass = 5.0 * 0.001;

    vec3 p = ro;
    vec3 pv = rd;

    // Jitter to reduce banding
    p += pv * hash13(rd + vec3(uTime)) * 0.02;

    // LOD-driven parameters
    float intensity = mix(0.3, 1.0, uLOD);       // dim when far, full when close
    float stepSize = mix(0.012, 0.005, uLOD);     // coarser steps when far
    float animSpeed = mix(0.005, 0.02, uLOD);     // slower animation when far
    float grainMix = mix(0.1, 0.5, uLOD);         // less grain detail when far

    float dt = 0.02;
    vec3 col = vec3(0.0);
    float noncaptured = 1.0;
    float captured = 0.0;

    vec3 c1 = vec3(0.6, 0.25, 0.04);
    vec3 c2 = vec3(0.85, 0.5, 0.15);

    // ─── Ray march with gravity ─────────────────────────────────────────

    for (float t = 0.0; t < 1.0; t += stepSize) {
        p += pv * dt * noncaptured;

        // Gravity
        vec3 bhv = bh - p;
        float r = dot(bhv, bhv);
        pv += normalize(bhv) * (bhmass / r);

        noncaptured = smoothstep(0.0, 0.01, sdSphere(p - bh, bhr));
        captured = max(captured, 1.0 - noncaptured);

        // Disk texture using polar coordinates
        float dr = length(bhv.xz);
        float da = atan(bhv.x, bhv.z);
        vec2 ra = vec2(dr, da * (0.01 + (dr - bhr) * 0.002) + 2.0 * pi + uTime * animSpeed);
        ra *= vec2(10.0, 20.0);

        // Procedural noise — coarse structure + fine grain for dusty look
        float coarse = max(0.0, noise(ra * vec2(0.1, 0.5)) + 0.05);
        float grain = noise(ra * vec2(1.5, 3.0) + 77.0);
        float diskTex = coarse * (1.0 - grainMix + grainMix * grain);

        vec3 dcol = mix(c2, c1, pow(max(length(bhv) - bhr, 0.0), 2.0))
                    * diskTex
                    * (2.5 / (0.001 + (length(bhv) - bhr) * 50.0));

        col += max(vec3(0.0), dcol
            * step(0.0, -sdTorus(p * vec3(1.0, 20.0, 1.0) - bh, vec2(0.8, 1.2)))
            * noncaptured);

        // Glow — subdued
        col += vec3(0.85, 0.5, 0.15) * (1.0 / vec3(dot(bhv, bhv))) * 0.002 * noncaptured;
    }

    // Apply LOD intensity
    col *= intensity;

    // ─── Output with alpha ──────────────────────────────────────────────

    // Soft radial feather — starts fading at 0.3, fully gone by 1.0
    float feather = 1.0 - smoothstep(0.3, 1.0, screenR);

    // Alpha from luminance, with soft power falloff — but opaque where ray was captured
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    float glowAlpha = pow(clamp(lum * 3.0, 0.0, 1.0), 1.5) * feather;
    float alpha = max(glowAlpha, captured);
    col *= feather;

    gl_FragColor = vec4(col, alpha);
}
`;class ye{constructor(t,n=60){this.quadSize=n;const o=new Lt(1,4,4),i=new zt({visible:!1});this.depthMesh=new Y(o,i),this.depthMesh.layers.set(2),this.material=new at({vertexShader:fe,fragmentShader:ve,uniforms:{uResolution:{value:new gt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Et,side:Rt}),this.mesh=new Y(new st(1,1),this.material),this.mesh.scale.set(n,n,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,n,o,i,r){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=n,this.material.uniforms.uRotY.value=o,r){const s=r.getSize(new gt),a=r.getPixelRatio();this.material.uniforms.uResolution.value.set(s.x*a,s.y*a)}if(i){this.mesh.quaternion.copy(i.quaternion);const s=i.position.length(),d=(i.fov??60)*Math.PI/180,c=this.material.uniforms.uResolution.value.y,f=this.quadSize/s*(c/(2*Math.tan(d/2))),u=Math.min(Math.max((f-6)/220,0),1);this.material.uniforms.uLOD.value=u}}getLOD(){return this.material.uniforms.uLOD.value}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const xe=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,be=`precision highp float;

uniform sampler2D uSceneTexture;
uniform vec2      uBHScreenPos;   // black hole position in UV space (0–1)
uniform float     uLensStrength;  // 0 = no distortion, ~0.03 = max
uniform float     uAspectRatio;   // width / height

varying vec2 vUV;

void main() {
  // Vector from this pixel to the black hole center
  vec2 toBH = uBHScreenPos - vUV;
  toBH.x *= uAspectRatio;              // work in circular space

  float dist = length(toBH);
  vec2  dir  = toBH / max(dist, 0.0001);

  // Compact lensing — peaks very close to center, drops to zero quickly
  float radius = 0.18;                           // influence radius in UV space
  float falloff = smoothstep(radius, 0.0, dist); // 1 at center, 0 at radius
  falloff *= falloff;                             // squared for steep drop-off
  float softDist = max(dist, 0.03);
  float deflection = uLensStrength * falloff * (0.09 / softDist);

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = 0.02;
  float ring = exp(-pow((dist - ringRadius) / 0.006, 2.0));
  ring *= falloff * uLensStrength * 8.0;
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.12;

  gl_FragColor = color;
}
`,Mt=new $(0,1,0),Z=new J;class Me{constructor(t,n){this.animationId=0,this.clock=new Ht,this.galaxyRotation=0,this._bhScreenVec=new $,this.orbitQuat=new J,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.renderer=new Wt({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new xt,this.renderer.setClearColor(0,1),this.params=Qt(n);const o=oe(this.params),i=this.params.galaxyRadius;this.baseDistance=i*1.7;const r=t.clientWidth/t.clientHeight;this.camera=new qt(60,r,.1,this.baseDistance*20),this.particles=new he(o,this.baseDistance),this.scene.add(this.particles.points),this.haze=new ue(i),this.scene.add(this.haze.mesh),this.nebula=new pe(o,i,n.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new ye(null,i*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.particles.points.layers.set(1),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const s=t.clientWidth,a=t.clientHeight;this.galaxyRT=new Xt(s*window.devicePixelRatio,a*window.devicePixelRatio,{minFilter:tt,magFilter:tt}),this.lensingMaterial=new at({vertexShader:xe,fragmentShader:be,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new gt(.5,.5)},uLensStrength:{value:0},uAspectRatio:{value:s/a}},depthTest:!1,depthWrite:!1});const d=new Y(new st(2,2),this.lensingMaterial);this.lensingScene=new xt,this.lensingScene.add(d),this.lensingCamera=new $t(-1,1,1,-1,0,1);const c=(n.pgc*2654435761>>>0)/4294967296*Math.PI*2,u=new J().setFromAxisAngle(new $(1,0,0),-.45),v=new J().setFromAxisAngle(Mt,c);this.orbitQuat.multiplyQuaternions(u,v),this.onPointerDown=m=>{this.isDragging=!0,this.lastX=m.clientX,this.lastY=m.clientY,this.velocityX=0,this.velocityY=0},this.onPointerMove=m=>{if(!this.isDragging)return;const y=m.clientX-this.lastX,g=m.clientY-this.lastY;this.velocityX=y*.005,this.velocityY=g*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=m.clientX,this.lastY=m.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onWheel=m=>{m.preventDefault();const y=this.targetZoom*.12;this.targetZoom+=m.deltaY>0?-y:y,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),this.resizeObserver=new ResizeObserver(()=>{const m=t.clientWidth,y=t.clientHeight;if(m===0||y===0)return;this.renderer.setSize(m,y,!1),this.camera.aspect=m/y,this.camera.updateProjectionMatrix();const g=this.renderer.getPixelRatio();this.galaxyRT.setSize(m*g,y*g),this.lensingMaterial.uniforms.uAspectRatio.value=m/y}),this.resizeObserver.observe(t)}applyOrbitDelta(t,n){Z.setFromAxisAngle(Mt,-t),this.orbitQuat.premultiply(Z);const o=new $(1,0,0).applyQuaternion(this.orbitQuat);Z.setFromAxisAngle(o,-n),this.orbitQuat.premultiply(Z),this.orbitQuat.normalize()}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const n=this.clock.getDelta(),o=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const i=this.baseDistance/this.zoom,r=new $(0,0,i).applyQuaternion(this.orbitQuat);this.camera.position.copy(r),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const s=Math.min(this.zoom/20,1),a=.02+.18*s*s;this.galaxyRotation+=n*a,this.particles.update(n,o);const d=this.params.type==="elliptical"?this.params.axisRatio:1;this.nebula.update(o,this.camera,this.galaxyRotation,this.params.galaxyRadius,d);const c=this.camera.position,f=Math.sqrt(c.x*c.x+c.z*c.z),u=Math.atan2(c.y,f),v=Math.atan2(c.x,c.z);this.blackHole.update(o,u,v,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const m=this._bhScreenVec.x*.5+.5,y=this._bhScreenVec.y*.5+.5,g=this.blackHole.getLOD(),x=g*g*.03;x<.001?(this.camera.layers.enableAll(),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)):(this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(m,y),this.lensingMaterial.uniforms.uLensStrength.value=x,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera),this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0)};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),this.resizeObserver.disconnect(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}const _e=et({__name:"GalaxyDetail",props:{galaxy:{}},setup(e){const t=e,n=ht(null);let o=null;return _t(()=>{n.value&&(o=new Me(n.value,t.galaxy),o.start())}),Pt(()=>{o==null||o.dispose(),o=null}),(i,r)=>(D(),P("canvas",{ref_key:"canvasRef",ref:n,class:"galaxy-detail-canvas"},null,512))}}),we=nt(_e,[["__scopeId","data-v-ca9938ca"]]),Se={class:"galaxy-info-card"},ze={class:"info-row"},Re={class:"info-label"},Ce={class:"info-row"},ke={key:0,class:"info-row"},De={class:"info-row"},Pe={key:0},Ae={key:1,class:"info-row info-methods"},Te={class:"method-list"},Fe=["title"],Ie=et({__name:"GalaxyInfoCard",props:{galaxy:{}},setup(e){const{t}=mt(),n=e,o=K(()=>ft(n.galaxy.pgc)),i=K(()=>{const r=n.galaxy,s=[];return r.dm_snia!=null&&s.push({key:"snia",abbr:"SNIa"}),r.dm_tf!=null&&s.push({key:"tf",abbr:"TF"}),r.dm_fp!=null&&s.push({key:"fp",abbr:"FP"}),r.dm_sbf!=null&&s.push({key:"sbf",abbr:"SBF"}),r.dm_snii!=null&&s.push({key:"snii",abbr:"SNII"}),r.dm_trgb!=null&&s.push({key:"trgb",abbr:"TRGB"}),r.dm_ceph!=null&&s.push({key:"ceph",abbr:"Ceph"}),r.dm_mas!=null&&s.push({key:"mas",abbr:"Mas"}),s});return(r,s)=>(D(),P("div",Se,[l("div",ze,[l("span",Re,h(p(t)("pages.galaxy.fields.morphology.label")),1),X(" "+h(p(t)("morphology."+o.value)),1)]),l("div",Ce,[s[0]||(s[0]=l("span",{class:"info-label"},"Distance",-1)),X(" "+h(e.galaxy.distance_mpc.toFixed(1))+" Mpc ("+h(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly) ",1)]),e.galaxy.vcmb!=null?(D(),P("div",ke,[s[1]||(s[1]=l("span",{class:"info-label"},"CMB Velocity",-1)),X(" "+h(e.galaxy.vcmb.toLocaleString())+" km/s ",1)])):T("",!0),l("div",De,[s[2]||(s[2]=l("span",{class:"info-label"},"DM",-1)),X(" "+h(e.galaxy.dm.toFixed(2)),1),e.galaxy.e_dm!=null?(D(),P("span",Pe," ± "+h(e.galaxy.e_dm.toFixed(2)),1)):T("",!0)]),i.value.length>0?(D(),P("div",Ae,[s[3]||(s[3]=l("span",{class:"info-label"},"Methods",-1)),l("span",Te,[(D(!0),P(ut,null,wt(i.value,a=>(D(),P("span",{key:a.abbr,class:"method-tag",title:p(t)(`pages.about.data.methods.${a.key}.desc`)},h(a.abbr),9,Fe))),128))])])):T("",!0)]))}}),Be=nt(Ie,[["__scopeId","data-v-d591073e"]]),Oe={key:0,class:"data-sidebar"},Ne={class:"sidebar-scroll"},Ge={class:"sidebar-title"},Ue={class:"data-row"},Ve={class:"data-label"},Le={class:"data-value"},Ee={class:"data-desc"},He={class:"data-row"},We={class:"data-label"},qe={class:"data-value"},Xe={class:"data-desc"},$e={class:"data-row"},Ye={class:"data-label"},je={class:"data-value"},Ze={class:"data-desc"},Qe={class:"data-row"},Je={class:"data-label"},Ke={class:"data-value"},ta={class:"data-desc"},ea={class:"sidebar-section"},aa={class:"data-row"},sa={class:"data-label"},na={class:"data-value"},oa={class:"data-desc"},ia={class:"data-row"},ra={class:"data-label"},la={class:"data-value"},ca={class:"data-desc"},da={class:"data-row"},ha={class:"data-label"},ua={class:"data-value"},ga={class:"data-desc"},ma={class:"data-row"},pa={class:"data-label"},fa={class:"data-value"},va={class:"data-desc"},ya={class:"data-row"},xa={class:"data-label"},ba={class:"data-value"},Ma={class:"data-desc"},_a={class:"sidebar-section"},wa={class:"data-row"},Sa={class:"data-label"},za={class:"data-value"},Ra={class:"data-desc"},Ca={class:"data-row"},ka={class:"data-label"},Da={class:"data-value"},Pa={class:"data-desc"},Aa={class:"data-row"},Ta={class:"data-label"},Fa={class:"data-value"},Ia={class:"data-desc"},Ba={class:"data-row"},Oa={class:"data-label"},Na={class:"data-value"},Ga={class:"data-desc"},Ua={class:"data-row"},Va={class:"data-label"},La={class:"data-value"},Ea={class:"data-desc"},Ha={class:"data-row"},Wa={class:"data-label"},qa={class:"data-value"},Xa={class:"data-desc"},$a={class:"sidebar-section"},Ya={class:"data-label"},ja={class:"data-value"},Za={class:"data-desc"},Qa=et({__name:"GalaxyDataSidebar",props:{galaxy:{},show:{type:Boolean}},emits:["update:show"],setup(e){const{t}=mt(),n=e,o=K(()=>ft(n.galaxy.pgc));function i(a,d){const c=a.toFixed(d);return a>=0?"+"+c:c}function r(a,d){if(a==null)return null;const c=a.toFixed(2);return d!=null?`${c} ± ${d.toFixed(2)}`:c}const s=K(()=>{const a=n.galaxy,d=[],c=[["dm_snia",a.dm_snia,a.e_dm_snia],["dm_tf",a.dm_tf,a.e_dm_tf],["dm_fp",a.dm_fp,a.e_dm_fp],["dm_sbf",a.dm_sbf,a.e_dm_sbf],["dm_snii",a.dm_snii,a.e_dm_snii],["dm_trgb",a.dm_trgb,a.e_dm_trgb],["dm_ceph",a.dm_ceph,a.e_dm_ceph],["dm_mas",a.dm_mas,a.e_dm_mas]];for(const[f,u,v]of c){const m=r(u,v);m&&d.push({key:f,value:m})}return d});return(a,d)=>(D(),Q(At,{name:"slide-right"},{default:St(()=>[e.show?(D(),P("div",Oe,[l("div",Ne,[l("button",{class:"sidebar-close",onClick:d[0]||(d[0]=c=>a.$emit("update:show",!1))},"×"),l("h2",Ge,h(p(t)("pages.galaxy.sections.identity")),1),l("div",Ue,[l("div",Ve,h(p(t)("pages.galaxy.fields.pgc.label")),1),l("div",Le,h(e.galaxy.pgc),1),l("div",Ee,h(p(t)("pages.galaxy.fields.pgc.desc")),1)]),l("div",He,[l("div",We,h(p(t)("pages.galaxy.fields.group_pgc.label")),1),l("div",qe,h(e.galaxy.group_pgc??"—"),1),l("div",Xe,h(p(t)("pages.galaxy.fields.group_pgc.desc")),1)]),l("div",$e,[l("div",Ye,h(p(t)("pages.galaxy.fields.t17.label")),1),l("div",je,h(e.galaxy.t17??"—"),1),l("div",Ze,h(p(t)("pages.galaxy.fields.t17.desc")),1)]),l("div",Qe,[l("div",Je,h(p(t)("pages.galaxy.fields.morphology.label")),1),l("div",Ke,h(p(t)("morphology."+o.value)),1),l("div",ta,h(p(t)("pages.galaxy.fields.morphology.desc")),1)]),l("h2",ea,h(p(t)("pages.galaxy.sections.distance")),1),l("div",aa,[l("div",sa,h(p(t)("pages.galaxy.fields.dm.label")),1),l("div",na,h(e.galaxy.dm.toFixed(2))+" mag",1),l("div",oa,h(p(t)("pages.galaxy.fields.dm.desc")),1)]),l("div",ia,[l("div",ra,h(p(t)("pages.galaxy.fields.e_dm.label")),1),l("div",la,h(e.galaxy.e_dm!=null?"± "+e.galaxy.e_dm.toFixed(2)+" mag":"—"),1),l("div",ca,h(p(t)("pages.galaxy.fields.e_dm.desc")),1)]),l("div",da,[l("div",ha,h(p(t)("pages.galaxy.fields.distance_mpc.label")),1),l("div",ua,h(e.galaxy.distance_mpc.toFixed(1))+" Mpc",1),l("div",ga,h(p(t)("pages.galaxy.fields.distance_mpc.desc")),1)]),l("div",ma,[l("div",pa,h(p(t)("pages.galaxy.fields.distance_mly.label")),1),l("div",fa,h(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly",1),l("div",va,h(p(t)("pages.galaxy.fields.distance_mly.desc")),1)]),l("div",ya,[l("div",xa,h(p(t)("pages.galaxy.fields.vcmb.label")),1),l("div",ba,h(e.galaxy.vcmb!=null?e.galaxy.vcmb.toLocaleString()+" km/s":"—"),1),l("div",Ma,h(p(t)("pages.galaxy.fields.vcmb.desc")),1)]),l("h2",_a,h(p(t)("pages.galaxy.sections.coordinates")),1),l("div",wa,[l("div",Sa,h(p(t)("pages.galaxy.fields.ra.label")),1),l("div",za,h(e.galaxy.ra.toFixed(4))+"°",1),l("div",Ra,h(p(t)("pages.galaxy.fields.ra.desc")),1)]),l("div",Ca,[l("div",ka,h(p(t)("pages.galaxy.fields.dec.label")),1),l("div",Da,h(i(e.galaxy.dec,4))+"°",1),l("div",Pa,h(p(t)("pages.galaxy.fields.dec.desc")),1)]),l("div",Aa,[l("div",Ta,h(p(t)("pages.galaxy.fields.glon.label")),1),l("div",Fa,h(e.galaxy.glon!=null?e.galaxy.glon.toFixed(4)+"°":"—"),1),l("div",Ia,h(p(t)("pages.galaxy.fields.glon.desc")),1)]),l("div",Ba,[l("div",Oa,h(p(t)("pages.galaxy.fields.glat.label")),1),l("div",Na,h(e.galaxy.glat!=null?i(e.galaxy.glat,4)+"°":"—"),1),l("div",Ga,h(p(t)("pages.galaxy.fields.glat.desc")),1)]),l("div",Ua,[l("div",Va,h(p(t)("pages.galaxy.fields.sgl.label")),1),l("div",La,h(e.galaxy.sgl!=null?e.galaxy.sgl.toFixed(3)+"°":"—"),1),l("div",Ea,h(p(t)("pages.galaxy.fields.sgl.desc")),1)]),l("div",Ha,[l("div",Wa,h(p(t)("pages.galaxy.fields.sgb.label")),1),l("div",qa,h(e.galaxy.sgb!=null?i(e.galaxy.sgb,3)+"°":"—"),1),l("div",Xa,h(p(t)("pages.galaxy.fields.sgb.desc")),1)]),s.value.length>0?(D(),P(ut,{key:0},[l("h2",$a,h(p(t)("pages.galaxy.sections.methods")),1),(D(!0),P(ut,null,wt(s.value,c=>(D(),P("div",{key:c.key,class:"data-row"},[l("div",Ya,h(p(t)("pages.galaxy.fields."+c.key+".label")),1),l("div",ja,h(c.value),1),l("div",Za,h(p(t)("pages.galaxy.fields."+c.key+".desc")),1)]))),128))],64)):T("",!0)])])):T("",!0)]),_:1}))}}),Ja=nt(Qa,[["__scopeId","data-v-cbcbdb69"]]),Ka={class:"w-full h-full"},ts={key:1,class:"galaxy-title"},es={class:"top-buttons"},as={key:4,class:"not-found"},ss=et({__name:"GalaxyView",setup(e){const{t}=mt(),n=Ft(),{ready:o,isLoading:i,getGalaxyByPgc:r}=Yt(),s=ht(null),a=ht(!1);return _t(async()=>{await o,s.value=r(Number(n.params.pgc))}),(d,c)=>{const f=It("router-link");return D(),P("div",Ka,[s.value?(D(),Q(we,{key:0,galaxy:s.value},null,8,["galaxy"])):T("",!0),s.value?(D(),P("div",ts,"PGC "+h(s.value.pgc),1)):T("",!0),s.value?(D(),Q(Be,{key:2,galaxy:s.value},null,8,["galaxy"])):T("",!0),l("div",es,[l("button",{class:"data-button",onClick:c[0]||(c[0]=u=>a.value=!a.value)},h(p(t)("pages.galaxy.dataButton")),1),Tt(f,{to:"/",class:"back-button"},{default:St(()=>[...c[2]||(c[2]=[X("← Back",-1)])]),_:1})]),s.value?(D(),Q(Ja,{key:3,galaxy:s.value,show:a.value,"onUpdate:show":c[1]||(c[1]=u=>a.value=u)},null,8,["galaxy","show"])):T("",!0),!s.value&&!p(i)?(D(),P("div",as,"Galaxy not found")):T("",!0)])}}}),rs=nt(ss,[["__scopeId","data-v-da36072f"]]);export{rs as default};
