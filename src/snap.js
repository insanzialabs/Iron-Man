import { gsap } from 'gsap';
import { gauntlet } from './gauntlet.js';
import { personas } from './personas.js';
import { sampleSnapTime, FILM_END } from './snap-timing.js';
import './snap.css';

const svg = prefix => gauntlet.replaceAll('id="gauntlet-', `id="${prefix}-`).replaceAll('#gauntlet-', `#${prefix}-`);
const captions = { man: ['01 / THE MAN', 'Tony Stark.'], machine: ['02 / THE MACHINE', 'Iron Man.'], snap: ['03 / THE SACRIFICE', 'I am Iron Man.'], doom: ['04 / THE SHADOW', 'DOOM.'] };

export function createSnapExperience({ portrait, lenis, reduced, selectPersona, getPersona }) {
  const trigger = document.createElement('button');
  trigger.className = 'snap-trigger';
  trigger.disabled = true;
  trigger.setAttribute('aria-label', 'Snap the Infinity Gauntlet. Play a four-second cinematic with music.');
  trigger.innerHTML = `<span class="snap-art">${svg('trigger-gold')}</span><span class="snap-trigger-label">ONE SNAP. NEW REALITY.</span><small>4 SECOND FILM · SOUND ON</small><span class="snap-status" role="status">PREPARING THE STONES…</span>`;
  document.querySelector('.hero-sticky').append(trigger);
  const film = document.createElement('dialog');
  film.className = 'snap-film';
  film.setAttribute('aria-label', 'The snap. Tony Stark, Iron Man, Endgame, Doctor Doom.');
  film.setAttribute('data-lenis-prevent', '');
  film.innerHTML = `
    <div class="snap-scene snap-scene-man"><img src="/images/tony.webp" alt="Tony Stark" /></div>
    <div class="snap-scene snap-scene-machine"><img src="/images/iron.webp" alt="Iron Man" /></div>
    <div class="snap-scene snap-scene-snap"><img src="/images/endgame-snap.webp" alt="Tony Stark raising the Infinity Stones in Avengers Endgame" /></div>
    <div class="snap-scene snap-scene-doom"><img src="/images/doom.webp" alt="Doctor Doom" /></div>
    <div class="snap-shade"></div><div class="snap-film-gauntlet">${svg('film-gold')}</div><div class="snap-pulse"></div>
    <div class="snap-bar snap-bar-top"></div><div class="snap-bar snap-bar-bottom"></div>
    <div class="snap-film-header"><span>INSANZIA LABS / THE SNAP</span><span class="snap-film-actions"><button class="snap-film-pause" type="button">PAUSE</button><button class="snap-skip" type="button">SKIP TO DOOM ↗</button></span></div>
    <div class="snap-film-copy"><small>01 / THE MAN</small><strong>Tony Stark.</strong></div>
    <div class="snap-film-clock"><span class="snap-time">00.00</span><div class="snap-progress"><i></i></div><span>04.00 / A NEW REALITY</span></div>
    <button class="snap-film-resume" type="button" hidden>RESUME THE SNAP ▶</button>`;
  document.body.append(film);
  const player = document.createElement('div');
  player.className = 'snap-player';
  player.hidden = true;
  player.setAttribute('role', 'region');
  player.setAttribute('aria-label', 'Soundtrack controls');
  player.innerHTML = `<div class="snap-player-track"><b>ALL CAPS</b><span>MADVILLAIN / SUPPLIED SOUNDTRACK</span></div><button class="snap-audio-pause" type="button" aria-label="Pause soundtrack">PAUSE</button><button class="snap-audio-mute" type="button" aria-label="Mute soundtrack" aria-pressed="false">MUTE</button><button class="snap-audio-stop" type="button" aria-label="Stop soundtrack">✕</button>`;
  document.body.append(player);
  const audio = new Audio('/audio/all-caps.mp3');
  audio.preload = 'metadata';
  audio.volume = .72;
  const $ = s => film.querySelector(s);
  const status = trigger.querySelector('.snap-status');
  const resume = $('.snap-film-resume');
  const pause = player.querySelector('.snap-audio-pause');
  let running = false, frame = 0, original = 0, committed = false, phase = '';

  // A paused GSAP timeline is sampled against the soundtrack, never wall-clock delays.
  const timeline = gsap.timeline({ paused: true });
  timeline.set('.snap-scene-man', { opacity: 1 }, 0);
  timeline.to($('.snap-scene-machine'), { opacity: 1, duration: reduced ? .15 : .65, ease: 'power2.inOut' }, .4);
  timeline.to($('.snap-shade'), { opacity: 1, duration: .5 }, 0);
  if (!reduced) {
    timeline.to(film.querySelectorAll('.snap-bar'), { height: '7svh', duration: .45, ease: 'power3.out' }, 0);
    timeline.to($('.snap-scene-man img'), { scale: 1.01, duration: 1.05, ease: 'none' }, 0);
    timeline.to($('.snap-scene-machine img'), { scale: 1.015, duration: 1.4, ease: 'none' }, .4);
    timeline.to($('.gauntlet-middle'), { rotation: 46, duration: .13, ease: 'power2.in' }, 0);
    timeline.to($('.gauntlet-thumb'), { rotation: -24, duration: .13, ease: 'power2.in' }, 0);
    timeline.to($('.gauntlet-ring'), { rotation: 16, duration: .13 }, 0);
    timeline.to($('.gauntlet-pinky'), { rotation: 15, duration: .13 }, 0);
    timeline.to($('.gauntlet-middle'), { rotation: -52, duration: .15, ease: 'power4.out' }, .13);
    timeline.to($('.gauntlet-thumb'), { rotation: 15, duration: .15, ease: 'power4.out' }, .13);
    timeline.to($('.snap-film-gauntlet'), { rotation: 8, scale: .92, duration: .14, ease: 'power3.out' }, .13);
    timeline.to($('.snap-pulse'), { opacity: .24, duration: .06 }, .14).to($('.snap-pulse'), { opacity: 0, duration: .28 }, .2);
  }
  timeline.to($('.snap-film-gauntlet'), { opacity: 0, duration: .25 }, .45);
  timeline.fromTo($('.snap-scene-snap'), { opacity: 0, clipPath: reduced ? 'none' : 'polygon(100% 0,100% 0,100% 100%,100% 100%)' }, { opacity: 1, clipPath: reduced ? 'none' : 'polygon(0% 0,100% 0,100% 100%,-20% 100%)', duration: reduced ? .15 : .55, ease: 'power3.inOut' }, 1.35);
  if (!reduced) timeline.fromTo($('.snap-scene-snap img'), { scale: 1.035 }, { scale: 1.13, duration: 1.9, ease: 'none' }, 1.35);
  timeline.fromTo($('.snap-scene-doom'), { opacity: 0, clipPath: reduced ? 'none' : 'polygon(100% 0,100% 0,100% 100%,100% 100%)' }, { opacity: 1, clipPath: reduced ? 'none' : 'polygon(-20% 0,100% 0,100% 100%,0% 100%)', duration: reduced ? .18 : .75, ease: 'power3.inOut' }, 3.25);
  if (!reduced) timeline.fromTo($('.snap-scene-doom img'), { scale: 1.02 }, { scale: .94, duration: .75, ease: 'power3.out' }, 3.25);
  timeline.to([$('.snap-film-copy'), $('.snap-shade'), ...film.querySelectorAll('.snap-bar')], { opacity: 0, duration: .25 }, 4);
  timeline.to(film, { opacity: 0, duration: .35 }, 4.05);

  function syncPlayer() {
    $('.snap-film-pause').textContent = audio.paused ? 'RESUME' : 'PAUSE';
    pause.textContent = audio.paused ? 'PLAY' : 'PAUSE';
    pause.setAttribute('aria-label', audio.paused ? 'Play soundtrack' : 'Pause soundtrack');
  }
  function unlock() {
    running = false;
    cancelAnimationFrame(frame);
    film.close();
    document.body.classList.remove('snap-is-playing', 'overlay-open');
    portrait.setSuspended('cinematic', false);
    lenis.start();
    trigger.disabled = false;
    trigger.querySelector('.snap-trigger-label').textContent = 'REPLAY THE SNAP';
    trigger.focus({ preventScroll: true });
  }
  function finish(skip = false) {
    if (!running) return;
    if (skip && audio.currentTime < 4) audio.currentTime = 4;
    if (!committed) selectPersona(2, true, { immediate: true });
    committed = true;
    timeline.time(FILM_END, true);
    unlock();
    player.hidden = false;
    syncPlayer();
  }
  function abort(message = '') {
    if (!running) return;
    audio.pause();
    selectPersona(original, true, { immediate: true });
    unlock();
    player.hidden = true;
    status.textContent = message;
  }
  function tick() {
    if (!running) return;
    const sample = sampleSnapTime(audio.currentTime);
    timeline.time(Math.min(sample.time, FILM_END), false);
    if (phase !== sample.stage) {
      phase = sample.stage;
      $('.snap-film-copy small').textContent = captions[phase][0];
      $('.snap-film-copy strong').textContent = captions[phase][1];
      film.dataset.stage = phase;
    }
    $('.snap-time').textContent = Math.min(sample.time, 4).toFixed(2).padStart(5, '0');
    $('.snap-progress i').style.transform = `scaleX(${sample.progress})`;
    if (sample.commitDoom && !committed) {
      committed = true;
      selectPersona(2, false, { immediate: true });
    }
    if (sample.complete) { finish(); return; }
    frame = requestAnimationFrame(tick);
  }
  async function start() {
    if (running || trigger.disabled || document.body.classList.contains('is-loading')) return;
    warmed = true;
    original = getPersona();
    committed = false; phase = '';
    running = true; trigger.disabled = true; status.textContent = '';
    player.hidden = true;
    audio.pause(); audio.currentTime = 0;
    timeline.time(0, true);
    gsap.set(film, { opacity: 1 });
    portrait.setSuspended('cinematic', true);
    lenis.stop();
    document.body.classList.add('snap-is-playing', 'overlay-open');
    film.showModal();
    resume.hidden = true;
    $('.snap-film-pause').textContent = 'PAUSE';
    $('.snap-film-pause').focus();
    // Play is invoked synchronously inside the trusted click/keyboard gesture.
    const playback = audio.play();
    selectPersona(0, false, { immediate: true });
    frame = requestAnimationFrame(tick);
    try { await playback; } catch { abort('Sound could not start. Click the gauntlet to try again.'); }
  }
  let warmed = false;
  function warmAudio() {
    if (warmed || running) return;
    warmed = true; audio.preload = 'auto'; audio.load();
  }
  trigger.addEventListener('pointerenter', warmAudio, { once: true });
  trigger.addEventListener('focus', warmAudio, { once: true });
  trigger.addEventListener('click', start);
  $('.snap-skip').addEventListener('click', () => finish(true));
  $('.snap-film-pause').addEventListener('click', async () => {
    if (!audio.paused) { audio.pause(); resume.hidden = false; }
    else { try { await audio.play(); resume.hidden = true; } catch { resume.hidden = false; } }
    syncPlayer();
  });
  film.addEventListener('cancel', e => { e.preventDefault(); abort('Sequence cancelled. Ready to replay.'); });
  resume.addEventListener('click', async () => {
    try { await audio.play(); resume.hidden = true; syncPlayer(); } catch { resume.textContent = 'TRY RESUMING SOUND ▶'; }
  });
  pause.addEventListener('click', async () => {
    if (!audio.paused) audio.pause();
    else { try { await audio.play(); } catch { status.textContent = 'Sound could not resume. Try again.'; } }
    syncPlayer();
  });
  player.querySelector('.snap-audio-mute').addEventListener('click', e => {
    audio.muted = !audio.muted;
    e.currentTarget.setAttribute('aria-pressed', String(audio.muted));
    e.currentTarget.setAttribute('aria-label', audio.muted ? 'Unmute soundtrack' : 'Mute soundtrack');
    e.currentTarget.textContent = audio.muted ? 'UNMUTE' : 'MUTE';
  });
  player.querySelector('.snap-audio-stop').addEventListener('click', () => { audio.pause(); audio.currentTime = 0; player.hidden = true; trigger.focus({ preventScroll: true }); });
  audio.addEventListener('waiting', () => film.setAttribute('aria-busy', 'true'));
  audio.addEventListener('playing', () => { film.setAttribute('aria-busy', 'false'); syncPlayer(); });
  audio.addEventListener('pause', syncPlayer);
  audio.addEventListener('ended', () => { if (running) finish(); player.hidden = true; });
  audio.addEventListener('error', () => { if (running) abort('Soundtrack unavailable. Please retry once it has loaded.'); else { audio.pause(); player.hidden = true; } });
  document.addEventListener('visibilitychange', () => {
    // Keep user-started music playing in other tabs/windows. Browsers can suspend
    // background animation frames; resample the media clock immediately on return.
    if (!document.hidden && running) {
      cancelAnimationFrame(frame);
      tick();
    }
  });
  // No large audio decode or new dependency blocks initial page rendering.
  const doom = personas[2];
  const landingImages = [...doom.dual.map(item => item[3]), doom.chapterImage, doom.interlude, doom.footerImage];
  const prepareLanding = [...new Set(landingImages.map(item => item.src))].map(src => {
    const image = new Image(); image.src = src; return image.decode();
  });
  Promise.all([...film.querySelectorAll('img')].map(im => im.decode()).concat(prepareLanding)).then(() => {
    trigger.disabled = false; status.textContent = '';
  }).catch(() => { status.textContent = 'Cinematic images could not load. Refresh to retry.'; });
  return { audio, trigger };
}
