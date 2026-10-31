import { gsap } from "gsap";

const vertex = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTony,uIron,uDoom,uFlow;
uniform vec2 uCover,uPointer;
uniform float uTime,uIronMix,uDoomMix;
float noise(vec2 p){return sin(p.x*19.+sin(p.y*13.))*sin(p.y*17.+sin(p.x*11.));}
void main(){
 vec2 uv=(vUv-vec2(.5,0.))*uCover/.9+vec2(.5,0.);
 vec2 face=(uv-vec2(.5,.61))/vec2(.19,.36);
 float depth=exp(-dot(face,face)*1.4);
 vec2 shift=(uPointer-.5)*.006;
 uv+=shift*(1.-length(vUv-.5))+(uPointer-.5)*depth*.016;
 vec2 flowUv=vUv+vec2(noise(vUv*3.+uTime*.12),noise(vUv.yx*3.-uTime*.1))*.016;
 float flow=texture2D(uFlow,flowUv).r;
 float reveal=smoothstep(.19,.53,flow+noise(vUv*8.)*.075);
 float iron=max(reveal,uIronMix);
 vec2 warp=vec2(noise(uv*6.+uTime*.15),noise(uv.yx*5.))*flow*(1.-reveal)*.012;
 vec4 man=texture2D(uTony,uv+warp);
 vec4 machine=texture2D(uIron,uv-warp);
 vec4 shadow=texture2D(uDoom,uv);
 gl_FragColor=mix(mix(man,machine,iron),shadow,uDoomMix);
}`;

export class Portrait {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas;
    this.host = canvas.parentElement;
    this.reduced = reduced;
    this.state = { iron: 0, doom: 0 };
    this.pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false };
    this.active = true;
    this.visible = !document.hidden;
    this.sources = [
      "/images/tony.webp",
      "/images/iron.webp",
      "/images/doom.webp",
    ];
    this.dirtyUntil = performance.now() + 2500;
    this.gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    this.ready = this.init().catch((error) => {
      console.warn(
        "Portrait renderer unavailable; using image fallback.",
        error,
      );
      this.gl = null;
      this.host.querySelector(".hero-fallback").src =
        this.sources[this.selected || 0];
      canvas.style.display = "none";
    });
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.active = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    this.observer.observe(this.host);
    document.addEventListener("visibilitychange", () => {
      this.visible = !document.hidden;
    });
    this.host.addEventListener("pointermove", (e) => this.move(e));
    this.host.addEventListener("pointerleave", () => {
      this.pointer.moved = false;
    });
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      canvas.style.opacity = "0";
      this.gl = null;
      this.host.querySelector(".hero-fallback").src =
        this.sources[this.selected || 0];
    });
  }

  async init() {
    const gl = this.gl;
    if (!gl) return;
    const shader = (type, source) => {
      const result = gl.createShader(type);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(result));
      return result;
    };
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    this.uniform = Object.fromEntries(
      [
        "uTony",
        "uIron",
        "uDoom",
        "uFlow",
        "uCover",
        "uPointer",
        "uTime",
        "uIronMix",
        "uDoomMix",
      ].map((name) => [name, gl.getUniformLocation(program, name)]),
    );
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const images = await Promise.all(
      this.sources.map(
        (src) =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Cannot load ${src}`));
            image.src = src;
          }),
      ),
    );
    this.aspect = images[0].width / images[0].height;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    images.forEach((image, index) => {
      this.texture(image, index);
      gl.uniform1i(this.uniform[["uTony", "uIron", "uDoom"][index]], index);
    });
    this.flow = document.createElement("canvas");
    this.flow.width = 384;
    this.flow.height = 216;
    this.ctx = this.flow.getContext("2d", { alpha: false });
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, 384, 216);
    this.flowTexture = this.texture(this.flow, 3);
    gl.uniform1i(this.uniform.uFlow, 3);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);
    this.resize();
    this.canvas.classList.add("is-ready");
    this.last = performance.now();
    this.render(this.last);
  }

  texture(image, index) {
    const gl = this.gl,
      texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

  resize() {
    if (!this.gl) return;
    this.dirtyUntil = performance.now() + 1500;
    // Use layout dimensions: the parent shrinks on scroll and must not resize the drawing buffer every frame.
    const width = this.canvas.clientWidth,
      height = this.canvas.clientHeight,
      dpr = Math.min(devicePixelRatio, 1.75);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    const ratio = width / height;
    this.gl.uniform2f(
      this.uniform.uCover,
      Math.min(1, ratio / this.aspect),
      Math.min(1, this.aspect / ratio),
    );
  }

  move(event) {
    if (this.reduced || event.pointerType === "touch") return;
    const rect = this.host.getBoundingClientRect();
    this.pointer.px = this.pointer.x;
    this.pointer.py = this.pointer.y;
    this.pointer.x = (event.clientX - rect.left) / rect.width;
    this.pointer.y = (event.clientY - rect.top) / rect.height;
    this.pointer.moved = true;
    this.dirtyUntil = performance.now() + 1800;
  }

  setPersona(index, immediate = false) {
    this.selected = index;
    this.dirtyUntil = performance.now() + 1800;
    gsap.to(this.state, {
      iron: index === 1 ? 1 : 0,
      doom: index === 2 ? 1 : 0,
      duration: immediate || this.reduced ? 0 : 0.85,
      ease: "power3.inOut",
      overwrite: true,
    });
    if (this.ctx) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, 384, 216);
    }
    if (!this.gl) {
      const image = this.host.querySelector(".hero-fallback");
      gsap.to(image, {
        opacity: 0,
        duration: immediate || this.reduced ? 0 : 0.2,
        overwrite: true,
        onComplete: () => {
          image.src = this.sources[index];
          gsap.to(image, {
            opacity: 1,
            duration: immediate || this.reduced ? 0 : 0.4,
            overwrite: true,
          });
        },
      });
    }
  }

  render(time) {
    requestAnimationFrame((t) => this.render(t));
    const gl = this.gl;
    if (!gl || !this.ctx || !this.active || !this.visible) {
      this.last = time;
      return;
    }
    if (time > this.dirtyUntil) {
      this.last = time;
      return;
    }
    const dt = Math.min((time - this.last) / 1000, 0.05);
    this.last = time;
    const { ctx, flow, pointer: p } = this;
    ctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt * 3.5)})`;
    ctx.fillRect(0, 0, flow.width, flow.height);
    if (p.moved && !this.reduced && !this.selected) {
      const x = p.x * flow.width,
        y = p.y * flow.height,
        r = flow.height * 0.26;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.45, "rgba(255,255,255,.98)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      p.moved = false;
    }
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, flow);
    gl.uniform2f(this.uniform.uPointer, p.x, 1 - p.y);
    gl.uniform1f(this.uniform.uTime, time * 0.001);
    gl.uniform1f(this.uniform.uIronMix, this.state.iron);
    gl.uniform1f(this.uniform.uDoomMix, this.state.doom);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
