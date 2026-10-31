// Runtime edge-connected color key: only pale studio ground connected to the
// image boundary is removed. Isolated white armor/eye highlights are retained.
export function matteStudioPixels(pixels,width,height){
  const visited=new Uint8Array(width*height),queue=new Uint32Array(width*height);let tail=0,head=0;
  function enqueue(index){if(visited[index])return;visited[index]=1;const o=index*4,r=pixels[o],g=pixels[o+1],b=pixels[o+2];if(Math.min(r,g,b)>184 && Math.max(r,g,b)-Math.min(r,g,b)<39)queue[tail++]=index;}
  for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}for(let y=0;y<height;y++){enqueue(y*width);enqueue(y*width+width-1);}
  while(head<tail){const i=queue[head++],x=i%width;pixels[i*4+3]=0;if(x>0)enqueue(i-1);if(x<width-1)enqueue(i+1);if(i>=width)enqueue(i-width);if(i<width*(height-1))enqueue(i+width);}
  return pixels;
}
export function createPortraitTexture(image){
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);matteStudioPixels(pixels.data,canvas.width,canvas.height);ctx.putImageData(pixels,0,0);return canvas;
}
