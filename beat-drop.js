const canvas = document.querySelector("#beat-canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.querySelector("#song-upload");
const audio = document.querySelector("#song-audio");
const fileStatus = document.querySelector("#file-status");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const newSongButton = document.querySelector("#new-song-button");
const playAgainButton = document.querySelector("#play-again");
const startOverlay = document.querySelector("#start-overlay");
const endScreen = document.querySelector("#end-screen");
const scoreValue = document.querySelector("#score-value");
const comboValue = document.querySelector("#combo-value");
const statusValue = document.querySelector("#status-value");
const finalScore = document.querySelector("#final-score");
const finalCombo = document.querySelector("#final-combo");

// Copy text
const copy = {
  ready: "Ready",
  load: "Load a song",
  playing: "Playing",
  paused: "Paused",
  duro: "DURO",
  onBeat: "ON BEAT",
  offBeat: "OFF BEAT",
  wait: "WAIT FOR DROP",
  ended: "Song complete"
};

// Routes/links live in index.html for simple static hosting.

// Audio threshold settings
const audioSettings = {
  bassThreshold: 0.34,
  bassPeakBoost: 0.16,
  minBassSpawnGap: 190,
  idleSpawnGap: 1120
};

// Game difficulty settings
const difficultySettings = {
  startSpeed: 2.25,
  maxSpeedBonus: 3.1,
  spawnGapReduction: 82,
  difficultyRampSeconds: 115
};

// Colors
const colors = {
  green: "#b7ff18",
  blue: "#27b7d7",
  pink: "#ff4fd8",
  purple: "#7b2cff",
  white: "#f7f7f2",
  black: "#020302"
};

let audioContext;
let sourceNode;
let analyser;
let frequencyData;
let audioUrl = "";
let animationFrame = 0;
let lastFrameTime = 0;
let lastBassSpawn = 0;
let lastIdleSpawn = 0;
let bassPulse = 0;
let running = false;
let paused = false;
let songLoaded = false;
let hasStarted = false;

const state = {
  score: 0,
  combo: 0,
  bestCombo: 0,
  misses: 0,
  planets: [],
  feedback: [],
  stars: []
};

function setStatus(text) {
  statusValue.textContent = text;
}

function updateHud() {
  scoreValue.textContent = String(state.score);
  comboValue.textContent = `${state.combo}x`;
  finalScore.textContent = `Score ${state.score}`;
  finalCombo.textContent = `Best Combo ${state.bestCombo}x`;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedStars();
}

function getCanvasSize() {
  const rect = canvas.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function seedStars() {
  const { width, height } = getCanvasSize();
  const count = Math.max(42, Math.floor((width * height) / 9200));
  state.stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.7 + 0.45,
    speed: Math.random() * 0.18 + 0.05,
    alpha: Math.random() * 0.55 + 0.25
  }));
}

function resetGame(keepSong = true) {
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.misses = 0;
  state.planets = [];
  state.feedback = [];
  lastFrameTime = 0;
  lastBassSpawn = 0;
  lastIdleSpawn = 0;
  bassPulse = 0;
  running = false;
  paused = false;
  hasStarted = false;
  document.body.classList.remove("is-bass-hit");
  pauseButton.textContent = "Pause";
  endScreen.hidden = true;
  startOverlay.classList.add("is-visible");
  updateHud();
  setStatus(keepSong && songLoaded ? copy.ready : copy.load);
  drawScene(0, 0);
}

function clearAudioUrl() {
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
    audioUrl = "";
  }
}

function handleFileUpload(file) {
  if (!file) return;
  clearAudioUrl();
  audioUrl = URL.createObjectURL(file);
  audio.src = audioUrl;
  songLoaded = true;
  fileStatus.textContent = file.name;
  startButton.disabled = false;
  restartButton.disabled = false;
  pauseButton.disabled = true;
  resetGame(true);
}

function ensureAudioGraph() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (!sourceNode) {
    sourceNode = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.74;
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
  }
}

function getBassEnergy() {
  if (!analyser || !frequencyData) return 0;
  analyser.getByteFrequencyData(frequencyData);

  let total = 0;
  const end = Math.min(26, frequencyData.length);
  for (let i = 2; i < end; i += 1) total += frequencyData[i];
  return total / ((end - 2) * 255);
}

function getDropZone(height) {
  const center = height * 0.78;
  const half = Math.max(34, height * 0.055);
  return { center, top: center - half, bottom: center + half, half };
}

function getDifficulty() {
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : difficultySettings.difficultyRampSeconds;
  const rampDuration = Math.min(duration, difficultySettings.difficultyRampSeconds);
  return Math.min(1, audio.currentTime / Math.max(1, rampDuration));
}

