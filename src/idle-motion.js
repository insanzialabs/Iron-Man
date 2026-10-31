// Source-derived four-reversal cursor choreography (OFF+BRAND / Lando Norris).
// The X progress uses power1.inOut; Y moves continuously from forehead to torso.
export const IDLE_DELAY_MS=650;
export const IDLE_PERIOD=6.1;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
export function sampleIdleMotion(seconds){
  const phase=((seconds%IDLE_PERIOD)+IDLE_PERIOD)%IDLE_PERIOD;
  let p;
  if(phase<=2.5+1e-7)p=phase/2.5;
  else if(phase>=2.85-1e-7&&phase<=5.35+1e-7)p=1-(phase-2.85)/2.5;
  else return null;
  p=Math.max(0,Math.min(1,p));
  return {x:.5-Math.cos(ease(p)*Math.PI*4)*.375,y:.5-Math.cos(p*Math.PI)*.29,radius:.19};
}
