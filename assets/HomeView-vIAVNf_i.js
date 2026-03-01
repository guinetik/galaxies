import{r as T,d as U,o as Zt,a as Kt,c as _,u as Jt,b as g,e as Mt,f as l,g as E,w as Q,t as b,h as L,i as X,F as K,j as it,k as te,l as Z,m as kt,T as Nt,n as Y,p as Lt,q as J,s as Gt}from"./index-DChIyG6-.js";import{V as O,W as ee,S as oe,G as ne,P as ae,C as se,B as yt,a as _t,N as ie,b as Yt,c as G,Q as Rt,d as le,T as re,e as ce,F as ue,M as de,f as It,A as he}from"./three.module-TGhSzrr1.js";import{R as ve,L as bt,C as H,a as pe,b as fe,c as me,D as xe,d as pt,e as Tt,M as ge,S as we,E as ye,f as Me}from"./constants-DEjRyabg.js";import{a as Vt,u as Bt}from"./galaxy-DNAY8gAh.js";import{m as _e,g as be}from"./GalaxyTextures-AsvTBieS.js";import{_ as xt}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Et=Math.PI/180;function Ce(h,o,a){const s=h*Et,i=o*Et,n=Math.cos(i);return new O(-a*n*Math.sin(s),a*Math.sin(i),-a*n*Math.cos(s))}function Dt(h){const o=ve;if(h>=o[0][0])return o[0][1];if(h<=o[o.length-1][0])return o[o.length-1][1];for(let a=0;a<o.length-1;a++){const[s,i]=o[a],[n,t]=o[a+1];if(h<=s&&h>=n){const u=(s-h)/(s-n);return i*Math.pow(t/i,u)}}return o[o.length-1][1]}function Se(h){return h*13968}function Ae(){const h=T(H),o=T(Dt(H)),a=T(xe),s=T({azimuth:0,elevation:0});let i=null,n=null,t=null,u=0,e=null,c=null,p=Math.PI,f=1.68,M=!1,A=0,P=0;const D=.003;let d=0,v=0;const w=.92,z=.76,$=1e-5,V=.08,gt=.85,tt=.03;let S=H;const F=.08;let I=0,W=0,et=0,q=0;const j=.04;function lt(r){e=r,i=new ee({canvas:r,antialias:!0,alpha:!1}),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setSize(window.innerWidth,window.innerHeight),i.setClearColor(0,1),n=new oe,c=new ne,n.add(c),t=new ae(H,window.innerWidth/window.innerHeight,pe,fe),t.position.set(...me),ot(),r.addEventListener("pointerdown",k),r.addEventListener("pointermove",C),r.addEventListener("pointerup",B),r.addEventListener("pointerleave",B),r.addEventListener("wheel",rt,{passive:!1}),r.addEventListener("touchstart",Ct,{passive:!1}),r.addEventListener("touchmove",St,{passive:!1}),r.addEventListener("touchend",At),window.addEventListener("resize",Pt)}function ct(){return c}function ot(){if(!t)return;const r=Math.sin(f)*Math.sin(p),x=Math.cos(f),R=Math.sin(f)*Math.cos(p),N=new O(t.position.x+r*100,t.position.y+x*100,t.position.z+R*100);t.lookAt(N),s.value={azimuth:p*180/Math.PI,elevation:90-f*180/Math.PI}}function ut(r){const x=r*Math.PI/180,R=H*Math.PI/180,N=Math.tan(x*.5)/Math.tan(R*.5),at=Math.pow(Math.max(0,N),gt);return Math.max(V,at)}function dt(r){const x=Math.max(0,Math.min(1,(r-pt)/(H-pt)));return z+(w-z)*x}function nt(){if(M||Math.abs(d)<$&&Math.abs(v)<$)return;const r=(t==null?void 0:t.fov)??H,x=dt(r);p+=d,f+=v,f=Math.max(.1,Math.min(Math.PI/2+.3,f)),d*=x,v*=x,ot()}function ht(r){const x=bt[r];x&&(a.value=r,W=(90-x.latitude)/180*Math.PI,et=-x.longitude/180*Math.PI)}function y(){if(!c)return;const r=W-I,x=et-q;Math.abs(r)<5e-4&&Math.abs(x)<5e-4?(I=W,q=et):(I+=r*j,q+=x*j),c.rotation.x=I,c.rotation.y=q}function m(){if(!t)return;const r=S-t.fov;Math.abs(r)<.01||(t.fov+=r*F,t.updateProjectionMatrix(),h.value=t.fov,o.value=Dt(t.fov))}function k(r){M=!0,A=r.clientX,P=r.clientY,d=0,v=0,e.style.cursor="grabbing"}function C(r){if(!M)return;const x=r.clientX-A,R=r.clientY-P;A=r.clientX,P=r.clientY;const N=(t==null?void 0:t.fov)??H,at=D*ut(N),qt=Math.max(-tt,Math.min(tt,-x*at)),Qt=Math.max(-tt,Math.min(tt,-R*at));d=d*.3+qt*.7,v=v*.3+Qt*.7,p+=d,f+=v,f=Math.max(.1,Math.min(Math.PI/2+.3,f)),ot()}function B(){M=!1,e&&(e.style.cursor="grab")}function rt(r){r.preventDefault();const x=r.deltaY*.05;S=Math.max(pt,Math.min(Tt,S+x))}let vt=0;function Ct(r){if(r.touches.length===2){r.preventDefault();const x=r.touches[0].clientX-r.touches[1].clientX,R=r.touches[0].clientY-r.touches[1].clientY;vt=Math.sqrt(x*x+R*R)}}function St(r){if(r.touches.length===2){r.preventDefault();const x=r.touches[0].clientX-r.touches[1].clientX,R=r.touches[0].clientY-r.touches[1].clientY,N=Math.sqrt(x*x+R*R),at=(vt-N)*.1;vt=N,S=Math.max(pt,Math.min(Tt,S+at))}}function At(){vt=0}function Pt(){!i||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight))}function Xt(){return n}function Ut(){return t}function Wt(){return M}function jt(r){const x=new se;function R(){u=requestAnimationFrame(R);const N=x.getElapsedTime();nt(),y(),m(),r(N),i.render(n,t)}R()}function Ht(){cancelAnimationFrame(u),e&&(e.removeEventListener("pointerdown",k),e.removeEventListener("pointermove",C),e.removeEventListener("pointerup",B),e.removeEventListener("pointerleave",B),e.removeEventListener("wheel",rt),e.removeEventListener("touchstart",Ct),e.removeEventListener("touchmove",St),e.removeEventListener("touchend",At)),window.removeEventListener("resize",Pt),i==null||i.dispose()}return{currentFov:h,currentMaxRedshift:o,currentLocation:a,currentLookAt:s,init:lt,getScene:Xt,getCamera:Ut,getIsDragging:Wt,getPivot:ct,startLoop:jt,setLocation:ht,dispose:Ht}}const Pe=`attribute float aSize;
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
`,ke=`precision highp float;

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
`;class Le{constructor(o,a){this.tempLocal=new O,this.tempWorld=new O,this.galaxies=o,this.atlasTexture=a,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.geometry=new yt,this.material=new _t({vertexShader:Pe,fragmentShader:ke,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:a}},transparent:!0,depthWrite:!1,blending:ie}),this.points=new Yt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(o)}rebuild(o){this.galaxies=o;const a=o.length,s=new Float32Array(a*3),i=new Float32Array(a*3),n=new Float32Array(a),t=new Float32Array(a),u=new Float32Array(a);for(let e=0;e<a;e++){const c=o[e],p=Ce(c.ra,c.dec,we);s[e*3]=p.x,s[e*3+1]=p.y,s[e*3+2]=p.z;const f=Vt(c.pgc),M=ge[f],A=c.pgc*2654435761>>>0,P=(A>>>8)%1024/1023,D=(A>>>18)%1024/1023,d=.9+P*.22,v=(D-.5)*.08;i[e*3]=Math.min(1,Math.max(0,M[0]*d+v*.5)),i[e*3+1]=Math.min(1,Math.max(0,M[1]*d)),i[e*3+2]=Math.min(1,Math.max(0,M[2]*d-v*.6));const w=8;n[e]=Math.max(1.5,Math.min(12,w/c.distance_mpc)),t[e]=(c.vcmb??0)/299792.458,u[e]=_e(f)}this.positions=s,this.sizes=n,this.redshifts=t,this.geometry.dispose(),this.geometry=new yt,this.geometry.setAttribute("position",new G(s,3)),this.geometry.setAttribute("aColor",new G(i,3)),this.geometry.setAttribute("aSize",new G(n,1)),this.geometry.setAttribute("aRedshift",new G(t,1)),this.geometry.setAttribute("aTexIndex",new G(u,1)),this.points.geometry=this.geometry}update(o,a,s){this.material.uniforms.uTime.value=o,this.material.uniforms.uMaxRedshift.value=a,this.material.uniforms.uFov.value=s}pickGalaxyAtScreen(o,a,s,i,n,t,u){this.points.updateWorldMatrix(!0,!1);let e=-1,c=Number.POSITIVE_INFINITY;const p=Math.min(window.devicePixelRatio,2),f=this.smoothstep(0,1,this.clamp01((52-u)/32));for(let M=0;M<this.galaxies.length;M++){const A=this.computeVisibilityAlpha(this.redshifts[M],t);if(A<.01)continue;const P=M*3;if(this.tempLocal.set(this.positions[P],this.positions[P+1],this.positions[P+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(s),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const D=(this.tempWorld.x*.5+.5)*i,d=(-this.tempWorld.y*.5+.5)*n,w=this.estimatePointSizePx(this.sizes[M],A,p,u,f)*.5,z=o-D,$=a-d;if(Math.abs(z)>w||Math.abs($)>w)continue;const V=z*z+$*$;V<c&&(c=V,e=M)}return e>=0?this.galaxies[e]:null}estimatePointSizePx(o,a,s,i,n){const t=.5+.5*a,u=60/i,e=o*s*u*t*3,c=1+.35*n,p=1.75-.75*n;return Math.max(2.8*s,e*c*p)}computeVisibilityAlpha(o,a){if(o<0||o>a)return 0;const s=a*.6;return o<s?1:this.smoothstep(a,s,o)}clamp01(o){return Math.max(0,Math.min(1,o))}smoothstep(o,a,s){const i=this.clamp01((s-o)/(a-o));return i*i*(3-2*i)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const Re="/assets/earth_day-DkcerPt2.jpg",Ie=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Te=`
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
`,Ee=.04;class De{constructor(){this.texture=null,this.currentQuat=new Rt,this.targetQuat=new Rt;const o=new le(ye,64,64),a=new re().load(Re);a.colorSpace=ce,this.texture=a;const s=new _t({vertexShader:Ie,fragmentShader:Te,uniforms:{uDayMap:{value:a}},side:ue,depthWrite:!0});this.mesh=new de(o,s),this.mesh.position.set(0,Me,0),this.mesh.renderOrder=-1}setLocation(o,a){const s=o*Math.PI/180,n=a*Math.PI/180+Math.PI,t=Math.PI/2-s,u=new O(-Math.cos(n)*Math.sin(t),Math.cos(t),Math.sin(n)*Math.sin(t)).normalize(),e=new O(0,1,0),c=u.clone(),p=new O;Math.abs(c.y)>.99?p.set(0,0,-1):p.copy(e).sub(c.clone().multiplyScalar(e.dot(c))).normalize();const f=new O().crossVectors(p,c).normalize(),M=new It().makeBasis(f,c,p),P=new It().makeBasis(new O(1,0,0),new O(0,1,0),new O(0,0,-1)).multiply(M.transpose());this.targetQuat.setFromRotationMatrix(P)}update(){this.currentQuat.slerp(this.targetQuat,Ee),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var o;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(o=this.texture)==null||o.dispose()}}const st=14e3,wt=800,ze=1.15;class Fe{constructor(){const o=new Float32Array(st*3),a=new Float32Array(st),s=new Float32Array(st),i=new Float32Array(st*3),n=new Float32Array(st);for(let e=0;e<st;e++){const c=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);o[e*3]=wt*Math.sin(p)*Math.cos(c),o[e*3+1]=wt*Math.cos(p),o[e*3+2]=wt*Math.sin(p)*Math.sin(c),a[e]=ze*(.35+Math.random()*.85),s[e]=.18+Math.random()*.42,n[e]=Math.random()*Math.PI*2;const f=Math.random();f<.55?(i[e*3]=.8+Math.random()*.12,i[e*3+1]=.85+Math.random()*.1,i[e*3+2]=.95+Math.random()*.05):f<.88?(i[e*3]=.95+Math.random()*.05,i[e*3+1]=.92+Math.random()*.07,i[e*3+2]=.82+Math.random()*.12):(i[e*3]=.75+Math.random()*.2,i[e*3+1]=.82+Math.random()*.14,i[e*3+2]=.95+Math.random()*.05)}const t=new yt;t.setAttribute("position",new G(o,3)),t.setAttribute("aSize",new G(a,1)),t.setAttribute("aOpacity",new G(s,1)),t.setAttribute("aColor",new G(i,3)),t.setAttribute("aPhase",new G(n,1));const u=new _t({vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:he,uniforms:{uTime:{value:0}}});this.points=new Yt(t,u),this.points.frustumCulled=!1}update(o){this.points.material.uniforms.uTime.value=o}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const zt=5,$e=U({__name:"GalaxyCanvas",emits:["ready","hover"],setup(h,{expose:o,emit:a}){const s=a,i=Jt(),n=T(null),{currentFov:t,currentMaxRedshift:u,currentLocation:e,currentLookAt:c,init:p,getScene:f,getCamera:M,getIsDragging:A,getPivot:P,startLoop:D,setLocation:d,dispose:v}=Ae(),{ready:w,getAllGalaxies:z}=Bt();function $(y){d(y);const m=bt[y];m&&F&&F.setLocation(m.latitude,m.longitude)}let V=[];function gt(y,m){if(!S)return 0;const k=V.filter(C=>{const B=Vt(C.pgc,C.morphology);return y.has(B)&&m.has(C.source??"CF4")});return S.rebuild(k),k.length}function tt(){return V.length}o({currentFov:t,currentMaxRedshift:u,currentLocation:e,currentLookAt:c,setLocation:$,applyFilter:gt,getAllGalaxiesCount:tt});let S=null,F=null,I=null,W=!1,et=0,q=0,j=!1,lt=!1;function ct(y){if(!S||!n.value)return null;const m=n.value.getBoundingClientRect(),k=y.clientX-m.left,C=y.clientY-m.top;return k<0||C<0||k>m.width||C>m.height?null:S.pickGalaxyAtScreen(k,C,M(),m.width,m.height,u.value,t.value)}function ot(y){if(W){const k=y.clientX-et,C=y.clientY-q;k*k+C*C>zt*zt&&(j=!0)}if(A()){s("hover",null);return}const m=ct(y);m?(n.value.style.cursor="pointer",s("hover",{galaxy:m,screenX:y.clientX,screenY:y.clientY})):(n.value.style.cursor="grab",s("hover",null))}function ut(){W=!1,j=!1,s("hover",null)}function dt(y){W=!0,et=y.clientX,q=y.clientY,j=!1}function nt(){j&&(lt=!0),W=!1,j=!1}function ht(y){if(lt){lt=!1;return}if(A())return;const m=ct(y);m&&i.push(`/g/${m.pgc}`)}return Zt(async()=>{if(!n.value)return;p(n.value);const y=f(),m=P();await w,V=z();const k=be();S=new Le(V,k),F=new De,I=new Fe,m.add(I.points),m.add(S.points),y.add(F.mesh),D(C=>{S==null||S.update(C,u.value,t.value),I==null||I.update(C),F==null||F.update()}),n.value.addEventListener("pointermove",ot),n.value.addEventListener("pointerdown",dt),n.value.addEventListener("pointerup",nt),n.value.addEventListener("pointercancel",nt),n.value.addEventListener("pointerleave",ut),n.value.addEventListener("click",ht),s("ready")}),Kt(()=>{var y,m,k,C,B,rt;(y=n.value)==null||y.removeEventListener("pointermove",ot),(m=n.value)==null||m.removeEventListener("pointerdown",dt),(k=n.value)==null||k.removeEventListener("pointerup",nt),(C=n.value)==null||C.removeEventListener("pointercancel",nt),(B=n.value)==null||B.removeEventListener("pointerleave",ut),(rt=n.value)==null||rt.removeEventListener("click",ht),S==null||S.dispose(),F==null||F.dispose(),I==null||I.dispose(),v()}),(y,m)=>(g(),_("canvas",{ref_key:"canvasRef",ref:n,class:"fixed inset-0 w-full h-full",style:{cursor:"grab"}},null,512))}}),Oe={class:"fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm"},Ne={class:"flex items-center gap-4"},Ge={class:"flex items-center gap-4"},Ye={key:0,class:"text-xs text-white/50"},Ve=["value"],Be=["value"],Xe=["value"],Ue=U({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(h){const{t:o,locale:a}=Mt(),s=Object.keys(bt);function i(n){a.value=n,localStorage.setItem("locale",n)}return(n,t)=>{const u=te("router-link");return g(),_("header",Oe,[l("div",Ne,[E(u,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors"},{default:Q(()=>[Z(b(L(o)("header.siteName")),1)]),_:1}),E(u,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:Q(()=>[Z(b(L(o)("nav.about")),1)]),_:1}),E(u,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:Q(()=>[Z(b(L(o)("nav.map")),1)]),_:1}),E(u,{to:"/cosmography",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:Q(()=>[Z(b(L(o)("nav.cosmography")),1)]),_:1}),E(u,{to:"/spacetime",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:Q(()=>[Z(b(L(o)("nav.spacetime")),1)]),_:1})]),l("div",Ge,[h.galaxyCount>0?(g(),_("span",Ye,b(L(o)("app.loaded",{count:h.galaxyCount.toLocaleString()})),1)):X("",!0),l("select",{value:h.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:t[0]||(t[0]=e=>n.$emit("update:location",e.target.value))},[(g(!0),_(K,null,it(L(s),e=>(g(),_("option",{key:e,value:e,class:"bg-gray-900"},b(e),9,Be))),128))],40,Ve),l("select",{value:L(a),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:t[1]||(t[1]=e=>i(e.target.value))},[...t[2]||(t[2]=[l("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),l("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,Xe)])])}}}),We={key:0,class:"pill-count"},je={key:0,class:"filter-panel"},He={class:"panel-header"},qe={class:"panel-title"},Qe={class:"section"},Ze={class:"section-label"},Ke={class:"chip-row"},Je=["onClick"],to={class:"section"},eo={class:"section-label"},oo={class:"chip-row"},no=["onClick"],ao={class:"panel-footer"},so=U({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(h,{emit:o}){const{t:a}=Mt(),s=h,i=o,n=T(!1),t=["spiral","barred","elliptical","lenticular","irregular"],u=["CF4","ALFALFA","FSS","UGC"],e=kt(new Set(t)),c=kt(new Set(u)),p=Y(()=>e.size<t.length||c.size<u.length),f=Y(()=>s.filteredCount.toLocaleString()),M=Y(()=>s.totalCount.toLocaleString());function A(d){e.has(d)?e.size>1&&e.delete(d):e.add(d),D()}function P(d){c.has(d)?c.size>1&&c.delete(d):c.add(d),D()}function D(){i("filter-change",{morphologies:new Set(e),sources:new Set(c)})}return(d,v)=>(g(),_(K,null,[n.value?X("",!0):(g(),_("button",{key:0,class:"filter-pill",onClick:v[0]||(v[0]=w=>n.value=!0)},[v[2]||(v[2]=l("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[l("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),l("span",null,b(L(a)("pages.home.filter")),1),p.value?(g(),_("span",We,b(f.value),1)):X("",!0)])),E(Nt,{name:"panel"},{default:Q(()=>[n.value?(g(),_("div",je,[l("div",He,[l("span",qe,b(L(a)("pages.home.filter")),1),l("button",{class:"close-btn",onClick:v[1]||(v[1]=w=>n.value=!1),"aria-label":"Close"},[...v[3]||(v[3]=[l("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[l("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),l("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),l("div",Qe,[l("div",Ze,b(L(a)("pages.home.morphologyLabel")),1),l("div",Ke,[(g(),_(K,null,it(t,w=>l("button",{key:w,class:Lt(["chip",{active:e.has(w)}]),onClick:z=>A(w)},b(L(a)("morphology."+w)),11,Je)),64))])]),l("div",to,[l("div",eo,b(L(a)("pages.home.catalogLabel")),1),l("div",oo,[(g(),_(K,null,it(u,w=>l("button",{key:w,class:Lt(["chip",{active:c.has(w)}]),onClick:z=>P(w)},b(w),11,no)),64))])]),l("div",ao,b(L(a)("pages.home.showing",{count:f.value,total:M.value})),1)])):X("",!0)]),_:1})],64))}}),io=xt(so,[["__scopeId","data-v-647995f5"]]),lo={class:"tooltip-name"},ro={class:"tooltip-row"},co={key:0,class:"tooltip-row"},uo=U({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{}},setup(h){return(o,a)=>h.galaxy?(g(),_("div",{key:0,class:"galaxy-tooltip",style:J({left:h.x+"px",top:h.y+"px"})},[l("div",lo,"PGC "+b(h.galaxy.pgc),1),l("div",ro,[a[0]||(a[0]=l("span",{class:"tooltip-label"},"Distance",-1)),Z(" "+b(Math.round(h.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),h.galaxy.vcmb!=null?(g(),_("div",co,[a[1]||(a[1]=l("span",{class:"tooltip-label"},"Velocity",-1)),Z(" "+b(h.galaxy.vcmb.toLocaleString())+" km/s ",1)])):X("",!0)],4)):X("",!0)}}),ho=xt(uo,[["__scopeId","data-v-8a9f4504"]]),vo={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},po={class:"text-center"},fo={class:"text-sm text-white/70 tracking-wide"},mo=U({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(h){const{t:o}=Mt();return(a,s)=>(g(),Gt(Nt,{name:"fade"},{default:Q(()=>[h.isLoading?(g(),_("div",vo,[l("div",po,[s[0]||(s[0]=l("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),l("p",fo,b(L(o)("app.loading")),1)])])):X("",!0)]),_:1}))}}),xo=xt(mo,[["__scopeId","data-v-c1ac9ae0"]]),go={class:"space-compass pointer-events-none select-none"},wo={class:"compass-tape relative w-full h-12 overflow-hidden"},yo={key:0,class:"w-px h-3 bg-white/40 flex-none"},Mo={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},_o={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Ft=4,bo=U({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(h){const o=h,a=Y(()=>o.azimuth*Ft),s=Y(()=>{const i=o.azimuth,n=500,t=Math.floor(i-n),u=Math.ceil(i+n),e=[];for(let c=t;c<=u;c++){let p=c%360;p<0&&(p+=360);const f=p%15===0;(p%5===0||f)&&e.push({value:c,offset:c*Ft,isMajor:f,label:f?`${Math.round(p)}°`:null})}return e});return(i,n)=>(g(),_("div",go,[l("div",wo,[n[0]||(n[0]=l("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[l("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),l("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),l("div",{class:"absolute top-0 h-full will-change-transform",style:J({transform:`translateX(calc(50% - ${a.value}px))`})},[(g(!0),_(K,null,it(s.value,t=>(g(),_("div",{key:t.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:J({left:`${t.offset}px`})},[t.isMajor?(g(),_("div",yo)):(g(),_("div",Mo)),t.label?(g(),_("div",_o,b(t.label),1)):X("",!0)],4))),128))],4),n[1]||(n[1]=l("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Co=xt(bo,[["__scopeId","data-v-6e465829"]]),So={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Ao={class:"relative w-full h-full"},Po={class:"mr-2 text-[10px] font-mono text-white/30"},ko={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},ft=0,$t=1600,Lo=U({__name:"DistanceIndicator",props:{distance:{}},setup(h){const o=h,a=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function s(n){return(1-(n-ft)/($t-ft))*100}const i=Y(()=>{const n=(o.distance-ft)/($t-ft);return(1-Math.max(0,Math.min(1,n)))*100});return(n,t)=>(g(),_("div",So,[t[2]||(t[2]=l("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),l("div",Ao,[(g(),_(K,null,it(a,u=>l("div",{key:u.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:J({top:`${s(u.value)}%`})},[l("span",Po,b(u.label),1),t[0]||(t[0]=l("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),l("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:J({top:`${i.value}%`})},[l("span",ko,b(Math.round(h.distance))+" mLY ",1),t[1]||(t[1]=l("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Ro={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},Io={class:"relative w-full h-full"},To={class:"ml-2 text-[10px] font-mono text-white/30"},Eo={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},mt=-90,Ot=90,Do=U({__name:"ElevationIndicator",props:{elevation:{}},setup(h){const o=h,a=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function s(n){return(1-(n-mt)/(Ot-mt))*100}const i=Y(()=>{const n=(o.elevation-mt)/(Ot-mt);return(1-Math.max(0,Math.min(1,n)))*100});return(n,t)=>(g(),_("div",Ro,[t[2]||(t[2]=l("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),l("div",Io,[(g(),_(K,null,it(a,u=>l("div",{key:u.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:J({top:`${s(u.value)}%`})},[t[0]||(t[0]=l("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),l("span",To,b(u.label),1)],4)),64)),l("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:J({top:`${i.value}%`})},[t[1]||(t[1]=l("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),l("span",Eo,b(Math.round(h.elevation))+"° ",1)],4)])]))}}),zo={class:"w-full h-full"},Fo={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center"},$o={class:"w-full max-w-3xl"},Oo={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},No={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none"},Wo=U({__name:"HomeView",setup(h){const{isLoading:o,galaxyCount:a}=Bt(),s=T(null),i=T(!1),n=T(0),t=T(0),u=T(null),e=T(0),c=T(0),p=Y(()=>{var d,v;return((v=(d=s.value)==null?void 0:d.currentLookAt)==null?void 0:v.azimuth)??0}),f=Y(()=>{var d,v;return((v=(d=s.value)==null?void 0:d.currentLookAt)==null?void 0:v.elevation)??0}),M=Y(()=>{var v;const d=((v=s.value)==null?void 0:v.currentMaxRedshift)??0;return Se(d)});function A(){var v;i.value=!0;const d=((v=s.value)==null?void 0:v.getAllGalaxiesCount())??0;n.value=d,t.value=d}function P(d){var w;const v=((w=s.value)==null?void 0:w.applyFilter(d.morphologies,d.sources))??0;t.value=v}function D(d){d?(u.value=d.galaxy,e.value=d.screenX,c.value=d.screenY):u.value=null}return(d,v)=>{var w;return g(),_("div",zo,[E($e,{ref_key:"canvasRef",ref:s,onReady:A,onHover:D},null,512),E(Ue,{"galaxy-count":L(a),"current-location":((w=s.value)==null?void 0:w.currentLocation)??"North Pole","onUpdate:location":v[0]||(v[0]=z=>{var $;return($=s.value)==null?void 0:$.setLocation(z)})},null,8,["galaxy-count","current-location"]),l("div",Fo,[l("div",$o,[E(Co,{azimuth:p.value},null,8,["azimuth"])])]),l("div",Oo,[E(Lo,{distance:M.value},null,8,["distance"])]),l("div",No,[E(Do,{elevation:f.value},null,8,["elevation"])]),i.value?(g(),Gt(io,{key:0,"total-count":n.value,"filtered-count":t.value,onFilterChange:P},null,8,["total-count","filtered-count"])):X("",!0),E(ho,{galaxy:u.value,x:e.value,y:c.value},null,8,["galaxy","x","y"]),E(xo,{"is-loading":L(o)},null,8,["is-loading"])])}}});export{Wo as default};