function spawnPlanet(isBassPlanet = false) {
  const { width, height } = getCanvasSize();
  const difficulty = getDifficulty();
  const radius = Math.max(16, Math.min(28, width * 0.035 + Math.random() * 7));
  const palette = isBassPlanet
    ? [colors.green, colors.blue, colors.pink]
    : [colors.blue, colors.purple, colors.green];

  state.planets.push({
    x: radius + Math.random() * Math.max(1, width - radius * 2),
    y: -radius - Math.random() * 60,
    radius,
    speed: difficultySettings.startSpeed + difficulty * difficultySettings.maxSpeedBonus + Math.random() * 0.85,
    color: palette[Math.floor(Math.random() * palette.length)],
    accent: palette[(Math.floor(Math.random() * palette.length) + 1) % palette.length],
    bassBorn: isBassPlanet,
    rotation: Math.random() * Math.PI,
    wobble: Math.random() * 2 + 1
  });
}

function addFeedback(text, x, y, kind = "good") {
  state.feedback.push({
    text,
    x,
    y,
    life: 1,
    kind
  });
  setStatus(text);
}

function scoreHit(planet, zone) {
  const accuracy = Math.abs(planet.y - zone.center) / zone.half;
  if (accuracy <= 0.32) {
    state.score += 100;
    state.combo += 1;
    addFeedback(copy.duro, planet.x, planet.y, "perfect");
  } else {
    state.score += 50;
    state.combo += 1;
    addFeedback(copy.onBeat, planet.x, planet.y, "good");
  }
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  updateHud();
}

function miss(x, y) {
  state.combo = 0;
  state.misses += 1;
  addFeedback(copy.offBeat, x, y, "miss");
  updateHud();
}

