import{d as Y,e as X,o as j,a as E,c as C,g as $,w as N,f as u,t as y,h as M,i as F,x as z,F as H,j as R,l as B,r as P,k as q,b as D}from"./index-wwCqI4fw.js";import{v as J,u as K}from"./galaxy-BxA1ibco.js";import{j as Q,R as Z,z as tt,L as W,k as U,h as et,a as O,D as st,M as it,B as nt,c as G,A as at,b as ot,V as I,G as rt,g as lt,s as ct,t as pt,C as dt,W as ht,S as ut,P as mt}from"./three.module-TGhSzrr1.js";import{f as gt,v as ft,O as vt}from"./cosmicmap.frag-D2yU4kBd.js";import{V as yt}from"./constants-DEjRyabg.js";import{_ as xt}from"./_plugin-vue_export-helper-DlAUqK2U.js";const wt=`uniform sampler2D uDensity;
uniform float uDisplaceScale;
uniform float uTime;

varying float vDepth;
varying vec2 vUv;

void main() {
  vUv = uv;

  // Sample density at this vertex's UV
  float density = texture2D(uDensity, uv).r;

  // Displace Y downward — deeper wells for higher density
  // Apply power curve to exaggerate deep wells
  float displacement = pow(density, 0.7) * uDisplaceScale;

  vec3 displaced = position;
  displaced.y -= displacement;

  vDepth = density;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`,bt=`precision highp float;

varying float vDepth;
varying vec2 vUv;

uniform float uGridLines;
uniform float uTime;

void main() {
  // Grid line detection via UV fract
  vec2 gridUV = vUv * uGridLines;
  vec2 gridFrac = abs(fract(gridUV - 0.5) - 0.5);
  vec2 gridWidth = fwidth(gridUV);
  vec2 line = smoothstep(gridWidth * 0.5, gridWidth * 1.5, gridFrac);
  float gridLine = 1.0 - min(line.x, line.y);

  // Discard non-wireframe pixels
  if (gridLine < 0.01) discard;

  // Glow: dim cyan in flat regions, brightening to white at deep wells
  float glow = 0.25 + vDepth * 0.75;
  vec3 cyanBase = vec3(0.133, 0.827, 0.933); // #22d3ee
  vec3 white = vec3(1.0);
  vec3 color = mix(cyanBase * 0.4, mix(cyanBase, white, vDepth * 0.5), glow);

  // Subtle pulse at deep wells
  float pulse = 1.0 + 0.08 * sin(uTime * 2.0) * vDepth;

  // Flat regions visible but subdued, wells punch through
  float alpha = gridLine * (0.3 + glow * 0.7);
  gl_FragColor = vec4(color * pulse, alpha);
}
`;class St{constructor(t){const{grid:s,resolution:n,extent:e}=t;this.densityTexture=new Q(s,n,n,Z,tt),this.densityTexture.minFilter=W,this.densityTexture.magFilter=W,this.densityTexture.wrapS=U,this.densityTexture.wrapT=U,this.densityTexture.needsUpdate=!0,this.geometry=new et(e*2,e*2,n-1,n-1),this.geometry.rotateX(-Math.PI/2),this.material=new O({vertexShader:wt,fragmentShader:bt,uniforms:{uDensity:{value:this.densityTexture},uDisplaceScale:{value:6e3},uGridLines:{value:64},uTime:{value:0}},transparent:!0,depthWrite:!1,side:st}),this.mesh=new it(this.geometry,this.material)}update(t){this.material.uniforms.uTime.value=t}dispose(){this.geometry.dispose(),this.material.dispose(),this.densityTexture.dispose()}}class _t{constructor(t,s,n=6e3){this.groupData=[],this.positions=new Float32Array(0),this.groupData=t;const{grid:e,resolution:o,extent:a}=s,c=t.length,v=new Float32Array(c*3),h=new Float32Array(c*3),x=new Float32Array(c);for(let d=0;d<c;d++){const i=t[d],p=i.sgx,m=i.sgy,r=(i.sgx+a)/(a*2),g=(i.sgy+a)/(a*2),w=Math.min(Math.max(Math.floor(r*o),0),o-1),f=Math.min(Math.max(Math.floor(g*o),0),o-1),S=e[f*o+w],_=-(Math.pow(S,.7)*n);v[d*3]=p,v[d*3+1]=_,v[d*3+2]=m;const l=J(i.vh??0);h[d*3]=l[0],h[d*3+1]=l[1],h[d*3+2]=l[2],x[d]=3}this.positions=v,this.geometry=new nt,this.geometry.setAttribute("position",new G(v,3)),this.geometry.setAttribute("aColor",new G(h,3)),this.geometry.setAttribute("aSize",new G(x,1)),this.material=new O({vertexShader:ft,fragmentShader:gt,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uTime:{value:0}},transparent:!0,depthWrite:!1,blending:at}),this.points=new ot(this.geometry,this.material),this.points.frustumCulled=!1}update(t){this.material.uniforms.uTime.value=t}pickAtScreen(t,s,n,e,o){this.points.updateWorldMatrix(!0,!1);const a=new I,c=new I,v=Math.min(window.devicePixelRatio,2);let h=-1,x=1/0;const d=this.positions.length/3;for(let p=0;p<d;p++){const m=p*3;if(a.set(this.positions[m],this.positions[m+1],this.positions[m+2]),c.copy(a).applyMatrix4(this.points.matrixWorld).project(n),c.z<-1||c.z>1)continue;const r=(c.x*.5+.5)*e,g=(-c.y*.5+.5)*o,w=8*v,f=t-r,S=s-g;if(Math.abs(f)>w||Math.abs(S)>w)continue;const _=f*f+S*S;_<x&&(x=_,h=p)}if(h<0)return null;const i=this.groupData[h];return{pgc:i.group_pgc,velocity:i.vh??0,distance:i.dist_mpc}}dispose(){this.geometry.dispose(),this.material.dispose()}}const Mt=[{name:"Virgo",sgx:-200,sgy:1100},{name:"Coma",sgx:-300,sgy:6800},{name:"Perseus-Pisces",sgx:-4800,sgy:4500},{name:"Great Attractor",sgx:-4200,sgy:1800},{name:"Shapley",sgx:-6800,sgy:6200},{name:"Centaurus",sgx:-3200,sgy:3200},{name:"Hydra",sgx:-2800,sgy:3800}];class Ct{constructor(t,s=6e3){this.sprites=[],this.group=new rt;const{grid:n,resolution:e,extent:o}=t;for(const a of Mt){const c=(a.sgx+o)/(o*2),v=(a.sgy+o)/(o*2),h=Math.min(Math.max(Math.floor(c*e),0),e-1),x=Math.min(Math.max(Math.floor(v*e),0),e-1),d=n[x*e+h],i=-(Math.pow(d,.7)*s)+300,p=this.makeLabel(a.name);p.position.set(a.sgx,i,a.sgy),this.group.add(p),this.sprites.push(p)}}makeLabel(t){const s=document.createElement("canvas"),n=2;s.width=256*n,s.height=48*n;const e=s.getContext("2d");e.scale(n,n),e.font="500 14px system-ui, -apple-system, sans-serif",e.textAlign="center",e.textBaseline="middle",e.shadowColor="rgba(34, 211, 238, 0.6)",e.shadowBlur=8,e.fillStyle="rgba(255, 255, 255, 0.85)",e.fillText(t,128,24),e.shadowBlur=0,e.fillText(t,128,24);const o=new lt(s),a=new ct({map:o,transparent:!0,depthTest:!1}),c=new pt(a);return c.scale.set(800,150,1),c}dispose(){var t;for(const s of this.sprites)(t=s.material.map)==null||t.dispose(),s.material.dispose()}}function Dt(k,t=256,s=3e4,n=2e3,e=3,o=1.5){const a=new Float32Array(t*t),c=e*2+1,v=new Float32Array(c*c);for(let i=-e;i<=e;i++)for(let p=-e;p<=e;p++){const m=p*p+i*i;v[(i+e)*c+(p+e)]=Math.exp(-m/(2*o*o))}let h=0;for(const i of k){if(Math.abs(i.sgz)>n)continue;h++;const p=Math.floor((i.sgx+s)/(s*2)*t),m=Math.floor((i.sgy+s)/(s*2)*t);for(let r=-e;r<=e;r++)for(let g=-e;g<=e;g++){const w=p+g,f=m+r;w<0||w>=t||f<0||f>=t||(a[f*t+w]+=v[(r+e)*c+(g+e)])}}const x=new Float32Array(t*t);for(let i=0;i<2;i++){const p=i===0?a:x,m=i===0?x:a;for(let r=0;r<t;r++)for(let g=0;g<t;g++){let w=0,f=0;for(let S=-1;S<=1;S++)for(let _=-1;_<=1;_++){const l=g+_,b=r+S;l>=0&&l<t&&b>=0&&b<t&&(w+=p[b*t+l],f++)}m[r*t+g]=w/f}}let d=0;for(let i=0;i<a.length;i++)a[i]>d&&(d=a[i]);if(d>0)for(let i=0;i<a.length;i++)a[i]/=d;return{grid:a,slabCount:h,resolution:t,extent:s}}class Tt{constructor(t){this.clock=new dt,this.animationId=0,this.fabric=null,this.groupPoints=null,this.labels=null,this.slabCount=0,this.renderer=new ht({canvas:t,antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.renderer.setClearColor(0,1),this.scene=new ut;const s=t.clientWidth/t.clientHeight;this.camera=new mt(60,s,1,2e5),this.camera.position.set(5e3,8e3,18e3),this.controls=new vt(this.camera,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=500,this.controls.maxDistance=1e5,this.controls.target.set(0,-1e3,0),this.resizeObserver=new ResizeObserver(()=>{const n=t.clientWidth,e=t.clientHeight;n===0||e===0||(this.renderer.setSize(n,e,!1),this.camera.aspect=n/e,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(t)}getCamera(){return this.camera}loadGroups(t){const s=Dt(t);this.slabCount=s.slabCount;const n=t.filter(e=>Math.abs(e.sgz)<=2e3);this.fabric=new St(s),this.scene.add(this.fabric.mesh),this.groupPoints=new _t(n,s),this.scene.add(this.groupPoints.points),this.labels=new Ct(s),this.scene.add(this.labels.group)}start(){this.clock.start();const t=()=>{var n,e;this.animationId=requestAnimationFrame(t);const s=this.clock.getElapsedTime();this.controls.update(),(n=this.fabric)==null||n.update(s),(e=this.groupPoints)==null||e.update(s),this.renderer.render(this.scene,this.camera)};t()}pickAtScreen(t,s,n,e){var o;return((o=this.groupPoints)==null?void 0:o.pickAtScreen(t,s,this.camera,n,e))??null}dispose(){var t,s,n;cancelAnimationFrame(this.animationId),this.resizeObserver.disconnect(),this.controls.dispose(),(t=this.fabric)==null||t.dispose(),(s=this.groupPoints)==null||s.dispose(),(n=this.labels)==null||n.dispose(),this.renderer.dispose()}}const Pt={class:"spacetime-page"},kt={key:0,class:"loading-overlay"},Ft={class:"tooltip-pgc"},At={class:"tooltip-detail"},Lt={class:"tooltip-detail"},Bt={key:2,class:"map-legend"},Gt={class:"map-legend-title"},Vt={class:"map-legend-items"},zt={class:"map-legend-label"},Wt={key:4,class:"info-panel"},Ut={class:"info-title"},It={class:"info-body"},Ot={class:"info-stats"},Yt={class:"info-stat-value"},Xt=Y({__name:"SpacetimeView",setup(k){const{t}=X(),{ready:s,getAllGroups:n}=K(),e=P(null),o=P(!0),a=P(!1),c=P(0),v=yt,h=P(null),x=P(0),d=P(0);let i=0,p=0,m=!1,r=null;function g(l){return`rgb(${Math.round(l[0]*255)}, ${Math.round(l[1]*255)}, ${Math.round(l[2]*255)})`}function w(l){i=l.clientX,p=l.clientY,m=!1}let f=0;function S(l){const b=l.clientX-i,A=l.clientY-p;b*b+A*A>16&&(m=!0);const T=performance.now();if(T-f<16||(f=T,!r||!e.value))return;const L=e.value.getBoundingClientRect(),V=r.pickAtScreen(l.clientX-L.left,l.clientY-L.top,L.width,L.height);V?(h.value=V,x.value=l.clientX+12,d.value=l.clientY-10):h.value=null}function _(){}return j(async()=>{if(await s,!e.value)return;r=new Tt(e.value);const l=n();r.loadGroups(l),c.value=r.slabCount,r.start(),o.value=!1}),E(()=>{r==null||r.dispose(),r=null}),(l,b)=>{const A=q("router-link");return D(),C("div",Pt,[$(A,{to:"/",class:"back-button"},{default:N(()=>[B("← "+y(M(t)("pages.spacetime.backToSky")),1)]),_:1}),o.value?(D(),C("div",kt,[u("p",null,y(M(t)("pages.spacetime.loading")),1)])):F("",!0),u("canvas",{ref_key:"canvasRef",ref:e,class:"spacetime-canvas",onPointerdown:w,onPointermove:S,onClick:_},null,544),h.value?(D(),C("div",{key:1,class:"tooltip",style:z({left:x.value+"px",top:d.value+"px"})},[u("div",Ft,"PGC "+y(h.value.pgc),1),u("div",At,y(h.value.velocity.toLocaleString())+" km/s",1),u("div",Lt,y(h.value.distance.toFixed(1))+" Mpc",1)],4)):F("",!0),o.value?F("",!0):(D(),C("div",Bt,[u("div",Gt,y(M(t)("pages.spacetime.velocityLabel")),1),u("div",Vt,[(D(!0),C(H,null,R(M(v),T=>(D(),C("div",{key:T.label,class:"map-legend-item"},[u("span",{class:"map-legend-swatch",style:z({background:g(T.color)})},null,4),u("span",zt,y(T.label),1)]))),128))])])),o.value?F("",!0):(D(),C("button",{key:3,class:"info-toggle",onClick:b[0]||(b[0]=T=>a.value=!a.value)},y(a.value?"×":"i"),1)),a.value?(D(),C("div",Wt,[u("h3",Ut,y(M(t)("pages.spacetime.infoTitle")),1),u("p",It,y(M(t)("pages.spacetime.infoBody")),1),u("div",Ot,[u("div",null,[u("span",Yt,y(c.value.toLocaleString()),1),B(" "+y(M(t)("pages.spacetime.stats.groups")),1)]),u("div",null,[b[1]||(b[1]=u("span",{class:"info-stat-value"},"256 × 256",-1)),B(" "+y(M(t)("pages.spacetime.stats.gridRes")),1)]),u("div",null,[b[2]||(b[2]=u("span",{class:"info-stat-value"},"±2,000 Mpc",-1)),B(" "+y(M(t)("pages.spacetime.stats.slabThickness")),1)])])])):F("",!0)])}}}),qt=xt(Xt,[["__scopeId","data-v-70de202e"]]);export{qt as default};
