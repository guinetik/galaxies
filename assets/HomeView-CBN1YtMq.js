import{r as z,d as J,o as ne,a as ae,c as b,u as Ut,b as w,e as _t,F as K,f as s,g as k,w as D,t as v,h as g,i as B,j as nt,n as Mt,T as At,k as se,l as $,m as ie,p as le,v as re,q as $t,s as V,x as at,y as Ht}from"./index-BgOoul0s.js";import{V as G,W as ce,S as ue,G as de,P as he,C as ve,B as kt,a as Pt,N as pe,b as Wt,c as Y,Q as zt,d as fe,T as me,e as xe,F as ge,M as we,f as Ft,A as ye}from"./three.module-CcW3xBYB.js";import{R as be,L as It,C as tt,a as Me,b as _e,c as Ce,D as Se,d as wt,e as Ot,M as ke,S as Ae,E as Pe,f as Ie}from"./constants-DEjRyabg.js";import{a as jt,u as qt}from"./galaxy-DZ1kc9Ju.js";import{m as Te,g as Le}from"./GalaxyTextures-BjxMH18e.js";import{_ as ht}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Nt=Math.PI/180;function Re(d,e,o){const l=d*Nt,r=e*Nt,c=Math.cos(r);return new G(-o*c*Math.sin(l),o*Math.sin(r),-o*c*Math.cos(l))}function Gt(d){const e=be;if(d>=e[0][0])return e[0][1];if(d<=e[e.length-1][0])return e[e.length-1][1];for(let o=0;o<e.length-1;o++){const[l,r]=e[o],[c,t]=e[o+1];if(d<=l&&d>=c){const i=(l-d)/(l-c);return r*Math.pow(t/r,i)}}return e[e.length-1][1]}function Ee(d){return d*13968}function De(){const d=z(tt),e=z(Gt(tt)),o=z(Se),l=z({azimuth:0,elevation:0});let r=null,c=null,t=null,i=0,n=null,a=null,h=Math.PI,p=1.68,_=!1,R=0,I=0;const N=.003,L=.005;let C=0,y=0;const O=.92,X=.76,j=1e-5,x=.08,P=.025,q=.85,S=.03;let T=tt;const U=.08;let Q=0,st=0,it=0,H=0;const lt=.04;function Z(u){n=u,r=new ce({canvas:u,antialias:!0,alpha:!1}),r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setSize(window.innerWidth,window.innerHeight),r.setClearColor(0,1),c=new ue,a=new de,c.add(a),t=new he(tt,window.innerWidth/window.innerHeight,Me,_e),t.position.set(...Ce),rt(),u.addEventListener("pointerdown",m),u.addEventListener("pointermove",E),u.addEventListener("pointerup",A),u.addEventListener("pointerleave",A),u.addEventListener("wheel",et,{passive:!1}),u.addEventListener("touchstart",Tt,{passive:!1}),u.addEventListener("touchmove",Lt,{passive:!1}),u.addEventListener("touchend",Rt),window.addEventListener("resize",Et)}function pt(){return a}function rt(){if(!t)return;const u=Math.sin(p)*Math.sin(h),M=Math.cos(p),F=Math.sin(p)*Math.cos(h),W=new G(t.position.x+u*100,t.position.y+M*100,t.position.z+F*100);t.lookAt(W),l.value={azimuth:h*180/Math.PI,elevation:90-p*180/Math.PI}}function vt(u,M){const F=u*Math.PI/180,W=tt*Math.PI/180,ut=Math.tan(F*.5)/Math.tan(W*.5),Dt=Math.pow(Math.max(0,ut),q);return Math.max(M?P:x,Dt)}function ft(u){const M=Math.max(0,Math.min(1,(u-wt)/(tt-wt)));return X+(O-X)*M}function mt(){if(_||Math.abs(C)<j&&Math.abs(y)<j)return;const u=(t==null?void 0:t.fov)??tt,M=ft(u);h+=C,p+=y,p=Math.max(.1,Math.min(Math.PI/2+.3,p)),C*=M,y*=M,rt()}function ct(u){const M=It[u];M&&(o.value=u,st=(90-M.latitude)/180*Math.PI,it=-M.longitude/180*Math.PI)}function xt(){if(!a)return;const u=st-Q,M=it-H;Math.abs(u)<5e-4&&Math.abs(M)<5e-4?(Q=st,H=it):(Q+=u*lt,H+=M*lt),a.rotation.x=Q,a.rotation.y=H}function f(){if(!t)return;const u=T-t.fov;Math.abs(u)<.01||(t.fov+=u*U,t.updateProjectionMatrix(),d.value=t.fov,e.value=Gt(t.fov))}function m(u){gt||(_=!0,R=u.clientX,I=u.clientY,C=0,y=0,n.style.cursor="grabbing",n.setPointerCapture(u.pointerId))}function E(u){if(!_||gt)return;const M=u.clientX-R,F=u.clientY-I;R=u.clientX,I=u.clientY;const W=(t==null?void 0:t.fov)??tt,ut=u.pointerType==="touch",Ct=(ut?L:N)*vt(W,ut),ee=Math.max(-S,Math.min(S,-M*Ct)),oe=Math.max(-S,Math.min(S,-F*Ct));C=C*.3+ee*.7,y=y*.3+oe*.7,h+=C,p+=y,p=Math.max(.1,Math.min(Math.PI/2+.3,p)),rt()}function A(u){if(_=!1,n&&(n.style.cursor="grab",(u==null?void 0:u.pointerId)!=null))try{n.releasePointerCapture(u.pointerId)}catch{}}function et(u){u.preventDefault();const M=u.deltaY*.05;T=Math.max(wt,Math.min(Ot,T+M))}let ot=0,gt=!1;function Tt(u){if(u.touches.length===2){gt=!0,u.preventDefault();const M=u.touches[0].clientX-u.touches[1].clientX,F=u.touches[0].clientY-u.touches[1].clientY;ot=Math.sqrt(M*M+F*F)}}function Lt(u){if(u.touches.length===2){u.preventDefault();const M=u.touches[0].clientX-u.touches[1].clientX,F=u.touches[0].clientY-u.touches[1].clientY,W=Math.sqrt(M*M+F*F),ut=(ot-W)*.1;ot=W,T=Math.max(wt,Math.min(Ot,T+ut))}}function Rt(u){ot=0,u.touches.length<2&&(gt=!1)}function Et(){!r||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),r.setSize(window.innerWidth,window.innerHeight))}function Qt(){return c}function Zt(){return t}function Kt(){return _}function Jt(u){const M=new ve;function F(){i=requestAnimationFrame(F);const W=M.getElapsedTime();mt(),xt(),f(),u(W),r.render(c,t)}F()}function te(){cancelAnimationFrame(i),n&&(n.removeEventListener("pointerdown",m),n.removeEventListener("pointermove",E),n.removeEventListener("pointerup",A),n.removeEventListener("pointerleave",A),n.removeEventListener("wheel",et),n.removeEventListener("touchstart",Tt),n.removeEventListener("touchmove",Lt),n.removeEventListener("touchend",Rt)),window.removeEventListener("resize",Et),r==null||r.dispose()}return{currentFov:d,currentMaxRedshift:e,currentLocation:o,currentLookAt:l,init:Z,getScene:Qt,getCamera:Zt,getIsDragging:Kt,getPivot:pt,startLoop:Jt,setLocation:ct,dispose:te}}const $e=`attribute float aSize;
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
`;class Fe{constructor(e,o){this.selected=new Float32Array(0),this.selectedPgc=null,this.tempLocal=new G,this.tempWorld=new G,this.galaxies=e,this.atlasTexture=o,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.geometry=new kt,this.material=new Pt({vertexShader:$e,fragmentShader:ze,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:o}},transparent:!0,depthWrite:!1,blending:pe}),this.points=new Wt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(e)}rebuild(e){this.galaxies=e;const o=e.length,l=new Float32Array(o*3),r=new Float32Array(o*3),c=new Float32Array(o),t=new Float32Array(o),i=new Float32Array(o),n=new Float32Array(o);for(let a=0;a<o;a++){const h=e[a],p=Re(h.ra,h.dec,Ae);l[a*3]=p.x,l[a*3+1]=p.y,l[a*3+2]=p.z;const _=jt(h.pgc),R=ke[_],I=h.pgc*2654435761>>>0,N=(I>>>8)%1024/1023,L=(I>>>18)%1024/1023,C=.9+N*.22,y=(L-.5)*.08;r[a*3]=Math.min(1,Math.max(0,R[0]*C+y*.5)),r[a*3+1]=Math.min(1,Math.max(0,R[1]*C)),r[a*3+2]=Math.min(1,Math.max(0,R[2]*C-y*.6));const O=8;c[a]=Math.max(1.5,Math.min(12,O/h.distance_mpc)),t[a]=(h.vcmb??0)/299792.458,i[a]=Te(_),n[a]=this.selectedPgc!=null&&h.pgc===this.selectedPgc?1:0}this.positions=l,this.selected=n,this.sizes=c,this.redshifts=t,this.geometry.dispose(),this.geometry=new kt,this.geometry.setAttribute("position",new Y(l,3)),this.geometry.setAttribute("aColor",new Y(r,3)),this.geometry.setAttribute("aSize",new Y(c,1)),this.geometry.setAttribute("aRedshift",new Y(t,1)),this.geometry.setAttribute("aTexIndex",new Y(i,1)),this.geometry.setAttribute("aSelected",new Y(n,1)),this.points.geometry=this.geometry}setSelectedPgc(e){if(this.selectedPgc===e||(this.selectedPgc=e,!this.geometry.attributes.aSelected))return;const o=this.geometry.attributes.aSelected,l=o.array;for(let r=0;r<this.galaxies.length;r++)l[r]=e!=null&&this.galaxies[r].pgc===e?1:0;o.needsUpdate=!0}update(e,o,l){this.material.uniforms.uTime.value=e,this.material.uniforms.uMaxRedshift.value=o,this.material.uniforms.uFov.value=l}pickGalaxyAtScreen(e,o,l,r,c,t,i){this.points.updateWorldMatrix(!0,!1);let n=-1,a=Number.POSITIVE_INFINITY;const h=Math.min(window.devicePixelRatio,2),p=this.smoothstep(0,1,this.clamp01((52-i)/32));for(let _=0;_<this.galaxies.length;_++){const R=this.computeVisibilityAlpha(this.redshifts[_],t);if(R<.01)continue;const I=_*3;if(this.tempLocal.set(this.positions[I],this.positions[I+1],this.positions[I+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(l),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const N=(this.tempWorld.x*.5+.5)*r,L=(-this.tempWorld.y*.5+.5)*c,y=this.estimatePointSizePx(this.sizes[_],R,h,i,p)*.5,O=e-N,X=o-L;if(Math.abs(O)>y||Math.abs(X)>y)continue;const j=O*O+X*X;j<a&&(a=j,n=_)}return n>=0?this.galaxies[n]:null}estimatePointSizePx(e,o,l,r,c){const t=.5+.5*o,i=60/r,n=e*l*i*t*3,a=1+.35*c,h=1.75-.75*c;return Math.max(2.8*l,n*a*h)}computeVisibilityAlpha(e,o){if(e<0||e>o)return 0;const l=o*.6;return e<l?1:this.smoothstep(o,l,e)}clamp01(e){return Math.max(0,Math.min(1,e))}smoothstep(e,o,l){const r=this.clamp01((l-e)/(o-e));return r*r*(3-2*r)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const Oe="/assets/earth_day-DkcerPt2.jpg",Ne=`
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
`,Ye=.04;class Ve{constructor(){this.texture=null,this.currentQuat=new zt,this.targetQuat=new zt;const e=new fe(Pe,64,64),o=new me().load(Oe);o.colorSpace=xe,this.texture=o;const l=new Pt({vertexShader:Ne,fragmentShader:Ge,uniforms:{uDayMap:{value:o}},side:ge,depthWrite:!0});this.mesh=new we(e,l),this.mesh.position.set(0,Ie,0),this.mesh.renderOrder=-1}setLocation(e,o){const l=e*Math.PI/180,c=o*Math.PI/180+Math.PI,t=Math.PI/2-l,i=new G(-Math.cos(c)*Math.sin(t),Math.cos(t),Math.sin(c)*Math.sin(t)).normalize(),n=new G(0,1,0),a=i.clone(),h=new G;Math.abs(a.y)>.99?h.set(0,0,-1):h.copy(n).sub(a.clone().multiplyScalar(n.dot(a))).normalize();const p=new G().crossVectors(h,a).normalize(),_=new Ft().makeBasis(p,a,h),I=new Ft().makeBasis(new G(1,0,0),new G(0,1,0),new G(0,0,-1)).multiply(_.transpose());this.targetQuat.setFromRotationMatrix(I)}update(){this.currentQuat.slerp(this.targetQuat,Ye),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var e;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(e=this.texture)==null||e.dispose()}}const dt=14e3,St=800,Be=1.15;class Xe{constructor(){const e=new Float32Array(dt*3),o=new Float32Array(dt),l=new Float32Array(dt),r=new Float32Array(dt*3),c=new Float32Array(dt);for(let n=0;n<dt;n++){const a=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1);e[n*3]=St*Math.sin(h)*Math.cos(a),e[n*3+1]=St*Math.cos(h),e[n*3+2]=St*Math.sin(h)*Math.sin(a),o[n]=Be*(.35+Math.random()*.85),l[n]=.18+Math.random()*.42,c[n]=Math.random()*Math.PI*2;const p=Math.random();p<.55?(r[n*3]=.8+Math.random()*.12,r[n*3+1]=.85+Math.random()*.1,r[n*3+2]=.95+Math.random()*.05):p<.88?(r[n*3]=.95+Math.random()*.05,r[n*3+1]=.92+Math.random()*.07,r[n*3+2]=.82+Math.random()*.12):(r[n*3]=.75+Math.random()*.2,r[n*3+1]=.82+Math.random()*.14,r[n*3+2]=.95+Math.random()*.05)}const t=new kt;t.setAttribute("position",new Y(e,3)),t.setAttribute("aSize",new Y(o,1)),t.setAttribute("aOpacity",new Y(l,1)),t.setAttribute("aColor",new Y(r,3)),t.setAttribute("aPhase",new Y(c,1));const i=new Pt({vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ye,uniforms:{uTime:{value:0}}});this.points=new Wt(t,i),this.points.frustumCulled=!1}update(e){this.points.material.uniforms.uTime.value=e}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const Yt=5,Ue=J({__name:"GalaxyCanvas",emits:["ready","hover","select"],setup(d,{expose:e,emit:o}){const l=o,r=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,c=Ut(),t=z(null),{currentFov:i,currentMaxRedshift:n,currentLocation:a,currentLookAt:h,init:p,getScene:_,getCamera:R,getIsDragging:I,getPivot:N,startLoop:L,setLocation:C,dispose:y}=De(),{ready:O,getAllGalaxies:X}=qt();function j(f){C(f);const m=It[f];m&&T&&T.setLocation(m.latitude,m.longitude)}let x=[];function P(f,m){if(!S)return 0;const E=x.filter(A=>{const et=jt(A.pgc,A.morphology);return f.has(et)&&m.has(A.source??"CF4")});return S.rebuild(E),E.length}function q(){return x.length}e({currentFov:i,currentMaxRedshift:n,currentLocation:a,currentLookAt:h,setLocation:j,applyFilter:P,getAllGalaxiesCount:q});let S=null,T=null,U=null,Q=!1,st=0,it=0,H=!1,lt=!1,Z=null;function pt(f){if(!S||!t.value)return null;const m=t.value.getBoundingClientRect(),E=f.clientX-m.left,A=f.clientY-m.top;return E<0||A<0||E>m.width||A>m.height?null:S.pickGalaxyAtScreen(E,A,R(),m.width,m.height,n.value,i.value)}function rt(f){if(Q){const E=f.clientX-st,A=f.clientY-it;E*E+A*A>Yt*Yt&&(H=!0)}if(I()){l("hover",null);return}const m=pt(f);m?(t.value.style.cursor="pointer",l("hover",{galaxy:m,screenX:f.clientX,screenY:f.clientY})):(t.value.style.cursor="grab",r||l("hover",null))}function vt(f){Z=(f==null?void 0:f.galaxy)??null,S==null||S.setSelectedPgc((Z==null?void 0:Z.pgc)??null),l("select",f??null)}function ft(){Q=!1,H=!1,l("hover",null),r&&vt(null)}function mt(f){Q=!0,st=f.clientX,it=f.clientY,H=!1}function ct(){H&&(lt=!0),Q=!1,H=!1}function xt(f){if(lt){lt=!1;return}if(I())return;const m=pt(f);r?m?(Z==null?void 0:Z.pgc)===m.pgc?c.push(`/g/${m.pgc}`):vt({galaxy:m,screenX:f.clientX,screenY:f.clientY}):vt(null):m&&c.push(`/g/${m.pgc}`)}return ne(async()=>{if(!t.value)return;p(t.value);const f=_(),m=N();await O,x=X();const E=Le();S=new Fe(x,E),T=new Ve,U=new Xe,m.add(U.points),m.add(S.points),f.add(T.mesh),L(A=>{S==null||S.update(A,n.value,i.value),U==null||U.update(A),T==null||T.update()}),t.value.addEventListener("pointermove",rt),t.value.addEventListener("pointerdown",mt),t.value.addEventListener("pointerup",ct),t.value.addEventListener("pointercancel",ct),t.value.addEventListener("pointerleave",ft),t.value.addEventListener("click",xt),l("ready")}),ae(()=>{var f,m,E,A,et,ot;(f=t.value)==null||f.removeEventListener("pointermove",rt),(m=t.value)==null||m.removeEventListener("pointerdown",mt),(E=t.value)==null||E.removeEventListener("pointerup",ct),(A=t.value)==null||A.removeEventListener("pointercancel",ct),(et=t.value)==null||et.removeEventListener("pointerleave",ft),(ot=t.value)==null||ot.removeEventListener("click",xt),S==null||S.dispose(),T==null||T.dispose(),U==null||U.dispose(),y()}),(f,m)=>(w(),b("canvas",{ref_key:"canvasRef",ref:t,class:"fixed inset-0 w-full h-full galaxy-canvas"},null,512))}}),He=ht(Ue,[["__scopeId","data-v-a75277f6"]]),We={class:"fixed top-0 left-0 right-0 z-10 flex items-center px-4 py-2 bg-black/50 backdrop-blur-sm"},je={class:"hidden md:flex flex-1 justify-start"},qe={class:"hidden md:flex items-center gap-4 flex-shrink-0"},Qe={class:"hidden md:flex flex-1 items-center gap-4 justify-end"},Ze={key:0,class:"text-xs text-white/50"},Ke=["value"],Je=["value"],to=["value"],eo={class:"md:hidden flex items-center gap-2"},oo={key:0,class:"text-xs text-white/50 shrink-0"},no=["aria-expanded"],ao={class:"mobile-menu-controls"},so={class:"mobile-label"},io=["value"],lo=["value"],ro={class:"mobile-menu-controls"},co={class:"mobile-label"},uo=["value"],ho=J({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(d){const e=z(!1),{t:o,locale:l}=_t(),r=Object.keys(It);function c(t){l.value=t,localStorage.setItem("locale",t)}return(t,i)=>{const n=se("router-link");return w(),b(K,null,[s("header",We,[s("div",je,[k(n,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors"},{default:D(()=>[$(v(g(o)("header.siteName")),1)]),_:1})]),k(n,{to:"/",class:"md:hidden text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors shrink-0"},{default:D(()=>[$(v(g(o)("header.siteName")),1)]),_:1}),s("nav",qe,[k(n,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[$(v(g(o)("nav.about")),1)]),_:1}),k(n,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[$(v(g(o)("nav.map")),1)]),_:1}),k(n,{to:"/cosmography",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[$(v(g(o)("nav.cosmography")),1)]),_:1}),k(n,{to:"/spacetime",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[$(v(g(o)("nav.spacetime")),1)]),_:1}),k(n,{to:"/local-group",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:D(()=>[$(v(g(o)("nav.localGroup")),1)]),_:1})]),s("div",Qe,[d.galaxyCount>0?(w(),b("span",Ze,v(g(o)("app.loaded",{count:d.galaxyCount.toLocaleString()})),1)):B("",!0),s("select",{value:d.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[0]||(i[0]=a=>t.$emit("update:location",a.target.value))},[(w(!0),b(K,null,nt(g(r),a=>(w(),b("option",{key:a,value:a,class:"bg-gray-900"},v(a),9,Je))),128))],40,Ke),s("select",{value:g(l),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:i[1]||(i[1]=a=>c(a.target.value))},[...i[13]||(i[13]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,to)]),s("div",eo,[d.galaxyCount>0?(w(),b("span",oo,v(d.galaxyCount.toLocaleString()),1)):B("",!0),s("button",{type:"button",class:Mt(["hamburger p-2 -mr-2 text-white/80 hover:text-white transition-colors",{"is-open":e.value}]),"aria-expanded":e.value,"aria-label":"Toggle menu",onClick:i[2]||(i[2]=a=>e.value=!e.value)},[...i[14]||(i[14]=[s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1),s("span",{class:"hamburger-bar"},null,-1)])],10,no)])]),k(At,{name:"menu"},{default:D(()=>[ie(s("div",{class:"mobile-menu-overlay md:hidden",onClick:i[12]||(i[12]=a=>e.value=!1)},[s("nav",{class:"mobile-menu",onClick:i[11]||(i[11]=le(()=>{},["stop"]))},[k(n,{to:"/",class:"mobile-link",onClick:i[3]||(i[3]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.home")),1)]),_:1}),k(n,{to:"/about",class:"mobile-link",onClick:i[4]||(i[4]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.about")),1)]),_:1}),k(n,{to:"/map",class:"mobile-link",onClick:i[5]||(i[5]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.map")),1)]),_:1}),k(n,{to:"/cosmography",class:"mobile-link",onClick:i[6]||(i[6]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.cosmography")),1)]),_:1}),k(n,{to:"/spacetime",class:"mobile-link",onClick:i[7]||(i[7]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.spacetime")),1)]),_:1}),k(n,{to:"/local-group",class:"mobile-link",onClick:i[8]||(i[8]=a=>e.value=!1)},{default:D(()=>[$(v(g(o)("nav.localGroup")),1)]),_:1}),i[16]||(i[16]=s("div",{class:"mobile-menu-divider"},null,-1)),s("div",ao,[s("label",so,v(g(o)("header.location")),1),s("select",{value:d.currentLocation,class:"mobile-select",onChange:i[9]||(i[9]=a=>t.$emit("update:location",a.target.value))},[(w(!0),b(K,null,nt(g(r),a=>(w(),b("option",{key:a,value:a,class:"bg-gray-900"},v(a),9,lo))),128))],40,io)]),s("div",ro,[s("label",co,v(g(o)("header.language")),1),s("select",{value:g(l),class:"mobile-select",onChange:i[10]||(i[10]=a=>c(a.target.value))},[...i[15]||(i[15]=[s("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),s("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,uo)])])],512),[[re,e.value]])]),_:1})],64)}}}),vo=ht(ho,[["__scopeId","data-v-39de2ace"]]),po={key:0,class:"pill-count"},fo={key:0,class:"filter-panel"},mo={class:"panel-header"},xo={class:"panel-title"},go={class:"section"},wo={class:"section-label"},yo={class:"chip-row"},bo=["onClick"],Mo={class:"section"},_o={class:"section-label"},Co={class:"chip-row"},So=["onClick"],ko={class:"panel-footer"},Ao=J({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(d,{emit:e}){const{t:o}=_t(),l=d,r=e,c=z(!1),t=["spiral","barred","elliptical","lenticular","irregular"],i=["CF4","ALFALFA","FSS","UGC"],n=$t(new Set(t)),a=$t(new Set(i)),h=V(()=>n.size<t.length||a.size<i.length),p=V(()=>l.filteredCount.toLocaleString()),_=V(()=>l.totalCount.toLocaleString());function R(L){n.has(L)?n.size>1&&n.delete(L):n.add(L),N()}function I(L){a.has(L)?a.size>1&&a.delete(L):a.add(L),N()}function N(){r("filter-change",{morphologies:new Set(n),sources:new Set(a)})}return(L,C)=>(w(),b(K,null,[c.value?B("",!0):(w(),b("button",{key:0,class:"filter-pill",onClick:C[0]||(C[0]=y=>c.value=!0)},[C[2]||(C[2]=s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),s("span",null,v(g(o)("pages.home.filter")),1),h.value?(w(),b("span",po,v(p.value),1)):B("",!0)])),k(At,{name:"panel"},{default:D(()=>[c.value?(w(),b("div",fo,[s("div",mo,[s("span",xo,v(g(o)("pages.home.filter")),1),s("button",{class:"close-btn",onClick:C[1]||(C[1]=y=>c.value=!1),"aria-label":"Close"},[...C[3]||(C[3]=[s("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[s("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),s("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),s("div",go,[s("div",wo,v(g(o)("pages.home.morphologyLabel")),1),s("div",yo,[(w(),b(K,null,nt(t,y=>s("button",{key:y,class:Mt(["chip",{active:n.has(y)}]),onClick:O=>R(y)},v(g(o)("morphology."+y)),11,bo)),64))])]),s("div",Mo,[s("div",_o,v(g(o)("pages.home.catalogLabel")),1),s("div",Co,[(w(),b(K,null,nt(i,y=>s("button",{key:y,class:Mt(["chip",{active:a.has(y)}]),onClick:O=>I(y)},v(y),11,So)),64))])]),s("div",ko,v(g(o)("pages.home.showing",{count:p.value,total:_.value})),1)])):B("",!0)]),_:1})],64))}}),Po=ht(Ao,[["__scopeId","data-v-647995f5"]]),Io={class:"tooltip-name"},To={class:"tooltip-row"},Lo={key:0,class:"tooltip-row"},Ro=J({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{},showCta:{type:Boolean}},emits:["navigate"],setup(d){const{t:e}=_t();return(o,l)=>d.galaxy?(w(),b("div",{key:0,class:Mt(["galaxy-tooltip",{"has-cta":d.showCta}]),style:at({left:d.x+"px",top:d.y+"px"})},[s("div",Io,"PGC "+v(d.galaxy.pgc),1),s("div",To,[l[1]||(l[1]=s("span",{class:"tooltip-label"},"Distance",-1)),$(" "+v(Math.round(d.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),d.galaxy.vcmb!=null?(w(),b("div",Lo,[l[2]||(l[2]=s("span",{class:"tooltip-label"},"Velocity",-1)),$(" "+v(d.galaxy.vcmb.toLocaleString())+" km/s ",1)])):B("",!0),d.showCta?(w(),b("button",{key:1,type:"button",class:"tooltip-cta",onClick:l[0]||(l[0]=r=>o.$emit("navigate"))},v(g(e)("pages.home.goToGalaxy")),1)):B("",!0)],6)):B("",!0)}}),Eo=ht(Ro,[["__scopeId","data-v-a2b36d9a"]]),Do={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},$o={class:"text-center"},zo={class:"text-sm text-white/70 tracking-wide"},Fo=J({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(d){const{t:e}=_t();return(o,l)=>(w(),Ht(At,{name:"fade"},{default:D(()=>[d.isLoading?(w(),b("div",Do,[s("div",$o,[l[0]||(l[0]=s("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),s("p",zo,v(g(e)("app.loading")),1)])])):B("",!0)]),_:1}))}}),Oo=ht(Fo,[["__scopeId","data-v-c1ac9ae0"]]),No={class:"space-compass pointer-events-none select-none"},Go={class:"compass-tape relative w-full h-12 overflow-hidden"},Yo={key:0,class:"w-px h-3 bg-white/40 flex-none"},Vo={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},Bo={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Vt=4,Xo=J({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(d){const e=d,o=V(()=>e.azimuth*Vt),l=V(()=>{const r=e.azimuth,c=500,t=Math.floor(r-c),i=Math.ceil(r+c),n=[];for(let a=t;a<=i;a++){let h=a%360;h<0&&(h+=360);const p=h%15===0;(h%5===0||p)&&n.push({value:a,offset:a*Vt,isMajor:p,label:p?`${Math.round(h)}°`:null})}return n});return(r,c)=>(w(),b("div",No,[s("div",Go,[c[0]||(c[0]=s("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[s("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),s("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),s("div",{class:"absolute top-0 h-full will-change-transform",style:at({transform:`translateX(calc(50% - ${o.value}px))`})},[(w(!0),b(K,null,nt(l.value,t=>(w(),b("div",{key:t.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:at({left:`${t.offset}px`})},[t.isMajor?(w(),b("div",Yo)):(w(),b("div",Vo)),t.label?(w(),b("div",Bo,v(t.label),1)):B("",!0)],4))),128))],4),c[1]||(c[1]=s("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Uo=ht(Xo,[["__scopeId","data-v-6e465829"]]),Ho={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Wo={class:"relative w-full h-full"},jo={class:"mr-2 text-[10px] font-mono text-white/30"},qo={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},yt=0,Bt=1600,Qo=J({__name:"DistanceIndicator",props:{distance:{}},setup(d){const e=d,o=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function l(c){return(1-(c-yt)/(Bt-yt))*100}const r=V(()=>{const c=(e.distance-yt)/(Bt-yt);return(1-Math.max(0,Math.min(1,c)))*100});return(c,t)=>(w(),b("div",Ho,[t[2]||(t[2]=s("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Wo,[(w(),b(K,null,nt(o,i=>s("div",{key:i.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:at({top:`${l(i.value)}%`})},[s("span",jo,v(i.label),1),t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),s("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:at({top:`${r.value}%`})},[s("span",qo,v(Math.round(d.distance))+" mLY ",1),t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Zo={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},Ko={class:"relative w-full h-full"},Jo={class:"ml-2 text-[10px] font-mono text-white/30"},tn={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},bt=-90,Xt=90,en=J({__name:"ElevationIndicator",props:{elevation:{}},setup(d){const e=d,o=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function l(c){return(1-(c-bt)/(Xt-bt))*100}const r=V(()=>{const c=(e.elevation-bt)/(Xt-bt);return(1-Math.max(0,Math.min(1,c)))*100});return(c,t)=>(w(),b("div",Zo,[t[2]||(t[2]=s("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),s("div",Ko,[(w(),b(K,null,nt(o,i=>s("div",{key:i.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:at({top:`${l(i.value)}%`})},[t[0]||(t[0]=s("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),s("span",Jo,v(i.label),1)],4)),64)),s("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:at({top:`${r.value}%`})},[t[1]||(t[1]=s("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),s("span",tn,v(Math.round(d.elevation))+"° ",1)],4)])]))}}),on={class:"w-full h-full"},nn={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center"},an={class:"w-full max-w-3xl"},sn={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},ln={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},pn=J({__name:"HomeView",setup(d){const e=Ut(),{isLoading:o,galaxyCount:l}=qt(),r=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,c=z(null),t=z(!1),i=z(0),n=z(0),a=z(null),h=z(null),p=z(0),_=z(0),R=V(()=>r?h.value:a.value),I=V(()=>{var x,P;return((P=(x=c.value)==null?void 0:x.currentLookAt)==null?void 0:P.azimuth)??0}),N=V(()=>{var x,P;return((P=(x=c.value)==null?void 0:x.currentLookAt)==null?void 0:P.elevation)??0}),L=V(()=>{var P;const x=((P=c.value)==null?void 0:P.currentMaxRedshift)??0;return Ee(x)});function C(){var P;t.value=!0;const x=((P=c.value)==null?void 0:P.getAllGalaxiesCount())??0;i.value=x,n.value=x}function y(x){var q;const P=((q=c.value)==null?void 0:q.applyFilter(x.morphologies,x.sources))??0;n.value=P}function O(x){x?(a.value=x.galaxy,p.value=x.screenX,_.value=x.screenY):a.value=null}function X(x){x?(h.value=x.galaxy,p.value=x.screenX,_.value=x.screenY):h.value=null}function j(){h.value&&e.push(`/g/${h.value.pgc}`)}return(x,P)=>{var q;return w(),b("div",on,[k(He,{ref_key:"canvasRef",ref:c,onReady:C,onHover:O,onSelect:X},null,512),k(vo,{"galaxy-count":g(l),"current-location":((q=c.value)==null?void 0:q.currentLocation)??"North Pole","onUpdate:location":P[0]||(P[0]=S=>{var T;return(T=c.value)==null?void 0:T.setLocation(S)})},null,8,["galaxy-count","current-location"]),s("div",nn,[s("div",an,[k(Uo,{azimuth:I.value},null,8,["azimuth"])])]),s("div",sn,[k(Qo,{distance:L.value},null,8,["distance"])]),s("div",ln,[k(en,{elevation:N.value},null,8,["elevation"])]),t.value?(w(),Ht(Po,{key:0,"total-count":i.value,"filtered-count":n.value,onFilterChange:y},null,8,["total-count","filtered-count"])):B("",!0),k(Eo,{galaxy:R.value,x:p.value,y:_.value,"show-cta":g(r),onNavigate:j},null,8,["galaxy","x","y","show-cta"]),k(Oo,{"is-loading":g(o)},null,8,["is-loading"])])}}});export{pn as default};
