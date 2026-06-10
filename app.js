const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const tabs = document.querySelectorAll(".tab");
const groups = document.querySelectorAll(".service-group");
const briefForm = document.querySelector("#brief-form");
const whatsappButton = document.querySelector("#whatsapp-brief");
const emailButton = document.querySelector("#email-brief");
const packageButtons = document.querySelectorAll(".package-ask");
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

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    groups.forEach((group) => {
      group.classList.toggle("is-hidden", filter !== "all" && group.dataset.category !== filter);
    });
  });
});

function briefText() {
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
    const service = briefForm.elements.service;
    const message = briefForm.elements.message;
    service.value = "Popular Package";
    message.value = `I want to ask about the ${button.dataset.package}.`;
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
  let comets = [];
  let frame = 0;

  function random(min, max) {
    return min + Math.random() * (max - min);
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

    const glow = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
    glow.addColorStop(0, "rgba(39, 183, 215, 0.14)");
    glow.addColorStop(0.42, "rgba(156, 210, 63, 0.08)");
    glow.addColorStop(1, "rgba(156, 210, 63, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(mouse.x, mouse.y, 190, 0, Math.PI * 2);
    context.fill();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawCursorGravity();

    stars.forEach((star, index) => {
      const pulse = reduceMotion.matches ? 0 : Math.sin(frame * star.twinkle + index) * 0.22;
      const distance = Math.hypot(star.x - mouse.x, star.y - mouse.y);
      const cursorBoost = mouse.active && distance < 135 ? (1 - distance / 135) * 0.5 : 0;
      context.fillStyle = `rgba(${star.hue}, ${Math.min(1, star.alpha + pulse + cursorBoost)})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius + cursorBoost * 1.6, 0, Math.PI * 2);
      context.fill();

      if (!reduceMotion.matches) {
        star.x += star.drift;
        if (star.x < -4) star.x = width + 4;
        if (star.x > width + 4) star.x = -4;
      }
    });

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

  document.addEventListener("pointerover", (event) => {
    const targetElement = event.target;
    if (!(targetElement instanceof Element)) return;
    planetCursor.classList.toggle("is-hovering", Boolean(targetElement.closest("a, button, .tab")));
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

setupGalaxy();
setupPlanetCursor();
