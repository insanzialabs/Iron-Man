// Character selection is persistent. The liquid lens only previews the next identity.
// Authored HTML below is local editorial content, never external/user HTML.
const image = (name, alt) => ({ src: `/images/${name}.webp`, alt });
const tony = image("tony", "Tony Stark, the mind behind the armor");
const iron = image("iron", "Iron Man in red and gold armor");
const doom = image("doom", "Doctor Doom in a silver mask and green cloak");
const workshop = image(
  "workshop",
  "Tony Stark working beside his armor in the workshop",
);
const hall = image(
  "hall-of-armor",
  "Tony Stark standing before the Hall of Armor",
);
const latveria = image(
  "latveria",
  "Doctor Doom surveying Latveria from his castle",
);
const suit = image("armor-mark-v", "The portable red and silver Mark V suit");
const film = image("iron-man-film", "Iron Man film artwork");

const flight = image("iron-flight", "Iron Man flying above the clouds");
const repulsor = image(
  "iron-repulsor",
  "Iron Man extending a glowing repulsor in battle",
);
const newYork = image(
  "iron-new-york",
  "Iron Man flying through a New York street at night",
);
const nanotech = image(
  "iron-nanotech",
  "Iron Man in his nanotech armor on a ruined battlefield",
);
const prototype = image(
  "iron-prototype",
  "Tony testing an early repulsor gauntlet in his workshop",
);
const throne = image("doom-throne", "Doctor Doom seated on an ornate throne");
const sorcery = image(
  "doom-sorcery",
  "Doctor Doom conjuring green energy over an open grimoire",
);
const cinematicDoom = image(
  "doom-cinematic",
  "Doctor Doom standing with outstretched armored hands",
);
const monarch = image(
  "doom-monarch",
  "Doctor Doom contemplating his kingdom from a stone throne",
);
const supreme = image(
  "doom-supreme",
  "One World Under Doom cover artwork with Doom above the assembled heroes",
);
const stainedGlass = image(
  "doom-stained-glass",
  "Avengers Doomsday poster with Doom and green stained glass",
);
const tapestry = image(
  "doom-tapestry",
  "Avengers Doomsday poster showing Doom before a grand tapestry",
);

