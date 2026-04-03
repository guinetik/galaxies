import{a2 as G,a3 as ct,a4 as X,a5 as e,a6 as _,a7 as P,a8 as W,a9 as V,aa as at,ab as rt,ac as Kt,ad as kt,ae as h,af as zt,ag as ut,ah as lt,ai as x,V as pt,aj as Ft,ak as $,al as H,am as nt,an as we,ao as _t,ap as tt,aq as Gt,ar as Re,as as ie,A as oe,r as le,at as ue,k as Jt,au as Pe,av as se,aw as Ce,ax as Be,ay as Le,d as ze,az as re,M as ce,aA as Ee,aB as me,aC as Fe,aD as ge,x as Ie,l as _e,aE as He,aF as Ne,aG as We,Q as $t,aH as Ve,aI as qe,f as Ue,n as Yt,S as ne,P as Xe,aJ as Ge}from"./three-CWiM2Iz1.js";import{m as pe}from"./morphologyMapper-DY_wjh1a.js";import{a as ke,l as Ye,d as Oe}from"./nsaMorphologyPointCloud-Ct5fnwAD.js";import{G as Me}from"./index-BzX7cb2b.js";import{d as je,c as Ze,a as Qe,r as fe,g as $e,b as Ke}from"./qualityDetect-DhuW2FJQ.js";import"./vue-vendor-BVmPiw82.js";const Je=8,ts=12,yt=.015;function es(n,t={}){const s=t.radialBinCount??Je,i=t.azimuthalBinCount??ts,o=ss(t.availability),a=Array.from({length:s},()=>({intensity:0,hot:0,stellar:0,dust:0,weight:0})),l=Array.from({length:i},()=>({intensity:0,weight:0}));let d=0,c=0,b=0,A=0,S=0;const u=(n.width-1)*.5,v=(n.height-1)*.5,y=Math.max(1,Math.hypot(u,v));for(let F=0;F<n.height;F+=1)for(let E=0;E<n.width;E+=1){const et=F*n.width+E,z=de(n,et,o);if(z.intensity<=yt)continue;const Y=E-u,j=F-v,N=K(Math.hypot(Y,j)/y),Z=Math.atan2(j,Y);d+=z.hot,c+=z.stellar,b+=z.dust,N<=.22&&(A+=z.intensity),N<=.85&&(S+=z.intensity);const Q=Math.min(s-1,Math.floor(N*s)),R=a[Q];if(R.intensity+=z.intensity,R.hot+=z.hot,R.stellar+=z.stellar,R.dust+=z.dust,R.weight+=1,N>=.2&&N<=.88){const k=Z<0?Z+Math.PI*2:Z,B=Math.min(i-1,Math.floor(k/(Math.PI*2)*i)),C=l[B];C.intensity+=z.intensity,C.weight+=1}}const p=as(d,c,b),r=a.map((F,E)=>is(F,E,s)),f=l.map((F,E)=>({angle:E/i*Math.PI*2,intensity:F.weight>0?F.intensity/F.weight:0})),m=S>0?K(A/S):0,M=os(n),w=rs(f.map(F=>F.intensity)),D=ls(n),I=ds(n,o),q=K((1-M)*.7+m*.3),U=K(p.dust*(.55+M*.35+w*.25));return{availability:o,globalColorBalance:p,concentration:m,armContrast:w,clumpiness:D,filamentarity:M,diskThicknessBias:q,dustLaneStrength:U,projectedAxisRatio:I.axisRatio,projectedAngle:I.angle,projectedStrength:I.strength,radialProfile:r,azimuthalProfile:f}}function ss(n){const t=["u","g","r","i","z","nuv"],s={u:!0,g:!0,r:!0,i:!0,z:!0,nuv:!0},i={u:!1,g:!1,r:!1,i:!1,z:!1,nuv:!1};for(const o of t)(n==null?void 0:n[o])==="fallback"&&(s[o]=!1,i[o]=!0);return{real:s,fallback:i}}function de(n,t,s){const i=Math.sqrt(K(n.bands.u[t]??0)),o=Math.sqrt(K(n.bands.g[t]??0)),a=Math.sqrt(K(n.bands.r[t]??0)),l=Math.sqrt(K(n.bands.i[t]??0)),d=Math.sqrt(K(n.bands.z[t]??0)),c=Math.sqrt(K(n.bands.nuv[t]??0)),b=s.real.u?1:0,A=s.real.i?1:0,S=s.real.z?1:0,u=s.real.nuv?1:0,v=b+u,y=v>0?(i*b+c*u)/v:ns(o,a),p=(o+a)*.5,r=A+S,f=r>0?(l*A+d*S)/r:0,m=f*.25+p*.4+y*.35;return{hot:y,stellar:p,dust:f,intensity:m}}function ns(n,t){return(n+t)*.5*.35}function as(n,t,s){const i=n+t+s;return i<=0?{hot:0,stellar:0,dust:0}:{hot:n/i,stellar:t/i,dust:s/i}}function is(n,t,s){return n.weight<=0?{radius:(t+.5)/s,intensity:0,hot:0,stellar:0,dust:0}:{radius:(t+.5)/s,intensity:n.intensity/n.weight,hot:n.hot/n.weight,stellar:n.stellar/n.weight,dust:n.dust/n.weight}}function os(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/64)),{field:s,w:i,h:o}=ke(n,t),a=Math.max(1,Math.min(3,Math.floor(Math.min(i,o)/12)));let l=0,d=0;for(let A=0;A<o;A+=1)for(let S=0;S<i;S+=1){const u=s[A*i+S];if(u<=yt)continue;const{F:v}=Ye(s,i,o,S,A,a);l+=v*u,d+=u}const c=d>0?K(l/d):0,b=cs(s,i,o);return K(c*.35+b*.65)}function ls(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/96)),{field:s,w:i,h:o}=ke(n,t);let a=0,l=0;for(let d=0;d<o;d+=1)for(let c=0;c<i;c+=1){const b=s[d*i+c];if(b<=yt)continue;let A=0,S=0;for(let v=-1;v<=1;v+=1)for(let y=-1;y<=1;y+=1){if(y===0&&v===0)continue;const p=Math.max(0,Math.min(i-1,c+y)),r=Math.max(0,Math.min(o-1,d+v));A+=s[r*i+p],S+=1}const u=S>0?A/S:b;a+=Math.max(b-u,0),l+=b}return l>0?K(a/l*3):0}function rs(n){const t=n.filter(o=>o>0);if(t.length===0)return 0;const s=t.reduce((o,a)=>o+a,0)/t.length;if(s<=1e-6)return 0;const i=t.reduce((o,a)=>{const l=a-s;return o+l*l},0)/t.length;return K(Math.sqrt(i)/s/2)}function cs(n,t,s){let i=0,o=0,a=0;for(let y=0;y<s;y+=1)for(let p=0;p<t;p+=1){const r=n[y*t+p];r<=yt||(i+=r,o+=p*r,a+=y*r)}if(i<=0)return 0;o/=i,a/=i;let l=0,d=0,c=0;for(let y=0;y<s;y+=1)for(let p=0;p<t;p+=1){const r=n[y*t+p];if(r<=yt)continue;const f=p-o,m=y-a;l+=f*f*r,d+=f*m*r,c+=m*m*r}l/=i,d/=i,c/=i;const b=l+c;if(b<=1e-6)return 0;const A=l*c-d*d,S=Math.sqrt(Math.max(0,b*b-4*A)),u=(b+S)*.5,v=(b-S)*.5;return K((u-v)/(u+v+1e-6))}function ds(n,t){let s=0,i=0,o=0;for(let p=0;p<n.height;p+=1)for(let r=0;r<n.width;r+=1){const f=p*n.width+r,m=de(n,f,t).intensity;m<=yt||(s+=m,i+=r*m,o+=p*m)}if(s<=0)return{axisRatio:1,angle:0,strength:0};i/=s,o/=s;let a=0,l=0,d=0;for(let p=0;p<n.height;p+=1)for(let r=0;r<n.width;r+=1){const f=p*n.width+r,m=de(n,f,t).intensity;if(m<=yt)continue;const M=r-i,w=p-o;a+=M*M*m,l+=M*w*m,d+=w*w*m}a/=s,l/=s,d/=s;const c=a+d;if(c<=1e-6)return{axisRatio:1,angle:0,strength:0};const b=a*d-l*l,A=Math.sqrt(Math.max(0,c*c-4*b)),S=Math.max((c+A)*.5,1e-6),u=Math.max((c-A)*.5,1e-6),v=K(Math.sqrt(u/S)),y=.5*Math.atan2(2*l,a-d);return{axisRatio:Math.max(v,.15),angle:us(y),strength:K((1-v)*1.35)}}function K(n){return Math.max(0,Math.min(1,n))}function us(n){const t=Math.PI,s=n%t;return s<0?s+t:s}async function hs(n){const t=await ms(n);if(!t)return null;const s=await gs(n,t);if(!(s!=null&&s.g)||!s.r||!s.i)return null;fs(s);const{input:i,availability:o}=vs(s),a=es(i,{availability:bs(o)});return{metadata:t,input:i,availability:o,profile:a}}async function ms(n){try{const t=await fetch(`${Me}/${n}/metadata.json`);return t.ok?await t.json():null}catch{return null}}async function gs(n,t){const s=ps(t),i=`${Me}/${n}/`,o=await Promise.all(s.map(async a=>{try{const l=await fetch(`${i}${a}.png`);if(!l.ok){if(a==="g"||a==="r"||a==="i")throw new Error(`Missing required NSA band: ${a}`);return[a,null]}const d=await l.arrayBuffer(),c=Oe(new Uint8Array(d)),b=c.depth===16?65535:255,A=new Float32Array(c.width*c.height);for(let S=0;S<A.length;S+=1)A[S]=c.data[S*c.channels]/b;return[a,{raw:A,width:c.width,height:c.height,range:t.data_ranges[a]??[0,1]}]}catch(l){if(a==="g"||a==="r"||a==="i")throw l;return[a,null]}})).catch(()=>null);return o?Object.fromEntries(o.filter(a=>a[1]!==null)):null}function ps(n){const t=["i","r","g"];return n.bands.includes("u")&&t.push("u"),n.bands.includes("z")&&t.push("z"),n.bands.includes("nuv")&&t.push("nuv"),t}function fs(n){const t=n.g;if(!t)return;const s=t.range[1]-t.range[0];for(const i of["u","z","nuv"]){const o=n[i];if(!o)continue;o.range[1]-o.range[0]<s*.01&&delete n[i]}}function vs(n){const t=a=>n[a]?a:a==="u"?"g":a==="z"?"i":n.u?"u":"g",s=n.i??n.g??n.r;if(!s)throw new Error("Cannot build point-cloud input without core NSA bands");const i={u:t("u"),g:t("g"),r:t("r"),i:t("i"),z:t("z"),nuv:t("nuv")},o={real:{u:i.u==="u",g:i.g==="g",r:i.r==="r",i:i.i==="i",z:i.z==="z",nuv:i.nuv==="nuv"},fallback:{u:i.u!=="u",g:!1,r:!1,i:!1,z:i.z!=="z",nuv:i.nuv!=="nuv"}};return{input:{width:s.width,height:s.height,bands:{u:wt(n[i.u]),g:wt(n[i.g]),r:wt(n[i.r]),i:wt(n[i.i]),z:wt(n[i.z]),nuv:wt(n[i.nuv])}},availability:o}}function wt(n){const[t,s]=n.range,i=s-t,o=new Float32Array(n.raw.length);let a=0;for(let l=0;l<n.raw.length;l+=1){const d=n.raw[l]*i+t,c=Math.max(d,0);o[l]=c,c>a&&(a=c)}if(a>0)for(let l=0;l<o.length;l+=1)o[l]/=a;return o}function bs(n){return{u:n.fallback.u?"fallback":"real",g:"real",r:"real",i:"real",z:n.fallback.z?"fallback":"real",nuv:n.fallback.nuv?"fallback":"real"}}const g=G(([n])=>{const t=ct(n.mul(.1031)),s=t.add(19.19);return ct(s.mul(s.add(47.43)).mul(t))}),dt=G(([n])=>{const t=ct(n.mul(P(.16532,.17369,.15787))).toVar();return t.addAssign(Kt(t,t.yzx.add(19.19))),ct(t.x.mul(t.y).mul(t.z))}),Ot=G(([n])=>ct(W(Kt(n,zt(2.31,53.21)).mul(124.123)).mul(412)));G(([n])=>{const t=kt(n),s=ct(n),i=s.mul(s).mul(e(3).sub(s.mul(2)));return h(h(Ot(t),Ot(t.add(zt(1,0))),i.x),h(Ot(t.add(zt(0,1))),Ot(t.add(zt(1,1))),i.x),i.y)});const ae=G(([n])=>{const t=kt(n),s=ct(n),i=s.mul(s).mul(e(3).sub(s.mul(2))),o=dt(t.add(P(0,0,0))),a=dt(t.add(P(1,0,0))),l=dt(t.add(P(0,1,0))),d=dt(t.add(P(1,1,0))),c=dt(t.add(P(0,0,1))),b=dt(t.add(P(1,0,1))),A=dt(t.add(P(0,1,1))),S=dt(t.add(P(1,1,1))),u=h(o,a,i.x),v=h(l,d,i.x),y=h(c,b,i.x),p=h(A,S,i.x),r=h(u,v,i.y),f=h(y,p,i.y);return h(r,f,i.z).mul(2).sub(1)});G(([n,t])=>at(n).sub(t));G(([n,t])=>{const s=zt(at(n.xz).sub(t.x),n.y);return at(s).sub(t.y)});const It=G(([n,t])=>{const s=W(t),i=V(t),o=n.x.mul(s).sub(n.z.mul(i)),a=n.x.mul(i).add(n.z.mul(s));return P(o,n.y,a)}),ft=G(([n,t,s])=>{const i=at(P(n.x,e(0),n.z)),o=e(20),a=_(i,o).div(o),l=e(1).div(rt(a,e(.35))),d=t.mul(l).mul(s).negate();return It(n,d)});G(([n,t,s,i,o,a])=>{const l=t.sub(n),d=at(l),c=s.mul(_(e(0),e(1).sub(d.div(o))));return ut(l).mul(i).mul(c).mul(a).negate()});G(([n,t,s,i])=>t.sub(n).mul(s).mul(i));const xs=G(([n,t,s])=>{const i=t.mul(X(s,e(1).sub(s))),o=ct(n.mul(12).add(0).div(12)).mul(12),a=ct(n.mul(12).add(8).div(12)).mul(12),l=ct(n.mul(12).add(4).div(12)).mul(12),d=s.sub(i.mul(_(X(X(o.sub(3),e(9).sub(o)),e(1)),e(-1)))),c=s.sub(i.mul(_(X(X(a.sub(3),e(9).sub(a)),e(1)),e(-1)))),b=s.sub(i.mul(_(X(X(l.sub(3),e(9).sub(l)),e(1)),e(-1))));return P(d,c,b)});function ys(n){return{positionBuffer:lt(n,"vec3"),originalPositionBuffer:lt(n,"vec3"),velocityBuffer:lt(n,"vec3"),colorBuffer:lt(n,"vec4"),sizeBuffer:lt(n,"float"),layerBuffer:lt(n,"float"),foregroundAlphaBuffer:lt(n,"float")}}function Ss(n){const t={numArms:x(0),armWidth:x(0),spiralTightness:x(0),spiralStart:x(0),bulgeRadius:x(0),fieldStarFraction:x(0),irregularity:x(0),barLength:x(0),barWidth:x(0),axisRatio:x(1),ellipticity:x(0),bulgeFraction:x(0),diskThickness:x(0),clumpCount:x(0),galaxyRadius:x(0),galaxySeed:x(0),bandArmScatterScale:x(1),bandBulgeBoost:x(0),bandClumpBoost:x(0),bandHotMix:x(.5),bandDustMix:x(.5),bandDiskThicknessScale:x(1),bandDustLaneStrength:x(0),coreWeight:x(1),midDiskWeight:x(1),outerDiskWeight:x(1),peakAzimuthAngleA:x(0),peakAzimuthAngleB:x(Math.PI),peakAzimuthStrength:x(0),projectedAxisRatio:x(1),projectedAngle:x(0),projectedStrength:x(0),time:x(0),deltaTime:x(.016),rotationSpeed:x(.033),mouse:x(new pt(0,0,0)),mouseActive:x(0),mouseForce:x(7),mouseRadius:x(n.galaxyRadius*.3)};return Te(t,n),t}function Te(n,t){const s=t.morphology,i=je(t.bandProfile);n.numArms.value=s.numArms,n.armWidth.value=s.armWidth*t.galaxyRadius,n.spiralTightness.value=s.spiralTightness,n.spiralStart.value=s.spiralStart,n.bulgeRadius.value=s.bulgeRadius*t.galaxyRadius,n.fieldStarFraction.value=s.fieldStarFraction,n.irregularity.value=s.irregularity,n.barLength.value=s.barLength*t.galaxyRadius,n.barWidth.value=s.barWidth*t.galaxyRadius,n.axisRatio.value=s.axisRatio,n.ellipticity.value=s.ellipticity,n.bulgeFraction.value=s.bulgeFraction,n.diskThickness.value=s.diskThickness,n.clumpCount.value=s.clumpCount,n.galaxyRadius.value=t.galaxyRadius,n.galaxySeed.value=t.starCount*.61803398875,n.bandArmScatterScale.value=i.armScatterScale,n.bandBulgeBoost.value=i.bulgeBoost,n.bandClumpBoost.value=i.clumpBoost,n.bandHotMix.value=i.hotMix,n.bandDustMix.value=i.dustMix,n.bandDiskThicknessScale.value=i.diskThicknessScale,n.bandDustLaneStrength.value=i.dustLaneStrength,n.coreWeight.value=i.coreWeight,n.midDiskWeight.value=i.midDiskWeight,n.outerDiskWeight.value=i.outerDiskWeight,n.peakAzimuthAngleA.value=i.peakAzimuthAngleA,n.peakAzimuthAngleB.value=i.peakAzimuthAngleB,n.peakAzimuthStrength.value=i.peakAzimuthStrength,n.projectedAxisRatio.value=i.projectedAxisRatio,n.projectedAngle.value=i.projectedAngle,n.projectedStrength.value=i.projectedStrength,n.mouseRadius.value=t.galaxyRadius*.3}const xt=6.28318530718;function Et(n,t){const s=tt(e(.18),e(.38),n),i=tt(e(.58),e(.82),n),o=h(t.coreWeight,t.midDiskWeight,s);return h(o,t.outerDiskWeight,i)}function As(n,t){const s=W(t.projectedAngle),i=V(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=h(e(1),t.projectedAxisRatio,t.projectedStrength),d=a.mul(l);return P(o.mul(s).sub(d.mul(i)),n.y,o.mul(i).add(d.mul(s)))}function ws(n,t,s){return G(()=>{const o=Ft,a=o.toFloat(),l=s.galaxyRadius,d=l.mul(.06),c=h(e(.55),e(.76),$(s.bandDustMix.add(s.bandDustLaneStrength.mul(.35)),e(0),e(1))),b=h(e(.02),e(.08),$(s.bandHotMix.mul(.7).add(s.bandClumpBoost.mul(.3)),e(0),e(1))),A=g(a.add(100)),S=e(0).toVar();H(A.greaterThan(e(1).sub(b)),()=>{S.assign(2)}).ElseIf(A.greaterThan(c),()=>{S.assign(1)}),t.layerBuffer.element(o).assign(S);const u=g(a.add(200)),v=e(0).toVar();H(S.equal(0),()=>{v.assign(u.mul(1.5).add(.8).mul(h(e(.95),e(1.35),s.bandDustMix)))}).ElseIf(S.equal(1),()=>{v.assign(u.mul(3).add(1.5))}).Else(()=>{v.assign(u.mul(6).add(4).mul(h(e(.9),e(1.4),s.bandHotMix)))}),t.sizeBuffer.element(o).assign(v);const y=g(a.add(300)),p=g(a.add(400)),r=e(0).toVar(),f=e(0).toVar();H(S.equal(0),()=>{r.assign(y.mul(.16).add(.08).mul(h(e(.9),e(1.35),s.bandDustMix))),f.assign(p.mul(.2).add(.12).mul(h(e(.9),e(1.2),s.bandDustLaneStrength)))}).ElseIf(S.equal(1),()=>{r.assign(y.mul(.4).add(.32).mul(h(e(.95),e(1.15),s.bandHotMix))),f.assign(p.mul(.4).add(.4))}).Else(()=>{r.assign(y.mul(.16).add(.64).mul(h(e(.95),e(1.25),s.bandHotMix))),f.assign(p.mul(.24).add(.56).mul(h(e(.95),e(1.2),s.bandClumpBoost)))});const m=e(0).toVar(),M=e(0).toVar(),w=e(0).toVar(),D=e(0).toVar(),I=e(-1).toVar(),q=e(1).toVar(),U=e(0).toVar();H(s.numArms.greaterThan(0),()=>{const R=g(a.add(500)),k=s.bulgeRadius,B=X(e(.25),e(.1).add(e(.2).mul(k.div(l)))),C=s.fieldStarFraction;H(R.lessThan(B),()=>{I.assign(0);const T=rt(g(a.add(10)),e(.6)).mul(k),L=g(a.add(11)).mul(xt),O=g(a.add(12)).sub(.5).mul(k).mul(.5);m.assign(W(L).mul(T)),M.assign(O),w.assign(V(L).mul(T)),D.assign(T.div(k).mul(.3)),q.assign(s.coreWeight)}).ElseIf(R.lessThan(B.add(C)),()=>{I.assign(1);const T=nt(g(a.add(20))).mul(l),L=g(a.add(21)).mul(xt),O=g(a.add(22)).sub(.5).mul(l).mul(.08);m.assign(W(L).mul(T)),M.assign(O),w.assign(V(L).mul(T)),D.assign(T.div(l)),q.assign(Et(D,s))}).Else(()=>{I.assign(2);const T=s.numArms,O=kt(g(a.add(30)).mul(T)).mul(xt).div(T),J=_(s.spiralStart.mul(l),e(.001)),it=s.barLength.mul(.5),st=X(_(J,it),l.mul(.98)),ot=g(a.add(31)),ht=nt(ot.mul(l.mul(l).sub(st.mul(st))).add(st.mul(st))),Mt=ht.div(l),vt=Et(Mt,s);q.assign(vt);const Tt=e(2.5),mt=_(ht.div(J),e(1)).log().div(_(s.spiralTightness,e(.001))).mul(Tt),bt=ht.div(l).mul(.5).add(.5),Dt=g(a.add(32)).sub(.5).add(g(a.add(33)).sub(.5)).mul(s.armWidth).mul(bt).mul(s.bandArmScatterScale),Ht=s.irregularity.mul(g(a.add(35)).sub(.5)).mul(30),Nt=g(a.add(34)).sub(.5).mul(.3),gt=mt.add(O).add(Nt),Rt=W(gt.sub(s.peakAzimuthAngleA)).mul(.5).add(.5),Pt=W(gt.sub(s.peakAzimuthAngleB)).mul(.5).add(.5),St=_(Rt,Pt);U.assign(St);const te=V(s.peakAzimuthAngleA.sub(gt)).mul(Rt).add(V(s.peakAzimuthAngleB.sub(gt)).mul(Pt)).mul(s.peakAzimuthStrength).mul(.22),Ct=gt.add(te),Wt=Ct.add(e(Math.PI/2)),Vt=h(e(.86),e(1.18),$(vt.sub(.55).div(1.3),e(0),e(1))),Bt=$(ht.mul(Vt),st,l),qt=Dt.mul(h(e(1.3),e(.42),St.mul(s.peakAzimuthStrength))),At=W(Ct).mul(Bt.add(Ht)).add(W(Wt).mul(qt)),Lt=V(Ct).mul(Bt.add(Ht)).add(V(Wt).mul(qt)),Ut=Bt.div(l),ee=l.mul(.06).mul(e(1).sub(Ut.mul(.7))).mul(s.bandDiskThicknessScale),Xt=g(a.add(36)).sub(.5).mul(ee);m.assign(At),M.assign(Xt),w.assign(Lt);const he=nt(At.mul(At).add(Lt.mul(Lt)));D.assign(he.div(l))}),H(s.barLength.greaterThan(0),()=>{const T=g(a.add(600));H(T.lessThan(.25),()=>{const L=s.barLength,O=s.barWidth,J=g(a.add(40)).sub(.5).mul(2).mul(L),it=g(a.add(41)).sub(.5).mul(O);m.assign(J),M.assign(g(a.add(42)).sub(.5).mul(l).mul(.04)),w.assign(it),D.assign(e(.1))})})}),H(s.numArms.equal(0).and(s.barLength.equal(0)).and(s.clumpCount.equal(0)).and(s.ellipticity.equal(0)).and(s.bulgeFraction.greaterThan(0)),()=>{const R=s.bulgeRadius,k=rt(g(a.add(10)),e(.55)).mul(l),B=g(a.add(11)).mul(xt),C=k.div(l),T=l.mul(.06).mul(rt(_(e(1).sub(C),e(0)),e(2))).mul(s.bandDiskThicknessScale),L=g(a.add(12)).sub(.5).mul(T);m.assign(W(B).mul(k)),M.assign(L),w.assign(V(B).mul(k));const O=$(e(1).sub(k.div(_(R,e(1)))),e(0),e(1)),J=e(1).add(O.mul(.4)).add(s.bandBulgeBoost.mul(.25));r.assign(X(r.mul(J),e(.95))),f.assign(X(f.mul(J),e(.95))),v.assign(v.mul(e(1).add(O.mul(.3)))),D.assign(C.mul(.2)),q.assign(Et(C,s))}),H(s.ellipticity.greaterThan(0),()=>{const R=s.axisRatio,k=rt(g(a.add(10)),e(.4)).mul(l),B=g(a.add(11)).mul(xt),C=k.mul(W(B)),T=k.mul(V(B)).mul(R),L=nt(C.mul(C).add(T.mul(T))).div(l),O=g(a.add(12)).sub(.5).mul(l).mul(.1).mul(e(1).sub(L.mul(.5)));m.assign(C),M.assign(O),w.assign(T),D.assign(L),q.assign(Et(L,s))}),H(s.clumpCount.greaterThan(0),()=>{const R=s.irregularity,k=s.clumpCount,B=g(a.add(500));H(B.greaterThan(R),()=>{const C=kt(g(a.add(50)).mul(k)),T=C.div(k).mul(xt).add(g(C.add(1e3)).mul(.5)),L=g(C.add(2e3)).mul(.6).add(.2).mul(l),O=W(T).mul(L),J=V(T).mul(L),it=g(C.add(3e3)).mul(80).add(30).mul(h(e(1.05),e(.7),s.bandClumpBoost)),st=g(a.add(51)).sub(.5).add(g(a.add(52)).sub(.5)).mul(2),ot=g(a.add(53)).sub(.5).add(g(a.add(54)).sub(.5)).mul(2);m.assign(O.add(st.mul(it))),w.assign(J.add(ot.mul(it)))}).Else(()=>{const C=g(a.add(60)).mul(xt),T=nt(g(a.add(61))).mul(l);m.assign(W(C).mul(T).add(g(a.add(62)).sub(.5).mul(60))),w.assign(V(C).mul(T).add(g(a.add(63)).sub(.5).mul(60)))}),M.assign(g(a.add(70)).sub(.5).mul(l).mul(.12)),D.assign(nt(m.mul(m).add(w.mul(w))).div(l)),q.assign(Et(D,s))}),H(I.equal(0),()=>{const R=h(e(1),s.coreWeight.mul(.55).add(.45),s.bandBulgeBoost);r.assign(X(r.mul(R),e(.98))),f.assign(X(f.mul(R),e(.98))),v.assign(v.mul(h(e(1),e(1.35),s.bandBulgeBoost)))}).ElseIf(I.equal(1),()=>{const R=h(e(1),e(.62),s.peakAzimuthStrength);r.assign(r.mul(R)),f.assign(f.mul(h(e(1),e(.8),s.peakAzimuthStrength)))}).ElseIf(I.equal(2),()=>{const R=h(e(.72),e(1.48),U.mul(s.peakAzimuthStrength)),k=h(e(.78),e(1.34),$(q.sub(.55).div(1.3),e(0),e(1)));r.assign(X(r.mul(R).mul(k),e(.98))),f.assign(X(f.mul(R),e(.98))),v.assign(v.mul(h(e(.92),e(1.4),U.mul(s.peakAzimuthStrength))))});const F=As(P(m,M,w),s);m.assign(F.x),M.assign(F.y),w.assign(F.z),D.assign(X(nt(m.mul(m).add(w.mul(w))).div(l),e(1)));const E=nt(m.mul(m).add(w.mul(w)));H(E.lessThan(d),()=>{const R=we(w,m),k=d.add(g(a.add(800)).mul(l.mul(.1)));m.assign(W(R).mul(k)),w.assign(V(R).mul(k))});const et=P(m,M,w);t.positionBuffer.element(o).assign(et),t.originalPositionBuffer.element(o).assign(et);const z=g(a.add(900)),Y=g(a.add(901)),j=e(0).toVar(),N=e(0).toVar(),Z=e(0).toVar();H(S.equal(0),()=>{j.assign(z.mul(.111).add(.667)),N.assign(.3),Z.assign(r.mul(.4))}).ElseIf(S.equal(2),()=>{H(z.lessThan(e(.6)),()=>{j.assign(z.div(.6).mul(.097).add(.028)),N.assign(.5)}).Else(()=>{j.assign(z.sub(.6).div(.4).mul(.083).add(.556)),N.assign(.35)}),Z.assign(r.mul(.85))}).Else(()=>{const R=rt($(D,e(0),e(1)),e(.6)),k=s.bandHotMix.sub(s.bandDustMix).mul(.16),B=$(h(e(.58),e(.3),R).sub(k),e(.12),e(.8)),C=$(h(e(.78),e(.45),R).sub(k.mul(.75)),e(.22),e(.9)),T=$(h(e(.88),e(.55),R).sub(k.mul(.45)),e(.35),e(.96)),L=$(h(e(.93),e(.65),R).sub(k.mul(.25)),e(.45),e(.98)),O=$(h(e(.98),e(.87),R).sub(k.mul(.1)),e(.7),e(.995));H(z.lessThan(B),()=>{j.assign(e(.028).add(Y.sub(.5).mul(.022))),N.assign(.85)}).ElseIf(z.lessThan(C),()=>{j.assign(e(.069).add(Y.sub(.5).mul(.022))),N.assign(.6)}).ElseIf(z.lessThan(T),()=>{j.assign(e(.133).add(Y.sub(.5).mul(.014))),N.assign(.22)}).ElseIf(z.lessThan(L),()=>{j.assign(e(.153).add(Y.sub(.5).mul(.011))),N.assign(.12)}).ElseIf(z.lessThan(O),()=>{j.assign(e(.597).add(Y.sub(.5).mul(.042))),N.assign(.25)}).Else(()=>{j.assign(e(.625).add(Y.sub(.5).mul(.028))),N.assign(.45)}),Z.assign(r.mul(.6))});const Q=xs(j,N,Z);t.colorBuffer.element(o).assign(_t(Q.x,Q.y,Q.z,f)),t.velocityBuffer.element(o).assign(P(0,0,0))})().compute(n)}function zs(n,t,s){return G(()=>{const o=Ft,a=t.positionBuffer.element(o).toVar(),l=t.originalPositionBuffer.element(o);H(s.barLength.greaterThan(0),()=>{const c=at(P(a.x,e(0),a.z)),b=s.rotationSpeed.mul(s.deltaTime).negate();H(c.lessThan(s.barLength),()=>{a.assign(It(a,b)),t.originalPositionBuffer.element(o).assign(It(l,b))}).Else(()=>{a.assign(ft(a,s.rotationSpeed,s.deltaTime)),t.originalPositionBuffer.element(o).assign(ft(l,s.rotationSpeed,s.deltaTime))})}).Else(()=>{const c=ft(a,s.rotationSpeed,s.deltaTime);a.assign(c),t.originalPositionBuffer.element(o).assign(ft(l,s.rotationSpeed,s.deltaTime))}),t.positionBuffer.element(o).assign(a);const d=t.layerBuffer.element(o);H(d.equal(2),()=>{const c=t.colorBuffer.element(o),b=o.toFloat().mul(.7831),A=V(s.time.mul(2).add(b)).mul(.15).add(.85),S=c.w;t.colorBuffer.element(o).w.assign(S.mul(A))})})().compute(n)}function ks(){return{mvpRow0:x(new Gt),mvpRow1:x(new Gt),mvpRow3:x(new Gt),viewZRow:x(new Gt),bhViewZ:x(0),bhNdcX:x(0),bhNdcY:x(0),ndcRadiusX:x(.04),ndcRadiusY:x(.04),depthThreshold:x(6),depthSoftness:x(10)}}function Ms(n,t,s){return G(()=>{const o=Ft,a=t.positionBuffer.element(o),l=s.mvpRow0,d=s.mvpRow1,c=s.mvpRow3,b=s.viewZRow,A=l.x.mul(a.x).add(l.y.mul(a.y)).add(l.z.mul(a.z)).add(l.w),S=d.x.mul(a.x).add(d.y.mul(a.y)).add(d.z.mul(a.z)).add(d.w),u=c.x.mul(a.x).add(c.y.mul(a.y)).add(c.z.mul(a.z)).add(c.w),v=b.x.mul(a.x).add(b.y.mul(a.y)).add(b.z.mul(a.z)).add(b.w),y=e(1).div(_(u,e(1e-4))),p=A.mul(y),r=S.mul(y),f=p.sub(s.bhNdcX).div(s.ndcRadiusX),m=r.sub(s.bhNdcY).div(s.ndcRadiusY),M=e(1).sub(tt(e(.75),e(1.25),nt(f.mul(f).add(m.mul(m))))),w=tt(s.depthThreshold,s.depthThreshold.add(s.depthSoftness),v.sub(s.bhViewZ));t.foregroundAlphaBuffer.element(o).assign(M.mul(w))})().compute(n)}class Ts{constructor(t,s,i){const o=s.positionBuffer.toAttribute(),a=s.colorBuffer.toAttribute(),l=s.sizeBuffer.toAttribute(),d=s.foregroundAlphaBuffer.toAttribute(),c=Math.sqrt(6e4/t),b=i*.003*c,A=Ze();this.glowTexture=A;const S=Re(A),u=v=>{const y=S.sample(ue()),p=a.w.mul(y.w).mul(v),r=h(P(a.x,a.y,a.z).mul(1.32),P(1,1,1),e(.12)),f=h(r,P(1,1,1),e(.92)),m=r.mul(y.x).add(f.mul(y.y.mul(1.35)));return _t(m.mul(p),p)};this.material=new ie,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=oe,this.material.positionNode=o,this.material.scaleNode=l.mul(b),this.material.colorNode=u(e(1).sub(d)),this.sprite=new le(this.material),this.sprite.count=t,this.sprite.frustumCulled=!1,this.foregroundMaterial=new ie,this.foregroundMaterial.transparent=!0,this.foregroundMaterial.depthWrite=!1,this.foregroundMaterial.blending=oe,this.foregroundMaterial.positionNode=o,this.foregroundMaterial.scaleNode=l.mul(b),this.foregroundMaterial.colorNode=u(d),this.foregroundSprite=new le(this.foregroundMaterial),this.foregroundSprite.count=t,this.foregroundSprite.frustumCulled=!1,this.foregroundSprite.renderOrder=2}dispose(){this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}const Ds=G(([n])=>{const t=_(n.r,_(n.g,n.b)),s=X(n.r,X(n.g,n.b)),i=t.sub(s),o=tt(e(.06),e(.3),i).mul(e(1).sub(tt(e(.28),e(.95),t)));return rt(_(n,P(0)),P(1.14,1.14,1.14)).mul(h(e(.9),e(.45),o)).mul(P(1.06,.93,.82))});class Rs{constructor(t,s,i,o,a,l=1){this.uBHScreenPos=x(new Jt(.5,.5)),this.uLensStrength=x(0),this.uAspectRatio=x(1),this.postProcessing=new Pe(t);const c=se(s,a).getTextureNode(),A=se(i,a).getTextureNode(),u=se(o,a).getTextureNode(),v=this.uBHScreenPos,y=this.uLensStrength,p=this.uAspectRatio,f=G(()=>{const w=Ce.toVar(),D=v.sub(w).toVar();D.x.mulAssign(p);const I=at(D),q=D.div(_(I,e(1e-4))),U=$(y.div(.03),e(0),e(1)),F=h(e(.25),e(.55),U),E=tt(F,e(0),I).toVar();E.mulAssign(E);const et=h(e(.012),e(.05),U),z=tt(et,et.mul(2.8),I),Y=_(I,h(e(.028),e(.04),U)),j=y.mul(E).mul(z).mul(h(e(.15),e(.3),U).div(Y)),N=q.mul(j).toVar();N.x.divAssign(p);const Z=$(w.add(N),e(0),e(1)),Q=c.sample(Z).toVar();Q.rgb.assign(Ds(Q.rgb));const R=h(e(.024),e(.09),U),k=h(e(.008),e(.024),U),C=Be(rt(I.sub(R).div(k),e(2)).negate()).mul(E).mul(z).mul(y).mul(h(e(10),e(16),U));return Q.rgb.addAssign(P(.72,.62,.46).mul(C.mul(.02))),Q})();this.bloomPassNode=Le(c),this.bloomPassNode.threshold.value=.2,this.bloomPassNode.strength.value=.12,this.bloomPassNode.radius.value=.08,l<1&&(this.bloomPassNode.threshold.value=.35);const m=f.add(this.bloomPassNode),M=G(()=>{const w=m,D=A,I=u,U=h(w.rgb,D.rgb.mul(P(1.05,.95,.84)),D.a).add(I.rgb),F=_(w.a,_(D.a,I.a));return _t(X(U,e(1)),F)});this.postProcessing.outputNode=M()}render(){this.postProcessing.render()}updateBloom(t,s,i){this.bloomPassNode.strength.value=t,this.bloomPassNode.radius.value=s,this.bloomPassNode.threshold.value=i}updateLensing(t,s,i){this.uBHScreenPos.value.copy(t),this.uLensStrength.value=s,this.uAspectRatio.value=i}dispose(){}}const jt=6.28318530718,Ps=3e4;function Cs(n){return n==="mobile"?1e4:Ps}function Zt(n,t){const s=tt(e(.18),e(.38),n),i=tt(e(.58),e(.82),n),o=h(t.coreWeight,t.midDiskWeight,s);return h(o,t.outerDiskWeight,i)}function Bs(n,t){const s=W(n.sub(t.peakAzimuthAngleA)).mul(.5).add(.5),i=W(n.sub(t.peakAzimuthAngleB)).mul(.5).add(.5);return _(s,i)}function Ls(n,t){const s=W(t.projectedAngle),i=V(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=h(e(1),t.projectedAxisRatio,t.projectedStrength),d=a.mul(l);return P(o.mul(s).sub(d.mul(i)),n.y,o.mul(i).add(d.mul(s)))}class Es{constructor(t,s,i){const o=Cs(i);this.positionBuffer=lt(o,"vec3"),this.originalPositionBuffer=lt(o,"vec3"),this.colorBuffer=lt(o,"vec3"),this.sizeBuffer=lt(o,"float");const a=this.positionBuffer,l=this.originalPositionBuffer,d=this.colorBuffer,c=this.sizeBuffer;this.computeInit=G(()=>{const p=Ft,r=p.toFloat().add(1e4),f=t.galaxyRadius,m=e(0).toVar(),M=e(0).toVar(),w=e(0).toVar(),D=e(0).toVar(),I=e(1).toVar(),q=e(0).toVar();H(t.numArms.greaterThan(0),()=>{const k=g(r.add(1)),B=_(t.spiralStart.mul(f),e(.001)),C=t.barLength.mul(.5),T=X(_(B,C),f.mul(.98)),L=nt(k.mul(f.mul(f).sub(T.mul(T))).add(T.mul(T)));D.assign(L.div(f)),I.assign(Zt(D,t));const J=kt(g(r.add(2)).mul(t.numArms)).mul(jt).div(t.numArms),it=e(2.5),st=_(L.div(B),e(1)).log().div(_(t.spiralTightness,e(.001))).mul(it),ot=J.add(st),ht=Bs(ot,t);q.assign(ht);const Mt=V(t.peakAzimuthAngleA.sub(ot)).mul(W(ot.sub(t.peakAzimuthAngleA)).mul(.5).add(.5)).add(V(t.peakAzimuthAngleB.sub(ot)).mul(W(ot.sub(t.peakAzimuthAngleB)).mul(.5).add(.5))).mul(t.peakAzimuthStrength).mul(.26),vt=ot.add(Mt),Tt=g(r.add(3)).sub(.5).mul(h(e(.2),e(.035),q.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))),mt=g(r.add(4)).sub(.5).mul(t.armWidth).mul(h(e(.55),e(.12),q.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))).mul(h(e(.85),e(1.18),X(I,e(1.25)).sub(.25))),bt=vt.add(Tt);m.assign(W(bt).mul(L.add(mt))),w.assign(V(bt).mul(L.add(mt)));const Dt=e(1).sub(D).add(.15).mul(t.bandDiskThicknessScale);M.assign(g(r.add(5)).sub(.5).mul(f.mul(.03)).mul(Dt))}),H(t.numArms.equal(0).and(t.barLength.equal(0)).and(t.clumpCount.equal(0)).and(t.ellipticity.equal(0)).and(t.bulgeFraction.greaterThan(0)),()=>{const k=rt(g(r.add(1)),e(.5)).mul(f),B=g(r.add(2)).mul(jt);D.assign(k.div(f)),I.assign(Zt(D,t)),m.assign(W(B).mul(k)),w.assign(V(B).mul(k));const C=f.mul(.03).mul(e(1).sub(D.mul(.5))).mul(t.bandDiskThicknessScale);M.assign(g(r.add(5)).sub(.5).mul(C))}),H(t.ellipticity.greaterThan(0),()=>{const k=t.axisRatio,B=rt(g(r.add(1)),e(.4)).mul(f),C=g(r.add(2)).mul(jt),T=B.mul(W(C)),L=B.mul(V(C)).mul(k);D.assign(nt(T.mul(T).add(L.mul(L))).div(f)),I.assign(Zt(D,t)),m.assign(T),w.assign(L),M.assign(g(r.add(5)).sub(.5).mul(f).mul(.08).mul(e(1).sub(D.mul(.5))))}),H(t.clumpCount.greaterThan(0),()=>{const k=t.clumpCount,B=kt(g(r.add(2)).mul(k)),C=B.div(k).mul(jt).add(g(B.add(5e3)).mul(.5)),T=g(B.add(6e3)).mul(.6).add(.2).mul(f),L=W(C).mul(T),O=V(C).mul(T),J=g(B.add(7e3)).mul(80).add(30),it=g(r.add(3)).sub(.5).add(g(r.add(4)).sub(.5)).mul(2),st=g(r.add(7)).sub(.5).add(g(r.add(8)).sub(.5)).mul(2);m.assign(L.add(it.mul(J))),w.assign(O.add(st.mul(J))),D.assign(nt(m.mul(m).add(w.mul(w))).div(f)),I.assign(Zt(D,t)),M.assign(g(r.add(5)).sub(.5).mul(f).mul(.1))});const U=Ls(P(m,M,w),t);m.assign(U.x),M.assign(U.y),w.assign(U.z),D.assign(X(nt(m.mul(m).add(w.mul(w))).div(f),e(1)));const F=P(m,M,w);a.element(p).assign(F),l.element(p).assign(F);const E=P(.62,.7,.9),et=P(.92,.76,.62),z=h(E,et,t.bandDustMix),Y=h(e(.7),e(1),t.bandDustLaneStrength),j=h(e(.58),e(1.3),q.mul(t.peakAzimuthStrength)),N=h(e(.72),e(1.22),X(I,e(1.3)).sub(.3)),Z=z.mul(e(.72).sub(D.mul(.28))).mul(Y).mul(j).mul(N);d.element(p).assign(Z);const Q=e(1).sub(D.mul(.5)).mul(h(e(.9),e(1.15),t.bandDustLaneStrength)),R=g(r.add(6)).mul(.5).add(.7).mul(Q).mul(h(e(.8),e(1.35),q.mul(t.peakAzimuthStrength)));c.element(p).assign(R)})().compute(o),this.computeUpdate=G(()=>{const p=Ft,r=a.element(p).toVar(),f=l.element(p);H(t.barLength.greaterThan(0),()=>{const m=at(P(r.x,e(0),r.z)),M=t.rotationSpeed.mul(t.deltaTime).negate();H(m.lessThan(t.barLength),()=>{r.assign(It(r,M)),l.element(p).assign(It(f,M))}).Else(()=>{r.assign(ft(r,t.rotationSpeed,t.deltaTime)),l.element(p).assign(ft(f,t.rotationSpeed,t.deltaTime))})}).Else(()=>{r.assign(ft(r,t.rotationSpeed,t.deltaTime)),l.element(p).assign(ft(f,t.rotationSpeed,t.deltaTime))}),a.element(p).assign(r)})().compute(o),this.material=new ie,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=oe;const b=a.toAttribute(),A=d.toAttribute(),S=c.toAttribute();this.material.positionNode=b;const u=G(()=>{const p=ue().sub(.5).mul(2),r=at(p),f=tt(1,0,r).mul(tt(1,.3,r));return _t(A.x,A.y,A.z,f.mul(.015))})();this.material.colorNode=u;const v=Math.sqrt(6e4/o),y=s*.006*v;this.material.scaleNode=S.mul(y),this.sprite=new le(this.material),this.sprite.count=o,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-1}dispose(){this.material.dispose()}}class Fs{constructor(t=60,s=1){this.uTime=x(0),this.uTiltX=x(0),this.uRotY=x(0),this.uLOD=x(0),this.quadSize=t;const i=new ze(1,4,4),o=new re({visible:!1});this.depthMesh=new ce(i,o);const a=this.uTime,l=this.uTiltX,d=this.uRotY,c=this.uLOD,b=G(()=>{const S=ue().sub(.5).mul(2),u=at(S);H(u.greaterThan(1),()=>{Ee()});const v=P(0,-.1,0),y=e(2),p=d,r=l.add(1.2),f=P(y.mul(W(p)).mul(V(r)),y.mul(W(r)),y.mul(V(p)).mul(V(r))),m=ut(v.sub(f)),M=ut(me(ut(P(0,1,-.1)),m)),w=ut(me(m,M)),D=ut(m.mul(1.5).add(M.mul(S.x)).add(w.mul(S.y))),I=e(.13),q=e(.3),U=e(.04),F=s<1?.024:.018,E=s<1?.016:.012,et=h(e(F),e(E),c),z=f.toVar(),Y=D.toVar();z.addAssign(Y.mul(dt(D.add(a)).mul(.01)));const j=h(e(.3),e(1),c),N=h(e(.005),e(.02),c);h(e(.1),e(.5),c);const Z=P(0,0,0).toVar(),Q=e(0).toVar(),R=e(0).toVar(),k=P(1,.55,.12),B=P(1,.3,.03),C=P(.45,.1,.01),T=P(.25,.15,.05),L=a.mul(N).mul(30);Fe(200,()=>{const it=ut(z),st=at(z),ot=et.mul(q).div(_(st.mul(st),e(.001))),ht=it.mul(ot),Mt=ut(Y.sub(ht)),vt=Y.mul(et);z.addAssign(vt);const Tt=at(z);H(Tt.lessThan(I),()=>{R.assign(1),ge()});const mt=at(zt(z.x,z.z)),bt=z.y.div(U),Dt=_(e(0),e(1).sub(bt.mul(bt))),Ht=tt(e(1.3),e(.16),mt),Nt=Dt.mul(Ht),gt=mt.mul(4.27).sub(L),Rt=W(gt),Pt=V(gt),St=P(z.x.mul(Rt).sub(z.z.mul(Pt)),z.y.mul(8),z.x.mul(Pt).add(z.z.mul(Rt))).mul(14),te=ae(St).mul(.5).add(.5),Ct=ae(St.mul(2.03)).mul(.5).add(.5),Wt=ae(St.mul(4.01)).mul(.5).add(.5),Vt=te.mul(.25).add(Ct.mul(.12)).add(Wt.mul(.06)).add(.55),Bt=we(z.x.negate(),z.z.negate()),qt=e(1).add(W(Bt.add(L)).mul(.7)),At=$(mt.add(Vt.sub(.5).mul(.4)),e(0),e(1)),Lt=h(h(k,B,tt(e(.05),e(.425),At)),C,tt(e(.425),e(1),At)),Ut=_(Vt,e(.3)),ee=Lt.mul(Ut).mul(qt).mul(3).add(T.mul(Nt).mul(2)),Xt=Nt.mul($(Ut.mul(2),e(0),e(1))),De=e(1).sub(Q).mul(Xt);Z.assign(h(Z,ee,De)),Q.assign($(h(Q,e(1),Xt),e(0),e(1))),z.addAssign(vt),Y.assign(Mt),H(Kt(z,z).greaterThan(16).and(Kt(Y,z).greaterThan(0)),()=>{ge()})}),Z.mulAssign(j);const O=e(1).sub(tt(e(.3),e(1),u));Z.mulAssign(O);const J=_(Q.mul(O),R);return _t(Z,J)}),A=new re;A.transparent=!0,A.depthWrite=!1,A.side=Ie,A.fragmentNode=b(),this.mesh=new ce(new _e(1,1),A),this.mesh.scale.set(t,t,1),this.mesh.renderOrder=1}update(t,s,i,o,a,l){this.uTime.value=t,this.uTiltX.value=s,this.uRotY.value=i,this.mesh.quaternion.copy(o.quaternion);const d=o.position.length(),b=(o.fov??60)*Math.PI/180,A=a.y*l,S=this.quadSize/d*(A/(2*Math.tan(b/2)));this.uLOD.value=Math.min(Math.max((S-6)/220,0),1)}getLOD(){return this.uLOD.value}dispose(){this.mesh.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const Is=`// ─── Hash functions ────────────────────────────────────────────────────────

fn seedHash(seed: f32) -> f32 {
  var p3 = fract(vec3<f32>(seed) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 = p3 + vec3<f32>(dot(p3, p3.yzx + vec3<f32>(33.33)));
  return fract((p3.x + p3.y) * p3.z);
}

fn hash33(p_in: vec3<f32>) -> vec3<f32> {
  var p = fract(p_in * vec3<f32>(0.1031, 0.1030, 0.0973));
  p = p + vec3<f32>(dot(p, p.yxz + vec3<f32>(33.33)));
  return fract((p.xxy + p.yxx) * p.zyx);
}

// ─── Simplex noise 3D ─────────────────────────────────────────────────────

fn mod289_3(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_4(x: vec4<f32>) -> vec4<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute_4(x: vec4<f32>) -> vec4<f32> {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

fn taylorInvSqrt_4(r: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(1.79284291400159) - 0.85373472095314 * r;
}

fn snoise3D(v: vec3<f32>) -> f32 {
  let Cx = 1.0 / 6.0;
  let Cy = 1.0 / 3.0;

  var i = floor(v + vec3<f32>(dot(v, vec3<f32>(Cy))));
  let x0 = v - i + vec3<f32>(dot(i, vec3<f32>(Cx)));

  let g = step(x0.yzx, x0.xyz);
  let l = vec3<f32>(1.0) - g;
  let i1 = min(g, l.zxy);
  let i2 = max(g, l.zxy);

  let x1 = x0 - i1 + vec3<f32>(Cx);
  let x2 = x0 - i2 + vec3<f32>(Cy);
  let x3 = x0 - vec3<f32>(0.5);

  i = mod289_3(i);
  let p = permute_4(permute_4(permute_4(
              i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));

  let n_ = 0.142857142857;
  // D = vec4(0, 0.5, 1, 2) → D.wyz = vec3(2, 0.5, 1), D.xzx = vec3(0, 1, 0)
  let ns = n_ * vec3<f32>(2.0, 0.5, 1.0) - vec3<f32>(0.0, 1.0, 0.0);

  let j = p - 49.0 * floor(p * ns.z * ns.z);
  let x_v = floor(j * ns.z);
  let y_v = floor(j - 7.0 * x_v);

  let xr = x_v * ns.x + vec4<f32>(ns.y);
  let yr = y_v * ns.x + vec4<f32>(ns.y);
  let h = vec4<f32>(1.0) - abs(xr) - abs(yr);

  let b0 = vec4<f32>(xr.xy, yr.xy);
  let b1 = vec4<f32>(xr.zw, yr.zw);

  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4<f32>(0.0));

  let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw * sh.zzww;

  let p0 = vec3<f32>(a0.xy, h.x);
  let p1 = vec3<f32>(a0.zw, h.y);
  let p2 = vec3<f32>(a1.xy, h.z);
  let p3 = vec3<f32>(a1.zw, h.w);

  let norm = taylorInvSqrt_4(vec4<f32>(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  let p0n = p0 * norm.x;
  let p1n = p1 * norm.y;
  let p2n = p2 * norm.z;
  let p3n = p3 * norm.w;

  var m = max(vec4<f32>(0.6) - vec4<f32>(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4<f32>(0.0));
  m = m * m;

  return 42.0 * dot(m * m, vec4<f32>(dot(p0n, x0), dot(p1n, x1), dot(p2n, x2), dot(p3n, x3)));
}

// ─── FBM ──────────────────────────────────────────────────────────────────

fn fbm3D(p_in: vec3<f32>, octaves: i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  var p = p_in;
  let shift = vec3<f32>(100.0);

  for (var i = 0; i < 8; i = i + 1) {
    if (i >= octaves) { break; }
    value = value + amplitude * snoise3D(p * frequency);
    p = p + shift;
    frequency = frequency * 2.0;
    amplitude = amplitude * 0.5;
  }
  return value;
}

// ─── Spiral noise ─────────────────────────────────────────────────────────

fn spiralNoise(p_in: vec3<f32>, seed: f32) -> f32 {
  let normalizer = 1.0 / sqrt(10.0); // 1 + NUDGE^2 = 10
  var n = 1.5 - seed * 0.5;
  var it = 2.0;
  var p = p_in;

  for (var i = 0; i < SPIRAL_NOISE_ITER; i = i + 1) {
    n = n - abs(sin(p.y * it) + cos(p.x * it)) / it;
    let xy1 = p.xy + vec2<f32>(p.y, -p.x) * 3.0;
    p = vec3<f32>(xy1 * normalizer, p.z);
    let xz1 = vec2<f32>(p.x, p.z) + vec2<f32>(p.z, -p.x) * 3.0;
    p = vec3<f32>(xz1.x * normalizer, p.y, xz1.y * normalizer);
    it = it * (1.5 + seed * 0.2);
  }
  return n;
}

// ─── Nebula density functions ─────────────────────────────────────────────

fn nebulaDensity(p: vec3<f32>, seed: f32) -> f32 {
  let k = 1.5 + seed * 0.5;
  let sp = spiralNoise(p * 0.5, seed);
  let detail = fbm3D(p * 2.0, FBM_DETAIL_OCTAVES) * 0.35;
  let fine = fbm3D(p * 6.0, 2) * 0.15;
  return k * (0.5 + sp * 0.5 + detail + fine);
}

fn densityVariation(p: vec3<f32>, seed: f32) -> f32 {
  var largeBright = fbm3D(p * 0.3 + seed * 50.0, 2);
  largeBright = smoothstep(-0.4, 0.4, largeBright);
  var mediumVar = fbm3D(p * 0.8 + seed * 30.0, 2);
  mediumVar = mediumVar * 0.5 + 0.5;
  return 0.3 + largeBright * (0.4 + mediumVar * 0.3);
}

fn voidMask(p: vec3<f32>, seed: f32) -> f32 {
  let voidNoise = fbm3D(p * 0.6 + seed * 70.0, 2);
  let voids = smoothstep(-0.5, 0.3, voidNoise);
  let smallVoids = fbm3D(p * 1.5 + seed * 90.0, 2);
  let sv = smoothstep(-0.5, 0.2, smallVoids);
  return 0.55 + voids * sv * 0.45;
}

fn brightRegions(p: vec3<f32>, seed: f32) -> f32 {
  var patch1 = fbm3D(p * 0.5 + seed * 40.0, 2);
  patch1 = pow(max(patch1 + 0.3, 0.0), 2.0);
  var cores = fbm3D(p * 1.5 + seed * 60.0, 2);
  cores = pow(max(cores + 0.5, 0.0), 3.0) * 0.5;
  return patch1 + cores;
}

// ─── Emission colors ──────────────────────────────────────────────────────

fn nebulaEmissionColor(hue: f32, variation: f32, seed: f32) -> vec3<f32> {
  // IQ cosine palette with seed-driven phase for unique colors per galaxy
  let s1 = seedHash(seed + 10.0);
  let s2 = seedHash(seed + 20.0);
  let s3 = seedHash(seed + 30.0);

  let a = vec3<f32>(0.5, 0.4, 0.5);
  let b = vec3<f32>(0.5, 0.4, 0.45);
  let c = vec3<f32>(1.0, 1.0, 0.8);
  let d = vec3<f32>(s1, s2, s3);

  var col = a + b * cos(6.283185 * (c * hue + d));
  col = col + (variation - 0.5) * 0.12;
  return max(col, vec3<f32>(0.0));
}

fn starColorFromTemp(temp: f32) -> vec3<f32> {
  if (temp < 0.2) {
    return mix(vec3<f32>(1.0, 0.6, 0.4), vec3<f32>(1.0, 0.75, 0.5), temp / 0.2);
  } else if (temp < 0.4) {
    return mix(vec3<f32>(1.0, 0.75, 0.5), vec3<f32>(1.0, 0.9, 0.75), (temp - 0.2) / 0.2);
  } else if (temp < 0.6) {
    return mix(vec3<f32>(1.0, 0.9, 0.75), vec3<f32>(1.0, 1.0, 1.0), (temp - 0.4) / 0.2);
  } else if (temp < 0.8) {
    return mix(vec3<f32>(1.0, 1.0, 1.0), vec3<f32>(0.85, 0.9, 1.0), (temp - 0.6) / 0.2);
  }
  return mix(vec3<f32>(0.85, 0.9, 1.0), vec3<f32>(0.7, 0.8, 1.0), (temp - 0.8) / 0.2);
}

fn starScintillation(base: f32, sh: f32, t: f32) -> f32 {
  if (base < 0.5) { return base; }
  var s = 1.0 + 0.03 * sin(t * 1.5 + sh * 6.28318) + 0.02 * sin(t * 2.7 + sh * 8.168);
  return base * s;
}

// ─── Distant gas cloud ────────────────────────────────────────────────────

fn distantGasCloud(dir: vec3<f32>, seed: f32, cc: vec3<f32>, cs: f32, ccol: vec3<f32>) -> vec4<f32> {
  let d = length(dir - cc);
  var mask = 1.0 - smoothstep(0.0, cs, d);
  mask = pow(max(mask, 0.0), 1.5);
  if (mask < 0.01) { return vec4<f32>(0.0); }

  let lp = (dir - cc) / cs;
  let n1 = fbm3D(lp * 3.0 + seed * 10.0, 3) * 0.5 + 0.5;
  let n2 = fbm3D(lp * 8.0 + seed * 20.0, 2) * 0.5 + 0.5;
  let vn = fbm3D(lp * 2.0 + seed * 30.0, 2);
  let voids = smoothstep(-0.3, 0.2, vn);
  var bc = fbm3D(lp * 4.0 + seed * 40.0, 2);
  bc = pow(max(bc + 0.4, 0.0), 2.5);

  var density = mask * n1 * (0.7 + n2 * 0.3) * voids;
  density = density + bc * mask * 0.3;
  let edge = smoothstep(0.0, 0.3, mask) * (1.0 - smoothstep(0.7, 1.0, mask));
  density = density * (0.4 + edge * 0.6);

  let cv = fbm3D(lp * 2.5 + seed * 15.0, 2) * 0.15;
  var vc = ccol * (0.85 + cv * 2.0);
  vc = mix(vc, ccol * 1.3, bc);

  return vec4<f32>(vc * (0.12 + density * 0.28), density * 0.45);
}

// ─── Emission knot ────────────────────────────────────────────────────────

fn emissionKnot(dir: vec3<f32>, seed: f32, center: vec3<f32>, size: f32, kcol: vec3<f32>) -> vec4<f32> {
  let d = length(dir - center);
  var mask = 1.0 - smoothstep(0.0, size, d);
  mask = pow(max(mask, 0.0), 2.0);
  if (mask < 0.01) { return vec4<f32>(0.0); }

  let lp = (dir - center) / size;
  let n = fbm3D(lp * 5.0 + seed * 25.0, 2) * 0.5 + 0.5;
  var density = mask * n + exp(-d * 30.0 / size) * 0.8;
  return vec4<f32>(kcol * density * 0.6, min(density * 0.5, 1.0));
}

// ─── Distant galaxy ───────────────────────────────────────────────────────

fn distantGalaxy(dir: vec3<f32>, seed: f32, center: vec3<f32>, size: f32) -> vec3<f32> {
  let d = length(dir - center);
  if (d > size * 2.0) { return vec3<f32>(0.0); }

  let tc = dir - center;
  let tiltAxis = normalize(hash33(vec3<f32>(seed * 100.0)) - 0.5);
  let diskDist = length(tc - tiltAxis * dot(tc, tiltAxis));
  let heightDist = abs(dot(tc, tiltAxis));
  let angle = atan2(tc.y, tc.x);
  let sp = sin(angle * 2.0 + diskDist * 20.0 / size + seed * 6.28318) * 0.5 + 0.5;
  let disk = exp(-diskDist * 8.0 / size) * exp(-heightDist * 40.0 / size);
  let bulge = exp(-d * 15.0 / size) * 0.8;
  let brightness = (disk * (0.3 + sp * 0.7) + bulge) * 0.15;
  let gc = mix(vec3<f32>(1.0, 0.9, 0.7), vec3<f32>(0.9, 0.85, 1.0), seedHash(seed + 0.5));
  return gc * brightness;
}

// ─── Entry point ──────────────────────────────────────────────────────────

fn backdrop(dir: vec3<f32>, uTime: f32, uSeed: f32, uNebulaIntensity: f32) -> vec4<f32> {
  let realTime = uTime;
  let flowTime = uTime * 0.008;

  let sh1 = seedHash(uSeed);
  let sh2 = seedHash(uSeed + 1.0);
  let sh3 = seedHash(uSeed + 2.0);
  let sh4 = seedHash(uSeed + 3.0);
  let sh5 = seedHash(uSeed + 4.0);
  let sh6 = seedHash(uSeed + 5.0);

  let animPos = dir + vec3<f32>(
    flowTime * 0.03 * (sh1 - 0.5),
    flowTime * 0.03 * 0.5,
    flowTime * 0.03 * (sh2 - 0.5)
  );

  var finalColor = vec3<f32>(0.005, 0.005, 0.008);

  // ── Distant galaxies ──
  let numGalaxies = 2 + i32(sh5 * 3.0);
  for (var i = 0; i < MAX_GALAXIES; i = i + 1) {
    if (i >= numGalaxies) { break; }
    let gs = seedHash(uSeed + f32(i) * 7.0 + 100.0);
    let gc = normalize(vec3<f32>(seedHash(gs) - 0.5, seedHash(gs + 0.1) - 0.5, seedHash(gs + 0.2) - 0.5));
    finalColor = finalColor + distantGalaxy(dir, gs, gc, 0.03 + seedHash(gs + 0.3) * 0.04);
  }

  // ── Stars — 4 jittered layers ──
  var starField = 0.0;
  var starColor = vec3<f32>(1.0);

  // Bright
  let sc1 = floor(dir * 180.0);
  let sh1v = seedHash(dot(sc1, vec3<f32>(127.1, 311.7, 74.7)) + uSeed);
  if (sh1v > 0.993) {
    let j1 = hash33(sc1 + uSeed) * 0.8 + 0.1;
    let d1 = length(dir - normalize((sc1 + j1) / 180.0));
    var s1 = exp(-d1 * 800.0) * (0.6 + sh1v * 0.4);
    s1 = starScintillation(s1, sh1v, realTime);
    starField = s1;
    starColor = starColorFromTemp(seedHash(sh1v * 77.7));
  }

  // Medium
  let sc2 = floor(dir * 320.0);
  let sh2v = seedHash(dot(sc2, vec3<f32>(93.1, 157.3, 211.7)) + uSeed * 2.0);
  if (sh2v > 0.988) {
    let j2 = hash33(sc2 + uSeed + 7.0) * 0.8 + 0.1;
    let d2 = length(dir - normalize((sc2 + j2) / 320.0));
    let s2 = exp(-d2 * 1000.0) * (0.35 + sh2v * 0.35);
    if (s2 > starField) {
      starField = s2;
      starColor = starColorFromTemp(seedHash(sh2v * 77.7));
    }
  }

  // Faint (skipped on mobile: STAR_LAYERS <= 2)
  if (STAR_LAYERS > 2) {
    let sc3 = floor(dir * 520.0);
    let sh3v = seedHash(dot(sc3, vec3<f32>(41.1, 89.3, 173.7)) + uSeed * 3.0);
    if (sh3v > 0.978) {
      let j3 = hash33(sc3 + uSeed + 13.0) * 0.8 + 0.1;
      let d3 = length(dir - normalize((sc3 + j3) / 520.0));
      starField = max(starField, exp(-d3 * 1400.0) * 0.25);
    }
  }

  // Very faint (skipped on mobile: STAR_LAYERS <= 3)
  if (STAR_LAYERS > 3) {
    let sc4 = floor(dir * 850.0);
    let sh4v = seedHash(dot(sc4, vec3<f32>(17.3, 43.7, 97.1)) + uSeed * 4.0);
    if (sh4v > 0.970) {
      let j4 = hash33(sc4 + uSeed + 19.0) * 0.8 + 0.1;
      let d4 = length(dir - normalize((sc4 + j4) / 850.0));
      starField = max(starField, exp(-d4 * 2000.0) * 0.1);
    }
  }

  finalColor = finalColor + starColor * starField;

  // ── Distant gas clouds ──
  let numClouds = 3 + i32(sh4 * 4.0);
  for (var ci = 0; ci < MAX_CLOUDS; ci = ci + 1) {
    if (ci >= numClouds) { break; }
    let cs = seedHash(uSeed + f32(ci) * 13.0 + 50.0);
    let cc = normalize(vec3<f32>(seedHash(cs) - 0.5, seedHash(cs + 0.1) - 0.5, seedHash(cs + 0.2) - 0.5));
    let csz = 0.15 + seedHash(cs + 0.3) * 0.25;
    let ch = fract(sh1 + 0.3 + seedHash(cs + 0.4) * 0.4);
    let ccol = nebulaEmissionColor(ch, seedHash(cs + 0.5), uSeed);
    let cloud = distantGasCloud(dir, cs, cc, csz, ccol);
    finalColor = mix(finalColor, finalColor + cloud.rgb * uNebulaIntensity, cloud.a);
  }

  // ── Main nebula ──
  let lightDir = normalize(vec3<f32>(sh1 - 0.5, 0.3, sh2 - 0.5));
  let mainDen = nebulaDensity(animPos * 2.0, sh1);
  let offDen = nebulaDensity(animPos * 2.0 + lightDir * 0.15, sh1);
  var density = mainDen * 0.65 + offDen * 0.35;

  let variation = densityVariation(animPos, sh1);
  density = density * (0.3 + variation * 1.2);
  let voids = voidMask(animPos, sh2);
  density = density * voids;
  let brightSpots = brightRegions(animPos, sh3);
  density = density + brightSpots * 0.4;

  var cloudMask = smoothstep(0.02, 0.52, density);
  cloudMask = cloudMask * 0.85;

  let colorNoise = fbm3D(animPos * 1.2 + vec3<f32>(sh3 * 10.0), 3) * 0.5 + 0.5;
  let regionalHue = fbm3D(animPos * 0.4 + sh4 * 20.0, 2) * 0.3;
  let hue = fract(sh1 + colorNoise * 0.25 + regionalHue);
  var nebulaColor = nebulaEmissionColor(hue, colorNoise, uSeed);

  var hotspots = fbm3D(animPos * 2.5 + sh6 * 30.0, 2);
  hotspots = pow(max(hotspots + 0.3, 0.0), 2.0);

  var brightness = 0.5 + cloudMask * 0.8;
  brightness = brightness * (0.85 + sh4 * 0.3);
  brightness = brightness * (0.6 + brightSpots * 1.2);
  brightness = brightness * (0.8 + hotspots * 0.8);
  brightness = brightness * (0.7 + variation * 0.8);
  nebulaColor = nebulaColor * brightness;

  let structure = fbm3D(animPos * 4.0, 2) * 0.5 + 0.5;
  nebulaColor = nebulaColor * (0.85 + structure * 0.3);

  let edgeGlow = pow(max(cloudMask, 0.0), 0.6) - pow(max(cloudMask, 0.0), 1.8);
  nebulaColor = nebulaColor + nebulaColor * edgeGlow * 0.5;

  let brightEdge = pow(max(brightSpots - 0.2, 0.0), 0.5);
  nebulaColor = nebulaColor + nebulaEmissionColor(hue + 0.1, 0.8, uSeed) * brightEdge * 0.3;

  let dustLane = smoothstep(0.2, 0.5, fbm3D(animPos * 1.5 + vec3<f32>(sh2 * 5.0), 3));
  nebulaColor = nebulaColor * (0.5 + dustLane * 0.5);
  nebulaColor = nebulaColor * (0.2 + voids * 0.8);

  var nebulaAlpha = cloudMask * 0.7 * voids;

  // ── Emission knots ──
  let numKnots = 2 + i32(sh3 * 4.0);
  for (var ki = 0; ki < MAX_KNOTS; ki = ki + 1) {
    if (ki >= numKnots) { break; }
    let ks = seedHash(uSeed + f32(ki) * 23.0 + 300.0);
    let kc = normalize(vec3<f32>(
      (seedHash(ks) - 0.5) * 0.8,
      (seedHash(ks + 0.1) - 0.5) * 0.8,
      0.5 + seedHash(ks + 0.2) * 0.3
    ));
    let ksz = 0.02 + seedHash(ks + 0.3) * 0.03;
    let kh = fract(sh1 + 0.15 + seedHash(ks + 0.4) * 0.2);
    let kcol = nebulaEmissionColor(kh, 0.7, uSeed) * 1.5;
    let knot = emissionKnot(dir, ks, kc, ksz, kcol);
    nebulaColor = nebulaColor + knot.rgb;
    nebulaAlpha = max(nebulaAlpha, knot.a);
  }

  // ── Composite ──
  let obscuration = nebulaAlpha * 0.8 * uNebulaIntensity;
  finalColor = mix(finalColor, nebulaColor, obscuration);
  finalColor = finalColor + starColor * starField * (1.0 - obscuration) * 0.3;

  let vignette = 1.0 - pow(max(abs(dir.y) - 0.10, 0.0), 2.0) * 0.08;
  finalColor = finalColor * vignette;
  // Dim for intergalactic backdrop — light from far outside the galaxy should
  // be subtle, not vivid.  Then clamp HDR and convert to linear for WebGPU's
  // sRGB output encoding.
  finalColor = finalColor * 0.45;
  finalColor = clamp(finalColor, vec3<f32>(0.0), vec3<f32>(1.0));
  finalColor = pow(finalColor, vec3<f32>(2.2));

  return vec4<f32>(finalColor, 1.0);
}
`;function _s(n,t){const s=t==="mobile",i=s?3:5,o=s?2:4,a=s?2:4,l=s?3:6,d=s?2:5,c=s?2:4;return n.replace(/\bSPIRAL_NOISE_ITER\b/g,String(i)).replace(/\bFBM_DETAIL_OCTAVES\b/g,String(o)).replace(/\bMAX_GALAXIES\b/g,String(a)).replace(/\bMAX_CLOUDS\b/g,String(l)).replace(/\bMAX_KNOTS\b/g,String(d)).replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g,(b,A)=>c>parseInt(A,10)?"true":"false")}function Hs(n){const t=[],s=/\bfn\s+[a-z_0-9]+\s*\(/gi;let i;const o=[];for(;(i=s.exec(n))!==null;)o.push(i.index);for(let a=0;a<o.length;a++){const l=o[a],d=n.indexOf("{",l);if(d===-1)continue;let c=0,b=d;for(;b<n.length&&(n[b]==="{"&&c++,!(n[b]==="}"&&(c--,c===0)));b++);t.push(n.substring(l,b+1))}return t}class Ns{constructor(t,s,i){this.uTime=x(0),this.uSeed=x(0),this.uNebulaIntensity=x(2.4),this.uSeed.value=s;const o=t*12,a=new ze(o,192,128),l=_s(Is,i),d=Hs(l),c=[];for(const y of d)c.push(He(y,[...c]));const b=c[c.length-1],A=this.uTime,S=this.uSeed,u=this.uNebulaIntensity,v=G(()=>{const y=ut(Ne);return b(y,A,S,u)});this.material=new re,this.material.side=We,this.material.depthWrite=!1,this.material.depthTest=!1,this.material.fragmentNode=v(),this.mesh=new ce(a,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(t,s){this.uTime.value=t,this.mesh.position.copy(s.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const ve=new pt(0,1,0),Qt=new $t,be=new Ue,xe=new pt,ye=new Jt,Se=new Jt,Ae=new pt;function Ws(n){return n==="mobile"?15e4:5e5}class Os{constructor(t,s){this.initialized=!1,this.disposed=!1,this._bhScreenVec=new pt,this.animationId=0,this.lastFrameTime=0,this.galaxyRotation=0,this.orbitQuat=new $t,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.mouse3D=new pt(0,0,0),this.raycaster=new Ve,this.intersectionPlane=new qe(new pt(0,1,0),0),this.mousePressed=!1,this.rendererSize=new Jt,this.dpr=1,this.animate=()=>{this.animationId=requestAnimationFrame(this.animate);const u=performance.now(),v=Math.min((u-this.lastFrameTime)/1e3,.033);this.lastFrameTime=u,this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const y=this.baseDistance/this.zoom;xe.set(0,0,y).applyQuaternion(this.orbitQuat),this.camera.position.copy(xe),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const p=Math.min(this.zoom/20,1),r=this.params.morphology,f=r.ellipticity>0||r.clumpCount>0?0:.02+.18*p*p;this.galaxyRotation+=v*f;const m=this.uniforms.time.value+v;if(this.uniforms.time.value=m,this.uniforms.deltaTime.value=v,this.uniforms.rotationSpeed.value=f,this.uniforms.mouse.value.copy(this.mouse3D),this.uniforms.mouseActive.value=this.mousePressed?1:0,this.initialized){this.renderer.compute(this.computeUpdate),this.renderer.compute(this.clouds.computeUpdate);const F=this.camera.matrixWorldInverse.elements;be.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);const E=be.elements;this.fgUniforms.mvpRow0.value.set(E[0],E[4],E[8],E[12]),this.fgUniforms.mvpRow1.value.set(E[1],E[5],E[9],E[13]),this.fgUniforms.mvpRow3.value.set(E[3],E[7],E[11],E[15]),this.fgUniforms.viewZRow.value.set(F[2],F[6],F[10],F[14]),this.fgUniforms.bhViewZ.value=F[14];const et=this._bhScreenVec.set(0,0,0).project(this.camera);this.fgUniforms.bhNdcX.value=et.x,this.fgUniforms.bhNdcY.value=et.y;const z=this.camera.position,Y=z.length(),j=1-Math.abs(z.y)/Math.max(Y,1e-4),N=Yt.smoothstep(j,.55,.95);this.fgUniforms.depthThreshold.value=Yt.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),N),this.fgUniforms.depthSoftness.value=Yt.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),N);const Z=this.params.galaxyRadius*.08,Q=this.camera.fov*Math.PI/180,R=this.rendererSize.y*this.dpr,k=Z/Y*(R/(2*Math.tan(Q/2))),B=Yt.lerp(.75,1.2,N),C=this.canvas.clientWidth,T=this.canvas.clientHeight;this.fgUniforms.ndcRadiusX.value=Math.max(k*B/Math.max(C*.5,1),.04),this.fgUniforms.ndcRadiusY.value=Math.max(k*B/Math.max(T*.5,1),.04),this.renderer.compute(this.computeForeground)}this.backdrop.update(m,this.camera);const M=this.camera.position,w=Math.sqrt(M.x*M.x+M.z*M.z),D=Math.atan2(M.y,w),I=Math.atan2(M.x,M.z);this.blackHole.update(m,D,I,this.camera,this.rendererSize,this.dpr),this._bhScreenVec.set(0,0,0).project(this.camera);const q=this.blackHole.getLOD(),U=q*q*.03;Se.set(this._bhScreenVec.x*.5+.5,this._bhScreenVec.y*.5+.5),this.postProcessing.updateLensing(Se,U,this.camera.aspect),this.postProcessing.render()},this.canvas=t,this.galaxy=s,this.quality=Qe();const i=Ws(this.quality);this.scene=new ne,this.bhScene=new ne,this.fgScene=new ne,this.params=pe(s);const o=this.params.galaxyRadius;this.baseDistance=o*1.7;const a=t.clientWidth/t.clientHeight;this.camera=new Xe(60,a,.1,this.baseDistance*20),this.buffers=ys(i),this.uniforms=Ss(this.params),this.computeInit=ws(i,this.buffers,this.uniforms),this.computeUpdate=zs(i,this.buffers,this.uniforms),this.fgUniforms=ks(),this.computeForeground=Ms(i,this.buffers,this.fgUniforms),this.backdrop=new Ns(this.baseDistance,s.pgc,this.quality),this.scene.add(this.backdrop.mesh),this.particles=new Ts(i,this.buffers,this.baseDistance),this.scene.add(this.particles.sprite),this.clouds=new Es(this.uniforms,this.baseDistance,this.quality),this.scene.add(this.clouds.sprite),this.blackHole=new Fs(o*.08,fe(this.quality)),this.bhScene.add(this.blackHole.depthMesh),this.bhScene.add(this.blackHole.mesh),this.fgScene.add(this.particles.foregroundSprite);const d=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=d,this.targetZoom=d;const{initRotY:c,initTiltX:b}=$e(s),A=new $t().setFromAxisAngle(new pt(1,0,0),b),S=new $t().setFromAxisAngle(ve,c);this.orbitQuat.multiplyQuaternions(S,A),this.onPointerDown=u=>{this.isPinching||(this.isDragging=!0,this.lastX=u.clientX,this.lastY=u.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=u=>{if(this.isPinching||!this.isDragging)return;const v=u.clientX-this.lastX,y=u.clientY-this.lastY;this.velocityX=v*.005,this.velocityY=y*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=u.clientX,this.lastY=u.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=u=>{u.preventDefault();const v=this.targetZoom*.12;this.targetZoom+=u.deltaY>0?-v:v,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=u=>{if(u.touches.length===2){u.preventDefault(),this.isPinching=!0,this.isDragging=!1;const v=u.touches[0].clientX-u.touches[1].clientX,y=u.touches[0].clientY-u.touches[1].clientY;this.lastPinchDist=Math.sqrt(v*v+y*y)}},this.onTouchMove=u=>{if(u.touches.length===2){u.preventDefault();const v=u.touches[0].clientX-u.touches[1].clientX,y=u.touches[0].clientY-u.touches[1].clientY,p=Math.sqrt(v*v+y*y),r=(p-this.lastPinchDist)*.01;this.lastPinchDist=p,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+r))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onMouseDown=()=>{this.mousePressed=!0},this.onMouseUp=()=>{this.mousePressed=!1},this.onMouseMove=u=>{ye.set(u.clientX/t.clientWidth*2-1,-(u.clientY/t.clientHeight)*2+1),this.raycaster.setFromCamera(ye,this.camera),this.raycaster.ray.intersectPlane(this.intersectionPlane,this.mouse3D)},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("mouseup",this.onMouseUp),t.addEventListener("mousemove",this.onMouseMove),this.resizeObserver=new ResizeObserver(()=>{const u=t.clientWidth,v=t.clientHeight;u===0||v===0||(this.renderer.setSize(u,v,!1),this.camera.aspect=u/v,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(t)}applyOrbitDelta(t,s){Qt.setFromAxisAngle(ve,-t),this.orbitQuat.premultiply(Qt),Ae.set(1,0,0).applyQuaternion(this.orbitQuat),Qt.setFromAxisAngle(Ae,-s),this.orbitQuat.premultiply(Qt),this.orbitQuat.normalize()}async start(){const t=hs(this.galaxy.pgc).catch(()=>null);this.renderer=new Ge({canvas:this.canvas,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Ke(this.quality))),this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight,!1),this.dpr=this.renderer.getPixelRatio(),this.renderer.getSize(this.rendererSize),await this.renderer.init();const s=fe(this.quality);this.postProcessing=new Rs(this.renderer,this.scene,this.bhScene,this.fgScene,this.camera,s),await this.renderer.computeAsync(this.computeInit),await this.renderer.computeAsync(this.clouds.computeInit),this.initialized=!0,this.lastFrameTime=performance.now(),this.animate(),t.then(async i=>{if(!(!i||this.disposed||!this.initialized))try{if(this.params=pe(this.galaxy,i.profile),Te(this.uniforms,this.params),this.disposed||(await this.renderer.computeAsync(this.computeInit),this.disposed))return;await this.renderer.computeAsync(this.clouds.computeInit)}catch(o){this.disposed||console.warn("Band-guided WebGPU upgrade failed; keeping procedural render:",o)}})}dispose(){this.disposed=!0,cancelAnimationFrame(this.animationId);const t=this.canvas;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("mouseup",this.onMouseUp),t.removeEventListener("mousemove",this.onMouseMove),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.clouds.dispose(),this.blackHole.dispose(),this.postProcessing.dispose(),this.renderer.dispose()}}export{Os as GalaxySceneWebGPU};
