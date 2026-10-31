import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleSnapTime, DOOM_HIT, FILM_END } from '../src/snap-timing.js';

test('the soundtrack cue order is Tony, Iron Man, Endgame, then Doom', () => {
  assert.equal(sampleSnapTime(0).stage, 'man');
  assert.equal(sampleSnapTime(.85).stage, 'machine');
  assert.equal(sampleSnapTime(1.65).stage, 'snap');
  assert.equal(sampleSnapTime(3.25).stage, 'doom');
  assert.equal(sampleSnapTime(DOOM_HIT).progress, 1);
  assert.equal(sampleSnapTime(DOOM_HIT).commitDoom, true);
  assert.equal(sampleSnapTime(DOOM_HIT).complete, false);
  assert.equal(sampleSnapTime(FILM_END).complete, true);
});
test('a stalled or resumed media clock never advances the sequence independently', () => {
  const before = sampleSnapTime(2.3);
  for (let i = 0; i < 120; i++) assert.deepEqual(sampleSnapTime(2.3), before);
  assert.equal(sampleSnapTime(3.249).commitDoom, false);
  assert.equal(sampleSnapTime(4.01).stage, 'doom');
  assert.equal(sampleSnapTime(999).progress, 1);
  assert.equal(sampleSnapTime(-1).time, 0);
  assert.equal(sampleSnapTime(NaN).stage, 'man');
});
