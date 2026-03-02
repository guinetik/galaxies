import{d as et,o as _t,a as Pt,c as P,r as ht,b as C,e as mt,f as l,t as u,h as f,l as q,i as A,F as ut,j as wt,n as K,s as Q,T as Tt,w as St,g as At,v as Ft,k as It}from"./index-Dfm2yRKq.js";import{B as Lt,c as dt,a as at,A as pt,b as Bt,g as Et,h as st,i as zt,D as Rt,M as Y,j as Nt,R as Ot,U as Ut,L as tt,k as vt,f as yt,d as Vt,N as Gt,l as gt,C as Ht,V as $,Q as J,W as Wt,S as xt,P as Xt,m as qt,O as $t}from"./three.module-TGhSzrr1.js";import{a as ft,u as Yt}from"./galaxy-D31dlBQY.js";import{_ as nt}from"./_plugin-vue_export-helper-DlAUqK2U.js";function w(e,t,n){return e+(t-e)*n}function j(e,t,n){return Math.max(t,Math.min(n,e))}function jt(e){let t=e|0;return()=>{t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Zt(e,t){switch(e){case"elliptical":return{type:"elliptical",hubbleStage:0,eNumber:Math.round(t()*7),barStrength:null,ringType:null};case"lenticular":return{type:"lenticular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};case"barred":return{type:"barred",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:t()>.5?"strong":"weak",ringType:null};case"irregular":return{type:"irregular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};default:return{type:"spiral",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:null,ringType:null}}}function Qt(e){const t=jt(e.pgc),n=ft(e.pgc),i=.5+t()*1,o=j(300*i,150,450),r=j(Math.round(6e4*(.7+t()*.6)),42e3,78e3),s=Zt(n,t);switch(s.type){case"spiral":{const a=j((s.hubbleStage-1)/8,0,1);return{type:"spiral",numArms:s.hubbleStage<=2?2:s.hubbleStage<=5?Math.round(w(2,4,t())):Math.round(w(2,6,t())),starCount:r,galaxyRadius:o,armWidth:o*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:o*w(.35,.05,a),irregularity:w(0,.3,a)}}case"barred":{const a=j((s.hubbleStage-1)/8,0,1),h=s.barStrength==="strong",d=t();return{type:"barred",numArms:s.hubbleStage<=2?2:Math.round(w(2,4,t())),starCount:r,galaxyRadius:o,armWidth:o*w(.06,.18,a),spiralTightness:w(.08,.5,a),spiralStart:w(.3,.1,a),fieldStarFraction:w(.05,.4,a),bulgeRadius:o*w(.35,.05,a),barLength:o*(h?w(.3,.6,d):w(.15,.3,d)),barWidth:o*w(.05,.12,t()),irregularity:w(0,.3,a)}}case"elliptical":{const a=s.eNumber??3;return{type:"elliptical",starCount:r,galaxyRadius:o,ellipticity:a/10,axisRatio:1-a/10}}case"lenticular":return{type:"lenticular",starCount:r,galaxyRadius:o,bulgeRadius:o*w(.3,.5,t()),bulgeFraction:w(.4,.7,t()),diskThickness:w(.05,.15,t())};case"irregular":return{type:"irregular",starCount:r,galaxyRadius:o,irregularity:w(.5,1,t()),clumpCount:Math.round(w(3,12,t()))}}}const S=Math.PI*2,T={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,hiiHueRange:[320,340],fieldHueRange:[10,30],dustHueRange:[240,280],hiiRegionChance:.15}},bt=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function F(e){const t=T.visual.dustFraction,n=T.visual.brightFraction;return e<t?"dust":e>1-n?"bright":"star"}function I(e){switch(e){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function B(e,t,n){const i=T.visual;if(n)return i.hiiHueRange[0]+Math.random()*(i.hiiHueRange[1]-i.hiiHueRange[0]);if(e==="dust")return i.dustHueRange[0]+Math.random()*(i.dustHueRange[1]-i.dustHueRange[0]);const o=Math.pow(t,.6);let r=0;for(const a of bt)r+=a.wInner*(1-o)+a.wOuter*o;let s=Math.random()*r;for(const a of bt)if(s-=a.wInner*(1-o)+a.wOuter*o,s<=0)return a.hue+(Math.random()-.5)*a.spread;return 42}function L(e){const{baseSpeed:t,falloff:n,referenceRadius:i}=T.rotation;return t/Math.pow(Math.max(e,i)/i,n)}function Jt(e){return e.galaxyRadius*.06}function Kt(e,t){const n=Jt(t);return e.filter(i=>i.radius>=n)}function Ct(e){const t=Math.random()*S,n=Math.sqrt(Math.random())*e,i=(Math.random()-.5)*e*.08,o=F(Math.random()),r=I(o);return{radius:n,angle:t,y:i,rotationSpeed:L(n),hue:T.visual.fieldHueRange[0]+Math.random()*(T.visual.fieldHueRange[1]-T.visual.fieldHueRange[0]),brightness:r.brightness,size:r.size,alpha:r.alpha,layer:o,twinklePhase:Math.random()*S}}function te(e){const t=[],n=e.numArms||2,i=e.starCount||15e3,o=Math.floor(i*(1-(e.fieldStarFraction||.15))),r=Math.floor(o/n),s=e.galaxyRadius||350,a=e.armWidth||40,h=e.spiralTightness||.25,d=(e.spiralStart||.086)*s,v=e.irregularity||0,g=T.visual.hiiRegionChance,y=10;for(let c=0;c<n;c++){const m=c/n*S,p=new Set;for(let x=0;x<y;x++)Math.random()<g&&p.add(x);for(let x=0;x<r;x++){const _=x/r,z=_*S*2.5,D=d*Math.exp(h*z);if(D>s)continue;const R=z+m,k=(Math.random()-.5+Math.random()-.5)*a,E=R+Math.PI/2,V=(Math.random()-.5)*20,G=v*(Math.random()-.5)*30,N=Math.cos(R)*(D+V+G)+Math.cos(E)*k,O=Math.sin(R)*(D+V+G)+Math.sin(E)*k,H=s*T.visual.diskThicknessRatio*(1-_*.7),it=(Math.random()-.5)*H,W=Math.sqrt(N*N+O*O),X=Math.atan2(O,N),ot=W/s,rt=L(W),U=F(Math.random()),lt=Math.floor(_*y),Dt=p.has(lt)&&Math.random()<.4,ct=I(U),kt=B(U,ot,Dt);t.push({radius:W,angle:X,y:it,rotationSpeed:rt,hue:kt,brightness:ct.brightness,size:ct.size,alpha:ct.alpha,layer:U,twinklePhase:Math.random()*S})}}const b=e.bulgeRadius||0;if(b>0){const c=Math.floor(i*.35);for(let m=0;m<c;m++){const p=Math.pow(Math.random(),.6)*b,x=Math.random()*S,_=(Math.random()-.5)*b*.5,z=p/b,D=1+(1-z)*.5,R=F(Math.random()),k=I(R);t.push({radius:p,angle:x,y:_,rotationSpeed:L(p)*.5,hue:B(R,.1,!1),brightness:Math.min(k.brightness*D,.95),size:k.size*(1+(1-z)*.3),alpha:Math.min(k.alpha*D,.95),layer:R,twinklePhase:Math.random()*S})}}const M=Math.floor(i*(e.fieldStarFraction||.15));for(let c=0;c<M;c++)t.push(Ct(s));return t}function ee(e){const t=[],n=e.numArms||2,i=e.galaxyRadius||350,o=e.barLength||120,r=e.barWidth||25,s=e.armWidth||45,a=e.spiralTightness||.28,h=(e.spiralStart||.143)*i,d=e.starCount||16e3,v=T.visual.hiiRegionChance,g=10,y=Math.floor(d*.25);for(let c=0;c<y;c++){const m=(Math.random()-.5)*2*o,p=(Math.random()-.5)*r,x=m,_=p,z=Math.sqrt(x*x+_*_);if(z>i)continue;const D=Math.atan2(_,x),R=F(Math.random()),k=I(R),E=B(R,.1,!1);t.push({radius:z,angle:D,y:(Math.random()-.5)*i*.04,rotationSpeed:L(z),hue:E,brightness:k.brightness,size:k.size,alpha:k.alpha,layer:R,twinklePhase:Math.random()*S})}for(let c=0;c<n;c++){const m=c/n*S,p=Math.floor((d-y)*.9/n),x=new Set;for(let _=0;_<g;_++)Math.random()<v&&x.add(_);for(let _=0;_<p;_++){const z=_/p,D=z*S*2.5,R=h*Math.exp(a*D);if(R>i||R<o*.5)continue;const k=D+m,E=(Math.random()-.5+Math.random()-.5)*s,V=k+Math.PI/2,G=(Math.random()-.5)*20,N=Math.cos(k)*(R+G)+Math.cos(V)*E,O=Math.sin(k)*(R+G)+Math.sin(V)*E,H=Math.sqrt(N*N+O*O),it=Math.atan2(O,N),W=H/i,X=F(Math.random()),ot=Math.floor(z*g),rt=x.has(ot)&&Math.random()<.4,U=I(X),lt=B(X,W,rt);t.push({radius:H,angle:it,y:(Math.random()-.5)*i*T.visual.diskThicknessRatio*(1-z*.7),rotationSpeed:L(H),hue:lt,brightness:U.brightness,size:U.size,alpha:U.alpha,layer:X,twinklePhase:Math.random()*S})}}const b=e.bulgeRadius||0;if(b>0){const c=Math.floor(d*.3);for(let m=0;m<c;m++){const p=Math.pow(Math.random(),.6)*b,x=Math.random()*S,_=(Math.random()-.5)*b*.5,z=p/b,D=1+(1-z)*.5,R=F(Math.random()),k=I(R);t.push({radius:p,angle:x,y:_,rotationSpeed:L(p)*.5,hue:B(R,.1,!1),brightness:Math.min(k.brightness*D,.95),size:k.size*(1+(1-z)*.3),alpha:Math.min(k.alpha*D,.95),layer:R,twinklePhase:Math.random()*S})}}const M=Math.floor((d-y)*.1);for(let c=0;c<M;c++)t.push(Ct(i));return t}function ae(e){const t=[],n=e.galaxyRadius||300,i=e.bulgeRadius||80,o=e.bulgeFraction||.4,r=n*T.visual.diskThicknessRatio*.5,s=e.starCount||28e3,a=Math.floor(s*o);for(let v=0;v<a;v++){const g=Math.pow(Math.random(),.6)*i,y=Math.random()*S,b=(Math.random()-.5)*i*.6,M=g/i,c=1+(1-M)*.5,m=F(Math.random()),p=I(m);t.push({radius:g,angle:y,y:b,rotationSpeed:L(g)*.5,hue:B(m,.1,!1),brightness:Math.min(p.brightness*c,.95),size:p.size*(1+(1-M)*.3),alpha:Math.min(p.alpha*c,.95),layer:m,twinklePhase:Math.random()*S})}const h=s-a,d=n/3;for(let v=0;v<h;v++){const g=Math.random(),y=-Math.log(1-g*.95)*d;if(y>n){v--;continue}const b=Math.random()*S,M=y/n,c=(Math.random()-.5)*r*(1-M*.5),m=F(Math.random()),p=I(m);t.push({radius:y,angle:b,y:c,rotationSpeed:L(y),hue:B(m,M*.3,!1),brightness:p.brightness,size:p.size,alpha:p.alpha,layer:m,twinklePhase:Math.random()*S})}return t}function se(e){const t=[],n=e.galaxyRadius||320,i=e.axisRatio||.7,o=e.starCount||12e3;for(let r=0;r<o;r++){const s=Math.random(),a=Math.random(),h=Math.pow(s,.4)*n,d=a*S,v=h*Math.cos(d),g=h*Math.sin(d)*i,y=Math.sqrt(v*v+g*g),b=Math.atan2(g,v),M=y/n,c=F(Math.random()),m=I(c),p=B(c,M,!1);t.push({radius:y,angle:b,y:(Math.random()-.5)*n*.1*(1-M*.5),rotationSpeed:L(y)*.3,hue:p,brightness:m.brightness,size:m.size,alpha:m.alpha,layer:c,twinklePhase:Math.random()*S})}return t}function ne(e){const t=[],n=e.galaxyRadius||280,i=e.irregularity||.8,o=e.clumpCount||5,r=[];for(let a=0;a<o;a++){const h=a/o*S+Math.random()*.5,d=(.2+Math.random()*.6)*n;r.push({x:Math.cos(h)*d,z:Math.sin(h)*d,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<T.visual.hiiRegionChance})}const s=e.starCount||1e4;for(let a=0;a<s;a++){let h,d,v=!1;if(Math.random()<1-i){const p=Math.floor(Math.random()*o),x=r[p],_=()=>(Math.random()-.5+Math.random()-.5)*2;h=x.x+_()*x.sigma,d=x.z+_()*x.sigma,v=x.isHII&&Math.random()<.4}else{const p=Math.random()*S,x=Math.sqrt(Math.random())*n;h=Math.cos(p)*x+(Math.random()-.5)*60,d=Math.sin(p)*x+(Math.random()-.5)*60}const g=Math.sqrt(h*h+d*d);if(g>n*1.1)continue;const y=Math.atan2(d,h),b=g/n,M=F(Math.random()),c=I(M),m=B(M,b,v);t.push({radius:g,angle:y,y:(Math.random()-.5)*n*.12,rotationSpeed:L(g)*(.5+Math.random()*.5),hue:m,brightness:c.brightness,size:c.size,alpha:c.alpha,layer:M,twinklePhase:Math.random()*S})}return t}function ie(e){let t;switch(e.type){case"spiral":t=te(e);break;case"barred":t=ee(e);break;case"lenticular":t=ae(e);break;case"elliptical":t=se(e);break;case"irregular":t=ne(e);break}return Kt(t,e)}const oe=`attribute float aSize;
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
`;function le(e,t,n){e/=360;const i=t*Math.min(n,1-n),o=r=>{const s=(r+e*12)%12;return n-i*Math.max(Math.min(s-3,9-s,1),-1)};return[o(0),o(8),o(4)]}function ce(e){switch(e){case"dust":return .3;case"star":return .65;case"bright":return .5}}function de(e,t){switch(e){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class he{constructor(t,n=600){this.stars=t;const i=t.length,o=new Float32Array(i*3),r=new Float32Array(i*4),s=new Float32Array(i);this.angleOffsets=new Float32Array(i),this.baseAlphas=new Float32Array(i);for(let a=0;a<i;a++){const h=t[a],d=h.radius*Math.cos(h.angle),v=h.radius*Math.sin(h.angle);o[a*3]=d,o[a*3+1]=h.y,o[a*3+2]=v;const g=ce(h.layer),y=de(h.layer,h.brightness),[b,M,c]=le(h.hue,g,y);r[a*4]=b,r[a*4+1]=M,r[a*4+2]=c,r[a*4+3]=h.alpha,s[a]=h.size,this.angleOffsets[a]=h.angle,this.baseAlphas[a]=h.alpha}this.geometry=new Lt,this.geometry.setAttribute("position",new dt(o,3)),this.geometry.setAttribute("aColor",new dt(r,4)),this.geometry.setAttribute("aSize",new dt(s,1)),this.material=new at({vertexShader:oe,fragmentShader:re,uniforms:{uPixelRatio:{value:window.devicePixelRatio},uBaseDistance:{value:n}},transparent:!0,depthWrite:!1,blending:pt}),this.points=new Bt(this.geometry,this.material)}update(t,n){const i=this.stars,o=i.length,r=this.geometry.getAttribute("position"),s=this.geometry.getAttribute("aColor"),a=r.array,h=s.array;for(let d=0;d<o;d++){const v=i[d];this.angleOffsets[d]+=v.rotationSpeed*t;const g=this.angleOffsets[d];if(a[d*3]=v.radius*Math.cos(g),a[d*3+2]=v.radius*Math.sin(g),v.layer==="bright"){const y=Math.sin(n*2+v.twinklePhase)*.15+.85;h[d*4+3]=this.baseAlphas[d]*y}}r.needsUpdate=!0,s.needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}class ue{constructor(t){const i=document.createElement("canvas");i.width=512,i.height=512;const o=i.getContext("2d"),r=512/2,s=512/2,a=o.createRadialGradient(r,s,0,r,s,r*.3);a.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),a.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),a.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),a.addColorStop(1,"hsla(20, 50%, 30%, 0)"),o.fillStyle=a,o.fillRect(0,0,512,512);const h=o.createRadialGradient(r,s,0,r,s,r*.7);h.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),h.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),h.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),h.addColorStop(1,"hsla(0, 0%, 0%, 0)"),o.fillStyle=h,o.fillRect(0,0,512,512);const d=o.createRadialGradient(r,s,0,r,s,r);d.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),d.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),d.addColorStop(1,"hsla(0, 0%, 0%, 0)"),o.fillStyle=d,o.fillRect(0,0,512,512);const v=new Et(i);v.needsUpdate=!0;const g=t*3,y=new st(g,g);this.material=new zt({map:v,transparent:!0,depthWrite:!1,blending:pt,side:Rt}),this.mesh=new Y(y,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ge=`varying vec2 vUV;

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
`;class pe{constructor(t,n,i){const r=new Float32Array(65536),s=n*1.3;for(let g=0;g<t.length;g++){const y=t[g],b=Math.cos(y.angle)*y.radius,M=Math.sin(y.angle)*y.radius,c=Math.floor((b/s*.5+.5)*255),m=Math.floor((M/s*.5+.5)*255);c>=0&&c<256&&m>=0&&m<256&&(r[m*256+c]+=1)}const a=new Float32Array(256*256);for(let g=0;g<3;g++){const y=g%2===0?r:a,b=g%2===0?a:r;for(let M=0;M<256;M++)for(let c=0;c<256;c++){let m=0,p=0;for(let x=-2;x<=2;x++)for(let _=-2;_<=2;_++){const z=c+_,D=M+x;z>=0&&z<256&&D>=0&&D<256&&(m+=y[D*256+z],p++)}b[M*256+c]=m/p}}r.set(a);let h=0;for(let g=0;g<r.length;g++)r[g]>h&&(h=r[g]);const d=new Uint8Array(256*256);if(h>0)for(let g=0;g<r.length;g++)d[g]=Math.min(255,Math.floor(r[g]/h*255));this.densityTexture=new Nt(d,256,256,Ot,Ut),this.densityTexture.minFilter=tt,this.densityTexture.magFilter=tt,this.densityTexture.wrapS=vt,this.densityTexture.wrapT=vt,this.densityTexture.needsUpdate=!0;const v=new st(2,2);this.material=new at({vertexShader:ge,fragmentShader:me,uniforms:{uInvViewProj:{value:new yt},uTime:{value:0},uGalaxyRadius:{value:n},uSeed:{value:i},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:pt}),this.mesh=new Y(v,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,n,i,o,r){const s=this.material.uniforms;s.uTime.value=t,s.uGalaxyRotation.value=i,s.uGalaxyRadius.value=o,s.uAxisRatio.value=r;const a=new yt;a.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),s.uInvViewProj.value.copy(a).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const fe=`varying vec2 vUV;
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
`;class ye{constructor(t,n=60){this.quadSize=n;const i=new Vt(1,4,4),o=new zt({visible:!1});this.depthMesh=new Y(i,o),this.depthMesh.layers.set(2),this.material=new at({vertexShader:fe,fragmentShader:ve,uniforms:{uResolution:{value:new gt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Gt,side:Rt}),this.mesh=new Y(new st(1,1),this.material),this.mesh.scale.set(n,n,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,n,i,o,r){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=n,this.material.uniforms.uRotY.value=i,r){const s=r.getSize(new gt),a=r.getPixelRatio();this.material.uniforms.uResolution.value.set(s.x*a,s.y*a)}if(o){this.mesh.quaternion.copy(o.quaternion);const s=o.position.length(),h=(o.fov??60)*Math.PI/180,d=this.material.uniforms.uResolution.value.y,v=this.quadSize/s*(d/(2*Math.tan(h/2))),g=Math.min(Math.max((v-6)/220,0),1);this.material.uniforms.uLOD.value=g}}getLOD(){return this.material.uniforms.uLOD.value}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const xe=`varying vec2 vUV;

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
`,Mt=new $(0,1,0),Z=new J;class Me{constructor(t,n){this.animationId=0,this.clock=new Ht,this.galaxyRotation=0,this._bhScreenVec=new $,this.orbitQuat=new J,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new Wt({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new xt,this.renderer.setClearColor(0,1),this.params=Qt(n);const i=ie(this.params),o=this.params.galaxyRadius;this.baseDistance=o*1.7;const r=t.clientWidth/t.clientHeight;this.camera=new Xt(60,r,.1,this.baseDistance*20),this.particles=new he(i,this.baseDistance),this.scene.add(this.particles.points),this.haze=new ue(o),this.scene.add(this.haze.mesh),this.nebula=new pe(i,o,n.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new ye(null,o*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.particles.points.layers.set(1),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const s=t.clientWidth,a=t.clientHeight;this.galaxyRT=new qt(s*window.devicePixelRatio,a*window.devicePixelRatio,{minFilter:tt,magFilter:tt}),this.lensingMaterial=new at({vertexShader:xe,fragmentShader:be,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new gt(.5,.5)},uLensStrength:{value:0},uAspectRatio:{value:s/a}},depthTest:!1,depthWrite:!1});const h=new Y(new st(2,2),this.lensingMaterial);this.lensingScene=new xt,this.lensingScene.add(h),this.lensingCamera=new $t(-1,1,1,-1,0,1);const v=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=v,this.targetZoom=v;const g=(n.pgc*2654435761>>>0)/4294967296*Math.PI*2,b=new J().setFromAxisAngle(new $(1,0,0),-.45),M=new J().setFromAxisAngle(Mt,g);this.orbitQuat.multiplyQuaternions(b,M),this.onPointerDown=c=>{this.isPinching||(this.isDragging=!0,this.lastX=c.clientX,this.lastY=c.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=c=>{if(this.isPinching||!this.isDragging)return;const m=c.clientX-this.lastX,p=c.clientY-this.lastY;this.velocityX=m*.005,this.velocityY=p*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=c.clientX,this.lastY=c.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=c=>{c.preventDefault();const m=this.targetZoom*.12;this.targetZoom+=c.deltaY>0?-m:m,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=c=>{if(c.touches.length===2){c.preventDefault(),this.isPinching=!0,this.isDragging=!1;const m=c.touches[0].clientX-c.touches[1].clientX,p=c.touches[0].clientY-c.touches[1].clientY;this.lastPinchDist=Math.sqrt(m*m+p*p)}},this.onTouchMove=c=>{if(c.touches.length===2){c.preventDefault();const m=c.touches[0].clientX-c.touches[1].clientX,p=c.touches[0].clientY-c.touches[1].clientY,x=Math.sqrt(m*m+p*p),_=(this.lastPinchDist-x)*.01;this.lastPinchDist=x,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+_))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),this.resizeObserver=new ResizeObserver(()=>{const c=t.clientWidth,m=t.clientHeight;if(c===0||m===0)return;this.renderer.setSize(c,m,!1),this.camera.aspect=c/m,this.camera.updateProjectionMatrix();const p=this.renderer.getPixelRatio();this.galaxyRT.setSize(c*p,m*p),this.lensingMaterial.uniforms.uAspectRatio.value=c/m}),this.resizeObserver.observe(t)}applyOrbitDelta(t,n){Z.setFromAxisAngle(Mt,-t),this.orbitQuat.premultiply(Z);const i=new $(1,0,0).applyQuaternion(this.orbitQuat);Z.setFromAxisAngle(i,-n),this.orbitQuat.premultiply(Z),this.orbitQuat.normalize()}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const n=this.clock.getDelta(),i=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const o=this.baseDistance/this.zoom,r=new $(0,0,o).applyQuaternion(this.orbitQuat);this.camera.position.copy(r),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const s=Math.min(this.zoom/20,1),a=.02+.18*s*s;this.galaxyRotation+=n*a,this.particles.update(n,i);const h=this.params.type==="elliptical"?this.params.axisRatio:1;this.nebula.update(i,this.camera,this.galaxyRotation,this.params.galaxyRadius,h);const d=this.camera.position,v=Math.sqrt(d.x*d.x+d.z*d.z),g=Math.atan2(d.y,v),y=Math.atan2(d.x,d.z);this.blackHole.update(i,g,y,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const b=this._bhScreenVec.x*.5+.5,M=this._bhScreenVec.y*.5+.5,c=this.blackHole.getLOD(),m=c*c*.03;m<.001?(this.camera.layers.enableAll(),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)):(this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(b,M),this.lensingMaterial.uniforms.uLensStrength.value=m,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera),this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0)};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),this.resizeObserver.disconnect(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}const _e=et({__name:"GalaxyDetail",props:{galaxy:{}},setup(e){const t=e,n=ht(null);let i=null;return _t(()=>{n.value&&(i=new Me(n.value,t.galaxy),i.start())}),Pt(()=>{i==null||i.dispose(),i=null}),(o,r)=>(C(),P("canvas",{ref_key:"canvasRef",ref:n,class:"galaxy-detail-canvas"},null,512))}}),we=nt(_e,[["__scopeId","data-v-787b8f20"]]),Se={class:"galaxy-info-card"},ze={class:"info-row"},Re={class:"info-label"},Ce={key:0,class:"procedural-mark",title:"Procedurally assigned"},De={class:"info-row"},ke={key:0,class:"info-row"},Pe={class:"info-row"},Te={key:0},Ae={key:1,class:"info-row info-methods"},Fe={class:"method-list"},Ie=["title"],Le=et({__name:"GalaxyInfoCard",props:{galaxy:{}},setup(e){const{t}=mt(),n=e,i=K(()=>ft(n.galaxy.pgc,n.galaxy.morphology)),o=K(()=>{const r=n.galaxy,s=[];return r.dm_snia!=null&&s.push({key:"snia",abbr:"SNIa"}),r.dm_tf!=null&&s.push({key:"tf",abbr:"TF"}),r.dm_fp!=null&&s.push({key:"fp",abbr:"FP"}),r.dm_sbf!=null&&s.push({key:"sbf",abbr:"SBF"}),r.dm_snii!=null&&s.push({key:"snii",abbr:"SNII"}),r.dm_trgb!=null&&s.push({key:"trgb",abbr:"TRGB"}),r.dm_ceph!=null&&s.push({key:"ceph",abbr:"Ceph"}),r.dm_mas!=null&&s.push({key:"mas",abbr:"Mas"}),s});return(r,s)=>(C(),P("div",Se,[l("div",ze,[l("span",Re,u(f(t)("pages.galaxy.fields.morphology.label")),1),q(" "+u(f(t)("morphology."+i.value)),1),e.galaxy.morphology?A("",!0):(C(),P("sup",Ce,"p"))]),l("div",De,[s[0]||(s[0]=l("span",{class:"info-label"},"Distance",-1)),q(" "+u(e.galaxy.distance_mpc.toFixed(1))+" Mpc ("+u(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly) ",1)]),e.galaxy.vcmb!=null?(C(),P("div",ke,[s[1]||(s[1]=l("span",{class:"info-label"},"CMB Velocity",-1)),q(" "+u(e.galaxy.vcmb.toLocaleString())+" km/s ",1)])):A("",!0),l("div",Pe,[s[2]||(s[2]=l("span",{class:"info-label"},"DM",-1)),q(" "+u(e.galaxy.dm.toFixed(2)),1),e.galaxy.e_dm!=null?(C(),P("span",Te," ± "+u(e.galaxy.e_dm.toFixed(2)),1)):A("",!0)]),o.value.length>0?(C(),P("div",Ae,[s[3]||(s[3]=l("span",{class:"info-label"},"Methods",-1)),l("span",Fe,[(C(!0),P(ut,null,wt(o.value,a=>(C(),P("span",{key:a.abbr,class:"method-tag",title:f(t)(`pages.about.data.methods.${a.key}.desc`)},u(a.abbr),9,Ie))),128))])])):A("",!0)]))}}),Be=nt(Le,[["__scopeId","data-v-2dd99b08"]]),Ee={key:0,class:"data-sidebar"},Ne={class:"sidebar-scroll"},Oe={class:"sidebar-title"},Ue={class:"data-row"},Ve={class:"data-label"},Ge={class:"data-value"},He={class:"data-desc"},We={class:"data-row"},Xe={class:"data-label"},qe={class:"data-value"},$e={class:"data-desc"},Ye={class:"data-row"},je={class:"data-label"},Ze={class:"data-value"},Qe={class:"data-desc"},Je={class:"data-row"},Ke={class:"data-label"},ta={class:"data-value"},ea={class:"data-desc"},aa={class:"sidebar-section"},sa={class:"data-row"},na={class:"data-label"},ia={class:"data-value"},oa={class:"data-desc"},ra={class:"data-row"},la={class:"data-label"},ca={class:"data-value"},da={class:"data-desc"},ha={class:"data-row"},ua={class:"data-label"},ga={class:"data-value"},ma={class:"data-desc"},pa={class:"data-row"},fa={class:"data-label"},va={class:"data-value"},ya={class:"data-desc"},xa={class:"data-row"},ba={class:"data-label"},Ma={class:"data-value"},_a={class:"data-desc"},wa={class:"sidebar-section"},Sa={class:"data-row"},za={class:"data-label"},Ra={class:"data-value"},Ca={class:"data-desc"},Da={class:"data-row"},ka={class:"data-label"},Pa={class:"data-value"},Ta={class:"data-desc"},Aa={class:"data-row"},Fa={class:"data-label"},Ia={class:"data-value"},La={class:"data-desc"},Ba={class:"data-row"},Ea={class:"data-label"},Na={class:"data-value"},Oa={class:"data-desc"},Ua={class:"data-row"},Va={class:"data-label"},Ga={class:"data-value"},Ha={class:"data-desc"},Wa={class:"data-row"},Xa={class:"data-label"},qa={class:"data-value"},$a={class:"data-desc"},Ya={class:"sidebar-section"},ja={class:"data-label"},Za={class:"data-value"},Qa={class:"data-desc"},Ja=et({__name:"GalaxyDataSidebar",props:{galaxy:{},show:{type:Boolean}},emits:["update:show"],setup(e){const{t}=mt(),n=e,i=K(()=>ft(n.galaxy.pgc,n.galaxy.morphology));function o(a,h){const d=a.toFixed(h);return a>=0?"+"+d:d}function r(a,h){if(a==null)return null;const d=a.toFixed(2);return h!=null?`${d} ± ${h.toFixed(2)}`:d}const s=K(()=>{const a=n.galaxy,h=[],d=[["dm_snia",a.dm_snia,a.e_dm_snia],["dm_tf",a.dm_tf,a.e_dm_tf],["dm_fp",a.dm_fp,a.e_dm_fp],["dm_sbf",a.dm_sbf,a.e_dm_sbf],["dm_snii",a.dm_snii,a.e_dm_snii],["dm_trgb",a.dm_trgb,a.e_dm_trgb],["dm_ceph",a.dm_ceph,a.e_dm_ceph],["dm_mas",a.dm_mas,a.e_dm_mas]];for(const[v,g,y]of d){const b=r(g,y);b&&h.push({key:v,value:b})}return h});return(a,h)=>(C(),Q(Tt,{name:"slide-right"},{default:St(()=>[e.show?(C(),P("div",Ee,[l("div",Ne,[l("button",{class:"sidebar-close",onClick:h[0]||(h[0]=d=>a.$emit("update:show",!1))},"×"),l("h2",Oe,u(f(t)("pages.galaxy.sections.identity")),1),l("div",Ue,[l("div",Ve,u(f(t)("pages.galaxy.fields.pgc.label")),1),l("div",Ge,u(e.galaxy.pgc),1),l("div",He,u(f(t)("pages.galaxy.fields.pgc.desc")),1)]),l("div",We,[l("div",Xe,u(f(t)("pages.galaxy.fields.group_pgc.label")),1),l("div",qe,u(e.galaxy.group_pgc??"—"),1),l("div",$e,u(f(t)("pages.galaxy.fields.group_pgc.desc")),1)]),l("div",Ye,[l("div",je,u(f(t)("pages.galaxy.fields.t17.label")),1),l("div",Ze,u(e.galaxy.t17??"—"),1),l("div",Qe,u(f(t)("pages.galaxy.fields.t17.desc")),1)]),l("div",Je,[l("div",Ke,u(f(t)("pages.galaxy.fields.morphology.label")),1),l("div",ta,u(f(t)("morphology."+i.value)),1),l("div",ea,u(f(t)("pages.galaxy.fields.morphology.desc")),1)]),l("h2",aa,u(f(t)("pages.galaxy.sections.distance")),1),l("div",sa,[l("div",na,u(f(t)("pages.galaxy.fields.dm.label")),1),l("div",ia,u(e.galaxy.dm.toFixed(2))+" mag",1),l("div",oa,u(f(t)("pages.galaxy.fields.dm.desc")),1)]),l("div",ra,[l("div",la,u(f(t)("pages.galaxy.fields.e_dm.label")),1),l("div",ca,u(e.galaxy.e_dm!=null?"± "+e.galaxy.e_dm.toFixed(2)+" mag":"—"),1),l("div",da,u(f(t)("pages.galaxy.fields.e_dm.desc")),1)]),l("div",ha,[l("div",ua,u(f(t)("pages.galaxy.fields.distance_mpc.label")),1),l("div",ga,u(e.galaxy.distance_mpc.toFixed(1))+" Mpc",1),l("div",ma,u(f(t)("pages.galaxy.fields.distance_mpc.desc")),1)]),l("div",pa,[l("div",fa,u(f(t)("pages.galaxy.fields.distance_mly.label")),1),l("div",va,u(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly",1),l("div",ya,u(f(t)("pages.galaxy.fields.distance_mly.desc")),1)]),l("div",xa,[l("div",ba,u(f(t)("pages.galaxy.fields.vcmb.label")),1),l("div",Ma,u(e.galaxy.vcmb!=null?e.galaxy.vcmb.toLocaleString()+" km/s":"—"),1),l("div",_a,u(f(t)("pages.galaxy.fields.vcmb.desc")),1)]),l("h2",wa,u(f(t)("pages.galaxy.sections.coordinates")),1),l("div",Sa,[l("div",za,u(f(t)("pages.galaxy.fields.ra.label")),1),l("div",Ra,u(e.galaxy.ra.toFixed(4))+"°",1),l("div",Ca,u(f(t)("pages.galaxy.fields.ra.desc")),1)]),l("div",Da,[l("div",ka,u(f(t)("pages.galaxy.fields.dec.label")),1),l("div",Pa,u(o(e.galaxy.dec,4))+"°",1),l("div",Ta,u(f(t)("pages.galaxy.fields.dec.desc")),1)]),l("div",Aa,[l("div",Fa,u(f(t)("pages.galaxy.fields.glon.label")),1),l("div",Ia,u(e.galaxy.glon!=null?e.galaxy.glon.toFixed(4)+"°":"—"),1),l("div",La,u(f(t)("pages.galaxy.fields.glon.desc")),1)]),l("div",Ba,[l("div",Ea,u(f(t)("pages.galaxy.fields.glat.label")),1),l("div",Na,u(e.galaxy.glat!=null?o(e.galaxy.glat,4)+"°":"—"),1),l("div",Oa,u(f(t)("pages.galaxy.fields.glat.desc")),1)]),l("div",Ua,[l("div",Va,u(f(t)("pages.galaxy.fields.sgl.label")),1),l("div",Ga,u(e.galaxy.sgl!=null?e.galaxy.sgl.toFixed(3)+"°":"—"),1),l("div",Ha,u(f(t)("pages.galaxy.fields.sgl.desc")),1)]),l("div",Wa,[l("div",Xa,u(f(t)("pages.galaxy.fields.sgb.label")),1),l("div",qa,u(e.galaxy.sgb!=null?o(e.galaxy.sgb,3)+"°":"—"),1),l("div",$a,u(f(t)("pages.galaxy.fields.sgb.desc")),1)]),s.value.length>0?(C(),P(ut,{key:0},[l("h2",Ya,u(f(t)("pages.galaxy.sections.methods")),1),(C(!0),P(ut,null,wt(s.value,d=>(C(),P("div",{key:d.key,class:"data-row"},[l("div",ja,u(f(t)("pages.galaxy.fields."+d.key+".label")),1),l("div",Za,u(d.value),1),l("div",Qa,u(f(t)("pages.galaxy.fields."+d.key+".desc")),1)]))),128))],64)):A("",!0)])])):A("",!0)]),_:1}))}}),Ka=nt(Ja,[["__scopeId","data-v-47db02e9"]]),ts={class:"w-full h-full"},es={key:1,class:"galaxy-title"},as={class:"top-buttons"},ss={key:4,class:"not-found"},ns=et({__name:"GalaxyView",setup(e){const{t}=mt(),n=Ft(),{ready:i,isLoading:o,getGalaxyByPgc:r}=Yt(),s=ht(null),a=ht(!1);return _t(async()=>{await i,s.value=r(Number(n.params.pgc))}),(h,d)=>{const v=It("router-link");return C(),P("div",ts,[s.value?(C(),Q(we,{key:0,galaxy:s.value},null,8,["galaxy"])):A("",!0),s.value?(C(),P("div",es,"PGC "+u(s.value.pgc),1)):A("",!0),s.value?(C(),Q(Be,{key:2,galaxy:s.value},null,8,["galaxy"])):A("",!0),l("div",as,[l("button",{class:"data-button",onClick:d[0]||(d[0]=g=>a.value=!a.value)},u(f(t)("pages.galaxy.dataButton")),1),At(v,{to:"/",class:"back-button"},{default:St(()=>[...d[2]||(d[2]=[q("← Back",-1)])]),_:1})]),s.value?(C(),Q(Ka,{key:3,galaxy:s.value,show:a.value,"onUpdate:show":d[1]||(d[1]=g=>a.value=g)},null,8,["galaxy","show"])):A("",!0),!s.value&&!f(o)?(C(),P("div",ss,"Galaxy not found")):A("",!0)])}}}),cs=nt(ns,[["__scopeId","data-v-da36072f"]]);export{cs as default};
