import{r as I,d as j,o as Zt,a as Kt,c as g,u as Jt,b as x,e as bt,F as H,f as s,g as k,w as D,t as m,h as _,i as V,j as J,n as yt,T as _t,k as te,l as O,m as ee,p as oe,v as ne,q as Rt,s as X,x as tt,y as Gt}from"./index-wwCqI4fw.js";import{V as G,W as ae,S as se,G as ie,P as le,C as re,B as Mt,a as Ct,N as ce,b as Yt,c as B,Q as Tt,d as ue,T as de,e as ve,F as he,M as pe,f as It,A as me}from"./three.module-TGhSzrr1.js";import{R as fe,L as St,C as Z,a as xe,b as ge,c as we,D as ye,d as mt,e as Et,M as Me,S as be,E as _e,f as Ce}from"./constants-DEjRyabg.js";import{a as Bt,u as Vt}from"./galaxy-BxA1ibco.js";import{m as Se,g as ke}from"./GalaxyTextures-AsvTBieS.js";import{_ as ct}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Dt=Math.PI/180;function Ae(d,e,n){const r=d*Dt,c=e*Dt,a=Math.cos(c);return new G(-n*a*Math.sin(r),n*Math.sin(c),-n*a*Math.cos(r))}function $t(d){const e=fe;if(d>=e[0][0])return e[0][1];if(d<=e[e.length-1][0])return e[e.length-1][1];for(let n=0;n<e.length-1;n++){const[r,c]=e[n],[a,t]=e[n+1];if(d<=r&&d>=a){const i=(r-d)/(r-a);return c*Math.pow(t/c,i)}}return e[e.length-1][1]}function Pe(d){return d*13968}function Le(){const d=I(Z),e=I($t(Z)),n=I(ye),r=I({azimuth:0,elevation:0});let c=null,a=null,t=null,i=0,o=null,l=null,p=Math.PI,f=1.68,C=!1,P=0,L=0;const $=.003;let v=0,h=0;const M=.92,z=.76,N=1e-5,U=.08,gt=.85,et=.03;let A=Z;const F=.08;let E=0,q=0,ot=0,K=0;const Q=.04;function lt(u){o=u,c=new ae({canvas:u,antialias:!0,alpha:!1}),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.setSize(window.innerWidth,window.innerHeight),c.setClearColor(0,1),a=new se,l=new ie,a.add(l),t=new le(Z,window.innerWidth/window.innerHeight,xe,ge),t.position.set(...we),nt(),u.addEventListener("pointerdown",R),u.addEventListener("pointermove",S),u.addEventListener("pointerup",W),u.addEventListener("pointerleave",W),u.addEventListener("wheel",rt,{passive:!1}),u.addEventListener("touchstart",kt,{passive:!1}),u.addEventListener("touchmove",At,{passive:!1}),u.addEventListener("touchend",Pt),window.addEventListener("resize",Lt)}function ut(){return l}function nt(){if(!t)return;const u=Math.sin(f)*Math.sin(p),y=Math.cos(f),T=Math.sin(f)*Math.cos(p),Y=new G(t.position.x+u*100,t.position.y+y*100,t.position.z+T*100);t.lookAt(Y),r.value={azimuth:p*180/Math.PI,elevation:90-f*180/Math.PI}}function dt(u){const y=u*Math.PI/180,T=Z*Math.PI/180,Y=Math.tan(y*.5)/Math.tan(T*.5),st=Math.pow(Math.max(0,Y),gt);return Math.max(U,st)}function vt(u){const y=Math.max(0,Math.min(1,(u-mt)/(Z-mt)));return z+(M-z)*y}function at(){if(C||Math.abs(v)<N&&Math.abs(h)<N)return;const u=(t==null?void 0:t.fov)??Z,y=vt(u);p+=v,f+=h,f=Math.max(.1,Math.min(Math.PI/2+.3,f)),v*=y,h*=y,nt()}function ht(u){const y=St[u];y&&(n.value=u,q=(90-y.latitude)/180*Math.PI,ot=-y.longitude/180*Math.PI)}function b(){if(!l)return;const u=q-E,y=ot-K;Math.abs(u)<5e-4&&Math.abs(y)<5e-4?(E=q,K=ot):(E+=u*Q,K+=y*Q),l.rotation.x=E,l.rotation.y=K}function w(){if(!t)return;const u=A-t.fov;Math.abs(u)<.01||(t.fov+=u*F,t.updateProjectionMatrix(),d.value=t.fov,e.value=$t(t.fov))}function R(u){C=!0,P=u.clientX,L=u.clientY,v=0,h=0,o.style.cursor="grabbing"}function S(u){if(!C)return;const y=u.clientX-P,T=u.clientY-L;P=u.clientX,L=u.clientY;const Y=(t==null?void 0:t.fov)??Z,st=$*dt(Y),qt=Math.max(-et,Math.min(et,-y*st)),Qt=Math.max(-et,Math.min(et,-T*st));v=v*.3+qt*.7,h=h*.3+Qt*.7,p+=v,f+=h,f=Math.max(.1,Math.min(Math.PI/2+.3,f)),nt()}function W(){C=!1,o&&(o.style.cursor="grab")}function rt(u){u.preventDefault();const y=u.deltaY*.05;A=Math.max(mt,Math.min(Et,A+y))}let pt=0;function kt(u){if(u.touches.length===2){u.preventDefault();const y=u.touches[0].clientX-u.touches[1].clientX,T=u.touches[0].clientY-u.touches[1].clientY;pt=Math.sqrt(y*y+T*T)}}function At(u){if(u.touches.length===2){u.preventDefault();const y=u.touches[0].clientX-u.touches[1].clientX,T=u.touches[0].clientY-u.touches[1].clientY,Y=Math.sqrt(y*y+T*T),st=(pt-Y)*.1;pt=Y,A=Math.max(mt,Math.min(Et,A+st))}}function Pt(){pt=0}function Lt(){!c||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),c.setSize(window.innerWidth,window.innerHeight))}function Xt(){return a}function Ut(){return t}function Wt(){return C}function Ht(u){const y=new re;function T(){i=requestAnimationFrame(T);const Y=y.getElapsedTime();at(),b(),w(),u(Y),c.render(a,t)}T()}function jt(){cancelAnimationFrame(i),o&&(o.removeEventListener("pointerdown",R),o.removeEventListener("pointermove",S),o.removeEventListener("pointerup",W),o.removeEventListener("pointerleave",W),o.removeEventListener("wheel",rt),o.removeEventListener("touchstart",kt),o.removeEventListener("touchmove",At),o.removeEventListener("touchend",Pt)),window.removeEventListener("resize",Lt),c==null||c.dispose()}return{currentFov:d,currentMaxRedshift:e,currentLocation:n,currentLookAt:r,init:lt,getScene:Xt,getCamera:Ut,getIsDragging:Wt,getPivot:ut,startLoop:Ht,setLocation:ht,dispose:jt}}const Re=`attribute float aSize;
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
`,Te=`precision highp float;

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
`;class Ie{constructor(e,n){this.tempLocal=new G,this.tempWorld=new G,this.galaxies=e,this.atlasTexture=n,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.geometry=new Mt,this.material=new Ct({vertexShader:Re,fragmentShader:Te,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:n}},transparent:!0,depthWrite:!1,blending:ce}),this.points=new Yt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(e)}rebuild(e){this.galaxies=e;const n=e.length,r=new Float32Array(n*3),c=new Float32Array(n*3),a=new Float32Array(n),t=new Float32Array(n),i=new Float32Array(n);for(let o=0;o<n;o++){const l=e[o],p=Ae(l.ra,l.dec,be);r[o*3]=p.x,r[o*3+1]=p.y,r[o*3+2]=p.z;const f=Bt(l.pgc),C=Me[f],P=l.pgc*2654435761>>>0,L=(P>>>8)%1024/1023,$=(P>>>18)%1024/1023,v=.9+L*.22,h=($-.5)*.08;c[o*3]=Math.min(1,Math.max(0,C[0]*v+h*.5)),c[o*3+1]=Math.min(1,Math.max(0,C[1]*v)),c[o*3+2]=Math.min(1,Math.max(0,C[2]*v-h*.6));const M=8;a[o]=Math.max(1.5,Math.min(12,M/l.distance_mpc)),t[o]=(l.vcmb??0)/299792.458,i[o]=Se(f)}this.positions=r,this.sizes=a,this.redshifts=t,this.geometry.dispose(),this.geometry=new Mt,this.geometry.setAttribute("position",new B(r,3)),this.geometry.setAttribute("aColor",new B(c,3)),this.geometry.setAttribute("aSize",new B(a,1)),this.geometry.setAttribute("aRedshift",new B(t,1)),this.geometry.setAttribute("aTexIndex",new B(i,1)),this.points.geometry=this.geometry}update(e,n,r){this.material.uniforms.uTime.value=e,this.material.uniforms.uMaxRedshift.value=n,this.material.uniforms.uFov.value=r}pickGalaxyAtScreen(e,n,r,c,a,t,i){this.points.updateWorldMatrix(!0,!1);let o=-1,l=Number.POSITIVE_INFINITY;const p=Math.min(window.devicePixelRatio,2),f=this.smoothstep(0,1,this.clamp01((52-i)/32));for(let C=0;C<this.galaxies.length;C++){const P=this.computeVisibilityAlpha(this.redshifts[C],t);if(P<.01)continue;const L=C*3;if(this.tempLocal.set(this.positions[L],this.positions[L+1],this.positions[L+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(r),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const $=(this.tempWorld.x*.5+.5)*c,v=(-this.tempWorld.y*.5+.5)*a,M=this.estimatePointSizePx(this.sizes[C],P,p,i,f)*.5,z=e-$,N=n-v;if(Math.abs(z)>M||Math.abs(N)>M)continue;const U=z*z+N*N;U<l&&(l=U,o=C)}return o>=0?this.galaxies[o]:null}estimatePointSizePx(e,n,r,c,a){const t=.5+.5*n,i=60/c,o=e*r*i*t*3,l=1+.35*a,p=1.75-.75*a;return Math.max(2.8*r,o*l*p)}computeVisibilityAlpha(e,n){if(e<0||e>n)return 0;const r=n*.6;return e<r?1:this.smoothstep(n,r,e)}clamp01(e){return Math.max(0,Math.min(1,e))}smoothstep(e,n,r){const c=this.clamp01((r-e)/(n-e));return c*c*(3-2*c)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const Ee="/assets/earth_day-DkcerPt2.jpg",De=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,$e=`
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
`,ze=.04;class Fe{constructor(){this.texture=null,this.currentQuat=new Tt,this.targetQuat=new Tt;const e=new ue(_e,64,64),n=new de().load(Ee);n.colorSpace=ve,this.texture=n;const r=new Ct({vertexShader:De,fragmentShader:$e,uniforms:{uDayMap:{value:n}},side:he,depthWrite:!0});this.mesh=new pe(e,r),this.mesh.position.set(0,Ce,0),this.mesh.renderOrder=-1}setLocation(e,n){const r=e*Math.PI/180,a=n*Math.PI/180+Math.PI,t=Math.PI/2-r,i=new G(-Math.cos(a)*Math.sin(t),Math.cos(t),Math.sin(a)*Math.sin(t)).normalize(),o=new G(0,1,0),l=i.clone(),p=new G;Math.abs(l.y)>.99?p.set(0,0,-1):p.copy(o).sub(l.clone().multiplyScalar(o.dot(l))).normalize();const f=new G().crossVectors(p,l).normalize(),C=new It().makeBasis(f,l,p),L=new It().makeBasis(new G(1,0,0),new G(0,1,0),new G(0,0,-1)).multiply(C.transpose());this.targetQuat.setFromRotationMatrix(L)}update(){this.currentQuat.slerp(this.targetQuat,ze),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var e;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(e=this.texture)==null||e.dispose()}}const it=14e3,wt=800,Oe=1.15;class Ne{constructor(){const e=new Float32Array(it*3),n=new Float32Array(it),r=new Float32Array(it),c=new Float32Array(it*3),a=new Float32Array(it);for(let o=0;o<it;o++){const l=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);e[o*3]=wt*Math.sin(p)*Math.cos(l),e[o*3+1]=wt*Math.cos(p),e[o*3+2]=wt*Math.sin(p)*Math.sin(l),n[o]=Oe*(.35+Math.random()*.85),r[o]=.18+Math.random()*.42,a[o]=Math.random()*Math.PI*2;const f=Math.random();f<.55?(c[o*3]=.8+Math.random()*.12,c[o*3+1]=.85+Math.random()*.1,c[o*3+2]=.95+Math.random()*.05):f<.88?(c[o*3]=.95+Math.random()*.05,c[o*3+1]=.92+Math.random()*.07,c[o*3+2]=.82+Math.random()*.12):(c[o*3]=.75+Math.random()*.2,c[o*3+1]=.82+Math.random()*.14,c[o*3+2]=.95+Math.random()*.05)}const t=new Mt;t.setAttribute("position",new B(e,3)),t.setAttribute("aSize",new B(n,1)),t.setAttribute("aOpacity",new B(r,1)),t.setAttribute("aColor",new B(c,3)),t.setAttribute("aPhase",new B(a,1));const i=new Ct({vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:me,uniforms:{uTime:{value:0}}});this.points=new Yt(t,i),this.points.frustumCulled=!1}update(e){this.points.material.uniforms.uTime.value=e}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const zt=5,Ge=j({__name:"GalaxyCanvas",emits:["ready","hover"],setup(d,{expose:e,emit:n}){const r=n,c=Jt(),a=I(null),{currentFov:t,currentMaxRedshift:i,currentLocation:o,currentLookAt:l,init:p,getScene:f,getCamera:C,getIsDragging:P,getPivot:L,startLoop:$,setLocation:v,dispose:h}=Le(),{ready:M,getAllGalaxies:z}=Vt();function N(b){v(b);const w=St[b];w&&F&&F.setLocation(w.latitude,w.longitude)}let U=[];function gt(b,w){if(!A)return 0;const R=U.filter(S=>{const W=Bt(S.pgc,S.morphology);return b.has(W)&&w.has(S.source??"CF4")});return A.rebuild(R),R.length}function et(){return U.length}e({currentFov:t,currentMaxRedshift:i,currentLocation:o,currentLookAt:l,setLocation:N,applyFilter:gt,getAllGalaxiesCount:et});let A=null,F=null,E=null,q=!1,ot=0,K=0,Q=!1,lt=!1;function ut(b){if(!A||!a.value)return null;const w=a.value.getBoundingClientRect(),R=b.clientX-w.left,S=b.clientY-w.top;return R<0||S<0||R>w.width||S>w.height?null:A.pickGalaxyAtScreen(R,S,C(),w.width,w.height,i.value,t.value)}function nt(b){if(q){const R=b.clientX-ot,S=b.clientY-K;R*R+S*S>zt*zt&&(Q=!0)}if(P()){r("hover",null);return}const w=ut(b);w?(a.value.style.cursor="pointer",r("hover",{galaxy:w,screenX:b.clientX,screenY:b.clientY})):(a.value.style.cursor="grab",r("hover",null))}function dt(){q=!1,Q=!1,r("hover",null)}function vt(b){q=!0,ot=b.clientX,K=b.clientY,Q=!1}function at(){Q&&(lt=!0),q=!1,Q=!1}function ht(b){if(lt){lt=!1;return}if(P())return;const w=ut(b);w&&c.push(`/g/${w.pgc}`)}return Zt(async()=>{if(!a.value)return;p(a.value);const b=f(),w=L();await M,U=z();const R=ke();A=new Ie(U,R),F=new Fe,E=new Ne,w.add(E.points),w.add(A.points),b.add(F.mesh),$(S=>{A==null||A.update(S,i.value,t.value),E==null||E.update(S),F==null||F.update()}),a.value.addEventListener("pointermove",nt),a.value.addEventListener("pointerdown",vt),a.value.addEventListener("pointerup",at),a.value.addEventListener("pointercancel",at),a.value.addEventListener("pointerleave",dt),a.value.addEventListener("click",ht),r("ready")}),Kt(()=>{var b,w,R,S,W,rt;(b=a.value)==null||b.removeEventListener("pointermove",nt),(w=a.value)==null||w.removeEventListener("pointerdown",vt),(R=a.value)==null||R.removeEventListener("pointerup",at),(S=a.value)==null||S.removeEventListener("pointercancel",at),(W=a.value)==null||W.removeEventListener("pointerleave",dt),(rt=a.value)==null||rt.removeEventListener("click",ht),A==null||A.dispose(),F==null||F.dispose(),E==null||E.dispose(),h()}),(b,w)=>(x(),g("canvas",{ref_key:"canvasRef",ref:a,class:"fixed inset-0 w-full h-full",style:{cursor:"grab"}},null,512))}}),Ye={class:"fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm"},Be={class:"hidden md:flex items-center gap-4"},Ve={class:"hidden md:flex items-center gap-4"},Xe={key:0,class:"text-xs text-white/50"},Ue=["value"],We=["value"],He=["value"],je={class:"md:hidden flex items-center gap-2"},qe={key:0,class:"text-xs text-white/50 shrink-0"},Qe=["aria-expanded"],Ze={class:"mobile-menu-controls"},Ke={class:"mobile-label"},Je=["value"],to=["value"],eo={class:"mobile-menu-controls"},oo={class:"mobile-label"},no=["value"],ao=j({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(d){const e=I(!1),{t:n,locale:r}=bt(),c=Object.keys(St);function a(t){r.value=t,localStorage.setItem("locale",t)}return(t,i)=>{const o=te("router-link");return x(),g(H,null,[s("header",Ye,[k(o,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors shrink-0"},{default:D(()=>[O(m(_(n)("header.siteName")),1)]),_:1}),s("nav",Be,[k(o,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[O(m(_(n)("nav.about")),1)]),_:1}),k(o,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[O(m(_(n)("nav.map")),1)]),_:1}),k(o,{to:"/cosmography",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[O(m(_(n)("nav.cosmography")),1)]),_:1}),k(o,{to:"/spacetime",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[O(m(_(n)("nav.spacetime")),1)]),_:1})]),s("div",Ve,[d.galaxyCount>0?(x(),g("span",Xe,m(_(n)("app.loaded",{count:d.galaxyCount.toLocaleString()})),1)):V("",!0),s("select",{value:d.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[0]||(i[0]=l=>t.$emit("update:location",l.target.value))},[(x(!0),g(H,null,J(_(c),l=>(x(),g("option",{key:l,value:l,class:"bg-gray-900"},m(l),9,We))),128))],40,Ue),s("select",{value:_(r),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[1]||(i[1]=l=>a(l.target.value))},[...i[12]||(i[12]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,He)]),s("div",je,[d.galaxyCount>0?(x(),g("span",qe,m(d.galaxyCount.toLocaleString()),1)):V("",!0),s("button",{type:"button",class:yt(["hamburger p-2 -mr-2 text-white/80 hover:text-white transition-colors",{"is-open":e.value}]),"aria-expanded":e.value,"aria-label":"Toggle menu",onClick:i[2]||(i[2]=l=>e.value=!e.value)},[...i[13]||(i[13]=[s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1)])],10,Qe)])]),k(_t,{name:"menu"},{default:D(()=>[ee(s("div",{class:"mobile-menu-overlay md:hidden",onClick:i[11]||(i[11]=l=>e.value=!1)},[s("nav",{class:"mobile-menu",onClick:i[10]||(i[10]=oe(()=>{},["stop"]))},[k(o,{to:"/",class:"mobile-link",onClick:i[3]||(i[3]=l=>e.value=!1)},{default:D(()=>[O(m(_(n)("nav.home")),1)]),_:1}),k(o,{to:"/about",class:"mobile-link",onClick:i[4]||(i[4]=l=>e.value=!1)},{default:D(()=>[O(m(_(n)("nav.about")),1)]),_:1}),k(o,{to:"/map",class:"mobile-link",onClick:i[5]||(i[5]=l=>e.value=!1)},{default:D(()=>[O(m(_(n)("nav.map")),1)]),_:1}),k(o,{to:"/cosmography",class:"mobile-link",onClick:i[6]||(i[6]=l=>e.value=!1)},{default:D(()=>[O(m(_(n)("nav.cosmography")),1)]),_:1}),k(o,{to:"/spacetime",class:"mobile-link",onClick:i[7]||(i[7]=l=>e.value=!1)},{default:D(()=>[O(m(_(n)("nav.spacetime")),1)]),_:1}),i[15]||(i[15]=s("div",{class:"mobile-menu-divider"},null,-1)),s("div",Ze,[s("label",Ke,m(_(n)("header.location")),1),s("select",{value:d.currentLocation,class:"mobile-select",onChange:i[8]||(i[8]=l=>t.$emit("update:location",l.target.value))},[(x(!0),g(H,null,J(_(c),l=>(x(),g("option",{key:l,value:l,class:"bg-gray-900"},m(l),9,to))),128))],40,Je)]),s("div",eo,[s("label",oo,m(_(n)("header.language")),1),s("select",{value:_(r),class:"mobile-select",onChange:i[9]||(i[9]=l=>a(l.target.value))},[...i[14]||(i[14]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,no)])])],512),[[ne,e.value]])]),_:1})],64)}}}),so=ct(ao,[["__scopeId","data-v-88115abc"]]),io={key:0,class:"pill-count"},lo={key:0,class:"filter-panel"},ro={class:"panel-header"},co={class:"panel-title"},uo={class:"section"},vo={class:"section-label"},ho={class:"chip-row"},po=["onClick"],mo={class:"section"},fo={class:"section-label"},xo={class:"chip-row"},go=["onClick"],wo={class:"panel-footer"},yo=j({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(d,{emit:e}){const{t:n}=bt(),r=d,c=e,a=I(!1),t=["spiral","barred","elliptical","lenticular","irregular"],i=["CF4","ALFALFA","FSS","UGC"],o=Rt(new Set(t)),l=Rt(new Set(i)),p=X(()=>o.size<t.length||l.size<i.length),f=X(()=>r.filteredCount.toLocaleString()),C=X(()=>r.totalCount.toLocaleString());function P(v){o.has(v)?o.size>1&&o.delete(v):o.add(v),$()}function L(v){l.has(v)?l.size>1&&l.delete(v):l.add(v),$()}function $(){c("filter-change",{morphologies:new Set(o),sources:new Set(l)})}return(v,h)=>(x(),g(H,null,[a.value?V("",!0):(x(),g("button",{key:0,class:"filter-pill",onClick:h[0]||(h[0]=M=>a.value=!0)},[h[2]||(h[2]=s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),s("span",null,m(_(n)("pages.home.filter")),1),p.value?(x(),g("span",io,m(f.value),1)):V("",!0)])),k(_t,{name:"panel"},{default:D(()=>[a.value?(x(),g("div",lo,[s("div",ro,[s("span",co,m(_(n)("pages.home.filter")),1),s("button",{class:"close-btn",onClick:h[1]||(h[1]=M=>a.value=!1),"aria-label":"Close"},[...h[3]||(h[3]=[s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),s("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),s("div",uo,[s("div",vo,m(_(n)("pages.home.morphologyLabel")),1),s("div",ho,[(x(),g(H,null,J(t,M=>s("button",{key:M,class:yt(["chip",{active:o.has(M)}]),onClick:z=>P(M)},m(_(n)("morphology."+M)),11,po)),64))])]),s("div",mo,[s("div",fo,m(_(n)("pages.home.catalogLabel")),1),s("div",xo,[(x(),g(H,null,J(i,M=>s("button",{key:M,class:yt(["chip",{active:l.has(M)}]),onClick:z=>L(M)},m(M),11,go)),64))])]),s("div",wo,m(_(n)("pages.home.showing",{count:f.value,total:C.value})),1)])):V("",!0)]),_:1})],64))}}),Mo=ct(yo,[["__scopeId","data-v-647995f5"]]),bo={class:"tooltip-name"},_o={class:"tooltip-row"},Co={key:0,class:"tooltip-row"},So=j({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{}},setup(d){return(e,n)=>d.galaxy?(x(),g("div",{key:0,class:"galaxy-tooltip",style:tt({left:d.x+"px",top:d.y+"px"})},[s("div",bo,"PGC "+m(d.galaxy.pgc),1),s("div",_o,[n[0]||(n[0]=s("span",{class:"tooltip-label"},"Distance",-1)),O(" "+m(Math.round(d.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),d.galaxy.vcmb!=null?(x(),g("div",Co,[n[1]||(n[1]=s("span",{class:"tooltip-label"},"Velocity",-1)),O(" "+m(d.galaxy.vcmb.toLocaleString())+" km/s ",1)])):V("",!0)],4)):V("",!0)}}),ko=ct(So,[["__scopeId","data-v-8a9f4504"]]),Ao={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},Po={class:"text-center"},Lo={class:"text-sm text-white/70 tracking-wide"},Ro=j({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(d){const{t:e}=bt();return(n,r)=>(x(),Gt(_t,{name:"fade"},{default:D(()=>[d.isLoading?(x(),g("div",Ao,[s("div",Po,[r[0]||(r[0]=s("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),s("p",Lo,m(_(e)("app.loading")),1)])])):V("",!0)]),_:1}))}}),To=ct(Ro,[["__scopeId","data-v-c1ac9ae0"]]),Io={class:"space-compass pointer-events-none select-none"},Eo={class:"compass-tape relative w-full h-12 overflow-hidden"},Do={key:0,class:"w-px h-3 bg-white/40 flex-none"},$o={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},zo={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Ft=4,Fo=j({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(d){const e=d,n=X(()=>e.azimuth*Ft),r=X(()=>{const c=e.azimuth,a=500,t=Math.floor(c-a),i=Math.ceil(c+a),o=[];for(let l=t;l<=i;l++){let p=l%360;p<0&&(p+=360);const f=p%15===0;(p%5===0||f)&&o.push({value:l,offset:l*Ft,isMajor:f,label:f?`${Math.round(p)}°`:null})}return o});return(c,a)=>(x(),g("div",Io,[s("div",Eo,[a[0]||(a[0]=s("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[s("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),s("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),s("div",{class:"absolute top-0 h-full will-change-transform",style:tt({transform:`translateX(calc(50% - ${n.value}px))`})},[(x(!0),g(H,null,J(r.value,t=>(x(),g("div",{key:t.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:tt({left:`${t.offset}px`})},[t.isMajor?(x(),g("div",Do)):(x(),g("div",$o)),t.label?(x(),g("div",zo,m(t.label),1)):V("",!0)],4))),128))],4),a[1]||(a[1]=s("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Oo=ct(Fo,[["__scopeId","data-v-6e465829"]]),No={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Go={class:"relative w-full h-full"},Yo={class:"mr-2 text-[10px] font-mono text-white/30"},Bo={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},ft=0,Ot=1600,Vo=j({__name:"DistanceIndicator",props:{distance:{}},setup(d){const e=d,n=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function r(a){return(1-(a-ft)/(Ot-ft))*100}const c=X(()=>{const a=(e.distance-ft)/(Ot-ft);return(1-Math.max(0,Math.min(1,a)))*100});return(a,t)=>(x(),g("div",No,[t[2]||(t[2]=s("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Go,[(x(),g(H,null,J(n,i=>s("div",{key:i.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:tt({top:`${r(i.value)}%`})},[s("span",Yo,m(i.label),1),t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),s("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:tt({top:`${c.value}%`})},[s("span",Bo,m(Math.round(d.distance))+" mLY ",1),t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Xo={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},Uo={class:"relative w-full h-full"},Wo={class:"ml-2 text-[10px] font-mono text-white/30"},Ho={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},xt=-90,Nt=90,jo=j({__name:"ElevationIndicator",props:{elevation:{}},setup(d){const e=d,n=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function r(a){return(1-(a-xt)/(Nt-xt))*100}const c=X(()=>{const a=(e.elevation-xt)/(Nt-xt);return(1-Math.max(0,Math.min(1,a)))*100});return(a,t)=>(x(),g("div",Xo,[t[2]||(t[2]=s("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Uo,[(x(),g(H,null,J(n,i=>s("div",{key:i.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:tt({top:`${r(i.value)}%`})},[t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),s("span",Wo,m(i.label),1)],4)),64)),s("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:tt({top:`${c.value}%`})},[t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),s("span",Ho,m(Math.round(d.elevation))+"° ",1)],4)])]))}}),qo={class:"w-full h-full"},Qo={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center"},Zo={class:"w-full max-w-3xl"},Ko={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},Jo={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},ln=j({__name:"HomeView",setup(d){const{isLoading:e,galaxyCount:n}=Vt(),r=I(null),c=I(!1),a=I(0),t=I(0),i=I(null),o=I(0),l=I(0),p=X(()=>{var v,h;return((h=(v=r.value)==null?void 0:v.currentLookAt)==null?void 0:h.azimuth)??0}),f=X(()=>{var v,h;return((h=(v=r.value)==null?void 0:v.currentLookAt)==null?void 0:h.elevation)??0}),C=X(()=>{var h;const v=((h=r.value)==null?void 0:h.currentMaxRedshift)??0;return Pe(v)});function P(){var h;c.value=!0;const v=((h=r.value)==null?void 0:h.getAllGalaxiesCount())??0;a.value=v,t.value=v}function L(v){var M;const h=((M=r.value)==null?void 0:M.applyFilter(v.morphologies,v.sources))??0;t.value=h}function $(v){v?(i.value=v.galaxy,o.value=v.screenX,l.value=v.screenY):i.value=null}return(v,h)=>{var M;return x(),g("div",qo,[k(Ge,{ref_key:"canvasRef",ref:r,onReady:P,onHover:$},null,512),k(so,{"galaxy-count":_(n),"current-location":((M=r.value)==null?void 0:M.currentLocation)??"North Pole","onUpdate:location":h[0]||(h[0]=z=>{var N;return(N=r.value)==null?void 0:N.setLocation(z)})},null,8,["galaxy-count","current-location"]),s("div",Qo,[s("div",Zo,[k(Oo,{azimuth:p.value},null,8,["azimuth"])])]),s("div",Ko,[k(Vo,{distance:C.value},null,8,["distance"])]),s("div",Jo,[k(jo,{elevation:f.value},null,8,["elevation"])]),c.value?(x(),Gt(Mo,{key:0,"total-count":a.value,"filtered-count":t.value,onFilterChange:L},null,8,["total-count","filtered-count"])):V("",!0),k(ko,{galaxy:i.value,x:o.value,y:l.value},null,8,["galaxy","x","y"]),k(To,{"is-loading":_(e)},null,8,["is-loading"])])}}});export{ln as default};
