import{S as Y,g as U,d as me,u as de,G as ue,A as pe,B as he,c as M,a as r,e as i,t as d,E as ve,f as w,n as K,k,b as J,w as Q,T as Ee,j as Se,h as V,i as Te,o as H}from"./vue-vendor-BVmPiw82.js";import{J as O,C as Ce,W as _e,y as Ae,S as ge,P as Le,w as Re,G as ee,a0 as Oe,d as W,a as x,M as b,F as ne,A as z,V as te,Q as Ie,l as Z,x as be,a1 as q,v as oe,t as De,B as ye,c as Ne}from"./three-CWiM2Iz1.js";import{G as Pe}from"./GalaxyBackdrop-ClWBe1Hp.js";import{_ as Me}from"./index-BzX7cb2b.js";function He(){const a=U(!1),e=U(null),t=U(null);let o=null;async function l(u){o==null||o.abort(),o=new AbortController;const h=o.signal;a.value=!0,t.value=null,e.value=null;try{const f=`SELECT TOP 1
  b.main_id, b.ra, b.dec, b.otype_txt, b.sp_type, b.plx_value,
  a.V, a.B,
  f.teff, f.log_g, f.fe_h
FROM basic AS b
LEFT JOIN allfluxes AS a ON b.oid = a.oidref
LEFT JOIN (
  SELECT oidref, teff, log_g, fe_h
  FROM mesFe_h
  WHERE mespos = 1
) AS f ON b.oid = f.oidref
WHERE b.main_id = '${u.replace(/'/g,"''")}'`,p=`https://simbad.cds.unistra.fr/simbad/sim-tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(f)}`,S=await fetch(p,{signal:h});if(!S.ok)throw new Error(`SIMBAD TAP error: ${S.statusText}`);const E=await S.json();if(E.data&&Array.isArray(E.data)&&E.data.length>0){const v=E.data[0];e.value={mainId:String(v[0]??u),ra:Number(v[1])||0,dec:Number(v[2])||0,objectType:String(v[3]??"Star"),spectralType:v[4]!=null?String(v[4]):null,parallax:typeof v[5]=="number"?v[5]:null,vMag:typeof v[6]=="number"?v[6]:null,bMag:typeof v[7]=="number"?v[7]:null,teff:typeof v[8]=="number"?v[8]:null,logg:typeof v[9]=="number"?v[9]:null,feh:typeof v[10]=="number"?v[10]:null,simbadUrl:`https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(u)}`}}else t.value="Star not found in SIMBAD"}catch(f){if(f instanceof Error&&f.name==="AbortError")return;t.value=f instanceof Error?f.message:"Unknown error"}finally{h.aborted||(a.value=!1,o=null)}}function n(){o==null||o.abort(),o=null,a.value=!1,t.value=null,e.value=null}return{loading:Y(a),star:Y(e),error:Y(t),query:l,reset:n}}const X={O:5995775,B:8101887,A:13293567,F:16316415,G:16774378,K:16765601,M:16737860,L:13386786,T:10044586,Y:6697847},we={M:.95,K:.65,G:.55,F:.35,A:.25,B:.85,O:.9,L:.2,T:.15,Y:.1},xe={O:35e3,B:2e4,A:8500,F:6500,G:5778,K:4500,M:3200,L:1800,T:1e3,Y:400};function Fe(a){if(!a)return"G";const e=a.charAt(0).toUpperCase();return X[e]!==void 0?e:"G"}function le(a){return X[a]??X.G}function Be(a){return we[a]??.5}function Ge(a){return xe[a]??5778}function P(a){let e=0;for(let t=0;t<a.length;t++){const o=a.charCodeAt(t);e=(e<<5)-e+o,e=e&e}return Math.abs(e%1e3)/1e3}const N={CORONA_SCALE:1.8,FLAME_TONGUES_SCALE:1.4,GLOW_SIZE:3,RAYS_SIZE:6,RAY_STAR_RADIUS:.08,LIGHT_INTENSITY:2,LIGHT_DISTANCE:50};function Ue(a,e,t){const o=new O(le(a)),l=e??Ge(a),n=Be(a),u=P(t);return{surface:{uStarColor:{value:o},uTime:{value:0},uTemperature:{value:l},uSeed:{value:u},uActivityLevel:{value:n}},corona:{uStarColor:{value:o},uTime:{value:0},uIntensity:{value:1},uSeed:{value:u},uActivityLevel:{value:n}},rays:{uStarColor:{value:o},uTime:{value:0},uTemperature:{value:l},uSeed:{value:u},uActivityLevel:{value:n},uStarRadius:{value:N.RAY_STAR_RADIUS}},flameTongues:{uStarColor:{value:o},uTime:{value:0},uSeed:{value:u},uActivityLevel:{value:n}},glow:{uColor:{value:o},uIntensity:{value:1},uTime:{value:0},uSeed:{value:u}}}}const G=`/**
 * Shared Noise Functions for V2 Shaders
 *
 * Provides:
 * - 2D/3D Simplex noise
 * - Value noise (faster, less quality)
 * - Fractional Brownian Motion (FBM) with domain warping
 * - Tiled noise for seamless patterns
 *
 * Based on techniques from Morgan McGuire, Inigo Quilez, and others
 */

// =============================================================================
// PRECISION QUALIFIERS (Critical for Chrome/ANGLE compatibility)
// =============================================================================
// Chrome uses ANGLE which translates WebGL to DirectX. Without explicit
// precision, floating-point errors can cause flickering artifacts.

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

// =============================================================================
// TIME UTILITIES (Prevent precision loss from large time values)
// =============================================================================

/**
 * Wrap time value to prevent floating-point precision loss
 * Large time values cause flickering in Chrome/ANGLE
 *
 * @param t - Raw time value (potentially very large)
 * @return Wrapped time in safe range [0, 1000)
 */
float wrapTime(float t) {
    return mod(t, 1000.0);
}

/**
 * Create a stable time coordinate for noise sampling
 * Combines position-based offset with wrapped time
 *
 * @param baseTime - Raw time value
 * @param spatialSeed - Position-based value to offset time
 * @return Stable time coordinate
 */
float stableTime(float baseTime, float spatialSeed) {
    return fract(baseTime * 0.001 + spatialSeed) * 100.0;
}

// =============================================================================
// MATHEMATICAL CONSTANTS
// =============================================================================

// --- Modular Arithmetic ---
const float MOD_DIVISOR = 289.0;                        // Large prime for permutation wrapping

// --- Simplex Noise Algorithm Constants ---
// Derived from the geometry of the simplex (equilateral triangle in 2D)
const float SIMPLEX_SKEW_2D = 0.366025403784439;        // (3 - sqrt(3)) / 6 - skews square to rhombus
const float SIMPLEX_UNSKEW_2D = 0.211324865405187;      // (3 - sqrt(3)) / 6 - unskews back
const float SIMPLEX_CORNER_OFFSET = -0.577350269189626; // -1 + 2 * SIMPLEX_UNSKEW_2D
const float SIMPLEX_GRADIENT_SCALE = 0.024390243902439; // 1/41 for gradient distribution

// --- Taylor Series Approximation ---
// Used for fast inverse square root in noise normalization
const float TAYLOR_INV_SQRT_A = 1.79284291400159;       // First coefficient
const float TAYLOR_INV_SQRT_B = 0.85373472095314;       // Second coefficient

// --- Noise Output Scaling ---
const float NOISE_OUTPUT_SCALE_2D = 130.0;              // Scales 2D noise to roughly [-1, 1]
const float NOISE_OUTPUT_SCALE_3D = 42.0;               // Scales 3D noise to roughly [-1, 1]

// --- Gradient Threshold ---
const float GRADIENT_FALLOFF_THRESHOLD = 0.5;           // Distance threshold for gradient contribution

// --- Hash Function Constants ---
// Prime-based stepping for 3D value noise
const vec3 HASH_STEP = vec3(110.0, 241.0, 171.0);
const float HASH_MULT = 0.011;                          // Multiplier for initial hash

// --- FBM Defaults ---
const float FBM_LACUNARITY = 2.0;                       // Frequency multiplier per octave
const float FBM_PERSISTENCE = 0.5;                      // Amplitude multiplier per octave
const int FBM_MAX_OCTAVES = 8;                          // Maximum octaves to prevent GPU hangs

// --- Domain Warping ---
const float WARP_STRENGTH = 0.5;                        // Default warp displacement strength
const float WARP_SCALE = 4.0;                           // Scale of the warping noise

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Modular arithmetic for permutation (prevents overflow)
 */
vec3 mod289_3(vec3 x) {
    return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec2 mod289_2(vec2 x) {
    return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 mod289_4(vec4 x) {
    return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

/**
 * Permutation polynomial for pseudo-random distribution
 * p(x) = (x * 34 + 1) * x mod 289
 */
vec3 permute_3(vec3 x) {
    return mod289_3(((x * 34.0) + 1.0) * x);
}

vec4 permute_4(vec4 x) {
    return mod289_4(((x * 34.0) + 1.0) * x);
}

/**
 * Fast inverse square root approximation using Taylor series
 */
vec4 taylorInvSqrt(vec4 r) {
    return TAYLOR_INV_SQRT_A - TAYLOR_INV_SQRT_B * r;
}

/**
 * Simple hash function for value noise
 */
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

// =============================================================================
// 2D SIMPLEX NOISE
// =============================================================================

/**
 * 2D Simplex noise
 * Returns value in range [-1, 1]
 *
 * @param v - 2D input coordinate
 * @return Noise value
 */
float snoise2D(vec2 v) {
    // Skew input space to determine which simplex cell we're in
    vec2 i = floor(v + dot(v, vec2(SIMPLEX_SKEW_2D)));
    vec2 x0 = v - i + dot(i, vec2(SIMPLEX_UNSKEW_2D));

    // Determine which simplex we're in (lower or upper triangle)
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

    // Offset corners
    vec4 x12 = x0.xyxy + vec4(SIMPLEX_UNSKEW_2D, SIMPLEX_UNSKEW_2D,
                              SIMPLEX_CORNER_OFFSET, SIMPLEX_CORNER_OFFSET);
    x12.xy -= i1;

    // Permutations
    i = mod289_2(i);
    vec3 p = permute_3(permute_3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

    // Calculate contribution from each corner
    vec3 m = max(GRADIENT_FALLOFF_THRESHOLD - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                                                    dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    // Gradients
    vec3 x = 2.0 * fract(p * SIMPLEX_GRADIENT_SCALE) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalize gradients
    m *= taylorInvSqrt(vec4(a0 * a0 + h * h, 0.0)).xyz;

    // Compute final noise value
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;

    return NOISE_OUTPUT_SCALE_2D * dot(m, g);
}

// =============================================================================
// 3D SIMPLEX NOISE
// =============================================================================

/**
 * 3D Simplex noise
 * Returns value in range [-1, 1]
 *
 * @param v - 3D input coordinate
 * @return Noise value
 */
float snoise3D(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289_3(i);
    vec4 p = permute_4(permute_4(permute_4(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1/7
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

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;

    return NOISE_OUTPUT_SCALE_3D * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// =============================================================================
// VALUE NOISE (faster but lower quality)
// =============================================================================

/**
 * 3D Value noise - faster than simplex, good for less critical details
 * Returns value in range [0, 1]
 *
 * @param x - 3D input coordinate
 * @return Noise value
 */
float vnoise3D(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);

    // Cubic Hermite interpolation (smoother than linear)
    f = f * f * (3.0 - 2.0 * f);

    float n = dot(i, HASH_STEP);

    return mix(
        mix(mix(hash(n + dot(HASH_STEP, vec3(0, 0, 0))),
                hash(n + dot(HASH_STEP, vec3(1, 0, 0))), f.x),
            mix(hash(n + dot(HASH_STEP, vec3(0, 1, 0))),
                hash(n + dot(HASH_STEP, vec3(1, 1, 0))), f.x), f.y),
        mix(mix(hash(n + dot(HASH_STEP, vec3(0, 0, 1))),
                hash(n + dot(HASH_STEP, vec3(1, 0, 1))), f.x),
            mix(hash(n + dot(HASH_STEP, vec3(0, 1, 1))),
                hash(n + dot(HASH_STEP, vec3(1, 1, 1))), f.x), f.y), f.z
    );
}

// =============================================================================
// TILED NOISE (for stars - based on trisomie21's technique)
// =============================================================================

// --- Tiled Noise Constants ---
const vec3 TILED_SCALE = vec3(1.0, 100.0, 10000.0);  // Scales for x, y, z components
const float TILED_SIN_SCALE = 0.001;                  // Sin input scaling
const float TILED_SIN_MULT = 100000.0;                // Sin output multiplier

/**
 * Tiled 3D noise that wraps at resolution boundaries
 * Good for seamless flame/fire effects on spheres
 * Returns value in range [-1, 1]
 *
 * @param uv - 3D input coordinate
 * @param res - Resolution for tiling
 * @return Noise value
 */
float tiledNoise3D(vec3 uv, float res) {
    uv *= res;

    vec3 uv0 = floor(mod(uv, res)) * TILED_SCALE;
    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * TILED_SCALE;

    vec3 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);  // Smoothstep interpolation

    vec4 v = vec4(uv0.x + uv0.y + uv0.z, uv1.x + uv0.y + uv0.z,
                  uv0.x + uv1.y + uv0.z, uv1.x + uv1.y + uv0.z);

    vec4 r = fract(sin(v * TILED_SIN_SCALE) * TILED_SIN_MULT);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    r = fract(sin((v + uv1.z - uv0.z) * TILED_SIN_SCALE) * TILED_SIN_MULT);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

// =============================================================================
// FRACTIONAL BROWNIAN MOTION (FBM)
// =============================================================================

/**
 * FBM using 2D Simplex noise
 * Combines multiple octaves for natural-looking patterns
 *
 * @param p - 2D input coordinate
 * @param octaves - Number of octaves (1-8)
 * @return FBM value (roughly in range [-1, 1])
 */
float fbm2D(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = FBM_PERSISTENCE;
    float frequency = 1.0;

    for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise2D(p * frequency);
        frequency *= FBM_LACUNARITY;
        amplitude *= FBM_PERSISTENCE;
    }

    return value;
}

/**
 * FBM using 3D Simplex noise
 *
 * @param p - 3D input coordinate
 * @param octaves - Number of octaves (1-8)
 * @return FBM value (roughly in range [-1, 1])
 */
float fbm3D(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = FBM_PERSISTENCE;
    float frequency = 1.0;
    vec3 shift = vec3(100.0);  // Offset per octave to reduce artifacts

    for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise3D(p * frequency);
        p += shift;
        frequency *= FBM_LACUNARITY;
        amplitude *= FBM_PERSISTENCE;
    }

    return value;
}

/**
 * FBM using value noise (faster)
 *
 * @param p - 3D input coordinate
 * @param octaves - Number of octaves (1-8)
 * @return FBM value (roughly in range [0, 1])
 */
float fbmValue3D(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = FBM_PERSISTENCE;
    float frequency = 1.0;
    vec3 shift = vec3(100.0);

    for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
        if (i >= octaves) break;
        value += amplitude * vnoise3D(p * frequency);
        p += shift;
        frequency *= FBM_LACUNARITY;
        amplitude *= FBM_PERSISTENCE;
    }

    return value;
}

// =============================================================================
// DOMAIN WARPING
// =============================================================================

/**
 * Domain-warped FBM for more organic, flowing patterns
 * Uses one noise to offset the input of another
 *
 * @param p - 3D input coordinate
 * @param octaves - Number of octaves for base FBM
 * @param warpStrength - How much to warp (0 = none, 1 = strong)
 * @return Warped FBM value
 */
float fbmWarped3D(vec3 p, int octaves, float warpStrength) {
    // First pass: generate warp offset
    vec3 q = vec3(
        fbm3D(p, 3),
        fbm3D(p + vec3(5.2, 1.3, 2.8), 3),
        fbm3D(p + vec3(1.7, 9.2, 4.1), 3)
    );

    // Second pass: sample with warped coordinates
    return fbm3D(p + q * warpStrength * WARP_SCALE, octaves);
}

/**
 * Double domain warping for even more complex patterns
 * Good for gas giant atmospheres and cloud formations
 *
 * @param p - 3D input coordinate
 * @param octaves - Number of octaves
 * @return Double-warped FBM value
 */
float fbmDoubleWarped3D(vec3 p, int octaves) {
    // First warp layer
    vec3 q = vec3(
        fbm3D(p, 4),
        fbm3D(p + vec3(5.2, 1.3, 2.8), 4),
        fbm3D(p + vec3(1.7, 9.2, 4.1), 4)
    );

    // Second warp layer
    vec3 r = vec3(
        fbm3D(p + WARP_SCALE * q + vec3(1.7, 9.2, 0.0), 4),
        fbm3D(p + WARP_SCALE * q + vec3(8.3, 2.8, 0.0), 4),
        fbm3D(p + WARP_SCALE * q + vec3(2.1, 6.4, 0.0), 4)
    );

    return fbm3D(p + WARP_SCALE * r, octaves);
}
`,F=`/**
 * Shared Color Functions for V2 Shaders
 *
 * Provides:
 * - RGB <-> HSV conversion
 * - Hue rotation
 * - Palette interpolation
 * - Color temperature (blackbody)
 * - Contrast and saturation adjustments
 */

// =============================================================================
// COLOR SPACE CONSTANTS
// =============================================================================

// --- HSV to RGB Constants ---
// These define the sector boundaries for hue mapping
const vec4 HSV_TO_RGB_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);

// --- RGB to HSV Constants ---
const vec4 RGB_TO_HSV_K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
const float RGB_TO_HSV_EPSILON = 1.0e-10;           // Prevents division by zero

// --- Hue Rotation ---
const float PI = 3.14159265359;                     // Pi constant
const float TAU = 6.28318530718;                    // 2 * PI - full hue rotation

// --- Luminance Weights ---
// sRGB luminance coefficients (ITU-R BT.709)
const vec3 LUMINANCE_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

// =============================================================================
// BLACKBODY RADIATION CONSTANTS
// =============================================================================

// Temperature ranges for blackbody approximation
// Extended to cover brown dwarfs (Y, T, L types)
const float BLACKBODY_TEMP_MIN = 300.0;             // Kelvin - ultra-cool Y-dwarf
const float BLACKBODY_TEMP_MAX = 40000.0;           // Kelvin - blue-white O-star

// Blackbody color at key temperatures (pre-computed)
// These are approximate sRGB values for stellar/substellar temperatures
// Note: T and Y dwarfs deviate from blackbody due to methane absorption

// Brown dwarfs (substellar objects)
const vec3 TEMP_300K = vec3(0.35, 0.2, 0.45);      // Dark purple (Y-dwarf, ultra-cool)
const vec3 TEMP_500K = vec3(0.5, 0.25, 0.55);      // Purple (Y-dwarf)
const vec3 TEMP_800K = vec3(0.6, 0.27, 0.65);      // Magenta-purple (T-dwarf, methane)
const vec3 TEMP_1300K = vec3(0.8, 0.3, 0.35);      // Deep red-magenta (L-dwarf boundary)

// Main sequence stars
const vec3 TEMP_2000K = vec3(1.0, 0.35, 0.1);      // Deep red (late L-dwarf/early M)
const vec3 TEMP_3000K = vec3(1.0, 0.65, 0.35);     // Orange-red (M-dwarf)
const vec3 TEMP_4000K = vec3(1.0, 0.78, 0.55);     // Orange (K-dwarf)
const vec3 TEMP_5778K = vec3(1.0, 0.96, 0.91);     // Yellow-white (Sun, G-type)
const vec3 TEMP_7500K = vec3(0.92, 0.93, 1.0);     // White (F-type)
const vec3 TEMP_10000K = vec3(0.80, 0.85, 1.0);    // Blue-white (A-type)
const vec3 TEMP_20000K = vec3(0.70, 0.78, 1.0);    // Blue (B-type)
const vec3 TEMP_40000K = vec3(0.62, 0.72, 1.0);    // Deep blue (O-type)

// Temperature boundaries for interpolation
const float TEMP_BD_1 = 500.0;   // Y to T transition
const float TEMP_BD_2 = 800.0;   // T-dwarf peak methane
const float TEMP_BD_3 = 1300.0;  // T to L transition
const float TEMP_BD_4 = 2000.0;  // L to M transition
const float TEMP_BOUND_1 = 3000.0;
const float TEMP_BOUND_2 = 4000.0;
const float TEMP_BOUND_3 = 5778.0;
const float TEMP_BOUND_4 = 7500.0;
const float TEMP_BOUND_5 = 10000.0;
const float TEMP_BOUND_6 = 20000.0;

// =============================================================================
// COLOR SPACE CONVERSION
// =============================================================================

/**
 * Convert RGB to HSV
 *
 * @param c - RGB color (0-1 range)
 * @return HSV color where H is in [0,1], S and V are in [0,1]
 */
vec3 rgb2hsv(vec3 c) {
    vec4 p = mix(vec4(c.bg, RGB_TO_HSV_K.wz), vec4(c.gb, RGB_TO_HSV_K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    return vec3(
        abs(q.z + (q.w - q.y) / (6.0 * d + RGB_TO_HSV_EPSILON)),
        d / (q.x + RGB_TO_HSV_EPSILON),
        q.x
    );
}

/**
 * Convert HSV to RGB
 *
 * @param c - HSV color where H is in [0,1], S and V are in [0,1]
 * @return RGB color (0-1 range)
 */
vec3 hsv2rgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + HSV_TO_RGB_K.xyz) * 6.0 - HSV_TO_RGB_K.www);
    return c.z * mix(HSV_TO_RGB_K.xxx, clamp(p - HSV_TO_RGB_K.xxx, 0.0, 1.0), c.y);
}

/**
 * Rotate hue by a given amount
 *
 * @param color - RGB color
 * @param amount - Rotation amount (0-1 = full rotation)
 * @return Color with rotated hue
 */
vec3 hueRotate(vec3 color, float amount) {
    vec3 hsv = rgb2hsv(color);
    hsv.x = fract(hsv.x + amount);
    return hsv2rgb(hsv);
}

/**
 * Shift hue towards a target hue
 *
 * @param color - RGB color
 * @param targetHue - Target hue (0-1)
 * @param strength - Blend strength (0 = none, 1 = full shift)
 * @return Color with shifted hue
 */
vec3 hueShift(vec3 color, float targetHue, float strength) {
    vec3 hsv = rgb2hsv(color);
    hsv.x = mix(hsv.x, targetHue, strength);
    return hsv2rgb(hsv);
}

// =============================================================================
// SATURATION AND CONTRAST
// =============================================================================

/**
 * Calculate luminance of an RGB color
 * Named with v2_ prefix to avoid conflicts with THREE.js built-ins
 *
 * @param color - RGB color
 * @return Luminance value (0-1)
 */
float v2_luminance(vec3 color) {
    return dot(color, LUMINANCE_WEIGHTS);
}

/**
 * Adjust saturation of a color
 *
 * @param color - RGB color
 * @param amount - Saturation multiplier (0 = grayscale, 1 = unchanged, >1 = more saturated)
 * @return Color with adjusted saturation
 */
vec3 adjustSaturation(vec3 color, float amount) {
    float lum = v2_luminance(color);
    return mix(vec3(lum), color, amount);
}

/**
 * Adjust contrast of a color
 *
 * @param color - RGB color
 * @param amount - Contrast multiplier (0 = flat gray, 1 = unchanged, >1 = more contrast)
 * @return Color with adjusted contrast
 */
vec3 adjustContrast(vec3 color, float amount) {
    return (color - 0.5) * amount + 0.5;
}

/**
 * Apply gamma correction
 *
 * @param color - Linear RGB color
 * @param gamma - Gamma value (2.2 for sRGB)
 * @return Gamma-corrected color
 */
vec3 gammaCorrect(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}

// =============================================================================
// BLACKBODY / TEMPERATURE TO COLOR
// =============================================================================

/**
 * Convert temperature (Kelvin) to approximate RGB color
 * Uses piecewise linear interpolation between key stellar temperatures
 * Extended to cover brown dwarfs (Y, T, L types) with methane absorption colors
 *
 * @param tempK - Temperature in Kelvin (300-40000 range)
 * @return RGB color approximation
 */
vec3 temperatureToColor(float tempK) {
    tempK = clamp(tempK, BLACKBODY_TEMP_MIN, BLACKBODY_TEMP_MAX);

    // Brown dwarf range (Y, T, L types) - non-blackbody due to methane
    if (tempK < TEMP_BD_1) {
        // Ultra-cool Y-dwarfs (300-500 K)
        float t = (tempK - BLACKBODY_TEMP_MIN) / (TEMP_BD_1 - BLACKBODY_TEMP_MIN);
        return mix(TEMP_300K, TEMP_500K, t);
    } else if (tempK < TEMP_BD_2) {
        // T-dwarfs with methane absorption (500-800 K) - peak magenta
        float t = (tempK - TEMP_BD_1) / (TEMP_BD_2 - TEMP_BD_1);
        return mix(TEMP_500K, TEMP_800K, t);
    } else if (tempK < TEMP_BD_3) {
        // Late T to early L transition (800-1300 K)
        float t = (tempK - TEMP_BD_2) / (TEMP_BD_3 - TEMP_BD_2);
        return mix(TEMP_800K, TEMP_1300K, t);
    } else if (tempK < TEMP_BD_4) {
        // L-dwarfs (1300-2000 K) - transitioning to red
        float t = (tempK - TEMP_BD_3) / (TEMP_BD_4 - TEMP_BD_3);
        return mix(TEMP_1300K, TEMP_2000K, t);
    } else if (tempK < TEMP_BOUND_1) {
        // Late L to M transition (2000-3000 K)
        float t = (tempK - TEMP_BD_4) / (TEMP_BOUND_1 - TEMP_BD_4);
        return mix(TEMP_2000K, TEMP_3000K, t);
    }
    // Main sequence stars
    else if (tempK < TEMP_BOUND_2) {
        float t = (tempK - TEMP_BOUND_1) / (TEMP_BOUND_2 - TEMP_BOUND_1);
        return mix(TEMP_3000K, TEMP_4000K, t);
    } else if (tempK < TEMP_BOUND_3) {
        float t = (tempK - TEMP_BOUND_2) / (TEMP_BOUND_3 - TEMP_BOUND_2);
        return mix(TEMP_4000K, TEMP_5778K, t);
    } else if (tempK < TEMP_BOUND_4) {
        float t = (tempK - TEMP_BOUND_3) / (TEMP_BOUND_4 - TEMP_BOUND_3);
        return mix(TEMP_5778K, TEMP_7500K, t);
    } else if (tempK < TEMP_BOUND_5) {
        float t = (tempK - TEMP_BOUND_4) / (TEMP_BOUND_5 - TEMP_BOUND_4);
        return mix(TEMP_7500K, TEMP_10000K, t);
    } else if (tempK < TEMP_BOUND_6) {
        float t = (tempK - TEMP_BOUND_5) / (TEMP_BOUND_6 - TEMP_BOUND_5);
        return mix(TEMP_10000K, TEMP_20000K, t);
    } else {
        float t = (tempK - TEMP_BOUND_6) / (BLACKBODY_TEMP_MAX - TEMP_BOUND_6);
        return mix(TEMP_20000K, TEMP_40000K, t);
    }
}

/**
 * Get star color tint based on host star temperature
 * Returns a subtle tint to apply to planet surfaces
 * Preserves brightness while shifting hue for cool/hot stars
 *
 * @param starTempK - Star temperature in Kelvin
 * @return RGB tint color (multiply with surface color)
 */
vec3 starLightTint(float starTempK) {
    vec3 starColor = temperatureToColor(starTempK);

    // Normalize to preserve brightness (cool stars shouldn't darken planets)
    float maxComp = max(starColor.r, max(starColor.g, starColor.b));
    vec3 normalizedStar = starColor / maxComp;

    // Very subtle tinting - just shifts the hue slightly
    vec3 tint = mix(vec3(1.0), normalizedStar, 0.25);

    // Boost brightness for cool stars (M-dwarfs like TRAPPIST-1)
    // They emit less visible light, but planets shouldn't appear too dark
    float coolBoost = smoothstep(4000.0, 2500.0, starTempK) * 0.15;
    tint += vec3(coolBoost);

    return tint;
}

// =============================================================================
// PALETTE INTERPOLATION
// =============================================================================

/**
 * Cosine gradient palette (Inigo Quilez technique)
 * Creates smooth, customizable color gradients
 *
 * @param t - Input value (0-1)
 * @param a - Base color (center of palette)
 * @param b - Amplitude (color range)
 * @param c - Frequency (oscillation speed)
 * @param d - Phase (starting point)
 * @return RGB color from palette
 */
vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(TAU * (c * t + d));
}

/**
 * Preset: Sunset/lava palette
 */
vec3 paletteLava(float t) {
    return cosinePalette(t,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 0.7, 0.4),
        vec3(0.0, 0.15, 0.20)
    );
}

/**
 * Preset: Ocean/ice palette
 */
vec3 paletteOcean(float t) {
    return cosinePalette(t,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 1.0),
        vec3(0.0, 0.10, 0.20)
    );
}

/**
 * Preset: Forest/vegetation palette
 */
vec3 paletteForest(float t) {
    return cosinePalette(t,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 0.5),
        vec3(0.8, 0.90, 0.30)
    );
}

/**
 * Preset: Gas giant bands palette
 */
vec3 paletteGasGiant(float t) {
    return cosinePalette(t,
        vec3(0.6, 0.5, 0.4),
        vec3(0.3, 0.25, 0.2),
        vec3(1.0, 1.0, 1.0),
        vec3(0.0, 0.05, 0.10)
    );
}

// =============================================================================
// COLOR BLENDING
// =============================================================================

/**
 * Blend two colors using soft light blending mode
 * Good for subtle color overlays
 *
 * @param base - Base color
 * @param blend - Blend color
 * @return Blended color
 */
vec3 softLight(vec3 base, vec3 blend) {
    return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
        step(0.5, blend)
    );
}

/**
 * Blend two colors using overlay blending mode
 * Increases contrast
 *
 * @param base - Base color
 * @param blend - Blend color
 * @return Blended color
 */
vec3 overlay(vec3 base, vec3 blend) {
    return mix(
        2.0 * base * blend,
        1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
        step(0.5, base)
    );
}

// =============================================================================
// PHYSICAL COLOR GENERATION
// =============================================================================

// Temperature gradient colors (cold to hot)
const vec3 PHYS_TEMP_COLD = vec3(0.6, 0.75, 0.9);      // Icy blue
const vec3 PHYS_TEMP_COOL = vec3(0.5, 0.6, 0.65);      // Cool gray-blue
const vec3 PHYS_TEMP_MILD = vec3(0.55, 0.5, 0.45);     // Earthy gray
const vec3 PHYS_TEMP_WARM = vec3(0.7, 0.55, 0.4);      // Warm tan
const vec3 PHYS_TEMP_HOT = vec3(0.85, 0.45, 0.3);      // Hot orange

// Composition gradient colors (gas to rock)
const vec3 PHYS_COMP_GAS = vec3(0.75, 0.7, 0.6);       // Gas giant tan
const vec3 PHYS_COMP_ICE = vec3(0.65, 0.7, 0.8);       // Ice blue-gray
const vec3 PHYS_COMP_ROCK = vec3(0.6, 0.5, 0.45);      // Rocky brown

/**
 * Generate physically-accurate base color from planet properties
 * Uses NASA data factors to create data-driven variety
 *
 * @param tempFactor - Temperature factor (0 = cold/200K, 1 = hot/2500K)
 * @param compFactor - Composition factor (0 = gas, 0.5 = ice, 1 = rock)
 * @param irradFactor - Irradiation factor (0 = dim, 1 = bright)
 * @param metalFactor - Metallicity factor (0 = metal-poor, 1 = metal-rich)
 * @param seed - Seed for variation (0-1)
 * @return RGB base color
 */
vec3 physicalPlanetColor(float tempFactor, float compFactor, float irradFactor, float metalFactor, float seed) {
    // Temperature gradient: cold (blue) to hot (orange/red)
    vec3 tempColor;
    if (tempFactor < 0.25) {
        tempColor = mix(PHYS_TEMP_COLD, PHYS_TEMP_COOL, tempFactor * 4.0);
    } else if (tempFactor < 0.5) {
        tempColor = mix(PHYS_TEMP_COOL, PHYS_TEMP_MILD, (tempFactor - 0.25) * 4.0);
    } else if (tempFactor < 0.75) {
        tempColor = mix(PHYS_TEMP_MILD, PHYS_TEMP_WARM, (tempFactor - 0.5) * 4.0);
    } else {
        tempColor = mix(PHYS_TEMP_WARM, PHYS_TEMP_HOT, (tempFactor - 0.75) * 4.0);
    }

    // Composition gradient: gas (tan) to ice (blue) to rock (brown)
    vec3 compColor;
    if (compFactor < 0.5) {
        compColor = mix(PHYS_COMP_GAS, PHYS_COMP_ICE, compFactor * 2.0);
    } else {
        compColor = mix(PHYS_COMP_ICE, PHYS_COMP_ROCK, (compFactor - 0.5) * 2.0);
    }

    // Blend temperature and composition (temperature dominant for extremes)
    float tempWeight = abs(tempFactor - 0.5) * 2.0; // 0 at middle, 1 at extremes
    vec3 baseColor = mix(compColor, tempColor, tempWeight * 0.7 + 0.3);

    // Metallicity affects color saturation and warmth
    // High metallicity = warmer, more saturated colors
    vec3 baseHSV = rgb2hsv(baseColor);
    baseHSV.y *= 0.8 + metalFactor * 0.4;  // Saturation: 0.8-1.2
    baseHSV.x += (metalFactor - 0.5) * 0.05; // Slight hue shift
    baseColor = hsv2rgb(baseHSV);

    // Irradiation affects brightness
    // High irradiation = brighter, slightly washed out
    baseColor = mix(baseColor, baseColor * 1.2 + vec3(0.05), irradFactor * 0.3);

    // Add seed-based variation for uniqueness
    vec3 seedHSV = rgb2hsv(baseColor);
    float seedHue = fract(seed * 0.1031 + seed * seed * 0.0973);
    seedHSV.x = fract(seedHSV.x + (seedHue - 0.5) * 0.1); // ±5% hue variation
    seedHSV.y *= 0.9 + seedHue * 0.2; // ±10% saturation variation

    return hsv2rgb(seedHSV);
}
`,B=`/**
 * Seed-Based Variation Functions for V2 Shaders
 *
 * Provides consistent, deterministic variation based on planet seed.
 * Same seed always produces same appearance, different seeds look distinct.
 *
 * Provides:
 * - Scale variation
 * - Rotation/phase offsets
 * - Color shifting
 * - Feature toggles
 * - Coordinate warping
 *
 * REQUIRES: color.glsl must be included before this file (provides TAU constant)
 */

// =============================================================================
// SEED VARIATION CONSTANTS
// =============================================================================

// --- Scale Variation ---
const float SCALE_MIN = 0.7;           // Minimum feature scale
const float SCALE_MAX = 1.4;           // Maximum feature scale
const float SCALE_RANGE = 0.7;         // SCALE_MAX - SCALE_MIN

// --- Rotation/Phase ---
// TAU is defined in color.glsl
const float PHASE_RANGE = 100.0;       // Range for noise phase offset

// --- Color Variation ---
const float HUE_SHIFT_MAX = 0.15;      // Maximum hue rotation (15% of spectrum)
const float SAT_SHIFT_MIN = 0.85;      // Minimum saturation multiplier
const float SAT_SHIFT_RANGE = 0.3;     // Saturation variation range
const float VAL_SHIFT_MIN = 0.9;       // Minimum value/brightness multiplier
const float VAL_SHIFT_RANGE = 0.2;     // Value variation range

// --- Feature Probability ---
// Thresholds for seed-based feature toggles
const float FEATURE_RARE = 0.15;        // ~15% chance
const float FEATURE_UNCOMMON = 0.35;    // ~35% chance
const float FEATURE_COMMON = 0.65;      // ~65% chance
const float FEATURE_VERY_COMMON = 0.85; // ~85% chance

// --- Coordinate Warping ---
const float UV_OFFSET_SCALE = 10.0;     // Scale for UV coordinate offset

// --- Hash Constants ---
// Using integer-based constants for stable hashing (avoids sin() precision issues)
const float HASH_K1 = 0.1031;
const float HASH_K2 = 0.1030;
const float HASH_K3 = 0.0973;
const float HASH_K4 = 33.33;

// =============================================================================
// SEED HASHING
// =============================================================================

/**
 * Generate a pseudo-random value from seed
 * Same seed always returns same value
 *
 * Uses integer-based hashing instead of sin() to avoid Chrome/ANGLE
 * floating-point precision issues that cause flickering.
 *
 * @param seed - Input seed (0-1)
 * @return Pseudo-random value (0-1)
 */
float seedHash(float seed) {
    // Use fract-based hash (Dave Hoskins' technique) - avoids sin() precision issues
    vec3 p3 = fract(vec3(seed) * vec3(HASH_K1, HASH_K2, HASH_K3));
    p3 += dot(p3, p3.yzx + HASH_K4);
    return fract((p3.x + p3.y) * p3.z);
}

/**
 * Generate multiple independent values from one seed
 * Uses different offsets to create uncorrelated outputs
 *
 * @param seed - Input seed (0-1)
 * @param index - Which value to generate (0, 1, 2, ...)
 * @return Pseudo-random value (0-1)
 */
float seedHashN(float seed, float index) {
    return seedHash(seed * (index + 1.0) + index * 0.123);
}

/**
 * Generate a vec2 from seed
 *
 * @param seed - Input seed (0-1)
 * @return Pseudo-random vec2 (each component 0-1)
 */
vec2 seedHash2(float seed) {
    return vec2(
        seedHashN(seed, 0.0),
        seedHashN(seed, 1.0)
    );
}

/**
 * Generate a vec3 from seed
 *
 * @param seed - Input seed (0-1)
 * @return Pseudo-random vec3 (each component 0-1)
 */
vec3 seedHash3(float seed) {
    return vec3(
        seedHashN(seed, 0.0),
        seedHashN(seed, 1.0),
        seedHashN(seed, 2.0)
    );
}

// =============================================================================
// SCALE VARIATION
// =============================================================================

/**
 * Get feature scale multiplier from seed
 * Varies feature sizes while maintaining visual coherence
 *
 * @param seed - Planet seed (0-1)
 * @return Scale multiplier (SCALE_MIN to SCALE_MAX)
 */
float seedScale(float seed) {
    return SCALE_MIN + seedHash(seed) * SCALE_RANGE;
}

/**
 * Get multiple scale factors for layered features
 *
 * @param seed - Planet seed (0-1)
 * @return vec3 of scale multipliers for different layers
 */
vec3 seedScales(float seed) {
    return vec3(
        SCALE_MIN + seedHashN(seed, 0.0) * SCALE_RANGE,
        SCALE_MIN + seedHashN(seed, 1.0) * SCALE_RANGE,
        SCALE_MIN + seedHashN(seed, 2.0) * SCALE_RANGE
    );
}

// =============================================================================
// ROTATION / PHASE VARIATION
// =============================================================================

/**
 * Get rotation angle from seed
 * For rotating textures/features
 *
 * @param seed - Planet seed (0-1)
 * @return Rotation angle in radians (0 to 2*PI)
 */
float seedRotation(float seed) {
    return seedHash(seed + 0.5) * TAU;
}

/**
 * Get noise phase offset from seed
 * Shifts where patterns appear on the surface
 *
 * @param seed - Planet seed (0-1)
 * @return Phase offset value
 */
float seedPhase(float seed) {
    return seedHash(seed + 0.7) * PHASE_RANGE;
}

/**
 * Get 3D phase offset for noise sampling
 *
 * @param seed - Planet seed (0-1)
 * @return 3D offset vector
 */
vec3 seedPhase3D(float seed) {
    return seedHash3(seed + 0.7) * PHASE_RANGE;
}

/**
 * Rotate 2D coordinates by seed-derived angle
 *
 * @param uv - Input coordinates
 * @param seed - Planet seed (0-1)
 * @return Rotated coordinates
 */
vec2 seedRotateUV(vec2 uv, float seed) {
    float angle = seedRotation(seed);
    float c = cos(angle);
    float s = sin(angle);
    return vec2(
        c * uv.x - s * uv.y,
        s * uv.x + c * uv.y
    );
}

/**
 * Rotate a 3D vector by seed-derived angles
 * Applies rotation around Y axis (longitude) and X axis (latitude tilt)
 * This is used to transform sphere positions for seamless noise sampling
 *
 * @param v - Input 3D vector (typically normalized position on sphere)
 * @param seed - Planet seed (0-1)
 * @return Rotated 3D vector
 */
vec3 rotateVectorBySeed(vec3 v, float seed) {
    // Get two rotation angles from seed
    float angleY = seedHashN(seed, 5.0) * TAU;  // Rotation around Y
    float angleX = (seedHashN(seed, 6.0) - 0.5) * 1.5;  // Slight tilt (-0.75 to 0.75 rad)

    // Rotate around Y axis first
    float cy = cos(angleY);
    float sy = sin(angleY);
    vec3 rotY = vec3(
        cy * v.x + sy * v.z,
        v.y,
        -sy * v.x + cy * v.z
    );

    // Then rotate around X axis for tilt
    float cx = cos(angleX);
    float sx = sin(angleX);
    return vec3(
        rotY.x,
        cx * rotY.y - sx * rotY.z,
        sx * rotY.y + cx * rotY.z
    );
}

// =============================================================================
// COLOR VARIATION
// =============================================================================

/**
 * Get hue shift amount from seed
 *
 * @param seed - Planet seed (0-1)
 * @return Hue shift (0 to HUE_SHIFT_MAX)
 */
float seedHueShift(float seed) {
    // Use signed shift for variety (can shift either direction)
    return (seedHash(seed + 0.3) - 0.5) * 2.0 * HUE_SHIFT_MAX;
}

/**
 * Get saturation multiplier from seed
 *
 * @param seed - Planet seed (0-1)
 * @return Saturation multiplier (SAT_SHIFT_MIN to SAT_SHIFT_MIN + SAT_SHIFT_RANGE)
 */
float seedSaturation(float seed) {
    return SAT_SHIFT_MIN + seedHash(seed + 0.4) * SAT_SHIFT_RANGE;
}

/**
 * Get value/brightness multiplier from seed
 *
 * @param seed - Planet seed (0-1)
 * @return Value multiplier (VAL_SHIFT_MIN to VAL_SHIFT_MIN + VAL_SHIFT_RANGE)
 */
float seedValue(float seed) {
    return VAL_SHIFT_MIN + seedHash(seed + 0.6) * VAL_SHIFT_RANGE;
}

/**
 * Apply seed-based color variation to HSV color
 *
 * @param hsv - Input HSV color
 * @param seed - Planet seed (0-1)
 * @return Modified HSV color
 */
vec3 seedVaryHSV(vec3 hsv, float seed) {
    hsv.x = fract(hsv.x + seedHueShift(seed));
    hsv.y *= seedSaturation(seed);
    hsv.z *= seedValue(seed);
    return hsv;
}

/**
 * Blend between two colors based on seed
 *
 * @param colorA - First color
 * @param colorB - Second color
 * @param seed - Planet seed (0-1)
 * @return Blended color
 */
vec3 seedBlendColors(vec3 colorA, vec3 colorB, float seed) {
    return mix(colorA, colorB, seedHash(seed + 0.8));
}

// =============================================================================
// FEATURE TOGGLES
// =============================================================================

/**
 * Check if a rare feature should appear
 * ~15% chance based on seed
 *
 * @param seed - Planet seed (0-1)
 * @param featureIndex - Which feature to check
 * @return true if feature should appear
 */
bool seedHasRareFeature(float seed, float featureIndex) {
    return seedHashN(seed, featureIndex + 10.0) < FEATURE_RARE;
}

/**
 * Check if an uncommon feature should appear
 * ~35% chance based on seed
 *
 * @param seed - Planet seed (0-1)
 * @param featureIndex - Which feature to check
 * @return true if feature should appear
 */
bool seedHasUncommonFeature(float seed, float featureIndex) {
    return seedHashN(seed, featureIndex + 10.0) < FEATURE_UNCOMMON;
}

/**
 * Check if a common feature should appear
 * ~65% chance based on seed
 *
 * @param seed - Planet seed (0-1)
 * @param featureIndex - Which feature to check
 * @return true if feature should appear
 */
bool seedHasCommonFeature(float seed, float featureIndex) {
    return seedHashN(seed, featureIndex + 10.0) < FEATURE_COMMON;
}

/**
 * Get a feature intensity (0-1) from seed
 * For features that vary in strength
 *
 * @param seed - Planet seed (0-1)
 * @param featureIndex - Which feature
 * @return Intensity value (0-1)
 */
float seedFeatureIntensity(float seed, float featureIndex) {
    return seedHashN(seed, featureIndex + 20.0);
}

// =============================================================================
// COORDINATE VARIATION
// =============================================================================

/**
 * Offset UV coordinates based on seed
 * Makes each planet start at a different "location"
 *
 * @param uv - Input UV coordinates
 * @param seed - Planet seed (0-1)
 * @return Offset UV coordinates
 */
vec2 seedOffsetUV(vec2 uv, float seed) {
    vec2 offset = seedHash2(seed) * UV_OFFSET_SCALE;
    return uv + offset;
}

/**
 * Offset 3D coordinates based on seed
 * For 3D noise sampling
 *
 * @param pos - Input 3D position
 * @param seed - Planet seed (0-1)
 * @return Offset position
 */
vec3 seedOffset3D(vec3 pos, float seed) {
    vec3 offset = seedHash3(seed) * UV_OFFSET_SCALE;
    return pos + offset;
}

/**
 * Apply full coordinate variation
 * Combines offset and rotation for maximum variation
 *
 * @param uv - Input UV coordinates
 * @param seed - Planet seed (0-1)
 * @return Transformed UV coordinates
 */
vec2 seedTransformUV(vec2 uv, float seed) {
    // First offset
    vec2 transformed = seedOffsetUV(uv, seed);
    // Then rotate
    transformed = seedRotateUV(transformed, seed);
    return transformed;
}

// =============================================================================
// BAND / STRIPE VARIATION (for gas giants)
// =============================================================================

/**
 * Get band count multiplier from seed
 * Varies number of atmospheric bands
 *
 * @param seed - Planet seed (0-1)
 * @param baseCount - Base number of bands
 * @return Modified band count (as float for smooth variation)
 */
float seedBandCount(float seed, float baseCount) {
    float variation = seedHash(seed + 0.9) * 0.6 + 0.7;  // 0.7 to 1.3x
    return baseCount * variation;
}

/**
 * Get band width variation from seed
 * Makes some bands thicker/thinner
 *
 * @param seed - Planet seed (0-1)
 * @param latitude - Latitude on planet (-1 to 1)
 * @return Width multiplier for band at this latitude
 */
float seedBandWidth(float seed, float latitude) {
    // Use latitude to vary which bands are affected
    float localSeed = seedHash(seed + latitude * 3.0);
    return 0.5 + localSeed;  // 0.5 to 1.5x width
}

// =============================================================================
// STORM / SPOT VARIATION (for gas giants)
// =============================================================================

/**
 * Get storm position based on seed
 * Returns latitude/longitude for a storm feature
 *
 * @param seed - Planet seed (0-1)
 * @param stormIndex - Which storm (0, 1, 2, ...)
 * @return vec2(latitude, longitude) normalized to 0-1
 */
vec2 seedStormPosition(float seed, float stormIndex) {
    float lat = seedHashN(seed, stormIndex * 2.0);
    float lon = seedHashN(seed, stormIndex * 2.0 + 1.0);
    // Bias storms towards mid-latitudes (more realistic)
    lat = 0.2 + lat * 0.6;  // 0.2 to 0.8
    return vec2(lat, lon);
}

/**
 * Get storm size based on seed
 *
 * @param seed - Planet seed (0-1)
 * @param stormIndex - Which storm
 * @return Storm size multiplier
 */
float seedStormSize(float seed, float stormIndex) {
    return 0.02 + seedHashN(seed, stormIndex + 30.0) * 0.08;  // 2% to 10% of surface
}
`,ce=`/**
 * Shared Lighting Functions for V2 Shaders
 *
 * Provides:
 * - Fresnel / rim lighting
 * - Limb darkening (realistic edge falloff)
 * - Specular highlights
 * - Atmospheric scattering approximation
 * - Star lighting calculations
 */

// =============================================================================
// LIGHTING CONSTANTS
// =============================================================================

// --- Fresnel ---
const float FRESNEL_BIAS = 0.0;                             // Minimum reflectivity
const float FRESNEL_SCALE = 1.0;                            // Reflectivity range
const float FRESNEL_POWER = 5.0;                            // Default Fresnel exponent (Schlick approximation)

// --- Limb Darkening ---
// Coefficients for realistic stellar/planetary limb darkening
// Based on Claret (2000) solar limb darkening model
const float LIMB_COEFF_LINEAR = 0.6;                        // Linear limb darkening coefficient
const float LIMB_COEFF_QUAD = 0.0;                          // Quadratic coefficient (set to 0 for linear model)
// Note: LIMB_MIN_BRIGHTNESS is defined per-shader to allow custom values

// --- Specular ---
const float SPECULAR_POWER_DEFAULT = 32.0;                  // Default shininess
const float SPECULAR_INTENSITY_DEFAULT = 0.5;               // Default specular intensity

// --- Atmospheric Scattering ---
// Rayleigh scattering coefficients (wavelength-dependent)
const vec3 RAYLEIGH_COEFFS = vec3(0.0025, 0.0060, 0.0150);  // RGB scattering strengths
const float ATMOSPHERE_DENSITY_SCALE = 8.0;                 // Scale height factor
const float ATMOSPHERE_FALLOFF = 2.5;                       // Edge falloff power

// --- View Direction ---
// Default camera view direction (looking at object from +Z)
const vec3 DEFAULT_VIEW_DIR = vec3(0.0, 0.0, 1.0);

// =============================================================================
// FRESNEL / RIM LIGHTING
// =============================================================================

/**
 * Schlick's Fresnel approximation
 * Models increased reflectivity at grazing angles
 *
 * @param viewDir - Normalized view direction
 * @param normal - Surface normal
 * @return Fresnel factor (0 = facing, 1 = grazing)
 */
float fresnel(vec3 viewDir, vec3 normal) {
    float dotVN = max(dot(viewDir, normal), 0.0);
    return FRESNEL_BIAS + FRESNEL_SCALE * pow(1.0 - dotVN, FRESNEL_POWER);
}

/**
 * Fresnel with customizable power
 *
 * @param viewDir - Normalized view direction
 * @param normal - Surface normal
 * @param power - Exponent (higher = sharper edge)
 * @return Fresnel factor
 */
float fresnelCustom(vec3 viewDir, vec3 normal, float power) {
    float dotVN = max(dot(viewDir, normal), 0.0);
    return pow(1.0 - dotVN, power);
}

/**
 * Rim lighting effect
 * Highlights edges of objects for dramatic effect
 *
 * @param normal - Surface normal
 * @param rimColor - Color of the rim light
 * @param power - Rim tightness (higher = thinner rim)
 * @param intensity - Rim brightness
 * @return RGB rim light contribution
 */
vec3 rimLight(vec3 normal, vec3 rimColor, float power, float intensity) {
    float rim = fresnelCustom(DEFAULT_VIEW_DIR, normal, power);
    return rimColor * rim * intensity;
}

// =============================================================================
// LIMB DARKENING
// =============================================================================

/**
 * Linear limb darkening model
 * Models how stars and planets appear darker at edges
 *
 * @param normal - Surface normal
 * @param viewDir - View direction
 * @return Darkening factor (0-1, 1 = center, lower = edge)
 */
float limbDarkeningLinear(vec3 normal, vec3 viewDir) {
    float mu = max(dot(normal, viewDir), 0.0);  // Cosine of angle from center
    return 1.0 - LIMB_COEFF_LINEAR * (1.0 - mu);
}

/**
 * Quadratic limb darkening model (more accurate)
 *
 * @param normal - Surface normal
 * @param viewDir - View direction
 * @param u - Linear coefficient
 * @param v - Quadratic coefficient
 * @return Darkening factor
 */
float limbDarkeningQuad(vec3 normal, vec3 viewDir, float u, float v) {
    float mu = max(dot(normal, viewDir), 0.0);
    float muSqrt = sqrt(mu);
    return 1.0 - u * (1.0 - mu) - v * (1.0 - muSqrt);
}

/**
 * Stylized limb darkening with smoothstep
 * Provides artistic control over the falloff curve
 *
 * @param normal - Surface normal
 * @param edgeLow - Where darkening starts (0 = center, 1 = edge)
 * @param edgeHigh - Where full darkness is reached
 * @param minBrightness - Minimum brightness at limb
 * @return Brightness factor
 */
float limbDarkeningStylized(vec3 normal, float edgeLow, float edgeHigh, float minBrightness) {
    float facing = dot(normal, DEFAULT_VIEW_DIR);
    float bright = smoothstep(edgeLow, edgeHigh, facing);
    return minBrightness + bright * (1.0 - minBrightness);
}

// =============================================================================
// SPECULAR HIGHLIGHTS
// =============================================================================

/**
 * Blinn-Phong specular highlight
 *
 * @param normal - Surface normal
 * @param viewDir - View direction
 * @param lightDir - Light direction
 * @param shininess - Specular power (higher = tighter highlight)
 * @return Specular intensity
 */
float specularBlinn(vec3 normal, vec3 viewDir, vec3 lightDir, float shininess) {
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = max(dot(normal, halfDir), 0.0);
    return pow(spec, shininess);
}

/**
 * Phong specular highlight
 *
 * @param normal - Surface normal
 * @param viewDir - View direction
 * @param lightDir - Light direction
 * @param shininess - Specular power
 * @return Specular intensity
 */
float specularPhong(vec3 normal, vec3 viewDir, vec3 lightDir, float shininess) {
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = max(dot(viewDir, reflectDir), 0.0);
    return pow(spec, shininess);
}

// =============================================================================
// ATMOSPHERIC EFFECTS
// =============================================================================

/**
 * Simple atmospheric haze based on view angle
 * Creates glowing edge effect for planets with atmospheres
 *
 * @param normal - Surface normal
 * @param atmosphereStrength - 0 = no atmosphere, 1 = thick
 * @param hazeColor - Color of atmospheric haze
 * @return RGB haze contribution
 */
vec3 atmosphericHaze(vec3 normal, float atmosphereStrength, vec3 hazeColor) {
    float edgeFactor = 1.0 - abs(dot(normal, DEFAULT_VIEW_DIR));
    float haze = pow(edgeFactor, ATMOSPHERE_FALLOFF) * atmosphereStrength;
    return hazeColor * haze;
}

/**
 * Rayleigh-like scattering approximation
 * Blue light scatters more than red
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to light source
 * @param atmosphereStrength - Atmosphere thickness (0-1)
 * @return RGB scattering color
 */
vec3 rayleighScatter(vec3 normal, vec3 lightDir, float atmosphereStrength) {
    float edgeFactor = 1.0 - abs(dot(normal, DEFAULT_VIEW_DIR));
    float sunAngle = max(dot(normal, lightDir), 0.0);

    // Blue scatters more at edges, especially when lit
    vec3 scatter = RAYLEIGH_COEFFS * pow(edgeFactor, 2.0) * sunAngle;
    return scatter * atmosphereStrength * ATMOSPHERE_DENSITY_SCALE;
}

/**
 * Sunset/sunrise coloring at terminator
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to light source
 * @param atmosphereStrength - Atmosphere thickness
 * @return RGB sunset contribution
 */
vec3 terminatorGlow(vec3 normal, vec3 lightDir, float atmosphereStrength) {
    float sunAngle = dot(normal, lightDir);
    // Sunset occurs in a narrow band around terminator
    float sunsetZone = smoothstep(-0.15, 0.0, sunAngle) * smoothstep(0.15, 0.0, sunAngle);
    float edgeFactor = 1.0 - abs(dot(normal, DEFAULT_VIEW_DIR));

    // Orange/red color at terminator
    vec3 sunsetColor = vec3(1.0, 0.4, 0.1);
    return sunsetColor * sunsetZone * edgeFactor * atmosphereStrength * 2.0;
}

// =============================================================================
// DIFFUSE LIGHTING
// =============================================================================

/**
 * Lambertian diffuse lighting
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to light
 * @return Diffuse factor (0-1)
 */
float diffuseLambert(vec3 normal, vec3 lightDir) {
    return max(dot(normal, lightDir), 0.0);
}

/**
 * Half-Lambert diffuse (softer shadows)
 * Wraps lighting around object more
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to light
 * @return Diffuse factor (0.25-1)
 */
float diffuseHalfLambert(vec3 normal, vec3 lightDir) {
    float d = dot(normal, lightDir);
    return d * 0.5 + 0.5;  // Remap -1,1 to 0,1
}

/**
 * Wrapped diffuse lighting
 * Allows light to wrap around object by specified amount
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to light
 * @param wrap - Wrap amount (0 = standard, 1 = full wrap)
 * @return Diffuse factor
 */
float diffuseWrap(vec3 normal, vec3 lightDir, float wrap) {
    float d = dot(normal, lightDir);
    return max((d + wrap) / (1.0 + wrap), 0.0);
}

// =============================================================================
// COMPOSITE LIGHTING
// =============================================================================

/**
 * Complete surface lighting calculation
 * Combines diffuse, specular, rim, and limb darkening
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to primary light
 * @param baseColor - Surface albedo
 * @param lightColor - Light color
 * @param shininess - Specular power
 * @param ambientStrength - Ambient light level
 * @return Lit surface color
 */
vec3 surfaceLighting(
    vec3 normal,
    vec3 lightDir,
    vec3 baseColor,
    vec3 lightColor,
    float shininess,
    float ambientStrength
) {
    // Diffuse
    float diff = diffuseLambert(normal, lightDir);
    vec3 diffuse = baseColor * lightColor * diff;

    // Specular
    float spec = specularBlinn(normal, DEFAULT_VIEW_DIR, lightDir, shininess);
    vec3 specular = lightColor * spec * SPECULAR_INTENSITY_DEFAULT;

    // Ambient
    vec3 ambient = baseColor * ambientStrength;

    // Limb darkening
    float limb = limbDarkeningLinear(normal, DEFAULT_VIEW_DIR);

    return (ambient + diffuse + specular) * limb;
}

/**
 * Planet surface lighting with atmosphere
 *
 * @param normal - Surface normal
 * @param lightDir - Direction to star
 * @param baseColor - Surface color
 * @param lightColor - Star color
 * @param atmosphereStrength - Atmosphere thickness (0-1)
 * @param atmosphereColor - Atmosphere tint color
 * @return Final lit color with atmospheric effects
 */
vec3 planetLighting(
    vec3 normal,
    vec3 lightDir,
    vec3 baseColor,
    vec3 lightColor,
    float atmosphereStrength,
    vec3 atmosphereColor
) {
    // Base surface lighting
    vec3 lit = surfaceLighting(normal, lightDir, baseColor, lightColor, SPECULAR_POWER_DEFAULT, 0.05);

    // Add atmospheric effects
    vec3 haze = atmosphericHaze(normal, atmosphereStrength, atmosphereColor);
    vec3 scatter = rayleighScatter(normal, lightDir, atmosphereStrength);
    vec3 sunset = terminatorGlow(normal, lightDir, atmosphereStrength);

    return lit + haze + scatter + sunset;
}
`,ke=`/**
 * Star Surface Vertex Shader V2
 *
 * Displaces vertices to create bubbling, churning star surface.
 * The sphere actually deforms with noise-based displacement.
 *
 * @author guinetik
 * @see https://github.com/guinetik
 */

// Uniforms for animation
uniform float uTime;
uniform float uSeed;
uniform float uActivityLevel;

// Displacement parameters (tuned down ~5%)
const float DISPLACEMENT_AMOUNT = 0.075;     // Base displacement strength
const float DISPLACEMENT_SCALE = 3.0;        // Noise frequency
const float DISPLACEMENT_SPEED = 0.4;        // Animation speed (faster!)

const float BUBBLE_SCALE = 5.0;              // Larger bubbles
const float BUBBLE_SPEED = 0.25;             // Bubble rise speed (faster!)
const float BUBBLE_AMOUNT = 0.045;           // Bubble displacement

const float RIPPLE_SCALE = 8.0;              // Fine ripples
const float RIPPLE_SPEED = 0.8;              // Ripple animation (faster!)
const float RIPPLE_AMOUNT = 0.018;           // Ripple displacement

// Varyings to pass to fragment shader
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;  // Pass displacement to fragment for coloring

void main() {
    // Wrap time to prevent precision loss
    float time = mod(uTime, 1000.0);

    // Normalized position on sphere
    vec3 spherePos = normalize(position);

    // === LARGE SCALE CHURNING ===
    // Big slow-moving displacement like convection cells
    vec3 noisePos1 = spherePos * DISPLACEMENT_SCALE + vec3(0.0, time * DISPLACEMENT_SPEED, 0.0);
    float churn = snoise3D(noisePos1);

    // Add seed variation so each star is unique
    float seedOffset = seedHash(uSeed) * 100.0;
    churn += snoise3D(noisePos1 + vec3(seedOffset)) * 0.5;

    // === RISING BUBBLES ===
    // Faster upward-moving displacement
    vec3 noisePos2 = spherePos * BUBBLE_SCALE + vec3(0.0, time * BUBBLE_SPEED, time * 0.02);
    float bubbles = snoise3D(noisePos2);
    bubbles = max(bubbles, 0.0); // Only outward bubbles
    bubbles = pow(bubbles, 1.5); // Sharpen the bubbles

    // === FINE RIPPLES ===
    // Quick surface ripples
    vec3 noisePos3 = spherePos * RIPPLE_SCALE + vec3(time * RIPPLE_SPEED * 0.5, time * RIPPLE_SPEED, 0.0);
    float ripples = snoise3D(noisePos3);

    // === COMBINE DISPLACEMENTS ===
    float totalDisplacement = 0.0;
    totalDisplacement += churn * DISPLACEMENT_AMOUNT;
    totalDisplacement += bubbles * BUBBLE_AMOUNT;
    totalDisplacement += ripples * RIPPLE_AMOUNT;

    // Scale by activity level (more active stars = more displacement)
    totalDisplacement *= 0.5 + uActivityLevel * 1.0;

    // Add pulsation
    float pulse = sin(time * 0.5 + seedHash(uSeed) * 6.28) * 0.3 + 0.7;
    totalDisplacement *= pulse;

    // === DISPLACE VERTEX ===
    // Move vertex along its normal (outward from sphere center)
    vec3 displacedPosition = position + normal * totalDisplacement;

    // === RECALCULATE NORMAL ===
    // Approximate new normal by sampling displacement at nearby points
    float eps = 0.01;

    // Robust tangent generation that avoids normalization of zero vectors
    vec3 t1 = cross(normal, vec3(0.0, 1.0, 0.0));
    if (length(t1) < 0.001) {
        // At pole (normal is parallel to Y), try X axis
        t1 = cross(normal, vec3(1.0, 0.0, 0.0));
        if (length(t1) < 0.001) {
            // Should not happen unless normal is zero, but fallback to Z
            t1 = cross(normal, vec3(0.0, 0.0, 1.0));
        }
    }
    vec3 tangent1 = normalize(t1);
    vec3 tangent2 = normalize(cross(normal, tangent1));

    // Sample displacement at offset positions
    vec3 pos1 = normalize(position + tangent1 * eps);
    vec3 pos2 = normalize(position + tangent2 * eps);

    vec3 nPos1_1 = pos1 * DISPLACEMENT_SCALE + vec3(0.0, time * DISPLACEMENT_SPEED, 0.0);
    vec3 nPos1_2 = pos2 * DISPLACEMENT_SCALE + vec3(0.0, time * DISPLACEMENT_SPEED, 0.0);

    float d1 = snoise3D(nPos1_1) * DISPLACEMENT_AMOUNT * (0.5 + uActivityLevel);
    float d2 = snoise3D(nPos1_2) * DISPLACEMENT_AMOUNT * (0.5 + uActivityLevel);

    vec3 p0 = displacedPosition;
    vec3 p1 = pos1 * length(position) + normalize(pos1) * d1;
    vec3 p2 = pos2 * length(position) + normalize(pos2) * d2;

    vec3 newNormal = normalize(cross(p1 - p0, p2 - p0));
    // Blend with original normal to avoid too harsh changes
    newNormal = normalize(mix(normal, newNormal, 0.7));

    // === OUTPUT ===
    vNormal = normalize(normalMatrix * newNormal);
    vUv = uv;
    vPosition = displacedPosition;
    vDisplacement = totalDisplacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`,Ve=`/**
 * Star Surface Fragment Shader V2
 *
 * Creates dramatic burning star surfaces with:
 * - Boiling plasma effect (surface appears to bubble and flow)
 * - Spherical UV distortion (flames billow outward from center)
 * - Outward-flowing flame patterns
 * - Convective cells that rise and fall
 * - Temperature-based coloring
 * - Pulsating brightness
 *
 * Inspired by trisomie21's Shadertoy star technique
 *
 * @author guinetik
 * @see https://github.com/guinetik
 */

// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uStarColor;        // Base star color
uniform float uTime;            // Animation time
uniform float uTemperature;     // Star temperature in Kelvin
uniform float uSeed;            // Deterministic seed for this star
uniform float uActivityLevel;   // Stellar activity level (0-1)

// =============================================================================
// CONSTANTS
// =============================================================================

// Plasma boiling effect
const float PLASMA_SCALE = 3.0;             // Scale of plasma bubbles
const float PLASMA_SPEED = 0.12;            // Boiling speed

// Flame flow
const float FLAME_SCALE_COARSE = 15.0;
const float FLAME_SCALE_FINE = 45.0;
const float FLAME_FLOW_SPEED = 0.35;
const float FLAME_RISE_SPEED = 0.08;
const int FLAME_OCTAVES = 7;

// Convection cells
const float CELL_SCALE = 6.0;
const float CELL_SPEED = 0.02;
const float CELL_DEPTH = 0.3;

// Colors
const float COLOR_HOTSPOT_BOOST = 1.8;

// Limb effects
const float LIMB_DARK_POWER = 0.4;
const float EDGE_FLAME_POWER = 2.5;

// Pulsation
const float PULSE_SPEED1 = 0.5;
const float PULSE_SPEED2 = 0.25;
const float PULSE_STRENGTH = 0.3;

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;  // From vertex shader - height of displacement

// =============================================================================
// PLASMA NOISE with flowing distortion
// =============================================================================

float plasmaNoise(vec3 p, float time) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float totalAmp = 0.0;

    for (int i = 0; i < 5; i++) {
        vec3 offset = vec3(
            sin(time * 0.1 + float(i)) * 0.5,
            cos(time * 0.15 + float(i) * 0.7) * 0.5,
            time * 0.05
        );

        value += amplitude * snoise3D((p + offset) * frequency);
        totalAmp += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value / totalAmp;
}

// =============================================================================
// RISING PLASMA CELLS - visible convection bubbles
// =============================================================================

float risingCells(vec3 p, float time) {
    // Fix for pole singularity: ensure unique coordinates even at pole
    vec3 coord = p;
    float poleR = length(p.xy);
    if (poleR < 0.01) {
        // At pole: use rotated coordinates to ensure variation
        coord = vec3(p.z, p.y, -p.x);
    }
    float cells = snoise3D(coord * CELL_SCALE + vec3(0.0, time * CELL_SPEED, 0.0));
    float detail = snoise3D(coord * CELL_SCALE * 2.5 + vec3(time * CELL_SPEED * 0.5, 0.0, time * 0.01));
    cells = cells * 0.7 + detail * 0.3;
    float rise = snoise3D(coord * CELL_SCALE + vec3(0.0, time * CELL_SPEED * 2.0, 0.0));
    return cells * 0.5 + 0.5 + rise * 0.2;
}

// =============================================================================
// BOILING TURBULENCE - fast chaotic movement
// =============================================================================

float boilingTurbulence(vec3 p, float time) {
    // Fix for pole singularity: ensure unique coordinates even at pole
    vec3 coord = p;
    float poleR = length(p.xy);
    if (poleR < 0.01) {
        // At pole: use rotated coordinates to ensure variation
        coord = vec3(p.z, p.y, -p.x);
    }
    float turb = 0.0;
    float amp = 1.0;
    float freq = 4.0;

    for (int i = 0; i < 4; i++) {
        vec3 offset = vec3(
            sin(time * 0.3 + float(i) * 1.7) * 0.5,
            cos(time * 0.25 + float(i) * 2.3) * 0.5,
            time * 0.15 * (1.0 + float(i) * 0.3)
        );
        turb += amp * abs(snoise3D(coord * freq + offset));
        amp *= 0.5;
        freq *= 2.1;
    }
    return turb;
}

// =============================================================================
// HOT BUBBLES - bright spots that appear and pop
// =============================================================================

float hotBubbles(vec3 p, float time) {
    // Fix for pole singularity: ensure unique coordinates even at pole
    vec3 coord = p;
    float poleR = length(p.xy);
    if (poleR < 0.01) {
        // At pole: use rotated coordinates to ensure variation
        coord = vec3(p.z, p.y, -p.x);
    }
    // Large slow bubbles
    vec3 p1 = coord * 5.0 + vec3(0.0, time * 0.06, 0.0);
    float b1 = snoise3D(p1);
    b1 = smoothstep(0.3, 0.6, b1);

    // Medium bubbles, faster
    vec3 p2 = coord * 9.0 + vec3(time * 0.04, time * 0.08, 0.0);
    float b2 = snoise3D(p2);
    b2 = smoothstep(0.35, 0.65, b2);

    // Small rapid bubbles
    vec3 p3 = coord * 16.0 + vec3(time * 0.1, 0.0, time * 0.12);
    float b3 = snoise3D(p3);
    b3 = smoothstep(0.4, 0.7, b3);

    float bubbles = b1 * 0.5 + b2 * 0.35 + b3 * 0.15;

    // Pulsing intensity - use coord instead of p for pole safety
    float pulse = sin(time * 2.0 + coord.x * 10.0) * 0.3 + 0.7;

    return bubbles * pulse;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    float time = wrapTime(uTime);

    // === VIEW GEOMETRY ===
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float viewAngle = max(dot(vNormal, viewDir), 0.0);
    float edgeDist = 1.0 - viewAngle;

    // === PULSATION ===
    float pulse1 = cos(time * PULSE_SPEED1 + seedHash(uSeed) * TAU);
    float pulse2 = sin(time * PULSE_SPEED2 + seedHash(uSeed + 1.0) * TAU);
    float pulse = (pulse1 * 0.6 + pulse2 * 0.4) * PULSE_STRENGTH * uActivityLevel;
    float brightness = 0.15 + (uTemperature / 10000.0) * 0.1;
    brightness *= 1.0 + pulse;

    // === SPHERICAL COORDINATES ===
    float angle = atan(spherePos.y, spherePos.x);
    float elevation = acos(clamp(spherePos.z, -1.0, 1.0));

    // ==========================================================================
    // SPHERICAL DISTORTION - THE KEY EFFECT
    // This makes the surface appear to bulge outward like boiling plasma
    // ==========================================================================

    // Screen-space position on the sphere (like looking at it from front)
    vec2 sp = spherePos.xy;
    float r = dot(sp, sp);  // Squared distance from center

    // Detect pole early to handle singularity
    bool isAtPole = r < 0.0001;

    // The magic distortion formula from trisomie21
    // Creates a lens-like effect where center bulges toward viewer
    float distortStrength = 2.0 - brightness;  // Brighter = more distortion

    vec2 warpedUV;
    if (isAtPole) {
        // At pole: use alternative coordinate system to avoid singularity
        // Project pole onto equator using spherical coordinates
        float poleAngle = angle + time * 0.15;  // Animate for variation
        float poleElev = elevation;
        // Create non-zero UV coordinates from spherical coords
        warpedUV = vec2(
            cos(poleAngle) * (poleElev / PI) * 0.5 + time * 0.1,
            sin(poleAngle) * (poleElev / PI) * 0.5
        );
        // Scale to match normal distortion range
        warpedUV *= distortStrength * 2.0;
    } else {
        // Normal distortion calculation
        sp *= distortStrength;
        r = dot(sp, sp);

        // Distortion factor - creates the bulging effect
        float f = (1.0 - sqrt(abs(1.0 - r))) / (r + 0.001) + brightness * 0.5;

        // Apply distortion to create warped UVs
        warpedUV.x = sp.x * f;
        warpedUV.y = sp.y * f;

        // Animate the warped UVs - this creates the flowing effect
        warpedUV += vec2(time * 0.1, 0.0);
    }

    // ==========================================================================
    // PLASMA TEXTURE using warped coordinates
    // ==========================================================================

    // Sample noise with the distorted, animated coordinates
    vec3 plasmaCoord = vec3(warpedUV * PLASMA_SCALE, time * PLASMA_SPEED);
    float plasma1 = plasmaNoise(plasmaCoord, time);

    // Secondary layer with different phase
    vec3 plasma2Coord = vec3(warpedUV * PLASMA_SCALE * 1.3, time * PLASMA_SPEED * 0.8);
    float plasma2 = plasmaNoise(plasma2Coord + vec3(50.0, 50.0, 0.0), time * 1.2);

    // Combine plasma layers
    float plasma = plasma1 * 0.6 + plasma2 * 0.4;
    plasma = plasma * 0.5 + 0.5;  // Normalize to 0-1

    // Add more distortion influence from brightness variation
    float plasmaDistort = plasma * brightness * 3.14159;
    vec2 extraWarp = warpedUV + vec2(plasmaDistort, 0.0);

    // Third plasma layer with extra warping for more chaos
    float plasma3 = plasmaNoise(vec3(extraWarp * PLASMA_SCALE * 0.8, time * PLASMA_SPEED * 1.5), time);
    plasma = mix(plasma, plasma3 * 0.5 + 0.5, 0.3);

    // === OUTWARD FLOWING FLAMES ===
    // Use rotated coordinates to avoid pole singularity
    vec3 flameCoord = vec3(angle / TAU, elevation / PI, time * 0.1);

    float newTime1 = abs(tiledNoise3D(
        flameCoord + vec3(0.0, -time * FLAME_FLOW_SPEED, time * FLAME_RISE_SPEED),
        FLAME_SCALE_COARSE
    ));
    float newTime2 = abs(tiledNoise3D(
        flameCoord + vec3(0.0, -time * FLAME_FLOW_SPEED * 0.5, time * FLAME_RISE_SPEED),
        FLAME_SCALE_FINE
    ));

    float flameVal1 = 1.0 - edgeDist;
    float flameVal2 = 1.0 - edgeDist;

    for (int i = 1; i <= FLAME_OCTAVES; i++) {
        float power = pow(2.0, float(i + 1));
        float contribution = 0.5 / power;

        flameVal1 += contribution * tiledNoise3D(
            flameCoord + vec3(0.0, -time * 0.1, time * 0.2),
            power * 10.0 * (newTime1 + 1.0)
        );
        flameVal2 += contribution * tiledNoise3D(
            flameCoord + vec3(0.0, -time * 0.1, time * 0.2),
            power * 25.0 * (newTime2 + 1.0)
        );
    }

    float flames = (flameVal1 + flameVal2) * 0.5;
    flames = clamp(flames, 0.0, 1.0);

    // Edge flame overflow
    float edgeBoost = pow(edgeDist, 0.5) * EDGE_FLAME_POWER * uActivityLevel;
    flames += edgeBoost * flames * 0.5;

    // === CONVECTION CELLS ===
    float cells = risingCells(spherePos, time);

    // === SUNSPOTS ===
    // Hot stars (A-type and above) don't have sunspots - too hot for magnetic structures
    float spotActivity = smoothstep(8000.0, 5000.0, uTemperature);  // 0 for hot stars, 1 for cool
    float spotNoise = snoise3D(spherePos * 3.0 + vec3(0.0, time * 0.005, 0.0));
    float spotMask = smoothstep(0.55, 0.75, spotNoise);
    float spotDarkening = 1.0 - spotMask * 0.5 * spotActivity;  // No spots on hot stars

    // === COLOR CALCULATION ===
    vec3 baseColor = temperatureToColor(uTemperature);
    baseColor = mix(baseColor, uStarColor, 0.3);

    // Normalize to prevent washout
    float maxComp = max(baseColor.r, max(baseColor.g, baseColor.b));
    if (maxComp > 0.01) {
        baseColor = baseColor / maxComp * 0.85;
    }

    // Color variants - adjust for star temperature
    // Hot stars (A/B/O) should stay blue-white, cool stars (K/M) shift to orange
    float tempBlend = smoothstep(5000.0, 7500.0, uTemperature);  // 0 for cool, 1 for hot (A-type starts at 7500K)

    vec3 hotColor = baseColor * vec3(1.6, 1.35, 1.2);
    hotColor = min(hotColor, vec3(2.0));

    // Cool color: orange-brown for cool stars, dimmer blue for hot stars
    vec3 coolColorCool = baseColor * vec3(0.5, 0.3, 0.2);   // Orange-brown for M/K stars
    vec3 coolColorHot = baseColor * vec3(0.7, 0.8, 0.95);   // Dim blue-white for A/B stars
    vec3 coolColor = mix(coolColorCool, coolColorHot, tempBlend);

    // Warm color: creamy for cool stars, bright blue-white for hot stars
    vec3 warmColorCool = baseColor * vec3(1.2, 1.0, 0.85);  // Creamy for M/K
    vec3 warmColorHot = baseColor * vec3(1.0, 1.05, 1.2);   // Blue-white for A/B
    vec3 warmColor = mix(warmColorCool, warmColorHot, tempBlend);

    // Blazing: orange for cool, bright white-blue for hot
    vec3 blazingColorCool = baseColor * vec3(2.0, 1.6, 1.3);
    vec3 blazingColorHot = baseColor * vec3(1.4, 1.5, 1.8);
    vec3 blazingColor = mix(blazingColorCool, blazingColorHot, tempBlend);

    // === COMBINE ALL EFFECTS ===

    // Plasma creates the base boiling texture
    float plasmaIntensity = plasma;

    // Flames add streaks
    float flameIntensity = flames * 0.6;

    // Cells add larger variation
    float cellIntensity = cells * 0.4;

    // Boiling turbulence - fast chaotic movement
    float turbIntensity = boilingTurbulence(spherePos, time) * 0.5;

    // Hot bubbles - bright spots that pop
    float bubbles = hotBubbles(spherePos, time);

    // Combined - more aggressive boiling effect
    float totalIntensity = plasmaIntensity * 0.35 + flameIntensity * 0.25
                         + cellIntensity * 0.2 + turbIntensity * 0.2;

    // Add bubbles as bright highlights
    totalIntensity += bubbles * 0.4;

    totalIntensity *= spotDarkening;
    totalIntensity *= 1.0 + pulse * 0.5;

    // Fix for pole singularity: ensure minimum intensity and variation at north pole
    // Detect north pole (z close to 1.0, xy close to 0)
    float poleDist = abs(spherePos.z);
    float poleR = length(spherePos.xy);
    if (poleDist > 0.95 && poleR < 0.1) {
        // At north pole: add guaranteed variation and minimum brightness
        // Use time and position-based noise to ensure uniqueness
        float poleVariation = sin(time * 2.0 + spherePos.x * 100.0 + spherePos.y * 100.0) * 0.3 + 0.7;
        float poleBrightness = 0.4 + poleVariation * 0.3;  // Minimum 0.4, up to 0.7
        totalIntensity = max(totalIntensity, poleBrightness);
        // Add extra variation to prevent uniform black
        totalIntensity += poleVariation * 0.2;
    }

    // Raised areas (positive displacement) are hotter/brighter
    float displacementBoost = vDisplacement * 8.0;
    totalIntensity += displacementBoost * 0.5;
    totalIntensity = clamp(totalIntensity, 0.0, 1.8);

    // Map intensity to color (4-tier system)
    vec3 surfaceColor;
    if (totalIntensity < 0.35) {
        surfaceColor = mix(coolColor, warmColor, totalIntensity / 0.35);
    } else if (totalIntensity < 0.65) {
        surfaceColor = mix(warmColor, hotColor, (totalIntensity - 0.35) / 0.3);
    } else if (totalIntensity < 1.0) {
        surfaceColor = mix(hotColor, blazingColor, (totalIntensity - 0.65) / 0.35);
    } else {
        surfaceColor = blazingColor * (1.0 + (totalIntensity - 1.0) * 0.8);
    }

    // Bubble highlights - extra bright spots
    float bubbleHighlight = pow(bubbles, 1.5) * turbIntensity;
    surfaceColor += blazingColor * bubbleHighlight * 0.6;

    // Base glow
    float burnGlow = 0.6 + brightness * 0.4;
    surfaceColor *= burnGlow;

    // === LIMB DARKENING ===
    float limbDark = pow(viewAngle, LIMB_DARK_POWER);
    float tempInfluence = clamp(uTemperature / 10000.0, 0.3, 1.5);
    limbDark = mix(limbDark, 1.0, tempInfluence * 0.3);
    surfaceColor *= 0.85 + limbDark * 0.15;

    // === EDGE GLOW ===
    float edgeGlow = pow(edgeDist, 0.3) * flames * 0.4 * uActivityLevel;
    surfaceColor += warmColor * edgeGlow;

    // === CENTER BOOST ===
    float centerBoost = pow(viewAngle, 1.5) * 0.3;
    surfaceColor += baseColor * centerBoost;

    // === HOT STAR BRIGHTNESS ===
    float hotBoost = smoothstep(7000.0, 15000.0, uTemperature) * 0.2;
    surfaceColor += baseColor * hotBoost;

    // === TURBULENT SHIMMER - subtle fast variation ===
    float shimmer = sin(turbIntensity * 10.0 + time * 3.0) * 0.05 + 1.0;
    surfaceColor *= shimmer;

    // === ORGANIC RIM GLOW - breaks circular silhouette (from starstudy.glsl) ===
    float rim = edgeDist;  // Already have edge distance

    // Add noise to rim intensity based on position
    float rimAngle = atan(vNormal.y, vNormal.x);
    float rimElev = acos(clamp(vNormal.z, -1.0, 1.0));

    // Fix for pole singularity in rim calculation
    float rimR = length(vec2(vNormal.x, vNormal.y));
    if (rimR < 0.01) {
        // At pole: use time-based variation to ensure unique coordinates
        rimAngle = time * 0.1;
        rimElev = abs(vNormal.z) * PI;
    }
    float rimNoise = snoise3D(vec3(rimAngle * 3.0, rimElev * 2.0, time * 0.2));
    rimNoise = rimNoise * 0.5 + 0.5;

    // Flame-like protrusions at the edge
    float flameRim = tiledNoise3D(vec3(rimAngle / TAU, rimElev / PI, time * 0.15), 12.0);
    flameRim = abs(flameRim);

    // Combine for organic edge that breaks perfect circle
    float rimIntensity = pow(rim, 2.5) * (0.4 + rimNoise * 0.6 + flameRim * 0.5);
    vec3 rimColor = baseColor * vec3(1.3, 0.95, 0.6);
    surfaceColor += rimColor * rimIntensity * 0.8 * uActivityLevel;

    // Extra bright spots that "pop" out at the edge
    float hotSpots = pow(rimNoise * flameRim, 2.0);
    surfaceColor += baseColor * vec3(1.5, 1.1, 0.7) * hotSpots * rim * 0.5 * uActivityLevel;

    // === FINAL OUTPUT ===
    surfaceColor = clamp(surfaceColor, 0.0, 2.5);

    // Final safety check: ensure minimum brightness at north pole to prevent black artifact
    // Reuse poleDist and poleR from earlier calculation
    if (poleDist > 0.95 && poleR < 0.1) {
        // At north pole: ensure surface color is never black
        // Mix with warm color to guarantee visibility
        float minBrightness = 0.5;
        vec3 poleColor = warmColor * minBrightness;
        // Blend based on current brightness - if too dark, use pole color
        float currentBrightness = length(surfaceColor);
        if (currentBrightness < minBrightness) {
            surfaceColor = mix(poleColor, surfaceColor, currentBrightness / minBrightness);
        }
        // Add subtle time-based variation to prevent uniform appearance
        surfaceColor += baseColor * sin(time * 3.0 + spherePos.x * 50.0) * 0.1;
    }

    gl_FragColor = vec4(surfaceColor, 1.0);
}
`,ze=`/**
 * Star Corona Vertex Shader V2
 *
 * Renders the outer glow/corona of stars.
 * Uses a slightly larger sphere than the surface.
 */

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;  // Object space - for flame noise coordinates

    // View space position - for proper view-dependent calculations
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
}
`,We=`/**
 * Star Corona Fragment Shader V2
 *
 * Creates the outer glow and flare structures around stars.
 * Features:
 * - Radial falloff with softer edge
 * - Seed-based asymmetric flare structures
 * - Turbulent corona edges
 * - Activity-based intensity
 */

// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uStarColor;                // Base star color
uniform float uTime;                    // Animation time
uniform float uIntensity;               // Corona intensity/brightness
uniform float uSeed;                    // Deterministic seed for this star
uniform float uActivityLevel;           // Stellar activity level (0-1)

// =============================================================================
// CORONA CONSTANTS
// =============================================================================

// --- Flame Intensity ---
const float FLAME_BASE_INTENSITY = 1.2;             // Visible corona glow

// --- Flare Structures (seed-based asymmetric) ---
const float FLARE_BRIGHTNESS = 1.5;                 // Reduced flare intensity
const float FLARE_TIME_SCALE = 0.4;                 // Flare pulsation speed (5x faster!)
const int NUM_FLARES = 5;                           // Number of major flare sites
const float FLARE_RADIAL_SPEED = 0.8;               // How fast flares shoot outward

// --- Turbulence (FAST - visible swirling) ---
const float TURBULENCE_SCALE = 2.5;                 // Scale of turbulent noise
const float TURBULENCE_TIME_SCALE = 0.5;            // Animation speed (4x faster!)
const float TURBULENCE_STRENGTH = 1.2;              // How much turbulence affects corona
const int TURBULENCE_OCTAVES = 4;                   // FBM octaves for turbulence

// --- Noise Animation (FAST - visible flow) ---
const float NOISE_SCALE = 2.0;                      // Scale of corona noise
const float NOISE_TIME_SCALE = 0.3;                 // Animation speed (6x faster!)
const float NOISE_STRENGTH = 0.5;                   // How much noise affects corona
const int NOISE_OCTAVES = 3;                        // FBM octaves for corona detail

// --- Prominence/Ejection Settings ---
const float PROMINENCE_HEIGHT = 0.4;                // How far prominences extend
const float PROMINENCE_WIDTH = 0.15;                // Angular width of prominences
const float PROMINENCE_SPEED = 0.25;                // How fast prominences evolve

// --- Color Shifts ---
const float EDGE_COLOR_SHIFT_RED = 1.2;             // Red boost at edges
const float EDGE_COLOR_SHIFT_GREEN = 0.8;           // Green reduction at edges
const float EDGE_COLOR_SHIFT_BLUE = 0.5;            // Blue reduction at edges

// --- Alpha/Transparency ---
const float ALPHA_OUTER = 0.6;                      // Higher alpha for visibility
const float ALPHA_FADE_POWER = 2.0;                 // Fade curve power

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);  // Object space - for consistent flame patterns

    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);

    // === VIEW-SPACE CALCULATIONS (for proper alignment from any angle) ===
    // View direction in view space is toward -Z (looking at the object)
    vec3 viewDir = normalize(-vViewPosition);

    // How much is this surface facing the camera
    float viewAngle = max(dot(vNormal, viewDir), 0.0);

    // Rim factor: 0 at center (facing camera), 1 at silhouette edge
    float rimFactor = 1.0 - viewAngle;

    // === POLAR COORDINATES (object space for consistent flame patterns) ===
    float angle = atan(spherePos.y, spherePos.x);
    float elevation = spherePos.z; // -1 to 1

    // === FLAME VISIBILITY ===
    // Pure smooth falloff - NO hard edges or boundaries
    // rimFactor: 0 at center (facing camera), 1 at silhouette edge

    // Gentle density that peaks at mid-rim and fades both ways
    // No hard cutoffs - everything blends smoothly
    float density = rimFactor * exp(-rimFactor * 2.0) * 3.0;

    // No edge boost - avoid any ring appearance
    float flameMask = density;

    // === FLAME NOISE - determines flame intensity at each point ===
    float flameTime = wrappedTime * NOISE_TIME_SCALE;

    // Use angle + elevation for flame variation around the star
    vec3 flameCoord = vec3(
        angle * 3.0,                           // Angular variation
        elevation * 2.0,                       // Vertical variation
        flameTime * 2.0                        // Time animation
    );

    // Primary flame noise layer
    float flameNoise = fbm3D(flameCoord, NOISE_OCTAVES);
    flameNoise = abs(flameNoise) * 0.6 + 0.4;

    // Secondary noise layer for more detail (dual noise from starstudy.glsl)
    vec3 noiseCoord2 = vec3(
        angle * 4.0 + wrappedTime * 0.1,
        elevation * 3.0,
        wrappedTime * 0.08
    );
    float flameNoise2 = fbm3D(noiseCoord2, NOISE_OCTAVES);
    flameNoise2 = abs(flameNoise2) * 0.4 + 0.6;

    // Multiply noise layers for richer detail
    float combinedNoise = flameNoise * flameNoise2;

    // Turbulence layer for motion
    vec3 turbCoord = vec3(
        angle * 6.0 + wrappedTime * TURBULENCE_TIME_SCALE,
        elevation * 4.0,
        wrappedTime * TURBULENCE_TIME_SCALE * 0.5
    );
    float flameTurbulence = fbm3D(turbCoord, TURBULENCE_OCTAVES);

    // === FLAME INTENSITY ===
    // Base intensity from combined dual noise layers
    float flameIntensity = combinedNoise * (0.5 + flameTurbulence * 0.5);
    flameIntensity *= flameMask;  // Apply visibility mask
    flameIntensity *= uActivityLevel * 0.7 + 0.3;  // Activity level influence

    // === SOLAR PROMINENCES (large eruptions shooting outward) ===
    float prominenceTotal = 0.0;
    float flareTime = wrappedTime * FLARE_TIME_SCALE;

    for (int i = 0; i < NUM_FLARES; i++) {
        float fi = float(i);

        // Each prominence at a seed-based position
        float prominenceAngle = seedHash(uSeed + fi) * TAU;
        float prominenceElev = seedHash(uSeed + fi + 5.0) * 2.0 - 1.0;
        float prominencePhase = seedHash(uSeed + fi + 10.0) * TAU;

        // Angular distance from this prominence
        float angleDiff = abs(mod(angle - prominenceAngle + 3.1416, TAU) - 3.1416);
        float elevDiff = abs(elevation - prominenceElev);

        // Prominence appears in a localized region
        float spatialMask = exp(-angleDiff * angleDiff * 12.0 - elevDiff * elevDiff * 6.0);

        // Prominence lifecycle: grows, peaks, fades
        float cycleSpeed = 0.5 + seedHash(uSeed + fi + 20.0) * 0.5;
        float lifecycle = sin(flareTime * cycleSpeed + prominencePhase);
        lifecycle = max(lifecycle, 0.0);
        lifecycle = pow(lifecycle, 0.7);

        // Prominence intensity based on rim and lifecycle
        float prominenceIntensity = spatialMask * lifecycle * rimFactor;

        // Add noise for organic shape
        float pNoise = snoise3D(vec3(angle * 8.0, rimFactor * 5.0, wrappedTime * PROMINENCE_SPEED + fi));
        prominenceIntensity *= 0.7 + pNoise * 0.3;

        prominenceTotal += prominenceIntensity;
    }

    prominenceTotal *= FLARE_BRIGHTNESS * uActivityLevel;

    // === COMBINE INTENSITY ===
    float totalIntensity = flameIntensity * FLAME_BASE_INTENSITY;
    totalIntensity += prominenceTotal;
    totalIntensity *= uIntensity;

    // === COLOR CALCULATION ===
    vec3 baseColor = uStarColor;
    baseColor = baseColor * 1.5 + vec3(0.2);

    // Flames get warmer/redder toward edges (cooling as they extend)
    vec3 hotColor = baseColor * vec3(1.3, 1.1, 0.9);
    vec3 coolColor = baseColor * vec3(1.2, 0.7, 0.4);

    // Prominences are especially bright
    vec3 prominenceColor = baseColor * vec3(1.5, 1.0, 0.5);

    // Blend based on rim factor (further out = cooler color)
    vec3 flameColor = mix(hotColor, coolColor, rimFactor);
    flameColor = mix(flameColor, prominenceColor, min(prominenceTotal * 0.5, 1.0));

    // Apply intensity
    flameColor *= totalIntensity;

    // === ALPHA CALCULATION ===
    // Flames visible based on intensity and rim factor
    float alpha = totalIntensity * flameMask;
    alpha = pow(alpha, 0.7);
    alpha = clamp(alpha, 0.0, ALPHA_OUTER);

    gl_FragColor = vec4(flameColor, alpha);
}
`,Ye=`/**
 * Star Rays Vertex Shader
 *
 * For billboard rendering of star rays around the star.
 */

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ke=`/**
 * Star Rays Fragment Shader
 *
 * Creates soft god rays emanating from the star.
 * Based on the Shadertoy starstudy.glsl lightRays approach.
 *
 * Features:
 * - Soft sine-wave based rays (not hard spokes)
 * - Multiple frequency layers for organic look
 * - Smooth radial falloff
 * - Rotates with star surface
 */

// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uStarColor;
uniform float uTime;
uniform float uTemperature;
uniform float uSeed;
uniform float uActivityLevel;
uniform float uStarRadius;      // Normalized star radius in UV space (0-1)

// =============================================================================
// VARYINGS
// =============================================================================

varying vec2 vUv;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec2 uv = vUv;
    vec2 center = uv - 0.5;
    float dist = length(center);  // 0 to 0.707 at corners

    // Circular mask - forces circular shape, eliminates box
    float circularMask = 1.0 - smoothstep(0.35, 0.5, dist);

    // Only render outside the star
    if (dist < uStarRadius * 0.95) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // Rotate UV with time - matches star rotation speed from Shadertoy
    float starRot = uTime * 0.5;
    float cosR = cos(starRot);
    float sinR = sin(starRot);
    vec2 rotCenter = vec2(
        center.x * cosR - center.y * sinR,
        center.x * sinR + center.y * cosR
    );

    float angle = atan(rotCenter.y, rotCenter.x);

    // === SOFT DIFFUSE RAYS (natural light haze) ===
    float rays = 0.0;

    // Multiple soft frequency layers - very gentle
    for (float i = 1.0; i < 4.0; i++) {
        float rayFreq = 4.0 + i * 2.0;

        // Sine wave creates smooth variation
        float ray = sin(angle * rayFreq + uSeed * i) * 0.5 + 0.5;

        // Very soft shaping - barely visible rays (pow 3 instead of 8)
        ray = pow(ray, 3.0);

        // Each layer contributes less
        rays += ray / (i * 1.5);
    }

    // Subtle seed variation
    float seedOffset = seedHash(uSeed) * TAU;
    float extraRay = sin(angle * 5.0 + seedOffset) * 0.5 + 0.5;
    extraRay = pow(extraRay, 4.0);
    rays += extraRay * 0.15;

    // Normalize to keep values reasonable
    rays *= 0.4;

    // === SMOOTH RADIAL FALLOFF ===
    // Gaussian falloff - naturally reaches zero at edges
    float falloff = exp(-dist * dist * 6.0);

    // Soft fade in from star center
    float rayMask = smoothstep(uStarRadius * 0.5, uStarRadius * 3.0, dist);

    // Combine
    rays = rays * falloff + falloff * 0.2;
    rays *= rayMask;

    // Scale by activity level
    rays *= 0.6 + uActivityLevel * 0.4;

    // === COLOR ===
    vec3 baseColor = temperatureToColor(uTemperature);
    baseColor = mix(baseColor, uStarColor, 0.3);

    // Warm tint for natural glow
    vec3 rayColor = baseColor * vec3(1.05, 0.98, 0.92);

    // Subtle intensity
    rayColor *= rays * 0.2;

    // === ALPHA - very subtle, with circular mask ===
    float alpha = rays * 0.35 * circularMask;
    alpha = clamp(alpha, 0.0, 0.35);

    gl_FragColor = vec4(rayColor * circularMask, alpha);
}
`,Ze=`/**
 * Star Flame Tongues Vertex Shader
 *
 * Renders visible fire protrusions that break the circular star silhouette.
 * Uses a sphere slightly larger than the star surface.
 */

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;  // Object space - for flame pattern coordinates

    // View space position - for view-dependent calculations
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
}
`,qe=`/**
 * Star Flame Tongues Fragment Shader
 *
 * Creates visible fire protrusions that break the circular star silhouette.
 * Ported from starstudy.glsl.
 *
 * Features:
 * - Multiple flame layers at different frequencies
 * - Height-based color gradient (hot at base, cooler at tips)
 * - Rotates with star surface
 * - Only renders at the silhouette edge
 */

// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uStarColor;
uniform float uTime;
uniform float uSeed;
uniform float uActivityLevel;

// =============================================================================
// CONSTANTS
// =============================================================================

const float FLAME_INNER_RADIUS = 0.85;   // Start of flame zone (relative to mesh)
const float FLAME_OUTER_RADIUS = 1.0;    // End of flame zone
const float FLAME_MAX_HEIGHT = 0.25;     // Maximum flame extension

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    float wrappedTime = wrapTime(uTime);

    // === VIEW GEOMETRY ===
    vec3 viewDir = normalize(-vViewPosition);
    float viewAngle = max(dot(vNormal, viewDir), 0.0);
    float rimFactor = 1.0 - viewAngle;

    // Render in wider zone to break circular silhouette (like starstudy.glsl)
    // Wider range allows flames to be visible as protrusions
    if (rimFactor < 0.4 || rimFactor > 0.98) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // === STAR ROTATION ===
    // Rotate coordinates with star so flames rotate together
    float starRot = wrappedTime * 0.5;
    float cosR = cos(starRot);
    float sinR = sin(starRot);
    vec3 rotDir = vec3(
        spherePos.x * cosR - spherePos.z * sinR,
        spherePos.y,
        spherePos.x * sinR + spherePos.z * cosR
    );

    // === POLAR COORDINATES (rotated) ===
    float angle = atan(rotDir.y, rotDir.x);
    float elev = acos(clamp(rotDir.z, -1.0, 1.0));

    // === MULTIPLE FLAME LAYERS ===

    // Large slow-moving tongues
    float tongue1 = tiledNoise3D(
        vec3(angle / TAU * 8.0, elev / PI * 4.0, wrappedTime * 0.08),
        8.0
    );
    tongue1 = pow(max(tongue1, 0.0), 1.5);

    // Medium flames
    float tongue2 = tiledNoise3D(
        vec3(angle / TAU * 16.0, elev / PI * 8.0, wrappedTime * 0.12),
        16.0
    );
    tongue2 = pow(max(tongue2, 0.0), 2.0);

    // Small flickering details
    float tongue3 = snoise3D(vec3(angle * 6.0, elev * 4.0, wrappedTime * 0.3));
    tongue3 = pow(max(tongue3, 0.0), 2.5);

    // Combine flame layers
    float flames = tongue1 * 0.5 + tongue2 * 0.35 + tongue3 * 0.15;

    // === FLAME HEIGHT CALCULATION ===
    // Each flame extends to different heights based on noise
    float flameHeight = 0.15 + flames * FLAME_MAX_HEIGHT;

    // Distance from star surface (rimFactor maps roughly to distance)
    float distFromSurface = (rimFactor - 0.3) / 0.65;  // Normalize to 0-1

    // Flame is visible if we're within its reach
    float flameReach = smoothstep(flameHeight, 0.0, distFromSurface);
    flameReach *= smoothstep(0.25, 0.35, rimFactor);  // Fade in from star surface

    // Intensity varies with height (brighter at base)
    float heightFade = 1.0 - (distFromSurface / (flameHeight + 0.001));
    heightFade = pow(max(heightFade, 0.0), 0.7);

    float intensity = flames * flameReach * heightFade;

    // Apply activity level
    intensity *= 0.6 + uActivityLevel * 0.4;

    // Lower threshold to show more flames - creates organic protrusions
    intensity = smoothstep(0.15, 0.4, intensity) * intensity;

    // === COLOR CALCULATION ===
    vec3 baseColor = uStarColor * 1.5 + vec3(0.2);

    // Hot at base (near star), cooler at tips
    vec3 baseFlameColor = baseColor * vec3(1.4, 1.1, 0.8);
    vec3 tipFlameColor = baseColor * vec3(1.1, 0.7, 0.4);
    vec3 flameColor = mix(baseFlameColor, tipFlameColor, distFromSurface);

    // Apply intensity - higher multiplier for visible protrusions
    flameColor *= intensity * 1.2;

    // === ALPHA - more visible for breaking silhouette ===
    float alpha = intensity;
    alpha = pow(alpha, 0.9);  // Lower power = more flames visible
    alpha = clamp(alpha, 0.0, 0.6);  // Higher max alpha for visibility

    // Smooth edges - wider fade range
    alpha *= smoothstep(0.4, 0.55, rimFactor) * smoothstep(0.98, 0.85, rimFactor);

    gl_FragColor = vec4(flameColor, alpha);
}
`,je=`/**
 * Solar Flare Vertex Shader
 *
 * Creates a plasma blob that travels outward through space.
 * The mesh position is animated in JS - this just handles the shape.
 * Features:
 * - Blob-like shape (not a streak)
 * - Slight elongation in travel direction
 * - Fades as it travels (phase = distance)
 */

