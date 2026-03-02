import{d as et,o as wt,a as Tt,c as P,r as ht,b as S,e as mt,f as s,t as r,h as f,l as V,i as A,F as ut,j as St,s as O,y as K,T as At,w as zt,g as Ft,z as It,k as Lt}from"./index-BgOoul0s.js";import{B as Et,c as dt,a as at,A as pt,b as Bt,g as Ot,h as st,i as Rt,D as kt,M as Z,j as Nt,R as Gt,U as Ut,L as tt,k as yt,f as xt,d as Vt,N as Ht,l as gt,C as Wt,V as j,Q as J,W as $t,S as bt,P as Xt,m as qt,O as Yt}from"./three.module-CcW3xBYB.js";import{a as ft,e as vt,u as jt}from"./galaxy-DZ1kc9Ju.js";import{_ as nt}from"./_plugin-vue_export-helper-DlAUqK2U.js";function w(e,t,n){return e+(t-e)*n}function Y(e,t,n){return Math.max(t,Math.min(n,e))}function Zt(e){let t=e|0;return()=>{t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Qt(e,t){switch(e){case"elliptical":return{type:"elliptical",hubbleStage:0,eNumber:Math.round(t()*7),barStrength:null,ringType:null};case"lenticular":return{type:"lenticular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};case"barred":return{type:"barred",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:t()>.5?"strong":"weak",ringType:null};case"irregular":return{type:"irregular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};default:return{type:"spiral",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:null,ringType:null}}}function Kt(e){const t=Zt(e.pgc),n=ft(e.pgc,e.morphology),{diameterKpc:i,source:m}=vt(e,n,t),l=Y(i*12,30,2400);let g;if(e.log_ms_t!=null&&e.log_ms_t>10.8){const a=Math.pow(10,.15*(e.log_ms_t-10.8));g=Y(Math.round(6e4*a),6e4,12e4)}else g=Y(Math.round(6e4*(.7+t()*.6)),42e3,78e3);const c={starCount:g,galaxyRadius:l,diameterKpc:i,sizeSource:m},h=Qt(n,t);switch(h.type){case"spiral":{const a=Y((h.hubbleStage-1)/8,0,1);return{...c,type:"spiral",numArms:h.hubbleStage<=2?2:h.hubbleStage<=5?Math.round(w(2,4,t())):Math.round(w(2,6,t())),armWidth:l*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:l*w(.35,.05,a),irregularity:w(0,.3,a)}}case"barred":{const a=Y((h.hubbleStage-1)/8,0,1),o=h.barStrength==="strong",u=t();return{...c,type:"barred",numArms:h.hubbleStage<=2?2:Math.round(w(2,4,t())),armWidth:l*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:l*w(.35,.05,a),barLength:l*(o?w(.3,.6,u):w(.15,.3,u)),barWidth:l*w(.05,.12,t()),irregularity:w(0,.3,a)}}case"elliptical":{const a=e.axial_ratio??e.ba,o=a??1-(h.eNumber??3)/10;return{...c,type:"elliptical",ellipticity:1-o,axisRatio:o}}case"lenticular":return{...c,type:"lenticular",bulgeRadius:l*w(.3,.5,t()),bulgeFraction:w(.4,.7,t()),diskThickness:w(.05,.15,t())};case"irregular":return{...c,type:"irregular",irregularity:w(.5,1,t()),clumpCount:Math.round(w(3,12,t()))}}}const z=Math.PI*2,F={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,hiiHueRange:[320,340],fieldHueRange:[10,30],dustHueRange:[240,280],hiiRegionChance:.15}},_t=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function I(e){const t=F.visual.dustFraction,n=F.visual.brightFraction;return e<t?"dust":e>1-n?"bright":"star"}function L(e){switch(e){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function B(e,t,n){const i=F.visual;if(n)return i.hiiHueRange[0]+Math.random()*(i.hiiHueRange[1]-i.hiiHueRange[0]);if(e==="dust")return i.dustHueRange[0]+Math.random()*(i.dustHueRange[1]-i.dustHueRange[0]);const m=Math.pow(t,.6);let l=0;for(const c of _t)l+=c.wInner*(1-m)+c.wOuter*m;let g=Math.random()*l;for(const c of _t)if(g-=c.wInner*(1-m)+c.wOuter*m,g<=0)return c.hue+(Math.random()-.5)*c.spread;return 42}function E(e){const{baseSpeed:t,falloff:n,referenceRadius:i}=F.rotation;return t/Math.pow(Math.max(e,i)/i,n)}function Jt(e){return e.galaxyRadius*.06}function te(e,t){const n=Jt(t);return e.filter(i=>i.radius>=n)}function Ct(e){const t=Math.random()*z,n=Math.sqrt(Math.random())*e,i=(Math.random()-.5)*e*.08,m=I(Math.random()),l=L(m);return{radius:n,angle:t,y:i,rotationSpeed:E(n),hue:F.visual.fieldHueRange[0]+Math.random()*(F.visual.fieldHueRange[1]-F.visual.fieldHueRange[0]),brightness:l.brightness,size:l.size,alpha:l.alpha,layer:m,twinklePhase:Math.random()*z}}function ee(e){const t=[],n=e.numArms||2,i=e.starCount||15e3,m=Math.floor(i*(1-(e.fieldStarFraction||.15))),l=Math.floor(m/n),g=e.galaxyRadius||350,c=e.armWidth||40,h=e.spiralTightness||.25,a=(e.spiralStart||.086)*g,o=e.irregularity||0,u=F.visual.hiiRegionChance,p=10;for(let d=0;d<n;d++){const v=d/n*z,y=new Set;for(let x=0;x<p;x++)Math.random()<u&&y.add(x);for(let x=0;x<l;x++){const M=x/l,R=M*z*2.5,k=a*Math.exp(h*R);if(k>g)continue;const C=R+v,D=(Math.random()-.5+Math.random()-.5)*c,T=C+Math.PI/2,H=(Math.random()-.5)*20,W=o*(Math.random()-.5)*30,N=Math.cos(C)*(k+H+W)+Math.cos(T)*D,G=Math.sin(C)*(k+H+W)+Math.sin(T)*D,$=g*F.visual.diskThicknessRatio*(1-M*.7),it=(Math.random()-.5)*$,X=Math.sqrt(N*N+G*G),q=Math.atan2(G,N),ot=X/g,rt=E(X),U=I(Math.random()),lt=Math.floor(M*p),Dt=y.has(lt)&&Math.random()<.4,ct=L(U),Pt=B(U,ot,Dt);t.push({radius:X,angle:q,y:it,rotationSpeed:rt,hue:Pt,brightness:ct.brightness,size:ct.size,alpha:ct.alpha,layer:U,twinklePhase:Math.random()*z})}}const b=e.bulgeRadius||0;if(b>0){const d=Math.min(.25,.1+.2*(b/g)),v=Math.floor(i*d);for(let y=0;y<v;y++){const x=Math.pow(Math.random(),.6)*b,M=Math.random()*z,R=(Math.random()-.5)*b*.5,k=x/b,C=1+(1-k)*.5,D=I(Math.random()),T=L(D);t.push({radius:x,angle:M,y:R,rotationSpeed:E(x)*.5,hue:B(D,.1,!1),brightness:Math.min(T.brightness*C,.95),size:T.size*(1+(1-k)*.3),alpha:Math.min(T.alpha*C,.95),layer:D,twinklePhase:Math.random()*z})}}const _=Math.floor(i*(e.fieldStarFraction||.15));for(let d=0;d<_;d++)t.push(Ct(g));return t}function ae(e){const t=[],n=e.numArms||2,i=e.galaxyRadius||350,m=e.barLength||120,l=e.barWidth||25,g=e.armWidth||45,c=e.spiralTightness||.28,h=(e.spiralStart||.143)*i,a=e.starCount||16e3,o=F.visual.hiiRegionChance,u=10,p=Math.floor(a*.25);for(let d=0;d<p;d++){const v=(Math.random()-.5)*2*m,y=(Math.random()-.5)*l,x=v,M=y,R=Math.sqrt(x*x+M*M);if(R>i)continue;const k=Math.atan2(M,x),C=I(Math.random()),D=L(C),T=B(C,.1,!1);t.push({radius:R,angle:k,y:(Math.random()-.5)*i*.04,rotationSpeed:E(R),hue:T,brightness:D.brightness,size:D.size,alpha:D.alpha,layer:C,twinklePhase:Math.random()*z})}for(let d=0;d<n;d++){const v=d/n*z,y=Math.floor((a-p)*.9/n),x=new Set;for(let M=0;M<u;M++)Math.random()<o&&x.add(M);for(let M=0;M<y;M++){const R=M/y,k=R*z*2.5,C=h*Math.exp(c*k);if(C>i||C<m*.5)continue;const D=k+v,T=(Math.random()-.5+Math.random()-.5)*g,H=D+Math.PI/2,W=(Math.random()-.5)*20,N=Math.cos(D)*(C+W)+Math.cos(H)*T,G=Math.sin(D)*(C+W)+Math.sin(H)*T,$=Math.sqrt(N*N+G*G),it=Math.atan2(G,N),X=$/i,q=I(Math.random()),ot=Math.floor(R*u),rt=x.has(ot)&&Math.random()<.4,U=L(q),lt=B(q,X,rt);t.push({radius:$,angle:it,y:(Math.random()-.5)*i*F.visual.diskThicknessRatio*(1-R*.7),rotationSpeed:E($),hue:lt,brightness:U.brightness,size:U.size,alpha:U.alpha,layer:q,twinklePhase:Math.random()*z})}}const b=e.bulgeRadius||0;if(b>0){const d=Math.min(.2,.08+.18*(b/i)),v=Math.floor(a*d);for(let y=0;y<v;y++){const x=Math.pow(Math.random(),.6)*b,M=Math.random()*z,R=(Math.random()-.5)*b*.5,k=x/b,C=1+(1-k)*.5,D=I(Math.random()),T=L(D);t.push({radius:x,angle:M,y:R,rotationSpeed:E(x)*.5,hue:B(D,.1,!1),brightness:Math.min(T.brightness*C,.95),size:T.size*(1+(1-k)*.3),alpha:Math.min(T.alpha*C,.95),layer:D,twinklePhase:Math.random()*z})}}const _=Math.floor((a-p)*.1);for(let d=0;d<_;d++)t.push(Ct(i));return t}function se(e){const t=[],n=e.galaxyRadius||300,i=e.bulgeRadius||80,m=e.bulgeFraction||.4,l=n*F.visual.diskThicknessRatio*.5,g=e.starCount||28e3,c=Math.floor(g*m);for(let o=0;o<c;o++){const u=Math.pow(Math.random(),.6)*i,p=Math.random()*z,b=(Math.random()-.5)*i*.6,_=u/i,d=1+(1-_)*.5,v=I(Math.random()),y=L(v);t.push({radius:u,angle:p,y:b,rotationSpeed:E(u)*.5,hue:B(v,.1,!1),brightness:Math.min(y.brightness*d,.95),size:y.size*(1+(1-_)*.3),alpha:Math.min(y.alpha*d,.95),layer:v,twinklePhase:Math.random()*z})}const h=g-c,a=n/3;for(let o=0;o<h;o++){const u=Math.random(),p=-Math.log(1-u*.95)*a;if(p>n){o--;continue}const b=Math.random()*z,_=p/n,d=(Math.random()-.5)*l*(1-_*.5),v=I(Math.random()),y=L(v);t.push({radius:p,angle:b,y:d,rotationSpeed:E(p),hue:B(v,_*.3,!1),brightness:y.brightness,size:y.size,alpha:y.alpha,layer:v,twinklePhase:Math.random()*z})}return t}function ne(e){const t=[],n=e.galaxyRadius||320,i=e.axisRatio||.7,m=e.starCount||12e3;for(let l=0;l<m;l++){const g=Math.random(),c=Math.random(),h=Math.pow(g,.4)*n,a=c*z,o=h*Math.cos(a),u=h*Math.sin(a)*i,p=Math.sqrt(o*o+u*u),b=Math.atan2(u,o),_=p/n,d=I(Math.random()),v=L(d),y=B(d,_,!1);t.push({radius:p,angle:b,y:(Math.random()-.5)*n*.1*(1-_*.5),rotationSpeed:E(p)*.3,hue:y,brightness:v.brightness,size:v.size,alpha:v.alpha,layer:d,twinklePhase:Math.random()*z})}return t}function ie(e){const t=[],n=e.galaxyRadius||280,i=e.irregularity||.8,m=e.clumpCount||5,l=[];for(let c=0;c<m;c++){const h=c/m*z+Math.random()*.5,a=(.2+Math.random()*.6)*n;l.push({x:Math.cos(h)*a,z:Math.sin(h)*a,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<F.visual.hiiRegionChance})}const g=e.starCount||1e4;for(let c=0;c<g;c++){let h,a,o=!1;if(Math.random()<1-i){const y=Math.floor(Math.random()*m),x=l[y],M=()=>(Math.random()-.5+Math.random()-.5)*2;h=x.x+M()*x.sigma,a=x.z+M()*x.sigma,o=x.isHII&&Math.random()<.4}else{const y=Math.random()*z,x=Math.sqrt(Math.random())*n;h=Math.cos(y)*x+(Math.random()-.5)*60,a=Math.sin(y)*x+(Math.random()-.5)*60}const u=Math.sqrt(h*h+a*a);if(u>n*1.1)continue;const p=Math.atan2(a,h),b=u/n,_=I(Math.random()),d=L(_),v=B(_,b,o);t.push({radius:u,angle:p,y:(Math.random()-.5)*n*.12,rotationSpeed:E(u)*(.5+Math.random()*.5),hue:v,brightness:d.brightness,size:d.size,alpha:d.alpha,layer:_,twinklePhase:Math.random()*z})}return t}function oe(e){let t;switch(e.type){case"spiral":t=ee(e);break;case"barred":t=ae(e);break;case"lenticular":t=se(e);break;case"elliptical":t=ne(e);break;case"irregular":t=ie(e);break}return te(t,e)}const re=`attribute float aSize;
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
`,le=`precision highp float;

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
`;function ce(e,t,n){e/=360;const i=t*Math.min(n,1-n),m=l=>{const g=(l+e*12)%12;return n-i*Math.max(Math.min(g-3,9-g,1),-1)};return[m(0),m(8),m(4)]}function de(e){switch(e){case"dust":return .3;case"star":return .65;case"bright":return .5}}function he(e,t){switch(e){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class ue{constructor(t,n=600){this.stars=t;const i=t.length,m=new Float32Array(i*3),l=new Float32Array(i*4),g=new Float32Array(i);this.angleOffsets=new Float32Array(i),this.baseAlphas=new Float32Array(i);for(let c=0;c<i;c++){const h=t[c],a=h.radius*Math.cos(h.angle),o=h.radius*Math.sin(h.angle);m[c*3]=a,m[c*3+1]=h.y,m[c*3+2]=o;const u=de(h.layer),p=he(h.layer,h.brightness),[b,_,d]=ce(h.hue,u,p);l[c*4]=b,l[c*4+1]=_,l[c*4+2]=d,l[c*4+3]=h.alpha,g[c]=h.size,this.angleOffsets[c]=h.angle,this.baseAlphas[c]=h.alpha}this.geometry=new Et,this.geometry.setAttribute("position",new dt(m,3)),this.geometry.setAttribute("aColor",new dt(l,4)),this.geometry.setAttribute("aSize",new dt(g,1)),this.material=new at({vertexShader:re,fragmentShader:le,uniforms:{uPixelRatio:{value:window.devicePixelRatio},uBaseDistance:{value:n}},transparent:!0,depthWrite:!1,blending:pt}),this.points=new Bt(this.geometry,this.material)}update(t,n){const i=this.stars,m=i.length,l=this.geometry.getAttribute("position"),g=this.geometry.getAttribute("aColor"),c=l.array,h=g.array;for(let a=0;a<m;a++){const o=i[a];this.angleOffsets[a]+=o.rotationSpeed*t;const u=this.angleOffsets[a];if(c[a*3]=o.radius*Math.cos(u),c[a*3+2]=o.radius*Math.sin(u),o.layer==="bright"){const p=Math.sin(n*2+o.twinklePhase)*.15+.85;h[a*4+3]=this.baseAlphas[a]*p}}l.needsUpdate=!0,g.needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}class ge{constructor(t){const i=document.createElement("canvas");i.width=512,i.height=512;const m=i.getContext("2d"),l=512/2,g=512/2,c=m.createRadialGradient(l,g,0,l,g,l*.3);c.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),c.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),c.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),c.addColorStop(1,"hsla(20, 50%, 30%, 0)"),m.fillStyle=c,m.fillRect(0,0,512,512);const h=m.createRadialGradient(l,g,0,l,g,l*.7);h.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),h.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),h.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),h.addColorStop(1,"hsla(0, 0%, 0%, 0)"),m.fillStyle=h,m.fillRect(0,0,512,512);const a=m.createRadialGradient(l,g,0,l,g,l);a.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),a.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),a.addColorStop(1,"hsla(0, 0%, 0%, 0)"),m.fillStyle=a,m.fillRect(0,0,512,512);const o=new Ot(i);o.needsUpdate=!0;const u=t*3,p=new st(u,u);this.material=new Rt({map:o,transparent:!0,depthWrite:!1,blending:pt,side:kt}),this.mesh=new Z(p,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const me=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,pe=`precision highp float;

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
`;class fe{constructor(t,n,i){const l=new Float32Array(65536),g=n*1.3;for(let u=0;u<t.length;u++){const p=t[u],b=Math.cos(p.angle)*p.radius,_=Math.sin(p.angle)*p.radius,d=Math.floor((b/g*.5+.5)*255),v=Math.floor((_/g*.5+.5)*255);d>=0&&d<256&&v>=0&&v<256&&(l[v*256+d]+=1)}const c=new Float32Array(256*256);for(let u=0;u<3;u++){const p=u%2===0?l:c,b=u%2===0?c:l;for(let _=0;_<256;_++)for(let d=0;d<256;d++){let v=0,y=0;for(let x=-2;x<=2;x++)for(let M=-2;M<=2;M++){const R=d+M,k=_+x;R>=0&&R<256&&k>=0&&k<256&&(v+=p[k*256+R],y++)}b[_*256+d]=v/y}}l.set(c);let h=0;for(let u=0;u<l.length;u++)l[u]>h&&(h=l[u]);const a=new Uint8Array(256*256);if(h>0)for(let u=0;u<l.length;u++)a[u]=Math.min(255,Math.floor(l[u]/h*255));this.densityTexture=new Nt(a,256,256,Gt,Ut),this.densityTexture.minFilter=tt,this.densityTexture.magFilter=tt,this.densityTexture.wrapS=yt,this.densityTexture.wrapT=yt,this.densityTexture.needsUpdate=!0;const o=new st(2,2);this.material=new at({vertexShader:me,fragmentShader:pe,uniforms:{uInvViewProj:{value:new xt},uTime:{value:0},uGalaxyRadius:{value:n},uSeed:{value:i},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:pt}),this.mesh=new Z(o,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,n,i,m,l){const g=this.material.uniforms;g.uTime.value=t,g.uGalaxyRotation.value=i,g.uGalaxyRadius.value=m,g.uAxisRatio.value=l;const c=new xt;c.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),g.uInvViewProj.value.copy(c).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ve=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ye=`precision highp float;

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
`;class xe{constructor(t,n=60){this.quadSize=n;const i=new Vt(1,4,4),m=new Rt({visible:!1});this.depthMesh=new Z(i,m),this.depthMesh.layers.set(2),this.material=new at({vertexShader:ve,fragmentShader:ye,uniforms:{uResolution:{value:new gt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Ht,side:kt}),this.mesh=new Z(new st(1,1),this.material),this.mesh.scale.set(n,n,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,n,i,m,l){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=n,this.material.uniforms.uRotY.value=i,l){const g=l.getSize(new gt),c=l.getPixelRatio();this.material.uniforms.uResolution.value.set(g.x*c,g.y*c)}if(m){this.mesh.quaternion.copy(m.quaternion);const g=m.position.length(),h=(m.fov??60)*Math.PI/180,a=this.material.uniforms.uResolution.value.y,o=this.quadSize/g*(a/(2*Math.tan(h/2))),u=Math.min(Math.max((o-6)/220,0),1);this.material.uniforms.uLOD.value=u}}getLOD(){return this.material.uniforms.uLOD.value}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const be=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,_e=`precision highp float;

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
`,Mt=new j(0,1,0),Q=new J;class Me{constructor(t,n){this.animationId=0,this.clock=new Wt,this.galaxyRotation=0,this._bhScreenVec=new j,this.orbitQuat=new J,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new $t({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new bt,this.renderer.setClearColor(0,1),this.params=Kt(n);const i=oe(this.params),m=this.params.galaxyRadius;this.baseDistance=m*1.7;const l=t.clientWidth/t.clientHeight;this.camera=new Xt(60,l,.1,this.baseDistance*20),this.particles=new ue(i,this.baseDistance),this.scene.add(this.particles.points),this.haze=new ge(m),this.scene.add(this.haze.mesh),this.nebula=new fe(i,m,n.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new xe(null,m*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.particles.points.layers.set(1),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const g=t.clientWidth,c=t.clientHeight;this.galaxyRT=new qt(g*window.devicePixelRatio,c*window.devicePixelRatio,{minFilter:tt,magFilter:tt}),this.lensingMaterial=new at({vertexShader:be,fragmentShader:_e,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new gt(.5,.5)},uLensStrength:{value:0},uAspectRatio:{value:g/c}},depthTest:!1,depthWrite:!1});const h=new Z(new st(2,2),this.lensingMaterial);this.lensingScene=new bt,this.lensingScene.add(h),this.lensingCamera=new Yt(-1,1,1,-1,0,1);const o=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=o,this.targetZoom=o;const u=(n.pgc*2654435761>>>0)/4294967296*Math.PI*2,b=new J().setFromAxisAngle(new j(1,0,0),-.45),_=new J().setFromAxisAngle(Mt,u);this.orbitQuat.multiplyQuaternions(b,_),this.onPointerDown=d=>{this.isPinching||(this.isDragging=!0,this.lastX=d.clientX,this.lastY=d.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=d=>{if(this.isPinching||!this.isDragging)return;const v=d.clientX-this.lastX,y=d.clientY-this.lastY;this.velocityX=v*.005,this.velocityY=y*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=d.clientX,this.lastY=d.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=d=>{d.preventDefault();const v=this.targetZoom*.12;this.targetZoom+=d.deltaY>0?-v:v,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=d=>{if(d.touches.length===2){d.preventDefault(),this.isPinching=!0,this.isDragging=!1;const v=d.touches[0].clientX-d.touches[1].clientX,y=d.touches[0].clientY-d.touches[1].clientY;this.lastPinchDist=Math.sqrt(v*v+y*y)}},this.onTouchMove=d=>{if(d.touches.length===2){d.preventDefault();const v=d.touches[0].clientX-d.touches[1].clientX,y=d.touches[0].clientY-d.touches[1].clientY,x=Math.sqrt(v*v+y*y),M=(x-this.lastPinchDist)*.01;this.lastPinchDist=x,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+M))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const d=t.clientWidth,v=t.clientHeight;if(d===0||v===0)return;this.renderer.setSize(d,v,!1),this.camera.aspect=d/v,this.camera.updateProjectionMatrix();const y=this.renderer.getPixelRatio();this.galaxyRT.setSize(d*y,v*y),this.lensingMaterial.uniforms.uAspectRatio.value=d/v}),this.resizeObserver.observe(t)}applyOrbitDelta(t,n){Q.setFromAxisAngle(Mt,-t),this.orbitQuat.premultiply(Q);const i=new j(1,0,0).applyQuaternion(this.orbitQuat);Q.setFromAxisAngle(i,-n),this.orbitQuat.premultiply(Q),this.orbitQuat.normalize()}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const n=this.clock.getDelta(),i=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const m=this.baseDistance/this.zoom,l=new j(0,0,m).applyQuaternion(this.orbitQuat);this.camera.position.copy(l),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const g=Math.min(this.zoom/20,1),c=.02+.18*g*g;this.galaxyRotation+=n*c,this.particles.update(n,i);const h=this.params.type==="elliptical"?this.params.axisRatio:1;this.nebula.update(i,this.camera,this.galaxyRotation,this.params.galaxyRadius,h);const a=this.camera.position,o=Math.sqrt(a.x*a.x+a.z*a.z),u=Math.atan2(a.y,o),p=Math.atan2(a.x,a.z);this.blackHole.update(i,u,p,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const b=this._bhScreenVec.x*.5+.5,_=this._bhScreenVec.y*.5+.5,d=this.blackHole.getLOD(),v=d*d*.03;v<.001?(this.camera.layers.enableAll(),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)):(this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(b,_),this.lensingMaterial.uniforms.uLensStrength.value=v,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera),this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0)};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}const we=et({__name:"GalaxyDetail",props:{galaxy:{}},setup(e){const t=e,n=ht(null);let i=null;return wt(()=>{n.value&&(i=new Me(n.value,t.galaxy),i.start())}),Tt(()=>{i==null||i.dispose(),i=null}),(m,l)=>(S(),P("canvas",{ref_key:"canvasRef",ref:n,class:"galaxy-detail-canvas"},null,512))}}),Se=nt(we,[["__scopeId","data-v-787b8f20"]]),ze={class:"galaxy-info-card"},Re={class:"info-row"},ke={class:"info-label"},Ce={key:0,class:"procedural-mark",title:"Procedurally assigned"},De={class:"info-row"},Pe={class:"info-row"},Te={class:"info-label"},Ae={class:"size-source"},Fe={key:0,class:"info-row"},Ie={class:"info-row"},Le={key:0},Ee={key:1,class:"info-row info-methods"},Be={class:"method-list"},Oe=["title"],Ne=et({__name:"GalaxyInfoCard",props:{galaxy:{}},setup(e){const{t}=mt(),n=e,i=O(()=>ft(n.galaxy.pgc,n.galaxy.morphology));function m(h){let a=h|0;return()=>{a=a+1831565813|0;let o=Math.imul(a^a>>>15,1|a);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}const l=O(()=>{const h=m(n.galaxy.pgc);return vt(n.galaxy,i.value,h)}),g=O(()=>{switch(l.value.source){case"observed":return"Observed";case"mass":return"Mass";default:return"Estimated"}}),c=O(()=>{const h=n.galaxy,a=[];return h.dm_snia!=null&&a.push({key:"snia",abbr:"SNIa"}),h.dm_tf!=null&&a.push({key:"tf",abbr:"TF"}),h.dm_fp!=null&&a.push({key:"fp",abbr:"FP"}),h.dm_sbf!=null&&a.push({key:"sbf",abbr:"SBF"}),h.dm_snii!=null&&a.push({key:"snii",abbr:"SNII"}),h.dm_trgb!=null&&a.push({key:"trgb",abbr:"TRGB"}),h.dm_ceph!=null&&a.push({key:"ceph",abbr:"Ceph"}),h.dm_mas!=null&&a.push({key:"mas",abbr:"Mas"}),a});return(h,a)=>(S(),P("div",ze,[s("div",Re,[s("span",ke,r(f(t)("pages.galaxy.fields.morphology.label")),1),V(" "+r(f(t)("morphology."+i.value)),1),e.galaxy.morphology?A("",!0):(S(),P("sup",Ce,"p"))]),s("div",De,[a[0]||(a[0]=s("span",{class:"info-label"},"Distance",-1)),V(" "+r(e.galaxy.distance_mpc.toFixed(1))+" Mpc ("+r(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly) ",1)]),s("div",Pe,[s("span",Te,r(f(t)("pages.galaxy.size")),1),V(" "+r(l.value.diameterKpc.toFixed(1))+" kpc ("+r((l.value.diameterKpc*3.26).toFixed(1))+" kly) ",1),s("span",Ae,r(f(t)("pages.galaxy.size"+g.value)),1)]),e.galaxy.vcmb!=null?(S(),P("div",Fe,[a[1]||(a[1]=s("span",{class:"info-label"},"CMB Velocity",-1)),V(" "+r(e.galaxy.vcmb.toLocaleString())+" km/s ",1)])):A("",!0),s("div",Ie,[a[2]||(a[2]=s("span",{class:"info-label"},"DM",-1)),V(" "+r(e.galaxy.dm.toFixed(2)),1),e.galaxy.e_dm!=null?(S(),P("span",Le," ± "+r(e.galaxy.e_dm.toFixed(2)),1)):A("",!0)]),c.value.length>0?(S(),P("div",Ee,[a[3]||(a[3]=s("span",{class:"info-label"},"Methods",-1)),s("span",Be,[(S(!0),P(ut,null,St(c.value,o=>(S(),P("span",{key:o.abbr,class:"method-tag",title:f(t)(`pages.about.data.methods.${o.key}.desc`)},r(o.abbr),9,Oe))),128))])])):A("",!0)]))}}),Ge=nt(Ne,[["__scopeId","data-v-ff24cf8b"]]),Ue={key:0,class:"data-sidebar"},Ve={class:"sidebar-scroll"},He={class:"sidebar-title"},We={class:"data-row"},$e={class:"data-label"},Xe={class:"data-value"},qe={class:"data-desc"},Ye={class:"data-row"},je={class:"data-label"},Ze={class:"data-value"},Qe={class:"data-desc"},Ke={class:"data-row"},Je={class:"data-label"},ta={class:"data-value"},ea={class:"data-desc"},aa={class:"data-row"},sa={class:"data-label"},na={class:"data-value"},ia={class:"data-desc"},oa={class:"sidebar-section"},ra={class:"data-row"},la={class:"data-label"},ca={class:"data-value"},da={class:"data-desc"},ha={class:"data-row"},ua={class:"data-label"},ga={class:"data-value"},ma={class:"data-desc"},pa={class:"data-row"},fa={class:"data-label"},va={class:"data-value"},ya={class:"data-desc"},xa={class:"data-row"},ba={class:"data-label"},_a={class:"data-value"},Ma={class:"data-desc"},wa={class:"data-row"},Sa={class:"data-label"},za={class:"data-value"},Ra={class:"data-desc"},ka={class:"sidebar-section"},Ca={class:"data-row"},Da={class:"data-label"},Pa={class:"data-value"},Ta={class:"data-desc"},Aa={class:"data-row"},Fa={class:"data-label"},Ia={class:"data-value"},La={class:"data-desc"},Ea={class:"data-row"},Ba={class:"data-label"},Oa={class:"data-value"},Na={class:"data-desc"},Ga={class:"data-row"},Ua={class:"data-label"},Va={class:"data-value"},Ha={class:"data-desc"},Wa={class:"data-row"},$a={class:"data-label"},Xa={class:"data-value"},qa={class:"data-desc"},Ya={class:"data-row"},ja={class:"data-label"},Za={class:"data-value"},Qa={class:"data-desc"},Ka={class:"sidebar-section"},Ja={class:"data-row"},ts={class:"data-label"},es={class:"data-value"},as={class:"data-desc"},ss={key:0,class:"data-row"},ns={class:"data-label"},is={class:"data-value"},os={class:"data-desc"},rs={key:1,class:"data-row"},ls={class:"data-label"},cs={class:"data-value"},ds={class:"data-desc"},hs={key:2,class:"data-row"},us={class:"data-label"},gs={class:"data-value"},ms={class:"data-desc"},ps={class:"data-row"},fs={class:"data-label"},vs={class:"data-value"},ys={class:"data-desc"},xs={class:"sidebar-section"},bs={class:"data-label"},_s={class:"data-value"},Ms={class:"data-desc"},ws=et({__name:"GalaxyDataSidebar",props:{galaxy:{},show:{type:Boolean}},emits:["update:show"],setup(e){const{t}=mt(),n=e,i=O(()=>ft(n.galaxy.pgc,n.galaxy.morphology));function m(o){let u=o|0;return()=>{u=u+1831565813|0;let p=Math.imul(u^u>>>15,1|u);return p=p+Math.imul(p^p>>>7,61|p)^p,((p^p>>>14)>>>0)/4294967296}}const l=O(()=>{const o=m(n.galaxy.pgc);return vt(n.galaxy,i.value,o)}),g=O(()=>{switch(l.value.source){case"observed":return"Observed";case"mass":return"Mass";default:return"Estimated"}});function c(o,u){const p=o.toFixed(u);return o>=0?"+"+p:p}function h(o,u){if(o==null)return null;const p=o.toFixed(2);return u!=null?`${p} ± ${u.toFixed(2)}`:p}const a=O(()=>{const o=n.galaxy,u=[],p=[["dm_snia",o.dm_snia,o.e_dm_snia],["dm_tf",o.dm_tf,o.e_dm_tf],["dm_fp",o.dm_fp,o.e_dm_fp],["dm_sbf",o.dm_sbf,o.e_dm_sbf],["dm_snii",o.dm_snii,o.e_dm_snii],["dm_trgb",o.dm_trgb,o.e_dm_trgb],["dm_ceph",o.dm_ceph,o.e_dm_ceph],["dm_mas",o.dm_mas,o.e_dm_mas]];for(const[b,_,d]of p){const v=h(_,d);v&&u.push({key:b,value:v})}return u});return(o,u)=>(S(),K(At,{name:"slide-right"},{default:zt(()=>[e.show?(S(),P("div",Ue,[s("div",Ve,[s("button",{class:"sidebar-close",onClick:u[0]||(u[0]=p=>o.$emit("update:show",!1))},"×"),s("h2",He,r(f(t)("pages.galaxy.sections.identity")),1),s("div",We,[s("div",$e,r(f(t)("pages.galaxy.fields.pgc.label")),1),s("div",Xe,r(e.galaxy.pgc),1),s("div",qe,r(f(t)("pages.galaxy.fields.pgc.desc")),1)]),s("div",Ye,[s("div",je,r(f(t)("pages.galaxy.fields.group_pgc.label")),1),s("div",Ze,r(e.galaxy.group_pgc??"—"),1),s("div",Qe,r(f(t)("pages.galaxy.fields.group_pgc.desc")),1)]),s("div",Ke,[s("div",Je,r(f(t)("pages.galaxy.fields.t17.label")),1),s("div",ta,r(e.galaxy.t17??"—"),1),s("div",ea,r(f(t)("pages.galaxy.fields.t17.desc")),1)]),s("div",aa,[s("div",sa,r(f(t)("pages.galaxy.fields.morphology.label")),1),s("div",na,r(f(t)("morphology."+i.value)),1),s("div",ia,r(f(t)("pages.galaxy.fields.morphology.desc")),1)]),s("h2",oa,r(f(t)("pages.galaxy.sections.distance")),1),s("div",ra,[s("div",la,r(f(t)("pages.galaxy.fields.dm.label")),1),s("div",ca,r(e.galaxy.dm.toFixed(2))+" mag",1),s("div",da,r(f(t)("pages.galaxy.fields.dm.desc")),1)]),s("div",ha,[s("div",ua,r(f(t)("pages.galaxy.fields.e_dm.label")),1),s("div",ga,r(e.galaxy.e_dm!=null?"± "+e.galaxy.e_dm.toFixed(2)+" mag":"—"),1),s("div",ma,r(f(t)("pages.galaxy.fields.e_dm.desc")),1)]),s("div",pa,[s("div",fa,r(f(t)("pages.galaxy.fields.distance_mpc.label")),1),s("div",va,r(e.galaxy.distance_mpc.toFixed(1))+" Mpc",1),s("div",ya,r(f(t)("pages.galaxy.fields.distance_mpc.desc")),1)]),s("div",xa,[s("div",ba,r(f(t)("pages.galaxy.fields.distance_mly.label")),1),s("div",_a,r(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly",1),s("div",Ma,r(f(t)("pages.galaxy.fields.distance_mly.desc")),1)]),s("div",wa,[s("div",Sa,r(f(t)("pages.galaxy.fields.vcmb.label")),1),s("div",za,r(e.galaxy.vcmb!=null?e.galaxy.vcmb.toLocaleString()+" km/s":"—"),1),s("div",Ra,r(f(t)("pages.galaxy.fields.vcmb.desc")),1)]),s("h2",ka,r(f(t)("pages.galaxy.sections.coordinates")),1),s("div",Ca,[s("div",Da,r(f(t)("pages.galaxy.fields.ra.label")),1),s("div",Pa,r(e.galaxy.ra.toFixed(4))+"°",1),s("div",Ta,r(f(t)("pages.galaxy.fields.ra.desc")),1)]),s("div",Aa,[s("div",Fa,r(f(t)("pages.galaxy.fields.dec.label")),1),s("div",Ia,r(c(e.galaxy.dec,4))+"°",1),s("div",La,r(f(t)("pages.galaxy.fields.dec.desc")),1)]),s("div",Ea,[s("div",Ba,r(f(t)("pages.galaxy.fields.glon.label")),1),s("div",Oa,r(e.galaxy.glon!=null?e.galaxy.glon.toFixed(4)+"°":"—"),1),s("div",Na,r(f(t)("pages.galaxy.fields.glon.desc")),1)]),s("div",Ga,[s("div",Ua,r(f(t)("pages.galaxy.fields.glat.label")),1),s("div",Va,r(e.galaxy.glat!=null?c(e.galaxy.glat,4)+"°":"—"),1),s("div",Ha,r(f(t)("pages.galaxy.fields.glat.desc")),1)]),s("div",Wa,[s("div",$a,r(f(t)("pages.galaxy.fields.sgl.label")),1),s("div",Xa,r(e.galaxy.sgl!=null?e.galaxy.sgl.toFixed(3)+"°":"—"),1),s("div",qa,r(f(t)("pages.galaxy.fields.sgl.desc")),1)]),s("div",Ya,[s("div",ja,r(f(t)("pages.galaxy.fields.sgb.label")),1),s("div",Za,r(e.galaxy.sgb!=null?c(e.galaxy.sgb,3)+"°":"—"),1),s("div",Qa,r(f(t)("pages.galaxy.fields.sgb.desc")),1)]),s("h2",Ka,r(f(t)("pages.galaxy.sections.physical")),1),s("div",Ja,[s("div",ts,r(f(t)("pages.galaxy.fields.diameter_kpc.label")),1),s("div",es,r(l.value.diameterKpc.toFixed(1))+" kpc ("+r((l.value.diameterKpc*3.26).toFixed(1))+" kly)",1),s("div",as,r(f(t)("pages.galaxy.fields.diameter_kpc.desc")),1)]),e.galaxy.diameter_arcsec!=null?(S(),P("div",ss,[s("div",ns,r(f(t)("pages.galaxy.fields.diameter_arcsec.label")),1),s("div",is,r(e.galaxy.diameter_arcsec)+"″",1),s("div",os,r(f(t)("pages.galaxy.fields.diameter_arcsec.desc")),1)])):A("",!0),(e.galaxy.axial_ratio??e.galaxy.ba)!=null?(S(),P("div",rs,[s("div",ls,r(e.galaxy.axial_ratio!=null?f(t)("pages.galaxy.fields.axial_ratio.label"):f(t)("pages.galaxy.fields.ba.label")),1),s("div",cs,r((e.galaxy.axial_ratio??e.galaxy.ba).toFixed(3)),1),s("div",ds,r(e.galaxy.axial_ratio!=null?f(t)("pages.galaxy.fields.axial_ratio.desc"):f(t)("pages.galaxy.fields.ba.desc")),1)])):A("",!0),e.galaxy.log_ms_t!=null?(S(),P("div",hs,[s("div",us,r(f(t)("pages.galaxy.fields.log_ms_t.label")),1),s("div",gs,r(e.galaxy.log_ms_t.toFixed(2))+" log M☉",1),s("div",ms,r(f(t)("pages.galaxy.fields.log_ms_t.desc")),1)])):A("",!0),s("div",ps,[s("div",fs,r(f(t)("pages.galaxy.fields.size_method.label")),1),s("div",vs,r(f(t)("pages.galaxy.size"+g.value)),1),s("div",ys,r(f(t)("pages.galaxy.fields.size_method.desc")),1)]),a.value.length>0?(S(),P(ut,{key:3},[s("h2",xs,r(f(t)("pages.galaxy.sections.methods")),1),(S(!0),P(ut,null,St(a.value,p=>(S(),P("div",{key:p.key,class:"data-row"},[s("div",bs,r(f(t)("pages.galaxy.fields."+p.key+".label")),1),s("div",_s,r(p.value),1),s("div",Ms,r(f(t)("pages.galaxy.fields."+p.key+".desc")),1)]))),128))],64)):A("",!0)])])):A("",!0)]),_:1}))}}),Ss=nt(ws,[["__scopeId","data-v-f688e0f6"]]),zs={class:"w-full h-full"},Rs={class:"top-header"},ks={class:"top-buttons"},Cs={key:0,class:"galaxy-title"},Ds={key:3,class:"not-found"},Ps=et({__name:"GalaxyView",setup(e){const{t}=mt(),n=It(),{ready:i,isLoading:m,getGalaxyByPgc:l}=jt(),g=ht(null),c=ht(!1);return wt(async()=>{await i,g.value=l(Number(n.params.pgc))}),(h,a)=>{const o=Lt("router-link");return S(),P("div",zs,[g.value?(S(),K(Se,{key:0,galaxy:g.value},null,8,["galaxy"])):A("",!0),g.value?(S(),K(Ge,{key:1,galaxy:g.value},null,8,["galaxy"])):A("",!0),s("div",Rs,[s("div",ks,[s("button",{class:"data-button",onClick:a[0]||(a[0]=u=>c.value=!c.value)},r(f(t)("pages.galaxy.dataButton")),1),Ft(o,{to:"/",class:"back-button"},{default:zt(()=>[...a[2]||(a[2]=[V("← Back",-1)])]),_:1})]),g.value?(S(),P("div",Cs,"PGC "+r(g.value.pgc),1)):A("",!0)]),g.value?(S(),K(Ss,{key:2,galaxy:g.value,show:c.value,"onUpdate:show":a[1]||(a[1]=u=>c.value=u)},null,8,["galaxy","show"])):A("",!0),!g.value&&!f(m)?(S(),P("div",Ds,"Galaxy not found")):A("",!0)])}}}),Ls=nt(Ps,[["__scopeId","data-v-1aaa3718"]]);export{Ls as default};
