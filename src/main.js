import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Portrait } from "./portrait.js";
import { createSnapExperience } from "./snap.js";
import { personas, createPersonaExperience } from "./personas.js";

gsap.registerPlugin(ScrollTrigger);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.085,
  smoothWheel: !reduced,
  anchors: false,
});
lenis.on("scroll", ScrollTrigger.update);
document.body.classList.add("is-loading");
lenis.stop();

const portrait = new Portrait($("#portrait"), { reduced });
let persona = 0;
let changeExperience;
function selectPersona(index, announce = true, options = {}) {
  if (index < 0 || index >= personas.length) return;
  const changed = persona !== index;
  persona = index;
  portrait.setPersona(index, options.immediate);
  $$("[data-persona]").forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(Number(button.dataset.persona) === index),
    ),
  );
  const profile = personas[index],
    hint = $(".hero-hint>span:last-child");
  hint.innerHTML = `MOVE TO REVEAL ${profile.next}.<br />PRESS TO EXPAND. BUTTONS CHANGE IDENTITY.`;
  if (announce) hint.setAttribute("role", "status");
  $(".hero-portrait").setAttribute(
    "aria-label",
    `${profile.name}. Move to reveal ${profile.next}. Use the character buttons to change the experience.`,
  );
  if (changed) changeExperience?.(index, options);
}
$$("[data-persona]").forEach((button) =>
  button.addEventListener("click", () =>
    selectPersona(Number(button.dataset.persona)),
  ),
);
// Pointer presses enlarge the temporary liquid lens. They never change identity.

const motionToggle = $(".hero-motion-toggle");
motionToggle.setAttribute("aria-pressed", String(reduced));
motionToggle.setAttribute(
  "aria-label",
  reduced
    ? "Automatic hero animation disabled by reduced-motion preference"
    : "Pause automatic hero animation",
);
motionToggle.querySelector("span").textContent = reduced ? "OFF" : "ON";
motionToggle.disabled = reduced;
motionToggle.addEventListener("click", () => {
  const enabled = !portrait.idleEnabled;
  portrait.setIdleEnabled(enabled);
  motionToggle.setAttribute("aria-pressed", String(!enabled));
  motionToggle.setAttribute(
    "aria-label",
    enabled
      ? "Pause automatic hero animation"
      : "Resume automatic hero animation",
  );
  motionToggle.querySelector("span").textContent = enabled ? "ON" : "OFF";
});

// The menu is one continuous full-screen transition. Inert keeps hidden links out of the tab order.
let menuOpen = false;
let menuTween;
function toggleMenu(open) {
  if (menuOpen === open) return;
  menuOpen = open;
  portrait.setSuspended("menu", open);
  menuTween?.kill();
  $(".menu-toggle").setAttribute("aria-expanded", String(open));
  $(".menu-toggle").setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu",
  );
  $(".header").classList.toggle("menu-is-open", open);
  $(".menu").inert = !open;
  $("main").inert = open;
  $(".footer").inert = open;
  $$(".header>a,.header .archive-link").forEach((el) => {
    el.inert = open;
  });
  if (open) {
    lenis.stop();
    document.body.classList.add("overlay-open");
    gsap.set(".menu", { visibility: "visible" });
  }
  menuTween = gsap.to(".menu", {
    clipPath: open ? "inset(0% 0% 0%)" : "inset(0% 0% 100%)",
    duration: reduced ? 0 : 0.75,
    ease: "power4.inOut",
    onComplete: () => {
      if (open) {
        $(".menu-links a").focus({ preventScroll: true });
      } else {
        gsap.set(".menu", { visibility: "hidden" });
        if (!document.querySelector("dialog[open]")) {
          document.body.classList.remove("overlay-open");
          lenis.start();
        }
      }
    },
  });
  if (open)
    gsap.fromTo(
      ".menu-links a",
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: reduced ? 0 : 0.055,
        delay: reduced ? 0 : 0.2,
        duration: reduced ? 0 : 0.7,
        ease: "power3.out",
      },
    );
}
$(".menu-toggle").addEventListener("click", () => toggleMenu(!menuOpen));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (menuOpen) {
      toggleMenu(false);
      $(".menu-toggle").focus();
    }
  }
  if (event.key === "Tab" && menuOpen) {
    const targets = [$(".menu-toggle"), ...$$(".menu a")],
      first = targets[0],
      last = targets.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
$$('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = $(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const delay = menuOpen ? 0.55 : 0;
    toggleMenu(false);
    gsap.delayedCall(delay, () => {
      lenis.scrollTo(target, {
        duration: reduced ? 0 : 1.5,
        offset: target.id === "home" ? 0 : -20,
        force: true,
        onComplete: () => {
          history.replaceState(null, "", link.getAttribute("href"));
          const temporaryFocus = !target.hasAttribute("tabindex");
          if (temporaryFocus) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (temporaryFocus)
            target.addEventListener(
              "blur",
              () => target.removeAttribute("tabindex"),
              { once: true },
            );
        },
      });
    });
  }),
);