uniform float uFlareLength;     // Base size
uniform float uFlarePhase;      // 0 = at star, 1 = far away (fading)
uniform float uFlareSeed;       // For variation

varying vec2 vUv;
varying float vPhase;

void main() {
    vUv = uv;
    vPhase = uFlarePhase;

    vec3 scaledPos = position;

    // Size: starts small, grows as it launches, then stays consistent
    float sizeRamp = smoothstep(0.0, 0.2, uFlarePhase);  // Quick grow at start
    float baseSize = uFlareLength * sizeRamp;

    // Slight elongation in Y (travel direction) - like a comet
    scaledPos.y *= baseSize * 1.5;
    scaledPos.x *= baseSize * 1.0;

    // Add some wobble/variation based on seed
    float wobble = sin(uFlareSeed * 20.0 + uFlarePhase * 6.28) * 0.1;
    scaledPos.x += wobble * baseSize;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPos, 1.0);
}
`,Xe=`/**
 * Solar Flare Fragment Shader
 *
 * Creates a volumetric plasma eruption connected to the star.
 * Phase represents distance traveled (0 = at star, 1 = far away).
 * Features:
 * - Volumetric layered glow appearance
 * - Connected tendril to star surface
 * - Turbulent plasma texture with depth
 * - Color cools as it travels
 */

uniform vec3 uStarColor;
uniform float uTime;
uniform float uFlarePhase;      // 0 = at star, 1 = far away
uniform float uFlareSeed;

varying vec2 vUv;
varying float vPhase;

void main() {
    float wrappedTime = wrapTime(uTime);

    // UV coordinates - center is at 0.5, 0.5
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // === PHASE-BASED SHAPE TRANSITION ===
    // Near star (low phase): volumetric with tendril
    // Far from star (high phase): straight ray/beam of light

    // Ray shape - stays wide while forming, thins when escaping
    float targetThinness = 500.0;  // Final fixed thinness
    float startThinness = 8.0;     // Wide at start (explosion)
    // Only start thinning after escape (phase > 0.6)
    float thinPhase = smoothstep(0.6, 1.0, vPhase);  // 0 until 0.6, then ramps to 1
    float rayThinness = mix(startThinness, targetThinness, thinPhase);
    float rayCore = exp(-uv.x * uv.x * rayThinness);       // Converges to same width
    float rayGlow = exp(-uv.x * uv.x * rayThinness * 0.2); // Subtle glow

    // Tendril toward star (for when connected)
    float tendril = exp(-uv.x * uv.x * 15.0) * smoothstep(0.5, -0.3, uv.y);
    float softGlow = exp(-dist * dist * 8.0);

    // Light turbulence for organic feel (subtle)
    vec3 noisePos = vec3(uv * 3.0, wrappedTime * 0.2 + uFlareSeed * 10.0);
    float turbulence = snoise3D(noisePos) * 0.5 + 0.5;

    // Blend between connected look and traveling ray
    // Forms on star for 60%, then transitions to ray as it escapes
    float connectedPhase = 1.0 - smoothstep(0.55, 0.7, vPhase);

    // Connected shape: tendril + soft glow
    float connectedShape = tendril * 0.8 + softGlow * 0.6;
    connectedShape *= 0.7 + turbulence * 0.4;

    // Traveling shape: straight ray beam (more subtle)
    float travelingShape = rayCore * 2.0 + rayGlow * 0.5;

    // Blend based on phase
    float shape = mix(travelingShape, connectedShape, connectedPhase);

    // === FADE WITH DISTANCE TRAVELED ===
    // Stays bright most of the journey, quick fade at very end
    float distanceFade = 1.0 - smoothstep(0.75, 1.0, vPhase);  // Bright until 75%, then fade

    float spawnFade = smoothstep(0.0, 0.08, vPhase);
    float opacity = distanceFade * spawnFade;

    // === COLOR ===
    vec3 baseColor = uStarColor * 1.5 + vec3(0.2);
    vec3 hotColor = uStarColor * 2.0 + vec3(0.3);  // Star color, brightened
    vec3 warmColor = baseColor * vec3(1.3, 0.9, 0.6);

    // Stays hot/bright, simple color
    vec3 flareColor = mix(hotColor, warmColor, vPhase * 0.5);

    // Brighter at ray center
    flareColor *= 1.0 + rayCore * 2.0;

    // === CIRCULAR MASK ===
    float edgeMask = 1.0 - smoothstep(0.35, 0.5, dist);

    float alpha = shape * opacity * edgeMask * 0.7;  // More transparent
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(flareColor, alpha);
}
`,$e=`/**
 * Planet Vertex Shader V2
 * 
 * Shared vertex shader for all planet types.
 * Passes position, normal, and UV to fragment shaders.
 */

// Precision qualifiers for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    // Pass data to fragment shader
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    // Standard vertex transformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`,Je=`/**
 * Rocky Planet Fragment Shader V2
 *
 * Creates Earth-like and Mars-like terrestrial worlds with:
 * - Domain-warped terrain generation
 * - Biome system (desert, forest, ice, ocean)
 * - Specular oceans
 * - Cloud layers
 * - Polar ice caps
 * - Atmospheric scattering
 *
 * Physics: Solid silicate surfaces, possible atmospheres and water
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;
uniform float uZoomLevel;      // 0 = far, 1 = close - controls surface detail visibility
uniform float uBodyDiameter;   // Body diameter for scale reference

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// ROCKY PLANET CONSTANTS
// =============================================================================

// --- Terrain Generation ---
const float TERRAIN_SCALE_BASE = 4.0;
const float TERRAIN_SCALE_VARIATION = 2.0;
const int TERRAIN_OCTAVES_SIMPLE = 3;
const int TERRAIN_OCTAVES_DETAIL = 6;
const float TERRAIN_WARP_STRENGTH = 0.4;

// --- Height Thresholds ---
const float HEIGHT_OCEAN = 0.35;          // Below = water
const float HEIGHT_BEACH = 0.38;          // Beach/shore zone
const float HEIGHT_LOWLAND = 0.50;        // Lowland terrain
const float HEIGHT_HIGHLAND = 0.70;       // Highland/mountain start
const float HEIGHT_PEAK = 0.85;           // Snow-capped peaks

// --- Temperature Regimes ---
const float TEMP_FROZEN = 220.0;          // Below = ice world
const float TEMP_COLD = 260.0;            // Cold/tundra
const float TEMP_TEMPERATE = 320.0;       // Temperate zone
const float TEMP_HOT = 380.0;             // Hot/arid
const float TEMP_SCORCHED = 500.0;        // Volcanic activity

// --- Biome Colors ---
const vec3 OCEAN_COLOR = vec3(0.1, 0.25, 0.5);
const vec3 OCEAN_DEEP = vec3(0.05, 0.12, 0.3);
const vec3 BEACH_COLOR = vec3(0.76, 0.70, 0.50);
const vec3 FOREST_COLOR = vec3(0.15, 0.4, 0.15);
const vec3 GRASSLAND_COLOR = vec3(0.35, 0.5, 0.2);
const vec3 DESERT_COLOR = vec3(0.76, 0.6, 0.4);
const vec3 TUNDRA_COLOR = vec3(0.5, 0.55, 0.5);
const vec3 SNOW_COLOR = vec3(0.9, 0.92, 0.95);
const vec3 ROCK_COLOR = vec3(0.45, 0.42, 0.38);
const vec3 MOUNTAIN_COLOR = vec3(0.55, 0.52, 0.48);

// --- Polar Ice Caps ---
const float POLAR_START = 0.7;            // Latitude where ice begins
const float POLAR_FULL = 0.9;             // Latitude of full ice coverage
const float POLAR_VARIATION = 0.1;        // Seed-based variation

// --- Clouds ---
const float CLOUD_SCALE = 6.0;
const float CLOUD_SPEED = 0.015;
const float CLOUD_THRESHOLD = 0.45;
const float CLOUD_OPACITY = 0.5;
const int CLOUD_OCTAVES = 4;

// --- Ocean Properties ---
const float OCEAN_SPECULAR_POWER = 64.0;
const float OCEAN_SPECULAR_INTENSITY = 0.7;
const float OCEAN_WAVE_SCALE = 80.0;
const float OCEAN_WAVE_SPEED = 0.1;

// --- Atmospheric Haze ---
const float ATMO_HAZE_POWER = 2.5;
const float ATMO_HAZE_STRENGTH = 0.3;

// --- Density Effects ---
const float DENSITY_ROUGHNESS_MIN = 0.6;
const float DENSITY_ROUGHNESS_MAX = 1.4;

// --- Limb Darkening ---
const float LIMB_EDGE_LOW = -0.2;
const float LIMB_EDGE_HIGH = 0.8;
const float LIMB_MIN_BRIGHTNESS = 0.4;

// --- Crater Generation (zoom-based) ---
const float CRATER_SCALE = 25.0;          // Base scale for crater distribution
const float CRATER_DETAIL_SCALE = 80.0;   // Finer crater detail scale
const float CRATER_DEPTH = 0.15;          // How much craters darken the surface
const float CRATER_RIM_BRIGHTNESS = 0.08; // Brightness boost at crater rims

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// CRATER FUNCTIONS (for zoom-based detail)
// =============================================================================

/**
 * Generate procedural crater field
 * Uses Voronoi-like cellular noise to create crater shapes
 */
float craterField(vec3 p, float scale, float seed) {
    vec3 scaledP = p * scale + vec3(seed * 10.0);

    // Cellular noise for crater positions
    float cellNoise = vnoise3D(scaledP);

    // Create crater shapes - deeper in center, raised rim
    float crater = smoothstep(0.3, 0.5, cellNoise) - smoothstep(0.5, 0.7, cellNoise) * 0.5;

    // Add some variation
    float variation = snoise3D(scaledP * 2.0 + vec3(seed)) * 0.3;

    return crater + variation * 0.2;
}

/**
 * Generate crater rim highlights
 */
float craterRims(vec3 p, float scale, float seed) {
    vec3 scaledP = p * scale + vec3(seed * 10.0);

    float cellNoise = vnoise3D(scaledP);

    // Rim is at the edge of crater (around 0.45-0.55)
    float rim = smoothstep(0.4, 0.48, cellNoise) * smoothstep(0.56, 0.48, cellNoise);

    return rim;
}

/**
 * Multi-scale crater detail combining large and small craters
 */
vec3 zoomBasedCraterDetail(vec3 p, vec3 surfaceColor, float zoomLevel, float seed) {
    if (zoomLevel < 0.1) {
        return surfaceColor;
    }

    // Fade in detail based on zoom
    float detailFade = smoothstep(0.1, 0.5, zoomLevel);

    // Large craters (visible at medium zoom)
    float largeCraters = craterField(p, CRATER_SCALE, seed);
    float largeRims = craterRims(p, CRATER_SCALE, seed);

    // Small craters (visible at high zoom)
    float smallCraters = craterField(p, CRATER_DETAIL_SCALE, seed + 5.0);
    float smallRims = craterRims(p, CRATER_DETAIL_SCALE, seed + 5.0);

    // Combine crater effects
    float totalCrater = largeCraters * 0.7 + smallCraters * 0.3 * smoothstep(0.3, 0.7, zoomLevel);
    float totalRim = largeRims * 0.6 + smallRims * 0.4 * smoothstep(0.4, 0.8, zoomLevel);

    // Apply crater darkening
    vec3 result = surfaceColor * (1.0 - totalCrater * CRATER_DEPTH * detailFade);

    // Add rim highlights
    result += vec3(1.0) * totalRim * CRATER_RIM_BRIGHTNESS * detailFade;

    // Fine surface texture at maximum zoom
    if (zoomLevel > 0.6) {
        float fineTexture = snoise3D(p * 150.0 + vec3(seed * 3.0)) * 0.5 + 0.5;
        float fineFade = smoothstep(0.6, 0.9, zoomLevel);
        result *= 0.95 + fineTexture * 0.1 * fineFade;
    }

    return result;
}

// =============================================================================
// BIOME FUNCTION
// =============================================================================

/**
 * Determine biome color based on height, temperature, and humidity
 */
