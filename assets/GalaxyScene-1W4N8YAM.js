import{c as P,B as L,a as A,A as se,ar as ge,b as B,n as D,d as fe,I as ve,M as G,x as ye,N as xe,k as O,l as W,C as be,V as S,Q as F,W as Pe,S as E,P as Me,aR as Se,aS as we,i as ee,O as Re}from"./three-y20Z06rJ.js";import{m as De,c as Te}from"./useGalaxyData-DncCPX_X.js";import{c as Ae,b as ze,e as Ce,G as ke,r as te,g as Le,a as Be}from"./qualityDetect-Dx4VSKNU.js";import{C as b,g as Fe,a as Ge,b as I}from"./cinematicAppearance-WeV-O7nO.js";import{G as Oe}from"./GalaxyBackdrop-Du1YRA9f.js";import{g as Ve}from"./GalaxyTextures-DwjMeFeX.js";import"./sqljs-M9QnmiAb.js";import"./vue-vendor-BVmPiw82.js";const He=`attribute float aSize;
attribute vec4 aColor;

uniform float uBaseDistance;
uniform float uBody;
uniform float uScreenHeight;
uniform float uTanHalfFov;
uniform float uResolveFade;

varying vec4 vColor;
varying float vCoverage;
varying vec3 vTransmission;
varying float vRadius;
varying float vPatchiness;
varying float vResolveFade;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Keep subpixel energy in alpha rather than dropping undersized points.
  float pointSize = clamp((aSize * 0.30 + 0.35) * (uBaseDistance * 1.28 / length(mvPosition.xyz)), 0.25, 3.2);
  gl_PointSize = max(pointSize, 1.0);
  vCoverage = pow(pointSize / gl_PointSize, 2.0);
  if (uBody > 0.0) {
    gl_PointSize = uGalaxyRadius * uBody * uScreenHeight / (2.0 * uTanHalfFov * max(-mvPosition.z, 0.01));
    // The diffuse target is smaller; preserve energy below its one-pixel floor.
    vCoverage = min(1.0, gl_PointSize * gl_PointSize);
    gl_PointSize = max(gl_PointSize, 1.0);
  }
  vTransmission = dustTransmission(position, cameraPosition);
  vRadius = length(position) / uGalaxyRadius;
  vResolveFade = uResolveFade;
  float mottling = bodyNoise(restPosition(position.xz / uGalaxyRadius) * 22.0);
  vPatchiness = 0.25 + mottling * mottling * 2.0;
  gl_Position = projectionMatrix * mvPosition;
}
`,Ue=`precision highp float;

varying vec4 vColor;
uniform float uBody;
uniform float uBodyOpacity;
uniform float uOldPopulation;
varying float vCoverage;
varying vec3 vTransmission;
varying float vRadius;
varying float vPatchiness;
varying float vResolveFade;

void main() {
    if (uBody > 0.0) {
      vec2 p = gl_PointCoord * 2.0 - 1.0;
      float envelope = max(0.0, exp(-dot(p, p) * 5.0) - exp(-5.0));
      vec3 outerTint = mix(vec3(0.48, 0.62, 0.9), vec3(0.82, 0.71, 0.57), uOldPopulation);
      vec3 tint = mix(vec3(0.92, 0.76, 0.55), outerTint, clamp(vRadius * 2.5, 0.0, 1.0));
      float radialLight = exp(-vRadius * 2.3) * (1.0 - smoothstep(0.85, 1.2, vRadius));
      gl_FragColor = vec4(tint * vTransmission, envelope * radialLight * uBodyOpacity * mix(vPatchiness, 1.0, uOldPopulation) * vResolveFade * vCoverage);
      return;
    }
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float core = exp(-dot(p, p) * 4.5);
    float alpha = vColor.a * core * vCoverage * 0.65;
    if (alpha < 0.004) discard;

    vec3 color = mix(vColor.rgb, vec3(0.85, 0.9, 1.0), 0.12);
    vec3 litRgb = color * 1.8 * vTransmission;

    gl_FragColor = vec4(litRgb, alpha);
}
`,Ye=`uniform sampler2D uDustMap;
uniform float uGalaxyRadius;
uniform vec4 uDustMotion; // omega, falloff, turnover/R, elapsed simulation time

vec2 restPosition(vec2 p) {
  float r = length(p);
  float omega = uDustMotion.x / pow(max(r / uDustMotion.z, 1.0), uDustMotion.y);
  float angle = -omega * uDustMotion.w;
  return vec2(p.x * cos(angle) - p.y * sin(angle), p.x * sin(angle) + p.y * cos(angle));
}

float bodyHash(vec2 p) {
  return fract(cos(dot(p, vec2(2.31, 53.21)) * 124.123) * 412.0);
}
float bodyNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(bodyHash(i), bodyHash(i + vec2(1.0, 0.0)), u.x),
    mix(bodyHash(i + vec2(0.0, 1.0)), bodyHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Integrate a thin dust slab along the sightline. One midpoint sample is a
// deliberate approximation; the path length makes edge-on lanes stronger.
vec3 dustTransmission(vec3 p, vec3 cameraWorldPosition) {
  vec3 eye = cameraWorldPosition / uGalaxyRadius;
  vec3 origin = p / uGalaxyRadius;
  vec3 ray = normalize(eye - origin);
  float dy = (ray.y < 0.0 ? -1.0 : 1.0) * max(abs(ray.y), 0.001);
  float a = (-0.018 - origin.y) / dy;
  float b = (0.018 - origin.y) / dy;
  float entry = max(0.0, min(a, b));
  float exitPoint = min(min(length(eye - origin), 2.6), max(a, b));
  float path = max(0.0, exitPoint - entry);
  vec3 mid = origin + ray * (entry + path * 0.5);
  vec2 local = restPosition(mid.xz);
  float tau = texture2D(uDustMap, local / 2.6 + 0.5).r * 8.0;
  tau *= min(path / 0.036, 7.0) * 0.65;
  return exp(-tau * vec3(0.65, 0.9, 1.2));
}
`;function _e(M,e,a){M/=360;const n=e*Math.min(a,1-a),i=c=>{const s=(c+M*12)%12;return a-n*Math.max(Math.min(s-3,9-s,1),-1)};return[i(0),i(8),i(4)]}function Xe(M,e){switch(M){case"star":return e*.6;case"bright":return e*.85}}class Ee{constructor(e,a,n){this.simulationTime=0,this.stars=e,this.baseDistance=a;const i=e.length,c=new Float32Array(i*3),s=new Float32Array(i*4),u=new Float32Array(i*4),p=new Float32Array(i);this.angleOffsets=new Float32Array(i),this.baseAlphas=new Float32Array(i);for(let r=0;r<i;r++){const d=e[r],x=d.radius*Math.cos(d.angle),w=d.radius*Math.sin(d.angle);c[r*3]=x,c[r*3+1]=d.y,c[r*3+2]=w;const t=d.sat,o=Xe(d.layer,d.brightness),[h,y,R]=_e(d.hue,t,o);s[r*4]=u[r*4]=h,s[r*4+1]=u[r*4+1]=y,s[r*4+2]=u[r*4+2]=R,s[r*4+3]=d.alpha,u[r*4+3]=0,p[r]=d.size,this.angleOffsets[r]=d.angle,this.baseAlphas[r]=d.alpha}const g=new P(c,3),l=new P(p,1);this.backgroundGeometry=new L,this.backgroundGeometry.setAttribute("position",g),this.backgroundGeometry.setAttribute("aColor",new P(s,4)),this.backgroundGeometry.setAttribute("aSize",l),this.foregroundGeometry=new L,this.foregroundGeometry.setAttribute("position",g),this.foregroundGeometry.setAttribute("aColor",new P(u,4)),this.foregroundGeometry.setAttribute("aSize",l),this.dustMap=Ae(n),this.material=new A({vertexShader:Ye+`
`+He,fragmentShader:Ue,uniforms:{uBaseDistance:{value:a},uBody:{value:0},uBodyOpacity:{value:0},uResolveFade:{value:1},uOldPopulation:{value:n.morphology.ellipticity>0?1:0},uScreenHeight:{value:800},uTanHalfFov:{value:Math.tan(Math.PI/6)},uGalaxyRadius:{value:n.galaxyRadius},uDustMap:{value:this.dustMap},uDustMotion:{value:new ge(n.rotationOmega0,n.rotationFalloff,n.rotationTurnover/n.galaxyRadius,0)}},transparent:!0,depthWrite:!1,blending:se}),this.foregroundMaterial=this.material.clone(),this.foregroundMaterial.uniforms={...this.material.uniforms};const m=Math.max(1,Math.ceil(i/b.bodySamples)),v=[];for(let r=0;r<i;r+=m)v.push(r);this.bodyGeometry=new L,this.bodyGeometry.setAttribute("position",g),this.bodyGeometry.setAttribute("aSize",l),this.bodyGeometry.setAttribute("aColor",this.backgroundGeometry.getAttribute("aColor")),this.bodyGeometry.setIndex(v),this.bodyMaterial=this.material.clone(),this.bodyMaterial.uniforms={...this.material.uniforms,uBody:{value:b.bodyDiameter},uBodyOpacity:{value:b.bodyOpacity*3e4/v.length},uScreenHeight:{value:800*b.bodyResolutionScale}},this.bodyPoints=new B(this.bodyGeometry,this.bodyMaterial),this.bodyPoints.frustumCulled=!1,this.bodyPoints.renderOrder=-2,this.points=new B(this.backgroundGeometry,this.material),this.points.frustumCulled=!1,this.foregroundPoints=new B(this.foregroundGeometry,this.foregroundMaterial),this.foregroundPoints.frustumCulled=!1,this.foregroundPoints.renderOrder=2}update(e,a,n,i,c,s,u,p,g=!0){this.simulationTime+=e,this.material.uniforms.uDustMotion.value.w=this.simulationTime,this.material.uniforms.uScreenHeight.value=p,this.bodyMaterial.uniforms.uScreenHeight.value=p*b.bodyResolutionScale,this.material.uniforms.uTanHalfFov.value=Math.tan(n.fov*Math.PI/360);const l=this.stars,m=l.length,v=this.backgroundGeometry.getAttribute("position"),r=this.backgroundGeometry.getAttribute("aColor"),d=this.foregroundGeometry.getAttribute("aColor"),x=v.array,w=r.array,t=d.array,o=n.matrixWorldInverse.elements,h=n.projectionMatrix.elements,y=o[14],R=n.position.length();this.material.uniforms.uResolveFade.value=Fe(R,this.material.uniforms.uGalaxyRadius.value),this.bodyPoints.visible=this.material.uniforms.uResolveFade.value>0,this.foregroundPoints.visible=g;const V=D.smoothstep(1-Math.abs(n.position.y)/Math.max(R,1e-4),.55,.95),Z=D.lerp(Math.max(this.baseDistance*.03,6),Math.max(this.baseDistance*.004,.75),V),oe=D.lerp(Math.max(this.baseDistance*.06,10),Math.max(this.baseDistance*.018,3),V),N=D.lerp(.75,1.2,V),ae=Math.max(s*N/Math.max(u*.5,1),.04),re=Math.max(s*N/Math.max(p*.5,1),.04);for(let f=0;f<m;f++){const T=l[f];this.angleOffsets[f]+=T.rotationSpeed*e;const Q=this.angleOffsets[f];x[f*3]=T.radius*Math.cos(Q),x[f*3+2]=T.radius*Math.sin(Q);let z=this.baseAlphas[f];if(T.layer==="bright"){const pe=Math.sin(a*.5+T.twinklePhase)*.025+.975;z*=pe}if(!g){w[f*4+3]=z,t[f*4+3]=0;continue}const H=x[f*3],U=x[f*3+1],Y=x[f*3+2],_=o[0]*H+o[4]*U+o[8]*Y+o[12],X=o[1]*H+o[5]*U+o[9]*Y+o[13],C=o[2]*H+o[6]*U+o[10]*Y+o[14],le=h[0]*_+h[4]*X+h[8]*C+h[12],he=h[1]*_+h[5]*X+h[9]*C+h[13],q=h[3]*_+h[7]*X+h[11]*C+h[15],j=q!==0?1/q:0,ce=le*j,ue=he*j,$=(ce-i)/ae,K=(ue-c)/re,de=1-D.smoothstep(.75,1.25,Math.sqrt($*$+K*K)),me=D.smoothstep(C-y,Z,Z+oe),J=de*me;w[f*4+3]=z*(1-J),t[f*4+3]=z*J}v.needsUpdate=!0,r.needsUpdate=!0,d.needsUpdate=!0}dispose(){this.backgroundGeometry.dispose(),this.foregroundGeometry.dispose(),this.material.dispose(),this.foregroundMaterial.dispose(),this.bodyGeometry.dispose(),this.bodyMaterial.dispose(),this.dustMap.dispose()}}const Ie=`varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,We=`precision highp float;

