import{R as ft,M as pt,r as H,L as Je,C as oe,a as mt,b as xt,c as yt,D as _t,d as we,e as ke,S as St,E as Mt,f as wt,g as ge,o as At,h as et,i as L,u as tt,j as A,_ as Se,k as Le,l as Ne,F as pe,m as u,t as D,n as U,p as ee,q as de,w as De,T as Ie,s as Q,v as _e,x as ye,y as ce,z as nt,A as He,B as bt}from"./index-CvJfwPG0.js";import{V as J,C as Rt,W as Lt,S as Pt,G as Ct,P as Tt,B as Te,a as at,N as st,b as ot,c as N,Q as Oe,d as Et,T as Dt,e as It,F as Gt,M as Ft,f as Xe,R as zt}from"./three.module-DkVQHQlM.js";import{a as it,u as lt}from"./galaxy-Dap8huh6.js";import{m as kt,g as Nt}from"./GalaxyTextures-DjsATPrj.js";const Be=Math.PI/180;function Ht(h,e,t){const a=h*Be,s=e*Be,i=Math.cos(s);return new J(-t*i*Math.sin(a),t*Math.sin(s),-t*i*Math.cos(a))}function Re(h){const e=ft;if(h>=e[0][0])return e[0][1];if(h<=e[e.length-1][0])return e[e.length-1][1];for(let t=0;t<e.length-1;t++){const[a,s]=e[t],[i,n]=e[t+1];if(h<=a&&h>=i){const o=(a-h)/(a-i);return s<=0?n*o:s*Math.pow(n/s,o)}}return e[e.length-1][1]}function Ue(h){const e=pt;if(h>=e[0][0])return e[0][1];if(h<=e[e.length-1][0])return e[e.length-1][1];for(let t=0;t<e.length-1;t++){const[a,s]=e[t],[i,n]=e[t+1];if(h<=a&&h>=i){const o=(a-h)/(a-i);return s+(n-s)*o}}return e[e.length-1][1]}function Ee(h){return h*13968}function Ot(){const h=H(oe),e=H(Re(oe)),t=H(Ue(oe)),a=H(_t),s=H({azimuth:0,elevation:0});let i=null,n=null,o=null,r=0,c=null,d=null,_=Math.PI,y=1.68,C=!1,b=0,I=0;const S=.003,f=.005;let g=0,F=0;const Y=.92,Z=.76,q=1e-5,K=.08,ie=.025,z=.85,m=.03;let w=oe;const k=.08,X=.032,O=.065;let B=0,G=0,$=0,T=0;const ne=.04;function v(l){c=l,i=new Lt({canvas:l,antialias:!0,alpha:!1}),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setSize(window.innerWidth,window.innerHeight),i.setClearColor(0,1),n=new Pt,d=new Ct,n.add(d),o=new Tt(oe,window.innerWidth/window.innerHeight,mt,xt),o.position.set(...yt),V(),l.addEventListener("pointerdown",le),l.addEventListener("pointermove",fe),l.addEventListener("pointerup",p),l.addEventListener("pointerleave",p),l.addEventListener("wheel",x,{passive:!1}),l.addEventListener("touchstart",re,{passive:!1}),l.addEventListener("touchmove",Me,{passive:!1}),l.addEventListener("touchend",Ge),window.addEventListener("resize",Fe)}function M(){return d}function V(){if(!o)return;const l=Math.sin(y)*Math.sin(_),R=Math.cos(y),j=Math.sin(y)*Math.cos(_),se=new J(o.position.x+l*100,o.position.y+R*100,o.position.z+j*100);o.lookAt(se),s.value={azimuth:_*180/Math.PI,elevation:90-y*180/Math.PI}}function W(l,R){const j=l*Math.PI/180,se=oe*Math.PI/180,me=Math.tan(j*.5)/Math.tan(se*.5),ze=Math.pow(Math.max(0,me),z);return Math.max(R?ie:K,ze)}function ue(l){const R=Math.max(0,Math.min(1,(l-we)/(oe-we)));return Z+(Y-Z)*R}function he(){if(C||Math.abs(g)<q&&Math.abs(F)<q)return;const l=(o==null?void 0:o.fov)??oe,R=ue(l);_+=g,y+=F,y=Math.max(.1,Math.min(Math.PI/2+.3,y)),g*=R,F*=R,V()}function te(l){const R=Je[l];R&&(a.value=l,G=(90-R.latitude)/180*Math.PI,$=-R.longitude/180*Math.PI)}function ve(){if(!d)return;const l=G-B,R=$-T;Math.abs(l)<5e-4&&Math.abs(R)<5e-4?(B=G,T=$):(B+=l*ne,T+=R*ne),d.rotation.x=B,d.rotation.y=T}function ae(){if(!o)return;const l=w-o.fov;Math.abs(l)<.01||(o.fov+=l*k,o.updateProjectionMatrix(),h.value=o.fov,e.value=Re(o.fov),t.value=Ue(o.fov))}function le(l){E||(C=!0,b=l.clientX,I=l.clientY,g=0,F=0,c.style.cursor="grabbing",c.setPointerCapture(l.pointerId))}function fe(l){if(!C||E)return;const R=l.clientX-b,j=l.clientY-I;b=l.clientX,I=l.clientY;const se=(o==null?void 0:o.fov)??oe,me=l.pointerType==="touch",Pe=(me?f:S)*W(se,me),gt=Math.max(-m,Math.min(m,-R*Pe)),vt=Math.max(-m,Math.min(m,-j*Pe));g=g*.3+gt*.7,F=F*.3+vt*.7,_+=g,y+=F,y=Math.max(.1,Math.min(Math.PI/2+.3,y)),V()}function p(l){if(C=!1,c&&(c.style.cursor="grab",(l==null?void 0:l.pointerId)!=null))try{c.releasePointerCapture(l.pointerId)}catch{}}function x(l){l.preventDefault();const R=l.deltaY*X;w=Math.max(we,Math.min(ke,w+R))}let P=0,E=!1;function re(l){if(l.touches.length===2){E=!0,l.preventDefault();const R=l.touches[0].clientX-l.touches[1].clientX,j=l.touches[0].clientY-l.touches[1].clientY;P=Math.sqrt(R*R+j*j)}}function Me(l){if(l.touches.length===2){l.preventDefault();const R=l.touches[0].clientX-l.touches[1].clientX,j=l.touches[0].clientY-l.touches[1].clientY,se=Math.sqrt(R*R+j*j),me=(P-se)*O;P=se,w=Math.max(we,Math.min(ke,w+me))}}function Ge(l){P=0,l.touches.length<2&&(E=!1)}function Fe(){!i||!o||(o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight))}function rt(){return n}function ct(){return o}function ut(){return C}function ht(l){const R=new Rt;function j(){r=requestAnimationFrame(j);const se=R.getElapsedTime();he(),ve(),ae(),l(se),i.render(n,o)}j()}function dt(){cancelAnimationFrame(r),c&&(c.removeEventListener("pointerdown",le),c.removeEventListener("pointermove",fe),c.removeEventListener("pointerup",p),c.removeEventListener("pointerleave",p),c.removeEventListener("wheel",x),c.removeEventListener("touchstart",re),c.removeEventListener("touchmove",Me),c.removeEventListener("touchend",Ge)),window.removeEventListener("resize",Fe),i==null||i.dispose()}return{currentFov:h,currentMaxRedshift:e,currentMinRedshift:t,currentLocation:a,currentLookAt:s,init:v,getScene:rt,getCamera:ct,getIsDragging:ut,getPivot:M,startLoop:ht,setLocation:te,dispose:dt}}const Xt=`// Existing attributes
attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;
attribute float aFocused;
attribute float aAlpha;
attribute float aSizeMultiplier;

// Galaxy struct attributes (packed for efficiency)
attribute float aType;           // Galaxy type (0-4)
attribute float aSeed;           // Randomness seed
attribute vec3 aAngles;          // angleX, angleY, angleZ
attribute vec3 aPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
attribute float aDistance_mpc;   // Distance in megaparsecs

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uMinRedshift;
uniform float uFov;
uniform float uParallaxX;
uniform float uParallaxY;
uniform float uFocusActive;

// Existing varyings
varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;
varying float vFocused;

// Galaxy struct varyings (packed)
varying float vType;
varying float vSeed;
varying vec3 vAngles;          // angleX, angleY, angleZ
varying vec3 vPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
varying float vDistance_mpc;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;
  vFocused = aFocused;

  // Pass Galaxy struct data (packed)
  vType = aType;
  vSeed = aSeed;
  vAngles = aAngles;
  vPhysicalParams = aPhysicalParams;
  vDistance_mpc = aDistance_mpc;

  float sizeScale = 0.0;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < uMinRedshift || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
    sizeScale = 0.0;
  } else {
    // Far fade — outer 30% of range fades out
    float fadeStart = uMaxRedshift * 0.7;
    float farAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);

    // Near fade
    // Avoid division by zero if uMinRedshift is 0
    float nearFadeEnd = uMinRedshift > 0.0 ? uMinRedshift * 1.5 : 0.0;
    float nearAlpha = aRedshift > nearFadeEnd
      ? 1.0
      : smoothstep(uMinRedshift, nearFadeEnd, aRedshift);

    // Depth-based dimming: galaxies farther in the redshift range appear dimmer.
    // Normalized position within the visible range: 0 at min, 1 at max.
    float redshiftRange = uMaxRedshift - uMinRedshift;
    float depthT = redshiftRange > 0.0
      ? (aRedshift - uMinRedshift) / redshiftRange
      : 0.0;
    float depthDim = mix(1.0, 0.35, depthT);

    vAlpha = min(farAlpha, nearAlpha) * aAlpha * depthDim;

    // Size scaling logic:
    // 1. Far fade: shrink to keep dense deep fields readable.
    // 2. Near fade: modest growth only, avoiding giant foreground blobs.
    float farScale = mix(0.5, 1.0, farAlpha);
    float nearScale = mix(3.2, 1.0, nearAlpha);
    sizeScale = farScale * nearScale * (0.5 + 0.5 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  
  // Default wide view stays low-LOD dots; detail appears later while zooming in.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture)
  float fovMix = smoothstep(44.0, 24.0, uFov);
  
  // Proximity boost: if galaxy is very close (low redshift), show detail sooner!
  // Very near galaxies can gain detail sooner, but less aggressively.
  float proximityBoost = 1.0 - smoothstep(0.0, 0.0025, aRedshift);
  
  // Size-based boost: if galaxy is being artificially scaled up (foreground fly-by),
  // force texture detail so it doesn't look like a blurry blob.
  // aSizeMultiplier > 1.0 implies we are zooming past it or it's growing.
  float sizeBoost = smoothstep(1.2, 1.8, aSizeMultiplier);
  
  float farTwinkleMix = 1.0 - max(max(fovMix, proximityBoost * 0.95), sizeBoost);
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.06 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.03 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  // Apply controlled proximity scaling for deep-field readability.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * 2.35;
  
  // If the sprite is going to be large on screen, we MUST show texture detail
  // regardless of zoom level, otherwise it looks like a blurry blob.
  // Smoothly transition to texture only when sprites are clearly large.
  float pixelSizeBoost = smoothstep(20.0, 40.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  float detailBoost = mix(1.0, 1.18, vDetailMix);
  float farBoost = mix(1.15, 1.0, vDetailMix);
  float focusSize = basePx * detailBoost * farBoost;

  // Focus mode: dim non-focused galaxies, grow the focused one
  if (uFocusActive > 0.5) {
    if (aFocused > 0.5) {
      focusSize *= 1.5;
      vAlpha = max(vAlpha, 0.9);
      vDetailMix = 1.0;
    } else {
      vAlpha *= 0.12;
    }
  }

  gl_PointSize = max(1.1 * uPixelRatio, focusSize);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Keep a baseline parallax even when zoomed far out.
  float parallaxZoomMix = smoothstep(75.0, 16.0, uFov);
  float parallaxMix = mix(0.32, 1.0, parallaxZoomMix);
  float nearFactor = 1.0;
  if (uMaxRedshift > uMinRedshift + 0.000001) {
    nearFactor = 1.0 - smoothstep(uMinRedshift, uMaxRedshift, aRedshift);
  }
  float depthMix = mix(0.45, 1.0, nearFactor);
  mvPosition.x += uParallaxX * parallaxMix * depthMix * 29.0;
  mvPosition.y += uParallaxY * parallaxMix * depthMix * 21.0;
  gl_Position = projectionMatrix * mvPosition;
}
`,Bt=`/**
 * Value Noise — Stateless Math Library
 * Sin-hash value noise for procedural generation.
 * No uniforms, no varyings, no gl_ globals.
 *
 * Adapted from research/galaxy-generator/noise-value.glsl
 */

/** 1D hash: float -> pseudo-random float in [0, 1) */
float hashN(float n) {
  return fract(sin(n) * 43758.5453123);
}

/** 2D hash: vec2 -> pseudo-random float in [0, 1) */
float hashN2(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

/** 2D value noise with Hermite interpolation. Returns [0, 1). */
float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hashN2(i + vec2(0.0, 0.0)), hashN2(i + vec2(1.0, 0.0)), u.x),
             mix(hashN2(i + vec2(0.0, 1.0)), hashN2(i + vec2(1.0, 1.0)), u.x), u.y);
}
`,Ut=`/**
 * Galaxy Render Library — Stateless
 *
 * Procedural galaxy rendering using the Megaparsecs ring-loop technique.
 * Overlapping rotated elliptical orbits with Keplerian motion.
 * No uniforms, no varyings, no gl_ globals — pure functions.
 * All state flows through the Galaxy struct.
 *
 * Based on "Megaparsecs" by Martijn Steinrucken (BigWings), CC BY-NC-SA 3.0.
 * Requires: noise-value.glsl (hashN2, valueNoise2D)
 */

#ifndef _GAL_TAU
#define _GAL_TAU 6.2831853
#endif

#define GAL_MAX_RADIUS 1.5
#define GAL_MIN_COS_TILT 0.15
#define GAL_RING_PHASE_OFFSET 100.0
#define GAL_ORBIT_SPEED 0.1
#define GAL_DUST_UV_SCALE 0.2
#define GAL_DUST_NOISE_FREQ 4.0
#define GAL_STAR_GLOW_RADIUS 0.5
#define GAL_STAR_BRIGHTNESS 0.2
#define GAL_SUPERNOVA_THRESH 0.9999
#define GAL_SUPERNOVA_MULT 10.0
#define GAL_INNER_RADIUS 0.1
#define GAL_OUTER_RADIUS 1.0
#define GAL_MAX_RINGS 25
#define GAL_RING_DECORR_A 563.2
#define GAL_RING_DECORR_B 673.2
#define GAL_STAR_OFFSET_A 17.3
#define GAL_STAR_OFFSET_B 31.7
#define GAL_TWINKLE_FREQ 784.0
#define GAL_SUPERNOVA_TIME_SCALE 0.05
#define GAL_STAR_COLOR_FREQ 100.0

// ---- Utilities ----

mat2 _galRot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

/** Deterministic per-galaxy random from seed + channel offset. Returns [0, 1). */
float _galSeedHash(float seed, float channel) {
  return fract(sin(seed * 127.1 + channel * 311.7) * 43758.5453);
}

// ---- Data Structures ----

struct Galaxy {
  int type;            // 0=spiral, 1=barred, 2=elliptical, 3=lenticular, 4=irregular
  float seed;          // deterministic randomness (float, not uint)
  vec2 center;         // center position
  float scale;         // radius scale
  float time;          // animation time (caller passes elapsed seconds)
  float angleX;        // tilt angle (fake 3D via UV Y-stretch)
  float angleY;        // secondary tilt (reserved)
  float angleZ;        // in-plane rotation
  vec3 color;          // base tint color
  float axialRatio;    // b/a elongation (0.3-1.0)
  float mass_log10;    // log10 stellar mass (9-12)
  float velocity_kmps; // CMB velocity km/s
  float distance_mpc;  // distance in Mpc
};

struct GalaxyStyle {
  float twist;         // spiral winding per ring (0=none, 1=classic, 1.3+=tight)
  float innerStretch;  // inner ring X elongation (1=circular, 4=strong bar)
  float ringWidth;     // Gaussian sharpness (8=diffuse, 25=tight)
  float numRings;      // ring count (15-25)
  float diskThickness; // ring Y perturbation amplitude (0.01-0.1)
  float bulgeSize;     // center glow Gaussian tightness
  float bulgeBright;   // center glow intensity (0.5-2.0)
  float dustContrast;  // dust pow() exponent
  float starDensity;   // star grid resolution (4-12)
};

// ---- Shared Helpers ----

vec2 _galApplyTilt(vec2 uv, float angleX) {
  uv.y /= max(abs(cos(angleX)), GAL_MIN_COS_TILT);
  return uv;
}

vec3 _galRenderBulge(vec2 uv, float size, float brightness, vec3 tint) {
  return vec3(exp(-0.5 * dot(uv, uv) * size)) * brightness * tint;
}

vec3 _galRenderRingLoop(Galaxy g, vec2 uv, GalaxyStyle style) {
  vec3 col = vec3(0.0);

  // Seed-varied dust color: astronomical palette (no green).
  // Cool = blue-white (young OB stars), warm = gold (old K/M stars)
  float dustH = _galSeedHash(g.seed, 99.0);
  vec3 coolDust = vec3(0.35, 0.45, 1.0);   // blue-white
  vec3 warmDust = vec3(0.95, 0.70, 0.35);  // gold
  vec3 dustCol = mix(coolDust, warmDust, dustH);

  float flip = 1.0;
  float t = g.time * GAL_ORBIT_SPEED;
  t *= (mod(g.seed, 2.0) < 1.0 ? 1.0 : -1.0);

  for (int j = 0; j < GAL_MAX_RINGS; j++) {
    float i = float(j) / style.numRings;
    if (i >= 1.0) break;
    flip *= -1.0;

    float z = mix(style.diskThickness, 0.0, i) * flip
            * fract(sin(i * GAL_RING_DECORR_A) * GAL_RING_DECORR_B);

    float r = mix(GAL_INNER_RADIUS, GAL_OUTER_RADIUS, i);
    vec2 ringUv = uv + vec2(0.0, z * 0.5);

    vec2 st = ringUv * _galRot(i * _GAL_TAU * style.twist);

    st.x *= mix(style.innerStretch, 1.0, i);

    float ell = exp(-0.5 * abs(dot(st, st) - r) * style.ringWidth);

    vec2 texUv = GAL_DUST_UV_SCALE * st * _galRot(i * GAL_RING_PHASE_OFFSET + t / r);

    vec3 dust = vec3(valueNoise2D((texUv + vec2(i)) * GAL_DUST_NOISE_FREQ));
    vec3 dL = pow(max(ell * dust / r, vec3(0.0)), vec3(0.5 + style.dustContrast));

    col += dL * dustCol;

    vec2 starId = floor(texUv * style.starDensity);
    vec2 starUv = fract(texUv * style.starDensity) - 0.5;
    float n = hashN2(starId + vec2(i * GAL_STAR_OFFSET_A, i * GAL_STAR_OFFSET_B));
    float starDist = length(starUv);

    float sL = smoothstep(GAL_STAR_GLOW_RADIUS, 0.0, starDist)
             * pow(max(dL.r, 0.0), 2.0) * GAL_STAR_BRIGHTNESS
             / max(starDist, 0.001);

    float sN = sL;
    sL *= sin(n * GAL_TWINKLE_FREQ + g.time) * 0.5 + 0.5;
    sL += sN * smoothstep(GAL_SUPERNOVA_THRESH, 1.0,
            sin(n * GAL_TWINKLE_FREQ + g.time * GAL_SUPERNOVA_TIME_SCALE))
          * GAL_SUPERNOVA_MULT;

    if (i > 3.0 / style.starDensity) {
      // Star color: blue-white hot stars to warm yellow, no green
      vec3 hotStar = mix(vec3(0.75, 0.78, 1.0), vec3(1.0, 0.85, 0.65), n);
      vec3 starCol = mix(dustCol, hotStar, 0.3 + n * 0.5);
      col += sL * starCol;
    }
  }

  col /= style.numRings;
  return col;
}

// ---- Type-Specific Renderers ----

vec3 renderSpiral(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  float h0 = _galSeedHash(g.seed, 0.0);
  float h1 = _galSeedHash(g.seed, 1.0);
  float h2 = _galSeedHash(g.seed, 2.0);
  float h3 = _galSeedHash(g.seed, 3.0);
  float h4 = _galSeedHash(g.seed, 4.0);

  GalaxyStyle s;
  s.twist         = mix(0.7, 1.4, h0);
  s.innerStretch  = mix(1.5, 2.8, g.axialRatio * 0.5 + h1 * 0.5);
  s.ringWidth     = mix(12.0, 20.0, h2);
  s.numRings      = mix(16.0, 24.0, h3);
  s.diskThickness = mix(0.02, 0.06, h4);
  s.bulgeSize     = mix(20.0, 35.0, _galSeedHash(g.seed, 5.0));
  s.bulgeBright   = mix(0.8, 1.6, _galSeedHash(g.seed, 6.0));
  s.dustContrast  = mix(0.3, 0.7, _galSeedHash(g.seed, 7.0));
  s.starDensity   = mix(6.0, 10.0, _galSeedHash(g.seed, 8.0));

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.9, 0.8), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderBarredSpiral(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  float h0 = _galSeedHash(g.seed, 10.0);
  float h1 = _galSeedHash(g.seed, 11.0);
  float h2 = _galSeedHash(g.seed, 12.0);
  float h3 = _galSeedHash(g.seed, 13.0);
  float h4 = _galSeedHash(g.seed, 14.0);

  GalaxyStyle s;
  s.twist         = mix(1.0, 1.6, h0);
  s.innerStretch  = mix(2.5, 4.5, g.axialRatio * 0.4 + h1 * 0.6);
  s.ringWidth     = mix(9.0, 16.0, h2);
  s.numRings      = mix(16.0, 24.0, h3);
  s.diskThickness = mix(0.02, 0.06, h4);
  s.bulgeSize     = mix(16.0, 28.0, _galSeedHash(g.seed, 15.0));
  s.bulgeBright   = mix(0.7, 1.4, _galSeedHash(g.seed, 16.0));
  s.dustContrast  = mix(0.3, 0.7, _galSeedHash(g.seed, 17.0));
  s.starDensity   = mix(6.0, 10.0, _galSeedHash(g.seed, 18.0));

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.9, 0.7), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderElliptical(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  float h0 = _galSeedHash(g.seed, 20.0);
  float h1 = _galSeedHash(g.seed, 21.0);
  float h2 = _galSeedHash(g.seed, 22.0);
  float h3 = _galSeedHash(g.seed, 23.0);
  float h4 = _galSeedHash(g.seed, 24.0);

  GalaxyStyle s;
  s.twist         = mix(0.0, 0.05, h0);
  s.innerStretch  = mix(1.0, 1.6, (1.0 - g.axialRatio) * 0.5 + h1 * 0.5);
  s.ringWidth     = mix(6.0, 12.0, h2);
  s.numRings      = mix(12.0, 18.0, h3);
  s.diskThickness = mix(0.05, 0.12, h4);
  s.bulgeSize     = mix(10.0, 22.0, _galSeedHash(g.seed, 25.0));
  s.bulgeBright   = mix(1.5, 2.5, _galSeedHash(g.seed, 26.0));
  s.dustContrast  = mix(0.6, 1.0, _galSeedHash(g.seed, 27.0));
  s.starDensity   = mix(3.0, 6.0, _galSeedHash(g.seed, 28.0));

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.8, 0.6), g.color, 0.7));
  col *= g.color;
  return col;
}

vec3 renderLenticular(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  float h0 = _galSeedHash(g.seed, 30.0);
  float h1 = _galSeedHash(g.seed, 31.0);
  float h2 = _galSeedHash(g.seed, 32.0);
  float h3 = _galSeedHash(g.seed, 33.0);
  float h4 = _galSeedHash(g.seed, 34.0);

  GalaxyStyle s;
  s.twist         = mix(0.02, 0.10, h0);
  s.innerStretch  = mix(1.3, 2.2, (1.0 - g.axialRatio) * 0.5 + h1 * 0.5);
  s.ringWidth     = mix(16.0, 25.0, h2);
  s.numRings      = mix(14.0, 22.0, h3);
  s.diskThickness = mix(0.01, 0.04, h4);
  s.bulgeSize     = mix(24.0, 38.0, _galSeedHash(g.seed, 35.0));
  s.bulgeBright   = mix(1.1, 2.0, _galSeedHash(g.seed, 36.0));
  s.dustContrast  = mix(0.4, 0.8, _galSeedHash(g.seed, 37.0));
  s.starDensity   = mix(4.0, 8.0, _galSeedHash(g.seed, 38.0));

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.85, 0.65), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderIrregular(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  float h0 = _galSeedHash(g.seed, 40.0);
  float h1 = _galSeedHash(g.seed, 41.0);
  float h2 = _galSeedHash(g.seed, 42.0);
  float h3 = _galSeedHash(g.seed, 43.0);
  float h4 = _galSeedHash(g.seed, 44.0);

  GalaxyStyle s;
  s.twist         = mix(0.1, 0.5, h0);
  s.innerStretch  = mix(1.0, 2.0, h1);
  s.ringWidth     = mix(7.0, 14.0, h2);
  s.numRings      = mix(12.0, 20.0, h3);
  s.diskThickness = mix(0.06, 0.14, h4);
  s.bulgeSize     = mix(30.0, 50.0, _galSeedHash(g.seed, 45.0));
  s.bulgeBright   = mix(0.3, 0.8, _galSeedHash(g.seed, 46.0));
  s.dustContrast  = mix(0.2, 0.6, _galSeedHash(g.seed, 47.0));
  s.starDensity   = mix(8.0, 12.0, _galSeedHash(g.seed, 48.0));

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(0.9, 0.85, 1.0), g.color, 0.6));
  col *= g.color;
  return col;
}

// ---- Polymorphic Dispatcher ----

vec3 renderGalaxy(Galaxy g, vec2 fragCoord) {
  if (g.type == 0) return renderSpiral(g, fragCoord);
  if (g.type == 1) return renderBarredSpiral(g, fragCoord);
  if (g.type == 2) return renderElliptical(g, fragCoord);
  if (g.type == 3) return renderLenticular(g, fragCoord);
  if (g.type == 4) return renderIrregular(g, fragCoord);
  return vec3(0.0);
}
`,Yt=`precision highp float;

// ---- Varyings from vertex shader ----

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;
varying float vFocused;

// Galaxy struct varyings (packed)
varying float vType;
varying float vSeed;
varying vec3 vAngles;          // angleX, angleY, angleZ
varying vec3 vPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
varying float vDistance_mpc;

// ---- Uniforms ----

uniform float uTime;

// ---- Main ----

void main() {
  if (vAlpha < 0.01) discard;

  // Assemble Galaxy struct from varyings
  Galaxy g;
  g.type          = int(vType + 0.5);
  g.seed          = vSeed;
  g.center        = vec2(0.0);
  g.scale         = 1.0;
  // Animate only the focused galaxy; others freeze at a seed-derived pose
  g.time          = vFocused > 0.5 ? uTime : vSeed * 0.01;
  g.angleX        = vAngles.x;
  g.angleY        = vAngles.y;
  g.angleZ        = vAngles.z;
  g.color         = vColor;
  g.axialRatio    = vPhysicalParams.x;
  g.mass_log10    = vPhysicalParams.y;
  g.velocity_kmps = vPhysicalParams.z;
  g.distance_mpc  = vDistance_mpc;

  // Map point sprite coordinates to library space [-1, 1]
  vec2 fragCoord = (gl_PointCoord - 0.5) * 2.0;

  // Render
  vec3 galaxyColor = renderGalaxy(g, fragCoord);

  if (length(galaxyColor) < 0.001) discard;

  vec3 finalColor = galaxyColor;
  float finalAlpha = length(galaxyColor) * vAlpha;

  // Selected outline: cyan glow at sprite edge
  if (vSelected > 0.5) {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float outline = 1.0 - smoothstep(0.35, 0.65, dist);
    vec3 outlineColor = vec3(0.4, 0.9, 1.0);
    finalColor = mix(finalColor, outlineColor, outline * 0.5);
    finalAlpha = max(finalAlpha, outline * 0.75 * vAlpha);
  }

  if (finalAlpha < 0.01) discard;

  // Gamma correction (linear -> sRGB)
  finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.45));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`,$t=Bt+`
`+Ut+`
`+Yt;function Vt(h){return{spiral:0,barred:1,elliptical:2,lenticular:3,irregular:4,unknown:5}[h]??5}function Ye(h,e){let t=h*2654435761+e*284517>>>0;return t=(t>>16^t)*73244475>>>0,(t&2147483647)/2147483647}class Wt{constructor(e,t){this.selected=new Float32Array(0),this.selectedPgc=null,this.focused=new Float32Array(0),this.hoveredPgc=null,this.alphas=new Float32Array(0),this.sizeMultipliers=new Float32Array(0),this.tempLocal=new J,this.tempWorld=new J,this.tempView=new J,this.latestPointerParallaxX=0,this.latestPointerParallaxY=0,this.galaxies=e,this.atlasTexture=t,this.positions=new Float32Array(0),this.sizes=new Float32Array(0),this.redshifts=new Float32Array(0),this.alphas=new Float32Array(0),this.sizeMultipliers=new Float32Array(0),this.geometry=new Te,this.material=new at({vertexShader:Xt,fragmentShader:$t,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uMaxRedshift:{value:.01},uMinRedshift:{value:0},uFov:{value:60},uParallaxX:{value:0},uParallaxY:{value:0},uFocusActive:{value:0}},transparent:!0,depthWrite:!1,blending:st}),this.points=new ot(this.geometry,this.material),this.points.frustumCulled=!1,this.rebuild(e)}rebuild(e){this.galaxies=e;const t=e.length,a=new Float32Array(t*3),s=new Float32Array(t*3),i=new Float32Array(t),n=new Float32Array(t),o=new Float32Array(t),r=new Float32Array(t),c=new Float32Array(t),d=new Float32Array(t),_=new Float32Array(t).fill(1),y=new Float32Array(t),C=new Float32Array(t),b=new Float32Array(t*3),I=new Float32Array(t*3),S=new Float32Array(t);for(let f=0;f<t;f++){const g=e[f],F=Ht(g.ra,g.dec,St);a[f*3]=F.x,a[f*3+1]=F.y,a[f*3+2]=F.z;const Y=it(g.pgc),Z=g.pgc*2654435761>>>0,q=(Z>>>8)%1024/1023,K=(Z>>>18)%1024/1023,ie=(Z>>>3)%1024/1023,z=[[.45,.55,1],[.6,.7,1],[.9,.88,.95],[1,.88,.6],[1,.72,.38],[.95,.5,.25],[.85,.35,.3],[.8,.4,.55]],m=q*(z.length-1),w=Math.floor(m),k=Math.min(w+1,z.length-1),X=m-w;let O=z[w][0]+(z[k][0]-z[w][0])*X,B=z[w][1]+(z[k][1]-z[w][1])*X,G=z[w][2]+(z[k][2]-z[w][2])*X;const $=.75+ie*.45,T=.55+K*.45;O=O*T+(1-T)*.92,B=B*T+(1-T)*.87,G=G*T+(1-T)*.82,s[f*3]=Math.min(1,Math.max(.08,O*$)),s[f*3+1]=Math.min(1,Math.max(.08,B*$)),s[f*3+2]=Math.min(1,Math.max(.08,G*$));const ne=32;i[f]=Math.max(3,Math.min(128,ne/g.distance_mpc)),n[f]=(g.vcmb??0)/299792.458,o[f]=kt(Y),r[f]=this.selectedPgc!=null&&g.pgc===this.selectedPgc?1:0,y[f]=Vt(Y),C[f]=((g.pgc*73856093^(g.pgc>>16)*19349663)>>>0)%1e5,b[f*3]=Ye(g.pgc,1)*Math.PI*2,b[f*3+1]=0,b[f*3+2]=Ye(g.pgc,3)*Math.PI*2,I[f*3]=g.axial_ratio??.7,I[f*3+1]=g.log_ms_t??10,I[f*3+2]=g.vcmb??0,S[f]=g.distance_mpc}this.positions=a,this.selected=r,this.focused=c,this.sizes=i,this.redshifts=n,this.alphas=d,this.sizeMultipliers=_,this.geometry.dispose(),this.geometry=new Te,this.geometry.setAttribute("position",new N(a,3)),this.geometry.setAttribute("aColor",new N(s,3)),this.geometry.setAttribute("aSize",new N(i,1)),this.geometry.setAttribute("aRedshift",new N(n,1)),this.geometry.setAttribute("aTexIndex",new N(o,1)),this.geometry.setAttribute("aSelected",new N(r,1)),this.geometry.setAttribute("aFocused",new N(c,1)),this.geometry.setAttribute("aAlpha",new N(d,1)),this.geometry.setAttribute("aSizeMultiplier",new N(_,1)),this.geometry.setAttribute("aType",new N(y,1)),this.geometry.setAttribute("aSeed",new N(C,1)),this.geometry.setAttribute("aAngles",new N(b,3)),this.geometry.setAttribute("aPhysicalParams",new N(I,3)),this.geometry.setAttribute("aDistance_mpc",new N(S,1)),this.points.geometry=this.geometry}setSelectedPgc(e){if(this.selectedPgc===e||(this.selectedPgc=e,!this.geometry.attributes.aSelected))return;const t=this.geometry.attributes.aSelected,a=t.array;for(let s=0;s<this.galaxies.length;s++)a[s]=e!=null&&this.galaxies[s].pgc===e?1:0;t.needsUpdate=!0}setHoveredPgc(e){if(this.hoveredPgc===e||(this.hoveredPgc=e,this.material.uniforms.uFocusActive.value=e!=null?1:0,!this.geometry.attributes.aFocused))return;const t=this.geometry.attributes.aFocused,a=t.array;for(let s=0;s<this.galaxies.length;s++)a[s]=e!=null&&this.galaxies[s].pgc===e?1:0;t.needsUpdate=!0}update(e,t,a,s,i=0,n=0,o=0,r=0,c=0){if(this.material.uniforms.uTime.value=e,this.material.uniforms.uMaxRedshift.value=t,this.material.uniforms.uMinRedshift.value=a,this.material.uniforms.uFov.value=s,this.latestPointerParallaxX=this.clamp(i,-1,1),this.latestPointerParallaxY=this.clamp(n,-1,1),this.material.uniforms.uParallaxX.value=this.latestPointerParallaxX,this.material.uniforms.uParallaxY.value=this.latestPointerParallaxY,this.alphas.length===this.galaxies.length){const d=Re(s),y=Ee(d)/3.26,C=Math.log2(Math.max(1,y)),b=this.geometry.attributes.aSizeMultiplier,I=b==null?void 0:b.array;for(let f=0;f<this.galaxies.length;f++){const g=this.galaxies[f],Y=Math.log2(Math.max(1,g.distance_mpc))-C,Z=this.computeDepthWindowAlpha(Y,s),q=this.computeForegroundFade(Y,s);this.alphas[f]=Z*q,I[f]=this.computeGrowthMultiplier(Y)}const S=this.geometry.attributes.aAlpha;S&&(S.needsUpdate=!0),b&&(b.needsUpdate=!0)}}pickGalaxyAtScreen(e,t,a,s,i,n,o,r){this.points.updateWorldMatrix(!0,!1);let c=-1,d=Number.POSITIVE_INFINITY;const _=Math.min(window.devicePixelRatio,2),y=this.smoothstep(0,1,this.clamp01((52-r)/32)),b=Ee(Re(r))/3.26,I=Math.log2(Math.max(1,b));for(let S=0;S<this.galaxies.length;S++){const f=this.computeVisibilityAlpha(this.redshifts[S],n,o);if(f<.01)continue;const g=S*3;this.tempLocal.set(this.positions[g],this.positions[g+1],this.positions[g+2]),this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(a);const Y=Math.log2(Math.max(1,this.galaxies[S].distance_mpc))-I;if(this.computeDepthWindowAlpha(Y,r)*this.computeForegroundFade(Y,r)<.01||this.tempWorld.z<-1||this.tempWorld.z>1)continue;const q=(this.tempWorld.x*.5+.5)*s,K=(-this.tempWorld.y*.5+.5)*i;this.tempView.set(this.positions[g],this.positions[g+1],this.positions[g+2]).applyMatrix4(this.points.matrixWorld).applyMatrix4(a.matrixWorldInverse);const ie=this.computeParallaxNdcShiftX(this.redshifts[S],n,o,r,a,this.tempView.z),z=this.computeParallaxNdcShiftY(this.redshifts[S],n,o,r,a,this.tempView.z),m=q+ie*.5*s,w=K-z*.5*i,X=this.estimatePointSizePx(this.sizes[S],f,_,r,y)*.5,O=e-m,B=t-w;if(Math.abs(O)>X||Math.abs(B)>X)continue;const G=O*O+B*B;G<d&&(d=G,c=S)}return c>=0?this.galaxies[c]:null}estimatePointSizePx(e,t,a,s,i){const n=.5+.5*t,o=60/s,r=e*a*o*n*2.35,c=1+.18*i,d=1.15-.15*i;return Math.max(1.1*a,r*c*d)}computeVisibilityAlpha(e,t,a){if(e<a||e>t)return 0;let s=1;const i=t*.7;e>i&&(s=this.smoothstep(t,i,e));let n=1;const o=a*1.5;return e<o&&(n=this.smoothstep(a,o,e)),Math.min(s,n)}computeDepthWindowAlpha(e,t){const a=this.smoothstep(72,12,t),s=this.mix(.5,.22,a),i=this.mix(1,.55,a),n=this.mix(-.5,-.22,a),o=this.mix(-1.6,-.8,a);return e<o||e>i?0:e<n?this.smoothstep(o,n,e):e>s?1-this.smoothstep(s,i,e):1}computeGrowthMultiplier(e){return e>=0?1-.38*this.smoothstep(0,1,e):1.15+2.7*this.smoothstep(-.78,-.05,e)}computeForegroundFade(e,t){const a=this.smoothstep(72,12,t),s=this.mix(-.6,-.28,a),i=this.mix(-1.8,-.9,a);return e>=s?1:e<=i?0:this.smoothstep(i,s,e)}computeParallaxNdcShiftX(e,t,a,s,i,n){const o=this.smoothstep(75,16,s),r=this.mix(.32,1,o),c=1-this.smoothstep(a,t,e),d=this.mix(.45,1,c),_=this.latestPointerParallaxX*r*d*29,y=i.projectionMatrix.elements[0],C=Math.max(.001,-n);return _*y/C}computeParallaxNdcShiftY(e,t,a,s,i,n){const o=this.smoothstep(75,16,s),r=this.mix(.32,1,o),c=1-this.smoothstep(a,t,e),d=this.mix(.45,1,c),_=this.latestPointerParallaxY*r*d*21,y=i.projectionMatrix.elements[5],C=Math.max(.001,-n);return _*y/C}clamp01(e){return Math.max(0,Math.min(1,e))}clamp(e,t,a){return Math.max(t,Math.min(a,e))}smoothstep(e,t,a){const s=this.clamp01((a-e)/(t-e));return s*s*(3-2*s)}mix(e,t,a){return e+(t-e)*a}dispose(){this.geometry.dispose(),this.material.dispose(),this.atlasTexture.dispose()}}const jt="/assets/earth_day-DkcerPt2.jpg",Zt=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Qt=`
uniform sampler2D uDayMap;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(-vPosition);
  float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Earth texture — slightly dimmed for night-sky feel
  vec3 texColor = texture2D(uDayMap, vUv).rgb * 0.6;

  // Atmospheric glow at edges (Fresnel)
  vec3 atmosColor = vec3(0.15, 0.35, 0.65);
  vec3 finalColor = mix(texColor, atmosColor, fresnel * 0.8);

  gl_FragColor = vec4(finalColor, 1.0);
}
`,qt=.04;class Kt{constructor(){this.texture=null,this.currentQuat=new Oe,this.targetQuat=new Oe;const e=new Et(Mt,64,64),t=new Dt().load(jt);t.colorSpace=It,this.texture=t;const a=new at({vertexShader:Zt,fragmentShader:Qt,uniforms:{uDayMap:{value:t}},side:Gt,depthWrite:!0});this.mesh=new Ft(e,a),this.mesh.position.set(0,wt,0),this.mesh.renderOrder=-1}setLocation(e,t){const a=e*Math.PI/180,i=t*Math.PI/180+Math.PI,n=Math.PI/2-a,o=new J(-Math.cos(i)*Math.sin(n),Math.cos(n),Math.sin(i)*Math.sin(n)).normalize(),r=new J(0,1,0),c=o.clone(),d=new J;Math.abs(c.y)>.99?d.set(0,0,-1):d.copy(r).sub(c.clone().multiplyScalar(r.dot(c))).normalize();const _=new J().crossVectors(d,c).normalize(),y=new Xe().makeBasis(_,c,d),b=new Xe().makeBasis(new J(1,0,0),new J(0,1,0),new J(0,0,-1)).multiply(y.transpose());this.targetQuat.setFromRotationMatrix(b)}update(){this.currentQuat.slerp(this.targetQuat,qt),this.mesh.quaternion.copy(this.currentQuat)}dispose(){var e;this.mesh.geometry.dispose(),this.mesh.material.dispose(),(e=this.texture)==null||e.dispose()}}const xe=14e3,Ce=800,Jt=1.4;class en{constructor(){const e=new Float32Array(xe*3),t=new Float32Array(xe),a=new Float32Array(xe),s=new Float32Array(xe*3),i=new Float32Array(xe);for(let r=0;r<xe;r++){const c=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1);e[r*3]=Ce*Math.sin(d)*Math.cos(c),e[r*3+1]=Ce*Math.cos(d),e[r*3+2]=Ce*Math.sin(d)*Math.sin(c),t[r]=Jt*(.5+Math.random()*.8),a[r]=.35+Math.random()*.45,i[r]=Math.random()*Math.PI*2;const _=Math.random();_<.5?(s[r*3]=.85+Math.random()*.12,s[r*3+1]=.88+Math.random()*.1,s[r*3+2]=.95+Math.random()*.05):_<.85?(s[r*3]=.95+Math.random()*.05,s[r*3+1]=.9+Math.random()*.08,s[r*3+2]=.8+Math.random()*.12):(s[r*3]=.98+Math.random()*.02,s[r*3+1]=.92+Math.random()*.06,s[r*3+2]=.75+Math.random()*.15)}const n=new Te;n.setAttribute("position",new N(e,3)),n.setAttribute("aSize",new N(t,1)),n.setAttribute("aOpacity",new N(a,1)),n.setAttribute("aColor",new N(s,3)),n.setAttribute("aPhase",new N(i,1));const o=new zt({vertexShader:`
        precision mediump float;
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        attribute float aPhase;
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = aColor;

          // Tinkle: stars pulse in brightness (each has its own phase)
          float twinkle = sin(uTime * 1.8 + aPhase) * 0.32 + 0.68;
          vOpacity *= twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (620.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        precision mediump float;

        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          // Soft circular point
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:st,uniforms:{uTime:{value:0}}});this.points=new ot(n,o),this.points.frustumCulled=!1}update(e){this.points.material.uniforms.uTime.value=e}dispose(){this.points.geometry.dispose(),this.points.material.dispose()}}const $e=5,tn=ge({__name:"GalaxyCanvas",emits:["ready","hover","select"],setup(h,{expose:e,emit:t}){const a=t,s=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,i=tt(),n=H(null),{currentFov:o,currentMaxRedshift:r,currentMinRedshift:c,currentLocation:d,currentLookAt:_,init:y,getScene:C,getCamera:b,getIsDragging:I,getPivot:S,startLoop:f,setLocation:g,dispose:F}=Ot(),{ready:Y,getAllGalaxies:Z}=lt();function q(p){g(p);const x=Je[p];x&&w&&w.setLocation(x.latitude,x.longitude)}let K=[];function ie(p,x){if(!m)return 0;const P=K.filter(E=>{const re=it(E.pgc,E.morphology);return p.has(re)&&x.has(E.source??"CF4")});return m.rebuild(P),P.length}function z(){return K.length}e({currentFov:o,currentMaxRedshift:r,currentLocation:d,currentLookAt:_,setLocation:q,applyFilter:ie,getAllGalaxiesCount:z});let m=null,w=null,k=null,X=!1,O=0,B=0,G=!1,$=!1,T=null,ne=0,v=0,M=0,V=0;function W(p){if(!m||!n.value)return null;const x=n.value.getBoundingClientRect(),P=p.clientX-x.left,E=p.clientY-x.top;return P<0||E<0||P>x.width||E>x.height?null:m.pickGalaxyAtScreen(P,E,b(),x.width,x.height,r.value,c.value,o.value)}function ue(p){if(he(p.clientX,p.clientY),X){const P=p.clientX-O,E=p.clientY-B;P*P+E*E>$e*$e&&(G=!0)}if(I()){m==null||m.setHoveredPgc(null),a("hover",null);return}const x=W(p);x?(n.value.style.cursor="pointer",m==null||m.setHoveredPgc(x.pgc),a("hover",{galaxy:x,screenX:p.clientX,screenY:p.clientY})):(n.value.style.cursor="grab",m==null||m.setHoveredPgc(null),s||a("hover",null))}function he(p,x){if(!n.value)return;const P=n.value.getBoundingClientRect();if(P.width<=0||P.height<=0)return;const E=(p-P.left)/P.width,re=(x-P.top)/P.height;ne=Math.max(-1,Math.min(1,E*2-1)),v=Math.max(-1,Math.min(1,1-re*2))}function te(p){T=(p==null?void 0:p.galaxy)??null,m==null||m.setSelectedPgc((T==null?void 0:T.pgc)??null),m==null||m.setHoveredPgc((T==null?void 0:T.pgc)??null),a("select",p??null)}function ve(){X=!1,G=!1,ne=0,v=0,m==null||m.setHoveredPgc(null),a("hover",null),s&&te(null)}function ae(p){X=!0,O=p.clientX,B=p.clientY,he(p.clientX,p.clientY),G=!1}function le(){G&&($=!0),X=!1,G=!1}function fe(p){if($){$=!1;return}if(I())return;const x=W(p);s?x?(T==null?void 0:T.pgc)===x.pgc?i.push(`/g/${x.pgc}`):te({galaxy:x,screenX:p.clientX,screenY:p.clientY}):te(null):x&&i.push(`/g/${x.pgc}`)}return At(async()=>{if(!n.value)return;y(n.value);const p=C(),x=S();await Y,K=Z();const P=Nt();m=new Wt(K,P),w=new Kt,k=new en,x.add(k.points),x.add(m.points),p.add(w.mesh),f(E=>{M+=(ne-M)*.18,V+=(v-V)*.18,m==null||m.update(E,r.value,c.value,o.value,M,V),k==null||k.update(E),w==null||w.update()}),n.value.addEventListener("pointermove",ue),n.value.addEventListener("pointerdown",ae),n.value.addEventListener("pointerup",le),n.value.addEventListener("pointercancel",le),n.value.addEventListener("pointerleave",ve),n.value.addEventListener("click",fe),a("ready")}),et(()=>{var p,x,P,E,re,Me;(p=n.value)==null||p.removeEventListener("pointermove",ue),(x=n.value)==null||x.removeEventListener("pointerdown",ae),(P=n.value)==null||P.removeEventListener("pointerup",le),(E=n.value)==null||E.removeEventListener("pointercancel",le),(re=n.value)==null||re.removeEventListener("pointerleave",ve),(Me=n.value)==null||Me.removeEventListener("click",fe),m==null||m.dispose(),w==null||w.dispose(),k==null||k.dispose(),F()}),(p,x)=>(A(),L("canvas",{ref_key:"canvasRef",ref:n,class:"fixed inset-0 w-full h-full galaxy-canvas"},null,512))}}),nn=Se(tn,[["__scopeId","data-v-3173e4cf"]]),an={key:0,class:"pill-count"},sn={key:0,class:"filter-panel"},on={class:"panel-header"},ln={class:"panel-title"},rn={class:"section"},cn={class:"section-label"},un={class:"chip-row"},hn=["onClick"],dn={class:"section"},gn={class:"section-label"},vn={class:"chip-row"},fn=["onClick"],pn={class:"panel-footer"},mn=ge({__name:"SkyFilterPanel",props:{totalCount:{},filteredCount:{}},emits:["filter-change"],setup(h,{emit:e}){const{t}=Le(),a=h,s=e,i=H(!1),n=["spiral","barred","elliptical","lenticular","irregular"],o=["CF4","ALFALFA","FSS","UGC"],r=Ne(new Set(n)),c=Ne(new Set(o)),d=Q(()=>r.size<n.length||c.size<o.length),_=Q(()=>a.filteredCount.toLocaleString()),y=Q(()=>a.totalCount.toLocaleString());function C(S){r.has(S)?r.size>1&&r.delete(S):r.add(S),I()}function b(S){c.has(S)?c.size>1&&c.delete(S):c.add(S),I()}function I(){s("filter-change",{morphologies:new Set(r),sources:new Set(c)})}return(S,f)=>(A(),L(pe,null,[i.value?ee("",!0):(A(),L("button",{key:0,class:"filter-pill",onClick:f[0]||(f[0]=g=>i.value=!0)},[f[2]||(f[2]=u("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[u("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})],-1)),u("span",null,D(U(t)("pages.home.filter")),1),d.value?(A(),L("span",an,D(_.value),1)):ee("",!0)])),de(Ie,{name:"panel"},{default:De(()=>[i.value?(A(),L("div",sn,[u("div",on,[u("span",ln,D(U(t)("pages.home.filter")),1),u("button",{class:"close-btn",onClick:f[1]||(f[1]=g=>i.value=!1),"aria-label":"Close"},[...f[3]||(f[3]=[u("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[u("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),u("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])]),u("div",rn,[u("div",cn,D(U(t)("pages.home.morphologyLabel")),1),u("div",un,[(A(),L(pe,null,_e(n,g=>u("button",{key:g,class:ye(["chip",{active:r.has(g)}]),onClick:F=>C(g)},D(U(t)("morphology."+g)),11,hn)),64))])]),u("div",dn,[u("div",gn,D(U(t)("pages.home.catalogLabel")),1),u("div",vn,[(A(),L(pe,null,_e(o,g=>u("button",{key:g,class:ye(["chip",{active:c.has(g)}]),onClick:F=>b(g)},D(g),11,fn)),64))])]),u("div",pn,D(U(t)("pages.home.showing",{count:_.value,total:y.value})),1)])):ee("",!0)]),_:1})],64))}}),xn=Se(mn,[["__scopeId","data-v-647995f5"]]),yn={class:"tooltip-pgc"},_n={class:"tooltip-detail"},Sn={key:0,class:"tooltip-detail"},Mn=ge({__name:"GalaxyTooltip",props:{galaxy:{},x:{},y:{},showCta:{type:Boolean}},emits:["navigate"],setup(h){const{t:e}=Le();return(t,a)=>h.galaxy?(A(),L("div",{key:0,class:ye(["tooltip",{"has-cta":h.showCta}]),style:ce({left:h.x+12+"px",top:h.y-10+"px"})},[u("div",yn,"PGC "+D(h.galaxy.pgc),1),u("div",_n,D(Math.round(h.galaxy.distance_mly).toLocaleString())+" Mly",1),h.galaxy.vcmb!=null?(A(),L("div",Sn,D(h.galaxy.vcmb.toLocaleString())+" km/s",1)):ee("",!0),h.showCta?(A(),L("button",{key:1,type:"button",class:"tooltip-cta",onClick:a[0]||(a[0]=s=>t.$emit("navigate"))},D(U(e)("pages.home.goToGalaxy")),1)):ee("",!0)],6)):ee("",!0)}}),wn=Se(Mn,[["__scopeId","data-v-cec37f8a"]]),An={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black"},bn={class:"text-center"},Rn={class:"text-sm text-white/70 tracking-wide"},Ln=ge({__name:"LoadingOverlay",props:{isLoading:{type:Boolean}},setup(h){const{t:e}=Le();return(t,a)=>(A(),nt(Ie,{name:"fade"},{default:De(()=>[h.isLoading?(A(),L("div",An,[u("div",bn,[a[0]||(a[0]=u("div",{class:"mb-4 text-4xl animate-pulse"},"✪",-1)),u("p",Rn,D(U(e)("app.loading")),1)])])):ee("",!0)]),_:1}))}}),Pn=Se(Ln,[["__scopeId","data-v-c1ac9ae0"]]),Cn={class:"space-compass pointer-events-none select-none"},Tn={class:"compass-tape relative w-full h-12 overflow-hidden"},En={key:0,class:"w-px h-3 bg-white/40 flex-none"},Dn={key:1,class:"w-px h-1.5 bg-white/20 flex-none"},In={key:2,class:"mt-1 text-[10px] font-mono text-white/40 whitespace-nowrap"},Ve=4,Gn=ge({__name:"SpaceCompass",props:{azimuth:{},elevation:{}},setup(h){const e=h,t=Q(()=>e.azimuth*Ve),a=Q(()=>{const s=e.azimuth,i=500,n=Math.floor(s-i),o=Math.ceil(s+i),r=[];for(let c=n;c<=o;c++){let d=c%360;d<0&&(d+=360);const _=d%15===0;(d%5===0||_)&&r.push({value:c,offset:c*Ve,isMajor:_,label:_?`${Math.round(d)}°`:null})}return r});return(s,i)=>(A(),L("div",Cn,[u("div",Tn,[i[0]||(i[0]=u("div",{class:"absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center"},[u("div",{class:"w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"}),u("div",{class:"w-px h-4 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"})],-1)),u("div",{class:"absolute top-0 h-full will-change-transform",style:ce({transform:`translateX(calc(50% - ${t.value}px))`})},[(A(!0),L(pe,null,_e(a.value,n=>(A(),L("div",{key:n.value,class:"absolute top-0 flex flex-col items-center w-0 overflow-visible",style:ce({left:`${n.offset}px`})},[n.isMajor?(A(),L("div",En)):(A(),L("div",Dn)),n.label?(A(),L("div",In,D(n.label),1)):ee("",!0)],4))),128))],4),i[1]||(i[1]=u("div",{class:"absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"},null,-1))])]))}}),Fn=Se(Gn,[["__scopeId","data-v-6e465829"]]),zn={class:"distance-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-end relative py-4"},kn={class:"relative w-full h-full"},Nn={class:"mr-2 text-[10px] font-mono text-white/30"},Hn={class:"mr-2 text-xs font-mono text-blue-400 font-bold drop-shadow-md"},Ae=0,We=1600,On=ge({__name:"DistanceIndicator",props:{distance:{}},setup(h){const e=h,t=[{value:1500,label:"1.5k"},{value:1e3,label:"1k"},{value:500,label:"500"},{value:100,label:"100"},{value:0,label:"0"}];function a(i){return(1-(i-Ae)/(We-Ae))*100}const s=Q(()=>{const i=(e.distance-Ae)/(We-Ae);return(1-Math.max(0,Math.min(1,i)))*100});return(i,n)=>(A(),L("div",zn,[n[2]||(n[2]=u("div",{class:"absolute right-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),u("div",kn,[(A(),L(pe,null,_e(t,o=>u("div",{key:o.value,class:"absolute right-0 flex items-center justify-end w-full -translate-y-1/2",style:ce({top:`${a(o.value)}%`})},[u("span",Nn,D(o.label),1),n[0]||(n[0]=u("div",{class:"w-1.5 h-px bg-white/30"},null,-1))],4)),64)),u("div",{class:"absolute right-0 flex items-center justify-end w-full transition-all duration-300 ease-out -translate-y-1/2",style:ce({top:`${s.value}%`})},[u("span",Hn,D(Math.round(h.distance))+" mLY ",1),n[1]||(n[1]=u("div",{class:"w-3 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"},null,-1))],4)])]))}}),Xn={class:"elevation-indicator pointer-events-none select-none h-64 w-12 flex flex-col items-start relative py-4"},Bn={class:"relative w-full h-full"},Un={class:"ml-2 text-[10px] font-mono text-white/30"},Yn={class:"ml-2 text-xs font-mono text-green-400 font-bold drop-shadow-md"},be=-90,je=90,$n=ge({__name:"ElevationIndicator",props:{elevation:{}},setup(h){const e=h,t=[{value:90,label:"90°"},{value:60,label:"60°"},{value:30,label:"30°"},{value:0,label:"0°"},{value:-30,label:"-30°"},{value:-60,label:"-60°"},{value:-90,label:"-90°"}];function a(i){return(1-(i-be)/(je-be))*100}const s=Q(()=>{const i=(e.elevation-be)/(je-be);return(1-Math.max(0,Math.min(1,i)))*100});return(i,n)=>(A(),L("div",Xn,[n[2]||(n[2]=u("div",{class:"absolute left-0 top-4 bottom-4 w-px bg-white/10"},null,-1)),u("div",Bn,[(A(),L(pe,null,_e(t,o=>u("div",{key:o.value,class:"absolute left-0 flex items-center justify-start w-full -translate-y-1/2",style:ce({top:`${a(o.value)}%`})},[n[0]||(n[0]=u("div",{class:"w-1.5 h-px bg-white/30"},null,-1)),u("span",Un,D(o.label),1)],4)),64)),u("div",{class:"absolute left-0 flex items-center justify-start w-full transition-all duration-300 ease-out -translate-y-1/2",style:ce({top:`${s.value}%`})},[n[1]||(n[1]=u("div",{class:"w-3 h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"},null,-1)),u("span",Yn,D(Math.round(h.elevation))+"° ",1)],4)])]))}}),Vn={class:"w-full h-full"},Wn={key:0,class:"hero-overlay"},jn={class:"hero-content"},Zn={class:"hero-subtitle"},Qn={class:"hero-hint-group"},qn={class:"hero-hint"},Kn={class:"w-full max-w-3xl"},Jn={key:1,class:"galaxy-count-badge"},ea=1,Ze=180,Qe=16,qe=.25,Ke=.6,ta=ge({__name:"HomeView",setup(h){const e=tt(),{t}=Le(),{isLoading:a}=lt(),{currentLocation:s,locationSetter:i}=bt(),n=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches,o=H(null),r=H(null),c=H(!1),d=H(!0),_=H(0),y=H(0),C=H(null),b=H(null),I=H(0),S=H(0),f=Q(()=>n?b.value:C.value),g=Q(()=>{var v,M;return((M=(v=o.value)==null?void 0:v.currentLookAt)==null?void 0:M.azimuth)??0}),F=Q(()=>{var v,M;return((M=(v=o.value)==null?void 0:v.currentLookAt)==null?void 0:M.elevation)??0}),Y=Q(()=>{var M;const v=((M=o.value)==null?void 0:M.currentMaxRedshift)??0;return Ee(v)});function Z(){var M;c.value=!0;const v=((M=o.value)==null?void 0:M.getAllGalaxiesCount())??0;_.value=v,y.value=v,o.value&&(i.value=o.value.setLocation,s.value=o.value.currentLocation)}et(()=>{i.value=null,window.removeEventListener("mousemove",G),window.removeEventListener("resize",$)});function q(v){var V;const M=((V=o.value)==null?void 0:V.applyFilter(v.morphologies,v.sources))??0;y.value=M}function K(v){v?(C.value=v.galaxy,I.value=v.screenX,S.value=v.screenY):C.value=null}function ie(v){v?(b.value=v.galaxy,I.value=v.screenX,S.value=v.screenY):b.value=null}function z(){b.value&&e.push(`/g/${b.value.pgc}`)}function m(){d.value=!1}He(()=>{var v;return(v=o.value)==null?void 0:v.currentFov},v=>{d.value&&v!==void 0&&v<oe-ea&&m()});const w=Q(()=>t("header.siteName").split("")),k=H(-9999),X=H(-9999);let O=[];function B(){r.value&&(O=Array.from(r.value.children).map(v=>{const M=v.getBoundingClientRect();return{x:M.left+M.width/2,y:M.top+M.height/2}}))}function G(v){O.length===0&&B(),k.value=v.clientX,X.value=v.clientY}function $(){O=[]}function T(v){const M=k.value,V=X.value;if(n)return{};const W=O[v];if(!W)return{};const ue=W.x-M,he=W.y-V,te=Math.sqrt(ue*ue+he*he);if(te>Ze)return{};const ve=1-te/Ze,ae=ve*ve;if(te<1)return{scale:`${1+qe}`,textShadow:`0 0 20px rgba(255,255,255,${Ke})`};const le=ue/te*ae*Qe,fe=he/te*ae*Qe,p=1+ae*qe,x=ae*Ke;return{translate:`${le.toFixed(1)}px ${fe.toFixed(1)}px`,scale:`${p.toFixed(3)}`,textShadow:x>.02?`0 0 ${(24*ae).toFixed(0)}px rgba(255,255,255,${x.toFixed(2)})`:"none"}}const ne=Q(()=>{const v=k.value,M=X.value;return v<-999?{opacity:"0"}:{left:`${v}px`,top:`${M}px`,opacity:"1"}});return n||He(()=>d.value&&c.value,v=>{v?(window.addEventListener("mousemove",G),window.addEventListener("resize",$)):(window.removeEventListener("mousemove",G),window.removeEventListener("resize",$),O=[])},{immediate:!0}),(v,M)=>(A(),L("div",Vn,[de(nn,{ref_key:"canvasRef",ref:o,onReady:Z,onHover:K,onSelect:ie},null,512),de(Ie,{name:"hero"},{default:De(()=>[d.value&&c.value?(A(),L("div",Wn,[U(n)?ee("",!0):(A(),L("div",{key:0,class:"hero-lens-glow",style:ce(ne.value)},null,4)),u("div",jn,[u("h1",{ref_key:"titleRef",ref:r,class:"hero-title"},[(A(!0),L(pe,null,_e(w.value,(V,W)=>(A(),L("span",{key:W,class:"hero-char",style:ce({...T(W),"--twinkle-dur":`${2.5+W*.4}s`,animationDelay:`${.2+W*.35}s, ${1+W*.6}s`})},D(V),5))),128))],512),u("p",Zn,D(U(t)("pages.home.hero.subtitle")),1),u("button",{class:"hero-button",onClick:m},D(U(t)("pages.home.hero.cta")),1),u("div",Qn,[M[0]||(M[0]=u("div",{class:"hero-scroll-line"},[u("span")],-1)),u("p",qn,D(U(n)?U(t)("pages.home.hero.hintMobile"):U(t)("pages.home.hero.hint")),1)])])])):ee("",!0)]),_:1}),u("div",{class:ye(["absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center hud-soft",{"hud-hidden":d.value}])},[u("div",Kn,[de(Fn,{azimuth:g.value},null,8,["azimuth"])])],2),u("div",{class:ye(["absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry",{"hud-hidden":d.value}])},[de(On,{distance:Y.value},null,8,["distance"])],2),u("div",{class:ye(["absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry",{"hud-hidden":d.value}])},[de($n,{elevation:F.value},null,8,["elevation"])],2),c.value&&!d.value?(A(),nt(xn,{key:0,"total-count":_.value,"filtered-count":y.value,onFilterChange:q},null,8,["total-count","filtered-count"])):ee("",!0),de(wn,{galaxy:f.value,x:I.value,y:S.value,"show-cta":U(n),onNavigate:z},null,8,["galaxy","x","y","show-cta"]),de(Pn,{"is-loading":U(a)},null,8,["is-loading"]),c.value&&y.value>0&&!d.value?(A(),L("div",Jn,D(U(t)("app.loaded",{count:y.value.toLocaleString()})),1)):ee("",!0)]))}}),ia=Se(ta,[["__scopeId","data-v-48cb237b"]]);export{ia as default};
