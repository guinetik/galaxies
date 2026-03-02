import{r as E,d as q,o as te,a as ee,c as y,u as oe,b as g,e as _t,F as j,f as s,g as k,w as D,t as m,h as _,i as U,j as J,n as Mt,T as Ct,k as ne,l as z,m as ae,p as se,v as ie,q as Et,s as H,x as tt,y as Bt}from"./index-CoyXcRq5.js";import{V as N,W as le,S as re,G as ce,P as ue,C as de,B as bt,a as St,N as ve,b as Xt,c as X,Q as Dt,d as he,T as pe,e as me,F as fe,M as xe,f as $t,A as ge}from"./three.module-TGhSzrr1.js";import{R as ye,L as kt,C as Q,a as we,b as Me,c as be,D as _e,d as mt,e as zt,M as Ce,S as Se,E as ke,f as Ae}from"./constants-DEjRyabg.js";import{a as Ut,u as Ht}from"./galaxy-CsrVo2xb.js";import{m as Pe,g as Le}from"./GalaxyTextures-AsvTBieS.js";import{_ as lt}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Ft=Math.PI/180;function Ie(d,o,n){const r=d*Ft,u=o*Ft,a=Math.cos(u);return new N(-n*a*Math.sin(r),n*Math.sin(u),-n*a*Math.cos(r))}function Ot(d){const o=ye;if(d>=o[0][0])return o[0][1];if(d<=o[o.length-1][0])return o[o.length-1][1];for(let n=0;n<o.length-1;n++){const[r,u]=o[n],[a,t]=o[n+1];if(d<=r&&d>=a){const i=(r-d)/(r-a);return u*Math.pow(t/u,i)}}return o[o.length-1][1]}function Te(d){return d*13968}function Re(){const d=E(Q),o=E(Ot(Q)),n=E(_e),r=E({azimuth:0,elevation:0});let u=null,a=null,t=null,i=0,e=null,l=null,p=Math.PI,x=1.68,C=!1,A=0,P=0;const $=.003,h=.008;let v=0,f=0;const F=.92,O=.76,G=1e-5,gt=.08,yt=.85,L=.03;let I=Q;const Y=.08;let W=0,et=0,ot=0,V=0;const nt=.04;function rt(c){e=c,u=new le({canvas:c,antialias:!0,alpha:!1}),u.setPixelRatio(Math.min(window.devicePixelRatio,2)),u.setSize(window.innerWidth,window.innerHeight),u.setClearColor(0,1),a=new re,l=new ce,a.add(l),t=new ue(Q,window.innerWidth/window.innerHeight,we,Me),t.position.set(...be),at(),c.addEventListener("pointerdown",S),c.addEventListener("pointermove",Z),c.addEventListener("pointerup",K),c.addEventListener("pointerleave",K),c.addEventListener("wheel",At,{passive:!1}),c.addEventListener("touchstart",Pt,{passive:!1}),c.addEventListener("touchmove",Lt,{passive:!1}),c.addEventListener("touchend",It),window.addEventListener("resize",Tt)}function ct(){return l}function at(){if(!t)return;const c=Math.sin(x)*Math.sin(p),M=Math.cos(x),R=Math.sin(x)*Math.cos(p),B=new N(t.position.x+c*100,t.position.y+M*100,t.position.z+R*100);t.lookAt(B),r.value={azimuth:p*180/Math.PI,elevation:90-x*180/Math.PI}}function ut(c){const M=c*Math.PI/180,R=Q*Math.PI/180,B=Math.tan(M*.5)/Math.tan(R*.5),pt=Math.pow(Math.max(0,B),yt);return Math.max(gt,pt)}function st(c){const M=Math.max(0,Math.min(1,(c-mt)/(Q-mt)));return O+(F-O)*M}function dt(){if(C||Math.abs(v)<G&&Math.abs(f)<G)return;const c=(t==null?void 0:t.fov)??Q,M=st(c);p+=v,x+=f,x=Math.max(.1,Math.min(Math.PI/2+.3,x)),v*=M,f*=M,at()}function b(c){const M=kt[c];M&&(n.value=c,et=(90-M.latitude)/180*Math.PI,ot=-M.longitude/180*Math.PI)}function w(){if(!l)return;const c=et-W,M=ot-V;Math.abs(c)<5e-4&&Math.abs(M)<5e-4?(W=et,V=ot):(W+=c*nt,V+=M*nt),l.rotation.x=W,l.rotation.y=V}function T(){if(!t)return;const c=I-t.fov;Math.abs(c)<.01||(t.fov+=c*Y,t.updateProjectionMatrix(),d.value=t.fov,o.value=Ot(t.fov))}function S(c){ht||(C=!0,A=c.clientX,P=c.clientY,v=0,f=0,e.style.cursor="grabbing",e.setPointerCapture(c.pointerId))}function Z(c){if(!C||ht)return;const M=c.clientX-A,R=c.clientY-P;A=c.clientX,P=c.clientY;const B=(t==null?void 0:t.fov)??Q,Rt=(c.pointerType==="touch"?h:$)*ut(B),Kt=Math.max(-L,Math.min(L,-M*Rt)),Jt=Math.max(-L,Math.min(L,-R*Rt));v=v*.3+Kt*.7,f=f*.3+Jt*.7,p+=v,x+=f,x=Math.max(.1,Math.min(Math.PI/2+.3,x)),at()}function K(c){if(C=!1,e&&(e.style.cursor="grab",(c==null?void 0:c.pointerId)!=null))try{e.releasePointerCapture(c.pointerId)}catch{}}function At(c){c.preventDefault();const M=c.deltaY*.05;I=Math.max(mt,Math.min(zt,I+M))}let vt=0,ht=!1;function Pt(c){if(c.touches.length===2){ht=!0,c.preventDefault();const M=c.touches[0].clientX-c.touches[1].clientX,R=c.touches[0].clientY-c.touches[1].clientY;vt=Math.sqrt(M*M+R*R)}}function Lt(c){if(c.touches.length===2){c.preventDefault();const M=c.touches[0].clientX-c.touches[1].clientX,R=c.touches[0].clientY-c.touches[1].clientY,B=Math.sqrt(M*M+R*R),pt=(vt-B)*.1;vt=B,I=Math.max(mt,Math.min(zt,I+pt))}}function It(c){vt=0,c.touches.length<2&&(ht=!1)}function Tt(){!u||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight))}function Wt(){return a}function jt(){return t}function qt(){return C}function Qt(c){const M=new de;function R(){i=requestAnimationFrame(R);const B=M.getElapsedTime();dt(),w(),T(),c(B),u.render(a,t)}R()}function Zt(){cancelAnimationFrame(i),e&&(e.removeEventListener("pointerdown",S),e.removeEventListener("pointermove",Z),e.removeEventListener("pointerup",K),e.removeEventListener("pointerleave",K),e.removeEventListener("wheel",At),e.removeEventListener("touchstart",Pt),e.removeEventListener("touchmove",Lt),e.removeEventListener("touchend",It)),window.removeEventListener("resize",Tt),u==null||u.dispose()}return{currentFov:d,currentMaxRedshift:o,currentLocation:n,currentLookAt:r,init:rt,getScene:Wt,getCamera:jt,getIsDragging:qt,getPivot:ct,startLoop:Qt,setLocation:b,dispose:Zt}}const Ee=`attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uFov;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < 0.0 || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
  } else {
    float fadeStart = uMaxRedshift * 0.6;
    vAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);
  }

  // Scale size with fade so galaxies grow in as they appear
  float sizeScale = mix(0.5, 1.0, vAlpha);

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  // Default view (60°) stays low-LOD dots; detail appears only once zooming in.
  vDetailMix = smoothstep(52.0, 20.0, uFov);
  float farTwinkleMix = 1.0 - vDetailMix;
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.12 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.05 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * 3.0;
  float detailBoost = mix(1.0, 1.35, vDetailMix);
  float farBoost = mix(1.75, 1.0, vDetailMix);
  gl_PointSize = max(2.8 * uPixelRatio, basePx * detailBoost * farBoost);
  gl_Position = projectionMatrix * mvPosition;
}
`,De=`precision highp float;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;

uniform sampler2D uTexture;

void main() {
  if (vAlpha < 0.01) discard;

  // Radial profile for smooth core + halo.
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float coreMask = 1.0 - smoothstep(0.07, 0.46, dist);
  float haloMask = 1.0 - smoothstep(0.12, 0.62, dist);
  float farStarMix = 1.0 - vDetailMix;
  float markerAlpha = vAlpha * (coreMask * 0.24 + haloMask * 0.07);
  markerAlpha *= mix(2.45, 1.0, vDetailMix);

  // Soft neutral glow avoids the "pixel square" debug look.
  float core = exp(-dist * dist * 20.0);
  vec3 whiteHot = vec3(1.0);
  float whiteMix = clamp(0.3 + farStarMix * 1.0, 0.0, 1.0);
  vec3 markerBaseColor = mix(vColor, whiteHot, whiteMix);
  float outerGlow = (1.0 - smoothstep(0.18, 0.7, dist)) * farStarMix;
  vec3 markerColor = markerBaseColor * (0.98 + core * mix(1.7, 0.45, vDetailMix));
  markerColor += whiteHot * outerGlow * 0.78;

  // Morphology detail from texture atlas.
  float atlasCols = 2.0;
  float atlasRows = 3.0;
  float texIndex = floor(vTexIndex + 0.5);
  float col = mod(texIndex, atlasCols);
  float row = floor(texIndex / atlasCols);

  // Keep sampling away from tile borders to avoid cross-tile bleeding.
  float tileInset = 1.0 / 128.0;
  vec2 localUv = mix(vec2(tileInset), vec2(1.0 - tileInset), gl_PointCoord);
  vec2 tileUv = vec2((col + localUv.x) / atlasCols, (row + localUv.y) / atlasRows);
  vec4 atlasSample = texture2D(uTexture, tileUv);
  float luminance = dot(atlasSample.rgb, vec3(0.2126, 0.7152, 0.0722));
  // Use luminance-driven masking so black tile backgrounds never render as opaque squares.
  float shapeMask = smoothstep(0.03, 0.22, luminance);
  float alphaMask = max(shapeMask * 0.9, atlasSample.a * shapeMask);
  float detailAlpha = alphaMask * vAlpha * vDetailMix * 0.8;
  vec3 detailColor = mix(vColor, atlasSample.rgb, 0.8) * 1.08;

  float finalAlpha = clamp(markerAlpha + detailAlpha * (1.0 - markerAlpha), 0.0, 1.0);
  if (finalAlpha < 0.01) discard;
  vec3 finalColor = mix(markerColor, detailColor, clamp(detailAlpha, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;class $e{constructor(o,n){this.tempLocal=new N,this.tempWorld=new N,this.galaxies=o,this.atlasTexture=n,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.geometry=new bt,this.material=new St({vertexShader:Ee,fragmentShader:De,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:n}},transparent:!0,depthWrite:!1,blending:ve}),this.points=new Xt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(o)}rebuild(o){this.galaxies=o;const n=o.length,r=new Float32Array(n*3),u=new Float32Array(n*3),a=new Float32Array(n),t=new Float32Array(n),i=new Float32Array(n);for(let e=0;e<n;e++){const l=o[e],p=Ie(l.ra,l.dec,Se);r[e*3]=p.x,r[e*3+1]=p.y,r[e*3+2]=p.z;const x=Ut(l.pgc),C=Ce[x],A=l.pgc*2654435761>>>0,P=(A>>>8)%1024/1023,$=(A>>>18)%1024/1023,h=.9+P*.22,v=($-.5)*.08;u[e*3]=Math.min(1,Math.max(0,C[0]*h+v*.5)),u[e*3+1]=Math.min(1,Math.max(0,C[1]*h)),u[e*3+2]=Math.min(1,Math.max(0,C[2]*h-v*.6));const f=8;a[e]=Math.max(1.5,Math.min(12,f/l.distance_mpc)),t[e]=(l.vcmb??0)/299792.458,i[e]=Pe(x)}this.positions=r,this.sizes=a,this.redshifts=t,this.geometry.dispose(),this.geometry=new bt,this.geometry.setAttribute("position",new X(r,3)),this.geometry.setAttribute("aColor",new X(u,3)),this.geometry.setAttribute("aSize",new X(a,1)),this.geometry.setAttribute("aRedshift",new X(t,1)),this.geometry.setAttribute("aTexIndex",new X(i,1)),this.points.geometry=this.geometry}update(o,n,r){this.material.uniforms.uTime.value=o,this.material.uniforms.uMaxRedshift.value=n,this.material.uniforms.uFov.value=r}pickGalaxyAtScreen(o,n,r,u,a,t,i){this.points.updateWorldMatrix(!0,!1);let e=-1,l=Number.POSITIVE_INFINITY;const p=Math.min(window.devicePixelRatio,2),x=this.smoothstep(0,1,this.clamp01((52-i)/32));for(let C=0;C<this.galaxies.length;C++){const A=this.computeVisibilityAlpha(this.redshifts[C],t);if(A<.01)continue;const P=C*3;if(this.tempLocal.set(this.positions[P],this.positions[P+1],this.positions[P+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(r),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const $=(this.tempWorld.x*.5+.5)*u,h=(-this.tempWorld.y*.5+.5)*a,f=this.estimatePointSizePx(this.sizes[C],A,p,i,x)*.5,F=o-$,O=n-h;if(Math.abs(F)>f||Math.abs(O)>f)continue;const G=F*F+O*O;G<l&&(l=G,e=C)}return e>=0?this.galaxies[e]:null}estimatePointSizePx(o,n,r,u,a){const t=.5+.5*n,i=60/u,e=o*r*i*t*3,l=1+.35*a,p=1.75-.75*a;return Math.max(2.8*r,e*l*p)}computeVisibilityAlpha(o,n){if(o<0||o>n)return 0;const r=n*.6;return o<r?1:this.smoothstep(n,r,o)}clamp01(o){return Math.max(0,Math.min(1,o))}smoothstep(o,n,r){const u=this.clamp01((r-o)/(n-o));return u*u*(3-2*u)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const ze="/assets/earth_day-DkcerPt2.jpg",Fe=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Oe=`
