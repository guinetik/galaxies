import{c as A,B as mt,a as K,A as lt,b as pt,n as U,p as At,l as ht,I as St,x as zt,M as $,D as Ct,g as Dt,aN as Tt,i as it,j as vt,f as xt,d as kt,N as Lt,k as rt,C as Bt,V as C,Q as at,W as Ft,S as yt,P as Ot,aO as It,O as _t}from"./three-Dw_gp1Fk.js";import{m as Et,c as Gt}from"./useGalaxyData-gHdKJrt4.js";import{d as Vt,c as Ut,b as Nt,r as Xt,g as Wt,a as Yt}from"./qualityDetect-C3IVo_e3.js";import{G as qt}from"./GalaxyBackdrop-CDaAKXKq.js";import{g as Zt}from"./GalaxyTextures-UNEtq948.js";import"./sqljs-M9QnmiAb.js";import"./vue-vendor-BVmPiw82.js";const S=Math.PI*2,Pt={visual:{diskThicknessRatio:.06,hiiRegionChance:.15}};function B(o,t){if(!t||t.projectedStrength===0)return o;const n=Math.cos(t.projectedAngle),s=Math.sin(t.projectedAngle),e=o.x*n+o.z*s,r=o.z*n-o.x*s,a=t.projectedAxisRatio*t.projectedStrength+(1-t.projectedStrength),c=r*a;return{x:e*n-c*s,y:o.y,z:e*s+c*n}}function gt(o,t,n){return o+(t-o)*n}function Rt(o){return Math.max(0,Math.min(1,o))}const Ht=[.56,.24,.16,.04],jt=[.78,.17,.03,.02],Qt=[.68,.12,.01,.19],$t=[.74,.11,.005,.145],Kt=[.72,.2,.065,.015];function Jt(o){const[t,n,s]=o,e=Math.random();return e<t?2600+Math.pow(Math.random(),.64)*3400:e<t+n?5200+Math.random()*3200:e<t+n+s?8500+Math.random()*7500:2900+Math.random()*1800}function te(o,t,n){const s=Rt((n-o)/(t-o));return s*s*(3-2*s)}function ee(o,t,n,s){const e=s.morphology;if(e.dustStrength<=0)return{r:1,g:1,b:1};const r=s.galaxyRadius,a=Math.sqrt(o*o+n*n),c=r*.34,m=r*.06*.18,g=Math.exp(-a/Math.max(c,.01)),l=Math.exp(-Math.abs(t)/Math.max(m,.01)),u=g*l,x=e.bulgeRadius*r,h=te(x*.4,x*1.2,a);let d=0;if(e.numArms>0&&e.dustArmBoost>0){const y=Math.atan2(n,o),M=e.armWidth*.5,b=Math.max(e.spiralStart*r,.001);for(let w=0;w<e.numArms;w++){const P=w*S/e.numArms,O=Math.log(Math.max(a/b,1))/Math.max(e.spiralTightness,.001)*2.5+P;let R=y-O;R=R-Math.round(R/S)*S;const N=Math.exp(-(R*R)/(2*M*M));d=Math.max(d,N)}d*=e.dustArmBoost}const f=Math.sin(o*.1+n*.13)*.5+.5,v=Math.sin(n*.11-o*.09+3.7)*.5+.5,p=(f+v)*.5,i=e.dustStrength*u*h*(1+d)*p;return{r:Math.exp(-i*.65),g:Math.exp(-i*.9),b:Math.exp(-i*1.2)}}function F(o,t=null){const n=Rt(((t==null?void 0:t.hotMix)??.5)*.7),s=gt(.04,.08,n);return o>1-s?"bright":"star"}function D(o,t=null){switch(o){case"bright":{const n=gt(.9,1.4,(t==null?void 0:t.hotMix)??.5);return{size:(3+Math.random()*5)*n,brightness:(.64+Math.random()*.16)*n,alpha:(.56+Math.random()*.24)*gt(.95,1.2,(t==null?void 0:t.clumpBoost)??0)}}default:return{size:.6+Math.random()*1.4,brightness:.32+Math.random()*.4,alpha:.4+Math.random()*.4}}}function T(o,t,n=null,s="default"){let e;o==="bright"?e=Math.random()<.6?2900+Math.random()*1800:1e4+Math.random()*15e3:e=Jt(s==="arm"?Ht:s==="field"?jt:s==="bulge"?Qt:s==="elliptical"?$t:Kt);let r,a;return e<4e3?(r=10+(e-2600)/1400*15,a=.85):e<6e3?(r=25+(e-4e3)/2e3*23,a=.4):e<8500?(r=48+(e-6e3)/2500*7,a=.15):(r=200+(e-8500)/7500*25,a=.3),{hue:r,sat:a}}function k(o,t,n,s){return t/Math.pow(Math.max(o,s)/s,n)}function ft(o){const t=Math.min(.98,Math.max(.02,Math.random()));return Math.log(t/(1-t))*o*.45}function ne(o){return o.galaxyRadius*.06}function oe(o,t){const n=ne(t);return o.filter(s=>s.radius>=n)}function ut(o,t,n,s,e=null){const r=Math.random()*S,a=Math.sqrt(Math.random())*o;let c=ft(o*.08);const m=F(Math.random(),e),g=D(m,e),l=a/o,u=T(m,l,e,"field"),x=Math.cos(r)*a,h=Math.sin(r)*a,d=B({x,y:c,z:h},e),f=Math.sqrt(d.x*d.x+d.z*d.z),v=Math.atan2(d.z,d.x);return{radius:f,angle:v,y:d.y,rotationSpeed:k(f,t,n,s),hue:u.hue,sat:u.sat,brightness:g.brightness,size:g.size,alpha:g.alpha,layer:m,twinklePhase:Math.random()*S}}function Mt(o,t,n=null){const s=[],e=(n==null?void 0:n.armScatterScale)??1,r=(n==null?void 0:n.diskThicknessScale)??1,a=o.morphology,c=o.galaxyRadius,m=a.numArms,g=Math.floor(t/m),l=a.armWidth*c,u=a.spiralTightness,x=a.spiralStart*c,h=a.irregularity,d=a.barLength>0,f=a.barLength*c,v=2.5,p=Math.min(Math.max(x,d?f*.5:0),c*.98),i=p*p,y=c*c;for(let M=0;M<m;M++){const b=M/m*S;for(let w=0;w<g;w++){const P=Math.sqrt(Math.random()*(y-i)+i),O=Math.max(x,.001),R=Math.log(Math.max(P/O,1))/Math.max(u,.001)*v,N=(Math.random()-.5)*.3,z=R+b+N,L=P/c*.5+.5,X=(Math.random()-.5+Math.random()-.5)*l*L*e,I=z+Math.PI/2,_=h*(Math.random()-.5)*30,W=Math.cos(z)*(P+_)+Math.cos(I)*X,Y=Math.sin(z)*(P+_)+Math.sin(I)*X,q=P/c,E=c*Pt.visual.diskThicknessRatio*(1-q*.7)*r;let ct=ft(E);const Z=B({x:W,y:ct,z:Y},n);let G=Z.x,tt=Z.y,H=Z.z;const j=Math.sqrt(G*G+H*H),et=Math.atan2(H,G),nt=j/c,dt=k(j,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),Q=F(Math.random(),n),V=D(Q,n),ot=T(Q,nt,n,"arm");s.push({radius:j,angle:et,y:tt,rotationSpeed:dt,hue:ot.hue,sat:ot.sat,brightness:V.brightness,size:V.size,alpha:V.alpha,layer:Q,twinklePhase:Math.random()*S})}}return s}function se(o,t,n=null){const s=[],e=o.galaxyRadius,r=o.morphology.barLength*e,a=o.morphology.barWidth*e;for(let c=0;c<t;c++){const m=(Math.random()-.5)*2*r,g=(Math.random()-.5)*a;let l=m,u=g,x=(Math.random()-.5)*e*.04;if(Math.sqrt(l*l+u*u)>e)continue;const d=B({x:l,y:x,z:u},n),f=d.x,v=d.y,p=d.z,i=Math.sqrt(f*f+p*p),y=Math.atan2(p,f),M=F(Math.random(),n),b=D(M,n),w=T(M,.1,n,"arm");s.push({radius:i,angle:y,y:v,rotationSpeed:k(i,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:w.hue,sat:w.sat,brightness:b.brightness,size:b.size,alpha:b.alpha,layer:M,twinklePhase:Math.random()*S})}return s}function bt(o,t,n=null){const s=[],e=o.morphology.bulgeRadius*o.galaxyRadius,r=(n==null?void 0:n.bulgeBoost)??0;for(let a=0;a<t;a++){const c=Math.pow(Math.random(),.6)*e,m=Math.random()*S;let g=(Math.random()-.5)*e*.5;const l=c/e,u=1+(1-l)*(.4+r*.2),x=F(Math.random(),n),h=D(x,n),d=Math.cos(m)*c,f=Math.sin(m)*c,v=B({x:d,y:g,z:f},n),p=Math.sqrt(v.x*v.x+v.z*v.z),i=Math.atan2(v.z,v.x),y=T(x,.1,n,"bulge");s.push({radius:p,angle:i,y:v.y,rotationSpeed:k(p,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:y.hue,sat:y.sat,brightness:Math.min(h.brightness*u,.95),size:h.size*(1+(1-l)*.3),alpha:Math.min(h.alpha*u,.95),layer:x,twinklePhase:Math.random()*S})}return s}function ae(o,t,n=null){const s=[],e=o.galaxyRadius,r=o.morphology.axisRatio;for(let a=0;a<t;a++){const c=Math.random(),m=Math.random(),g=Math.pow(c,.4)*e,l=m*S;let u=g*Math.cos(l),x=g*Math.sin(l)*r,h=(Math.random()-.5)*e*.1*(1-g/e*.5);const d=B({x:u,y:h,z:x},n),f=Math.sqrt(d.x*d.x+d.z*d.z),v=Math.atan2(d.z,d.x),p=f/e,i=F(Math.random(),n),y=D(i,n),M=T(i,p,n,"elliptical");s.push({radius:f,angle:v,y:d.y,rotationSpeed:k(f,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:M.hue,sat:M.sat,brightness:y.brightness,size:y.size,alpha:y.alpha,layer:i,twinklePhase:Math.random()*S})}return s}function ie(o,t,n=null){const s=[],e=o.galaxyRadius,r=o.morphology.bulgeRadius*e;for(let a=0;a<t;a++){const c=Math.pow(Math.random(),.55)*e,m=Math.random()*S,g=c/e,l=(n==null?void 0:n.diskThicknessScale)??1,x=e*.06*Math.pow(Math.max(1-g,0),2)*l;let h=ft(x);const d=Math.max(0,Math.min(1,1-c/Math.max(r,1))),f=1+d*.4;let v=Math.cos(m)*c,p=Math.sin(m)*c;const i=B({x:v,y:h,z:p},n),y=Math.sqrt(i.x*i.x+i.z*i.z),M=Math.atan2(i.z,i.x),b=F(Math.random(),n),w=D(b,n),P=T(b,g*.2,n,"default");s.push({radius:y,angle:M,y:i.y,rotationSpeed:k(y,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:P.hue,sat:P.sat,brightness:Math.min(w.brightness*f,.95),size:w.size*(1+d*.3),alpha:Math.min(w.alpha*f,.95),layer:b,twinklePhase:Math.random()*S})}return s}function re(o,t,n=null){const s=[],e=o.galaxyRadius,r=o.morphology.irregularity,a=o.morphology.clumpCount,c=(n==null?void 0:n.clumpBoost)??0,m=[];for(let g=0;g<a;g++){const l=g/a*S+Math.random()*.5,u=(.2+Math.random()*.6)*e;m.push({x:Math.cos(l)*u,z:Math.sin(l)*u,sigma:(30+Math.random()*80)*(1-c*.3),weight:.5+Math.random(),isHII:Math.random()<Pt.visual.hiiRegionChance})}for(let g=0;g<t;g++){let l,u;if(Math.random()<1-r){const M=Math.floor(Math.random()*a),b=m[M],w=()=>(Math.random()-.5+Math.random()-.5)*2;l=b.x+w()*b.sigma,u=b.z+w()*b.sigma,b.isHII&&Math.random()<.4}else{const M=Math.random()*S,b=Math.sqrt(Math.random())*e;l=Math.cos(M)*b+(Math.random()-.5)*60,u=Math.sin(M)*b+(Math.random()-.5)*60}let x=(Math.random()-.5)*e*.12;const h=B({x:l,y:x,z:u},n),d=Math.sqrt(h.x*h.x+h.z*h.z);if(d>e*1.1)continue;const f=Math.atan2(h.z,h.x),v=d/e,p=F(Math.random(),n),i=D(p,n),y=T(p,v,n,"arm");s.push({radius:d,angle:f,y:h.y,rotationSpeed:k(d,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:y.hue,sat:y.sat,brightness:i.brightness,size:i.size,alpha:i.alpha,layer:p,twinklePhase:Math.random()*S})}return s}const le=.03;function he(o,t,n){const s=o.galaxyRadius,e=[];for(let r=0;r<t;r++){const a=s*(1+Math.pow(Math.random(),.5)*.6),c=Math.random()*2-1,m=Math.random()*Math.PI*2,g=Math.sqrt(1-c*c),l=a*g*Math.cos(m),u=a*c*.7,x=a*g*Math.sin(m),h=Math.sqrt(l*l+x*x),d=Math.atan2(x,l),f=D("star",n),{hue:v,sat:p}=T("star",1,n,"field");e.push({radius:h,angle:d,y:u,rotationSpeed:k(h,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover),hue:v,sat:p,size:f.size,brightness:f.brightness*.45,alpha:f.alpha,layer:"star",twinklePhase:Math.random()*S})}return e}function ce(o){const t=o.morphology,n=o.starCount,s=o.galaxyRadius,e=Vt(o.bandProfile)??null;let r=[];const a=t.barLength>0,c=t.numArms>0,m=t.clumpCount>0&&t.irregularity>0,g=t.ellipticity>0&&!c&&!a&&!m,l=!c&&!a&&!m&&t.ellipticity===0&&t.bulgeFraction>0,u=Math.floor(n*le),x=n-u;if(g)r.push(...ae(o,x,e));else if(l)r.push(...ie(o,x,e));else if(m){const h=Math.floor(x*t.fieldStarFraction),d=x-h;r.push(...re(o,d,e));for(let f=0;f<h;f++)r.push(ut(s,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover,e))}else if(a&&c){const h=Math.floor(x*.25),d=x-h;r.push(...se(o,h,e));const f=Math.floor(d*.9);r.push(...Mt(o,f,e));const v=t.bulgeRadius*s;if(v>0){const i=Math.min(.2,.08+.18*(v/s)),y=Math.floor(x*i);r.push(...bt(o,y,e))}const p=Math.floor(d*.1);for(let i=0;i<p;i++)r.push(ut(s,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover,e))}else if(c){const h=t.fieldStarFraction,d=Math.floor(x*(1-h));r.push(...Mt(o,d,e));const f=t.bulgeRadius*s;if(f>0){const p=Math.min(.25,.1+.2*(f/s)),i=Math.floor(x*p);r.push(...bt(o,i,e))}const v=Math.floor(x*h);for(let p=0;p<v;p++)r.push(ut(s,o.rotationOmega0,o.rotationFalloff,o.rotationTurnover,e))}r.push(...he(o,u,e));for(const h of r){const d=Math.cos(h.angle)*h.radius,f=Math.sin(h.angle)*h.radius,v=ee(d,h.y,f,o);h.brightness*=(v.r+v.g+v.b)/3,v.b<.5&&(h.hue=h.hue*.5+15*.5,h.sat=Math.min(h.sat+.2,1))}return oe(r,o)}const de=`attribute float aSize;
attribute vec4 aColor;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Give the fragment shader room for a corona while capping the largest
  // sprites well before they bloom into soft blobs.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 5.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;
}
`,ue=`precision highp float;

varying vec4 vColor;
uniform sampler2D uGlowTex;

void main() {
    vec4 glow = texture2D(uGlowTex, gl_PointCoord);

    // glow.a = pre-baked alpha envelope
    float alpha = vColor.a * glow.a;
    if (alpha < 0.004) discard;

    // glow.r = corona intensity, glow.g = core intensity
    vec3 coronaColor = mix(vColor.rgb * 1.32, vec3(1.0), 0.12);
    vec3 coreColor   = mix(coronaColor, vec3(1.0), 0.92);
    vec3 litRgb = coronaColor * glow.r + coreColor * (glow.g * 1.35);

    gl_FragColor = vec4(litRgb, alpha);
}
`;function me(o,t,n){o/=360;const s=t*Math.min(n,1-n),e=r=>{const a=(r+o*12)%12;return n-s*Math.max(Math.min(a-3,9-a,1),-1)};return[e(0),e(8),e(4)]}function pe(o,t){switch(o){case"star":return t*.6;case"bright":return t*.85}}class ge{constructor(t,n=600){this.stars=t,this.baseDistance=n;const s=t.length,e=new Float32Array(s*3),r=new Float32Array(s*4),a=new Float32Array(s*4),c=new Float32Array(s);this.angleOffsets=new Float32Array(s),this.baseAlphas=new Float32Array(s);for(let l=0;l<s;l++){const u=t[l],x=u.radius*Math.cos(u.angle),h=u.radius*Math.sin(u.angle);e[l*3]=x,e[l*3+1]=u.y,e[l*3+2]=h;const d=u.sat,f=pe(u.layer,u.brightness),[v,p,i]=me(u.hue,d,f);r[l*4]=a[l*4]=v,r[l*4+1]=a[l*4+1]=p,r[l*4+2]=a[l*4+2]=i,r[l*4+3]=u.alpha,a[l*4+3]=0,c[l]=u.size,this.angleOffsets[l]=u.angle,this.baseAlphas[l]=u.alpha}const m=new A(e,3),g=new A(c,1);this.backgroundGeometry=new mt,this.backgroundGeometry.setAttribute("position",m),this.backgroundGeometry.setAttribute("aColor",new A(r,4)),this.backgroundGeometry.setAttribute("aSize",g),this.foregroundGeometry=new mt,this.foregroundGeometry.setAttribute("position",m),this.foregroundGeometry.setAttribute("aColor",new A(a,4)),this.foregroundGeometry.setAttribute("aSize",g),this.glowTexture=Ut(),this.material=new K({vertexShader:de,fragmentShader:ue,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:n},uGlowTex:{value:this.glowTexture}},transparent:!0,depthWrite:!1,blending:lt}),this.foregroundMaterial=this.material.clone(),this.foregroundMaterial.uniforms={uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:n},uGlowTex:{value:this.glowTexture}},this.points=new pt(this.backgroundGeometry,this.material),this.points.frustumCulled=!1,this.foregroundPoints=new pt(this.foregroundGeometry,this.foregroundMaterial),this.foregroundPoints.frustumCulled=!1,this.foregroundPoints.renderOrder=2}update(t,n,s,e,r,a,c,m){const g=this.stars,l=g.length,u=this.backgroundGeometry.getAttribute("position"),x=this.backgroundGeometry.getAttribute("aColor"),h=this.foregroundGeometry.getAttribute("aColor"),d=u.array,f=x.array,v=h.array,p=s.matrixWorldInverse.elements,i=s.projectionMatrix.elements,y=p[14],M=s.position.length(),b=U.smoothstep(1-Math.abs(s.position.y)/Math.max(M,1e-4),.55,.95),w=U.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),b),P=U.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),b),O=U.lerp(.75,1.2,b),R=Math.max(a*O/Math.max(c*.5,1),.04),N=Math.max(a*O/Math.max(m*.5,1),.04);for(let z=0;z<l;z++){const L=g[z];this.angleOffsets[z]+=L.rotationSpeed*t;const X=this.angleOffsets[z];d[z*3]=L.radius*Math.cos(X),d[z*3+2]=L.radius*Math.sin(X);let I=this.baseAlphas[z];if(L.layer==="bright"){const ot=Math.sin(n*2+L.twinklePhase)*.15+.85;I*=ot}const _=d[z*3],W=d[z*3+1],Y=d[z*3+2],q=p[0]*_+p[4]*W+p[8]*Y+p[12],J=p[1]*_+p[5]*W+p[9]*Y+p[13],E=p[2]*_+p[6]*W+p[10]*Y+p[14],ct=i[0]*q+i[4]*J+i[8]*E+i[12],Z=i[1]*q+i[5]*J+i[9]*E+i[13],G=i[3]*q+i[7]*J+i[11]*E+i[15],tt=G!==0?1/G:0,H=ct*tt,j=Z*tt,et=(H-e)/R,nt=(j-r)/N,dt=1-U.smoothstep(.75,1.25,Math.sqrt(et*et+nt*nt)),Q=U.smoothstep(E-y,w,w+P),V=dt*Q;f[z*4+3]=I*(1-V),v[z*4+3]=I*V}u.needsUpdate=!0,x.needsUpdate=!0,h.needsUpdate=!0}dispose(){this.backgroundGeometry.dispose(),this.foregroundGeometry.dispose(),this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}class fe{constructor(t){const s=document.createElement("canvas");s.width=512,s.height=512;const e=s.getContext("2d"),r=512/2,a=512/2,c=e.createRadialGradient(r,a,0,r,a,r*.3);c.addColorStop(0,"hsla(35, 80%, 65%, 0.45)"),c.addColorStop(.3,"hsla(30, 70%, 50%, 0.25)"),c.addColorStop(.7,"hsla(25, 60%, 40%, 0.08)"),c.addColorStop(1,"hsla(20, 50%, 30%, 0)"),e.fillStyle=c,e.fillRect(0,0,512,512);const m=e.createRadialGradient(r,a,0,r,a,r*.7);m.addColorStop(0,"hsla(30, 60%, 55%, 0.15)"),m.addColorStop(.3,"hsla(210, 40%, 45%, 0.08)"),m.addColorStop(.6,"hsla(220, 30%, 35%, 0.03)"),m.addColorStop(1,"hsla(0, 0%, 0%, 0)"),e.fillStyle=m,e.fillRect(0,0,512,512);const g=e.createRadialGradient(r,a,0,r,a,r);g.addColorStop(0,"hsla(25, 40%, 40%, 0.04)"),g.addColorStop(.5,"hsla(220, 30%, 30%, 0.02)"),g.addColorStop(1,"hsla(0, 0%, 0%, 0)"),e.fillStyle=g,e.fillRect(0,0,512,512);const l=new At(s);l.needsUpdate=!0;const u=t*3,x=new ht(u,u);this.material=new St({map:l,transparent:!0,depthWrite:!1,blending:lt,side:zt}),this.mesh=new $(x,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,0)}dispose(){var t;(t=this.material.map)==null||t.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const ve=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,xe=`precision highp float;

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

// Quality LOD — overridden by ShaderMaterial.defines
#ifndef FBM_MAX_OCTAVES
#define FBM_MAX_OCTAVES 4
#endif
#ifndef SPIRAL_ITERS
#define SPIRAL_ITERS 5
#endif

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

  for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
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

  for (int i = 0; i < SPIRAL_ITERS; i++) {
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
`;class ye{constructor(t,n,s,e){const a=new Float32Array(65536),c=n*1.3;for(let h=0;h<t.length;h++){const d=t[h],f=Math.cos(d.angle)*d.radius,v=Math.sin(d.angle)*d.radius,p=Math.floor((f/c*.5+.5)*255),i=Math.floor((v/c*.5+.5)*255);p>=0&&p<256&&i>=0&&i<256&&(a[i*256+p]+=1)}const m=new Float32Array(256*256);for(let h=0;h<3;h++){const d=h%2===0?a:m,f=h%2===0?m:a;for(let v=0;v<256;v++)for(let p=0;p<256;p++){let i=0,y=0;for(let M=-2;M<=2;M++)for(let b=-2;b<=2;b++){const w=p+b,P=v+M;w>=0&&w<256&&P>=0&&P<256&&(i+=d[P*256+w],y++)}f[v*256+p]=i/y}}a.set(m);let g=0;for(let h=0;h<a.length;h++)a[h]>g&&(g=a[h]);const l=new Uint8Array(256*256);if(g>0)for(let h=0;h<a.length;h++)l[h]=Math.min(255,Math.floor(a[h]/g*255));this.densityTexture=new Ct(l,256,256,Dt,Tt),this.densityTexture.minFilter=it,this.densityTexture.magFilter=it,this.densityTexture.wrapS=vt,this.densityTexture.wrapT=vt,this.densityTexture.needsUpdate=!0;const u=new ht(2,2),x=e==="mobile";this.material=new K({vertexShader:ve,fragmentShader:xe,defines:{FBM_MAX_OCTAVES:x?2:4,SPIRAL_ITERS:x?3:5},uniforms:{uInvViewProj:{value:new xt},uTime:{value:0},uGalaxyRadius:{value:n},uSeed:{value:s},uNebulaIntensity:{value:.4},uGalaxyRotation:{value:0},uAxisRatio:{value:1},uDensityMap:{value:this.densityTexture}},transparent:!0,depthWrite:!1,depthTest:!1,blending:lt}),this.mesh=new $(u,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1}update(t,n,s,e,r){const a=this.material.uniforms;a.uTime.value=t,a.uGalaxyRotation.value=s,a.uGalaxyRadius.value=e,a.uAxisRatio.value=r;const c=new xt;c.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),a.uInvViewProj.value.copy(c).invert()}dispose(){this.densityTexture.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const Me=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,be=`precision highp float;

varying vec2 vUV;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiltX;
uniform float uRotY;
uniform float uLOD;

const float PI = 3.1415926;

/**
 * 3D hash for ray jitter — maps vec3 to float.
 */
float hash13(vec3 p) {
    p = fract(p * vec3(0.16532, 0.17369, 0.15787));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

/**
 * 2D hash — maps vec2 to float (matched to WebGPU tsl-helpers).
 */
float hash2d(vec2 p) {
    return fract(cos(dot(p, vec2(2.31, 53.21)) * 124.123) * 412.0);
}

/**
 * 2D value noise with smooth bilinear interpolation.
 */
float noise2d(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash2d(i), hash2d(i + vec2(1.0, 0.0)), u.x),
        mix(hash2d(i + vec2(0.0, 1.0)), hash2d(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

void main() {
    vec2 pp = vUV * 2.0 - 1.0;
    float screenR = length(pp);

    if (screenR > 1.0) discard;

    // ─── Camera ──────────────────────────────────────────────────────────
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

    // ─── Black hole parameters (matched to WebGPU singularity model) ────
    float originRadius = 0.13;
    float power = 0.3;
    float bandWidth = 0.04;
    float stepSize = mix(0.018, 0.012, uLOD);

    vec3 rayPos = ro;
    vec3 rayDir = rd;

    rayPos += rayDir * hash13(rd + uTime) * 0.01;

    float intensity = mix(0.3, 1.0, uLOD);
    float animSpeed = mix(0.005, 0.02, uLOD);
    float grainMix = mix(0.1, 0.5, uLOD);

    vec3 col = vec3(0.0);
    float alphaAcc = 0.0;
    float captured = 0.0;

    vec3 cInner = vec3(1.0, 0.65, 0.18);
    vec3 cMid = vec3(1.0, 0.35, 0.05);
    vec3 cOuter = vec3(0.4, 0.08, 0.01);
    vec3 emissionColor = vec3(0.25, 0.15, 0.05);
    float diskRotSpeed = uTime * animSpeed * 30.0;

    // ─── Ray march with direction-based gravity steering ────────────────
    for (int i = 0; i < 200; i++) {
        vec3 rNorm = normalize(rayPos);
        float rLen = length(rayPos);
        float steerMag = stepSize * power / max(rLen * rLen, 0.001);
        vec3 steeredDir = normalize(rayDir - rNorm * steerMag);

        vec3 advance = rayDir * stepSize;
        rayPos += advance;

        float rLenNow = length(rayPos);
        if (rLenNow < originRadius) {
            captured = 1.0;
            break;
        }

        // ─── Volumetric accretion disk ──────────────────────────────────
        float xyLen = length(vec2(rayPos.x, rayPos.z));

        float yNorm = rayPos.y / bandWidth;
        float yBand = max(0.0, 1.0 - yNorm * yNorm);

        float radialFade = smoothstep(1.3, 0.16, xyLen);
        float diskMask = yBand * radialFade;

        float diskAngle = atan(-rayPos.x, -rayPos.z);
        float rotAngle = diskAngle + diskRotSpeed;
        vec2 noiseUV = vec2(xyLen * 8.0, rotAngle * 5.0);

        float turbulence = max(0.0, noise2d(noiseUV * vec2(0.1, 0.5)) + 0.05);
        float grain = noise2d(noiseUV * vec2(1.5, 3.0) + 77.0);
        float diskTex = turbulence * (1.0 - grainMix + grainMix * grain);

        float doppler = 1.0 + cos(rotAngle) * 0.7;

        float rampInput = clamp(xyLen + (diskTex - 0.78) * 1.5, 0.0, 1.0);
        vec3 diskColor = mix(
            mix(cInner, cMid, smoothstep(0.05, 0.425, rampInput)),
            cOuter,
            smoothstep(0.425, 1.0, rampInput)
        );

        float texBright = max(diskTex, 0.3);
        vec3 emissiveCol = diskColor * texBright * doppler * 3.5
                         + emissionColor * diskMask * 0.8;

        float diskAlpha = diskMask * clamp(texBright * 2.0, 0.0, 1.0);

        float oneMinusA = 1.0 - alphaAcc;
        float weight = oneMinusA * diskAlpha;
        col = mix(col, emissiveCol, weight);
        alphaAcc = clamp(mix(alphaAcc, 1.0, diskAlpha), 0.0, 1.0);

        // Second advance + direction update (singularity double-step)
        rayPos += advance;
        rayDir = steeredDir;

        if (dot(rayPos, rayPos) > 16.0 && dot(rayDir, rayPos) > 0.0) {
            break;
        }
    }

    col *= intensity;

    // ─── Output ─────────────────────────────────────────────────────────
    float feather = 1.0 - smoothstep(0.3, 1.0, screenR);
    col *= feather;
    float alpha = max(alphaAcc * feather, captured);

    gl_FragColor = vec4(col, alpha);
}
`;class we{constructor(t,n=60){this.apparentPx=0,this.quadSize=n;const s=new kt(1,4,4),e=new St({visible:!1});this.depthMesh=new $(s,e),this.depthMesh.layers.set(2),this.material=new K({vertexShader:Me,fragmentShader:be,uniforms:{uResolution:{value:new rt(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:Lt,side:zt}),this.mesh=new $(new ht(1,1),this.material),this.mesh.scale.set(n,n,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(t,n,s,e,r){if(this.material.uniforms.uTime.value=t,this.material.uniforms.uTiltX.value=n,this.material.uniforms.uRotY.value=s,r){const a=r.getSize(new rt),c=r.getPixelRatio();this.material.uniforms.uResolution.value.set(a.x*c,a.y*c)}if(e){this.mesh.quaternion.copy(e.quaternion);const a=e.position.length(),m=(e.fov??60)*Math.PI/180,g=this.material.uniforms.uResolution.value.y;this.apparentPx=this.quadSize/a*(g/(2*Math.tan(m/2)));const l=Math.min(Math.max((this.apparentPx-6)/220,0),1);this.material.uniforms.uLOD.value=l}}getLOD(){return this.material.uniforms.uLOD.value}getApparentPx(){return this.apparentPx}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const Se=`
attribute float aSize;
attribute vec3  aColor;
attribute float aTexIndex;
attribute float aBrightness;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;

void main() {
  vColor      = aColor;
  vTexIndex   = aTexIndex;
  vBrightness = aBrightness;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Screen-space size: same formula as particle.vert.glsl, clamped smaller.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 5.0 * uPixelRatio);
  gl_Position  = projectionMatrix * mvPosition;
}
`,ze=`
precision highp float;

uniform sampler2D uAtlas;
uniform float     uBrightness;  // global master dim (0.7)

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;  // per-sprite distance fade from aBrightness

void main() {
  // Atlas layout: 4 cols x 2 rows
  const float COLS = 4.0;
  const float ROWS = 2.0;
  float idx  = floor(vTexIndex + 0.5);
  float col  = mod(idx, COLS);
  float row  = floor(idx / COLS);

  // Map gl_PointCoord [0,1]^2 into the tile's UV window
  vec2 tileUV = vec2(
    (col + gl_PointCoord.x) / COLS,
    (row + gl_PointCoord.y) / ROWS
  );

  vec4 tex = texture2D(uAtlas, tileUV);

  // Apply brightness once: per-sprite distance fade × global master dim.
  float dim   = vBrightness * uBrightness;
  float alpha = tex.a;
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(tex.rgb * vColor * dim, alpha * dim);
}
`;class Pe{constructor(t,n,s){const e=t.length,r=new Float32Array(e*3),a=new Float32Array(e*3),c=new Float32Array(e),m=new Float32Array(e),g=new Float32Array(e);for(let l=0;l<e;l++){const u=t[l];r[l*3]=u.position[0],r[l*3+1]=u.position[1],r[l*3+2]=u.position[2],a[l*3]=u.color[0],a[l*3+1]=u.color[1],a[l*3+2]=u.color[2],c[l]=u.size,m[l]=u.texIndex,g[l]=u.brightness}this.geometry=new mt,this.geometry.setAttribute("position",new A(r,3)),this.geometry.setAttribute("aColor",new A(a,3)),this.geometry.setAttribute("aSize",new A(c,1)),this.geometry.setAttribute("aTexIndex",new A(m,1)),this.geometry.setAttribute("aBrightness",new A(g,1)),this.material=new K({vertexShader:Se,fragmentShader:ze,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:s},uAtlas:{value:n},uBrightness:{value:.7}},transparent:!0,depthWrite:!1,blending:lt}),this.points=new pt(this.geometry,this.material),this.points.frustumCulled=!1}dispose(){this.geometry.dispose(),this.material.dispose()}}const Re=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,Ae=`precision highp float;

uniform sampler2D uSceneTexture;
uniform vec2      uBHScreenPos;   // black hole position in UV space (0–1)
uniform float     uLensStrength;  // 0 = no distortion, ~0.03 = max
uniform float     uLensZoom;      // 0 = distant, 1 = close-up
uniform float     uAspectRatio;   // width / height

varying vec2 vUV;

vec3 gradeIntergalacticBackdrop(vec3 color) {
  float peak = max(color.r, max(color.g, color.b));
  float floor = min(color.r, min(color.g, color.b));
  float saturation = peak - floor;

  // Target diffuse, colorful nebula glow more than star-like highlights.
  float nebulaMask = smoothstep(0.06, 0.30, saturation);
  nebulaMask *= 1.0 - smoothstep(0.28, 0.95, peak);

  vec3 graded = pow(max(color, 0.0), vec3(1.14));
  return graded * mix(0.90, 0.45, nebulaMask);
}

void main() {
  // Vector from this pixel to the black hole center
  vec2 toBH = uBHScreenPos - vUV;
  toBH.x *= uAspectRatio;              // work in circular space

  float dist = length(toBH);
  vec2  dir  = toBH / max(dist, 0.0001);

  // Expand the field as we approach the black hole so the warped background
  // remains visible instead of getting swallowed by the black hole overlay.
  float radius = mix(0.20, 0.40, uLensZoom);
  float falloff = smoothstep(radius, 0.0, dist); // 1 at center, 0 at radius
  falloff *= falloff;                             // squared for steep drop-off
  float innerRadius = mix(0.012, 0.05, uLensZoom);
  float innerMask = smoothstep(innerRadius, innerRadius * 2.8, dist);
  float softDist = max(dist, mix(0.028, 0.04, uLensZoom));
  float deflection = uLensStrength * falloff * innerMask * (mix(0.11, 0.22, uLensZoom) / softDist);

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);
  color.rgb = gradeIntergalacticBackdrop(color.rgb);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = mix(0.024, 0.09, uLensZoom);
  float ringWidth = mix(0.008, 0.024, uLensZoom);
  float ring = exp(-pow((dist - ringRadius) / ringWidth, 2.0));
  ring *= falloff * innerMask * uLensStrength * mix(10.0, 16.0, uLensZoom);
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.14;

  gl_FragColor = color;
}
`,wt=new C(0,1,0),st=new at;class Oe{constructor(t,n,s=[]){this.neighbors=null,this.neighborAtlas=null,this.animationId=0,this.clock=new Bt,this.galaxyRotation=0,this._bhScreenVec=new C,this.orbitQuat=new at,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.isPanning=!1,this.pivot=new C,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new Ft({canvas:t,antialias:!0,alpha:!0});const e=Yt();this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Nt(e))),this.renderer.setSize(t.clientWidth,t.clientHeight,!1),this.scene=new yt,this.renderer.setClearColor(0,1),this.params=Et(n);const r=ce(this.params),a=this.params.galaxyRadius;this.baseDistance=a*1.7;const c=t.clientWidth/t.clientHeight;this.camera=new Ot(60,c,.1,this.baseDistance*20),this.backdrop=new qt(this.baseDistance,n.pgc,e),this.scene.add(this.backdrop.mesh),this.particles=new ge(r,this.baseDistance),this.scene.add(this.particles.points),this.scene.add(this.particles.foregroundPoints),this.haze=new fe(a),this.scene.add(this.haze.mesh),this.nebula=new ye(r,a,n.pgc,e),this.scene.add(this.nebula.mesh),this.blackHole=new we(null,a*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.backdrop.mesh.layers.set(1),this.particles.points.layers.set(1),this.particles.foregroundPoints.layers.set(2),this.haze.mesh.layers.set(1),this.nebula.mesh.layers.set(1);const m=Gt(n,s,this.baseDistance);m.length>0&&(this.neighborAtlas=Zt(),this.neighbors=new Pe(m,this.neighborAtlas,this.baseDistance),this.neighbors.points.layers.set(1),this.neighbors.points.renderOrder=-9,this.scene.add(this.neighbors.points));const g=t.clientWidth,l=t.clientHeight;this.rtScaleFactor=Xt(e),this.galaxyRT=new It(g*this.renderer.getPixelRatio()*this.rtScaleFactor,l*this.renderer.getPixelRatio()*this.rtScaleFactor,{minFilter:it,magFilter:it}),this.lensingMaterial=new K({vertexShader:Re,fragmentShader:Ae,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBHScreenPos:{value:new rt(.5,.5)},uLensStrength:{value:0},uLensZoom:{value:0},uAspectRatio:{value:g/l}},depthTest:!1,depthWrite:!1});const u=new $(new ht(2,2),this.lensingMaterial);this.lensingScene=new yt,this.lensingScene.add(u),this.lensingCamera=new _t(-1,1,1,-1,0,1);const h=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=h,this.targetZoom=h;const{initRotY:d,initTiltX:f}=Wt(n),v=new at().setFromAxisAngle(new C(1,0,0),f),p=new at().setFromAxisAngle(wt,d);this.orbitQuat.multiplyQuaternions(p,v),this.onPointerDown=i=>{this.isPinching||(i.button===2?(this.isPanning=!0,this.isDragging=!1):this.isDragging=!0,this.lastX=i.clientX,this.lastY=i.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=i=>{if(this.isPinching)return;if(this.isPanning){this.applyPan(i.clientX-this.lastX,i.clientY-this.lastY),this.lastX=i.clientX,this.lastY=i.clientY;return}if(!this.isDragging)return;const y=i.clientX-this.lastX,M=i.clientY-this.lastY;this.velocityX=y*.005,this.velocityY=M*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=i.clientX,this.lastY=i.clientY},this.onPointerUp=()=>{this.isDragging=!1,this.isPanning=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1,this.isPanning=!1},this.onWheel=i=>{i.preventDefault();const y=this.targetZoom*.12;this.targetZoom+=i.deltaY>0?-y:y,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=i=>{if(i.touches.length===2){i.preventDefault(),this.isPinching=!0,this.isDragging=!1;const y=i.touches[0].clientX-i.touches[1].clientX,M=i.touches[0].clientY-i.touches[1].clientY;this.lastPinchDist=Math.sqrt(y*y+M*M)}},this.onTouchMove=i=>{if(i.touches.length===2){i.preventDefault();const y=i.touches[0].clientX-i.touches[1].clientX,M=i.touches[0].clientY-i.touches[1].clientY,b=Math.sqrt(y*y+M*M),w=(b-this.lastPinchDist)*.01;this.lastPinchDist=b,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+w))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onContextMenu=i=>i.preventDefault(),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),t.addEventListener("contextmenu",this.onContextMenu),this.resizeObserver=new ResizeObserver(()=>{const i=t.clientWidth,y=t.clientHeight;if(i===0||y===0)return;this.renderer.setSize(i,y,!1),this.camera.aspect=i/y,this.camera.updateProjectionMatrix();const M=this.renderer.getPixelRatio();this.galaxyRT.setSize(i*M*this.rtScaleFactor,y*M*this.rtScaleFactor),this.lensingMaterial.uniforms.uAspectRatio.value=i/y}),this.resizeObserver.observe(t)}applyPan(t,n){const s=this.baseDistance/this.zoom,e=this.camera.fov*Math.PI/180,r=2*s*Math.tan(e/2)/Math.max(this.renderer.domElement.clientHeight,1),a=new C(1,0,0).applyQuaternion(this.orbitQuat),c=new C(0,1,0).applyQuaternion(this.orbitQuat);this.pivot.addScaledVector(a,-t*r),this.pivot.addScaledVector(c,n*r);const m=this.baseDistance*8;this.pivot.length()>m&&this.pivot.setLength(m)}applyOrbitDelta(t,n){st.setFromAxisAngle(wt,-t),this.orbitQuat.premultiply(st);const s=new C(1,0,0).applyQuaternion(this.orbitQuat);st.setFromAxisAngle(s,-n),this.orbitQuat.premultiply(st),this.orbitQuat.normalize()}renderGalaxyPostPass(t,n,s,e){this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(t,n),this.lensingMaterial.uniforms.uLensStrength.value=s,this.lensingMaterial.uniforms.uLensZoom.value=e,this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera)}start(){this.clock.start();const t=()=>{this.animationId=requestAnimationFrame(t);const n=this.clock.getDelta(),s=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const e=this.baseDistance/this.zoom,r=new C(0,0,e).applyQuaternion(this.orbitQuat).add(this.pivot);this.camera.position.copy(r),this.camera.lookAt(this.pivot),this.camera.updateMatrixWorld(!0);const a=Math.min(this.zoom/20,1),c=.02+.18*a*a;this.galaxyRotation+=n*c;const m=this.camera.position,g=Math.sqrt(m.x*m.x+m.z*m.z),l=Math.atan2(m.y,g),u=Math.atan2(m.x,m.z);this.backdrop.update(s,this.camera),this.blackHole.update(s,l,u,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const x=this._bhScreenVec.x*.5+.5,h=this._bhScreenVec.y*.5+.5,d=this.renderer.getSize(new rt),f=this.renderer.getPixelRatio();this.particles.update(n,s,this.camera,this._bhScreenVec.x,this._bhScreenVec.y,this.blackHole.getApparentPx(),d.x*f,d.y*f);const v=this.params.morphology.ellipticity>0?this.params.morphology.axisRatio:1;this.nebula.update(s,this.camera,this.galaxyRotation,this.params.galaxyRadius,v);{const p=this.blackHole.getLOD(),i=p*p*.045;this.renderGalaxyPostPass(x,h,i,p)}this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0};t()}dispose(){var n,s;cancelAnimationFrame(this.animationId);const t=this.renderer.domElement;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),t.removeEventListener("contextmenu",this.onContextMenu),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.nebula.dispose(),this.blackHole.dispose(),(n=this.neighbors)==null||n.dispose(),(s=this.neighborAtlas)==null||s.dispose(),this.galaxyRT.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}export{Oe as GalaxyScene};