const armors = [
  {
    mark: "MARK I",
    name: "The beginning.",
    year: "2008",
    image: "armor-mark-i.webp",
    type: "PROTOTYPE / ESCAPE ARMOR",
    power: "Miniature arc reactor",
    system: "Manual controls",
    film: "Iron Man",
    description:
      "Built in captivity from salvaged weapons, the first suit was a way out. Rough steel, exposed mechanics and a single extraordinary idea: build something that saves a life.",
  },
  {
    mark: "MARK V",
    name: "Travel light.",
    year: "2010",
    image: "armor-mark-v.webp",
    type: "PORTABLE / SUITCASE ARMOR",
    power: "Arc reactor",
    system: "Portable deployment",
    film: "Iron Man 2",
    description:
      "The best solution is the one you can take with you. A red-and-silver emergency suit that unfolds from a suitcase, built for the moment when the workshop is a world away.",
  },
  {
    mark: "MARK VII",
    name: "Ready for anything.",
    year: "2012",
    image: "armor-mark-vii.webp",
    type: "RAPID DEPLOYMENT / COMBAT ARMOR",
    power: "Integrated arc reactor",
    system: "J.A.R.V.I.S.",
    film: "The Avengers",
    description:
      "No gantry. No waiting. A suit that finds its pilot in mid-air and assembles around him. The Mark VII brought Stark’s engineering to the Battle of New York.",
  },
  {
    mark: "MARK LXXXV",
    name: "The final iteration.",
    year: "2019",
    image: "armor-mark-lxxxv.webp",
    type: "NANOTECH / ADVANCED ARMOR",
    power: "Advanced arc reactor",
    system: "F.R.I.D.A.Y.",
    film: "Avengers: Endgame",
    description:
      "A lifetime of lessons, distilled into one suit. Adaptive nanotechnology meets the unmistakable red and gold — the culmination of an engineer who never stopped improving.",
  },
  {
    mark: "MARK III",
    name: "The signature.",
    year: "2008",
    image: "armor-mark-iii.webp",
    type: "GOLD-TITANIUM / COMBAT ARMOR",
    power: "Arc reactor",
    system: "J.A.R.V.I.S.",
    film: "Iron Man",
    description:
      "The first red-and-gold combat suit. Built after Tony’s flight tests, the Mark III made the armor’s identity unmistakable: a brilliant idea, given a form the world would recognize.",
  },
  {
    mark: "MARK L",
    name: "An idea, reassembled.",
    year: "2018",
    image: "armor-mark-l.webp",
    type: "NANOTECH / ADAPTIVE ARMOR",
    power: "Advanced arc reactor",
    system: "F.R.I.D.A.Y.",
    film: "Avengers: Infinity War",
    description:
      "The armor becomes adaptive. The Mark L brings nanotechnology to Tony’s designs, allowing equipment to form and change around its pilot in the middle of the fight.",
  },
];
let currentEntries = armors;
const wall = $(".armor-wall");
const order = [
  [0, 4, 1],
  [2, 1, 5],
  [3, 0, 2],
  [4, 5, 0],
  [2, 1, 3],
];
order.forEach((items, column) => {
  const el = document.createElement("div");
  el.className = "armor-column";
  items.forEach((index, row) => {
    if ((column === 1 && row === 1) || (column === 3 && row === 0)) {
      const link = document.createElement("a");
      link.className = "armor-card is-photo";
      link.href = column === 1 ? "#story" : "#doom";
      link.innerHTML = `<img src="/images/${column === 1 ? "workshop" : "latveria"}.webp" alt="${column === 1 ? "Inside the Stark workshop" : "The world of Doctor Doom"}" loading="lazy"><span class="armor-caption"><span>${column === 1 ? "Behind the armor" : "A different future"}</span><span>↗</span></span>`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        lenis.scrollTo($(link.getAttribute("href")), { offset: -20 });
      });
      el.append(link);
      return;
    }
    const armor = armors[index],
      button = document.createElement("button");
    button.className = "armor-card";
    button.dataset.file = String(index);
    button.setAttribute("aria-label", `Explore ${armor.mark}, ${armor.year}`);
    button.innerHTML = `<svg class="armor-frame" aria-hidden="true" viewBox="0 0 187 188" preserveAspectRatio="none"><path d="M8 .5h170.12a7.5 7.5 0 0 1 7.5 7.5v154.61a7.5 7.5 0 0 1-7.5 7.5H60.681a10.5 10.5 0 0 0-8.21 3.954l-7.86 9.858a9.5 9.5 0 0 1-7.427 3.578H8A7.5 7.5 0 0 1 .5 180V8A7.5 7.5 0 0 1 8 .5Z"/></svg><span class="plus" aria-hidden="true">＋</span><img src="/images/${armor.image}" alt="" loading="lazy"><span class="armor-caption"><span>${armor.mark}</span><span>${armor.year}</span></span>`;
    button.addEventListener("click", () => openArmor(index));
    el.append(button);
  });
  wall.append(el);
});
const dialog = $(".armor-dialog");
let currentArmor = 0;
let returnFocus;
function renderArmor(index) {
  currentArmor = (index + currentEntries.length) % currentEntries.length;
  const armor = currentEntries[currentArmor];
  $(".file-image img").src = `/images/${armor.image}`;
  $(".file-image img").alt = `${personas[persona].name}: ${armor.mark}`;
  $(".file-number").textContent =
    `FILE 00${currentArmor + 1} / ${armor.year} / ${armor.type}`;
  $("#file-title").textContent = armor.mark;
  $(".file-subtitle").textContent = armor.name;
  $(".file-description").textContent = armor.description;
  $(".file-specs").innerHTML =
    `<dt>${persona === 1 ? "POWER SOURCE" : "FOCUS"}</dt><dd>${armor.power}</dd><dt>${persona === 1 ? "ONBOARD SYSTEM" : "CONNECTION"}</dt><dd>${armor.system}</dd><dt>STORY</dt><dd>${armor.film}</dd>`;
}
function openArmor(index) {
  renderArmor(index);
  returnFocus = document.activeElement;
  dialog.showModal();
  portrait.setSuspended("dialog", true);
  lenis.stop();
  document.body.classList.add("overlay-open");
  if (!reduced)
    gsap.fromTo(
      dialog,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );
}
function closeDialog(modal) {
  modal.close();
}
$(".dialog-close").addEventListener("click", () => closeDialog(dialog));
$(".file-prev").addEventListener("click", () => renderArmor(currentArmor - 1));
$(".file-next").addEventListener("click", () => renderArmor(currentArmor + 1));
$("#explore-armor").addEventListener("click", () => openArmor(0));
dialog.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") renderArmor(currentArmor - 1);
  if (e.key === "ArrowRight") renderArmor(currentArmor + 1);
});
const credits = $(".credits-dialog");
$("#credits-open").addEventListener("click", () => {
  returnFocus = document.activeElement;
  credits.showModal();
  portrait.setSuspended("dialog", true);
  lenis.stop();
  document.body.classList.add("overlay-open");
});
$(".credits-close").addEventListener("click", () => closeDialog(credits));
$$("dialog").forEach((modal) => {
  modal.setAttribute("data-lenis-prevent", "");
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeDialog(modal);
  });
  modal.addEventListener("close", () => {
    portrait.setSuspended("dialog", false);
    document.body.classList.remove("overlay-open");
    lenis.start();
    returnFocus?.focus({ preventScroll: true });
  });
});
$(".doom-reveal").addEventListener("click", () => {
  selectPersona(Number($(".doom-reveal").dataset.target ?? 2));
  lenis.scrollTo("#home", { duration: reduced ? 0 : 1.8 });
});

