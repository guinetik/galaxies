precision highp float;

varying vec4 vColor;

float saturate(float value) {
    return clamp(value, 0.0, 1.0);
}

void main() {
    vec2 coord = gl_PointCoord * 2.0 - vec2(1.0);
    float dist = length(coord);

    if (dist > 1.0) {
        discard;
    }

    float edge = 1.0 - smoothstep(0.62, 1.0, dist);
    float core = exp(-dist * dist * 34.0);
    float innerCorona = exp(-dist * dist * 5.2) * 0.42;
    float outerCorona = exp(-dist * dist * 1.55) * 0.28;

    // Subtle diffraction-style streaking to keep bright stars lively without
    // turning the whole sprite into a fuzzy disc.
    float rays = pow(max(0.0, 1.0 - abs(coord.x * coord.y) * 7.0), 5.0);
    rays *= exp(-dist * dist * 5.0) * 0.07;

    float corona = innerCorona + outerCorona + rays;
    vec3 coronaColor = mix(vColor.rgb * 1.32, vec3(1.0), 0.12);
    vec3 coreColor = mix(coronaColor, vec3(1.0), 0.92);
    vec3 litRgb = coronaColor * corona + coreColor * (core * 1.35);
    float alpha = vColor.a * saturate((core * 1.2 + innerCorona + outerCorona * 0.95 + rays) * edge);

    // Keep the output un-premultiplied so additive blending preserves hue and
    // does not effectively square the alpha contribution.
    gl_FragColor = vec4(litRgb, alpha);
}
