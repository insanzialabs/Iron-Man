import { gsap } from "gsap";
import { sampleIdleMotion, IDLE_DELAY_MS } from "./idle-motion.js";
import { FluidField } from "./fluid-field.js";
import { createPortraitTexture } from "./portrait-matte.js";
import { simplex } from "./simplex.js";

const vertex = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTony,uIron,uDoom,uFlow;
uniform vec2 uCover,uPointer,uTexel,uResolution;
uniform vec3 uBase,uPreview;
uniform float uTime,uAutonomy,uFluid,uPixelRatio;
${simplex}
float fieldAt(vec2 uv){vec4 f=texture2D(uFlow,uv);return mix(f.r,1.-exp(-length(f.xy)*1.5),uFluid);}
void main(){
 vec2 uv=(vUv-vec2(.5,0.))*uCover/.9+vec2(.5,0.);
 vec2 face=(uv-vec2(.5,.61))/vec2(.19,.36);
 float depth=exp(-dot(face,face)*1.4);
 uv+=(uPointer-.5)*(.004+depth*.012);
 uv+=vec2(sin(uTime*.55),cos(uTime*.43))*.0012*uAutonomy;
 float field=fieldAt(vUv);
 // A narrow isosurface joins the advected droplets into continuous liquid.
 // There is no noise cloud or broad transparent crossfade at the boundary.
 float aa=AA_WIDTH(field);
 float mask=smoothstep(.4-aa,.4+aa,field);
 vec2 gradient=vec2(fieldAt(vUv+vec2(uTexel.x,0.))-fieldAt(vUv-vec2(uTexel.x,0.)),
 fieldAt(vUv+vec2(0.,uTexel.y))-fieldAt(vUv-vec2(0.,uTexel.y)));
 float rim=smoothstep(.28,.395,field)*(1.-smoothstep(.415,.53,field));
 vec2 refraction=gradient*rim*.045;
 vec4 t=texture2D(uTony,uv+refraction);
 vec4 i=texture2D(uIron,uv+refraction);
 vec4 d=texture2D(uDoom,uv+refraction);
 // Match the reference's slowly evolving simplex contours on near-white ground.
 vec2 groundUv=vUv*vec2(uResolution.x/uResolution.y,1.);
 float distortion=.5+.5*snoise(vec3(groundUv,uTime*.01));
 float bands=(.5+.5*snoise(vec3(groundUv+distortion*.5,uTime*.1)))*3.;
 float contour=fract(bands);
 // Differentiate the continuous field, before fract: wrapped derivatives caused
 // vanishing strokes and spurious smudges. Keep the stroke readable at every DPR.
 float contourPixel=AA_WIDTH(bands)*uPixelRatio;
 float line=1.-smoothstep(contourPixel*.35,contourPixel*1.15,abs(contour-.5));
 vec3 paper=vec3(.98431,.98431,.97647);
 vec3 background=mix(paper,vec3(.79608,.79608,.72549),line*.46);
 float echo=fieldAt(vUv+vec2(.04,-.012));
 float ribbon=smoothstep(.07,.11,echo);
 vec3 wake=mix(vec3(.91,.91,.875),vec3(.82,.83,.78),step(.5,contour));
 background=mix(background,wake,ribbon*.65);
 vec4 baseTexture=t*uBase.x+i*uBase.y+d*uBase.z;
 vec4 nextTexture=t*uPreview.x+i*uPreview.y+d*uPreview.z;
 vec3 base=mix(background,baseTexture.rgb,baseTexture.a);
 vec3 next=mix(background,nextTexture.rgb,nextTexture.a);
 vec4 color=vec4(mix(base,next,mask),1.);
 gl_FragColor=color;
}`;

export class Portrait {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas;
    this.host = canvas.parentElement;
    this.reduced = reduced;
    this.state = { tony: 1, iron: 0, doom: 0 };
    this.selected = 0;
    this.idleEnabled = !reduced;
    this.idleTime = 0;
    this.idlePrevious = null;
    this.lastInput = performance.now();
    this.suspensions = new Set(["loading"]);
    this.renderedAt = 0;
    this.visualTime=0;
    this.drops = [];
    this.pressed = false;
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
      antialias: true,
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
        if (entry.isIntersecting && !this.active) this.settle();
        this.active = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    this.observer.observe(this.host);
    document.addEventListener("visibilitychange", () => {
      this.visible = !document.hidden;
      if (this.visible) this.settle();
    });
    this.host.addEventListener("pointermove", (e) => this.move(e));
    this.host.addEventListener("pointerleave", () => {
      this.pointer.moved = false;
      this.pointer.inside = false;
      this.pressed = false;
    });
    this.host.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      this.pressed = true;
      this.move(event);
    });
    window.addEventListener("pointerup", () => {
      this.pressed = false;
    });
    window.addEventListener("pointercancel", () => {
      this.pressed = false;
      this.pointer.inside = false;
    });
    window.addEventListener("blur", () => {
      this.pressed = false;
      this.pointer.moved = false;
      this.pointer.inside = false;
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
    const derivatives=gl.getExtension('OES_standard_derivatives');
    const prefix=derivatives?'#extension GL_OES_standard_derivatives : enable\n#define AA_WIDTH(v) max(fwidth(v),.0015)\n':'#define AA_WIDTH(v) .006\n';
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, prefix+fragment));
    gl.bindAttribLocation(program,0,"aPosition");
    gl.linkProgram(program);
    this.program=program;
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
        "uAutonomy",
        "uFluid",
        "uPixelRatio",
        "uResolution",
        "uBase",
        "uPreview",
        "uTexel",
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
      this.texture(createPortraitTexture(image), index);
      gl.uniform1i(this.uniform[["uTony", "uIron", "uDoom"][index]], index);
    });
    this.flow = document.createElement("canvas");
    this.flow.width = 768;
    this.flow.height = 432;
    this.ctx = this.flow.getContext("2d", { alpha: false });
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.flow.width, this.flow.height);
    this.flowTexture = this.texture(this.flow, 3);
    gl.uniform1i(this.uniform.uFlow, 3);
    gl.uniform2f(
      this.uniform.uTexel,
      1 / this.flow.width,
      1 / this.flow.height,
    );
    this.fluid=FluidField.create(gl,256,Math.max(96,Math.round(256*this.canvas.clientHeight/this.canvas.clientWidth)));
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,this.flowTexture);
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
    this.gl.useProgram(this.program);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.uniform.uResolution,this.canvas.width,this.canvas.height);
    this.gl.uniform1f(this.uniform.uPixelRatio,dpr);
    if(this.fluid)this.fluid.aspect=width/height;
    const ratio = width / height;
    this.gl.uniform2f(
      this.uniform.uCover,
      Math.min(1, ratio / this.aspect),
      Math.min(1, this.aspect / ratio),
    );
  }

  move(event) {
    if (this.reduced) return;
    const rect = this.host.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    this.lastInput = performance.now();
    this.idleTime = 0;
    this.idlePrevious = null;
    const p = this.pointer;
    p.px = p.x;
    p.py = p.y;
    p.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    p.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    if (!p.inside) {
      p.px = p.x;
      p.py = p.y;
    }
    p.inside = true;
    p.moved = true;
    this.dirtyUntil = performance.now() + 2400;
  }

  settle() {
    this.drops.length = 0;
    this.fluid?.clear();
    this.idlePrevious = null;
    this.pointer.moved = false;
    this.pointer.inside = false;
    this.pressed = false;
    this.dirtyUntil = performance.now() + 1000;
  }

  setSuspended(reason, value) {
    if (value) this.suspensions.add(reason);
    else this.suspensions.delete(reason);
    this.settle();
    this.idleTime = 0;
    this.idlePrevious = null;
    this.lastInput = performance.now();
  }

  setIdleEnabled(enabled) {
    this.idleEnabled = Boolean(enabled) && !this.reduced;
    this.idleTime = 0;
    this.idlePrevious = null;
    this.settle();
  }

  setPersona(index, immediate = false) {
    if (index < 0 || index > 2) return;
    this.selected = index;
    this.fluid?.clear();
    this.lastInput = performance.now();
    this.idleTime = 0;
    this.idlePrevious = null;
    this.drops.length = 0;
    this.pointer.moved = false;
    this.transitionUntil =
      performance.now() + (immediate || this.reduced ? 0 : 850);
    this.dirtyUntil = performance.now() + 2400;
    gsap.to(this.state, {
      tony: index === 0 ? 1 : 0,
      iron: index === 1 ? 1 : 0,
      doom: index === 2 ? 1 : 0,
      duration: immediate || this.reduced ? 0 : 0.85,
      ease: "power3.inOut",
      overwrite: true,
    });
    if (this.ctx) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.flow.width, this.flow.height);
    }
    if (!this.gl) {
      const image = this.host.querySelector(".hero-fallback");
      gsap.to(image, {
        opacity: 0,
        duration: this.reduced ? 0 : 0.2,
        overwrite: true,
        onComplete: () => {
          image.src = this.sources[index];
          gsap.to(image, {
            opacity: 1,
            duration: this.reduced ? 0 : 0.4,
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
    // Offscreen/overlay/reduced-motion states never run an automatic paint loop.
    const eligible =
      this.idleEnabled &&
      !this.reduced &&
      !this.pressed &&
      !this.pointer.moved &&
      this.suspensions.size === 0 &&
      time - this.lastInput > IDLE_DELAY_MS;
    const interval = 1000 / 60;
    if (time - this.renderedAt < interval - 1) return;
    this.renderedAt = time;
    const dt = Math.min((time - this.last) / 1000, 0.05);
    this.last = time;
    const { ctx, flow, pointer: p } = this;
    const w = flow.width,
      h = flow.height;
    let auto = null;
    let fluidInput=null;
    if (eligible) {
      this.idleTime += dt;
      auto = sampleIdleMotion(this.idleTime);
    }
    if (time > this.dirtyUntil && !this.pressed && !eligible) return;
    if (auto) {
      const previous = this.idlePrevious || auto;
      fluidInput={x:auto.x,y:auto.y,vx:(auto.x-previous.x)*48,vy:(auto.y-previous.y)*48,radius:auto.radius};
      if(!this.fluid)this.drops.push({
        x: auto.x * w,
        y: auto.y * h,
        vx: (((auto.x - previous.x) * w) / Math.max(dt, 0.01)) * 0.22,
        vy: (((auto.y - previous.y) * h) / Math.max(dt, 0.01)) * 0.22,
        age: 0,
        life: 0.65,
        r: h * auto.radius,
      });
      this.idlePrevious = auto;
      this.dirtyUntil = time + 1200;
    } else this.idlePrevious = null;
    // Native float-texture advection carries the liquid wake. Portable devices
    // without renderable float textures use the same input path with merged droplets.
    if (
      (p.moved || this.pressed) &&
      !this.reduced &&
      time > (this.transitionUntil || 0)
    ) {
      const vx = (p.x - p.px) * w,
        vy = (p.y - p.py) * h;
      fluidInput={x:p.x,y:p.y,vx:(p.x-p.px)*48,vy:(p.y-p.py)*48,radius:this.pressed?.34:.21};
      if(this.pressed && Math.hypot(fluidInput.vx,fluidInput.vy)<.01){fluidInput.vx=.35*Math.sin(time*.008);fluidInput.vy=.35*Math.cos(time*.008);}
      const steps = Math.min(
        10,
        Math.max(1, Math.ceil(Math.hypot(vx, vy) / 10)),
      );
      for (let n = 1; n <= steps; n++) {
        const f = n / steps;
        if(!this.fluid)this.drops.push({
          x: (p.px + (p.x - p.px) * f) * w,
          y: (p.py + (p.y - p.py) * f) * h,
          vx: vx * 1.8,
          vy: vy * 1.8,
          age: 0,
          life: this.pressed ? 1.05 : 0.78,
          r: h * (this.pressed ? 0.38 : 0.24),
        });
      }
      if (this.drops.length > 72) this.drops.splice(0, this.drops.length - 72);
      p.px = p.x;
      p.py = p.y;
      p.moved = false;
      this.dirtyUntil = time + 2400;
    }
    if(!this.fluid){
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    this.drops = this.drops.filter((drop) => drop.age < drop.life);
    for (const drop of this.drops) {
      drop.age += dt;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.vx *= Math.exp(-dt * 7);
      drop.vy *= Math.exp(-dt * 7);
      const remaining = Math.max(0, 1 - drop.age / drop.life);
      const radius = drop.r * Math.pow(remaining, 0.65);
      if (radius < 1) continue;
      const velocity = Math.hypot(drop.vx, drop.vy);
      ctx.save();
      ctx.translate(drop.x, drop.y);
      ctx.rotate(Math.atan2(drop.vy, drop.vx));
      ctx.scale(1 + Math.min(velocity / 450, 0.65), 1);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, "rgba(255,255,255,.55)");
      gradient.addColorStop(0.45, "rgba(255,255,255,.3)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, flow);
    }
    if(this.fluid){
      const field=this.fluid.update(dt,fluidInput);
      gl.useProgram(this.program);gl.viewport(0,0,this.canvas.width,this.canvas.height);
      gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,field);
      gl.uniform2f(this.uniform.uTexel,1/this.fluid.width,1/this.fluid.height);
    }
    gl.uniform1f(this.uniform.uFluid,this.fluid?1:0);
    gl.uniform2f(this.uniform.uPointer, p.x, 1 - p.y);
    if(this.idleEnabled && !this.reduced && !this.suspensions.size)this.visualTime+=dt;
    gl.uniform1f(this.uniform.uTime, this.visualTime);
    gl.uniform1f(this.uniform.uAutonomy, eligible ? 1 : 0);
    const { tony, iron, doom } = this.state;
    gl.uniform3f(this.uniform.uBase, tony, iron, doom);
    gl.uniform3f(this.uniform.uPreview, doom, tony, iron);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
