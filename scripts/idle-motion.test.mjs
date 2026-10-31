import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleIdleMotion, IDLE_DELAY_MS, IDLE_PERIOD } from '../src/idle-motion.js';
import { matteStudioPixels } from '../src/portrait-matte.js';

test('the downward burst crosses the portrait four times and reaches the torso',()=>{
  let crossings=0, previous=sampleIdleMotion(0);
  for(let frame=1;frame<=300;frame++){
    const point=sampleIdleMotion(frame/120);
    assert(point.x>=.125&&point.x<=.875);assert(point.y>=.2&&point.y<=.8);
    if((previous.x<.5&&point.x>=.5)||(previous.x>.5&&point.x<=.5))crossings++;
    assert(Math.hypot(point.x-previous.x,point.y-previous.y)<.045,'motion must remain continuous at 120Hz');
    assert(point.y>=previous.y-.00001,'first burst must move down the portrait');previous=point;
  }
  assert.equal(crossings,4);assert(previous.y>.78);assert(IDLE_DELAY_MS<1000);
});
test('the return burst reverses the same path with short clear intervals',()=>{
  assert.equal(sampleIdleMotion(2.7),null);assert.equal(sampleIdleMotion(5.8),null);
  for(let frame=0;frame<=200;frame++){
    const t=frame/200*2.5,a=sampleIdleMotion(t),b=sampleIdleMotion(5.35-t);
    assert(Math.abs(a.x-b.x)<.0001);assert(Math.abs(a.y-b.y)<.0001);
  }
  assert.deepEqual(sampleIdleMotion(0),sampleIdleMotion(IDLE_PERIOD));
});
test('runtime matting removes edge-connected pale ground and preserves isolated metal highlights',()=>{
 const size=9,pixels=new Uint8ClampedArray(size*size*4).fill(255);
 for(let y=2;y<7;y++)for(let x=2;x<7;x++){const o=(y*size+x)*4;pixels[o]=20;pixels[o+1]=30;pixels[o+2]=25;}
 const center=(4*size+4)*4;pixels[center]=255;pixels[center+1]=255;pixels[center+2]=255;
 matteStudioPixels(pixels,size,size);
 assert.equal(pixels[3],0);assert.equal(pixels[center+3],255);assert.equal(pixels[(2*size+2)*4+3],255);
});
