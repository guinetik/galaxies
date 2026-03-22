import{a0 as Y,a1 as ct,a2 as G,a3 as e,a4 as I,a5 as R,a6 as W,a7 as q,a8 as it,a9 as rt,aa as Kt,ab as Mt,ac as m,ad as kt,ae as ht,af as lt,ag as x,V as gt,ah as Et,ai as $,aj as H,ak as at,al as fe,am as It,an as tt,ao as Xt,ap as we,aq as ne,A as ae,r as ie,ar as ce,k as Qt,as as ze,at as te,au as ke,av as Me,aw as Te,d as ve,ax as oe,M as le,ay as De,az as ue,aA as Re,aB as he,x as Pe,l as Ce,aC as Be,aD as Le,aE as Ee,Q as $t,aF as Fe,aG as Ie,f as He,n as Gt,S as ee,P as _e,aH as We}from"./three-Bsxc-RuM.js";import{m as me}from"./morphologyMapper-DY_wjh1a.js";import{a as be,l as Ne,d as Ve}from"./nsaMorphologyPointCloud-Ct5fnwAD.js";import{G as xe}from"./index-CFJA0m8O.js";import{d as qe,c as Ue,a as Xe,g as Ge,b as Ye}from"./qualityDetect-CC9xKtzo.js";import"./vue-vendor-CyMGTBsb.js";const Oe=8,je=12,yt=.015;function Ze(n,t={}){const s=t.radialBinCount??Oe,i=t.azimuthalBinCount??je,o=Qe(t.availability),a=Array.from({length:s},()=>({intensity:0,hot:0,stellar:0,dust:0,weight:0})),l=Array.from({length:i},()=>({intensity:0,weight:0}));let c=0,d=0,p=0,w=0,S=0;const u=(n.width-1)*.5,h=(n.height-1)*.5,A=Math.max(1,Math.hypot(u,h));for(let z=0;z<n.height;z+=1)for(let _=0;_<n.width;_+=1){const X=z*n.width+_,E=re(n,X,o);if(E.intensity<=yt)continue;const O=_-u,N=z-h,V=K(Math.hypot(O,N)/A),Z=Math.atan2(N,O);c+=E.hot,d+=E.stellar,p+=E.dust,V<=.22&&(w+=E.intensity),V<=.85&&(S+=E.intensity);const et=Math.min(s-1,Math.floor(V*s)),P=a[et];if(P.intensity+=E.intensity,P.hot+=E.hot,P.stellar+=E.stellar,P.dust+=E.dust,P.weight+=1,V>=.2&&V<=.88){const k=Z<0?Z+Math.PI*2:Z,B=Math.min(i-1,Math.floor(k/(Math.PI*2)*i)),C=l[B];C.intensity+=E.intensity,C.weight+=1}}const b=Ke(c,d,p),r=a.map((z,_)=>Je(z,_,s)),f=l.map((z,_)=>({angle:_/i*Math.PI*2,intensity:z.weight>0?z.intensity/z.weight:0})),v=S>0?K(w/S):0,M=ts(n),y=ss(f.map(z=>z.intensity)),D=es(n),U=as(n,o),F=K((1-M)*.7+v*.3),Q=K(b.dust*(.55+M*.35+y*.25));return{availability:o,globalColorBalance:b,concentration:v,armContrast:y,clumpiness:D,filamentarity:M,diskThicknessBias:F,dustLaneStrength:Q,projectedAxisRatio:U.axisRatio,projectedAngle:U.angle,projectedStrength:U.strength,radialProfile:r,azimuthalProfile:f}}function Qe(n){const t=["u","g","r","i","z","nuv"],s={u:!0,g:!0,r:!0,i:!0,z:!0,nuv:!0},i={u:!1,g:!1,r:!1,i:!1,z:!1,nuv:!1};for(const o of t)(n==null?void 0:n[o])==="fallback"&&(s[o]=!1,i[o]=!0);return{real:s,fallback:i}}function re(n,t,s){const i=Math.sqrt(K(n.bands.u[t]??0)),o=Math.sqrt(K(n.bands.g[t]??0)),a=Math.sqrt(K(n.bands.r[t]??0)),l=Math.sqrt(K(n.bands.i[t]??0)),c=Math.sqrt(K(n.bands.z[t]??0)),d=Math.sqrt(K(n.bands.nuv[t]??0)),p=s.real.u?1:0,w=s.real.i?1:0,S=s.real.z?1:0,u=s.real.nuv?1:0,h=p+u,A=h>0?(i*p+d*u)/h:$e(o,a),b=(o+a)*.5,r=w+S,f=r>0?(l*w+c*S)/r:0,v=f*.25+b*.4+A*.35;return{hot:A,stellar:b,dust:f,intensity:v}}function $e(n,t){return(n+t)*.5*.35}function Ke(n,t,s){const i=n+t+s;return i<=0?{hot:0,stellar:0,dust:0}:{hot:n/i,stellar:t/i,dust:s/i}}function Je(n,t,s){return n.weight<=0?{radius:(t+.5)/s,intensity:0,hot:0,stellar:0,dust:0}:{radius:(t+.5)/s,intensity:n.intensity/n.weight,hot:n.hot/n.weight,stellar:n.stellar/n.weight,dust:n.dust/n.weight}}function ts(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/64)),{field:s,w:i,h:o}=be(n,t),a=Math.max(1,Math.min(3,Math.floor(Math.min(i,o)/12)));let l=0,c=0;for(let w=0;w<o;w+=1)for(let S=0;S<i;S+=1){const u=s[w*i+S];if(u<=yt)continue;const{F:h}=Ne(s,i,o,S,w,a);l+=h*u,c+=u}const d=c>0?K(l/c):0,p=ns(s,i,o);return K(d*.35+p*.65)}function es(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/96)),{field:s,w:i,h:o}=be(n,t);let a=0,l=0;for(let c=0;c<o;c+=1)for(let d=0;d<i;d+=1){const p=s[c*i+d];if(p<=yt)continue;let w=0,S=0;for(let h=-1;h<=1;h+=1)for(let A=-1;A<=1;A+=1){if(A===0&&h===0)continue;const b=Math.max(0,Math.min(i-1,d+A)),r=Math.max(0,Math.min(o-1,c+h));w+=s[r*i+b],S+=1}const u=S>0?w/S:p;a+=Math.max(p-u,0),l+=p}return l>0?K(a/l*3):0}function ss(n){const t=n.filter(o=>o>0);if(t.length===0)return 0;const s=t.reduce((o,a)=>o+a,0)/t.length;if(s<=1e-6)return 0;const i=t.reduce((o,a)=>{const l=a-s;return o+l*l},0)/t.length;return K(Math.sqrt(i)/s/2)}function ns(n,t,s){let i=0,o=0,a=0;for(let A=0;A<s;A+=1)for(let b=0;b<t;b+=1){const r=n[A*t+b];r<=yt||(i+=r,o+=b*r,a+=A*r)}if(i<=0)return 0;o/=i,a/=i;let l=0,c=0,d=0;for(let A=0;A<s;A+=1)for(let b=0;b<t;b+=1){const r=n[A*t+b];if(r<=yt)continue;const f=b-o,v=A-a;l+=f*f*r,c+=f*v*r,d+=v*v*r}l/=i,c/=i,d/=i;const p=l+d;if(p<=1e-6)return 0;const w=l*d-c*c,S=Math.sqrt(Math.max(0,p*p-4*w)),u=(p+S)*.5,h=(p-S)*.5;return K((u-h)/(u+h+1e-6))}function as(n,t){let s=0,i=0,o=0;for(let b=0;b<n.height;b+=1)for(let r=0;r<n.width;r+=1){const f=b*n.width+r,v=re(n,f,t).intensity;v<=yt||(s+=v,i+=r*v,o+=b*v)}if(s<=0)return{axisRatio:1,angle:0,strength:0};i/=s,o/=s;let a=0,l=0,c=0;for(let b=0;b<n.height;b+=1)for(let r=0;r<n.width;r+=1){const f=b*n.width+r,v=re(n,f,t).intensity;if(v<=yt)continue;const M=r-i,y=b-o;a+=M*M*v,l+=M*y*v,c+=y*y*v}a/=s,l/=s,c/=s;const d=a+c;if(d<=1e-6)return{axisRatio:1,angle:0,strength:0};const p=a*c-l*l,w=Math.sqrt(Math.max(0,d*d-4*p)),S=Math.max((d+w)*.5,1e-6),u=Math.max((d-w)*.5,1e-6),h=K(Math.sqrt(u/S)),A=.5*Math.atan2(2*l,a-c);return{axisRatio:Math.max(h,.15),angle:is(A),strength:K((1-h)*1.35)}}function K(n){return Math.max(0,Math.min(1,n))}function is(n){const t=Math.PI,s=n%t;return s<0?s+t:s}async function os(n){const t=await ls(n);if(!t)return null;const s=await rs(n,t);if(!(s!=null&&s.g)||!s.r||!s.i)return null;ds(s);const{input:i,availability:o}=us(s),a=Ze(i,{availability:hs(o)});return{metadata:t,input:i,availability:o,profile:a}}async function ls(n){try{const t=await fetch(`${xe}/${n}/metadata.json`);return t.ok?await t.json():null}catch{return null}}async function rs(n,t){const s=cs(t),i=`${xe}/${n}/`,o=await Promise.all(s.map(async a=>{try{const l=await fetch(`${i}${a}.png`);if(!l.ok){if(a==="g"||a==="r"||a==="i")throw new Error(`Missing required NSA band: ${a}`);return[a,null]}const c=await l.arrayBuffer(),d=Ve(new Uint8Array(c)),p=d.depth===16?65535:255,w=new Float32Array(d.width*d.height);for(let S=0;S<w.length;S+=1)w[S]=d.data[S*d.channels]/p;return[a,{raw:w,width:d.width,height:d.height,range:t.data_ranges[a]??[0,1]}]}catch(l){if(a==="g"||a==="r"||a==="i")throw l;return[a,null]}})).catch(()=>null);return o?Object.fromEntries(o.filter(a=>a[1]!==null)):null}function cs(n){const t=["i","r","g"];return n.bands.includes("u")&&t.push("u"),n.bands.includes("z")&&t.push("z"),n.bands.includes("nuv")&&t.push("nuv"),t}function ds(n){const t=n.g;if(!t)return;const s=t.range[1]-t.range[0];for(const i of["u","z","nuv"]){const o=n[i];if(!o)continue;o.range[1]-o.range[0]<s*.01&&delete n[i]}}function us(n){const t=a=>n[a]?a:a==="u"?"g":a==="z"?"i":n.u?"u":"g",s=n.i??n.g??n.r;if(!s)throw new Error("Cannot build point-cloud input without core NSA bands");const i={u:t("u"),g:t("g"),r:t("r"),i:t("i"),z:t("z"),nuv:t("nuv")},o={real:{u:i.u==="u",g:i.g==="g",r:i.r==="r",i:i.i==="i",z:i.z==="z",nuv:i.nuv==="nuv"},fallback:{u:i.u!=="u",g:!1,r:!1,i:!1,z:i.z!=="z",nuv:i.nuv!=="nuv"}};return{input:{width:s.width,height:s.height,bands:{u:zt(n[i.u]),g:zt(n[i.g]),r:zt(n[i.r]),i:zt(n[i.i]),z:zt(n[i.z]),nuv:zt(n[i.nuv])}},availability:o}}function zt(n){const[t,s]=n.range,i=s-t,o=new Float32Array(n.raw.length);let a=0;for(let l=0;l<n.raw.length;l+=1){const c=n.raw[l]*i+t,d=Math.max(c,0);o[l]=d,d>a&&(a=d)}if(a>0)for(let l=0;l<o.length;l+=1)o[l]/=a;return o}function hs(n){return{u:n.fallback.u?"fallback":"real",g:"real",r:"real",i:"real",z:n.fallback.z?"fallback":"real",nuv:n.fallback.nuv?"fallback":"real"}}const g=Y(([n])=>{const t=ct(n.mul(.1031)),s=t.add(19.19);return ct(s.mul(s.add(47.43)).mul(t))}),ut=Y(([n])=>{const t=ct(n.mul(R(.16532,.17369,.15787))).toVar();return t.addAssign(Kt(t,t.yzx.add(19.19))),ct(t.x.mul(t.y).mul(t.z))}),Yt=Y(([n])=>ct(W(Kt(n,kt(2.31,53.21)).mul(124.123)).mul(412)));Y(([n])=>{const t=Mt(n),s=ct(n),i=s.mul(s).mul(e(3).sub(s.mul(2)));return m(m(Yt(t),Yt(t.add(kt(1,0))),i.x),m(Yt(t.add(kt(0,1))),Yt(t.add(kt(1,1))),i.x),i.y)});const se=Y(([n])=>{const t=Mt(n),s=ct(n),i=s.mul(s).mul(e(3).sub(s.mul(2))),o=ut(t.add(R(0,0,0))),a=ut(t.add(R(1,0,0))),l=ut(t.add(R(0,1,0))),c=ut(t.add(R(1,1,0))),d=ut(t.add(R(0,0,1))),p=ut(t.add(R(1,0,1))),w=ut(t.add(R(0,1,1))),S=ut(t.add(R(1,1,1))),u=m(o,a,i.x),h=m(l,c,i.x),A=m(d,p,i.x),b=m(w,S,i.x),r=m(u,h,i.y),f=m(A,b,i.y);return m(r,f,i.z).mul(2).sub(1)});Y(([n,t])=>it(n).sub(t));Y(([n,t])=>{const s=kt(it(n.xz).sub(t.x),n.y);return it(s).sub(t.y)});const Ft=Y(([n,t])=>{const s=W(t),i=q(t),o=n.x.mul(s).sub(n.z.mul(i)),a=n.x.mul(i).add(n.z.mul(s));return R(o,n.y,a)}),pt=Y(([n,t,s])=>{const i=it(R(n.x,e(0),n.z)),o=e(20),a=I(i,o).div(o),l=e(1).div(rt(a,e(.35))),c=t.mul(l).mul(s).negate();return Ft(n,c)});Y(([n,t,s,i,o,a])=>{const l=t.sub(n),c=it(l),d=s.mul(I(e(0),e(1).sub(c.div(o))));return ht(l).mul(i).mul(d).mul(a).negate()});Y(([n,t,s,i])=>t.sub(n).mul(s).mul(i));const ms=Y(([n,t,s])=>{const i=t.mul(G(s,e(1).sub(s))),o=ct(n.mul(12).add(0).div(12)).mul(12),a=ct(n.mul(12).add(8).div(12)).mul(12),l=ct(n.mul(12).add(4).div(12)).mul(12),c=s.sub(i.mul(I(G(G(o.sub(3),e(9).sub(o)),e(1)),e(-1)))),d=s.sub(i.mul(I(G(G(a.sub(3),e(9).sub(a)),e(1)),e(-1)))),p=s.sub(i.mul(I(G(G(l.sub(3),e(9).sub(l)),e(1)),e(-1))));return R(c,d,p)});function gs(n){return{positionBuffer:lt(n,"vec3"),originalPositionBuffer:lt(n,"vec3"),velocityBuffer:lt(n,"vec3"),colorBuffer:lt(n,"vec4"),sizeBuffer:lt(n,"float"),layerBuffer:lt(n,"float"),foregroundAlphaBuffer:lt(n,"float")}}function ps(n){const t={numArms:x(0),armWidth:x(0),spiralTightness:x(0),spiralStart:x(0),bulgeRadius:x(0),fieldStarFraction:x(0),irregularity:x(0),barLength:x(0),barWidth:x(0),axisRatio:x(1),ellipticity:x(0),bulgeFraction:x(0),diskThickness:x(0),clumpCount:x(0),galaxyRadius:x(0),galaxySeed:x(0),bandArmScatterScale:x(1),bandBulgeBoost:x(0),bandClumpBoost:x(0),bandHotMix:x(.5),bandDustMix:x(.5),bandDiskThicknessScale:x(1),bandDustLaneStrength:x(0),coreWeight:x(1),midDiskWeight:x(1),outerDiskWeight:x(1),peakAzimuthAngleA:x(0),peakAzimuthAngleB:x(Math.PI),peakAzimuthStrength:x(0),projectedAxisRatio:x(1),projectedAngle:x(0),projectedStrength:x(0),time:x(0),deltaTime:x(.016),rotationSpeed:x(.033),mouse:x(new gt(0,0,0)),mouseActive:x(0),mouseForce:x(7),mouseRadius:x(n.galaxyRadius*.3)};return ye(t,n),t}function ye(n,t){const s=t.morphology,i=qe(t.bandProfile);n.numArms.value=s.numArms,n.armWidth.value=s.armWidth*t.galaxyRadius,n.spiralTightness.value=s.spiralTightness,n.spiralStart.value=s.spiralStart,n.bulgeRadius.value=s.bulgeRadius*t.galaxyRadius,n.fieldStarFraction.value=s.fieldStarFraction,n.irregularity.value=s.irregularity,n.barLength.value=s.barLength*t.galaxyRadius,n.barWidth.value=s.barWidth*t.galaxyRadius,n.axisRatio.value=s.axisRatio,n.ellipticity.value=s.ellipticity,n.bulgeFraction.value=s.bulgeFraction,n.diskThickness.value=s.diskThickness,n.clumpCount.value=s.clumpCount,n.galaxyRadius.value=t.galaxyRadius,n.galaxySeed.value=t.starCount*.61803398875,n.bandArmScatterScale.value=i.armScatterScale,n.bandBulgeBoost.value=i.bulgeBoost,n.bandClumpBoost.value=i.clumpBoost,n.bandHotMix.value=i.hotMix,n.bandDustMix.value=i.dustMix,n.bandDiskThicknessScale.value=i.diskThicknessScale,n.bandDustLaneStrength.value=i.dustLaneStrength,n.coreWeight.value=i.coreWeight,n.midDiskWeight.value=i.midDiskWeight,n.outerDiskWeight.value=i.outerDiskWeight,n.peakAzimuthAngleA.value=i.peakAzimuthAngleA,n.peakAzimuthAngleB.value=i.peakAzimuthAngleB,n.peakAzimuthStrength.value=i.peakAzimuthStrength,n.projectedAxisRatio.value=i.projectedAxisRatio,n.projectedAngle.value=i.projectedAngle,n.projectedStrength.value=i.projectedStrength,n.mouseRadius.value=t.galaxyRadius*.3}const xt=6.28318530718;function Lt(n,t){const s=tt(e(.18),e(.38),n),i=tt(e(.58),e(.82),n),o=m(t.coreWeight,t.midDiskWeight,s);return m(o,t.outerDiskWeight,i)}function fs(n,t){const s=W(t.projectedAngle),i=q(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=m(e(1),t.projectedAxisRatio,t.projectedStrength),c=a.mul(l);return R(o.mul(s).sub(c.mul(i)),n.y,o.mul(i).add(c.mul(s)))}function vs(n,t,s){return Y(()=>{const o=Et,a=o.toFloat(),l=s.galaxyRadius,c=l.mul(.06),d=m(e(.55),e(.76),$(s.bandDustMix.add(s.bandDustLaneStrength.mul(.35)),e(0),e(1))),p=m(e(.02),e(.08),$(s.bandHotMix.mul(.7).add(s.bandClumpBoost.mul(.3)),e(0),e(1))),w=g(a.add(100)),S=e(0).toVar();H(w.greaterThan(e(1).sub(p)),()=>{S.assign(2)}).ElseIf(w.greaterThan(d),()=>{S.assign(1)}),t.layerBuffer.element(o).assign(S);const u=g(a.add(200)),h=e(0).toVar();H(S.equal(0),()=>{h.assign(u.mul(1.5).add(.8).mul(m(e(.95),e(1.35),s.bandDustMix)))}).ElseIf(S.equal(1),()=>{h.assign(u.mul(3).add(1.5))}).Else(()=>{h.assign(u.mul(6).add(4).mul(m(e(.9),e(1.4),s.bandHotMix)))}),t.sizeBuffer.element(o).assign(h);const A=g(a.add(300)),b=g(a.add(400)),r=e(0).toVar(),f=e(0).toVar();H(S.equal(0),()=>{r.assign(A.mul(.16).add(.08).mul(m(e(.9),e(1.35),s.bandDustMix))),f.assign(b.mul(.2).add(.12).mul(m(e(.9),e(1.2),s.bandDustLaneStrength)))}).ElseIf(S.equal(1),()=>{r.assign(A.mul(.4).add(.32).mul(m(e(.95),e(1.15),s.bandHotMix))),f.assign(b.mul(.4).add(.4))}).Else(()=>{r.assign(A.mul(.16).add(.64).mul(m(e(.95),e(1.25),s.bandHotMix))),f.assign(b.mul(.24).add(.56).mul(m(e(.95),e(1.2),s.bandClumpBoost)))});const v=e(0).toVar(),M=e(0).toVar(),y=e(0).toVar(),D=e(0).toVar(),U=e(-1).toVar(),F=e(1).toVar(),Q=e(0).toVar();H(s.numArms.greaterThan(0),()=>{const P=g(a.add(500)),k=s.bulgeRadius,B=G(e(.25),e(.1).add(e(.2).mul(k.div(l)))),C=s.fieldStarFraction;H(P.lessThan(B),()=>{U.assign(0);const T=rt(g(a.add(10)),e(.6)).mul(k),L=g(a.add(11)).mul(xt),j=g(a.add(12)).sub(.5).mul(k).mul(.5);v.assign(W(L).mul(T)),M.assign(j),y.assign(q(L).mul(T)),D.assign(T.div(k).mul(.3)),F.assign(s.coreWeight)}).ElseIf(P.lessThan(B.add(C)),()=>{U.assign(1);const T=at(g(a.add(20))).mul(l),L=g(a.add(21)).mul(xt),j=g(a.add(22)).sub(.5).mul(l).mul(.08);v.assign(W(L).mul(T)),M.assign(j),y.assign(q(L).mul(T)),D.assign(T.div(l)),F.assign(Lt(D,s))}).Else(()=>{U.assign(2);const T=s.numArms,j=Mt(g(a.add(30)).mul(T)).mul(xt).div(T),J=I(s.spiralStart.mul(l),e(.001)),ot=s.barLength.mul(.5),st=G(I(J,ot),l.mul(.98)),nt=g(a.add(31)),mt=at(nt.mul(l.mul(l).sub(st.mul(st))).add(st.mul(st))),ft=mt.div(l),vt=Lt(ft,s);F.assign(vt);const Tt=e(2.5),St=I(mt.div(J),e(1)).log().div(I(s.spiralTightness,e(.001))).mul(Tt),bt=mt.div(l).mul(.5).add(.5),At=g(a.add(32)).sub(.5).add(g(a.add(33)).sub(.5)).mul(s.armWidth).mul(bt).mul(s.bandArmScatterScale),Dt=s.irregularity.mul(g(a.add(35)).sub(.5)).mul(30),Ht=g(a.add(34)).sub(.5).mul(.3),dt=St.add(j).add(Ht),_t=W(dt.sub(s.peakAzimuthAngleA)).mul(.5).add(.5),Wt=W(dt.sub(s.peakAzimuthAngleB)).mul(.5).add(.5),Nt=I(_t,Wt);Q.assign(Nt);const Vt=q(s.peakAzimuthAngleA.sub(dt)).mul(_t).add(q(s.peakAzimuthAngleB.sub(dt)).mul(Wt)).mul(s.peakAzimuthStrength).mul(.22),Rt=dt.add(Vt),qt=Rt.add(e(Math.PI/2)),Ut=m(e(.86),e(1.18),$(vt.sub(.55).div(1.3),e(0),e(1))),Pt=$(mt.mul(Ut),st,l),Ct=At.mul(m(e(1.3),e(.42),Nt.mul(s.peakAzimuthStrength))),Bt=W(Rt).mul(Pt.add(Dt)).add(W(qt).mul(Ct)),wt=q(Rt).mul(Pt.add(Dt)).add(q(qt).mul(Ct)),de=Pt.div(l),Jt=l.mul(.06).mul(e(1).sub(de.mul(.7))).mul(s.bandDiskThicknessScale),Se=g(a.add(36)).sub(.5).mul(Jt);v.assign(Bt),M.assign(Se),y.assign(wt);const Ae=at(Bt.mul(Bt).add(wt.mul(wt)));D.assign(Ae.div(l))}),H(s.barLength.greaterThan(0),()=>{const T=g(a.add(600));H(T.lessThan(.25),()=>{const L=s.barLength,j=s.barWidth,J=g(a.add(40)).sub(.5).mul(2).mul(L),ot=g(a.add(41)).sub(.5).mul(j);v.assign(J),M.assign(g(a.add(42)).sub(.5).mul(l).mul(.04)),y.assign(ot),D.assign(e(.1))})})}),H(s.numArms.equal(0).and(s.barLength.equal(0)).and(s.clumpCount.equal(0)).and(s.ellipticity.equal(0)).and(s.bulgeFraction.greaterThan(0)),()=>{const P=s.bulgeRadius,k=rt(g(a.add(10)),e(.55)).mul(l),B=g(a.add(11)).mul(xt),C=k.div(l),T=l.mul(.06).mul(rt(I(e(1).sub(C),e(0)),e(2))).mul(s.bandDiskThicknessScale),L=g(a.add(12)).sub(.5).mul(T);v.assign(W(B).mul(k)),M.assign(L),y.assign(q(B).mul(k));const j=$(e(1).sub(k.div(I(P,e(1)))),e(0),e(1)),J=e(1).add(j.mul(.4)).add(s.bandBulgeBoost.mul(.25));r.assign(G(r.mul(J),e(.95))),f.assign(G(f.mul(J),e(.95))),h.assign(h.mul(e(1).add(j.mul(.3)))),D.assign(C.mul(.2)),F.assign(Lt(C,s))}),H(s.ellipticity.greaterThan(0),()=>{const P=s.axisRatio,k=rt(g(a.add(10)),e(.4)).mul(l),B=g(a.add(11)).mul(xt),C=k.mul(W(B)),T=k.mul(q(B)).mul(P),L=at(C.mul(C).add(T.mul(T))).div(l),j=g(a.add(12)).sub(.5).mul(l).mul(.1).mul(e(1).sub(L.mul(.5)));v.assign(C),M.assign(j),y.assign(T),D.assign(L),F.assign(Lt(L,s))}),H(s.clumpCount.greaterThan(0),()=>{const P=s.irregularity,k=s.clumpCount,B=g(a.add(500));H(B.greaterThan(P),()=>{const C=Mt(g(a.add(50)).mul(k)),T=C.div(k).mul(xt).add(g(C.add(1e3)).mul(.5)),L=g(C.add(2e3)).mul(.6).add(.2).mul(l),j=W(T).mul(L),J=q(T).mul(L),ot=g(C.add(3e3)).mul(80).add(30).mul(m(e(1.05),e(.7),s.bandClumpBoost)),st=g(a.add(51)).sub(.5).add(g(a.add(52)).sub(.5)).mul(2),nt=g(a.add(53)).sub(.5).add(g(a.add(54)).sub(.5)).mul(2);v.assign(j.add(st.mul(ot))),y.assign(J.add(nt.mul(ot)))}).Else(()=>{const C=g(a.add(60)).mul(xt),T=at(g(a.add(61))).mul(l);v.assign(W(C).mul(T).add(g(a.add(62)).sub(.5).mul(60))),y.assign(q(C).mul(T).add(g(a.add(63)).sub(.5).mul(60)))}),M.assign(g(a.add(70)).sub(.5).mul(l).mul(.12)),D.assign(at(v.mul(v).add(y.mul(y))).div(l)),F.assign(Lt(D,s))}),H(U.equal(0),()=>{const P=m(e(1),s.coreWeight.mul(.55).add(.45),s.bandBulgeBoost);r.assign(G(r.mul(P),e(.98))),f.assign(G(f.mul(P),e(.98))),h.assign(h.mul(m(e(1),e(1.35),s.bandBulgeBoost)))}).ElseIf(U.equal(1),()=>{const P=m(e(1),e(.62),s.peakAzimuthStrength);r.assign(r.mul(P)),f.assign(f.mul(m(e(1),e(.8),s.peakAzimuthStrength)))}).ElseIf(U.equal(2),()=>{const P=m(e(.72),e(1.48),Q.mul(s.peakAzimuthStrength)),k=m(e(.78),e(1.34),$(F.sub(.55).div(1.3),e(0),e(1)));r.assign(G(r.mul(P).mul(k),e(.98))),f.assign(G(f.mul(P),e(.98))),h.assign(h.mul(m(e(.92),e(1.4),Q.mul(s.peakAzimuthStrength))))});const z=fs(R(v,M,y),s);v.assign(z.x),M.assign(z.y),y.assign(z.z),D.assign(G(at(v.mul(v).add(y.mul(y))).div(l),e(1)));const _=at(v.mul(v).add(y.mul(y)));H(_.lessThan(c),()=>{const P=fe(y,v),k=c.add(g(a.add(800)).mul(l.mul(.1)));v.assign(W(P).mul(k)),y.assign(q(P).mul(k))});const X=R(v,M,y);t.positionBuffer.element(o).assign(X),t.originalPositionBuffer.element(o).assign(X);const E=g(a.add(900)),O=g(a.add(901)),N=e(0).toVar(),V=e(0).toVar(),Z=e(0).toVar();H(S.equal(0),()=>{N.assign(E.mul(.111).add(.667)),V.assign(.3),Z.assign(r.mul(.4))}).ElseIf(S.equal(2),()=>{H(E.lessThan(e(.6)),()=>{N.assign(E.div(.6).mul(.097).add(.028)),V.assign(.5)}).Else(()=>{N.assign(E.sub(.6).div(.4).mul(.083).add(.556)),V.assign(.35)}),Z.assign(r.mul(.85))}).Else(()=>{const P=rt($(D,e(0),e(1)),e(.6)),k=s.bandHotMix.sub(s.bandDustMix).mul(.16),B=$(m(e(.58),e(.3),P).sub(k),e(.12),e(.8)),C=$(m(e(.78),e(.45),P).sub(k.mul(.75)),e(.22),e(.9)),T=$(m(e(.88),e(.55),P).sub(k.mul(.45)),e(.35),e(.96)),L=$(m(e(.93),e(.65),P).sub(k.mul(.25)),e(.45),e(.98)),j=$(m(e(.98),e(.87),P).sub(k.mul(.1)),e(.7),e(.995));H(E.lessThan(B),()=>{N.assign(e(.028).add(O.sub(.5).mul(.022))),V.assign(.85)}).ElseIf(E.lessThan(C),()=>{N.assign(e(.069).add(O.sub(.5).mul(.022))),V.assign(.6)}).ElseIf(E.lessThan(T),()=>{N.assign(e(.133).add(O.sub(.5).mul(.014))),V.assign(.22)}).ElseIf(E.lessThan(L),()=>{N.assign(e(.153).add(O.sub(.5).mul(.011))),V.assign(.12)}).ElseIf(E.lessThan(j),()=>{N.assign(e(.597).add(O.sub(.5).mul(.042))),V.assign(.25)}).Else(()=>{N.assign(e(.625).add(O.sub(.5).mul(.028))),V.assign(.45)}),Z.assign(r.mul(.6))});const et=ms(N,V,Z);t.colorBuffer.element(o).assign(It(et.x,et.y,et.z,f)),t.velocityBuffer.element(o).assign(R(0,0,0))})().compute(n)}function bs(n,t,s){return Y(()=>{const o=Et,a=t.positionBuffer.element(o).toVar(),l=t.originalPositionBuffer.element(o);H(s.barLength.greaterThan(0),()=>{const d=it(R(a.x,e(0),a.z)),p=s.rotationSpeed.mul(s.deltaTime).negate();H(d.lessThan(s.barLength),()=>{a.assign(Ft(a,p)),t.originalPositionBuffer.element(o).assign(Ft(l,p))}).Else(()=>{a.assign(pt(a,s.rotationSpeed,s.deltaTime)),t.originalPositionBuffer.element(o).assign(pt(l,s.rotationSpeed,s.deltaTime))})}).Else(()=>{const d=pt(a,s.rotationSpeed,s.deltaTime);a.assign(d),t.originalPositionBuffer.element(o).assign(pt(l,s.rotationSpeed,s.deltaTime))}),t.positionBuffer.element(o).assign(a);const c=t.layerBuffer.element(o);H(c.equal(2),()=>{const d=t.colorBuffer.element(o),p=o.toFloat().mul(.7831),w=q(s.time.mul(2).add(p)).mul(.15).add(.85),S=d.w;t.colorBuffer.element(o).w.assign(S.mul(w))})})().compute(n)}function xs(){return{mvpRow0:x(new Xt),mvpRow1:x(new Xt),mvpRow3:x(new Xt),viewZRow:x(new Xt),bhViewZ:x(0),bhNdcX:x(0),bhNdcY:x(0),ndcRadiusX:x(.04),ndcRadiusY:x(.04),depthThreshold:x(6),depthSoftness:x(10)}}function ys(n,t,s){return Y(()=>{const o=Et,a=t.positionBuffer.element(o),l=s.mvpRow0,c=s.mvpRow1,d=s.mvpRow3,p=s.viewZRow,w=l.x.mul(a.x).add(l.y.mul(a.y)).add(l.z.mul(a.z)).add(l.w),S=c.x.mul(a.x).add(c.y.mul(a.y)).add(c.z.mul(a.z)).add(c.w),u=d.x.mul(a.x).add(d.y.mul(a.y)).add(d.z.mul(a.z)).add(d.w),h=p.x.mul(a.x).add(p.y.mul(a.y)).add(p.z.mul(a.z)).add(p.w),A=e(1).div(I(u,e(1e-4))),b=w.mul(A),r=S.mul(A),f=b.sub(s.bhNdcX).div(s.ndcRadiusX),v=r.sub(s.bhNdcY).div(s.ndcRadiusY),M=e(1).sub(tt(e(.75),e(1.25),at(f.mul(f).add(v.mul(v))))),y=tt(s.depthThreshold,s.depthThreshold.add(s.depthSoftness),h.sub(s.bhViewZ));t.foregroundAlphaBuffer.element(o).assign(M.mul(y))})().compute(n)}class Ss{constructor(t,s,i){const o=s.positionBuffer.toAttribute(),a=s.colorBuffer.toAttribute(),l=s.sizeBuffer.toAttribute(),c=s.foregroundAlphaBuffer.toAttribute(),d=Math.sqrt(6e4/t),p=i*.003*d,w=Ue();this.glowTexture=w;const S=we(w),u=h=>{const A=S.sample(ce()),b=a.w.mul(A.w).mul(h),r=m(R(a.x,a.y,a.z).mul(1.32),R(1,1,1),e(.12)),f=m(r,R(1,1,1),e(.92)),v=r.mul(A.x).add(f.mul(A.y.mul(1.35)));return It(v.mul(b),b)};this.material=new ne,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=ae,this.material.positionNode=o,this.material.scaleNode=l.mul(p),this.material.colorNode=u(e(1).sub(c)),this.sprite=new ie(this.material),this.sprite.count=t,this.sprite.frustumCulled=!1,this.foregroundMaterial=new ne,this.foregroundMaterial.transparent=!0,this.foregroundMaterial.depthWrite=!1,this.foregroundMaterial.blending=ae,this.foregroundMaterial.positionNode=o,this.foregroundMaterial.scaleNode=l.mul(p),this.foregroundMaterial.colorNode=u(c),this.foregroundSprite=new ie(this.foregroundMaterial),this.foregroundSprite.count=t,this.foregroundSprite.frustumCulled=!1,this.foregroundSprite.renderOrder=2}dispose(){this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}const As=Y(([n])=>{const t=I(n.r,I(n.g,n.b)),s=G(n.r,G(n.g,n.b)),i=t.sub(s),o=tt(e(.06),e(.3),i).mul(e(1).sub(tt(e(.28),e(.95),t)));return rt(I(n,R(0)),R(1.14,1.14,1.14)).mul(m(e(.9),e(.45),o)).mul(R(1.06,.93,.82))});class ws{constructor(t,s,i,o,a){this.uBHScreenPos=x(new Qt(.5,.5)),this.uLensStrength=x(0),this.uAspectRatio=x(1),this.postProcessing=new ze(t);const c=te(s,a).getTextureNode(),p=te(i,a).getTextureNode(),S=te(o,a).getTextureNode(),u=this.uBHScreenPos,h=this.uLensStrength,A=this.uAspectRatio,r=Y(()=>{const M=ke.toVar(),y=u.sub(M).toVar();y.x.mulAssign(A);const D=it(y),U=y.div(I(D,e(1e-4))),F=$(h.div(.03),e(0),e(1)),Q=m(e(.25),e(.55),F),z=tt(Q,e(0),D).toVar();z.mulAssign(z);const _=m(e(.012),e(.05),F),X=tt(_,_.mul(2.8),D),E=I(D,m(e(.028),e(.04),F)),O=h.mul(z).mul(X).mul(m(e(.15),e(.3),F).div(E)),N=U.mul(O).toVar();N.x.divAssign(A);const V=$(M.add(N),e(0),e(1)),Z=c.sample(V).toVar();Z.rgb.assign(As(Z.rgb));const et=m(e(.024),e(.09),F),P=m(e(.008),e(.024),F),B=Me(rt(D.sub(et).div(P),e(2)).negate()).mul(z).mul(X).mul(h).mul(m(e(10),e(16),F));return Z.rgb.addAssign(R(.72,.62,.46).mul(B.mul(.02))),Z})();this.bloomPassNode=Te(c),this.bloomPassNode.threshold.value=.2,this.bloomPassNode.strength.value=.12,this.bloomPassNode.radius.value=.08;const f=r.add(this.bloomPassNode),v=Y(()=>{const M=f,y=p,D=S,F=m(M.rgb,y.rgb.mul(R(1.05,.95,.84)),y.a).add(D.rgb),Q=I(M.a,I(y.a,D.a));return It(G(F,e(1)),Q)});this.postProcessing.outputNode=v()}render(){this.postProcessing.render()}updateBloom(t,s,i){this.bloomPassNode.strength.value=t,this.bloomPassNode.radius.value=s,this.bloomPassNode.threshold.value=i}updateLensing(t,s,i){this.uBHScreenPos.value.copy(t),this.uLensStrength.value=s,this.uAspectRatio.value=i}dispose(){}}const Ot=6.28318530718,zs=3e4;function ks(n){return n==="mobile"?1e4:zs}function jt(n,t){const s=tt(e(.18),e(.38),n),i=tt(e(.58),e(.82),n),o=m(t.coreWeight,t.midDiskWeight,s);return m(o,t.outerDiskWeight,i)}function Ms(n,t){const s=W(n.sub(t.peakAzimuthAngleA)).mul(.5).add(.5),i=W(n.sub(t.peakAzimuthAngleB)).mul(.5).add(.5);return I(s,i)}function Ts(n,t){const s=W(t.projectedAngle),i=q(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=m(e(1),t.projectedAxisRatio,t.projectedStrength),c=a.mul(l);return R(o.mul(s).sub(c.mul(i)),n.y,o.mul(i).add(c.mul(s)))}class Ds{constructor(t,s,i){const o=ks(i);this.positionBuffer=lt(o,"vec3"),this.originalPositionBuffer=lt(o,"vec3"),this.colorBuffer=lt(o,"vec3"),this.sizeBuffer=lt(o,"float");const a=this.positionBuffer,l=this.originalPositionBuffer,c=this.colorBuffer,d=this.sizeBuffer;this.computeInit=Y(()=>{const b=Et,r=b.toFloat().add(1e4),f=t.galaxyRadius,v=e(0).toVar(),M=e(0).toVar(),y=e(0).toVar(),D=e(0).toVar(),U=e(1).toVar(),F=e(0).toVar();H(t.numArms.greaterThan(0),()=>{const k=g(r.add(1)),B=I(t.spiralStart.mul(f),e(.001)),C=t.barLength.mul(.5),T=G(I(B,C),f.mul(.98)),L=at(k.mul(f.mul(f).sub(T.mul(T))).add(T.mul(T)));D.assign(L.div(f)),U.assign(jt(D,t));const J=Mt(g(r.add(2)).mul(t.numArms)).mul(Ot).div(t.numArms),ot=e(2.5),st=I(L.div(B),e(1)).log().div(I(t.spiralTightness,e(.001))).mul(ot),nt=J.add(st),mt=Ms(nt,t);F.assign(mt);const ft=q(t.peakAzimuthAngleA.sub(nt)).mul(W(nt.sub(t.peakAzimuthAngleA)).mul(.5).add(.5)).add(q(t.peakAzimuthAngleB.sub(nt)).mul(W(nt.sub(t.peakAzimuthAngleB)).mul(.5).add(.5))).mul(t.peakAzimuthStrength).mul(.26),vt=nt.add(ft),Tt=g(r.add(3)).sub(.5).mul(m(e(.2),e(.035),F.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))),St=g(r.add(4)).sub(.5).mul(t.armWidth).mul(m(e(.55),e(.12),F.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))).mul(m(e(.85),e(1.18),G(U,e(1.25)).sub(.25))),bt=vt.add(Tt);v.assign(W(bt).mul(L.add(St))),y.assign(q(bt).mul(L.add(St)));const At=e(1).sub(D).add(.15).mul(t.bandDiskThicknessScale);M.assign(g(r.add(5)).sub(.5).mul(f.mul(.03)).mul(At))}),H(t.numArms.equal(0).and(t.barLength.equal(0)).and(t.clumpCount.equal(0)).and(t.ellipticity.equal(0)).and(t.bulgeFraction.greaterThan(0)),()=>{const k=rt(g(r.add(1)),e(.5)).mul(f),B=g(r.add(2)).mul(Ot);D.assign(k.div(f)),U.assign(jt(D,t)),v.assign(W(B).mul(k)),y.assign(q(B).mul(k));const C=f.mul(.03).mul(e(1).sub(D.mul(.5))).mul(t.bandDiskThicknessScale);M.assign(g(r.add(5)).sub(.5).mul(C))}),H(t.ellipticity.greaterThan(0),()=>{const k=t.axisRatio,B=rt(g(r.add(1)),e(.4)).mul(f),C=g(r.add(2)).mul(Ot),T=B.mul(W(C)),L=B.mul(q(C)).mul(k);D.assign(at(T.mul(T).add(L.mul(L))).div(f)),U.assign(jt(D,t)),v.assign(T),y.assign(L),M.assign(g(r.add(5)).sub(.5).mul(f).mul(.08).mul(e(1).sub(D.mul(.5))))}),H(t.clumpCount.greaterThan(0),()=>{const k=t.clumpCount,B=Mt(g(r.add(2)).mul(k)),C=B.div(k).mul(Ot).add(g(B.add(5e3)).mul(.5)),T=g(B.add(6e3)).mul(.6).add(.2).mul(f),L=W(C).mul(T),j=q(C).mul(T),J=g(B.add(7e3)).mul(80).add(30),ot=g(r.add(3)).sub(.5).add(g(r.add(4)).sub(.5)).mul(2),st=g(r.add(7)).sub(.5).add(g(r.add(8)).sub(.5)).mul(2);v.assign(L.add(ot.mul(J))),y.assign(j.add(st.mul(J))),D.assign(at(v.mul(v).add(y.mul(y))).div(f)),U.assign(jt(D,t)),M.assign(g(r.add(5)).sub(.5).mul(f).mul(.1))});const Q=Ts(R(v,M,y),t);v.assign(Q.x),M.assign(Q.y),y.assign(Q.z),D.assign(G(at(v.mul(v).add(y.mul(y))).div(f),e(1)));const z=R(v,M,y);a.element(b).assign(z),l.element(b).assign(z);const _=R(.62,.7,.9),X=R(.92,.76,.62),E=m(_,X,t.bandDustMix),O=m(e(.7),e(1),t.bandDustLaneStrength),N=m(e(.58),e(1.3),F.mul(t.peakAzimuthStrength)),V=m(e(.72),e(1.22),G(U,e(1.3)).sub(.3)),Z=E.mul(e(.72).sub(D.mul(.28))).mul(O).mul(N).mul(V);c.element(b).assign(Z);const et=e(1).sub(D.mul(.5)).mul(m(e(.9),e(1.15),t.bandDustLaneStrength)),P=g(r.add(6)).mul(.5).add(.7).mul(et).mul(m(e(.8),e(1.35),F.mul(t.peakAzimuthStrength)));d.element(b).assign(P)})().compute(o),this.computeUpdate=Y(()=>{const b=Et,r=a.element(b).toVar(),f=l.element(b);H(t.barLength.greaterThan(0),()=>{const v=it(R(r.x,e(0),r.z)),M=t.rotationSpeed.mul(t.deltaTime).negate();H(v.lessThan(t.barLength),()=>{r.assign(Ft(r,M)),l.element(b).assign(Ft(f,M))}).Else(()=>{r.assign(pt(r,t.rotationSpeed,t.deltaTime)),l.element(b).assign(pt(f,t.rotationSpeed,t.deltaTime))})}).Else(()=>{r.assign(pt(r,t.rotationSpeed,t.deltaTime)),l.element(b).assign(pt(f,t.rotationSpeed,t.deltaTime))}),a.element(b).assign(r)})().compute(o),this.material=new ne,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=ae;const p=a.toAttribute(),w=c.toAttribute(),S=d.toAttribute();this.material.positionNode=p;const u=Y(()=>{const b=ce().sub(.5).mul(2),r=it(b),f=tt(1,0,r).mul(tt(1,.3,r));return It(w.x,w.y,w.z,f.mul(.015))})();this.material.colorNode=u;const h=Math.sqrt(6e4/o),A=s*.006*h;this.material.scaleNode=S.mul(A),this.sprite=new ie(this.material),this.sprite.count=o,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-1}dispose(){this.material.dispose()}}class Rs{constructor(t=60){this.uTime=x(0),this.uTiltX=x(0),this.uRotY=x(0),this.uLOD=x(0),this.quadSize=t;const s=new ve(1,4,4),i=new oe({visible:!1});this.depthMesh=new le(s,i);const o=this.uTime,a=this.uTiltX,l=this.uRotY,c=this.uLOD,d=Y(()=>{const w=ce().sub(.5).mul(2),S=it(w);H(S.greaterThan(1),()=>{De()});const u=R(0,-.1,0),h=e(2),A=l,b=a.add(1.2),r=R(h.mul(W(A)).mul(q(b)),h.mul(W(b)),h.mul(q(A)).mul(q(b))),f=ht(u.sub(r)),v=ht(ue(ht(R(0,1,-.1)),f)),M=ht(ue(f,v)),y=ht(f.mul(1.5).add(v.mul(w.x)).add(M.mul(w.y))),D=e(.13),U=e(.3),F=e(.04),Q=m(e(.018),e(.012),c),z=r.toVar(),_=y.toVar();z.addAssign(_.mul(ut(y.add(o)).mul(.01)));const X=m(e(.3),e(1),c),E=m(e(.005),e(.02),c);m(e(.1),e(.5),c);const O=R(0,0,0).toVar(),N=e(0).toVar(),V=e(0).toVar(),Z=R(1,.55,.12),et=R(1,.3,.03),P=R(.45,.1,.01),k=R(.25,.15,.05),B=o.mul(E).mul(30);Re(200,()=>{const L=ht(z),j=it(z),J=Q.mul(U).div(I(j.mul(j),e(.001))),ot=L.mul(J),st=ht(_.sub(ot)),nt=_.mul(Q);z.addAssign(nt);const mt=it(z);H(mt.lessThan(D),()=>{V.assign(1),he()});const ft=it(kt(z.x,z.z)),vt=z.y.div(F),Tt=I(e(0),e(1).sub(vt.mul(vt))),St=tt(e(1.3),e(.16),ft),bt=Tt.mul(St),At=ft.mul(4.27).sub(B),Dt=W(At),Ht=q(At),dt=R(z.x.mul(Dt).sub(z.z.mul(Ht)),z.y.mul(8),z.x.mul(Ht).add(z.z.mul(Dt))).mul(14),_t=se(dt).mul(.5).add(.5),Wt=se(dt.mul(2.03)).mul(.5).add(.5),Nt=se(dt.mul(4.01)).mul(.5).add(.5),Vt=_t.mul(.25).add(Wt.mul(.12)).add(Nt.mul(.06)).add(.55),Rt=fe(z.x.negate(),z.z.negate()),qt=e(1).add(W(Rt.add(B)).mul(.7)),Ut=$(ft.add(Vt.sub(.5).mul(.4)),e(0),e(1)),Pt=m(m(Z,et,tt(e(.05),e(.425),Ut)),P,tt(e(.425),e(1),Ut)),Ct=I(Vt,e(.3)),Bt=Pt.mul(Ct).mul(qt).mul(3).add(k.mul(bt).mul(2)),wt=bt.mul($(Ct.mul(2),e(0),e(1))),Jt=e(1).sub(N).mul(wt);O.assign(m(O,Bt,Jt)),N.assign($(m(N,e(1),wt),e(0),e(1))),z.addAssign(nt),_.assign(st),H(Kt(z,z).greaterThan(16).and(Kt(_,z).greaterThan(0)),()=>{he()})}),O.mulAssign(X);const C=e(1).sub(tt(e(.3),e(1),S));O.mulAssign(C);const T=I(N.mul(C),V);return It(O,T)}),p=new oe;p.transparent=!0,p.depthWrite=!1,p.side=Pe,p.fragmentNode=d(),this.mesh=new le(new Ce(1,1),p),this.mesh.scale.set(t,t,1),this.mesh.renderOrder=1}update(t,s,i,o,a,l){this.uTime.value=t,this.uTiltX.value=s,this.uRotY.value=i,this.mesh.quaternion.copy(o.quaternion);const c=o.position.length(),p=(o.fov??60)*Math.PI/180,w=a.y*l,S=this.quadSize/c*(w/(2*Math.tan(p/2)));this.uLOD.value=Math.min(Math.max((S-6)/220,0),1)}getLOD(){return this.uLOD.value}dispose(){this.mesh.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const Ps=`// ─── Hash functions ────────────────────────────────────────────────────────

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
`;function Cs(n,t){const s=t==="mobile",i=s?3:5,o=s?2:4,a=s?2:4,l=s?3:6,c=s?2:5,d=s?2:4;return n.replace(/\bSPIRAL_NOISE_ITER\b/g,String(i)).replace(/\bFBM_DETAIL_OCTAVES\b/g,String(o)).replace(/\bMAX_GALAXIES\b/g,String(a)).replace(/\bMAX_CLOUDS\b/g,String(l)).replace(/\bMAX_KNOTS\b/g,String(c)).replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g,(p,w)=>d>parseInt(w,10)?"true":"false")}function Bs(n){const t=[],s=/\bfn\s+[a-z_0-9]+\s*\(/gi;let i;const o=[];for(;(i=s.exec(n))!==null;)o.push(i.index);for(let a=0;a<o.length;a++){const l=o[a],c=n.indexOf("{",l);if(c===-1)continue;let d=0,p=c;for(;p<n.length&&(n[p]==="{"&&d++,!(n[p]==="}"&&(d--,d===0)));p++);t.push(n.substring(l,p+1))}return t}class Ls{constructor(t,s,i){this.uTime=x(0),this.uSeed=x(0),this.uNebulaIntensity=x(2.4),this.uSeed.value=s;const o=t*12,a=new ve(o,192,128),l=Cs(Ps,i),c=Bs(l),d=[];for(const A of c)d.push(Be(A,[...d]));const p=d[d.length-1],w=this.uTime,S=this.uSeed,u=this.uNebulaIntensity,h=Y(()=>{const A=ht(Le);return p(A,w,S,u)});this.material=new oe,this.material.side=Ee,this.material.depthWrite=!1,this.material.depthTest=!1,this.material.fragmentNode=h(),this.mesh=new le(a,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(t,s){this.uTime.value=t,this.mesh.position.copy(s.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const ge=new gt(0,1,0),Zt=new $t,pe=new He;function Es(n){return n==="mobile"?15e4:5e5}class Vs{constructor(t,s){this.initialized=!1,this.disposed=!1,this._bhScreenVec=new gt,this.animationId=0,this.lastFrameTime=0,this.galaxyRotation=0,this.orbitQuat=new $t,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.mouse3D=new gt(0,0,0),this.raycaster=new Fe,this.intersectionPlane=new Ie(new gt(0,1,0),0),this.mousePressed=!1,this.rendererSize=new Qt,this.dpr=1,this.animate=()=>{this.animationId=requestAnimationFrame(this.animate);const u=performance.now(),h=Math.min((u-this.lastFrameTime)/1e3,.033);this.lastFrameTime=u,this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const A=this.baseDistance/this.zoom,b=new gt(0,0,A).applyQuaternion(this.orbitQuat);this.camera.position.copy(b),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const r=Math.min(this.zoom/20,1),f=this.params.morphology,v=f.ellipticity>0||f.clumpCount>0?0:.02+.18*r*r;this.galaxyRotation+=h*v;const M=this.uniforms.time.value+h;if(this.uniforms.time.value=M,this.uniforms.deltaTime.value=h,this.uniforms.rotationSpeed.value=v,this.uniforms.mouse.value.copy(this.mouse3D),this.uniforms.mouseActive.value=this.mousePressed?1:0,this.initialized){this.renderer.compute(this.computeUpdate),this.renderer.compute(this.clouds.computeUpdate);const _=this.camera.matrixWorldInverse.elements;pe.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);const X=pe.elements;this.fgUniforms.mvpRow0.value.set(X[0],X[4],X[8],X[12]),this.fgUniforms.mvpRow1.value.set(X[1],X[5],X[9],X[13]),this.fgUniforms.mvpRow3.value.set(X[3],X[7],X[11],X[15]),this.fgUniforms.viewZRow.value.set(_[2],_[6],_[10],_[14]),this.fgUniforms.bhViewZ.value=_[14];const E=this._bhScreenVec.set(0,0,0).project(this.camera);this.fgUniforms.bhNdcX.value=E.x,this.fgUniforms.bhNdcY.value=E.y;const O=this.camera.position,N=O.length(),V=1-Math.abs(O.y)/Math.max(N,1e-4),Z=Gt.smoothstep(V,.55,.95);this.fgUniforms.depthThreshold.value=Gt.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),Z),this.fgUniforms.depthSoftness.value=Gt.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),Z);const et=this.params.galaxyRadius*.08,P=this.camera.fov*Math.PI/180,k=this.rendererSize.y*this.dpr,B=et/N*(k/(2*Math.tan(P/2))),C=Gt.lerp(.75,1.2,Z),T=this.canvas.clientWidth,L=this.canvas.clientHeight;this.fgUniforms.ndcRadiusX.value=Math.max(B*C/Math.max(T*.5,1),.04),this.fgUniforms.ndcRadiusY.value=Math.max(B*C/Math.max(L*.5,1),.04),this.renderer.compute(this.computeForeground)}this.backdrop.update(M,this.camera);const y=this.camera.position,D=Math.sqrt(y.x*y.x+y.z*y.z),U=Math.atan2(y.y,D),F=Math.atan2(y.x,y.z);this.blackHole.update(M,U,F,this.camera,this.rendererSize,this.dpr),this._bhScreenVec.set(0,0,0).project(this.camera);const Q=this.blackHole.getLOD(),z=Q*Q*.03;this.postProcessing.updateLensing(new Qt(this._bhScreenVec.x*.5+.5,this._bhScreenVec.y*.5+.5),z,this.camera.aspect),this.postProcessing.render()},this.canvas=t,this.galaxy=s,this.quality=Xe();const i=Es(this.quality);this.scene=new ee,this.bhScene=new ee,this.fgScene=new ee,this.params=me(s);const o=this.params.galaxyRadius;this.baseDistance=o*1.7;const a=t.clientWidth/t.clientHeight;this.camera=new _e(60,a,.1,this.baseDistance*20),this.buffers=gs(i),this.uniforms=ps(this.params),this.computeInit=vs(i,this.buffers,this.uniforms),this.computeUpdate=bs(i,this.buffers,this.uniforms),this.fgUniforms=xs(),this.computeForeground=ys(i,this.buffers,this.fgUniforms),this.backdrop=new Ls(this.baseDistance,s.pgc,this.quality),this.scene.add(this.backdrop.mesh),this.particles=new Ss(i,this.buffers,this.baseDistance),this.scene.add(this.particles.sprite),this.clouds=new Ds(this.uniforms,this.baseDistance,this.quality),this.scene.add(this.clouds.sprite),this.blackHole=new Rs(o*.08),this.bhScene.add(this.blackHole.depthMesh),this.bhScene.add(this.blackHole.mesh),this.fgScene.add(this.particles.foregroundSprite);const c=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=c,this.targetZoom=c;const{initRotY:d,initTiltX:p}=Ge(s),w=new $t().setFromAxisAngle(new gt(1,0,0),p),S=new $t().setFromAxisAngle(ge,d);this.orbitQuat.multiplyQuaternions(S,w),this.onPointerDown=u=>{this.isPinching||(this.isDragging=!0,this.lastX=u.clientX,this.lastY=u.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=u=>{if(this.isPinching||!this.isDragging)return;const h=u.clientX-this.lastX,A=u.clientY-this.lastY;this.velocityX=h*.005,this.velocityY=A*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=u.clientX,this.lastY=u.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=u=>{u.preventDefault();const h=this.targetZoom*.12;this.targetZoom+=u.deltaY>0?-h:h,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=u=>{if(u.touches.length===2){u.preventDefault(),this.isPinching=!0,this.isDragging=!1;const h=u.touches[0].clientX-u.touches[1].clientX,A=u.touches[0].clientY-u.touches[1].clientY;this.lastPinchDist=Math.sqrt(h*h+A*A)}},this.onTouchMove=u=>{if(u.touches.length===2){u.preventDefault();const h=u.touches[0].clientX-u.touches[1].clientX,A=u.touches[0].clientY-u.touches[1].clientY,b=Math.sqrt(h*h+A*A),r=(b-this.lastPinchDist)*.01;this.lastPinchDist=b,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+r))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onMouseDown=()=>{this.mousePressed=!0},this.onMouseUp=()=>{this.mousePressed=!1},this.onMouseMove=u=>{const h=new Qt(u.clientX/t.clientWidth*2-1,-(u.clientY/t.clientHeight)*2+1);this.raycaster.setFromCamera(h,this.camera),this.raycaster.ray.intersectPlane(this.intersectionPlane,this.mouse3D)},t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("mouseup",this.onMouseUp),t.addEventListener("mousemove",this.onMouseMove),this.resizeObserver=new ResizeObserver(()=>{const u=t.clientWidth,h=t.clientHeight;u===0||h===0||(this.renderer.setSize(u,h,!1),this.camera.aspect=u/h,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(t)}applyOrbitDelta(t,s){Zt.setFromAxisAngle(ge,-t),this.orbitQuat.premultiply(Zt);const i=new gt(1,0,0).applyQuaternion(this.orbitQuat);Zt.setFromAxisAngle(i,-s),this.orbitQuat.premultiply(Zt),this.orbitQuat.normalize()}async start(){const t=os(this.galaxy.pgc).catch(()=>null);this.renderer=new We({canvas:this.canvas,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Ye(this.quality))),this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight,!1),this.dpr=this.renderer.getPixelRatio(),this.renderer.getSize(this.rendererSize),await this.renderer.init(),this.postProcessing=new ws(this.renderer,this.scene,this.bhScene,this.fgScene,this.camera),await this.renderer.computeAsync(this.computeInit),await this.renderer.computeAsync(this.clouds.computeInit),this.initialized=!0,this.lastFrameTime=performance.now(),this.animate(),t.then(async s=>{if(!(!s||this.disposed||!this.initialized))try{if(this.params=me(this.galaxy,s.profile),ye(this.uniforms,this.params),this.disposed||(await this.renderer.computeAsync(this.computeInit),this.disposed))return;await this.renderer.computeAsync(this.clouds.computeInit)}catch(i){this.disposed||console.warn("Band-guided WebGPU upgrade failed; keeping procedural render:",i)}})}dispose(){this.disposed=!0,cancelAnimationFrame(this.animationId);const t=this.canvas;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("mouseup",this.onMouseUp),t.removeEventListener("mousemove",this.onMouseMove),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.clouds.dispose(),this.blackHole.dispose(),this.postProcessing.dispose(),this.renderer.dispose()}}export{Vs as GalaxySceneWebGPU};
