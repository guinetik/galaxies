precision mediump float;

varying vec4 vColor;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
        discard;
    }

    // Sharp bright core (white-hot center)
    float core = smoothstep(0.18, 0.0, dist);

    // Soft halo with moderate falloff
    float halo = exp(-dist * dist * 18.0);

    // Anti-aliased edge
    float edge = smoothstep(0.5, 0.4, dist);

    // Combine: core dominates center, halo provides glow
    float intensity = max(core, halo * 0.6) * edge;

    // Core shifts toward white, halo carries the star color
    vec3 litRgb = mix(vColor.rgb, vec3(1.0), core * 0.6);
    float alpha = vColor.a * intensity;

    // Output premultiplied alpha
    gl_FragColor = vec4(litRgb * alpha, alpha);
}
