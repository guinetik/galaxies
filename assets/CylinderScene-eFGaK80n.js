import{C as R,W,S as k,P as G,s as L,M as _,n as M,w as P,x as z,b as S,r as v,V as g,y as F,z as H,E as B,o as p,B as w,c as m,a as E,A as I,p as O,q as D}from"./three-BivkH6X_.js";function N(d){return d<0?[.55,0,1]:d<2e3?[0,0,1]:d<4e3?[0,.75,1]:d<6e3?[0,.8,0]:d<8e3?[1,1,0]:d<1e4?[1,0,0]:d<12e3?[.8,0,0]:d<14e3?[1,.55,0]:[.55,.27,.07]}const V=`attribute vec3 aColor;
attribute float aSize;

uniform float uPixelRatio;
uniform float uTime;

varying vec3 vColor;

void main() {
  vColor = aColor;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Fixed screen-space size with subtle distance attenuation
  // Closer points slightly larger for depth perception
  float dist = length(mvPosition.xyz);
  float attenuation = 300.0 / max(dist, 1.0);
  float size = aSize * uPixelRatio * (0.8 + clamp(attenuation, 0.0, 1.5));

  gl_PointSize = max(1.5 * uPixelRatio, size);
  gl_Position = projectionMatrix * mvPosition;
}
`,$=`precision highp float;

varying vec3 vColor;

void main() {
  // Soft circular point with glow
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);

  // Core + halo falloff
  float core = exp(-dist * dist * 18.0);
  float halo = 1.0 - smoothstep(0.1, 0.5, dist);

  float alpha = core * 0.8 + halo * 0.3;
  if (alpha < 0.01) discard;

  // Bright core fading to colored halo
  vec3 color = mix(vColor, vec3(1.0), core * 0.4);

  gl_FragColor = vec4(color, alpha);
}
`,T=2557,A=[{name:"Milky Way",sgx:0,sgy:0,sgz:0},{name:"Andromeda (M31)",sgx:0,sgy:0,sgz:0,pgc:T},{name:"Virgo",sgx:-200,sgy:1100,sgz:0},{name:"Centaurus",sgx:-3200,sgy:3200,sgz:0},{name:"Hydra",sgx:-2800,sgy:3800,sgz:0},{name:"Great Attractor",sgx:-4200,sgy:1800,sgz:0},{name:"Perseus-Pisces",sgx:-4800,sgy:4500,sgz:0},{name:"Coma",sgx:-300,sgy:6800,sgz:0}],b=[25,50,75,100],y=70;class U{constructor(e){this.clock=new R,this.animationId=0,this.pointsMaterial=null,this.structurePositions=new Map,this.focusTarget=null,this.focusCamPos=null,this.renderer=new W({canvas:e,antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.renderer.setClearColor(0,0),this.scene=new k;const t=e.clientWidth/e.clientHeight;this.camera=new G(50,t,1,1e5),this.camera.position.set(6e3,8e3,12e3),this.controls=new L(this.camera,e),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=3e3,this.controls.maxDistance=3e4,this.controls.target.set(0,0,0),this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.5,this.resizeObserver=new ResizeObserver(()=>{const s=e.clientWidth,i=e.clientHeight;s===0||i===0||(this.renderer.setSize(s,i,!1),this.camera.aspect=s/i,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(e)}loadGroups(e){const t=e.filter(n=>n.dist_mpc<=100),s=100*y,i=this.getHalfHeight(t);this.buildCylinder(s,i),this.buildPoints(t),this.buildLabels(t)}start(){this.clock.start();const e=()=>{this.animationId=requestAnimationFrame(e);const t=this.clock.getElapsedTime();this.focusTarget&&this.focusCamPos&&(this.controls.target.lerp(this.focusTarget,.05),this.camera.position.lerp(this.focusCamPos,.05),this.controls.target.distanceTo(this.focusTarget)<10&&(this.focusTarget=null,this.focusCamPos=null)),this.controls.update(),this.pointsMaterial&&(this.pointsMaterial.uniforms.uTime.value=t),this.renderer.render(this.scene,this.camera)};e()}dispose(){cancelAnimationFrame(this.animationId),this.resizeObserver.disconnect(),this.controls.dispose(),this.scene.traverse(e=>{var t;(e instanceof _||e instanceof M||e instanceof P||e instanceof z||e instanceof S)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(s=>s.dispose()):e.material.dispose()),e instanceof v&&((t=e.material.map)==null||t.dispose(),e.material.dispose())}),this.renderer.dispose()}get structureNames(){return A.map(e=>e.name)}focusOn(e){const t=this.structurePositions.get(e);if(!t)return;this.focusTarget=t.clone();const s=this.camera.position.clone().sub(t).normalize();this.focusCamPos=t.clone().add(s.multiplyScalar(4e3)),this.controls.autoRotate=!1}resetView(){this.focusTarget=new g(0,0,0),this.focusCamPos=new g(6e3,8e3,12e3),this.controls.autoRotate=!0}getHalfHeight(e){let t=0;for(const s of e){const i=Math.abs(s.sgz);i>t&&(t=i)}return Math.max(t*1.1,3e3)}buildCylinder(e,t){const s=new F(2282478),i=new H(e,e,t*2,32,8,!0),n=new B(i),o=new p({color:s,transparent:!0,opacity:.12,depthWrite:!1});this.scene.add(new M(n,o)),i.dispose();for(const a of[t,-t])for(const r of b){const l=r*y,c=this.makeCircle(l,64),h=.08+r/100*.18,u=new p({color:s,transparent:!0,opacity:h,depthWrite:!1}),f=new z(c,u);f.position.y=a,f.rotation.x=-Math.PI/2,this.scene.add(f)}}makeCircle(e,t){const s=new Float32Array((t+1)*3);for(let n=0;n<=t;n++){const o=n/t*Math.PI*2;s[n*3]=Math.cos(o)*e,s[n*3+1]=Math.sin(o)*e,s[n*3+2]=0}const i=new w;return i.setAttribute("position",new m(s,3)),i}buildPoints(e){const t=e.length,s=new Float32Array(t*3),i=new Float32Array(t*3),n=new Float32Array(t);for(let r=0;r<t;r++){const l=e[r];s[r*3]=l.sgx,s[r*3+1]=l.sgz,s[r*3+2]=l.sgy;const c=N(l.vh??0);i[r*3]=c[0],i[r*3+1]=c[1],i[r*3+2]=c[2],n[r]=3}const o=new w;o.setAttribute("position",new m(s,3)),o.setAttribute("aColor",new m(i,3)),o.setAttribute("aSize",new m(n,1)),this.pointsMaterial=new E({vertexShader:V,fragmentShader:$,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uTime:{value:0}},transparent:!0,depthWrite:!1,blending:I});const a=new S(o,this.pointsMaterial);a.frustumCulled=!1,this.scene.add(a)}buildLabels(e){for(const s of A){let{sgx:i,sgy:n}=s;if(s.pgc!=null){const h=e.find(u=>u.group_pgc===s.pgc);h&&(i=h.sgx,n=h.sgy)}let o=0;if(s.name!=="Milky Way"){let h=1/0;for(const u of e){const f=u.sgx-i,x=u.sgy-n,C=f*f+x*x;C<h&&(h=C,o=u.sgz)}}this.structurePositions.set(s.name,new g(i,o,n));const a=s.name==="Milky Way",r=s.pgc===T,l=o+300+(r?-600:0),c=this.makeLabel(s.name,a||r);if(c.position.set(i,l,n),this.scene.add(c),!a){const h=new w().setFromPoints([new g(i,o,n),new g(i,0,n)]),u=new p({color:2282478,transparent:!0,opacity:.15,depthWrite:!1});this.scene.add(new P(h,u))}}const t=this.getHalfHeight(e);for(const s of b){const i=s*y,n=this.makeLabel(`${s} Mpc`,!1,10,.5);n.position.set(i,t,0),this.scene.add(n)}}makeLabel(e,t=!1,s=14,i=1){const n=document.createElement("canvas"),o=2;n.width=256*o,n.height=48*o;const a=n.getContext("2d");a.scale(o,o),a.font=`${t?"700":"500"} ${s}px system-ui, -apple-system, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.shadowColor=t?"rgba(255, 255, 255, 0.8)":"rgba(34, 211, 238, 0.6)",a.shadowBlur=t?12:8,a.fillStyle=t?"rgba(255, 255, 255, 1.0)":`rgba(255, 255, 255, ${.85*i})`,a.fillText(e,128,24),a.shadowBlur=0,a.fillText(e,128,24);const r=new O(n),l=new D({map:r,transparent:!0,depthTest:!1}),c=new v(l);return c.scale.set(t?1e3:800,t?200:150,1),c}}export{U as C,A as S,N as a,$ as f,V as v};
