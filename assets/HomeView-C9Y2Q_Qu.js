import{R as ce,M as ue,r as F,L as Ut,C as K,a as he,b as de,c as pe,D as fe,d as _t,e as Ft,f as me,S as ve,E as xe,g as ge,h as tt,o as Me,i as Wt,j as L,u as Ht,k as P,_ as ut,l as At,m as Dt,F as ct,n as u,t as I,p as W,q,s as ot,w as jt,T as qt,v as H,x as vt,y as Rt,z as it,A as Zt,B as ye}from"./index-BslOHa1v.js";import{V as B,C as we,W as _e,S as be,G as Se,P as Pe,B as Tt,a as Qt,N as Kt,b as Jt,c as N,Q as Yt,d as Ae,T as Ce,e as Le,F as Re,M as Te,f as Nt,R as Ie}from"./three.module-DkVQHQlM.js";import{a as te,u as ee}from"./galaxy-D2ihyOcu.js";import{m as ke,g as ze}from"./GalaxyTextures-DjsATPrj.js";const $t=Math.PI/180;function Ee(h,t,a){const n=h*$t,s=t*$t,i=Math.cos(s);return new B(-a*i*Math.sin(n),a*Math.sin(s),-a*i*Math.cos(n))}function Pt(h){const t=ce;if(h>=t[0][0])return t[0][1];if(h<=t[t.length-1][0])return t[t.length-1][1];for(let a=0;a<t.length-1;a++){const[n,s]=t[a],[i,e]=t[a+1];if(h<=n&&h>=i){const o=(n-h)/(n-i);return s*Math.pow(e/s,o)}}return t[t.length-1][1]}function Ot(h){const t=ue;if(h>=t[0][0])return t[0][1];if(h<=t[t.length-1][0])return t[t.length-1][1];for(let a=0;a<t.length-1;a++){const[n,s]=t[a],[i,e]=t[a+1];if(h<=n&&h>=i){const o=(n-h)/(n-i);return s+(e-s)*o}}return t[t.length-1][1]}function It(h){return h*13968}function Fe(){const h=F(K),t=F(Pt(K)),a=F(Ot(K)),n=F(fe),s=F({azimuth:0,elevation:0});let i=null,e=null,o=null,r=0,c=null,d=null,p=Math.PI,m=1.68,_=!1,A=0,T=0;const M=.003,S=.005;let v=0,z=0;const E=.92,$=.76,D=1e-5,O=.08,g=.025,R=.85,y=.03;let k=K;const V=.08,Z=.032,J=.065;let U=0,X=0,et=0,G=0;const st=.04;function ht(l){c=l,i=new _e({canvas:l,antialias:!0,alpha:!1}),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setSize(window.innerWidth,window.innerHeight),i.setClearColor(0,1),e=new be,d=new Se,e.add(d),o=new Pe(K,window.innerWidth/window.innerHeight,he,de),o.position.set(...pe),at(),l.addEventListener("pointerdown",nt),l.addEventListener("pointermove",ft),l.addEventListener("pointerup",f),l.addEventListener("pointerleave",f),l.addEventListener("wheel",x,{passive:!1}),l.addEventListener("touchstart",Q,{passive:!1}),l.addEventListener("touchmove",mt,{passive:!1}),l.addEventListener("touchend",kt),window.addEventListener("resize",zt)}function dt(){return d}function at(){if(!o)return;const l=Math.sin(m)*Math.sin(p),w=Math.cos(m),Y=Math.sin(m)*Math.cos(p),j=new B(o.position.x+l*100,o.position.y+w*100,o.position.z+Y*100);o.lookAt(j),s.value={azimuth:p*180/Math.PI,elevation:90-m*180/Math.PI}}function xt(l,w){const Y=l*Math.PI/180,j=K*Math.PI/180,lt=Math.tan(Y*.5)/Math.tan(j*.5),Et=Math.pow(Math.max(0,lt),R);return Math.max(w?g:O,Et)}function gt(l){const w=Math.max(0,Math.min(1,(l-_t)/(K-_t)));return $+(E-$)*w}function Mt(){if(_||Math.abs(v)<D&&Math.abs(z)<D)return;const l=(o==null?void 0:o.fov)??K,w=gt(l);p+=v,m+=z,m=Math.max(.1,Math.min(Math.PI/2+.3,m)),v*=w,z*=w,at()}function pt(l){const w=Ut[l];w&&(n.value=l,X=(90-w.latitude)/180*Math.PI,et=-w.longitude/180*Math.PI)}function yt(){if(!d)return;const l=X-U,w=et-G;Math.abs(l)<5e-4&&Math.abs(w)<5e-4?(U=X,G=et):(U+=l*st,G+=w*st),d.rotation.x=U,d.rotation.y=G}function wt(){if(!o)return;const l=k-o.fov;Math.abs(l)<.01||(o.fov+=l*V,o.updateProjectionMatrix(),h.value=o.fov,t.value=Pt(o.fov),a.value=Ot(o.fov))}function nt(l){C||(_=!0,A=l.clientX,T=l.clientY,v=0,z=0,c.style.cursor="grabbing",c.setPointerCapture(l.pointerId))}function ft(l){if(!_||C)return;const w=l.clientX-A,Y=l.clientY-T;A=l.clientX,T=l.clientY;const j=(o==null?void 0:o.fov)??K,lt=l.pointerType==="touch",Ct=(lt?S:M)*xt(j,lt),le=Math.max(-y,Math.min(y,-w*Ct)),re=Math.max(-y,Math.min(y,-Y*Ct));v=v*.3+le*.7,z=z*.3+re*.7,p+=v,m+=z,m=Math.max(.1,Math.min(Math.PI/2+.3,m)),at()}function f(l){if(_=!1,c&&(c.style.cursor="grab",(l==null?void 0:l.pointerId)!=null))try{c.releasePointerCapture(l.pointerId)}catch{}}function x(l){l.preventDefault();const w=l.deltaY*Z;k=Math.max(_t,Math.min(Ft,k+w))}let b=0,C=!1;function Q(l){if(l.touches.length===2){C=!0,l.preventDefault();const w=l.touches[0].clientX-l.touches[1].clientX,Y=l.touches[0].clientY-l.touches[1].clientY;b=Math.sqrt(w*w+Y*Y)}}function mt(l){if(l.touches.length===2){l.preventDefault();const w=l.touches[0].clientX-l.touches[1].clientX,Y=l.touches[0].clientY-l.touches[1].clientY,j=Math.sqrt(w*w+Y*Y),lt=(b-j)*J;b=j,k=Math.max(_t,Math.min(Ft,k+lt))}}function kt(l){b=0,l.touches.length<2&&(C=!1)}function zt(){!i||!o||(o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight))}function ae(){return e}function ne(){return o}function oe(){return _}function ie(l){const w=new we;function Y(){r=requestAnimationFrame(Y);const j=w.getElapsedTime();Mt(),yt(),wt(),l(j),i.render(e,o)}Y()}function se(){cancelAnimationFrame(r),c&&(c.removeEventListener("pointerdown",nt),c.removeEventListener("pointermove",ft),c.removeEventListener("pointerup",f),c.removeEventListener("pointerleave",f),c.removeEventListener("wheel",x),c.removeEventListener("touchstart",Q),c.removeEventListener("touchmove",mt),c.removeEventListener("touchend",kt)),window.removeEventListener("resize",zt),i==null||i.dispose()}return{currentFov:h,currentMaxRedshift:t,currentMinRedshift:a,currentLocation:n,currentLookAt:s,init:ht,getScene:ae,getCamera:ne,getIsDragging:oe,getPivot:dt,startLoop:ie,setLocation:pt,dispose:se}}const De=`attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;
attribute float aAlpha;
attribute float aSizeMultiplier;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uMinRedshift;
uniform float uFov;
uniform float uParallaxX;
uniform float uParallaxY;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;

  float sizeScale = 0.0;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < uMinRedshift || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
    sizeScale = 0.0;
  } else {
    // Far fade
    float fadeStart = uMaxRedshift * 0.6;
    float farAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);

    // Near fade (steeper to clear foreground quickly)
    // Avoid division by zero if uMinRedshift is 0
    float nearFadeEnd = uMinRedshift > 0.0 ? uMinRedshift * 1.5 : 0.0;
    float nearAlpha = aRedshift > nearFadeEnd
      ? 1.0
      : smoothstep(uMinRedshift, nearFadeEnd, aRedshift);

    vAlpha = min(farAlpha, nearAlpha) * aAlpha;

    // Size scaling logic:
    // 1. Far fade: shrink to keep dense deep fields readable.
    // 2. Near fade: modest growth only, avoiding giant foreground blobs.
    float farScale = mix(0.5, 1.0, farAlpha);
    float nearScale = mix(3.2, 1.0, nearAlpha);
    sizeScale = farScale * nearScale * (0.5 + 0.5 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  
  // Default wide view stays low-LOD dots; detail appears later while zooming in.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture)
  float fovMix = smoothstep(44.0, 24.0, uFov);
  
  // Proximity boost: if galaxy is very close (low redshift), show detail sooner!
  // Very near galaxies can gain detail sooner, but less aggressively.
  float proximityBoost = 1.0 - smoothstep(0.0, 0.0025, aRedshift);
  
  // Size-based boost: if galaxy is being artificially scaled up (foreground fly-by),
  // force texture detail so it doesn't look like a blurry blob.
  // aSizeMultiplier > 1.0 implies we are zooming past it or it's growing.
  float sizeBoost = smoothstep(1.2, 1.8, aSizeMultiplier);
  
  float farTwinkleMix = 1.0 - max(max(fovMix, proximityBoost * 0.95), sizeBoost);
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.06 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.03 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  // Apply controlled proximity scaling for deep-field readability.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * 2.35;
  
  // If the sprite is going to be large on screen, we MUST show texture detail
  // regardless of zoom level, otherwise it looks like a blurry blob.
  // Smoothly transition to texture only when sprites are clearly large.
  float pixelSizeBoost = smoothstep(20.0, 40.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  float detailBoost = mix(1.0, 1.18, vDetailMix);
  float farBoost = mix(1.15, 1.0, vDetailMix);
  gl_PointSize = max(1.1 * uPixelRatio, basePx * detailBoost * farBoost);
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Keep a baseline parallax even when zoomed far out.
  float parallaxZoomMix = smoothstep(75.0, 16.0, uFov);
  float parallaxMix = mix(0.32, 1.0, parallaxZoomMix);
  float nearFactor = 1.0;
  if (uMaxRedshift > uMinRedshift + 0.000001) {
    nearFactor = 1.0 - smoothstep(uMinRedshift, uMaxRedshift, aRedshift);
  }
  float depthMix = mix(0.45, 1.0, nearFactor);
  mvPosition.x += uParallaxX * parallaxMix * depthMix * 29.0;
  mvPosition.y += uParallaxY * parallaxMix * depthMix * 21.0;
  gl_Position = projectionMatrix * mvPosition;
}
`,Ye=`precision highp float;

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
  float markerAlpha = vAlpha * (coreMask * 0.1 + haloMask * 0.02);
  markerAlpha *= mix(1.18, 1.0, vDetailMix);

  // Soft neutral glow avoids the "pixel square" debug look.
  float core = exp(-dist * dist * 20.0);
  vec3 whiteHot = vec3(1.0);
  float whiteMix = clamp(0.12 + farStarMix * 0.92, 0.0, 1.0);
  vec3 markerBaseColor = mix(vColor, whiteHot, whiteMix);
  float outerGlow = (1.0 - smoothstep(0.18, 0.7, dist)) * farStarMix;
  vec3 markerColor = markerBaseColor * (0.82 + core * mix(0.76, 0.24, vDetailMix));
  markerColor += whiteHot * outerGlow * 0.12;

  // Morphology detail from texture atlas.
  float atlasCols = 4.0;
  float atlasRows = 2.0;
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
  float alphaMask = max(shapeMask * 0.88, atlasSample.a * shapeMask);
  float detailAlpha = alphaMask * vAlpha * vDetailMix * 1.02;
  vec3 detailColor = mix(vColor, atlasSample.rgb, 0.94) * 1.0;
  detailColor = pow(detailColor, vec3(1.05));

  float finalAlpha = clamp(markerAlpha + detailAlpha * (1.0 - markerAlpha), 0.0, 1.0);
  if (finalAlpha < 0.01) discard;
  vec3 finalColor = mix(markerColor, detailColor, clamp(detailAlpha, 0.0, 1.0));

  // Selected outline: cyan glow at sprite edge
  if (vSelected > 0.5) {
    float outline = 1.0 - smoothstep(0.35, 0.65, dist);
    vec3 outlineColor = vec3(0.4, 0.9, 1.0);
    finalColor = mix(finalColor, outlineColor, outline * 0.5);
    finalAlpha = max(finalAlpha, outline * 0.75);
  }

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;class Ne{constructor(t,a){this.selected=new Float32Array(0),this.selectedPgc=null,this.alphas=new Float32Array(0),this.sizeMultipliers=new Float32Array(0),this.tempLocal=new B,this.tempWorld=new B,this.tempView=new B,this.latestPointerParallaxX=0,this.latestPointerParallaxY=0,this.galaxies=t,this.atlasTexture=a,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.alphas=new Float32Array(0),this.sizeMultipliers=new Float32Array(0),this.geometry=new Tt,this.material=new Qt({vertexShader:De,fragmentShader:Ye,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uMinRedshift:{value:0},uFov:{value:60},uParallaxX:{value:0},uParallaxY:{value:0},uTexture:{value:a},uCameraLogLevel:{value:0}},transparent:!0,depthWrite:!1,blending:Kt}),this.points=new Jt(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(t)}rebuild(t){this.galaxies=t;const a=t.length,n=new Float32Array(a*3),s=new Float32Array(a*3),i=new Float32Array(a),e=new Float32Array(a),o=new Float32Array(a),r=new Float32Array(a),c=new Float32Array(a),d=new Float32Array(a).fill(1);for(let p=0;p<a;p++){const m=t[p],_=Ee(m.ra,m.dec,ve);n[p*3]=_.x,n[p*3+1]=_.y,n[p*3+2]=_.z;const A=te(m.pgc),T=me[A],M=m.pgc*2654435761>>>0,S=(M>>>8)%1024/1023,v=(M>>>18)%1024/1023,z=(M>>>3)%1024/1023,E=.9+S*.22,$=(v-.5)*.08,D=(z-.5)*.1,O=T[0]*E+$*.45+D*.35,g=T[1]*E*.92-Math.abs(D)*.18,R=T[2]*E-$*.45+D*.45;s[p*3]=Math.min(1,Math.max(0,O)),s[p*3+1]=Math.min(1,Math.max(0,g)),s[p*3+2]=Math.min(1,Math.max(0,R));const y=16;i[p]=Math.max(2,Math.min(64,y/m.distance_mpc)),e[p]=(m.vcmb??0)/299792.458,o[p]=ke(A),r[p]=this.selectedPgc!=null&&m.pgc===this.selectedPgc?1:0}this.positions=n,this.selected=r,this.sizes=i,this.redshifts=e,this.alphas=c,this.sizeMultipliers=d,this.geometry.dispose(),this.geometry=new Tt,this.geometry.setAttribute("position",new N(n,3)),this.geometry.setAttribute("aColor",new N(s,3)),this.geometry.setAttribute("aSize",new N(i,1)),this.geometry.setAttribute("aRedshift",new N(e,1)),this.geometry.setAttribute("aTexIndex",new N(o,1)),this.geometry.setAttribute("aSelected",new N(r,1)),this.geometry.setAttribute("aAlpha",new N(c,1)),this.geometry.setAttribute("aSizeMultiplier",new N(d,1)),this.points.geometry=this.geometry}setSelectedPgc(t){if(this.selectedPgc===t||(this.selectedPgc=t,!this.geometry.attributes.aSelected))return;const a=this.geometry.attributes.aSelected,n=a.array;for(let s=0;s<this.galaxies.length;s++)n[s]=t!=null&&this.galaxies[s].pgc===t?1:0;a.needsUpdate=!0}update(t,a,n,s,i=0,e=0,o=0,r=0,c=0){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uMaxRedshift.value=a,this.material.uniforms.uMinRedshift.value=n,this.material.uniforms.uFov.value=s,this.latestPointerParallaxX=this.clamp(i,-1,1),this.latestPointerParallaxY=this.clamp(e,-1,1),this.material.uniforms.uParallaxX.value=this.latestPointerParallaxX,this.material.uniforms.uParallaxY.value=this.latestPointerParallaxY,this.alphas.length===this.galaxies.length){const d=Pt(s),m=It(d)/3.26,_=Math.log2(Math.max(1,m));this.material.uniforms.uCameraLogLevel.value=_;const A=this.geometry.attributes.aSizeMultiplier,T=A==null?void 0:A.array;for(let S=0;S<this.galaxies.length;S++){const v=this.galaxies[S],E=Math.log2(Math.max(1,v.distance_mpc))-_,$=this.computeDepthWindowAlpha(E,s),D=this.computeForegroundFade(E,s);this.alphas[S]=$*D,T[S]=this.computeGrowthMultiplier(E)}const M=this.geometry.attributes.aAlpha;M&&(M.needsUpdate=!0),A&&(A.needsUpdate=!0)}}pickGalaxyAtScreen(t,a,n,s,i,e,o,r){this.points.updateWorldMatrix(!0,!1);let c=-1,d=Number.POSITIVE_INFINITY;const p=Math.min(window.devicePixelRatio,2),m=this.smoothstep(0,1,this.clamp01((52-r)/32)),A=It(Pt(r))/3.26,T=Math.log2(Math.max(1,A));for(let M=0;M<this.galaxies.length;M++){const S=this.computeVisibilityAlpha(this.redshifts[M],e,o);if(S<.01)continue;const v=M*3;this.tempLocal.set(this.positions[v],this.positions[v+1],this.positions[v+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(n);const E=Math.log2(Math.max(1,this.galaxies[M].distance_mpc))-T;if(this.computeDepthWindowAlpha(E,r)*this.computeForegroundFade(E,r)<.01||this.tempWorld.z<-1||this.tempWorld.z>1)continue;const D=(this.tempWorld.x*.5+.5)*s,O=(-this.tempWorld.y*.5+.5)*i;this.tempView.set(this.positions[v],this.positions[v+1],this.positions[v+2]).applyMatrix4(this.points.matrixWorld).applyMatrix4(n.matrixWorldInverse);const g=this.computeParallaxNdcShiftX(this.redshifts[M],e,o,r,n,this.tempView.z),R=this.computeParallaxNdcShiftY(this.redshifts[M],e,o,r,n,this.tempView.z),y=D+g*.5*s,k=O-R*.5*i,Z=this.estimatePointSizePx(this.sizes[M],S,p,r,m)*.5,J=t-y,U=a-k;if(Math.abs(J)>Z||Math.abs(U)>Z)continue;const X=J*J+U*U;X<d&&(d=X,c=M)}return c>=0?this.galaxies[c]:null}estimatePointSizePx(t,a,n,s,i){const e=.5+.5*a,o=60/s,r=t*n*o*e*2.35,c=1+.18*i,d=1.15-.15*i;return Math.max(1.1*n,r*c*d)}computeVisibilityAlpha(t,a,n){if(t<n||t>a)return 0;let s=1;const i=a*.6;t>i&&(s=this.smoothstep(a,i,t));let e=1;const o=n*1.5;return t<o&&(e=this.smoothstep(n,o,t)),Math.min(s,e)}computeDepthWindowAlpha(t,a){const n=this.smoothstep(72,12,a),s=this.mix(.34,.18,n),i=this.mix(.72,.42,n),e=this.mix(-.36,-.18,n),o=this.mix(-1.24,-.62,n);return t<o||t>i?0:t<e?this.smoothstep(o,e,t):t>s?1-this.smoothstep(s,i,t):1}computeGrowthMultiplier(t){return t>=0?1-.38*this.smoothstep(0,1,t):1.15+2.7*this.smoothstep(-.78,-.05,t)}computeForegroundFade(t,a){const n=this.smoothstep(72,12,a),s=this.mix(-.44,-.24,n),i=this.mix(-1.42,-.78,n);return t>=s?1:t<=i?0:this.smoothstep(i,s,t)}computeParallaxNdcShiftX(t,a,n,s,i,e){const o=this.smoothstep(75,16,s),r=this.mix(.32,1,o),c=1-this.smoothstep(n,a,t),d=this.mix(.45,1,c),p=this.latestPointerParallaxX*r*d*29,m=i.projectionMatrix.elements[0],_=Math.max(.001,-e);return p*m/_}computeParallaxNdcShiftY(t,a,n,s,i,e){const o=this.smoothstep(75,16,s),r=this.mix(.32,1,o),c=1-this.smoothstep(n,a,t),d=this.mix(.45,1,c),p=this.latestPointerParallaxY*r*d*21,m=i.projectionMatrix.elements[5],_=Math.max(.001,-e);return p*m/_}clamp01(t){return Math.max(0,Math.min(1,t))}clamp(t,a,n){return Math.max(a,Math.min(n,t))}smoothstep(t,a,n){const s=this.clamp01((n-t)/(a-t));return s*s*(3-2*s)}mix(t,a,n){return t+(a-t)*n}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const $e="/assets/earth_day-DkcerPt2.jpg",Oe=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Xe=`
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
`,Ge=.04;class Be{constructor(){this.texture=null,this.currentQuat=new Yt,this.targetQuat=new Yt;const t=new Ae(xe,64,64),a=new Ce().load($e);a.colorSpace=Le,this.texture=a;const n=new Qt({vertexShader:Oe,fragmentShader:Xe,uniforms:{uDayMap:{value:a}},side:Re,depthWrite:!0});this.mesh=new Te(t,n),this.mesh.position.set(0,ge,0),this.mesh.renderOrder=-1}setLocation(t,a){const n=t*Math.PI/180,i=a*Math.PI/180+Math.PI,e=Math.PI/2-n,o=new B(-Math.cos(i)*Math.sin(e),Math.cos(e),Math.sin(i)*Math.sin(e)).normalize(),r=new B(0,1,0),c=o.clone(),d=new B;Math.abs(c.y)>.99?d.set(0,0,-1):d.copy(r).sub(c.clone().multiplyScalar(r.dot(c))).normalize();const p=new B().crossVectors(d,c).normalize(),m=new Nt().makeBasis(p,c,d),A=new Nt().makeBasis(new B(1,0,0),new B(0,1,0),new B(0,0,-1)).multiply(m.transpose());this.targetQuat.setFromRotationMatrix(A)}update(){this.currentQuat.slerp(this.targetQuat,Ge),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var t;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(t=this.texture)==null||t.dispose()}}const rt=14e3,Lt=800,Ve=1.4;class Ue{constructor(){const t=new Float32Array(rt*3),a=new Float32Array(rt),n=new Float32Array(rt),s=new Float32Array(rt*3),i=new Float32Array(rt);for(let r=0;r<rt;r++){const c=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1);t[r*3]=Lt*Math.sin(d)*Math.cos(c),t[r*3+1]=Lt*Math.cos(d),t[r*3+2]=Lt*Math.sin(d)*Math.sin(c),a[r]=Ve*(.5+Math.random()*.8),n[r]=.35+Math.random()*.45,i[r]=Math.random()*Math.PI*2;const p=Math.random();p<.5?(s[r*3]=.85+Math.random()*.12,s[r*3+1]=.88+Math.random()*.1,s[r*3+2]=.95+Math.random()*.05):p<.85?(s[r*3]=.95+Math.random()*.05,s[r*3+1]=.9+Math.random()*.08,s[r*3+2]=.8+Math.random()*.12):(s[r*3]=.98+Math.random()*.02,s[r*3+1]=.92+Math.random()*.06,s[r*3+2]=.75+Math.random()*.15)}const e=new Tt;e.setAttribute("position",new N(t,3)),e.setAttribute("aSize",new N(a,1)),e.setAttribute("aOpacity",new N(n,1)),e.setAttribute("aColor",new N(s,3)),e.setAttribute("aPhase",new N(i,1));const o=new Ie({vertexShader:`
        precision mediump float;
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        attribute float aPhase;
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = aColor;

          // Tinkle: stars pulse in brightness (each has its own phase)
          float twinkle = sin(uTime * 1.8 + aPhase) * 0.32 + 0.68;
          vOpacity *= twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (620.0 / -mvPosition.z);
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
      `,transparent:!0,depthWrite:!1,blending:Kt,uniforms:{uTime:{value:0}}});this.points=new Jt(e,o),this.points.frustumCulled=!1}update(t){this.points.material.uniforms.uTime.value=t}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const Xt=5,We=tt({__name:"GalaxyCanvas",emits:["ready","hover","select"],setup(h,{expose:t,emit:a}){const n=a,s=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,i=Ht(),e=F(null),{currentFov:o,currentMaxRedshift:r,currentMinRedshift:c,currentLocation:d,currentLookAt:p,init:m,getScene:_,getCamera:A,getIsDragging:T,getPivot:M,startLoop:S,setLocation:v,dispose:z}=Fe(),{ready:E,getAllGalaxies:$}=ee();function D(f){v(f);const x=Ut[f];x&&k&&k.setLocation(x.latitude,x.longitude)}let O=[];function g(f,x){if(!y)return 0;const b=O.filter(C=>{const Q=te(C.pgc,C.morphology);return f.has(Q)&&x.has(C.source??"CF4")});return y.rebuild(b),b.length}function R(){return O.length}t({currentFov:o,currentMaxRedshift:r,currentLocation:d,currentLookAt:p,setLocation:D,applyFilter:g,getAllGalaxiesCount:R});let y=null,k=null,V=null,Z=!1,J=0,U=0,X=!1,et=!1,G=null,st=0,ht=0,dt=0,at=0;function xt(f){if(!y||!e.value)return null;const x=e.value.getBoundingClientRect(),b=f.clientX-x.left,C=f.clientY-x.top;return b<0||C<0||b>x.width||C>x.height?null:y.pickGalaxyAtScreen(b,C,A(),x.width,x.height,r.value,c.value,o.value)}function gt(f){if(Mt(f.clientX,f.clientY),Z){const b=f.clientX-J,C=f.clientY-U;b*b+C*C>Xt*Xt&&(X=!0)}if(T()){n("hover",null);return}const x=xt(f);x?(e.value.style.cursor="pointer",n("hover",{galaxy:x,screenX:f.clientX,screenY:f.clientY})):(e.value.style.cursor="grab",s||n("hover",null))}function Mt(f,x){if(!e.value)return;const b=e.value.getBoundingClientRect();if(b.width<=0||b.height<=0)return;const C=(f-b.left)/b.width,Q=(x-b.top)/b.height;st=Math.max(-1,Math.min(1,C*2-1)),ht=Math.max(-1,Math.min(1,1-Q*2))}function pt(f){G=(f==null?void 0:f.galaxy)??null,y==null||y.setSelectedPgc((G==null?void 0:G.pgc)??null),n("select",f??null)}function yt(){Z=!1,X=!1,st=0,ht=0,n("hover",null),s&&pt(null)}function wt(f){Z=!0,J=f.clientX,U=f.clientY,Mt(f.clientX,f.clientY),X=!1}function nt(){X&&(et=!0),Z=!1,X=!1}function ft(f){if(et){et=!1;return}if(T())return;const x=xt(f);s?x?(G==null?void 0:G.pgc)===x.pgc?i.push(`/g/${x.pgc}`):pt({galaxy:x,screenX:f.clientX,screenY:f.clientY}):pt(null):x&&i.push(`/g/${x.pgc}`)}return Me(async()=>{if(!e.value)return;m(e.value);const f=_(),x=M();await E,O=$();const b=ze();y=new Ne(O,b),k=new Be,V=new Ue,x.add(V.points),x.add(y.points),f.add(k.mesh),S(C=>{dt+=(st-dt)*.18,at+=(ht-at)*.18,y==null||y.update(C,r.value,c.value,o.value,dt,at),V==null||V.update(C),k==null||k.update()}),e.value.addEventListener("pointermove",gt),e.value.addEventListener("pointerdown",wt),e.value.addEventListener("pointerup",nt),e.value.addEventListener("pointercancel",nt),e.value.addEventListener("pointerleave",yt),e.value.addEventListener("click",ft),n("ready")}),Wt(()=>{var f,x,b,C,Q,mt;(f=e.value)==null||f.removeEventListener("pointermove",gt),(x=e.value)==null||x.removeEventListener("pointerdown",wt),(b=e.value)==null||b.removeEventListener("pointerup",nt),(C=e.value)==null||C.removeEventListener("pointercancel",nt),(Q=e.value)==null||Q.removeEventListener("pointerleave",yt),(mt=e.value)==null||mt.removeEventListener("click",ft),y==null||y.dispose(),k==null||k.dispose(),V==null||V.dispose(),z()}),(f,x)=>(P(),L("canvas",{ref_key:"canvasRef",ref:e,class:"fixed inset-0 w-full h-full galaxy-canvas"},null,512))}}),He=ut(We,[["__scopeId","data-v-b31e7853"]]),je={key:0,class:"pill-count"},qe={key:0,class:"filter-panel"},Ze={class:"panel-header"},Qe={class:"panel-title"},Ke={class:"section"},Je={class:"section-label"},ta={class:"chip-row"},ea=["onClick"],aa={class:"section"},na={class:"section-label"},oa={class:"chip-row"},ia=["onClick"],sa={class:"panel-footer"},la=tt({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(h,{emit:t}){const{t:a}=At(),n=h,s=t,i=F(!1),e=["spiral","barred","elliptical","lenticular","irregular"],o=["CF4","ALFALFA","FSS","UGC"],r=Dt(new Set(e)),c=Dt(new Set(o)),d=H(()=>r.size<e.length||c.size<o.length),p=H(()=>n.filteredCount.toLocaleString()),m=H(()=>n.totalCount.toLocaleString());function _(M){r.has(M)?r.size>1&&r.delete(M):r.add(M),T()}function A(M){c.has(M)?c.size>1&&c.delete(M):c.add(M),T()}function T(){s("filter-change",{morphologies:new Set(r),sources:new Set(c)})}return(M,S)=>(P(),L(ct,null,[i.value?q("",!0):(P(),L("button",{key:0,class:"filter-pill",onClick:S[0]||(S[0]=v=>i.value=!0)},[S[2]||(S[2]=u("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[u("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),u("span",null,I(W(a)("pages.home.filter")),1),d.value?(P(),L("span",je,I(p.value),1)):q("",!0)])),ot(qt,{name:"panel"},{default:jt(()=>[i.value?(P(),L("div",qe,[u("div",Ze,[u("span",Qe,I(W(a)("pages.home.filter")),1),u("button",{class:"close-btn",onClick:S[1]||(S[1]=v=>i.value=!1),"aria-label":"Close"},[...S[3]||(S[3]=[u("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[u("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),u("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),u("div",Ke,[u("div",Je,I(W(a)("pages.home.morphologyLabel")),1),u("div",ta,[(P(),L(ct,null,vt(e,v=>u("button",{key:v,class:Rt(["chip",{active:r.has(v)}]),onClick:z=>_(v)},I(W(a)("morphology."+v)),11,ea)),64))])]),u("div",aa,[u("div",na,I(W(a)("pages.home.catalogLabel")),1),u("div",oa,[(P(),L(ct,null,vt(o,v=>u("button",{key:v,class:Rt(["chip",{active:c.has(v)}]),onClick:z=>A(v)},I(v),11,ia)),64))])]),u("div",sa,I(W(a)("pages.home.showing",{count:p.value,total:m.value})),1)])):q("",!0)]),_:1})],64))}}),ra=ut(la,[["__scopeId","data-v-647995f5"]]),ca={class:"tooltip-pgc"},ua={class:"tooltip-detail"},ha={key:0,class:"tooltip-detail"},da=tt({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{},showCta:{type:Boolean}},emits:["navigate"],setup(h){const{t}=At();return(a,n)=>h.galaxy?(P(),L("div",{key:0,class:Rt(["tooltip",{"has-cta":h.showCta}]),style:it({left:h.x+12+"px",top:h.y-10+"px"})},[u("div",ca,"PGC "+I(h.galaxy.pgc),1),u("div",ua,I(Math.round(h.galaxy.distance_mly).toLocaleString())+" Mly",1),h.galaxy.vcmb!=null?(P(),L("div",ha,I(h.galaxy.vcmb.toLocaleString())+" km/s",1)):q("",!0),h.showCta?(P(),L("button",{key:1,type:"button",class:"tooltip-cta",onClick:n[0]||(n[0]=s=>a.$emit("navigate"))},I(W(t)("pages.home.goToGalaxy")),1)):q("",!0)],6)):q("",!0)}}),pa=ut(da,[["__scopeId","data-v-40719765"]]),fa={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},ma={class:"text-center"},va={class:"text-sm text-white/70 tracking-wide"},xa=tt({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(h){const{t}=At();return(a,n)=>(P(),Zt(qt,{name:"fade"},{default:jt(()=>[h.isLoading?(P(),L("div",fa,[u("div",ma,[n[0]||(n[0]=u("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),u("p",va,I(W(t)("app.loading")),1)])])):q("",!0)]),_:1}))}}),ga=ut(xa,[["__scopeId","data-v-c1ac9ae0"]]),Ma={class:"space-compass pointer-events-none select-none"},ya={class:"compass-tape relative w-full h-12 overflow-hidden"},wa={key:0,class:"w-px h-3 bg-white/40 flex-none"},_a={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},ba={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Gt=4,Sa=tt({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(h){const t=h,a=H(()=>t.azimuth*Gt),n=H(()=>{const s=t.azimuth,i=500,e=Math.floor(s-i),o=Math.ceil(s+i),r=[];for(let c=e;c<=o;c++){let d=c%360;d<0&&(d+=360);const p=d%15===0;(d%5===0||p)&&r.push({value:c,offset:c*Gt,isMajor:p,label:p?`${Math.round(d)}°`:null})}return r});return(s,i)=>(P(),L("div",Ma,[u("div",ya,[i[0]||(i[0]=u("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[u("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),u("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),u("div",{class:"absolute top-0 h-full will-change-transform",style:it({transform:`translateX(calc(50% - ${a.value}px))`})},[(P(!0),L(ct,null,vt(n.value,e=>(P(),L("div",{key:e.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:it({left:`${e.offset}px`})},[e.isMajor?(P(),L("div",wa)):(P(),L("div",_a)),e.label?(P(),L("div",ba,I(e.label),1)):q("",!0)],4))),128))],4),i[1]||(i[1]=u("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Pa=ut(Sa,[["__scopeId","data-v-6e465829"]]),Aa={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},Ca={class:"relative w-full h-full"},La={class:"mr-2 text-[10px] font-mono text-white/30"},Ra={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},bt=0,Bt=1600,Ta=tt({__name:"DistanceIndicator",props:{distance:{}},setup(h){const t=h,a=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function n(i){return(1-(i-bt)/(Bt-bt))*100}const s=H(()=>{const i=(t.distance-bt)/(Bt-bt);return(1-Math.max(0,Math.min(1,i)))*100});return(i,e)=>(P(),L("div",Aa,[e[2]||(e[2]=u("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),u("div",Ca,[(P(),L(ct,null,vt(a,o=>u("div",{key:o.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:it({top:`${n(o.value)}%`})},[u("span",La,I(o.label),1),e[0]||(e[0]=u("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),u("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:it({top:`${s.value}%`})},[u("span",Ra,I(Math.round(h.distance))+" mLY ",1),e[1]||(e[1]=u("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Ia={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},ka={class:"relative w-full h-full"},za={class:"ml-2 text-[10px] font-mono text-white/30"},Ea={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},St=-90,Vt=90,Fa=tt({__name:"ElevationIndicator",props:{elevation:{}},setup(h){const t=h,a=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function n(i){return(1-(i-St)/(Vt-St))*100}const s=H(()=>{const i=(t.elevation-St)/(Vt-St);return(1-Math.max(0,Math.min(1,i)))*100});return(i,e)=>(P(),L("div",Ia,[e[2]||(e[2]=u("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),u("div",ka,[(P(),L(ct,null,vt(a,o=>u("div",{key:o.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:it({top:`${n(o.value)}%`})},[e[0]||(e[0]=u("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),u("span",za,I(o.label),1)],4)),64)),u("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:it({top:`${s.value}%`})},[e[1]||(e[1]=u("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),u("span",Ea,I(Math.round(h.elevation))+"° ",1)],4)])]))}}),Da={class:"w-full h-full"},Ya={class:"absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center hud-soft"},Na={class:"w-full max-w-3xl"},$a={class:"absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry"},Oa={class:"absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry"},Xa={key:1,class:"galaxy-count-badge"},Ga=tt({__name:"HomeView",setup(h){const t=Ht(),{t:a}=At(),{isLoading:n}=ee(),{currentLocation:s,locationSetter:i}=ye(),e=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,o=F(null),r=F(!1),c=F(0),d=F(0),p=F(null),m=F(null),_=F(0),A=F(0),T=H(()=>e?m.value:p.value),M=H(()=>{var g,R;return((R=(g=o.value)==null?void 0:g.currentLookAt)==null?void 0:R.azimuth)??0}),S=H(()=>{var g,R;return((R=(g=o.value)==null?void 0:g.currentLookAt)==null?void 0:R.elevation)??0}),v=H(()=>{var R;const g=((R=o.value)==null?void 0:R.currentMaxRedshift)??0;return It(g)});function z(){var R;r.value=!0;const g=((R=o.value)==null?void 0:R.getAllGalaxiesCount())??0;c.value=g,d.value=g,o.value&&(i.value=o.value.setLocation,s.value=o.value.currentLocation)}Wt(()=>{i.value=null});function E(g){var y;const R=((y=o.value)==null?void 0:y.applyFilter(g.morphologies,g.sources))??0;d.value=R}function $(g){g?(p.value=g.galaxy,_.value=g.screenX,A.value=g.screenY):p.value=null}function D(g){g?(m.value=g.galaxy,_.value=g.screenX,A.value=g.screenY):m.value=null}function O(){m.value&&t.push(`/g/${m.value.pgc}`)}return(g,R)=>(P(),L("div",Da,[ot(He,{ref_key:"canvasRef",ref:o,onReady:z,onHover:$,onSelect:D},null,512),u("div",Ya,[u("div",Na,[ot(Pa,{azimuth:M.value},null,8,["azimuth"])])]),u("div",$a,[ot(Ta,{distance:v.value},null,8,["distance"])]),u("div",Oa,[ot(Fa,{elevation:S.value},null,8,["elevation"])]),r.value?(P(),Zt(ra,{key:0,"total-count":c.value,"filtered-count":d.value,onFilterChange:E},null,8,["total-count","filtered-count"])):q("",!0),ot(pa,{galaxy:T.value,x:_.value,y:A.value,"show-cta":W(e),onNavigate:O},null,8,["galaxy","x","y","show-cta"]),ot(ga,{"is-loading":W(n)},null,8,["is-loading"]),r.value&&d.value>0?(P(),L("div",Xa,I(W(a)("app.loaded",{count:d.value.toLocaleString()})),1)):q("",!0)]))}}),Ha=ut(Ga,[["__scopeId","data-v-66e890f2"]]);export{Ha as default};
