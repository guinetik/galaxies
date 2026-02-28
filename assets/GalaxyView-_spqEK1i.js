import{d as rt,o as gt,a as St,c as G,r as vt,b as A,f as O,t as N,l as X,i as V,p as zt,m as ht,g as Rt,w as Ct,h as Dt,q as _t,k as Pt}from"./index-B-aYuHDU.js";import{B as At,a as ot,b as J,A as lt,c as Tt,f as kt,g as K,h as yt,D as xt,M as Y,i as It,R as Ft,U as Bt,L as $,j as ut,k as dt,d as Ot,N as Nt,l as it,C as Gt,V as q,Q,W as Vt,S as pt,P as Ut,m as Lt,O as Et,_ as ct}from"./_plugin-vue_export-helper-DMT_hbaD.js";import{a as Ht,u as Wt}from"./galaxy-CE9Npv48.js";function b(e,t,a){return e+(t-e)*a}function j(e,t,a){return Math.max(t,Math.min(a,e))}function Xt(e){let t=e|0;return()=>{t=t+1831565813|0;let a=Math.imul(t^t>>>15,1|t);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}function qt(e,t){switch(e){case"elliptical":return{type:"elliptical",hubbleStage:0,eNumber:Math.round(t()*7),barStrength:null,ringType:null};case"lenticular":return{type:"lenticular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};case"barred":return{type:"barred",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:t()>.5?"strong":"weak",ringType:null};case"irregular":return{type:"irregular",hubbleStage:0,eNumber:null,barStrength:null,ringType:null};default:return{type:"spiral",hubbleStage:Math.round(1+t()*8),eNumber:null,barStrength:null,ringType:null}}}function Yt(e){const t=Xt(e.pgc),a=Ht(e.pgc),s=.5+t()*1,n=j(300*s,150,450),i=j(Math.round(6e4*(.7+t()*.6)),42e3,78e3),r=qt(a,t);switch(r.type){case"spiral":{const o=j((r.hubbleStage-1)/8,0,1);return{type:"spiral",numArms:r.hubbleStage<=2?2:r.hubbleStage<=5?Math.round(b(2,4,t())):Math.round(b(2,6,t())),starCount:i,galaxyRadius:n,armWidth:n*b(.06,.18,o),spiralTightness:b(.08,.5,o),spiralStart:b(.3,.1,o),fieldStarFraction:b(.05,.4,o),bulgeRadius:n*b(.35,.05,o),irregularity:b(0,.3,o)}}case"barred":{const o=j((r.hubbleStage-1)/8,0,1),c=r.barStrength==="strong",l=t();return{type:"barred",numArms:r.hubbleStage<=2?2:Math.round(b(2,4,t())),starCount:i,galaxyRadius:n,armWidth:n*b(.06,.18,o),spiralTightness:b(.08,.5,o),spiralStart:b(.3,.1,o),fieldStarFraction:b(.05,.4,o),bulgeRadius:n*b(.35,.05,o),barLength:n*(c?b(.3,.6,l):b(.15,.3,l)),barWidth:n*b(.05,.12,t()),irregularity:b(0,.3,o)}}case"elliptical":{const o=r.eNumber??3;return{type:"elliptical",starCount:i,galaxyRadius:n,ellipticity:o/10,axisRatio:1-o/10}}case"lenticular":return{type:"lenticular",starCount:i,galaxyRadius:n,bulgeRadius:n*b(.3,.5,t()),bulgeFraction:b(.4,.7,t()),diskThickness:b(.05,.15,t())};case"irregular":return{type:"irregular",starCount:i,galaxyRadius:n,irregularity:b(.5,1,t()),clumpCount:Math.round(b(3,12,t()))}}}const M=Math.PI*2,C={rotation:{baseSpeed:.033,falloff:.35,referenceRadius:20},visual:{diskThicknessRatio:.06,dustFraction:.65,brightFraction:.03,hiiHueRange:[320,340],fieldHueRange:[10,30],dustHueRange:[240,280],hiiRegionChance:.15}},mt=[{hue:10,spread:8,wInner:.35,wOuter:.05},{hue:25,spread:8,wInner:.3,wOuter:.1},{hue:42,spread:6,wInner:.25,wOuter:.15},{hue:55,spread:5,wInner:.08,wOuter:.2},{hue:210,spread:15,wInner:.02,wOuter:.35},{hue:225,spread:10,wInner:0,wOuter:.15}];function D(e){const t=C.visual.dustFraction,a=C.visual.brightFraction;return e<t?"dust":e>1-a?"bright":"star"}function _(e){switch(e){case"dust":return{size:.8+Math.random()*1.5,brightness:.08+Math.random()*.16,alpha:.12+Math.random()*.2};case"bright":return{size:4+Math.random()*6,brightness:.64+Math.random()*.16,alpha:.56+Math.random()*.24};default:return{size:1.5+Math.random()*3,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function T(e,t,a){const s=C.visual;if(a)return s.hiiHueRange[0]+Math.random()*(s.hiiHueRange[1]-s.hiiHueRange[0]);if(e==="dust")return s.dustHueRange[0]+Math.random()*(s.dustHueRange[1]-s.dustHueRange[0]);const n=Math.pow(t,.6);let i=0;for(const o of mt)i+=o.wInner*(1-n)+o.wOuter*n;let r=Math.random()*i;for(const o of mt)if(r-=o.wInner*(1-n)+o.wOuter*n,r<=0)return o.hue+(Math.random()-.5)*o.spread;return 42}function P(e){const{baseSpeed:t,falloff:a,referenceRadius:s}=C.rotation;return t/Math.pow(Math.max(e,s)/s,a)}function jt(e){return e.galaxyRadius*.06}function Zt(e,t){const a=jt(t);return e.filter(s=>s.radius>=a)}function bt(e){const t=Math.random()*M,a=Math.sqrt(Math.random())*e,s=(Math.random()-.5)*e*.08,n=D(Math.random()),i=_(n);return{radius:a,angle:t,y:s,rotationSpeed:P(a),hue:C.visual.fieldHueRange[0]+Math.random()*(C.visual.fieldHueRange[1]-C.visual.fieldHueRange[0]),brightness:i.brightness,size:i.size,alpha:i.alpha,layer:n,twinklePhase:Math.random()*M}}function Qt(e){const t=[],a=e.numArms||2,s=e.starCount||15e3,n=Math.floor(s*(1-(e.fieldStarFraction||.15))),i=Math.floor(n/a),r=e.galaxyRadius||350,o=e.armWidth||40,c=e.spiralTightness||.25,l=(e.spiralStart||.086)*r,f=e.irregularity||0,h=C.visual.hiiRegionChance,m=10;for(let u=0;u<a;u++){const g=u/a*M,v=new Set;for(let y=0;y<m;y++)Math.random()<h&&v.add(y);for(let y=0;y<i;y++){const x=y/i,w=x*M*2.5,z=l*Math.exp(c*w);if(z>r)continue;const S=w+g,R=(Math.random()-.5+Math.random()-.5)*o,k=S+Math.PI/2,U=(Math.random()-.5)*20,L=f*(Math.random()-.5)*30,I=Math.cos(S)*(z+U+L)+Math.cos(k)*R,F=Math.sin(S)*(z+U+L)+Math.sin(k)*R,E=r*C.visual.diskThicknessRatio*(1-x*.7),tt=(Math.random()-.5)*E,H=Math.sqrt(I*I+F*F),W=Math.atan2(F,I),et=H/r,nt=P(H),B=D(Math.random()),at=Math.floor(x*m),Mt=v.has(at)&&Math.random()<.4,st=_(B),wt=T(B,et,Mt);t.push({radius:H,angle:W,y:tt,rotationSpeed:nt,hue:wt,brightness:st.brightness,size:st.size,alpha:st.alpha,layer:B,twinklePhase:Math.random()*M})}}const d=e.bulgeRadius||0;if(d>0){const u=Math.floor(s*.35);for(let g=0;g<u;g++){const v=Math.pow(Math.random(),.6)*d,y=Math.random()*M,x=(Math.random()-.5)*d*.5,w=v/d,z=1+(1-w)*.5,S=D(Math.random()),R=_(S);t.push({radius:v,angle:y,y:x,rotationSpeed:P(v)*.5,hue:T(S,.1,!1),brightness:Math.min(R.brightness*z,.95),size:R.size*(1+(1-w)*.3),alpha:Math.min(R.alpha*z,.95),layer:S,twinklePhase:Math.random()*M})}}const p=Math.floor(s*(e.fieldStarFraction||.15));for(let u=0;u<p;u++)t.push(bt(r));return t}function $t(e){const t=[],a=e.numArms||2,s=e.galaxyRadius||350,n=e.barLength||120,i=e.barWidth||25,r=e.armWidth||45,o=e.spiralTightness||.28,c=(e.spiralStart||.143)*s,l=e.starCount||16e3,f=C.visual.hiiRegionChance,h=10,m=Math.floor(l*.25);for(let u=0;u<m;u++){const g=(Math.random()-.5)*2*n,v=(Math.random()-.5)*i,y=g,x=v,w=Math.sqrt(y*y+x*x);if(w>s)continue;const z=Math.atan2(x,y),S=D(Math.random()),R=_(S),k=T(S,.1,!1);t.push({radius:w,angle:z,y:(Math.random()-.5)*s*.04,rotationSpeed:P(w),hue:k,brightness:R.brightness,size:R.size,alpha:R.alpha,layer:S,twinklePhase:Math.random()*M})}for(let u=0;u<a;u++){const g=u/a*M,v=Math.floor((l-m)*.9/a),y=new Set;for(let x=0;x<h;x++)Math.random()<f&&y.add(x);for(let x=0;x<v;x++){const w=x/v,z=w*M*2.5,S=c*Math.exp(o*z);if(S>s||S<n*.5)continue;const R=z+g,k=(Math.random()-.5+Math.random()-.5)*r,U=R+Math.PI/2,L=(Math.random()-.5)*20,I=Math.cos(R)*(S+L)+Math.cos(U)*k,F=Math.sin(R)*(S+L)+Math.sin(U)*k,E=Math.sqrt(I*I+F*F),tt=Math.atan2(F,I),H=E/s,W=D(Math.random()),et=Math.floor(w*h),nt=y.has(et)&&Math.random()<.4,B=_(W),at=T(W,H,nt);t.push({radius:E,angle:tt,y:(Math.random()-.5)*s*C.visual.diskThicknessRatio*(1-w*.7),rotationSpeed:P(E),hue:at,brightness:B.brightness,size:B.size,alpha:B.alpha,layer:W,twinklePhase:Math.random()*M})}}const d=e.bulgeRadius||0;if(d>0){const u=Math.floor(l*.3);for(let g=0;g<u;g++){const v=Math.pow(Math.random(),.6)*d,y=Math.random()*M,x=(Math.random()-.5)*d*.5,w=v/d,z=1+(1-w)*.5,S=D(Math.random()),R=_(S);t.push({radius:v,angle:y,y:x,rotationSpeed:P(v)*.5,hue:T(S,.1,!1),brightness:Math.min(R.brightness*z,.95),size:R.size*(1+(1-w)*.3),alpha:Math.min(R.alpha*z,.95),layer:S,twinklePhase:Math.random()*M})}}const p=Math.floor((l-m)*.1);for(let u=0;u<p;u++)t.push(bt(s));return t}function Jt(e){const t=[],a=e.galaxyRadius||300,s=e.bulgeRadius||80,n=e.bulgeFraction||.4,i=a*C.visual.diskThicknessRatio*.5,r=e.starCount||28e3,o=Math.floor(r*n);for(let f=0;f<o;f++){const h=Math.pow(Math.random(),.6)*s,m=Math.random()*M,d=(Math.random()-.5)*s*.6,p=h/s,u=1+(1-p)*.5,g=D(Math.random()),v=_(g);t.push({radius:h,angle:m,y:d,rotationSpeed:P(h)*.5,hue:T(g,.1,!1),brightness:Math.min(v.brightness*u,.95),size:v.size*(1+(1-p)*.3),alpha:Math.min(v.alpha*u,.95),layer:g,twinklePhase:Math.random()*M})}const c=r-o,l=a/3;for(let f=0;f<c;f++){const h=Math.random(),m=-Math.log(1-h*.95)*l;if(m>a){f--;continue}const d=Math.random()*M,p=m/a,u=(Math.random()-.5)*i*(1-p*.5),g=D(Math.random()),v=_(g);t.push({radius:m,angle:d,y:u,rotationSpeed:P(m),hue:T(g,p*.3,!1),brightness:v.brightness,size:v.size,alpha:v.alpha,layer:g,twinklePhase:Math.random()*M})}return t}function Kt(e){const t=[],a=e.galaxyRadius||320,s=e.axisRatio||.7,n=e.starCount||12e3;for(let i=0;i<n;i++){const r=Math.random(),o=Math.random(),c=Math.pow(r,.4)*a,l=o*M,f=c*Math.cos(l),h=c*Math.sin(l)*s,m=Math.sqrt(f*f+h*h),d=Math.atan2(h,f),p=m/a,u=D(Math.random()),g=_(u),v=T(u,p,!1);t.push({radius:m,angle:d,y:(Math.random()-.5)*a*.1*(1-p*.5),rotationSpeed:P(m)*.3,hue:v,brightness:g.brightness,size:g.size,alpha:g.alpha,layer:u,twinklePhase:Math.random()*M})}return t}function te(e){const t=[],a=e.galaxyRadius||280,s=e.irregularity||.8,n=e.clumpCount||5,i=[];for(let o=0;o<n;o++){const c=o/n*M+Math.random()*.5,l=(.2+Math.random()*.6)*a;i.push({x:Math.cos(c)*l,z:Math.sin(c)*l,sigma:30+Math.random()*80,weight:.5+Math.random(),isHII:Math.random()<C.visual.hiiRegionChance})}const r=e.starCount||1e4;for(let o=0;o<r;o++){let c,l,f=!1;if(Math.random()<1-s){const v=Math.floor(Math.random()*n),y=i[v],x=()=>(Math.random()-.5+Math.random()-.5)*2;c=y.x+x()*y.sigma,l=y.z+x()*y.sigma,f=y.isHII&&Math.random()<.4}else{const v=Math.random()*M,y=Math.sqrt(Math.random())*a;c=Math.cos(v)*y+(Math.random()-.5)*60,l=Math.sin(v)*y+(Math.random()-.5)*60}const h=Math.sqrt(c*c+l*l);if(h>a*1.1)continue;const m=Math.atan2(l,c),d=h/a,p=D(Math.random()),u=_(p),g=T(p,d,f);t.push({radius:h,angle:m,y:(Math.random()-.5)*a*.12,rotationSpeed:P(h)*(.5+Math.random()*.5),hue:g,brightness:u.brightness,size:u.size,alpha:u.alpha,layer:p,twinklePhase:Math.random()*M})}return t}function ee(e){let t;switch(e.type){case"spiral":t=Qt(e);break;case"barred":t=$t(e);break;case"lenticular":t=Jt(e);break;case"elliptical":t=Kt(e);break;case"irregular":t=te(e);break}return Zt(t,e)}const ne=`attribute float aSize;
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
`,ae=`precision highp float;

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
`;function se(e,t,a){e/=360;const s=t*Math.min(a,1-a),n=i=>{const r=(i+e*12)%12;return a-s*Math.max(Math.min(r-3,9-r,1),-1)};return[n(0),n(8),n(4)]}function oe(e){switch(e){case"dust":return .3;case"star":return .65;case"bright":return .5}}function ie(e,t){switch(e){case"dust":return t*.4;case"star":return t*.6;case"bright":return t*.85}}class re{constructor(t,a=600){this.stars=t;const s=t.length,n=new Float32Array(s*3),i=new Float32Array(s*4),r=new Float32Array(s);this.angleOffsets=new Float32Array(s),this.baseAlphas=new Float32Array(s);for(let o=0;o<s;o++){const c=t[o],l=c.radius*Math.cos(c.angle),f=c.radius*Math.sin(c.angle);n[o*3]=l,n[o*3+1]=c.y,n[o*3+2]=f;const h=oe(c.layer),m=ie(c.layer,c.brightness),[d,p,u]=se(c.hue,h,m);i[o*4]=d,i[o*4+1]=p,i[o*4+2]=u,i[o*4+3]=c.alpha,r[o]=c.size,this.angleOffsets[o]=c.angle,this.baseAlphas[o]=c.alpha}this.geometry=new At,this.geometry.setAttribute("position",new ot(n,3)),this.geometry.setAttribute("aColor",new ot(i,4)),this.geometry.setAttribute("aSize",new ot(r,1)),this.material=new J({vertexShader:ne,fragmentShader:ae,uniforms:{uPixelRatio:{value:window.devicePixelRatio},uBaseDistance:{value:a}},transparent:!0,depthWrite:!1,blending:lt}),this.points=new Tt(this.geometry,this.material)}update(t,a){const s=this.stars,n=s.length,i=this.geometry.getAttribute("position"),r=this.geometry.getAttribute("aColor"),o=i.array,c=r.array;for(let l=0;l<n;l++){const f=s[l];this.angleOffsets[l]+=f.rotationSpeed*t;const h=this.angleOffsets[l];if(o[l*3]=f.radius*Math.cos(h),o[l*3+2]=f.radius*Math.sin(h),f.layer==="bright"){const m=Math.sin(a*2+f.twinklePhase)*.15+.85;c[l*4+3]=this.baseAlphas[l]*m}}i.needsUpdate=!0,r.needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}class le{constructor(t){const s=document.createElement("canvas");s.width=512,s.height=512;const n=s.getContext("2d"),i=512/2,r=512/2,o=n.createRadialGradient(i,r,0,i,r,i*.3);o.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),o.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),o.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),o.addColorStop(1,"hsla(20, 50%, 30%, 0)"),n.fillStyle=o,n.fillRect(0,0,512,512);const c=n.createRadialGradient(i,r,0,i,r,i*.7);c.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),c.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),c.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),c.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=c,n.fillRect(0,0,512,512);const l=n.createRadialGradient(i,r,0,i,r,i);l.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),l.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),l.addColorStop(1,"hsla(0, 0%, 0%, 0)"),n.fillStyle=l,n.fillRect(0,0,512,512);const f=new kt(s);f.needsUpdate=!0;const h=t*3,m=new K(h,h);this.material=new yt({map:f,transparent:!0,depthWrite:!1,blending:lt,side:xt}),this.mesh=new Y(m,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ce=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,he=`precision highp float;

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
`;class ue{constructor(t,a,s){const i=new Float32Array(65536),r=a*1.3;for(let h=0;h<t.length;h++){const m=t[h],d=Math.cos(m.angle)*m.radius,p=Math.sin(m.angle)*m.radius,u=Math.floor((d/r*.5+.5)*255),g=Math.floor((p/r*.5+.5)*255);u>=0&&u<256&&g>=0&&g<256&&(i[g*256+u]+=1)}const o=new Float32Array(256*256);for(let h=0;h<3;h++){const m=h%2===0?i:o,d=h%2===0?o:i;for(let p=0;p<256;p++)for(let u=0;u<256;u++){let g=0,v=0;for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){const w=u+x,z=p+y;w>=0&&w<256&&z>=0&&z<256&&(g+=m[z*256+w],v++)}d[p*256+u]=g/v}}i.set(o);let c=0;for(let h=0;h<i.length;h++)i[h]>c&&(c=i[h]);const l=new Uint8Array(256*256);if(c>0)for(let h=0;h<i.length;h++)l[h]=Math.min(255,Math.floor(i[h]/c*255));this.densityTexture=new It(l,256,256,Ft,Bt),this.densityTexture.minFilter=$,this.densityTexture.magFilter=$,this.densityTexture.wrapS=ut,this.densityTexture.wrapT=ut,this.densityTexture.needsUpdate=!0;const f=new K(2,2);this.material=new J({vertexShader:ce,fragmentShader:he,uniforms:{uInvViewProj:{value:new dt},uTime:{value:0},uGalaxyRadius:{value:a},uSeed:{value:s},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:lt}),this.mesh=new Y(f,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,a,s,n,i){const r=this.material.uniforms;r.uTime.value=t,r.uGalaxyRotation.value=s,r.uGalaxyRadius.value=n,r.uAxisRatio.value=i;const o=new dt;o.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse),r.uInvViewProj.value.copy(o).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const de=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,pe=`precision highp float;

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
`;class me{constructor(t,a=60){this.quadSize=a;const s=new Ot(1,4,4),n=new yt({visible:!1});this.depthMesh=new Y(s,n),this.depthMesh.layers.set(2),this.material=new J({vertexShader:de,fragmentShader:pe,uniforms:{uResolution:{value:new it(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Nt,side:xt}),this.mesh=new Y(new K(1,1),this.material),this.mesh.scale.set(a,a,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,a,s,n,i){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=a,this.material.uniforms.uRotY.value=s,i){const r=i.getSize(new it),o=i.getPixelRatio();this.material.uniforms.uResolution.value.set(r.x*o,r.y*o)}if(n){this.mesh.quaternion.copy(n.quaternion);const r=n.position.length(),c=(n.fov??60)*Math.PI/180,l=this.material.uniforms.uResolution.value.y,f=this.quadSize/r*(l/(2*Math.tan(c/2))),h=Math.min(Math.max((f-6)/220,0),1);this.material.uniforms.uLOD.value=h}}getLOD(){return this.material.uniforms.uLOD.value}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const fe=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,ge=`precision highp float;

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

  // Event-horizon clamp — prevents sampling explosion near center
  float softDist = max(dist, 0.02);

  // Smooth falloff so distortion fades to zero at edge of influence
  float falloff    = smoothstep(0.58, 0.1, dist);
  float deflection = uLensStrength * (1.0 / softDist) * falloff;

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = 0.04;
  float ring = exp(-pow((dist - ringRadius) / 0.012, 2.0));
  ring *= falloff * uLensStrength * 12.0;
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.15;

  gl_FragColor = color;
}
`,ft=new q(0,1,0),Z=new Q;class ve{constructor(t,a){this.animationId=0,this.clock=new Gt,this.galaxyRotation=0,this._bhScreenVec=new q,this.orbitQuat=new Q,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.renderer=new Vt({canvas:t,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new pt,this.renderer.setClearColor(0,1),this.params=Yt(a);const s=ee(this.params),n=this.params.galaxyRadius;this.baseDistance=n*1.7;const i=t.clientWidth/t.clientHeight;this.camera=new Ut(60,i,.1,this.baseDistance*20),this.particles=new re(s,this.baseDistance),this.scene.add(this.particles.points),this.haze=new le(n),this.scene.add(this.haze.mesh),this.nebula=new ue(s,n,a.pgc),this.scene.add(this.nebula.mesh),this.blackHole=new me(null,n*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.particles.points.layers.set(1),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const r=t.clientWidth,o=t.clientHeight;this.galaxyRT=new Lt(r*window.devicePixelRatio,o*window.devicePixelRatio,{minFilter:$,magFilter:$}),this.lensingMaterial=new J({vertexShader:fe,fragmentShader:ge,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new it(.5,.5)},uLensStrength:{value:0},uAspectRatio:{value:r/o}},depthTest:!1,depthWrite:!1});const c=new Y(new K(2,2),this.lensingMaterial);this.lensingScene=new pt,this.lensingScene.add(c),this.lensingCamera=new Et(-1,1,1,-1,0,1);const l=(a.pgc*2654435761>>>0)/4294967296*Math.PI*2,h=new Q().setFromAxisAngle(new q(1,0,0),-.45),m=new Q().setFromAxisAngle(ft,l);this.orbitQuat.multiplyQuaternions(h,m),this.onPointerDown=d=>{this.isDragging=!0,this.lastX=d.clientX,this.lastY=d.clientY,this.velocityX=0,this.velocityY=0},this.onPointerMove=d=>{if(!this.isDragging)return;const p=d.clientX-this.lastX,u=d.clientY-this.lastY;this.velocityX=p*.005,this.velocityY=u*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=d.clientX,this.lastY=d.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onWheel=d=>{d.preventDefault();const p=this.targetZoom*.12;this.targetZoom+=d.deltaY>0?-p:p,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),this.resizeObserver=new ResizeObserver(()=>{const d=t.clientWidth,p=t.clientHeight;if(d===0||p===0)return;this.renderer.setSize(d,p,!1),this.camera.aspect=d/p,this.camera.updateProjectionMatrix();const u=this.renderer.getPixelRatio();this.galaxyRT.setSize(d*u,p*u),this.lensingMaterial.uniforms.uAspectRatio.value=d/p}),this.resizeObserver.observe(t)}applyOrbitDelta(t,a){Z.setFromAxisAngle(ft,-t),this.orbitQuat.premultiply(Z);const s=new q(1,0,0).applyQuaternion(this.orbitQuat);Z.setFromAxisAngle(s,-a),this.orbitQuat.premultiply(Z),this.orbitQuat.normalize()}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const a=this.clock.getDelta(),s=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const n=this.baseDistance/this.zoom,i=new q(0,0,n).applyQuaternion(this.orbitQuat);this.camera.position.copy(i),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const r=Math.min(this.zoom/20,1),o=.02+.18*r*r;this.galaxyRotation+=a*o,this.particles.update(a,s);const c=this.params.type==="elliptical"?this.params.axisRatio:1;this.nebula.update(s,this.camera,this.galaxyRotation,this.params.galaxyRadius,c);const l=this.camera.position,f=Math.sqrt(l.x*l.x+l.z*l.z),h=Math.atan2(l.y,f),m=Math.atan2(l.x,l.z);this.blackHole.update(s,h,m,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const d=this._bhScreenVec.x*.5+.5,p=this._bhScreenVec.y*.5+.5,u=this.blackHole.getLOD(),g=u*u*.03;g<.001?(this.camera.layers.enableAll(),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)):(this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(d,p),this.lensingMaterial.uniforms.uLensStrength.value=g,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera),this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0)};t()}dispose(){cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),this.resizeObserver.disconnect(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}const ye=rt({__name:"GalaxyDetail",props:{galaxy:{}},setup(e){const t=e,a=vt(null);let s=null;return gt(()=>{a.value&&(s=new ve(a.value,t.galaxy),s.start())}),St(()=>{s==null||s.dispose(),s=null}),(n,i)=>(A(),G("canvas",{ref_key:"canvasRef",ref:a,class:"galaxy-detail-canvas"},null,512))}}),xe=ct(ye,[["__scopeId","data-v-ca9938ca"]]),be={class:"galaxy-info-card"},Me={class:"info-name"},we={class:"info-row"},Se={key:0,class:"info-row"},ze={class:"info-row"},Re={key:0},Ce={key:1,class:"info-row"},De=rt({__name:"GalaxyInfoCard",props:{galaxy:{}},setup(e){const t=e,a=zt(()=>{const s=t.galaxy,n=[];return s.dm_snia!=null&&n.push("SNIa"),s.dm_tf!=null&&n.push("TF"),s.dm_fp!=null&&n.push("FP"),s.dm_sbf!=null&&n.push("SBF"),s.dm_snii!=null&&n.push("SNII"),s.dm_trgb!=null&&n.push("TRGB"),s.dm_ceph!=null&&n.push("Ceph"),s.dm_mas!=null&&n.push("Mas"),n});return(s,n)=>(A(),G("div",be,[O("div",Me,"PGC "+N(e.galaxy.pgc),1),O("div",we,[n[0]||(n[0]=O("span",{class:"info-label"},"Distance",-1)),X(" "+N(e.galaxy.distance_mpc.toFixed(1))+" Mpc ("+N(Math.round(e.galaxy.distance_mly).toLocaleString())+" Mly) ",1)]),e.galaxy.vcmb!=null?(A(),G("div",Se,[n[1]||(n[1]=O("span",{class:"info-label"},"CMB Velocity",-1)),X(" "+N(e.galaxy.vcmb.toLocaleString())+" km/s ",1)])):V("",!0),O("div",ze,[n[2]||(n[2]=O("span",{class:"info-label"},"DM",-1)),X(" "+N(e.galaxy.dm.toFixed(2)),1),e.galaxy.e_dm!=null?(A(),G("span",Re," ± "+N(e.galaxy.e_dm.toFixed(2)),1)):V("",!0)]),a.value.length>0?(A(),G("div",Ce,[n[3]||(n[3]=O("span",{class:"info-label"},"Methods",-1)),X(" "+N(a.value.join(", ")),1)])):V("",!0)]))}}),_e=ct(De,[["__scopeId","data-v-e6dab61a"]]),Pe={class:"w-full h-full"},Ae={key:2,class:"not-found"},Te=rt({__name:"GalaxyView",setup(e){const t=_t(),{ready:a,isLoading:s,getGalaxyByPgc:n}=Wt(),i=vt(null);return gt(async()=>{await a,i.value=n(Number(t.params.pgc))}),(r,o)=>{const c=Pt("router-link");return A(),G("div",Pe,[i.value?(A(),ht(xe,{key:0,galaxy:i.value},null,8,["galaxy"])):V("",!0),i.value?(A(),ht(_e,{key:1,galaxy:i.value},null,8,["galaxy"])):V("",!0),Rt(c,{to:"/",class:"back-button"},{default:Ct(()=>[...o[0]||(o[0]=[X("← Back",-1)])]),_:1}),!i.value&&!Dt(s)?(A(),G("div",Ae,"Galaxy not found")):V("",!0)])}}}),Be=ct(Te,[["__scopeId","data-v-937748d8"]]);export{Be as default};
