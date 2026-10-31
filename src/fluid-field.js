// Compact velocity-advection / pressure projection field. The pass structure is
// informed by the reference runtime's fluid cursor; portrait compositing stays local.
const vertex=`attribute vec2 aPosition; varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const common=`precision highp float; varying vec2 vUv; uniform sampler2D uSource,uPressure;uniform vec2 uTexel,uPoint,uForce;uniform float uDt,uRadius,uAspect;`;
export class FluidField {
  static create(gl,width,height){
    if(!gl.getExtension('OES_texture_float') || !gl.getExtension('OES_texture_float_linear'))return null;
    gl.getExtension('WEBGL_color_buffer_float');
    try{return new FluidField(gl,width,height);}catch(error){console.info('Using portable liquid field fallback.',error.message);return null;}
  }
  constructor(gl,width,height){
    this.gl=gl;this.width=width;this.height=height;
    this.targets=[];this.programs=[];
    this.velocity=[this.target(),this.target()];this.pressure=[this.target(),this.target()];this.divergence=this.target();
    this.advection=this.program(`void main(){vec2 v=texture2D(uSource,vUv).xy;vec2 back=vUv-v*uDt*vec2(1./uAspect,1.);vec2 next=texture2D(uSource,back).xy;gl_FragColor=vec4(next*exp(-uDt*3.6),0.,1.);}`);
    this.force=this.program(`void main(){vec2 delta=(vUv-uPoint)*vec2(uAspect,1.);float d=length(delta)/uRadius;float falloff=pow(max(0.,1.-d),2.);vec2 v=texture2D(uSource,vUv).xy;gl_FragColor=vec4(clamp(v+uForce*falloff,vec2(-4.),vec2(4.)),0.,1.);}`);
    this.div=this.program(`void main(){float l=texture2D(uSource,vUv-vec2(uTexel.x,0.)).x;float r=texture2D(uSource,vUv+vec2(uTexel.x,0.)).x;float b=texture2D(uSource,vUv-vec2(0.,uTexel.y)).y;float t=texture2D(uSource,vUv+vec2(0.,uTexel.y)).y;gl_FragColor=vec4((r-l+t-b)*.5,0.,0.,1.);}`);
    this.poisson=this.program(`void main(){float l=texture2D(uPressure,vUv-vec2(uTexel.x,0.)).r;float r=texture2D(uPressure,vUv+vec2(uTexel.x,0.)).r;float b=texture2D(uPressure,vUv-vec2(0.,uTexel.y)).r;float t=texture2D(uPressure,vUv+vec2(0.,uTexel.y)).r;float div=texture2D(uSource,vUv).r;gl_FragColor=vec4((l+r+b+t-div)/4.5,0.,0.,1.);}`);
    this.project=this.program(`void main(){float l=texture2D(uPressure,vUv-vec2(uTexel.x,0.)).r;float r=texture2D(uPressure,vUv+vec2(uTexel.x,0.)).r;float b=texture2D(uPressure,vUv-vec2(0.,uTexel.y)).r;float t=texture2D(uPressure,vUv+vec2(0.,uTexel.y)).r;vec2 v=texture2D(uSource,vUv).xy-vec2(r-l,t-b)*.5;float bounds=smoothstep(0.,.015,vUv.x)*smoothstep(0.,.015,vUv.y)*smoothstep(0.,.015,1.-vUv.x)*smoothstep(0.,.015,1.-vUv.y);gl_FragColor=vec4(v*bounds,0.,1.);}`);
  }
  target(){
    const gl=this.gl,t=gl.createTexture(),f=gl.createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.width,this.height,0,gl.RGBA,gl.FLOAT,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
    this.targets.push({texture:t,fbo:f});
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE){this.dispose();throw new Error('Float framebuffer unsupported');}
    gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return this.targets.at(-1);
  }
  program(body){
    const gl=this.gl,p=gl.createProgram();
    for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,common+body]]){
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(p,shader);gl.deleteShader(shader);
    }
    gl.bindAttribLocation(p,0,'aPosition');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    this.programs.push(p);return {program:p,uniform:Object.fromEntries(['uSource','uPressure','uTexel','uPoint','uForce','uDt','uRadius','uAspect'].map(k=>[k,gl.getUniformLocation(p,k)]))};
  }
  pass(shader,target,source,pressure,dt,input){
    const gl=this.gl,u=shader.uniform;gl.useProgram(shader.program);gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);gl.viewport(0,0,this.width,this.height);
    gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,source.texture);gl.uniform1i(u.uSource,4);
    gl.activeTexture(gl.TEXTURE5);gl.bindTexture(gl.TEXTURE_2D,(pressure||source).texture);gl.uniform1i(u.uPressure,5);
    gl.uniform2f(u.uTexel,1/this.width,1/this.height);gl.uniform1f(u.uDt,dt);gl.uniform1f(u.uAspect,this.aspect||this.width/this.height);
    if(input){gl.uniform2f(u.uPoint,input.x,1-input.y);gl.uniform2f(u.uForce,input.vx,-input.vy);gl.uniform1f(u.uRadius,input.radius);}
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  update(dt,input){
    this.pass(this.advection,this.velocity[1],this.velocity[0],null,dt);
    this.pass(this.force,this.velocity[0],this.velocity[1],null,dt,input||{x:-2,y:-2,vx:0,vy:0,radius:.1});
    this.pass(this.div,this.divergence,this.velocity[0],null,dt);
    for(const target of this.pressure){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,target.fbo);this.gl.clear(this.gl.COLOR_BUFFER_BIT);}
    for(let i=0;i<4;i++)this.pass(this.poisson,this.pressure[(i+1)%2],this.divergence,this.pressure[i%2],dt);
    this.pass(this.project,this.velocity[1],this.velocity[0],this.pressure[0],dt);
    this.velocity.reverse();this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null);return this.velocity[0].texture;
  }
  clear(){const gl=this.gl;for(const t of this.targets){gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.clear(gl.COLOR_BUFFER_BIT);}gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
  dispose(){const gl=this.gl;for(const t of this.targets){gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.fbo);}for(const p of this.programs)gl.deleteProgram(p);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
}
