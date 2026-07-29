"use client";

import { useEffect, useRef } from "react";

type Dot = {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
};

const DOT_PARAMS = {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  bulgeStrength: 67,
  glowRadius: 160,
  gradientFrom: "rgba(56, 189, 248, 0.42)",
  gradientTo: "rgba(37, 99, 235, 0.28)",
} as const;

const BAND_PARAMS = {
  color: [37 / 255, 99 / 255, 235 / 255] as const,
  speed: 0.2,
  frequency: 1,
  noise: 0.15,
  bandWidth: 0.14,
  rotation: 90,
  fadeTop: 0.75,
  iterations: 1,
  intensity: 1.25,
  scale: 1,
  warpStrength: 1,
  yOffset: 0.3,
  mouseInfluence: 0.3,
} as const;

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform vec3 uColor;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform float uNoise;
uniform float uBandWidth;
uniform float uYOffset;
uniform float uFadeTop;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform int uIterations;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;
  uv.y += uYOffset;
  vec2 p = uv * 2.0 - 1.0;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  float aspect = uCanvas.x / uCanvas.y;
  vec2 q = vec2(rp.x * aspect, rp.y);
  float invScale = 1.0 / max(uScale, 0.0001);
  q *= invScale;
  q /= 0.5 + 0.2 * dot(q, q);
  q += (uPointer - rp) * uMouseInfluence * 0.2;
  q += 0.2 * cos(t) - 7.56;

  for (int i = 0; i < 5; i++) {
    if (i >= uIterations) break;
    vec2 r = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q = q + (r - q) * uWarpStrength;
  }

  float m = length(q + sin(5.0 * q.y * uFrequency - 3.0 * t) * 0.25);
  float w = 1.0 - exp(-6.0 / exp(6.0 * m));
  w = pow(clamp(w, 0.0, 1.0), uBandWidth);
  w *= smoothstep(uFadeTop, 0.0, vUv.y);
  w *= uIntensity;

  vec3 col = uColor * w;
  col += (fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0) * w;
  gl_FragColor = vec4(col, w);
}`;

class DotField {
  private readonly context: CanvasRenderingContext2D;
  private readonly reducedMotion: boolean;
  private readonly canvas: HTMLCanvasElement;
  private readonly glow: SVGCircleElement;
  private readonly root: HTMLElement;
  private dots: Dot[] = [];
  private size = { width: 1, height: 1 };
  private pointer = { x: -9999, y: -9999, previousX: -9999, previousY: -9999, speed: 0 };
  private engagement = 0;
  private glowOpacity = 0;
  private raf = 0;
  private speedTimer = 0;
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, glow: SVGCircleElement, root: HTMLElement, reducedMotion: boolean) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas2D is unavailable");

    this.canvas = canvas;
    this.glow = glow;
    this.root = root;
    this.context = context;
    this.reducedMotion = reducedMotion;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(root);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    this.resize();

    if (reducedMotion) {
      this.draw();
    } else {
      this.speedTimer = window.setInterval(() => this.updatePointerSpeed(), 20);
      this.raf = requestAnimationFrame(this.draw);
    }
  }

  private resize = () => {
    const rect = this.root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = { width, height };
    this.glow.setAttribute("r", String(DOT_PARAMS.glowRadius));
    this.buildDots();
    if (this.reducedMotion) this.draw();
  };

  private buildDots() {
    const step = DOT_PARAMS.dotRadius + DOT_PARAMS.dotSpacing;
    const columns = Math.floor(this.size.width / step);
    const rows = Math.floor(this.size.height / step);
    const paddingX = (this.size.width % step) / 2;
    const paddingY = (this.size.height % step) / 2;
    const dots: Dot[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const ax = paddingX + column * step + step / 2;
        const ay = paddingY + row * step + step / 2;
        dots.push({ ax, ay, sx: ax, sy: ay });
      }
    }

    this.dots = dots;
  }

  private onPointerMove = (event: PointerEvent) => {
    const rect = this.root.getBoundingClientRect();
    this.pointer.x = event.clientX - rect.left;
    this.pointer.y = event.clientY - rect.top;
  };

  private updatePointerSpeed() {
    const dx = this.pointer.previousX - this.pointer.x;
    const dy = this.pointer.previousY - this.pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.pointer.speed += (distance - this.pointer.speed) * 0.5;
    if (this.pointer.speed < 0.001) this.pointer.speed = 0;
    this.pointer.previousX = this.pointer.x;
    this.pointer.previousY = this.pointer.y;
  }

  private draw = () => {
    const { context, size, pointer } = this;
    const targetEngagement = this.reducedMotion ? 0 : Math.min(pointer.speed / 5, 1);
    this.engagement += (targetEngagement - this.engagement) * 0.06;
    if (this.engagement < 0.001) this.engagement = 0;
    this.glowOpacity += (this.engagement - this.glowOpacity) * 0.08;
    this.glow.setAttribute("cx", String(pointer.x));
    this.glow.setAttribute("cy", String(pointer.y));
    this.glow.style.opacity = String(this.glowOpacity);

    context.clearRect(0, 0, size.width, size.height);
    const gradient = context.createLinearGradient(0, 0, size.width, size.height);
    gradient.addColorStop(0, DOT_PARAMS.gradientFrom);
    gradient.addColorStop(1, DOT_PARAMS.gradientTo);
    context.fillStyle = gradient;
    context.beginPath();

    const cursorRadiusSquared = DOT_PARAMS.cursorRadius * DOT_PARAMS.cursorRadius;
    const radius = DOT_PARAMS.dotRadius / 2;
    for (const dot of this.dots) {
      const dx = pointer.x - dot.ax;
      const dy = pointer.y - dot.ay;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < cursorRadiusSquared && this.engagement > 0.01) {
        const distance = Math.sqrt(distanceSquared);
        const falloff = 1 - distance / DOT_PARAMS.cursorRadius;
        const push = falloff * falloff * DOT_PARAMS.bulgeStrength * this.engagement;
        const angle = Math.atan2(dy, dx);
        dot.sx += (dot.ax - Math.cos(angle) * push - dot.sx) * 0.15;
        dot.sy += (dot.ay - Math.sin(angle) * push - dot.sy) * 0.15;
      } else {
        dot.sx += (dot.ax - dot.sx) * 0.1;
        dot.sy += (dot.ay - dot.sy) * 0.1;
      }

      context.moveTo(dot.sx + radius, dot.sy);
      context.arc(dot.sx, dot.sy, radius, 0, Math.PI * 2);
    }

    context.fill();
    if (!this.reducedMotion) this.raf = requestAnimationFrame(this.draw);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.speedTimer);
    this.resizeObserver.disconnect();
    window.removeEventListener("pointermove", this.onPointerMove);
  }
}

class HeroBand {
  private readonly canvas: HTMLCanvasElement;
  private readonly root: HTMLElement;
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly positionLocation: number;
  private readonly uniforms: Record<string, WebGLUniformLocation | null>;
  private readonly reducedMotion: boolean;
  private readonly resizeObserver: ResizeObserver;
  private pointerTarget = [0, 0];
  private pointerCurrent = [0, 0];
  private rect = new DOMRect(0, 0, 1, 1);
  private startedAt = performance.now();
  private previousTime = this.startedAt;
  private raf = 0;

  constructor(canvas: HTMLCanvasElement, root: HTMLElement, reducedMotion: boolean) {
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL is unavailable");

    this.canvas = canvas;
    this.root = root;
    this.gl = gl;
    this.reducedMotion = reducedMotion;
    this.program = this.createProgram(VERTEX_SHADER, FRAGMENT_SHADER);
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("WebGL buffer creation failed");
    this.buffer = buffer;
    this.positionLocation = gl.getAttribLocation(this.program, "aPosition");
    const uniformNames = [
      "uCanvas", "uTime", "uSpeed", "uRot", "uColor", "uScale", "uFrequency", "uWarpStrength",
      "uNoise", "uBandWidth", "uYOffset", "uFadeTop", "uPointer", "uMouseInfluence", "uIterations", "uIntensity",
    ];
    this.uniforms = Object.fromEntries(uniformNames.map((name) => [name, gl.getUniformLocation(this.program, name)]));
    canvas.dataset.glVersion = gl.getParameter(gl.VERSION) as string;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(root);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    this.resize();
    if (reducedMotion) this.render(performance.now());
    else this.raf = requestAnimationFrame(this.render);
  }

  private compile(type: number, source: string) {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error("WebGL shader creation failed");
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader) || "WebGL shader compilation failed");
    }
    return shader;
  }

  private createProgram(vertexSource: string, fragmentSource: string) {
    const program = this.gl.createProgram();
    if (!program) throw new Error("WebGL program creation failed");
    this.gl.attachShader(program, this.compile(this.gl.VERTEX_SHADER, vertexSource));
    this.gl.attachShader(program, this.compile(this.gl.FRAGMENT_SHADER, fragmentSource));
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(program) || "WebGL program linking failed");
    }
    return program;
  }

  private resize = () => {
    const rect = this.root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.rect = rect;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (this.reducedMotion) this.render(performance.now());
  };

  private onPointerMove = (event: PointerEvent) => {
    this.pointerTarget[0] = ((event.clientX - this.rect.left) / this.rect.width) * 2 - 1;
    this.pointerTarget[1] = -(((event.clientY - this.rect.top) / this.rect.height) * 2 - 1);
  };

  private render = (now: number) => {
    const deltaSeconds = Math.max(0, (now - this.previousTime) / 1000);
    const elapsedSeconds = this.reducedMotion ? 0 : (now - this.startedAt) / 1000;
    this.previousTime = now;
    const pointerAmount = Math.min(1, deltaSeconds * 4);
    this.pointerCurrent[0] += (this.pointerTarget[0] - this.pointerCurrent[0]) * pointerAmount;
    this.pointerCurrent[1] += (this.pointerTarget[1] - this.pointerCurrent[1]) * pointerAmount;

    const gl = this.gl;
    const radians = BAND_PARAMS.rotation * Math.PI / 180;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.uniforms.uCanvas, this.rect.width, this.rect.height);
    gl.uniform1f(this.uniforms.uTime, elapsedSeconds);
    gl.uniform1f(this.uniforms.uSpeed, BAND_PARAMS.speed);
    gl.uniform2f(this.uniforms.uRot, Math.cos(radians), Math.sin(radians));
    gl.uniform3fv(this.uniforms.uColor, BAND_PARAMS.color);
    gl.uniform1f(this.uniforms.uScale, BAND_PARAMS.scale);
    gl.uniform1f(this.uniforms.uFrequency, BAND_PARAMS.frequency);
    gl.uniform1f(this.uniforms.uWarpStrength, BAND_PARAMS.warpStrength);
    gl.uniform1f(this.uniforms.uNoise, BAND_PARAMS.noise);
    gl.uniform1f(this.uniforms.uBandWidth, BAND_PARAMS.bandWidth);
    gl.uniform1f(this.uniforms.uYOffset, BAND_PARAMS.yOffset);
    gl.uniform1f(this.uniforms.uFadeTop, BAND_PARAMS.fadeTop);
    gl.uniform2fv(this.uniforms.uPointer, this.pointerCurrent);
    gl.uniform1f(this.uniforms.uMouseInfluence, BAND_PARAMS.mouseInfluence);
    gl.uniform1i(this.uniforms.uIterations, BAND_PARAMS.iterations);
    gl.uniform1f(this.uniforms.uIntensity, BAND_PARAMS.intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!this.reducedMotion) this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    window.removeEventListener("pointermove", this.onPointerMove);
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  }
}

export function HeroMotionBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotCanvasRef = useRef<HTMLCanvasElement>(null);
  const dotGlowRef = useRef<SVGCircleElement>(null);
  const bandRootRef = useRef<HTMLDivElement>(null);
  const bandCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dotCanvas = dotCanvasRef.current;
    const dotGlow = dotGlowRef.current;
    const bandRoot = bandRootRef.current;
    const bandCanvas = bandCanvasRef.current;
    if (!root || !dotCanvas || !dotGlow || !bandRoot || !bandCanvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dot: DotField | null = null;
    let band: HeroBand | null = null;

    try {
      dot = new DotField(dotCanvas, dotGlow, root, reducedMotion);
      band = new HeroBand(bandCanvas, bandRoot, reducedMotion);
      root.dataset.motionReady = "true";
      root.dataset.motionBackend = "canvas2d+webgl";
    } catch {
      root.dataset.motionReady = "false";
      root.classList.add("is-webgl-unavailable");
    }

    return () => {
      dot?.destroy();
      band?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="about-hero-motion-background" data-appdo-hero-motion aria-hidden="true">
      <div className="about-hero-dot-field">
        <canvas ref={dotCanvasRef} />
        <svg>
          <defs>
            <radialGradient id="appdo-hero-dot-glow">
              <stop offset="0%" style={{ stopColor: "var(--about-hero-glow-mask)" }} />
              <stop offset="100%" style={{ stopColor: "var(--about-hero-glow-mask)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle ref={dotGlowRef} cx="-9999" cy="-9999" r="160" fill="url(#appdo-hero-dot-glow)" opacity="0" />
        </svg>
      </div>
      <div ref={bandRootRef} className="about-hero-band"><canvas ref={bandCanvasRef} /></div>
      <div className="about-hero-bottom-fade" />
    </div>
  );
}
