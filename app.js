const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const brand = document.querySelector(".brand");
const tabs = document.querySelectorAll(".tab");
const groups = document.querySelectorAll(".service-group");
const workTabs = document.querySelectorAll(".work-tab");
const workGroups = document.querySelectorAll(".work-group");
const briefForm = document.querySelector("#brief-form");
const whatsappButton = document.querySelector("#whatsapp-brief");
const emailButton = document.querySelector("#email-brief");
const packageButtons = document.querySelectorAll(".package-ask");
const missionOptions = document.querySelectorAll(".mission-option");
const modeToggle = document.querySelector("#mode-toggle");
const modeLabel = document.querySelector(".mode-label");
const galaxyCanvas = document.querySelector("#galaxy-canvas");
const planetCursor = document.querySelector("#planet-cursor");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

menuToggle?.addEventListener("click", () => {
  const open = body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

brand?.addEventListener("click", () => {
  body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
});

function setSiteMode(mode) {
  const isDay = mode === "day";
  body.classList.toggle("day-mode", isDay);
  modeToggle?.setAttribute("aria-pressed", String(isDay));
  modeToggle?.setAttribute("aria-label", isDay ? "Switch to night mode" : "Switch to day mode");

  if (modeLabel) {
    modeLabel.textContent = isDay ? "Day" : "Night";
  }

  try {
    localStorage.setItem("lmdp-mode", isDay ? "day" : "night");
  } catch {
    // The switch still works when storage is unavailable.
  }
}

let savedMode = "night";
try {
  savedMode = localStorage.getItem("lmdp-mode") || "night";
} catch {
  savedMode = "night";
}

setSiteMode(savedMode === "day" ? "day" : "night");

modeToggle?.addEventListener("click", () => {
  setSiteMode(body.classList.contains("day-mode") ? "night" : "day");
});

function activateServiceTab(tab) {
  const filter = tab.dataset.filter;

  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
  });

  groups.forEach((group) => {
    group.classList.toggle("is-hidden", group.dataset.category !== filter);
  });
}

tabs.forEach((tab) => {
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", () => activateServiceTab(tab));
});

const activeServiceTab = document.querySelector(".tab.is-active") || tabs[0];
if (activeServiceTab) activateServiceTab(activeServiceTab);

function activateWorkTab(tab) {
  const filter = tab.dataset.workFilter;

  workTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
  });

  workGroups.forEach((group) => {
    group.classList.toggle("is-hidden", group.dataset.workCategory !== filter);
  });
}

workTabs.forEach((tab) => {
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", () => activateWorkTab(tab));
});

const activeWorkTab = document.querySelector(".work-tab.is-active") || workTabs[0];
if (activeWorkTab) activateWorkTab(activeWorkTab);

function briefText() {
  if (!briefForm) return "I%20want%20to%20build%20something%20with%20LMDP.";

  const form = new FormData(briefForm);
  const name = form.get("name") || "Not provided";
  const service = form.get("service") || "Not selected";
  const budget = form.get("budget") || "Not provided";
  const message = form.get("message") || "I want to build something with LMDP.";

  return `LMDP project brief%0A%0AName: ${encodeURIComponent(name)}%0AService: ${encodeURIComponent(service)}%0ABudget: ${encodeURIComponent(budget)}%0AProject: ${encodeURIComponent(message)}`;
}

whatsappButton?.addEventListener("click", () => {
  window.location.href = `https://wa.me/15618972555?text=${briefText()}`;
});

emailButton?.addEventListener("click", () => {
  window.location.href = `mailto:losmasdurosdelplaneta.llc@gmail.com?subject=LMDP%20Project%20Brief&body=${briefText()}`;
});

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!briefForm) return;

    const service = briefForm.elements.service;
    const message = briefForm.elements.message;
    service.value = "Popular Package";
    message.value = `I want to ask about the ${button.dataset.package}.`;
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

