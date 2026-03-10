import{U as _,X as se,Y as Z,Z as t,_ as F,$ as A,a0 as U,a1 as q,a2 as j,a3 as te,a4 as Ee,a5 as ue,a6 as R,a7 as de,a8 as ie,a9 as $,aa as m,V as ae,ab as fe,ac as B,ad as J,ae as ce,af as et,ag as be,ah as Ae,ai as Q,aj as dt,ak as Ve,A as Xe,r as Ue,al as Oe,i as Me,am as ut,an as Ne,ao as ht,ap as mt,aq as pt,d as tt,ar as qe,M as Ye,as as gt,at as Qe,au as ft,av as Ke,v as vt,j as bt,aw as xt,ax as yt,ay as wt,Q as ke,az as St,aA as zt,f as Tt,k as Re,S as _e,P as At,aB as Rt}from"./three-BivkH6X_.js";import{m as Dt}from"./morphologyMapper-DirS7Qm3.js";import{c as Pt,d as Ct,g as Mt,a as kt}from"./qualityDetect-D7HRAbJg.js";const l=_(([i])=>{const e=se(i.mul(.1031)),s=e.add(19.19);return se(s.mul(s.add(47.43)).mul(e))}),ne=_(([i])=>{const e=se(i.mul(A(.16532,.17369,.15787))).toVar();return e.addAssign(Ee(e,e.yzx.add(19.19))),se(e.x.mul(e.y).mul(e.z))}),De=_(([i])=>se(U(Ee(i,de(2.31,53.21)).mul(124.123)).mul(412)));_(([i])=>{const e=ue(i),s=se(i),c=s.mul(s).mul(t(3).sub(s.mul(2)));return R(R(De(e),De(e.add(de(1,0))),c.x),R(De(e.add(de(0,1))),De(e.add(de(1,1))),c.x),c.y)});const He=_(([i])=>{const e=ue(i),s=se(i),c=s.mul(s).mul(t(3).sub(s.mul(2))),a=ne(e.add(A(0,0,0))),n=ne(e.add(A(1,0,0))),o=ne(e.add(A(0,1,0))),p=ne(e.add(A(1,1,0))),f=ne(e.add(A(0,0,1))),u=ne(e.add(A(1,0,1))),k=ne(e.add(A(0,1,1))),L=ne(e.add(A(1,1,1))),d=R(a,n,c.x),g=R(o,p,c.x),x=R(f,u,c.x),y=R(k,L,c.x),r=R(d,g,c.y),h=R(x,y,c.y);return R(r,h,c.z).mul(2).sub(1)});_(([i,e])=>j(i).sub(e));_(([i,e])=>{const s=de(j(i.xz).sub(e.x),i.y);return j(s).sub(e.y)});const ve=_(([i,e])=>{const s=U(e),c=q(e),a=i.x.mul(s).sub(i.z.mul(c)),n=i.x.mul(c).add(i.z.mul(s));return A(a,i.y,n)}),oe=_(([i,e,s])=>{const c=j(A(i.x,t(0),i.z)),a=t(20),n=F(c,a).div(a),o=t(1).div(te(n,t(.35))),p=e.mul(o).mul(s).negate();return ve(i,p)});_(([i,e,s,c,a,n])=>{const o=e.sub(i),p=j(o),f=s.mul(F(t(0),t(1).sub(p.div(a))));return ie(o).mul(c).mul(f).mul(n).negate()});_(([i,e,s,c])=>e.sub(i).mul(s).mul(c));const Et=_(([i,e,s])=>{const c=e.mul(Z(s,t(1).sub(s))),a=se(i.mul(12).add(0).div(12)).mul(12),n=se(i.mul(12).add(8).div(12)).mul(12),o=se(i.mul(12).add(4).div(12)).mul(12),p=s.sub(c.mul(F(Z(Z(a.sub(3),t(9).sub(a)),t(1)),t(-1)))),f=s.sub(c.mul(F(Z(Z(n.sub(3),t(9).sub(n)),t(1)),t(-1)))),u=s.sub(c.mul(F(Z(Z(o.sub(3),t(9).sub(o)),t(1)),t(-1))));return A(p,f,u)});function Lt(i){return{positionBuffer:$(i,"vec3"),originalPositionBuffer:$(i,"vec3"),velocityBuffer:$(i,"vec3"),colorBuffer:$(i,"vec4"),sizeBuffer:$(i,"float"),layerBuffer:$(i,"float"),foregroundAlphaBuffer:$(i,"float")}}function Bt(i){const e=i.morphology;return{numArms:m(e.numArms),armWidth:m(e.armWidth*i.galaxyRadius),spiralTightness:m(e.spiralTightness),spiralStart:m(e.spiralStart),bulgeRadius:m(e.bulgeRadius*i.galaxyRadius),fieldStarFraction:m(e.fieldStarFraction),irregularity:m(e.irregularity),barLength:m(e.barLength*i.galaxyRadius),barWidth:m(e.barWidth*i.galaxyRadius),axisRatio:m(e.axisRatio),ellipticity:m(e.ellipticity),bulgeFraction:m(e.bulgeFraction),diskThickness:m(e.diskThickness),clumpCount:m(e.clumpCount),galaxyRadius:m(i.galaxyRadius),galaxySeed:m(i.starCount*.61803398875),time:m(0),deltaTime:m(.016),rotationSpeed:m(.033),mouse:m(new ae(0,0,0)),mouseActive:m(0),mouseForce:m(7),mouseRadius:m(i.galaxyRadius*.3)}}const re=6.28318530718;function Ft(i,e,s){return _(()=>{const a=fe,n=a.toFloat(),o=s.galaxyRadius,p=o.mul(.06),f=l(n.add(100)),u=t(0).toVar();B(f.greaterThan(.97),()=>{u.assign(2)}).ElseIf(f.greaterThan(.65),()=>{u.assign(1)}),e.layerBuffer.element(a).assign(u);const k=l(n.add(200)),L=t(0).toVar();B(u.equal(0),()=>{L.assign(k.mul(1.5).add(.8))}).ElseIf(u.equal(1),()=>{L.assign(k.mul(3).add(1.5))}).Else(()=>{L.assign(k.mul(6).add(4))}),e.sizeBuffer.element(a).assign(L);const d=l(n.add(300)),g=l(n.add(400)),x=t(0).toVar(),y=t(0).toVar();B(u.equal(0),()=>{x.assign(d.mul(.16).add(.08)),y.assign(g.mul(.2).add(.12))}).ElseIf(u.equal(1),()=>{x.assign(d.mul(.4).add(.32)),y.assign(g.mul(.4).add(.4))}).Else(()=>{x.assign(d.mul(.16).add(.64)),y.assign(g.mul(.24).add(.56))});const r=t(0).toVar(),h=t(0).toVar(),w=t(0).toVar(),C=t(0).toVar();B(s.numArms.greaterThan(0),()=>{const S=l(n.add(500)),v=s.bulgeRadius,T=Z(t(.25),t(.1).add(t(.2).mul(v.div(o)))),z=s.fieldStarFraction;B(S.lessThan(T),()=>{const b=te(l(n.add(10)),t(.6)).mul(v),E=l(n.add(11)).mul(re),N=l(n.add(12)).sub(.5).mul(v).mul(.5);r.assign(U(E).mul(b)),h.assign(N),w.assign(q(E).mul(b)),C.assign(b.div(v).mul(.3))}).ElseIf(S.lessThan(T.add(z)),()=>{const b=J(l(n.add(20))).mul(o),E=l(n.add(21)).mul(re),N=l(n.add(22)).sub(.5).mul(o).mul(.08);r.assign(U(E).mul(b)),h.assign(N),w.assign(q(E).mul(b)),C.assign(b.div(o))}).Else(()=>{const b=s.numArms,N=ue(l(n.add(30)).mul(b)).mul(re).div(b),Y=F(s.spiralStart.mul(o),t(.001)),W=s.barLength.mul(.5),G=Z(F(Y,W),o.mul(.98)),ee=l(n.add(31)),K=J(ee.mul(o.mul(o).sub(G.mul(G))).add(G.mul(G))),xe=t(2.5),Le=F(K.div(Y),t(1)).log().div(F(s.spiralTightness,t(.001))).mul(xe),Be=K.div(o).mul(.5).add(.5),ye=l(n.add(32)).sub(.5).add(l(n.add(33)).sub(.5)).mul(s.armWidth).mul(Be),he=s.irregularity.mul(l(n.add(35)).sub(.5)).mul(30),Fe=l(n.add(34)).sub(.5).mul(.3),le=Le.add(N).add(Fe),me=le.add(t(Math.PI/2)),pe=U(le).mul(K.add(he)).add(U(me).mul(ye)),ge=q(le).mul(K.add(he)).add(q(me).mul(ye)),we=K.div(o),Se=o.mul(.06).mul(t(1).sub(we.mul(.7))),ze=l(n.add(36)).sub(.5).mul(Se);r.assign(pe),h.assign(ze),w.assign(ge);const Te=J(pe.mul(pe).add(ge.mul(ge)));C.assign(Te.div(o))}),B(s.barLength.greaterThan(0),()=>{const b=l(n.add(600));B(b.lessThan(.25),()=>{const E=s.barLength,N=s.barWidth,Y=l(n.add(40)).sub(.5).mul(2).mul(E),W=l(n.add(41)).sub(.5).mul(N);r.assign(Y),h.assign(l(n.add(42)).sub(.5).mul(o).mul(.04)),w.assign(W),C.assign(t(.1))})})}),B(s.numArms.equal(0).and(s.barLength.equal(0)).and(s.clumpCount.equal(0)).and(s.ellipticity.equal(0)).and(s.bulgeFraction.greaterThan(0)),()=>{const S=s.bulgeRadius,v=te(l(n.add(10)),t(.55)).mul(o),T=l(n.add(11)).mul(re),z=v.div(o),b=o.mul(.06).mul(te(F(t(1).sub(z),t(0)),t(2))),E=l(n.add(12)).sub(.5).mul(b);r.assign(U(T).mul(v)),h.assign(E),w.assign(q(T).mul(v));const N=ce(t(1).sub(v.div(F(S,t(1)))),t(0),t(1)),Y=t(1).add(N.mul(.4));x.assign(Z(x.mul(Y),t(.95))),y.assign(Z(y.mul(Y),t(.95))),L.assign(L.mul(t(1).add(N.mul(.3)))),C.assign(z.mul(.2))}),B(s.ellipticity.greaterThan(0),()=>{const S=s.axisRatio,v=te(l(n.add(10)),t(.4)).mul(o),T=l(n.add(11)).mul(re),z=v.mul(U(T)),b=v.mul(q(T)).mul(S),E=J(z.mul(z).add(b.mul(b))).div(o),N=l(n.add(12)).sub(.5).mul(o).mul(.1).mul(t(1).sub(E.mul(.5)));r.assign(z),h.assign(N),w.assign(b),C.assign(E)}),B(s.clumpCount.greaterThan(0),()=>{const S=s.irregularity,v=s.clumpCount,T=l(n.add(500));B(T.greaterThan(S),()=>{const z=ue(l(n.add(50)).mul(v)),b=z.div(v).mul(re).add(l(z.add(1e3)).mul(.5)),E=l(z.add(2e3)).mul(.6).add(.2).mul(o),N=U(b).mul(E),Y=q(b).mul(E),W=l(z.add(3e3)).mul(80).add(30),G=l(n.add(51)).sub(.5).add(l(n.add(52)).sub(.5)).mul(2),ee=l(n.add(53)).sub(.5).add(l(n.add(54)).sub(.5)).mul(2);r.assign(N.add(G.mul(W))),w.assign(Y.add(ee.mul(W)))}).Else(()=>{const z=l(n.add(60)).mul(re),b=J(l(n.add(61))).mul(o);r.assign(U(z).mul(b).add(l(n.add(62)).sub(.5).mul(60))),w.assign(q(z).mul(b).add(l(n.add(63)).sub(.5).mul(60)))}),h.assign(l(n.add(70)).sub(.5).mul(o).mul(.12)),C.assign(J(r.mul(r).add(w.mul(w))).div(o))});const M=J(r.mul(r).add(w.mul(w)));B(M.lessThan(p),()=>{const S=et(w,r),v=p.add(l(n.add(800)).mul(o.mul(.1)));r.assign(U(S).mul(v)),w.assign(q(S).mul(v))});const I=A(r,h,w);e.positionBuffer.element(a).assign(I),e.originalPositionBuffer.element(a).assign(I);const O=l(n.add(900)),H=l(n.add(901)),V=t(0).toVar();B(u.equal(0),()=>{V.assign(O.mul(.111).add(.667))}).ElseIf(u.equal(2),()=>{V.assign(O.mul(.097).add(.028))}).Else(()=>{const S=te(ce(C,t(0),t(1)),t(.6)),v=R(t(.35),t(.05),S),T=R(t(.65),t(.15),S),z=R(t(.9),t(.3),S),b=R(t(.98),t(.5),S),E=R(t(1),t(.85),S);B(O.lessThan(v),()=>{V.assign(t(.028).add(H.sub(.5).mul(.022)))}).ElseIf(O.lessThan(T),()=>{V.assign(t(.069).add(H.sub(.5).mul(.022)))}).ElseIf(O.lessThan(z),()=>{V.assign(t(.117).add(H.sub(.5).mul(.017)))}).ElseIf(O.lessThan(b),()=>{V.assign(t(.153).add(H.sub(.5).mul(.014)))}).ElseIf(O.lessThan(E),()=>{V.assign(t(.583).add(H.sub(.5).mul(.042)))}).Else(()=>{V.assign(t(.625).add(H.sub(.5).mul(.028)))})});const D=t(0).toVar(),X=t(0).toVar();B(u.equal(0),()=>{D.assign(.3),X.assign(x.mul(.4))}).ElseIf(u.equal(1),()=>{D.assign(.65),X.assign(x.mul(.6))}).Else(()=>{D.assign(.5),X.assign(x.mul(.85))});const P=Et(V,D,X);e.colorBuffer.element(a).assign(be(P.x,P.y,P.z,y)),e.velocityBuffer.element(a).assign(A(0,0,0))})().compute(i)}function It(i,e,s){return _(()=>{const a=fe,n=e.positionBuffer.element(a).toVar(),o=e.originalPositionBuffer.element(a);B(s.barLength.greaterThan(0),()=>{const f=j(A(n.x,t(0),n.z)),u=s.rotationSpeed.mul(s.deltaTime).negate();B(f.lessThan(s.barLength),()=>{n.assign(ve(n,u)),e.originalPositionBuffer.element(a).assign(ve(o,u))}).Else(()=>{n.assign(oe(n,s.rotationSpeed,s.deltaTime)),e.originalPositionBuffer.element(a).assign(oe(o,s.rotationSpeed,s.deltaTime))})}).Else(()=>{const f=oe(n,s.rotationSpeed,s.deltaTime);n.assign(f),e.originalPositionBuffer.element(a).assign(oe(o,s.rotationSpeed,s.deltaTime))}),e.positionBuffer.element(a).assign(n);const p=e.layerBuffer.element(a);B(p.equal(2),()=>{const f=e.colorBuffer.element(a),u=a.toFloat().mul(.7831),k=q(s.time.mul(2).add(u)).mul(.15).add(.85),L=f.w;e.colorBuffer.element(a).w.assign(L.mul(k))})})().compute(i)}function Nt(){return{mvpRow0:m(new Ae),mvpRow1:m(new Ae),mvpRow3:m(new Ae),viewZRow:m(new Ae),bhViewZ:m(0),bhNdcX:m(0),bhNdcY:m(0),ndcRadiusX:m(.04),ndcRadiusY:m(.04),depthThreshold:m(6),depthSoftness:m(10)}}function _t(i,e,s){return _(()=>{const a=fe,n=e.positionBuffer.element(a),o=s.mvpRow0,p=s.mvpRow1,f=s.mvpRow3,u=s.viewZRow,k=o.x.mul(n.x).add(o.y.mul(n.y)).add(o.z.mul(n.z)).add(o.w),L=p.x.mul(n.x).add(p.y.mul(n.y)).add(p.z.mul(n.z)).add(p.w),d=f.x.mul(n.x).add(f.y.mul(n.y)).add(f.z.mul(n.z)).add(f.w),g=u.x.mul(n.x).add(u.y.mul(n.y)).add(u.z.mul(n.z)).add(u.w),x=t(1).div(F(d,t(1e-4))),y=k.mul(x),r=L.mul(x),h=y.sub(s.bhNdcX).div(s.ndcRadiusX),w=r.sub(s.bhNdcY).div(s.ndcRadiusY),C=t(1).sub(Q(t(.75),t(1.25),J(h.mul(h).add(w.mul(w))))),M=Q(s.depthThreshold,s.depthThreshold.add(s.depthSoftness),g.sub(s.bhViewZ));e.foregroundAlphaBuffer.element(a).assign(C.mul(M))})().compute(i)}class Ht{constructor(e,s,c){const a=s.positionBuffer.toAttribute(),n=s.colorBuffer.toAttribute(),o=s.sizeBuffer.toAttribute(),p=s.foregroundAlphaBuffer.toAttribute(),f=Math.sqrt(6e4/e),u=c*.003*f,k=Pt();this.glowTexture=k;const L=dt(k),d=g=>{const x=L.sample(Oe()),y=n.w.mul(x.w).mul(g),r=R(A(n.x,n.y,n.z).mul(1.32),A(1,1,1),t(.12)),h=R(r,A(1,1,1),t(.92)),w=r.mul(x.x).add(h.mul(x.y.mul(1.35)));return be(w.mul(y),y)};this.material=new Ve,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=Xe,this.material.positionNode=a,this.material.scaleNode=o.mul(u),this.material.colorNode=d(t(1).sub(p)),this.sprite=new Ue(this.material),this.sprite.count=e,this.sprite.frustumCulled=!1,this.foregroundMaterial=new Ve,this.foregroundMaterial.transparent=!0,this.foregroundMaterial.depthWrite=!1,this.foregroundMaterial.blending=Xe,this.foregroundMaterial.positionNode=a,this.foregroundMaterial.scaleNode=o.mul(u),this.foregroundMaterial.colorNode=d(p),this.foregroundSprite=new Ue(this.foregroundMaterial),this.foregroundSprite.count=e,this.foregroundSprite.frustumCulled=!1,this.foregroundSprite.renderOrder=2}dispose(){this.material.dispose(),this.foregroundMaterial.dispose(),this.glowTexture.dispose()}}const Vt=_(([i])=>{const e=F(i.r,F(i.g,i.b)),s=Z(i.r,Z(i.g,i.b)),c=e.sub(s),a=Q(t(.06),t(.3),c).mul(t(1).sub(Q(t(.28),t(.95),e)));return te(F(i,A(0)),A(1.14,1.14,1.14)).mul(R(t(.9),t(.45),a)).mul(A(1.06,.93,.82))});class Xt{constructor(e,s,c,a,n){this.uBHScreenPos=m(new Me(.5,.5)),this.uLensStrength=m(0),this.uAspectRatio=m(1),this.postProcessing=new ut(e);const p=Ne(s,n).getTextureNode(),u=Ne(c,n).getTextureNode(),L=Ne(a,n).getTextureNode(),d=this.uBHScreenPos,g=this.uLensStrength,x=this.uAspectRatio,r=_(()=>{const C=ht.toVar(),M=d.sub(C).toVar();M.x.mulAssign(x);const I=j(M),O=M.div(F(I,t(1e-4))),H=ce(g.div(.03),t(0),t(1)),V=R(t(.25),t(.55),H),D=Q(V,t(0),I).toVar();D.mulAssign(D);const X=R(t(.012),t(.05),H),P=Q(X,X.mul(2.8),I),S=F(I,R(t(.028),t(.04),H)),v=g.mul(D).mul(P).mul(R(t(.15),t(.3),H).div(S)),T=O.mul(v).toVar();T.x.divAssign(x);const z=ce(C.add(T),t(0),t(1)),b=p.sample(z).toVar();b.rgb.assign(Vt(b.rgb));const E=R(t(.024),t(.09),H),N=R(t(.008),t(.024),H),W=mt(te(I.sub(E).div(N),t(2)).negate()).mul(D).mul(P).mul(g).mul(R(t(10),t(16),H));return b.rgb.addAssign(A(.72,.62,.46).mul(W.mul(.02))),b})();this.bloomPassNode=pt(p),this.bloomPassNode.threshold.value=.2,this.bloomPassNode.strength.value=.12,this.bloomPassNode.radius.value=.08;const h=r.add(this.bloomPassNode),w=_(()=>{const C=h,M=u,I=L,H=R(C.rgb,M.rgb.mul(A(1.05,.95,.84)),M.a).add(I.rgb),V=F(C.a,F(M.a,I.a));return be(Z(H,t(1)),V)});this.postProcessing.outputNode=w()}render(){this.postProcessing.render()}updateBloom(e,s,c){this.bloomPassNode.strength.value=e,this.bloomPassNode.radius.value=s,this.bloomPassNode.threshold.value=c}updateLensing(e,s,c){this.uBHScreenPos.value.copy(e),this.uLensStrength.value=s,this.uAspectRatio.value=c}dispose(){}}const Pe=6.28318530718,Ut=3e4;function qt(i){return i==="mobile"?1e4:Ut}class Yt{constructor(e,s,c){const a=qt(c);this.positionBuffer=$(a,"vec3"),this.originalPositionBuffer=$(a,"vec3"),this.colorBuffer=$(a,"vec3"),this.sizeBuffer=$(a,"float");const n=this.positionBuffer,o=this.originalPositionBuffer,p=this.colorBuffer,f=this.sizeBuffer;this.computeInit=_(()=>{const y=fe,r=y.toFloat().add(1e4),h=e.galaxyRadius,w=t(0).toVar(),C=t(0).toVar(),M=t(0).toVar(),I=t(0).toVar();B(e.numArms.greaterThan(0),()=>{const P=l(r.add(1)),S=F(e.spiralStart.mul(h),t(.001)),v=e.barLength.mul(.5),T=Z(F(S,v),h.mul(.98)),z=J(P.mul(h.mul(h).sub(T.mul(T))).add(T.mul(T)));I.assign(z.div(h));const E=ue(l(r.add(2)).mul(e.numArms)).mul(Pe).div(e.numArms),N=t(2.5),Y=F(z.div(S),t(1)).log().div(F(e.spiralTightness,t(.001))).mul(N),W=l(r.add(3)).sub(.5).mul(.15),G=l(r.add(4)).sub(.5).mul(e.armWidth).mul(.4),ee=E.add(Y).add(W);w.assign(U(ee).mul(z.add(G))),M.assign(q(ee).mul(z.add(G)));const K=t(1).sub(I).add(.15);C.assign(l(r.add(5)).sub(.5).mul(h.mul(.03)).mul(K))}),B(e.numArms.equal(0).and(e.barLength.equal(0)).and(e.clumpCount.equal(0)).and(e.ellipticity.equal(0)).and(e.bulgeFraction.greaterThan(0)),()=>{const P=te(l(r.add(1)),t(.5)).mul(h),S=l(r.add(2)).mul(Pe);I.assign(P.div(h)),w.assign(U(S).mul(P)),M.assign(q(S).mul(P));const v=h.mul(.03).mul(t(1).sub(I.mul(.5)));C.assign(l(r.add(5)).sub(.5).mul(v))}),B(e.ellipticity.greaterThan(0),()=>{const P=e.axisRatio,S=te(l(r.add(1)),t(.4)).mul(h),v=l(r.add(2)).mul(Pe),T=S.mul(U(v)),z=S.mul(q(v)).mul(P);I.assign(J(T.mul(T).add(z.mul(z))).div(h)),w.assign(T),M.assign(z),C.assign(l(r.add(5)).sub(.5).mul(h).mul(.08).mul(t(1).sub(I.mul(.5))))}),B(e.clumpCount.greaterThan(0),()=>{const P=e.clumpCount,S=ue(l(r.add(2)).mul(P)),v=S.div(P).mul(Pe).add(l(S.add(5e3)).mul(.5)),T=l(S.add(6e3)).mul(.6).add(.2).mul(h),z=U(v).mul(T),b=q(v).mul(T),E=l(S.add(7e3)).mul(80).add(30),N=l(r.add(3)).sub(.5).add(l(r.add(4)).sub(.5)).mul(2),Y=l(r.add(7)).sub(.5).add(l(r.add(8)).sub(.5)).mul(2);w.assign(z.add(N.mul(E))),M.assign(b.add(Y.mul(E))),I.assign(J(w.mul(w).add(M.mul(M))).div(h)),C.assign(l(r.add(5)).sub(.5).mul(h).mul(.1))});const O=A(w,C,M);n.element(y).assign(O),o.element(y).assign(O);const V=A(.9,.82,.78).mul(t(.7).sub(I.mul(.3)));p.element(y).assign(V);const D=t(1).sub(I.mul(.5)),X=l(r.add(6)).mul(.5).add(.7).mul(D);f.element(y).assign(X)})().compute(a),this.computeUpdate=_(()=>{const y=fe,r=n.element(y).toVar(),h=o.element(y);B(e.barLength.greaterThan(0),()=>{const w=j(A(r.x,t(0),r.z)),C=e.rotationSpeed.mul(e.deltaTime).negate();B(w.lessThan(e.barLength),()=>{r.assign(ve(r,C)),o.element(y).assign(ve(h,C))}).Else(()=>{r.assign(oe(r,e.rotationSpeed,e.deltaTime)),o.element(y).assign(oe(h,e.rotationSpeed,e.deltaTime))})}).Else(()=>{r.assign(oe(r,e.rotationSpeed,e.deltaTime)),o.element(y).assign(oe(h,e.rotationSpeed,e.deltaTime))}),n.element(y).assign(r)})().compute(a),this.material=new Ve,this.material.transparent=!0,this.material.depthWrite=!1,this.material.blending=Xe;const u=n.toAttribute(),k=p.toAttribute(),L=f.toAttribute();this.material.positionNode=u;const d=_(()=>{const y=Oe().sub(.5).mul(2),r=j(y),h=Q(1,0,r).mul(Q(1,.3,r));return be(k.x,k.y,k.z,h.mul(.015))})();this.material.colorNode=d;const g=Math.sqrt(6e4/a),x=s*.006*g;this.material.scaleNode=L.mul(x),this.sprite=new Ue(this.material),this.sprite.count=a,this.sprite.frustumCulled=!1,this.sprite.renderOrder=-1}dispose(){this.material.dispose()}}class Ot{constructor(e=60){this.uTime=m(0),this.uTiltX=m(0),this.uRotY=m(0),this.uLOD=m(0),this.quadSize=e;const s=new tt(1,4,4),c=new qe({visible:!1});this.depthMesh=new Ye(s,c);const a=this.uTime,n=this.uTiltX,o=this.uRotY,p=this.uLOD,f=_(()=>{const k=Oe().sub(.5).mul(2),L=j(k);B(L.greaterThan(1),()=>{gt()});const d=A(0,-.1,0),g=t(2),x=o,y=n.add(1.2),r=A(g.mul(U(x)).mul(q(y)),g.mul(U(y)),g.mul(q(x)).mul(q(y))),h=ie(d.sub(r)),w=ie(Qe(ie(A(0,1,-.1)),h)),C=ie(Qe(h,w)),M=ie(h.mul(1.5).add(w.mul(k.x)).add(C.mul(k.y))),I=t(.13),O=t(.3),H=t(.04),V=R(t(.018),t(.012),p),D=r.toVar(),X=M.toVar();D.addAssign(X.mul(ne(M.add(a)).mul(.01)));const P=R(t(.3),t(1),p),S=R(t(.005),t(.02),p);R(t(.1),t(.5),p);const v=A(0,0,0).toVar(),T=t(0).toVar(),z=t(0).toVar(),b=A(1,.55,.12),E=A(1,.3,.03),N=A(.45,.1,.01),Y=A(.25,.15,.05),W=a.mul(S).mul(30);ft(200,()=>{const K=ie(D),xe=j(D),Le=V.mul(O).div(F(xe.mul(xe),t(.001))),Be=K.mul(Le),ye=ie(X.sub(Be)),he=X.mul(V);D.addAssign(he);const Fe=j(D);B(Fe.lessThan(I),()=>{z.assign(1),Ke()});const le=j(de(D.x,D.z)),me=D.y.div(H),pe=F(t(0),t(1).sub(me.mul(me))),ge=Q(t(1.3),t(.16),le),we=pe.mul(ge),Se=le.mul(4.27).sub(W),ze=U(Se),Te=q(Se),Ie=A(D.x.mul(ze).sub(D.z.mul(Te)),D.y.mul(8),D.x.mul(Te).add(D.z.mul(ze))).mul(14),st=He(Ie).mul(.5).add(.5),nt=He(Ie.mul(2.03)).mul(.5).add(.5),it=He(Ie.mul(4.01)).mul(.5).add(.5),We=st.mul(.25).add(nt.mul(.12)).add(it.mul(.06)).add(.55),at=et(D.x.negate(),D.z.negate()),ot=t(1).add(U(at.add(W)).mul(.7)),Ge=ce(le.add(We.sub(.5).mul(.4)),t(0),t(1)),lt=R(R(b,E,Q(t(.05),t(.425),Ge)),N,Q(t(.425),t(1),Ge)),Ze=F(We,t(.3)),rt=lt.mul(Ze).mul(ot).mul(3).add(Y.mul(we).mul(2)),je=we.mul(ce(Ze.mul(2),t(0),t(1))),ct=t(1).sub(T).mul(je);v.assign(R(v,rt,ct)),T.assign(ce(R(T,t(1),je),t(0),t(1))),D.addAssign(he),X.assign(ye),B(Ee(D,D).greaterThan(16).and(Ee(X,D).greaterThan(0)),()=>{Ke()})}),v.mulAssign(P);const G=t(1).sub(Q(t(.3),t(1),L));v.mulAssign(G);const ee=F(T.mul(G),z);return be(v,ee)}),u=new qe;u.transparent=!0,u.depthWrite=!1,u.side=vt,u.fragmentNode=f(),this.mesh=new Ye(new bt(1,1),u),this.mesh.scale.set(e,e,1),this.mesh.renderOrder=1}update(e,s,c,a,n,o){this.uTime.value=e,this.uTiltX.value=s,this.uRotY.value=c,this.mesh.quaternion.copy(a.quaternion);const p=a.position.length(),u=(a.fov??60)*Math.PI/180,k=n.y*o,L=this.quadSize/p*(k/(2*Math.tan(u/2)));this.uLOD.value=Math.min(Math.max((L-6)/220,0),1)}getLOD(){return this.uLOD.value}dispose(){this.mesh.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const Wt=`// ─── Hash functions ────────────────────────────────────────────────────────

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

fn nebulaEmissionColor(hue: f32, variation: f32) -> vec3<f32> {
  let hAlpha = vec3<f32>(0.9, 0.3, 0.35);
  let oiii   = vec3<f32>(0.2, 0.7, 0.65);
  let sii    = vec3<f32>(0.8, 0.25, 0.2);
  let hBeta  = vec3<f32>(0.3, 0.5, 0.8);

  var col: vec3<f32>;
  if (hue < 0.25) {
    col = mix(hAlpha, oiii, hue / 0.25);
  } else if (hue < 0.5) {
    col = mix(oiii, hBeta, (hue - 0.25) / 0.25);
  } else if (hue < 0.75) {
    col = mix(hBeta, sii, (hue - 0.5) / 0.25);
  } else {
    col = mix(sii, hAlpha, (hue - 0.75) / 0.25);
  }
  return col + (variation - 0.5) * 0.15;
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
    let ccol = nebulaEmissionColor(ch, seedHash(cs + 0.5));
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
  var nebulaColor = nebulaEmissionColor(hue, colorNoise);

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
  nebulaColor = nebulaColor + nebulaEmissionColor(hue + 0.1, 0.8) * brightEdge * 0.3;

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
    let kcol = nebulaEmissionColor(kh, 0.7) * 1.5;
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
`;function Gt(i,e){const s=e==="mobile",c=s?3:5,a=s?2:4,n=s?2:4,o=s?3:6,p=s?2:5,f=s?2:4;return i.replace(/\bSPIRAL_NOISE_ITER\b/g,String(c)).replace(/\bFBM_DETAIL_OCTAVES\b/g,String(a)).replace(/\bMAX_GALAXIES\b/g,String(n)).replace(/\bMAX_CLOUDS\b/g,String(o)).replace(/\bMAX_KNOTS\b/g,String(p)).replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g,(u,k)=>f>parseInt(k,10)?"true":"false")}function Zt(i){const e=[],s=/\bfn\s+[a-z_0-9]+\s*\(/gi;let c;const a=[];for(;(c=s.exec(i))!==null;)a.push(c.index);for(let n=0;n<a.length;n++){const o=a[n],p=i.indexOf("{",o);if(p===-1)continue;let f=0,u=p;for(;u<i.length&&(i[u]==="{"&&f++,!(i[u]==="}"&&(f--,f===0)));u++);e.push(i.substring(o,u+1))}return e}class jt{constructor(e,s,c){this.uTime=m(0),this.uSeed=m(0),this.uNebulaIntensity=m(2.4),this.uSeed.value=s;const a=e*12,n=new tt(a,192,128),o=Gt(Wt,c),p=Zt(o),f=[];for(const x of p)f.push(xt(x,[...f]));const u=f[f.length-1],k=this.uTime,L=this.uSeed,d=this.uNebulaIntensity,g=_(()=>{const x=ie(yt);return u(x,k,L,d)});this.material=new qe,this.material.side=wt,this.material.depthWrite=!1,this.material.depthTest=!1,this.material.fragmentNode=g(),this.mesh=new Ye(n,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(e,s){this.uTime.value=e,this.mesh.position.copy(s.position)}dispose(){this.material.dispose(),this.mesh.geometry.dispose()}}const $e=new ae(0,1,0),Ce=new ke,Je=new Tt;function Qt(i){return i==="mobile"?15e4:5e5}class ts{constructor(e,s){this.initialized=!1,this._bhScreenVec=new ae,this.animationId=0,this.lastFrameTime=0,this.galaxyRotation=0,this.orbitQuat=new ke,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.mouse3D=new ae(0,0,0),this.raycaster=new St,this.intersectionPlane=new zt(new ae(0,1,0),0),this.mousePressed=!1,this.rendererSize=new Me,this.dpr=1,this.animate=()=>{this.animationId=requestAnimationFrame(this.animate);const d=performance.now(),g=Math.min((d-this.lastFrameTime)/1e3,.033);this.lastFrameTime=d,this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const x=this.baseDistance/this.zoom,y=new ae(0,0,x).applyQuaternion(this.orbitQuat);this.camera.position.copy(y),this.camera.lookAt(0,0,0),this.camera.updateMatrixWorld(!0);const r=Math.min(this.zoom/20,1),h=this.params.morphology,w=h.ellipticity>0||h.clumpCount>0?0:.02+.18*r*r;this.galaxyRotation+=g*w;const C=this.uniforms.time.value+g;if(this.uniforms.time.value=C,this.uniforms.deltaTime.value=g,this.uniforms.rotationSpeed.value=w,this.uniforms.mouse.value.copy(this.mouse3D),this.uniforms.mouseActive.value=this.mousePressed?1:0,this.initialized){this.renderer.compute(this.computeUpdate),this.renderer.compute(this.clouds.computeUpdate);const X=this.camera.matrixWorldInverse.elements;Je.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);const P=Je.elements;this.fgUniforms.mvpRow0.value.set(P[0],P[4],P[8],P[12]),this.fgUniforms.mvpRow1.value.set(P[1],P[5],P[9],P[13]),this.fgUniforms.mvpRow3.value.set(P[3],P[7],P[11],P[15]),this.fgUniforms.viewZRow.value.set(X[2],X[6],X[10],X[14]),this.fgUniforms.bhViewZ.value=X[14];const S=this._bhScreenVec.set(0,0,0).project(this.camera);this.fgUniforms.bhNdcX.value=S.x,this.fgUniforms.bhNdcY.value=S.y;const v=this.camera.position,T=v.length(),z=1-Math.abs(v.y)/Math.max(T,1e-4),b=Re.smoothstep(z,.55,.95);this.fgUniforms.depthThreshold.value=Re.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),b),this.fgUniforms.depthSoftness.value=Re.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),b);const E=this.params.galaxyRadius*.08,N=this.camera.fov*Math.PI/180,Y=this.rendererSize.y*this.dpr,W=E/T*(Y/(2*Math.tan(N/2))),G=Re.lerp(.75,1.2,b),ee=this.canvas.clientWidth,K=this.canvas.clientHeight;this.fgUniforms.ndcRadiusX.value=Math.max(W*G/Math.max(ee*.5,1),.04),this.fgUniforms.ndcRadiusY.value=Math.max(W*G/Math.max(K*.5,1),.04),this.renderer.compute(this.computeForeground)}this.backdrop.update(C,this.camera);const M=this.camera.position,I=Math.sqrt(M.x*M.x+M.z*M.z),O=Math.atan2(M.y,I),H=Math.atan2(M.x,M.z);this.blackHole.update(C,O,H,this.camera,this.rendererSize,this.dpr),this._bhScreenVec.set(0,0,0).project(this.camera);const V=this.blackHole.getLOD(),D=V*V*.03;this.postProcessing.updateLensing(new Me(this._bhScreenVec.x*.5+.5,this._bhScreenVec.y*.5+.5),D,this.camera.aspect),this.postProcessing.render()},this.canvas=e,this.quality=Ct();const c=Qt(this.quality);this.scene=new _e,this.bhScene=new _e,this.fgScene=new _e,this.params=Dt(s);const a=this.params.galaxyRadius;this.baseDistance=a*1.7;const n=e.clientWidth/e.clientHeight;this.camera=new At(60,n,.1,this.baseDistance*20),this.buffers=Lt(c),this.uniforms=Bt(this.params),this.computeInit=Ft(c,this.buffers,this.uniforms),this.computeUpdate=It(c,this.buffers,this.uniforms),this.fgUniforms=Nt(),this.computeForeground=_t(c,this.buffers,this.fgUniforms),this.backdrop=new jt(this.baseDistance,s.pgc,this.quality),this.scene.add(this.backdrop.mesh),this.particles=new Ht(c,this.buffers,this.baseDistance),this.scene.add(this.particles.sprite),this.clouds=new Yt(this.uniforms,this.baseDistance,this.quality),this.scene.add(this.clouds.sprite),this.blackHole=new Ot(a*.08),this.bhScene.add(this.blackHole.depthMesh),this.bhScene.add(this.blackHole.mesh),this.fgScene.add(this.particles.foregroundSprite);const p=typeof window<"u"&&window.innerWidth<768?2:4;this.zoom=p,this.targetZoom=p;const{initRotY:f,initTiltX:u}=Mt(s.pgc),k=new ke().setFromAxisAngle(new ae(1,0,0),u),L=new ke().setFromAxisAngle($e,f);this.orbitQuat.multiplyQuaternions(L,k),this.onPointerDown=d=>{this.isPinching||(this.isDragging=!0,this.lastX=d.clientX,this.lastY=d.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=d=>{if(this.isPinching||!this.isDragging)return;const g=d.clientX-this.lastX,x=d.clientY-this.lastY;this.velocityX=g*.005,this.velocityY=x*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=d.clientX,this.lastY=d.clientY},this.onPointerUp=()=>{this.isDragging=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1},this.onWheel=d=>{d.preventDefault();const g=this.targetZoom*.12;this.targetZoom+=d.deltaY>0?-g:g,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=d=>{if(d.touches.length===2){d.preventDefault(),this.isPinching=!0,this.isDragging=!1;const g=d.touches[0].clientX-d.touches[1].clientX,x=d.touches[0].clientY-d.touches[1].clientY;this.lastPinchDist=Math.sqrt(g*g+x*x)}},this.onTouchMove=d=>{if(d.touches.length===2){d.preventDefault();const g=d.touches[0].clientX-d.touches[1].clientX,x=d.touches[0].clientY-d.touches[1].clientY,y=Math.sqrt(g*g+x*x),r=(y-this.lastPinchDist)*.01;this.lastPinchDist=y,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+r))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onMouseDown=()=>{this.mousePressed=!0},this.onMouseUp=()=>{this.mousePressed=!1},this.onMouseMove=d=>{const g=new Me(d.clientX/e.clientWidth*2-1,-(d.clientY/e.clientHeight)*2+1);this.raycaster.setFromCamera(g,this.camera),this.raycaster.ray.intersectPlane(this.intersectionPlane,this.mouse3D)},e.addEventListener("pointerdown",this.onPointerDown),e.addEventListener("pointermove",this.onPointerMove),e.addEventListener("pointerup",this.onPointerUp),e.addEventListener("pointercancel",this.onPointerCancel),e.addEventListener("pointerleave",this.onPointerUp),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("touchstart",this.onTouchStart,{passive:!1}),e.addEventListener("touchmove",this.onTouchMove,{passive:!1}),e.addEventListener("touchend",this.onTouchEnd),e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("mouseup",this.onMouseUp),e.addEventListener("mousemove",this.onMouseMove),this.resizeObserver=new ResizeObserver(()=>{const d=e.clientWidth,g=e.clientHeight;d===0||g===0||(this.renderer.setSize(d,g,!1),this.camera.aspect=d/g,this.camera.updateProjectionMatrix())}),this.resizeObserver.observe(e)}applyOrbitDelta(e,s){Ce.setFromAxisAngle($e,-e),this.orbitQuat.premultiply(Ce);const c=new ae(1,0,0).applyQuaternion(this.orbitQuat);Ce.setFromAxisAngle(c,-s),this.orbitQuat.premultiply(Ce),this.orbitQuat.normalize()}async start(){this.renderer=new Rt({canvas:this.canvas,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,kt(this.quality))),this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight,!1),this.dpr=this.renderer.getPixelRatio(),this.renderer.getSize(this.rendererSize),await this.renderer.init(),this.postProcessing=new Xt(this.renderer,this.scene,this.bhScene,this.fgScene,this.camera),await this.renderer.computeAsync(this.computeInit),await this.renderer.computeAsync(this.clouds.computeInit),this.initialized=!0,this.lastFrameTime=performance.now(),this.animate()}dispose(){cancelAnimationFrame(this.animationId);const e=this.canvas;e.removeEventListener("pointerdown",this.onPointerDown),e.removeEventListener("pointermove",this.onPointerMove),e.removeEventListener("pointerup",this.onPointerUp),e.removeEventListener("pointercancel",this.onPointerCancel),e.removeEventListener("pointerleave",this.onPointerUp),e.removeEventListener("wheel",this.onWheel),e.removeEventListener("touchstart",this.onTouchStart),e.removeEventListener("touchmove",this.onTouchMove),e.removeEventListener("touchend",this.onTouchEnd),e.removeEventListener("mousedown",this.onMouseDown),e.removeEventListener("mouseup",this.onMouseUp),e.removeEventListener("mousemove",this.onMouseMove),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.clouds.dispose(),this.blackHole.dispose(),this.postProcessing.dispose(),this.renderer.dispose()}}export{ts as GalaxySceneWebGPU};
