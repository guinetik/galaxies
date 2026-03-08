import{h as j,L as Z,n as Y,e as K}from"./three.core-Bozt1HMY.js";const h=256,f=Math.PI*2,o=h/2,T=[{hue:12,spread:10,wInner:.35,wOuter:.12},{hue:26,spread:10,wInner:.31,wOuter:.18},{hue:40,spread:8,wInner:.18,wOuter:.16},{hue:58,spread:6,wInner:.07,wOuter:.14},{hue:214,spread:9,wInner:.03,wOuter:.14},{hue:282,spread:12,wInner:.06,wOuter:.22}];function Q(e){const n=Math.pow(e,.6);let i=0;for(const a of T)i+=a.wInner*(1-n)+a.wOuter*n;let t=Math.random()*i;for(const a of T)if(t-=a.wInner*(1-n)+a.wOuter*n,t<=0)return a.hue+(Math.random()-.5)*a.spread;return 42}function G(e,n,i){e=(e%360+360)%360;const t=(1-Math.abs(2*i-1))*n,a=t*(1-Math.abs(e/60%2-1)),r=i-t/2;let c=0,s=0,l=0;return e<60?(c=t,s=a):e<120?(c=a,s=t):e<180?(s=t,l=a):e<240?(s=a,l=t):e<300?(c=a,l=t):(c=t,l=a),[Math.round((c+r)*255),Math.round((s+r)*255),Math.round((l+r)*255)]}function L(e,n,i,t,a,r,c){const[s,l,g]=G(t,.42,Math.min(.9,a)),d=e.createRadialGradient(n,i,0,n,i,c);d.addColorStop(0,`rgba(${s},${l},${g},${r})`),d.addColorStop(.33,`rgba(${s},${l},${g},${r*.42})`),d.addColorStop(1,`rgba(${s},${l},${g},0)`),e.fillStyle=d,e.beginPath(),e.arc(n,i,c,0,f),e.fill()}function A(){return(Math.random()-.5+Math.random()-.5)*2}function q(e){const n=(e%360+360)%360;return n>=72&&n<=186?n<129?66:260:n}function _(e,n,i,t,a,r=1,c=0){e.save(),e.translate(o,o),e.rotate(c),e.scale(1,r);const[s,l,g]=G(n,.28,i),d=e.createRadialGradient(0,0,0,0,0,a);d.addColorStop(0,`rgba(${s},${l},${g},${t})`),d.addColorStop(.45,`rgba(${s},${l},${g},${t*.32})`),d.addColorStop(1,`rgba(${s},${l},${g},0)`),e.fillStyle=d,e.beginPath(),e.arc(0,0,a,0,f),e.fill(),e.restore()}function p(e,n){const i=e.getImageData(0,0,h,h),t=i.data;for(let a=0;a<t.length;a+=4){if(t[a+3]===0)continue;const r=(Math.random()-.5)*n;t[a]=Math.max(0,Math.min(255,t[a]+r)),t[a+1]=Math.max(0,Math.min(255,t[a+1]+r)),t[a+2]=Math.max(0,Math.min(255,t[a+2]+r))}e.putImageData(i,0,0)}function x(e,n){const i=e.getImageData(0,0,h,h),t=i.data,a=Math.cos(n.rotation),r=Math.sin(n.rotation),c=n.majorRadius*n.axisRatio;for(let s=0;s<h;s++)for(let l=0;l<h;l++){const g=l+.5-o,d=s+.5-o,v=g*a-d*r,w=g*r+d*a,y=v/n.majorRadius,S=w/c,m=Math.sqrt(y*y+S*S);if(m>1.2)continue;const C=Math.atan2(S,y),D=Math.sin(C*n.armCount+m*13),H=Math.sin(C*1.7+m*6),E=1+n.irregularity*(D*.35+H*.22),I=Math.exp(-Math.pow(Math.max(0,m*n.concentration),1.2)),P=Math.exp(-Math.pow(Math.max(0,m*1.35),1.55)),B=Math.exp(-Math.pow(Math.abs(S)*12,1.35))*(1-m),z=Math.max(0,(I*.72+P*.46)*E),F=1-n.dustStrength*B,R=z*F;if(R<.01)continue;const O=Math.min(1,Math.max(0,Math.pow(m,.85))),N=n.centerHue+(n.outerHue-n.centerHue)*O+(Math.random()-.5)*2.5,U=q(N),k=Math.min(.86,.14+R*.72),[X,$,V]=G(U,.28,k),W=Math.min(1,R*.72),u=(s*h+l)*4;t[u]=Math.max(t[u],X),t[u+1]=Math.max(t[u+1],$),t[u+2]=Math.max(t[u+2],V),t[u+3]=Math.min(255,Math.max(t[u+3],Math.floor(W*255)))}e.putImageData(i,0,0)}function J(e){const n=Math.random()*f;x(e,{majorRadius:o*.84,axisRatio:.68+Math.random()*.2,rotation:n,centerHue:24,outerHue:284,concentration:1.22,irregularity:.8,dustStrength:.28,armCount:2}),_(e,39,.82,.6,o*.11,.8,n);for(let i=0;i<260;i++){const t=Math.pow(Math.random(),.55)*o*.86,a=Math.random()*f;L(e,o+Math.cos(a)*t,o+Math.sin(a)*t*.8,Q(t/(o*.86)),.42+Math.random()*.28,.07+Math.random()*.13,.45+Math.random()*1.4)}p(e,6)}function ee(e){const n=Math.random()*f;x(e,{majorRadius:o*.83,axisRatio:.62+Math.random()*.22,rotation:n,centerHue:20,outerHue:276,concentration:1.18,irregularity:.7,dustStrength:.24,armCount:2}),e.save(),e.translate(o,o),e.rotate(n);for(let i=0;i<260;i++){const t=(Math.random()-.5)*o*.75,a=A()*o*.03;L(e,t,a,42+(Math.random()-.5)*8,.66,.15,.45+Math.random()*1.2)}e.restore(),p(e,6)}function ne(e){const n=Math.random()*f;x(e,{majorRadius:o*.78,axisRatio:.6+Math.random()*.25,rotation:n,centerHue:32,outerHue:352,concentration:1.55,irregularity:.24,dustStrength:.1,armCount:1}),_(e,37,.92,.55,o*.12,.78,n),p(e,6)}function ae(e){const n=Math.random()*f;x(e,{majorRadius:o*.8,axisRatio:.35+Math.random()*.16,rotation:n,centerHue:28,outerHue:350,concentration:1.35,irregularity:.18,dustStrength:.2,armCount:1}),_(e,36,.9,.5,o*.09,.48,n),p(e,6)}function te(e){const i=o*.7;x(e,{majorRadius:o*.74,axisRatio:.7+Math.random()*.25,rotation:Math.random()*f,centerHue:18,outerHue:286,concentration:.95,irregularity:1,dustStrength:.14,armCount:3});const t=4+Math.floor(Math.random()*4),a=Array.from({length:t},()=>({x:o+(Math.random()-.5)*i*1.4,y:o+(Math.random()-.5)*i*1.4,sigma:15+Math.random()*25,hue:210+(Math.random()-.5)*30}));for(let r=0;r<900;r++){let c,s,l;if(Math.random()<.8){const g=a[Math.floor(Math.random()*a.length)];c=g.x+A()*g.sigma,s=g.y+A()*g.sigma,l=g.hue}else{const g=Math.sqrt(Math.random())*i,d=Math.random()*f;c=o+Math.cos(d)*g+(Math.random()-.5)*20,s=o+Math.sin(d)*g+(Math.random()-.5)*20,l=200+Math.random()*40}L(e,c,s,l,.58,.22,.7+Math.random()*1.7)}_(e,208,.45,.2,o*.5),p(e,8)}const oe={spiral:J,barred:ee,elliptical:ne,lenticular:ae,irregular:te},M=4,ie=2,b=["spiral","barred","elliptical","lenticular","irregular"];function se(e){const n=b.indexOf(e);return n>=0?n:0}function le(){const e=M*h,n=ie*h,i=new OffscreenCanvas(e,n),t=i.getContext("2d",{alpha:!0});t.clearRect(0,0,e,n);for(let r=0;r<b.length;r++){const c=b[r],s=r%M,l=Math.floor(r/M),g=new OffscreenCanvas(h,h),d=g.getContext("2d",{alpha:!0});d.clearRect(0,0,h,h);const v=d.createRadialGradient(o,o,0,o,o,o*.9);v.addColorStop(0,"rgba(20, 20, 30, 0.2)"),v.addColorStop(1,"rgba(0, 0, 0, 0)"),d.fillStyle=v,d.fillRect(0,0,h,h),oe[c](d),t.drawImage(g,s*h,l*h)}const a=new j(i);return a.generateMipmaps=!0,a.magFilter=Z,a.minFilter=Y,"colorSpace"in a&&(a.colorSpace=K),a.needsUpdate=!0,a}const ge=`// Existing attributes
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
    // Reduces overlap from distant background galaxies.
    float redshiftRange = uMaxRedshift - uMinRedshift;
    float depthT = redshiftRange > 0.0
      ? (aRedshift - uMinRedshift) / redshiftRange
      : 0.0;
    float depthDim = mix(1.0, 0.88, depthT);

    vAlpha = min(farAlpha, nearAlpha) * aAlpha * depthDim;

    // Size scaling logic:
    // 1. Keep galaxies readable longer as they approach the active shell edges.
    // 2. Let them complete the "grow into view" moment before fading away.
    float farScale = mix(0.96, 1.12, farAlpha);
    float nearScale = mix(3.2, 1.0, nearAlpha);
    sizeScale = farScale * nearScale * (0.94 + 0.48 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  float homeViewBoost = clamp((uFov - 40.0) / 18.0, 0.0, 1.0);
  
  // Detail appears earlier so galaxies can grow into sharp view before fading.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture). Trigger at 55°–32° FOV.
  float fovMix = smoothstep(55.0, 32.0, uFov);
  
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
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * mix(2.8, 3.35, homeViewBoost);
  
  // Show texture detail when sprites reach modest size so galaxies look sharp as they grow.
  float pixelSizeBoost = smoothstep(11.0, 23.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  // Dim blurry galaxies to reduce overlap clutter; in-focus stay full opacity.
  // Alpha is NOT affected by view center — same galaxies visible at each zoom.
  vAlpha *= mix(0.96, 1.0, smoothstep(0.18, 0.72, vDetailMix));
  vAlpha *= mix(1.0, 1.28, homeViewBoost);

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

  vec4 clipPos = projectionMatrix * mvPosition;
  gl_Position = clipPos;

  // View-center sharpness: galaxies near where you're looking appear sharper (larger sprites).
  // Does NOT affect alpha — visibility unchanged; only blur/size varies with look direction.
  vec2 ndc = clipPos.xy / max(clipPos.w, 0.0001);
  float viewCenterMix = 1.0 - smoothstep(0.0, 0.85, length(ndc));
  float effectiveDetailForSize = max(vDetailMix, viewCenterMix * 0.55);

  float detailBoost = mix(1.0, 1.18, effectiveDetailForSize);
  float farBoost = mix(1.15, 1.0, effectiveDetailForSize);
  float focusSize = basePx * detailBoost * farBoost * mix(1.0, 1.12, homeViewBoost);

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

  gl_PointSize = min(max(1.6 * uPixelRatio, focusSize), 140.0 * uPixelRatio);
}
`,de=`/**
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
`,ce=`/**
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
/** Minimum cos(tilt) — caps max thinness; higher = less edge-on, galaxies stay thicker */
#define GAL_MIN_COS_TILT 0.38
#define GAL_RING_PHASE_OFFSET 100.0
#define GAL_ORBIT_SPEED 0.1
#define GAL_DUST_UV_SCALE 0.2
#define GAL_DUST_NOISE_FREQ 4.0
#define GAL_STAR_GLOW_RADIUS 0.5
#define GAL_STAR_BRIGHTNESS 0.32
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
    vec3 dL = pow(max(ell * dust / r, vec3(0.0)), vec3(0.4 + style.dustContrast));

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
`,he=`precision highp float;

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
  if (vAlpha < 0.03) discard;

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
  float finalAlpha = min(1.0, length(galaxyColor) * vAlpha * 1.35);

  // Selected outline: cyan glow at sprite edge
  if (vSelected > 0.5) {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float outline = 1.0 - smoothstep(0.35, 0.65, dist);
    vec3 outlineColor = vec3(0.4, 0.9, 1.0);
    finalColor = mix(finalColor, outlineColor, outline * 0.5);
    finalAlpha = max(finalAlpha, outline * 0.75 * vAlpha);
  }

  if (finalAlpha < 0.04) discard;

  // Gamma correction (linear -> sRGB)
  finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.45));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;export{le as a,he as f,ge as g,se as m,de as n,ce as r};