missionOptions.forEach((button) => {
  button.addEventListener("click", () => {
    if (!briefForm) return;

    const service = briefForm.elements.service;
    const message = briefForm.elements.message;
    service.value = button.dataset.service || "Music Production";
    message.value = button.dataset.message || "I want to build something with LMDP.";
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setupGalaxy() {
  if (!galaxyCanvas) return;

  const context = galaxyCanvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let clouds = [];
  let comets = [];
  let frame = 0;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function cursorPush(x, y, range, strength) {
    if (!mouse.active || reduceMotion.matches) return { x: 0, y: 0, force: 0 };

    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const distance = Math.max(1, Math.hypot(dx, dy));

    if (distance > range) return { x: 0, y: 0, force: 0 };

    const force = (1 - distance / range) ** 1.7;
    return {
      x: (dx / distance) * force * strength,
      y: (dy / distance) * force * strength,
      force,
    };
  }

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    galaxyCanvas.width = Math.floor(width * pixelRatio);
    galaxyCanvas.height = Math.floor(height * pixelRatio);
    galaxyCanvas.style.width = `${width}px`;
    galaxyCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const starCount = Math.min(190, Math.max(80, Math.floor((width * height) / 5200)));
    stars = Array.from({ length: starCount }, () => ({
      x: random(0, width),
      y: random(0, height),
      radius: random(0.5, 1.8),
      alpha: random(0.28, 0.95),
      twinkle: random(0.001, 0.004),
      drift: random(-0.08, 0.08),
      hue: Math.random() > 0.76 ? "156, 210, 63" : "247, 247, 242",
    }));

    const cloudCount = Math.min(12, Math.max(6, Math.floor(width / 170)));
    clouds = Array.from({ length: cloudCount }, (_, index) => ({
      x: random(-120, width + 120),
      y: random(72, Math.max(180, height * 0.62)),
      width: random(150, 320),
      height: random(44, 92),
      speed: random(0.12, 0.36),
      alpha: random(0.42, 0.82),
      lift: random(-0.16, 0.16),
      phase: random(0, Math.PI * 2) + index,
    }));
  }

  function launchComet() {
    comets.push({
      x: random(width * 0.15, width * 0.95),
      y: random(-80, height * 0.35),
      length: random(80, 160),
      speed: random(4.2, 7.4),
      life: 0,
      maxLife: random(70, 120),
    });
  }

  function drawCursorGravity() {
    if (!mouse.active || reduceMotion.matches) return;

    const isDay = body.classList.contains("day-mode");
    const glow = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, isDay ? 230 : 190);
    glow.addColorStop(0, isDay ? "rgba(255, 255, 255, 0.38)" : "rgba(39, 183, 215, 0.14)");
    glow.addColorStop(0.42, isDay ? "rgba(116, 207, 255, 0.18)" : "rgba(156, 210, 63, 0.08)");
    glow.addColorStop(1, isDay ? "rgba(116, 207, 255, 0)" : "rgba(156, 210, 63, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(mouse.x, mouse.y, isDay ? 230 : 190, 0, Math.PI * 2);
    context.fill();
  }

  function drawStars() {
    stars.forEach((star, index) => {
      const pulse = reduceMotion.matches ? 0 : Math.sin(frame * star.twinkle + index) * 0.22;
      const push = cursorPush(star.x, star.y, 150, 42);
      const cursorBoost = push.force * 0.55;
      context.fillStyle = `rgba(${star.hue}, ${Math.min(1, star.alpha + pulse + cursorBoost)})`;
      context.beginPath();
      context.arc(star.x + push.x, star.y + push.y, star.radius + cursorBoost * 1.6, 0, Math.PI * 2);
      context.fill();

      if (!reduceMotion.matches) {
        star.x += star.drift;
        if (star.x < -4) star.x = width + 4;
        if (star.x > width + 4) star.x = -4;
      }
    });
  }

  function drawComets() {
    if (!reduceMotion.matches && Math.random() < 0.009 && comets.length < 3) {
      launchComet();
    }

    comets = comets.filter((comet) => comet.life < comet.maxLife);
    comets.forEach((comet) => {
      const endX = comet.x - comet.length;
      const endY = comet.y - comet.length * 0.38;
      const gradient = context.createLinearGradient(comet.x, comet.y, endX, endY);
      gradient.addColorStop(0, "rgba(183, 255, 24, 0.95)");
      gradient.addColorStop(0.28, "rgba(39, 183, 215, 0.42)");
      gradient.addColorStop(1, "rgba(39, 183, 215, 0)");
      context.strokeStyle = gradient;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(comet.x, comet.y);
      context.lineTo(endX, endY);
      context.stroke();
      context.fillStyle = "rgba(247, 247, 242, 0.95)";
      context.beginPath();
      context.arc(comet.x, comet.y, 2.2, 0, Math.PI * 2);
      context.fill();
      comet.x += comet.speed;
      comet.y += comet.speed * 0.38;
      comet.life += 1;
    });
  }

  function drawCloud(cloud) {
    const centerX = cloud.x + cloud.width * 0.5;
    const centerY = cloud.y + cloud.height * 0.5;
    const push = cursorPush(centerX, centerY, cloud.width * 0.74 + 130, 78);
    const bob = reduceMotion.matches ? 0 : Math.sin(frame * 0.012 + cloud.phase) * 3.2;
    const x = cloud.x + push.x;
    const y = cloud.y + push.y + bob;
    const w = cloud.width;
    const h = cloud.height;

    context.save();
    context.globalAlpha = Math.min(0.96, cloud.alpha + push.force * 0.18);

    const shadow = context.createLinearGradient(x, y, x, y + h * 1.4);
    shadow.addColorStop(0, "rgba(255, 255, 255, 0.92)");
    shadow.addColorStop(1, "rgba(198, 231, 246, 0.58)");
    context.fillStyle = shadow;

    context.beginPath();
    context.ellipse(x + w * 0.2, y + h * 0.6, w * 0.22, h * 0.42, 0, 0, Math.PI * 2);
    context.ellipse(x + w * 0.38, y + h * 0.38, w * 0.3, h * 0.58, 0, 0, Math.PI * 2);
    context.ellipse(x + w * 0.58, y + h * 0.48, w * 0.28, h * 0.48, 0, 0, Math.PI * 2);
    context.ellipse(x + w * 0.76, y + h * 0.62, w * 0.22, h * 0.36, 0, 0, Math.PI * 2);
    context.rect(x + w * 0.18, y + h * 0.5, w * 0.64, h * 0.42);
    context.fill();

    context.restore();

    if (!reduceMotion.matches) {
      cloud.x += cloud.speed;
      cloud.y += cloud.lift * 0.12;

      if (cloud.x > width + cloud.width + 80) {
        cloud.x = -cloud.width - random(40, 180);
        cloud.y = random(72, Math.max(180, height * 0.62));
      }
    }
  }

  function drawDaySky() {
    drawCursorGravity();
    clouds.forEach(drawCloud);
  }

  function drawNightSky() {
    drawCursorGravity();
    drawStars();
    drawComets();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    if (body.classList.contains("day-mode")) {
      drawDaySky();
    } else {
      drawNightSky();
    }

    frame += 1;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}

function setupPlanetCursor() {
  if (!planetCursor || !finePointer.matches || reduceMotion.matches || window.innerWidth < 760) return;

  const current = { x: -100, y: -100 };
  const target = { x: -100, y: -100 };
  let visible = false;

  body.classList.add("has-planet-cursor");

  window.addEventListener("pointermove", (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
    visible = true;
    planetCursor.style.opacity = "1";
  });

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
    visible = false;
    planetCursor.style.opacity = "0";
  });

  document.addEventListener("pointerdown", (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof Element)) return;

    if (!targetElement.closest("a, button, .tab, .work-tab, input, textarea, select")) return;

    planetCursor.classList.remove("is-clicking");
    void planetCursor.offsetWidth;
    planetCursor.classList.add("is-clicking");
    window.setTimeout(() => planetCursor.classList.remove("is-clicking"), 430);
  });

  document.addEventListener("pointerover", (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof Element)) return;
    planetCursor.classList.toggle("is-hovering", Boolean(targetElement.closest("a, button, .tab, .work-tab")));
    planetCursor.classList.toggle("is-typing", Boolean(targetElement.closest("input, textarea, select")));
  });

  function moveCursor() {
    current.x += (target.x - current.x) * 0.18;
    current.y += (target.y - current.y) * 0.18;
    planetCursor.style.transform = `translate3d(${current.x - 17}px, ${current.y - 17}px, 0)`;
    if (!visible) mouse.active = false;
    requestAnimationFrame(moveCursor);
  }

  requestAnimationFrame(moveCursor);
}

function setupScrollVideos() {
  const videos = document.querySelectorAll("[data-autoplay-video]");
  if (!videos.length) return;

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (!(video instanceof HTMLVideoElement)) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {
          video.controls = true;
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.48 });

  videos.forEach((video) => observer.observe(video));
}

setupGalaxy();
setupPlanetCursor();
setupScrollVideos();