function handlePointer(event) {
  if (!running || paused) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { height } = getCanvasSize();
  const zone = getDropZone(height);

  let bestIndex = -1;
  let bestDistance = Infinity;
  state.planets.forEach((planet, index) => {
    const distance = Math.hypot(planet.x - x, planet.y - y);
    if (distance <= planet.radius * 1.35 && distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  if (bestIndex < 0) return;

  const planet = state.planets[bestIndex];
  if (planet.y >= zone.top && planet.y <= zone.bottom) {
    state.planets.splice(bestIndex, 1);
    scoreHit(planet, zone);
  } else {
    addFeedback(copy.wait, planet.x, planet.y, "wait");
  }
}

function drawBackground(width, height, bass) {
  const pulseSize = 180 + bassPulse * 220;
  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.8, 20, width * 0.5, height * 0.55, Math.max(width, height));
  gradient.addColorStop(0, `rgba(183, 255, 24, ${0.08 + bass * 0.08})`);
  gradient.addColorStop(0.34, `rgba(39, 183, 215, ${0.08 + bass * 0.1})`);
  gradient.addColorStop(0.72, "rgba(7, 8, 20, 0.96)");
  gradient.addColorStop(1, "#020302");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.2 + bassPulse * 0.24;
  ctx.fillStyle = colors.green;
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.78, pulseSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  state.stars.forEach((star) => {
    star.y += star.speed + bass * 0.25;
    if (star.y > height + 5) {
      star.y = -5;
      star.x = Math.random() * width;
    }
    ctx.globalAlpha = star.alpha + bassPulse * 0.35;
    ctx.fillStyle = colors.white;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size + bassPulse * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawDropZone(width, height, bass) {
  const zone = getDropZone(height);
  const glow = 18 + bassPulse * 34;
  ctx.save();
  ctx.shadowColor = colors.green;
  ctx.shadowBlur = glow;
  ctx.fillStyle = `rgba(183, 255, 24, ${0.08 + bass * 0.16})`;
  ctx.fillRect(0, zone.top, width, zone.bottom - zone.top);
  ctx.strokeStyle = `rgba(183, 255, 24, ${0.68 + bass * 0.2})`;
  ctx.lineWidth = 2 + bassPulse * 3;
  ctx.beginPath();
  ctx.moveTo(0, zone.center);
  ctx.lineTo(width, zone.center);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(247, 247, 242, 0.72)";
  ctx.font = "900 11px Arial";
  ctx.textAlign = "right";
  ctx.fillText("DROP ZONE", width - 16, zone.top - 10);
}

function drawPlanet(planet) {
  ctx.save();
  ctx.translate(planet.x, planet.y);
  ctx.rotate(planet.rotation);
  ctx.shadowColor = planet.bassBorn ? colors.green : planet.color;
  ctx.shadowBlur = planet.bassBorn ? 26 : 16;

  const gradient = ctx.createRadialGradient(-planet.radius * 0.32, -planet.radius * 0.36, 2, 0, 0, planet.radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.2, planet.color);
  gradient.addColorStop(0.72, planet.accent);
  gradient.addColorStop(1, "#071006");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(247, 247, 242, 0.34)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, planet.radius * 1.45, planet.radius * 0.32, 0.35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(2, 3, 2, 0.36)";
  ctx.beginPath();
  ctx.arc(planet.radius * 0.18, planet.radius * 0.18, planet.radius * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFeedback(delta) {
  state.feedback = state.feedback.filter((item) => item.life > 0);
  state.feedback.forEach((item) => {
    item.life -= delta * 0.00125;
    item.y -= delta * 0.045;
    ctx.save();
    ctx.globalAlpha = Math.max(0, item.life);
    ctx.font = "900 22px Impact, Arial Black, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = item.kind === "miss" ? colors.pink : item.kind === "wait" ? colors.blue : colors.green;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 16;
    ctx.fillText(item.text, item.x, item.y);
    ctx.restore();
  });
}

function drawScene(delta, bass) {
  const { width, height } = getCanvasSize();
  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height, bass);
  drawDropZone(width, height, bass);
  state.planets.forEach(drawPlanet);
  drawFeedback(delta);
}

function updatePlanets(delta) {
  const { height } = getCanvasSize();
  const zone = getDropZone(height);
  const scaledDelta = delta / 16.67;

  state.planets.forEach((planet) => {
    planet.y += planet.speed * scaledDelta;
    planet.rotation += 0.018 * planet.wobble * scaledDelta;
  });

  for (let i = state.planets.length - 1; i >= 0; i -= 1) {
    const planet = state.planets[i];
    if (planet.y - planet.radius > zone.bottom + 26) {
      state.planets.splice(i, 1);
      miss(planet.x, zone.center);
    }
  }
}

function maybeSpawnPlanets(timestamp, bass) {
  const difficulty = getDifficulty();
  const bassThreshold = audioSettings.bassThreshold + difficulty * 0.06;
  const bassGap = Math.max(92, audioSettings.minBassSpawnGap - difficulty * difficultySettings.spawnGapReduction);
  const idleGap = Math.max(520, audioSettings.idleSpawnGap - difficulty * 360);

  if (bass > bassThreshold && timestamp - lastBassSpawn > bassGap) {
    spawnPlanet(true);
    lastBassSpawn = timestamp;
    bassPulse = Math.min(1, bass + audioSettings.bassPeakBoost);
    document.body.classList.add("is-bass-hit");
    window.setTimeout(() => document.body.classList.remove("is-bass-hit"), 120);
  }

  if (timestamp - lastIdleSpawn > idleGap) {
    spawnPlanet(false);
    lastIdleSpawn = timestamp;
  }
}

function gameLoop(timestamp) {
  if (!running) return;
  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = Math.min(44, timestamp - lastFrameTime);
  lastFrameTime = timestamp;

  const bass = getBassEnergy();
  bassPulse += (bass - bassPulse) * 0.16;
  maybeSpawnPlanets(timestamp, bass);
  updatePlanets(delta);
  drawScene(delta, bass);
  animationFrame = requestAnimationFrame(gameLoop);
}

async function startGame() {
  if (!songLoaded) return;
  ensureAudioGraph();
  await audioContext.resume();

  if (!hasStarted) {
    audio.currentTime = 0;
    hasStarted = true;
  }

  endScreen.hidden = true;
  startOverlay.classList.remove("is-visible");
  running = true;
  paused = false;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  startButton.disabled = true;
  pauseButton.textContent = "Pause";
  setStatus(copy.playing);
  await audio.play();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (!running && !paused) return;

  if (!paused) {
    paused = true;
    running = false;
    audio.pause();
    cancelAnimationFrame(animationFrame);
    pauseButton.textContent = "Resume";
    setStatus(copy.paused);
  } else {
    paused = false;
    running = true;
    audio.play();
    pauseButton.textContent = "Pause";
    setStatus(copy.playing);
    lastFrameTime = 0;
    animationFrame = requestAnimationFrame(gameLoop);
  }
}

function restartGame() {
  if (!songLoaded) return;
  audio.pause();
  audio.currentTime = 0;
  resetGame(true);
  startGame();
}

function finishGame() {
  running = false;
  paused = false;
  cancelAnimationFrame(animationFrame);
  pauseButton.disabled = true;
  startButton.disabled = false;
  pauseButton.textContent = "Pause";
  setStatus(copy.ended);
  updateHud();
  endScreen.hidden = false;
}

function uploadNewSong() {
  audio.pause();
  clearAudioUrl();
  audio.removeAttribute("src");
  audio.load();
  songLoaded = false;
  fileInput.value = "";
  fileStatus.textContent = "No song loaded.";
  startButton.disabled = true;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  resetGame(false);
}

fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files || [];
  handleFileUpload(file);
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", restartGame);
newSongButton.addEventListener("click", () => {
  if (songLoaded) uploadNewSong();
  fileInput.click();
});
playAgainButton.addEventListener("click", restartGame);
audio.addEventListener("ended", finishGame);
canvas.addEventListener("pointerdown", handlePointer);
window.addEventListener("resize", resizeCanvas);
window.addEventListener("pagehide", () => {
  clearAudioUrl();
  cancelAnimationFrame(animationFrame);
});

resizeCanvas();
resetGame(false);
