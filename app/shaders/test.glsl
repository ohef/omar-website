uniform vec2 iResolution;
uniform float iTime;
uniform float transparency;
uniform vec3 color;

varying vec2 UV;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = UV;
    uv.x -= 0.5;
    uv.y -= 0.5;
    uv = abs(uv);
    uv *= 2.;
    float t = dot(uv, uv);

    vec3 finalColor = color;

    finalColor = vec3(1.,1.,1.);

    fragColor = vec4( color , 1. - t - transparency);
}

void main() {
    mainImage( gl_FragColor, gl_FragCoord.xy );
}