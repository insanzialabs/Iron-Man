export const DOOM_HIT = 4;
export const FILM_END = 4.4;
export function sampleSnapTime(seconds) {
  const time = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const stage = time < .85 ? 'man' : time < 1.65 ? 'machine' : time < 3.25 ? 'snap' : 'doom';
  return { time, stage, progress: Math.min(time / DOOM_HIT, 1), commitDoom: time >= 3.25, complete: time >= FILM_END };
}
