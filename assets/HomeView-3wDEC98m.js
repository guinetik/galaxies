import{r as O,d as J,o as Ft,a as Ot,c as N,u as zt,b as D,e as _t,f as R,g as H,w as rt,t as z,h as F,i as lt,F as Nt,j as Gt,k as Yt,l as K,n as Vt,m as Ut,T as Bt}from"./index-B-aYuHDU.js";import{V as q,W as Xt,S as Wt,G as Ht,P as $t,C as jt,B as Ct,a as k,b as ut,N as qt,c as At,Q as gt,d as Qt,T as Zt,e as Kt,F as Jt,M as te,A as ee,_ as Pt}from"./_plugin-vue_export-helper-DMT_hbaD.js";import{R as oe,L as ht,C as V,a as ne,b as ae,c as ie,D as se,d as st,e as Mt,M as re,S as le,E as ce,f as ue}from"./constants-DEjRyabg.js";import{a as he,u as Rt}from"./galaxy-CE9Npv48.js";import{m as de,g as ve}from"./GalaxyTextures-B8gp7_Z8.js";const yt=Math.PI/180;function me(u,e,a){const o=u*yt,s=e*yt,t=Math.cos(s);return new q(-a*t*Math.sin(o),a*Math.sin(s),-a*t*Math.cos(o))}function wt(u){const e=oe;if(u>=e[0][0])return e[0][1];if(u<=e[e.length-1][0])return e[e.length-1][1];for(let a=0;a<e.length-1;a++){const[o,s]=e[a],[t,l]=e[a+1];if(u<=o&&u>=t){const r=(o-u)/(o-t);return s*Math.pow(l/s,r)}}return e[e.length-1][1]}function fe(){const u=O(V),e=O(wt(V)),a=O(se);let o=null,s=null,t=null,l=0,r=null,i=null,h=Math.PI,c=1.68,f=!1,p=0,M=0;const w=.003;let S=0,_=0;const G=.92,b=.76,L=1e-5,x=.08,g=.85,C=.03;let I=V;const tt=.08;let U=0,E=0,B=0,X=0;const Q=.04;function et(n){r=n,o=new Xt({canvas:n,antialias:!0,alpha:!1}),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.setSize(window.innerWidth,window.innerHeight),o.setClearColor(0,1),s=new Wt,i=new Ht,s.add(i),t=new $t(V,window.innerWidth/window.innerHeight,ne,ae),t.position.set(...ie),Y(),n.addEventListener("pointerdown",Z),n.addEventListener("pointermove",dt),n.addEventListener("pointerup",at),n.addEventListener("pointerleave",at),n.addEventListener("wheel",vt,{passive:!1}),n.addEventListener("touchstart",mt,{passive:!1}),n.addEventListener("touchmove",ft,{passive:!1}),n.addEventListener("touchend",pt),window.addEventListener("resize",xt)}function ot(){return i}function Y(){if(!t)return;const n=Math.sin(c)*Math.sin(h),d=Math.cos(c),y=Math.sin(c)*Math.cos(h),T=new q(t.position.x+n*100,t.position.y+d*100,t.position.z+y*100);t.lookAt(T)}function nt(n){const d=n*Math.PI/180,y=V*Math.PI/180,T=Math.tan(d*.5)/Math.tan(y*.5),$=Math.pow(Math.max(0,T),g);return Math.max(x,$)}function m(n){const d=Math.max(0,Math.min(1,(n-st)/(V-st)));return b+(G-b)*d}function v(){if(f||Math.abs(S)<L&&Math.abs(_)<L)return;const n=(t==null?void 0:t.fov)??V,d=m(n);h+=S,c+=_,c=Math.max(.1,Math.min(Math.PI/2+.3,c)),S*=d,_*=d,Y()}function A(n){const d=ht[n];d&&(a.value=n,E=(90-d.latitude)/180*Math.PI,B=-d.longitude/180*Math.PI)}function P(){if(!i)return;const n=E-U,d=B-X;Math.abs(n)<5e-4&&Math.abs(d)<5e-4?(U=E,X=B):(U+=n*Q,X+=d*Q),i.rotation.x=U,i.rotation.y=X}function W(){if(!t)return;const n=I-t.fov;Math.abs(n)<.01||(t.fov+=n*tt,t.updateProjectionMatrix(),u.value=t.fov,e.value=wt(t.fov))}function Z(n){f=!0,p=n.clientX,M=n.clientY,S=0,_=0,r.style.cursor="grabbing"}function dt(n){if(!f)return;const d=n.clientX-p,y=n.clientY-M;p=n.clientX,M=n.clientY;const T=(t==null?void 0:t.fov)??V,$=w*nt(T),Dt=Math.max(-C,Math.min(C,-d*$)),Et=Math.max(-C,Math.min(C,-y*$));S=S*.3+Dt*.7,_=_*.3+Et*.7,h+=S,c+=_,c=Math.max(.1,Math.min(Math.PI/2+.3,c)),Y()}function at(){f=!1,r&&(r.style.cursor="grab")}function vt(n){n.preventDefault();const d=n.deltaY*.05;I=Math.max(st,Math.min(Mt,I+d))}let it=0;function mt(n){if(n.touches.length===2){n.preventDefault();const d=n.touches[0].clientX-n.touches[1].clientX,y=n.touches[0].clientY-n.touches[1].clientY;it=Math.sqrt(d*d+y*y)}}function ft(n){if(n.touches.length===2){n.preventDefault();const d=n.touches[0].clientX-n.touches[1].clientX,y=n.touches[0].clientY-n.touches[1].clientY,T=Math.sqrt(d*d+y*y),$=(it-T)*.1;it=T,I=Math.max(st,Math.min(Mt,I+$))}}function pt(){it=0}function xt(){!o||!t||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),o.setSize(window.innerWidth,window.innerHeight))}function bt(){return s}function Lt(){return t}function It(){return f}function Tt(n){const d=new jt;function y(){l=requestAnimationFrame(y);const T=d.getElapsedTime();v(),P(),W(),n(T),o.render(s,t)}y()}function kt(){cancelAnimationFrame(l),r&&(r.removeEventListener("pointerdown",Z),r.removeEventListener("pointermove",dt),r.removeEventListener("pointerup",at),r.removeEventListener("pointerleave",at),r.removeEventListener("wheel",vt),r.removeEventListener("touchstart",mt),r.removeEventListener("touchmove",ft),r.removeEventListener("touchend",pt)),window.removeEventListener("resize",xt),o==null||o.dispose()}return{currentFov:u,currentMaxRedshift:e,currentLocation:a,init:et,getScene:bt,getCamera:Lt,getIsDragging:It,getPivot:ot,startLoop:Tt,setLocation:A,dispose:kt}}const pe=`attribute float aSize;
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
`,xe=`precision highp float;

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
`;class ge{constructor(e,a){this.tempLocal=new q,this.tempWorld=new q,this.galaxies=e,this.atlasTexture=a;const o=e.length,s=new Float32Array(o*3),t=new Float32Array(o*3),l=new Float32Array(o),r=new Float32Array(o),i=new Float32Array(o);for(let h=0;h<o;h++){const c=e[h],f=me(c.ra,c.dec,le);s[h*3]=f.x,s[h*3+1]=f.y,s[h*3+2]=f.z;const p=he(c.pgc),M=re[p],w=c.pgc*2654435761>>>0,S=(w>>>8)%1024/1023,_=(w>>>18)%1024/1023,G=.9+S*.22,b=(_-.5)*.08;t[h*3]=Math.min(1,Math.max(0,M[0]*G+b*.5)),t[h*3+1]=Math.min(1,Math.max(0,M[1]*G)),t[h*3+2]=Math.min(1,Math.max(0,M[2]*G-b*.6));const L=8;l[h]=Math.max(1.5,Math.min(12,L/c.distance_mpc)),r[h]=(c.vcmb??0)/299792.458,i[h]=de(p)}this.positions=s,this.sizes=l,this.redshifts=r,this.geometry=new Ct,this.geometry.setAttribute("position",new k(s,3)),this.geometry.setAttribute("aColor",new k(t,3)),this.geometry.setAttribute("aSize",new k(l,1)),this.geometry.setAttribute("aRedshift",new k(r,1)),this.geometry.setAttribute("aTexIndex",new k(i,1)),this.material=new ut({vertexShader:pe,fragmentShader:xe,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uFov:{value:60},uTexture:{value:a}},transparent:!0,depthWrite:!1,blending:qt}),this.points=new At(this.geometry,this.material),this.points.frustumCulled=!1}update(e,a,o){this.material.uniforms.uTime.value=e,this.material.uniforms.uMaxRedshift.value=a,this.material.uniforms.uFov.value=o}pickGalaxyAtScreen(e,a,o,s,t,l,r){this.points.updateWorldMatrix(!0,!1);let i=-1,h=Number.POSITIVE_INFINITY;const c=Math.min(window.devicePixelRatio,2),f=this.smoothstep(0,1,this.clamp01((52-r)/32));for(let p=0;p<this.galaxies.length;p++){const M=this.computeVisibilityAlpha(this.redshifts[p],l);if(M<.01)continue;const w=p*3;if(this.tempLocal.set(this.positions[w],this.positions[w+1],this.positions[w+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(o),this.tempWorld.z<-1||this.tempWorld.z>1)continue;const S=(this.tempWorld.x*.5+.5)*s,_=(-this.tempWorld.y*.5+.5)*t,b=this.estimatePointSizePx(this.sizes[p],M,c,r,f)*.5,L=e-S,x=a-_;if(Math.abs(L)>b||Math.abs(x)>b)continue;const g=L*L+x*x;g<h&&(h=g,i=p)}return i>=0?this.galaxies[i]:null}estimatePointSizePx(e,a,o,s,t){const l=.5+.5*a,r=60/s,i=e*o*r*l*3,h=1+.35*t,c=1.75-.75*t;return Math.max(2.8*o,i*h*c)}computeVisibilityAlpha(e,a){if(e<0||e>a)return 0;const o=a*.6;return e<o?1:this.smoothstep(a,o,e)}clamp01(e){return Math.max(0,Math.min(1,e))}smoothstep(e,a,o){const s=this.clamp01((o-e)/(a-e));return s*s*(3-2*s)}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const Me="/assets/earth_day-DkcerPt2.jpg",ye=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,we=`
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
`,Se=.04;class _e{constructor(){this.texture=null,this.currentQuat=new gt,this.targetQuat=new gt;const e=new Qt(ce,64,64),a=new Zt().load(Me);a.colorSpace=Kt,this.texture=a;const o=new ut({vertexShader:ye,fragmentShader:we,uniforms:{uDayMap:{value:a}},side:Jt,depthWrite:!0});this.mesh=new te(e,o),this.mesh.position.set(0,ue,0),this.mesh.renderOrder=-1}setLocation(e,a){const o=e*Math.PI/180,t=a*Math.PI/180+Math.PI,l=Math.PI/2-o,r=new q(-Math.cos(t)*Math.sin(l),Math.cos(l),Math.sin(t)*Math.sin(l)).normalize();this.targetQuat.setFromUnitVectors(r,new q(0,1,0))}update(){this.currentQuat.slerp(this.targetQuat,Se),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var e;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(e=this.texture)==null||e.dispose()}}const j=14e3,ct=800,Ce=1.15;class Ae{constructor(){const e=new Float32Array(j*3),a=new Float32Array(j),o=new Float32Array(j),s=new Float32Array(j*3),t=new Float32Array(j);for(let i=0;i<j;i++){const h=Math.random()*Math.PI*2,c=Math.acos(2*Math.random()-1);e[i*3]=ct*Math.sin(c)*Math.cos(h),e[i*3+1]=ct*Math.cos(c),e[i*3+2]=ct*Math.sin(c)*Math.sin(h),a[i]=Ce*(.35+Math.random()*.85),o[i]=.18+Math.random()*.42,t[i]=Math.random()*Math.PI*2;const f=Math.random();f<.55?(s[i*3]=.8+Math.random()*.12,s[i*3+1]=.85+Math.random()*.1,s[i*3+2]=.95+Math.random()*.05):f<.88?(s[i*3]=.95+Math.random()*.05,s[i*3+1]=.92+Math.random()*.07,s[i*3+2]=.82+Math.random()*.12):(s[i*3]=.75+Math.random()*.2,s[i*3+1]=.82+Math.random()*.14,s[i*3+2]=.95+Math.random()*.05)}const l=new Ct;l.setAttribute("position",new k(e,3)),l.setAttribute("aSize",new k(a,1)),l.setAttribute("aOpacity",new k(o,1)),l.setAttribute("aColor",new k(s,3)),l.setAttribute("aPhase",new k(t,1));const r=new ut({vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ee,uniforms:{uTime:{value:0}}});this.points=new At(l,r),this.points.frustumCulled=!1}update(e){this.points.material.uniforms.uTime.value=e}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const St=5,Pe=J({__name:"GalaxyCanvas",emits:["ready","hover"],setup(u,{expose:e,emit:a}){const o=a,s=zt(),t=O(null),{currentFov:l,currentMaxRedshift:r,currentLocation:i,init:h,getScene:c,getCamera:f,getIsDragging:p,getPivot:M,startLoop:w,setLocation:S,dispose:_}=fe(),{ready:G,getAllGalaxies:b}=Rt();function L(m){S(m);const v=ht[m];v&&g&&g.setLocation(v.latitude,v.longitude)}e({currentFov:l,currentMaxRedshift:r,currentLocation:i,setLocation:L});let x=null,g=null,C=null,I=!1,tt=0,U=0,E=!1,B=!1;function X(m){if(!x||!t.value)return null;const v=t.value.getBoundingClientRect(),A=m.clientX-v.left,P=m.clientY-v.top;return A<0||P<0||A>v.width||P>v.height?null:x.pickGalaxyAtScreen(A,P,f(),v.width,v.height,r.value,l.value)}function Q(m){if(I){const A=m.clientX-tt,P=m.clientY-U;A*A+P*P>St*St&&(E=!0)}if(p()){o("hover",null);return}const v=X(m);v?(t.value.style.cursor="pointer",o("hover",{galaxy:v,screenX:m.clientX,screenY:m.clientY})):(t.value.style.cursor="grab",o("hover",null))}function et(){I=!1,E=!1,o("hover",null)}function ot(m){I=!0,tt=m.clientX,U=m.clientY,E=!1}function Y(){E&&(B=!0),I=!1,E=!1}function nt(m){if(B){B=!1;return}if(p())return;const v=X(m);v&&s.push(`/g/${v.pgc}`)}return Ft(async()=>{if(!t.value)return;h(t.value);const m=c(),v=M();await G;const A=b(),P=ve();x=new ge(A,P),g=new _e,C=new Ae,v.add(C.points),v.add(x.points),m.add(g.mesh),w(W=>{x==null||x.update(W,r.value,l.value),C==null||C.update(W),g==null||g.update()}),t.value.addEventListener("pointermove",Q),t.value.addEventListener("pointerdown",ot),t.value.addEventListener("pointerup",Y),t.value.addEventListener("pointercancel",Y),t.value.addEventListener("pointerleave",et),t.value.addEventListener("click",nt),o("ready")}),Ot(()=>{var m,v,A,P,W,Z;(m=t.value)==null||m.removeEventListener("pointermove",Q),(v=t.value)==null||v.removeEventListener("pointerdown",ot),(A=t.value)==null||A.removeEventListener("pointerup",Y),(P=t.value)==null||P.removeEventListener("pointercancel",Y),(W=t.value)==null||W.removeEventListener("pointerleave",et),(Z=t.value)==null||Z.removeEventListener("click",nt),x==null||x.dispose(),g==null||g.dispose(),C==null||C.dispose(),_()}),(m,v)=>(D(),N("canvas",{ref_key:"canvasRef",ref:t,class:"fixed inset-0 w-full h-full",style:{cursor:"grab"}},null,512))}}),Re={class:"fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm"},be={class:"flex items-center gap-4"},Le={class:"flex items-center gap-4"},Ie={key:0,class:"text-xs text-white/50"},Te=["value"],ke=["value"],De=["value"],Ee=J({__name:"AppHeader",props:{galaxyCount:{},currentLocation:{}},emits:["update:location"],setup(u){const{t:e,locale:a}=_t(),o=Object.keys(ht);function s(t){a.value=t,localStorage.setItem("locale",t)}return(t,l)=>{const r=Yt("router-link");return D(),N("header",Re,[R("div",be,[H(r,{to:"/",class:"text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors"},{default:rt(()=>[K(z(F(e)("header.siteName")),1)]),_:1}),H(r,{to:"/about",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:rt(()=>[K(z(F(e)("nav.about")),1)]),_:1}),H(r,{to:"/map",class:"text-xs text-white/50 hover:text-white/80 transition-colors"},{default:rt(()=>[K(z(F(e)("nav.map")),1)]),_:1})]),R("div",Le,[u.galaxyCount>0?(D(),N("span",Ie,z(F(e)("app.loaded",{count:u.galaxyCount.toLocaleString()})),1)):lt("",!0),R("select",{value:u.currentLocation,class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:l[0]||(l[0]=i=>t.$emit("update:location",i.target.value))},[(D(!0),N(Nt,null,Gt(F(o),i=>(D(),N("option",{key:i,value:i,class:"bg-gray-900"},z(i),9,ke))),128))],40,Te),R("select",{value:F(a),class:"bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer",onChange:l[1]||(l[1]=i=>s(i.target.value))},[...l[2]||(l[2]=[R("option",{value:"en-US",class:"bg-gray-900"},"EN",-1),R("option",{value:"pt-BR",class:"bg-gray-900"},"PT",-1)])],40,De)])])}}}),Fe={class:"tooltip-name"},Oe={class:"tooltip-row"},ze={key:0,class:"tooltip-row"},Ne=J({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{}},setup(u){return(e,a)=>u.galaxy?(D(),N("div",{key:0,class:"galaxy-tooltip",style:Vt({left:u.x+"px",top:u.y+"px"})},[R("div",Fe,"PGC "+z(u.galaxy.pgc),1),R("div",Oe,[a[0]||(a[0]=R("span",{class:"tooltip-label"},"Distance",-1)),K(" "+z(Math.round(u.galaxy.distance_mly).toLocaleString())+" Mly ",1)]),u.galaxy.vcmb!=null?(D(),N("div",ze,[a[1]||(a[1]=R("span",{class:"tooltip-label"},"Velocity",-1)),K(" "+z(u.galaxy.vcmb.toLocaleString())+" km/s ",1)])):lt("",!0)],4)):lt("",!0)}}),Ge=Pt(Ne,[["__scopeId","data-v-8a9f4504"]]),Ye={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},Ve={class:"text-center"},Ue={class:"text-sm text-white/70 tracking-wide"},Be=J({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(u){const{t:e}=_t();return(a,o)=>(D(),Ut(Bt,{name:"fade"},{default:rt(()=>[u.isLoading?(D(),N("div",Ye,[R("div",Ve,[o[0]||(o[0]=R("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),R("p",Ue,z(F(e)("app.loading")),1)])])):lt("",!0)]),_:1}))}}),Xe=Pt(Be,[["__scopeId","data-v-c1ac9ae0"]]),We={class:"w-full h-full"},Ze=J({__name:"HomeView",setup(u){const{isLoading:e,galaxyCount:a}=Rt(),o=O(null),s=O(!1),t=O(null),l=O(0),r=O(0);function i(){s.value=!0}function h(c){c?(t.value=c.galaxy,l.value=c.screenX,r.value=c.screenY):t.value=null}return(c,f)=>{var p;return D(),N("div",We,[H(Pe,{ref_key:"canvasRef",ref:o,onReady:i,onHover:h},null,512),H(Ee,{"galaxy-count":F(a),"current-location":((p=o.value)==null?void 0:p.currentLocation)??"North Pole","onUpdate:location":f[0]||(f[0]=M=>{var w;return(w=o.value)==null?void 0:w.setLocation(M)})},null,8,["galaxy-count","current-location"]),H(Ge,{galaxy:t.value,x:l.value,y:r.value},null,8,["galaxy","x","y"]),H(Xe,{"is-loading":F(e)},null,8,["is-loading"])])}}});export{Ze as default};