changeExperience = createPersonaExperience({
  gsap,
  reduced,
  refresh: () => ScrollTrigger.refresh(),
  onArchiveChange: (entries, index) => {
    currentEntries = entries || armors;
    $$(".armor-card[data-file]").forEach((button) => {
      const file =
        currentEntries[Number(button.dataset.file) % currentEntries.length];
      button.querySelector("img").src = `/images/${file.image}`;
      button.querySelector(".armor-caption>span:first-child").textContent =
        file.mark;
      button.querySelector(".armor-caption>span:last-child").textContent =
        file.year;
      button.setAttribute("aria-label", `Explore ${file.mark}`);
      button.classList.toggle("is-dossier", index !== 1);
    });
    $(".armor-wall").setAttribute(
      "aria-label",
      index === 1
        ? "Explore the armor archive"
        : index === 2
          ? "Explore the Latverian dossiers"
          : "Explore Tony Stark’s workshop",
    );
  },
});
changeExperience(0, { immediate: true });
selectPersona(0, false);

function motion() {
  // Match the reference's full-screen portrait -> small portrait -> manifesto choreography.
  if (!reduced) {
    const hero = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    hero
      .to(
        ".hero-portrait",
        { scale: 0.27, duration: 1, ease: "power2.inOut" },
        0,
      )
      .to(
        ".persona-panel,.hero-hint,.hero-scroll,.hero-motion-toggle,.snap-trigger",
        { opacity: 0, y: 15, duration: 0.2, ease: "none" },
        0,
      )
      .fromTo(
        ".hero-marquee>div:first-child",
        { xPercent: 0 },
        { xPercent: -42, duration: 1.2, ease: "none" },
        0,
      )
      .fromTo(
        ".hero-marquee>div:last-child",
        { xPercent: -45 },
        { xPercent: 0, duration: 1.2, ease: "none" },
        0,
      )
      .to(".hero-signature", { opacity: 1, scale: 1.08, duration: 0.35 }, 0.4)
      .to(".hero-kicker", { opacity: 1, duration: 0.25 }, 0.4)
      .to(".hero-portrait", { opacity: 0.3, duration: 0.35 }, 0.6);
    $$(".wipe-word").forEach((el) =>
      gsap.to(el, {
        "--wipe": 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          end: "top 57%",
          scrub: true,
        },
      }),
    );
    gsap.to(".memory-strip", {
      x: () => -($(".memory-strip").scrollWidth - innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".memory-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });
    $$(".memory").forEach((el, i) =>
      gsap.fromTo(
        el,
        { y: i % 2 ? 40 : -40 },
        {
          y: i % 2 ? -40 : 40,
          ease: "none",
          scrollTrigger: {
            trigger: ".memory-track",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      ),
    );
    $$(".armor-column").forEach((el, i) =>
      gsap.fromTo(
        el,
        { y: i % 2 ? -100 : 70 },
        {
          y: i % 2 ? 100 : -70,
          ease: "none",
          scrollTrigger: {
            trigger: ".armor-wall",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      ),
    );
    gsap.fromTo(
      ".doom-photo img",
      { scale: 1.12, yPercent: -5 },
      {
        scale: 1,
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: ".doom-chapter",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      ".workshop-interlude img",
      { yPercent: -12 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".workshop-interlude",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
    $$(".legacy-fan img").forEach((el, i) =>
      gsap.fromTo(
        el,
        { rotation: 0, y: 80 },
        {
          rotation: (i - 2) * 14,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".legacy",
            start: "top 85%",
            end: "top 25%",
            scrub: 1,
          },
        },
      ),
    );
    gsap.from(".footer-armor", {
      y: 70,
      rotation: -5,
      ease: "none",
      scrollTrigger: {
        trigger: ".footer",
        start: "top bottom",
        end: "top 10%",
        scrub: 1,
      },
    });
  }
  // Fixed navigation follows the page's original light/dark rhythm.
  const darkSurfaces = $$(
    ".section-dark,.hero-track,.workshop-interlude,.footer-panel",
  );
  const updateHeaderTheme = () => {
    const dark = darkSurfaces.some((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.top < 45 &&
        r.bottom > 45 &&
        (el.classList.contains("hero-track")
          ? scrollY > innerHeight * 0.35
          : true)
      );
    });
    $(".header").classList.toggle("on-dark", dark);
  };
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: updateHeaderTheme,
    onRefresh: updateHeaderTheme,
  });
  // Faded hero controls leave the keyboard and pointer interaction paths as they scroll away.
  ScrollTrigger.create({
    trigger: ".hero-track",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      const scrollSuspended = self.progress > 0.12;
      if (portrait.suspensions.has("scroll") !== scrollSuspended)
        portrait.setSuspended("scroll", scrollSuspended);
      $$(".persona-panel,.hero-hint,.hero-scroll,.hero-motion-toggle,.snap-trigger").forEach(
        (el) => {
          el.inert = self.progress > 0.12;
          el.style.pointerEvents = self.progress > 0.12 ? "none" : "";
        },
      );
    },
  });
  ScrollTrigger.refresh();
}

async function start() {
  const count = { value: 0 };
  gsap.to(count, {
    value: 90,
    duration: 1.2,
    onUpdate: () =>
      ($(".load-count").textContent = String(Math.round(count.value)).padStart(
        2,
        "0",
      )),
  });
  await Promise.allSettled([portrait.ready, document.fonts.ready]);
  if (!portrait.gl) {
    portrait.setIdleEnabled(false);
    motionToggle.disabled = true;
    motionToggle.setAttribute("aria-pressed", "true");
    motionToggle.setAttribute(
      "aria-label",
      "Automatic motion unavailable without WebGL",
    );
    motionToggle.querySelector("span").textContent = "OFF";
  }
  motion();
  gsap.killTweensOf(count);
  $(".load-count").textContent = "100";
  const timeline = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove("is-loading");
      $(".loader").remove();
      portrait.setSuspended("loading", false);
      lenis.start();
      ScrollTrigger.refresh();
    },
  });
  timeline
    .to(".loader-mark", {
      rotation: 8,
      scale: 1.1,
      duration: reduced ? 0 : 0.35,
      ease: "power2.inOut",
    })
    .to(
      ".loader",
      {
        clipPath: "inset(0 0 100%)",
        duration: reduced ? 0 : 1.05,
        ease: "power4.inOut",
      },
      reduced ? 0 : "+=.1",
    )
    .from(
      ".hero-portrait",
      { scale: 1.06, duration: reduced ? 0 : 1.2, ease: "power3.out" },
      reduced ? 0 : "<.15",
    )
    .from(
      ".header,.persona-panel,.hero-hint,.hero-scroll,.hero-motion-toggle,.snap-trigger",
      {
        opacity: 0,
        y: 12,
        duration: reduced ? 0 : 0.65,
        stagger: 0.06,
        ease: "power3.out",
      },
      reduced ? 0 : "<.4",
    );
}
createSnapExperience({ portrait, lenis, reduced, selectPersona, getPersona: () => persona });
start();