vec3 getBiomeColor(float height, float temp, float humidity, float seed) {
    // Ice world - everything frozen
    if (temp < TEMP_FROZEN) {
        float iceVariation = seedHash(seed + height) * 0.1;
        return mix(SNOW_COLOR, vec3(0.8, 0.85, 0.9), iceVariation);
    }
    
    // Ocean
    if (height < HEIGHT_OCEAN) {
        float depth = 1.0 - (height / HEIGHT_OCEAN);
        return mix(OCEAN_COLOR, OCEAN_DEEP, depth);
    }
    
    // Beach
    if (height < HEIGHT_BEACH) {
        return mix(OCEAN_COLOR, BEACH_COLOR, (height - HEIGHT_OCEAN) / (HEIGHT_BEACH - HEIGHT_OCEAN));
    }
    
    // Calculate temperature factor for biome selection
    float tempFactor = smoothstep(TEMP_COLD, TEMP_HOT, temp);
    float humidityFactor = humidity;
    
    // Lowland biomes
    if (height < HEIGHT_LOWLAND) {
        vec3 coldBiome = mix(TUNDRA_COLOR, GRASSLAND_COLOR, humidityFactor);
        vec3 warmBiome = mix(DESERT_COLOR, FOREST_COLOR, humidityFactor);
        return mix(coldBiome, warmBiome, tempFactor);
    }
    
    // Highland biomes
    if (height < HEIGHT_HIGHLAND) {
        vec3 lowColor = mix(GRASSLAND_COLOR, FOREST_COLOR, humidityFactor);
        vec3 highColor = mix(ROCK_COLOR, TUNDRA_COLOR, humidityFactor);
        float t = (height - HEIGHT_LOWLAND) / (HEIGHT_HIGHLAND - HEIGHT_LOWLAND);
        return mix(lowColor, highColor, t);
    }
    
    // Mountain peaks
    if (height < HEIGHT_PEAK) {
        float t = (height - HEIGHT_HIGHLAND) / (HEIGHT_PEAK - HEIGHT_HIGHLAND);
        return mix(MOUNTAIN_COLOR, ROCK_COLOR, t);
    }
    
    // Snow-capped peaks
    float snowiness = (height - HEIGHT_PEAK) / (1.0 - HEIGHT_PEAK);
    snowiness *= (1.0 - tempFactor * 0.5);  // Less snow on hot planets
    return mix(ROCK_COLOR, SNOW_COLOR, snowiness);
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    float hueShift = seedHueShift(uSeed);
    vec3 scales = seedScales(uSeed);
    float densityRoughness = mix(DENSITY_ROUGHNESS_MIN, DENSITY_ROUGHNESS_MAX, uDensity);
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float latitude = abs(p.y);  // 0 at equator, 1 at poles
    
    // === TERRAIN HEIGHT ===
    vec3 terrainCoord = spherePos * TERRAIN_SCALE_BASE * scales.x * densityRoughness;
    terrainCoord = seedOffset3D(terrainCoord, uSeed);
    
    int octaves = uDetailLevel > 0.5 ? TERRAIN_OCTAVES_DETAIL : TERRAIN_OCTAVES_SIMPLE;
    float height;
    
    if (uDetailLevel > 0.5) {
        height = fbmWarped3D(terrainCoord, octaves, TERRAIN_WARP_STRENGTH);
    } else {
        height = fbm3D(terrainCoord, octaves);
    }
    height = height * 0.5 + 0.5;  // Normalize to 0-1
    
    // Density affects terrain - denser = more rugged
    height = pow(height, 1.0 / densityRoughness);
    
    // === HUMIDITY (for biome selection) ===
    float humidityNoise = snoise3D(spherePos * 3.0 + vec3(phaseOffset));
    float humidity = humidityNoise * 0.5 + 0.5;
    // More humidity near equator on temperate worlds
    if (uTemperature > TEMP_COLD && uTemperature < TEMP_HOT) {
        humidity += (1.0 - latitude) * 0.3;
    }
    humidity = clamp(humidity, 0.0, 1.0);
    
    // === OCEAN PRESENCE ===
    // Hot planets have less water, frozen planets have ice
    float oceanLevel = HEIGHT_OCEAN;
    if (uTemperature > TEMP_HOT) {
        oceanLevel *= max(0.0, 1.0 - (uTemperature - TEMP_HOT) / 200.0);
    }
    bool isOcean = height < oceanLevel && uTemperature > TEMP_FROZEN && uHasAtmosphere > 0.3;
    
    // === BIOME COLOR ===
    float effectiveHeight = isOcean ? height : max(height, oceanLevel);
    vec3 surfaceColor = getBiomeColor(effectiveHeight, uTemperature, humidity, uSeed);

    // Generate physical base color for data-driven variety
    vec3 physColor = physicalPlanetColor(
        uColorTempFactor,
        uColorCompositionFactor,
        uColorIrradiationFactor,
        uColorMetallicityFactor,
        uSeed
    );

    // Apply physical color influence - blend with biome colors for variety
    // Physical color tints the biome palette rather than replacing it
    vec3 surfaceHSV = rgb2hsv(surfaceColor);
    vec3 physHSV = rgb2hsv(physColor);

    // Apply hue shift from seed + subtle influence from physical color
    surfaceHSV.x = fract(surfaceHSV.x + hueShift * 0.4 + (physHSV.x - 0.5) * 0.15);
    // Physical color affects saturation and brightness
    surfaceHSV.y *= 0.85 + physHSV.y * 0.3;
    surfaceHSV.z *= 0.9 + physHSV.z * 0.2;

    surfaceColor = hsv2rgb(surfaceHSV);

    // Blend with physical color for additional variety (subtle)
    surfaceColor = mix(surfaceColor, surfaceColor * physColor * 1.5, 0.2);
    
    // === POLAR ICE CAPS ===
    if (uTemperature < TEMP_HOT && uHasAtmosphere > 0.2) {
        float polarThreshold = POLAR_START - seedHash(uSeed + 0.5) * POLAR_VARIATION;
        // Larger caps on colder planets
        polarThreshold -= max(0.0, (TEMP_TEMPERATE - uTemperature) / 200.0) * 0.2;
        
        float iceCap = smoothstep(polarThreshold, POLAR_FULL, latitude);
        surfaceColor = mix(surfaceColor, SNOW_COLOR, iceCap * 0.8);
    }
    
    // === FINE DETAIL ===
    if (uDetailLevel > 0.5 && !isOcean) {
        float detail = vnoise3D(p * 40.0 + vec3(phaseOffset));
        surfaceColor *= 0.95 + detail * 0.1;
    }

    // === ZOOM-BASED CRATER DETAIL ===
    // Apply craters and fine surface features when zoomed in close
    // Only on non-ocean surfaces with minimal atmosphere (exposed rock)
    if (!isOcean && uHasAtmosphere < 0.7) {
        surfaceColor = zoomBasedCraterDetail(p, surfaceColor, uZoomLevel, uSeed);
    }
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseLambert(vNormal, lightDir);
    
    // Ocean specular
    float spec = 0.0;
    if (isOcean) {
        // Wave distortion using 3D position
        vec3 wavePos = p * OCEAN_WAVE_SCALE + vec3(wrappedTime * OCEAN_WAVE_SPEED, 0.0, wrappedTime * OCEAN_WAVE_SPEED * 0.5);
        float wave = snoise3D(wavePos) * 0.02;
        vec3 oceanNormal = normalize(vNormal + vec3(wave, wave, 0.0));
        
        spec = specularBlinn(oceanNormal, vec3(0.0, 0.0, 1.0), lightDir, OCEAN_SPECULAR_POWER);
        spec *= OCEAN_SPECULAR_INTENSITY;
    }
    
    // Limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, LIMB_MIN_BRIGHTNESS);
    
    vec3 litColor = surfaceColor * (diff * 0.8 + 0.2) * limb;
    litColor += vec3(1.0, 0.95, 0.9) * spec;
    
    // === CLOUDS ===
    if (uHasAtmosphere > 0.3 && uDetailLevel > 0.5) {
        // Use 3D position for seamless cloud noise
        vec3 cloudCoord = p * CLOUD_SCALE * scales.y + vec3(wrappedTime * CLOUD_SPEED, 0.0, wrappedTime * CLOUD_SPEED * 0.7) + vec3(phaseOffset);
        float clouds = fbm3D(cloudCoord, CLOUD_OCTAVES);
        clouds = smoothstep(CLOUD_THRESHOLD, 0.7, clouds * 0.5 + 0.5);
        
        float cloudLit = diff * 0.9 + 0.1;
        vec3 cloudColor = vec3(cloudLit);
        
        litColor = mix(litColor, cloudColor, clouds * CLOUD_OPACITY * uHasAtmosphere);
    }
    
    // === ATMOSPHERIC HAZE ===
    if (uHasAtmosphere > 0.0) {
        float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float haze = pow(edgeFactor, ATMO_HAZE_POWER) * ATMO_HAZE_STRENGTH * uHasAtmosphere;
        
        // Haze color based on temperature
        vec3 hazeColor = vec3(0.5, 0.7, 1.0);  // Blue for Earth-like
        if (uTemperature > TEMP_HOT) {
            hazeColor = mix(hazeColor, vec3(0.9, 0.7, 0.5), 
                           smoothstep(TEMP_HOT, TEMP_SCORCHED, uTemperature));
        }
        
        litColor += hazeColor * haze;
    }
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= starTint;
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,Qe=`/**
 * Gas Giant Fragment Shader V2
 *
 * Creates Jupiter/Saturn-like gas giants with:
 * - Atmospheric banding with seed-varied count/width
 * - Storm systems (Great Red Spot-like features)
 * - Turbulent flow patterns
 * - Domain-warped cloud structures
 * - Proper limb darkening
 *
 * Physics: Large H/He dominated worlds with deep atmospheres
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;                  // Base planet color
uniform float uTime;                      // Animation time
uniform float uTemperature;               // Equilibrium temperature (K)
uniform float uHasAtmosphere;             // Always 1.0 for gas giants
uniform float uSeed;                      // Unique seed for variation
uniform float uDensity;                   // Normalized density (affects storm intensity)
uniform float uInsolation;                // Stellar energy input
uniform float uStarTemp;                  // Host star temperature
uniform float uDetailLevel;               // LOD (0 = simple, 1 = detailed)

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// GAS GIANT CONSTANTS
// =============================================================================

// --- Atmospheric Bands ---
const float BAND_COUNT_BASE = 8.0;        // Base number of bands
const float BAND_COUNT_VARIATION = 6.0;   // Seed-based variation in count
const float BAND_WIDTH_BASE = 0.5;        // Base band width
const float BAND_WIDTH_VARIATION = 0.3;   // Band width variation
const float BAND_CONTRAST = 0.4;          // Color contrast between bands
const float BAND_WOBBLE_SCALE = 8.0;      // Noise scale for band edges
const float BAND_WOBBLE_STRENGTH = 0.03;  // How much bands wobble

// --- Storm Systems ---
const float STORM_PROBABILITY = 0.7;      // Chance of having major storm
const float STORM_SIZE_MIN = 0.03;        // Minimum storm size
const float STORM_SIZE_MAX = 0.12;        // Maximum storm size
const float STORM_LATITUDE_MIN = 0.15;    // Storms avoid polar regions
const float STORM_LATITUDE_MAX = 0.85;    // Storms avoid polar regions
const float STORM_ROTATION_SPEED = 0.1;   // Internal storm rotation
const float STORM_COLOR_BOOST = 1.3;      // Color intensity in storms
const int MAX_STORMS = 3;                 // Maximum number of storms

// --- Turbulence ---
const float TURB_SCALE_LARGE = 4.0;       // Large-scale turbulence
const float TURB_SCALE_MEDIUM = 12.0;     // Medium-scale turbulence
const float TURB_SCALE_SMALL = 30.0;      // Small-scale turbulence (detail mode)
const float TURB_STRENGTH = 0.15;         // Turbulence displacement strength
const float TURB_TIME_SCALE = 0.02;       // Turbulence animation speed

// --- Cloud Layers ---
const float CLOUD_SCALE = 6.0;            // Cloud pattern scale
const float CLOUD_SPEED = 0.01;           // Cloud drift speed
const float CLOUD_WARP_STRENGTH = 0.5;    // Domain warping intensity
const int CLOUD_OCTAVES = 4;              // FBM octaves for clouds

// --- Zonal Flow (jet streams) ---
const float ZONAL_FLOW_STRENGTH = 0.08;   // Jet stream displacement
const float ZONAL_FLOW_SPEED = 0.03;      // Flow animation speed

// --- Color Palettes (6 distinct gas giant types) ---
// Jupiter-like (tan/orange bands)
const vec3 PALETTE_JUPITER_WARM = vec3(0.95, 0.75, 0.55);
const vec3 PALETTE_JUPITER_COOL = vec3(0.8, 0.65, 0.5);
// Saturn-like (golden/cream)
const vec3 PALETTE_SATURN_WARM = vec3(0.95, 0.85, 0.6);
const vec3 PALETTE_SATURN_COOL = vec3(0.85, 0.78, 0.55);
// Red-brown (high contrast)
const vec3 PALETTE_RED_WARM = vec3(0.9, 0.55, 0.4);
const vec3 PALETTE_RED_COOL = vec3(0.7, 0.5, 0.45);
// Blue-grey (cold gas giant)
const vec3 PALETTE_BLUE_WARM = vec3(0.65, 0.7, 0.85);
const vec3 PALETTE_BLUE_COOL = vec3(0.55, 0.65, 0.8);
// Green-brown (exotic)
const vec3 PALETTE_GREEN_WARM = vec3(0.7, 0.8, 0.55);
const vec3 PALETTE_GREEN_COOL = vec3(0.6, 0.7, 0.5);
// Purple-pink (warm/irradiated)
const vec3 PALETTE_PURPLE_WARM = vec3(0.85, 0.6, 0.8);
const vec3 PALETTE_PURPLE_COOL = vec3(0.7, 0.55, 0.75);
// Storm colors (more saturated)
const vec3 STORM_COLOR_MULT = vec3(1.4, 0.9, 0.7);

// --- Limb Effects ---
const float LIMB_DARK_EDGE = -0.1;        // Lower edge of limb darkening
const float LIMB_DARK_CENTER = 0.7;       // Upper edge of limb darkening
const float LIMB_MIN_BRIGHTNESS = 0.5;    // Minimum brightness of limb darkening
const float HAZE_POWER = 3.0;             // Power of haze
const float HAZE_STRENGTH = 0.25;         // Strength of haze

// --- Temperature Effects ---
const float TEMP_WARM_THRESHOLD = 400.0;  // Above this, more active storms
const float TEMP_HOT_THRESHOLD = 800.0;   // Above this, starts glowing

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// STORM FUNCTION
// =============================================================================

/**
 * Calculate storm contribution at a point
 * Returns: x = storm mask, y = rotation angle
 */
vec2 stormContribution(vec2 uv, vec2 stormCenter, float stormSize, float time) {
    vec2 delta = uv - stormCenter;
    
    // Wrap around for seamless texture
    if (delta.x > 0.5) delta.x -= 1.0;
    if (delta.x < -0.5) delta.x += 1.0;
    
    float dist = length(delta);
    float normalizedDist = dist / stormSize;
    
    // Storm mask with soft edges
    float mask = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
    mask = mask * mask;  // Sharper falloff
    
    // Rotation angle for spiral
    float angle = atan(delta.y, delta.x) + time * STORM_ROTATION_SPEED;
    
    return vec2(mask, angle);
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // === SEED-BASED VARIATION ===
    float bandCount = BAND_COUNT_BASE + seedHash(uSeed) * BAND_COUNT_VARIATION;
    vec3 scales = seedScales(uSeed);
    float phaseOffset = seedPhase(uSeed);
    float hueShift = seedHueShift(uSeed);
    
    // === COLOR PALETTE SELECTION ===
    float paletteSelector = seedHash(uSeed + 0.77);
    float saturationVar = 0.75 + seedHash(uSeed + 0.88) * 0.5;  // 0.75 to 1.25
    float contrastVar = 0.7 + seedHash(uSeed + 0.99) * 0.6;     // 0.7 to 1.3
    
    // === USE 3D POSITION FOR SEAMLESS SAMPLING ===
    // This avoids UV seam and polar artifacts
    vec3 samplePos = spherePos;
    
    // Apply seed-based rotation for variety
    float seedAngle = uSeed * 6.283;
    float ca = cos(seedAngle);
    float sa = sin(seedAngle);
    samplePos = vec3(
        samplePos.x * ca - samplePos.z * sa,
        samplePos.y,
        samplePos.x * sa + samplePos.z * ca
    );
    
    // === LATITUDE FROM 3D POSITION (avoids UV distortion) ===
    float latitude = samplePos.y * 0.5 + 0.5;  // -1 to 1 -> 0 to 1
    
    // Longitude for flow calculations (avoids seam by using atan2 carefully)
    float longitude = atan(samplePos.z, samplePos.x) / 6.283 + 0.5;
    
    // === ZONAL FLOW (jet streams) ===
    // Use wrapped time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    float zonalOffset = sin(latitude * 3.14159 * bandCount * 0.5) * ZONAL_FLOW_STRENGTH;
    zonalOffset += wrappedTime * ZONAL_FLOW_SPEED * (latitude - 0.5);
    
    // === ATMOSPHERIC BANDS ===
    // Use 3D noise for wobble to avoid seam artifacts
    float bandWobble = snoise3D(samplePos * BAND_WOBBLE_SCALE + vec3(phaseOffset)) * BAND_WOBBLE_STRENGTH;
    float bandPosition = latitude + bandWobble;
    
    // Calculate band pattern
    float bandPattern = sin(bandPosition * 3.14159 * bandCount);
    bandPattern = bandPattern * 0.5 + 0.5;  // Normalize to 0-1
    
    // Vary band width by seed and latitude
    float bandWidth = BAND_WIDTH_BASE + seedBandWidth(uSeed, latitude) * BAND_WIDTH_VARIATION;
    bandPattern = smoothstep(0.5 - bandWidth * 0.5, 0.5 + bandWidth * 0.5, bandPattern);
    
    // === CLOUD TURBULENCE (3D position-based for seamless) ===
    vec3 turbCoord = samplePos * TURB_SCALE_LARGE + vec3(wrappedTime * TURB_TIME_SCALE + phaseOffset);
    float turbulence = fbmWarped3D(turbCoord * scales.x, CLOUD_OCTAVES, CLOUD_WARP_STRENGTH);
    
    // Add medium-scale detail
    if (uDetailLevel > 0.5) {
        float medTurb = fbm3D(samplePos * TURB_SCALE_MEDIUM * scales.y, 3);
        turbulence = turbulence * 0.7 + medTurb * 0.3;
    }
    
    // Displace bands with turbulence
    bandPattern += turbulence * TURB_STRENGTH;
    bandPattern = clamp(bandPattern, 0.0, 1.0);
    
    // === STORM SYSTEMS (use UV for storms since they need lat/lon positioning) ===
    float stormMask = 0.0;
    vec3 stormColor = uBaseColor * STORM_COLOR_MULT;
    
    // UV for storm positioning (use original vUv to avoid polar artifacts in storm placement)
    vec2 stormUV = vec2(longitude, latitude);
    
    if (seedHasCommonFeature(uSeed, 0.0)) {
        for (int i = 0; i < MAX_STORMS; i++) {
            if (!seedHasUncommonFeature(uSeed, float(i) + 1.0)) continue;
            
            vec2 stormPos = seedStormPosition(uSeed, float(i));
            float stormSize = STORM_SIZE_MIN + seedStormSize(uSeed, float(i)) * (STORM_SIZE_MAX - STORM_SIZE_MIN);
            
            // Increase storm activity with temperature
            if (uTemperature > TEMP_WARM_THRESHOLD) {
                stormSize *= 1.0 + (uTemperature - TEMP_WARM_THRESHOLD) / 500.0 * 0.5;
            }
            
            vec2 stormData = stormContribution(stormUV, stormPos, stormSize, wrappedTime);
            
            if (stormData.x > 0.01) {
                // Add spiral structure using 3D noise for seamless spirals
                float spiralNoise = snoise3D(samplePos * 20.0 + vec3(stormData.y * 2.0));
                float spiral = spiralNoise * 0.5 + 0.5;
                stormMask = max(stormMask, stormData.x * (0.7 + spiral * 0.3));
            }
        }
    }
    
    // === COLOR CALCULATION ===
    // Select palette based on seed
    vec3 warmBand, coolBand;
    if (paletteSelector < 0.17) {
        warmBand = PALETTE_JUPITER_WARM;
        coolBand = PALETTE_JUPITER_COOL;
    } else if (paletteSelector < 0.33) {
        warmBand = PALETTE_SATURN_WARM;
        coolBand = PALETTE_SATURN_COOL;
    } else if (paletteSelector < 0.5) {
        warmBand = PALETTE_RED_WARM;
        coolBand = PALETTE_RED_COOL;
    } else if (paletteSelector < 0.67) {
        warmBand = PALETTE_BLUE_WARM;
        coolBand = PALETTE_BLUE_COOL;
    } else if (paletteSelector < 0.83) {
        warmBand = PALETTE_GREEN_WARM;
        coolBand = PALETTE_GREEN_COOL;
    } else {
        warmBand = PALETTE_PURPLE_WARM;
        coolBand = PALETTE_PURPLE_COOL;
    }
    
    // Temperature affects palette - hot giants shift toward red/orange
    float hotShift = smoothstep(300.0, 800.0, uTemperature);
    warmBand = mix(warmBand, PALETTE_RED_WARM, hotShift * 0.4);
    coolBand = mix(coolBand, PALETTE_RED_COOL, hotShift * 0.3);
    
    // Apply hue shift for additional variety
    vec3 warmHSV = rgb2hsv(warmBand);
    vec3 coolHSV = rgb2hsv(coolBand);
    warmHSV.x = fract(warmHSV.x + hueShift);
    coolHSV.x = fract(coolHSV.x + hueShift);
    warmHSV.y *= saturationVar;
    coolHSV.y *= saturationVar;
    warmBand = hsv2rgb(warmHSV);
    coolBand = hsv2rgb(coolHSV);
    
    // Mix bands with variable contrast
    vec3 bandColor = mix(coolBand, warmBand, bandPattern * contrastVar);
    
    // Blend with uBaseColor for system-specific tinting
    bandColor = mix(bandColor, bandColor * uBaseColor * 1.3, 0.2);
    
    // Apply turbulence to color
    float colorTurb = turbulence * 0.5 + 0.5;
    bandColor = mix(bandColor * 0.9, bandColor * 1.1, colorTurb);
    
    // Add storm coloring
    bandColor = mix(bandColor, stormColor, stormMask * STORM_COLOR_BOOST);
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseHalfLambert(vNormal, lightDir);
    
    // Limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_DARK_EDGE, LIMB_DARK_CENTER, LIMB_MIN_BRIGHTNESS);
    
    // Apply lighting
    vec3 litColor = bandColor * diff * limb;
    
    // === ATMOSPHERIC HAZE ===
    vec3 hazeColor = mix(warmBand, coolBand, 0.5) * vec3(0.9, 0.95, 1.1);
    float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float haze = pow(edgeFactor, HAZE_POWER) * HAZE_STRENGTH;
    litColor += hazeColor * haze;
    
    // === HOT PLANET GLOW ===
    if (uTemperature > TEMP_HOT_THRESHOLD) {
        float glowFactor = smoothstep(TEMP_HOT_THRESHOLD, 1500.0, uTemperature);
        vec3 glowColor = vec3(1.0, 0.6, 0.3);
        litColor += glowColor * glowFactor * 0.3;
    }
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= starTint;
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,en=`/**
 * Hot Jupiter Fragment Shader V2
 *
 * Creates ultra-hot, tidally locked gas giants with:
 * - Dramatic day/night contrast
 * - Molten/glowing dayside
 * - Cooler nightside with visible heat transport
 * - Violent atmospheric dynamics
 * - Heat redistribution patterns
 *
 * Physics: Tidally locked giants receiving extreme stellar irradiation
 * Examples: 51 Pegasi b, HD 189733 b, WASP-12 b
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// HOT JUPITER CONSTANTS
// =============================================================================

// --- Day/Night Division ---
const float TERMINATOR_WIDTH = 0.15;      // Width of twilight zone
const float TERMINATOR_POSITION = 0.5;    // Where day meets night (0.5 = center)
const float DAYSIDE_GLOW_POWER = 2.0;     // How concentrated dayside heat is

// --- Thermal Emission ---
const float THERMAL_BASE_TEMP = 1000.0;   // Temperature where thermal emission starts
const float THERMAL_FULL_TEMP = 2500.0;   // Temperature at full glow
const float THERMAL_MAX_TEMP = 4000.0;    // Cap for extreme temperatures
const float THERMAL_INTENSITY = 0.8;      // Maximum thermal glow intensity
const vec3 THERMAL_COLOR_LOW = vec3(0.8, 0.2, 0.0);   // Cooler thermal color (1000K)
const vec3 THERMAL_COLOR_MID = vec3(1.0, 0.7, 0.3);   // Medium thermal color (2000K)
const vec3 THERMAL_COLOR_HIGH = vec3(1.0, 0.9, 0.6);  // Hotter thermal color (2500K)
const vec3 THERMAL_COLOR_EXTREME = vec3(1.0, 0.95, 0.9); // Extreme white-hot (3000K+)

// --- Heat Transport ---
const float HEAT_FLOW_SCALE = 5.0;        // Scale of heat transport patterns
const float HEAT_FLOW_SPEED = 0.05;       // Animation speed
const float HEAT_FLOW_STRENGTH = 0.3;     // How visible heat transport is
const float HEAT_REDISTRIBUTION = 0.4;    // How much heat reaches nightside

// --- Atmospheric Dynamics ---
const float TURB_DAYSIDE_SCALE = 8.0;     // Turbulence on hot side
const float TURB_NIGHTSIDE_SCALE = 4.0;   // Turbulence on cool side
const float TURB_INTENSITY_DAY = 0.4;     // Dayside is more turbulent
const float TURB_INTENSITY_NIGHT = 0.2;   // Nightside is calmer
const int TURB_OCTAVES = 5;

// --- Bands (weaker than regular gas giants) ---
const float BAND_COUNT = 4.0;             // Fewer bands on hot Jupiters
const float BAND_VISIBILITY = 0.15;       // Bands are less visible due to heat

// --- Hotspot Offset ---
// Real hot Jupiters have hotspot shifted east due to winds
const float HOTSPOT_OFFSET = 0.1;         // Eastward shift of hottest point

// --- Nightside ---
const vec3 NIGHTSIDE_COLOR = vec3(0.15, 0.1, 0.2);  // Deep purple-black
const float NIGHTSIDE_GLOW = 0.1;         // Faint infrared glow

// --- Limb Effects ---
const float LIMB_GLOW_POWER = 4.0;        // Edge glow concentration
const float LIMB_GLOW_STRENGTH = 0.5;     // Edge brightness

// --- Atmospheric Escape ---
const float ESCAPE_THRESHOLD = 2000.0;    // Temp where atmosphere visibly escapes
const float ESCAPE_INTENSITY = 0.2;       // Visibility of escaping gas

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    float hueShift = seedHueShift(uSeed);
    vec3 scales = seedScales(uSeed);
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    
    // Derive longitude from 3D position (0-1 range)
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = p.y * 0.5 + 0.5;
    
    // === DAY/NIGHT CALCULATION ===
    // Apply hotspot offset
    float adjustedLon = longitude - HOTSPOT_OFFSET;
    
    // Day factor: 1.0 on dayside, 0.0 on nightside
    float dayFactor = smoothstep(TERMINATOR_POSITION - TERMINATOR_WIDTH, 
                                  TERMINATOR_POSITION + TERMINATOR_WIDTH, 
                                  adjustedLon);
    
    // Wrap around (both edges are dayside center)
    float dayFactorWrap = smoothstep(TERMINATOR_POSITION - TERMINATOR_WIDTH,
                                      TERMINATOR_POSITION + TERMINATOR_WIDTH,
                                      1.0 - adjustedLon);
    dayFactor = max(dayFactor, dayFactorWrap);
    
    // Hotspot is brightest at center of dayside
    float hotspotDist = abs(adjustedLon - 0.5);
    if (adjustedLon < 0.0) hotspotDist = abs(adjustedLon + 0.5);
    if (adjustedLon > 1.0) hotspotDist = abs(adjustedLon - 1.5);
    float hotspotFactor = pow(1.0 - min(hotspotDist * 2.0, 1.0), DAYSIDE_GLOW_POWER);
    
    // === THERMAL EMISSION ===
    // Cap temperature to prevent shader issues at extreme values
    float cappedTemp = min(uTemperature, THERMAL_MAX_TEMP);
    
    // Multi-stage thermal factor for better color gradients
    float thermalFactor = smoothstep(THERMAL_BASE_TEMP, THERMAL_FULL_TEMP, cappedTemp);
    float extremeFactor = smoothstep(THERMAL_FULL_TEMP, 3500.0, cappedTemp);
    
    // 4-stage color gradient: low -> mid -> high -> extreme (white-hot)
    vec3 thermalColor;
    if (cappedTemp < 1500.0) {
        thermalColor = mix(THERMAL_COLOR_LOW, THERMAL_COLOR_MID, (cappedTemp - 1000.0) / 500.0);
    } else if (cappedTemp < 2500.0) {
        thermalColor = mix(THERMAL_COLOR_MID, THERMAL_COLOR_HIGH, (cappedTemp - 1500.0) / 1000.0);
    } else {
        thermalColor = mix(THERMAL_COLOR_HIGH, THERMAL_COLOR_EXTREME, extremeFactor);
    }
    
    // Dayside thermal emission
    float daysideThermal = dayFactor * hotspotFactor * thermalFactor * THERMAL_INTENSITY;
    
    // Some heat redistributed to nightside
    float nightsideThermal = (1.0 - dayFactor) * thermalFactor * HEAT_REDISTRIBUTION * 0.3;
    
    // === HEAT TRANSPORT PATTERNS ===
    vec3 flowCoord = p * HEAT_FLOW_SCALE + vec3(wrappedTime * HEAT_FLOW_SPEED, 0.0, wrappedTime * HEAT_FLOW_SPEED * 0.5) + vec3(phaseOffset);
    float heatFlow = fbmWarped3D(flowCoord * scales.x, 4, 0.6);
    heatFlow = heatFlow * 0.5 + 0.5;
    
    // Heat flows from day to night side
    float flowDirection = sin(latitude * 3.14159 * 3.0) * 0.5 + 0.5;
    heatFlow *= mix(0.5, 1.0, flowDirection);
    
    // === ATMOSPHERIC TURBULENCE ===
    float turbScale = mix(TURB_NIGHTSIDE_SCALE, TURB_DAYSIDE_SCALE, dayFactor);
    float turbIntensity = mix(TURB_INTENSITY_NIGHT, TURB_INTENSITY_DAY, dayFactor);
    
    vec3 turbCoord = p * turbScale * scales.y + vec3(wrappedTime * 0.03, 0.0, wrappedTime * 0.02) + vec3(phaseOffset);
    float turbulence = fbm3D(turbCoord, TURB_OCTAVES);
    
    // === WEAK BANDING ===
    float bandPattern = sin(latitude * 3.14159 * BAND_COUNT) * 0.5 + 0.5;
    bandPattern *= BAND_VISIBILITY * (1.0 - thermalFactor * 0.5);  // Bands fade with heat
    
    // === COLOR CALCULATION ===
    // Base color with seed variation
    vec3 baseHSV = rgb2hsv(uBaseColor);
    baseHSV.x = fract(baseHSV.x + hueShift);
    vec3 variedBase = hsv2rgb(baseHSV);
    
    // Dayside: dominated by thermal emission
    vec3 daysideColor = mix(variedBase * 1.5, thermalColor, daysideThermal);
    daysideColor *= 1.0 + turbulence * turbIntensity;
    daysideColor += thermalColor * heatFlow * HEAT_FLOW_STRENGTH * dayFactor;
    
    // Nightside: dark with faint glow
    vec3 nightsideColor = NIGHTSIDE_COLOR;
    nightsideColor += thermalColor * nightsideThermal;
    nightsideColor += variedBase * NIGHTSIDE_GLOW * (1.0 + turbulence * 0.3);
    
    // Heat transport visible on nightside
    nightsideColor += thermalColor * heatFlow * HEAT_FLOW_STRENGTH * 0.3 * (1.0 - dayFactor);
    
    // Blend day and night
    vec3 surfaceColor = mix(nightsideColor, daysideColor, dayFactor);
    
    // Add bands
    surfaceColor *= 1.0 + (bandPattern - 0.5) * 0.2;
    
    // === LIGHTING ===
    // Light comes from the star (locked to one side)
    vec3 lightDir = normalize(vec3(1.0, 0.2, 0.5));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // On hot Jupiters, thermal emission dominates over reflected light
    float reflectedLight = diff * (1.0 - thermalFactor * 0.7);
    
    // === LIMB EFFECTS ===
    float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    
    // Glowing edge from thermal emission
    float limbGlow = pow(edgeFactor, LIMB_GLOW_POWER) * LIMB_GLOW_STRENGTH * thermalFactor;
    surfaceColor += thermalColor * limbGlow;
    
    // === ATMOSPHERIC ESCAPE (extreme cases) ===
    if (cappedTemp > ESCAPE_THRESHOLD) {
        float escapeFactor = smoothstep(ESCAPE_THRESHOLD, 3500.0, cappedTemp);
        vec3 escapeCoord = p * 4.0 + vec3(wrappedTime * 0.1, 0.0, wrappedTime * 0.05);
        float escapePattern = snoise3D(escapeCoord);
        escapePattern = max(0.0, escapePattern);
        
        // Visible gas escaping on dayside edge - more intense at extreme temps
        float escapeZone = edgeFactor * dayFactor * escapeFactor;
        vec3 escapeColor = mix(vec3(1.0, 0.8, 0.5), vec3(1.0, 0.95, 0.85), extremeFactor);
        surfaceColor += escapeColor * escapePattern * escapeZone * ESCAPE_INTENSITY * (1.0 + extremeFactor * 0.5);
    }
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    surfaceColor *= mix(vec3(1.0), starTint, reflectedLight * 0.5);
    
    // Ensure we don't over-darken
    surfaceColor = max(surfaceColor, vec3(0.02));
    
    gl_FragColor = vec4(surfaceColor, 1.0);
}

`,nn=`/**
 * Ice Giant Fragment Shader V2
 *
 * Creates frozen ice worlds with:
 * - Actual blue/cyan ice colors (NOT grey!)
 * - Jagged ice fracture patterns
 * - Snow/frost patches
 * - Crystalline sparkle
 * - Frozen atmosphere haze
 *
 * @author guinetik
 * @see https://github.com/guinetik
 */

#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;

uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// ICE COLORS - FORCED BLUE, NOT GREY
// =============================================================================

// These are the ACTUAL colors we want - frozen blue ice
const vec3 ICE_SURFACE = vec3(0.65, 0.82, 0.95);    // Light frozen blue
const vec3 ICE_DEEP = vec3(0.25, 0.45, 0.75);       // Deep glacier blue  
const vec3 ICE_CRACK = vec3(0.15, 0.35, 0.65);      // Dark blue in cracks
const vec3 SNOW_WHITE = vec3(0.92, 0.95, 0.98);     // Bright snow
const vec3 FROST_BLUE = vec3(0.75, 0.88, 1.0);      // Frosty blue-white

// =============================================================================
// HASH FUNCTION
// =============================================================================

vec3 hash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
}

// =============================================================================
// JAGGED ICE CRACKS (not smooth marble veins)
// =============================================================================

float iceCracks(vec3 p, float scale, float seed) {
    vec3 pos = p * scale;
    
    // Multiple layers of cracks at different scales
    float cracks = 0.0;
    
    // Large primary fractures
    float n1 = snoise3D(pos * 1.0 + seed);
    float crack1 = abs(n1);
    crack1 = 1.0 - smoothstep(0.0, 0.08, crack1);  // Sharp edges
    
    // Medium secondary cracks
    float n2 = snoise3D(pos * 2.5 + seed * 2.0);
    float crack2 = abs(n2);
    crack2 = 1.0 - smoothstep(0.0, 0.06, crack2);
    
    // Fine hairline cracks
    float n3 = snoise3D(pos * 6.0 + seed * 3.0);
    float crack3 = abs(n3);
    crack3 = 1.0 - smoothstep(0.0, 0.04, crack3);
    
    cracks = crack1 * 0.6 + crack2 * 0.3 + crack3 * 0.2;
    
    return cracks;
}

// =============================================================================
// SNOW/FROST PATCHES
// =============================================================================

float snowPatches(vec3 p, float time) {
    // Large snow accumulation areas
    float snow = fbm3D(p * 3.0 + vec3(0.0, time * 0.002, 0.0), 4);
    snow = snow * 0.5 + 0.5;
    
    // Boost high areas (snow accumulates on "top")
    float heightBias = p.y * 0.3 + 0.5;
    snow = snow * heightBias;
    
    // Make it patchy
    snow = smoothstep(0.35, 0.7, snow);
    
    return snow;
}

// =============================================================================
// CRYSTALLINE TEXTURE
// =============================================================================

float crystalTexture(vec3 p, float scale) {
    float crystals = 0.0;
    
    // Voronoi-like crystal cells
    vec3 pos = p * scale;
    vec3 cell = floor(pos);
    vec3 local = fract(pos);
    
    float minDist = 1.0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            for (int z = -1; z <= 1; z++) {
                vec3 neighbor = vec3(float(x), float(y), float(z));
                vec3 point = hash33(cell + neighbor);
                float d = length(neighbor + point - local);
                minDist = min(minDist, d);
            }
        }
    }
    
    crystals = minDist;
    return crystals;
}

// =============================================================================
// SPARKLE EFFECT
// =============================================================================

float iceSparkle(vec3 p, float time, float seed) {
    vec3 sparkleCell = floor(p * 300.0);
    float h = hash33(sparkleCell + vec3(seed)).x;
    
    if (h > 0.985) {
        float twinkle = sin(time * 4.0 + h * 50.0) * 0.5 + 0.5;
        twinkle *= sin(time * 9.0 + h * 100.0) * 0.5 + 0.5;
        return twinkle * 0.9;
    }
    return 0.0;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    float time = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float seed = seedHash(uSeed) * 100.0;
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    
    // === HOW FROZEN IS IT? ===
    // Colder = more intense blue, more frost, more sparkle
    float frozen = smoothstep(400.0, 50.0, uTemperature);  // 1.0 at 50K
    float extremeFrozen = smoothstep(150.0, 20.0, uTemperature);  // Extra boost below 150K
    
    // === ICE CRACKS ===
    float cracks = iceCracks(p, 4.0, seed);
    
    // === SNOW PATCHES ===
    float snow = snowPatches(p, time);
    // More snow on colder planets
    snow *= 0.5 + frozen * 0.7;
    
    // === CRYSTAL TEXTURE ===
    float crystals = crystalTexture(p, 8.0);
    
    // === DEEP ICE STRUCTURE ===
    float deepIce = fbm3D(p * 2.0 + vec3(seed * 0.1), 3);
    deepIce = deepIce * 0.5 + 0.5;
    
    // ==========================================================
    // COLOR - FORCE BLUE ICE COLORS
    // ==========================================================
    
    // Start with frozen blue surface
    vec3 surfaceColor = ICE_SURFACE;
    
    // Vary blue hue slightly based on seed (but STAY BLUE)
    float hueVar = (seedHash(uSeed + 0.5) - 0.5) * 0.08;  // Small variation
    vec3 hsv = rgb2hsv(surfaceColor);
    hsv.x = fract(hsv.x + hueVar);  // Shift hue slightly
    hsv.y *= 0.85 + frozen * 0.3;   // More saturated when colder
    surfaceColor = hsv2rgb(hsv);
    
    // Blend with deep ice based on structure
    vec3 color = mix(ICE_DEEP, surfaceColor, deepIce * 0.5 + 0.5);
    
    // Add crystal variation (subtle brightness changes)
    color *= 0.9 + crystals * 0.2;
    
    // CRACKS are darker, deeper blue
    color = mix(color, ICE_CRACK, cracks * 0.7);
    
    // SNOW patches are bright white-blue
    vec3 snowColor = mix(FROST_BLUE, SNOW_WHITE, 0.6 + frozen * 0.3);
    color = mix(color, snowColor, snow * 0.6);
    
    // Frozen boost - colder = more vibrant blue
    color = mix(color, color * vec3(0.85, 0.95, 1.15), frozen * 0.4);
    
    // === SPARKLE ===
    float sparkle = iceSparkle(spherePos, time, uSeed);
    sparkle *= 1.0 + extremeFrozen * 2.0;  // More sparkles when very cold
    color += vec3(sparkle) * vec3(0.95, 0.98, 1.0);
    
    // === SUBSURFACE SCATTERING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float backlight = max(dot(-vNormal, lightDir), 0.0);
    float sss = pow(backlight, 2.5) * 0.2 * (1.0 + frozen * 0.5);
    color += ICE_SURFACE * sss * 1.5;
    
    // === LIGHTING ===
    float diff = max(dot(vNormal, lightDir), 0.0) * 0.5 + 0.5;  // Half-lambert
    
    // Specular (ice is shiny)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 48.0);
    
    // Apply lighting
    vec3 litColor = color * diff;
    litColor += vec3(1.0, 0.98, 0.95) * spec * 0.4;  // White specular
    
    // === LIMB DARKENING ===
    float limb = max(dot(vNormal, viewDir), 0.0);
    limb = 0.5 + limb * 0.5;
    litColor *= limb;
    
    // === ATMOSPHERIC HAZE ===
    float edge = 1.0 - abs(dot(vNormal, viewDir));
    float haze = pow(edge, 2.0) * 0.35;
    vec3 hazeColor = mix(vec3(0.7, 0.85, 1.0), vec3(0.85, 0.92, 1.0), frozen);
    litColor += hazeColor * haze;
    
    // === MINIMAL STAR TINT ===
    // Don't let star color wash out our ice colors too much
    vec3 starTint = starLightTint(uStarTemp);
    // Reduce star influence on cold ice planets
    starTint = mix(vec3(1.0), starTint, 0.3);
    litColor *= starTint;
    
    // === FINAL BRIGHTNESS BOOST FOR FROZEN PLANETS ===
    litColor *= 1.0 + frozen * 0.15;
    
    gl_FragColor = vec4(litColor, 1.0);
}
`,tn=`/**
 * Icy World Fragment Shader V2
 *
 * Creates frozen worlds like Europa and Enceladus with:
 * - Ice fracture patterns (lineae)
 * - Subsurface ocean hints
 * - Impact craters
 * - Smooth ice plains
 * - Subtle color variations in ice
 *
 * Physics: Frozen surfaces over possible subsurface oceans
 * Examples: Europa, Enceladus, TRAPPIST-1 f/g
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;
uniform float uZoomLevel;      // 0 = far, 1 = close - controls surface detail visibility
uniform float uBodyDiameter;   // Body diameter for scale reference

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// ICY WORLD CONSTANTS
// =============================================================================

// --- Ice Surface ---
const float ICE_SCALE = 4.0;                         // Scale of ice surface
const int ICE_OCTAVES = 4;                           // Number of octaves for ice surface
const vec3 ICE_COLOR_WHITE = vec3(0.88, 0.93, 0.98); // White-blue ice (not grey!)
const vec3 ICE_COLOR_BLUE = vec3(0.6, 0.78, 0.95);   // Strong blue ice
const vec3 ICE_COLOR_DEEP = vec3(0.35, 0.55, 0.85);  // Deep glacier blue
const vec3 ICE_COLOR_GREY = vec3(0.7, 0.75, 0.82);   // Blue-grey (not pure grey!)
const vec3 ICE_COLOR_BROWN = vec3(0.5, 0.45, 0.4);   // Brown ice color (dirty ice/organics)

// --- Fractures (Lineae) ---
const float FRACTURE_SCALE = 8.0;                    // Scale of fractures
const float FRACTURE_THRESHOLD = 0.12;               // Width of fractures
const float FRACTURE_DEPTH = 0.3;                    // How dark fractures are
const vec3 FRACTURE_COLOR = vec3(0.4, 0.35, 0.32);   // Brownish fractures
const float FRACTURE_GLOW = 0.1;                     // Hint of subsurface warmth

// --- Impact Craters ---
const float CRATER_PROBABILITY = 0.6;                // Probability of impact craters
const float CRATER_SIZE_MIN = 0.02;                  // Minimum crater size
const float CRATER_SIZE_MAX = 0.08;                  // Maximum crater size
const int MAX_CRATERS = 5;                           // Maximum number of craters
const float CRATER_RIM_BRIGHTNESS = 1.15;            // Brightness of crater rim
const float CRATER_FLOOR_DARKNESS = 0.85;            // Darkness of crater floor

// --- Chaos Terrain ---
// Disrupted ice indicating subsurface activity
const float CHAOS_SCALE = 6.0;                       // Scale of chaos terrain
const float CHAOS_THRESHOLD = 0.7;                   // How rare chaos terrain is
const float CHAOS_ROUGHNESS = 0.25;                  // Roughness of chaos terrain

// --- Smooth Plains ---
const float PLAIN_SMOOTHNESS = 0.8;                  // How smooth ice plains are
const float PLAIN_COLOR_VARIATION = 0.1;             // Variation of ice plains color

// --- Subsurface Hints ---
const float SUBSURFACE_HINT = 0.08;                  // Visibility of subsurface features
const vec3 SUBSURFACE_COLOR = vec3(0.3, 0.5, 0.6);   // Blue-grey subsurface

// --- Atmosphere (thin) ---
const float ATMO_SCALE = 0.15;                       // Very thin atmosphere haze

// --- Limb Darkening ---
const float LIMB_EDGE_LOW = -0.1;                    // Lower edge of limb darkening
const float LIMB_EDGE_HIGH = 0.85;                   // Upper edge of limb darkening
const float LIMB_MIN_BRIGHTNESS = 0.5;               // Minimum brightness of limb darkening

// --- Albedo ---
const float ICE_ALBEDO = 0.7;                       // Ice is highly reflective

// --- Zoom Detail ---
const float ICE_CRACK_SCALE = 50.0;                // Fine ice cracks scale
const float CRYSTAL_SCALE = 80.0;                  // Crystalline structure scale

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// ZOOM DETAIL FUNCTION
// =============================================================================

/**
 * Add fine ice details when zoomed in - cracks, crystals, and texture
 */
vec3 iceZoomDetail(vec3 p, vec3 iceColor, float zoomLevel, float seed) {
    if (zoomLevel < 0.15) {
        return iceColor;
    }

    float detailFade = smoothstep(0.15, 0.5, zoomLevel);

    // Fine surface cracks
    float crackNoise = abs(snoise3D(p * ICE_CRACK_SCALE + vec3(seed * 10.0)));
    float cracks = 1.0 - smoothstep(0.0, 0.08, crackNoise);
    iceColor = mix(iceColor, iceColor * 0.7, cracks * 0.4 * detailFade);

    // Crystalline structure highlights
    float crystalNoise = vnoise3D(p * CRYSTAL_SCALE + vec3(seed * 5.0));
    float crystals = smoothstep(0.6, 0.8, crystalNoise);
    iceColor += vec3(0.1, 0.12, 0.15) * crystals * 0.3 * detailFade;

    // Small impact pits at high zoom
    if (zoomLevel > 0.4) {
        float pitFade = smoothstep(0.4, 0.7, zoomLevel);
        float pitNoise = vnoise3D(p * 40.0 + vec3(seed * 8.0));
        float pits = smoothstep(0.65, 0.8, pitNoise);
        iceColor *= (1.0 - pits * 0.15 * pitFade);
    }

    // Fine ice grain at maximum zoom
    if (zoomLevel > 0.6) {
        float grainFade = smoothstep(0.6, 0.9, zoomLevel);
        float grain = snoise3D(p * 150.0 + vec3(seed * 3.0)) * 0.5 + 0.5;
        iceColor *= 0.96 + grain * 0.08 * grainFade;
    }

    return iceColor;
}

// =============================================================================
// HASH FUNCTION (for sparkle effect)
// =============================================================================

vec3 hash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
}

// =============================================================================
// STYLIZED ICE TEXTURE FUNCTIONS
// =============================================================================

/**
 * Dramatic branching cracks - like veins or lightning across the surface
 * Creates that stylized Europa look with organic flowing fractures
 */
float branchingCracks(vec3 pos, float seed) {
    float cracks = 0.0;
    
    // === MAJOR VEINS - thick dramatic cracks ===
    // Use domain warping for organic flow
    vec3 warp1 = vec3(
        snoise3D(pos * 2.0 + seed),
        snoise3D(pos * 2.0 + seed + 100.0),
        snoise3D(pos * 2.0 + seed + 200.0)
    ) * 0.3;
    
    float vein1 = abs(snoise3D((pos + warp1) * 3.0 + seed));
    vein1 = 1.0 - smoothstep(0.0, 0.08, vein1);
    
    // Second major vein system at different angle
    vec3 warp2 = vec3(
        snoise3D(pos * 1.5 + seed + 50.0),
        snoise3D(pos * 1.5 + seed + 150.0),
        snoise3D(pos * 1.5 + seed + 250.0)
    ) * 0.4;
    
    float vein2 = abs(snoise3D((pos.zxy + warp2) * 2.5 + seed * 2.0));
    vein2 = 1.0 - smoothstep(0.0, 0.07, vein2);
    
    // === MEDIUM BRANCHES - spreading from major veins ===
    vec3 warp3 = vec3(
        snoise3D(pos * 4.0 + seed + 300.0),
        snoise3D(pos * 4.0 + seed + 400.0),
        snoise3D(pos * 4.0 + seed + 500.0)
    ) * 0.2;
    
    float branch1 = abs(snoise3D((pos + warp3) * 6.0 + seed));
    branch1 = 1.0 - smoothstep(0.0, 0.05, branch1);
    
    float branch2 = abs(snoise3D((pos.yzx + warp3) * 7.0 + seed * 1.5));
    branch2 = 1.0 - smoothstep(0.0, 0.04, branch2);
    
    // === FINE CAPILLARIES - thin spreading cracks ===
    float fine1 = abs(snoise3D(pos * 12.0 + seed * 3.0));
    fine1 = 1.0 - smoothstep(0.0, 0.03, fine1);
    
    float fine2 = abs(snoise3D(pos * 18.0 + seed * 4.0));
    fine2 = 1.0 - smoothstep(0.0, 0.025, fine2);
    
    // Combine with hierarchy - major veins most prominent
    cracks = vein1 * 0.9 + vein2 * 0.7;
    cracks = max(cracks, branch1 * 0.5 + branch2 * 0.4);
    cracks = max(cracks, fine1 * 0.25 + fine2 * 0.15);
    
    return clamp(cracks, 0.0, 1.0);
}

