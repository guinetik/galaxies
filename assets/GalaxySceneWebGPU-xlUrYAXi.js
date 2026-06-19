import{a2 as q,a3 as yt,a4 as Z,a5 as e,a6 as P,a7 as k,a8 as dt,a9 as _,aa as O,ab as ft,ac as pt,ad as ee,ae as Mt,af as x,ag as Pt,ah as wt,ai as Q,aj as ct,ak as f,V as xt,al as Ot,am as D,an as ht,ao as ge,ap as We,aq as _t,ar as jt,as as Ce,at as se,A as ne,r as ae,au as Be,av as ie,k as oe,aw as Xe,ax as ce,ay as Ue,az as Oe,aA as qe,d as Fe,aB as pe,M as fe,aC as Ye,aD as ye,aE as Ge,aF as Se,x as je,l as Ze,aG as Qe,aH as Ke,aI as $e,aJ as Je,Q as te,aK as ts,aL as es,f as ss,n as Zt,S as de,P as ns,aM as as}from"./three-Dw_gp1Fk.js";import{m as Ae,c as is}from"./useGalaxyData-gHdKJrt4.js";import{a as Le,l as os,d as ls}from"./nsaMorphologyPointCloud-Ct5fnwAD.js";import{G as Ee}from"./index-DCX7Qjev.js";import{d as rs,c as cs,a as ds,r as ze,g as us,b as hs}from"./qualityDetect-C3IVo_e3.js";import{g as ms}from"./GalaxyTextures-UNEtq948.js";import"./sqljs-M9QnmiAb.js";import"./vue-vendor-BVmPiw82.js";const gs=8,ps=12,Rt=.015;function fs(n,t={}){const s=t.radialBinCount??gs,i=t.azimuthalBinCount??ps,o=vs(t.availability),a=Array.from({length:s},()=>({intensity:0,hot:0,stellar:0,dust:0,weight:0})),l=Array.from({length:i},()=>({intensity:0,weight:0}));let m=0,h=0,y=0,v=0,S=0;const A=(n.width-1)*.5,T=(n.height-1)*.5,c=Math.max(1,Math.hypot(A,T));for(let B=0;B<n.height;B+=1)for(let X=0;X<n.width;X+=1){const N=B*n.width+X,z=ve(n,N,o);if(z.intensity<=Rt)continue;const Y=X-A,lt=B-T,V=rt(Math.hypot(Y,lt)/c),I=Math.atan2(lt,Y);m+=z.hot,h+=z.stellar,y+=z.dust,V<=.22&&(v+=z.intensity),V<=.85&&(S+=z.intensity);const st=Math.min(s-1,Math.floor(V*s)),tt=a[st];if(tt.intensity+=z.intensity,tt.hot+=z.hot,tt.stellar+=z.stellar,tt.dust+=z.dust,tt.weight+=1,V>=.2&&V<=.88){const H=I<0?I+Math.PI*2:I,F=Math.min(i-1,Math.floor(H/(Math.PI*2)*i)),$=l[F];$.intensity+=z.intensity,$.weight+=1}}const d=xs(m,h,y),r=a.map((B,X)=>ys(B,X,s)),u=l.map((B,X)=>({angle:X/i*Math.PI*2,intensity:B.weight>0?B.intensity/B.weight:0})),g=S>0?rt(v/S):0,b=Ss(n),w=zs(u.map(B=>B.intensity)),M=As(n),R=Ms(n,o),et=rt((1-b)*.7+g*.3),K=rt(d.dust*(.55+b*.35+w*.25));return{availability:o,globalColorBalance:d,concentration:g,armContrast:w,clumpiness:M,filamentarity:b,diskThicknessBias:et,dustLaneStrength:K,projectedAxisRatio:R.axisRatio,projectedAngle:R.angle,projectedStrength:R.strength,radialProfile:r,azimuthalProfile:u}}function vs(n){const t=["u","g","r","i","z","nuv"],s={u:!0,g:!0,r:!0,i:!0,z:!0,nuv:!0},i={u:!1,g:!1,r:!1,i:!1,z:!1,nuv:!1};for(const o of t)(n==null?void 0:n[o])==="fallback"&&(s[o]=!1,i[o]=!0);return{real:s,fallback:i}}function ve(n,t,s){const i=Math.sqrt(rt(n.bands.u[t]??0)),o=Math.sqrt(rt(n.bands.g[t]??0)),a=Math.sqrt(rt(n.bands.r[t]??0)),l=Math.sqrt(rt(n.bands.i[t]??0)),m=Math.sqrt(rt(n.bands.z[t]??0)),h=Math.sqrt(rt(n.bands.nuv[t]??0)),y=s.real.u?1:0,v=s.real.i?1:0,S=s.real.z?1:0,A=s.real.nuv?1:0,T=y+A,c=T>0?(i*y+h*A)/T:bs(o,a),d=(o+a)*.5,r=v+S,u=r>0?(l*v+m*S)/r:0,g=u*.25+d*.4+c*.35;return{hot:c,stellar:d,dust:u,intensity:g}}function bs(n,t){return(n+t)*.5*.35}function xs(n,t,s){const i=n+t+s;return i<=0?{hot:0,stellar:0,dust:0}:{hot:n/i,stellar:t/i,dust:s/i}}function ys(n,t,s){return n.weight<=0?{radius:(t+.5)/s,intensity:0,hot:0,stellar:0,dust:0}:{radius:(t+.5)/s,intensity:n.intensity/n.weight,hot:n.hot/n.weight,stellar:n.stellar/n.weight,dust:n.dust/n.weight}}function Ss(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/64)),{field:s,w:i,h:o}=Le(n,t),a=Math.max(1,Math.min(3,Math.floor(Math.min(i,o)/12)));let l=0,m=0;for(let v=0;v<o;v+=1)for(let S=0;S<i;S+=1){const A=s[v*i+S];if(A<=Rt)continue;const{F:T}=os(s,i,o,S,v,a);l+=T*A,m+=A}const h=m>0?rt(l/m):0,y=ws(s,i,o);return rt(h*.35+y*.65)}function As(n){const t=Math.max(1,Math.floor(Math.max(n.width,n.height)/96)),{field:s,w:i,h:o}=Le(n,t);let a=0,l=0;for(let m=0;m<o;m+=1)for(let h=0;h<i;h+=1){const y=s[m*i+h];if(y<=Rt)continue;let v=0,S=0;for(let T=-1;T<=1;T+=1)for(let c=-1;c<=1;c+=1){if(c===0&&T===0)continue;const d=Math.max(0,Math.min(i-1,h+c)),r=Math.max(0,Math.min(o-1,m+T));v+=s[r*i+d],S+=1}const A=S>0?v/S:y;a+=Math.max(y-A,0),l+=y}return l>0?rt(a/l*3):0}function zs(n){const t=n.filter(o=>o>0);if(t.length===0)return 0;const s=t.reduce((o,a)=>o+a,0)/t.length;if(s<=1e-6)return 0;const i=t.reduce((o,a)=>{const l=a-s;return o+l*l},0)/t.length;return rt(Math.sqrt(i)/s/2)}function ws(n,t,s){let i=0,o=0,a=0;for(let c=0;c<s;c+=1)for(let d=0;d<t;d+=1){const r=n[c*t+d];r<=Rt||(i+=r,o+=d*r,a+=c*r)}if(i<=0)return 0;o/=i,a/=i;let l=0,m=0,h=0;for(let c=0;c<s;c+=1)for(let d=0;d<t;d+=1){const r=n[c*t+d];if(r<=Rt)continue;const u=d-o,g=c-a;l+=u*u*r,m+=u*g*r,h+=g*g*r}l/=i,m/=i,h/=i;const y=l+h;if(y<=1e-6)return 0;const v=l*h-m*m,S=Math.sqrt(Math.max(0,y*y-4*v)),A=(y+S)*.5,T=(y-S)*.5;return rt((A-T)/(A+T+1e-6))}function Ms(n,t){let s=0,i=0,o=0;for(let d=0;d<n.height;d+=1)for(let r=0;r<n.width;r+=1){const u=d*n.width+r,g=ve(n,u,t).intensity;g<=Rt||(s+=g,i+=r*g,o+=d*g)}if(s<=0)return{axisRatio:1,angle:0,strength:0};i/=s,o/=s;let a=0,l=0,m=0;for(let d=0;d<n.height;d+=1)for(let r=0;r<n.width;r+=1){const u=d*n.width+r,g=ve(n,u,t).intensity;if(g<=Rt)continue;const b=r-i,w=d-o;a+=b*b*g,l+=b*w*g,m+=w*w*g}a/=s,l/=s,m/=s;const h=a+m;if(h<=1e-6)return{axisRatio:1,angle:0,strength:0};const y=a*m-l*l,v=Math.sqrt(Math.max(0,h*h-4*y)),S=Math.max((h+v)*.5,1e-6),A=Math.max((h-v)*.5,1e-6),T=rt(Math.sqrt(A/S)),c=.5*Math.atan2(2*l,a-m);return{axisRatio:Math.max(T,.15),angle:Ts(c),strength:rt((1-T)*1.35)}}function rt(n){return Math.max(0,Math.min(1,n))}function Ts(n){const t=Math.PI,s=n%t;return s<0?s+t:s}async function ks(n){const t=await Ps(n);if(!t)return null;const s=await Ds(n,t);if(!(s!=null&&s.g)||!s.r||!s.i)return null;Cs(s);const{input:i,availability:o}=Bs(s),a=fs(i,{availability:Fs(o)});return{metadata:t,input:i,availability:o,profile:a}}async function Ps(n){try{const t=await fetch(`${Ee}/${n}/metadata.json`);return t.ok?await t.json():null}catch{return null}}async function Ds(n,t){const s=Rs(t),i=`${Ee}/${n}/`,o=await Promise.all(s.map(async a=>{try{const l=await fetch(`${i}${a}.png`);if(!l.ok){if(a==="g"||a==="r"||a==="i")throw new Error(`Missing required NSA band: ${a}`);return[a,null]}const m=await l.arrayBuffer(),h=ls(new Uint8Array(m)),y=h.depth===16?65535:255,v=new Float32Array(h.width*h.height);for(let S=0;S<v.length;S+=1)v[S]=h.data[S*h.channels]/y;return[a,{raw:v,width:h.width,height:h.height,range:t.data_ranges[a]??[0,1]}]}catch(l){if(a==="g"||a==="r"||a==="i")throw l;return[a,null]}})).catch(()=>null);return o?Object.fromEntries(o.filter(a=>a[1]!==null)):null}function Rs(n){const t=["i","r","g"];return n.bands.includes("u")&&t.push("u"),n.bands.includes("z")&&t.push("z"),n.bands.includes("nuv")&&t.push("nuv"),t}function Cs(n){const t=n.g;if(!t)return;const s=t.range[1]-t.range[0];for(const i of["u","z","nuv"]){const o=n[i];if(!o)continue;o.range[1]-o.range[0]<s*.01&&delete n[i]}}function Bs(n){const t=a=>n[a]?a:a==="u"?"g":a==="z"?"i":n.u?"u":"g",s=n.i??n.g??n.r;if(!s)throw new Error("Cannot build point-cloud input without core NSA bands");const i={u:t("u"),g:t("g"),r:t("r"),i:t("i"),z:t("z"),nuv:t("nuv")},o={real:{u:i.u==="u",g:i.g==="g",r:i.r==="r",i:i.i==="i",z:i.z==="z",nuv:i.nuv==="nuv"},fallback:{u:i.u!=="u",g:!1,r:!1,i:!1,z:i.z!=="z",nuv:i.nuv!=="nuv"}};return{input:{width:s.width,height:s.height,bands:{u:Ht(n[i.u]),g:Ht(n[i.g]),r:Ht(n[i.r]),i:Ht(n[i.i]),z:Ht(n[i.z]),nuv:Ht(n[i.nuv])}},availability:o}}function Ht(n){const[t,s]=n.range,i=s-t,o=new Float32Array(n.raw.length);let a=0;for(let l=0;l<n.raw.length;l+=1){const m=n.raw[l]*i+t,h=Math.max(m,0);o[l]=h,h>a&&(a=h)}if(a>0)for(let l=0;l<o.length;l+=1)o[l]/=a;return o}function Fs(n){return{u:n.fallback.u?"fallback":"real",g:"real",r:"real",i:"real",z:n.fallback.z?"fallback":"real",nuv:n.fallback.nuv?"fallback":"real"}}const p=q(([n])=>{const t=yt(n.mul(.1031)),s=t.add(19.19);return yt(s.mul(s.add(47.43)).mul(t))}),zt=q(([n])=>{const t=yt(n.mul(k(.16532,.17369,.15787))).toVar();return t.addAssign(ee(t,t.yzx.add(19.19))),yt(t.x.mul(t.y).mul(t.z))}),Qt=q(([n])=>yt(_(ee(n,Pt(2.31,53.21)).mul(124.123)).mul(412))),we=q(([n])=>{const t=Mt(n),s=yt(n),i=s.mul(s).mul(e(3).sub(s.mul(2)));return x(x(Qt(t),Qt(t.add(Pt(1,0))),i.x),x(Qt(t.add(Pt(0,1))),Qt(t.add(Pt(1,1))),i.x),i.y)}),ue=q(([n])=>{const t=Mt(n),s=yt(n),i=s.mul(s).mul(e(3).sub(s.mul(2))),o=zt(t.add(k(0,0,0))),a=zt(t.add(k(1,0,0))),l=zt(t.add(k(0,1,0))),m=zt(t.add(k(1,1,0))),h=zt(t.add(k(0,0,1))),y=zt(t.add(k(1,0,1))),v=zt(t.add(k(0,1,1))),S=zt(t.add(k(1,1,1))),A=x(o,a,i.x),T=x(l,m,i.x),c=x(h,y,i.x),d=x(v,S,i.x),r=x(A,T,i.y),u=x(c,d,i.y);return x(r,u,i.z).mul(2).sub(1)});q(([n,t])=>ft(n).sub(t));q(([n,t])=>{const s=Pt(ft(n.xz).sub(t.x),n.y);return ft(s).sub(t.y)});const qt=q(([n,t])=>{const s=_(t),i=O(t),o=n.x.mul(s).sub(n.z.mul(i)),a=n.x.mul(i).add(n.z.mul(s));return k(o,n.y,a)}),kt=q(([n,t,s,i,o])=>{const a=ft(k(n.x,e(0),n.z)),l=P(a,i).div(i),m=e(1).div(pt(l,s)),h=t.mul(m).mul(o).negate();return qt(n,h)});q(([n,t,s,i,o,a])=>{const l=t.sub(n),m=ft(l),h=s.mul(P(e(0),e(1).sub(m.div(o))));return wt(l).mul(i).mul(h).mul(a).negate()});q(([n,t,s,i])=>t.sub(n).mul(s).mul(i));const Ls=q(([n,t,s])=>{const i=t.mul(Z(s,e(1).sub(s))),o=yt(n.mul(12).add(0).div(12)).mul(12),a=yt(n.mul(12).add(8).div(12)).mul(12),l=yt(n.mul(12).add(4).div(12)).mul(12),m=s.sub(i.mul(P(Z(Z(o.sub(3),e(9).sub(o)),e(1)),e(-1)))),h=s.sub(i.mul(P(Z(Z(a.sub(3),e(9).sub(a)),e(1)),e(-1)))),y=s.sub(i.mul(P(Z(Z(l.sub(3),e(9).sub(l)),e(1)),e(-1))));return k(m,h,y)});q(([n])=>{const t=dt(n,e(1e3),e(4e4)).div(100),s=pt(t.sub(60),e(-.1332)).mul(329.6987).div(255),i=dt(x(e(1),s,Q(e(65.9),e(66.1),t)),e(0),e(1)),o=t.log().mul(99.4708).sub(161.1196).div(255),a=pt(t.sub(60),e(-.0755)).mul(288.1222).div(255),l=dt(x(o,a,Q(e(65.9),e(66.1),t)),e(0),e(1)),m=P(t.sub(10),e(1)).log().mul(138.5177).sub(305.0448).div(255),h=x(e(0),m,Q(e(19),e(20),t)),y=dt(x(h,e(1),Q(e(65.9),e(66.1),t)),e(0),e(1)),v=S=>x(S.div(12.92),pt(S.add(.055).div(1.055),e(2.4)),Q(e(.04045),e(.04046),S));return k(v(i),v(l),v(y))});const Es=q(([n])=>{const t=we(n).mul(.5).add(.5).toVar();return t.addAssign(we(n.mul(2)).mul(.25).add(.125)),dt(t,e(0),e(1))});function Is(n){return{positionBuffer:ct(n,"vec3"),originalPositionBuffer:ct(n,"vec3"),velocityBuffer:ct(n,"vec3"),colorBuffer:ct(n,"vec4"),sizeBuffer:ct(n,"float"),layerBuffer:ct(n,"float"),foregroundAlphaBuffer:ct(n,"float")}}function Hs(n){const t={numArms:f(0),armWidth:f(0),spiralTightness:f(0),spiralStart:f(0),bulgeRadius:f(0),fieldStarFraction:f(0),irregularity:f(0),barLength:f(0),barWidth:f(0),axisRatio:f(1),ellipticity:f(0),bulgeFraction:f(0),diskThickness:f(0),clumpCount:f(0),galaxyRadius:f(0),galaxySeed:f(0),bandArmScatterScale:f(1),bandBulgeBoost:f(0),bandClumpBoost:f(0),bandHotMix:f(.5),bandDustMix:f(.5),bandDiskThicknessScale:f(1),bandDustLaneStrength:f(0),coreWeight:f(1),midDiskWeight:f(1),outerDiskWeight:f(1),peakAzimuthAngleA:f(0),peakAzimuthAngleB:f(Math.PI),peakAzimuthStrength:f(0),projectedAxisRatio:f(1),projectedAngle:f(0),projectedStrength:f(0),time:f(0),deltaTime:f(.016),rotationSpeed:f(.033),rotationFalloff:f(1),rotationTurnover:f(45),mouse:f(new xt(0,0,0)),mouseActive:f(0),mouseForce:f(7),mouseRadius:f(n.galaxyRadius*.3),dustStrength:f(0),dustArmBoost:f(0),orbitCycleDuration:f(60),orbitFadeIn:f(.08),orbitFadeOut:f(.08)};return Ie(t,n),t}function Ie(n,t){const s=t.morphology,i=rs(t.bandProfile);n.numArms.value=s.numArms,n.armWidth.value=s.armWidth*t.galaxyRadius,n.spiralTightness.value=s.spiralTightness,n.spiralStart.value=s.spiralStart,n.bulgeRadius.value=s.bulgeRadius*t.galaxyRadius,n.fieldStarFraction.value=s.fieldStarFraction,n.irregularity.value=s.irregularity,n.barLength.value=s.barLength*t.galaxyRadius,n.barWidth.value=s.barWidth*t.galaxyRadius,n.axisRatio.value=s.axisRatio,n.ellipticity.value=s.ellipticity,n.bulgeFraction.value=s.bulgeFraction,n.diskThickness.value=s.diskThickness,n.clumpCount.value=s.clumpCount,n.galaxyRadius.value=t.galaxyRadius,n.galaxySeed.value=t.starCount*.61803398875,n.bandArmScatterScale.value=i.armScatterScale,n.bandBulgeBoost.value=i.bulgeBoost,n.bandClumpBoost.value=i.clumpBoost,n.bandHotMix.value=i.hotMix,n.bandDustMix.value=i.dustMix,n.bandDiskThicknessScale.value=i.diskThicknessScale,n.bandDustLaneStrength.value=i.dustLaneStrength,n.coreWeight.value=i.coreWeight,n.midDiskWeight.value=i.midDiskWeight,n.outerDiskWeight.value=i.outerDiskWeight,n.peakAzimuthAngleA.value=i.peakAzimuthAngleA,n.peakAzimuthAngleB.value=i.peakAzimuthAngleB,n.peakAzimuthStrength.value=i.peakAzimuthStrength,n.projectedAxisRatio.value=i.projectedAxisRatio,n.projectedAngle.value=i.projectedAngle,n.projectedStrength.value=i.projectedStrength,n.dustStrength.value=s.dustStrength,n.dustArmBoost.value=s.dustArmBoost,n.mouseRadius.value=t.galaxyRadius*.3,n.rotationFalloff.value=t.rotationFalloff,n.rotationTurnover.value=t.rotationTurnover}const bt=6.28318530718,he=(n,t)=>{const s=dt(t,e(.02),e(.98));return s.div(e(1).sub(s)).log().mul(n).mul(.45)};function Ut(n,t){const s=Q(e(.18),e(.38),n),i=Q(e(.58),e(.82),n),o=x(t.coreWeight,t.midDiskWeight,s);return x(o,t.outerDiskWeight,i)}function _s(n,t){const s=_(t.projectedAngle),i=O(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=x(e(1),t.projectedAxisRatio,t.projectedStrength),m=a.mul(l);return k(o.mul(s).sub(m.mul(i)),n.y,o.mul(i).add(m.mul(s)))}function Ns(n,t,s){return q(()=>{const o=Ot,a=o.toFloat(),l=s.galaxyRadius,m=l.mul(.06),h=x(e(.04),e(.08),dt(s.bandHotMix.mul(.7).add(s.bandClumpBoost.mul(.3)),e(0),e(1))),y=p(a.add(100)),v=e(0).toVar();D(y.greaterThan(e(1).sub(h)),()=>{v.assign(1)}),t.layerBuffer.element(o).assign(v);const S=p(a.add(200)),A=e(0).toVar();D(v.equal(0),()=>{A.assign(S.mul(1.4).add(.6))}).Else(()=>{A.assign(S.mul(5).add(3).mul(x(e(.9),e(1.4),s.bandHotMix)))}),t.sizeBuffer.element(o).assign(A);const T=p(a.add(300)),c=p(a.add(400)),d=e(0).toVar(),r=e(0).toVar();D(v.equal(0),()=>{d.assign(T.mul(.4).add(.32).mul(x(e(.95),e(1.15),s.bandHotMix))),r.assign(c.mul(.4).add(.4))}).Else(()=>{d.assign(T.mul(.16).add(.64).mul(x(e(.95),e(1.25),s.bandHotMix))),r.assign(c.mul(.24).add(.56).mul(x(e(.95),e(1.2),s.bandClumpBoost)))});const u=e(0).toVar(),g=e(0).toVar(),b=e(0).toVar(),w=e(0).toVar(),M=e(-1).toVar(),R=e(1).toVar(),et=e(0).toVar();D(s.numArms.greaterThan(0),()=>{const L=p(a.add(500)),C=s.bulgeRadius,G=Z(e(.25),e(.1).add(e(.2).mul(C.div(l)))),U=s.fieldStarFraction;D(L.lessThan(G),()=>{M.assign(0);const E=pt(p(a.add(10)),e(.6)).mul(C),j=p(a.add(11)).mul(bt),at=p(a.add(12)).sub(.5).mul(C).mul(.5);u.assign(_(j).mul(E)),g.assign(at),b.assign(O(j).mul(E)),w.assign(E.div(C).mul(.3)),R.assign(s.coreWeight)}).ElseIf(L.lessThan(G.add(U)),()=>{M.assign(1);const E=ht(p(a.add(20))).mul(l),j=p(a.add(21)).mul(bt),at=he(l.mul(.08),p(a.add(22)));u.assign(_(j).mul(E)),g.assign(at),b.assign(O(j).mul(E)),w.assign(E.div(l)),R.assign(Ut(w,s))}).Else(()=>{M.assign(2);const E=s.numArms,at=Mt(p(a.add(30)).mul(E)).mul(bt).div(E),ot=P(s.spiralStart.mul(l),e(.001)),ut=s.barLength.mul(.5),mt=Z(P(ot,ut),l.mul(.98)),Dt=p(a.add(31)),vt=ht(Dt.mul(l.mul(l).sub(mt.mul(mt))).add(mt.mul(mt))),Ct=vt.div(l),Tt=Ut(Ct,s);R.assign(Tt);const Bt=e(2.5),At=P(vt.div(ot),e(1)).log().div(P(s.spiralTightness,e(.001))).mul(Bt),St=vt.div(l).mul(.5).add(.5),Ft=p(a.add(32)).sub(.5).add(p(a.add(33)).sub(.5)).mul(s.armWidth).mul(St).mul(s.bandArmScatterScale),Lt=s.irregularity.mul(p(a.add(35)).sub(.5)).mul(30),Et=p(a.add(34)).sub(.5).mul(.3),gt=At.add(at).add(Et),It=_(gt.sub(s.peakAzimuthAngleA)).mul(.5).add(.5),Nt=_(gt.sub(s.peakAzimuthAngleB)).mul(.5).add(.5),Yt=P(It,Nt);et.assign(Yt);const Gt=O(s.peakAzimuthAngleA.sub(gt)).mul(It).add(O(s.peakAzimuthAngleB.sub(gt)).mul(Nt)).mul(s.peakAzimuthStrength).mul(.22),Vt=gt.add(Gt),Wt=Vt.add(e(Math.PI/2)),be=x(e(.86),e(1.18),dt(Tt.sub(.55).div(1.3),e(0),e(1))),Xt=dt(vt.mul(be),mt,l),xe=Ft.mul(x(e(1.3),e(.42),Yt.mul(s.peakAzimuthStrength))),le=_(Vt).mul(Xt.add(Lt)).add(_(Wt).mul(xe)),re=O(Vt).mul(Xt.add(Lt)).add(O(Wt).mul(xe)),He=Xt.div(l),_e=l.mul(.06).mul(e(1).sub(He.mul(.7))).mul(s.bandDiskThicknessScale),Ne=he(_e,p(a.add(36)));u.assign(le),g.assign(Ne),b.assign(re);const Ve=ht(le.mul(le).add(re.mul(re)));w.assign(Ve.div(l))}),D(s.barLength.greaterThan(0),()=>{const E=p(a.add(600));D(E.lessThan(.25),()=>{const j=s.barLength,at=s.barWidth,ot=p(a.add(40)).sub(.5).mul(2).mul(j),ut=p(a.add(41)).sub(.5).mul(at);u.assign(ot),g.assign(p(a.add(42)).sub(.5).mul(l).mul(.04)),b.assign(ut),w.assign(e(.1))})})}),D(s.numArms.equal(0).and(s.barLength.equal(0)).and(s.clumpCount.equal(0)).and(s.ellipticity.equal(0)).and(s.bulgeFraction.greaterThan(0)),()=>{const L=s.bulgeRadius,C=pt(p(a.add(10)),e(.55)).mul(l),G=p(a.add(11)).mul(bt),U=C.div(l),E=l.mul(.06).mul(pt(P(e(1).sub(U),e(0)),e(2))).mul(s.bandDiskThicknessScale),j=he(E,p(a.add(12)));u.assign(_(G).mul(C)),g.assign(j),b.assign(O(G).mul(C));const at=dt(e(1).sub(C.div(P(L,e(1)))),e(0),e(1)),ot=e(1).add(at.mul(.4)).add(s.bandBulgeBoost.mul(.25));d.assign(Z(d.mul(ot),e(.95))),r.assign(Z(r.mul(ot),e(.95))),A.assign(A.mul(e(1).add(at.mul(.3)))),w.assign(U.mul(.2)),R.assign(Ut(U,s))}),D(s.ellipticity.greaterThan(0),()=>{const L=s.axisRatio,C=pt(p(a.add(10)),e(.4)).mul(l),G=p(a.add(11)).mul(bt),U=C.mul(_(G)),E=C.mul(O(G)).mul(L),j=ht(U.mul(U).add(E.mul(E))).div(l),at=p(a.add(12)).sub(.5).mul(l).mul(.1).mul(e(1).sub(j.mul(.5)));u.assign(U),g.assign(at),b.assign(E),w.assign(j),R.assign(Ut(j,s))}),D(s.clumpCount.greaterThan(0),()=>{const L=s.irregularity,C=s.clumpCount,G=p(a.add(500));D(G.greaterThan(L),()=>{const U=Mt(p(a.add(50)).mul(C)),E=U.div(C).mul(bt).add(p(U.add(1e3)).mul(.5)),j=p(U.add(2e3)).mul(.6).add(.2).mul(l),at=_(E).mul(j),ot=O(E).mul(j),ut=p(U.add(3e3)).mul(80).add(30).mul(x(e(1.05),e(.7),s.bandClumpBoost)),mt=p(a.add(51)).sub(.5).add(p(a.add(52)).sub(.5)).mul(2),Dt=p(a.add(53)).sub(.5).add(p(a.add(54)).sub(.5)).mul(2);u.assign(at.add(mt.mul(ut))),b.assign(ot.add(Dt.mul(ut)))}).Else(()=>{const U=p(a.add(60)).mul(bt),E=ht(p(a.add(61))).mul(l);u.assign(_(U).mul(E).add(p(a.add(62)).sub(.5).mul(60))),b.assign(O(U).mul(E).add(p(a.add(63)).sub(.5).mul(60)))}),g.assign(p(a.add(70)).sub(.5).mul(l).mul(.12)),w.assign(ht(u.mul(u).add(b.mul(b))).div(l)),R.assign(Ut(w,s))});const K=p(a.add(700));D(K.lessThan(e(.03)),()=>{const L=e(1).add(pt(p(a.add(71)),e(.5)).mul(.6)).mul(l),C=p(a.add(72)).mul(2).sub(1),G=p(a.add(73)).mul(bt),U=ht(e(1).sub(C.mul(C)));u.assign(L.mul(U).mul(_(G))),g.assign(L.mul(C).mul(.7)),b.assign(L.mul(U).mul(O(G))),d.assign(d.mul(.45)),A.assign(p(a.add(200)).mul(1.4).add(.6)),w.assign(e(1))}),D(M.equal(0),()=>{const L=x(e(1),s.coreWeight.mul(.55).add(.45),s.bandBulgeBoost);d.assign(Z(d.mul(L),e(.98))),r.assign(Z(r.mul(L),e(.98))),A.assign(A.mul(x(e(1),e(1.35),s.bandBulgeBoost)))}).ElseIf(M.equal(1),()=>{const L=x(e(1),e(.62),s.peakAzimuthStrength);d.assign(d.mul(L)),r.assign(r.mul(x(e(1),e(.8),s.peakAzimuthStrength)))}).ElseIf(M.equal(2),()=>{const L=x(e(.72),e(1.48),et.mul(s.peakAzimuthStrength)),C=x(e(.78),e(1.34),dt(R.sub(.55).div(1.3),e(0),e(1)));d.assign(Z(d.mul(L).mul(C),e(.98))),r.assign(Z(r.mul(L),e(.98))),A.assign(A.mul(x(e(.92),e(1.4),et.mul(s.peakAzimuthStrength))))});const B=_s(k(u,g,b),s);u.assign(B.x),g.assign(B.y),b.assign(B.z),w.assign(Z(ht(u.mul(u).add(b.mul(b))).div(l),e(1)));const X=ht(u.mul(u).add(b.mul(b)));D(X.lessThan(m),()=>{const L=ge(b,u),C=m.add(p(a.add(800)).mul(l.mul(.1)));u.assign(_(L).mul(C)),b.assign(O(L).mul(C))});const N=k(u,g,b);t.positionBuffer.element(o).assign(N),t.originalPositionBuffer.element(o).assign(N);const z=p(a.add(900)),Y=p(a.add(901)),lt=p(a.add(902)),V=e(0).toVar(),I=e(0).toVar(),st=e(0).toVar(),tt=e(.72).toVar(),H=e(.2).toVar(),F=e(.065).toVar();D(M.equal(2),()=>{tt.assign(.46),H.assign(.2),F.assign(.26)}).ElseIf(M.equal(1),()=>{tt.assign(.78),H.assign(.17),F.assign(.03)}).ElseIf(M.equal(0),()=>{tt.assign(.68),H.assign(.12),F.assign(.01)}),D(s.ellipticity.greaterThan(0),()=>{tt.assign(.74),H.assign(.11),F.assign(.005)});const $=tt,nt=tt.add(H),it=nt.add(F);D(lt.lessThan($),()=>{V.assign(e(.028).add(Y.sub(.5).mul(.022))),I.assign(.85)}).ElseIf(lt.lessThan(nt),()=>{D(z.lessThan(e(.4)),()=>{V.assign(e(.069).add(Y.sub(.5).mul(.022))),I.assign(.6)}).Else(()=>{V.assign(e(.133).add(Y.sub(.5).mul(.014))),I.assign(.22)})}).ElseIf(lt.lessThan(it),()=>{D(z.lessThan(e(.55)),()=>{V.assign(e(.597).add(Y.sub(.5).mul(.042))),I.assign(.28)}).Else(()=>{V.assign(e(.625).add(Y.sub(.5).mul(.028))),I.assign(.5)})}).Else(()=>{V.assign(e(.042).add(Y.sub(.5).mul(.033))),I.assign(.7)}),st.assign(d.mul(.6)),D(v.equal(1),()=>{D(z.lessThan(e(.6)),()=>{V.assign(z.div(.6).mul(.097).add(.028)),I.assign(.5)}).Else(()=>{V.assign(z.sub(.6).div(.4).mul(.083).add(.556)),I.assign(.35)}),st.assign(d.mul(.85))});const W=Ls(V,I,st),J=k(W.x,W.y,W.z).toVar();D(s.dustStrength.greaterThan(0),()=>{const L=We(g),C=ht(u.mul(u).add(b.mul(b))),G=l.mul(.34),U=l.mul(.06).mul(.18),E=e(0).sub(C.div(P(G,e(.01)))).exp(),j=e(0).sub(L.div(P(U,e(.01)))).exp(),at=E.mul(j),ot=Q(s.bulgeRadius.mul(.4),s.bulgeRadius.mul(1.2),C),ut=e(0).toVar();D(s.numArms.greaterThan(0).and(s.dustArmBoost.greaterThan(0)),()=>{const Ct=ge(b,u),Tt=s.armWidth.div(l).mul(.5),Bt=P(s.spiralStart.mul(l),e(.001)),At=e(0).toVar(),St=Ft=>{D(s.numArms.greaterThan(Ft),()=>{const Lt=e(Ft).mul(bt).div(s.numArms),Et=P(C.div(Bt),e(1)).log().div(P(s.spiralTightness,e(.001))).mul(2.5).add(Lt),gt=Ct.sub(Et).toVar();gt.assign(gt.sub(Mt(gt.div(bt).add(.5)).mul(bt)));const It=e(0).sub(gt.mul(gt).div(Tt.mul(Tt).mul(2))).exp();At.assign(P(At,It))})};St(0),St(1),St(2),St(3),St(4),St(5),ut.assign(At.mul(s.dustArmBoost))});const mt=e(8).div(P(l,e(1))),Dt=Es(Pt(u.mul(mt),b.mul(mt))),vt=s.dustStrength.mul(at).mul(ot).mul(e(1).add(ut)).mul(Dt);J.x.assign(W.x.mul(e(0).sub(vt.mul(.65)).exp())),J.y.assign(W.y.mul(e(0).sub(vt.mul(.9)).exp())),J.z.assign(W.z.mul(e(0).sub(vt.mul(1.2)).exp()))}),t.colorBuffer.element(o).assign(_t(J.x,J.y,J.z,r)),t.velocityBuffer.element(o).assign(k(r,0,0))})().compute(n)}function Vs(n,t,s){return q(()=>{const o=Ot,a=t.positionBuffer.element(o).toVar(),l=t.originalPositionBuffer.element(o),m=t.layerBuffer.element(o);D(s.barLength.greaterThan(0),()=>{const u=ft(k(a.x,e(0),a.z)),g=s.rotationSpeed.mul(s.deltaTime).negate();D(u.lessThan(s.barLength),()=>{a.assign(qt(a,g)),t.originalPositionBuffer.element(o).assign(qt(l,g))}).Else(()=>{a.assign(kt(a,s.rotationSpeed,s.rotationFalloff,s.rotationTurnover,s.deltaTime)),t.originalPositionBuffer.element(o).assign(kt(l,s.rotationSpeed,s.rotationFalloff,s.rotationTurnover,s.deltaTime))})}).Else(()=>{const u=kt(a,s.rotationSpeed,s.rotationFalloff,s.rotationTurnover,s.deltaTime);a.assign(u),t.originalPositionBuffer.element(o).assign(kt(l,s.rotationSpeed,s.rotationFalloff,s.rotationTurnover,s.deltaTime))}),t.positionBuffer.element(o).assign(a);const h=s.orbitCycleDuration,y=s.orbitFadeIn,v=s.orbitFadeOut,S=p(o.toFloat().mul(.7531).add(42)),A=yt(s.time.div(P(h,e(.1))).add(S)),T=Q(e(0),y,A),c=e(1).sub(Q(e(1).sub(v),e(1),A)),d=Z(T,c).mul(.3).add(.7),r=t.velocityBuffer.element(o).x;t.colorBuffer.element(o).w.assign(r.mul(d)),D(m.equal(1),()=>{const u=o.toFloat().mul(.7831),g=O(s.time.mul(2).add(u)).mul(.08).add(.92);t.colorBuffer.element(o).w.assign(r.mul(d).mul(g))})})().compute(n)}function Ws(){return{mvpRow0:f(new jt),mvpRow1:f(new jt),mvpRow3:f(new jt),viewZRow:f(new jt),bhViewZ:f(0),bhNdcX:f(0),bhNdcY:f(0),ndcRadiusX:f(.04),ndcRadiusY:f(.04),depthThreshold:f(6),depthSoftness:f(10)}}function Xs(n,t,s){return q(()=>{const o=Ot,a=t.positionBuffer.element(o),l=s.mvpRow0,m=s.mvpRow1,h=s.mvpRow3,y=s.viewZRow,v=l.x.mul(a.x).add(l.y.mul(a.y)).add(l.z.mul(a.z)).add(l.w),S=m.x.mul(a.x).add(m.y.mul(a.y)).add(m.z.mul(a.z)).add(m.w),A=h.x.mul(a.x).add(h.y.mul(a.y)).add(h.z.mul(a.z)).add(h.w),T=y.x.mul(a.x).add(y.y.mul(a.y)).add(y.z.mul(a.z)).add(y.w),c=e(1).div(P(A,e(1e-4))),d=v.mul(c),r=S.mul(c),u=d.sub(s.bhNdcX).div(s.ndcRadiusX),g=r.sub(s.bhNdcY).div(s.ndcRadiusY),b=e(1).sub(Q(e(.75),e(1.25),ht(u.mul(u).add(g.mul(g))))),w=Q(s.depthThreshold,s.depthThreshold.add(s.depthSoftness),T.sub(s.bhViewZ));t.foregroundAlphaBuffer.element(o).assign(b.mul(w))})().compute(n)}class Us{constructor(t,s,i){this.uScreenH=f(800),this.uTanHalfFov=f(Math.tan(60*Math.PI/180/2));const o=s.positionBuffer.toAttribute(),a=s.colorBuffer.toAttribute(),l=s.sizeBuffer.toAttribute(),m=s.foregroundAlphaBuffer.toAttribute(),h=f(i),y=this.uScreenH,v=this.uTanHalfFov,S=0,A=5,T=u=>{const g=Be.sub(o).length().max(e(.001));return u.mul(h.mul(1.28)).div(g).clamp(e(S),e(A)).mul(g).mul(v.mul(2)).div(y)},c=cs();this.glowTexture=c;const d=Ce(c),r=u=>{const g=d.sample(ie()),b=a.w.mul(g.w).mul(u),w=x(k(a.x,a.y,a.z).mul(1.32),k(1,1,1),e(.12)),M=x(w,k(1,1,1),e(.92)),R=w.mul(g.x).add(M.mul(g.y.mul(1.35)));return _t(R.mul(b),b)};this.material=new se,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=ne,this.material.positionNode=o,this.material.scaleNode=T(l),this.material.colorNode=r(e(1).sub(m)),this.sprite=new ae(this.material),this.sprite.count=t,this.sprite.frustumCulled=!1,this.foregroundMaterial=new se,this.foregroundMaterial.transparent=!0,this.foregroundMaterial.depthWrite=!1,this.foregroundMaterial.blending=ne,this.foregroundMaterial.positionNode=o,this.foregroundMaterial.scaleNode=T(l),this.foregroundMaterial.colorNode=r(m),this.foregroundSprite=new ae(this.foregroundMaterial),this.foregroundSprite.count=t,this.foregroundSprite.frustumCulled=!1,this.foregroundSprite.renderOrder=2}updateSizeUniforms(t,s){this.uScreenH.value=Math.max(t,1),this.uTanHalfFov.value=s}dispose(){this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}const Os=q(([n])=>{const t=P(n.r,P(n.g,n.b)),s=Z(n.r,Z(n.g,n.b)),i=t.sub(s),o=Q(e(.06),e(.3),i).mul(e(1).sub(Q(e(.28),e(.95),t)));return pt(P(n,k(0)),k(1.14,1.14,1.14)).mul(x(e(.9),e(.45),o)).mul(k(1.06,.93,.82))});class qs{constructor(t,s,i,o,a,l=1){this.uBHScreenPos=f(new oe(.5,.5)),this.uLensStrength=f(0),this.uAspectRatio=f(1),this.postProcessing=new Xe(t);const h=ce(s,a).getTextureNode(),v=ce(i,a).getTextureNode(),A=ce(o,a).getTextureNode(),T=this.uBHScreenPos,c=this.uLensStrength,d=this.uAspectRatio,u=q(()=>{const w=Ue.toVar(),M=T.sub(w).toVar();M.x.mulAssign(d);const R=ft(M),et=M.div(P(R,e(1e-4))),K=dt(c.div(.03),e(0),e(1)),B=x(e(.25),e(.55),K),X=Q(B,e(0),R).toVar();X.mulAssign(X);const N=x(e(.012),e(.05),K),z=Q(N,N.mul(2.8),R),Y=P(R,x(e(.028),e(.04),K)),lt=c.mul(X).mul(z).mul(x(e(.15),e(.3),K).div(Y)),V=et.mul(lt).toVar();V.x.divAssign(d);const I=dt(w.add(V),e(0),e(1)),st=h.sample(I).toVar();st.rgb.assign(Os(st.rgb));const tt=x(e(.024),e(.09),K),H=x(e(.008),e(.024),K),$=Oe(pt(R.sub(tt).div(H),e(2)).negate()).mul(X).mul(z).mul(c).mul(x(e(10),e(16),K));return st.rgb.addAssign(k(.72,.62,.46).mul($.mul(.02))),st})();this.bloomPassNode=qe(h),this.bloomPassNode.threshold.value=.2,this.bloomPassNode.strength.value=.12,this.bloomPassNode.radius.value=.08,l<1&&(this.bloomPassNode.threshold.value=.35);const g=u.add(this.bloomPassNode),b=q(()=>{const w=g,M=v,R=A,K=x(w.rgb,M.rgb.mul(k(1.05,.95,.84)),M.a).add(R.rgb),B=P(w.a,P(M.a,R.a));return _t(Z(K,e(1)),B)});this.postProcessing.outputNode=b()}render(){this.postProcessing.render()}updateBloom(t,s,i){this.bloomPassNode.strength.value=t,this.bloomPassNode.radius.value=s,this.bloomPassNode.threshold.value=i}updateLensing(t,s,i){this.uBHScreenPos.value.copy(t),this.uLensStrength.value=s,this.uAspectRatio.value=i}dispose(){}}const Kt=6.28318530718,Ys=3e4;function Gs(n){return n==="mobile"?1e4:Ys}function $t(n,t){const s=Q(e(.18),e(.38),n),i=Q(e(.58),e(.82),n),o=x(t.coreWeight,t.midDiskWeight,s);return x(o,t.outerDiskWeight,i)}function js(n,t){const s=_(n.sub(t.peakAzimuthAngleA)).mul(.5).add(.5),i=_(n.sub(t.peakAzimuthAngleB)).mul(.5).add(.5);return P(s,i)}function Zs(n,t){const s=_(t.projectedAngle),i=O(t.projectedAngle),o=n.x.mul(s).add(n.z.mul(i)),a=n.z.mul(s).sub(n.x.mul(i)),l=x(e(1),t.projectedAxisRatio,t.projectedStrength),m=a.mul(l);return k(o.mul(s).sub(m.mul(i)),n.y,o.mul(i).add(m.mul(s)))}class Qs{constructor(t,s,i){const o=Gs(i);this.positionBuffer=ct(o,"vec3"),this.originalPositionBuffer=ct(o,"vec3"),this.colorBuffer=ct(o,"vec3"),this.sizeBuffer=ct(o,"float");const a=this.positionBuffer,l=this.originalPositionBuffer,m=this.colorBuffer,h=this.sizeBuffer;this.computeInit=q(()=>{const d=Ot,r=d.toFloat().add(1e4),u=t.galaxyRadius,g=e(0).toVar(),b=e(0).toVar(),w=e(0).toVar(),M=e(0).toVar(),R=e(1).toVar(),et=e(0).toVar();D(t.numArms.greaterThan(0),()=>{const H=p(r.add(1)),F=P(t.spiralStart.mul(u),e(.001)),$=t.barLength.mul(.5),nt=Z(P(F,$),u.mul(.98)),it=ht(H.mul(u.mul(u).sub(nt.mul(nt))).add(nt.mul(nt)));M.assign(it.div(u)),R.assign($t(M,t));const J=Mt(p(r.add(2)).mul(t.numArms)).mul(Kt).div(t.numArms),L=e(2.5),C=P(it.div(F),e(1)).log().div(P(t.spiralTightness,e(.001))).mul(L),G=J.add(C),U=js(G,t);et.assign(U);const E=O(t.peakAzimuthAngleA.sub(G)).mul(_(G.sub(t.peakAzimuthAngleA)).mul(.5).add(.5)).add(O(t.peakAzimuthAngleB.sub(G)).mul(_(G.sub(t.peakAzimuthAngleB)).mul(.5).add(.5))).mul(t.peakAzimuthStrength).mul(.26),j=G.add(E),at=p(r.add(3)).sub(.5).mul(x(e(.2),e(.035),et.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))),ot=p(r.add(4)).sub(.5).mul(t.armWidth).mul(x(e(.55),e(.12),et.mul(t.peakAzimuthStrength).add(t.bandDustLaneStrength).mul(.5))).mul(x(e(.85),e(1.18),Z(R,e(1.25)).sub(.25))),ut=j.add(at);g.assign(_(ut).mul(it.add(ot))),w.assign(O(ut).mul(it.add(ot)));const mt=e(1).sub(M).add(.15).mul(t.bandDiskThicknessScale);b.assign(p(r.add(5)).sub(.5).mul(u.mul(.03)).mul(mt))}),D(t.numArms.equal(0).and(t.barLength.equal(0)).and(t.clumpCount.equal(0)).and(t.ellipticity.equal(0)).and(t.bulgeFraction.greaterThan(0)),()=>{const H=pt(p(r.add(1)),e(.5)).mul(u),F=p(r.add(2)).mul(Kt);M.assign(H.div(u)),R.assign($t(M,t)),g.assign(_(F).mul(H)),w.assign(O(F).mul(H));const $=u.mul(.03).mul(e(1).sub(M.mul(.5))).mul(t.bandDiskThicknessScale);b.assign(p(r.add(5)).sub(.5).mul($))}),D(t.ellipticity.greaterThan(0),()=>{const H=t.axisRatio,F=pt(p(r.add(1)),e(.4)).mul(u),$=p(r.add(2)).mul(Kt),nt=F.mul(_($)),it=F.mul(O($)).mul(H);M.assign(ht(nt.mul(nt).add(it.mul(it))).div(u)),R.assign($t(M,t)),g.assign(nt),w.assign(it),b.assign(p(r.add(5)).sub(.5).mul(u).mul(.08).mul(e(1).sub(M.mul(.5))))}),D(t.clumpCount.greaterThan(0),()=>{const H=t.clumpCount,F=Mt(p(r.add(2)).mul(H)),$=F.div(H).mul(Kt).add(p(F.add(5e3)).mul(.5)),nt=p(F.add(6e3)).mul(.6).add(.2).mul(u),it=_($).mul(nt),W=O($).mul(nt),J=p(F.add(7e3)).mul(80).add(30),L=p(r.add(3)).sub(.5).add(p(r.add(4)).sub(.5)).mul(2),C=p(r.add(7)).sub(.5).add(p(r.add(8)).sub(.5)).mul(2);g.assign(it.add(L.mul(J))),w.assign(W.add(C.mul(J))),M.assign(ht(g.mul(g).add(w.mul(w))).div(u)),R.assign($t(M,t)),b.assign(p(r.add(5)).sub(.5).mul(u).mul(.1))});const K=Zs(k(g,b,w),t);g.assign(K.x),b.assign(K.y),w.assign(K.z),M.assign(Z(ht(g.mul(g).add(w.mul(w))).div(u),e(1)));const B=k(g,b,w);a.element(d).assign(B),l.element(d).assign(B);const X=k(.62,.7,.9),N=k(.92,.76,.62),z=x(X,N,t.bandDustMix),Y=x(e(.7),e(1),t.bandDustLaneStrength),lt=x(e(.58),e(1.3),et.mul(t.peakAzimuthStrength)),V=x(e(.72),e(1.22),Z(R,e(1.3)).sub(.3)),I=z.mul(e(.72).sub(M.mul(.28))).mul(Y).mul(lt).mul(V);m.element(d).assign(I);const st=e(1).sub(M.mul(.5)).mul(x(e(.9),e(1.15),t.bandDustLaneStrength)),tt=p(r.add(6)).mul(.5).add(.7).mul(st).mul(x(e(.8),e(1.35),et.mul(t.peakAzimuthStrength)));h.element(d).assign(tt)})().compute(o),this.computeUpdate=q(()=>{const d=Ot,r=a.element(d).toVar(),u=l.element(d);D(t.barLength.greaterThan(0),()=>{const g=ft(k(r.x,e(0),r.z)),b=t.rotationSpeed.mul(t.deltaTime).negate();D(g.lessThan(t.barLength),()=>{r.assign(qt(r,b)),l.element(d).assign(qt(u,b))}).Else(()=>{r.assign(kt(r,t.rotationSpeed,t.rotationFalloff,t.rotationTurnover,t.deltaTime)),l.element(d).assign(kt(u,t.rotationSpeed,t.rotationFalloff,t.rotationTurnover,t.deltaTime))})}).Else(()=>{r.assign(kt(r,t.rotationSpeed,t.rotationFalloff,t.rotationTurnover,t.deltaTime)),l.element(d).assign(kt(u,t.rotationSpeed,t.rotationFalloff,t.rotationTurnover,t.deltaTime))}),a.element(d).assign(r)})().compute(o),this.material=new se,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=ne;const y=a.toAttribute(),v=m.toAttribute(),S=h.toAttribute();this.material.positionNode=y;const A=q(()=>{const d=ie().sub(.5).mul(2),r=ft(d),u=Q(1,0,r).mul(Q(1,.3,r));return _t(v.x,v.y,v.z,u.mul(.015))})();this.material.colorNode=A;const T=Math.sqrt(6e4/o),c=s*.006*T;this.material.scaleNode=S.mul(c),this.sprite=new ae(this.material),this.sprite.count=o,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-1}dispose(){this.material.dispose()}}class Ks{constructor(t=60,s=1){this.uTime=f(0),this.uTiltX=f(0),this.uRotY=f(0),this.uLOD=f(0),this.quadSize=t;const i=new Fe(1,4,4),o=new pe({visible:!1});this.depthMesh=new fe(i,o);const a=this.uTime,l=this.uTiltX,m=this.uRotY,h=this.uLOD,y=q(()=>{const S=ie().sub(.5).mul(2),A=ft(S);D(A.greaterThan(1),()=>{Ye()});const T=k(0,-.1,0),c=e(2),d=m,r=l.add(1.2),u=k(c.mul(_(d)).mul(O(r)),c.mul(_(r)),c.mul(O(d)).mul(O(r))),g=wt(T.sub(u)),b=wt(ye(wt(k(0,1,-.1)),g)),w=wt(ye(g,b)),M=wt(g.mul(1.5).add(b.mul(S.x)).add(w.mul(S.y))),R=e(.13),et=e(.3),K=e(.04),B=s<1?.024:.018,X=s<1?.016:.012,N=x(e(B),e(X),h),z=u.toVar(),Y=M.toVar();z.addAssign(Y.mul(zt(M.add(a)).mul(.01)));const lt=x(e(.3),e(1),h),V=x(e(.005),e(.02),h);x(e(.1),e(.5),h);const I=k(0,0,0).toVar(),st=e(0).toVar(),tt=e(0).toVar(),H=k(1,.55,.12),F=k(1,.3,.03),$=k(.45,.1,.01),nt=k(.25,.15,.05),it=a.mul(V).mul(30);Ge(200,()=>{const L=wt(z),C=ft(z),G=N.mul(et).div(P(C.mul(C),e(.001))),U=L.mul(G),E=wt(Y.sub(U)),j=Y.mul(N);z.addAssign(j);const at=ft(z);D(at.lessThan(R),()=>{tt.assign(1),Se()});const ot=ft(Pt(z.x,z.z)),ut=z.y.div(K),mt=P(e(0),e(1).sub(ut.mul(ut))),Dt=Q(e(1.3),e(.16),ot),vt=mt.mul(Dt),Ct=ot.mul(4.27).sub(it),Tt=_(Ct),Bt=O(Ct),At=k(z.x.mul(Tt).sub(z.z.mul(Bt)),z.y.mul(8),z.x.mul(Bt).add(z.z.mul(Tt))).mul(14),St=ue(At).mul(.5).add(.5),Ft=ue(At.mul(2.03)).mul(.5).add(.5),Lt=ue(At.mul(4.01)).mul(.5).add(.5),Et=St.mul(.25).add(Ft.mul(.12)).add(Lt.mul(.06)).add(.55),gt=ge(z.x.negate(),z.z.negate()),It=e(1).add(_(gt.add(it)).mul(.7)),Nt=dt(ot.add(Et.sub(.5).mul(.4)),e(0),e(1)),Yt=x(x(H,F,Q(e(.05),e(.425),Nt)),$,Q(e(.425),e(1),Nt)),Gt=P(Et,e(.3)),Vt=Yt.mul(Gt).mul(It).mul(3).add(nt.mul(vt).mul(2)),Wt=vt.mul(dt(Gt.mul(2),e(0),e(1))),Xt=e(1).sub(st).mul(Wt);I.assign(x(I,Vt,Xt)),st.assign(dt(x(st,e(1),Wt),e(0),e(1))),z.addAssign(j),Y.assign(E),D(ee(z,z).greaterThan(16).and(ee(Y,z).greaterThan(0)),()=>{Se()})}),I.mulAssign(lt);const W=e(1).sub(Q(e(.3),e(1),A));I.mulAssign(W);const J=P(st.mul(W),tt);return _t(I,J)}),v=new pe;v.transparent=!0,v.depthWrite=!1,v.side=je,v.fragmentNode=y(),this.mesh=new fe(new Ze(1,1),v),this.mesh.scale.set(t,t,1),this.mesh.renderOrder=1}update(t,s,i,o,a,l){this.uTime.value=t,this.uTiltX.value=s,this.uRotY.value=i,this.mesh.quaternion.copy(o.quaternion);const m=o.position.length(),y=(o.fov??60)*Math.PI/180,v=a.y*l,S=this.quadSize/m*(v/(2*Math.tan(y/2)));this.uLOD.value=Math.min(Math.max((S-6)/220,0),1)}getLOD(){return this.uLOD.value}dispose(){this.mesh.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const $s=`// ─── Hash functions ────────────────────────────────────────────────────────

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
`;function Js(n,t){const s=t==="mobile",i=s?3:5,o=s?2:4,a=s?2:4,l=s?3:6,m=s?2:5,h=s?2:4;return n.replace(/\bSPIRAL_NOISE_ITER\b/g,String(i)).replace(/\bFBM_DETAIL_OCTAVES\b/g,String(o)).replace(/\bMAX_GALAXIES\b/g,String(a)).replace(/\bMAX_CLOUDS\b/g,String(l)).replace(/\bMAX_KNOTS\b/g,String(m)).replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g,(y,v)=>h>parseInt(v,10)?"true":"false")}function tn(n){const t=[],s=/\bfn\s+[a-z_0-9]+\s*\(/gi;let i;const o=[];for(;(i=s.exec(n))!==null;)o.push(i.index);for(let a=0;a<o.length;a++){const l=o[a],m=n.indexOf("{",l);if(m===-1)continue;let h=0,y=m;for(;y<n.length&&(n[y]==="{"&&h++,!(n[y]==="}"&&(h--,h===0)));y++);t.push(n.substring(l,y+1))}return t}class en{constructor(t,s,i){this.uTime=f(0),this.uSeed=f(0),this.uNebulaIntensity=f(2.4),this.uSeed.value=s;const o=t*12,a=new Fe(o,192,128),l=Js($s,i),m=tn(l),h=[];for(const c of m)h.push(Qe(c,[...h]));const y=h[h.length-1],v=this.uTime,S=this.uSeed,A=this.uNebulaIntensity,T=q(()=>{const c=wt(Ke);return y(c,v,S,A)});this.material=new pe,this.material.side=$e,this.material.depthWrite=!1,this.material.depthTest=!1,this.material.fragmentNode=T(),this.mesh=new fe(a,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(t,s){this.uTime.value=t,this.mesh.position.copy(s.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const me=4,sn=2,nn=.7;class an{constructor(t,s,i){this.uScreenH=f(800),this.uTanHalfFov=f(Math.tan(60*Math.PI/180/2));const o=t.length,a=ct(o,"vec3"),l=ct(o,"vec3"),m=ct(o,"float"),h=ct(o,"float"),y=ct(o,"float"),v=a.value.array,S=l.value.array,A=m.value.array,T=h.value.array,c=y.value.array;for(let W=0;W<o;W++){const J=t[W];v[W*3]=J.position[0],v[W*3+1]=J.position[1],v[W*3+2]=J.position[2],S[W*3]=J.color[0],S[W*3+1]=J.color[1],S[W*3+2]=J.color[2],A[W]=J.size,T[W]=J.brightness,c[W]=J.texIndex}const d=a.toAttribute(),r=l.toAttribute(),u=m.toAttribute(),g=h.toAttribute(),b=y.toAttribute(),w=f(i),M=this.uScreenH,R=this.uTanHalfFov,et=0,K=5,B=Be.sub(d).length().max(e(.001)),N=u.mul(w.mul(1.28)).div(B).clamp(e(et),e(K)).mul(B).mul(R.mul(2)).div(M),z=Mt(b),Y=Je(z,e(me)),lt=Mt(z.div(e(me))),V=ie(),I=Y.add(V.x).div(e(me)),st=lt.add(V.y).div(e(sn)),H=Ce(s).sample(Pt(I,st)),F=g.mul(e(nn)),$=H.rgb.mul(r).mul(F),nt=H.a.mul(F),it=_t($,nt);this.material=new se,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=ne,this.material.positionNode=d,this.material.scaleNode=N,this.material.colorNode=it,this.sprite=new ae(this.material),this.sprite.count=o,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-2}updateSizeUniforms(t,s){this.uScreenH.value=Math.max(t,1),this.uTanHalfFov.value=s}dispose(){this.material.dispose()}}const Me=new xt(0,1,0),Jt=new te,Te=new ss,ke=new xt,Pe=new oe,De=new oe,Re=new xt;function on(n){return n==="mobile"?15e4:5e5}class pn{constructor(t,s,i=[]){this.initialized=!1,this.disposed=!1,this.neighborsLayer=null,this.neighborAtlas=null,this._bhScreenVec=new xt,this.animationId=0,this.lastFrameTime=0,this.galaxyRotation=0,this.orbitQuat=new te,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.isPanning=!1,this.pivot=new xt,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.mouse3D=new xt(0,0,0),this.raycaster=new ts,this.intersectionPlane=new es(new xt(0,1,0),0),this.mousePressed=!1,this.rendererSize=new oe,this.dpr=1,this.animate=()=>{var B;this.animationId=requestAnimationFrame(this.animate);const c=performance.now(),d=Math.min((c-this.lastFrameTime)/1e3,.033);this.lastFrameTime=c,this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const r=this.baseDistance/this.zoom;ke.set(0,0,r).applyQuaternion(this.orbitQuat).add(this.pivot),this.camera.position.copy(ke),this.camera.lookAt(this.pivot),this.camera.updateMatrixWorld(!0);const u=this.params.rotationOmega0;this.galaxyRotation+=d*u;const g=this.uniforms.time.value+d;if(this.uniforms.time.value=g,this.uniforms.deltaTime.value=d,this.uniforms.rotationSpeed.value=u,this.uniforms.mouse.value.copy(this.mouse3D),this.uniforms.mouseActive.value=this.mousePressed?1:0,this.initialized){this.renderer.compute(this.computeUpdate),this.renderer.compute(this.clouds.computeUpdate);const X=this.camera.matrixWorldInverse.elements;Te.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);const N=Te.elements;this.fgUniforms.mvpRow0.value.set(N[0],N[4],N[8],N[12]),this.fgUniforms.mvpRow1.value.set(N[1],N[5],N[9],N[13]),this.fgUniforms.mvpRow3.value.set(N[3],N[7],N[11],N[15]),this.fgUniforms.viewZRow.value.set(X[2],X[6],X[10],X[14]),this.fgUniforms.bhViewZ.value=X[14];const z=this._bhScreenVec.set(0,0,0).project(this.camera);this.fgUniforms.bhNdcX.value=z.x,this.fgUniforms.bhNdcY.value=z.y;const Y=this.camera.position,lt=Y.length(),V=1-Math.abs(Y.y)/Math.max(lt,1e-4),I=Zt.smoothstep(V,.55,.95);this.fgUniforms.depthThreshold.value=Zt.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),I),this.fgUniforms.depthSoftness.value=Zt.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),I);const st=this.params.galaxyRadius*.08,tt=this.camera.fov*Math.PI/180,H=this.rendererSize.y*this.dpr,F=Math.tan(tt/2),$=st/lt*(H/(2*F));this.particles.updateSizeUniforms(H,F),(B=this.neighborsLayer)==null||B.updateSizeUniforms(H,F);const nt=Zt.lerp(.75,1.2,I),it=this.canvas.clientWidth,W=this.canvas.clientHeight;this.fgUniforms.ndcRadiusX.value=Math.max($*nt/Math.max(it*.5,1),.04),this.fgUniforms.ndcRadiusY.value=Math.max($*nt/Math.max(W*.5,1),.04),this.renderer.compute(this.computeForeground)}this.backdrop.update(g,this.camera);const b=this.camera.position,w=Math.sqrt(b.x*b.x+b.z*b.z),M=Math.atan2(b.y,w),R=Math.atan2(b.x,b.z);this.blackHole.update(g,M,R,this.camera,this.rendererSize,this.dpr),this._bhScreenVec.set(0,0,0).project(this.camera);const et=this.blackHole.getLOD(),K=et*et*.03;De.set(this._bhScreenVec.x*.5+.5,.5-this._bhScreenVec.y*.5),this.postProcessing.updateLensing(De,K,this.camera.aspect),this.postProcessing.render()},this.canvas=t,this.galaxy=s,this.quality=ds();const o=on(this.quality);this.scene=new de,this.bhScene=new de,this.fgScene=new de,this.params=Ae(s);const a=this.params.galaxyRadius;this.baseDistance=a*1.7;const l=t.clientWidth/t.clientHeight;this.camera=new ns(60,l,.1,this.baseDistance*20),this.buffers=Is(o),this.uniforms=Hs(this.params),this.computeInit=Ns(o,this.buffers,this.uniforms),this.computeUpdate=Vs(o,this.buffers,this.uniforms),this.fgUniforms=Ws(),this.computeForeground=Xs(o,this.buffers,this.fgUniforms),this.backdrop=new en(this.baseDistance,s.pgc,this.quality),this.scene.add(this.backdrop.mesh),this.particles=new Us(o,this.buffers,this.baseDistance),this.scene.add(this.particles.sprite),this.clouds=new Qs(this.uniforms,this.baseDistance,this.quality),this.scene.add(this.clouds.sprite),this.blackHole=new Ks(a*.08,ze(this.quality)),this.bhScene.add(this.blackHole.depthMesh),this.bhScene.add(this.blackHole.mesh),this.fgScene.add(this.particles.foregroundSprite);const m=is(s,i,this.baseDistance);m.length>0&&(this.neighborAtlas=ms(),this.neighborsLayer=new an(m,this.neighborAtlas,this.baseDistance),this.scene.add(this.neighborsLayer.sprite));const y=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=y,this.targetZoom=y;const{initRotY:v,initTiltX:S}=us(s),A=new te().setFromAxisAngle(new xt(1,0,0),S),T=new te().setFromAxisAngle(Me,v);this.orbitQuat.multiplyQuaternions(T,A),this.onPointerDown=c=>{this.isPinching||(c.button===2?(this.isPanning=!0,this.isDragging=!1):this.isDragging=!0,this.lastX=c.clientX,this.lastY=c.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=c=>{if(this.isPinching)return;if(this.isPanning){this.applyPan(c.clientX-this.lastX,c.clientY-this.lastY),this.lastX=c.clientX,this.lastY=c.clientY;return}if(!this.isDragging)return;const d=c.clientX-this.lastX,r=c.clientY-this.lastY;this.velocityX=d*.005,this.velocityY=r*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=c.clientX,this.lastY=c.clientY},this.onPointerUp=()=>{this.isDragging=!1,this.isPanning=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1,this.isPanning=!1},this.onWheel=c=>{c.preventDefault();const d=this.targetZoom*.12;this.targetZoom+=c.deltaY>0?-d:d,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=c=>{if(c.touches.length===2){c.preventDefault(),this.isPinching=!0,this.isDragging=!1;const d=c.touches[0].clientX-c.touches[1].clientX,r=c.touches[0].clientY-c.touches[1].clientY;this.lastPinchDist=Math.sqrt(d*d+r*r)}},this.onTouchMove=c=>{if(c.touches.length===2){c.preventDefault();const d=c.touches[0].clientX-c.touches[1].clientX,r=c.touches[0].clientY-c.touches[1].clientY,u=Math.sqrt(d*d+r*r),g=(u-this.lastPinchDist)*.01;this.lastPinchDist=u,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+g))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onMouseDown=c=>{c.button!==2&&(this.mousePressed=!0)},this.onMouseUp=()=>{this.mousePressed=!1},this.onMouseMove=c=>{Pe.set(c.clientX/t.clientWidth*2-1,-(c.clientY/t.clientHeight)*2+1),this.raycaster.setFromCamera(Pe,this.camera),this.raycaster.ray.intersectPlane(this.intersectionPlane,this.mouse3D)},this.onContextMenu=c=>c.preventDefault(),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerCancel),t.addEventListener("pointerleave",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("touchstart",this.onTouchStart,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove,{passive:!1}),t.addEventListener("touchend",this.onTouchEnd),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("mouseup",this.onMouseUp),t.addEventListener("mousemove",this.onMouseMove),t.addEventListener("contextmenu",this.onContextMenu),this.resizeObserver=new ResizeObserver(()=>{const c=t.clientWidth,d=t.clientHeight;c===0||d===0||(this.renderer.setSize(c,d,!1),this.camera.aspect=c/d,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(t)}applyPan(t,s){const i=this.baseDistance/this.zoom,o=this.camera.fov*Math.PI/180,a=2*i*Math.tan(o/2)/Math.max(this.canvas.clientHeight,1),l=new xt(1,0,0).applyQuaternion(this.orbitQuat),m=new xt(0,1,0).applyQuaternion(this.orbitQuat);this.pivot.addScaledVector(l,-t*a),this.pivot.addScaledVector(m,s*a);const h=this.baseDistance*8;this.pivot.length()>h&&this.pivot.setLength(h)}applyOrbitDelta(t,s){Jt.setFromAxisAngle(Me,-t),this.orbitQuat.premultiply(Jt),Re.set(1,0,0).applyQuaternion(this.orbitQuat),Jt.setFromAxisAngle(Re,-s),this.orbitQuat.premultiply(Jt),this.orbitQuat.normalize()}async start(){const t=ks(this.galaxy.pgc).catch(()=>null);this.renderer=new as({canvas:this.canvas,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,hs(this.quality))),this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight,!1),this.dpr=this.renderer.getPixelRatio(),this.renderer.getSize(this.rendererSize),await this.renderer.init();const s=ze(this.quality);this.postProcessing=new qs(this.renderer,this.scene,this.bhScene,this.fgScene,this.camera,s),await this.renderer.computeAsync(this.computeInit),await this.renderer.computeAsync(this.clouds.computeInit),this.initialized=!0,this.lastFrameTime=performance.now(),this.animate(),t.then(async i=>{if(!(!i||this.disposed||!this.initialized))try{if(this.params=Ae(this.galaxy,i.profile),Ie(this.uniforms,this.params),this.disposed||(await this.renderer.computeAsync(this.computeInit),this.disposed))return;await this.renderer.computeAsync(this.clouds.computeInit)}catch(o){this.disposed||console.warn("Band-guided WebGPU upgrade failed; keeping procedural render:",o)}})}dispose(){var s,i;this.disposed=!0,cancelAnimationFrame(this.animationId);const t=this.canvas;t.removeEventListener("pointerdown",this.onPointerDown),t.removeEventListener("pointermove",this.onPointerMove),t.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("pointercancel",this.onPointerCancel),t.removeEventListener("pointerleave",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),t.removeEventListener("touchstart",this.onTouchStart),t.removeEventListener("touchmove",this.onTouchMove),t.removeEventListener("touchend",this.onTouchEnd),t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("mouseup",this.onMouseUp),t.removeEventListener("mousemove",this.onMouseMove),t.removeEventListener("contextmenu",this.onContextMenu),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.clouds.dispose(),this.blackHole.dispose(),this.postProcessing.dispose(),(s=this.neighborsLayer)==null||s.dispose(),(i=this.neighborAtlas)==null||i.dispose(),this.renderer.dispose()}}export{pn as GalaxySceneWebGPU};