varying vec2 vUV;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiltX;
uniform float uRotY;
uniform float uLOD;
uniform float uReveal;

const float PI = 3.1415926;

/**
 * 3D hash for ray jitter — maps vec3 to float.
 */
float hash13(vec3 p) {
    p = fract(p * vec3(0.16532, 0.17369, 0.15787));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

/**
 * 2D hash — maps vec2 to float (matched to WebGPU tsl-helpers).
 */
float hash2d(vec2 p) {
    return fract(cos(dot(p, vec2(2.31, 53.21)) * 124.123) * 412.0);
}

/**
 * 2D value noise with smooth bilinear interpolation.
 */
float noise2d(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash2d(i), hash2d(i + vec2(1.0, 0.0)), u.x),
        mix(hash2d(i + vec2(0.0, 1.0)), hash2d(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

void main() {
    vec2 pp = vUV * 2.0 - 1.0;
    float screenR = length(pp);

    if (screenR > 1.0) discard;

    // ─── Camera ──────────────────────────────────────────────────────────
    vec3 lookAt = vec3(0.0, -0.1, 0.0);
    float eyer = 2.0;
    float eyea = uRotY;
    float eyea2 = uTiltX + 1.2;

    vec3 ro = vec3(
        eyer * cos(eyea) * sin(eyea2),
        eyer * cos(eyea2),
        eyer * sin(eyea) * sin(eyea2)
    );

    vec3 front = normalize(lookAt - ro);
    vec3 left = normalize(cross(normalize(vec3(0.0, 1.0, -0.1)), front));
    vec3 up = normalize(cross(front, left));
    vec3 rd = normalize(front * 1.5 + left * pp.x + up * pp.y);

    // ─── Black hole parameters (matched to WebGPU singularity model) ────
    float originRadius = 0.13;
    float power = 0.3;
    float bandWidth = 0.04;
    float stepSize = mix(0.018, 0.012, uLOD);

    vec3 rayPos = ro;
    vec3 rayDir = rd;

    rayPos += rayDir * hash13(rd + uTime) * 0.01;

    float intensity = mix(0.3, 1.0, uLOD);
    float animSpeed = mix(0.005, 0.02, uLOD);
    float grainMix = mix(0.1, 0.5, uLOD);

    vec3 col = vec3(0.0);
    float alphaAcc = 0.0;
    float captured = 0.0;

    vec3 cInner = vec3(1.0, 0.65, 0.18);
    vec3 cMid = vec3(1.0, 0.35, 0.05);
    vec3 cOuter = vec3(0.4, 0.08, 0.01);
    vec3 emissionColor = vec3(0.25, 0.15, 0.05);
    float diskRotSpeed = uTime * animSpeed * 30.0;

    // ─── Ray march with direction-based gravity steering ────────────────
    for (int i = 0; i < 200; i++) {
        vec3 rNorm = normalize(rayPos);
        float rLen = length(rayPos);
        float steerMag = stepSize * power / max(rLen * rLen, 0.001);
        vec3 steeredDir = normalize(rayDir - rNorm * steerMag);

        vec3 advance = rayDir * stepSize;
        rayPos += advance;

        float rLenNow = length(rayPos);
        if (rLenNow < originRadius) {
            captured = 1.0;
            break;
        }

        // ─── Volumetric accretion disk ──────────────────────────────────
        float xyLen = length(vec2(rayPos.x, rayPos.z));

        float yNorm = rayPos.y / bandWidth;
        float yBand = max(0.0, 1.0 - yNorm * yNorm);

        float radialFade = smoothstep(1.3, 0.16, xyLen);
        float diskMask = yBand * radialFade;

        float diskAngle = atan(-rayPos.x, -rayPos.z);
        float rotAngle = diskAngle + diskRotSpeed;
        vec2 noiseUV = vec2(xyLen * 8.0, rotAngle * 5.0);

        float turbulence = max(0.0, noise2d(noiseUV * vec2(0.1, 0.5)) + 0.05);
        float grain = noise2d(noiseUV * vec2(1.5, 3.0) + 77.0);
        float diskTex = turbulence * (1.0 - grainMix + grainMix * grain);

        float doppler = 1.0 + cos(rotAngle) * 0.7;

        float rampInput = clamp(xyLen + (diskTex - 0.78) * 1.5, 0.0, 1.0);
        vec3 diskColor = mix(
            mix(cInner, cMid, smoothstep(0.05, 0.425, rampInput)),
            cOuter,
            smoothstep(0.425, 1.0, rampInput)
        );

        float texBright = max(diskTex, 0.3);
        vec3 emissiveCol = diskColor * texBright * doppler * 3.5
                         + emissionColor * diskMask * 0.8;

        float diskAlpha = diskMask * clamp(texBright * 2.0, 0.0, 1.0);

        float oneMinusA = 1.0 - alphaAcc;
        float weight = oneMinusA * diskAlpha;
        col = mix(col, emissiveCol, weight);
        alphaAcc = clamp(mix(alphaAcc, 1.0, diskAlpha), 0.0, 1.0);

        // Second advance + direction update (singularity double-step)
        rayPos += advance;
        rayDir = steeredDir;

        if (dot(rayPos, rayPos) > 16.0 && dot(rayDir, rayPos) > 0.0) {
            break;
        }
    }

    col *= intensity;

    // ─── Output ─────────────────────────────────────────────────────────
    float feather = 1.0 - smoothstep(0.3, 1.0, screenR);
    col *= feather;
    float alpha = max(alphaAcc * feather, captured);

    gl_FragColor = vec4(col, alpha * uReveal);
}
`;class Ze{constructor(e,a=60){this.apparentPx=0,this.quadSize=a;const n=new fe(1,4,4),i=new ve({visible:!1});this.depthMesh=new G(n,i),this.depthMesh.layers.set(2),this.material=new A({vertexShader:Ie,fragmentShader:We,uniforms:{uResolution:{value:new O(512,512)},uTime:{value:0},uTiltX:{value:0},uRotY:{value:0},uLOD:{value:0},uReveal:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,blending:xe,side:ye}),this.mesh=new G(new W(1,1),this.material),this.mesh.scale.set(a,a,1),this.mesh.renderOrder=1,this.mesh.layers.set(2)}update(e,a,n,i,c){if(this.material.uniforms.uTime.value=e,this.material.uniforms.uTiltX.value=a,this.material.uniforms.uRotY.value=n,c){const s=c.getSize(new O),u=c.getPixelRatio();this.material.uniforms.uResolution.value.set(s.x*u,s.y*u)}if(i){this.mesh.quaternion.copy(i.quaternion);const s=i.position.length(),u=Ge(s,this.quadSize/.08);this.material.uniforms.uReveal.value=u,this.mesh.visible=u>0;const g=(i.fov??60)*Math.PI/180,l=this.material.uniforms.uResolution.value.y;this.apparentPx=this.quadSize/s*(l/(2*Math.tan(g/2)));const m=Math.min(Math.max((this.apparentPx-6)/220,0),1);this.material.uniforms.uLOD.value=m*u}}getLOD(){return this.material.uniforms.uLOD.value}getApparentPx(){return this.apparentPx}dispose(){this.material.dispose(),this.mesh.geometry.dispose(),this.depthMesh.geometry.dispose(),this.depthMesh.material.dispose()}}const Ne=`
attribute float aSize;
attribute vec3  aColor;
attribute float aTexIndex;
attribute float aBrightness;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;

void main() {
  vColor      = aColor;
  vTexIndex   = aTexIndex;
  vBrightness = aBrightness;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Screen-space size: same formula as particle.vert.glsl, clamped smaller.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 5.0 * uPixelRatio);
  gl_Position  = projectionMatrix * mvPosition;
}
`,Qe=`
precision highp float;

uniform sampler2D uAtlas;
uniform float     uBrightness;  // global master dim (0.7)

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;  // per-sprite distance fade from aBrightness

void main() {
  // Atlas layout: 4 cols x 2 rows
  const float COLS = 4.0;
  const float ROWS = 2.0;
  float idx  = floor(vTexIndex + 0.5);
  float col  = mod(idx, COLS);
  float row  = floor(idx / COLS);

  // Map gl_PointCoord [0,1]^2 into the tile's UV window
  vec2 tileUV = vec2(
    (col + gl_PointCoord.x) / COLS,
    (row + gl_PointCoord.y) / ROWS
  );

  vec4 tex = texture2D(uAtlas, tileUV);

  // Apply brightness once: per-sprite distance fade × global master dim.
  float dim   = vBrightness * uBrightness;
  float alpha = tex.a;
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(tex.rgb * vColor * dim, alpha * dim);
}
`;class qe{constructor(e,a,n){const i=e.length,c=new Float32Array(i*3),s=new Float32Array(i*3),u=new Float32Array(i),p=new Float32Array(i),g=new Float32Array(i);for(let l=0;l<i;l++){const m=e[l];c[l*3]=m.position[0],c[l*3+1]=m.position[1],c[l*3+2]=m.position[2],s[l*3]=m.color[0],s[l*3+1]=m.color[1],s[l*3+2]=m.color[2],u[l]=m.size,p[l]=m.texIndex,g[l]=m.brightness}this.geometry=new L,this.geometry.setAttribute("position",new P(c,3)),this.geometry.setAttribute("aColor",new P(s,3)),this.geometry.setAttribute("aSize",new P(u,1)),this.geometry.setAttribute("aTexIndex",new P(p,1)),this.geometry.setAttribute("aBrightness",new P(g,1)),this.material=new A({vertexShader:Ne,fragmentShader:Qe,uniforms:{uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uBaseDistance:{value:n},uAtlas:{value:a},uBrightness:{value:.7}},transparent:!0,depthWrite:!1,blending:se}),this.points=new B(this.geometry,this.material),this.points.frustumCulled=!1}dispose(){this.geometry.dispose(),this.material.dispose()}}const ie=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = vec4(position, 1.0);
}
`,je=`precision highp float;

uniform sampler2D uSceneTexture;
uniform sampler2D uBodyTexture;
uniform vec2      uBHScreenPos;   // black hole position in UV space (0–1)
uniform float     uLensStrength;  // 0 = no distortion, ~0.03 = max
uniform float     uLensZoom;      // 0 = distant, 1 = close-up
uniform float     uAspectRatio;   // width / height

varying vec2 vUV;

void main() {
  // Vector from this pixel to the black hole center
  vec2 toBH = uBHScreenPos - vUV;
  toBH.x *= uAspectRatio;              // work in circular space

  float dist = length(toBH);
  vec2  dir  = toBH / max(dist, 0.0001);

  // Expand the field as we approach the black hole so the warped background
  // remains visible instead of getting swallowed by the black hole overlay.
  float radius = mix(0.20, 0.40, uLensZoom);
  float falloff = smoothstep(radius, 0.0, dist); // 1 at center, 0 at radius
  falloff *= falloff;                             // squared for steep drop-off
  float innerRadius = mix(0.012, 0.05, uLensZoom);
  float innerMask = smoothstep(innerRadius, innerRadius * 2.8, dist);
  float softDist = max(dist, mix(0.028, 0.04, uLensZoom));
  float deflection = uLensStrength * falloff * innerMask * (mix(0.11, 0.22, uLensZoom) / softDist);

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);
  color.rgb += texture2D(uBodyTexture, distortedUV).rgb;

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = mix(0.024, 0.09, uLensZoom);
  float ringWidth = mix(0.008, 0.024, uLensZoom);
  float ring = exp(-pow((dist - ringRadius) / ringWidth, 2.0));
  ring *= falloff * innerMask * uLensStrength * mix(10.0, 16.0, uLensZoom);
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.14;

  gl_FragColor = color;
}
`,$e=`precision highp float;
uniform sampler2D uSceneTexture;
varying vec2 vUV;

void main() {
  vec4 color = texture2D(uSceneTexture, vUV);
  // Match the WebGPU composite: all layers accumulate in linear HDR before
  // highlight compression and the final display conversion.
  color.rgb = color.rgb / (vec3(1.0) + color.rgb);
  color.rgb = pow(max(color.rgb, 0.0), vec3(1.0 / 2.2));
  gl_FragColor = color;
}
`,ne=new S(0,1,0),k=new F;class at{constructor(e,a,n=[]){this.neighbors=null,this.neighborAtlas=null,this.animationId=0,this.clock=new be,this._bhScreenVec=new S,this.orbitQuat=new F,this.zoom=4,this.targetZoom=4,this.isDragging=!1,this.isPinching=!1,this.isPanning=!1,this.pivot=new S,this.lastX=0,this.lastY=0,this.velocityX=0,this.velocityY=0,this.lastPinchDist=0,this.renderer=new Pe({canvas:e,antialias:!0,alpha:!0});const i=Be();this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,ze(i))),this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.scene=new E,this.renderer.setClearColor(0,1),this.params=De(a);const c=Ce(this.params),s=this.params.galaxyRadius;this.baseDistance=s*1.7;const u=e.clientWidth/e.clientHeight;this.camera=new Me(60,u,.1,this.baseDistance*20),this.backdrop=new Oe(this.baseDistance,a.pgc,i),this.scene.add(this.backdrop.mesh),this.particles=new Ee(c,this.baseDistance,this.params),this.scene.add(this.particles.points),this.scene.add(this.particles.foregroundPoints),this.scene.add(this.particles.bodyPoints),this.haze=new ke(this.params),this.scene.add(this.haze.mesh),this.blackHole=new Ze(null,s*.08),this.scene.add(this.blackHole.depthMesh),this.scene.add(this.blackHole.mesh),this.backdrop.mesh.layers.set(1),this.particles.points.layers.set(1),this.particles.foregroundPoints.layers.set(2),this.haze.mesh.layers.set(1),this.particles.bodyPoints.layers.set(3);const p=Te(a,n,this.baseDistance);p.length>0&&(this.neighborAtlas=Ve(),this.neighbors=new qe(p,this.neighborAtlas,this.baseDistance),this.neighbors.points.layers.set(1),this.neighbors.points.renderOrder=-9,this.scene.add(this.neighbors.points));const g=e.clientWidth,l=e.clientHeight;this.rtScaleFactor=te(i,e.clientWidth*this.renderer.getPixelRatio()),this.galaxyRT=new Se(g*this.renderer.getPixelRatio()*this.rtScaleFactor,l*this.renderer.getPixelRatio()*this.rtScaleFactor,{minFilter:ee,magFilter:ee,type:we}),this.bodyRT=this.galaxyRT.clone(),this.bodyRT.depthBuffer=!1,this.bodyRT.setSize(Math.max(1,Math.floor(this.galaxyRT.width*b.bodyResolutionScale)),Math.max(1,Math.floor(this.galaxyRT.height*b.bodyResolutionScale))),this.lensingMaterial=new A({vertexShader:ie,fragmentShader:je,uniforms:{uSceneTexture:{value:this.galaxyRT.texture},uBodyTexture:{value:this.bodyRT.texture},uBHScreenPos:{value:new O(.5,.5)},uLensStrength:{value:0},uLensZoom:{value:0},uAspectRatio:{value:g/l}},depthTest:!1,depthWrite:!1});const m=new G(new W(2,2),this.lensingMaterial);this.lensingScene=new E,this.lensingScene.add(m),this.lensingCamera=new Re(-1,1,1,-1,0,1),this.compositeRT=this.galaxyRT.clone(),this.outputMaterial=new A({vertexShader:ie,fragmentShader:$e,uniforms:{uSceneTexture:{value:this.compositeRT.texture}},depthTest:!1,depthWrite:!1}),this.outputScene=new E,this.outputScene.add(new G(new W(2,2),this.outputMaterial));const v=I(u);this.zoom=v,this.targetZoom=v;const{initRotY:r,initTiltX:d}=Le(a),x=new F().setFromAxisAngle(new S(1,0,0),d),w=new F().setFromAxisAngle(ne,r);this.orbitQuat.multiplyQuaternions(w,x),this.onPointerDown=t=>{this.isPinching||(t.button===2?(this.isPanning=!0,this.isDragging=!1):this.isDragging=!0,this.lastX=t.clientX,this.lastY=t.clientY,this.velocityX=0,this.velocityY=0)},this.onPointerMove=t=>{if(this.isPinching)return;if(this.isPanning){this.applyPan(t.clientX-this.lastX,t.clientY-this.lastY),this.lastX=t.clientX,this.lastY=t.clientY;return}if(!this.isDragging)return;const o=t.clientX-this.lastX,h=t.clientY-this.lastY;this.velocityX=o*.005,this.velocityY=h*.005,this.applyOrbitDelta(this.velocityX,this.velocityY),this.lastX=t.clientX,this.lastY=t.clientY},this.onPointerUp=()=>{this.isDragging=!1,this.isPanning=!1},this.onPointerCancel=()=>{this.isDragging=!1,this.isPinching=!1,this.isPanning=!1},this.onWheel=t=>{t.preventDefault();const o=this.targetZoom*.12;this.targetZoom+=t.deltaY>0?-o:o,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom))},this.onTouchStart=t=>{if(t.touches.length===2){t.preventDefault(),this.isPinching=!0,this.isDragging=!1;const o=t.touches[0].clientX-t.touches[1].clientX,h=t.touches[0].clientY-t.touches[1].clientY;this.lastPinchDist=Math.sqrt(o*o+h*h)}},this.onTouchMove=t=>{if(t.touches.length===2){t.preventDefault();const o=t.touches[0].clientX-t.touches[1].clientX,h=t.touches[0].clientY-t.touches[1].clientY,y=Math.sqrt(o*o+h*h),R=(y-this.lastPinchDist)*.01;this.lastPinchDist=y,this.targetZoom=Math.max(.1,Math.min(20,this.targetZoom+R))}},this.onTouchEnd=()=>{this.lastPinchDist>0&&(this.lastPinchDist=0),this.isPinching=!1},this.onContextMenu=t=>t.preventDefault(),e.addEventListener("pointerdown",this.onPointerDown),e.addEventListener("pointermove",this.onPointerMove),e.addEventListener("pointerup",this.onPointerUp),e.addEventListener("pointercancel",this.onPointerCancel),e.addEventListener("pointerleave",this.onPointerUp),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("touchstart",this.onTouchStart,{passive:!1}),e.addEventListener("touchmove",this.onTouchMove,{passive:!1}),e.addEventListener("touchend",this.onTouchEnd),e.addEventListener("contextmenu",this.onContextMenu),this.resizeObserver=new ResizeObserver(()=>{const t=e.clientWidth,o=e.clientHeight;if(t===0||o===0)return;this.renderer.setSize(t,o,!1);const h=I(t/o)/I(this.camera.aspect);this.zoom*=h,this.targetZoom*=h,this.camera.aspect=t/o,this.camera.updateProjectionMatrix();const y=this.renderer.getPixelRatio();this.rtScaleFactor=te(i,t*y),this.galaxyRT.setSize(t*y*this.rtScaleFactor,o*y*this.rtScaleFactor),this.compositeRT.setSize(t*y*this.rtScaleFactor,o*y*this.rtScaleFactor),this.bodyRT.setSize(Math.max(1,Math.floor(this.galaxyRT.width*b.bodyResolutionScale)),Math.max(1,Math.floor(this.galaxyRT.height*b.bodyResolutionScale))),this.lensingMaterial.uniforms.uAspectRatio.value=t/o}),this.resizeObserver.observe(e)}applyPan(e,a){const n=this.baseDistance/this.zoom,i=this.camera.fov*Math.PI/180,c=2*n*Math.tan(i/2)/Math.max(this.renderer.domElement.clientHeight,1),s=new S(1,0,0).applyQuaternion(this.orbitQuat),u=new S(0,1,0).applyQuaternion(this.orbitQuat);this.pivot.addScaledVector(s,-e*c),this.pivot.addScaledVector(u,a*c);const p=this.baseDistance*8;this.pivot.length()>p&&this.pivot.setLength(p)}applyOrbitDelta(e,a){k.setFromAxisAngle(ne,-e),this.orbitQuat.premultiply(k);const n=new S(1,0,0).applyQuaternion(this.orbitQuat);k.setFromAxisAngle(n,-a),this.orbitQuat.premultiply(k),this.orbitQuat.normalize()}renderGalaxyPostPass(e,a,n,i){this.camera.layers.set(3),this.renderer.setRenderTarget(this.bodyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.camera.layers.set(1),this.renderer.setRenderTarget(this.galaxyRT),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.lensingMaterial.uniforms.uBHScreenPos.value.set(e,a),this.lensingMaterial.uniforms.uLensStrength.value=n,this.lensingMaterial.uniforms.uLensZoom.value=i,this.renderer.setRenderTarget(this.compositeRT),this.renderer.clear(),this.renderer.render(this.lensingScene,this.lensingCamera)}start(){this.backdrop.prepare(this.renderer),this.clock.start();const e=()=>{this.animationId=requestAnimationFrame(e);const a=this.clock.getDelta(),n=this.clock.getElapsedTime();this.isDragging||(Math.abs(this.velocityX)>1e-4||Math.abs(this.velocityY)>1e-4)&&(this.applyOrbitDelta(this.velocityX,this.velocityY),this.velocityX*=.92,this.velocityY*=.92),this.zoom+=(this.targetZoom-this.zoom)*.08;const i=this.baseDistance/this.zoom,c=new S(0,0,i).applyQuaternion(this.orbitQuat).add(this.pivot);this.camera.position.copy(c),this.camera.lookAt(this.pivot),this.camera.updateMatrixWorld(!0);const s=this.camera.position,u=Math.sqrt(s.x*s.x+s.z*s.z),p=Math.atan2(s.y,u),g=Math.atan2(s.x,s.z);this.backdrop.update(n,this.camera),this.haze.update(this.camera),this.blackHole.update(n,p,g,this.camera,this.renderer),this._bhScreenVec.set(0,0,0).project(this.camera);const l=this._bhScreenVec.x*.5+.5,m=this._bhScreenVec.y*.5+.5,v=this.renderer.getSize(new O),r=this.renderer.getPixelRatio();this.particles.update(a*b.motionScale,n,this.camera,this._bhScreenVec.x,this._bhScreenVec.y,this.blackHole.getApparentPx(),v.x*r*this.rtScaleFactor,v.y*r*this.rtScaleFactor,this.blackHole.mesh.visible);{const d=this.blackHole.getLOD(),x=d*d*.045;this.renderGalaxyPostPass(l,m,x,d)}this.camera.layers.set(2),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0,this.renderer.setRenderTarget(null),this.renderer.render(this.outputScene,this.lensingCamera)};e()}dispose(){var a,n;cancelAnimationFrame(this.animationId);const e=this.renderer.domElement;e.removeEventListener("pointerdown",this.onPointerDown),e.removeEventListener("pointermove",this.onPointerMove),e.removeEventListener("pointerup",this.onPointerUp),e.removeEventListener("pointercancel",this.onPointerCancel),e.removeEventListener("pointerleave",this.onPointerUp),e.removeEventListener("wheel",this.onWheel),e.removeEventListener("touchstart",this.onTouchStart),e.removeEventListener("touchmove",this.onTouchMove),e.removeEventListener("touchend",this.onTouchEnd),e.removeEventListener("contextmenu",this.onContextMenu),this.resizeObserver.disconnect(),this.backdrop.dispose(),this.particles.dispose(),this.haze.dispose(),this.blackHole.dispose(),(a=this.neighbors)==null||a.dispose(),(n=this.neighborAtlas)==null||n.dispose(),this.galaxyRT.dispose(),this.bodyRT.dispose(),this.compositeRT.dispose(),this.outputMaterial.dispose(),this.outputScene.children[0].geometry.dispose(),this.lensingScene.children[0].geometry.dispose(),this.lensingMaterial.dispose(),this.renderer.dispose()}}export{at as GalaxyScene};