/**
 * Ice surface variation - lighter and darker patches
 */
float iceVariation(vec3 pos, float seed) {
    // Large scale variation
    float large = fbm3D(pos * 2.0 + vec3(seed), 3) * 0.5 + 0.5;
    
    // Medium detail
    float medium = snoise3D(pos * 5.0 + seed * 2.0) * 0.5 + 0.5;
    
    return large * 0.7 + medium * 0.3;
}

/**
 * Bright frost patches
 */
float frostPatches(vec3 pos, float seed) {
    float frost = fbm3D(pos * 3.5 + vec3(seed * 10.0), 3) * 0.5 + 0.5;
    frost = smoothstep(0.5, 0.75, frost);
    return frost;
}

/**
 * Ice sparkle effect
 */
float iceSparkle(vec3 pos, float time, float seed) {
    vec3 cell = floor(pos * 150.0);
    float h = hash33(cell + vec3(seed)).x;
    if (h > 0.985) {
        float twinkle = sin(time * 6.0 + h * 60.0) * 0.5 + 0.5;
        return twinkle * 0.6;
    }
    return 0.0;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    vec3 scales = seedScales(uSeed);
    float hueShift = seedHueShift(uSeed) * 0.2;  // Subtle variation
    
    // Determine if this is more Europa-like (fractures) or Enceladus-like (smooth)
    float europaFactor = seedHash(uSeed + 0.3);
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = p.y * 0.5 + 0.5;
    
    // === BASE ICE TERRAIN ===
    vec3 iceCoord = p * ICE_SCALE * scales.x;
    iceCoord = seedOffset3D(iceCoord, uSeed);
    
    int octaves = uDetailLevel > 0.5 ? ICE_OCTAVES : 2;
    float terrain = fbm3D(iceCoord, octaves);
    terrain = terrain * 0.5 + 0.5;
    
    // Smooth out terrain for ice plains
    terrain = mix(terrain, 0.5, PLAIN_SMOOTHNESS * (1.0 - europaFactor * 0.5));
    
    // === STYLIZED BRANCHING CRACKS ===
    // Dramatic veins spreading across the surface like the reference image
    float fractures = branchingCracks(p, uSeed);
    // Modulate by Europa factor but always have some cracks
    fractures *= 0.4 + europaFactor * 0.6;
    
    // === CHAOS TERRAIN ===
    float chaos = 0.0;
    if (europaFactor > 0.4 && uDetailLevel > 0.5) {
        float chaosNoise = fbm3D(p * CHAOS_SCALE + vec3(phaseOffset), 3);
        chaos = smoothstep(CHAOS_THRESHOLD, 1.0, chaosNoise * 0.5 + 0.5);
        chaos *= CHAOS_ROUGHNESS;
    }
    
    // === IMPACT CRATERS ===
    float craterMask = 0.0;
    float craterRim = 0.0;
    
    if (seedHasCommonFeature(uSeed, 10.0)) {
        for (int i = 0; i < MAX_CRATERS; i++) {
            if (!seedHasUncommonFeature(uSeed, float(i) + 20.0)) continue;
            
            vec2 craterPos = seedHash2(uSeed + float(i) * 0.1);
            float craterSize = CRATER_SIZE_MIN + seedHash(uSeed + float(i) * 0.2) * (CRATER_SIZE_MAX - CRATER_SIZE_MIN);
            
            // Use longitude/latitude derived from 3D position
            vec2 coordForCrater = vec2(longitude, latitude);
            vec2 delta = coordForCrater - craterPos;
            if (delta.x > 0.5) delta.x -= 1.0;
            if (delta.x < -0.5) delta.x += 1.0;
            
            float dist = length(delta);
            float normalizedDist = dist / craterSize;
            
            // Crater floor
            float floor = 1.0 - smoothstep(0.0, 0.8, normalizedDist);
            craterMask = max(craterMask, floor);
            
            // Crater rim
            float rim = smoothstep(0.7, 0.9, normalizedDist) * (1.0 - smoothstep(0.9, 1.1, normalizedDist));
            craterRim = max(craterRim, rim);
        }
    }
    
    // === COLOR CALCULATION ===
    // HOW FROZEN: colder = more intense blue ice
    float frozen = smoothstep(300.0, 50.0, uTemperature);  // 1.0 at 50K, 0.0 at 300K
    float extremeFrozen = smoothstep(100.0, 20.0, uTemperature);  // Extra frozen below 100K
    
    // For extremely cold worlds, FORCE blue ice colors (ignore physical color)
    vec3 iceBlue = ICE_COLOR_BLUE;
    vec3 iceWhite = ICE_COLOR_WHITE;
    vec3 iceDeep = ICE_COLOR_DEEP;
    
    // Colder = more saturated blue
    iceBlue = mix(iceBlue, vec3(0.5, 0.75, 1.0), extremeFrozen * 0.4);
    iceWhite = mix(iceWhite, vec3(0.85, 0.92, 1.0), frozen * 0.3);
    iceDeep = mix(iceDeep, vec3(0.25, 0.5, 0.9), extremeFrozen * 0.3);

    // Base ice color varies with terrain - blue to white gradient
    vec3 iceColor = mix(iceDeep, iceBlue, terrain * 0.7);
    iceColor = mix(iceColor, iceWhite, smoothstep(0.6, 0.9, terrain));

    // Add some variation but keep it BLUE (not grey!)
    float variation = vnoise3D(p * 8.0 + vec3(phaseOffset)) * 0.5 + 0.5;
    vec3 variationColor = mix(iceDeep, ICE_COLOR_GREY, 0.3);  // Blue-tinted grey
    iceColor = mix(iceColor, variationColor, variation * 0.15);
    
    // Very slight brown only for high density (rocky material mixed in)
    if (uDensity > 0.6) {
        float brownAmount = (uDensity - 0.6) * 0.15;
        iceColor = mix(iceColor, ICE_COLOR_BROWN, brownAmount * 0.3);
    }

    // === STYLIZED CRACKS - dark blue veins ===
    // The cracks are the DARK areas in the reference - deep blue/navy
    vec3 crackColor = mix(iceDeep * 0.4, vec3(0.1, 0.2, 0.4), 0.5);  // Dark navy blue
    iceColor = mix(iceColor, crackColor, fractures * 0.7);
    
    // === FROST PATCHES - bright white areas ===
    float frost = frostPatches(p, uSeed);
    vec3 frostColor = mix(iceWhite, vec3(0.95, 0.97, 1.0), frozen * 0.5);
    iceColor = mix(iceColor, frostColor, frost * 0.4);

    // Apply chaos terrain - slightly darker
    iceColor *= 1.0 - chaos * 0.2;

    // Apply craters
    iceColor *= mix(1.0, CRATER_FLOOR_DARKNESS, craterMask);
    iceColor *= mix(1.0, CRATER_RIM_BRIGHTNESS, craterRim);

    // Subsurface hints (blue undertones - hint of ocean beneath)
    float subsurface = vnoise3D(p * 3.0 + vec3(phaseOffset * 2.0)) * 0.5 + 0.5;
    iceColor = mix(iceColor, SUBSURFACE_COLOR, subsurface * SUBSURFACE_HINT * (1.0 - fractures));

    // Apply subtle hue shift for seed-based variety (but keep it blue!)
    vec3 iceHSV = rgb2hsv(iceColor);
    iceHSV.x = fract(iceHSV.x + hueShift * 0.5);  // Reduced hue shift
    iceColor = hsv2rgb(iceHSV);
    
    // === ICE SPARKLE ===
    float sparkle = iceSparkle(spherePos, wrappedTime, uSeed);
    sparkle *= 1.0 + extremeFrozen;  // More sparkle on colder worlds
    iceColor += vec3(0.9, 0.95, 1.0) * sparkle;

    // === ZOOM-BASED DETAIL ===
    // Add fine ice cracks, crystals and texture when zoomed in
    iceColor = iceZoomDetail(p, iceColor, uZoomLevel, uSeed);

    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseLambert(vNormal, lightDir);
    
    // Ice has high albedo
    diff = diff * ICE_ALBEDO + (1.0 - ICE_ALBEDO) * 0.1;
    
    // Specular for ice
    float spec = specularBlinn(vNormal, vec3(0.0, 0.0, 1.0), lightDir, 32.0) * 0.3;
    
    // Limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, LIMB_MIN_BRIGHTNESS);
    
    vec3 litColor = iceColor * diff * limb;
    litColor += vec3(1.0, 0.98, 0.95) * spec;
    
    // === THIN ATMOSPHERE HAZE ===
    if (uHasAtmosphere > 0.0) {
        float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float haze = pow(edgeFactor, 2.5) * ATMO_SCALE * uHasAtmosphere;
        litColor += vec3(0.7, 0.8, 1.0) * haze;
    }
    
    // === STAR TINT ===
    // Reduce star tint influence so frozen worlds stay blue
    vec3 starTint = starLightTint(uStarTemp);
    starTint = mix(vec3(1.0), starTint, 0.4);  // Only 40% star influence
    litColor *= starTint;
    
    // Boost blue for frozen worlds
    litColor = mix(litColor, litColor * vec3(0.9, 0.95, 1.1), frozen * 0.3);
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,on=`/**
 * Lava World Fragment Shader V2
 *
 * Creates realistic volcanic hellscapes with:
 * - Tectonic plate-like cooling crust
 * - Convection cells in molten lava
 * - Dramatic glowing fractures
 * - Temperature-accurate color gradients
 * - Volcanic hotspots
 *
 * Based on real volcanic and lava physics
 * 
 * @author guinetik
 * @see https://github.com/guinetik
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;
uniform float uZoomLevel;
uniform float uBodyDiameter;

uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// CHROME-SAFE HASH FUNCTIONS
// Using integer-based hashing to avoid sin() precision issues in ANGLE
// =============================================================================

vec3 hash33_lava(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
}

float hash11_lava(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

// =============================================================================
// REALISTIC LAVA COLORS (temperature-based)
// =============================================================================

// Real lava color temperatures (in Kelvin approximations)
const vec3 LAVA_BLACK = vec3(0.05, 0.02, 0.01);       // Cooled crust ~700K
const vec3 LAVA_DARK_RED = vec3(0.3, 0.05, 0.0);      // ~900K
const vec3 LAVA_RED = vec3(0.6, 0.1, 0.0);            // ~1000K
const vec3 LAVA_ORANGE = vec3(0.95, 0.4, 0.05);       // ~1200K
const vec3 LAVA_YELLOW = vec3(1.0, 0.75, 0.2);        // ~1400K
const vec3 LAVA_WHITE = vec3(1.0, 0.95, 0.8);         // ~1600K+

// Crust colors (cooled basalt)
const vec3 CRUST_DARK = vec3(0.06, 0.04, 0.03);
const vec3 CRUST_MID = vec3(0.12, 0.08, 0.06);
const vec3 CRUST_LIGHT = vec3(0.2, 0.14, 0.1);

// =============================================================================
// TECTONIC PLATES (Voronoi-based)
// =============================================================================

/**
 * Creates tectonic plate pattern with cracks between plates
 */
float tectonicPlates(vec3 p, float scale, out float plateId, out float crackDist) {
    vec3 pos = p * scale;
    vec3 cell = floor(pos);
    vec3 local = fract(pos);
    
    float minDist = 10.0;
    float secondDist = 10.0;
    vec3 nearestCell = cell;
    
    // Find nearest and second nearest cell centers
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            for (int z = -1; z <= 1; z++) {
                vec3 neighbor = vec3(float(x), float(y), float(z));
                vec3 cellPos = cell + neighbor;
                
                // Random point within cell - using Chrome-safe hash
                vec3 h = hash33_lava(cellPos);
                vec3 point = h * 0.6 + 0.2;
                
                vec3 diff = neighbor + point - local;
                float d = length(diff);
                
                if (d < minDist) {
                    secondDist = minDist;
                    minDist = d;
                    nearestCell = cellPos;
                } else if (d < secondDist) {
                    secondDist = d;
                }
            }
        }
    }
    
    // Plate ID for color variation - using Chrome-safe hash
    plateId = hash33_lava(nearestCell).x;
    
    // Distance to crack (boundary between plates)
    crackDist = secondDist - minDist;
    
    return minDist;
}

// =============================================================================
// CONVECTION CELLS
// =============================================================================

/**
 * Simulates convection in molten lava
 * Hot material rises (bright), cool material sinks (darker)
 */
float convectionCells(vec3 p, float time, float seed) {
    // Large convection cells
    float cells = 0.0;
    
    // Animated position for convection motion
    vec3 pos = p + vec3(0.0, time * 0.02, 0.0);
    
    // Primary cells
    float n1 = snoise3D(pos * 4.0 + seed);
    float cell1 = n1 * 0.5 + 0.5;
    
    // Rising plumes (bright spots)
    float plumes = smoothstep(0.6, 0.9, cell1);
    
    // Sinking regions (darker)
    float sinks = smoothstep(0.4, 0.1, cell1);
    
    // Secondary turbulence
    float turb = snoise3D(pos * 12.0 + seed * 2.0) * 0.3;
    
    cells = cell1 + plumes * 0.3 - sinks * 0.2 + turb;
    
    return clamp(cells, 0.0, 1.0);
}

// =============================================================================
// VOLCANIC HOTSPOTS
// =============================================================================

/**
 * Creates volcanic hotspot regions - extra active areas
 */
float volcanicHotspots(vec3 p, float seed, float time) {
    float hotspots = 0.0;
    
    // Create several hotspot centers
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        
        // Random hotspot position - using Chrome-safe hash
        vec3 h = hash33_lava(vec3(seed, fi * 0.1, seed * 0.5 + fi));
        vec3 center = normalize(h * 2.0 - 1.0);
        
        // Distance to hotspot
        float d = length(p - center);
        
        // Hotspot intensity with pulsing (time is already wrapped)
        float pulsePhase = hash11_lava(seed + fi) * 6.28318;
        float pulse = sin(time * 0.5 + pulsePhase) * 0.3 + 0.7;
        float intensity = (1.0 - smoothstep(0.0, 0.4, d)) * pulse;
        
        hotspots = max(hotspots, intensity);
    }
    
    return hotspots;
}

// =============================================================================
// LAVA TEMPERATURE TO COLOR
// =============================================================================

/**
 * Maps lava temperature/intensity to realistic color
 */
vec3 lavaColor(float temp) {
    // temp: 0 = cool crust, 1 = white hot
    
    if (temp < 0.15) {
        // Cooled crust - black
        return mix(LAVA_BLACK, LAVA_DARK_RED, temp / 0.15);
    } else if (temp < 0.3) {
        // Dark red glow
        return mix(LAVA_DARK_RED, LAVA_RED, (temp - 0.15) / 0.15);
    } else if (temp < 0.5) {
        // Bright red to orange
        return mix(LAVA_RED, LAVA_ORANGE, (temp - 0.3) / 0.2);
    } else if (temp < 0.75) {
        // Orange to yellow
        return mix(LAVA_ORANGE, LAVA_YELLOW, (temp - 0.5) / 0.25);
    } else {
        // Yellow to white hot
        return mix(LAVA_YELLOW, LAVA_WHITE, (temp - 0.75) / 0.25);
    }
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    float time = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float seed = seedHash(uSeed) * 100.0;
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    
    // === PLANET HEAT LEVEL ===
    // How hot is this lava world? (affects how much molten vs crust)
    float planetHeat = smoothstep(800.0, 2000.0, uTemperature);
    float extremeHeat = smoothstep(1500.0, 3000.0, uTemperature);
    
    // === TECTONIC PLATES ===
    // Plate size varies by seed: some worlds have few large plates, others many small
    float plateSizeVar = hash11_lava(seed * 7.89);  // 0-1, Chrome-safe
    float plateScale = 0.8 + plateSizeVar * 2.0;  // Range: 0.8 (huge plates) to 2.8 (smaller plates)
    float fineScale = plateScale * 2.5 + 1.0;     // Secondary cracks scale with main plates
    
    float plateId, crackDist;
    float plateNoise = tectonicPlates(p, plateScale, plateId, crackDist);
    
    // Cracks between plates - this is where lava shows through
    // Wider cracks on worlds with larger plates
    float crackWidth = 0.1 + (1.0 - plateSizeVar) * 0.1;
    float crackIntensity = 1.0 - smoothstep(0.0, crackWidth, crackDist);
    
    // Finer cracks within plates (secondary fractures)
    float fineId, fineCrackDist;
    tectonicPlates(p, fineScale, fineId, fineCrackDist);
    float fineCracks = 1.0 - smoothstep(0.0, 0.08, fineCrackDist);
    
    // === CONVECTION IN LAVA ===
    float convection = convectionCells(p, time, seed);
    
    // === VOLCANIC HOTSPOTS ===
    float hotspots = volcanicHotspots(p, seed, time);
    
    // === DETERMINE SURFACE TYPE ===
    // More cracks and less crust when hotter
    float crustThreshold = 0.15 - planetHeat * 0.1;
    
    // Is this point crust or exposed lava?
    float isCrust = step(crustThreshold, crackDist);
    float lavaExposure = 1.0 - isCrust;
    
    // Add fine cracks that glow
    lavaExposure = max(lavaExposure, fineCracks * 0.7);
    
    // Hotspots break through crust
    lavaExposure = max(lavaExposure, hotspots * 0.8);
    
    // === LAVA TEMPERATURE ===
    // Base temperature from convection
    float lavaTemp = convection * 0.6 + 0.2;
    
    // Cracks are hotter (fresh lava)
    lavaTemp = mix(lavaTemp, 0.8, crackIntensity * 0.5);
    
    // Hotspots are hottest
    lavaTemp = mix(lavaTemp, 0.95, hotspots);
    
    // Fine cracks are cooler (less exposed)
    float fineCrackTemp = lavaTemp * 0.6;
    
    // Planet heat affects overall temperature
    lavaTemp *= 0.6 + planetHeat * 0.4;
    lavaTemp += extremeHeat * 0.2;  // Boost for very hot planets
    
    // === CRUST APPEARANCE ===
    // Cooled lava crust with slight color variation per plate
    vec3 crustColor = mix(CRUST_DARK, CRUST_MID, plateId * 0.5);
    
    // Add texture variation
    float crustTex = fbm3D(p * 15.0 + seed, 3) * 0.5 + 0.5;
    crustColor = mix(crustColor, CRUST_LIGHT, crustTex * 0.3);
    
    // Crust near cracks is warmer colored
    float edgeWarmth = 1.0 - smoothstep(0.0, 0.25, crackDist);
    crustColor = mix(crustColor, LAVA_DARK_RED * 0.5, edgeWarmth * 0.4);
    
    // === COMBINE CRUST AND LAVA ===
    vec3 lavaCol = lavaColor(lavaTemp);
    vec3 fineCrackCol = lavaColor(fineCrackTemp);
    
    vec3 surfaceColor;
    
    // Main surface is crust
    surfaceColor = crustColor;
    
    // Add glowing fine cracks
    surfaceColor = mix(surfaceColor, fineCrackCol, fineCracks * 0.8);
    
    // Major cracks and exposed lava
    surfaceColor = mix(surfaceColor, lavaCol, crackIntensity);
    
    // Hotspot glow
    surfaceColor = mix(surfaceColor, lavaCol, hotspots * 0.6);
    
    // === EMISSION (SELF-ILLUMINATION) ===
    float emission = 0.0;
    
    // Lava emits light
    emission += lavaExposure * lavaTemp * 1.5;
    
    // Fine cracks glow
    emission += fineCracks * fineCrackTemp * 0.8;
    
    // Hotspots are very bright
    emission += hotspots * 1.2;
    
    // Crust edges glow faintly
    emission += edgeWarmth * 0.2;
    
    // Scale by planet heat
    emission *= 0.5 + planetHeat * 0.5;
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    
    // Diffuse for crust only (lava is self-lit)
    float diff = max(dot(vNormal, lightDir), 0.0);
    diff = mix(diff, 0.5, lavaExposure);  // Lava doesn't need external light
    
    // Apply lighting
    vec3 litColor = surfaceColor * (diff * 0.2 + 0.1);  // Dim ambient/diffuse
    litColor += surfaceColor * emission;  // Strong emission
    
    // === LIMB GLOW (heat escaping at edges) ===
    float edge = 1.0 - abs(dot(vNormal, viewDir));
    float limbGlow = pow(edge, 2.5) * 0.5 * planetHeat;
    vec3 limbColor = mix(LAVA_ORANGE, LAVA_RED, 0.5);
    litColor += limbColor * limbGlow;
    
    // === ATMOSPHERIC HAZE (if present) ===
    if (uHasAtmosphere > 0.0) {
        float haze = pow(edge, 2.0) * 0.3 * uHasAtmosphere;
        vec3 hazeColor = mix(LAVA_ORANGE, vec3(0.5, 0.3, 0.2), 0.5);
        litColor += hazeColor * haze;
    }
    
    // === STAR TINT (minimal for self-luminous world) ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= mix(vec3(1.0), starTint, 0.2);
    
    // === HDR BOOST for hot areas ===
    litColor *= 1.0 + emission * 0.3;
    
    gl_FragColor = vec4(litColor, 1.0);
}
`,an=`/**
 * Ocean World Fragment Shader V2
 *
 * Creates water-dominated worlds with:
 * - Deep global oceans with wave patterns
 * - Optional small landmasses/islands
 * - Dynamic cloud systems
 * - Specular reflections
 * - Depth color gradients
 *
 * Physics: Low density rocky worlds with significant water content
 * Possibly tidally heated moons or planets in habitable zone
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// OCEAN WORLD CONSTANTS
// =============================================================================

// --- Ocean Colors ---
const vec3 OCEAN_SHALLOW = vec3(0.15, 0.45, 0.55);
const vec3 OCEAN_MID = vec3(0.08, 0.25, 0.45);
const vec3 OCEAN_DEEP = vec3(0.03, 0.10, 0.25);
const vec3 OCEAN_ABYSS = vec3(0.01, 0.03, 0.08);

// --- Ocean Properties ---
const float OCEAN_DEPTH_SCALE = 3.0;
const int OCEAN_DEPTH_OCTAVES = 4;
const float DEPTH_VARIATION = 0.6;        // How much depth varies

// --- Waves ---
const float WAVE_SCALE_LARGE = 40.0;
const float WAVE_SCALE_SMALL = 120.0;
const float WAVE_SPEED_LARGE = 0.03;
const float WAVE_SPEED_SMALL = 0.08;
const float WAVE_HEIGHT_LARGE = 0.015;
const float WAVE_HEIGHT_SMALL = 0.005;

// --- Islands/Land ---
const float LAND_PROBABILITY = 0.5;       // Chance of having land
const float LAND_COVERAGE = 0.15;         // Maximum land coverage
const float LAND_THRESHOLD = 0.85;        // Height threshold for land
const vec3 LAND_COLOR_BEACH = vec3(0.8, 0.75, 0.6);
const vec3 LAND_COLOR_VEGETATION = vec3(0.2, 0.5, 0.25);
const vec3 LAND_COLOR_ROCK = vec3(0.45, 0.4, 0.35);

// --- Clouds ---
const float CLOUD_SCALE = 5.0;
const float CLOUD_SPEED = 0.01;
const float CLOUD_THRESHOLD = 0.4;
const float CLOUD_OPACITY = 0.6;
const int CLOUD_OCTAVES = 5;

// --- Specular ---
const float SPEC_POWER = 48.0;
const float SPEC_INTENSITY = 0.8;

// --- Atmospheric Haze ---
const float HAZE_POWER = 2.5;
const float HAZE_INTENSITY = 0.35;
const vec3 HAZE_COLOR = vec3(0.5, 0.7, 0.9);

// --- Limb Darkening ---
const float LIMB_EDGE_LOW = -0.15;
const float LIMB_EDGE_HIGH = 0.75;
const float LIMB_MIN_BRIGHTNESS = 0.45;

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    vec3 scales = seedScales(uSeed);
    float hueShift = seedHueShift(uSeed);
    
    // Determine ocean characteristics
    float hasLand = seedHash(uSeed + 0.5) < LAND_PROBABILITY ? 1.0 : 0.0;
    float oceanWarmth = seedHash(uSeed + 0.3);  // Affects color temperature
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = p.y * 0.5 + 0.5;
    
    // === OCEAN DEPTH ===
    vec3 depthCoord = spherePos * OCEAN_DEPTH_SCALE * scales.x;
    depthCoord = seedOffset3D(depthCoord, uSeed);
    
    float oceanDepth = fbm3D(depthCoord, OCEAN_DEPTH_OCTAVES);
    oceanDepth = oceanDepth * 0.5 + 0.5;
    oceanDepth = pow(oceanDepth, 1.0 + (1.0 - DEPTH_VARIATION));
    
    // === WAVES ===
    vec3 waveNormal = vNormal;
    if (uDetailLevel > 0.5) {
        // Large waves using 3D position
        vec3 wavePos1 = p * WAVE_SCALE_LARGE + vec3(wrappedTime * WAVE_SPEED_LARGE, 0.0, wrappedTime * WAVE_SPEED_LARGE * 0.5);
        float wave1 = snoise3D(wavePos1) * WAVE_HEIGHT_LARGE;
        
        // Small waves
        vec3 wavePos2 = p * WAVE_SCALE_SMALL + vec3(wrappedTime * WAVE_SPEED_SMALL * 1.3, wrappedTime * WAVE_SPEED_SMALL, 0.0);
        float wave2 = snoise3D(wavePos2) * WAVE_HEIGHT_SMALL;
        
        // Perturb normal for wave reflections
        waveNormal = normalize(vNormal + vec3(wave1 + wave2, wave1 - wave2, 0.0));
    }
    
    // === LAND MASSES ===
    float landMask = 0.0;
    vec3 landColor = LAND_COLOR_BEACH;
    
    if (hasLand > 0.0) {
        // Generate landmass pattern
        vec3 landCoord = p * 4.0;
        landCoord = seedOffset3D(landCoord, uSeed + 0.8);
        
        float landNoise = fbm3D(landCoord, 3);
        landNoise = landNoise * 0.5 + 0.5;
        
        // Threshold for land
        float landThreshold = LAND_THRESHOLD - LAND_COVERAGE * hasLand;
        landMask = smoothstep(landThreshold, landThreshold + 0.05, landNoise);
        
        // Land color based on latitude (using 3D derived latitude)
        float absLatitude = abs(p.y);
        float vegetation = (1.0 - absLatitude) * (1.0 - landNoise);
        
        landColor = mix(LAND_COLOR_BEACH, LAND_COLOR_VEGETATION, vegetation * 0.7);
        landColor = mix(landColor, LAND_COLOR_ROCK, smoothstep(0.88, 0.95, landNoise));
    }
    
    // === OCEAN COLOR ===
    // Depth-based color gradient
    vec3 oceanColor;
    if (oceanDepth < 0.3) {
        oceanColor = mix(OCEAN_SHALLOW, OCEAN_MID, oceanDepth / 0.3);
    } else if (oceanDepth < 0.6) {
        oceanColor = mix(OCEAN_MID, OCEAN_DEEP, (oceanDepth - 0.3) / 0.3);
    } else {
        oceanColor = mix(OCEAN_DEEP, OCEAN_ABYSS, (oceanDepth - 0.6) / 0.4);
    }
    
    // Warmer oceans are more cyan, cooler are more blue
    oceanColor = mix(oceanColor, oceanColor * vec3(0.9, 1.1, 1.0), oceanWarmth);
    
    // Apply hue shift
    vec3 oceanHSV = rgb2hsv(oceanColor);
    oceanHSV.x = fract(oceanHSV.x + hueShift * 0.5);
    oceanColor = hsv2rgb(oceanHSV);
    
    // Blend with base color
    oceanColor = mix(oceanColor, oceanColor * uBaseColor * 1.5, 0.3);
    
    // === COMBINE OCEAN AND LAND ===
    vec3 surfaceColor = mix(oceanColor, landColor, landMask);
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseHalfLambert(vNormal, lightDir);
    
    // Specular reflections (ocean only)
    float spec = 0.0;
    if (landMask < 0.5) {
        spec = specularBlinn(waveNormal, vec3(0.0, 0.0, 1.0), lightDir, SPEC_POWER);
        spec *= SPEC_INTENSITY * (1.0 - landMask);
    }
    
    // Limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, LIMB_MIN_BRIGHTNESS);
    
    vec3 litColor = surfaceColor * diff * limb;
    litColor += vec3(1.0, 0.95, 0.9) * spec;
    
    // === CLOUDS ===
    if (uHasAtmosphere > 0.3 && uDetailLevel > 0.5) {
        vec3 cloudCoord = p * CLOUD_SCALE * scales.y + vec3(wrappedTime * CLOUD_SPEED, 0.0, wrappedTime * CLOUD_SPEED * 0.7) + vec3(phaseOffset);
        float clouds = fbmWarped3D(cloudCoord, CLOUD_OCTAVES, 0.4);
        clouds = smoothstep(CLOUD_THRESHOLD, 0.7, clouds * 0.5 + 0.5);
        
        float cloudLit = diff * 0.9 + 0.1;
        vec3 cloudColor = vec3(cloudLit);
        
        litColor = mix(litColor, cloudColor, clouds * CLOUD_OPACITY * uHasAtmosphere);
    }
    
    // === ATMOSPHERIC HAZE ===
    if (uHasAtmosphere > 0.0) {
        float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float haze = pow(edgeFactor, HAZE_POWER) * HAZE_INTENSITY * uHasAtmosphere;
        litColor += HAZE_COLOR * haze;
    }
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= starTint;
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,rn=`/**
 * Sub-Neptune Fragment Shader V2
 *
 * Creates mini-Neptune/sub-Neptune worlds with:
 * - Thick, hazy atmospheres obscuring any surface
 * - Smooth, featureless appearance at low detail
 * - Subtle atmospheric structure at high detail
 * - Varied coloring from hydrogen-rich to water-rich
 *
 * Physics: 2-4 Earth radii, low density, thick H/He envelopes
 * These are the most common type of exoplanet found
 * Examples: Kepler-11 planets, many K2 discoveries
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// SUB-NEPTUNE CONSTANTS
// =============================================================================

// --- Haze Dominance ---
// Sub-Neptunes are characterized by thick photochemical haze
const float HAZE_THICKNESS = 0.8;         // Overall haze opacity
const float HAZE_LAYERS = 4.0;            // Number of haze layers
const float HAZE_LAYER_SEPARATION = 0.08; // Vertical separation
const float HAZE_EDGE_POWER = 2.0;        // Edge brightening
const float HAZE_EDGE_INTENSITY = 0.4;    // Edge glow strength

// --- Banding (more visible than before) ---
const float BAND_COUNT_BASE = 4.0;        // Base band count
const float BAND_COUNT_VAR = 3.0;         // Variation in count
const float BAND_VISIBILITY = 0.15;       // More visible bands
const float BAND_WOBBLE = 0.025;          // More wobble for interest

// --- Color Palettes (6 distinct sub-Neptune types) ---
// Classic blue (Neptune-like mini)
const vec3 PALETTE_BLUE = vec3(0.45, 0.6, 0.9);
// Cyan/teal (ammonia-rich)
const vec3 PALETTE_CYAN = vec3(0.5, 0.8, 0.85);
// Purple/lavender (photochemical haze)
const vec3 PALETTE_PURPLE = vec3(0.65, 0.55, 0.85);
// Grey-green (exotic chemistry)
const vec3 PALETTE_GREY_GREEN = vec3(0.55, 0.7, 0.6);
// Pale pink (warm, hazy)
const vec3 PALETTE_PINK = vec3(0.8, 0.65, 0.75);
// Yellow-tan (sulfur compounds)
const vec3 PALETTE_TAN = vec3(0.8, 0.75, 0.55);

// --- Haze Colors (per palette) ---
const vec3 HAZE_BLUE = vec3(0.7, 0.8, 1.0);
const vec3 HAZE_PURPLE = vec3(0.85, 0.75, 0.95);
const vec3 HAZE_WARM = vec3(0.95, 0.85, 0.8);

// --- Deep Atmosphere ---
const float DEEP_VISIBILITY = 0.1;        // Barely visible through haze
const vec3 DEEP_COLOR = vec3(0.4, 0.5, 0.7);  // Dark blue undertone

// --- Smooth Gradients ---
const float GRADIENT_LATITUDE_STRENGTH = 0.1;  // Pole-equator color difference
const float GRADIENT_SMOOTH = 0.05;       // Very smooth transitions

// --- Photochemical Activity ---
const float PHOTOCHEM_SCALE = 8.0;        // Scale of haze variations
const float PHOTOCHEM_SPEED = 0.005;      // Slightly faster changes
const float PHOTOCHEM_STRENGTH = 0.15;    // More visible variations

// --- Cloud/Storm Features ---
const float CLOUD_SCALE = 6.0;
const float CLOUD_SPEED = 0.008;
const float CLOUD_BRIGHTNESS = 0.2;
const float STORM_PROBABILITY = 0.5;
const float STORM_SIZE = 0.06;

// --- Temperature Effects ---
const float WARM_THRESHOLD = 500.0;       // Warmer sub-Neptunes
const float WARM_BRIGHTENING = 0.15;      // Thermal brightening

// --- Limb Effects ---
const float LIMB_EDGE_LOW = 0.0;
const float LIMB_EDGE_HIGH = 0.8;
const float LIMB_MIN_BRIGHTNESS = 0.55;   // Sub-Neptunes are quite bright

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    float hueShift = seedHueShift(uSeed);
    vec3 scales = seedScales(uSeed);
    
    // === COLOR PALETTE SELECTION ===
    float paletteSelector = seedHash(uSeed + 0.55);
    float saturationVar = 0.8 + seedHash(uSeed + 0.66) * 0.4;
    float bandCount = BAND_COUNT_BASE + seedHash(uSeed + 0.77) * BAND_COUNT_VAR;
    
    // Select base palette
    vec3 baseColor;
    vec3 hazeColor;
    if (paletteSelector < 0.17) {
        baseColor = PALETTE_BLUE;
        hazeColor = HAZE_BLUE;
    } else if (paletteSelector < 0.33) {
        baseColor = PALETTE_CYAN;
        hazeColor = HAZE_BLUE;
    } else if (paletteSelector < 0.5) {
        baseColor = PALETTE_PURPLE;
        hazeColor = HAZE_PURPLE;
    } else if (paletteSelector < 0.67) {
        baseColor = PALETTE_GREY_GREEN;
        hazeColor = HAZE_WARM;
    } else if (paletteSelector < 0.83) {
        baseColor = PALETTE_PINK;
        hazeColor = HAZE_PURPLE;
    } else {
        baseColor = PALETTE_TAN;
        hazeColor = HAZE_WARM;
    }
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = p.y * 0.5 + 0.5;
    
    // === BANDING ===
    float bandWobble = snoise3D(vec3(p.x * 5.0 + phaseOffset, latitude * 2.0, p.z * 5.0)) * BAND_WOBBLE;
    float bandPattern = sin((latitude + bandWobble) * 3.14159 * bandCount);
    bandPattern = bandPattern * 0.5 + 0.5;
    bandPattern *= BAND_VISIBILITY;
    
    // === HAZE STRUCTURE ===
    // Multiple haze layers create depth
    float hazePattern = 0.0;
    
    if (uDetailLevel > 0.5) {
        for (float i = 0.0; i < HAZE_LAYERS; i++) {
            float layerDepth = (i + 0.5) / HAZE_LAYERS;
            float layerScale = PHOTOCHEM_SCALE * (1.0 + i * 0.3);
            
            // Use 3D position for seamless haze
            vec3 hazeCoord = p * layerScale * scales.x + vec3(wrappedTime * PHOTOCHEM_SPEED + phaseOffset + i);
            float layer = fbm3D(hazeCoord, 3) * 0.5 + 0.5;
            
            // Layers are less visible at depth
            float layerVisibility = 1.0 - layerDepth * 0.5;
            hazePattern += layer * HAZE_LAYER_SEPARATION * layerVisibility;
        }
    }
    
    // === CLOUD FEATURES ===
    float cloudPattern = 0.0;
    if (uDetailLevel > 0.5) {
        vec3 cloudCoord = p * CLOUD_SCALE * scales.x + vec3(wrappedTime * CLOUD_SPEED, 0.0, wrappedTime * CLOUD_SPEED * 0.5) + vec3(phaseOffset);
        cloudPattern = fbm3D(cloudCoord, 4);
        cloudPattern = smoothstep(0.3, 0.7, cloudPattern * 0.5 + 0.5);
    }
    
    // === STORM FEATURES ===
    float stormMask = 0.0;
    if (seedHasUncommonFeature(uSeed, 5.0)) {
        vec2 stormPos = seedStormPosition(uSeed, 5.0);
        vec2 coordForStorm = vec2(longitude, latitude);
        vec2 delta = coordForStorm - stormPos;
        if (delta.x > 0.5) delta.x -= 1.0;
        if (delta.x < -0.5) delta.x += 1.0;
        float stormDist = length(delta) / STORM_SIZE;
        stormMask = 1.0 - smoothstep(0.0, 1.0, stormDist);
        stormMask *= stormMask;
    }
    
    // === LATITUDE GRADIENT ===
    float latGradient = abs(latitude - 0.5) * 2.0;
    latGradient = smoothstep(0.0, 1.0, latGradient) * GRADIENT_LATITUDE_STRENGTH;
    
    // === COLOR CALCULATION ===
    // Apply hue shift to base palette
    vec3 baseHSV = rgb2hsv(baseColor);
    baseHSV.x = fract(baseHSV.x + hueShift);
    baseHSV.y *= saturationVar;
    vec3 variedBase = hsv2rgb(baseHSV);
    
    // Temperature affects color - warmer = more muted/tan
    float warmFactor = smoothstep(300.0, 700.0, uTemperature);
    variedBase = mix(variedBase, PALETTE_TAN, warmFactor * 0.3);
    
    // Start with varied base
    vec3 atmosphereColor = variedBase;
    
    // Apply banding - alternate between base and slightly different shade
    vec3 bandColor = variedBase * vec3(0.9, 0.95, 1.05);
    atmosphereColor = mix(atmosphereColor, bandColor, bandPattern);
    
    // Add haze structure
    atmosphereColor *= 1.0 + hazePattern * PHOTOCHEM_STRENGTH;
    
    // Add cloud brightness
    atmosphereColor += vec3(cloudPattern) * CLOUD_BRIGHTNESS * hazeColor;
    
    // Add storm brightness
    if (stormMask > 0.0) {
        vec3 stormColor = variedBase * 1.3;
        atmosphereColor = mix(atmosphereColor, stormColor, stormMask * 0.5);
    }
    
    // Latitude gradient - poles slightly cooler colored
    vec3 poleColor = atmosphereColor * vec3(0.92, 0.95, 1.05);
    atmosphereColor = mix(atmosphereColor, poleColor, latGradient);
    
    // Deep atmosphere hints
    float depthNoise = vnoise3D(p * 4.0 + vec3(phaseOffset));
    vec3 deepColor = variedBase * 0.6;
    atmosphereColor = mix(atmosphereColor, deepColor, depthNoise * DEEP_VISIBILITY);
    
    // === TEMPERATURE EFFECTS ===
    // Warmer sub-Neptunes have some thermal emission
    if (uTemperature > WARM_THRESHOLD) {
        float warmFactor = smoothstep(WARM_THRESHOLD, 1000.0, uTemperature);
        atmosphereColor += vec3(0.2, 0.1, 0.05) * warmFactor * WARM_BRIGHTENING;
    }
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseHalfLambert(vNormal, lightDir);
    
    // Gentle limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, LIMB_MIN_BRIGHTNESS);
    
    vec3 litColor = atmosphereColor * diff * limb;
    
    // === EDGE HAZE GLOW ===
    // Sub-Neptunes have prominent atmospheric edge
    float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float edgeGlow = pow(edgeFactor, HAZE_EDGE_POWER) * HAZE_EDGE_INTENSITY;
    
    vec3 glowColor = mix(atmosphereColor, hazeColor, 0.5);
    litColor += glowColor * edgeGlow;
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= starTint;
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,sn=`/**
 * Desert World Fragment Shader V2
 *
 * Creates arid worlds with:
 * - Dune fields with realistic patterns
 * - Rocky canyons and mesas
 * - Dust storms
 * - Salt flats and dried lakebeds
 * - Minimal or no vegetation
 *
 * Physics: Rocky worlds that lost their water, or formed dry
 * Examples: Mars, Arrakis-like worlds
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;
uniform float uZoomLevel;      // 0 = far, 1 = close - controls surface detail visibility
uniform float uBodyDiameter;   // Body diameter for scale reference

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// DESERT WORLD CONSTANTS
// =============================================================================

// --- Terrain Types ---
const float TERRAIN_SCALE = 5.0;
const int TERRAIN_OCTAVES = 5;

// Height thresholds for terrain types
const float HEIGHT_BASIN = 0.25;                        // Salt flats, dry lakes
const float HEIGHT_DUNES = 0.45;                        // Sand dune fields
const float HEIGHT_PLAINS = 0.60;                       // Rocky plains
const float HEIGHT_MESA = 0.75;                         // Plateaus and mesas
const float HEIGHT_MOUNTAIN = 0.90;                     // Mountains

// --- Colors ---
const vec3 COLOR_SALT_FLAT = vec3(0.85, 0.82, 0.75);    // Salt flat color
const vec3 COLOR_SAND_LIGHT = vec3(0.85, 0.70, 0.50);   // Light sand color
const vec3 COLOR_SAND_DARK = vec3(0.65, 0.45, 0.30);    // Dark sand color
const vec3 COLOR_ROCK_RED = vec3(0.60, 0.35, 0.25);     // Red rock color
const vec3 COLOR_ROCK_GREY = vec3(0.50, 0.45, 0.42);    // Grey rock color
const vec3 COLOR_MESA = vec3(0.55, 0.30, 0.20);         // Mesa color
const vec3 COLOR_SHADOW = vec3(0.35, 0.25, 0.20);       // Shadow color

// --- Dunes ---
const float DUNE_SCALE = 15.0;                          // Scale of dunes
const float DUNE_HEIGHT = 0.08;                         // Height of dunes
const float DUNE_DIRECTION = 0.3;                       // Prevailing wind direction
const float DUNE_SHARPNESS = 2.0;                       // Ridge sharpness

// --- Canyons ---
const float CANYON_SCALE = 8.0;                         // Scale of canyons
const float CANYON_DEPTH = 0.15;                        // Depth of canyons
const float CANYON_WIDTH = 0.12;                        // Width of canyons

// --- Dust Storms ---
const float DUST_SCALE = 4.0;                           // Scale of dust storms
const float DUST_SPEED = 0.02;                          // Speed of dust storms
const float DUST_OPACITY = 0.4;                         // Opacity of dust storms
const vec3 DUST_COLOR = vec3(0.75, 0.55, 0.40);         // Dust color
const float DUST_PROBABILITY = 0.3;                     // Probability of dust storms

// --- Atmosphere ---
const float HAZE_POWER = 3.0;                           // Power of haze
const float HAZE_INTENSITY = 0.2;                       // Intensity of haze
const vec3 HAZE_COLOR = vec3(0.8, 0.6, 0.4);            // Dusty orange haze

// --- Limb Darkening ---
const float LIMB_EDGE_LOW = -0.1;                       // Lower edge of limb darkening
const float LIMB_EDGE_HIGH = 0.8;                       // Upper edge of limb darkening by limb darkening
const float LIMB_MIN_BRIGHTNESS = 0.35;                 // Minimum brightness of limb darkening

// --- Crater/Rock Generation (zoom-based) ---
const float CRATER_SCALE = 20.0;                        // Base scale for impact craters
const float ROCK_SCALE = 60.0;                          // Scale for scattered rocks
const float CRATER_DEPTH = 0.12;                        // How much craters darken surface
const float ROCK_SHADOW = 0.08;                         // Shadow from scattered rocks

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// ZOOM-BASED DETAIL FUNCTIONS
// =============================================================================

/**
 * Generate impact craters and scattered rocks when zoomed in
 */
vec3 desertZoomDetail(vec3 p, vec3 surfaceColor, float zoomLevel, float terrain, float seed) {
    if (zoomLevel < 0.15) {
        return surfaceColor;
    }

    float detailFade = smoothstep(0.15, 0.5, zoomLevel);

    // Impact craters on rocky areas
    if (terrain > HEIGHT_PLAINS) {
        float craterNoise = vnoise3D(p * CRATER_SCALE + vec3(seed * 10.0));
        float crater = smoothstep(0.35, 0.5, craterNoise) - smoothstep(0.5, 0.65, craterNoise) * 0.4;
        float rim = smoothstep(0.42, 0.48, craterNoise) * smoothstep(0.52, 0.48, craterNoise);

        surfaceColor *= (1.0 - crater * CRATER_DEPTH * detailFade);
        surfaceColor += vec3(0.8, 0.7, 0.6) * rim * 0.06 * detailFade;
    }

    // Scattered rocks and boulders on all terrain types
    float rockNoise = vnoise3D(p * ROCK_SCALE + vec3(seed * 5.0));
    float rocks = smoothstep(0.6, 0.75, rockNoise);

    // Rock shadows
    surfaceColor *= (1.0 - rocks * ROCK_SHADOW * detailFade);

    // Fine grain texture at maximum zoom
    if (zoomLevel > 0.6) {
        float grainFade = smoothstep(0.6, 0.9, zoomLevel);
        float grain = snoise3D(p * 120.0 + vec3(seed * 3.0)) * 0.5 + 0.5;
        surfaceColor *= 0.96 + grain * 0.08 * grainFade;
    }

    return surfaceColor;
}

// =============================================================================
// DUNE FUNCTION
// =============================================================================

/**
 * Generate realistic dune pattern using 3D position
 */
float dunePattern3D(vec3 pos, float seed, float time) {
    // Dunes aligned with wind direction
    float windAngle = DUNE_DIRECTION + seedHash(seed) * 0.5;
    vec3 windDir = vec3(cos(windAngle), 0.0, sin(windAngle));
    
    // Project position onto wind-perpendicular axis
    vec3 perpDir = cross(windDir, vec3(0.0, 1.0, 0.0));
    float dunePos = dot(pos * DUNE_SCALE, perpDir);
    
    // Add variation using 3D noise
    float variation = snoise3D(pos * 3.0 + vec3(seed * 10.0)) * 0.3;
    dunePos += variation;
    
    // Sharp-crested dune profile
    float dune = sin(dunePos);
    dune = sign(dune) * pow(abs(dune), 1.0 / DUNE_SHARPNESS);
    dune = dune * 0.5 + 0.5;
    
    // Slow migration
    dune += time * 0.001;
    
    return dune * DUNE_HEIGHT;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    vec3 scales = seedScales(uSeed);
    float hueShift = seedHueShift(uSeed);
    
    // Determine desert characteristics
    float isRedDesert = seedHash(uSeed + 0.3);  // Mars-like vs tan
    float hasDustStorm = seedHash(uSeed + 0.5) < DUST_PROBABILITY ? 1.0 : 0.0;
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = abs(p.y);
    
    // === BASE TERRAIN ===
    vec3 terrainCoord = p * TERRAIN_SCALE * scales.x;
    terrainCoord = seedOffset3D(terrainCoord, uSeed);
    
    int octaves = uDetailLevel > 0.5 ? TERRAIN_OCTAVES : 3;
    float terrain = fbmWarped3D(terrainCoord, octaves, 0.35);
    terrain = terrain * 0.5 + 0.5;
    
    // === CANYON CARVING ===
    float canyon = 0.0;
    if (uDetailLevel > 0.5) {
        vec3 canyonCoord = p * CANYON_SCALE + vec3(phaseOffset);
        float canyonNoise = abs(snoise3D(canyonCoord));
        canyon = 1.0 - smoothstep(0.0, CANYON_WIDTH, canyonNoise);
        canyon *= smoothstep(HEIGHT_PLAINS, HEIGHT_MESA, terrain);
        terrain -= canyon * CANYON_DEPTH;
    }
    
    terrain = clamp(terrain, 0.0, 1.0);
    
    // === DUNE HEIGHT ===
    float dunes = 0.0;
    if (terrain > HEIGHT_BASIN && terrain < HEIGHT_PLAINS) {
        float duneStrength = 1.0 - abs(terrain - HEIGHT_DUNES) / (HEIGHT_PLAINS - HEIGHT_BASIN);
        dunes = dunePattern3D(p, uSeed, wrappedTime) * duneStrength;
    }
    
    // === COLOR CALCULATION ===
    vec3 surfaceColor;
    
    // Salt flats (lowest areas)
    if (terrain < HEIGHT_BASIN) {
        surfaceColor = COLOR_SALT_FLAT;
        float saltVariation = vnoise3D(p * 30.0) * 0.1;
        surfaceColor *= 1.0 - saltVariation;
    }
    // Dune fields
    else if (terrain < HEIGHT_PLAINS) {
        vec3 sandLight = mix(COLOR_SAND_LIGHT, COLOR_ROCK_RED, isRedDesert * 0.5);
        vec3 sandDark = mix(COLOR_SAND_DARK, COLOR_ROCK_RED * 0.8, isRedDesert * 0.5);
        
        // Dune shading based on dune height
        surfaceColor = mix(sandDark, sandLight, dunes / DUNE_HEIGHT);
        
        // Add ripple detail using 3D position
        if (uDetailLevel > 0.5) {
            float ripples = snoise3D(p * 80.0 + vec3(phaseOffset)) * 0.5 + 0.5;
            surfaceColor *= 0.95 + ripples * 0.1;
        }
    }
    // Rocky plains
    else if (terrain < HEIGHT_MESA) {
        vec3 rockColor = mix(COLOR_ROCK_GREY, COLOR_ROCK_RED, isRedDesert);
        vec3 sandColor = mix(COLOR_SAND_DARK, COLOR_ROCK_RED * 0.9, isRedDesert * 0.5);
        
        float rockiness = (terrain - HEIGHT_PLAINS) / (HEIGHT_MESA - HEIGHT_PLAINS);
        surfaceColor = mix(sandColor, rockColor, rockiness);
    }
    // Mesas and plateaus
    else if (terrain < HEIGHT_MOUNTAIN) {
        surfaceColor = mix(COLOR_MESA, COLOR_ROCK_RED, isRedDesert * 0.5);
        
        // Layered sediment look
        float layers = sin(terrain * 50.0) * 0.5 + 0.5;
        surfaceColor *= 0.9 + layers * 0.15;
    }
    // Mountains
    else {
        surfaceColor = mix(COLOR_ROCK_GREY, COLOR_ROCK_RED * 0.7, isRedDesert);
    }
    
    // Canyon shadows
    if (canyon > 0.0) {
        surfaceColor = mix(surfaceColor, COLOR_SHADOW, canyon * 0.5);
    }
    
    // Apply hue shift
    vec3 surfaceHSV = rgb2hsv(surfaceColor);
    surfaceHSV.x = fract(surfaceHSV.x + hueShift);
    surfaceColor = hsv2rgb(surfaceHSV);
    
    // Blend with base color
    surfaceColor = mix(surfaceColor, surfaceColor * uBaseColor * 1.5, 0.25);

    // === ZOOM-BASED DETAIL ===
    // Add craters, rocks, and fine texture when zoomed in
    surfaceColor = desertZoomDetail(p, surfaceColor, uZoomLevel, terrain, uSeed);

    // === POLAR ICE (if cold enough) ===
    if (uTemperature < 280.0) {
        float iceFactor = smoothstep(280.0, 200.0, uTemperature);
        float polarIce = smoothstep(0.6, 0.9, latitude) * iceFactor;
        surfaceColor = mix(surfaceColor, vec3(0.9, 0.92, 0.95), polarIce * 0.7);
    }
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = diffuseLambert(vNormal, lightDir);
    
    // Dune self-shadowing
    if (dunes > 0.0) {
        float duneShadow = dunes / DUNE_HEIGHT;
        diff *= 0.7 + duneShadow * 0.3;
    }
    
    // Limb darkening
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, LIMB_MIN_BRIGHTNESS);
    
    vec3 litColor = surfaceColor * diff * limb;
    
    // === DUST STORMS ===
    if (hasDustStorm > 0.0 && uHasAtmosphere > 0.2 && uDetailLevel > 0.5) {
        vec3 dustCoord = p * DUST_SCALE + vec3(wrappedTime * DUST_SPEED, 0.0, wrappedTime * DUST_SPEED * 0.5) + vec3(phaseOffset);
        float dust = fbmWarped3D(dustCoord, 4, 0.5);
        dust = smoothstep(0.2, 0.8, dust * 0.5 + 0.5);
        
        // Dust more common at certain latitudes
        dust *= 1.0 - abs(latitude - 0.3) * 1.5;
        dust = max(0.0, dust);
        
        vec3 dustCol = DUST_COLOR * (diff * 0.8 + 0.2);
        litColor = mix(litColor, dustCol, dust * DUST_OPACITY * hasDustStorm);
    }
    
    // === ATMOSPHERIC HAZE ===
    if (uHasAtmosphere > 0.0) {
        float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float haze = pow(edgeFactor, HAZE_POWER) * HAZE_INTENSITY * uHasAtmosphere;
        litColor += HAZE_COLOR * haze;
    }
    
    // === STAR TINT ===
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= starTint;
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,ln=`/**
 * Tidally Locked World Fragment Shader V2
 *
 * Creates worlds locked to their star with:
 * - Permanent dayside (possibly scorched/lava)
 * - Permanent nightside (frozen)
 * - Dramatic terminator zone
 * - Heat transport patterns
 * - Potential habitable terminator ring
 *
 * Physics: Close-in rocky planets around M-dwarfs
 * Examples: Proxima b, TRAPPIST-1 planets
 */

// Precision qualifiers MUST be before includes for Chrome/ANGLE compatibility
#ifdef GL_ES
precision highp float;
precision highp int;
#endif


// =============================================================================
// UNIFORMS
// =============================================================================

uniform vec3 uBaseColor;
uniform float uTime;
uniform float uTemperature;
uniform float uHasAtmosphere;
uniform float uSeed;
uniform float uDensity;
uniform float uInsolation;
uniform float uStarTemp;
uniform float uDetailLevel;
uniform float uEnableTerminator;  // 1.0 = show day/night zones, 0.0 = uniform lighting

// Physical color factors for data-driven variety
uniform float uColorTempFactor;
uniform float uColorCompositionFactor;
uniform float uColorIrradiationFactor;
uniform float uColorMetallicityFactor;

// =============================================================================
// TIDALLY LOCKED CONSTANTS
// =============================================================================

// --- Day/Night Division ---
const float TERMINATOR_WIDTH = 0.12;      // Width of twilight zone
const float TERMINATOR_CENTER = 0.5;      // Position of terminator
const float SUBSTELLAR_RADIUS = 0.3;      // Hottest zone radius

// --- Temperature Regimes ---
const float TEMP_FROZEN = 150.0;          // Nightside freeze
const float TEMP_HABITABLE_LOW = 250.0;   // Terminator habitable zone
const float TEMP_HABITABLE_HIGH = 320.0;
const float TEMP_SCORCHED = 500.0;        // Dayside scorching
const float TEMP_LAVA = 1200.0;           // Molten dayside

// --- Base Dayside Colors (will be tinted by palette) ---
const vec3 COLOR_DAYSIDE_LAVA = vec3(0.9, 0.4, 0.1);
const vec3 COLOR_DAYSIDE_GLOW = vec3(1.0, 0.7, 0.3);

// --- Color Variety ---
const float COLOR_SATURATION_BOOST = 1.6;  // Make colors more vibrant
const float COLOR_VALUE_BOOST = 1.2;       // Brighten colors

// --- Heat Transport ---
const float HEAT_FLOW_SCALE = 6.0;
const float HEAT_FLOW_SPEED = 0.01;
const float HEAT_FLOW_VISIBILITY = 0.15;

// --- Terrain ---
const float TERRAIN_SCALE = 4.0;
const int TERRAIN_OCTAVES = 4;

// --- Atmospheric Effects ---
const float ATMO_HAZE_POWER = 2.5;
const float ATMO_HAZE_DAY = 0.3;
const float ATMO_HAZE_TERMINATOR = 0.4;

// --- Clouds ---
const float CLOUD_SCALE = 5.0;
const float CLOUD_SPEED = 0.008;
const float CLOUD_OPACITY = 0.5;

// --- Limb Effects ---
const float LIMB_EDGE_LOW = -0.1;
const float LIMB_EDGE_HIGH = 0.8;
const float LIMB_MIN_BRIGHTNESS = 0.15;   // Very dark nightside

// =============================================================================
// VARYINGS
// =============================================================================

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// =============================================================================
// ZONE CALCULATION
// =============================================================================

/**
 * Calculate zone factors (day, terminator, night)
 * Returns: x = dayside, y = terminator, z = nightside
 */
vec3 calculateZones(float longitude) {
    // Distance from terminator (0 at terminator, 0.5 at day/night centers)
    float distFromTerminator = abs(longitude - TERMINATOR_CENTER);
    if (longitude < TERMINATOR_CENTER) distFromTerminator = TERMINATOR_CENTER - longitude;
    else distFromTerminator = longitude - TERMINATOR_CENTER;
    
    // Wrap check
    if (distFromTerminator > 0.5) distFromTerminator = 1.0 - distFromTerminator;
    
    // Zone factors
    float terminator = 1.0 - smoothstep(0.0, TERMINATOR_WIDTH, distFromTerminator);
    float dayside = smoothstep(TERMINATOR_CENTER - TERMINATOR_WIDTH, TERMINATOR_CENTER, longitude);
    float nightside = 1.0 - smoothstep(TERMINATOR_CENTER, TERMINATOR_CENTER + TERMINATOR_WIDTH, longitude);
    
    // Normalize
    float total = dayside + terminator + nightside;
    return vec3(dayside, terminator, nightside) / max(total, 0.01);
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
    vec3 spherePos = normalize(vPosition);
    
    // Wrap time to prevent precision loss in Chrome/ANGLE
    float wrappedTime = wrapTime(uTime);
    
    // === SEED VARIATION ===
    float phaseOffset = seedPhase(uSeed);
    vec3 scales = seedScales(uSeed);
    float hueShift = seedHueShift(uSeed);
    
    // === COLOR PALETTE SELECTION (seed-based for variety) ===
    int paletteIndex = int(seedHash(uSeed + 0.1) * 6.0);
    
    // Dayside rock colors - 6 distinct vibrant palettes
    vec3 daysideRock, daysideScorched;
    if (paletteIndex == 0) {
        daysideRock = vec3(0.75, 0.45, 0.3);    // Warm rusty Mars-like
        daysideScorched = vec3(0.5, 0.25, 0.15);
    } else if (paletteIndex == 1) {
        daysideRock = vec3(0.55, 0.55, 0.6);    // Blue-gray volcanic
        daysideScorched = vec3(0.35, 0.3, 0.35);
    } else if (paletteIndex == 2) {
        daysideRock = vec3(0.85, 0.6, 0.35);    // Bright orange-tan
        daysideScorched = vec3(0.6, 0.35, 0.18);
    } else if (paletteIndex == 3) {
        daysideRock = vec3(0.65, 0.4, 0.5);     // Reddish-magenta
        daysideScorched = vec3(0.45, 0.25, 0.35);
    } else if (paletteIndex == 4) {
        daysideRock = vec3(0.5, 0.55, 0.4);     // Olive green
        daysideScorched = vec3(0.35, 0.4, 0.25);
    } else {
        daysideRock = vec3(0.8, 0.65, 0.45);    // Bright golden
        daysideScorched = vec3(0.55, 0.4, 0.25);
    }
    
    // Terminator colors (habitable zone) - vibrant palettes
    vec3 termRock, termVeg, termWater;
    if (paletteIndex == 0) {
        termRock = vec3(0.6, 0.5, 0.45);
        termVeg = vec3(0.35, 0.6, 0.35);        // Bright green vegetation
        termWater = vec3(0.2, 0.45, 0.65);      // Deep blue water
    } else if (paletteIndex == 1) {
        termRock = vec3(0.5, 0.5, 0.6);
        termVeg = vec3(0.3, 0.55, 0.5);         // Teal vegetation
        termWater = vec3(0.2, 0.4, 0.6);
    } else if (paletteIndex == 2) {
        termRock = vec3(0.65, 0.55, 0.45);
        termVeg = vec3(0.5, 0.65, 0.3);         // Bright yellow-green
        termWater = vec3(0.25, 0.5, 0.65);
    } else if (paletteIndex == 3) {
        termRock = vec3(0.55, 0.45, 0.55);
        termVeg = vec3(0.5, 0.4, 0.65);         // Purple alien vegetation
        termWater = vec3(0.35, 0.4, 0.6);       // Purple-tinged water
    } else if (paletteIndex == 4) {
        termRock = vec3(0.5, 0.55, 0.45);
        termVeg = vec3(0.6, 0.55, 0.3);         // Golden-yellow vegetation
        termWater = vec3(0.25, 0.45, 0.5);
    } else {
        termRock = vec3(0.6, 0.55, 0.5);
        termVeg = vec3(0.4, 0.6, 0.55);         // Cyan-green
        termWater = vec3(0.2, 0.5, 0.6);        // Aqua water
    }
    
    // Nightside ice colors - more vibrant and colorful
    vec3 nightIce, nightGlacier, nightDark;
    if (paletteIndex == 0) {
        nightIce = vec3(0.8, 0.85, 0.95);       // Bright blue-white ice
        nightGlacier = vec3(0.6, 0.7, 0.9);
        nightDark = vec3(0.12, 0.15, 0.25);     // Subtle blue glow
    } else if (paletteIndex == 1) {
        nightIce = vec3(0.85, 0.8, 0.92);       // Lavender-pink ice
        nightGlacier = vec3(0.7, 0.6, 0.8);
        nightDark = vec3(0.15, 0.1, 0.22);
    } else if (paletteIndex == 2) {
        nightIce = vec3(0.9, 0.88, 0.82);       // Warm cream ice
        nightGlacier = vec3(0.75, 0.7, 0.6);
        nightDark = vec3(0.18, 0.15, 0.12);
    } else if (paletteIndex == 3) {
        nightIce = vec3(0.75, 0.9, 0.95);       // Bright cyan ice
        nightGlacier = vec3(0.55, 0.8, 0.85);
        nightDark = vec3(0.08, 0.18, 0.22);
    } else if (paletteIndex == 4) {
        nightIce = vec3(0.88, 0.85, 0.78);      // Golden-white ice
        nightGlacier = vec3(0.7, 0.68, 0.55);
        nightDark = vec3(0.15, 0.14, 0.1);
    } else {
        nightIce = vec3(0.78, 0.9, 0.88);       // Mint-white ice
        nightGlacier = vec3(0.6, 0.78, 0.75);
        nightDark = vec3(0.1, 0.18, 0.16);
    }

    // === PHYSICAL COLOR INFLUENCE ===
    // Generate physical base color for data-driven variety
    vec3 physColor = physicalPlanetColor(
        uColorTempFactor,
        uColorCompositionFactor,
        uColorIrradiationFactor,
        uColorMetallicityFactor,
        uSeed
    );

    // Tint palette colors with physical data (subtle influence)
    // This adds variety while preserving the palette structure
    daysideRock = mix(daysideRock, daysideRock * physColor * 1.3, 0.25);
    daysideScorched = mix(daysideScorched, daysideScorched * physColor * 1.2, 0.2);
    termRock = mix(termRock, termRock * physColor * 1.2, 0.2);
    termVeg = mix(termVeg, termVeg * physColor * 1.1, 0.15);
    nightIce = mix(nightIce, nightIce * physColor * 1.1, 0.1);
    nightGlacier = mix(nightGlacier, nightGlacier * physColor * 1.1, 0.1);

    // Determine characteristics
    float hasWater = (uTemperature > TEMP_FROZEN && uTemperature < TEMP_SCORCHED) ? 1.0 : 0.0;
    hasWater *= uHasAtmosphere;
    float isScorched = smoothstep(TEMP_SCORCHED, TEMP_LAVA, uTemperature);
    
    // === 3D POSITION SETUP (avoids UV seams/polar artifacts) ===
    vec3 p = rotateVectorBySeed(spherePos, uSeed);
    float longitude = atan(p.x, p.z) / TAU + 0.5;
    float latitude = abs(p.y);
    
    // === ZONE CALCULATION ===
    vec3 zones = calculateZones(longitude);
    float dayside, terminator, nightside;

    if (uEnableTerminator > 0.5) {
        // Full day/night zones (planet page view)
        dayside = zones.x;
        terminator = zones.y;
        nightside = zones.z;
    } else {
        // Uniform rendering (star map view - star provides lighting)
        // Treat entire surface as terminator zone for natural look
        dayside = 0.4;
        terminator = 0.6;
        nightside = 0.0;
    }
    
    // Substellar point (hottest) - use 3D derived coordinates
    float latNormalized = p.y * 0.5 + 0.5;  // 0-1 range
    float substellarDist = length(vec2(longitude - 0.75, latNormalized - 0.5));
    if (longitude < 0.25) substellarDist = length(vec2(longitude + 0.25, latNormalized - 0.5));
    float substellarFactor = 1.0 - smoothstep(0.0, SUBSTELLAR_RADIUS, substellarDist);
    
    // === TERRAIN ===
    vec3 terrainCoord = p * TERRAIN_SCALE * scales.x;
    terrainCoord = seedOffset3D(terrainCoord, uSeed);
    
    float terrain = fbm3D(terrainCoord, TERRAIN_OCTAVES);
    terrain = terrain * 0.5 + 0.5;
    
    // === HEAT TRANSPORT ===
    float heatFlow = 0.0;
    if (uHasAtmosphere > 0.3 && uDetailLevel > 0.5) {
        vec3 flowCoord = p * HEAT_FLOW_SCALE + vec3(wrappedTime * HEAT_FLOW_SPEED, 0.0, wrappedTime * HEAT_FLOW_SPEED * 0.5) + vec3(phaseOffset);
        heatFlow = fbmWarped3D(flowCoord, 3, 0.4);
        heatFlow = heatFlow * 0.5 + 0.5;
    }
    
    // === DAYSIDE COLOR ===
    vec3 daysideColor;
    if (isScorched > 0.0) {
        // Scorched/lava surface
        vec3 rockColor = mix(daysideRock, daysideScorched, isScorched);
        vec3 lavaColor = mix(COLOR_DAYSIDE_LAVA, COLOR_DAYSIDE_GLOW, substellarFactor);
        
        float lavaMask = terrain * isScorched * substellarFactor;
        daysideColor = mix(rockColor, lavaColor, lavaMask);
        
        // Heat glow
        daysideColor += COLOR_DAYSIDE_GLOW * substellarFactor * isScorched * 0.3;
    } else {
        // Warm but not molten
        daysideColor = daysideRock;
        daysideColor = mix(daysideColor, daysideScorched, substellarFactor * 0.5);
    }
    
    // === TERMINATOR COLOR ===
    vec3 terminatorColor;
    if (hasWater > 0.0) {
        // Habitable terminator zone
        float waterLevel = 0.35;
        if (terrain < waterLevel) {
            terminatorColor = termWater;
        } else {
            float vegetation = (1.0 - terrain) * (1.0 - latitude);
            terminatorColor = mix(termRock, termVeg, vegetation);
        }
    } else {
        terminatorColor = termRock;
    }
    
    // === NIGHTSIDE COLOR ===
    vec3 nightsideColor;
    float frozenFactor = 1.0 - smoothstep(TEMP_FROZEN, TEMP_HABITABLE_LOW, uTemperature);
    
    // Ice coverage increases towards antistellar point - use 3D derived coordinates
    float antistellarDist = length(vec2(longitude - 0.25, latNormalized - 0.5));
    if (longitude > 0.75) antistellarDist = length(vec2(longitude - 1.25, latNormalized - 0.5));
    float antistellarFactor = 1.0 - smoothstep(0.0, 0.4, antistellarDist);
    
    nightsideColor = mix(nightDark, nightIce, frozenFactor * 0.7 + antistellarFactor * 0.3);
    nightsideColor = mix(nightsideColor, nightGlacier, terrain * frozenFactor);
    
    // === COMBINE ZONES ===
    vec3 surfaceColor = daysideColor * dayside + terminatorColor * terminator + nightsideColor * nightside;
    
    // Heat transport visible
    if (heatFlow > 0.0) {
        vec3 heatColor = mix(COLOR_DAYSIDE_LAVA, termRock, 0.5);
        surfaceColor = mix(surfaceColor, heatColor, heatFlow * HEAT_FLOW_VISIBILITY * terminator);
    }
    
    // Apply hue shift, saturation and brightness boost for more vibrant colors
    vec3 surfaceHSV = rgb2hsv(surfaceColor);
    surfaceHSV.x = fract(surfaceHSV.x + hueShift * 0.4);  // More hue variation
    surfaceHSV.y = min(surfaceHSV.y * COLOR_SATURATION_BOOST, 1.0);  // Boost saturation
    surfaceHSV.z = min(surfaceHSV.z * COLOR_VALUE_BOOST, 1.0);  // Boost brightness
    surfaceColor = hsv2rgb(surfaceHSV);
    
    // === LIGHTING ===
    // Light comes from locked direction (dayside)
    vec3 lightDir = normalize(vec3(1.0, 0.0, 0.3));
    float diff = max(dot(vNormal, lightDir), 0.0);

    float zoneLighting;
    if (uEnableTerminator > 0.5) {
        // Mix lighting by zone (planet page - show day/night effect)
        zoneLighting = dayside * (diff * 0.9 + 0.1) +
                       terminator * (diff * 0.5 + 0.3) +
                       nightside * 0.05;  // Minimal nightside illumination
    } else {
        // Normal diffuse lighting (star map - star provides illumination)
        zoneLighting = diff * 0.8 + 0.2;
    }
    
    // Self-illumination for lava
    float emission = isScorched * substellarFactor * dayside * 0.5;
    
    // Limb darkening varies by zone
    float limbMinBright = uEnableTerminator > 0.5
        ? LIMB_MIN_BRIGHTNESS + dayside * 0.3  // Darker on nightside
        : 0.45;  // Normal limb darkening for star map view
    float limb = limbDarkeningStylized(vNormal, LIMB_EDGE_LOW, LIMB_EDGE_HIGH, limbMinBright);
    
    vec3 litColor = surfaceColor * zoneLighting * limb;
    litColor += surfaceColor * emission;
    
    // === CLOUDS ===
    if (uHasAtmosphere > 0.3 && uDetailLevel > 0.5) {
        vec3 cloudCoord = p * CLOUD_SCALE * scales.y + vec3(wrappedTime * CLOUD_SPEED, 0.0, wrappedTime * CLOUD_SPEED * 0.7) + vec3(phaseOffset);
        float clouds = fbm3D(cloudCoord, 4);
        clouds = smoothstep(0.3, 0.6, clouds * 0.5 + 0.5);
        
        // Clouds mainly in terminator zone (convection)
        clouds *= terminator + dayside * 0.3;
        
        float cloudLit = zoneLighting * 0.9 + 0.1;
        litColor = mix(litColor, vec3(cloudLit), clouds * CLOUD_OPACITY * uHasAtmosphere);
    }
    
    // === ATMOSPHERIC HAZE ===
    if (uHasAtmosphere > 0.0) {
        float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        
        // Seed-based haze colors
        vec3 atmoDay, atmoTerm, atmoNight;
        if (paletteIndex == 0) {
            atmoDay = vec3(0.8, 0.6, 0.4);
            atmoTerm = vec3(0.5, 0.7, 0.9);
            atmoNight = vec3(0.2, 0.25, 0.4);
        } else if (paletteIndex == 1) {
            atmoDay = vec3(0.7, 0.6, 0.7);
            atmoTerm = vec3(0.6, 0.6, 0.9);
            atmoNight = vec3(0.25, 0.2, 0.4);
        } else if (paletteIndex == 2) {
            atmoDay = vec3(0.9, 0.7, 0.5);
            atmoTerm = vec3(0.6, 0.8, 0.7);
            atmoNight = vec3(0.2, 0.3, 0.35);
        } else if (paletteIndex == 3) {
            atmoDay = vec3(0.75, 0.55, 0.6);
            atmoTerm = vec3(0.55, 0.6, 0.85);
            atmoNight = vec3(0.25, 0.2, 0.35);
        } else if (paletteIndex == 4) {
            atmoDay = vec3(0.8, 0.75, 0.5);
            atmoTerm = vec3(0.5, 0.7, 0.6);
            atmoNight = vec3(0.2, 0.25, 0.25);
        } else {
            atmoDay = vec3(0.7, 0.65, 0.55);
            atmoTerm = vec3(0.55, 0.75, 0.8);
            atmoNight = vec3(0.18, 0.28, 0.35);
        }
        
        // Different haze colors by zone
        vec3 hazeColor = atmoDay * dayside + 
                         atmoTerm * terminator + 
                         atmoNight * nightside;
        
        float hazeStrength = ATMO_HAZE_DAY * dayside + 
                            ATMO_HAZE_TERMINATOR * terminator + 
                            ATMO_HAZE_DAY * 0.3 * nightside;
        
        float haze = pow(edgeFactor, ATMO_HAZE_POWER) * hazeStrength * uHasAtmosphere;
        litColor += hazeColor * haze;
    }
    
    // === STAR TINT ===
    // Strong star tint on dayside
    vec3 starTint = starLightTint(uStarTemp);
    litColor *= mix(vec3(1.0), starTint, dayside * 0.5);
    
    // Ensure nightside isn't completely black
    litColor = max(litColor, vec3(0.01, 0.012, 0.02));
    
    gl_FragColor = vec4(litColor, 1.0);
}

`,cn={rocky:Je,gasGiant:Qe,hotJupiter:en,iceGiant:nn,icyWorld:tn,lavaWorld:on,oceanWorld:an,subNeptune:rn,desertWorld:sn,tidallyLocked:ln},fn={rocky:new O(.6,.5,.4),gasGiant:new O(.8,.7,.5),hotJupiter:new O(.9,.4,.2),iceGiant:new O(.4,.6,.8),icyWorld:new O(.7,.8,.9),lavaWorld:new O(.9,.3,.1),oceanWorld:new O(.2,.4,.7),subNeptune:new O(.5,.6,.7),desertWorld:new O(.8,.65,.4),tidallyLocked:new O(.5,.4,.3)};function mn(a){const{type:e,temperature:t,mass:o,radius:l}=a;return e==="GasGiant"?t>1e3?"hotJupiter":t<200?"iceGiant":"gasGiant":e==="SubNeptune"?t<200?"iceGiant":"subNeptune":t>800?"lavaWorld":t<200?"icyWorld":t>400&&t<800?"desertWorld":t>250&&t<350&&o<3?"oceanWorld":"rocky"}function dn(){return $e}function un(a){return G+F+ce+B+cn[a]}function pn(a,e,t,o){const l=a.mass/Math.pow(a.radius,3)/5.5,n=Math.max(0,Math.min(1,l)),u=Math.max(0,Math.min(1,1/(a.semiMajorAxis*a.semiMajorAxis))),h=a.type==="Rocky"?0:1;return{uBaseColor:{value:fn[e].clone()},uTime:{value:0},uTemperature:{value:a.temperature},uHasAtmosphere:{value:h},uSeed:{value:t},uDensity:{value:n},uInsolation:{value:u},uStarTemp:{value:o},uDetailLevel:{value:.4},uEnableTerminator:{value:0},uColorTempFactor:{value:.5},uColorCompositionFactor:{value:.5},uColorIrradiationFactor:{value:.3},uColorMetallicityFactor:{value:.3}}}const ae=4,re=60,j=1;class hn{constructor(e,t,o,l){this.clock=new Ce,this.animationId=0,this.flareMeshes=[],this.flareMaterials=[],this.flareData=[],this.planetMaterials=[],this.planetOrbitalData=[],this.uniforms=Ue(t,o,l),this.renderer=new _e({canvas:e,antialias:!0,alpha:!1});const u=window.screen.width*window.devicePixelRatio>3e3?1:2;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,u)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.toneMapping=Ae,this.renderer.toneMappingExposure=1,this.scene=new ge,this.camera=new Le(50,e.clientWidth/e.clientHeight,.1,2e3),this.camera.position.set(0,8,14),this.controls=new Re(this.camera,e),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.minDistance=2,this.controls.maxDistance=25,this.controls.enablePan=!1,this.starGroup=new ee,this.scene.add(this.starGroup),this.planetGroup=new ee,this.scene.add(this.planetGroup),this.buildSurface(),this.buildCorona(),this.buildFlameTongues(),this.buildFlares(l),this.buildRays(),this.buildGlow();const h=new Oe(this.uniforms.surface.uStarColor.value,N.LIGHT_INTENSITY,N.LIGHT_DISTANCE);this.starGroup.add(h);const f=P(l);this.backdrop=new Pe(10,f,"desktop"),this.scene.add(this.backdrop.mesh)}buildSurface(){const e=new W(1,48,32),t=G+F+B+ke,o=G+F+ce+B+Ve;this.surfaceMaterial=new x({vertexShader:t,fragmentShader:o,uniforms:this.uniforms.surface}),this.starGroup.add(new b(e,this.surfaceMaterial))}buildCorona(){const e=new W(N.CORONA_SCALE,32,24),t=G+F+B+We;this.coronaMaterial=new x({vertexShader:ze,fragmentShader:t,uniforms:this.uniforms.corona,transparent:!0,depthWrite:!1,blending:z,side:ne}),this.starGroup.add(new b(e,this.coronaMaterial))}buildFlameTongues(){const e=new W(N.FLAME_TONGUES_SCALE,32,24),t=G+F+B+qe;this.flameTonguesMaterial=new x({vertexShader:Ze,fragmentShader:t,uniforms:this.uniforms.flameTongues,transparent:!0,depthWrite:!1,blending:z,side:ne}),this.starGroup.add(new b(e,this.flameTonguesMaterial))}buildFlares(e){const t=P(e),o=1;for(let l=0;l<ae;l++){const n=t+l*.1,u=P(`${n}-angle`)*Math.PI*2,h=(P(`${n}-elev`)-.5)*Math.PI*.8,f=P(`${n}-phase`)*Math.PI*2,p=.7+P(`${n}-speed`)*.6,S=.8+P(`${n}-size`)*.4,E=Math.cos(h)*Math.cos(u),v=Math.sin(h),R=Math.cos(h)*Math.sin(u),_=new te(E,v,R),A=_.clone().multiplyScalar(o*1.05),T=new Ie;T.setFromUnitVectors(new te(0,1,0),_),this.flareData.push({angle:u,elevation:h,phase:f,speed:p,size:S,direction:_,quaternion:T});const I=new Z(Math.max(o*.25*S,j),Math.max(o*.35*S,j*1.4)),m=G+F+B+Xe,s=new x({vertexShader:je,fragmentShader:m,uniforms:{uStarColor:this.uniforms.surface.uStarColor,uTime:{value:0},uFlarePhase:{value:0},uFlareLength:{value:Math.max(o*.3*S,j)},uFlareSeed:{value:f}},transparent:!0,depthWrite:!1,blending:z,side:be}),c=new b(I,s);c.position.copy(A),c.quaternion.copy(T),this.flareMeshes.push(c),this.flareMaterials.push(s),this.starGroup.add(c)}}buildRays(){const e=new Z(2*N.RAYS_SIZE,2*N.RAYS_SIZE),t=F+B+Ke;this.raysMaterial=new x({vertexShader:Ye,fragmentShader:t,uniforms:this.uniforms.rays,transparent:!0,depthWrite:!1,blending:z}),this.raysMesh=new b(e,this.raysMaterial),this.starGroup.add(this.raysMesh)}buildGlow(){const e=new Z(2*N.GLOW_SIZE,2*N.GLOW_SIZE);this.glowMaterial=new x({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        uniform float uSeed;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float angle = atan(center.y, center.x);
          float circularMask = 1.0 - smoothstep(0.35, 0.5, dist);
          float rotAngle = angle + uTime * 0.5;
          float n1 = noise(vec2(rotAngle * 3.0, dist * 8.0 + uTime * 0.3 + uSeed));
          float n2 = noise(vec2(rotAngle * 5.0 + 10.0, dist * 12.0 - uTime * 0.2));
          float noiseVal = n1 * 0.6 + n2 * 0.4;
          float glow = exp(-dist * dist * 12.0);
          glow *= 0.85 + noiseVal * 0.25;
          float pulse = 1.0 + sin(uTime * 0.8 + uSeed * 6.28) * 0.08;
          float clampedIntensity = clamp(uIntensity, 0.7, 1.8);
          glow = glow * clampedIntensity * 0.7 * pulse * circularMask;
          gl_FragColor = vec4(uColor, glow);
        }
      `,uniforms:this.uniforms.glow,transparent:!0,depthWrite:!1,blending:z}),this.glowMesh=new b(e,this.glowMaterial),this.starGroup.add(this.glowMesh)}setPlanets(e){for(;this.planetGroup.children.length>0;){const n=this.planetGroup.children[0];this.planetGroup.remove(n),n instanceof b&&(n.geometry.dispose(),n.material instanceof q&&n.material.dispose()),n instanceof oe&&(n.geometry.dispose(),n.material instanceof q&&n.material.dispose())}this.planetMaterials=[],this.planetOrbitalData=[];const t=e.host.teff??5800,o=new W(1,16,12),l=new De({color:16777215,transparent:!0,opacity:.15});e.planets.forEach((n,u)=>{let h;n.type==="GasGiant"?h=.25+(n.radius-8)/4*.15:n.type==="SubNeptune"?h=.12+(n.radius-1.7)/(3.5-1.7)*.08:h=.08+(n.radius-.8)/(1.5-.8)*.04,h=Math.max(.06,Math.min(.4,h));const f=3.5+(Math.log10(n.semiMajorAxis+.1)+1)*3,p=n.orbitalPeriod>0?.3/n.orbitalPeriod:.1,S=mn(n),E=(u+1)*.137,v=pn(n,S,E,t),R=new x({vertexShader:dn(),fragmentShader:un(S),uniforms:v}),_=new b(o,R);_.scale.setScalar(h);const A=u*2.399;_.position.set(Math.cos(A)*f,0,Math.sin(A)*f),this.planetGroup.add(_),this.planetMaterials.push(R),this.planetOrbitalData.push({sceneRadius:f,speed:p});const T=64,I=new ye,m=new Float32Array((T+1)*3);for(let s=0;s<=T;s++){const c=s/T*Math.PI*2;m[s*3]=Math.cos(c)*f,m[s*3+1]=0,m[s*3+2]=Math.sin(c)*f}I.setAttribute("position",new Ne(m,3)),this.planetGroup.add(new oe(I,l))})}start(){this.clock.start();const e=()=>{this.animationId=requestAnimationFrame(e);const t=this.clock.getElapsedTime();this.update(t),this.renderer.render(this.scene,this.camera)};e()}update(e){this.controls.update(),this.raysMesh.quaternion.copy(this.camera.quaternion),this.glowMesh.quaternion.copy(this.camera.quaternion),this.surfaceMaterial.uniforms.uTime.value=e,this.coronaMaterial.uniforms.uTime.value=e,this.raysMaterial.uniforms.uTime.value=e,this.flameTonguesMaterial.uniforms.uTime.value=e,this.glowMaterial.uniforms.uTime.value=e;for(let o=0;o<ae;o++){const l=this.flareData[o],n=this.flareMaterials[o],u=this.flareMeshes[o],f=(e*l.speed+l.phase)%re/re,p=1-this.uniforms.surface.uActivityLevel.value*.15,E=f>p?(f-p)/(1-p):0;let v=1;if(E<.6)v=1+E*.33;else{const R=(E-.6)/.4;v=1.2+R*R*10}u.position.copy(l.direction).multiplyScalar(v),n.uniforms.uTime.value=e,n.uniforms.uFlarePhase.value=E}this.backdrop.update(e,this.camera);let t=0;for(let o=0;o<this.planetGroup.children.length;o++){const l=this.planetGroup.children[o];if(l instanceof b&&this.planetOrbitalData[t]){const n=this.planetOrbitalData[t],u=e*n.speed+t*2.399;l.position.set(Math.cos(u)*n.sceneRadius,0,Math.sin(u)*n.sceneRadius),l.rotation.y=e*.2,this.planetMaterials[t]&&(this.planetMaterials[t].uniforms.uTime.value=e),t++}}}resize(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}dispose(){cancelAnimationFrame(this.animationId),this.controls.dispose(),this.backdrop.dispose(),this.scene.traverse(e=>{e instanceof b&&(e.geometry.dispose(),e.material instanceof q&&e.material.dispose())}),this.renderer.dispose()}}class vn{constructor(e){this.seed=e%2147483647,this.seed<=0&&(this.seed+=2147483646)}random(){return this.seed=this.seed*16807%2147483647,(this.seed-1)/2147483646}uniform(e,t){return e+(t-e)*this.random()}bool(e){return this.random()<e}poisson(e){const t=Math.exp(-e);let o=1,l=0;do l++,o*=this.random();while(o>t);return l-1}normal(e=0,t=1){const o=this.random(),l=this.random(),n=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*l);return e+n*t}}function En(a){return Math.pow(a/5800,2.5)}function Sn(a){return Math.pow(a/5800,1.25)}function se(a,e,t){const o=e*.00465;return a*Math.sqrt(o/(2*t))}function ie(a,e){return Math.sqrt(Math.pow(a,3)/e)}function Tn(a){return a<1?Math.pow(a,3):a<4?Math.pow(a,2.06):Math.pow(a,1.5)*10}function Cn(a,e){const t=new vn(e),o=a.objectType.toLowerCase().includes("giant"),l=a.teff??5800,n=a.logg??(o?2.5:4.5),u=a.feh??t.normal(0,.2),h=En(l),f=Sn(l);let p=.75;l<4e3&&(p*=1.3),l>6e3&&(p*=.5),p*=1+.5*Math.tanh(u/.3),p=Math.max(0,Math.min(.99,p));const S=a.teff==null,E=a.feh==null,v=a.logg==null,R=Math.pow(l/5800,4),_=2.7*Math.sqrt(R);if(!t.bool(p))return{host:a,planets:[],derivation:{teff:l,feh:u,logg:n,estimatedMass:h,snowLine:_,pAny:p,pGiant:0,hasGiant:!1,meanSmallCount:0,isEvolved:n<3.5,teffIsDefault:S,fehIsDefault:E,loggIsDefault:v}};const A=[];let T=.03*Math.pow(10,1.8*u);h<.6&&(T*=.2),h>1.2&&h<2&&(T*=1.3),h>=2&&(T*=.1),T=Math.min(.99,T);let I=!1;if(t.bool(T)){I=!0;const g=t.uniform(_*1.1,_*3.5),D=t.uniform(8,12);A.push({type:"GasGiant",semiMajorAxis:g,eccentricity:t.uniform(0,.3),mass:t.uniform(100,400),radius:D,temperature:se(l,f,g),orbitalPeriod:ie(g,h)})}let m=2;h<.6&&(m*=2.5),h>1.2&&(m*=.5),m*=1+.2*u;const s=Math.max(1,t.poisson(m));let c=.1;const C=Math.max(.1,Math.min(.9,.5+.3*Math.tanh(u/.2)));for(let g=0;g<s;g++){const D=t.uniform(1.4,2.2),L=c*D;if(L>50)break;const y=t.bool(C),$=y?t.uniform(1.7,3.5):t.uniform(.8,1.5),fe=Tn($);A.push({type:y?"SubNeptune":"Rocky",semiMajorAxis:L,eccentricity:t.uniform(0,.2),mass:fe,radius:$,temperature:se(l,f,L),orbitalPeriod:ie(L,h)}),c=L}if(n<3.5)for(let g=A.length-1;g>=0;g--)A[g].semiMajorAxis<.5&&A.splice(g,1);return{host:a,planets:A,derivation:{teff:l,feh:u,logg:n,estimatedMass:h,snowLine:_,pAny:p,pGiant:T,hasGiant:I,meanSmallCount:m,isEvolved:n<3.5,teffIsDefault:S,fehIsDefault:E,loggIsDefault:v}}}const _n={class:"star-page"},An={key:0,class:"star-info-card"},gn={class:"card-header"},Ln={class:"star-name"},Rn={key:0,class:"derivation-block"},On={class:"derivation-heading"},In={class:"derivation-text"},bn={class:"card-body"},Dn={class:"info-row"},yn={class:"label"},Nn={class:"value"},Pn={class:"info-row"},Mn={class:"label"},Hn={class:"info-row"},wn={class:"label"},xn={class:"info-row"},Fn={class:"label"},Bn={class:"info-row"},Gn={class:"label"},Un={class:"value"},kn={class:"info-row"},Vn={class:"value"},zn={class:"info-row"},Wn={class:"label"},Yn={class:"value"},Kn={key:0,class:"info-row"},Zn={class:"label"},qn={class:"value"},jn=["href"],Xn={key:1,class:"loading-overlay"},$n={class:"loading-text"},Jn={key:2,class:"error-overlay"},Qn={key:0,class:"info-sidebar"},et={class:"sidebar-content"},nt={class:"sidebar-title"},tt={class:"sidebar-section"},ot={class:"sidebar-note"},at={class:"sidebar-subtitle"},rt={class:"cite"},st={class:"sidebar-subtitle"},it={class:"cite"},lt={class:"sidebar-subtitle"},ct={class:"sidebar-subtitle"},ft={class:"cite"},mt={class:"sidebar-subtitle"},dt=me({__name:"StarView",setup(a){const{t:e}=de(),t=Se(),o=U(null),{loading:l,star:n,error:u,query:h}=He();let f=null;const p=U(null),S=U(!1),E=V(()=>n.value?Fe(n.value.spectralType):null),v=V(()=>E.value?`#${le(E.value).toString(16).padStart(6,"0")}`:"#666"),R=V(()=>{const m=n.value;return!m||m.bMag==null||m.vMag==null?"--":(m.bMag-m.vMag).toFixed(2)}),_=V(()=>{const m=n.value;if(!m||m.parallax==null||m.parallax<=0)return"--";const c=1e3/m.parallax*3.2616;return c<100?`${c.toFixed(1)} ly`:`${Math.round(c).toLocaleString()} ly`}),A=V(()=>{const m=p.value;if(!m)return"";const s=m.derivation,c="pages.star.derivation",C=[],g=s.estimatedMass<.6?e(`${c}.massLabelLow`):s.estimatedMass>1.5?e(`${c}.massLabelHigh`):e(`${c}.massLabelMid`);C.push(e(`${c}.starClass`,{teff:Math.round(s.teff),massLabel:g,mass:s.estimatedMass.toFixed(2)}));const D=Math.round(s.pGiant*100);if(s.feh>.15?C.push(e(`${c}.metallicityHigh`,{feh:s.feh.toFixed(2),pGiant:D})):s.feh<-.15?C.push(e(`${c}.metallicityLow`,{feh:s.feh.toFixed(2),pGiant:D})):C.push(e(`${c}.metallicityMid`,{feh:s.feh.toFixed(2),pGiant:D})),m.planets.length===0)C.push(e(`${c}.noPlanets`,{pAny:Math.round(s.pAny*100)}));else{s.hasGiant?C.push(e(`${c}.giant`,{snowLine:s.snowLine.toFixed(1)})):D>0&&C.push(e(`${c}.noGiant`,{pGiant:D}));const L=m.planets.filter(y=>y.type!=="GasGiant").length;L>0&&C.push(e(`${c}.smallPlanets`,{mean:s.meanSmallCount.toFixed(1),count:L}))}if(s.isEvolved&&C.push(e(`${c}.evolved`,{logg:s.logg.toFixed(2)})),s.teffIsDefault||s.fehIsDefault||s.loggIsDefault){const L=[],y=[];s.teffIsDefault&&(L.push(e(`${c}.defaultTeff`)),y.push(e(`${c}.estimateTeff`))),s.fehIsDefault&&(L.push(e(`${c}.defaultFeh`)),y.push(e(`${c}.estimateFeh`))),s.loggIsDefault&&(L.push(e(`${c}.defaultLogg`)),y.push(e(`${c}.estimateLogg`))),C.push(e(`${c}.defaults`,{fields:L.join(", "),estimateExplanation:y.join("; ")}))}return C.join(" ")});function T(){if(!o.value||!n.value)return;f==null||f.dispose();const m=E.value||"G";f=new hn(o.value,m,n.value.teff,n.value.mainId);const s=Math.abs(Math.round(P(n.value.mainId)*2147483647)),c=Cn(n.value,s);p.value=c,f.setPlanets(c),f.resize(o.value.clientWidth,o.value.clientHeight),f.start()}function I(){!o.value||!f||f.resize(o.value.clientWidth,o.value.clientHeight)}return ue(n,m=>{m&&T()}),pe(()=>{const m=decodeURIComponent(t.params.id);h(m),window.addEventListener("resize",I)}),he(()=>{window.removeEventListener("resize",I),f==null||f.dispose(),f=null}),(m,s)=>{const c=Te("router-link");return H(),M("div",_n,[r("canvas",{ref_key:"canvasRef",ref:o,class:"star-canvas"},null,512),i(n)?(H(),M("div",An,[r("div",gn,[r("span",Ln,d(i(n).mainId),1),E.value?(H(),M("span",{key:0,class:"spectral-badge",style:ve({background:v.value})},d(i(n).spectralType||E.value),5)):w("",!0)]),p.value?(H(),M("div",Rn,[r("div",On,d(i(e)("pages.star.proceduralHeading")),1),r("div",In,d(A.value),1)])):w("",!0),r("div",bn,[r("div",Dn,[r("span",yn,d(i(e)("pages.star.type")),1),r("span",Nn,d(i(n).objectType),1)]),r("div",Pn,[r("span",Mn,d(i(e)("pages.star.temperature")),1),r("span",{class:K(["value",{estimated:i(n).teff==null&&p.value}])},d(i(n).teff!=null?`${i(n).teff} K`:p.value?`~${Math.round(p.value.derivation.teff)} K`:"--"),3)]),r("div",Hn,[r("span",wn,d(i(e)("pages.star.surfaceGravity")),1),r("span",{class:K(["value",{estimated:i(n).logg==null&&p.value}])},d(i(n).logg!=null?`log g = ${i(n).logg.toFixed(2)}`:p.value?`~log g = ${p.value.derivation.logg.toFixed(2)}`:"--"),3)]),r("div",xn,[r("span",Fn,d(i(e)("pages.star.metallicity")),1),r("span",{class:K(["value",{estimated:i(n).feh==null&&p.value}])},d(i(n).feh!=null?`[Fe/H] = ${i(n).feh.toFixed(2)}`:p.value?`~[Fe/H] = ${p.value.derivation.feh.toFixed(2)}`:"--"),3)]),r("div",Bn,[r("span",Gn,d(i(e)("pages.star.vMagnitude")),1),r("span",Un,d(i(n).vMag!=null?i(n).vMag.toFixed(2):"--"),1)]),r("div",kn,[s[3]||(s[3]=r("span",{class:"label"},"B-V",-1)),r("span",Vn,d(R.value),1)]),r("div",zn,[r("span",Wn,d(i(e)("pages.star.distance")),1),r("span",Yn,d(_.value),1)]),p.value?(H(),M("div",Kn,[r("span",Zn,d(i(e)("pages.star.planets")),1),r("span",qn,d(i(e)("pages.star.planetsGenerated",{count:p.value.planets.length})),1)])):w("",!0)]),r("a",{href:i(n).simbadUrl,target:"_blank",rel:"noopener noreferrer",class:"simbad-link"},[...s[4]||(s[4]=[k(" SIMBAD ",-1),r("span",{class:"link-icon"},"↗",-1)])],8,jn)])):w("",!0),i(l)?(H(),M("div",Xn,[r("span",$n,d(i(e)("pages.star.loading")),1)])):w("",!0),i(u)?(H(),M("div",Jn,[r("span",null,d(i(u)),1),J(c,{to:"/",class:"back-link"},{default:Q(()=>[k(d(i(e)("pages.star.backToHome")),1)]),_:1})])):w("",!0),r("button",{class:"back-btn",onClick:s[0]||(s[0]=C=>m.$router.back())},"←"),r("button",{class:"info-btn",onClick:s[1]||(s[1]=C=>S.value=!S.value),"aria-label":"Info"},"i"),J(Ee,{name:"sidebar"},{default:Q(()=>[S.value?(H(),M("div",Qn,[r("div",et,[r("button",{class:"sidebar-close",onClick:s[2]||(s[2]=C=>S.value=!1),"aria-label":"Close"},"×"),r("h2",nt,d(i(e)("pages.star.info.title")),1),r("div",tt,[r("p",ot,d(i(e)("pages.star.info.disclaimer")),1),r("h3",at,d(i(e)("pages.star.info.metallicityTitle")),1),r("p",null,[k(d(i(e)("pages.star.info.metallicityBody"))+" ",1),r("span",rt,d(i(e)("pages.star.info.metallicityCite")),1)]),r("h3",st,d(i(e)("pages.star.info.massTitle")),1),r("p",null,[k(d(i(e)("pages.star.info.massBody"))+" ",1),r("span",it,d(i(e)("pages.star.info.massCite")),1)]),r("h3",lt,d(i(e)("pages.star.info.snowLineTitle")),1),r("p",null,d(i(e)("pages.star.info.snowLineBody")),1),r("h3",ct,d(i(e)("pages.star.info.evolvedTitle")),1),r("p",null,[k(d(i(e)("pages.star.info.evolvedBody"))+" ",1),r("span",ft,d(i(e)("pages.star.info.evolvedCite")),1)]),r("h3",mt,d(i(e)("pages.star.info.appearanceTitle")),1),r("p",null,d(i(e)("pages.star.info.appearanceBody")),1)])])])):w("",!0)]),_:1})])}}}),Et=Me(dt,[["__scopeId","data-v-69e7912f"]]);export{Et as default};
