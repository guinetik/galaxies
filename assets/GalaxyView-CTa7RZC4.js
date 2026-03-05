import{h as et,o as wt,i as Pt,j as P,r as ht,k as S,_ as at,l as mt,n as s,t as r,p as f,G as q,q as A,F as ut,x as St,v as O,A as K,T as Tt,w as At,H as Ft}from"./index-BslOHa1v.js";import{B as It,c as dt,a as st,A as pt,b as Lt,g as Et,h as nt,i as zt,D as Rt,M as Z,j as Bt,k as Ot,U as Gt,L as tt,l as yt,f as xt,d as Nt,N as Ut,m as gt,C as Vt,V as j,Q as J,W as Ht,S as bt,P as Wt,n as $t,O as Xt}from"./three.module-DkVQHQlM.js";import{a as ft,e as vt,u as qt}from"./galaxy-D2ihyOcu.js";function w(e,t,n){return e+(t-e)*n}function Y(e,t,n){return Math.max(t,Math.min(n,e))}function Yt(e){let t=e|0;return()=>{t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function jt(e,t){switch(e){case"elliptical":return{type:"elliptical",hubbleStage:0,eNumber:Math.round(t()*7),barStrength:null,ringType:null};case"lenticular":return{type:"lenticular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};case"barred":return{type:"barred",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:t()>.5?"strong":"weak",ringType:null};case"irregular":return{type:"irregular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};default:return{type:"spiral",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:null,ringType:null}}}function Zt(e){const t=Yt(e.pgc),n=ft(e.pgc,e.morphology),{diameterKpc:o,source:m}=vt(e,n,t),l=Y(o*12,30,2400);let u;if(e.log_ms_t!=null&&e.log_ms_t>10.8){const a=Math.pow(10,.15*(e.log_ms_t-10.8));u=Y(Math.round(6e4*a),6e4,12e4)}else u=Y(Math.round(6e4*(.7+t()*.6)),42e3,78e3);const c={starCount:u,galaxyRadius:l,diameterKpc:o,sizeSource:m},h=jt(n,t);switch(h.type){case"spiral":{const a=Y((h.hubbleStage-1)/8,0,1);return{...c,type:"spiral",numArms:h.hubbleStage<=2?2:h.hubbleStage<=5?Math.round(w(2,4,t())):Math.round(w(2,6,t())),armWidth:l*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:l*w(.35,.05,a),irregularity:w(0,.3,a)}}case"barred":{const a=Y((h.hubbleStage-1)/8,0,1),i=h.barStrength==="strong",g=t();return{...c,type:"barred",numArms:h.hubbleStage<=2?2:Math.round(w(2,4,t())),armWidth:l*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:l*w(.35,.05,a),barLength:l*(i?w(.3,.6,g):w(.15,.3,g)),barWidth:l*w(.05,.12,t()),irregularity:w(0,.3,a)}}case"elliptical":{const a=e.axial_ratio??e.ba,i=a??1-(h.eNumber??3)/10;return{...c,type:"elliptical",ellipticity:1-i,axisRatio:i}}case"lenticular":return{...c,type:"lenticular",bulgeRadius:l*w(.3,.5,t()),bulgeFraction:w(.4,.7,t()),diskThickness:w(.05,.15,t())};case"irregular":return{...c,type:"irregular",irregularity:w(.5,1,t()),clumpCount:Math.round(w(3,12,t()))}}}const z=Math.PI*2,F={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,hiiHueRange:[320,340],fieldHueRange:[10,30],dustHueRange:[240,280],hiiRegionChance:.15}},_t=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function I(e){const t=F.visual.dustFraction,n=F.visual.brightFraction;return e<t?"dust":e>1-n?"bright":"star"}function L(e){switch(e){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function B(e,t,n){const o=F.visual;if(n)return o.hiiHueRange[0]+Math.random()*(o.hiiHueRange[1]-o.hiiHueRange[0]);if(e==="dust")return o.dustHueRange[0]+Math.random()*(o.dustHueRange[1]-o.dustHueRange[0]);const m=Math.pow(t,.6);let l=0;for(const c of _t)l+=c.wInner*(1-m)+c.wOuter*m;let u=Math.random()*l;for(const c of _t)if(u-=c.wInner*(1-m)+c.wOuter*m,u<=0)return c.hue+(Math.random()-.5)*c.spread;return 42}function E(e){const{baseSpeed:t,falloff:n,referenceRadius:o}=F.rotation;return t/Math.pow(Math.max(e,o)/o,n)}function Qt(e){return e.galaxyRadius*.06}function Kt(e,t){const n=Qt(t);return e.filter(o=>o.radius>=n)}function Ct(e){const t=Math.random()*z,n=Math.sqrt(Math.random())*e,o=(Math.random()-.5)*e*.08,m=I(Math.random()),l=L(m);return{radius:n,angle:t,y:o,rotationSpeed:E(n),hue:F.visual.fieldHueRange[0]+Math.random()*(F.visual.fieldHueRange[1]-F.visual.fieldHueRange[0]),brightness:l.brightness,size:l.size,alpha:l.alpha,layer:m,twinklePhase:Math.random()*z}}function Jt(e){const t=[],n=e.numArms||2,o=e.starCount||15e3,m=Math.floor(o*(1-(e.fieldStarFraction||.15))),l=Math.floor(m/n),u=e.galaxyRadius||350,c=e.armWidth||40,h=e.spiralTightness||.25,a=(e.spiralStart||.086)*u,i=e.irregularity||0,g=F.visual.hiiRegionChance,p=10;for(let d=0;d<n;d++){const v=d/n*z,y=new Set;for(let x=0;x<p;x++)Math.random()<g&&y.add(x);for(let x=0;x<l;x++){const M=x/l,R=M*z*2.5,C=a*Math.exp(h*R);if(C>u)continue;const D=R+v,k=(Math.random()-.5+Math.random()-.5)*c,T=D+Math.PI/2,V=(Math.random()-.5)*20,H=i*(Math.random()-.5)*30,G=Math.cos(D)*(C+V+H)+Math.cos(T)*k,N=Math.sin(D)*(C+V+H)+Math.sin(T)*k,W=u*F.visual.diskThicknessRatio*(1-M*.7),it=(Math.random()-.5)*W,$=Math.sqrt(G*G+N*N),X=Math.atan2(N,G),ot=$/u,rt=E($),U=I(Math.random()),lt=Math.floor(M*p),Dt=y.has(lt)&&Math.random()<.4,ct=L(U),kt=B(U,ot,Dt);t.push({radius:$,angle:X,y:it,rotationSpeed:rt,hue:kt,brightness:ct.brightness,size:ct.size,alpha:ct.alpha,layer:U,twinklePhase:Math.random()*z})}}const b=e.bulgeRadius||0;if(b>0){const d=Math.min(.25,.1+.2*(b/u)),v=Math.floor(o*d);for(let y=0;y<v;y++){const x=Math.pow(Math.random(),.6)*b,M=Math.random()*z,R=(Math.random()-.5)*b*.5,C=x/b,D=1+(1-C)*.5,k=I(Math.random()),T=L(k);t.push({radius:x,angle:M,y:R,rotationSpeed:E(x)*.5,hue:B(k,.1,!1),brightness:Math.min(T.brightness*D,.95),size:T.size*(1+(1-C)*.3),alpha:Math.min(T.alpha*D,.95),layer:k,twinklePhase:Math.random()*z})}}const _=Math.floor(o*(e.fieldStarFraction||.15));for(let d=0;d<_;d++)t.push(Ct(u));return t}function te(e){const t=[],n=e.numArms||2,o=e.galaxyRadius||350,m=e.barLength||120,l=e.barWidth||25,u=e.armWidth||45,c=e.spiralTightness||.28,h=(e.spiralStart||.143)*o,a=e.starCount||16e3,i=F.visual.hiiRegionChance,g=10,p=Math.floor(a*.25);for(let d=0;d<p;d++){const v=(Math.random()-.5)*2*m,y=(Math.random()-.5)*l,x=v,M=y,R=Math.sqrt(x*x+M*M);if(R>o)continue;const C=Math.atan2(M,x),D=I(Math.random()),k=L(D),T=B(D,.1,!1);t.push({radius:R,angle:C,y:(Math.random()-.5)*o*.04,rotationSpeed:E(R),hue:T,brightness:k.brightness,size:k.size,alpha:k.alpha,layer:D,twinklePhase:Math.random()*z})}for(let d=0;d<n;d++){const v=d/n*z,y=Math.floor((a-p)*.9/n),x=new Set;for(let M=0;M<g;M++)Math.random()<i&&x.add(M);for(let M=0;M<y;M++){const R=M/y,C=R*z*2.5,D=h*Math.exp(c*C);if(D>o||D<m*.5)continue;const k=C+v,T=(Math.random()-.5+Math.random()-.5)*u,V=k+Math.PI/2,H=(Math.random()-.5)*20,G=Math.cos(k)*(D+H)+Math.cos(V)*T,N=Math.sin(k)*(D+H)+Math.sin(V)*T,W=Math.sqrt(G*G+N*N),it=Math.atan2(N,G),$=W/o,X=I(Math.random()),ot=Math.floor(R*g),rt=x.has(ot)&&Math.random()<.4,U=L(X),lt=B(X,$,rt);t.push({radius:W,angle:it,y:(Math.random()-.5)*o*F.visual.diskThicknessRatio*(1-R*.7),rotationSpeed:E(W),hue:lt,brightness:U.brightness,size:U.size,alpha:U.alpha,layer:X,twinklePhase:Math.random()*z})}}const b=e.bulgeRadius||0;if(b>0){const d=Math.min(.2,.08+.18*(b/o)),v=Math.floor(a*d);for(let y=0;y<v;y++){const x=Math.pow(Math.random(),.6)*b,M=Math.random()*z,R=(Math.random()-.5)*b*.5,C=x/b,D=1+(1-C)*.5,k=I(Math.random()),T=L(k);t.push({radius:x,angle:M,y:R,rotationSpeed:E(x)*.5,hue:B(k,.1,!1),brightness:Math.min(T.brightness*D,.95),size:T.size*(1+(1-C)*.3),alpha:Math.min(T.alpha*D,.95),layer:k,twinklePhase:Math.random()*z})}}const _=Math.floor((a-p)*.1);for(let d=0;d<_;d++)t.push(Ct(o));return t}function ee(e){const t=[],n=e.galaxyRadius||300,o=e.bulgeRadius||80,m=e.bulgeFraction||.4,l=n*F.visual.diskThicknessRatio*.5,u=e.starCount||28e3,c=Math.floor(u*m);for(let i=0;i<c;i++){const g=Math.pow(Math.random(),.6)*o,p=Math.random()*z,b=(Math.random()-.5)*o*.6,_=g/o,d=1+(1-_)*.5,v=I(Math.random()),y=L(v);t.push({radius:g,angle:p,y:b,rotationSpeed:E(g)*.5,hue:B(v,.1,!1),brightness:Math.min(y.brightness*d,.95),size:y.size*(1+(1-_)*.3),alpha:Math.min(y.alpha*d,.95),layer:v,twinklePhase:Math.random()*z})}const h=u-c,a=n/3;for(let i=0;i<h;i++){const g=Math.random(),p=-Math.log(1-g*.95)*a;if(p>n){i--;continue}const b=Math.random()*z,_=p/n,d=(Math.random()-.5)*l*(1-_*.5),v=I(Math.random()),y=L(v);t.push({radius:p,angle:b,y:d,rotationSpeed:E(p),hue:B(v,_*.3,!1),brightness:y.brightness,size:y.size,alpha:y.alpha,layer:v,twinklePhase:Math.random()*z})}return t}function ae(e){const t=[],n=e.galaxyRadius||320,o=e.axisRatio||.7,m=e.starCount||12e3;for(let l=0;l<m;l++){const u=Math.random(),c=Math.random(),h=Math.pow(u,.4)*n,a=c*z,i=h*Math.cos(a),g=h*Math.sin(a)*o,p=Math.sqrt(i*i+g*g),b=Math.atan2(g,i),_=p/n,d=I(Math.random()),v=L(d),y=B(d,_,!1);t.push({radius:p,angle:b,y:(Math.random()-.5)*n*.1*(1-_*.5),rotationSpeed:E(p)*.3,hue:y,brightness:v.brightness,size:v.size,alpha:v.alpha,layer:d,twinklePhase:Math.random()*z})}return t}function se(e){const t=[],n=e.galaxyRadius||280,o=e.irregularity||.8,m=e.clumpCount||5,l=[];for(let c=0;c<m;c++){const h=c/m*z+Math.random()*.5,a=(.2+Math.random()*.6)*n;l.push({x:Math.cos(h)*a,z:Math.sin(h)*a,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<F.visual.hiiRegionChance})}const u=e.starCount||1e4;for(let c=0;c<u;c++){let h,a,i=!1;if(Math.random()<1-o){const y=Math.floor(Math.random()*m),x=l[y],M=()=>(Math.random()-.5+Math.random()-.5)*2;h=x.x+M()*x.sigma,a=x.z+M()*x.sigma,i=x.isHII&&Math.random()<.4}else{const y=Math.random()*z,x=Math.sqrt(Math.random())*n;h=Math.cos(y)*x+(Math.random()-.5)*60,a=Math.sin(y)*x+(Math.random()-.5)*60}const g=Math.sqrt(h*h+a*a);if(g>n*1.1)continue;const p=Math.atan2(a,h),b=g/n,_=I(Math.random()),d=L(_),v=B(_,b,i);t.push({radius:g,angle:p,y:(Math.random()-.5)*n*.12,rotationSpeed:E(g)*(.5+Math.random()*.5),hue:v,brightness:d.brightness,size:d.size,alpha:d.alpha,layer:_,twinklePhase:Math.random()*z})}return t}function ne(e){let t;switch(e.type){case"spiral":t=Jt(e);break;case"barred":t=te(e);break;case"lenticular":t=ee(e);break;case"elliptical":t=ae(e);break;case"irregular":t=se(e);break}return Kt(t,e)}const ie=`attribute float aSize;
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
`,oe=`precision highp float;

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
`;function re(e,t,n){e/=360;const o=t*Math.min(n,1-n),m=l=>{const u=(l+e*12)%12;return n-o*Math.max(Math.min(u-3,9-u,1),-1)};return[m(0),m(8),m(4)]}function le(e){switch(e){case"dust":return .3;case"star":return .65;case"bright":return .5}}function ce(e,t){switch(e){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class de{constructor(t,n=600){this.stars=t;const o=t.length,m=new Float32Array(o*3),l=new Float32Array(o*4),u=new Float32Array(o);this.angleOffsets=new Float32Array(o),this.baseAlphas=new Float32Array(o);for(let c=0;c<o;c++){const h=t[c],a=h.radius*Math.cos(h.angle),i=h.radius*Math.sin(h.angle);m[c*3]=a,m[c*3+1]=h.y,m[c*3+2]=i;const g=le(h.layer),p=ce(h.layer,h.brightness),[b,_,d]=re(h.hue,g,p);l[c*4]=b,l[c*4+1]=_,l[c*4+2]=d,l[c*4+3]=h.alpha,u[c]=h.size,this.angleOffsets[c]=h.angle,this.baseAlphas[c]=h.alpha}this.geometry=new It,this.geometry.setAttribute("position",new dt(m,3)),this.geometry.setAttribute("aColor",new dt(l,4)),this.geometry.setAttribute("aSize",new dt(u,1)),this.material=new st({vertexShader:ie,fragmentShader:oe,uniforms:{uPixelRatio:{value:window.devicePixelRatio},uBaseDistance:{value:n}},transparent:!0,depthWrite:!1,blending:pt}),this.points=new Lt(this.geometry,this.material)}update(t,n){const o=this.stars,m=o.length,l=this.geometry.getAttribute("position"),u=this.geometry.getAttribute("aColor"),c=l.array,h=u.array;for(let a=0;a<m;a++){const i=o[a];this.angleOffsets[a]+=i.rotationSpeed*t;const g=this.angleOffsets[a];if(c[a*3]=i.radius*Math.cos(g),c[a*3+2]=i.radius*Math.sin(g),i.layer==="bright"){const p=Math.sin(n*2+i.twinklePhase)*.15+.85;h[a*4+3]=this.baseAlphas[a]*p}}l.needsUpdate=!0,u.needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}class he{constructor(t){const o=document.createElement("canvas");o.width=512,o.height=512;const m=o.getContext("2d"),l=512/2,u=512/2,c=m.createRadialGradient(l,u,0,l,u,l*.3);c.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),c.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),c.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),c.addColorStop(1,"hsla(20, 50%, 30%, 0)"),m.fillStyle=c,m.fillRect(0,0,512,512);const h=m.createRadialGradient(l,u,0,l,u,l*.7);h.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),h.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),h.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),h.addColorStop(1,"hsla(0, 0%, 0%, 0)"),m.fillStyle=h,m.fillRect(0,0,512,512);const a=m.createRadialGradient(l,u,0,l,u,l);a.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),a.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),a.addColorStop(1,"hsla(0, 0%, 0%, 0)"),m.fillStyle=a,m.fillRect(0,0,512,512);const i=new Et(o);i.needsUpdate=!0;const g=t*3,p=new nt(g,g);this.material=new zt({map:i,transparent:!0,depthWrite:!1,blending:pt,side:Rt}),this.mesh=new Z(p,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ue=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,ge=`precision highp float;

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
`;class me{constructor(t,n,o){const l=new Float32Array(65536),u=n*1.3;for(let g=0;g<t.length;g++){const p=t[g],b=Math.cos(p.angle)*p.radius,_=Math.sin(p.angle)*p.radius,d=Math.floor((b/u*.5+.5)*255),v=Math.floor((_/u*.5+.5)*255);d>=0&&d<256&&v>=0&&v<256&&(l[v*256+d]+=1)}const c=new Float32Array(256*256);for(let g=0;g<3;g++){const p=g%2===0?l:c,b=g%2===0?c:l;for(let _=0;_<256;_++)for(let d=0;d<256;d++){let v=0,y=0;for(let x=-2;x<=2;x++)for(let M=-2;M<=2;M++){const R=d+M,C=_+x;R>=0&&R<256&&C>=0&&C<256&&(v+=p[C*256+R],y++)}b[_*256+d]=v/y}}l.set(c);let h=0;for(let g=0;g<l.length;g++)l[g]>h&&(h=l[g]);const a=new Uint8Array(256*256);if(h>0)for(let g=0;g<l.length;g++)a[g]=Math.min(255,Math.floor(l[g]/h*255));this.densityTexture=new Bt(a,256,256,Ot,Gt),this.densityTexture.minFilter=tt,this.densityTexture.magFilter=tt,this.densityTexture.wrapS=yt,this.densityTexture.wrapT=yt,this.densityTexture.needsUpdate=!0;const i=new nt(2,2);this.material=new st({vertexShader:ue,fragmentShader:ge,uniforms:{uInvViewProj:{value:new xt},uTime:{value:0},uGalaxyRadius:{value:n},uSeed:{value:o},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:pt}),this.mesh=new Z(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,n,o,m,l){const u=this.material.uniforms;u.uTime.value=t,u.uGalaxyRotation.value=o,u.uGalaxyRadius.value=m,u.uAxisRatio.value=l;const c=new xt;c.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),u.uInvViewProj.value.copy(c).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const pe=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,fe=`precision highp float;

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
`;class ve{constructor(t,n=60){this.quadSize=n;const o=new Nt(1,4,4),m=new zt({visible:!1});this.depthMesh=new Z(o,m),this.depthMesh.layers.set(2),this.material=new st({vertexShader:pe,fragmentShader:fe,uniforms:{uResolution:{value:new gt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ut,side:Rt}),this.mesh=new Z(new nt(1,1),this.material),this.mesh.scale.set(n,n,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,n,o,m,l){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=n,this.material.uniforms.uRotY.value=o,l){const u=l.getSize(new gt),c=l.getPixelRatio();this.material.uniforms.uResolution.value.set(u.x*c,u.y*c)}if(m){this.mesh.quaternion.copy(m.quaternion);const u=m.position.length(),h=(m.fov??60)*Math.PI/180,a=this.material.uniforms.uResolution.value.y,i=this.quadSize/u*(a/(2*Math.tan(h/2))),g=Math.min(Math.max((i-6)/220,0),1);this.material.uniforms.uLOD.value=g}}getLOD(){return this.material.uniforms.uLOD.value}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const ye=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,xe=`precision highp float;

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
`,Mt=new j(0,1,0),Q=new J;class be{constructor(t,n){this.animationId=0,this.clock=new Vt,this.galaxyRotation=0,this._bhScreenVec=new j,this.orbitQuat=new J,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new Ht({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new bt,this.renderer.setClearColor(0,1),this.params=Zt(n);const o=ne(this.params),m=this.params.galaxyRadius;this.baseDistance=m*1.7;const l=t.clientWidth/t.clientHeight;this.camera=new Wt(60,l,.1,this.baseDistance*20),this.particles=new de(o,this.baseDistance),this.scene.add(this.particles.points),this.haze=new he(m),this.scene.add(this.haze.mesh),this.nebula=new me(o,m,n.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new ve(null,m*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.particles.points.layers.set(1),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const u=t.clientWidth,c=t.clientHeight;this.galaxyRT=new $t(u*window.devicePixelRatio,c*window.devicePixelRatio,{minFilter:tt,magFilter:tt}),this.lensingMaterial=new st({vertexShader:ye,fragmentShader:xe,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new gt(.5,.5)},uLensStrength:{value:0},uAspectRatio:{value:u/c}},depthTest:!1,depthWrite:!1});const h=new Z(new nt(2,2),this.lensingMaterial);this.lensingScene=new bt,this.lensingScene.add(h),this.lensingCamera=new Xt(-1,1,1,-1,0,1);const i=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=i,this.targetZoom=i;const g=(n.pgc*2654435761>>>0)/4294967296*Math.PI*2,b=new J().setFromAxisAngle(new j(1,0,0),-.45),_=new J().setFromAxisAngle(Mt,g);this.orbitQuat.multiplyQuaternions(b,_),this.onPointerDown=d=>{this.isPinching||(this.isDragging=!0,this.lastX=d.clientX,this.lastY=d.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=d=>{if(this.isPinching||!this.isDragging)return;const v=d.clientX-this.lastX,y=d.clientY-this.lastY;this.velocityX=v*.005,this.velocityY=y*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=d.clientX,this.lastY=d.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=d=>{d.preventDefault();const v=this.targetZoom*.12;this.targetZoom+=d.deltaY>0?-v:v,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=d=>{if(d.touches.length===2){d.preventDefault(),this.isPinching=!0,this.isDragging=!1;const v=d.touches[0].clientX-d.touches[1].clientX,y=d.touches[0].clientY-d.touches[1].clientY;this.lastPinchDist=Math.sqrt(v*v+y*y)}},this.onTouchMove=d=>{if(d.touches.length===2){d.preventDefault();const v=d.touches[0].clientX-d.touches[1].clientX,y=d.touches[0].clientY-d.touches[1].clientY,x=Math.sqrt(v*v+y*y),M=(x-this.lastPinchDist)*.01;this.lastPinchDist=x,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+M))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const d=t.clientWidth,v=t.clientHeight;if(d===0||v===0)return;this.renderer.setSize(d,v,!1),this.camera.aspect=d/v,this.camera.updateProjectionMatrix();const y=this.renderer.getPixelRatio();this.galaxyRT.setSize(d*y,v*y),this.lensingMaterial.uniforms.uAspectRatio.value=d/v}),this.resizeObserver.observe(t)}applyOrbitDelta(t,n){Q.setFromAxisAngle(Mt,-t),this.orbitQuat.premultiply(Q);const o=new j(1,0,0).applyQuaternion(this.orbitQuat);Q.setFromAxisAngle(o,-n),this.orbitQuat.premultiply(Q),this.orbitQuat.normalize()}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const n=this.clock.getDelta(),o=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const m=this.baseDistance/this.zoom,l=new j(0,0,m).applyQuaternion(this.orbitQuat);this.camera.position.copy(l),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const u=Math.min(this.zoom/20,1),c=.02+.18*u*u;this.galaxyRotation+=n*c,this.particles.update(n,o);const h=this.params.type==="elliptical"?this.params.axisRatio:1;this.nebula.update(o,this.camera,this.galaxyRotation,this.params.galaxyRadius,h);const a=this.camera.position,i=Math.sqrt(a.x*a.x+a.z*a.z),g=Math.atan2(a.y,i),p=Math.atan2(a.x,a.z);this.blackHole.update(o,g,p,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const b=this._bhScreenVec.x*.5+.5,_=this._bhScreenVec.y*.5+.5,d=this.blackHole.getLOD(),v=d*d*.03;v<.001?(this.camera.layers.enableAll(),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)):(this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(b,_),this.lensingMaterial.uniforms.uLensStrength.value=v,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera),this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0)};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}const _e=et({__name:"GalaxyDetail",props:{galaxy:{}},setup(e){const t=e,n=ht(null);let o=null;return wt(()=>{n.value&&(o=new be(n.value,t.galaxy),o.start())}),Pt(()=>{o==null||o.dispose(),o=null}),(m,l)=>(S(),P("canvas",{ref_key:"canvasRef",ref:n,class:"galaxy-detail-canvas"},null,512))}}),Me=at(_e,[["__scopeId","data-v-787b8f20"]]),we={class:"galaxy-info-card"},Se={class:"info-row"},ze={class:"info-label"},Re={key:0,class:"procedural-mark",title:"Procedurally assigned"},Ce={class:"info-row"},De={class:"info-row"},ke={class:"info-label"},Pe={class:"size-source"},Te={key:0,class:"info-row"},Ae={class:"info-row"},Fe={key:0},Ie={key:1,class:"info-row info-methods"},Le={class:"method-list"},Ee=["title"],Be=et({__name:"GalaxyInfoCard",props:{galaxy:{}},setup(e){const{t}=mt(),n=e,o=O(()=>ft(n.galaxy.pgc,n.galaxy.morphology));function m(h){let a=h|0;return()=>{a=a+1831565813|0;let i=Math.imul(a^a>>>15,1|a);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}const l=O(()=>{const h=m(n.galaxy.pgc);return vt(n.galaxy,o.value,h)}),u=O(()=>{switch(l.value.source){case"observed":return"Observed";case"mass":return"Mass";default:return"Estimated"}}),c=O(()=>{const h=n.galaxy,a=[];return h.dm_snia!=null&&a.push({key:"snia",abbr:"SNIa"}),h.dm_tf!=null&&a.push({key:"tf",abbr:"TF"}),h.dm_fp!=null&&a.push({key:"fp",abbr:"FP"}),h.dm_sbf!=null&&a.push({key:"sbf",abbr:"SBF"}),h.dm_snii!=null&&a.push({key:"snii",abbr:"SNII"}),h.dm_trgb!=null&&a.push({key:"trgb",abbr:"TRGB"}),h.dm_ceph!=null&&a.push({key:"ceph",abbr:"Ceph"}),h.dm_mas!=null&&a.push({key:"mas",abbr:"Mas"}),a});return(h,a)=>(S(),P("div",we,[s("div",Se,[s("span",ze,r(f(t)("pages.galaxy.fields.morphology.label")),1),q(" "+r(f(t)("morphology."+o.value)),1),e.galaxy.morphology?A("",!0):(S(),P("sup",Re,"p"))]),s("div",Ce,[a[0]||(a[0]=s("span",{class:"info-label"},"Distance",-1)),q(" "+r(e.galaxy.distance_mpc.toFixed(1))+" Mpc ("+r(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly) ",1)]),s("div",De,[s("span",ke,r(f(t)("pages.galaxy.size")),1),q(" "+r(l.value.diameterKpc.toFixed(1))+" kpc ("+r((l.value.diameterKpc*3.26).toFixed(1))+" kly) ",1),s("span",Pe,r(f(t)("pages.galaxy.size"+u.value)),1)]),e.galaxy.vcmb!=null?(S(),P("div",Te,[a[1]||(a[1]=s("span",{class:"info-label"},"CMB Velocity",-1)),q(" "+r(e.galaxy.vcmb.toLocaleString())+" km/s ",1)])):A("",!0),s("div",Ae,[a[2]||(a[2]=s("span",{class:"info-label"},"DM",-1)),q(" "+r(e.galaxy.dm.toFixed(2)),1),e.galaxy.e_dm!=null?(S(),P("span",Fe," ± "+r(e.galaxy.e_dm.toFixed(2)),1)):A("",!0)]),c.value.length>0?(S(),P("div",Ie,[a[3]||(a[3]=s("span",{class:"info-label"},"Methods",-1)),s("span",Le,[(S(!0),P(ut,null,St(c.value,i=>(S(),P("span",{key:i.abbr,class:"method-tag",title:f(t)(`pages.about.data.methods.${i.key}.desc`)},r(i.abbr),9,Ee))),128))])])):A("",!0)]))}}),Oe=at(Be,[["__scopeId","data-v-70dd8203"]]),Ge={key:0,class:"data-sidebar"},Ne={class:"sidebar-scroll"},Ue={class:"sidebar-title"},Ve={class:"data-row"},He={class:"data-label"},We={class:"data-value"},$e={class:"data-desc"},Xe={class:"data-row"},qe={class:"data-label"},Ye={class:"data-value"},je={class:"data-desc"},Ze={class:"data-row"},Qe={class:"data-label"},Ke={class:"data-value"},Je={class:"data-desc"},ta={class:"data-row"},ea={class:"data-label"},aa={class:"data-value"},sa={class:"data-desc"},na={class:"sidebar-section"},ia={class:"data-row"},oa={class:"data-label"},ra={class:"data-value"},la={class:"data-desc"},ca={class:"data-row"},da={class:"data-label"},ha={class:"data-value"},ua={class:"data-desc"},ga={class:"data-row"},ma={class:"data-label"},pa={class:"data-value"},fa={class:"data-desc"},va={class:"data-row"},ya={class:"data-label"},xa={class:"data-value"},ba={class:"data-desc"},_a={class:"data-row"},Ma={class:"data-label"},wa={class:"data-value"},Sa={class:"data-desc"},za={class:"sidebar-section"},Ra={class:"data-row"},Ca={class:"data-label"},Da={class:"data-value"},ka={class:"data-desc"},Pa={class:"data-row"},Ta={class:"data-label"},Aa={class:"data-value"},Fa={class:"data-desc"},Ia={class:"data-row"},La={class:"data-label"},Ea={class:"data-value"},Ba={class:"data-desc"},Oa={class:"data-row"},Ga={class:"data-label"},Na={class:"data-value"},Ua={class:"data-desc"},Va={class:"data-row"},Ha={class:"data-label"},Wa={class:"data-value"},$a={class:"data-desc"},Xa={class:"data-row"},qa={class:"data-label"},Ya={class:"data-value"},ja={class:"data-desc"},Za={class:"sidebar-section"},Qa={class:"data-row"},Ka={class:"data-label"},Ja={class:"data-value"},ts={class:"data-desc"},es={key:0,class:"data-row"},as={class:"data-label"},ss={class:"data-value"},ns={class:"data-desc"},is={key:1,class:"data-row"},os={class:"data-label"},rs={class:"data-value"},ls={class:"data-desc"},cs={key:2,class:"data-row"},ds={class:"data-label"},hs={class:"data-value"},us={class:"data-desc"},gs={class:"data-row"},ms={class:"data-label"},ps={class:"data-value"},fs={class:"data-desc"},vs={class:"sidebar-section"},ys={class:"data-label"},xs={class:"data-value"},bs={class:"data-desc"},_s=et({__name:"GalaxyDataSidebar",props:{galaxy:{},show:{type:Boolean}},emits:["update:show"],setup(e){const{t}=mt(),n=e,o=O(()=>ft(n.galaxy.pgc,n.galaxy.morphology));function m(i){let g=i|0;return()=>{g=g+1831565813|0;let p=Math.imul(g^g>>>15,1|g);return p=p+Math.imul(p^p>>>7,61|p)^p,((p^p>>>14)>>>0)/4294967296}}const l=O(()=>{const i=m(n.galaxy.pgc);return vt(n.galaxy,o.value,i)}),u=O(()=>{switch(l.value.source){case"observed":return"Observed";case"mass":return"Mass";default:return"Estimated"}});function c(i,g){const p=i.toFixed(g);return i>=0?"+"+p:p}function h(i,g){if(i==null)return null;const p=i.toFixed(2);return g!=null?`${p} ± ${g.toFixed(2)}`:p}const a=O(()=>{const i=n.galaxy,g=[],p=[["dm_snia",i.dm_snia,i.e_dm_snia],["dm_tf",i.dm_tf,i.e_dm_tf],["dm_fp",i.dm_fp,i.e_dm_fp],["dm_sbf",i.dm_sbf,i.e_dm_sbf],["dm_snii",i.dm_snii,i.e_dm_snii],["dm_trgb",i.dm_trgb,i.e_dm_trgb],["dm_ceph",i.dm_ceph,i.e_dm_ceph],["dm_mas",i.dm_mas,i.e_dm_mas]];for(const[b,_,d]of p){const v=h(_,d);v&&g.push({key:b,value:v})}return g});return(i,g)=>(S(),K(Tt,{name:"slide-right"},{default:At(()=>[e.show?(S(),P("div",Ge,[s("div",Ne,[s("button",{class:"sidebar-close",onClick:g[0]||(g[0]=p=>i.$emit("update:show",!1))},"×"),s("h2",Ue,r(f(t)("pages.galaxy.sections.identity")),1),s("div",Ve,[s("div",He,r(f(t)("pages.galaxy.fields.pgc.label")),1),s("div",We,r(e.galaxy.pgc),1),s("div",$e,r(f(t)("pages.galaxy.fields.pgc.desc")),1)]),s("div",Xe,[s("div",qe,r(f(t)("pages.galaxy.fields.group_pgc.label")),1),s("div",Ye,r(e.galaxy.group_pgc??"—"),1),s("div",je,r(f(t)("pages.galaxy.fields.group_pgc.desc")),1)]),s("div",Ze,[s("div",Qe,r(f(t)("pages.galaxy.fields.t17.label")),1),s("div",Ke,r(e.galaxy.t17??"—"),1),s("div",Je,r(f(t)("pages.galaxy.fields.t17.desc")),1)]),s("div",ta,[s("div",ea,r(f(t)("pages.galaxy.fields.morphology.label")),1),s("div",aa,r(f(t)("morphology."+o.value)),1),s("div",sa,r(f(t)("pages.galaxy.fields.morphology.desc")),1)]),s("h2",na,r(f(t)("pages.galaxy.sections.distance")),1),s("div",ia,[s("div",oa,r(f(t)("pages.galaxy.fields.dm.label")),1),s("div",ra,r(e.galaxy.dm.toFixed(2))+" mag",1),s("div",la,r(f(t)("pages.galaxy.fields.dm.desc")),1)]),s("div",ca,[s("div",da,r(f(t)("pages.galaxy.fields.e_dm.label")),1),s("div",ha,r(e.galaxy.e_dm!=null?"± "+e.galaxy.e_dm.toFixed(2)+" mag":"—"),1),s("div",ua,r(f(t)("pages.galaxy.fields.e_dm.desc")),1)]),s("div",ga,[s("div",ma,r(f(t)("pages.galaxy.fields.distance_mpc.label")),1),s("div",pa,r(e.galaxy.distance_mpc.toFixed(1))+" Mpc",1),s("div",fa,r(f(t)("pages.galaxy.fields.distance_mpc.desc")),1)]),s("div",va,[s("div",ya,r(f(t)("pages.galaxy.fields.distance_mly.label")),1),s("div",xa,r(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly",1),s("div",ba,r(f(t)("pages.galaxy.fields.distance_mly.desc")),1)]),s("div",_a,[s("div",Ma,r(f(t)("pages.galaxy.fields.vcmb.label")),1),s("div",wa,r(e.galaxy.vcmb!=null?e.galaxy.vcmb.toLocaleString()+" km/s":"—"),1),s("div",Sa,r(f(t)("pages.galaxy.fields.vcmb.desc")),1)]),s("h2",za,r(f(t)("pages.galaxy.sections.coordinates")),1),s("div",Ra,[s("div",Ca,r(f(t)("pages.galaxy.fields.ra.label")),1),s("div",Da,r(e.galaxy.ra.toFixed(4))+"°",1),s("div",ka,r(f(t)("pages.galaxy.fields.ra.desc")),1)]),s("div",Pa,[s("div",Ta,r(f(t)("pages.galaxy.fields.dec.label")),1),s("div",Aa,r(c(e.galaxy.dec,4))+"°",1),s("div",Fa,r(f(t)("pages.galaxy.fields.dec.desc")),1)]),s("div",Ia,[s("div",La,r(f(t)("pages.galaxy.fields.glon.label")),1),s("div",Ea,r(e.galaxy.glon!=null?e.galaxy.glon.toFixed(4)+"°":"—"),1),s("div",Ba,r(f(t)("pages.galaxy.fields.glon.desc")),1)]),s("div",Oa,[s("div",Ga,r(f(t)("pages.galaxy.fields.glat.label")),1),s("div",Na,r(e.galaxy.glat!=null?c(e.galaxy.glat,4)+"°":"—"),1),s("div",Ua,r(f(t)("pages.galaxy.fields.glat.desc")),1)]),s("div",Va,[s("div",Ha,r(f(t)("pages.galaxy.fields.sgl.label")),1),s("div",Wa,r(e.galaxy.sgl!=null?e.galaxy.sgl.toFixed(3)+"°":"—"),1),s("div",$a,r(f(t)("pages.galaxy.fields.sgl.desc")),1)]),s("div",Xa,[s("div",qa,r(f(t)("pages.galaxy.fields.sgb.label")),1),s("div",Ya,r(e.galaxy.sgb!=null?c(e.galaxy.sgb,3)+"°":"—"),1),s("div",ja,r(f(t)("pages.galaxy.fields.sgb.desc")),1)]),s("h2",Za,r(f(t)("pages.galaxy.sections.physical")),1),s("div",Qa,[s("div",Ka,r(f(t)("pages.galaxy.fields.diameter_kpc.label")),1),s("div",Ja,r(l.value.diameterKpc.toFixed(1))+" kpc ("+r((l.value.diameterKpc*3.26).toFixed(1))+" kly)",1),s("div",ts,r(f(t)("pages.galaxy.fields.diameter_kpc.desc")),1)]),e.galaxy.diameter_arcsec!=null?(S(),P("div",es,[s("div",as,r(f(t)("pages.galaxy.fields.diameter_arcsec.label")),1),s("div",ss,r(e.galaxy.diameter_arcsec)+"″",1),s("div",ns,r(f(t)("pages.galaxy.fields.diameter_arcsec.desc")),1)])):A("",!0),(e.galaxy.axial_ratio??e.galaxy.ba)!=null?(S(),P("div",is,[s("div",os,r(e.galaxy.axial_ratio!=null?f(t)("pages.galaxy.fields.axial_ratio.label"):f(t)("pages.galaxy.fields.ba.label")),1),s("div",rs,r((e.galaxy.axial_ratio??e.galaxy.ba).toFixed(3)),1),s("div",ls,r(e.galaxy.axial_ratio!=null?f(t)("pages.galaxy.fields.axial_ratio.desc"):f(t)("pages.galaxy.fields.ba.desc")),1)])):A("",!0),e.galaxy.log_ms_t!=null?(S(),P("div",cs,[s("div",ds,r(f(t)("pages.galaxy.fields.log_ms_t.label")),1),s("div",hs,r(e.galaxy.log_ms_t.toFixed(2))+" log M☉",1),s("div",us,r(f(t)("pages.galaxy.fields.log_ms_t.desc")),1)])):A("",!0),s("div",gs,[s("div",ms,r(f(t)("pages.galaxy.fields.size_method.label")),1),s("div",ps,r(f(t)("pages.galaxy.size"+u.value)),1),s("div",fs,r(f(t)("pages.galaxy.fields.size_method.desc")),1)]),a.value.length>0?(S(),P(ut,{key:3},[s("h2",vs,r(f(t)("pages.galaxy.sections.methods")),1),(S(!0),P(ut,null,St(a.value,p=>(S(),P("div",{key:p.key,class:"data-row"},[s("div",ys,r(f(t)("pages.galaxy.fields."+p.key+".label")),1),s("div",xs,r(p.value),1),s("div",bs,r(f(t)("pages.galaxy.fields."+p.key+".desc")),1)]))),128))],64)):A("",!0)])])):A("",!0)]),_:1}))}}),Ms=at(_s,[["__scopeId","data-v-4a15eb95"]]),ws={class:"w-full h-full"},Ss={class:"top-header"},zs={class:"top-buttons"},Rs={key:0,class:"galaxy-title"},Cs={key:3,class:"not-found"},Ds=et({__name:"GalaxyView",setup(e){const{t}=mt(),n=Ft(),{ready:o,isLoading:m,getGalaxyByPgc:l}=qt(),u=ht(null),c=ht(!1);return wt(async()=>{await o,u.value=l(Number(n.params.pgc))}),(h,a)=>(S(),P("div",ws,[u.value?(S(),K(Me,{key:0,galaxy:u.value},null,8,["galaxy"])):A("",!0),u.value?(S(),K(Oe,{key:1,galaxy:u.value},null,8,["galaxy"])):A("",!0),s("div",Ss,[s("div",zs,[s("button",{class:"data-button",onClick:a[0]||(a[0]=i=>c.value=!c.value)},r(f(t)("pages.galaxy.dataButton")),1)]),u.value?(S(),P("div",Rs,"PGC "+r(u.value.pgc),1)):A("",!0)]),u.value?(S(),K(Ms,{key:2,galaxy:u.value,show:c.value,"onUpdate:show":a[1]||(a[1]=i=>c.value=i)},null,8,["galaxy","show"])):A("",!0),!u.value&&!f(m)?(S(),P("div",Cs,"Galaxy not found")):A("",!0)]))}}),As=at(Ds,[["__scopeId","data-v-4d884fe1"]]);export{As as default};