export const personas = [
  {
    name: "Tony Stark",
    short: "STARK",
    brand: "INDUSTRIES",
    monogram: "ts",
    signature: "Stark.",
    colors: {
      "--lime": "#d2ff00",
      "--cream": "#f4f4ea",
      "--ink": "#23291d",
      "--muted": "#bec2b4",
      "--paper": "#bfc3b5",
      "--chapter": "#d6d9ce",
      "--archive": "#10110f",
    },
    next: "IRON MAN",
    title: "STARK — The mind behind the machine.",
    marquee: [
      "<em>BUILT, NOT BORN.</em> MADE TO MAKE A DIFFERENCE. <em>BUILT, NOT BORN.</em>",
      "THE MAN BEHIND THE MACHINE. THE MAN BEHIND THE MACHINE.",
    ],
    kicker: ["STARK INDUSTRIES", "THE FUTURE IS A WORK IN PROGRESS."],
    manifesto: [
      ["A restless ", "mind."],
      ["A world worth", ""],
      ["fighting", " for."],
      ["Always building.", ""],
      ["Never standing ", "still."],
      ["A man. A machine.", ""],
      ["An ", "extraordinary"],
      ["legacy.", ""],
    ],
    note: "IT WAS NEVER JUST ABOUT THE SUIT.",
    eyebrow: [
      "01 / MORE THAN THE ARMOR",
      "EST. IN A CAVE. BUILT FOR THE WORLD.",
    ],
    memories: [workshop, prototype, suit, hall, iron, latveria, cinematicDoom],
    captions: [
      "MALIBU, CALIFORNIA / THE WORKSHOP",
      "THE MIND BEHIND THE MACHINE",
      "ENGINEERED TO GO ANYWHERE",
      "EVERY ITERATION, A NEW POSSIBILITY",
      "MORE THAN METAL",
      "MEANWHILE, IN LATVERIA…",
      "EVERY LEGACY CASTS A SHADOW",
    ],
    dual: [
      ["THE", "MAN.", "THE MIND. THE MAKER. THE HUMAN.", tony],
      ["THE", "IDEA.", "A FUTURE WORTH BUILDING.", workshop],
    ],
    interlude: hall,
    interludeText: "ONE MAN. ENDLESS POSSIBILITIES.",
    archiveTitle: "IDEAS THAT<br /><em>changed everything.</em>",
    archiveIntro:
      "A curious mind. A workshop. No instruction manual.<br />Explore the ideas behind the armor.",
    archiveEyebrow: "02 / INSIDE THE WORKSHOP",
    archiveEnd: "THE NEXT IDEA<br />IS ALWAYS <em>out there.</em>",
    archiveButton: "EXPLORE THE WORKSHOP",
    chapterImage: iron,
    chapterEyebrow: "03 / THE IDEA MADE REAL",
    chapterTitle:
      "A MIND.<br />A <em>mission.</em><br />A NEW<br /><em>beginning.</em>",
    chapterCopy:
      "Behind every extraordinary machine is a human decision.<br />Step inside the armor Tony built.",
    chapterButton: "BECOME IRON MAN",
    chapterTarget: 1,
    chapterCoordinate: "MALIBU / THE FUTURE STARTS IN THE WORKSHOP.",
    alliesTitle: "EXTRAORDINARY<br /><em>connections.</em>",
    allies: [
      "STARK INDUSTRIES",
      "Avengers",
      "J.A.R.V.I.S.",
      "S.H.I.E.L.D.",
      "FRIDAY",
    ],
    fan: [prototype, workshop, tony, hall, film],
    legacyTitle: "A mind full of <em>possibilities.</em>",
    footerTitle: "ALWAYS<br /><em>building</em><br />WHAT’S NEXT.",
    footerImage: image(
      "armor-mark-vii",
      "Iron Man Mark VII, an idea made real",
    ),
    archive: [
      {
        mark: "THE REACTOR",
        name: "A change of heart.",
        year: "01",
        image: "iron.webp",
        type: "ENGINEERING / ENERGY",
        power: "Miniaturized energy",
        system: "Stark engineering",
        film: "Iron Man",
        description:
          "The miniature arc reactor began as a way to keep Tony alive. That first breakthrough became the heart of an entirely different future: a power source small enough to wear, and powerful enough to change what was possible.",
      },
      {
        mark: "THE WORKSHOP",
        name: "Where the future starts.",
        year: "02",
        image: "workshop.webp",
        type: "RESEARCH / MALIBU",
        power: "Relentless curiosity",
        system: "J.A.R.V.I.S.",
        film: "Iron Man",
        description:
          "A place for impossible ideas, failed tests and the next iteration. Tony’s workshop is as much a part of his story as the armor itself — a space where invention becomes action.",
      },
      {
        mark: "J.A.R.V.I.S.",
        name: "A second pair of eyes.",
        year: "03",
        image: "tony.webp",
        type: "INTELLIGENCE / ASSISTANCE",
        power: "Artificial intelligence",
        system: "J.A.R.V.I.S.",
        film: "Iron Man",
        description:
          "A voice in the workshop and a partner inside the suit. J.A.R.V.I.S. helps Tony turn instinct into engineering, running simulations, managing systems and bringing a little perspective to impossible plans.",
      },
      {
        mark: "THE ARMORY",
        name: "Never a final version.",
        year: "04",
        image: "hall-of-armor.webp",
        type: "DEVELOPMENT / ITERATION",
        power: "Continuous invention",
        system: "Stark Industries",
        film: "Iron Man 3",
        description:
          "An archive of answers to different questions. Each suit marks another experiment, another lesson, and another reason to keep building. The Hall of Armor is a portrait of a mind that never stands still.",
      },
    ],
  },
  {
    name: "Iron Man",
    short: "IRON",
    brand: "MAN",
    monogram: "im",
    signature: "Iron Man.",
    colors: {
      "--lime": "#f4c95b",
      "--cream": "#f3eee3",
      "--ink": "#351b1b",
      "--muted": "#c2aaa0",
      "--paper": "#c9bdb1",
      "--chapter": "#ded0bd",
      "--archive": "#180e0e",
    },
    next: "DOCTOR DOOM",
    title: "IRON MAN — More than a suit.",
    marquee: [
      "<em>MORE THAN METAL.</em> BUILT TO PROTECT. <em>MORE THAN METAL.</em>",
      "THE MACHINE. THE MISSION. THE LEGACY. THE MACHINE. THE MISSION.",
    ],
    kicker: ["IRON MAN / SYSTEMS ONLINE", "THE SUIT IS ONLY THE BEGINNING."],
    manifesto: [
      ["A suit of ", "armor."],
      ["A human heart.", ""],
      ["fighting", " for more."],
      ["Always evolving.", ""],
      ["Built to go ", "further."],
      ["Not just a machine.", ""],
      ["An ", "extraordinary"],
      ["purpose.", ""],
    ],
    note: "THE POWER WAS ALWAYS IN THE CHOICE.",
    eyebrow: ["01 / MORE THAN METAL", "ASSEMBLED FOR SOMETHING GREATER."],
    memories: [
      flight,
      repulsor,
      image("armor-mark-iii", "The classic Mark III armor"),
      newYork,
      nanotech,
      image("armor-mark-l", "Iron Man Mark L nanotech armor"),
      hall,
    ],
    captions: [
      "ABOVE THE CLOUDS / THE FIRST FLIGHT",
      "REPULSORS / POWER WITH PURPOSE",
      "MARK III / THE SIGNATURE RED AND GOLD",
      "NEW YORK / BETWEEN THE SKYSCRAPERS",
      "NANOTECH / BUILT TO ADAPT",
      "MARK L / A NEW KIND OF ARMOR",
      "THE HALL OF ARMOR / EVERY ITERATION",
    ],
    dual: [
      ["THE", "SUIT.", "ENGINEERED FOR THE IMPOSSIBLE.", iron],
      ["THE", "PILOT.", "THE HUMAN AT THE HEART OF IT.", tony],
    ],
    interlude: newYork,
    interludeText: "NEW YORK / THE MACHINE IN MOTION.",
    archiveTitle: "NEVER STOP<br /><em>iterating.</em>",
    archiveIntro:
      "From a box of scraps to the bleeding edge.<br />Every suit has a story. Find yours.",
    archiveEyebrow: "02 / THE HALL OF ARMOR",
    archiveEnd: "THE NEXT SUIT<br />STARTS WITH <em>an idea.</em>",
    archiveButton: "EXPLORE THE ARMORY",
    chapterImage: cinematicDoom,
    chapterEyebrow: "03 / BEYOND THE ARMOR",
    chapterTitle:
      "EVERY<br /><em>legacy</em><br />CASTS A<br /><em>shadow.</em>",
    chapterCopy:
      "Another mask. Another extraordinary mind.<br />Across the divide, a different future is taking shape.",
    chapterButton: "ENTER DOOM’S WORLD",
    chapterTarget: 2,
    chapterCoordinate: "LATVERIA / THE FUTURE HAS ANOTHER FACE.",
    alliesTitle: "STRONGER<br /><em>together.</em>",
    allies: [
      "AVENGERS",
      "Stark Industries",
      "J.A.R.V.I.S.",
      "F.R.I.D.A.Y.",
      "EARTH’S DEFENDERS",
    ],
    fan: [flight, repulsor, nanotech, newYork, hall],
    legacyTitle: "A legacy forged in <em>iron.</em>",
    footerTitle: "ALWAYS<br /><em>bringing</em><br />THE FIGHT.",
    footerImage: image("armor-mark-vii", "Iron Man Mark VII armor"),
    archive: null,
  },
  {
    name: "Doctor Doom",
    short: "DOCTOR",
    brand: "DOOM",
    monogram: "vd",
    signature: "Doom.",
    colors: {
      "--lime": "#b8df76",
      "--cream": "#e9ede2",
      "--ink": "#142c24",
      "--muted": "#a2b8a6",
      "--paper": "#a6b7a5",
      "--chapter": "#c1d0bb",
      "--archive": "#09130f",
    },
    next: "TONY STARK",
    title: "DOOM — A will beyond the mask.",
    marquee: [
      "<em>A WILL OF IRON.</em> A WORLD OF HIS OWN. <em>A WILL OF IRON.</em>",
      "THE MIND. THE MASK. THE MONARCH. THE MIND. THE MASK.",
    ],
    kicker: ["LATVERIA / VICTOR VON DOOM", "THE WORLD WILL KNOW HIS NAME."],
    manifesto: [
      ["An unbending ", "will."],
      ["A mind without", ""],
      ["limits.", ""],
      ["A world remade.", ""],
      ["On his own ", "terms."],
      ["A mask. A monarch.", ""],
      ["An ", "extraordinary"],
      ["shadow.", ""],
    ],
    note: "BEHIND THE MASK, AN UNCOMPROMISING VISION.",
    eyebrow: [
      "01 / THE WILL BEHIND THE MASK",
      "LATVERIA / HIS WORLD. HIS TERMS.",
    ],
    memories: [
      cinematicDoom,
      monarch,
      sorcery,
      latveria,
      supreme,
      throne,
      doom,
    ],
    captions: [
      "VICTOR VON DOOM / A PRESENCE BEYOND THE MASK",
      "THE MONARCH / ON HIS OWN TERMS",
      "SCIENCE AND SORCERY / THE OPEN GRIMOIRE",
      "LATVERIA / A KINGDOM APART",
      "ONE WORLD UNDER DOOM / THE COMIC ARCHIVE",
      "THE THRONE / THE SEAT OF POWER",
      "THE MASK / AN UNCOMPROMISING VISION",
    ],
    dual: [
      ["THE", "MIND.", "AMBITION WITHOUT COMPROMISE.", cinematicDoom],
      ["THE", "WORLD.", "A KINGDOM IN HIS IMAGE.", latveria],
    ],
    interlude: latveria,
    interludeText: "LATVERIA / IN THE SHADOW OF CASTLE DOOM.",
    archiveTitle: "BEHIND<br /><em>the mask.</em>",
    archiveIntro:
      "A mind, a mask, a kingdom, a will.<br />Explore the world of Victor von Doom.",
    archiveEyebrow: "02 / THE LATVERIAN DOSSIERS",
    archiveEnd: "A WORLD<br />ON HIS <em>own terms.</em>",
    archiveButton: "OPEN THE DOSSIERS",
    chapterImage: tony,
    chapterEyebrow: "03 / A DIFFERENT KIND OF GENIUS",
    chapterTitle:
      "ANOTHER<br /><em>mind.</em><br />ANOTHER<br /><em>future.</em>",
    chapterCopy:
      "Genius can build a kingdom or change a life.<br />Return to the man behind the machine.",
    chapterButton: "RETURN TO TONY STARK",
    chapterTarget: 0,
    chapterCoordinate: "MALIBU / EVERY FUTURE BEGINS WITH A CHOICE.",
    alliesTitle: "POWER.<br /><em>Without compromise.</em>",
    allies: [
      "LATVERIA",
      "Victor von Doom",
      "SCIENCE",
      "Sorcery",
      "CASTLE DOOM",
    ],
    fan: [monarch, sorcery, supreme, stainedGlass, tapestry],
    legacyTitle: "The world in his <em>image.</em>",
    footerTitle: "A WORLD.<br /><em>A will.</em><br />DOOM.",
    footerImage: monarch,
    archive: [
      {
        mark: "THE MIND",
        name: "Victor von Doom.",
        year: "01",
        image: "doom-cinematic.webp",
        type: "DOSSIER / INTELLECT",
        power: "Scientific genius",
        system: "Victor von Doom",
        film: "Marvel Comics",
        description:
          "A brilliant scientific mind with an ambition to match. Victor von Doom sees knowledge as a route to absolute control, bringing the precision of a scientist to a vision that leaves little room for compromise.",
      },
      {
        mark: "THE MASK",
        name: "The face of power.",
        year: "02",
        image: "doom-throne.webp",
        type: "DOSSIER / IDENTITY",
        power: "Armored protection",
        system: "Doom’s design",
        film: "Marvel Comics",
        description:
          "Silver metal beneath an emerald hood. Doom’s mask conceals the man and amplifies the presence: a face made into a symbol, recognized long before a word is spoken.",
      },
      {
        mark: "LATVERIA",
        name: "A world of his own.",
        year: "03",
        image: "latveria.webp",
        type: "DOSSIER / KINGDOM",
        power: "Sovereignty",
        system: "Castle Doom",
        film: "Marvel Comics",
        description:
          "A kingdom in the shadow of its ruler. Latveria is the seat of Doom’s power, a landscape where the imposing walls of his castle and his vision of order are never far from view.",
      },
      {
        mark: "THE WILL",
        name: "On his own terms.",
        year: "04",
        image: "doom-sorcery.webp",
        type: "DOSSIER / AMBITION",
        power: "Science and sorcery",
        system: "Uncompromising will",
        film: "Marvel Comics",
        description:
          "Technology and mysticism meet in one relentless pursuit of power. For Doom, the limits others accept are merely challenges. The question is never whether the world can change, but who will decide its future.",
      },
      {
        mark: "THE MONARCH",
        name: "The seat of power.",
        year: "05",
        image: "doom-monarch.webp",
        type: "DOSSIER / SOVEREIGNTY",
        power: "Absolute authority",
        system: "Latveria",
        film: "Marvel Comics",
        description:
          "The throne is more than a seat. It is the center of a kingdom built around one uncompromising vision. Across the comic archive, Doom’s regal imagery joins armored precision with the weight of monarchy.",
      },
      {
        mark: "ONE WORLD",
        name: "An ambition without limits.",
        year: "06",
        image: "doom-supreme.webp",
        type: "DOSSIER / COMIC ARCHIVE",
        power: "Science and sorcery",
        system: "Victor von Doom",
        film: "One World Under Doom",
        description:
          "A visual from Marvel’s One World Under Doom comic event: the armored monarch elevated above an assembled world of heroes. An image of ambition at its most absolute, distinct from the cinematic interpretation.",
      },
    ],
  },
];

