/* ============================================================
   JAGAN PONUGUPATI — PORTFOLIO INTERACTIONS
   Total Concentration: Constant
   ============================================================ */

(() => {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- MODE (Pro 💼 / Slayer ⚔) + SCHEME (light / dark) ----------
     The inline <head> script already applied saved attributes pre-paint. */
  const toggle = document.getElementById("themeToggle");
  const schemeToggle = document.getElementById("schemeToggle");

  /* swap flavor copy between Slayer and Pro wording */
  function applyThemeText() {
    const theme = root.getAttribute("data-theme");
    document.querySelectorAll("[data-slayer]").forEach((el) => {
      el.textContent = theme === "slayer" ? el.dataset.slayer : el.dataset.corp;
    });
  }
  applyThemeText();

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "slayer" ? "corporate" : "slayer";
    root.setAttribute("data-theme", next);
    localStorage.setItem("jagan-theme", next);
    // until the user picks a scheme explicitly, each mode opens in its signature scheme
    if (!localStorage.getItem("jagan-scheme")) {
      root.setAttribute("data-scheme", next === "slayer" ? "dark" : "light");
    }
    applyThemeText();
    toggle.classList.add("pulse");
    setTimeout(() => toggle.classList.remove("pulse"), 600);
  });

  /* sun/moon swap is pure CSS via [data-scheme] — just flip the attribute */
  schemeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-scheme") === "dark" ? "light" : "dark";
    root.setAttribute("data-scheme", next);
    localStorage.setItem("jagan-scheme", next);
  });

  /* ---------- INTRO — energy core boot sequence ---------- */
  const intro = document.getElementById("introSlash");
  const ringEl = intro.querySelector(".core-ring");
  const pctEl = document.getElementById("introPct");
  const statusEl = document.getElementById("introStatus");
  const BOOT_STATUSES = [
    [0, "BOOTING"],
    [28, "LINKING DATA STREAMS"],
    [55, "CHARGING CORE"],
    [82, "FINALIZING"],
    [100, "ONLINE"],
  ];

  function finishIntro() {
    intro.classList.add("done"); // panels split open
    setTimeout(() => intro.classList.add("gone"), 850);
    setTimeout(() => intro.remove(), 1400);
  }

  if (prefersReducedMotion) {
    pctEl.textContent = "100";
    ringEl.style.setProperty("--p", 100);
    statusEl.textContent = "ONLINE";
    finishIntro();
  } else {
    const BOOT_MS = 2150;
    const t0 = performance.now();
    (function bootTick(now) {
      const p = Math.min((now - t0) / BOOT_MS, 1);
      const eased = 1 - Math.pow(1 - p, 2.4);
      const v = Math.round(eased * 100);
      pctEl.textContent = v;
      ringEl.style.setProperty("--p", v);
      for (const [at, label] of BOOT_STATUSES) {
        if (v >= at) statusEl.textContent = label;
      }
      if (p < 1) return requestAnimationFrame(bootTick);
      setTimeout(finishIntro, 320);
    })(t0);
  }

  /* ---------- TYPEWRITER ---------- */
  const roles = [
    "Azure Data Engineer",
    "Microsoft Fabric Engineer",
    "ETL / ELT Pipeline Builder",
    "Legacy ETL Slayer ⚔",
    "Data Netrunner 🌐",
    "Cloud Migration Engineer",
  ];
  const tw = document.getElementById("typewriter");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function activeRoles() {
    return root.getAttribute("data-theme") === "corporate"
      ? roles.filter((r) => !/Slayer|Netrunner/.test(r))
      : roles;
  }

  function typeLoop() {
    const list = activeRoles();
    const word = list[roleIdx % list.length];
    if (prefersReducedMotion) {
      tw.textContent = roles[0];
      return;
    }
    if (!deleting) {
      charIdx++;
      tw.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        return setTimeout(typeLoop, 1700);
      }
      return setTimeout(typeLoop, 55 + Math.random() * 50);
    }
    charIdx--;
    tw.textContent = word.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      return setTimeout(typeLoop, 350);
    }
    return setTimeout(typeLoop, 28);
  }
  setTimeout(typeLoop, 3000);

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .skill-card").forEach((el) => revealObserver.observe(el));

  /* ---------- STAT COUNTERS ---------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterObserver.unobserve(e.target);
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const dur = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".stat-num").forEach((el) => counterObserver.observe(el));

  /* ---------- ACTIVE NAV LINK ---------- */
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => s && navObserver.observe(s));

  /* ---------- NAV HIDE ON SCROLL DOWN ---------- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("hidden", y > 320 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navList.classList.toggle("open");
  });
  navList.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      hamburger.classList.remove("open");
      navList.classList.remove("open");
    }
  });

  /* ---------- MISSION CARD SPOTLIGHT ---------- */
  document.querySelectorAll(".mission-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  /* ---------- EMBER PARTICLES ---------- */
  const canvas = document.getElementById("embers");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const PALETTES = {
    slayer: {
      dark: [[255, 70, 85], [255, 43, 214], [0, 240, 255]],
      light: [[214, 31, 58], [194, 21, 160], [8, 148, 179]],
    },
    corporate: {
      dark: [[56, 182, 255], [0, 120, 212], [143, 211, 255]],
      light: [[0, 120, 212], [56, 182, 255], [140, 180, 230]],
    },
  };

  function spawn() {
    const isSlayer = root.getAttribute("data-theme") === "slayer";
    const scheme = root.getAttribute("data-scheme") === "dark" ? "dark" : "light";
    const palette = PALETTES[isSlayer ? "slayer" : "corporate"][scheme];
    const c = palette[(Math.random() * palette.length) | 0];
    return {
      x: Math.random() * W,
      y: H + 10 + Math.random() * 60,
      r: 0.8 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(0.35 + Math.random() * (isSlayer ? 1.1 : 0.55)),
      life: 0,
      maxLife: 360 + Math.random() * 300,
      sway: Math.random() * Math.PI * 2,
      color: c,
    };
  }

  const COUNT = prefersReducedMotion ? 0 : (window.innerWidth < 700 ? 28 : 60);
  for (let i = 0; i < COUNT; i++) {
    const p = spawn();
    p.y = Math.random() * H; // scatter initial positions
    particles.push(p);
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life++;
      p.sway += 0.02;
      p.x += p.vx + Math.sin(p.sway) * 0.25;
      p.y += p.vy;
      const fade = Math.min(p.life / 60, 1) * Math.max(1 - p.life / p.maxLife, 0);
      if (p.y < -20 || fade <= 0) {
        particles[i] = spawn();
        continue;
      }
      const [r, g, b] = p.color;
      // soft halo + bright core — much cheaper than canvas shadowBlur
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.12 * fade})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.55 * fade})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  if (COUNT > 0) requestAnimationFrame(frame);

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
