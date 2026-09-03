import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import "./SpecularButton.css";

type SpecularButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
};

const PAD = 20;
const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uCenter; uniform vec2 uHalfSize; uniform float uRadius; uniform float uAngle; uniform float uPx;
uniform vec3 uLineColor; uniform vec3 uBaseColor; uniform float uIntensity; uniform float uShineSize; uniform float uShineFade; uniform float uThickness; uniform float uBaseWidth;
out vec4 fragColor;
float sdRoundedRect(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float gaussianLine(float d, float sigma) { float x = d / (sigma + 1e-6); return exp(-mix(1.0, 1.6, smoothstep(0.0, 1.5, x)) * x * x); }
void main() {
  vec2 p = gl_FragCoord.xy - uCenter; float d = sdRoundedRect(p, uHalfSize, uRadius); vec2 L = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6); float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness); float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d)); float hi = line * rim * edgeClamp * uIntensity;
  vec3 col = uBaseColor * base + uLineColor * hi; float a = clamp(base + hi, 0.0, 1.0); fragColor = vec4(col, a);
}`;

export default function SpecularButton({
  children, size = "lg", radius = 14, tint = "#10b981", tintOpacity = 1, blur = 0,
  textColor = "#052e24", lineColor = "#d1fae5", baseColor = "#047857", intensity = 1.25,
  shineSize = 10, shineFade = 40, thickness = 1, speed = 0.35, followMouse = true,
  proximity = 250, autoAnimate = false, className = "", style, ...buttonProps
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fxRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef({ radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate });
  propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() => {
    const button = buttonRef.current;
    const fx = fxRef.current;
    if (!button || !fx) return;

    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: {
      uCenter: { value: [0, 0] }, uHalfSize: { value: [1, 1] }, uRadius: { value: 0 }, uAngle: { value: 2.4 }, uPx: { value: dpr },
      uLineColor: { value: [1, 1, 1] }, uBaseColor: { value: [0.02, 0.47, 0.34] }, uIntensity: { value: 1 },
      uShineSize: { value: 0.17 }, uShineFade: { value: 0.7 }, uThickness: { value: 1 }, uBaseWidth: { value: dpr },
    }});
    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);
    const size = { width: 1, height: 1 };
    const resize = () => {
      const rect = button.getBoundingClientRect();
      size.width = rect.width; size.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
    };
    const observer = new ResizeObserver(resize);
    observer.observe(button); resize();
    let pointerAngle: number | null = null, proximityValue = 0, angle = 2.4, idleAngle = 2.4, brightness = 0, last = performance.now(), frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right), dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom), distance = Math.hypot(dx, dy);
      pointerAngle = distance === 0 ? Math.atan2(2 / rect.height, -2 / rect.width) : Math.atan2(cy - event.clientY, event.clientX - cx);
      const t = Math.max(0, 1 - distance / Math.max(propsRef.current.proximity, 1)); proximityValue = t * t * (3 - 2 * t);
    };
    window.addEventListener("pointermove", onPointerMove);
    const line = new Color(), base = new Color();
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - last) / 1000, 0.05); last = now; const current = propsRef.current;
      idleAngle += current.speed * delta;
      const target = current.followMouse && pointerAngle !== null && (!current.autoAnimate || proximityValue > 0) ? pointerAngle : idleAngle;
      angle += (((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * (1 - Math.exp(-delta * 7));
      brightness += ((current.autoAnimate ? 1 : proximityValue) - brightness) * (1 - Math.exp(-delta * 8));
      line.set(current.lineColor); base.set(current.baseColor);
      program.uniforms.uAngle.value = angle; program.uniforms.uRadius.value = Math.min(current.radius, Math.min(size.width, size.height) / 2) * dpr;
      program.uniforms.uLineColor.value = [line.r, line.g, line.b]; program.uniforms.uBaseColor.value = [base.r, base.g, base.b];
      program.uniforms.uIntensity.value = current.intensity * brightness; program.uniforms.uShineSize.value = current.shineSize * Math.PI / 180;
      program.uniforms.uShineFade.value = current.shineFade * Math.PI / 180; program.uniforms.uThickness.value = current.thickness * dpr; renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("pointermove", onPointerMove); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);

  const variables = { ...style, "--sb-radius": `${radius}px`, "--sb-tint": tint, "--sb-tint-opacity": tintOpacity, "--sb-blur": `${blur}px`, "--sb-text-color": textColor } as CSSProperties;
  return <button ref={buttonRef} className={`specular-button specular-button--${size} ${className}`} style={variables} {...buttonProps}><span ref={fxRef} className="specular-button__fx" aria-hidden="true" /><span className="specular-button__label">{children}</span></button>;
}