export function createPersonaExperience({
  gsap,
  reduced,
  onArchiveChange,
  refresh,
}) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  let revision = 0,
    transition;
  const groups = $$(
    ".manifesto-text,.memory-strip,.duality-card,.armory-heading,.doom-copy,.allies h2,.legacy h2,.legacy-fan,.footer-panel h2",
  );
  // Keep the two wipe nodes mounted so their scroll-bound animations survive identity changes.
  $(".manifesto-text").innerHTML = Array.from(
    { length: 8 },
    (_, i) =>
      `<span data-manifesto-line="${i}"><span${i === 2 ? ' class="wipe-word"' : ""}></span><em${i === 6 ? ' class="wipe-word"' : ""}></em></span>${i === 7 ? "" : "<br />"}`,
  ).join("");
  function setImage(el, asset) {
    el.src = asset.src;
    el.alt = asset.alt;
  }
  function apply(profile, index) {
    document.body.dataset.persona = String(index);
    document.title = profile.title;
    $('meta[name="theme-color"]').content = profile.colors["--ink"];
    $(".archive-link").innerHTML =
      `<span class="tiny-cross">＋</span> ${index === 0 ? "THE WORKSHOP" : index === 1 ? "THE ARMORY" : "THE DOSSIERS"}`;
    $(".armory .section-eyebrow>span:last-child").textContent =
      index === 2
        ? "SCIENCE. SORCERY. SOVEREIGNTY."
        : "DESIGNED. BUILT. REBUILT.";
    $(".duality").setAttribute(
      "aria-label",
      index === 2
        ? "The mind and the world"
        : index === 1
          ? "The suit and the pilot"
          : "The man and the idea",
    );
    $(".dialog-close").setAttribute("aria-label", "Close archive file");
    $(".file-prev").setAttribute("aria-label", "Previous archive file");
    $(".file-next").setAttribute("aria-label", "Next archive file");
    $(".wordmark>span").textContent = profile.short;
    $(".wordmark>b").textContent = profile.brand;
    $(".wordmark").setAttribute("aria-label", `${profile.name}, back to top`);
    $$(".monogram,.footer-tab").forEach(
      (el) => (el.textContent = profile.monogram),
    );
    $$(".hero-signature,.footer-signature").forEach(
      (el) => (el.textContent = profile.signature),
    );
    $$(".hero-marquee>div").forEach(
      (el, i) => (el.innerHTML = profile.marquee[i]),
    );
    $$(".hero-kicker>span").forEach(
      (el, i) => (el.textContent = profile.kicker[i]),
    );
    $("#page-title").textContent =
      `${profile.name}. The mind, the machine, the shadow.`;
    $$(".manifesto .section-eyebrow>span").forEach(
      (el, i) => (el.textContent = profile.eyebrow[i]),
    );
    profile.manifesto.forEach((line, i) => {
      const el = $(`[data-manifesto-line="${i}"]`);
      el.children[0].textContent = line[0];
      el.children[1].textContent = line[1];
    });
    $(".manifesto-note").textContent = profile.note;
    $$(".memory").forEach((el, i) => {
      setImage(el.querySelector("img"), profile.memories[i]);
      el.querySelector("figcaption").textContent = profile.captions[i];
    });
    $$(".duality-card").forEach((el, i) => {
      const [serif, plain, caption, asset] = profile.dual[i];
      el.querySelector("h2").innerHTML = `<em>${serif}</em><br />${plain}`;
      el.querySelector("div>span").textContent = caption;
      setImage(el.querySelector("img"), asset);
    });
    setImage($(".workshop-interlude img"), profile.interlude);
    $(".workshop-interlude>span").textContent = profile.interludeText;
    $("#armory-title").innerHTML = profile.archiveTitle;
    $(".armory-heading p").innerHTML = profile.archiveIntro;
    $(".armory .section-eyebrow>span").textContent = profile.archiveEyebrow;
    $(".armory-bottom h3").innerHTML = profile.archiveEnd;
    $("#explore-armor").innerHTML = `${profile.archiveButton}<span>↗</span>`;
    $(".armory-bottom>.micro").textContent =
      index === 1
        ? "( SELECT AN ARMOR TO OPEN ITS FILE )"
        : "( SELECT A FILE TO EXPLORE )";
    setImage($(".doom-photo img"), profile.chapterImage);
    $(".doom-copy>.micro").textContent = profile.chapterEyebrow;
    $("#doom-title").innerHTML = profile.chapterTitle;
    $(".doom-copy p").innerHTML = profile.chapterCopy;
    $(".doom-reveal").innerHTML = `${profile.chapterButton}<span>↗</span>`;
    $(".doom-reveal").dataset.target = profile.chapterTarget;
    $(".doom-coordinate").textContent = profile.chapterCoordinate;
    $("#allies-title").innerHTML = profile.alliesTitle;
    const affiliations = [...profile.allies, ...profile.allies];
    $(".allies-marquee>div").innerHTML = affiliations
      .map((word, i) => `<span${i % 2 ? ' class="serif"' : ""}>${word}</span>`)
      .join("");
    $(".allies-marquee").setAttribute(
      "aria-label",
      profile.allies.join(", ") + ". Focus or hover to pause.",
    );
    $(".allies>.micro").textContent =
      index === 2
        ? "A VISION THAT ANSWERS TO ONE."
        : "NO ONE BUILDS A LEGACY ALONE.";
    $$(".legacy-fan img").forEach((el, i) => setImage(el, profile.fan[i]));
    $("#legacy-title").innerHTML = profile.legacyTitle;
    $(".footer-panel h2").innerHTML = profile.footerTitle;
    setImage($(".footer-armor"), profile.footerImage);
    $(".footer-wordmark").innerHTML =
      `${profile.short}<em>${profile.brand}</em>`;
    $$(".armor-card.is-photo").forEach((el, i) => {
      const asset = profile.memories[i === 0 ? 0 : 4];
      setImage(el.querySelector("img"), asset);
      el.querySelector(".armor-caption>span").textContent =
        index === 2 ? "Latverian archive" : "Behind the story";
    });
    $(".file-nav>span").textContent = `${profile.name.toUpperCase()} / ARCHIVE`;
    $(".memory-label>span").textContent =
      `${profile.name.toUpperCase()} / PRIVATE ARCHIVE`;
    $(".menu-caption>span").textContent = profile.name.toUpperCase();
    const navigation = [
      ["man", "mind", "ideas", "suit"],
      ["machine", "purpose", "armor", "shadow"],
      ["monarch", "vision", "dossiers", "man"],
    ][index];
    $$(".menu-links a").forEach((el, i) => {
      el.innerHTML = `<sup>0${i + 1}</sup> The <em>${navigation[i]}.</em>`;
    });
    onArchiveChange(profile.archive, index);
    refresh();
  }
  return async function change(index, { immediate = false } = {}) {
    const ticket = ++revision,
      profile = personas[index];
    transition?.kill();
    gsap.killTweensOf(groups);
    const assets = [
      ...profile.dual.map((item) => item[3]),
      profile.chapterImage,
      profile.interlude,
      profile.footerImage,
    ];
    await Promise.allSettled(
      [...new Set(assets.map((a) => a.src))].map((src) => {
        const im = new Image();
        im.src = src;
        return im.decode();
      }),
    );
    if (ticket !== revision) return;
    if (immediate || reduced) {
      apply(profile, index);
      gsap.set(groups, { opacity: 1 });
      gsap.set(document.documentElement, profile.colors);
      return;
    }
    gsap.to(document.documentElement, {
      ...profile.colors,
      duration: 0.85,
      ease: "power2.inOut",
      overwrite: true,
    });
    transition = gsap
      .timeline()
      .to(groups, {
        opacity: 0,
        duration: 0.18,
        ease: "power1.in",
        overwrite: true,
      })
      .call(() => apply(profile, index))
      .to(groups, {
        opacity: 1,
        duration: 0.55,
        stagger: 0.015,
        ease: "power2.out",
      });
  };
}
