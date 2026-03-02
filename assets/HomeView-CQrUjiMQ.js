import{r as D,d as J,o as ne,a as ae,c as y,u as Ut,b as x,e as _t,F as K,f as s,g as T,w as F,t as p,h as b,i as B,j as nt,n as Mt,T as kt,k as se,l as N,m as ie,p as le,v as re,q as $t,s as V,x as at,y as Ht}from"./index-DwTeaSUq.js";import{V as G,W as ce,S as ue,G as de,P as he,C as ve,B as At,a as Pt,N as pe,b as Wt,c as Y,Q as zt,d as fe,T as me,e as ge,F as xe,M as we,f as Ft,A as ye}from"./three.module-TGhSzrr1.js";import{R as be,L as It,C as tt,a as Me,b as _e,c as Ce,D as Se,d as wt,e as Ot,M as Ae,S as ke,E as Pe,f as Ie}from"./constants-DEjRyabg.js";import{a as jt,u as qt}from"./galaxy-BB9zGr1A.js";import{m as Te,g as Le}from"./GalaxyTextures-AsvTBieS.js";import{_ as ht}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Nt=Math.PI/180;function Re(d,e,o){const l=d*Nt,r=e*Nt,c=Math.cos(r);return new G(-o*c*Math.sin(l),o*Math.sin(r),-o*c*Math.cos(l))}function Gt(d){const e=be;if(d>=e[0][0])return e[0][1];if(d<=e[e.length-1][0])return e[e.length-1][1];for(let o=0;o<e.length-1;o++){const[l,r]=e[o],[c,t]=e[o+1];if(d<=l&&d>=c){const i=(l-d)/(l-c);return r*Math.pow(t/r,i)}}return e[e.length-1][1]}function Ee(d){return d*13968}function De(){const d=D(tt),e=D(Gt(tt)),o=D(Se),l=D({azimuth:0,elevation:0});let r=null,c=null,t=null,i=0,a=null,n=null,h=Math.PI,v=1.68,_=!1,R=0,P=0;const O=.003,L=.005;let C=0,w=0;const z=.92,X=.76,j=1e-5,g=.08,k=.025,q=.85,S=.03;let I=tt;const U=.08;let Q=0,st=0,it=0,H=0;const lt=.04;function Z(u){a=u,r=new ce({canvas:u,antialias:!0,alpha:!1}),r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setSize(window.innerWidth,window.innerHeight),r.setClearColor(0,1),c=new ue,n=new de,c.add(n),t=new he(tt,window.innerWidth/window.innerHeight,Me,_e),t.position.set(...Ce),rt(),u.addEventListener("pointerdown",m),u.addEventListener("pointermove",E),u.addEventListener("pointerup",A),u.addEventListener("pointerleave",A),u.addEventListener("wheel",et,{passive:!1}),u.addEventListener("touchstart",Tt,{passive:!1}),u.addEventListener("touchmove",Lt,{passive:!1}),u.addEventListener("touchend",Rt),window.addEventListener("resize",Et)}function pt(){return n}function rt(){if(!t)return;const u=Math.sin(v)*Math.sin(h),M=Math.cos(v),$=Math.sin(v)*Math.cos(h),W=new G(t.position.x+u*100,t.position.y+M*100,t.position.z+$*100);t.lookAt(W),l.value={azimuth:h*180/Math.PI,elevation:90-v*180/Math.PI}}function vt(u,M){const $=u*Math.PI/180,W=tt*Math.PI/180,ut=Math.tan($*.5)/Math.tan(W*.5),Dt=Math.pow(Math.max(0,ut),q);return Math.max(M?k:g,Dt)}function ft(u){const M=Math.max(0,Math.min(1,(u-wt)/(tt-wt)));return X+(z-X)*M}function mt(){if(_||Math.abs(C)<j&&Math.abs(w)<j)return;const u=(t==null?void 0:t.fov)??tt,M=ft(u);h+=C,v+=w,v=Math.max(.1,Math.min(Math.PI/2+.3,v)),C*=M,w*=M,rt()}function ct(u){const M=It[u];M&&(o.value=u,st=(90-M.latitude)/180*Math.PI,it=-M.longitude/180*Math.PI)}function gt(){if(!n)return;const u=st-Q,M=it-H;Math.abs(u)<5e-4&&Math.abs(M)<5e-4?(Q=st,H=it):(Q+=u*lt,H+=M*lt),n.rotation.x=Q,n.rotation.y=H}function f(){if(!t)return;const u=I-t.fov;Math.abs(u)<.01||(t.fov+=u*U,t.updateProjectionMatrix(),d.value=t.fov,e.value=Gt(t.fov))}function m(u){xt||(_=!0,R=u.clientX,P=u.clientY,C=0,w=0,a.style.cursor="grabbing",a.setPointerCapture(u.pointerId))}function E(u){if(!_||xt)return;const M=u.clientX-R,$=u.clientY-P;R=u.clientX,P=u.clientY;const W=(t==null?void 0:t.fov)??tt,ut=u.pointerType==="touch",Ct=(ut?L:O)*vt(W,ut),ee=Math.max(-S,Math.min(S,-M*Ct)),oe=Math.max(-S,Math.min(S,-$*Ct));C=C*.3+ee*.7,w=w*.3+oe*.7,h+=C,v+=w,v=Math.max(.1,Math.min(Math.PI/2+.3,v)),rt()}function A(u){if(_=!1,a&&(a.style.cursor="grab",(u==null?void 0:u.pointerId)!=null))try{a.releasePointerCapture(u.pointerId)}catch{}}function et(u){u.preventDefault();const M=u.deltaY*.05;I=Math.max(wt,Math.min(Ot,I+M))}let ot=0,xt=!1;function Tt(u){if(u.touches.length===2){xt=!0,u.preventDefault();const M=u.touches[0].clientX-u.touches[1].clientX,$=u.touches[0].clientY-u.touches[1].clientY;ot=Math.sqrt(M*M+$*$)}}function Lt(u){if(u.touches.length===2){u.preventDefault();const M=u.touches[0].clientX-u.touches[1].clientX,$=u.touches[0].clientY-u.touches[1].clientY,W=Math.sqrt(M*M+$*$),ut=(ot-W)*.1;ot=W,I=Math.max(wt,Math.min(Ot,I+ut))}}function Rt(u){ot=0,u.touches.length<2&&(xt=!1)}function Et(){!r||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),r.setSize(window.innerWidth,window.innerHeight))}function Qt(){return c}function Zt(){return t}function Kt(){return _}function Jt(u){const M=new ve;function $(){i=requestAnimationFrame($);const W=M.getElapsedTime();mt(),gt(),f(),u(W),r.render(c,t)}$()}function te(){cancelAnimationFrame(i),a&&(a.removeEventListener("pointerdown",m),a.removeEventListener("pointermove",E),a.removeEventListener("pointerup",A),a.removeEventListener("pointerleave",A),a.removeEventListener("wheel",et),a.removeEventListener("touchstart",Tt),a.removeEventListener("touchmove",Lt),a.removeEventListener("touchend",Rt)),window.removeEventListener("resize",Et),r==null||r.dispose()}return{currentFov:d,currentMaxRedshift:e,currentLocation:o,currentLookAt:l,init:Z,getScene:Qt,getCamera:Zt,getIsDragging:Kt,getPivot:pt,startLoop:Jt,setLocation:ct,dispose:te}}const $e=`attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uFov;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;

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
`,ze=`precision highp float;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

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

  // Selected outline: cyan glow at sprite edge
  if (vSelected > 0.5) {
    float outline = 1.0 - smoothstep(0.35, 0.65, dist);
    vec3 outlineColor = vec3(0.4, 0.9, 1.0);
    finalColor = mix(finalColor, outlineColor, outline * 0.7);
    finalAlpha = max(finalAlpha, outline * 0.9);
  }

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;class Fe{constructor(e,o){this.selected=new Float32Array(0),this.selectedPgc=null,this.tempLocal=new G,this.tempWorld=new G,this.galaxies=e,this.atlasTexture=o,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.geometry=new At,this.material=new Pt({vertexShader:$e,fragmentShader:ze,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:o}},transparent:!0,depthWrite:!1,blending:pe}),this.points=new Wt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(e)}rebuild(e){this.galaxies=e;const o=e.length,l=new Float32Array(o*3),r=new Float32Array(o*3),c=new Float32Array(o),t=new Float32Array(o),i=new Float32Array(o),a=new Float32Array(o);for(let n=0;n<o;n++){const h=e[n],v=Re(h.ra,h.dec,ke);l[n*3]=v.x,l[n*3+1]=v.y,l[n*3+2]=v.z;const _=jt(h.pgc),R=Ae[_],P=h.pgc*2654435761>>>0,O=(P>>>8)%1024/1023,L=(P>>>18)%1024/1023,C=.9+O*.22,w=(L-.5)*.08;r[n*3]=Math.min(1,Math.max(0,R[0]*C+w*.5)),r[n*3+1]=Math.min(1,Math.max(0,R[1]*C)),r[n*3+2]=Math.min(1,Math.max(0,R[2]*C-w*.6));const z=8;c[n]=Math.max(1.5,Math.min(12,z/h.distance_mpc)),t[n]=(h.vcmb??0)/299792.458,i[n]=Te(_),a[n]=this.selectedPgc!=null&&h.pgc===this.selectedPgc?1:0}this.positions=l,this.selected=a,this.sizes=c,this.redshifts=t,this.geometry.dispose(),this.geometry=new At,this.geometry.setAttribute("position",new Y(l,3)),this.geometry.setAttribute("aColor",new Y(r,3)),this.geometry.setAttribute("aSize",new Y(c,1)),this.geometry.setAttribute("aRedshift",new Y(t,1)),this.geometry.setAttribute("aTexIndex",new Y(i,1)),this.geometry.setAttribute("aSelected",new Y(a,1)),this.points.geometry=this.geometry}setSelectedPgc(e){if(this.selectedPgc===e||(this.selectedPgc=e,!this.geometry.attributes.aSelected))return;const o=this.geometry.attributes.aSelected,l=o.array;for(let r=0;r<this.galaxies.length;r++)l[r]=e!=null&&this.galaxies[r].pgc===e?1:0;o.needsUpdate=!0}update(e,o,l){this.material.uniforms.uTime.value=e,this.material.uniforms.uMaxRedshift.value=o,this.material.uniforms.uFov.value=l}pickGalaxyAtScreen(e,o,l,r,c,t,i){this.points.updateWorldMatrix(!0,!1);let a=-1,n=Number.POSITIVE_INFINITY;const h=Math.min(window.devicePixelRatio,2),v=this.smoothstep(0,1,this.clamp01((52-i)/32));for(let _=0;_<this.galaxies.length;_++){const R=this.computeVisibilityAlpha(this.redshifts[_],t);if(R<.01)continue;const P=_*3;if(this.tempLocal.set(this.positions[P],this.positions[P+1],this.positions[P+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(l),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const O=(this.tempWorld.x*.5+.5)*r,L=(-this.tempWorld.y*.5+.5)*c,w=this.estimatePointSizePx(this.sizes[_],R,h,i,v)*.5,z=e-O,X=o-L;if(Math.abs(z)>w||Math.abs(X)>w)continue;const j=z*z+X*X;j<n&&(n=j,a=_)}return a>=0?this.galaxies[a]:null}estimatePointSizePx(e,o,l,r,c){const t=.5+.5*o,i=60/r,a=e*l*i*t*3,n=1+.35*c,h=1.75-.75*c;return Math.max(2.8*l,a*n*h)}computeVisibilityAlpha(e,o){if(e<0||e>o)return 0;const l=o*.6;return e<l?1:this.smoothstep(o,l,e)}clamp01(e){return Math.max(0,Math.min(1,e))}smoothstep(e,o,l){const r=this.clamp01((l-e)/(o-e));return r*r*(3-2*r)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const Oe="/assets/earth_day-DkcerPt2.jpg",Ne=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ge=`
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
`,Ye=.04;class Ve{constructor(){this.texture=null,this.currentQuat=new zt,this.targetQuat=new zt;const e=new fe(Pe,64,64),o=new me().load(Oe);o.colorSpace=ge,this.texture=o;const l=new Pt({vertexShader:Ne,fragmentShader:Ge,uniforms:{uDayMap:{value:o}},side:xe,depthWrite:!0});this.mesh=new we(e,l),this.mesh.position.set(0,Ie,0),this.mesh.renderOrder=-1}setLocation(e,o){const l=e*Math.PI/180,c=o*Math.PI/180+Math.PI,t=Math.PI/2-l,i=new G(-Math.cos(c)*Math.sin(t),Math.cos(t),Math.sin(c)*Math.sin(t)).normalize(),a=new G(0,1,0),n=i.clone(),h=new G;Math.abs(n.y)>.99?h.set(0,0,-1):h.copy(a).sub(n.clone().multiplyScalar(a.dot(n))).normalize();const v=new G().crossVectors(h,n).normalize(),_=new Ft().makeBasis(v,n,h),P=new Ft().makeBasis(new G(1,0,0),new G(0,1,0),new G(0,0,-1)).multiply(_.transpose());this.targetQuat.setFromRotationMatrix(P)}update(){this.currentQuat.slerp(this.targetQuat,Ye),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var e;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(e=this.texture)==null||e.dispose()}}const dt=14e3,St=800,Be=1.15;class Xe{constructor(){const e=new Float32Array(dt*3),o=new Float32Array(dt),l=new Float32Array(dt),r=new Float32Array(dt*3),c=new Float32Array(dt);for(let a=0;a<dt;a++){const n=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1);e[a*3]=St*Math.sin(h)*Math.cos(n),e[a*3+1]=St*Math.cos(h),e[a*3+2]=St*Math.sin(h)*Math.sin(n),o[a]=Be*(.35+Math.random()*.85),l[a]=.18+Math.random()*.42,c[a]=Math.random()*Math.PI*2;const v=Math.random();v<.55?(r[a*3]=.8+Math.random()*.12,r[a*3+1]=.85+Math.random()*.1,r[a*3+2]=.95+Math.random()*.05):v<.88?(r[a*3]=.95+Math.random()*.05,r[a*3+1]=.92+Math.random()*.07,r[a*3+2]=.82+Math.random()*.12):(r[a*3]=.75+Math.random()*.2,r[a*3+1]=.82+Math.random()*.14,r[a*3+2]=.95+Math.random()*.05)}const t=new At;t.setAttribute("position",new Y(e,3)),t.setAttribute("aSize",new Y(o,1)),t.setAttribute("aOpacity",new Y(l,1)),t.setAttribute("aColor",new Y(r,3)),t.setAttribute("aPhase",new Y(c,1));const i=new Pt({vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ye,uniforms:{uTime:{value:0}}});this.points=new Wt(t,i),this.points.frustumCulled=!1}update(e){this.points.material.uniforms.uTime.value=e}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const Yt=5,Ue=J({__name:"GalaxyCanvas",emits:["ready","hover","select"],setup(d,{expose:e,emit:o}){const l=o,r=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,c=Ut(),t=D(null),{currentFov:i,currentMaxRedshift:a,currentLocation:n,currentLookAt:h,init:v,getScene:_,getCamera:R,getIsDragging:P,getPivot:O,startLoop:L,setLocation:C,dispose:w}=De(),{ready:z,getAllGalaxies:X}=qt();function j(f){C(f);const m=It[f];m&&I&&I.setLocation(m.latitude,m.longitude)}let g=[];function k(f,m){if(!S)return 0;const E=g.filter(A=>{const et=jt(A.pgc,A.morphology);return f.has(et)&&m.has(A.source??"CF4")});return S.rebuild(E),E.length}function q(){return g.length}e({currentFov:i,currentMaxRedshift:a,currentLocation:n,currentLookAt:h,setLocation:j,applyFilter:k,getAllGalaxiesCount:q});let S=null,I=null,U=null,Q=!1,st=0,it=0,H=!1,lt=!1,Z=null;function pt(f){if(!S||!t.value)return null;const m=t.value.getBoundingClientRect(),E=f.clientX-m.left,A=f.clientY-m.top;return E<0||A<0||E>m.width||A>m.height?null:S.pickGalaxyAtScreen(E,A,R(),m.width,m.height,a.value,i.value)}function rt(f){if(Q){const E=f.clientX-st,A=f.clientY-it;E*E+A*A>Yt*Yt&&(H=!0)}if(P()){l("hover",null);return}const m=pt(f);m?(t.value.style.cursor="pointer",l("hover",{galaxy:m,screenX:f.clientX,screenY:f.clientY})):(t.value.style.cursor="grab",r||l("hover",null))}function vt(f){Z=(f==null?void 0:f.galaxy)??null,S==null||S.setSelectedPgc((Z==null?void 0:Z.pgc)??null),l("select",f??null)}function ft(){Q=!1,H=!1,l("hover",null),r&&vt(null)}function mt(f){Q=!0,st=f.clientX,it=f.clientY,H=!1}function ct(){H&&(lt=!0),Q=!1,H=!1}function gt(f){if(lt){lt=!1;return}if(P())return;const m=pt(f);r?m?(Z==null?void 0:Z.pgc)===m.pgc?c.push(`/g/${m.pgc}`):vt({galaxy:m,screenX:f.clientX,screenY:f.clientY}):vt(null):m&&c.push(`/g/${m.pgc}`)}return ne(async()=>{if(!t.value)return;v(t.value);const f=_(),m=O();await z,g=X();const E=Le();S=new Fe(g,E),I=new Ve,U=new Xe,m.add(U.points),m.add(S.points),f.add(I.mesh),L(A=>{S==null||S.update(A,a.value,i.value),U==null||U.update(A),I==null||I.update()}),t.value.addEventListener("pointermove",rt),t.value.addEventListener("pointerdown",mt),t.value.addEventListener("pointerup",ct),t.value.addEventListener("pointercancel",ct),t.value.addEventListener("pointerleave",ft),t.value.addEventListener("click",gt),l("ready")}),ae(()=>{var f,m,E,A,et,ot;(f=t.value)==null||f.removeEventListener("pointermove",rt),(m=t.value)==null||m.removeEventListener("pointerdown",mt),(E=t.value)==null||E.removeEventListener("pointerup",ct),(A=t.value)==null||A.removeEventListener("pointercancel",ct),(et=t.value)==null||et.removeEventListener("pointerleave",ft),(ot=t.value)==null||ot.removeEventListener("click",gt),S==null||S.dispose(),I==null||I.dispose(),U==null||U.dispose(),w()}),(f,m)=>(x(),y("canvas",{ref_key:"canvasRef",ref:t,class:"fixed inset-0 w-full h-full galaxy-canvas"},null,512))}}),He=ht(Ue,[["__scopeId","data-v-a75277f6"]]),We={class:"fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm"},je={class:"hidden md:flex items-center gap-4"},qe={class:"hidden md:flex items-center gap-4"},Qe={key:0,class:"text-xs text-white/50"},Ze=["value"],Ke=["value"],Je=["value"],to={class:"md:hidden flex items-center gap-2"},eo={key:0,class:"text-xs text-white/50 shrink-0"},oo=["aria-expanded"],no={class:"mobile-menu-controls"},ao={class:"mobile-label"},so=["value"],io=["value"],lo={class:"mobile-menu-controls"},ro={class:"mobile-label"},co=["value"],uo=J({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(d){const e=D(!1),{t:o,locale:l}=_t(),r=Object.keys(It);function c(t){l.value=t,localStorage.setItem("locale",t)}return(t,i)=>{const a=se("router-link");return x(),y(K,null,[s("header",We,[T(a,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors shrink-0"},{default:F(()=>[N(p(b(o)("header.siteName")),1)]),_:1}),s("nav",je,[T(a,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:F(()=>[N(p(b(o)("nav.about")),1)]),_:1}),T(a,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:F(()=>[N(p(b(o)("nav.map")),1)]),_:1}),T(a,{to:"/cosmography",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:F(()=>[N(p(b(o)("nav.cosmography")),1)]),_:1}),T(a,{to:"/spacetime",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:F(()=>[N(p(b(o)("nav.spacetime")),1)]),_:1})]),s("div",qe,[d.galaxyCount>0?(x(),y("span",Qe,p(b(o)("app.loaded",{count:d.galaxyCount.toLocaleString()})),1)):B("",!0),s("select",{value:d.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[0]||(i[0]=n=>t.$emit("update:location",n.target.value))},[(x(!0),y(K,null,nt(b(r),n=>(x(),y("option",{key:n,value:n,class:"bg-gray-900"},p(n),9,Ke))),128))],40,Ze),s("select",{value:b(l),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[1]||(i[1]=n=>c(n.target.value))},[...i[12]||(i[12]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,Je)]),s("div",to,[d.galaxyCount>0?(x(),y("span",eo,p(d.galaxyCount.toLocaleString()),1)):B("",!0),s("button",{type:"button",class:Mt(["hamburger p-2 -mr-2 text-white/80 hover:text-white transition-colors",{"is-open":e.value}]),"aria-expanded":e.value,"aria-label":"Toggle menu",onClick:i[2]||(i[2]=n=>e.value=!e.value)},[...i[13]||(i[13]=[s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1)])],10,oo)])]),T(kt,{name:"menu"},{default:F(()=>[ie(s("div",{class:"mobile-menu-overlay md:hidden",onClick:i[11]||(i[11]=n=>e.value=!1)},[s("nav",{class:"mobile-menu",onClick:i[10]||(i[10]=le(()=>{},["stop"]))},[T(a,{to:"/",class:"mobile-link",onClick:i[3]||(i[3]=n=>e.value=!1)},{default:F(()=>[N(p(b(o)("nav.home")),1)]),_:1}),T(a,{to:"/about",class:"mobile-link",onClick:i[4]||(i[4]=n=>e.value=!1)},{default:F(()=>[N(p(b(o)("nav.about")),1)]),_:1}),T(a,{to:"/map",class:"mobile-link",onClick:i[5]||(i[5]=n=>e.value=!1)},{default:F(()=>[N(p(b(o)("nav.map")),1)]),_:1}),T(a,{to:"/cosmography",class:"mobile-link",onClick:i[6]||(i[6]=n=>e.value=!1)},{default:F(()=>[N(p(b(o)("nav.cosmography")),1)]),_:1}),T(a,{to:"/spacetime",class:"mobile-link",onClick:i[7]||(i[7]=n=>e.value=!1)},{default:F(()=>[N(p(b(o)("nav.spacetime")),1)]),_:1}),i[15]||(i[15]=s("div",{class:"mobile-menu-divider"},null,-1)),s("div",no,[s("label",ao,p(b(o)("header.location")),1),s("select",{value:d.currentLocation,class:"mobile-select",onChange:i[8]||(i[8]=n=>t.$emit("update:location",n.target.value))},[(x(!0),y(K,null,nt(b(r),n=>(x(),y("option",{key:n,value:n,class:"bg-gray-900"},p(n),9,io))),128))],40,so)]),s("div",lo,[s("label",ro,p(b(o)("header.language")),1),s("select",{value:b(l),class:"mobile-select",onChange:i[9]||(i[9]=n=>c(n.target.value))},[...i[14]||(i[14]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,co)])])],512),[[re,e.value]])]),_:1})],64)}}}),ho=ht(uo,[["__scopeId","data-v-88115abc"]]),vo={key:0,class:"pill-count"},po={key:0,class:"filter-panel"},fo={class:"panel-header"},mo={class:"panel-title"},go={class:"section"},xo={class:"section-label"},wo={class:"chip-row"},yo=["onClick"],bo={class:"section"},Mo={class:"section-label"},_o={class:"chip-row"},Co=["onClick"],So={class:"panel-footer"},Ao=J({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(d,{emit:e}){const{t:o}=_t(),l=d,r=e,c=D(!1),t=["spiral","barred","elliptical","lenticular","irregular"],i=["CF4","ALFALFA","FSS","UGC"],a=$t(new Set(t)),n=$t(new Set(i)),h=V(()=>a.size<t.length||n.size<i.length),v=V(()=>l.filteredCount.toLocaleString()),_=V(()=>l.totalCount.toLocaleString());function R(L){a.has(L)?a.size>1&&a.delete(L):a.add(L),O()}function P(L){n.has(L)?n.size>1&&n.delete(L):n.add(L),O()}function O(){r("filter-change",{morphologies:new Set(a),sources:new Set(n)})}return(L,C)=>(x(),y(K,null,[c.value?B("",!0):(x(),y("button",{key:0,class:"filter-pill",onClick:C[0]||(C[0]=w=>c.value=!0)},[C[2]||(C[2]=s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),s("span",null,p(b(o)("pages.home.filter")),1),h.value?(x(),y("span",vo,p(v.value),1)):B("",!0)])),T(kt,{name:"panel"},{default:F(()=>[c.value?(x(),y("div",po,[s("div",fo,[s("span",mo,p(b(o)("pages.home.filter")),1),s("button",{class:"close-btn",onClick:C[1]||(C[1]=w=>c.value=!1),"aria-label":"Close"},[...C[3]||(C[3]=[s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),s("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),s("div",go,[s("div",xo,p(b(o)("pages.home.morphologyLabel")),1),s("div",wo,[(x(),y(K,null,nt(t,w=>s("button",{key:w,class:Mt(["chip",{active:a.has(w)}]),onClick:z=>R(w)},p(b(o)("morphology."+w)),11,yo)),64))])]),s("div",bo,[s("div",Mo,p(b(o)("pages.home.catalogLabel")),1),s("div",_o,[(x(),y(K,null,nt(i,w=>s("button",{key:w,class:Mt(["chip",{active:n.has(w)}]),onClick:z=>P(w)},p(w),11,Co)),64))])]),s("div",So,p(b(o)("pages.home.showing",{count:v.value,total:_.value})),1)])):B("",!0)]),_:1})],64))}}),ko=ht(Ao,[["__scopeId","data-v-647995f5"]]),Po={class:"tooltip-name"},Io={class:"tooltip-row"},To={key:0,class:"tooltip-row"},Lo=J({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{},showCta:{type:Boolean}},emits:["navigate"],setup(d){const{t:e}=_t();return(o,l)=>d.galaxy?(x(),y("div",{key:0,class:Mt(["galaxy-tooltip",{"has-cta":d.showCta}]),style:at({left:d.x+"px",top:d.y+"px"})},[s("div",Po,"PGC "+p(d.galaxy.pgc),1),s("div",Io,[l[1]||(l[1]=s("span",{class:"tooltip-label"},"Distance",-1)),N(" "+p(Math.round(d.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),d.galaxy.vcmb!=null?(x(),y("div",To,[l[2]||(l[2]=s("span",{class:"tooltip-label"},"Velocity",-1)),N(" "+p(d.galaxy.vcmb.toLocaleString())+" km/s ",1)])):B("",!0),d.showCta?(x(),y("button",{key:1,type:"button",class:"tooltip-cta",onClick:l[0]||(l[0]=r=>o.$emit("navigate"))},p(b(e)("pages.home.goToGalaxy")),1)):B("",!0)],6)):B("",!0)}}),Ro=ht(Lo,[["__scopeId","data-v-a2b36d9a"]]),Eo={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},Do={class:"text-center"},$o={class:"text-sm text-white/70 tracking-wide"},zo=J({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(d){const{t:e}=_t();return(o,l)=>(x(),Ht(kt,{name:"fade"},{default:F(()=>[d.isLoading?(x(),y("div",Eo,[s("div",Do,[l[0]||(l[0]=s("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),s("p",$o,p(b(e)("app.loading")),1)])])):B("",!0)]),_:1}))}}),Fo=ht(zo,[["__scopeId","data-v-c1ac9ae0"]]),Oo={class:"space-compass pointer-events-none select-none"},No={class:"compass-tape relative w-full h-12 overflow-hidden"},Go={key:0,class:"w-px h-3 bg-white/40 flex-none"},Yo={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},Vo={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Vt=4,Bo=J({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(d){const e=d,o=V(()=>e.azimuth*Vt),l=V(()=>{const r=e.azimuth,c=500,t=Math.floor(r-c),i=Math.ceil(r+c),a=[];for(let n=t;n<=i;n++){let h=n%360;h<0&&(h+=360);const v=h%15===0;(h%5===0||v)&&a.push({value:n,offset:n*Vt,isMajor:v,label:v?`${Math.round(h)}°`:null})}return a});return(r,c)=>(x(),y("div",Oo,[s("div",No,[c[0]||(c[0]=s("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[s("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),s("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),s("div",{class:"absolute top-0 h-full will-change-transform",style:at({transform:`translateX(calc(50% - ${o.value}px))`})},[(x(!0),y(K,null,nt(l.value,t=>(x(),y("div",{key:t.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:at({left:`${t.offset}px`})},[t.isMajor?(x(),y("div",Go)):(x(),y("div",Yo)),t.label?(x(),y("div",Vo,p(t.label),1)):B("",!0)],4))),128))],4),c[1]||(c[1]=s("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Xo=ht(Bo,[["__scopeId","data-v-6e465829"]]),Uo={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Ho={class:"relative w-full h-full"},Wo={class:"mr-2 text-[10px] font-mono text-white/30"},jo={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},yt=0,Bt=1600,qo=J({__name:"DistanceIndicator",props:{distance:{}},setup(d){const e=d,o=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function l(c){return(1-(c-yt)/(Bt-yt))*100}const r=V(()=>{const c=(e.distance-yt)/(Bt-yt);return(1-Math.max(0,Math.min(1,c)))*100});return(c,t)=>(x(),y("div",Uo,[t[2]||(t[2]=s("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Ho,[(x(),y(K,null,nt(o,i=>s("div",{key:i.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:at({top:`${l(i.value)}%`})},[s("span",Wo,p(i.label),1),t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),s("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:at({top:`${r.value}%`})},[s("span",jo,p(Math.round(d.distance))+" mLY ",1),t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Qo={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},Zo={class:"relative w-full h-full"},Ko={class:"ml-2 text-[10px] font-mono text-white/30"},Jo={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},bt=-90,Xt=90,tn=J({__name:"ElevationIndicator",props:{elevation:{}},setup(d){const e=d,o=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function l(c){return(1-(c-bt)/(Xt-bt))*100}const r=V(()=>{const c=(e.elevation-bt)/(Xt-bt);return(1-Math.max(0,Math.min(1,c)))*100});return(c,t)=>(x(),y("div",Qo,[t[2]||(t[2]=s("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Zo,[(x(),y(K,null,nt(o,i=>s("div",{key:i.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:at({top:`${l(i.value)}%`})},[t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),s("span",Ko,p(i.label),1)],4)),64)),s("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:at({top:`${r.value}%`})},[t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),s("span",Jo,p(Math.round(d.elevation))+"° ",1)],4)])]))}}),en={class:"w-full h-full"},on={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center"},nn={class:"w-full max-w-3xl"},an={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},sn={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},vn=J({__name:"HomeView",setup(d){const e=Ut(),{isLoading:o,galaxyCount:l}=qt(),r=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,c=D(null),t=D(!1),i=D(0),a=D(0),n=D(null),h=D(null),v=D(0),_=D(0),R=V(()=>r?h.value:n.value),P=V(()=>{var g,k;return((k=(g=c.value)==null?void 0:g.currentLookAt)==null?void 0:k.azimuth)??0}),O=V(()=>{var g,k;return((k=(g=c.value)==null?void 0:g.currentLookAt)==null?void 0:k.elevation)??0}),L=V(()=>{var k;const g=((k=c.value)==null?void 0:k.currentMaxRedshift)??0;return Ee(g)});function C(){var k;t.value=!0;const g=((k=c.value)==null?void 0:k.getAllGalaxiesCount())??0;i.value=g,a.value=g}function w(g){var q;const k=((q=c.value)==null?void 0:q.applyFilter(g.morphologies,g.sources))??0;a.value=k}function z(g){g?(n.value=g.galaxy,v.value=g.screenX,_.value=g.screenY):n.value=null}function X(g){g?(h.value=g.galaxy,v.value=g.screenX,_.value=g.screenY):h.value=null}function j(){h.value&&e.push(`/g/${h.value.pgc}`)}return(g,k)=>{var q;return x(),y("div",en,[T(He,{ref_key:"canvasRef",ref:c,onReady:C,onHover:z,onSelect:X},null,512),T(ho,{"galaxy-count":b(l),"current-location":((q=c.value)==null?void 0:q.currentLocation)??"North Pole","onUpdate:location":k[0]||(k[0]=S=>{var I;return(I=c.value)==null?void 0:I.setLocation(S)})},null,8,["galaxy-count","current-location"]),s("div",on,[s("div",nn,[T(Xo,{azimuth:P.value},null,8,["azimuth"])])]),s("div",an,[T(qo,{distance:L.value},null,8,["distance"])]),s("div",sn,[T(tn,{elevation:O.value},null,8,["elevation"])]),t.value?(x(),Ht(ko,{key:0,"total-count":i.value,"filtered-count":a.value,onFilterChange:w},null,8,["total-count","filtered-count"])):B("",!0),T(Ro,{galaxy:R.value,x:v.value,y:_.value,"show-cta":b(r),onNavigate:j},null,8,["galaxy","x","y","show-cta"]),T(Fo,{"is-loading":b(o)},null,8,["is-loading"])])}}});export{vn as default};
