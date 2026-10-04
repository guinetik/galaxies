var mn=Object.defineProperty;var pn=(a,t,e)=>t in a?mn(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var R=(a,t,e)=>pn(a,typeof t!="symbol"?t+"":t,e);import{K as G,d as gn,u as yn,G as zt,A as _n,L as xn,c as D,a as d,k as Bt,t as B,e as F,l as ft,M as pe,N as bn,n as Ot,f as rt,v as wn,m as ge,b as At,w as kt,T as Ut,F as It,r as Nt,h as bt,g as S,O as kn,P as ye,C as Cn,Q as Tt,E as Qt,H as Mn,I as Rn,J as Sn,j as Bn,o as T}from"./vue-vendor-BVmPiw82.js";import{u as An}from"./useGalaxyData-DncCPX_X.js";import{u as Un}from"./useSimbadLookup-CCRbtexY.js";import{B as re,c as J,C as Tn,V as Dn,W as Pn,O as En,P as Fn,S as zn,D as On,g as In,h as Nn,L as Vn,i as Gn,j as _e,k as xe,l as Ln,M as Hn,a as Xt,A as qt,b as jt,m as Wn,n as Kt}from"./three-y20Z06rJ.js";import{G as Ct,_ as Yn}from"./index-BNbXyf8z.js";import{f as $n,a as Qn}from"./coordinates-DJOk_Dvx.js";import"./sqljs-M9QnmiAb.js";import"./GalaxyTextures-DwjMeFeX.js";function be(a,t){const e=t>>>1;let n=0;for(let i=0;i<256;i++)if(n+=a[i],n>e)return i/255;return 1}function De(a,t){return a<=0?0:a>=1?1:a===t?.5:(t-1)*a/((2*t-1)*a-t)}function Xn(a,t){const i=be(a,t),s=new Uint32Array(256);for(let l=0;l<256;l++){if(a[l]===0)continue;const r=Math.round(Math.abs(l/255-i)*255);s[Math.min(r,255)]+=a[l]}const h=be(s,t),c=Math.max(0,Math.min(1,i+-2.8*1.4826*h)),f=i-c,v=f>0?De(f,.1):.5;return{c0:c,m:v}}function qn(a){const{data:t,width:e,height:n}=a,i=e*n;for(let s=0;s<3;s++){const h=new Uint32Array(256);for(let l=0;l<i;l++)h[t[l*4+s]]++;const{c0:c,m:f}=Xn(h,i),v=new Uint8Array(256);for(let l=0;l<256;l++){let r=l/255;r=Math.max(0,(r-c)/(1-c)),r=De(r,f),v[l]=Math.round(r*255)}for(let l=0;l<i;l++){const r=l*4+s;t[r]=v[t[r]]}}}var W=Uint8Array,Mt=Uint16Array,jn=Int32Array,Pe=new W([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Ee=new W([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Kn=new W([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Fe=function(a,t){for(var e=new Mt(31),n=0;n<31;++n)e[n]=t+=1<<a[n-1];for(var i=new jn(e[30]),n=1;n<30;++n)for(var s=e[n];s<e[n+1];++s)i[s]=s-e[n]<<5|n;return{b:e,r:i}},ze=Fe(Pe,2),Oe=ze.b,Zn=ze.r;Oe[28]=258,Zn[258]=28;var Jn=Fe(Ee,0),ta=Jn.b,oe=new Mt(32768);for(var P=0;P<32768;++P){var vt=(P&43690)>>1|(P&21845)<<1;vt=(vt&52428)>>2|(vt&13107)<<2,vt=(vt&61680)>>4|(vt&3855)<<4,oe[P]=((vt&65280)>>8|(vt&255)<<8)>>1}var Pt=(function(a,t,e){for(var n=a.length,i=0,s=new Mt(t);i<n;++i)a[i]&&++s[a[i]-1];var h=new Mt(t);for(i=1;i<t;++i)h[i]=h[i-1]+s[i-1]<<1;var c;if(e){c=new Mt(1<<t);var f=15-t;for(i=0;i<n;++i)if(a[i])for(var v=i<<4|a[i],l=t-a[i],r=h[a[i]-1]++<<l,u=r|(1<<l)-1;r<=u;++r)c[oe[r]>>f]=v}else for(c=new Mt(n),i=0;i<n;++i)a[i]&&(c[i]=oe[h[a[i]-1]++]>>15-a[i]);return c}),Et=new W(288);for(var P=0;P<144;++P)Et[P]=8;for(var P=144;P<256;++P)Et[P]=9;for(var P=256;P<280;++P)Et[P]=7;for(var P=280;P<288;++P)Et[P]=8;var Ie=new W(32);for(var P=0;P<32;++P)Ie[P]=5;var ea=Pt(Et,9,1),na=Pt(Ie,5,1),Zt=function(a){for(var t=a[0],e=1;e<a.length;++e)a[e]>t&&(t=a[e]);return t},nt=function(a,t,e){var n=t/8|0;return(a[n]|a[n+1]<<8)>>(t&7)&e},Jt=function(a,t){var e=t/8|0;return(a[e]|a[e+1]<<8|a[e+2]<<16)>>(t&7)},aa=function(a){return(a+7)/8|0},Gt=function(a,t,e){return(t==null||t<0)&&(t=0),(e==null||e>a.length)&&(e=a.length),new W(a.subarray(t,e))},ia=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],$=function(a,t,e){var n=new Error(t||ia[a]);if(n.code=a,Error.captureStackTrace&&Error.captureStackTrace(n,$),!e)throw n;return n},Ne=function(a,t,e,n){var i=a.length,s=0;if(!i||t.f&&!t.l)return e||new W(0);var h=!e,c=h||t.i!=2,f=t.i;h&&(e=new W(i*3));var v=function(gt){var yt=e.length;if(gt>yt){var dt=new W(Math.max(yt*2,gt));dt.set(e),e=dt}},l=t.f||0,r=t.p||0,u=t.b||0,p=t.l,b=t.d,x=t.m,k=t.n,A=i*8;do{if(!p){l=nt(a,r,1);var y=nt(a,r+1,3);if(r+=3,y)if(y==1)p=ea,b=na,x=9,k=5;else if(y==2){var U=nt(a,r,31)+257,I=nt(a,r+10,15)+4,Q=U+nt(a,r+5,31)+1;r+=14;for(var V=new W(Q),z=new W(19),O=0;O<I;++O)z[Kn[O]]=nt(a,r+O*3,7);r+=I*3;for(var H=Zt(z),tt=(1<<H)-1,it=Pt(z,H,1),O=0;O<Q;){var X=it[nt(a,r,tt)];r+=X&15;var w=X>>4;if(w<16)V[O++]=w;else{var E=0,q=0;for(w==16?(q=3+nt(a,r,3),r+=2,E=V[O-1]):w==17?(q=3+nt(a,r,7),r+=3):w==18&&(q=11+nt(a,r,127),r+=7);q--;)V[O++]=E}}var lt=V.subarray(0,U),j=V.subarray(U);x=Zt(lt),k=Zt(j),p=Pt(lt,x,1),b=Pt(j,k,1)}else $(1);else{var w=aa(r)+4,C=a[w-4]|a[w-3]<<8,M=w+C;if(M>i){f&&$(0);break}c&&v(u+C),e.set(a.subarray(w,M),u),t.b=u+=C,t.p=r=M*8,t.f=l;continue}if(r>A){f&&$(0);break}}c&&v(u+131072);for(var L=(1<<x)-1,mt=(1<<k)-1,Y=r;;Y=r){var E=p[Jt(a,r)&L],K=E>>4;if(r+=E&15,r>A){f&&$(0);break}if(E||$(2),K<256)e[u++]=K;else if(K==256){Y=r,p=null;break}else{var ht=K-254;if(K>264){var O=K-257,et=Pe[O];ht=nt(a,r,(1<<et)-1)+Oe[O],r+=et}var ct=b[Jt(a,r)&mt],ut=ct>>4;ct||$(3),r+=ct&15;var j=ta[ut];if(ut>3){var et=Ee[ut];j+=Jt(a,r)&(1<<et)-1,r+=et}if(r>A){f&&$(0);break}c&&v(u+131072);var pt=u+ht;if(u<j){var wt=s-j,Rt=Math.min(j,pt);for(wt+u<0&&$(3);u<Rt;++u)e[u]=n[wt+u]}for(;u<pt;++u)e[u]=e[u-j]}}t.l=p,t.p=Y,t.b=u,t.f=l,p&&(l=1,t.m=x,t.d=b,t.n=k)}while(!l);return u!=e.length&&h?Gt(e,0,u):e.subarray(0,u)},sa=new W(0),Ve=function(a,t){return((a[0]&15)!=8||a[0]>>4>7||(a[0]<<8|a[1])%31)&&$(6,"invalid zlib data"),(a[1]>>5&1)==+!t&&$(6,"invalid zlib data: "+(a[1]&32?"need":"unexpected")+" dictionary"),(a[1]>>3&4)+2},te=(function(){function a(t,e){typeof t=="function"&&(e=t,t={}),this.ondata=e;var n=t&&t.dictionary&&t.dictionary.subarray(-32768);this.s={i:0,b:n?n.length:0},this.o=new W(32768),this.p=new W(0),n&&this.o.set(n)}return a.prototype.e=function(t){if(this.ondata||$(5),this.d&&$(4),!this.p.length)this.p=t;else if(t.length){var e=new W(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length),this.p=e}},a.prototype.c=function(t){this.s.i=+(this.d=t||!1);var e=this.s.b,n=Ne(this.p,this.s,this.o);this.ondata(Gt(n,e,this.s.b),this.d),this.o=Gt(n,this.s.b-32768),this.s.b=this.o.length,this.p=Gt(this.p,this.s.p/8|0),this.s.p&=7},a.prototype.push=function(t,e){this.e(t),this.c(e)},a})(),we=(function(){function a(t,e){te.call(this,t,e),this.v=t&&t.dictionary?2:1}return a.prototype.push=function(t,e){if(te.prototype.e.call(this,t),this.v){if(this.p.length<6&&!e)return;this.p=this.p.subarray(Ve(this.p,this.v-1)),this.v=0}e&&(this.p.length<4&&$(6,"invalid zlib data"),this.p=this.p.subarray(0,-4)),te.prototype.c.call(this,e)},a})();function ra(a,t){return Ne(a.subarray(Ve(a,t),-4),{i:2},t,t)}var oa=typeof TextDecoder<"u"&&new TextDecoder,la=0;try{oa.decode(sa,{stream:!0}),la=1}catch{}function ke(a,t="utf8"){return new TextDecoder(t).decode(a)}const ha=new TextEncoder;function ca(a){return ha.encode(a)}const ua=1024*8,da=(()=>{const a=new Uint8Array(4),t=new Uint32Array(a.buffer);return!((t[0]=1)&a[0])})(),ee={int8:globalThis.Int8Array,uint8:globalThis.Uint8Array,int16:globalThis.Int16Array,uint16:globalThis.Uint16Array,int32:globalThis.Int32Array,uint32:globalThis.Uint32Array,uint64:globalThis.BigUint64Array,int64:globalThis.BigInt64Array,float32:globalThis.Float32Array,float64:globalThis.Float64Array};class le{constructor(t=ua,e={}){R(this,"buffer");R(this,"byteLength");R(this,"byteOffset");R(this,"length");R(this,"offset");R(this,"lastWrittenByte");R(this,"littleEndian");R(this,"_data");R(this,"_mark");R(this,"_marks");let n=!1;typeof t=="number"?t=new ArrayBuffer(t):(n=!0,this.lastWrittenByte=t.byteLength);const i=e.offset?e.offset>>>0:0,s=t.byteLength-i;let h=i;(ArrayBuffer.isView(t)||t instanceof le)&&(t.byteLength!==t.buffer.byteLength&&(h=t.byteOffset+i),t=t.buffer),n?this.lastWrittenByte=s:this.lastWrittenByte=0,this.buffer=t,this.length=s,this.byteLength=s,this.byteOffset=h,this.offset=0,this.littleEndian=!0,this._data=new DataView(this.buffer,h,s),this._mark=0,this._marks=[]}available(t=1){return this.offset+t<=this.length}isLittleEndian(){return this.littleEndian}setLittleEndian(){return this.littleEndian=!0,this}isBigEndian(){return!this.littleEndian}setBigEndian(){return this.littleEndian=!1,this}skip(t=1){return this.offset+=t,this}back(t=1){return this.offset-=t,this}seek(t){return this.offset=t,this}mark(){return this._mark=this.offset,this}reset(){return this.offset=this._mark,this}pushMark(){return this._marks.push(this.offset),this}popMark(){const t=this._marks.pop();if(t===void 0)throw new Error("Mark stack empty");return this.seek(t),this}rewind(){return this.offset=0,this}ensureAvailable(t=1){if(!this.available(t)){const n=(this.offset+t)*2,i=new Uint8Array(n);i.set(new Uint8Array(this.buffer)),this.buffer=i.buffer,this.length=n,this.byteLength=n,this._data=new DataView(this.buffer)}return this}readBoolean(){return this.readUint8()!==0}readInt8(){return this._data.getInt8(this.offset++)}readUint8(){return this._data.getUint8(this.offset++)}readByte(){return this.readUint8()}readBytes(t=1){return this.readArray(t,"uint8")}readArray(t,e){const n=ee[e].BYTES_PER_ELEMENT*t,i=this.byteOffset+this.offset,s=this.buffer.slice(i,i+n);if(this.littleEndian===da&&e!=="uint8"&&e!=="int8"){const c=new Uint8Array(this.buffer.slice(i,i+n));c.reverse();const f=new ee[e](c.buffer);return this.offset+=n,f.reverse(),f}const h=new ee[e](s);return this.offset+=n,h}readInt16(){const t=this._data.getInt16(this.offset,this.littleEndian);return this.offset+=2,t}readUint16(){const t=this._data.getUint16(this.offset,this.littleEndian);return this.offset+=2,t}readInt32(){const t=this._data.getInt32(this.offset,this.littleEndian);return this.offset+=4,t}readUint32(){const t=this._data.getUint32(this.offset,this.littleEndian);return this.offset+=4,t}readFloat32(){const t=this._data.getFloat32(this.offset,this.littleEndian);return this.offset+=4,t}readFloat64(){const t=this._data.getFloat64(this.offset,this.littleEndian);return this.offset+=8,t}readBigInt64(){const t=this._data.getBigInt64(this.offset,this.littleEndian);return this.offset+=8,t}readBigUint64(){const t=this._data.getBigUint64(this.offset,this.littleEndian);return this.offset+=8,t}readChar(){return String.fromCharCode(this.readInt8())}readChars(t=1){let e="";for(let n=0;n<t;n++)e+=this.readChar();return e}readUtf8(t=1){return ke(this.readBytes(t))}decodeText(t=1,e="utf8"){return ke(this.readBytes(t),e)}writeBoolean(t){return this.writeUint8(t?255:0),this}writeInt8(t){return this.ensureAvailable(1),this._data.setInt8(this.offset++,t),this._updateLastWrittenByte(),this}writeUint8(t){return this.ensureAvailable(1),this._data.setUint8(this.offset++,t),this._updateLastWrittenByte(),this}writeByte(t){return this.writeUint8(t)}writeBytes(t){this.ensureAvailable(t.length);for(let e=0;e<t.length;e++)this._data.setUint8(this.offset++,t[e]);return this._updateLastWrittenByte(),this}writeInt16(t){return this.ensureAvailable(2),this._data.setInt16(this.offset,t,this.littleEndian),this.offset+=2,this._updateLastWrittenByte(),this}writeUint16(t){return this.ensureAvailable(2),this._data.setUint16(this.offset,t,this.littleEndian),this.offset+=2,this._updateLastWrittenByte(),this}writeInt32(t){return this.ensureAvailable(4),this._data.setInt32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeUint32(t){return this.ensureAvailable(4),this._data.setUint32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeFloat32(t){return this.ensureAvailable(4),this._data.setFloat32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeFloat64(t){return this.ensureAvailable(8),this._data.setFloat64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeBigInt64(t){return this.ensureAvailable(8),this._data.setBigInt64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeBigUint64(t){return this.ensureAvailable(8),this._data.setBigUint64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeChar(t){return this.writeUint8(t.charCodeAt(0))}writeChars(t){for(let e=0;e<t.length;e++)this.writeUint8(t.charCodeAt(e));return this}writeUtf8(t){return this.writeBytes(ca(t))}toArray(){return new Uint8Array(this.buffer,this.byteOffset,this.lastWrittenByte)}getWrittenByteLength(){return this.lastWrittenByte-this.byteOffset}_updateLastWrittenByte(){this.offset>this.lastWrittenByte&&(this.lastWrittenByte=this.offset)}}const Ge=[];for(let a=0;a<256;a++){let t=a;for(let e=0;e<8;e++)t&1?t=3988292384^t>>>1:t=t>>>1;Ge[a]=t}const Ce=4294967295;function fa(a,t,e){let n=a;for(let i=0;i<e;i++)n=Ge[(n^t[i])&255]^n>>>8;return n}function va(a,t){return(fa(Ce,a,t)^Ce)>>>0}function Me(a,t,e){const n=a.readUint32(),i=va(new Uint8Array(a.buffer,a.byteOffset+a.offset-t-4,t),t);if(i!==n)throw new Error(`CRC mismatch for chunk ${e}. Expected ${n}, found ${i}`)}function Le(a,t,e){for(let n=0;n<e;n++)t[n]=a[n]}function He(a,t,e,n){let i=0;for(;i<n;i++)t[i]=a[i];for(;i<e;i++)t[i]=a[i]+t[i-n]&255}function We(a,t,e,n){let i=0;if(e.length===0)for(;i<n;i++)t[i]=a[i];else for(;i<n;i++)t[i]=a[i]+e[i]&255}function Ye(a,t,e,n,i){let s=0;if(e.length===0){for(;s<i;s++)t[s]=a[s];for(;s<n;s++)t[s]=a[s]+(t[s-i]>>1)&255}else{for(;s<i;s++)t[s]=a[s]+(e[s]>>1)&255;for(;s<n;s++)t[s]=a[s]+(t[s-i]+e[s]>>1)&255}}function $e(a,t,e,n,i){let s=0;if(e.length===0){for(;s<i;s++)t[s]=a[s];for(;s<n;s++)t[s]=a[s]+t[s-i]&255}else{for(;s<i;s++)t[s]=a[s]+e[s]&255;for(;s<n;s++)t[s]=a[s]+ma(t[s-i],e[s],e[s-i])&255}}function ma(a,t,e){const n=a+t-e,i=Math.abs(n-a),s=Math.abs(n-t),h=Math.abs(n-e);return i<=s&&i<=h?a:s<=h?t:e}function pa(a,t,e,n,i,s){switch(a){case 0:Le(t,e,i);break;case 1:He(t,e,i,s);break;case 2:We(t,e,n,i);break;case 3:Ye(t,e,n,i,s);break;case 4:$e(t,e,n,i,s);break;default:throw new Error(`Unsupported filter: ${a}`)}}const ga=new Uint16Array([255]),ya=new Uint8Array(ga.buffer),_a=ya[0]===255;function xa(a){const{data:t,width:e,height:n,channels:i,depth:s}=a,h=[{x:0,y:0,xStep:8,yStep:8},{x:4,y:0,xStep:8,yStep:8},{x:0,y:4,xStep:4,yStep:8},{x:2,y:0,xStep:4,yStep:4},{x:0,y:2,xStep:2,yStep:4},{x:1,y:0,xStep:2,yStep:2},{x:0,y:1,xStep:1,yStep:2}],c=Math.ceil(s/8)*i,f=new Uint8Array(n*e*c);let v=0;for(let l=0;l<7;l++){const r=h[l],u=Math.ceil((e-r.x)/r.xStep),p=Math.ceil((n-r.y)/r.yStep);if(u<=0||p<=0)continue;const b=u*c,x=new Uint8Array(b);for(let k=0;k<p;k++){const A=t[v++],y=t.subarray(v,v+b);v+=b;const w=new Uint8Array(b);pa(A,y,w,x,b,c),x.set(w);for(let C=0;C<u;C++){const M=r.x+C*r.xStep,U=r.y+k*r.yStep;if(!(M>=e||U>=n))for(let I=0;I<c;I++)f[(U*e+M)*c+I]=w[C*c+I]}}}if(s===16){const l=new Uint16Array(f.buffer);if(_a)for(let r=0;r<l.length;r++)l[r]=ba(l[r]);return l}else return f}function ba(a){return(a&255)<<8|a>>8&255}const wa=new Uint16Array([255]),ka=new Uint8Array(wa.buffer),Ca=ka[0]===255,Ma=new Uint8Array(0);function Re(a){const{data:t,width:e,height:n,channels:i,depth:s}=a,h=Math.ceil(s/8)*i,c=Math.ceil(s/8*i*e),f=new Uint8Array(n*c);let v=Ma,l=0,r,u;for(let p=0;p<n;p++){switch(r=t.subarray(l+1,l+1+c),u=f.subarray(p*c,(p+1)*c),t[l]){case 0:Le(r,u,c);break;case 1:He(r,u,c,h);break;case 2:We(r,u,v,c);break;case 3:Ye(r,u,v,c,h);break;case 4:$e(r,u,v,c,h);break;default:throw new Error(`Unsupported filter: ${t[l]}`)}v=u,l+=c+1}if(s===16){const p=new Uint16Array(f.buffer);if(Ca)for(let b=0;b<p.length;b++)p[b]=Ra(p[b]);return p}else return f}function Ra(a){return(a&255)<<8|a>>8&255}const Lt=Uint8Array.of(137,80,78,71,13,10,26,10);function Se(a){if(!Sa(a.readBytes(Lt.length)))throw new Error("wrong PNG signature")}function Sa(a){if(a.length<Lt.length)return!1;for(let t=0;t<Lt.length;t++)if(a[t]!==Lt[t])return!1;return!0}const Ba="tEXt",Aa=0,Qe=new TextDecoder("latin1");function Ua(a){if(Da(a),a.length===0||a.length>79)throw new Error("keyword length must be between 1 and 79")}const Ta=/^[\u0000-\u00FF]*$/;function Da(a){if(!Ta.test(a))throw new Error("invalid latin1 text")}function Pa(a,t,e){const n=Xe(t);a[n]=Ea(t,e-n.length-1)}function Xe(a){for(a.mark();a.readByte()!==Aa;);const t=a.offset;a.reset();const e=Qe.decode(a.readBytes(t-a.offset-1));return a.skip(1),Ua(e),e}function Ea(a,t){return Qe.decode(a.readBytes(t))}const Z={UNKNOWN:-1,GREYSCALE:0,TRUECOLOUR:2,INDEXED_COLOUR:3,GREYSCALE_ALPHA:4,TRUECOLOUR_ALPHA:6},ne={UNKNOWN:-1,DEFLATE:0},Be={UNKNOWN:-1,ADAPTIVE:0},ae={UNKNOWN:-1,NO_INTERLACE:0,ADAM7:1},Vt={NONE:0,BACKGROUND:1,PREVIOUS:2},ie={SOURCE:0,OVER:1};class Fa extends le{constructor(e,n={}){super(e);R(this,"_checkCrc");R(this,"_inflator");R(this,"_png");R(this,"_apng");R(this,"_end");R(this,"_hasPalette");R(this,"_palette");R(this,"_hasTransparency");R(this,"_transparency");R(this,"_compressionMethod");R(this,"_filterMethod");R(this,"_interlaceMethod");R(this,"_colorType");R(this,"_isAnimated");R(this,"_numberOfFrames");R(this,"_numberOfPlays");R(this,"_frames");R(this,"_writingDataChunks");R(this,"_chunks");R(this,"_inflatorResult");const{checkCrc:i=!1}=n;this._checkCrc=i,this._inflator=new we((s,h)=>{if(this._chunks.push(s),h){const c=this._chunks.reduce((v,l)=>v+l.length,0);this._inflatorResult=new Uint8Array(c);let f=0;for(const v of this._chunks)this._inflatorResult.set(v,f),f+=v.length;this._chunks=[]}}),this._chunks=[],this._png={width:-1,height:-1,channels:-1,data:new Uint8Array(0),depth:1,text:{}},this._apng={width:-1,height:-1,channels:-1,depth:1,numberOfFrames:1,numberOfPlays:0,text:{},frames:[]},this._end=!1,this._hasPalette=!1,this._palette=[],this._hasTransparency=!1,this._transparency=new Uint16Array(0),this._compressionMethod=ne.UNKNOWN,this._filterMethod=Be.UNKNOWN,this._interlaceMethod=ae.UNKNOWN,this._colorType=Z.UNKNOWN,this._isAnimated=!1,this._numberOfFrames=1,this._numberOfPlays=0,this._frames=[],this._writingDataChunks=!1,this._inflatorResult=new Uint8Array(0),this.setBigEndian()}decode(){for(Se(this);!this._end;){const e=this.readUint32(),n=this.readChars(4);this.decodeChunk(e,n)}return this._inflator.push(new Uint8Array(0),!0),this.decodeImage(),this._png}decodeApng(){for(Se(this);!this._end;){const e=this.readUint32(),n=this.readChars(4);this.decodeApngChunk(e,n)}return this.decodeApngImage(),this._apng}decodeChunk(e,n){const i=this.offset;switch(n){case"IHDR":this.decodeIHDR();break;case"PLTE":this.decodePLTE(e);break;case"IDAT":this.decodeIDAT(e);break;case"IEND":this._end=!0;break;case"tRNS":this.decodetRNS(e);break;case"iCCP":this.decodeiCCP(e);break;case Ba:Pa(this._png.text,this,e);break;case"pHYs":this.decodepHYs();break;default:this.skip(e);break}if(this.offset-i!==e)throw new Error(`Length mismatch while decoding chunk ${n}`);this._checkCrc?Me(this,e+4,n):this.skip(4)}decodeApngChunk(e,n){const i=this.offset;switch(n!=="fdAT"&&n!=="IDAT"&&this._writingDataChunks&&this.pushDataToFrame(),n){case"acTL":this.decodeACTL();break;case"fcTL":this.decodeFCTL();break;case"fdAT":this.decodeFDAT(e);break;default:this.decodeChunk(e,n),this.offset=i+e;break}if(this.offset-i!==e)throw new Error(`Length mismatch while decoding chunk ${n}`);this._checkCrc?Me(this,e+4,n):this.skip(4)}decodeIHDR(){const e=this._png;e.width=this.readUint32(),e.height=this.readUint32(),e.depth=za(this.readUint8());const n=this.readUint8();this._colorType=n;let i;switch(n){case Z.GREYSCALE:i=1;break;case Z.TRUECOLOUR:i=3;break;case Z.INDEXED_COLOUR:i=1;break;case Z.GREYSCALE_ALPHA:i=2;break;case Z.TRUECOLOUR_ALPHA:i=4;break;case Z.UNKNOWN:default:throw new Error(`Unknown color type: ${n}`)}if(this._png.channels=i,this._compressionMethod=this.readUint8(),this._compressionMethod!==ne.DEFLATE)throw new Error(`Unsupported compression method: ${this._compressionMethod}`);this._filterMethod=this.readUint8(),this._interlaceMethod=this.readUint8()}decodeACTL(){this._numberOfFrames=this.readUint32(),this._numberOfPlays=this.readUint32(),this._isAnimated=!0}decodeFCTL(){const e={sequenceNumber:this.readUint32(),width:this.readUint32(),height:this.readUint32(),xOffset:this.readUint32(),yOffset:this.readUint32(),delayNumber:this.readUint16(),delayDenominator:this.readUint16(),disposeOp:this.readUint8(),blendOp:this.readUint8(),data:new Uint8Array(0)};this._frames.push(e)}decodePLTE(e){if(e%3!==0)throw new RangeError(`PLTE field length must be a multiple of 3. Got ${e}`);const n=e/3;this._hasPalette=!0;const i=[];this._palette=i;for(let s=0;s<n;s++)i.push([this.readUint8(),this.readUint8(),this.readUint8()])}decodeIDAT(e){this._writingDataChunks=!0;const n=e,i=this.offset+this.byteOffset;try{this._inflator.push(new Uint8Array(this.buffer,i,n),!1)}catch(s){throw new Error("Error while decompressing the data:",{cause:s})}this.skip(e)}decodeFDAT(e){this._writingDataChunks=!0;let n=e,i=this.offset+this.byteOffset;i+=4,n-=4;try{this._inflator.push(new Uint8Array(this.buffer,i,n),!1)}catch(s){throw new Error("Error while decompressing the data:",{cause:s})}this.skip(e)}decodetRNS(e){switch(this._colorType){case Z.GREYSCALE:case Z.TRUECOLOUR:{if(e%2!==0)throw new RangeError(`tRNS chunk length must be a multiple of 2. Got ${e}`);if(e/2>this._png.width*this._png.height)throw new Error(`tRNS chunk contains more alpha values than there are pixels (${e/2} vs ${this._png.width*this._png.height})`);this._hasTransparency=!0,this._transparency=new Uint16Array(e/2);for(let n=0;n<e/2;n++)this._transparency[n]=this.readUint16();break}case Z.INDEXED_COLOUR:{if(e>this._palette.length)throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${e} vs ${this._palette.length})`);let n=0;for(;n<e;n++){const i=this.readByte();this._palette[n].push(i)}for(;n<this._palette.length;n++)this._palette[n].push(255);break}case Z.UNKNOWN:case Z.GREYSCALE_ALPHA:case Z.TRUECOLOUR_ALPHA:default:throw new Error(`tRNS chunk is not supported for color type ${this._colorType}`)}}decodeiCCP(e){const n=Xe(this),i=this.readUint8();if(i!==ne.DEFLATE)throw new Error(`Unsupported iCCP compression method: ${i}`);const s=this.readBytes(e-n.length-2);this._png.iccEmbeddedProfile={name:n,profile:ra(s)}}decodepHYs(){const e=this.readUint32(),n=this.readUint32(),i=this.readByte();this._png.resolution={x:e,y:n,unit:i}}decodeApngImage(){this._apng.width=this._png.width,this._apng.height=this._png.height,this._apng.channels=this._png.channels,this._apng.depth=this._png.depth,this._apng.numberOfFrames=this._numberOfFrames,this._apng.numberOfPlays=this._numberOfPlays,this._apng.text=this._png.text,this._apng.resolution=this._png.resolution;for(let e=0;e<this._numberOfFrames;e++){const n={sequenceNumber:this._frames[e].sequenceNumber,delayNumber:this._frames[e].delayNumber,delayDenominator:this._frames[e].delayDenominator,data:this._apng.depth===8?new Uint8Array(this._apng.width*this._apng.height*this._apng.channels):new Uint16Array(this._apng.width*this._apng.height*this._apng.channels)},i=this._frames.at(e);if(i){if(i.data=Re({data:i.data,width:i.width,height:i.height,channels:this._apng.channels,depth:this._apng.depth}),this._hasPalette&&(this._apng.palette=this._palette),this._hasTransparency&&(this._apng.transparency=this._transparency),e===0||i.xOffset===0&&i.yOffset===0&&i.width===this._png.width&&i.height===this._png.height)n.data=i.data;else{const s=this._apng.frames.at(e-1);this.disposeFrame(i,s,n),this.addFrameDataToCanvas(n,i)}this._apng.frames.push(n)}}return this._apng}disposeFrame(e,n,i){switch(e.disposeOp){case Vt.NONE:break;case Vt.BACKGROUND:for(let s=0;s<this._png.height;s++)for(let h=0;h<this._png.width;h++){const c=(s*e.width+h)*this._png.channels;for(let f=0;f<this._png.channels;f++)i.data[c+f]=0}break;case Vt.PREVIOUS:i.data.set(n.data);break;default:throw new Error("Unknown disposeOp")}}addFrameDataToCanvas(e,n){const i=1<<this._png.depth,s=(h,c)=>{const f=((h+n.yOffset)*this._png.width+n.xOffset+c)*this._png.channels,v=(h*n.width+c)*this._png.channels;return{index:f,frameIndex:v}};switch(n.blendOp){case ie.SOURCE:for(let h=0;h<n.height;h++)for(let c=0;c<n.width;c++){const{index:f,frameIndex:v}=s(h,c);for(let l=0;l<this._png.channels;l++)e.data[f+l]=n.data[v+l]}break;case ie.OVER:for(let h=0;h<n.height;h++)for(let c=0;c<n.width;c++){const{index:f,frameIndex:v}=s(h,c);for(let l=0;l<this._png.channels;l++){const r=n.data[v+this._png.channels-1]/i,u=l%(this._png.channels-1)===0?1:n.data[v+l],p=Math.floor(r*u+(1-r)*e.data[f+l]);e.data[f+l]+=p}}break;default:throw new Error("Unknown blendOp")}}decodeImage(){const e=this._inflatorResult;if(this._filterMethod!==Be.ADAPTIVE)throw new Error(`Filter method ${this._filterMethod} not supported`);if(this._interlaceMethod===ae.NO_INTERLACE)this._png.data=Re({data:e,width:this._png.width,height:this._png.height,channels:this._png.channels,depth:this._png.depth});else if(this._interlaceMethod===ae.ADAM7)this._png.data=xa({data:e,width:this._png.width,height:this._png.height,channels:this._png.channels,depth:this._png.depth});else throw new Error(`Interlace method ${this._interlaceMethod} not supported`);this._hasPalette&&(this._png.palette=this._palette),this._hasTransparency&&(this._png.transparency=this._transparency)}pushDataToFrame(){this._inflator.push(new Uint8Array(0),!0);const e=this._inflatorResult,n=this._frames.at(-1);n?n.data=e:this._frames.push({sequenceNumber:0,width:this._png.width,height:this._png.height,xOffset:0,yOffset:0,delayNumber:0,delayDenominator:0,disposeOp:Vt.NONE,blendOp:ie.SOURCE,data:e}),this._inflator=new we((i,s)=>{if(this._chunks.push(i),s){const h=this._chunks.reduce((f,v)=>f+v.length,0);this._inflatorResult=new Uint8Array(h);let c=0;for(const f of this._chunks)this._inflatorResult.set(f,c),c+=f.length;this._chunks=[]}}),this._chunks=[],this._writingDataChunks=!1}}function za(a){if(a!==1&&a!==2&&a!==4&&a!==8&&a!==16)throw new Error(`invalid bit depth: ${a}`);return a}function Oa(a,t){return new Fa(a,t).decode()}const Ae=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ia=`precision highp float;

uniform sampler2D uBandR;
uniform sampler2D uBandG;
uniform sampler2D uBandB;
uniform float uBrightness;
uniform float uQ;
uniform float uStretch;
uniform float uSensitivity;
uniform vec2 uRangeR;
uniform vec2 uRangeG;
uniform vec2 uRangeB;
uniform float uGrayscale;
uniform float uTheme;

varying vec2 vUV;

// GLSL ES 1.00 does not provide asinh
float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float lupton_stretch(float intensity) {
  const float frac = 0.1;
  float q = max(uQ, 1e-6);
  float stretch = max(uStretch / max(uSensitivity, 1e-3), 1e-6);
  float slope = frac / safe_asinh(frac * q);
  return safe_asinh((q * max(intensity, 0.0)) / stretch) * slope;
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  // Sample each band (grayscale stored in .r channel)
  float r_raw = clamp(texture2D(uBandR, vUV).r + dither, 0.0, 1.0);
  float g_raw = clamp(texture2D(uBandG, vUV).r + dither, 0.0, 1.0);
  float b_raw = clamp(texture2D(uBandB, vUV).r + dither, 0.0, 1.0);

  // Denormalize back to physical units (nanomaggies). Data is already
  // sky-subtracted, so just clamp negative noise to zero.
  float r = max(denorm(r_raw, uRangeR), 0.0);
  float g = max(denorm(g_raw, uRangeG), 0.0);
  float b = max(denorm(b_raw, uRangeB), 0.0);

  // Mean intensity: I = (r + g + b) / 3  (Lupton et al. 2004, Eq. 2)
  float I = (r + g + b) / 3.0;

  // Lupton asinh stretch: f(I) = asinh(Q * I / stretch) * frac / asinh(frac * Q)
  float fI = lupton_stretch(I);

  // Color-preserving scaling (Eq. 2): R = r · f(I) / I
  float scale = I <= 0.0 ? 0.0 : fI / I;

  float R = r * scale;
  float G = g * scale;
  float B = b * scale;

  // Desaturate when max channel > 1 — preserves color, clips intensity
  // (Paper: "if max(R,G,B) > 1, set R/=max, G/=max, B/=max")
  float maxRGB = max(max(R, G), max(B, 1.0));
  R /= maxRGB;
  G /= maxRGB;
  B /= maxRGB;

  // Noise gate: suppress sky noise below signal threshold.
  // Threshold scales with data range so it adapts per galaxy.
  float rangeScale = (uRangeR.y - uRangeR.x + uRangeG.y - uRangeG.x + uRangeB.y - uRangeB.x) / 3.0;
  float noiseFloor = rangeScale * 0.003;
  float signal = smoothstep(0.0, noiseFloor, I);

  // Theme color shift: infrared (0) = true color, astral (1) = cool blue remap
  float lum = R * 0.2126 + G * 0.7152 + B * 0.0722;
  vec3 coolColor = vec3(
    lum * 0.25 + B * 0.15,
    lum * 0.35 + G * 0.25,
    lum * 0.7 + B * 0.5
  );
  vec3 trueColor = vec3(max(R, 0.0), max(G, 0.0), max(B, 0.0));

  // Mix color and grayscale (stretched intensity) output
  vec3 colorOut = mix(trueColor, coolColor, uTheme);
  vec3 grayOut = vec3(clamp(fI, 0.0, 1.0));
  float brightnessGain = max(uBrightness, 0.0) / 0.5;
  vec3 outColor = mix(colorOut, grayOut, uGrayscale) * brightnessGain * signal;
  gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
}
`,Na=`precision highp float;

uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

uniform float uHas_u;
uniform float uHas_g;
uniform float uHas_r;
uniform float uHas_i;
uniform float uHas_z;
uniform float uHas_nuv;

uniform float uBrightness;
uniform float uSensitivity;
uniform float uTheme;
uniform float uGrayscale;

varying vec2 vUV;

float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

float normalize_band(float raw, float enabled) {
  if (enabled < 0.5) {
    return 0.0;
  }

  // The source band textures are already exported as linear per-band 0..1 images.
  // Composite mode intentionally keeps that raw normalization instead of applying
  // a second range-derived remap like Lupton or STF would.
  float normalized = clamp(raw, 0.0, 1.0);

  // Sensitivity acts as a linear black-point gate, not a nonlinear reveal curve.
  float floorLevel = (1.0 - clamp(uSensitivity, 0.0, 1.0)) * 0.25;
  return clamp((normalized - floorLevel) / max(1.0 - floorLevel, 1e-6), 0.0, 1.0);
}

float mean2(float a, float wa, float b, float wb) {
  float weight = wa + wb;
  return weight > 0.0 ? (a * wa + b * wb) / weight : 0.0;
}

float mean6(float a, float wa, float b, float wb, float c, float wc, float d, float wd, float e, float we, float f, float wf) {
  float weight = wa + wb + wc + wd + we + wf;
  return weight > 0.0 ? (a * wa + b * wb + c * wc + d * wd + e * we + f * wf) / weight : 0.0;
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  float uNorm = normalize_band(clamp(texture2D(uBand_u, vUV).r + dither, 0.0, 1.0), uHas_u);
  float gNorm = normalize_band(clamp(texture2D(uBand_g, vUV).r + dither, 0.0, 1.0), uHas_g);
  float rNorm = normalize_band(clamp(texture2D(uBand_r, vUV).r + dither, 0.0, 1.0), uHas_r);
  float iNorm = normalize_band(clamp(texture2D(uBand_i, vUV).r + dither, 0.0, 1.0), uHas_i);
  float zNorm = normalize_band(clamp(texture2D(uBand_z, vUV).r + dither, 0.0, 1.0), uHas_z);
  float nuvNorm = normalize_band(clamp(texture2D(uBand_nuv, vUV).r + dither, 0.0, 1.0), uHas_nuv);

  float longWave = mean2(zNorm, uHas_z, iNorm, uHas_i);
  float visible = mean2(rNorm, uHas_r, gNorm, uHas_g);
  float shortWave = mean2(uNorm, uHas_u, nuvNorm, uHas_nuv);
  float luminance = mean6(
    uNorm, uHas_u,
    gNorm, uHas_g,
    rNorm, uHas_r,
    iNorm, uHas_i,
    zNorm, uHas_z,
    nuvNorm, uHas_nuv
  );

  vec3 infra = vec3(longWave, visible, shortWave);
  vec3 astral = vec3(
    luminance * 0.25 + shortWave * 0.15,
    luminance * 0.35 + visible * 0.25,
    luminance * 0.70 + shortWave * 0.50
  );

  vec3 themed = mix(infra, astral, clamp(uTheme, 0.0, 1.0));
  vec3 grayscale = vec3(luminance);
  vec3 outColor = mix(themed, grayscale, clamp(uGrayscale, 0.0, 1.0)) * max(uBrightness, 0.0);

  gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
}
`,Va=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ga=`precision highp float;

// ── 6 spectral band textures ──
uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

// ── Band data ranges (min, max) for denormalization ──
uniform vec2 uRange_u;
uniform vec2 uRange_g;
uniform vec2 uRange_r;
uniform vec2 uRange_i;
uniform vec2 uRange_z;
uniform vec2 uRange_nuv;

// ── Controls (shared with Lupton shader) ──
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uGrayscale;

// ── Theme & Animation ──
uniform float uTheme;  // 0.0 = infra (warm), 1.0 = astral (cool)
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUV;

// ── Noise ──

float hashN2(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hashN2(i), hashN2(i + vec2(1.0, 0.0)), u.x),
    mix(hashN2(i + vec2(0.0, 1.0)), hashN2(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// FBM for richer organic noise
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise2D(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Interleaved gradient noise — fast screen-space dither
float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

// ── Helpers ──

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float stretch(float val, float m) {
  return safe_asinh(uAlpha * uQ * max(val - m, 0.0)) / max(uQ, 1e-6);
}

void main() {
  vec2 pixel = vUV * uResolution;
  vec2 texel = 1.0 / uResolution;

  // ── 1. Sample all 6 bands ──
  float u_raw = texture2D(uBand_u, vUV).r;
  float g_raw = texture2D(uBand_g, vUV).r;
  float r_raw = texture2D(uBand_r, vUV).r;
  float i_raw = texture2D(uBand_i, vUV).r;
  float z_raw = texture2D(uBand_z, vUV).r;
  float n_raw = texture2D(uBand_nuv, vUV).r;

  // ── 2. Dither to break 8-bit quantization banding ──
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;
  u_raw += dither;
  g_raw += dither;
  r_raw += dither;
  i_raw += dither;
  z_raw += dither;
  n_raw += dither;

  // ── 3. Denormalize to FITS data range ──
  float u_val = max(denorm(u_raw, uRange_u), 0.0);
  float g_val = max(denorm(g_raw, uRange_g), 0.0);
  float r_val = max(denorm(r_raw, uRange_r), 0.0);
  float i_val = max(denorm(i_raw, uRange_i), 0.0);
  float z_val = max(denorm(z_raw, uRange_z), 0.0);
  float n_val = max(denorm(n_raw, uRange_nuv), 0.0);

  // ── 4. Spectral layers ──
  float dust    = (z_val + i_val) * 0.5;     // dust lanes & old stars
  float stellar = (r_val + g_val) * 0.5;     // main stellar body
  float hot     = (u_val + n_val) * 0.5;     // star-forming / UV emission
  float total   = (dust + stellar + hot) / 3.0;

  // ── 5. Black-point from sensitivity ──
  float avgRange = (
    (uRange_u.y - uRange_u.x) + (uRange_g.y - uRange_g.x) +
    (uRange_r.y - uRange_r.x) + (uRange_i.y - uRange_i.x) +
    (uRange_z.y - uRange_z.x) + (uRange_nuv.y - uRange_nuv.x)
  ) / 6.0;
  float m = (1.0 - uSensitivity) * avgRange * 0.02;

  // ── 6. Asinh stretch per layer ──
  float sDust    = stretch(dust, m);
  float sStellar = stretch(stellar, m);
  float sHot     = stretch(hot, m);
  float sTotal   = stretch(total, m);

  // ── 7. Per-layer animation ──
  // Dust: flowing wisps via FBM noise
  float dustFlow = fbm(vUV * 6.0 + vec2(uTime * 0.02, uTime * 0.012));
  sDust *= dustFlow * 0.3 + 0.85;

  // Stellar: gentle shimmer
  float starShimmer = valueNoise2D(vUV * 14.0 + vec2(-uTime * 0.015, uTime * 0.01));
  sStellar *= starShimmer * 0.15 + 0.925;

  // Hot emission: pulsing waves radiating from center
  float hotPulse = sin(uTime * 1.5 + length(vUV - 0.5) * 10.0);
  sHot *= hotPulse * 0.18 + 1.0;

  // ── 8. Theme-dependent color compositing ──
  vec3 dustCol = mix(
    vec3(0.85, 0.45, 0.15),   // infra: warm amber
    vec3(0.15, 0.45, 0.90),   // astral: lupton-like blue
    uTheme
  );
  vec3 starCol = mix(
    vec3(1.0, 0.95, 0.88),    // infra: warm cream
    vec3(0.70, 0.80, 0.95),   // astral: cool blue-white (lupton match)
    uTheme
  );
  vec3 hotCol = mix(
    vec3(0.35, 0.55, 1.0),    // infra: blue-cyan
    vec3(0.35, 0.65, 0.95),   // astral: lupton-like cyan-blue
    uTheme
  );

  vec3 col = vec3(0.0);
  col += dustCol * sDust;
  col += starCol * sStellar;
  col += hotCol  * sHot;

  // ── 9. Feathered edge softening ──
  // Noise breaks up hard galaxy silhouette boundary
  float edgeNoise = fbm(vUV * 15.0 + vec2(uTime * 0.005));
  float edgeMask = smoothstep(0.0, 0.08 + edgeNoise * 0.06, sTotal);
  col *= edgeMask;

  // ── 10. Glow: 8-tap blurred i-band halo ──
  float glw = 0.0;
  // inner ring (radius ~4 texels)
  glw += texture2D(uBand_i, vUV + texel * vec2( 4.0,  0.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2(-4.0,  0.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2( 0.0,  4.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2( 0.0, -4.0)).r;
  // outer ring (radius ~14 texels, half weight)
  glw += texture2D(uBand_i, vUV + texel * vec2( 10.0,  10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2(-10.0,  10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2( 10.0, -10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2(-10.0, -10.0)).r * 0.5;
  float glowVal = max(denorm(glw / 6.0, uRange_i), 0.0);
  float sGlow = stretch(glowVal, m);
  vec3 glowCol = mix(
    vec3(0.95, 0.88, 0.75),   // infra: warm glow
    vec3(0.75, 0.85, 1.0),    // astral: bright cool glow
    uTheme
  );
  col += glowCol * sGlow * 0.6;

  // ── 11. Core breathing ──
  float pulse = sin(uTime * 0.7) * 0.10 + 1.0;
  col *= mix(1.0, pulse, smoothstep(0.1, 0.5, sTotal));

  // ── 12. Star detection & twinkle ──
  // Detect point sources: must be both bright AND stand out from local glow
  float peak = max(max(i_val, r_val), max(g_val, z_val));
  float minStarBright = avgRange * 0.05;  // minimum brightness to qualify as star
  float starness = smoothstep(
    max(glowVal * 2.0, minStarBright),
    max(glowVal * 4.0, minStarBright * 3.0),
    peak
  );

  // Animated sparkle
  float twinkle = valueNoise2D(vUV * 300.0 + vec2(uTime * 2.5, uTime * 1.8));
  twinkle = twinkle * twinkle;  // sharpen peaks for sparkle effect
  col *= mix(1.0, 0.4 + twinkle * 1.6, starness);

  // Additive sparkle glow on bright stars - use actual RGB band data for rainbow colors
  // Map SDSS bands to RGB: r→R, g→G, u→B (like traditional RGB composites)
  float star_r = stretch(r_val, m) * 1.5;
  float star_g = stretch(g_val, m) * 1.5;
  float star_b = stretch(u_val, m) * 1.5;
  vec3 sparkleCol = vec3(star_r, star_g, star_b);
  // Fallback to white if no data
  sparkleCol = mix(mix(vec3(1.0, 0.95, 0.85), vec3(0.95, 0.98, 1.0), uTheme), sparkleCol, 0.9);
  col += sparkleCol * starness * twinkle * 0.6;

  // ── 13. Cinematic color grading ──
  // Lifted blacks — theme-tinted floor
  vec3 blackFloor = mix(
    vec3(0.015, 0.010, 0.025),  // infra: warm purple
    vec3(0.008, 0.012, 0.035),  // astral: deeper blue
    uTheme
  );
  col = max(col, blackFloor);

  // S-curve contrast (Hermite smoothstep on color)
  col = col * col * (3.0 - 2.0 * col);

  // Warm-cool split (theme-weighted)
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.3, uTheme);
  float coolW = mix(0.5, 1.0, uTheme);
  col += vec3(0.02, 0.01, -0.02) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.01, 0.0, 0.03) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Soft vignette
  float vig = 1.0 - smoothstep(0.4, 1.2, length(vUV - 0.5) * 1.5);
  col *= mix(0.7, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
`,La=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ha=`precision highp float;

// ── Band textures ──
uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

// ── Band data ranges ──
uniform vec2 uRange_u;
uniform vec2 uRange_g;
uniform vec2 uRange_r;
uniform vec2 uRange_i;
uniform vec2 uRange_z;
uniform vec2 uRange_nuv;

// ── Controls ──
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uGrayscale;

// ── Theme & Animation ──
uniform float uTheme;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUV;

// ═══════════════════════════════════════
// Noise toolkit
// ═══════════════════════════════════════

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * valueNoise(p);
    p = p * 2.0 + vec2(1.7, 3.2);
    a *= 0.5;
  }
  return v;
}

float ign(vec2 c) {
  return fract(52.9829189 * fract(dot(c, vec2(0.06711056, 0.00583715))));
}

// Rotate point around origin
vec2 rot2(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float stretch(float val, float m, float Q, float alpha) {
  return safe_asinh(alpha * Q * max(val - m, 0.0)) / max(Q, 1e-6);
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  // ═══════════════════════════════════════
  // PHASE 1: Band data → density fields
  // LOD bias 0.5 preserves galaxy structure while smoothing noise
  // ═══════════════════════════════════════

  float dustRaw = max(
    (denorm(texture2D(uBand_z, vUV, 0.5).r + dither, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 0.5).r + dither, uRange_i)) * 0.5,
    0.0
  );
  float starRaw = max(
    (denorm(texture2D(uBand_r, vUV, 0.5).r + dither, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 0.5).r + dither, uRange_g)) * 0.5,
    0.0
  );
  float gasRaw = max(
    (denorm(texture2D(uBand_u, vUV, 0.5).r + dither, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 0.5).r + dither, uRange_nuv)) * 0.5,
    0.0
  );

  // Also sample at higher LOD for smooth background envelope
  float dustSmooth = max(
    (denorm(texture2D(uBand_z, vUV, 3.0).r, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 3.0).r, uRange_i)) * 0.5,
    0.0
  );
  float starSmooth = max(
    (denorm(texture2D(uBand_r, vUV, 3.0).r, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 3.0).r, uRange_g)) * 0.5,
    0.0
  );
  float gasSmooth = max(
    (denorm(texture2D(uBand_u, vUV, 3.0).r, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 3.0).r, uRange_nuv)) * 0.5,
    0.0
  );

  float totalRaw = (dustRaw + starRaw + gasRaw) / 3.0;
  float totalSmooth = (dustSmooth + starSmooth + gasSmooth) / 3.0;

  // Asinh stretch
  float avgRange = (
    (uRange_u.y - uRange_u.x) + (uRange_g.y - uRange_g.x) +
    (uRange_r.y - uRange_r.x) + (uRange_i.y - uRange_i.x) +
    (uRange_z.y - uRange_z.x) + (uRange_nuv.y - uRange_nuv.x)
  ) / 6.0;
  float m = (1.0 - uSensitivity) * avgRange * 0.02;

  float sTotal = stretch(totalRaw, m, uQ, uAlpha);
  float sDust  = stretch(dustRaw,  m, uQ, uAlpha);
  float sStar  = stretch(starRaw,  m, uQ, uAlpha);
  float sGas   = stretch(gasRaw,   m, uQ, uAlpha);
  float sTotalSmooth = stretch(totalSmooth, m, uQ, uAlpha);

  // Normalize so that contrast slider changes curve shape, not overall brightness
  float stretchRef = stretch(avgRange * 0.3, m, uQ, uAlpha);
  float normF = 1.0 / max(stretchRef, 0.01);
  sTotal *= normF;
  sDust  *= normF;
  sStar  *= normF;
  sGas   *= normF;
  sTotalSmooth *= normF;

  // Per-pixel spectral fractions
  float totalS = sDust + sStar + sGas + 0.001;
  float dustFrac = sDust / totalS;
  float gasFrac  = sGas  / totalS;
  float starFrac = sStar / totalS;

  // ═══════════════════════════════════════
  // PHASE 2: Data-driven nebula rendering
  // The actual band data shapes the galaxy, noise adds atmosphere
  // ═══════════════════════════════════════

  vec3 col = vec3(0.0);
  vec2 center = vec2(0.5);
  vec2 pc = vUV - center;
  float dist = length(pc) * 2.0; // 0 at center, 1 at edge

  // ── Base color from spectral data ──
  // Warm core (dust-dominated) → cool arms (gas/star-dominated)
  vec3 dustCol = mix(
    vec3(0.85, 0.45, 0.12),   // infra: warm amber
    vec3(0.35, 0.40, 0.70),   // astral: cool slate blue
    uTheme
  );
  vec3 starCol_base = mix(
    vec3(0.95, 0.88, 0.65),   // infra: golden white
    vec3(0.75, 0.80, 1.0),    // astral: blue-white
    uTheme
  );
  vec3 gasCol = mix(
    vec3(0.30, 0.15, 0.60),   // infra: deep violet
    vec3(0.35, 0.50, 0.90),   // astral: vivid blue
    uTheme
  );

  // Spectral-weighted base color per pixel
  vec3 dataColor = dustCol * dustFrac + starCol_base * starFrac + gasCol * gasFrac;

  // ── Layer 4: outer nebula haze — faint wispy envelope ──
  vec2 uv4 = rot2(pc, uTime * 0.02) + center;
  vec2 warp4 = vec2(
    fbm(uv4 * 2.0 + vec2(uTime * 0.003, 0.0)),
    fbm(uv4 * 2.0 + vec2(0.0, uTime * 0.002) + 5.2)
  );
  float n4 = fbm(uv4 * 2.5 + warp4 * 0.8);
  // Data drives shape, noise adds wispy edges — hard gate on data presence
  float dataPresence4 = smoothstep(0.02, 0.20, sTotalSmooth);
  float mask4 = dataPresence4 * smoothstep(1.2, 0.3, dist);
  float smoke4 = n4 * 0.3 + 0.7;
  vec3 tint4 = mix(
    vec3(0.10, 0.05, 0.18),   // infra: deep wine
    vec3(0.04, 0.06, 0.16),   // astral: deep navy-indigo
    uTheme
  );
  col += tint4 * mask4 * smoke4 * 0.5;

  // ── Layer 3: mid nebula — spectral color clouds following data ──
  vec2 uv3 = rot2(pc, uTime * 0.03) + center;
  float n3 = fbm(uv3 * 4.0 + vec2(-uTime * 0.005, uTime * 0.004));
  // Noise only warps edges, data is primary shape — gate on actual data
  float d3 = sTotal * (0.85 + n3 * 0.15);
  float mask3 = smoothstep(0.05, 0.30, d3);
  float smoke3 = n3 * 0.3 + 0.7;
  col += dataColor * mask3 * smoke3 * 0.7;

  // ── Dark absorption lanes — stronger, data-aware ──
  vec2 uvDark = rot2(pc, uTime * 0.025) + center;
  float darkNoise = fbm(uvDark * 5.0 + vec2(uTime * 0.003, -uTime * 0.002));
  // Lanes are stronger where there IS data (mid-brightness regions)
  float darkMask = smoothstep(0.08, 0.35, sTotal) * (1.0 - smoothstep(0.5, 0.8, sTotal));
  float darkAmount = smoothstep(0.35, 0.65, darkNoise) * darkMask * 0.35;
  col *= 1.0 - darkAmount;

  // ── Layer 2: inner body — brighter, more saturated ──
  vec2 uv2 = rot2(pc, uTime * 0.05) + center;
  float n2 = fbm(uv2 * 6.0 + vec2(uTime * 0.007, -uTime * 0.005));
  float d2 = sTotal * (0.9 + n2 * 0.1);
  float mask2 = smoothstep(0.10, 0.45, d2);
  float smoke2 = n2 * 0.15 + 0.85;
  // Shift toward brighter tones for inner regions
  vec3 innerColor = mix(dataColor, mix(
    vec3(0.95, 0.80, 0.50),   // infra: warm gold
    vec3(0.80, 0.85, 1.0),    // astral: bright blue-white
    uTheme
  ), 0.4);
  col += innerColor * mask2 * smoke2 * 0.6;

  // ── Layer 1: core — blazing bright (replaces, not adds) ──
  float n1 = fbm(rot2(pc, uTime * 0.07) * 3.0 + center + vec2(uTime * 0.004));
  // Core driven purely by data brightness
  float coreMask = smoothstep(0.15, 0.50, sTotal) * smoothstep(0.9, 0.10, dist);
  vec3 coreColor = mix(
    vec3(1.0, 0.92, 0.75),    // infra: warm white
    vec3(0.88, 0.92, 1.0),    // astral: cool bright white
    uTheme
  );
  // Slight spectral tint
  coreColor = mix(coreColor, dataColor * 1.5, 0.15);
  float pulse = sin(uTime * 0.4) * 0.04 + 1.0;
  col = mix(col, coreColor * pulse * 1.1, coreMask * (n1 * 0.1 + 0.9));

  // ── HII regions: red/pink emission in gas-rich areas ──
  float hiiNoise = fbm(vUV * 8.0 + vec2(uTime * 0.002, uTime * 0.003) + 2.7);
  float hiiMask = gasFrac * smoothstep(0.03, 0.20, sGas) * smoothstep(0.7, 0.15, sTotal);
  hiiMask *= smoothstep(0.35, 0.65, hiiNoise);
  vec3 hiiColor = mix(
    vec3(0.95, 0.25, 0.20),   // infra: bright red emission
    vec3(0.95, 0.30, 0.35),   // astral: vivid red-pink
    uTheme
  );
  col += hiiColor * hiiMask * 0.8;

  // ═══════════════════════════════════════
  // PHASE 3: Data-driven star detection & twinkle
  // Sharp samples vs blurred background → real star locations
  // ═══════════════════════════════════════

  float i_sharp = max(denorm(texture2D(uBand_i, vUV).r + dither, uRange_i), 0.0);
  float r_sharp = max(denorm(texture2D(uBand_r, vUV).r + dither, uRange_r), 0.0);
  float g_sharp = max(denorm(texture2D(uBand_g, vUV).r + dither, uRange_g), 0.0);
  float z_sharp = max(denorm(texture2D(uBand_z, vUV).r + dither, uRange_z), 0.0);

  // Star = sharp pixel much brighter than blurred local background
  float peak = max(max(i_sharp, r_sharp), max(g_sharp, z_sharp));
  float localBg = max(max(dustRaw, starRaw), gasRaw);
  float minBright = avgRange * 0.03;
  float starness = smoothstep(
    max(localBg * 1.5, minBright),
    max(localBg * 3.0, minBright * 2.5),
    peak
  );

  // Twinkle animation
  float twinkle = valueNoise(vUV * 400.0 + vec2(uTime * 3.0, uTime * 2.0));
  float twinkle2 = valueNoise(vUV * 150.0 + vec2(-uTime * 1.5, uTime * 2.5));
  twinkle = twinkle * twinkle * twinkle2;
  col *= mix(1.0, 0.3 + twinkle * 2.0, starness);

  // Star glow from actual band data — rainbow colors
  float r_star = stretch(r_sharp, m, uQ, uAlpha) * 2.0;
  float g_star = stretch(g_sharp, m, uQ, uAlpha) * 2.0;
  float u_star = stretch(max(denorm(texture2D(uBand_u, vUV).r + dither, uRange_u), 0.0), m, uQ, uAlpha) * 2.0;
  vec3 starCol = vec3(r_star, g_star, u_star);
  starCol = mix(mix(vec3(1.0, 0.95, 0.88), vec3(0.88, 0.92, 1.0), uTheme), starCol, 0.85);
  col += starCol * starness * (twinkle * 0.6 + 0.3);

  // ═══════════════════════════════════════
  // PHASE 4: Cinematic color grading
  // ═══════════════════════════════════════

  // Lifted blacks — very subtle dark navy
  vec3 blackFloor = mix(
    vec3(0.006, 0.004, 0.012),
    vec3(0.003, 0.003, 0.010),
    uTheme
  );
  col = max(col, blackFloor);

  // Gentle S-curve — preserve brightness, add contrast
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.3);

  // Warm-cool split toning
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.2, uTheme);
  float coolW = mix(0.3, 0.8, uTheme);
  col += vec3(0.015, 0.008, -0.01) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.008, 0.0, 0.02) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Subtle vignette
  float vig = 1.0 - smoothstep(0.5, 1.4, dist * 0.6);
  col *= mix(0.8, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
`,Wa=`precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

void main() {
  // Flatten Z for thin disk appearance (galaxy viewed from above)
  // depthScale is ~0.35 from CPU side; multiplying by 0.15 gives a very thin disk
  vec3 diskPos = aPosition;
  diskPos.z *= 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(diskPos, 1.0);
  float depth = max(-mvPosition.z, 0.001);

  // Large overlapping points create smooth continuous appearance
  // Intensity drives size: bright regions are larger, dim regions smaller
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float size = aSize * (0.7 + uAlpha * 0.8) * contrastBoost * sensitivityBoost;

  // Points need to be large enough to overlap for smooth look
  gl_PointSize = max(size * uPixelRatio * (3.0 / depth), 2.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vDepth = depth;
}
`,Ya=`precision highp float;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTheme;
uniform float uGrayscale;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

// ── Nebula color from intensity layer ──
// Ported from morphology shader — uses intensity as depth proxy
// (bright points = core, dim points = outer structure)

vec3 nebulaWarm(float depth, float stretch) {
  vec3 deep   = vec3(0.12, 0.04, 0.18);  // dark violet dust
  vec3 back   = vec3(0.55, 0.08, 0.12);  // deep crimson
  vec3 mid    = vec3(0.90, 0.35, 0.08);  // ember orange
  vec3 front  = vec3(1.00, 0.75, 0.30);  // warm gold
  vec3 bright = vec3(1.00, 0.55, 0.35);  // bright coral-orange
  vec3 core   = vec3(1.00, 0.85, 0.65);  // warm peach

  vec3 c;
  if (depth < 0.2) {
    c = mix(deep, back, depth / 0.2);
  } else if (depth < 0.4) {
    c = mix(back, mid, (depth - 0.2) / 0.2);
  } else if (depth < 0.6) {
    c = mix(mid, front, (depth - 0.4) / 0.2);
  } else if (depth < 0.8) {
    c = mix(front, bright, (depth - 0.6) / 0.2);
  } else {
    c = mix(bright, core, (depth - 0.8) / 0.2);
  }

  return c;
}

vec3 nebulaCool(float depth, float stretch) {
  vec3 deep   = vec3(0.03, 0.06, 0.18);  // void blue-black
  vec3 back   = vec3(0.08, 0.18, 0.45);  // deep sapphire
  vec3 mid    = vec3(0.45, 0.10, 0.55);  // rich magenta-violet
  vec3 front  = vec3(0.15, 0.50, 0.55);  // teal emission
  vec3 bright = vec3(0.55, 0.35, 0.90);  // bright electric violet
  vec3 core   = vec3(0.75, 0.65, 0.95);  // pale violet

  vec3 c;
  if (depth < 0.2) {
    c = mix(deep, back, depth / 0.2);
  } else if (depth < 0.4) {
    c = mix(back, mid, (depth - 0.2) / 0.2);
  } else if (depth < 0.6) {
    c = mix(mid, front, (depth - 0.4) / 0.2);
  } else if (depth < 0.8) {
    c = mix(front, bright, (depth - 0.6) / 0.2);
  } else {
    c = mix(bright, core, (depth - 0.8) / 0.2);
  }

  return c;
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  // Soft gaussian falloff — large overlap creates smooth continuous appearance
  float gauss = exp(-r * r * 6.0);

  // Lupton-style asinh stretch for proper dynamic range
  float boosted = pow(vIntensity, 0.5) * (0.3 + uAlpha * 0.4);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.08)) / max(1.0 + uQ * 0.08, 1.0);
  stretch = max(stretch, 0.04);

  float sensitivityBoost = mix(0.5, 1.3, uSensitivity);

  // ── Depth-layered nebula colors ──
  // Use sqrt(intensity) as depth proxy: maps [0,1] intensity to palette stops
  // sqrt compresses brights so mid-tones get more color range
  float depthProxy = sqrt(vIntensity);

  vec3 warm = nebulaWarm(depthProxy, stretch);
  vec3 cool = nebulaCool(depthProxy, stretch);
  vec3 nebula = mix(warm, cool, uTheme);

  // Blend spectral band data for real color variance
  vec3 spectralInfluence = vColor * 0.7 + 0.3;
  nebula *= mix(vec3(1.0), spectralInfluence, 0.4);

  // Brightness
  float brightness = (0.3 + stretch * 1.4) * sensitivityBoost;
  vec3 col = nebula * brightness * gauss;

  // Core glow: tinted by the nebula color, not flat white
  vec3 coreHue = nebula * 0.6 + 0.4;
  float coreBrightness = pow(gauss, 3.0) * stretch * 0.25;
  col += coreHue * coreBrightness;

  col = clamp(col, 0.0, 1.0);

  // Alpha: gaussian falloff with intensity gating
  float alpha = gauss * stretch * sensitivityBoost * 1.5;
  alpha = clamp(alpha, 0.0, 1.0);

  // Gentle noise gate: only suppress true background noise
  float signal = smoothstep(0.01, 0.05, vIntensity);
  alpha *= signal;

  // Grayscale support
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`,qe=`precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute float aFilamentarity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vCameraDepth;
varying float vFilamentarity;
varying float vMorphDepth;

void main() {
  // Flatten Z for disk appearance — enough depth to separate layers on rotation
  vec3 displaced = aPosition;
  displaced.z *= 0.45;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float camDepth = max(-mvPosition.z, 0.001);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float size = aSize * (0.7 + uAlpha * 0.8) * contrastBoost * sensitivityBoost;

  // Filamentary points slightly smaller, round/core slightly larger
  size *= mix(1.1, 0.85, aFilamentarity);

  gl_PointSize = max(size * uPixelRatio * (2.2 / camDepth), 1.5);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vCameraDepth = camDepth;
  vFilamentarity = aFilamentarity;
  // Color-driving depth: use intensity, not random z-position.
  // Intensity correlates with galaxy structure (core=bright, arms=dim)
  // so colors naturally reveal the silhouette.
  // The random z still drives physical parallax during rotation.
  vMorphDepth = sqrt(aIntensity);
}
`,je=`precision highp float;

uniform float uTheme;
uniform float uGrayscale;
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;

varying vec3 vColor;
varying float vIntensity;
varying float vCameraDepth;
varying float vFilamentarity;
varying float vMorphDepth;

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

// ── Two-axis color: depth layer × structural shape ──
// Depth (vMorphDepth) separates z-layers during rotation.
// Filamentarity separates arms (high F, cool/teal) from core (low F, warm/magenta).
// Together they create enough color contrast that the galaxy silhouette
// reveals itself through parallax as the camera orbits.

// Round/isotropic structures (F≈0): warm core hues
vec3 coreWarm(float depth) {
  vec3 deep  = vec3(0.20, 0.04, 0.12);  // dark burgundy
  vec3 mid   = vec3(0.85, 0.20, 0.35);  // hot rose
  vec3 front = vec3(1.00, 0.65, 0.40);  // peach-gold
  vec3 peak  = vec3(1.00, 0.80, 0.55);  // warm cream

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

vec3 coreCool(float depth) {
  vec3 deep  = vec3(0.08, 0.04, 0.20);  // dark indigo
  vec3 mid   = vec3(0.50, 0.15, 0.65);  // electric violet
  vec3 front = vec3(0.70, 0.45, 0.85);  // bright lavender
  vec3 peak  = vec3(0.80, 0.65, 0.95);  // pale orchid

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

// Filamentary structures (F≈1): cool arm hues — distinctly different from core
vec3 armWarm(float depth) {
  vec3 deep  = vec3(0.05, 0.08, 0.15);  // dark steel-blue
  vec3 mid   = vec3(0.15, 0.30, 0.45);  // dusty blue
  vec3 front = vec3(0.30, 0.55, 0.50);  // muted teal
  vec3 peak  = vec3(0.50, 0.70, 0.55);  // sage green

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

vec3 armCool(float depth) {
  vec3 deep  = vec3(0.02, 0.06, 0.18);  // void navy
  vec3 mid   = vec3(0.05, 0.25, 0.50);  // ocean blue
  vec3 front = vec3(0.10, 0.50, 0.60);  // bright teal
  vec3 peak  = vec3(0.25, 0.65, 0.55);  // cyan-green

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  // Soft organic point shape
  float disc = 1.0 - smoothstep(0.15, 0.5, r);
  float halo = exp(-r * r * 8.0);

  // Intensity stretch — exponential saturation prevents additive blowout
  float compressed = 1.0 - exp(-vIntensity * 2.5);
  float boosted = compressed * (0.2 + uAlpha * 0.3);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.08)) / max(1.0 + uQ * 0.08, 1.0);
  stretch = max(stretch, 0.06);

  float sensitivityBoost = mix(0.5, 1.2, uSensitivity);
  float camFade = 1.0 / (1.0 + vCameraDepth * 0.12);

  // ── Two-axis nebula color: shape × depth ──
  // Galaxy images produce mostly F≈0-0.3 (smooth gradients).
  // Low threshold so even moderate anisotropy shifts toward arm palette.
  float F = smoothstep(0.05, 0.30, vFilamentarity);

  // Core palette (round structures, F≈0)
  vec3 coreC = mix(coreWarm(vMorphDepth), coreCool(vMorphDepth), uTheme);
  // Arm palette (filamentary structures, F≈1)
  vec3 armC = mix(armWarm(vMorphDepth), armCool(vMorphDepth), uTheme);
  // Blend by structural shape
  vec3 nebula = mix(coreC, armC, F);

  // Blend spectral band data for real per-pixel color variance
  vec3 spectralInfluence = vColor * 0.7 + 0.3;
  nebula *= mix(vec3(1.0), spectralInfluence, 0.35);

  // Brightness
  float brightness = (0.3 + stretch * 1.4) * sensitivityBoost * camFade;
  vec3 col = nebula * brightness * halo;

  // Core glow: tinted by nebula color, not flat white
  vec3 coreHue = nebula * 0.6 + 0.4;
  float coreGlow = pow(disc, 3.0) * stretch * mix(0.18, 0.05, vFilamentarity);
  col += coreHue * coreGlow;

  col = clamp(col, 0.0, 1.0);

  // Alpha: filamentary points slightly more transparent
  float filamAlphaScale = mix(1.0, 0.65, vFilamentarity);
  float alpha = clamp(
    (halo * 0.85 + disc * 0.5) * stretch * sensitivityBoost * camFade * 2.5 * filamAlphaScale,
    0.0, 1.0
  );

  // Noise gate: suppress true background noise
  float signal = smoothstep(0.01, 0.05, vIntensity);
  alpha *= signal;

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`;function Dt(a){return a==="nsa3d"||a==="nsamorphology"?"orbit":"image-plane"}function $a(a,t,e){return{yaw:a.yaw-t*.008,pitch:a.pitch+e*.006}}function Qa(a,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(a,t)/500)),intensityThreshold:.003,depthScale:.35,sizeRange:[1.5,8.5],seed:e}}function Xa(a,t){const e=[],n=Math.max(1,Math.floor(t.sampleStep)),[i,s]=t.sizeRange,h=Math.max(1,a.width-1),c=Math.max(1,a.height-1);for(let f=0;f<a.height;f+=n)for(let v=0;v<a.width;v+=n){const l=f*a.width+v,r=Math.sqrt(ot(a.bands.u[l]??0)),u=Math.sqrt(ot(a.bands.g[l]??0)),p=Math.sqrt(ot(a.bands.r[l]??0)),b=Math.sqrt(ot(a.bands.i[l]??0)),x=Math.sqrt(ot(a.bands.z[l]??0)),k=Math.sqrt(ot(a.bands.nuv[l]??0)),A=(b+x)*.5,y=(u+p)*.5,w=(r+k)*.5,C=A*.25+y*.4+w*.35;if(C<t.intensityThreshold)continue;const M=w-A,U=(Ue(v,f,t.seed)-.5)*2,I=(Ue(v+137,f+251,t.seed)-.5)*2,V=(U*.7+I*.3+M*.25)*t.depthScale,z=a.width===1?0:v/h-.5,O=a.height===1?0:.5-f/c,H=ja(i,s,ot(C)),tt=qa(r,u,p,b,x,k);e.push({x:z,y:O,z:V,color:tt,size:H,intensity:C})}return{points:e}}function qa(a,t,e,n,i,s){const h=a+t+e+n+i+s+.001,c=s/h,f=a/h,v=t/h,l=e/h,r=n/h,u=i/h,p=ot(c*.45+f*.15+v*.1+l*1+r*.9+u*.7),b=ot(c*.15+f*.2+v*.95+l*.4+r*.12+u*.05),x=ot(c*1+f*.95+v*.5+l*.08+r*.1+u*.15);return[p,b,x]}function Ue(a,t,e){const n=Math.sin(a*127.1+t*311.7+e*74.7)*43758.5453123;return n-Math.floor(n)}function ot(a){return Math.max(0,Math.min(1,a))}function ja(a,t,e){return a+(t-a)*e}function Ka(a,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(a,t)/550)),intensityThreshold:.003,depthScale:.6,sizeRange:[1.5,8.5],seed:e}}function Za(a,t){const e=[],n=Math.max(1,Math.floor(t.sampleStep)),[i,s]=t.sizeRange,h=Math.max(1,a.width-1),c=Math.max(1,a.height-1),{field:f,w:v,h:l}=Ja(a,n),r=Math.max(1,Math.min(3,Math.floor(Math.min(v,l)/20)));for(let u=0;u<a.height;u+=n)for(let p=0;p<a.width;p+=n){const b=u*a.width+p,x=Math.sqrt(at(a.bands.u[b]??0)),k=Math.sqrt(at(a.bands.g[b]??0)),A=Math.sqrt(at(a.bands.r[b]??0)),y=Math.sqrt(at(a.bands.i[b]??0)),w=Math.sqrt(at(a.bands.z[b]??0)),C=Math.sqrt(at(a.bands.nuv[b]??0)),M=(y+w)*.5,U=(k+A)*.5,I=(x+C)*.5,Q=M*.25+U*.4+I*.35;if(Q<t.intensityThreshold)continue;const V=Math.floor(p/n),z=Math.floor(u/n),{F:O}=ti(f,v,l,V,z,r),H=(ni(p,u,t.seed)-.5)*2,tt=1/(1+O*9),it=H*tt*t.depthScale,X=a.width===1?0:p/h-.5,E=a.height===1?0:.5-u/c,q=ai(i,s,at(Q)),lt=ei(x,k,A,y,w,C);e.push({x:X,y:E,z:it,color:lt,size:q,intensity:Q,filamentarity:O})}return{points:e}}function Ja(a,t){const e=Math.ceil(a.width/t),n=Math.ceil(a.height/t),i=new Float32Array(e*n);for(let s=0;s<n;s++)for(let h=0;h<e;h++){const c=Math.min(s*t,a.height-1),f=Math.min(h*t,a.width-1),v=c*a.width+f;i[s*e+h]=Math.sqrt(at(a.bands.i[v]??0))}return{field:i,w:e,h:n}}function ti(a,t,e,n,i,s){let h=0,c=0,f=0;for(let k=-s;k<=s;k++)for(let A=-s;A<=s;A++){const y=Math.max(0,Math.min(t-1,n+A)),w=Math.max(0,Math.min(e-1,i+k)),C=Math.max(0,y-1),M=Math.min(t-1,y+1),U=Math.max(0,w-1),I=Math.min(e-1,w+1),Q=a[w*t+M]-a[w*t+C],V=a[I*t+y]-a[U*t+y];h+=Q*Q,c+=Q*V,f+=V*V}const v=h+f,l=h*f-c*c,r=Math.sqrt(Math.max(0,v*v-4*l)),u=(v+r)*.5,p=(v-r)*.5,b=v>1e-4?(u-p)/(u+p):0,x=Math.atan2(2*c,h-f)*.5;return{F:b,angle:x}}function ei(a,t,e,n,i,s){const h=a+t+e+n+i+s+.001,c=s/h,f=a/h,v=t/h,l=e/h,r=n/h,u=i/h,p=at(c*.45+f*.15+v*.1+l*1+r*.9+u*.7),b=at(c*.15+f*.2+v*.95+l*.4+r*.12+u*.05),x=at(c*1+f*.95+v*.5+l*.08+r*.1+u*.15);return[p,b,x]}function ni(a,t,e){const n=Math.sin(a*127.1+t*311.7+e*74.7)*43758.5453123;return n-Math.floor(n)}function at(a){return Math.max(0,Math.min(1,a))}function ai(a,t,e){return a+(t-a)*e}const ii=a=>Math.pow(a,.5);function si(a,t,e,n){const{layerCount:i,zDepthScale:s,opacityCurve:h=ii}=n,c=[],f=255/i/2;let v=!1;for(let l=0;l<a.length;l+=4)if(a[l]>0){v=!0;break}for(let l=0;l<i;l++){const r=l/(i-1),u=Math.round(r*255),p=[];for(let b=0;b<e;b++)for(let x=0;x<t;x++){const k=(b*t+x)*4,A=a[k];if(Math.abs(A-u)<=f){const y=x/t*2-1,w=b/e*2-1,C=-(r*s);p.push(y,w,C)}}if(p.length>0||!v){const b=new re;b.setAttribute("position",new J(new Float32Array(p),3));const x=h(r);c.push({brightness:r,opacity:x,geometry:b,zDepth:-r*s})}}return c}function Te(a){if(a.length===0)return .001;const t=a.reduce((e,n)=>{const i=Array.isArray(n)?n[0]:n.x,s=Array.isArray(n)?n[1]:n.y;return e+Math.max(s-i,0)},0);return Math.max(t/a.length*.02,.001)}function Ht(a,t){return t==="nsa3d"?{Q:5,alpha:.5,sensitivity:1}:t==="nsamorphology"?{Q:5,alpha:.503,sensitivity:1}:t==="composite"?{Q:1,alpha:1,sensitivity:1}:{Q:t==="custom"?20:10,alpha:.5,sensitivity:1}}const se={lupton:{vert:Ae,frag:Ia},composite:{vert:Ae,frag:Na},custom:{vert:Va,frag:Ga},volumetric:{vert:La,frag:Ha},nsamorphology:{vert:qe,frag:je}};class ri{constructor(t){this.planeMaterial=null,this.pointMaterial=null,this.morphMaterial=null,this.mesh=null,this.pointCloud=null,this.morphCloud=null,this.densityMeshes=[],this.densityMaterials=[],this.textures=[],this.animationId=null,this.bandData={},this.currentTheme="astral",this.currentShader="lupton",this.width=1,this.height=1,this.clock=new Tn,this.autoParams={Q:10,alpha:.5,sensitivity:1},this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0,this.lerpSpeed=.15,this.friction=.92,this.velThreshold=1e-4,this.orbitYaw=0,this.orbitPitch=0,this.orbitRadius=2.5,this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=2.5,this.minOrbitRadius=1.1,this.maxOrbitRadius=5,this.orbitLerpSpeed=.12,this.orbitTarget=G(new Dn(0,0,0)),this.renderer=G(new Pn({canvas:t,antialias:!1,alpha:!1})),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.orthographicCamera=G(new En(-1,1,1,-1,0,100)),this.orthographicCamera.position.z=10,this.perspectiveCamera=G(new Fn(48,1,.01,100)),this.perspectiveCamera.position.set(0,0,2.5),this.activeCamera=this.orthographicCamera,this.scene=G(new zn)}async load(t,e){var r,u;const n=`${Ct}/${t}/`,i=["i","r","g"];e.bands.includes("u")&&i.push("u"),e.bands.includes("z")&&i.push("z"),e.bands.includes("nuv")&&i.push("nuv");const s=await Promise.all(i.map(async p=>{const x=await(await fetch(`${n}${p}.png`)).arrayBuffer(),k=Oa(new Uint8Array(x)),A=k.depth===16?65535:255,y=new Float32Array(k.width*k.height),w=k.data,C=k.channels;for(let U=0;U<y.length;U++)y[U]=w[U*C]/A;const M=G(new On(y,k.width,k.height,In,Nn));return M.generateMipmaps=!0,M.minFilter=Vn,M.magFilter=Gn,M.wrapS=_e,M.wrapT=_e,M.needsUpdate=!0,{tex:M,floats:y,width:k.width,height:k.height}}));i.forEach((p,b)=>{const{tex:x,floats:k,width:A,height:y}=s[b];this.textures.push(x),this.bandData[p]={tex:x,range:new xe(e.data_ranges[p][0],e.data_ranges[p][1]),raw:k,width:A,height:y}});const h=this.bandData.g?this.bandData.g.range.y-this.bandData.g.range.x:1;for(const p of["u","z","nuv"]){const b=this.bandData[p];if(!b)continue;const x=b.range.y-b.range.x;x<h*.01&&(console.warn(`[NSA] Discarding ${p}-band: dynamic range ${x.toFixed(4)} too narrow (g-band: ${h.toFixed(4)})`),delete this.bandData[p])}const c=((r=this.renderer.domElement.parentElement)==null?void 0:r.clientWidth)||window.innerWidth,f=((u=this.renderer.domElement.parentElement)==null?void 0:u.clientHeight)||window.innerHeight*.6,v=this.bandData;this.planeMaterial=G(this.createPlaneMaterial(v,c,f)),this.pointMaterial=G(this.createPointMaterial()),this.morphMaterial=G(this.createMorphMaterial());const l=G(new Ln(2,2));this.mesh=G(new Hn(l,this.planeMaterial)),this.scene.add(this.mesh),this.pointCloud=G(this.createPointCloudObject(t)),this.pointCloud.visible=!1,this.scene.add(this.pointCloud),this.morphCloud=G(this.createMorphCloudObject(t)),this.morphCloud.visible=!1,this.scene.add(this.morphCloud),this.resize(c,f),this.applyCurrentShaderMode(),this.setTheme(this.currentTheme),this.autoParams=Ht(e,this.currentShader),this.startAnimation()}createPlaneMaterial(t,e,n){var s,h,c,f,v,l,r,u;const i=[t.i.range,t.r.range,t.g.range];return new Xt({uniforms:{uBandR:{value:t.i.tex},uBandG:{value:t.r.tex},uBandB:{value:t.g.tex},uAlpha:{value:.014},uBrightness:{value:.5},uQ:{value:20},uStretch:{value:Te(i)},uSensitivity:{value:.88},uRangeR:{value:t.i.range},uRangeG:{value:t.r.range},uRangeB:{value:t.g.range},uGrayscale:{value:0},uTheme:{value:1},uBand_u:{value:((s=t.u)==null?void 0:s.tex)??t.g.tex},uBand_g:{value:t.g.tex},uBand_r:{value:t.r.tex},uBand_i:{value:t.i.tex},uBand_z:{value:((h=t.z)==null?void 0:h.tex)??t.i.tex},uBand_nuv:{value:((c=t.nuv)==null?void 0:c.tex)??((f=t.u)==null?void 0:f.tex)??t.g.tex},uRange_u:{value:((v=t.u)==null?void 0:v.range)??t.g.range},uRange_g:{value:t.g.range},uRange_r:{value:t.r.range},uRange_i:{value:t.i.range},uRange_z:{value:((l=t.z)==null?void 0:l.range)??t.i.range},uRange_nuv:{value:((r=t.nuv)==null?void 0:r.range)??((u=t.u)==null?void 0:u.range)??t.g.range},uHas_u:{value:t.u?1:0},uHas_g:{value:t.g?1:0},uHas_r:{value:t.r?1:0},uHas_i:{value:t.i?1:0},uHas_z:{value:t.z?1:0},uHas_nuv:{value:t.nuv?1:0},uTime:{value:0},uResolution:{value:new xe(e*this.renderer.getPixelRatio(),n*this.renderer.getPixelRatio())}},vertexShader:se.lupton.vert,fragmentShader:se.lupton.frag})}createPointMaterial(){return new Xt({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:Wa,fragmentShader:Ya,transparent:!0,depthWrite:!1,blending:qt})}createMorphMaterial(){return new Xt({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:qe,fragmentShader:je,transparent:!0,depthWrite:!1,blending:qt})}createPointCloudObject(t){const e=this.extractPointCloudBands(),n=Xa(e,Qa(e.width,e.height,t)),i=n.points.length,s=new Float32Array(i*3),h=new Float32Array(i*3),c=new Float32Array(i),f=new Float32Array(i);let v=1;for(let r=0;r<i;r+=1){const u=n.points[r];s[r*3]=u.x,s[r*3+1]=u.y,s[r*3+2]=u.z,h[r*3]=u.color[0],h[r*3+1]=u.color[1],h[r*3+2]=u.color[2],c[r]=u.size,f[r]=u.intensity,v=Math.max(v,Math.sqrt(u.x*u.x+u.y*u.y+u.z*u.z))}const l=G(new re);return l.setAttribute("position",new J(s,3)),l.setAttribute("aPosition",new J(s,3)),l.setAttribute("color",new J(h,3)),l.setAttribute("aSize",new J(c,1)),l.setAttribute("aIntensity",new J(f,1)),l.computeBoundingSphere(),this.minOrbitRadius=Math.max(.15,v*.2),this.maxOrbitRadius=Math.max(4.5,v*5),this.orbitRadius=Math.max(this.minOrbitRadius*1.4,v*1.3),this.targetOrbitRadius=this.orbitRadius,this.perspectiveCamera.near=.01,this.perspectiveCamera.far=this.maxOrbitRadius*4,this.perspectiveCamera.updateProjectionMatrix(),new jt(l,this.pointMaterial??void 0)}createMorphCloudObject(t){const e=this.extractPointCloudBands(),n=Za(e,Ka(e.width,e.height,t)),i=n.points.length,s=new Float32Array(i*3),h=new Float32Array(i*3),c=new Float32Array(i),f=new Float32Array(i),v=new Float32Array(i);for(let r=0;r<i;r+=1){const u=n.points[r];s[r*3]=u.x,s[r*3+1]=u.y,s[r*3+2]=u.z,h[r*3]=u.color[0],h[r*3+1]=u.color[1],h[r*3+2]=u.color[2],c[r]=u.size,f[r]=u.intensity,v[r]=u.filamentarity}const l=G(new re);return l.setAttribute("position",new J(s,3)),l.setAttribute("aPosition",new J(s,3)),l.setAttribute("color",new J(h,3)),l.setAttribute("aSize",new J(c,1)),l.setAttribute("aIntensity",new J(f,1)),l.setAttribute("aFilamentarity",new J(v,1)),l.computeBoundingSphere(),new jt(l,this.morphMaterial??void 0)}extractPointCloudBands(){const t=i=>this.bandData[i]?i:i==="u"?"g":i==="z"?"i":this.bandData.u?"u":"g",{width:e,height:n}=this.bandData.i;return{width:e,height:n,bands:{u:this.extractSingleBand(t("u")),g:this.extractSingleBand(t("g")),r:this.extractSingleBand(t("r")),i:this.extractSingleBand(t("i")),z:this.extractSingleBand(t("z")),nuv:this.extractSingleBand(t("nuv"))}}}extractSingleBand(t){const e=this.bandData[t],n=e.raw,i=e.range,s=i.x,h=i.y-i.x,c=new Float32Array(n.length);for(let v=0;v<n.length;v++){const l=n[v]*h+s;c[v]=Math.max(l,0)}let f=0;for(let v=0;v<c.length;v++)c[v]>f&&(f=c[v]);if(f>0)for(let v=0;v<c.length;v++)c[v]/=f;return c}extractImageData(t){const e=this.bandData[t],n=e.raw,i=e.width,s=e.height,h=new Uint8ClampedArray(n.length*4);for(let c=0;c<n.length;c++){const f=Math.round(n[c]*255);h[c*4]=f,h[c*4+1]=f,h[c*4+2]=f,h[c*4+3]=255}return{data:h,width:i,height:s}}createDensityMeshes(){this.disposeDensityMeshes();const{data:t,width:e,height:n}=this.extractImageData("i");si(t,e,n,{layerCount:15,zDepthScale:1}).forEach(h=>{const c=G(new Wn({color:16777215,size:.015,opacity:h.opacity,transparent:!0,depthWrite:!1,blending:qt,sizeAttenuation:!0})),f=G(new jt(h.geometry,c));f.position.z=h.zDepth,this.scene.add(f),this.densityMeshes.push(f),this.densityMaterials.push(c)})}disposeDensityMeshes(){for(const t of this.densityMeshes)this.scene.remove(t),t.geometry&&t.geometry.dispose();for(const t of this.densityMaterials)t.dispose();this.densityMeshes=[],this.densityMaterials=[]}applyCurrentShaderMode(){const e=Dt(this.currentShader)==="orbit";if(this.activeCamera=e?this.perspectiveCamera:this.orthographicCamera,this.mesh&&(this.mesh.visible=!e),this.pointCloud&&(this.pointCloud.visible=this.currentShader==="nsa3d"),this.morphCloud&&(this.morphCloud.visible=this.currentShader==="nsamorphology"),!e&&this.planeMaterial){const n=se[this.currentShader];this.planeMaterial.vertexShader=n.vert,this.planeMaterial.fragmentShader=n.frag,this.planeMaterial.needsUpdate=!0}}startAnimation(){const t=()=>{const e=this.clock.getElapsedTime();if(this.planeMaterial&&(this.planeMaterial.uniforms.uTime.value=e),this.pointMaterial&&(this.pointMaterial.uniforms.uTime.value=e),this.morphMaterial&&(this.morphMaterial.uniforms.uTime.value=e),Dt(this.currentShader)==="image-plane"){Math.abs(this.velX)>this.velThreshold||Math.abs(this.velY)>this.velThreshold?(this.targetX+=this.velX,this.targetY+=this.velY,this.velX*=this.friction,this.velY*=this.friction):(this.velX=0,this.velY=0);const n=Math.max(0,1-1/this.targetZoom);this.targetX=Math.max(-n,Math.min(n,this.targetX)),this.targetY=Math.max(-n,Math.min(n,this.targetY));const i=this.lerpSpeed;this.orthographicCamera.zoom+=(this.targetZoom-this.orthographicCamera.zoom)*i,this.orthographicCamera.position.x+=(this.targetX-this.orthographicCamera.position.x)*i,this.orthographicCamera.position.y+=(this.targetY-this.orthographicCamera.position.y)*i,this.orthographicCamera.updateProjectionMatrix()}else this.updateOrbitCamera();this.render(),this.animationId=requestAnimationFrame(t)};this.animationId=requestAnimationFrame(t)}updateOrbitCamera(){this.targetOrbitPitch=Kt.clamp(this.targetOrbitPitch,-1.25,1.25),this.targetOrbitRadius=Kt.clamp(this.targetOrbitRadius,this.minOrbitRadius,this.maxOrbitRadius);const t=this.orbitLerpSpeed;this.orbitYaw+=(this.targetOrbitYaw-this.orbitYaw)*t,this.orbitPitch+=(this.targetOrbitPitch-this.orbitPitch)*t,this.orbitRadius+=(this.targetOrbitRadius-this.orbitRadius)*t;const e=Math.cos(this.orbitPitch);this.perspectiveCamera.position.set(Math.sin(this.orbitYaw)*e*this.orbitRadius,Math.sin(this.orbitPitch)*this.orbitRadius,Math.cos(this.orbitYaw)*e*this.orbitRadius),this.perspectiveCamera.lookAt(this.orbitTarget),this.perspectiveCamera.updateProjectionMatrix()}stopAnimation(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}setParams(t,e,n){Dt(this.currentShader)==="image-plane"?this.planeMaterial&&(this.planeMaterial.uniforms.uQ.value=t,this.planeMaterial.uniforms.uAlpha.value=e,this.planeMaterial.uniforms.uBrightness.value=e,this.planeMaterial.uniforms.uSensitivity.value=n):this.currentShader==="nsa3d"?this.pointMaterial&&(this.pointMaterial.uniforms.uQ.value=t,this.pointMaterial.uniforms.uAlpha.value=e,this.pointMaterial.uniforms.uSensitivity.value=n):this.currentShader==="nsamorphology"&&this.morphMaterial&&(this.morphMaterial.uniforms.uQ.value=t,this.morphMaterial.uniforms.uAlpha.value=e,this.morphMaterial.uniforms.uSensitivity.value=n),this.render()}setBands(t,e,n){const i=this.bandData;!this.planeMaterial||!i[t]||!i[e]||!i[n]||(this.planeMaterial.uniforms.uBandR.value=i[t].tex,this.planeMaterial.uniforms.uBandG.value=i[e].tex,this.planeMaterial.uniforms.uBandB.value=i[n].tex,this.planeMaterial.uniforms.uRangeR.value=i[t].range,this.planeMaterial.uniforms.uRangeG.value=i[e].range,this.planeMaterial.uniforms.uRangeB.value=i[n].range,this.planeMaterial.uniforms.uStretch.value=Te([i[t].range,i[e].range,i[n].range]))}setTheme(t){if(!this.planeMaterial&&!this.pointMaterial||this.currentTheme===t)return;const e=[this.planeMaterial,this.pointMaterial,this.morphMaterial].filter(Boolean);for(const n of e)n.uniforms.uGrayscale.value=0;if(t==="grayscale"){this.setBands("i","r","g");for(const n of e)n.uniforms.uGrayscale.value=1,n.uniforms.uTheme.value=0}else if(t==="infra"){this.setBands("i","r","g");for(const n of e)n.uniforms.uTheme.value=0}else if(t==="astral"){this.setBands("i","r","g");for(const n of e)n.uniforms.uTheme.value=1}this.currentTheme=t,this.render()}getAutoParams(){return this.autoParams}setShader(t){!this.planeMaterial&&!this.pointMaterial||this.currentShader===t||(this.currentShader=t,this.applyCurrentShaderMode(),this.render())}is3DMode(){return Dt(this.currentShader)==="orbit"}supportsSkyPicking(){return Dt(this.currentShader)==="image-plane"}render(){!this.planeMaterial&&!this.pointMaterial&&!this.morphMaterial||this.renderer.render(this.scene,this.activeCamera)}resize(t,e){if(this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.planeMaterial){const n=this.renderer.getPixelRatio();this.planeMaterial.uniforms.uResolution.value.set(t*n,e*n)}this.pointMaterial&&(this.pointMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.morphMaterial&&(this.morphMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.perspectiveCamera.aspect=t/Math.max(e,1),this.perspectiveCamera.updateProjectionMatrix(),this.render()}pan(t,e){if(this.is3DMode())return;const n=this.targetZoom,i=t/this.width*2/n,s=e/this.height*2/n;this.targetX-=i,this.targetY+=s,this.velX=0,this.velY=0}fling(t,e){if(this.is3DMode())return;const n=this.targetZoom;this.velX=-(t/this.width)*2/n,this.velY=e/this.height*2/n}zoomAt(t,e,n){if(this.is3DMode())return;const i=this.targetZoom,s=Math.max(1,Math.min(i*t,50)),h=e/this.width*2-1,c=-(n/this.height)*2+1,f=this.targetX+h/i,v=this.targetY+c/i;this.targetZoom=s,this.targetX=f-h/s,this.targetY=v-c/s,this.velX=0,this.velY=0}orbit(t,e){if(!this.is3DMode())return;const n=$a({yaw:this.targetOrbitYaw,pitch:this.targetOrbitPitch},t,e);this.targetOrbitYaw=n.yaw,this.targetOrbitPitch=n.pitch}dolly(t){if(!this.is3DMode())return;const e=this.targetOrbitRadius/Math.max(t,.01);this.targetOrbitRadius=Kt.clamp(e,this.minOrbitRadius,this.maxOrbitRadius)}screenToRaDec(t,e,n){if(!this.supportsSkyPicking())return null;const i=this.orthographicCamera.zoom,s=t/this.width*2-1,h=-(e/this.height)*2+1,c=this.orthographicCamera.position.x+s/i,f=this.orthographicCamera.position.y+h/i,v=(c+1)/2,l=(f+1)/2;if(v<0||v>1||l<0||l>1)return null;const[r,u]=n.dimensions,p=v*r,b=(1-l)*u,x=p-r/2,k=b-u/2,A=(n.pixel_scale??.396)/3600,y=n.dec*Math.PI/180,w=n.dec-k*A;return{ra:n.ra-x*A/Math.cos(y),dec:w}}resetView(){if(this.is3DMode()){this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=Math.max(this.minOrbitRadius*1.4,1.5);return}this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0}dispose(){var t,e,n;this.stopAnimation(),this.textures.forEach(i=>i.dispose()),this.textures=[],this.planeMaterial&&this.planeMaterial.dispose(),this.pointMaterial&&this.pointMaterial.dispose(),this.morphMaterial&&this.morphMaterial.dispose(),(t=this.mesh)!=null&&t.geometry&&this.mesh.geometry.dispose(),(e=this.pointCloud)!=null&&e.geometry&&this.pointCloud.geometry.dispose(),(n=this.morphCloud)!=null&&n.geometry&&this.morphCloud.geometry.dispose(),this.disposeDensityMeshes(),this.renderer.dispose()}}async function oi(a){const t=new Image;t.crossOrigin="anonymous",t.src=a,await new Promise((s,h)=>{t.onload=()=>s(),t.onerror=()=>h(new Error("Failed to load image"))});const e=document.createElement("canvas");e.width=t.naturalWidth,e.height=t.naturalHeight;const n=e.getContext("2d");n.drawImage(t,0,0);const i=n.getImageData(0,0,e.width,e.height);return qn(i),i}const li=[{label:"Normal",value:"none"},{label:"Negative",value:"invert(1)"},{label:"Cyanotype",value:"sepia(1) hue-rotate(180deg) saturate(1.5)"},{label:"Amber",value:"sepia(1) saturate(1.5)"},{label:"Hard",value:"contrast(1.5) brightness(0.9)"}],hi={class:"photo-scroll",ref:"scrollContainer"},ci={class:"photo-page"},ui={class:"photo-hero"},di={class:"hero-content"},fi={class:"hero-links"},vi=["disabled"],mi={class:"photo-hero-title"},pi={class:"photo-hero-subtitle"},gi={key:0,class:"status-container"},yi={key:1,class:"status-container error"},_i={key:2,class:"content-grid"},xi={class:"glass-card canvas-card"},bi={class:"card-header"},wi={class:"header-actions"},ki={class:"canvas-wrapper"},Ci={class:"canvas-loading-overlay"},Mi={key:0,class:"crosshair-overlay",style:{cursor:"crosshair"}},Ri=["x1","x2","y2"],Si=["y1","x2","y2"],Bi=["cx","cy"],Ai={key:1,class:"coord-hud"},Ui={class:"params-overlay"},Ti=["aria-expanded","aria-label"],Di={key:0,class:"tune-drawer"},Pi={class:"tune-drawer-content"},Ei={class:"tune-drawer-header"},Fi={class:"tune-drawer-title"},zi={class:"tune-drawer-body"},Oi={class:"control-group"},Ii={class:"theme-toggle"},Ni=["onClick"],Vi={key:0,class:"control-group"},Gi={class:"label-row"},Li={class:"param-value"},Hi={class:"control-group"},Wi={class:"label-row"},Yi={class:"param-value"},$i={class:"control-group"},Qi={class:"label-row"},Xi={class:"param-value"},qi={class:"glass-card bands-card"},ji={class:"card-header"},Ki={class:"card-title"},Zi={class:"bands-grid"},Ji=["onClick"],ts={class:"band-img-wrap"},es=["src","alt"],ns={class:"band-badge"},as={class:"lightbox-content"},is={class:"lightbox-header"},ss={class:"lightbox-title"},rs={class:"lightbox-body"},os={class:"lightbox-image-wrap"},ls=["src","alt"],hs={class:"lightbox-controls"},cs={class:"lb-control-group"},us={class:"lb-control-group"},ds=["value"],fs={class:"lb-control-group"},vs={class:"lb-control-group"},ms=["aria-label"],ps={class:"sidebar-content"},gs=["aria-label"],ys={class:"sidebar-title"},_s={class:"sidebar-section"},xs={class:"sidebar-section"},bs={class:"tooltip-content"},ws={key:0,class:"loading-state"},ks={key:1,class:"error-state"},Cs={key:2,class:"empty-state"},Ms={key:3,class:"results-list"},Rs={class:"obj-name"},Ss={class:"obj-type"},Bs={key:0,class:"link-icon"},As=gn({__name:"GalaxyPhotoView",setup(a){const{t}=yn(),e=Bn(),n=Cn(),{ready:i,getGalaxyByPgc:s,getRandomGalaxies:h}=An(),{loading:c,results:f,query:v,error:l}=Un(),r=bt(()=>{const m=f.value.filter(o=>o.type==="Star"||o.type==="Galaxy");return m.length>0?m:f.value.slice(0,5)}),u=bt(()=>Number(e.params.pgc)),p=S(null),b=S(null),x=S(null),k=S(!0),A=S(!1),y=kn(null),w=S(10),C=S(.0515),M=S(1),U=S(null),I=S(null),Q=bt(()=>{var m;return((m=x.value)==null?void 0:m.bands)||["u","g","r","i","z"]}),V=S("astral"),z=S("lupton"),O=bt(()=>z.value==="nsa3d"||z.value==="nsamorphology"),H=S(!1),tt=S(!1),it=S(!1),X=S(!1),E=S({visible:!1,x:0,y:0,objects:[]}),q=S(!1),lt=S(0),j=S(0),L=new Map;let mt=-1,Y=[];const K=S(null),ht=S(null);let et=-1,ct=-1;const ut=S(0),pt=S(0),wt=S(0),Rt=S(0),gt=S(100),yt=S(100),dt=S("none"),_t=S(!1),he=S(null),Wt=new Map,ce=bt(()=>{const m=`brightness(${gt.value}%) contrast(${yt.value}%)`,o=dt.value!=="none"?dt.value:"";return{filter:`${m} ${o}`}}),Ke=bt(()=>{const _=E.value.x,g=E.value.y-120-16;return{left:_+"px",top:Math.max(60,g)+"px"}}),Ze=bt(()=>!O.value&&K.value!==null&&ht.value!==null);function ue(){if(!y.value||!x.value)return;const{Q:m,alpha:o,sensitivity:_}=Ht(x.value,z.value);w.value=m,C.value=o,M.value=_,St(),z.value==="lupton"&&(st.Q=m,st.alpha=o,st.sensitivity=_)}function de(){n.push(`/g/${u.value}`)}async function Je(m){try{return(await fetch(`${Ct}/${m}/metadata.json`)).ok}catch{return!1}}async function tn(){if(it.value)return;it.value=!0;const m=100;for(let o=0;o<m;o++){const g=h(20).filter(N=>N.pgc!==u.value);for(const N of g)if(await Je(N.pgc)){n.push(`/g/${N.pgc}/photo`),it.value=!1;return}}it.value=!1}function St(){y.value&&y.value.setParams(w.value,C.value,M.value)}zt(V,m=>{y.value&&y.value.setTheme(m)});const st={Q:10,alpha:.1555,sensitivity:.88};zt(z,(m,o)=>{if(y.value){if(o==="lupton"&&(st.Q=w.value,st.alpha=C.value,st.sensitivity=M.value),m==="lupton"&&x.value){const _=st,g=Ht(x.value,"lupton");w.value=_.Q!==g.Q?_.Q:g.Q,C.value=_.alpha!==g.alpha?_.alpha:g.alpha,M.value=_.sensitivity}else if(x.value){const _=Ht(x.value,m);w.value=_.Q,C.value=_.alpha,M.value=_.sensitivity}(m==="nsa3d"||m==="nsamorphology")&&(X.value=!1,E.value.visible=!1,K.value=null,ht.value=null),y.value.setShader(m),St()}});function en(m){const o=he.value;if(!o)return;o.width=m.width,o.height=m.height,o.getContext("2d").putImageData(m,0,0)}async function nn(){if(_t.value=!_t.value,_t.value&&U.value){await ye();const m=U.value;let o=Wt.get(m);if(!o){const _=`${Ct}/${u.value}/${m}.png`;o=await oi(_),Wt.set(m,o)}en(o)}}function an(m){U.value=m,gt.value=100,yt.value=100,dt.value="none",_t.value=!1}function fe(){U.value=null}function sn(){O.value||(X.value=!X.value,E.value.visible=!1)}function rn(m){if(m.preventDefault(),!y.value||!p.value)return;const o=m.deltaY>0?.9:1.1,_=p.value.getBoundingClientRect(),g=m.clientX-_.left,N=m.clientY-_.top;y.value.is3DMode()?y.value.dolly(o):(y.value.zoomAt(o,g,N),Ft())}function ve(){const[m,o]=Array.from(L.values()),_=m.clientX-o.clientX,g=m.clientY-o.clientY;return Math.sqrt(_*_+g*g)}function on(){const[m,o]=Array.from(L.values());return{x:(m.clientX+o.clientX)/2,y:(m.clientY+o.clientY)/2}}function ln(m){!y.value||!p.value||(p.value.setPointerCapture(m.pointerId),L.set(m.pointerId,m),L.size===1?(q.value=!0,lt.value=m.clientX,j.value=m.clientY,Y=[{x:m.clientX,y:m.clientY,t:performance.now()}]):L.size===2&&(q.value=!1,mt=ve()))}function hn(m){if(!(!y.value||!p.value)&&L.has(m.pointerId)){if(L.set(m.pointerId,m),L.size===1&&q.value){const o=m.clientX-lt.value,_=m.clientY-j.value;y.value.is3DMode()?y.value.orbit(o,_):y.value.pan(o,_),lt.value=m.clientX,j.value=m.clientY;const g=performance.now();for(Y.push({x:m.clientX,y:m.clientY,t:g});Y.length>1&&g-Y[0].t>80;)Y.shift();y.value.is3DMode()||Ft()}else if(L.size===2){const o=ve();if(mt>0){const _=o/mt,g=on(),N=p.value.getBoundingClientRect();y.value.is3DMode()?y.value.dolly(_):y.value.zoomAt(_,g.x-N.left,g.y-N.top)}mt=o,y.value.is3DMode()||Ft()}}}function Yt(m){if(!p.value)return;const o=q.value&&L.size===1;if(p.value.releasePointerCapture(m.pointerId),L.delete(m.pointerId),L.size<2&&(mt=-1),L.size===1){const _=L.values().next().value;_&&(lt.value=_.clientX,j.value=_.clientY),q.value=!0}else{if(q.value=!1,o&&y.value&&!y.value.is3DMode()&&Y.length>=2){const _=Y[0],g=Y[Y.length-1],N=(g.t-_.t)/1e3;if(N>.005){const xt=(g.x-_.x)/N*.016,vn=(g.y-_.y)/N*.016;y.value.fling(xt,vn)}}Y=[]}}function Ft(){if(!y.value||!x.value||et<0||!y.value.supportsSkyPicking())return;const m=y.value.screenToRaDec(et,ct,x.value);m?(K.value=m.ra,ht.value=m.dec):(K.value=null,ht.value=null)}function cn(m){if(O.value||!p.value)return;const o=p.value.getBoundingClientRect();et=m.clientX-o.left,ct=m.clientY-o.top,X.value&&(ut.value=et,pt.value=ct),Ft()}async function un(m){if(!X.value||!p.value||!x.value||!y.value||!y.value.supportsSkyPicking())return;const o=p.value.getBoundingClientRect(),_=m.clientX-o.left,g=m.clientY-o.top,N=y.value.screenToRaDec(_,g,x.value);if(N){E.value={visible:!0,x:m.clientX,y:m.clientY,objects:[],error:void 0};try{await v(N.ra,N.dec,30),l.value?E.value.error=l.value:E.value.objects=r.value.map(xt=>({name:xt.name,type:xt.type,simbadUrl:xt.simbadUrl}))}catch(xt){E.value.error="Failed to query SIMBAD",console.error("SIMBAD query error:",xt)}}}function dn(){et=-1,ct=-1,K.value=null,ht.value=null}async function fn(m){try{const o=await fetch(`${Ct}/${m}/metadata.json`);o.ok?x.value=await o.json():x.value=null}catch(o){console.error("Failed to load NSA metadata:",o),x.value=null}}async function me(m){var o;k.value=!0,x.value=null,A.value=!1,U.value=null,Wt.clear(),(o=I.value)==null||o.disconnect(),I.value=null,y.value&&(y.value.dispose(),y.value=null),await i,b.value=s(m),await fn(m),k.value=!1;for(let _=0;_<3&&(await ye(),!p.value);_++);if(x.value&&p.value){await new Promise(_=>setTimeout(_,0));try{if(y.value=new ri(p.value),await y.value.load(m,x.value),A.value=!0,y.value.setParams(w.value,C.value,M.value),y.value.setTheme(V.value),ue(),st.Q=w.value,st.alpha=C.value,st.sensitivity=M.value,I.value=new ResizeObserver(()=>{if(y.value&&p.value){const _=p.value.parentElement.getBoundingClientRect();y.value.resize(_.width,_.height),wt.value=_.width,Rt.value=_.height}}),I.value.observe(p.value.parentElement),p.value.parentElement){const _=p.value.parentElement.getBoundingClientRect();wt.value=_.width,Rt.value=_.height}}catch(_){console.error("Failed to load NSA scene:",_),A.value=!0}}}_n(()=>{me(u.value)}),zt(()=>e.params.pgc,(m,o)=>{if(!o)return;const _=Number(m),g=Number(o);_&&_!==g&&me(_)});const $t=m=>{m.key==="Escape"&&(H.value=!1)};return zt(H,m=>{m?document.addEventListener("keydown",$t):document.removeEventListener("keydown",$t)},{immediate:!0}),xn(()=>{var m;document.removeEventListener("keydown",$t),(m=I.value)==null||m.disconnect(),y.value&&y.value.dispose()}),(m,o)=>{var _;return T(),D("div",hi,[d("div",ci,[d("section",ui,[d("div",di,[d("div",fi,[d("button",{class:"back-link",onClick:de},[o[13]||(o[13]=d("span",null,"←",-1)),Bt(" "+B(F(t)("pages.galaxyPhoto.back")||"Back to Galaxy"),1)]),d("button",{class:"shuffle-link",disabled:it.value,onClick:tn},B(it.value?"…":"↻")+" "+B(F(t)("pages.galaxyPhoto.shuffleAnother")),9,vi)]),d("h1",mi,[o[14]||(o[14]=d("span",{class:"title-accent"},"PGC",-1)),Bt(" "+B(((_=b.value)==null?void 0:_.pgc)||u.value),1)]),d("p",pi,B(F(t)("pages.galaxyPhoto.title")),1)])]),k.value?(T(),D("div",gi,[o[15]||(o[15]=d("div",{class:"loading-spinner"},null,-1)),d("p",null,B(F(t)("app.loading")),1)])):x.value?(T(),D("div",_i,[d("div",xi,[d("div",bi,[o[17]||(o[17]=d("h2",{class:"card-title"},"Composite Imaging",-1)),d("div",wi,[ft(d("select",{"onUpdate:modelValue":o[0]||(o[0]=g=>z.value=g),class:"shader-select"},[...o[16]||(o[16]=[bn('<option value="lupton" data-v-5bbb1716>Lupton et al.</option><option value="composite" data-v-5bbb1716>Composite</option><option value="custom" data-v-5bbb1716>Custom</option><option value="volumetric" data-v-5bbb1716>Volumetric</option><option value="nsa3d" data-v-5bbb1716>NSA 3D</option><option value="nsamorphology" data-v-5bbb1716>Morphology 3D</option>',6)])],512),[[pe,z.value]]),O.value?rt("",!0):(T(),D("button",{key:0,class:Ot(["find-objects-btn",{active:X.value}]),onClick:sn,"aria-label":"Find objects at location",title:"Click to activate, then click canvas to query SIMBAD"}," ✦ ",2)),d("button",{class:"info-btn",onClick:o[1]||(o[1]=g=>H.value=!H.value),"aria-label":"Info"}," i ")])]),d("div",ki,[ft(d("div",Ci,[o[18]||(o[18]=d("div",{class:"loading-spinner"},null,-1)),d("p",null,B(F(t)("app.loading")||"Loading..."),1)],512),[[wn,!A.value]]),d("canvas",{ref_key:"canvasEl",ref:p,class:Ot(["composite-canvas",{"find-objects-mode":X.value}]),onWheel:ge(rn,["prevent"]),onClick:un,onPointerdown:ln,onPointermove:hn,onPointerup:Yt,onPointercancel:Yt,onPointerleave:Yt,onMousemove:cn,onMouseleave:dn},null,34),X.value?(T(),D("svg",Mi,[d("line",{x1:ut.value,y1:"0",x2:ut.value,y2:Rt.value,class:"crosshair-line"},null,8,Ri),d("line",{x1:"0",y1:pt.value,x2:wt.value,y2:pt.value,class:"crosshair-line"},null,8,Si),d("circle",{cx:ut.value,cy:pt.value,r:"4",class:"crosshair-dot"},null,8,Bi)])):rt("",!0),Ze.value?(T(),D("div",Ai,[o[19]||(o[19]=d("span",{class:"coord-label"},"RA",-1)),Bt(" "+B(F($n)(K.value))+"   ",1),o[20]||(o[20]=d("span",{class:"coord-label"},"Dec",-1)),Bt(" "+B(F(Qn)(ht.value)),1)])):rt("",!0),d("div",Ui,[d("button",{class:"params-toggle",onClick:o[2]||(o[2]=g=>tt.value=!tt.value),"aria-expanded":tt.value,"aria-label":F(t)("pages.galaxyPhoto.tuneImage")},B(F(t)("pages.galaxyPhoto.tuneImage")),9,Ti)]),At(Ut,{name:"drawer"},{default:kt(()=>[tt.value?(T(),D("div",Di,[d("div",Pi,[d("div",Ei,[d("h2",Fi,B(F(t)("pages.galaxyPhoto.params.title")||"Rendering Parameters"),1),d("button",{class:"tune-drawer-close",onClick:o[3]||(o[3]=g=>tt.value=!1),"aria-label":"Close"}," × ")]),d("div",zi,[d("button",{class:"best-fit-btn tune-best-fit",onClick:ue,title:"Reset to auto-calibrated values"}," Best Fit "),d("div",Oi,[o[21]||(o[21]=d("label",null,"Spectral Theme",-1)),d("div",Ii,[(T(),D(It,null,Nt([{id:"grayscale",label:"Grayscale"},{id:"infra",label:"Infrared"},{id:"astral",label:"Astral"}],g=>d("button",{key:g.id,class:Ot(["theme-btn",{active:V.value===g.id}]),onClick:N=>V.value=g.id},B(g.label),11,Ni)),64))])]),z.value!=="composite"?(T(),D("div",Vi,[d("div",Gi,[d("label",null,B(F(t)("pages.galaxyPhoto.params.q"))+" (Stretch)",1),d("span",Li,B(w.value.toFixed(1)),1)]),ft(d("input",{"onUpdate:modelValue":o[4]||(o[4]=g=>w.value=g),type:"range",min:"1",max:"100",step:"0.5",class:"custom-range",onInput:St},null,544),[[Tt,w.value,void 0,{number:!0}]])])):rt("",!0),d("div",Hi,[d("div",Wi,[d("label",null,B(F(t)("pages.galaxyPhoto.params.alpha"))+" (Brightness)",1),d("span",Yi,B(C.value.toFixed(4)),1)]),ft(d("input",{"onUpdate:modelValue":o[5]||(o[5]=g=>C.value=g),type:"range",min:"0.001",max:"10.0",step:"0.001",class:"custom-range",onInput:St},null,544),[[Tt,C.value,void 0,{number:!0}]])]),d("div",$i,[d("div",Qi,[o[22]||(o[22]=d("label",null,"Sensitivity",-1)),d("span",Xi,B(M.value.toFixed(2)),1)]),ft(d("input",{"onUpdate:modelValue":o[6]||(o[6]=g=>M.value=g),type:"range",min:"0.01",max:"1.0",step:"0.01",class:"custom-range",onInput:St},null,544),[[Tt,M.value,void 0,{number:!0}]])])])])])):rt("",!0)]),_:1})])]),d("section",qi,[d("div",ji,[d("h2",Ki,B(F(t)("pages.galaxyPhoto.bands")),1)]),d("div",Zi,[(T(!0),D(It,null,Nt(Q.value,g=>(T(),D("div",{key:g,class:"band-item",onClick:N=>an(g)},[d("div",ts,[d("img",{src:`${F(Ct)}/${u.value}/${g}.png`,alt:`${g}-band`,loading:"lazy",crossorigin:"anonymous"},null,8,es),o[23]||(o[23]=d("div",{class:"band-overlay"},[d("span",{class:"zoom-icon"},"⤢")],-1))]),d("span",ns,B(g),1)],8,Ji))),128))])])])):(T(),D("div",yi,[d("p",null,B(F(t)("pages.galaxyPhoto.notAvailable")),1),d("button",{class:"action-btn",onClick:de},"Return to Map")]))]),At(Ut,{name:"fade"},{default:kt(()=>[U.value?(T(),D("div",{key:0,class:"lightbox",onClick:ge(fe,["self"])},[d("div",as,[d("button",{class:"lightbox-close",onClick:fe},"×"),d("div",is,[d("h2",ss,B(U.value)+"-band Raw Data",1),o[24]||(o[24]=d("span",{class:"lightbox-subtitle"},"Sloan Digital Sky Survey",-1))]),d("div",rs,[d("div",os,[_t.value?(T(),D("canvas",{key:0,ref_key:"stfCanvasEl",ref:he,class:"lightbox-image",style:Qt(ce.value)},null,4)):(T(),D("img",{key:1,class:"lightbox-image",src:`${F(Ct)}/${u.value}/${U.value}.png`,alt:`${U.value}-band`,style:Qt(ce.value),crossorigin:"anonymous"},null,12,ls)),d("div",hs,[d("div",cs,[o[25]||(o[25]=d("label",null,"Auto STF",-1)),d("button",{class:Ot(["stf-toggle",{active:_t.value}]),onClick:nn},B(_t.value?"ON":"OFF"),3)]),d("div",us,[o[26]||(o[26]=d("label",null,"Filter",-1)),ft(d("select",{"onUpdate:modelValue":o[7]||(o[7]=g=>dt.value=g),class:"lb-select"},[(T(!0),D(It,null,Nt(F(li),g=>(T(),D("option",{key:g.label,value:g.value},B(g.label),9,ds))),128))],512),[[pe,dt.value]])]),d("div",fs,[o[27]||(o[27]=d("label",null,"Brightness",-1)),ft(d("input",{type:"range","onUpdate:modelValue":o[8]||(o[8]=g=>gt.value=g),min:"0",max:"200",class:"custom-range"},null,512),[[Tt,gt.value,void 0,{number:!0}]])]),d("div",vs,[o[28]||(o[28]=d("label",null,"Contrast",-1)),ft(d("input",{type:"range","onUpdate:modelValue":o[9]||(o[9]=g=>yt.value=g),min:"0",max:"200",class:"custom-range"},null,512),[[Tt,yt.value,void 0,{number:!0}]])])])])])])])):rt("",!0)]),_:1}),At(Ut,{name:"fade"},{default:kt(()=>[H.value?(T(),D("div",{key:0,class:"info-sidebar-backdrop","aria-hidden":"true",onClick:o[10]||(o[10]=g=>H.value=!1)})):rt("",!0)]),_:1}),At(Ut,{name:"sidebar"},{default:kt(()=>[H.value?(T(),D("div",{key:0,class:"info-sidebar",role:"dialog","aria-modal":"true","aria-label":F(t)("pages.galaxyPhoto.info.title")},[d("div",ps,[d("button",{class:"sidebar-close",type:"button","aria-label":F(t)("app.close")||"Close",onClick:o[11]||(o[11]=g=>H.value=!1)}," × ",8,gs),d("h2",ys,B(F(t)("pages.galaxyPhoto.info.title")),1),d("div",_s,[o[29]||(o[29]=d("h3",null,"Data Source",-1)),d("p",null,B(F(t)("pages.galaxyPhoto.info.dataSource")),1)]),d("div",xs,[d("h3",null,B(z.value==="lupton"?"Lupton Composite":z.value==="composite"?"Raw Composite":z.value==="custom"?"Custom Composite":z.value==="volumetric"?"Volumetric Rendering":z.value==="nsa3d"?"NSA 3D Point Cloud":"Morphology 3D"),1),d("p",null,B(F(t)("pages.galaxyPhoto.info."+z.value)),1)])])],8,ms)):rt("",!0)]),_:1}),At(Ut,{name:"fade"},{default:kt(()=>[E.value.visible?(T(),D("div",{key:0,class:"simbad-tooltip",style:Qt(Ke.value)},[o[32]||(o[32]=d("div",{class:"tooltip-arrow"},null,-1)),d("div",bs,[F(c)?(T(),D("div",ws,[...o[30]||(o[30]=[d("div",{class:"mini-spinner"},null,-1),d("span",null,"Querying SIMBAD...",-1)])])):E.value.error?(T(),D("div",ks,[o[31]||(o[31]=d("span",{class:"error-icon"},"⚠",-1)),Bt(" "+B(E.value.error),1)])):E.value.objects.length===0?(T(),D("div",Cs," No objects found ")):(T(),D("div",Ms,[(T(!0),D(It,null,Nt(E.value.objects,g=>(T(),Mn(Sn(g.type==="Star"||g.type&&g.type.includes("*")?"router-link":"a"),Rn({key:g.name},{ref_for:!0},g.type==="Star"||g.type&&g.type.includes("*")?{to:`/star/${encodeURIComponent(g.name)}`}:{href:g.simbadUrl,target:"_blank",rel:"noopener noreferrer"},{class:"result-item result-link"}),{default:kt(()=>[d("span",Rs,B(g.name),1),d("span",Ss,B(g.type),1),g.type!=="Star"&&!(g.type&&g.type.includes("*"))?(T(),D("span",Bs,"↗")):rt("",!0)]),_:2},1040))),128))])),d("button",{class:"tooltip-close",onClick:o[12]||(o[12]=g=>E.value.visible=!1)},"×")])],4)):rt("",!0)]),_:1})],512)}}}),Ns=Yn(As,[["__scopeId","data-v-5bbb1716"]]);export{Ns as default};