uniform sampler2D uDayMap;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(-vPosition);
  float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Earth texture — slightly dimmed for night-sky feel
  vec3 texColor = texture2D(uDayMap, vUv).rgb * 0.6;

  // Atmospheric glow at edges (Fresnel)
  vec3 atmosColor = vec3(0.15, 0.35, 0.65);
  vec3 finalColor = mix(texColor, atmosColor, fresnel * 0.8);

  gl_FragColor = vec4(finalColor, 1.0);
}
`,Ne=.04;class Ge{constructor(){this.texture=null,this.currentQuat=new Dt,this.targetQuat=new Dt;const o=new he(ke,64,64),n=new pe().load(ze);n.colorSpace=me,this.texture=n;const r=new St({vertexShader:Fe,fragmentShader:Oe,uniforms:{uDayMap:{value:n}},side:fe,depthWrite:!0});this.mesh=new xe(o,r),this.mesh.position.set(0,Ae,0),this.mesh.renderOrder=-1}setLocation(o,n){const r=o*Math.PI/180,a=n*Math.PI/180+Math.PI,t=Math.PI/2-r,i=new N(-Math.cos(a)*Math.sin(t),Math.cos(t),Math.sin(a)*Math.sin(t)).normalize(),e=new N(0,1,0),l=i.clone(),p=new N;Math.abs(l.y)>.99?p.set(0,0,-1):p.copy(e).sub(l.clone().multiplyScalar(e.dot(l))).normalize();const x=new N().crossVectors(p,l).normalize(),C=new $t().makeBasis(x,l,p),P=new $t().makeBasis(new N(1,0,0),new N(0,1,0),new N(0,0,-1)).multiply(C.transpose());this.targetQuat.setFromRotationMatrix(P)}update(){this.currentQuat.slerp(this.targetQuat,Ne),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var o;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(o=this.texture)==null||o.dispose()}}const it=14e3,wt=800,Ye=1.15;class Ve{constructor(){const o=new Float32Array(it*3),n=new Float32Array(it),r=new Float32Array(it),u=new Float32Array(it*3),a=new Float32Array(it);for(let e=0;e<it;e++){const l=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);o[e*3]=wt*Math.sin(p)*Math.cos(l),o[e*3+1]=wt*Math.cos(p),o[e*3+2]=wt*Math.sin(p)*Math.sin(l),n[e]=Ye*(.35+Math.random()*.85),r[e]=.18+Math.random()*.42,a[e]=Math.random()*Math.PI*2;const x=Math.random();x<.55?(u[e*3]=.8+Math.random()*.12,u[e*3+1]=.85+Math.random()*.1,u[e*3+2]=.95+Math.random()*.05):x<.88?(u[e*3]=.95+Math.random()*.05,u[e*3+1]=.92+Math.random()*.07,u[e*3+2]=.82+Math.random()*.12):(u[e*3]=.75+Math.random()*.2,u[e*3+1]=.82+Math.random()*.14,u[e*3+2]=.95+Math.random()*.05)}const t=new bt;t.setAttribute("position",new X(o,3)),t.setAttribute("aSize",new X(n,1)),t.setAttribute("aOpacity",new X(r,1)),t.setAttribute("aColor",new X(u,3)),t.setAttribute("aPhase",new X(a,1));const i=new St({vertexShader:`
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        attribute float aPhase;
        uniform float uTime;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = aColor;

          // Subtle twinkle
          float twinkle = sin(uTime * 1.5 + aPhase) * 0.2 + 0.8;
          vOpacity *= twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (800.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        precision mediump float;

        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          // Soft circular point
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:ge,uniforms:{uTime:{value:0}}});this.points=new Xt(t,i),this.points.frustumCulled=!1}update(o){this.points.material.uniforms.uTime.value=o}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const Nt=5,Be=q({__name:"GalaxyCanvas",emits:["ready","hover"],setup(d,{expose:o,emit:n}){const r=n,u=oe(),a=E(null),{currentFov:t,currentMaxRedshift:i,currentLocation:e,currentLookAt:l,init:p,getScene:x,getCamera:C,getIsDragging:A,getPivot:P,startLoop:$,setLocation:h,dispose:v}=Re(),{ready:f,getAllGalaxies:F}=Ht();function O(b){h(b);const w=kt[b];w&&I&&I.setLocation(w.latitude,w.longitude)}let G=[];function gt(b,w){if(!L)return 0;const T=G.filter(S=>{const Z=Ut(S.pgc,S.morphology);return b.has(Z)&&w.has(S.source??"CF4")});return L.rebuild(T),T.length}function yt(){return G.length}o({currentFov:t,currentMaxRedshift:i,currentLocation:e,currentLookAt:l,setLocation:O,applyFilter:gt,getAllGalaxiesCount:yt});let L=null,I=null,Y=null,W=!1,et=0,ot=0,V=!1,nt=!1;function rt(b){if(!L||!a.value)return null;const w=a.value.getBoundingClientRect(),T=b.clientX-w.left,S=b.clientY-w.top;return T<0||S<0||T>w.width||S>w.height?null:L.pickGalaxyAtScreen(T,S,C(),w.width,w.height,i.value,t.value)}function ct(b){if(W){const T=b.clientX-et,S=b.clientY-ot;T*T+S*S>Nt*Nt&&(V=!0)}if(A()){r("hover",null);return}const w=rt(b);w?(a.value.style.cursor="pointer",r("hover",{galaxy:w,screenX:b.clientX,screenY:b.clientY})):(a.value.style.cursor="grab",r("hover",null))}function at(){W=!1,V=!1,r("hover",null)}function ut(b){W=!0,et=b.clientX,ot=b.clientY,V=!1}function st(){V&&(nt=!0),W=!1,V=!1}function dt(b){if(nt){nt=!1;return}if(A())return;const w=rt(b);w&&u.push(`/g/${w.pgc}`)}return te(async()=>{if(!a.value)return;p(a.value);const b=x(),w=P();await f,G=F();const T=Le();L=new $e(G,T),I=new Ge,Y=new Ve,w.add(Y.points),w.add(L.points),b.add(I.mesh),$(S=>{L==null||L.update(S,i.value,t.value),Y==null||Y.update(S),I==null||I.update()}),a.value.addEventListener("pointermove",ct),a.value.addEventListener("pointerdown",ut),a.value.addEventListener("pointerup",st),a.value.addEventListener("pointercancel",st),a.value.addEventListener("pointerleave",at),a.value.addEventListener("click",dt),r("ready")}),ee(()=>{var b,w,T,S,Z,K;(b=a.value)==null||b.removeEventListener("pointermove",ct),(w=a.value)==null||w.removeEventListener("pointerdown",ut),(T=a.value)==null||T.removeEventListener("pointerup",st),(S=a.value)==null||S.removeEventListener("pointercancel",st),(Z=a.value)==null||Z.removeEventListener("pointerleave",at),(K=a.value)==null||K.removeEventListener("click",dt),L==null||L.dispose(),I==null||I.dispose(),Y==null||Y.dispose(),v()}),(b,w)=>(g(),y("canvas",{ref_key:"canvasRef",ref:a,class:"fixed inset-0 w-full h-full galaxy-canvas"},null,512))}}),Xe=lt(Be,[["__scopeId","data-v-058cc152"]]),Ue={class:"fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm"},He={class:"hidden md:flex items-center gap-4"},We={class:"hidden md:flex items-center gap-4"},je={key:0,class:"text-xs text-white/50"},qe=["value"],Qe=["value"],Ze=["value"],Ke={class:"md:hidden flex items-center gap-2"},Je={key:0,class:"text-xs text-white/50 shrink-0"},to=["aria-expanded"],eo={class:"mobile-menu-controls"},oo={class:"mobile-label"},no=["value"],ao=["value"],so={class:"mobile-menu-controls"},io={class:"mobile-label"},lo=["value"],ro=q({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(d){const o=E(!1),{t:n,locale:r}=_t(),u=Object.keys(kt);function a(t){r.value=t,localStorage.setItem("locale",t)}return(t,i)=>{const e=ne("router-link");return g(),y(j,null,[s("header",Ue,[k(e,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors shrink-0"},{default:D(()=>[z(m(_(n)("header.siteName")),1)]),_:1}),s("nav",He,[k(e,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[z(m(_(n)("nav.about")),1)]),_:1}),k(e,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[z(m(_(n)("nav.map")),1)]),_:1}),k(e,{to:"/cosmography",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[z(m(_(n)("nav.cosmography")),1)]),_:1}),k(e,{to:"/spacetime",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[z(m(_(n)("nav.spacetime")),1)]),_:1})]),s("div",We,[d.galaxyCount>0?(g(),y("span",je,m(_(n)("app.loaded",{count:d.galaxyCount.toLocaleString()})),1)):U("",!0),s("select",{value:d.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[0]||(i[0]=l=>t.$emit("update:location",l.target.value))},[(g(!0),y(j,null,J(_(u),l=>(g(),y("option",{key:l,value:l,class:"bg-gray-900"},m(l),9,Qe))),128))],40,qe),s("select",{value:_(r),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[1]||(i[1]=l=>a(l.target.value))},[...i[12]||(i[12]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,Ze)]),s("div",Ke,[d.galaxyCount>0?(g(),y("span",Je,m(d.galaxyCount.toLocaleString()),1)):U("",!0),s("button",{type:"button",class:Mt(["hamburger p-2 -mr-2 text-white/80 hover:text-white transition-colors",{"is-open":o.value}]),"aria-expanded":o.value,"aria-label":"Toggle menu",onClick:i[2]||(i[2]=l=>o.value=!o.value)},[...i[13]||(i[13]=[s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1)])],10,to)])]),k(Ct,{name:"menu"},{default:D(()=>[ae(s("div",{class:"mobile-menu-overlay md:hidden",onClick:i[11]||(i[11]=l=>o.value=!1)},[s("nav",{class:"mobile-menu",onClick:i[10]||(i[10]=se(()=>{},["stop"]))},[k(e,{to:"/",class:"mobile-link",onClick:i[3]||(i[3]=l=>o.value=!1)},{default:D(()=>[z(m(_(n)("nav.home")),1)]),_:1}),k(e,{to:"/about",class:"mobile-link",onClick:i[4]||(i[4]=l=>o.value=!1)},{default:D(()=>[z(m(_(n)("nav.about")),1)]),_:1}),k(e,{to:"/map",class:"mobile-link",onClick:i[5]||(i[5]=l=>o.value=!1)},{default:D(()=>[z(m(_(n)("nav.map")),1)]),_:1}),k(e,{to:"/cosmography",class:"mobile-link",onClick:i[6]||(i[6]=l=>o.value=!1)},{default:D(()=>[z(m(_(n)("nav.cosmography")),1)]),_:1}),k(e,{to:"/spacetime",class:"mobile-link",onClick:i[7]||(i[7]=l=>o.value=!1)},{default:D(()=>[z(m(_(n)("nav.spacetime")),1)]),_:1}),i[15]||(i[15]=s("div",{class:"mobile-menu-divider"},null,-1)),s("div",eo,[s("label",oo,m(_(n)("header.location")),1),s("select",{value:d.currentLocation,class:"mobile-select",onChange:i[8]||(i[8]=l=>t.$emit("update:location",l.target.value))},[(g(!0),y(j,null,J(_(u),l=>(g(),y("option",{key:l,value:l,class:"bg-gray-900"},m(l),9,ao))),128))],40,no)]),s("div",so,[s("label",io,m(_(n)("header.language")),1),s("select",{value:_(r),class:"mobile-select",onChange:i[9]||(i[9]=l=>a(l.target.value))},[...i[14]||(i[14]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,lo)])])],512),[[ie,o.value]])]),_:1})],64)}}}),co=lt(ro,[["__scopeId","data-v-88115abc"]]),uo={key:0,class:"pill-count"},vo={key:0,class:"filter-panel"},ho={class:"panel-header"},po={class:"panel-title"},mo={class:"section"},fo={class:"section-label"},xo={class:"chip-row"},go=["onClick"],yo={class:"section"},wo={class:"section-label"},Mo={class:"chip-row"},bo=["onClick"],_o={class:"panel-footer"},Co=q({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(d,{emit:o}){const{t:n}=_t(),r=d,u=o,a=E(!1),t=["spiral","barred","elliptical","lenticular","irregular"],i=["CF4","ALFALFA","FSS","UGC"],e=Et(new Set(t)),l=Et(new Set(i)),p=H(()=>e.size<t.length||l.size<i.length),x=H(()=>r.filteredCount.toLocaleString()),C=H(()=>r.totalCount.toLocaleString());function A(h){e.has(h)?e.size>1&&e.delete(h):e.add(h),$()}function P(h){l.has(h)?l.size>1&&l.delete(h):l.add(h),$()}function $(){u("filter-change",{morphologies:new Set(e),sources:new Set(l)})}return(h,v)=>(g(),y(j,null,[a.value?U("",!0):(g(),y("button",{key:0,class:"filter-pill",onClick:v[0]||(v[0]=f=>a.value=!0)},[v[2]||(v[2]=s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),s("span",null,m(_(n)("pages.home.filter")),1),p.value?(g(),y("span",uo,m(x.value),1)):U("",!0)])),k(Ct,{name:"panel"},{default:D(()=>[a.value?(g(),y("div",vo,[s("div",ho,[s("span",po,m(_(n)("pages.home.filter")),1),s("button",{class:"close-btn",onClick:v[1]||(v[1]=f=>a.value=!1),"aria-label":"Close"},[...v[3]||(v[3]=[s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),s("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),s("div",mo,[s("div",fo,m(_(n)("pages.home.morphologyLabel")),1),s("div",xo,[(g(),y(j,null,J(t,f=>s("button",{key:f,class:Mt(["chip",{active:e.has(f)}]),onClick:F=>A(f)},m(_(n)("morphology."+f)),11,go)),64))])]),s("div",yo,[s("div",wo,m(_(n)("pages.home.catalogLabel")),1),s("div",Mo,[(g(),y(j,null,J(i,f=>s("button",{key:f,class:Mt(["chip",{active:l.has(f)}]),onClick:F=>P(f)},m(f),11,bo)),64))])]),s("div",_o,m(_(n)("pages.home.showing",{count:x.value,total:C.value})),1)])):U("",!0)]),_:1})],64))}}),So=lt(Co,[["__scopeId","data-v-647995f5"]]),ko={class:"tooltip-name"},Ao={class:"tooltip-row"},Po={key:0,class:"tooltip-row"},Lo=q({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{}},setup(d){return(o,n)=>d.galaxy?(g(),y("div",{key:0,class:"galaxy-tooltip",style:tt({left:d.x+"px",top:d.y+"px"})},[s("div",ko,"PGC "+m(d.galaxy.pgc),1),s("div",Ao,[n[0]||(n[0]=s("span",{class:"tooltip-label"},"Distance",-1)),z(" "+m(Math.round(d.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),d.galaxy.vcmb!=null?(g(),y("div",Po,[n[1]||(n[1]=s("span",{class:"tooltip-label"},"Velocity",-1)),z(" "+m(d.galaxy.vcmb.toLocaleString())+" km/s ",1)])):U("",!0)],4)):U("",!0)}}),Io=lt(Lo,[["__scopeId","data-v-8a9f4504"]]),To={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},Ro={class:"text-center"},Eo={class:"text-sm text-white/70 tracking-wide"},Do=q({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(d){const{t:o}=_t();return(n,r)=>(g(),Bt(Ct,{name:"fade"},{default:D(()=>[d.isLoading?(g(),y("div",To,[s("div",Ro,[r[0]||(r[0]=s("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),s("p",Eo,m(_(o)("app.loading")),1)])])):U("",!0)]),_:1}))}}),$o=lt(Do,[["__scopeId","data-v-c1ac9ae0"]]),zo={class:"space-compass pointer-events-none select-none"},Fo={class:"compass-tape relative w-full h-12 overflow-hidden"},Oo={key:0,class:"w-px h-3 bg-white/40 flex-none"},No={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},Go={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Gt=4,Yo=q({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(d){const o=d,n=H(()=>o.azimuth*Gt),r=H(()=>{const u=o.azimuth,a=500,t=Math.floor(u-a),i=Math.ceil(u+a),e=[];for(let l=t;l<=i;l++){let p=l%360;p<0&&(p+=360);const x=p%15===0;(p%5===0||x)&&e.push({value:l,offset:l*Gt,isMajor:x,label:x?`${Math.round(p)}°`:null})}return e});return(u,a)=>(g(),y("div",zo,[s("div",Fo,[a[0]||(a[0]=s("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[s("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),s("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),s("div",{class:"absolute top-0 h-full will-change-transform",style:tt({transform:`translateX(calc(50% - ${n.value}px))`})},[(g(!0),y(j,null,J(r.value,t=>(g(),y("div",{key:t.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:tt({left:`${t.offset}px`})},[t.isMajor?(g(),y("div",Oo)):(g(),y("div",No)),t.label?(g(),y("div",Go,m(t.label),1)):U("",!0)],4))),128))],4),a[1]||(a[1]=s("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Vo=lt(Yo,[["__scopeId","data-v-6e465829"]]),Bo={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Xo={class:"relative w-full h-full"},Uo={class:"mr-2 text-[10px] font-mono text-white/30"},Ho={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},ft=0,Yt=1600,Wo=q({__name:"DistanceIndicator",props:{distance:{}},setup(d){const o=d,n=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function r(a){return(1-(a-ft)/(Yt-ft))*100}const u=H(()=>{const a=(o.distance-ft)/(Yt-ft);return(1-Math.max(0,Math.min(1,a)))*100});return(a,t)=>(g(),y("div",Bo,[t[2]||(t[2]=s("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Xo,[(g(),y(j,null,J(n,i=>s("div",{key:i.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:tt({top:`${r(i.value)}%`})},[s("span",Uo,m(i.label),1),t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),s("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:tt({top:`${u.value}%`})},[s("span",Ho,m(Math.round(d.distance))+" mLY ",1),t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),jo={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},qo={class:"relative w-full h-full"},Qo={class:"ml-2 text-[10px] font-mono text-white/30"},Zo={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},xt=-90,Vt=90,Ko=q({__name:"ElevationIndicator",props:{elevation:{}},setup(d){const o=d,n=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function r(a){return(1-(a-xt)/(Vt-xt))*100}const u=H(()=>{const a=(o.elevation-xt)/(Vt-xt);return(1-Math.max(0,Math.min(1,a)))*100});return(a,t)=>(g(),y("div",jo,[t[2]||(t[2]=s("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",qo,[(g(),y(j,null,J(n,i=>s("div",{key:i.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:tt({top:`${r(i.value)}%`})},[t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),s("span",Qo,m(i.label),1)],4)),64)),s("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:tt({top:`${u.value}%`})},[t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),s("span",Zo,m(Math.round(d.elevation))+"° ",1)],4)])]))}}),Jo={class:"w-full h-full"},tn={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center"},en={class:"w-full max-w-3xl"},on={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},nn={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},dn=q({__name:"HomeView",setup(d){const{isLoading:o,galaxyCount:n}=Ht(),r=E(null),u=E(!1),a=E(0),t=E(0),i=E(null),e=E(0),l=E(0),p=H(()=>{var h,v;return((v=(h=r.value)==null?void 0:h.currentLookAt)==null?void 0:v.azimuth)??0}),x=H(()=>{var h,v;return((v=(h=r.value)==null?void 0:h.currentLookAt)==null?void 0:v.elevation)??0}),C=H(()=>{var v;const h=((v=r.value)==null?void 0:v.currentMaxRedshift)??0;return Te(h)});function A(){var v;u.value=!0;const h=((v=r.value)==null?void 0:v.getAllGalaxiesCount())??0;a.value=h,t.value=h}function P(h){var f;const v=((f=r.value)==null?void 0:f.applyFilter(h.morphologies,h.sources))??0;t.value=v}function $(h){h?(i.value=h.galaxy,e.value=h.screenX,l.value=h.screenY):i.value=null}return(h,v)=>{var f;return g(),y("div",Jo,[k(Xe,{ref_key:"canvasRef",ref:r,onReady:A,onHover:$},null,512),k(co,{"galaxy-count":_(n),"current-location":((f=r.value)==null?void 0:f.currentLocation)??"North Pole","onUpdate:location":v[0]||(v[0]=F=>{var O;return(O=r.value)==null?void 0:O.setLocation(F)})},null,8,["galaxy-count","current-location"]),s("div",tn,[s("div",en,[k(Vo,{azimuth:p.value},null,8,["azimuth"])])]),s("div",on,[k(Wo,{distance:C.value},null,8,["distance"])]),s("div",nn,[k(Ko,{elevation:x.value},null,8,["elevation"])]),u.value?(g(),Bt(So,{key:0,"total-count":a.value,"filtered-count":t.value,onFilterChange:P},null,8,["total-count","filtered-count"])):U("",!0),k(Io,{galaxy:i.value,x:e.value,y:l.value},null,8,["galaxy","x","y"]),k($o,{"is-loading":_(o)},null,8,["is-loading"])])}}});export{dn as default};
