precision highp float;

varying vec2 vUV;
uniform vec2 uResolution;
uniform float uTime;
uniform float uTiltX;
uniform float uRotY;
uniform float uLOD;  // 0 = far (dim, simple), 1 = close (full detail)

const float pi = 3.1415927;

// ─── Noise ──────────────────────────────────────────────────────────────────

float hash13(vec3 p) {
    p = fract(p * vec3(0.16532, 0.17369, 0.15787));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

float hash(vec2 x) { return fract(cos(dot(x.xy, vec2(2.31, 53.21)) * 124.123) * 412.0); }

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// ─── Main ───────────────────────────────────────────────────────────────────

void main() {
    vec2 pp = vUV * 2.0 - 1.0;

    float screenR = length(pp);
    if (screenR > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // ─── Camera ─────────────────────────────────────────────────────────

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

    // ─── Black hole parameters ──────────────────────────────────────────

    vec3 bh = vec3(0.0);
    float bhr = 0.1;
    float bhmass = 8.0 * 0.001;

    vec3 p = ro;
    vec3 pv = rd;

    // Jitter to reduce banding
    p += pv * hash13(rd + vec3(uTime)) * 0.02;

    // LOD-driven parameters
    float intensity = mix(0.3, 1.0, uLOD);
    float stepSize = mix(0.012, 0.005, uLOD);
    float animSpeed = mix(0.005, 0.02, uLOD);
    float grainMix = mix(0.1, 0.5, uLOD);

    float baseDt = 0.02;
    vec3 col = vec3(0.0);
    float noncaptured = 1.0;
    float captured = 0.0;

    // Disk colors: inner hot white → mid orange → outer deep red
    vec3 cInner = vec3(1.0, 0.72, 0.28);
    vec3 cMid   = vec3(1.0, 0.55, 0.12);
    vec3 cOuter = vec3(0.5, 0.12, 0.02);
    float diskInner = 0.32;
    float diskOuter = 2.6;
    float diskHalfThickness = 0.04;
    float ringRadius = 0.40;
    float captureSoftness = 0.10;
    float viewTop = abs(sin(uTiltX));
    float diskFlatten = mix(4.2, 1.0, viewTop);
    float bandWidth = mix(0.007, 0.018, viewTop);

    float diskRotSpeed = uTime * animSpeed * 30.0;

    // ─── Ray march with gravity ─────────────────────────────────────────

    for (float t = 0.0; t < 1.0; t += stepSize) {
        vec3 toBH = bh - p;
        float distSq = dot(toBH, toBH);
        float dist = sqrt(distSq);
        float holeShadow = smoothstep(bhr * 1.15, bhr * 2.8, dist);

        // Adaptive step: smaller near BH for accuracy
        float adaptDt = baseDt * mix(0.8, 1.5, smoothstep(0.2, 1.5, dist));
        p += pv * adaptDt * noncaptured;

        // Gravity: Newton's inverse-square
        pv += toBH * (bhmass / (dist * distSq));

        // Capture test (wide smoothstep for natural photon ring dimming)
        float distToHorizon = dist - bhr;
        noncaptured = smoothstep(0.0, captureSoftness, distToHorizon);
        captured = max(captured, 1.0 - noncaptured);

        // Early exit if captured
        if (noncaptured < 0.001) break;

        // Early escape: ray left strong-field region heading outward
        if (dist > 3.0 && dot(pv, toBH) < 0.0) break;

        // ─── Accretion disk ─────────────────────────────────────────

        float diskRadius = length(toBH.xz);
        float diskT = clamp((diskRadius - diskInner) / (diskOuter - diskInner), 0.0, 1.0);
        float diskY = abs(p.y) * diskFlatten;
        float verticalMask = 1.0 - smoothstep(diskHalfThickness, diskHalfThickness * 2.0, diskY);
        float radialIn = smoothstep(diskInner - 0.08, diskInner + 0.12, diskRadius);
        float radialOut = 1.0 - smoothstep(diskOuter - 0.7, diskOuter + 0.2, diskRadius);
        float midRingSuppression = 1.0 - (1.0 - smoothstep(0.55, 0.95, diskRadius)) * (1.0 - smoothstep(0.01, 0.045, diskY));
        float diskMask = verticalMask * radialIn * radialOut * midRingSuppression;

        if (diskMask > 0.001) {
            float diskAngle = atan(toBH.x, toBH.z);
            float rotAngle = diskAngle + diskRotSpeed;

            // Procedural noise texture
            vec2 diskUV = vec2(mix(0.2, 1.0, diskT) * 12.0, rotAngle * 5.0);
            float turbulence = max(0.0, noise(diskUV * vec2(0.1, 0.5)) + 0.05);
            float grain = noise(diskUV * vec2(1.5, 3.0) + 77.0);
            float streaks = noise(vec2(rotAngle * 18.0 - uTime * animSpeed * 140.0, diskT * 36.0 + 11.0));
            float clumps = noise(vec2(rotAngle * 34.0 + grain * 2.0, diskT * 80.0 - uTime * animSpeed * 40.0));
            float innerMask = 1.0 - smoothstep(0.08, 0.42, diskT);
            float innerTexture = mix(0.45, 1.15, streaks * clumps);
            float darkLanes = mix(1.0, mix(0.32, 1.0, smoothstep(0.18, 0.82, grain)), innerMask);
            float diskTex = turbulence * (1.0 - grainMix + grainMix * grain);
            diskTex *= mix(1.0, innerTexture * darkLanes, innerMask);

            // Doppler beaming — approaching side brighter
            float doppler = 1.0 + cos(rotAngle) * 0.7;

            // 3-color radial gradient
            vec3 diskColor = mix(cInner, cMid, smoothstep(0.0, 0.28, diskT));
            diskColor = mix(diskColor, cOuter, smoothstep(0.35, 1.0, diskT));
            float radialBoost = mix(0.30, 0.42, pow(diskT, 0.7));
            float innerSuppression = mix(0.14, 1.0, smoothstep(0.02, 0.3, diskT));
            float outerLift = mix(0.88, 1.16, smoothstep(0.45, 1.0, diskT));
            diskColor *= diskTex * doppler * radialBoost * innerSuppression * outerLift;

            col += max(vec3(0.0), diskColor * diskMask * noncaptured * holeShadow);

            float midBand = exp(-pow(diskY / bandWidth, 2.0));
            float midBandRadial = smoothstep(0.48, 0.72, diskRadius) * (1.0 - smoothstep(1.05, 1.38, diskRadius));
            float midBandNoise = mix(0.65, 1.55, streaks * 0.7 + clumps * 0.3);
            vec3 midBandColor = mix(cInner, cMid, 0.45) * diskTex * midBandNoise;
            col += midBandColor * midBand * midBandRadial * noncaptured * holeShadow * 0.42;
        }

        // Ambient glow near event horizon
        col += vec3(0.8, 0.5, 0.2) * (1.0 / distSq) * 0.000003 * noncaptured * holeShadow;

        // Photon ring at photon sphere (~1.5× event horizon)
        float ringCore = exp(-pow((dist - ringRadius) / 0.028, 2.0));
        float ringHalo = exp(-pow((dist - (ringRadius + 0.08)) / 0.08, 2.0));
        col += vec3(1.0, 0.78, 0.42) * (ringCore * 0.035 + ringHalo * 0.004) * noncaptured * holeShadow;
    }

    // Apply LOD intensity
    col *= intensity;
    col *= 1.0 - captured * 0.98;

    // ─── Output with alpha ──────────────────────────────────────────────

    float feather = 1.0 - smoothstep(0.3, 1.0, screenR);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    float glowAlpha = pow(clamp(lum * 3.0, 0.0, 1.0), 1.5) * feather;
    float alpha = max(glowAlpha, captured);
    col *= feather;

    gl_FragColor = vec4(col, alpha);
}
