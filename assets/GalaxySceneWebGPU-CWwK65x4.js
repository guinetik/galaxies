import{a2 as _,a3 as bt,a4 as G,a5 as t,a6 as P,a7 as w,a8 as nt,a9 as Z,aa as Q,ab as ct,ac as vt,ad as Mt,ae as h,af as St,ag as Jt,ah as pt,ai as K,aj as dt,ak as r,V as gt,al as pe,am as D,an as xt,ao as De,ap as Re,aq as Pt,ar as Ot,as as Ce,at as ge,au as ue,av as It,r as Qt,aw as $t,ax as Be,A as Le,k as se,ay as We,az as Gt,aA as Xe,aB as Ue,d as Ee,aC as te,M as ee,aD as Oe,aE as ve,aF as Ge,aG as be,x as Ye,l as qe,aH as je,aI as fe,aJ as xe,aK as Ze,S as _t,aL as Qe,aM as Ke,aN as Je,Q as Kt,aO as $e,aP as ts,f as es,n as Yt,P as ss,aQ as ns}from"./three-y20Z06rJ.js";import{m as ye,c as as}from"./useGalaxyData-DncCPX_X.js";import{d as is,c as Se,a as os,G as ls,r as oe,b as Ae,g as rs}from"./qualityDetect-Dx4VSKNU.js";import{C as Bt,g as cs,a as Fe,b as le}from"./cinematicAppearance-WeV-O7nO.js";import{g as ds}from"./GalaxyTextures-DwjMeFeX.js";import"./sqljs-M9QnmiAb.js";import"./vue-vendor-BVmPiw82.js";function us(a,s){return s!=null&&s.aborted||typeof Worker>"u"?Promise.resolve(null):new Promise(e=>{let i;try{i=new Worker(new URL("/assets/bandProfile.worker-BhN0f0PK.js",import.meta.url),{type:"module"})}catch{e(null);return}let l=!1;const n=d=>{l||(l=!0,clearTimeout(p),s==null||s.removeEventListener("abort",o),i.onmessage=null,i.onerror=null,i.onmessageerror=null,i.terminate(),e(d))},o=()=>n(null),p=setTimeout(o,6e4);s==null||s.addEventListener("abort",o,{once:!0}),i.onmessage=d=>n(d.data.profile),i.onerror=d=>{d.preventDefault(),n(null)},i.onmessageerror=o;try{i.postMessage({pgc:a})}catch{n(null)}})}const m=_(([a])=>{const s=bt(a.mul(.1031)),e=s.add(19.19);return bt(e.mul(e.add(47.43)).mul(s))}),yt=_(([a])=>{const s=bt(a.mul(w(.16532,.17369,.15787))).toVar();return s.addAssign(Jt(s,s.yzx.add(19.19))),bt(s.x.mul(s.y).mul(s.z))}),qt=_(([a])=>bt(Z(Jt(a,St(2.31,53.21)).mul(124.123)).mul(412))),he=_(([a])=>{const s=Mt(a),e=bt(a),i=e.mul(e).mul(t(3).sub(e.mul(2)));return h(h(qt(s),qt(s.add(St(1,0))),i.x),h(qt(s.add(St(0,1))),qt(s.add(St(1,1))),i.x),i.y)}),re=_(([a])=>{const s=Mt(a),e=bt(a),i=e.mul(e).mul(t(3).sub(e.mul(2))),l=yt(s.add(w(0,0,0))),n=yt(s.add(w(1,0,0))),o=yt(s.add(w(0,1,0))),p=yt(s.add(w(1,1,0))),d=yt(s.add(w(0,0,1))),x=yt(s.add(w(1,0,1))),y=yt(s.add(w(0,1,1))),z=yt(s.add(w(1,1,1))),F=h(l,n,i.x),c=h(o,p,i.x),u=h(d,x,i.x),v=h(y,z,i.x),g=h(F,c,i.y),k=h(u,v,i.y);return h(g,k,i.z).mul(2).sub(1)});_(([a,s])=>ct(a).sub(s));_(([a,s])=>{const e=St(ct(a.xz).sub(s.x),a.y);return ct(e).sub(s.y)});const me=_(([a,s])=>{const e=Z(s),i=Q(s),l=a.x.mul(e).sub(a.z.mul(i)),n=a.x.mul(i).add(a.z.mul(e));return w(l,a.y,n)}),jt=_(([a,s,e,i,l])=>{const n=ct(w(a.x,t(0),a.z)),o=P(n,i).div(i),p=t(1).div(vt(o,e)),d=s.mul(p).mul(l).negate();return me(a,d)});_(([a,s,e,i,l,n])=>{const o=s.sub(a),p=ct(o),d=e.mul(P(t(0),t(1).sub(p.div(l))));return pt(o).mul(i).mul(d).mul(n).negate()});_(([a,s,e,i])=>s.sub(a).mul(e).mul(i));const hs=_(([a,s,e])=>{const i=s.mul(G(e,t(1).sub(e))),l=bt(a.mul(12).add(0).div(12)).mul(12),n=bt(a.mul(12).add(8).div(12)).mul(12),o=bt(a.mul(12).add(4).div(12)).mul(12),p=e.sub(i.mul(P(G(G(l.sub(3),t(9).sub(l)),t(1)),t(-1)))),d=e.sub(i.mul(P(G(G(n.sub(3),t(9).sub(n)),t(1)),t(-1)))),x=e.sub(i.mul(P(G(G(o.sub(3),t(9).sub(o)),t(1)),t(-1))));return w(p,d,x)});_(([a])=>{const s=nt(a,t(1e3),t(4e4)).div(100),e=vt(s.sub(60),t(-.1332)).mul(329.6987).div(255),i=nt(h(t(1),e,K(t(65.9),t(66.1),s)),t(0),t(1)),l=s.log().mul(99.4708).sub(161.1196).div(255),n=vt(s.sub(60),t(-.0755)).mul(288.1222).div(255),o=nt(h(l,n,K(t(65.9),t(66.1),s)),t(0),t(1)),p=P(s.sub(10),t(1)).log().mul(138.5177).sub(305.0448).div(255),d=h(t(0),p,K(t(19),t(20),s)),x=nt(h(d,t(1),K(t(65.9),t(66.1),s)),t(0),t(1)),y=z=>h(z.div(12.92),vt(z.add(.055).div(1.055),t(2.4)),K(t(.04045),t(.04046),z));return w(y(i),y(o),y(x))});const ms=_(([a])=>{const s=he(a).mul(.5).add(.5).toVar();return s.addAssign(he(a.mul(2)).mul(.25).add(.125)),nt(s,t(0),t(1))});function ps(a){return{positionBuffer:dt(a,"vec3"),originalPositionBuffer:dt(a,"vec3"),velocityBuffer:dt(a,"vec3"),colorBuffer:dt(a,"vec4"),sizeBuffer:dt(a,"float"),layerBuffer:dt(a,"float"),foregroundAlphaBuffer:dt(a,"float")}}function gs(a){const s={numArms:r(0),armWidth:r(0),spiralTightness:r(0),spiralStart:r(0),bulgeRadius:r(0),fieldStarFraction:r(0),irregularity:r(0),barLength:r(0),barWidth:r(0),axisRatio:r(1),ellipticity:r(0),bulgeFraction:r(0),diskThickness:r(0),clumpCount:r(0),galaxyRadius:r(0),galaxySeed:r(0),bandArmScatterScale:r(1),bandBulgeBoost:r(0),bandClumpBoost:r(0),bandHotMix:r(.5),bandDustMix:r(.5),bandDiskThicknessScale:r(1),bandDustLaneStrength:r(0),coreWeight:r(1),midDiskWeight:r(1),outerDiskWeight:r(1),peakAzimuthAngleA:r(0),peakAzimuthAngleB:r(Math.PI),peakAzimuthStrength:r(0),projectedAxisRatio:r(1),projectedAngle:r(0),projectedStrength:r(0),time:r(0),deltaTime:r(.016),rotationSpeed:r(.033),rotationFalloff:r(1),rotationTurnover:r(45),mouse:r(new gt(0,0,0)),mouseActive:r(0),mouseForce:r(7),mouseRadius:r(a.galaxyRadius*.3),dustStrength:r(0),dustArmBoost:r(0),orbitCycleDuration:r(60),orbitFadeIn:r(.08),orbitFadeOut:r(.08)};return He(s,a),s}function He(a,s){const e=s.morphology,i=is(s.bandProfile);a.numArms.value=e.numArms,a.armWidth.value=e.armWidth*s.galaxyRadius,a.spiralTightness.value=e.spiralTightness,a.spiralStart.value=e.spiralStart,a.bulgeRadius.value=e.bulgeRadius*s.galaxyRadius,a.fieldStarFraction.value=e.fieldStarFraction,a.irregularity.value=e.irregularity,a.barLength.value=e.barLength*s.galaxyRadius,a.barWidth.value=e.barWidth*s.galaxyRadius,a.axisRatio.value=e.axisRatio,a.ellipticity.value=e.ellipticity,a.bulgeFraction.value=e.bulgeFraction,a.diskThickness.value=e.diskThickness,a.clumpCount.value=e.clumpCount,a.galaxyRadius.value=s.galaxyRadius,a.galaxySeed.value=s.starCount*.61803398875,a.bandArmScatterScale.value=i.armScatterScale,a.bandBulgeBoost.value=i.bulgeBoost,a.bandClumpBoost.value=i.clumpBoost,a.bandHotMix.value=i.hotMix,a.bandDustMix.value=i.dustMix,a.bandDiskThicknessScale.value=i.diskThicknessScale,a.bandDustLaneStrength.value=i.dustLaneStrength,a.coreWeight.value=i.coreWeight,a.midDiskWeight.value=i.midDiskWeight,a.outerDiskWeight.value=i.outerDiskWeight,a.peakAzimuthAngleA.value=i.peakAzimuthAngleA,a.peakAzimuthAngleB.value=i.peakAzimuthAngleB,a.peakAzimuthStrength.value=i.peakAzimuthStrength,a.projectedAxisRatio.value=i.projectedAxisRatio,a.projectedAngle.value=i.projectedAngle,a.projectedStrength.value=i.projectedStrength,a.dustStrength.value=e.dustStrength,a.dustArmBoost.value=e.dustArmBoost,a.mouseRadius.value=s.galaxyRadius*.3,a.rotationFalloff.value=s.rotationFalloff,a.rotationTurnover.value=s.rotationTurnover}const mt=6.28318530718,ce=(a,s)=>{const e=nt(s,t(.02),t(.98));return e.div(t(1).sub(e)).log().mul(a).mul(.45)};function Vt(a,s){const e=K(t(.18),t(.38),a),i=K(t(.58),t(.82),a),l=h(s.coreWeight,s.midDiskWeight,e);return h(l,s.outerDiskWeight,i)}function vs(a,s){const e=Z(s.projectedAngle),i=Q(s.projectedAngle),l=a.x.mul(e).add(a.z.mul(i)),n=a.z.mul(e).sub(a.x.mul(i)),o=h(t(1),s.projectedAxisRatio,s.projectedStrength),p=n.mul(o);return w(l.mul(e).sub(p.mul(i)),a.y,l.mul(i).add(p.mul(e)))}function bs(a,s,e){return _(()=>{const l=pe,n=l.toFloat(),o=e.galaxyRadius,p=h(t(.04),t(.08),nt(e.bandHotMix.mul(.7).add(e.bandClumpBoost.mul(.3)),t(0),t(1))),d=m(n.add(100)),x=t(0).toVar();D(d.greaterThan(t(1).sub(p)),()=>{x.assign(1)}),s.layerBuffer.element(l).assign(x);const y=m(n.add(200)),z=t(0).toVar();D(x.equal(0),()=>{z.assign(y.mul(1.4).add(.6))}).Else(()=>{z.assign(y.mul(5).add(3).mul(h(t(.9),t(1.4),e.bandHotMix)))}),s.sizeBuffer.element(l).assign(z);const F=m(n.add(300)),c=m(n.add(400)),u=t(0).toVar(),v=t(0).toVar();D(x.equal(0),()=>{u.assign(F.mul(.4).add(.32).mul(h(t(.95),t(1.15),e.bandHotMix))),v.assign(c.mul(.4).add(.4))}).Else(()=>{u.assign(F.mul(.16).add(.64).mul(h(t(.95),t(1.25),e.bandHotMix))),v.assign(c.mul(.24).add(.56).mul(h(t(.95),t(1.2),e.bandClumpBoost)))});const g=t(0).toVar(),k=t(0).toVar(),b=t(0).toVar(),M=t(0).toVar(),O=t(-1).toVar(),Y=t(1).toVar(),at=t(0).toVar();D(e.numArms.greaterThan(0),()=>{const f=m(n.add(500)),A=e.bulgeRadius,j=G(t(.25),t(.1).add(t(.2).mul(A.div(o)))),B=e.fieldStarFraction;D(f.lessThan(j),()=>{O.assign(0);const R=vt(m(n.add(10)),t(.6)).mul(A),I=m(n.add(11)).mul(mt),et=m(n.add(12)).sub(.5).mul(A).mul(.5);g.assign(Z(I).mul(R)),k.assign(et),b.assign(Q(I).mul(R)),M.assign(R.div(A).mul(.3)),Y.assign(e.coreWeight)}).ElseIf(f.lessThan(j.add(B)),()=>{O.assign(1);const R=xt(m(n.add(20))).mul(o),I=m(n.add(21)).mul(mt),et=ce(o.mul(.08),m(n.add(22)));g.assign(Z(I).mul(R)),k.assign(et),b.assign(Q(I).mul(R)),M.assign(R.div(o)),Y.assign(Vt(M,e))}).Else(()=>{O.assign(2);const R=e.numArms,et=Mt(m(n.add(30)).mul(R)).mul(mt).div(R),it=P(e.spiralStart.mul(o),t(.001)),ut=e.barLength.mul(.5),ot=G(P(it,ut),o.mul(.98)),At=m(n.add(31)),ft=xt(At.mul(o.mul(o).sub(ot.mul(ot))).add(ot.mul(ot))),Lt=ft.div(o),zt=Vt(Lt,e);Y.assign(zt);const Dt=t(2.5),wt=P(ft.div(it),t(1)).log().div(P(e.spiralTightness,t(.001))).mul(Dt),ht=ft.div(o).mul(.5).add(.5),kt=m(n.add(32)).sub(.5).add(m(n.add(33)).sub(.5)).mul(e.armWidth).mul(ht).mul(e.bandArmScatterScale),Rt=e.irregularity.mul(m(n.add(35)).sub(.5)).mul(30),Et=m(n.add(34)).sub(.5).mul(.3),rt=wt.add(et).add(Et),Tt=Z(rt.sub(e.peakAzimuthAngleA)).mul(.5).add(.5),Wt=Z(rt.sub(e.peakAzimuthAngleB)).mul(.5).add(.5),Xt=P(Tt,Wt);at.assign(Xt);const Ut=Q(e.peakAzimuthAngleA.sub(rt)).mul(Tt).add(Q(e.peakAzimuthAngleB.sub(rt)).mul(Wt)).mul(e.peakAzimuthStrength).mul(.22),Ft=rt.add(Ut),Ht=Ft.add(t(Math.PI/2)),ne=h(t(.86),t(1.18),nt(zt.sub(.55).div(1.3),t(0),t(1))),Ct=nt(ft.mul(ne),ot,o),ae=kt.mul(h(t(1.3),t(.42),Xt.mul(e.peakAzimuthStrength))),Nt=Z(Ft).mul(Ct.add(Rt)).add(Z(Ht).mul(ae)),ie=Q(Ft).mul(Ct.add(Rt)).add(Q(Ht).mul(ae)),Ne=Ct.div(o),Ve=o.mul(.06).mul(t(1).sub(Ne.mul(.7))).mul(e.bandDiskThicknessScale),Ie=ce(Ve,m(n.add(36)));g.assign(Nt),k.assign(Ie),b.assign(ie);const _e=xt(Nt.mul(Nt).add(ie.mul(ie)));M.assign(_e.div(o))}),D(e.barLength.greaterThan(0),()=>{const R=m(n.add(600));D(R.lessThan(.25),()=>{const I=e.barLength,et=e.barWidth,it=m(n.add(40)).sub(.5).mul(2).mul(I),ut=m(n.add(41)).sub(.5).mul(et);g.assign(it),k.assign(m(n.add(42)).sub(.5).mul(o).mul(.04)),b.assign(ut),M.assign(t(.1))})})}),D(e.numArms.equal(0).and(e.barLength.equal(0)).and(e.clumpCount.equal(0)).and(e.ellipticity.equal(0)).and(e.bulgeFraction.greaterThan(0)),()=>{const f=e.bulgeRadius,A=vt(m(n.add(10)),t(.55)).mul(o),j=m(n.add(11)).mul(mt),B=A.div(o),R=o.mul(.06).mul(vt(P(t(1).sub(B),t(0)),t(2))).mul(e.bandDiskThicknessScale),I=ce(R,m(n.add(12)));g.assign(Z(j).mul(A)),k.assign(I),b.assign(Q(j).mul(A));const et=nt(t(1).sub(A.div(P(f,t(1)))),t(0),t(1)),it=t(1).add(et.mul(.4)).add(e.bandBulgeBoost.mul(.25));u.assign(G(u.mul(it),t(.95))),v.assign(G(v.mul(it),t(.95))),z.assign(z.mul(t(1).add(et.mul(.3)))),M.assign(B.mul(.2)),Y.assign(Vt(B,e))}),D(e.ellipticity.greaterThan(0),()=>{const f=e.axisRatio,A=vt(m(n.add(10)),t(.4)).mul(o),j=m(n.add(11)).mul(mt),B=A.mul(Z(j)),R=A.mul(Q(j)).mul(f),I=xt(B.mul(B).add(R.mul(R))).div(o),et=m(n.add(12)).sub(.5).mul(o).mul(.1).mul(t(1).sub(I.mul(.5)));g.assign(B),k.assign(et),b.assign(R),M.assign(I),Y.assign(Vt(I,e))}),D(e.clumpCount.greaterThan(0),()=>{const f=e.irregularity,A=e.clumpCount,j=m(n.add(500));D(j.greaterThan(f),()=>{const B=Mt(m(n.add(50)).mul(A)),R=B.div(A).mul(mt).add(m(B.add(1e3)).mul(.5)),I=m(B.add(2e3)).mul(.6).add(.2).mul(o),et=Z(R).mul(I),it=Q(R).mul(I),ut=m(B.add(3e3)).mul(80).add(30).mul(o.div(280)).mul(h(t(1.05),t(.7),e.bandClumpBoost)),ot=m(n.add(51)).sub(.5).add(m(n.add(52)).sub(.5)).mul(2),At=m(n.add(53)).sub(.5).add(m(n.add(54)).sub(.5)).mul(2);g.assign(et.add(ot.mul(ut))),b.assign(it.add(At.mul(ut)))}).Else(()=>{const B=m(n.add(60)).mul(mt),R=xt(m(n.add(61))).mul(o);g.assign(Z(B).mul(R).add(m(n.add(62)).sub(.5).mul(o.mul(.21428571428571427)))),b.assign(Q(B).mul(R).add(m(n.add(63)).sub(.5).mul(o.mul(.21428571428571427))))}),k.assign(m(n.add(70)).sub(.5).mul(o).mul(.12)),M.assign(xt(g.mul(g).add(b.mul(b))).div(o)),Y.assign(Vt(M,e))});const lt=m(n.add(700));D(lt.lessThan(t(.03)),()=>{const f=t(1).add(vt(m(n.add(71)),t(.5)).mul(.6)).mul(o),A=m(n.add(72)).mul(2).sub(1),j=m(n.add(73)).mul(mt),B=xt(t(1).sub(A.mul(A)));g.assign(f.mul(B).mul(Z(j))),k.assign(f.mul(A).mul(.7)),b.assign(f.mul(B).mul(Q(j))),u.assign(u.mul(.45)),z.assign(m(n.add(200)).mul(1.4).add(.6)),M.assign(t(1))}),D(O.equal(0),()=>{const f=h(t(1),e.coreWeight.mul(.55).add(.45),e.bandBulgeBoost);u.assign(G(u.mul(f),t(.98))),v.assign(G(v.mul(f),t(.98))),z.assign(z.mul(h(t(1),t(1.35),e.bandBulgeBoost)))}).ElseIf(O.equal(1),()=>{const f=h(t(1),t(.62),e.peakAzimuthStrength);u.assign(u.mul(f)),v.assign(v.mul(h(t(1),t(.8),e.peakAzimuthStrength)))}).ElseIf(O.equal(2),()=>{const f=h(t(.72),t(1.48),at.mul(e.peakAzimuthStrength)),A=h(t(.78),t(1.34),nt(Y.sub(.55).div(1.3),t(0),t(1)));u.assign(G(u.mul(f).mul(A),t(.98))),v.assign(G(v.mul(f),t(.98))),z.assign(z.mul(h(t(.92),t(1.4),at.mul(e.peakAzimuthStrength))))});const J=vs(w(g,k,b),e);g.assign(J.x),k.assign(J.y),b.assign(J.z),M.assign(G(xt(g.mul(g).add(b.mul(b))).div(o),t(1)));const W=w(g,k,b);s.positionBuffer.element(l).assign(W),s.originalPositionBuffer.element(l).assign(W);const L=m(n.add(900)),C=m(n.add(901)),S=m(n.add(902)),E=t(0).toVar(),H=t(0).toVar(),st=t(0).toVar(),N=t(.72).toVar(),$=t(.2).toVar(),T=t(.065).toVar();D(O.equal(2),()=>{N.assign(.46),$.assign(.2),T.assign(.26)}).ElseIf(O.equal(1),()=>{N.assign(.78),$.assign(.17),T.assign(.03)}).ElseIf(O.equal(0),()=>{N.assign(.68),$.assign(.12),T.assign(.01)}),D(e.ellipticity.greaterThan(0),()=>{N.assign(.74),$.assign(.11),T.assign(.005)});const X=N,V=N.add($),U=V.add(T);D(S.lessThan(X),()=>{E.assign(t(.028).add(C.sub(.5).mul(.022))),H.assign(.85)}).ElseIf(S.lessThan(V),()=>{D(L.lessThan(t(.4)),()=>{E.assign(t(.069).add(C.sub(.5).mul(.022))),H.assign(.6)}).Else(()=>{E.assign(t(.133).add(C.sub(.5).mul(.014))),H.assign(.22)})}).ElseIf(S.lessThan(U),()=>{D(L.lessThan(t(.55)),()=>{E.assign(t(.597).add(C.sub(.5).mul(.042))),H.assign(.28)}).Else(()=>{E.assign(t(.625).add(C.sub(.5).mul(.028))),H.assign(.5)})}).Else(()=>{E.assign(t(.042).add(C.sub(.5).mul(.033))),H.assign(.7)}),st.assign(u.mul(.6)),D(x.equal(1),()=>{D(L.lessThan(t(.6)),()=>{E.assign(L.div(.6).mul(.097).add(.028)),H.assign(.5)}).Else(()=>{E.assign(L.sub(.6).div(.4).mul(.083).add(.556)),H.assign(.35)}),st.assign(u.mul(.85))});const q=hs(E,H,st),tt=w(q.x,q.y,q.z).toVar();D(e.dustStrength.greaterThan(0),()=>{const f=De(k),A=xt(g.mul(g).add(b.mul(b))),j=o.mul(.34),B=o.mul(.06).mul(.18),R=t(0).sub(A.div(P(j,t(.01)))).exp(),I=t(0).sub(f.div(P(B,t(.01)))).exp(),et=R.mul(I),it=K(e.bulgeRadius.mul(.4),e.bulgeRadius.mul(1.2),A),ut=t(0).toVar();D(e.numArms.greaterThan(0).and(e.dustArmBoost.greaterThan(0)),()=>{const Lt=Re(b,g),zt=e.armWidth.div(o).mul(.5),Dt=P(e.spiralStart.mul(o),t(.001)),wt=t(0).toVar(),ht=kt=>{D(e.numArms.greaterThan(kt),()=>{const Rt=t(kt).mul(mt).div(e.numArms),Et=P(A.div(Dt),t(1)).log().div(P(e.spiralTightness,t(.001))).mul(2.5).add(Rt),rt=Lt.sub(Et).toVar();rt.assign(rt.sub(Mt(rt.div(mt).add(.5)).mul(mt)));const Tt=t(0).sub(rt.mul(rt).div(zt.mul(zt).mul(2))).exp();wt.assign(P(wt,Tt))})};ht(0),ht(1),ht(2),ht(3),ht(4),ht(5),ut.assign(wt.mul(e.dustArmBoost))});const ot=t(8).div(P(o,t(1))),At=ms(St(g.mul(ot),b.mul(ot))),ft=e.dustStrength.mul(et).mul(it).mul(t(1).add(ut)).mul(At);tt.x.assign(q.x.mul(t(0).sub(ft.mul(.65)).exp())),tt.y.assign(q.y.mul(t(0).sub(ft.mul(.9)).exp())),tt.z.assign(q.z.mul(t(0).sub(ft.mul(1.2)).exp()))}),s.colorBuffer.element(l).assign(Pt(tt.x,tt.y,tt.z,v)),s.velocityBuffer.element(l).assign(w(v,0,0))})().compute(a)}function fs(a,s,e){return _(()=>{const l=pe,n=s.positionBuffer.element(l).toVar(),o=s.originalPositionBuffer.element(l),p=s.layerBuffer.element(l);D(e.barLength.greaterThan(0),()=>{const k=ct(w(n.x,t(0),n.z)),b=e.rotationSpeed.mul(e.deltaTime).negate();D(k.lessThan(e.barLength),()=>{n.assign(me(n,b)),s.originalPositionBuffer.element(l).assign(me(o,b))}).Else(()=>{n.assign(jt(n,e.rotationSpeed,e.rotationFalloff,e.rotationTurnover,e.deltaTime)),s.originalPositionBuffer.element(l).assign(jt(o,e.rotationSpeed,e.rotationFalloff,e.rotationTurnover,e.deltaTime))})}).Else(()=>{const k=jt(n,e.rotationSpeed,e.rotationFalloff,e.rotationTurnover,e.deltaTime);n.assign(k),s.originalPositionBuffer.element(l).assign(jt(o,e.rotationSpeed,e.rotationFalloff,e.rotationTurnover,e.deltaTime))}),s.positionBuffer.element(l).assign(n);const d=e.orbitCycleDuration,x=e.orbitFadeIn,y=e.orbitFadeOut,z=m(l.toFloat().mul(.7531).add(42)),F=bt(e.time.div(P(d,t(.1))).add(z)),c=K(t(0),x,F),u=t(1).sub(K(t(1).sub(y),t(1),F)),v=G(c,u).mul(.3).add(.7),g=s.velocityBuffer.element(l).x;s.colorBuffer.element(l).w.assign(g.mul(v)),D(p.equal(1),()=>{const k=l.toFloat().mul(.7831),b=Q(e.time.mul(2).add(k)).mul(.08).add(.92);s.colorBuffer.element(l).w.assign(g.mul(v).mul(b))})})().compute(a)}function xs(){return{mvpRow0:r(new Ot),mvpRow1:r(new Ot),mvpRow3:r(new Ot),viewZRow:r(new Ot),bhViewZ:r(0),bhNdcX:r(0),bhNdcY:r(0),ndcRadiusX:r(.04),ndcRadiusY:r(.04),depthThreshold:r(6),depthSoftness:r(10)}}function ys(a,s,e){return _(()=>{const l=pe,n=s.positionBuffer.element(l),o=e.mvpRow0,p=e.mvpRow1,d=e.mvpRow3,x=e.viewZRow,y=o.x.mul(n.x).add(o.y.mul(n.y)).add(o.z.mul(n.z)).add(o.w),z=p.x.mul(n.x).add(p.y.mul(n.y)).add(p.z.mul(n.z)).add(p.w),F=d.x.mul(n.x).add(d.y.mul(n.y)).add(d.z.mul(n.z)).add(d.w),c=x.x.mul(n.x).add(x.y.mul(n.y)).add(x.z.mul(n.z)).add(x.w),u=t(1).div(P(F,t(1e-4))),v=y.mul(u),g=z.mul(u),k=v.sub(e.bhNdcX).div(e.ndcRadiusX),b=g.sub(e.bhNdcY).div(e.ndcRadiusY),M=t(1).sub(K(t(.75),t(1.25),xt(k.mul(k).add(b.mul(b))))),O=K(e.depthThreshold,e.depthThreshold.add(e.depthSoftness),c.sub(e.bhViewZ));s.foregroundAlphaBuffer.element(l).assign(M.mul(O))})().compute(a)}class Ss{constructor(s,e,i,l,n){this.materials=[],this.uScreenH=r(800),this.rotationAge=r(0),this.bodyVisibility=r(1),this.foregroundEnabled=r(0),this.uTanHalfFov=r(Math.tan(Math.PI/6)),this.dustMap=Se(l),this.dustNode=Ce(this.dustMap);const o=e.positionBuffer.toAttribute(),p=e.colorBuffer.toAttribute(),d=e.sizeBuffer.toAttribute(),x=e.foregroundAlphaBuffer.toAttribute().mul(this.foregroundEnabled),y=n.galaxyRadius,z=T=>_(()=>{const X=ct(T),V=n.rotationSpeed.div(vt(P(X.mul(y).div(n.rotationTurnover),t(1)),n.rotationFalloff)).toVar();D(X.mul(y).lessThan(n.barLength),()=>{V.assign(n.rotationSpeed)});const U=V.mul(this.rotationAge);return St(T.x.mul(Z(U)).sub(T.y.mul(Q(U))),T.x.mul(Q(U)).add(T.y.mul(Z(U))))})(),F=ge(_(()=>{const T=o.div(y),X=ue.div(y),V=pt(X.sub(T)),U=P(De(V.y),t(.001)).toVar();D(V.y.lessThan(0),()=>{U.mulAssign(-1)});const q=t(-.018).sub(T.y).div(U),tt=t(.018).sub(T.y).div(U),f=P(t(0),G(q,tt)),A=G(G(ct(X.sub(T)),t(2.6)),P(q,tt)),j=P(t(0),A.sub(f)),B=T.add(V.mul(f.add(j.mul(.5)))),R=z(B.xz),I=this.dustNode.sample(R.div(2.6).add(.5)).level(0).r.mul(8).mul(G(j.div(.036),t(7))).mul(.65);return w(It(w(-.65,-.9,-1.2).mul(I)))})()),c=ue.sub(o).length().max(.001),v=d.mul(.3).add(.35).mul(i*1.28).div(c).clamp(.25,3.2),g=v.max(1),k=v.div(g).pow(2),b=g.mul(c).mul(this.uTanHalfFov.mul(2)).div(this.uScreenH),M=()=>{const T=new Be;return T.transparent=!0,T.depthWrite=!1,T.blending=Le,T.positionNode=o,this.materials.push(T),T},O=T=>{const X=$t().sub(.5).mul(2),V=It(X.dot(X).mul(-4.5)),U=h(p.rgb,w(.85,.9,1),t(.12)).mul(F),q=p.w.mul(V).mul(T).mul(k).mul(.65);return Pt(U.mul(1.8),q)},Y=M();Y.scaleNode=b,Y.colorNode=O(t(1).sub(x)),this.sprite=new Qt(Y),this.sprite.count=s,this.sprite.frustumCulled=!1;const at=M();at.scaleNode=b,at.colorNode=O(x),this.foregroundSprite=new Qt(at),this.foregroundSprite.count=s,this.foregroundSprite.frustumCulled=!1,this.foregroundSprite.renderOrder=2;const lt=Math.min(s,Bt.bodySamples),J=M(),W=o.length().div(y),L=K(0,.01,n.ellipticity),C=h(w(.48,.62,.9),w(.82,.71,.57),L),S=h(w(.92,.76,.55),C,W.mul(2.5).clamp(0,1)),E=It(W.mul(-2.3)).mul(t(1).sub(K(.85,1.2,W))),H=ge(h(he(z(o.xz.div(y)).mul(22)).pow(2).mul(2).add(.25),t(1),L)),st=$t().sub(.5).mul(2),N=It(st.dot(st).mul(-5)).sub(Math.exp(-5)).max(0),$=this.bodyVisibility;J.scaleNode=y.mul(Bt.bodyDiameter),J.colorNode=Pt(S.mul(F),N.mul(E).mul(H).mul($).mul(Bt.bodyOpacity*3e4/lt)),this.bodySprite=new Qt(J),this.bodySprite.count=lt,this.bodySprite.frustumCulled=!1,this.bodySprite.renderOrder=-2}updateAppearance(s){this.rotationAge.value=0;const e=this.dustMap;this.dustMap=Se(s),this.dustNode.value=this.dustMap,e.dispose()}advance(s){this.rotationAge.value+=s}updateVisibility(s,e,i){this.bodyVisibility.value=cs(s,e),this.bodySprite.visible=this.bodyVisibility.value>0,this.foregroundEnabled.value=i?1:0,this.foregroundSprite.visible=i}updateSizeUniforms(s,e){this.uScreenH.value=Math.max(s,1),this.uTanHalfFov.value=e}dispose(){this.materials.forEach(s=>s.dispose()),this.dustMap.dispose()}}class As{constructor(s,e,i,l,n,o,p=1){this.uBHScreenPos=r(new se(.5,.5)),this.uLensStrength=r(0),this.uAspectRatio=r(1),this.postProcessing=new We(s);const d=Gt(e,o),x=d.getTextureNode(),y=Gt(n,o,{samples:0});y.setResolutionScale(Bt.bodyResolutionScale);const z=y.getTextureNode(),F=x.add(z),c=Gt(i,o);this.bhPass=c,c.setResolutionScale(p);const u=c.getTextureNode(),v=Gt(l,o),g=v.getTextureNode();this.scenePasses=[d,y,c,v];const k=this.uBHScreenPos,b=this.uLensStrength,M=this.uAspectRatio,Y=_(()=>{const J=Xe.toVar(),W=k.sub(J).toVar();W.x.mulAssign(M);const L=ct(W),C=W.div(P(L,t(1e-4))),S=nt(b.div(.03),t(0),t(1)),E=h(t(.25),t(.55),S),H=K(E,t(0),L).toVar();H.mulAssign(H);const st=h(t(.012),t(.05),S),N=K(st,st.mul(2.8),L),$=P(L,h(t(.028),t(.04),S)),T=b.mul(H).mul(N).mul(h(t(.15),t(.3),S).div($)),X=C.mul(T).toVar();X.x.divAssign(M);const V=nt(J.add(X),t(0),t(1)),U=x.sample(V).add(z.sample(V)).toVar(),q=h(t(.024),t(.09),S),tt=h(t(.008),t(.024),S),A=It(vt(L.sub(q).div(tt),t(2)).negate()).mul(H).mul(N).mul(b).mul(h(t(10),t(16),S));return U.rgb.addAssign(w(.72,.62,.46).mul(A.mul(.02))),U})();this.bloomPassNode=Ue(F),this.bloomPassNode.threshold.value=.2,this.bloomPassNode.strength.value=.12,this.bloomPassNode.radius.value=.08,p<1&&(this.bloomPassNode.threshold.value=.35);const at=Y.add(this.bloomPassNode),lt=_(()=>{const J=at,W=u,L=g,S=h(J.rgb,W.rgb.mul(w(1.05,.95,.84)),W.a).add(L.rgb),E=P(J.a,P(W.a,L.a));return Pt(S.div(w(1).add(S)),E)});this.postProcessing.outputNode=lt()}render(){this.postProcessing.render()}setEffectScale(s){this.bhPass.setResolutionScale(s)}updateBloom(s,e,i){this.bloomPassNode.strength.value=s,this.bloomPassNode.radius.value=e,this.bloomPassNode.threshold.value=i}updateLensing(s,e,i){this.uBHScreenPos.value.copy(s),this.uLensStrength.value=e,this.uAspectRatio.value=i}dispose(){this.postProcessing.dispose(),this.bloomPassNode.dispose(),this.scenePasses.forEach(s=>s.dispose())}}class zs{constructor(s=60,e=1){this.uTime=r(0),this.uTiltX=r(0),this.uRotY=r(0),this.uLOD=r(0),this.uReveal=r(0),this.quadSize=s;const i=new Ee(1,4,4),l=new te({visible:!1});this.depthMesh=new ee(i,l);const n=this.uTime,o=this.uTiltX,p=this.uRotY,d=this.uLOD,x=_(()=>{const z=$t().sub(.5).mul(2),F=ct(z);D(F.greaterThan(1),()=>{Oe()});const c=w(0,-.1,0),u=t(2),v=p,g=o.add(1.2),k=w(u.mul(Z(v)).mul(Q(g)),u.mul(Z(g)),u.mul(Q(v)).mul(Q(g))),b=pt(c.sub(k)),M=pt(ve(pt(w(0,1,-.1)),b)),O=pt(ve(b,M)),Y=pt(b.mul(1.5).add(M.mul(z.x)).add(O.mul(z.y))),at=t(.13),lt=t(.3),J=t(.04),W=e<1?.024:.018,L=e<1?.016:.012,C=h(t(W),t(L),d),S=k.toVar(),E=Y.toVar();S.addAssign(E.mul(yt(Y.add(n)).mul(.01)));const H=h(t(.3),t(1),d),st=h(t(.005),t(.02),d);h(t(.1),t(.5),d);const N=w(0,0,0).toVar(),$=t(0).toVar(),T=t(0).toVar(),X=w(1,.55,.12),V=w(1,.3,.03),U=w(.45,.1,.01),q=w(.25,.15,.05),tt=n.mul(st).mul(30);Ge(200,()=>{const j=pt(S),B=ct(S),R=C.mul(lt).div(P(B.mul(B),t(.001))),I=j.mul(R),et=pt(E.sub(I)),it=E.mul(C);S.addAssign(it);const ut=ct(S);D(ut.lessThan(at),()=>{T.assign(1),be()});const ot=ct(St(S.x,S.z)),At=S.y.div(J),ft=P(t(0),t(1).sub(At.mul(At))),Lt=K(t(1.3),t(.16),ot),zt=ft.mul(Lt),Dt=ot.mul(4.27).sub(tt),wt=Z(Dt),ht=Q(Dt),kt=w(S.x.mul(wt).sub(S.z.mul(ht)),S.y.mul(8),S.x.mul(ht).add(S.z.mul(wt))).mul(14),Rt=re(kt).mul(.5).add(.5),Et=re(kt.mul(2.03)).mul(.5).add(.5),rt=re(kt.mul(4.01)).mul(.5).add(.5),Tt=Rt.mul(.25).add(Et.mul(.12)).add(rt.mul(.06)).add(.55),Wt=Re(S.x.negate(),S.z.negate()),Xt=t(1).add(Z(Wt.add(tt)).mul(.7)),Ut=nt(ot.add(Tt.sub(.5).mul(.4)),t(0),t(1)),Ft=h(h(X,V,K(t(.05),t(.425),Ut)),U,K(t(.425),t(1),Ut)),Ht=P(Tt,t(.3)),ne=Ft.mul(Ht).mul(Xt).mul(3).add(q.mul(zt).mul(2)),Ct=zt.mul(nt(Ht.mul(2),t(0),t(1))),Nt=t(1).sub($).mul(Ct);N.assign(h(N,ne,Nt)),$.assign(nt(h($,t(1),Ct),t(0),t(1))),S.addAssign(it),E.assign(et),D(Jt(S,S).greaterThan(16).and(Jt(E,S).greaterThan(0)),()=>{be()})}),N.mulAssign(H);const f=t(1).sub(K(t(.3),t(1),F));N.mulAssign(f);const A=P($.mul(f),T);return Pt(N,A.mul(this.uReveal))}),y=new te;y.transparent=!0,y.depthWrite=!1,y.side=Ye,y.fragmentNode=x(),this.mesh=new ee(new qe(1,1),y),this.mesh.scale.set(s,s,1),this.mesh.renderOrder=1}update(s,e,i,l,n,o){this.uTime.value=s,this.uTiltX.value=e,this.uRotY.value=i,this.mesh.quaternion.copy(l.quaternion);const p=l.position.length();this.uReveal.value=Fe(p,this.quadSize/.08),this.mesh.visible=this.uReveal.value>0;const x=(l.fov??60)*Math.PI/180,y=n.y*o,z=this.quadSize/p*(y/(2*Math.tan(x/2)));this.uLOD.value=Math.min(Math.max((z-6)/220,0),1)*this.uReveal.value}getLOD(){return this.uLOD.value}dispose(){this.mesh.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const ws=`// ─── Hash functions ────────────────────────────────────────────────────────

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
`;function ks(a,s){const e=s==="mobile",i=e?3:5,l=e?2:4,n=e?2:4,o=e?3:6,p=e?2:5,d=e?2:4;return a.replace(/\bSPIRAL_NOISE_ITER\b/g,String(i)).replace(/\bFBM_DETAIL_OCTAVES\b/g,String(l)).replace(/\bMAX_GALAXIES\b/g,String(n)).replace(/\bMAX_CLOUDS\b/g,String(o)).replace(/\bMAX_KNOTS\b/g,String(p)).replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g,(x,y)=>d>parseInt(y,10)?"true":"false")}function Ps(a){const s=[],e=/\bfn\s+[a-z_0-9]+\s*\(/gi;let i;const l=[];for(;(i=e.exec(a))!==null;)l.push(i.index);for(let n=0;n<l.length;n++){const o=l[n],p=a.indexOf("{",o);if(p===-1)continue;let d=0,x=p;for(;x<a.length&&(a[x]==="{"&&d++,!(a[x]==="}"&&(d--,d===0)));x++);s.push(a.substring(o,x+1))}return s}class Ts{constructor(s,e,i){this.cachedMaterial=null,this.cache=null,this.uTime=r(0),this.uSeed=r(0),this.uNebulaIntensity=r(Bt.nebulaIntensity),this.cacheSize=i==="mobile"?512:2048,this.uSeed.value=e;const l=s*12,n=new Ee(l,192,128),o=ks(ws,i),p=Ps(o),d=[];for(const u of p)d.push(je(u,[...d]));const x=d[d.length-1],y=this.uTime,z=this.uSeed,F=this.uNebulaIntensity,c=_(()=>{const u=pt(fe),v=x(u,y,z,F);return Pt(v.rgb.pow(1/2.2),1)});this.material=new te,this.material.side=xe,this.material.depthWrite=!1,this.material.depthTest=!1,this.material.fragmentNode=c(),this.mesh=new ee(n,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}prepare(s){var o;if(this.cache)return;this.cache=new Ze(this.cacheSize,{depthBuffer:!1,generateMipmaps:!1});const e=new _t;e.add(new ee(this.mesh.geometry,this.material));const i=((o=this.mesh.geometry.boundingSphere)==null?void 0:o.radius)??1e6;new Qe(.1,i*2,this.cache).update(s,e),this.cachedMaterial=new te({side:xe,depthWrite:!1,depthTest:!1});const n=Ke(this.cache.texture,pt(fe));this.cachedMaterial.fragmentNode=Pt(n.rgb.pow(w(2.2)),1),this.mesh.material=this.cachedMaterial,this.material.dispose()}update(s,e){this.mesh.position.copy(e.position)}dispose(){var s,e;this.material.dispose(),(s=this.cachedMaterial)==null||s.dispose(),(e=this.cache)==null||e.dispose(),this.mesh.geometry.dispose()}}const de=4,Ms=2,Ds=.7;class Rs{constructor(s,e,i){this.uScreenH=r(800),this.uTanHalfFov=r(Math.tan(60*Math.PI/180/2));const l=s.length,n=dt(l,"vec3"),o=dt(l,"vec3"),p=dt(l,"float"),d=dt(l,"float"),x=dt(l,"float"),y=n.value.array,z=o.value.array,F=p.value.array,c=d.value.array,u=x.value.array;for(let f=0;f<l;f++){const A=s[f];y[f*3]=A.position[0],y[f*3+1]=A.position[1],y[f*3+2]=A.position[2],z[f*3]=A.color[0],z[f*3+1]=A.color[1],z[f*3+2]=A.color[2],F[f]=A.size,c[f]=A.brightness,u[f]=A.texIndex}const v=n.toAttribute(),g=o.toAttribute(),k=p.toAttribute(),b=d.toAttribute(),M=x.toAttribute(),O=r(i),Y=this.uScreenH,at=this.uTanHalfFov,lt=0,J=5,W=ue.sub(v).length().max(t(.001)),C=k.mul(O.mul(1.28)).div(W).clamp(t(lt),t(J)).mul(W).mul(at.mul(2)).div(Y),S=Mt(M),E=Je(S,t(de)),H=Mt(S.div(t(de))),st=$t(),N=E.add(st.x).div(t(de)),$=H.add(st.y).div(t(Ms)),X=Ce(e).sample(St(N,$)),V=b.mul(t(Ds)),U=X.rgb.mul(g).mul(V),q=X.a.mul(V),tt=Pt(U,q);this.material=new Be,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=Le,this.material.positionNode=v,this.material.scaleNode=C,this.material.colorNode=tt,this.sprite=new Qt(this.material),this.sprite.count=l,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-2}updateSizeUniforms(s,e){this.uScreenH.value=Math.max(s,1),this.uTanHalfFov.value=e}dispose(){this.material.dispose()}}const ze=new gt(0,1,0),Zt=new Kt,we=new es,ke=new gt,Pe=new se,Te=new se,Me=new gt;function Cs(a){return a==="mobile"?15e4:5e5}class Is{constructor(s,e,i=[]){this.initialized=!1,this.disposed=!1,this.bandAnalysisAbort=new AbortController,this.neighborsLayer=null,this.neighborAtlas=null,this._bhScreenVec=new gt,this.animationId=0,this.lastFrameTime=0,this.galaxyRotation=0,this.orbitQuat=new Kt,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.isPanning=!1,this.pivot=new gt,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.mouse3D=new gt(0,0,0),this.raycaster=new $e,this.intersectionPlane=new ts(new gt(0,1,0),0),this.mousePressed=!1,this.rendererSize=new se,this.dpr=1,this.animate=()=>{var W;if(this.disposed)return;this.animationId=requestAnimationFrame(this.animate);const c=performance.now(),u=Math.min((c-this.lastFrameTime)/1e3,.033);this.lastFrameTime=c,this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const v=this.baseDistance/this.zoom;ke.set(0,0,v).applyQuaternion(this.orbitQuat).add(this.pivot),this.camera.position.copy(ke),this.camera.lookAt(this.pivot),this.camera.updateMatrixWorld(!0);const g=Fe(this.camera.position.length(),this.params.galaxyRadius)>0;this.particles.updateVisibility(this.camera.position.length(),this.params.galaxyRadius,g);const k=this.params.rotationOmega0*Bt.motionScale;this.galaxyRotation+=u*k;const b=this.uniforms.time.value+u;if(this.uniforms.time.value=b,this.uniforms.deltaTime.value=u,this.uniforms.rotationSpeed.value=k,this.uniforms.mouse.value.copy(this.mouse3D),this.uniforms.mouseActive.value=this.mousePressed?1:0,this.initialized){this.particles.advance(u),this.renderer.compute(this.computeUpdate);const L=this.camera.matrixWorldInverse.elements;we.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);const C=we.elements;this.fgUniforms.mvpRow0.value.set(C[0],C[4],C[8],C[12]),this.fgUniforms.mvpRow1.value.set(C[1],C[5],C[9],C[13]),this.fgUniforms.mvpRow3.value.set(C[3],C[7],C[11],C[15]),this.fgUniforms.viewZRow.value.set(L[2],L[6],L[10],L[14]),this.fgUniforms.bhViewZ.value=L[14];const S=this._bhScreenVec.set(0,0,0).project(this.camera);this.fgUniforms.bhNdcX.value=S.x,this.fgUniforms.bhNdcY.value=S.y;const E=this.camera.position,H=E.length(),st=1-Math.abs(E.y)/Math.max(H,1e-4),N=Yt.smoothstep(st,.55,.95);this.fgUniforms.depthThreshold.value=Yt.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),N),this.fgUniforms.depthSoftness.value=Yt.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),N);const $=this.params.galaxyRadius*.08,T=this.camera.fov*Math.PI/180,X=this.rendererSize.y*this.dpr,V=Math.tan(T/2),U=$/H*(X/(2*V));this.particles.updateSizeUniforms(X,V),(W=this.neighborsLayer)==null||W.updateSizeUniforms(X,V);const q=Yt.lerp(.75,1.2,N),tt=this.canvas.clientWidth,f=this.canvas.clientHeight;this.fgUniforms.ndcRadiusX.value=Math.max(U*q/Math.max(tt*.5,1),.04),this.fgUniforms.ndcRadiusY.value=Math.max(U*q/Math.max(f*.5,1),.04),g&&this.renderer.compute(this.computeForeground)}this.backdrop.update(b,this.camera),this.haze.update(this.camera);const M=this.camera.position,O=Math.sqrt(M.x*M.x+M.z*M.z),Y=Math.atan2(M.y,O),at=Math.atan2(M.x,M.z);this.blackHole.update(b,Y,at,this.camera,this.rendererSize,this.dpr),this._bhScreenVec.set(0,0,0).project(this.camera);const lt=this.blackHole.getLOD(),J=lt*lt*.03;Te.set(this._bhScreenVec.x*.5+.5,.5-this._bhScreenVec.y*.5),this.postProcessing.updateLensing(Te,J,this.camera.aspect),this.postProcessing.render()},this.canvas=s,this.galaxy=e,this.quality=os();const l=Cs(this.quality);this.scene=new _t,this.bhScene=new _t,this.fgScene=new _t,this.bodyScene=new _t,this.params=ye(e);const n=this.params.galaxyRadius;this.baseDistance=n*1.7;const o=s.clientWidth/s.clientHeight;this.camera=new ss(60,o,.1,this.baseDistance*20),this.buffers=ps(l),this.uniforms=gs(this.params),this.computeInit=bs(l,this.buffers,this.uniforms),this.computeUpdate=fs(l,this.buffers,this.uniforms),this.fgUniforms=xs(),this.computeForeground=ys(l,this.buffers,this.fgUniforms),this.backdrop=new Ts(this.baseDistance,e.pgc,this.quality),this.scene.add(this.backdrop.mesh),this.particles=new Ss(l,this.buffers,this.baseDistance,this.params,this.uniforms),this.scene.add(this.particles.sprite),this.bodyScene.add(this.particles.bodySprite),this.haze=new ls(this.params),this.scene.add(this.haze.mesh),this.blackHole=new zs(n*.08,oe(this.quality,s.clientWidth*Math.min(window.devicePixelRatio,Ae(this.quality)))),this.bhScene.add(this.blackHole.depthMesh),this.bhScene.add(this.blackHole.mesh),this.fgScene.add(this.particles.foregroundSprite);const p=as(e,i,this.baseDistance);p.length>0&&(this.neighborAtlas=ds(),this.neighborsLayer=new Rs(p,this.neighborAtlas,this.baseDistance),this.scene.add(this.neighborsLayer.sprite));const d=le(o);this.zoom=d,this.targetZoom=d;const{initRotY:x,initTiltX:y}=rs(e),z=new Kt().setFromAxisAngle(new gt(1,0,0),y),F=new Kt().setFromAxisAngle(ze,x);this.orbitQuat.multiplyQuaternions(F,z),this.onPointerDown=c=>{this.isPinching||(c.button===2?(this.isPanning=!0,this.isDragging=!1):this.isDragging=!0,this.lastX=c.clientX,this.lastY=c.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=c=>{if(this.isPinching)return;if(this.isPanning){this.applyPan(c.clientX-this.lastX,c.clientY-this.lastY),this.lastX=c.clientX,this.lastY=c.clientY;return}if(!this.isDragging)return;const u=c.clientX-this.lastX,v=c.clientY-this.lastY;this.velocityX=u*.005,this.velocityY=v*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=c.clientX,this.lastY=c.clientY},this.onPointerUp=()=>{this.isDragging=!1,this.isPanning=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1,this.isPanning=!1},this.onWheel=c=>{c.preventDefault();const u=this.targetZoom*.12;this.targetZoom+=c.deltaY>0?-u:u,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=c=>{if(c.touches.length===2){c.preventDefault(),this.isPinching=!0,this.isDragging=!1;const u=c.touches[0].clientX-c.touches[1].clientX,v=c.touches[0].clientY-c.touches[1].clientY;this.lastPinchDist=Math.sqrt(u*u+v*v)}},this.onTouchMove=c=>{if(c.touches.length===2){c.preventDefault();const u=c.touches[0].clientX-c.touches[1].clientX,v=c.touches[0].clientY-c.touches[1].clientY,g=Math.sqrt(u*u+v*v),k=(g-this.lastPinchDist)*.01;this.lastPinchDist=g,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+k))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onMouseDown=c=>{c.button!==2&&(this.mousePressed=!0)},this.onMouseUp=()=>{this.mousePressed=!1},this.onMouseMove=c=>{Pe.set(c.clientX/s.clientWidth*2-1,-(c.clientY/s.clientHeight)*2+1),this.raycaster.setFromCamera(Pe,this.camera),this.raycaster.ray.intersectPlane(this.intersectionPlane,this.mouse3D)},this.onContextMenu=c=>c.preventDefault(),s.addEventListener("pointerdown",this.onPointerDown),s.addEventListener("pointermove",this.onPointerMove),s.addEventListener("pointerup",this.onPointerUp),s.addEventListener("pointercancel",this.onPointerCancel),s.addEventListener("pointerleave",this.onPointerUp),s.addEventListener("wheel",this.onWheel,{passive:!1}),s.addEventListener("touchstart",this.onTouchStart,{passive:!1}),s.addEventListener("touchmove",this.onTouchMove,{passive:!1}),s.addEventListener("touchend",this.onTouchEnd),s.addEventListener("mousedown",this.onMouseDown),s.addEventListener("mouseup",this.onMouseUp),s.addEventListener("mousemove",this.onMouseMove),s.addEventListener("contextmenu",this.onContextMenu),this.resizeObserver=new ResizeObserver(()=>{var g;const c=s.clientWidth,u=s.clientHeight;if(c===0||u===0||!this.renderer)return;this.renderer.setSize(c,u,!1),this.renderer.getSize(this.rendererSize),(g=this.postProcessing)==null||g.setEffectScale(oe(this.quality,c*this.dpr));const v=le(c/u)/le(this.camera.aspect);this.zoom*=v,this.targetZoom*=v,this.camera.aspect=c/u,this.camera.updateProjectionMatrix()}),this.resizeObserver.observe(s)}applyPan(s,e){const i=this.baseDistance/this.zoom,l=this.camera.fov*Math.PI/180,n=2*i*Math.tan(l/2)/Math.max(this.canvas.clientHeight,1),o=new gt(1,0,0).applyQuaternion(this.orbitQuat),p=new gt(0,1,0).applyQuaternion(this.orbitQuat);this.pivot.addScaledVector(o,-s*n),this.pivot.addScaledVector(p,e*n);const d=this.baseDistance*8;this.pivot.length()>d&&this.pivot.setLength(d)}applyOrbitDelta(s,e){Zt.setFromAxisAngle(ze,-s),this.orbitQuat.premultiply(Zt),Me.set(1,0,0).applyQuaternion(this.orbitQuat),Zt.setFromAxisAngle(Me,-e),this.orbitQuat.premultiply(Zt),this.orbitQuat.normalize()}async start(){const s=us(this.galaxy.pgc,this.bandAnalysisAbort.signal);if(this.renderer=new ns({canvas:this.canvas,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,Ae(this.quality))),this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight,!1),this.dpr=this.renderer.getPixelRatio(),this.renderer.getSize(this.rendererSize),await this.renderer.init(),this.disposed)return;this.backdrop.prepare(this.renderer);const e=oe(this.quality,this.rendererSize.x*this.dpr);this.postProcessing=new As(this.renderer,this.scene,this.bhScene,this.fgScene,this.bodyScene,this.camera,e),await this.renderer.computeAsync(this.computeInit),!this.disposed&&(this.initialized=!0,this.lastFrameTime=performance.now(),this.animate(),s.then(async i=>{if(!(!i||this.disposed||!this.initialized))try{if(this.params=ye(this.galaxy,i),He(this.uniforms,this.params),this.disposed||(await this.renderer.computeAsync(this.computeInit),this.disposed))return;this.particles.updateAppearance(this.params),this.haze.updateAppearance(this.params)}catch(l){this.disposed||console.warn("Band-guided WebGPU upgrade failed; keeping procedural render:",l)}}))}dispose(){var e,i,l,n;if(this.disposed)return;this.disposed=!0,this.bandAnalysisAbort.abort(),cancelAnimationFrame(this.animationId);const s=this.canvas;s.removeEventListener("pointerdown",this.onPointerDown),s.removeEventListener("pointermove",this.onPointerMove),s.removeEventListener("pointerup",this.onPointerUp),s.removeEventListener("pointercancel",this.onPointerCancel),s.removeEventListener("pointerleave",this.onPointerUp),s.removeEventListener("wheel",this.onWheel),s.removeEventListener("touchstart",this.onTouchStart),s.removeEventListener("touchmove",this.onTouchMove),s.removeEventListener("touchend",this.onTouchEnd),s.removeEventListener("mousedown",this.onMouseDown),s.removeEventListener("mouseup",this.onMouseUp),s.removeEventListener("mousemove",this.onMouseMove),s.removeEventListener("contextmenu",this.onContextMenu),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.blackHole.dispose(),(e=this.postProcessing)==null||e.dispose(),(i=this.neighborsLayer)==null||i.dispose(),(l=this.neighborAtlas)==null||l.dispose(),(n=this.renderer)==null||n.dispose()}}export{Is as GalaxySceneWebGPU};
