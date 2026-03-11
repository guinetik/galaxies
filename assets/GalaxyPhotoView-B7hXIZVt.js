var vn=Object.defineProperty;var mn=(a,t,e)=>t in a?vn(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var R=(a,t,e)=>mn(a,typeof t!="symbol"?t+"":t,e);import{I as G,d as pn,u as gn,G as Yt,A as yn,J as xn,c as U,a as u,k as Bt,t as A,e as O,l as dt,K as me,L as _n,n as Pt,f as ft,v as wn,m as pe,b as Ft,w as Et,T as zt,F as Ot,r as It,h as wt,g as B,M as bn,N as ge,C as kn,O as At,E as $t,j as Mn,o as D}from"./vue-vendor-CX9bXn0Y.js";import{u as Cn}from"./useGalaxyData-DnytBmRV.js";import{u as Rn}from"./useSimbadLookup-igBdj7X9.js";import{B as se,c as Z,C as Bn,V as An,W as Sn,O as Tn,P as Un,S as Dn,D as Pn,g as Fn,h as En,L as zn,i as On,j as ye,k as xe,l as In,M as Nn,a as Qt,A as Xt,b as qt,m as Vn,n as jt}from"./three-tDXMxKGb.js";import{G as kt,_ as Gn}from"./index-OjzUn31H.js";import{f as Ln,a as Hn}from"./coordinates-DJOk_Dvx.js";import"./sqljs-M9QnmiAb.js";function _e(a,t){const e=t>>>1;let n=0;for(let i=0;i<256;i++)if(n+=a[i],n>e)return i/255;return 1}function Ue(a,t){return a<=0?0:a>=1?1:a===t?.5:(t-1)*a/((2*t-1)*a-t)}function Wn(a,t){const i=_e(a,t),s=new Uint32Array(256);for(let l=0;l<256;l++){if(a[l]===0)continue;const r=Math.round(Math.abs(l/255-i)*255);s[Math.min(r,255)]+=a[l]}const h=_e(s,t),c=Math.max(0,Math.min(1,i+-2.8*1.4826*h)),f=i-c,v=f>0?Ue(f,.1):.5;return{c0:c,m:v}}function Yn(a){const{data:t,width:e,height:n}=a,i=e*n;for(let s=0;s<3;s++){const h=new Uint32Array(256);for(let l=0;l<i;l++)h[t[l*4+s]]++;const{c0:c,m:f}=Wn(h,i),v=new Uint8Array(256);for(let l=0;l<256;l++){let r=l/255;r=Math.max(0,(r-c)/(1-c)),r=Ue(r,f),v[l]=Math.round(r*255)}for(let l=0;l<i;l++){const r=l*4+s;t[r]=v[t[r]]}}}var H=Uint8Array,Mt=Uint16Array,$n=Int32Array,De=new H([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Pe=new H([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Qn=new H([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Fe=function(a,t){for(var e=new Mt(31),n=0;n<31;++n)e[n]=t+=1<<a[n-1];for(var i=new $n(e[30]),n=1;n<30;++n)for(var s=e[n];s<e[n+1];++s)i[s]=s-e[n]<<5|n;return{b:e,r:i}},Ee=Fe(De,2),ze=Ee.b,Xn=Ee.r;ze[28]=258,Xn[258]=28;var qn=Fe(Pe,0),jn=qn.b,re=new Mt(32768);for(var P=0;P<32768;++P){var vt=(P&43690)>>1|(P&21845)<<1;vt=(vt&52428)>>2|(vt&13107)<<2,vt=(vt&61680)>>4|(vt&3855)<<4,re[P]=((vt&65280)>>8|(vt&255)<<8)>>1}var Tt=(function(a,t,e){for(var n=a.length,i=0,s=new Mt(t);i<n;++i)a[i]&&++s[a[i]-1];var h=new Mt(t);for(i=1;i<t;++i)h[i]=h[i-1]+s[i-1]<<1;var c;if(e){c=new Mt(1<<t);var f=15-t;for(i=0;i<n;++i)if(a[i])for(var v=i<<4|a[i],l=t-a[i],r=h[a[i]-1]++<<l,d=r|(1<<l)-1;r<=d;++r)c[re[r]>>f]=v}else for(c=new Mt(n),i=0;i<n;++i)a[i]&&(c[i]=re[h[a[i]-1]++]>>15-a[i]);return c}),Ut=new H(288);for(var P=0;P<144;++P)Ut[P]=8;for(var P=144;P<256;++P)Ut[P]=9;for(var P=256;P<280;++P)Ut[P]=7;for(var P=280;P<288;++P)Ut[P]=8;var Oe=new H(32);for(var P=0;P<32;++P)Oe[P]=5;var Kn=Tt(Ut,9,1),Zn=Tt(Oe,5,1),Kt=function(a){for(var t=a[0],e=1;e<a.length;++e)a[e]>t&&(t=a[e]);return t},nt=function(a,t,e){var n=t/8|0;return(a[n]|a[n+1]<<8)>>(t&7)&e},Zt=function(a,t){var e=t/8|0;return(a[e]|a[e+1]<<8|a[e+2]<<16)>>(t&7)},Jn=function(a){return(a+7)/8|0},Vt=function(a,t,e){return(t==null||t<0)&&(t=0),(e==null||e>a.length)&&(e=a.length),new H(a.subarray(t,e))},ta=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Y=function(a,t,e){var n=new Error(t||ta[a]);if(n.code=a,Error.captureStackTrace&&Error.captureStackTrace(n,Y),!e)throw n;return n},Ie=function(a,t,e,n){var i=a.length,s=0;if(!i||t.f&&!t.l)return e||new H(0);var h=!e,c=h||t.i!=2,f=t.i;h&&(e=new H(i*3));var v=function(gt){var yt=e.length;if(gt>yt){var ut=new H(Math.max(yt*2,gt));ut.set(e),e=ut}},l=t.f||0,r=t.p||0,d=t.b||0,p=t.l,w=t.d,_=t.m,k=t.n,S=i*8;do{if(!p){l=nt(a,r,1);var g=nt(a,r+1,3);if(r+=3,g)if(g==1)p=Kn,w=Zn,_=9,k=5;else if(g==2){var T=nt(a,r,31)+257,I=nt(a,r+10,15)+4,$=T+nt(a,r+5,31)+1;r+=14;for(var V=new H($),E=new H(19),z=0;z<I;++z)E[Qn[z]]=nt(a,r+z*3,7);r+=I*3;for(var J=Kt(E),tt=(1<<J)-1,it=Tt(E,J,1),z=0;z<$;){var Q=it[nt(a,r,tt)];r+=Q&15;var b=Q>>4;if(b<16)V[z++]=b;else{var F=0,X=0;for(b==16?(X=3+nt(a,r,3),r+=2,F=V[z-1]):b==17?(X=3+nt(a,r,7),r+=3):b==18&&(X=11+nt(a,r,127),r+=7);X--;)V[z++]=F}}var ot=V.subarray(0,T),q=V.subarray(T);_=Kt(ot),k=Kt(q),p=Tt(ot,_,1),w=Tt(q,k,1)}else Y(1);else{var b=Jn(r)+4,M=a[b-4]|a[b-3]<<8,C=b+M;if(C>i){f&&Y(0);break}c&&v(d+M),e.set(a.subarray(b,C),d),t.b=d+=M,t.p=r=C*8,t.f=l;continue}if(r>S){f&&Y(0);break}}c&&v(d+131072);for(var L=(1<<_)-1,mt=(1<<k)-1,W=r;;W=r){var F=p[Zt(a,r)&L],j=F>>4;if(r+=F&15,r>S){f&&Y(0);break}if(F||Y(2),j<256)e[d++]=j;else if(j==256){W=r,p=null;break}else{var lt=j-254;if(j>264){var z=j-257,et=De[z];lt=nt(a,r,(1<<et)-1)+ze[z],r+=et}var ht=w[Zt(a,r)&mt],ct=ht>>4;ht||Y(3),r+=ht&15;var q=jn[ct];if(ct>3){var et=Pe[ct];q+=Zt(a,r)&(1<<et)-1,r+=et}if(r>S){f&&Y(0);break}c&&v(d+131072);var pt=d+lt;if(d<q){var bt=s-q,Ct=Math.min(q,pt);for(bt+d<0&&Y(3);d<Ct;++d)e[d]=n[bt+d]}for(;d<pt;++d)e[d]=e[d-q]}}t.l=p,t.p=W,t.b=d,t.f=l,p&&(l=1,t.m=_,t.d=w,t.n=k)}while(!l);return d!=e.length&&h?Vt(e,0,d):e.subarray(0,d)},ea=new H(0),Ne=function(a,t){return((a[0]&15)!=8||a[0]>>4>7||(a[0]<<8|a[1])%31)&&Y(6,"invalid zlib data"),(a[1]>>5&1)==+!t&&Y(6,"invalid zlib data: "+(a[1]&32?"need":"unexpected")+" dictionary"),(a[1]>>3&4)+2},Jt=(function(){function a(t,e){typeof t=="function"&&(e=t,t={}),this.ondata=e;var n=t&&t.dictionary&&t.dictionary.subarray(-32768);this.s={i:0,b:n?n.length:0},this.o=new H(32768),this.p=new H(0),n&&this.o.set(n)}return a.prototype.e=function(t){if(this.ondata||Y(5),this.d&&Y(4),!this.p.length)this.p=t;else if(t.length){var e=new H(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length),this.p=e}},a.prototype.c=function(t){this.s.i=+(this.d=t||!1);var e=this.s.b,n=Ie(this.p,this.s,this.o);this.ondata(Vt(n,e,this.s.b),this.d),this.o=Vt(n,this.s.b-32768),this.s.b=this.o.length,this.p=Vt(this.p,this.s.p/8|0),this.s.p&=7},a.prototype.push=function(t,e){this.e(t),this.c(e)},a})(),we=(function(){function a(t,e){Jt.call(this,t,e),this.v=t&&t.dictionary?2:1}return a.prototype.push=function(t,e){if(Jt.prototype.e.call(this,t),this.v){if(this.p.length<6&&!e)return;this.p=this.p.subarray(Ne(this.p,this.v-1)),this.v=0}e&&(this.p.length<4&&Y(6,"invalid zlib data"),this.p=this.p.subarray(0,-4)),Jt.prototype.c.call(this,e)},a})();function na(a,t){return Ie(a.subarray(Ne(a,t),-4),{i:2},t,t)}var aa=typeof TextDecoder<"u"&&new TextDecoder,ia=0;try{aa.decode(ea,{stream:!0}),ia=1}catch{}function be(a,t="utf8"){return new TextDecoder(t).decode(a)}const sa=new TextEncoder;function ra(a){return sa.encode(a)}const oa=1024*8,la=(()=>{const a=new Uint8Array(4),t=new Uint32Array(a.buffer);return!((t[0]=1)&a[0])})(),te={int8:globalThis.Int8Array,uint8:globalThis.Uint8Array,int16:globalThis.Int16Array,uint16:globalThis.Uint16Array,int32:globalThis.Int32Array,uint32:globalThis.Uint32Array,uint64:globalThis.BigUint64Array,int64:globalThis.BigInt64Array,float32:globalThis.Float32Array,float64:globalThis.Float64Array};class oe{constructor(t=oa,e={}){R(this,"buffer");R(this,"byteLength");R(this,"byteOffset");R(this,"length");R(this,"offset");R(this,"lastWrittenByte");R(this,"littleEndian");R(this,"_data");R(this,"_mark");R(this,"_marks");let n=!1;typeof t=="number"?t=new ArrayBuffer(t):(n=!0,this.lastWrittenByte=t.byteLength);const i=e.offset?e.offset>>>0:0,s=t.byteLength-i;let h=i;(ArrayBuffer.isView(t)||t instanceof oe)&&(t.byteLength!==t.buffer.byteLength&&(h=t.byteOffset+i),t=t.buffer),n?this.lastWrittenByte=s:this.lastWrittenByte=0,this.buffer=t,this.length=s,this.byteLength=s,this.byteOffset=h,this.offset=0,this.littleEndian=!0,this._data=new DataView(this.buffer,h,s),this._mark=0,this._marks=[]}available(t=1){return this.offset+t<=this.length}isLittleEndian(){return this.littleEndian}setLittleEndian(){return this.littleEndian=!0,this}isBigEndian(){return!this.littleEndian}setBigEndian(){return this.littleEndian=!1,this}skip(t=1){return this.offset+=t,this}back(t=1){return this.offset-=t,this}seek(t){return this.offset=t,this}mark(){return this._mark=this.offset,this}reset(){return this.offset=this._mark,this}pushMark(){return this._marks.push(this.offset),this}popMark(){const t=this._marks.pop();if(t===void 0)throw new Error("Mark stack empty");return this.seek(t),this}rewind(){return this.offset=0,this}ensureAvailable(t=1){if(!this.available(t)){const n=(this.offset+t)*2,i=new Uint8Array(n);i.set(new Uint8Array(this.buffer)),this.buffer=i.buffer,this.length=n,this.byteLength=n,this._data=new DataView(this.buffer)}return this}readBoolean(){return this.readUint8()!==0}readInt8(){return this._data.getInt8(this.offset++)}readUint8(){return this._data.getUint8(this.offset++)}readByte(){return this.readUint8()}readBytes(t=1){return this.readArray(t,"uint8")}readArray(t,e){const n=te[e].BYTES_PER_ELEMENT*t,i=this.byteOffset+this.offset,s=this.buffer.slice(i,i+n);if(this.littleEndian===la&&e!=="uint8"&&e!=="int8"){const c=new Uint8Array(this.buffer.slice(i,i+n));c.reverse();const f=new te[e](c.buffer);return this.offset+=n,f.reverse(),f}const h=new te[e](s);return this.offset+=n,h}readInt16(){const t=this._data.getInt16(this.offset,this.littleEndian);return this.offset+=2,t}readUint16(){const t=this._data.getUint16(this.offset,this.littleEndian);return this.offset+=2,t}readInt32(){const t=this._data.getInt32(this.offset,this.littleEndian);return this.offset+=4,t}readUint32(){const t=this._data.getUint32(this.offset,this.littleEndian);return this.offset+=4,t}readFloat32(){const t=this._data.getFloat32(this.offset,this.littleEndian);return this.offset+=4,t}readFloat64(){const t=this._data.getFloat64(this.offset,this.littleEndian);return this.offset+=8,t}readBigInt64(){const t=this._data.getBigInt64(this.offset,this.littleEndian);return this.offset+=8,t}readBigUint64(){const t=this._data.getBigUint64(this.offset,this.littleEndian);return this.offset+=8,t}readChar(){return String.fromCharCode(this.readInt8())}readChars(t=1){let e="";for(let n=0;n<t;n++)e+=this.readChar();return e}readUtf8(t=1){return be(this.readBytes(t))}decodeText(t=1,e="utf8"){return be(this.readBytes(t),e)}writeBoolean(t){return this.writeUint8(t?255:0),this}writeInt8(t){return this.ensureAvailable(1),this._data.setInt8(this.offset++,t),this._updateLastWrittenByte(),this}writeUint8(t){return this.ensureAvailable(1),this._data.setUint8(this.offset++,t),this._updateLastWrittenByte(),this}writeByte(t){return this.writeUint8(t)}writeBytes(t){this.ensureAvailable(t.length);for(let e=0;e<t.length;e++)this._data.setUint8(this.offset++,t[e]);return this._updateLastWrittenByte(),this}writeInt16(t){return this.ensureAvailable(2),this._data.setInt16(this.offset,t,this.littleEndian),this.offset+=2,this._updateLastWrittenByte(),this}writeUint16(t){return this.ensureAvailable(2),this._data.setUint16(this.offset,t,this.littleEndian),this.offset+=2,this._updateLastWrittenByte(),this}writeInt32(t){return this.ensureAvailable(4),this._data.setInt32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeUint32(t){return this.ensureAvailable(4),this._data.setUint32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeFloat32(t){return this.ensureAvailable(4),this._data.setFloat32(this.offset,t,this.littleEndian),this.offset+=4,this._updateLastWrittenByte(),this}writeFloat64(t){return this.ensureAvailable(8),this._data.setFloat64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeBigInt64(t){return this.ensureAvailable(8),this._data.setBigInt64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeBigUint64(t){return this.ensureAvailable(8),this._data.setBigUint64(this.offset,t,this.littleEndian),this.offset+=8,this._updateLastWrittenByte(),this}writeChar(t){return this.writeUint8(t.charCodeAt(0))}writeChars(t){for(let e=0;e<t.length;e++)this.writeUint8(t.charCodeAt(e));return this}writeUtf8(t){return this.writeBytes(ra(t))}toArray(){return new Uint8Array(this.buffer,this.byteOffset,this.lastWrittenByte)}getWrittenByteLength(){return this.lastWrittenByte-this.byteOffset}_updateLastWrittenByte(){this.offset>this.lastWrittenByte&&(this.lastWrittenByte=this.offset)}}const Ve=[];for(let a=0;a<256;a++){let t=a;for(let e=0;e<8;e++)t&1?t=3988292384^t>>>1:t=t>>>1;Ve[a]=t}const ke=4294967295;function ha(a,t,e){let n=a;for(let i=0;i<e;i++)n=Ve[(n^t[i])&255]^n>>>8;return n}function ca(a,t){return(ha(ke,a,t)^ke)>>>0}function Me(a,t,e){const n=a.readUint32(),i=ca(new Uint8Array(a.buffer,a.byteOffset+a.offset-t-4,t),t);if(i!==n)throw new Error(`CRC mismatch for chunk ${e}. Expected ${n}, found ${i}`)}function Ge(a,t,e){for(let n=0;n<e;n++)t[n]=a[n]}function Le(a,t,e,n){let i=0;for(;i<n;i++)t[i]=a[i];for(;i<e;i++)t[i]=a[i]+t[i-n]&255}function He(a,t,e,n){let i=0;if(e.length===0)for(;i<n;i++)t[i]=a[i];else for(;i<n;i++)t[i]=a[i]+e[i]&255}function We(a,t,e,n,i){let s=0;if(e.length===0){for(;s<i;s++)t[s]=a[s];for(;s<n;s++)t[s]=a[s]+(t[s-i]>>1)&255}else{for(;s<i;s++)t[s]=a[s]+(e[s]>>1)&255;for(;s<n;s++)t[s]=a[s]+(t[s-i]+e[s]>>1)&255}}function Ye(a,t,e,n,i){let s=0;if(e.length===0){for(;s<i;s++)t[s]=a[s];for(;s<n;s++)t[s]=a[s]+t[s-i]&255}else{for(;s<i;s++)t[s]=a[s]+e[s]&255;for(;s<n;s++)t[s]=a[s]+ua(t[s-i],e[s],e[s-i])&255}}function ua(a,t,e){const n=a+t-e,i=Math.abs(n-a),s=Math.abs(n-t),h=Math.abs(n-e);return i<=s&&i<=h?a:s<=h?t:e}function da(a,t,e,n,i,s){switch(a){case 0:Ge(t,e,i);break;case 1:Le(t,e,i,s);break;case 2:He(t,e,n,i);break;case 3:We(t,e,n,i,s);break;case 4:Ye(t,e,n,i,s);break;default:throw new Error(`Unsupported filter: ${a}`)}}const fa=new Uint16Array([255]),va=new Uint8Array(fa.buffer),ma=va[0]===255;function pa(a){const{data:t,width:e,height:n,channels:i,depth:s}=a,h=[{x:0,y:0,xStep:8,yStep:8},{x:4,y:0,xStep:8,yStep:8},{x:0,y:4,xStep:4,yStep:8},{x:2,y:0,xStep:4,yStep:4},{x:0,y:2,xStep:2,yStep:4},{x:1,y:0,xStep:2,yStep:2},{x:0,y:1,xStep:1,yStep:2}],c=Math.ceil(s/8)*i,f=new Uint8Array(n*e*c);let v=0;for(let l=0;l<7;l++){const r=h[l],d=Math.ceil((e-r.x)/r.xStep),p=Math.ceil((n-r.y)/r.yStep);if(d<=0||p<=0)continue;const w=d*c,_=new Uint8Array(w);for(let k=0;k<p;k++){const S=t[v++],g=t.subarray(v,v+w);v+=w;const b=new Uint8Array(w);da(S,g,b,_,w,c),_.set(b);for(let M=0;M<d;M++){const C=r.x+M*r.xStep,T=r.y+k*r.yStep;if(!(C>=e||T>=n))for(let I=0;I<c;I++)f[(T*e+C)*c+I]=b[M*c+I]}}}if(s===16){const l=new Uint16Array(f.buffer);if(ma)for(let r=0;r<l.length;r++)l[r]=ga(l[r]);return l}else return f}function ga(a){return(a&255)<<8|a>>8&255}const ya=new Uint16Array([255]),xa=new Uint8Array(ya.buffer),_a=xa[0]===255,wa=new Uint8Array(0);function Ce(a){const{data:t,width:e,height:n,channels:i,depth:s}=a,h=Math.ceil(s/8)*i,c=Math.ceil(s/8*i*e),f=new Uint8Array(n*c);let v=wa,l=0,r,d;for(let p=0;p<n;p++){switch(r=t.subarray(l+1,l+1+c),d=f.subarray(p*c,(p+1)*c),t[l]){case 0:Ge(r,d,c);break;case 1:Le(r,d,c,h);break;case 2:He(r,d,v,c);break;case 3:We(r,d,v,c,h);break;case 4:Ye(r,d,v,c,h);break;default:throw new Error(`Unsupported filter: ${t[l]}`)}v=d,l+=c+1}if(s===16){const p=new Uint16Array(f.buffer);if(_a)for(let w=0;w<p.length;w++)p[w]=ba(p[w]);return p}else return f}function ba(a){return(a&255)<<8|a>>8&255}const Gt=Uint8Array.of(137,80,78,71,13,10,26,10);function Re(a){if(!ka(a.readBytes(Gt.length)))throw new Error("wrong PNG signature")}function ka(a){if(a.length<Gt.length)return!1;for(let t=0;t<Gt.length;t++)if(a[t]!==Gt[t])return!1;return!0}const Ma="tEXt",Ca=0,$e=new TextDecoder("latin1");function Ra(a){if(Aa(a),a.length===0||a.length>79)throw new Error("keyword length must be between 1 and 79")}const Ba=/^[\u0000-\u00FF]*$/;function Aa(a){if(!Ba.test(a))throw new Error("invalid latin1 text")}function Sa(a,t,e){const n=Qe(t);a[n]=Ta(t,e-n.length-1)}function Qe(a){for(a.mark();a.readByte()!==Ca;);const t=a.offset;a.reset();const e=$e.decode(a.readBytes(t-a.offset-1));return a.skip(1),Ra(e),e}function Ta(a,t){return $e.decode(a.readBytes(t))}const K={UNKNOWN:-1,GREYSCALE:0,TRUECOLOUR:2,INDEXED_COLOUR:3,GREYSCALE_ALPHA:4,TRUECOLOUR_ALPHA:6},ee={UNKNOWN:-1,DEFLATE:0},Be={UNKNOWN:-1,ADAPTIVE:0},ne={UNKNOWN:-1,NO_INTERLACE:0,ADAM7:1},Nt={NONE:0,BACKGROUND:1,PREVIOUS:2},ae={SOURCE:0,OVER:1};class Ua extends oe{constructor(e,n={}){super(e);R(this,"_checkCrc");R(this,"_inflator");R(this,"_png");R(this,"_apng");R(this,"_end");R(this,"_hasPalette");R(this,"_palette");R(this,"_hasTransparency");R(this,"_transparency");R(this,"_compressionMethod");R(this,"_filterMethod");R(this,"_interlaceMethod");R(this,"_colorType");R(this,"_isAnimated");R(this,"_numberOfFrames");R(this,"_numberOfPlays");R(this,"_frames");R(this,"_writingDataChunks");R(this,"_chunks");R(this,"_inflatorResult");const{checkCrc:i=!1}=n;this._checkCrc=i,this._inflator=new we((s,h)=>{if(this._chunks.push(s),h){const c=this._chunks.reduce((v,l)=>v+l.length,0);this._inflatorResult=new Uint8Array(c);let f=0;for(const v of this._chunks)this._inflatorResult.set(v,f),f+=v.length;this._chunks=[]}}),this._chunks=[],this._png={width:-1,height:-1,channels:-1,data:new Uint8Array(0),depth:1,text:{}},this._apng={width:-1,height:-1,channels:-1,depth:1,numberOfFrames:1,numberOfPlays:0,text:{},frames:[]},this._end=!1,this._hasPalette=!1,this._palette=[],this._hasTransparency=!1,this._transparency=new Uint16Array(0),this._compressionMethod=ee.UNKNOWN,this._filterMethod=Be.UNKNOWN,this._interlaceMethod=ne.UNKNOWN,this._colorType=K.UNKNOWN,this._isAnimated=!1,this._numberOfFrames=1,this._numberOfPlays=0,this._frames=[],this._writingDataChunks=!1,this._inflatorResult=new Uint8Array(0),this.setBigEndian()}decode(){for(Re(this);!this._end;){const e=this.readUint32(),n=this.readChars(4);this.decodeChunk(e,n)}return this._inflator.push(new Uint8Array(0),!0),this.decodeImage(),this._png}decodeApng(){for(Re(this);!this._end;){const e=this.readUint32(),n=this.readChars(4);this.decodeApngChunk(e,n)}return this.decodeApngImage(),this._apng}decodeChunk(e,n){const i=this.offset;switch(n){case"IHDR":this.decodeIHDR();break;case"PLTE":this.decodePLTE(e);break;case"IDAT":this.decodeIDAT(e);break;case"IEND":this._end=!0;break;case"tRNS":this.decodetRNS(e);break;case"iCCP":this.decodeiCCP(e);break;case Ma:Sa(this._png.text,this,e);break;case"pHYs":this.decodepHYs();break;default:this.skip(e);break}if(this.offset-i!==e)throw new Error(`Length mismatch while decoding chunk ${n}`);this._checkCrc?Me(this,e+4,n):this.skip(4)}decodeApngChunk(e,n){const i=this.offset;switch(n!=="fdAT"&&n!=="IDAT"&&this._writingDataChunks&&this.pushDataToFrame(),n){case"acTL":this.decodeACTL();break;case"fcTL":this.decodeFCTL();break;case"fdAT":this.decodeFDAT(e);break;default:this.decodeChunk(e,n),this.offset=i+e;break}if(this.offset-i!==e)throw new Error(`Length mismatch while decoding chunk ${n}`);this._checkCrc?Me(this,e+4,n):this.skip(4)}decodeIHDR(){const e=this._png;e.width=this.readUint32(),e.height=this.readUint32(),e.depth=Da(this.readUint8());const n=this.readUint8();this._colorType=n;let i;switch(n){case K.GREYSCALE:i=1;break;case K.TRUECOLOUR:i=3;break;case K.INDEXED_COLOUR:i=1;break;case K.GREYSCALE_ALPHA:i=2;break;case K.TRUECOLOUR_ALPHA:i=4;break;case K.UNKNOWN:default:throw new Error(`Unknown color type: ${n}`)}if(this._png.channels=i,this._compressionMethod=this.readUint8(),this._compressionMethod!==ee.DEFLATE)throw new Error(`Unsupported compression method: ${this._compressionMethod}`);this._filterMethod=this.readUint8(),this._interlaceMethod=this.readUint8()}decodeACTL(){this._numberOfFrames=this.readUint32(),this._numberOfPlays=this.readUint32(),this._isAnimated=!0}decodeFCTL(){const e={sequenceNumber:this.readUint32(),width:this.readUint32(),height:this.readUint32(),xOffset:this.readUint32(),yOffset:this.readUint32(),delayNumber:this.readUint16(),delayDenominator:this.readUint16(),disposeOp:this.readUint8(),blendOp:this.readUint8(),data:new Uint8Array(0)};this._frames.push(e)}decodePLTE(e){if(e%3!==0)throw new RangeError(`PLTE field length must be a multiple of 3. Got ${e}`);const n=e/3;this._hasPalette=!0;const i=[];this._palette=i;for(let s=0;s<n;s++)i.push([this.readUint8(),this.readUint8(),this.readUint8()])}decodeIDAT(e){this._writingDataChunks=!0;const n=e,i=this.offset+this.byteOffset;try{this._inflator.push(new Uint8Array(this.buffer,i,n),!1)}catch(s){throw new Error("Error while decompressing the data:",{cause:s})}this.skip(e)}decodeFDAT(e){this._writingDataChunks=!0;let n=e,i=this.offset+this.byteOffset;i+=4,n-=4;try{this._inflator.push(new Uint8Array(this.buffer,i,n),!1)}catch(s){throw new Error("Error while decompressing the data:",{cause:s})}this.skip(e)}decodetRNS(e){switch(this._colorType){case K.GREYSCALE:case K.TRUECOLOUR:{if(e%2!==0)throw new RangeError(`tRNS chunk length must be a multiple of 2. Got ${e}`);if(e/2>this._png.width*this._png.height)throw new Error(`tRNS chunk contains more alpha values than there are pixels (${e/2} vs ${this._png.width*this._png.height})`);this._hasTransparency=!0,this._transparency=new Uint16Array(e/2);for(let n=0;n<e/2;n++)this._transparency[n]=this.readUint16();break}case K.INDEXED_COLOUR:{if(e>this._palette.length)throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${e} vs ${this._palette.length})`);let n=0;for(;n<e;n++){const i=this.readByte();this._palette[n].push(i)}for(;n<this._palette.length;n++)this._palette[n].push(255);break}case K.UNKNOWN:case K.GREYSCALE_ALPHA:case K.TRUECOLOUR_ALPHA:default:throw new Error(`tRNS chunk is not supported for color type ${this._colorType}`)}}decodeiCCP(e){const n=Qe(this),i=this.readUint8();if(i!==ee.DEFLATE)throw new Error(`Unsupported iCCP compression method: ${i}`);const s=this.readBytes(e-n.length-2);this._png.iccEmbeddedProfile={name:n,profile:na(s)}}decodepHYs(){const e=this.readUint32(),n=this.readUint32(),i=this.readByte();this._png.resolution={x:e,y:n,unit:i}}decodeApngImage(){this._apng.width=this._png.width,this._apng.height=this._png.height,this._apng.channels=this._png.channels,this._apng.depth=this._png.depth,this._apng.numberOfFrames=this._numberOfFrames,this._apng.numberOfPlays=this._numberOfPlays,this._apng.text=this._png.text,this._apng.resolution=this._png.resolution;for(let e=0;e<this._numberOfFrames;e++){const n={sequenceNumber:this._frames[e].sequenceNumber,delayNumber:this._frames[e].delayNumber,delayDenominator:this._frames[e].delayDenominator,data:this._apng.depth===8?new Uint8Array(this._apng.width*this._apng.height*this._apng.channels):new Uint16Array(this._apng.width*this._apng.height*this._apng.channels)},i=this._frames.at(e);if(i){if(i.data=Ce({data:i.data,width:i.width,height:i.height,channels:this._apng.channels,depth:this._apng.depth}),this._hasPalette&&(this._apng.palette=this._palette),this._hasTransparency&&(this._apng.transparency=this._transparency),e===0||i.xOffset===0&&i.yOffset===0&&i.width===this._png.width&&i.height===this._png.height)n.data=i.data;else{const s=this._apng.frames.at(e-1);this.disposeFrame(i,s,n),this.addFrameDataToCanvas(n,i)}this._apng.frames.push(n)}}return this._apng}disposeFrame(e,n,i){switch(e.disposeOp){case Nt.NONE:break;case Nt.BACKGROUND:for(let s=0;s<this._png.height;s++)for(let h=0;h<this._png.width;h++){const c=(s*e.width+h)*this._png.channels;for(let f=0;f<this._png.channels;f++)i.data[c+f]=0}break;case Nt.PREVIOUS:i.data.set(n.data);break;default:throw new Error("Unknown disposeOp")}}addFrameDataToCanvas(e,n){const i=1<<this._png.depth,s=(h,c)=>{const f=((h+n.yOffset)*this._png.width+n.xOffset+c)*this._png.channels,v=(h*n.width+c)*this._png.channels;return{index:f,frameIndex:v}};switch(n.blendOp){case ae.SOURCE:for(let h=0;h<n.height;h++)for(let c=0;c<n.width;c++){const{index:f,frameIndex:v}=s(h,c);for(let l=0;l<this._png.channels;l++)e.data[f+l]=n.data[v+l]}break;case ae.OVER:for(let h=0;h<n.height;h++)for(let c=0;c<n.width;c++){const{index:f,frameIndex:v}=s(h,c);for(let l=0;l<this._png.channels;l++){const r=n.data[v+this._png.channels-1]/i,d=l%(this._png.channels-1)===0?1:n.data[v+l],p=Math.floor(r*d+(1-r)*e.data[f+l]);e.data[f+l]+=p}}break;default:throw new Error("Unknown blendOp")}}decodeImage(){const e=this._inflatorResult;if(this._filterMethod!==Be.ADAPTIVE)throw new Error(`Filter method ${this._filterMethod} not supported`);if(this._interlaceMethod===ne.NO_INTERLACE)this._png.data=Ce({data:e,width:this._png.width,height:this._png.height,channels:this._png.channels,depth:this._png.depth});else if(this._interlaceMethod===ne.ADAM7)this._png.data=pa({data:e,width:this._png.width,height:this._png.height,channels:this._png.channels,depth:this._png.depth});else throw new Error(`Interlace method ${this._interlaceMethod} not supported`);this._hasPalette&&(this._png.palette=this._palette),this._hasTransparency&&(this._png.transparency=this._transparency)}pushDataToFrame(){this._inflator.push(new Uint8Array(0),!0);const e=this._inflatorResult,n=this._frames.at(-1);n?n.data=e:this._frames.push({sequenceNumber:0,width:this._png.width,height:this._png.height,xOffset:0,yOffset:0,delayNumber:0,delayDenominator:0,disposeOp:Nt.NONE,blendOp:ae.SOURCE,data:e}),this._inflator=new we((i,s)=>{if(this._chunks.push(i),s){const h=this._chunks.reduce((f,v)=>f+v.length,0);this._inflatorResult=new Uint8Array(h);let c=0;for(const f of this._chunks)this._inflatorResult.set(f,c),c+=f.length;this._chunks=[]}}),this._chunks=[],this._writingDataChunks=!1}}function Da(a){if(a!==1&&a!==2&&a!==4&&a!==8&&a!==16)throw new Error(`invalid bit depth: ${a}`);return a}function Pa(a,t){return new Ua(a,t).decode()}const Ae=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Fa=`precision highp float;

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
`,Ea=`precision highp float;

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
`,za=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Oa=`precision highp float;

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
`,Ia=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Na=`precision highp float;

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
  // Mipmap LOD bias 3.0 → GPU averages ~8×8 texel blocks
  // Perfectly smooth, no sample dots, single lookup per band
  // ═══════════════════════════════════════

  float dustRaw = max(
    (denorm(texture2D(uBand_z, vUV, 2.0).r + dither, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 2.0).r + dither, uRange_i)) * 0.5,
    0.0
  );
  float starRaw = max(
    (denorm(texture2D(uBand_r, vUV, 2.0).r + dither, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 2.0).r + dither, uRange_g)) * 0.5,
    0.0
  );
  float gasRaw = max(
    (denorm(texture2D(uBand_u, vUV, 2.0).r + dither, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 2.0).r + dither, uRange_nuv)) * 0.5,
    0.0
  );

  float totalRaw = (dustRaw + starRaw + gasRaw) / 3.0;

  // Asinh stretch to 0–1
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

  // Per-pixel spectral fractions (for nebula color tinting)
  float totalS = sDust + sStar + sGas + 0.001;
  float dustFrac = sDust / totalS;
  float gasFrac  = sGas  / totalS;
  float starFrac = sStar / totalS;

  // ═══════════════════════════════════════
  // PHASE 2: Layered smoke clouds
  // Stack from faintest (outer) → brightest (core)
  // Each layer: iso-brightness contour shape + FBM smoke texture
  // Noise warps the density field itself so zone edges become cloudy wisps
  // ═══════════════════════════════════════

  vec3 col = vec3(0.0);

  // Maelstrom: rotate noise coords around galaxy center per layer
  // Outer layers drift slowly, inner layers spin faster
  vec2 center = vec2(0.5);
  vec2 pc = vUV - center;

  // ── Layer 4: outer nebula haze (domain-warped for dramatic wisps) ──
  vec2 uv4 = rot2(pc, uTime * 0.04) + center;
  vec2 warp4 = vec2(
    fbm(uv4 * 2.5 + vec2(uTime * 0.005, 0.0)),
    fbm(uv4 * 2.5 + vec2(0.0, uTime * 0.004) + 5.2)
  );
  float n4 = fbm(uv4 * 3.0 + warp4 * 1.5 + vec2(uTime * 0.006, uTime * 0.004));
  // Warp the density field with noise — breaks up pixelated texture boundaries
  float d4 = mix(sTotal, n4, 0.35);
  float mask4 = smoothstep(0.0, 0.20, d4);
  float smoke4 = n4 * 0.6 + 0.4;
  vec3 tint4 = mix(
    vec3(0.14, 0.07, 0.25),    // infra: deep wine
    vec3(0.05, 0.10, 0.30),    // astral: deep ocean blue
    uTheme
  );
  tint4 = mix(tint4, mix(vec3(0.18, 0.04, 0.22), vec3(0.08, 0.20, 0.35), uTheme), n4);
  col += tint4 * mask4 * smoke4 * 0.55;

  // ── Layer 3: mid nebula — saturated color clouds ──
  vec2 uv3 = rot2(pc, uTime * 0.06) + center;
  vec2 warp3 = vec2(
    fbm(uv3 * 4.0 + vec2(-uTime * 0.008, 0.0) + 3.1),
    fbm(uv3 * 4.0 + vec2(0.0, uTime * 0.006) + 7.4)
  );
  float n3 = fbm(uv3 * 5.5 + warp3 * 1.2 + vec2(-uTime * 0.01, uTime * 0.007));
  float d3 = mix(sTotal, n3, 0.30);
  float mask3 = smoothstep(0.02, 0.30, d3);
  float smoke3 = n3 * 0.5 + 0.5;
  vec3 dustTint3 = mix(vec3(0.70, 0.25, 0.05), vec3(0.20, 0.45, 0.80), uTheme);
  vec3 gasTint3  = mix(vec3(0.08, 0.32, 0.75), vec3(0.25, 0.55, 0.90), uTheme);
  vec3 starTint3 = mix(vec3(0.60, 0.50, 0.32), vec3(0.50, 0.65, 0.95), uTheme);
  vec3 tint3 = dustTint3 * dustFrac + gasTint3 * gasFrac + starTint3 * starFrac;
  col += tint3 * mask3 * smoke3 * 0.65;

  // ── Dark absorption lanes ──
  vec2 uvDark = rot2(pc, uTime * 0.05) + center;
  float darkLane = fbm(uvDark * 6.0 + vec2(uTime * 0.004, -uTime * 0.003));
  float darkMask = smoothstep(0.05, 0.40, sTotal);
  col *= 1.0 - smoothstep(0.40, 0.7, darkLane) * darkMask * 0.4;

  // ── Layer 2: inner — clearly brighter, shifting toward white ──
  vec2 uv2 = rot2(pc, uTime * 0.09) + center;
  float n2 = fbm(uv2 * 8.0 + vec2(uTime * 0.012, -uTime * 0.009));
  float d2 = mix(sTotal, n2, 0.25);
  float mask2 = smoothstep(0.08, 0.50, d2);
  float smoke2 = n2 * 0.2 + 0.8;
  vec3 dustTint2 = mix(vec3(0.90, 0.65, 0.30), vec3(0.55, 0.70, 0.95), uTheme);
  vec3 gasTint2  = mix(vec3(0.80, 0.70, 0.40), vec3(0.60, 0.75, 1.0), uTheme);
  vec3 starTint2 = mix(vec3(0.95, 0.85, 0.60), vec3(0.75, 0.85, 1.0), uTheme);
  vec3 tint2 = dustTint2 * dustFrac + gasTint2 * gasFrac + starTint2 * starFrac;
  col += tint2 * mask2 * smoke2 * 0.6;

  // ── Layer 1: core — blazing white hot (replaces, not adds) ──
  vec2 uv1 = rot2(pc, uTime * 0.12) + center;
  float n1 = fbm(uv1 * 4.0 + vec2(uTime * 0.008, uTime * 0.006));
  float d1 = mix(sTotal, n1, 0.18);
  float mask1 = smoothstep(0.15, 0.55, d1);
  // Core tint shifts subtly with spectral content
  vec3 coreBase = mix(
    vec3(1.0, 0.92, 0.80),     // infra: warm gold-white
    vec3(0.82, 0.85, 1.0),     // astral: cool blue-white
    uTheme
  );
  vec3 coreAccent = mix(
    vec3(1.0, 0.80, 0.60),     // infra: amber highlight
    vec3(0.70, 0.80, 1.0),     // astral: ice blue highlight
    uTheme
  );
  vec3 tint1 = mix(coreBase, coreAccent, gasFrac * 0.5 + n1 * 0.3);
  float pulse = sin(uTime * 0.5) * 0.06 + 1.0;
  col = mix(col, tint1 * pulse, mask1);

  // ═══════════════════════════════════════
  // PHASE 3: Data-driven star detection & twinkle
  // Sharp samples vs blurred background → real star locations
  // ═══════════════════════════════════════

  // Sharp (unblurred) samples to find point sources
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

  // Twinkle animation — two noise layers for richer sparkle
  float twinkle = valueNoise(vUV * 400.0 + vec2(uTime * 3.0, uTime * 2.0));
  float twinkle2 = valueNoise(vUV * 150.0 + vec2(-uTime * 1.5, uTime * 2.5));
  twinkle = twinkle * twinkle * twinkle2;
  col *= mix(1.0, 0.3 + twinkle * 2.0, starness);

  // Additive star glow — use actual RGB band data for rainbow colors
  // Map SDSS bands to RGB: r→R, g→G, u→B for natural color variation
  float r_star = stretch(r_sharp, m, uQ, uAlpha) * 1.5;
  float g_star = stretch(g_sharp, m, uQ, uAlpha) * 1.5;
  float u_star = stretch(max(denorm(texture2D(uBand_u, vUV).r + dither, uRange_u), 0.0), m, uQ, uAlpha) * 1.5;
  vec3 starCol = vec3(r_star, g_star, u_star);
  // Fallback to cool white if no data
  starCol = mix(mix(vec3(1.0, 0.95, 0.88), vec3(0.88, 0.92, 1.0), uTheme), starCol, 0.85);
  col += starCol * starness * (twinkle * 0.5 + 0.2);

  // ═══════════════════════════════════════
  // PHASE 4: Cinematic color grading
  // ═══════════════════════════════════════

  // Lifted blacks
  vec3 blackFloor = mix(
    vec3(0.010, 0.007, 0.018),
    vec3(0.005, 0.008, 0.025),
    uTheme
  );
  col = max(col, blackFloor);

  // Gentle S-curve (preserve cloud gradients)
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.45);

  // Warm-cool split toning
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.25, uTheme);
  float coolW = mix(0.3, 1.0, uTheme);
  col += vec3(0.012, 0.006, -0.012) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.006, 0.0, 0.020) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Vignette
  float vig = 1.0 - smoothstep(0.5, 1.4, length(vUV - 0.5) * 1.3);
  col *= mix(0.8, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
`,Va=`precision highp float;

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
`,Ga=`precision highp float;

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
`,Xe=`precision highp float;

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
`,qe=`precision highp float;

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
`;function St(a){return a==="nsa3d"||a==="nsamorphology"?"orbit":"image-plane"}function La(a,t,e){return{yaw:a.yaw-t*.008,pitch:a.pitch+e*.006}}function Ha(a,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(a,t)/500)),intensityThreshold:.003,depthScale:.35,sizeRange:[1.5,8.5],seed:e}}function Wa(a,t){const e=[],n=Math.max(1,Math.floor(t.sampleStep)),[i,s]=t.sizeRange,h=Math.max(1,a.width-1),c=Math.max(1,a.height-1);for(let f=0;f<a.height;f+=n)for(let v=0;v<a.width;v+=n){const l=f*a.width+v,r=Math.sqrt(rt(a.bands.u[l]??0)),d=Math.sqrt(rt(a.bands.g[l]??0)),p=Math.sqrt(rt(a.bands.r[l]??0)),w=Math.sqrt(rt(a.bands.i[l]??0)),_=Math.sqrt(rt(a.bands.z[l]??0)),k=Math.sqrt(rt(a.bands.nuv[l]??0)),S=(w+_)*.5,g=(d+p)*.5,b=(r+k)*.5,M=S*.25+g*.4+b*.35;if(M<t.intensityThreshold)continue;const C=b-S,T=(Se(v,f,t.seed)-.5)*2,I=(Se(v+137,f+251,t.seed)-.5)*2,V=(T*.7+I*.3+C*.25)*t.depthScale,E=a.width===1?0:v/h-.5,z=a.height===1?0:.5-f/c,J=$a(i,s,rt(M)),tt=Ya(r,d,p,w,_,k);e.push({x:E,y:z,z:V,color:tt,size:J,intensity:M})}return{points:e}}function Ya(a,t,e,n,i,s){const h=a+t+e+n+i+s+.001,c=s/h,f=a/h,v=t/h,l=e/h,r=n/h,d=i/h,p=rt(c*.45+f*.15+v*.1+l*1+r*.9+d*.7),w=rt(c*.15+f*.2+v*.95+l*.4+r*.12+d*.05),_=rt(c*1+f*.95+v*.5+l*.08+r*.1+d*.15);return[p,w,_]}function Se(a,t,e){const n=Math.sin(a*127.1+t*311.7+e*74.7)*43758.5453123;return n-Math.floor(n)}function rt(a){return Math.max(0,Math.min(1,a))}function $a(a,t,e){return a+(t-a)*e}function Qa(a,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(a,t)/550)),intensityThreshold:.003,depthScale:.6,sizeRange:[1.5,8.5],seed:e}}function Xa(a,t){const e=[],n=Math.max(1,Math.floor(t.sampleStep)),[i,s]=t.sizeRange,h=Math.max(1,a.width-1),c=Math.max(1,a.height-1),{field:f,w:v,h:l}=qa(a,n),r=Math.max(1,Math.min(3,Math.floor(Math.min(v,l)/20)));for(let d=0;d<a.height;d+=n)for(let p=0;p<a.width;p+=n){const w=d*a.width+p,_=Math.sqrt(at(a.bands.u[w]??0)),k=Math.sqrt(at(a.bands.g[w]??0)),S=Math.sqrt(at(a.bands.r[w]??0)),g=Math.sqrt(at(a.bands.i[w]??0)),b=Math.sqrt(at(a.bands.z[w]??0)),M=Math.sqrt(at(a.bands.nuv[w]??0)),C=(g+b)*.5,T=(k+S)*.5,I=(_+M)*.5,$=C*.25+T*.4+I*.35;if($<t.intensityThreshold)continue;const V=Math.floor(p/n),E=Math.floor(d/n),{F:z}=ja(f,v,l,V,E,r),J=(Za(p,d,t.seed)-.5)*2,tt=1/(1+z*9),it=J*tt*t.depthScale,Q=a.width===1?0:p/h-.5,F=a.height===1?0:.5-d/c,X=Ja(i,s,at($)),ot=Ka(_,k,S,g,b,M);e.push({x:Q,y:F,z:it,color:ot,size:X,intensity:$,filamentarity:z})}return{points:e}}function qa(a,t){const e=Math.ceil(a.width/t),n=Math.ceil(a.height/t),i=new Float32Array(e*n);for(let s=0;s<n;s++)for(let h=0;h<e;h++){const c=Math.min(s*t,a.height-1),f=Math.min(h*t,a.width-1),v=c*a.width+f;i[s*e+h]=Math.sqrt(at(a.bands.i[v]??0))}return{field:i,w:e,h:n}}function ja(a,t,e,n,i,s){let h=0,c=0,f=0;for(let k=-s;k<=s;k++)for(let S=-s;S<=s;S++){const g=Math.max(0,Math.min(t-1,n+S)),b=Math.max(0,Math.min(e-1,i+k)),M=Math.max(0,g-1),C=Math.min(t-1,g+1),T=Math.max(0,b-1),I=Math.min(e-1,b+1),$=a[b*t+C]-a[b*t+M],V=a[I*t+g]-a[T*t+g];h+=$*$,c+=$*V,f+=V*V}const v=h+f,l=h*f-c*c,r=Math.sqrt(Math.max(0,v*v-4*l)),d=(v+r)*.5,p=(v-r)*.5,w=v>1e-4?(d-p)/(d+p):0,_=Math.atan2(2*c,h-f)*.5;return{F:w,angle:_}}function Ka(a,t,e,n,i,s){const h=a+t+e+n+i+s+.001,c=s/h,f=a/h,v=t/h,l=e/h,r=n/h,d=i/h,p=at(c*.45+f*.15+v*.1+l*1+r*.9+d*.7),w=at(c*.15+f*.2+v*.95+l*.4+r*.12+d*.05),_=at(c*1+f*.95+v*.5+l*.08+r*.1+d*.15);return[p,w,_]}function Za(a,t,e){const n=Math.sin(a*127.1+t*311.7+e*74.7)*43758.5453123;return n-Math.floor(n)}function at(a){return Math.max(0,Math.min(1,a))}function Ja(a,t,e){return a+(t-a)*e}const ti=a=>Math.pow(a,.5);function ei(a,t,e,n){const{layerCount:i,zDepthScale:s,opacityCurve:h=ti}=n,c=[],f=255/i/2;let v=!1;for(let l=0;l<a.length;l+=4)if(a[l]>0){v=!0;break}for(let l=0;l<i;l++){const r=l/(i-1),d=Math.round(r*255),p=[];for(let w=0;w<e;w++)for(let _=0;_<t;_++){const k=(w*t+_)*4,S=a[k];if(Math.abs(S-d)<=f){const g=_/t*2-1,b=w/e*2-1,M=-(r*s);p.push(g,b,M)}}if(p.length>0||!v){const w=new se;w.setAttribute("position",new Z(new Float32Array(p),3));const _=h(r);c.push({brightness:r,opacity:_,geometry:w,zDepth:-r*s})}}return c}function Te(a){if(a.length===0)return .001;const t=a.reduce((e,n)=>{const i=Array.isArray(n)?n[0]:n.x,s=Array.isArray(n)?n[1]:n.y;return e+Math.max(s-i,0)},0);return Math.max(t/a.length*.02,.001)}function Lt(a,t){return t==="nsa3d"?{Q:5,alpha:.5,sensitivity:1}:t==="nsamorphology"?{Q:5,alpha:.503,sensitivity:1}:t==="composite"?{Q:1,alpha:1,sensitivity:1}:{Q:t==="custom"?20:10,alpha:.5,sensitivity:1}}const ie={lupton:{vert:Ae,frag:Fa},composite:{vert:Ae,frag:Ea},custom:{vert:za,frag:Oa},volumetric:{vert:Ia,frag:Na},nsamorphology:{vert:Xe,frag:qe}};class ni{constructor(t){this.planeMaterial=null,this.pointMaterial=null,this.morphMaterial=null,this.mesh=null,this.pointCloud=null,this.morphCloud=null,this.densityMeshes=[],this.densityMaterials=[],this.textures=[],this.animationId=null,this.bandData={},this.currentTheme="astral",this.currentShader="lupton",this.width=1,this.height=1,this.clock=new Bn,this.autoParams={Q:10,alpha:.5,sensitivity:1},this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0,this.lerpSpeed=.15,this.friction=.92,this.velThreshold=1e-4,this.orbitYaw=0,this.orbitPitch=0,this.orbitRadius=2.5,this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=2.5,this.minOrbitRadius=1.1,this.maxOrbitRadius=5,this.orbitLerpSpeed=.12,this.orbitTarget=G(new An(0,0,0)),this.renderer=G(new Sn({canvas:t,antialias:!1,alpha:!1})),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.orthographicCamera=G(new Tn(-1,1,1,-1,0,100)),this.orthographicCamera.position.z=10,this.perspectiveCamera=G(new Un(48,1,.01,100)),this.perspectiveCamera.position.set(0,0,2.5),this.activeCamera=this.orthographicCamera,this.scene=G(new Dn)}async load(t,e){var r,d;const n=`${kt}/${t}/`,i=["i","r","g"];e.bands.includes("u")&&i.push("u"),e.bands.includes("z")&&i.push("z"),e.bands.includes("nuv")&&i.push("nuv");const s=await Promise.all(i.map(async p=>{const _=await(await fetch(`${n}${p}.png`)).arrayBuffer(),k=Pa(new Uint8Array(_)),S=k.depth===16?65535:255,g=new Float32Array(k.width*k.height),b=k.data,M=k.channels;for(let T=0;T<g.length;T++)g[T]=b[T*M]/S;const C=G(new Pn(g,k.width,k.height,Fn,En));return C.generateMipmaps=!0,C.minFilter=zn,C.magFilter=On,C.wrapS=ye,C.wrapT=ye,C.needsUpdate=!0,{tex:C,floats:g,width:k.width,height:k.height}}));i.forEach((p,w)=>{const{tex:_,floats:k,width:S,height:g}=s[w];this.textures.push(_),this.bandData[p]={tex:_,range:new xe(e.data_ranges[p][0],e.data_ranges[p][1]),raw:k,width:S,height:g}});const h=this.bandData.g?this.bandData.g.range.y-this.bandData.g.range.x:1;for(const p of["u","z","nuv"]){const w=this.bandData[p];if(!w)continue;const _=w.range.y-w.range.x;_<h*.01&&(console.warn(`[NSA] Discarding ${p}-band: dynamic range ${_.toFixed(4)} too narrow (g-band: ${h.toFixed(4)})`),delete this.bandData[p])}const c=((r=this.renderer.domElement.parentElement)==null?void 0:r.clientWidth)||window.innerWidth,f=((d=this.renderer.domElement.parentElement)==null?void 0:d.clientHeight)||window.innerHeight*.6,v=this.bandData;this.planeMaterial=G(this.createPlaneMaterial(v,c,f)),this.pointMaterial=G(this.createPointMaterial()),this.morphMaterial=G(this.createMorphMaterial());const l=G(new In(2,2));this.mesh=G(new Nn(l,this.planeMaterial)),this.scene.add(this.mesh),this.pointCloud=G(this.createPointCloudObject(t)),this.pointCloud.visible=!1,this.scene.add(this.pointCloud),this.morphCloud=G(this.createMorphCloudObject(t)),this.morphCloud.visible=!1,this.scene.add(this.morphCloud),this.resize(c,f),this.applyCurrentShaderMode(),this.setTheme(this.currentTheme),this.autoParams=Lt(e,this.currentShader),this.startAnimation()}createPlaneMaterial(t,e,n){var s,h,c,f,v,l,r,d;const i=[t.i.range,t.r.range,t.g.range];return new Qt({uniforms:{uBandR:{value:t.i.tex},uBandG:{value:t.r.tex},uBandB:{value:t.g.tex},uAlpha:{value:.014},uBrightness:{value:.5},uQ:{value:20},uStretch:{value:Te(i)},uSensitivity:{value:.88},uRangeR:{value:t.i.range},uRangeG:{value:t.r.range},uRangeB:{value:t.g.range},uGrayscale:{value:0},uTheme:{value:1},uBand_u:{value:((s=t.u)==null?void 0:s.tex)??t.g.tex},uBand_g:{value:t.g.tex},uBand_r:{value:t.r.tex},uBand_i:{value:t.i.tex},uBand_z:{value:((h=t.z)==null?void 0:h.tex)??t.i.tex},uBand_nuv:{value:((c=t.nuv)==null?void 0:c.tex)??((f=t.u)==null?void 0:f.tex)??t.g.tex},uRange_u:{value:((v=t.u)==null?void 0:v.range)??t.g.range},uRange_g:{value:t.g.range},uRange_r:{value:t.r.range},uRange_i:{value:t.i.range},uRange_z:{value:((l=t.z)==null?void 0:l.range)??t.i.range},uRange_nuv:{value:((r=t.nuv)==null?void 0:r.range)??((d=t.u)==null?void 0:d.range)??t.g.range},uHas_u:{value:t.u?1:0},uHas_g:{value:t.g?1:0},uHas_r:{value:t.r?1:0},uHas_i:{value:t.i?1:0},uHas_z:{value:t.z?1:0},uHas_nuv:{value:t.nuv?1:0},uTime:{value:0},uResolution:{value:new xe(e*this.renderer.getPixelRatio(),n*this.renderer.getPixelRatio())}},vertexShader:ie.lupton.vert,fragmentShader:ie.lupton.frag})}createPointMaterial(){return new Qt({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:Va,fragmentShader:Ga,transparent:!0,depthWrite:!1,blending:Xt})}createMorphMaterial(){return new Qt({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:Xe,fragmentShader:qe,transparent:!0,depthWrite:!1,blending:Xt})}createPointCloudObject(t){const e=this.extractPointCloudBands(),n=Wa(e,Ha(e.width,e.height,t)),i=n.points.length,s=new Float32Array(i*3),h=new Float32Array(i*3),c=new Float32Array(i),f=new Float32Array(i);let v=1;for(let r=0;r<i;r+=1){const d=n.points[r];s[r*3]=d.x,s[r*3+1]=d.y,s[r*3+2]=d.z,h[r*3]=d.color[0],h[r*3+1]=d.color[1],h[r*3+2]=d.color[2],c[r]=d.size,f[r]=d.intensity,v=Math.max(v,Math.sqrt(d.x*d.x+d.y*d.y+d.z*d.z))}const l=G(new se);return l.setAttribute("position",new Z(s,3)),l.setAttribute("aPosition",new Z(s,3)),l.setAttribute("color",new Z(h,3)),l.setAttribute("aSize",new Z(c,1)),l.setAttribute("aIntensity",new Z(f,1)),l.computeBoundingSphere(),this.minOrbitRadius=Math.max(.15,v*.2),this.maxOrbitRadius=Math.max(4.5,v*5),this.orbitRadius=Math.max(this.minOrbitRadius*1.4,v*1.3),this.targetOrbitRadius=this.orbitRadius,this.perspectiveCamera.near=.01,this.perspectiveCamera.far=this.maxOrbitRadius*4,this.perspectiveCamera.updateProjectionMatrix(),new qt(l,this.pointMaterial??void 0)}createMorphCloudObject(t){const e=this.extractPointCloudBands(),n=Xa(e,Qa(e.width,e.height,t)),i=n.points.length,s=new Float32Array(i*3),h=new Float32Array(i*3),c=new Float32Array(i),f=new Float32Array(i),v=new Float32Array(i);for(let r=0;r<i;r+=1){const d=n.points[r];s[r*3]=d.x,s[r*3+1]=d.y,s[r*3+2]=d.z,h[r*3]=d.color[0],h[r*3+1]=d.color[1],h[r*3+2]=d.color[2],c[r]=d.size,f[r]=d.intensity,v[r]=d.filamentarity}const l=G(new se);return l.setAttribute("position",new Z(s,3)),l.setAttribute("aPosition",new Z(s,3)),l.setAttribute("color",new Z(h,3)),l.setAttribute("aSize",new Z(c,1)),l.setAttribute("aIntensity",new Z(f,1)),l.setAttribute("aFilamentarity",new Z(v,1)),l.computeBoundingSphere(),new qt(l,this.morphMaterial??void 0)}extractPointCloudBands(){const t=i=>this.bandData[i]?i:i==="u"?"g":i==="z"?"i":this.bandData.u?"u":"g",{width:e,height:n}=this.bandData.i;return{width:e,height:n,bands:{u:this.extractSingleBand(t("u")),g:this.extractSingleBand(t("g")),r:this.extractSingleBand(t("r")),i:this.extractSingleBand(t("i")),z:this.extractSingleBand(t("z")),nuv:this.extractSingleBand(t("nuv"))}}}extractSingleBand(t){const e=this.bandData[t],n=e.raw,i=e.range,s=i.x,h=i.y-i.x,c=new Float32Array(n.length);for(let v=0;v<n.length;v++){const l=n[v]*h+s;c[v]=Math.max(l,0)}let f=0;for(let v=0;v<c.length;v++)c[v]>f&&(f=c[v]);if(f>0)for(let v=0;v<c.length;v++)c[v]/=f;return c}extractImageData(t){const e=this.bandData[t],n=e.raw,i=e.width,s=e.height,h=new Uint8ClampedArray(n.length*4);for(let c=0;c<n.length;c++){const f=Math.round(n[c]*255);h[c*4]=f,h[c*4+1]=f,h[c*4+2]=f,h[c*4+3]=255}return{data:h,width:i,height:s}}createDensityMeshes(){this.disposeDensityMeshes();const{data:t,width:e,height:n}=this.extractImageData("i");ei(t,e,n,{layerCount:15,zDepthScale:1}).forEach(h=>{const c=G(new Vn({color:16777215,size:.015,opacity:h.opacity,transparent:!0,depthWrite:!1,blending:Xt,sizeAttenuation:!0})),f=G(new qt(h.geometry,c));f.position.z=h.zDepth,this.scene.add(f),this.densityMeshes.push(f),this.densityMaterials.push(c)})}disposeDensityMeshes(){for(const t of this.densityMeshes)this.scene.remove(t),t.geometry&&t.geometry.dispose();for(const t of this.densityMaterials)t.dispose();this.densityMeshes=[],this.densityMaterials=[]}applyCurrentShaderMode(){const e=St(this.currentShader)==="orbit";if(this.activeCamera=e?this.perspectiveCamera:this.orthographicCamera,this.mesh&&(this.mesh.visible=!e),this.pointCloud&&(this.pointCloud.visible=this.currentShader==="nsa3d"),this.morphCloud&&(this.morphCloud.visible=this.currentShader==="nsamorphology"),!e&&this.planeMaterial){const n=ie[this.currentShader];this.planeMaterial.vertexShader=n.vert,this.planeMaterial.fragmentShader=n.frag,this.planeMaterial.needsUpdate=!0}}startAnimation(){const t=()=>{const e=this.clock.getElapsedTime();if(this.planeMaterial&&(this.planeMaterial.uniforms.uTime.value=e),this.pointMaterial&&(this.pointMaterial.uniforms.uTime.value=e),this.morphMaterial&&(this.morphMaterial.uniforms.uTime.value=e),St(this.currentShader)==="image-plane"){Math.abs(this.velX)>this.velThreshold||Math.abs(this.velY)>this.velThreshold?(this.targetX+=this.velX,this.targetY+=this.velY,this.velX*=this.friction,this.velY*=this.friction):(this.velX=0,this.velY=0);const n=Math.max(0,1-1/this.targetZoom);this.targetX=Math.max(-n,Math.min(n,this.targetX)),this.targetY=Math.max(-n,Math.min(n,this.targetY));const i=this.lerpSpeed;this.orthographicCamera.zoom+=(this.targetZoom-this.orthographicCamera.zoom)*i,this.orthographicCamera.position.x+=(this.targetX-this.orthographicCamera.position.x)*i,this.orthographicCamera.position.y+=(this.targetY-this.orthographicCamera.position.y)*i,this.orthographicCamera.updateProjectionMatrix()}else this.updateOrbitCamera();this.render(),this.animationId=requestAnimationFrame(t)};this.animationId=requestAnimationFrame(t)}updateOrbitCamera(){this.targetOrbitPitch=jt.clamp(this.targetOrbitPitch,-1.25,1.25),this.targetOrbitRadius=jt.clamp(this.targetOrbitRadius,this.minOrbitRadius,this.maxOrbitRadius);const t=this.orbitLerpSpeed;this.orbitYaw+=(this.targetOrbitYaw-this.orbitYaw)*t,this.orbitPitch+=(this.targetOrbitPitch-this.orbitPitch)*t,this.orbitRadius+=(this.targetOrbitRadius-this.orbitRadius)*t;const e=Math.cos(this.orbitPitch);this.perspectiveCamera.position.set(Math.sin(this.orbitYaw)*e*this.orbitRadius,Math.sin(this.orbitPitch)*this.orbitRadius,Math.cos(this.orbitYaw)*e*this.orbitRadius),this.perspectiveCamera.lookAt(this.orbitTarget),this.perspectiveCamera.updateProjectionMatrix()}stopAnimation(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}setParams(t,e,n){St(this.currentShader)==="image-plane"?this.planeMaterial&&(this.planeMaterial.uniforms.uQ.value=t,this.planeMaterial.uniforms.uAlpha.value=e,this.planeMaterial.uniforms.uBrightness.value=e,this.planeMaterial.uniforms.uSensitivity.value=n):this.currentShader==="nsa3d"?this.pointMaterial&&(this.pointMaterial.uniforms.uQ.value=t,this.pointMaterial.uniforms.uAlpha.value=e,this.pointMaterial.uniforms.uSensitivity.value=n):this.currentShader==="nsamorphology"&&this.morphMaterial&&(this.morphMaterial.uniforms.uQ.value=t,this.morphMaterial.uniforms.uAlpha.value=e,this.morphMaterial.uniforms.uSensitivity.value=n),this.render()}setBands(t,e,n){const i=this.bandData;!this.planeMaterial||!i[t]||!i[e]||!i[n]||(this.planeMaterial.uniforms.uBandR.value=i[t].tex,this.planeMaterial.uniforms.uBandG.value=i[e].tex,this.planeMaterial.uniforms.uBandB.value=i[n].tex,this.planeMaterial.uniforms.uRangeR.value=i[t].range,this.planeMaterial.uniforms.uRangeG.value=i[e].range,this.planeMaterial.uniforms.uRangeB.value=i[n].range,this.planeMaterial.uniforms.uStretch.value=Te([i[t].range,i[e].range,i[n].range]))}setTheme(t){if(!this.planeMaterial&&!this.pointMaterial||this.currentTheme===t)return;const e=[this.planeMaterial,this.pointMaterial,this.morphMaterial].filter(Boolean);for(const n of e)n.uniforms.uGrayscale.value=0;if(t==="grayscale"){this.setBands("i","r","g");for(const n of e)n.uniforms.uGrayscale.value=1,n.uniforms.uTheme.value=0}else if(t==="infra"){this.setBands("i","r","g");for(const n of e)n.uniforms.uTheme.value=0}else if(t==="astral"){this.setBands("i","r","g");for(const n of e)n.uniforms.uTheme.value=1}this.currentTheme=t,this.render()}getAutoParams(){return this.autoParams}setShader(t){!this.planeMaterial&&!this.pointMaterial||this.currentShader===t||(this.currentShader=t,this.applyCurrentShaderMode(),this.render())}is3DMode(){return St(this.currentShader)==="orbit"}supportsSkyPicking(){return St(this.currentShader)==="image-plane"}render(){!this.planeMaterial&&!this.pointMaterial&&!this.morphMaterial||this.renderer.render(this.scene,this.activeCamera)}resize(t,e){if(this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.planeMaterial){const n=this.renderer.getPixelRatio();this.planeMaterial.uniforms.uResolution.value.set(t*n,e*n)}this.pointMaterial&&(this.pointMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.morphMaterial&&(this.morphMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.perspectiveCamera.aspect=t/Math.max(e,1),this.perspectiveCamera.updateProjectionMatrix(),this.render()}pan(t,e){if(this.is3DMode())return;const n=this.targetZoom,i=t/this.width*2/n,s=e/this.height*2/n;this.targetX-=i,this.targetY+=s,this.velX=0,this.velY=0}fling(t,e){if(this.is3DMode())return;const n=this.targetZoom;this.velX=-(t/this.width)*2/n,this.velY=e/this.height*2/n}zoomAt(t,e,n){if(this.is3DMode())return;const i=this.targetZoom,s=Math.max(1,Math.min(i*t,50)),h=e/this.width*2-1,c=-(n/this.height)*2+1,f=this.targetX+h/i,v=this.targetY+c/i;this.targetZoom=s,this.targetX=f-h/s,this.targetY=v-c/s,this.velX=0,this.velY=0}orbit(t,e){if(!this.is3DMode())return;const n=La({yaw:this.targetOrbitYaw,pitch:this.targetOrbitPitch},t,e);this.targetOrbitYaw=n.yaw,this.targetOrbitPitch=n.pitch}dolly(t){if(!this.is3DMode())return;const e=this.targetOrbitRadius/Math.max(t,.01);this.targetOrbitRadius=jt.clamp(e,this.minOrbitRadius,this.maxOrbitRadius)}screenToRaDec(t,e,n){if(!this.supportsSkyPicking())return null;const i=this.orthographicCamera.zoom,s=t/this.width*2-1,h=-(e/this.height)*2+1,c=this.orthographicCamera.position.x+s/i,f=this.orthographicCamera.position.y+h/i,v=(c+1)/2,l=(f+1)/2;if(v<0||v>1||l<0||l>1)return null;const[r,d]=n.dimensions,p=v*r,w=(1-l)*d,_=p-r/2,k=w-d/2,S=(n.pixel_scale??.396)/3600,g=n.dec*Math.PI/180,b=n.dec-k*S;return{ra:n.ra-_*S/Math.cos(g),dec:b}}resetView(){if(this.is3DMode()){this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=Math.max(this.minOrbitRadius*1.4,1.5);return}this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0}dispose(){var t,e,n;this.stopAnimation(),this.textures.forEach(i=>i.dispose()),this.textures=[],this.planeMaterial&&this.planeMaterial.dispose(),this.pointMaterial&&this.pointMaterial.dispose(),this.morphMaterial&&this.morphMaterial.dispose(),(t=this.mesh)!=null&&t.geometry&&this.mesh.geometry.dispose(),(e=this.pointCloud)!=null&&e.geometry&&this.pointCloud.geometry.dispose(),(n=this.morphCloud)!=null&&n.geometry&&this.morphCloud.geometry.dispose(),this.disposeDensityMeshes(),this.renderer.dispose()}}async function ai(a){const t=new Image;t.crossOrigin="anonymous",t.src=a,await new Promise((s,h)=>{t.onload=()=>s(),t.onerror=()=>h(new Error("Failed to load image"))});const e=document.createElement("canvas");e.width=t.naturalWidth,e.height=t.naturalHeight;const n=e.getContext("2d");n.drawImage(t,0,0);const i=n.getImageData(0,0,e.width,e.height);return Yn(i),i}const ii=[{label:"Normal",value:"none"},{label:"Negative",value:"invert(1)"},{label:"Cyanotype",value:"sepia(1) hue-rotate(180deg) saturate(1.5)"},{label:"Amber",value:"sepia(1) saturate(1.5)"},{label:"Hard",value:"contrast(1.5) brightness(0.9)"}],si={class:"photo-scroll",ref:"scrollContainer"},ri={class:"photo-page"},oi={class:"photo-hero"},li={class:"hero-content"},hi={class:"hero-links"},ci=["disabled"],ui={class:"photo-hero-title"},di={class:"photo-hero-subtitle"},fi={key:0,class:"status-container"},vi={key:1,class:"status-container error"},mi={key:2,class:"content-grid"},pi={class:"glass-card canvas-card"},gi={class:"card-header"},yi={class:"header-actions"},xi={class:"canvas-wrapper"},_i={class:"canvas-loading-overlay"},wi={key:0,class:"crosshair-overlay",style:{cursor:"crosshair"}},bi=["x1","x2","y2"],ki=["y1","x2","y2"],Mi=["cx","cy"],Ci={key:1,class:"coord-hud"},Ri={class:"params-overlay"},Bi=["aria-expanded","aria-label"],Ai={key:0,class:"tune-drawer"},Si={class:"tune-drawer-content"},Ti={class:"tune-drawer-header"},Ui={class:"tune-drawer-title"},Di={class:"tune-drawer-body"},Pi={class:"control-group"},Fi={class:"theme-toggle"},Ei=["onClick"],zi={key:0,class:"control-group"},Oi={class:"label-row"},Ii={class:"param-value"},Ni={class:"control-group"},Vi={class:"label-row"},Gi={class:"param-value"},Li={class:"control-group"},Hi={class:"label-row"},Wi={class:"param-value"},Yi={class:"glass-card bands-card"},$i={class:"card-header"},Qi={class:"card-title"},Xi={class:"bands-grid"},qi=["onClick"],ji={class:"band-img-wrap"},Ki=["src","alt"],Zi={class:"band-badge"},Ji={class:"lightbox-content"},ts={class:"lightbox-header"},es={class:"lightbox-title"},ns={class:"lightbox-body"},as={class:"lightbox-image-wrap"},is=["src","alt"],ss={class:"lightbox-controls"},rs={class:"lb-control-group"},os={class:"lb-control-group"},ls=["value"],hs={class:"lb-control-group"},cs={class:"lb-control-group"},us={key:0,class:"info-sidebar"},ds={class:"sidebar-content"},fs={class:"sidebar-title"},vs={class:"sidebar-section"},ms={class:"sidebar-section"},ps={class:"tooltip-content"},gs={key:0,class:"loading-state"},ys={key:1,class:"error-state"},xs={key:2,class:"empty-state"},_s={key:3,class:"results-list"},ws=["href"],bs={class:"obj-name"},ks={class:"obj-type"},Ms=pn({__name:"GalaxyPhotoView",setup(a){const{t}=gn(),e=Mn(),n=kn(),{ready:i,getGalaxyByPgc:s,getRandomGalaxies:h}=Cn(),{loading:c,results:f,query:v,error:l}=Rn(),r=wt(()=>{const m=f.value.filter(o=>o.type==="Star"||o.type==="Galaxy");return m.length>0?m:f.value.slice(0,5)}),d=wt(()=>Number(e.params.pgc)),p=B(null),w=B(null),_=B(null),k=B(!0),S=B(!1),g=bn(null),b=B(10),M=B(.0515),C=B(1),T=B(null),I=B(null),$=wt(()=>{var m;return((m=_.value)==null?void 0:m.bands)||["u","g","r","i","z"]}),V=B("astral"),E=B("lupton"),z=wt(()=>E.value==="nsa3d"||E.value==="nsamorphology"),J=B(!1),tt=B(!1),it=B(!1),Q=B(!1),F=B({visible:!1,x:0,y:0,objects:[]}),X=B(!1),ot=B(0),q=B(0),L=new Map;let mt=-1,W=[];const j=B(null),lt=B(null);let et=-1,ht=-1;const ct=B(0),pt=B(0),bt=B(0),Ct=B(0),gt=B(100),yt=B(100),ut=B("none"),xt=B(!1),le=B(null),Ht=new Map,he=wt(()=>{const m=`brightness(${gt.value}%) contrast(${yt.value}%)`,o=ut.value!=="none"?ut.value:"";return{filter:`${m} ${o}`}}),je=wt(()=>{const x=F.value.x,y=F.value.y-120-16;return{left:x+"px",top:Math.max(60,y)+"px"}}),Ke=wt(()=>!z.value&&j.value!==null&&lt.value!==null);function ce(){if(!g.value||!_.value)return;const{Q:m,alpha:o,sensitivity:x}=Lt(_.value,E.value);b.value=m,M.value=o,C.value=x,Rt(),E.value==="lupton"&&(st.Q=m,st.alpha=o,st.sensitivity=x)}function ue(){n.push(`/g/${d.value}`)}async function Ze(m){try{return(await fetch(`${kt}/${m}/metadata.json`)).ok}catch{return!1}}async function Je(){if(it.value)return;it.value=!0;const m=100;for(let o=0;o<m;o++){const y=h(20).filter(N=>N.pgc!==d.value);for(const N of y)if(await Ze(N.pgc)){n.push(`/g/${N.pgc}/photo`),it.value=!1;return}}it.value=!1}function Rt(){g.value&&g.value.setParams(b.value,M.value,C.value)}Yt(V,m=>{g.value&&g.value.setTheme(m)});const st={Q:10,alpha:.1555,sensitivity:.88};Yt(E,(m,o)=>{if(g.value){if(o==="lupton"&&(st.Q=b.value,st.alpha=M.value,st.sensitivity=C.value),m==="lupton"&&_.value){const x=st,y=Lt(_.value,"lupton");b.value=x.Q!==y.Q?x.Q:y.Q,M.value=x.alpha!==y.alpha?x.alpha:y.alpha,C.value=x.sensitivity}else if(_.value){const x=Lt(_.value,m);b.value=x.Q,M.value=x.alpha,C.value=x.sensitivity}(m==="nsa3d"||m==="nsamorphology")&&(Q.value=!1,F.value.visible=!1,j.value=null,lt.value=null),g.value.setShader(m),Rt()}});function tn(m){const o=le.value;if(!o)return;o.width=m.width,o.height=m.height,o.getContext("2d").putImageData(m,0,0)}async function en(){if(xt.value=!xt.value,xt.value&&T.value){await ge();const m=T.value;let o=Ht.get(m);if(!o){const x=`${kt}/${d.value}/${m}.png`;o=await ai(x),Ht.set(m,o)}tn(o)}}function nn(m){T.value=m,gt.value=100,yt.value=100,ut.value="none",xt.value=!1}function de(){T.value=null}function an(){z.value||(Q.value=!Q.value,F.value.visible=!1)}function sn(m){if(m.preventDefault(),!g.value||!p.value)return;const o=m.deltaY>0?.9:1.1,x=p.value.getBoundingClientRect(),y=m.clientX-x.left,N=m.clientY-x.top;g.value.is3DMode()?g.value.dolly(o):(g.value.zoomAt(o,y,N),Dt())}function fe(){const[m,o]=Array.from(L.values()),x=m.clientX-o.clientX,y=m.clientY-o.clientY;return Math.sqrt(x*x+y*y)}function rn(){const[m,o]=Array.from(L.values());return{x:(m.clientX+o.clientX)/2,y:(m.clientY+o.clientY)/2}}function on(m){!g.value||!p.value||(p.value.setPointerCapture(m.pointerId),L.set(m.pointerId,m),L.size===1?(X.value=!0,ot.value=m.clientX,q.value=m.clientY,W=[{x:m.clientX,y:m.clientY,t:performance.now()}]):L.size===2&&(X.value=!1,mt=fe()))}function ln(m){if(!(!g.value||!p.value)&&L.has(m.pointerId)){if(L.set(m.pointerId,m),L.size===1&&X.value){const o=m.clientX-ot.value,x=m.clientY-q.value;g.value.is3DMode()?g.value.orbit(o,x):g.value.pan(o,x),ot.value=m.clientX,q.value=m.clientY;const y=performance.now();for(W.push({x:m.clientX,y:m.clientY,t:y});W.length>1&&y-W[0].t>80;)W.shift();g.value.is3DMode()||Dt()}else if(L.size===2){const o=fe();if(mt>0){const x=o/mt,y=rn(),N=p.value.getBoundingClientRect();g.value.is3DMode()?g.value.dolly(x):g.value.zoomAt(x,y.x-N.left,y.y-N.top)}mt=o,g.value.is3DMode()||Dt()}}}function Wt(m){if(!p.value)return;const o=X.value&&L.size===1;if(p.value.releasePointerCapture(m.pointerId),L.delete(m.pointerId),L.size<2&&(mt=-1),L.size===1){const x=L.values().next().value;x&&(ot.value=x.clientX,q.value=x.clientY),X.value=!0}else{if(X.value=!1,o&&g.value&&!g.value.is3DMode()&&W.length>=2){const x=W[0],y=W[W.length-1],N=(y.t-x.t)/1e3;if(N>.005){const _t=(y.x-x.x)/N*.016,fn=(y.y-x.y)/N*.016;g.value.fling(_t,fn)}}W=[]}}function Dt(){if(!g.value||!_.value||et<0||!g.value.supportsSkyPicking())return;const m=g.value.screenToRaDec(et,ht,_.value);m?(j.value=m.ra,lt.value=m.dec):(j.value=null,lt.value=null)}function hn(m){if(z.value||!p.value)return;const o=p.value.getBoundingClientRect();et=m.clientX-o.left,ht=m.clientY-o.top,Q.value&&(ct.value=et,pt.value=ht),Dt()}async function cn(m){if(!Q.value||!p.value||!_.value||!g.value||!g.value.supportsSkyPicking())return;const o=p.value.getBoundingClientRect(),x=m.clientX-o.left,y=m.clientY-o.top,N=g.value.screenToRaDec(x,y,_.value);if(N){F.value={visible:!0,x:m.clientX,y:m.clientY,objects:[],error:void 0};try{await v(N.ra,N.dec,30),l.value?F.value.error=l.value:F.value.objects=r.value.map(_t=>({name:_t.name,type:_t.type,simbadUrl:_t.simbadUrl}))}catch(_t){F.value.error="Failed to query SIMBAD",console.error("SIMBAD query error:",_t)}}}function un(){et=-1,ht=-1,j.value=null,lt.value=null}async function dn(m){try{const o=await fetch(`${kt}/${m}/metadata.json`);o.ok?_.value=await o.json():_.value=null}catch(o){console.error("Failed to load NSA metadata:",o),_.value=null}}async function ve(m){var o;k.value=!0,_.value=null,S.value=!1,T.value=null,Ht.clear(),(o=I.value)==null||o.disconnect(),I.value=null,g.value&&(g.value.dispose(),g.value=null),await i,w.value=s(m),await dn(m),k.value=!1;for(let x=0;x<3&&(await ge(),!p.value);x++);if(_.value&&p.value){await new Promise(x=>setTimeout(x,0));try{if(g.value=new ni(p.value),await g.value.load(m,_.value),S.value=!0,g.value.setParams(b.value,M.value,C.value),g.value.setTheme(V.value),ce(),st.Q=b.value,st.alpha=M.value,st.sensitivity=C.value,I.value=new ResizeObserver(()=>{if(g.value&&p.value){const x=p.value.parentElement.getBoundingClientRect();g.value.resize(x.width,x.height),bt.value=x.width,Ct.value=x.height}}),I.value.observe(p.value.parentElement),p.value.parentElement){const x=p.value.parentElement.getBoundingClientRect();bt.value=x.width,Ct.value=x.height}}catch(x){console.error("Failed to load NSA scene:",x),S.value=!0}}}return yn(()=>{ve(d.value)}),Yt(()=>e.params.pgc,(m,o)=>{if(!o)return;const x=Number(m),y=Number(o);x&&x!==y&&ve(x)}),xn(()=>{var m;(m=I.value)==null||m.disconnect(),g.value&&g.value.dispose()}),(m,o)=>{var x;return D(),U("div",si,[u("div",ri,[u("section",oi,[u("div",li,[u("div",hi,[u("button",{class:"back-link",onClick:ue},[o[12]||(o[12]=u("span",null,"←",-1)),Bt(" "+A(O(t)("pages.galaxyPhoto.back")||"Back to Galaxy"),1)]),u("button",{class:"shuffle-link",disabled:it.value,onClick:Je},A(it.value?"…":"↻")+" "+A(O(t)("pages.galaxyPhoto.shuffleAnother")),9,ci)]),u("h1",ui,[o[13]||(o[13]=u("span",{class:"title-accent"},"PGC",-1)),Bt(" "+A(((x=w.value)==null?void 0:x.pgc)||d.value),1)]),u("p",di,A(O(t)("pages.galaxyPhoto.title")),1)])]),k.value?(D(),U("div",fi,[o[14]||(o[14]=u("div",{class:"loading-spinner"},null,-1)),u("p",null,A(O(t)("app.loading")),1)])):_.value?(D(),U("div",mi,[u("div",pi,[u("div",gi,[o[16]||(o[16]=u("h2",{class:"card-title"},"Composite Imaging",-1)),u("div",yi,[dt(u("select",{"onUpdate:modelValue":o[0]||(o[0]=y=>E.value=y),class:"shader-select"},[...o[15]||(o[15]=[_n('<option value="lupton" data-v-ec0a8709>Lupton et al.</option><option value="composite" data-v-ec0a8709>Composite</option><option value="custom" data-v-ec0a8709>Custom</option><option value="volumetric" data-v-ec0a8709>Volumetric</option><option value="nsa3d" data-v-ec0a8709>NSA 3D</option><option value="nsamorphology" data-v-ec0a8709>Morphology 3D</option>',6)])],512),[[me,E.value]]),z.value?ft("",!0):(D(),U("button",{key:0,class:Pt(["find-objects-btn",{active:Q.value}]),onClick:an,"aria-label":"Find objects at location",title:"Click to activate, then click canvas to query SIMBAD"}," ✦ ",2)),u("button",{class:"info-btn",onClick:o[1]||(o[1]=y=>J.value=!J.value),"aria-label":"Info"}," i ")])]),u("div",xi,[dt(u("div",_i,[o[17]||(o[17]=u("div",{class:"loading-spinner"},null,-1)),u("p",null,A(O(t)("app.loading")||"Loading..."),1)],512),[[wn,!S.value]]),u("canvas",{ref_key:"canvasEl",ref:p,class:Pt(["composite-canvas",{"find-objects-mode":Q.value}]),onWheel:pe(sn,["prevent"]),onClick:cn,onPointerdown:on,onPointermove:ln,onPointerup:Wt,onPointercancel:Wt,onPointerleave:Wt,onMousemove:hn,onMouseleave:un},null,34),Q.value?(D(),U("svg",wi,[u("line",{x1:ct.value,y1:"0",x2:ct.value,y2:Ct.value,class:"crosshair-line"},null,8,bi),u("line",{x1:"0",y1:pt.value,x2:bt.value,y2:pt.value,class:"crosshair-line"},null,8,ki),u("circle",{cx:ct.value,cy:pt.value,r:"4",class:"crosshair-dot"},null,8,Mi)])):ft("",!0),Ke.value?(D(),U("div",Ci,[o[18]||(o[18]=u("span",{class:"coord-label"},"RA",-1)),Bt(" "+A(O(Ln)(j.value))+"   ",1),o[19]||(o[19]=u("span",{class:"coord-label"},"Dec",-1)),Bt(" "+A(O(Hn)(lt.value)),1)])):ft("",!0),u("div",Ri,[u("button",{class:"params-toggle",onClick:o[2]||(o[2]=y=>tt.value=!tt.value),"aria-expanded":tt.value,"aria-label":O(t)("pages.galaxyPhoto.tuneImage")},A(O(t)("pages.galaxyPhoto.tuneImage")),9,Bi)]),Ft(zt,{name:"drawer"},{default:Et(()=>[tt.value?(D(),U("div",Ai,[u("div",Si,[u("div",Ti,[u("h2",Ui,A(O(t)("pages.galaxyPhoto.params.title")||"Rendering Parameters"),1),u("button",{class:"tune-drawer-close",onClick:o[3]||(o[3]=y=>tt.value=!1),"aria-label":"Close"}," × ")]),u("div",Di,[u("button",{class:"best-fit-btn tune-best-fit",onClick:ce,title:"Reset to auto-calibrated values"}," Best Fit "),u("div",Pi,[o[20]||(o[20]=u("label",null,"Spectral Theme",-1)),u("div",Fi,[(D(),U(Ot,null,It([{id:"grayscale",label:"Grayscale"},{id:"infra",label:"Infrared"},{id:"astral",label:"Astral"}],y=>u("button",{key:y.id,class:Pt(["theme-btn",{active:V.value===y.id}]),onClick:N=>V.value=y.id},A(y.label),11,Ei)),64))])]),E.value!=="composite"?(D(),U("div",zi,[u("div",Oi,[u("label",null,A(O(t)("pages.galaxyPhoto.params.q"))+" (Stretch)",1),u("span",Ii,A(b.value.toFixed(1)),1)]),dt(u("input",{"onUpdate:modelValue":o[4]||(o[4]=y=>b.value=y),type:"range",min:"1",max:"100",step:"0.5",class:"custom-range",onInput:Rt},null,544),[[At,b.value,void 0,{number:!0}]])])):ft("",!0),u("div",Ni,[u("div",Vi,[u("label",null,A(O(t)("pages.galaxyPhoto.params.alpha"))+" (Brightness)",1),u("span",Gi,A(M.value.toFixed(4)),1)]),dt(u("input",{"onUpdate:modelValue":o[5]||(o[5]=y=>M.value=y),type:"range",min:"0.001",max:"10.0",step:"0.001",class:"custom-range",onInput:Rt},null,544),[[At,M.value,void 0,{number:!0}]])]),u("div",Li,[u("div",Hi,[o[21]||(o[21]=u("label",null,"Sensitivity",-1)),u("span",Wi,A(C.value.toFixed(2)),1)]),dt(u("input",{"onUpdate:modelValue":o[6]||(o[6]=y=>C.value=y),type:"range",min:"0.01",max:"1.0",step:"0.01",class:"custom-range",onInput:Rt},null,544),[[At,C.value,void 0,{number:!0}]])])])])])):ft("",!0)]),_:1})])]),u("section",Yi,[u("div",$i,[u("h2",Qi,A(O(t)("pages.galaxyPhoto.bands")),1)]),u("div",Xi,[(D(!0),U(Ot,null,It($.value,y=>(D(),U("div",{key:y,class:"band-item",onClick:N=>nn(y)},[u("div",ji,[u("img",{src:`${O(kt)}/${d.value}/${y}.png`,alt:`${y}-band`,loading:"lazy",crossorigin:"anonymous"},null,8,Ki),o[22]||(o[22]=u("div",{class:"band-overlay"},[u("span",{class:"zoom-icon"},"⤢")],-1))]),u("span",Zi,A(y),1)],8,qi))),128))])])])):(D(),U("div",vi,[u("p",null,A(O(t)("pages.galaxyPhoto.notAvailable")),1),u("button",{class:"action-btn",onClick:ue},"Return to Map")]))]),Ft(zt,{name:"fade"},{default:Et(()=>[T.value?(D(),U("div",{key:0,class:"lightbox",onClick:pe(de,["self"])},[u("div",Ji,[u("button",{class:"lightbox-close",onClick:de},"×"),u("div",ts,[u("h2",es,A(T.value)+"-band Raw Data",1),o[23]||(o[23]=u("span",{class:"lightbox-subtitle"},"Sloan Digital Sky Survey",-1))]),u("div",ns,[u("div",as,[xt.value?(D(),U("canvas",{key:0,ref_key:"stfCanvasEl",ref:le,class:"lightbox-image",style:$t(he.value)},null,4)):(D(),U("img",{key:1,class:"lightbox-image",src:`${O(kt)}/${d.value}/${T.value}.png`,alt:`${T.value}-band`,style:$t(he.value),crossorigin:"anonymous"},null,12,is)),u("div",ss,[u("div",rs,[o[24]||(o[24]=u("label",null,"Auto STF",-1)),u("button",{class:Pt(["stf-toggle",{active:xt.value}]),onClick:en},A(xt.value?"ON":"OFF"),3)]),u("div",os,[o[25]||(o[25]=u("label",null,"Filter",-1)),dt(u("select",{"onUpdate:modelValue":o[7]||(o[7]=y=>ut.value=y),class:"lb-select"},[(D(!0),U(Ot,null,It(O(ii),y=>(D(),U("option",{key:y.label,value:y.value},A(y.label),9,ls))),128))],512),[[me,ut.value]])]),u("div",hs,[o[26]||(o[26]=u("label",null,"Brightness",-1)),dt(u("input",{type:"range","onUpdate:modelValue":o[8]||(o[8]=y=>gt.value=y),min:"0",max:"200",class:"custom-range"},null,512),[[At,gt.value,void 0,{number:!0}]])]),u("div",cs,[o[27]||(o[27]=u("label",null,"Contrast",-1)),dt(u("input",{type:"range","onUpdate:modelValue":o[9]||(o[9]=y=>yt.value=y),min:"0",max:"200",class:"custom-range"},null,512),[[At,yt.value,void 0,{number:!0}]])])])])])])])):ft("",!0)]),_:1}),Ft(zt,{name:"sidebar"},{default:Et(()=>[J.value?(D(),U("div",us,[u("div",ds,[u("button",{class:"sidebar-close",onClick:o[10]||(o[10]=y=>J.value=!1)},"×"),u("h2",fs,A(O(t)("pages.galaxyPhoto.info.title")),1),u("div",vs,[o[28]||(o[28]=u("h3",null,"Data Source",-1)),u("p",null,A(O(t)("pages.galaxyPhoto.info.dataSource")),1)]),u("div",ms,[u("h3",null,A(E.value==="lupton"?"Lupton Composite":E.value==="composite"?"Raw Composite":E.value==="custom"?"Custom Composite":E.value==="volumetric"?"Volumetric Rendering":E.value==="nsa3d"?"NSA 3D Point Cloud":"Morphology 3D"),1),u("p",null,A(O(t)("pages.galaxyPhoto.info."+E.value)),1)])])])):ft("",!0)]),_:1}),Ft(zt,{name:"fade"},{default:Et(()=>[F.value.visible?(D(),U("div",{key:0,class:"simbad-tooltip",style:$t(je.value)},[o[32]||(o[32]=u("div",{class:"tooltip-arrow"},null,-1)),u("div",ps,[O(c)?(D(),U("div",gs,[...o[29]||(o[29]=[u("div",{class:"mini-spinner"},null,-1),u("span",null,"Querying SIMBAD...",-1)])])):F.value.error?(D(),U("div",ys,[o[30]||(o[30]=u("span",{class:"error-icon"},"⚠",-1)),Bt(" "+A(F.value.error),1)])):F.value.objects.length===0?(D(),U("div",xs," No objects found ")):(D(),U("div",_s,[(D(!0),U(Ot,null,It(F.value.objects,y=>(D(),U("a",{key:y.name,href:y.simbadUrl,target:"_blank",rel:"noopener noreferrer",class:"result-item result-link"},[u("span",bs,A(y.name),1),u("span",ks,A(y.type),1),o[31]||(o[31]=u("span",{class:"link-icon"},"↗",-1))],8,ws))),128))])),u("button",{class:"tooltip-close",onClick:o[11]||(o[11]=y=>F.value.visible=!1)},"×")])],4)):ft("",!0)]),_:1})],512)}}}),Ps=Gn(Ms,[["__scopeId","data-v-ec0a8709"]]);export{Ps as default};
