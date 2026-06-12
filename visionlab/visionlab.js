const storageKey = "lmdp-visionlab-users";
const sessionKey = "lmdp-visionlab-session";
const themeKey = "lmdp-visionlab-theme";
const maxFeatured = 3;

const projectTypes = [
  "Song",
  "Music Video",
  "Photoshoot",
  "Cover Art",
  "Branding",
  "Website",
  "Social Media Content",
  "Marketing Campaign",
  "Event",
  "Custom Project",
];

const goals = [
  "Grow audience",
  "Launch music",
  "Promote business",
  "Create content",
  "Capture memories",
  "Increase sales",
  "Build a brand",
];

const colorTags = [
  { name: "Green", value: "#9cd23f" },
  { name: "Pink", value: "#ff4fd8" },
  { name: "Purple", value: "#9d6bff" },
  { name: "Blue", value: "#27b7d7" },
  { name: "Yellow", value: "#ffd95a" },
  { name: "Black", value: "#121212" },
];

const statusList = ["Draft", "In Progress", "Ready to Share"];

const demoProjects = [
  ["Summer Single", "Song"],
  ["Music Video Concept", "Music Video"],
  ["EP Rollout", "Marketing Campaign"],
  ["Business Rebrand", "Branding"],
  ["Website Redesign", "Website"],
  ["Merch Collection", "Custom Project"],
];

const iconByType = {
  Song: "M",
  "Music Video": "F",
  Photoshoot: "C",
  "Cover Art": "A",
  Branding: "B",
  Website: "W",
  "Social Media Content": "P",
  "Marketing Campaign": "R",
  Event: "E",
  "Custom Project": "L",
};

const authView = document.querySelector("[data-auth-view]");
const dashboardView = document.querySelector("[data-dashboard-view]");
const workspaceView = document.querySelector("[data-workspace-view]");
const signOutButton = document.querySelector("[data-sign-out]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const toast = document.querySelector("[data-toast]");
const authTabs = document.querySelectorAll("[data-auth-tab]");
const authForms = document.querySelectorAll("[data-auth-form]");
const authNote = document.querySelector("[data-auth-note]");
const projectGrid = document.querySelector("[data-project-grid]");
const featuredGrid = document.querySelector("[data-featured-grid]");
const featuredSection = document.querySelector("[data-featured-section]");
const featureCount = document.querySelector("[data-feature-count]");
const activityList = document.querySelector("[data-activity-list]");
const emptyState = document.querySelector("[data-empty-state]");
const projectSearch = document.querySelector("[data-project-search]");
const projectSort = document.querySelector("[data-project-sort]");
const projectModal = document.querySelector("[data-project-modal]");
const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectType = document.querySelector("[data-new-project-type]");
const moodCoverModal = document.querySelector("[data-mood-cover-modal]");
const moodCoverPicker = document.querySelector("[data-mood-cover-picker]");

const workspaceName = document.querySelector("[data-workspace-name]");
const workspaceType = document.querySelector("[data-workspace-type]");
const workspaceUpdated = document.querySelector("[data-workspace-updated]");
const projectHeader = document.querySelector("[data-project-header]");
const progressLabel = document.querySelector("[data-progress-label]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressList = document.querySelector("[data-progress-list]");
const coverPreview = document.querySelector("[data-cover-preview]");
const coverUpload = document.querySelector("[data-cover-upload]");
const coverDrop = document.querySelector("[data-cover-drop]");
const moodUpload = document.querySelector("[data-mood-upload]");
const moodDrop = document.querySelector("[data-mood-drop]");
const moodGrid = document.querySelector("[data-mood-grid]");
const imageCount = document.querySelector("[data-image-count]");
const referenceForm = document.querySelector("[data-reference-form]");
const referenceGrid = document.querySelector("[data-reference-grid]");
const referenceCount = document.querySelector("[data-reference-count]");
const reportOutput = document.querySelector("[data-report-output]");
const missionBadge = document.querySelector("[data-mission-badge]");

let users = loadUsers();
let currentUserEmail = loadSession();
let currentProjectId = null;
let toastTimer = null;

function now() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function hashPassword(value) {
  return btoa(unescape(encodeURIComponent(`lmdp:${value}:visionlab`)));
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveUsers() {
  localStorage.setItem(storageKey, JSON.stringify(users));
}

function loadSession() {
  try {
    return localStorage.getItem(sessionKey);
  } catch {
    return null;
  }
}

function saveSession(email) {
  if (email) {
    localStorage.setItem(sessionKey, email);
  } else {
    localStorage.removeItem(sessionKey);
  }
}

function currentUser() {
  return currentUserEmail ? users[currentUserEmail] : null;
}

function projects() {
  return currentUser()?.projects || [];
}

function currentProject() {
  return projects().find((project) => project.id === currentProjectId) || null;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function formatDate(value) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function timeAgo(value) {
  if (!value) return "Just now";
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day${hours >= 48 ? "s" : ""} ago`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function detectPlatform(url) {
  const lower = url.toLowerCase();
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("tiktok")) return "TikTok";
  if (lower.includes("youtube") || lower.includes("youtu.be")) return "YouTube";
  if (lower.includes("spotify")) return "Spotify";
  if (lower.includes("pinterest")) return "Pinterest";
  if (lower.includes("behance")) return "Behance";
  if (lower.includes("dribbble")) return "Dribbble";
  return "Reference";
}

function createActivity(message) {
  const user = currentUser();
  if (!user) return;
  user.activity = [{ id: uid("act"), message, date: now() }, ...(user.activity || [])].slice(0, 10);
}

function saveState(message) {
  const project = currentProject();
  if (project) project.updatedAt = now();
  if (message) createActivity(message);
  saveUsers();
  renderDashboard();
  renderWorkspace();
}

function defaultProject(name, type) {
  const date = now();
  return {
    id: uid("project"),
    name: name || "Untitled Project",
    type: type || "Custom Project",
    status: "Draft",
    color: colorTags[0].value,
    description: "",
    goal: goals[0],
    direction: "",
    brainDump: "",
    moodBoard: [],
    references: [],
    report: "",
    cover: { type: "default", data: "" },
    pinned: false,
    createdAt: date,
    updatedAt: date,
  };
}

function seedDemoProjects(user) {
  if (user.seeded) return;
  user.projects = demoProjects.map(([name, type], index) => ({
    ...defaultProject(name, type),
    id: uid("demo"),
    color: colorTags[index % colorTags.length].value,
    description: index < 3 ? "Example project to show how Vision Lab can organize creative ideas." : "",
    pinned: index < 3,
    updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));
  user.activity = [
    { id: uid("act"), message: "Created your Vision Lab workspace", date: now() },
    { id: uid("act"), message: "Pinned 3 example projects", date: now() },
  ];
  user.seeded = true;
}

function setView(view) {
  authView.classList.toggle("is-hidden", view !== "auth");
  dashboardView.classList.toggle("is-hidden", view !== "dashboard");
  workspaceView.classList.toggle("is-hidden", view !== "workspace");
  signOutButton.classList.toggle("is-hidden", view === "auth");
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  themeToggle.textContent = isLight ? "Day" : "Night";
  localStorage.setItem(themeKey, isLight ? "light" : "dark");
}

function fillSelects() {
  const typeOptions = projectTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");
  document.querySelectorAll("select[data-field='type'], [data-new-project-type]").forEach((select) => {
    select.innerHTML = typeOptions;
  });

  document.querySelector("select[data-field='goal']").innerHTML = goals.map((goal) => `<option value="${escapeHtml(goal)}">${escapeHtml(goal)}</option>`).join("");
  document.querySelector("select[data-field='color']").innerHTML = colorTags.map((tag) => `<option value="${tag.value}">${tag.name}</option>`).join("");
}

function coverMarkup(project) {
  const color = project.color || colorTags[0].value;
  const cover = project.cover || { type: "default", data: "" };
  const img = cover.type !== "default" && cover.data
    ? `<img src="${cover.data}" alt="${escapeHtml(project.name)} cover">`
    : "";
  const mark = iconByType[project.type] || "L";
  return `
    <div class="project-cover" style="--project-color: ${color}">
      ${img || `<div class="placeholder-cover"><span class="placeholder-mark">${mark}</span></div>`}
    </div>
  `;
}

function progressFor(project) {
  const checks = [
    ["Overview Complete", Boolean(project.name && project.type && project.description && project.goal)],
    ["Mood Board Complete", project.moodBoard.length > 0],
    ["References Complete", project.references.length > 0],
    ["Creative Direction Complete", Boolean(project.direction.trim())],
    ["Brain Dump Complete", Boolean(project.brainDump.trim())],
    ["Vision Report Generated", Boolean(project.report)],
  ];
  const completed = checks.filter(([, done]) => done).length;
  return { percent: Math.round((completed / checks.length) * 100), checks };
}

function projectCard(project, featured = false) {
  const progress = progressFor(project).percent;
  return `
    <article class="project-card" style="--project-color: ${project.color || colorTags[0].value}">
      ${coverMarkup(project)}
      <div class="project-body">
        <div class="project-meta">
          <span class="project-type">${escapeHtml(project.type)}</span>
          <span class="status-badge">${escapeHtml(project.status)}</span>
        </div>
        <h3>${escapeHtml(project.name)}</h3>
        <p class="project-updated">Last updated ${formatDate(project.updatedAt)}</p>
        <div class="project-progress">
          <small>${progress}% complete</small>
          <div class="progress-track"><span style="width: ${progress}%"></span></div>
        </div>
        <div class="project-card-actions">
          <button type="button" data-open-project="${project.id}">Open</button>
          <button type="button" data-pin-project="${project.id}">${project.pinned ? "Unpin" : "Pin"}</button>
          <button type="button" data-duplicate-project="${project.id}">Duplicate</button>
          ${featured ? "" : `<button type="button" data-delete-project="${project.id}">Delete</button>`}
        </div>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const user = currentUser();
  if (!user) return;
  const all = projects();
  const query = (projectSearch?.value || "").toLowerCase();
  const sort = projectSort?.value || "newest";
  let filtered = all.filter((project) => [project.name, project.type, project.status].some((value) => value.toLowerCase().includes(query)));

  filtered.sort((a, b) => {
    if (sort === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
    if (sort === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const pinned = all.filter((project) => project.pinned).slice(0, maxFeatured);
  emptyState.classList.toggle("is-hidden", all.length > 0);
  featuredSection.classList.toggle("is-hidden", pinned.length === 0);
  featureCount.textContent = `${pinned.length} / ${maxFeatured} pinned`;
  featuredGrid.innerHTML = pinned.map((project) => projectCard(project, true)).join("");
  projectGrid.innerHTML = filtered.map((project) => projectCard(project)).join("");
  activityList.innerHTML = (user.activity || []).length
    ? user.activity.map((item) => `<article class="activity-item"><p>${escapeHtml(item.message)}</p><span>${timeAgo(item.date)}</span></article>`).join("")
    : `<article class="activity-item"><p>No recent activity yet.</p><span>New</span></article>`;
}

function renderWorkspace() {
  const project = currentProject();
  if (!project || workspaceView.classList.contains("is-hidden")) return;
  const progress = progressFor(project);
  workspaceName.textContent = project.name;
  workspaceType.textContent = project.type;
  workspaceUpdated.textContent = `Last updated ${formatDate(project.updatedAt)}`;
  projectHeader.style.setProperty("--project-color", project.color || colorTags[0].value);
  progressLabel.textContent = `${progress.percent}%`;
  progressBar.style.width = `${progress.percent}%`;
  progressList.innerHTML = progress.checks
    .map(([label, done]) => `<li class="${done ? "is-complete" : ""}">${done ? "✓" : "•"} ${label}</li>`)
    .join("");
  coverPreview.innerHTML = coverMarkup(project);
  missionBadge.classList.toggle("is-hidden", project.status !== "Ready to Share");
  imageCount.textContent = `${project.moodBoard.length} image${project.moodBoard.length === 1 ? "" : "s"}`;
  referenceCount.textContent = `${project.references.length} reference${project.references.length === 1 ? "" : "s"}`;
  document.querySelectorAll("[data-field]").forEach((field) => {
    const key = field.dataset.field;
    if (document.activeElement !== field) field.value = project[key] || "";
  });
  renderMoodBoard(project);
  renderReferences(project);
  renderReport(project);
}

function renderMoodBoard(project) {
  moodGrid.innerHTML = project.moodBoard.length
    ? project.moodBoard.map((image, index) => `
      <article class="mood-item">
        <img src="${image.data}" alt="${escapeHtml(image.name || "Mood board image")}">
        <div class="mood-actions">
          <button type="button" data-move-image="${image.id}" data-direction="-1" ${index === 0 ? "disabled" : ""}>Left</button>
          <button type="button" data-move-image="${image.id}" data-direction="1" ${index === project.moodBoard.length - 1 ? "disabled" : ""}>Right</button>
          <button type="button" data-delete-image="${image.id}">Delete</button>
        </div>
      </article>
    `).join("")
    : `<p class="project-updated">No images yet. Add visual inspiration to build the world.</p>`;
}

function renderReferences(project) {
  referenceGrid.innerHTML = project.references.length
    ? project.references.map((reference) => `
      <article class="reference-card">
        <span>${escapeHtml(reference.platform)}</span>
        <a href="${escapeHtml(reference.url)}" target="_blank" rel="noreferrer">${escapeHtml(reference.url)}</a>
        <p>${escapeHtml(reference.note || "No note added.")}</p>
        <div class="project-card-actions">
          <button type="button" data-edit-reference="${reference.id}">Edit</button>
          <button type="button" data-delete-reference="${reference.id}">Delete</button>
        </div>
      </article>
    `).join("")
    : `<p class="project-updated">Add Instagram, TikTok, YouTube, Spotify, Pinterest, Behance, or Dribbble links.</p>`;
}

function renderReport(project) {
  if (!project.report) {
    reportOutput.innerHTML = `<p>Your professional creative brief will appear here.</p>`;
    return;
  }
  reportOutput.innerHTML = project.report;
}

function openProject(id) {
  currentProjectId = id;
  setView("workspace");
  renderWorkspace();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeWorkspace() {
  currentProjectId = null;
  setView("dashboard");
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function duplicateProject(id) {
  const user = currentUser();
  const source = projects().find((project) => project.id === id);
  if (!user || !source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.id = uid("project");
  copy.name = `${source.name} Copy`;
  copy.pinned = false;
  copy.status = "Draft";
  copy.createdAt = now();
  copy.updatedAt = now();
  user.projects.unshift(copy);
  saveState(`Duplicated ${source.name}`);
  showToast("Project duplicated.");
}

function deleteProject(id) {
  const user = currentUser();
  const project = projects().find((item) => item.id === id);
  if (!user || !project) return;
  if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
  user.projects = user.projects.filter((item) => item.id !== id);
  if (currentProjectId === id) closeWorkspace();
  createActivity(`Deleted ${project.name}`);
  saveUsers();
  renderDashboard();
  showToast("Project deleted.");
}

function togglePin(id) {
  const project = projects().find((item) => item.id === id);
  if (!project) return;
  const pinnedCount = projects().filter((item) => item.pinned).length;
  if (!project.pinned && pinnedCount >= maxFeatured) {
    showToast("You can pin up to 3 projects.");
    return;
  }
  project.pinned = !project.pinned;
  saveState(`${project.pinned ? "Pinned" : "Unpinned"} ${project.name}`);
}

function updateStatus(project) {
  if (project.status === "Ready to Share") return;
  const progress = progressFor(project).percent;
  project.status = progress >= 60 ? "In Progress" : "Draft";
}

function readFiles(files) {
  return Promise.all([...files].filter((file) => /image\/(jpeg|png|webp)/.test(file.type)).map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: uid("img"), name: file.name, data: reader.result, createdAt: now() });
    reader.readAsDataURL(file);
  })));
}

async function addMoodImages(files) {
  const project = currentProject();
  if (!project) return;
  const images = await readFiles(files);
  project.moodBoard.push(...images);
  if (project.cover.type === "default" && images[0]) project.cover = { type: "mood", data: images[0].data, moodId: images[0].id };
  updateStatus(project);
  saveState(`Added ${images.length} mood board image${images.length === 1 ? "" : "s"} to ${project.name}`);
}

async function setUploadedCover(files) {
  const project = currentProject();
  if (!project || !files?.length) return;
  const [image] = await readFiles(files);
  if (!image) return;
  project.cover = { type: "upload", data: image.data };
  saveState(`Updated cover for ${project.name}`);
}

function generateReport(project) {
  const brainSummary = project.brainDump.trim()
    ? project.brainDump.trim().split(/\s+/).slice(0, 54).join(" ") + (project.brainDump.trim().split(/\s+/).length > 54 ? "..." : "")
    : "No brain dump notes added yet.";
  return `
    <h3>Vision Report: ${escapeHtml(project.name)}</h3>
    <p><strong>Project Type:</strong> ${escapeHtml(project.type)}</p>
    <p><strong>Status:</strong> ${escapeHtml(project.status)}</p>
    <p><strong>Main Goal:</strong> ${escapeHtml(project.goal || "Not selected")}</p>
    <p><strong>Description:</strong> ${escapeHtml(project.description || "No description added yet.")}</p>
    <p><strong>Creative Direction:</strong> ${escapeHtml(project.direction || "No creative direction added yet.")}</p>
    <p><strong>Mood Board Image Count:</strong> ${project.moodBoard.length}</p>
    <p><strong>Reference Count:</strong> ${project.references.length}</p>
    <p><strong>Brain Dump Summary:</strong> ${escapeHtml(brainSummary)}</p>
    <h4>References</h4>
    <ul>
      ${project.references.length ? project.references.map((ref) => `<li><strong>${escapeHtml(ref.platform)}:</strong> ${escapeHtml(ref.url)} — ${escapeHtml(ref.note || "No note.")}</li>`).join("") : "<li>No references added yet.</li>"}
    </ul>
    <p><strong>LMDP Next Step:</strong> Review the vision, confirm creative direction, and discuss the services needed to bring it to life.</p>
  `;
}

function reportText(project) {
  const lines = [
    `Vision Report: ${project.name}`,
    `Project Type: ${project.type}`,
    `Status: ${project.status}`,
    `Main Goal: ${project.goal || "Not selected"}`,
    `Description: ${project.description || "No description added yet."}`,
    `Creative Direction: ${project.direction || "No creative direction added yet."}`,
    `Mood Board Image Count: ${project.moodBoard.length}`,
    `Reference Count: ${project.references.length}`,
    `Brain Dump: ${project.brainDump || "No brain dump notes added yet."}`,
    "",
    "References:",
    ...(project.references.length ? project.references.map((ref) => `- ${ref.platform}: ${ref.url} | ${ref.note || "No note."}`) : ["- No references added yet."]),
  ];
  return lines.join("\n");
}

function ensureReport(project) {
  if (!project.report) {
    project.report = generateReport(project);
    updateStatus(project);
    saveState(`Generated Vision Report for ${project.name}`);
  }
}

function initialize() {
  fillSelects();
  applyTheme(localStorage.getItem(themeKey) || "dark");

  if (currentUserEmail && users[currentUserEmail]) {
    setView("dashboard");
    renderDashboard();
  } else {
    currentUserEmail = null;
    saveSession(null);
    setView("auth");
  }
}

authTabs.forEach((button) => {
  button.addEventListener("click", () => {
    authTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
    authForms.forEach((form) => form.classList.toggle("is-hidden", form.dataset.authForm !== button.dataset.authTab));
  });
});

authForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const type = form.dataset.authForm;

    if (type === "create") {
      if (users[email]) {
        authNote.textContent = "That account already exists. Try signing in.";
        return;
      }
      users[email] = {
        email,
        name: String(data.get("name") || "Creator").trim(),
        passwordHash: hashPassword(password),
        projects: [],
        activity: [],
        createdAt: now(),
      };
      currentUserEmail = email;
      saveSession(email);
      saveUsers();
      setView("dashboard");
      renderDashboard();
      showToast("Workspace created.");
      return;
    }

    if (!users[email]) {
      authNote.textContent = "No account found with that email.";
      return;
    }

    if (type === "reset") {
      users[email].passwordHash = hashPassword(password);
      saveUsers();
      authNote.textContent = "Password reset. You can sign in now.";
      document.querySelector("[data-auth-tab='signin']").click();
      return;
    }

    if (users[email].passwordHash !== hashPassword(password)) {
      authNote.textContent = "Password does not match.";
      return;
    }

    currentUserEmail = email;
    saveSession(email);
    setView("dashboard");
    renderDashboard();
    showToast("Welcome back.");
  });
});

signOutButton.addEventListener("click", () => {
  currentUserEmail = null;
  currentProjectId = null;
  saveSession(null);
  setView("auth");
});

themeToggle.addEventListener("click", () => {
  applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
});

document.querySelectorAll("[data-open-new-project]").forEach((button) => {
  button.addEventListener("click", () => projectModal.showModal());
});

document.querySelector("[data-close-modal]").addEventListener("click", () => projectModal.close());

newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = currentUser();
  if (!user) return;
  const data = new FormData(newProjectForm);
  const project = defaultProject(String(data.get("name") || "").trim(), String(data.get("type") || "Custom Project"));
  user.projects.unshift(project);
  currentProjectId = project.id;
  createActivity(`Created ${project.name} project`);
  saveUsers();
  newProjectForm.reset();
  projectModal.close();
  setView("workspace");
  renderWorkspace();
});

projectSearch.addEventListener("input", renderDashboard);
projectSort.addEventListener("change", renderDashboard);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const openId = target.dataset.openProject;
  const pinId = target.dataset.pinProject;
  const duplicateId = target.dataset.duplicateProject || target.closest("[data-duplicate-current]")?.dataset.duplicateCurrent;
  const deleteId = target.dataset.deleteProject || target.closest("[data-delete-current]")?.dataset.deleteCurrent;

  if (openId) openProject(openId);
  if (pinId) togglePin(pinId);
  if (duplicateId) duplicateProject(duplicateId || currentProjectId);
  if (deleteId) deleteProject(deleteId || currentProjectId);
});

document.querySelector("[data-back-dashboard]").addEventListener("click", closeWorkspace);
document.querySelector("[data-duplicate-current]").addEventListener("click", () => duplicateProject(currentProjectId));
document.querySelector("[data-delete-current]").addEventListener("click", () => deleteProject(currentProjectId));

document.querySelectorAll("[data-field]").forEach((field) => {
  field.addEventListener("input", () => {
    const project = currentProject();
    if (!project) return;
    project[field.dataset.field] = field.value;
    if (field.dataset.field === "name") workspaceName.textContent = field.value || "Untitled Project";
    if (field.dataset.field === "type") workspaceType.textContent = field.value;
    updateStatus(project);
    saveUsers();
    renderDashboard();
    renderWorkspace();
  });
});

function attachDropZone(zone, input, handler) {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("is-dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-dragover");
    handler(event.dataTransfer.files);
  });
  input.addEventListener("change", () => handler(input.files));
}

attachDropZone(moodDrop, moodUpload, addMoodImages);
attachDropZone(coverDrop, coverUpload, setUploadedCover);

moodGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const project = currentProject();
  if (!project) return;

  const deleteId = target.dataset.deleteImage;
  const moveId = target.dataset.moveImage;
  if (deleteId) {
    project.moodBoard = project.moodBoard.filter((image) => image.id !== deleteId);
    if (project.cover.moodId === deleteId) project.cover = { type: "default", data: "" };
    updateStatus(project);
    saveState(`Deleted a mood board image from ${project.name}`);
  }

  if (moveId) {
    const index = project.moodBoard.findIndex((image) => image.id === moveId);
    const nextIndex = index + Number(target.dataset.direction || 0);
    if (index >= 0 && nextIndex >= 0 && nextIndex < project.moodBoard.length) {
      const [image] = project.moodBoard.splice(index, 1);
      project.moodBoard.splice(nextIndex, 0, image);
      saveState(`Rearranged mood board for ${project.name}`);
    }
  }
});

document.querySelector("[data-remove-cover]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  project.cover = { type: "default", data: "" };
  saveState(`Removed cover for ${project.name}`);
});

document.querySelector("[data-cover-from-mood]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  if (!project.moodBoard.length) {
    showToast("Add mood board images first.");
    return;
  }
  moodCoverPicker.innerHTML = project.moodBoard.map((image) => `
    <button class="mood-cover-choice" type="button" data-choose-cover="${image.id}">
      <img src="${image.data}" alt="${escapeHtml(image.name || "Mood board image")}">
    </button>
  `).join("");
  moodCoverModal.showModal();
});

document.querySelector("[data-close-mood-modal]").addEventListener("click", () => moodCoverModal.close());

moodCoverPicker.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target.closest("[data-choose-cover]") : null;
  const project = currentProject();
  if (!target || !project) return;
  const image = project.moodBoard.find((item) => item.id === target.dataset.chooseCover);
  if (!image) return;
  project.cover = { type: "mood", data: image.data, moodId: image.id };
  moodCoverModal.close();
  saveState(`Selected mood board cover for ${project.name}`);
});

referenceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = currentProject();
  if (!project) return;
  const data = new FormData(referenceForm);
  const url = normalizeUrl(String(data.get("url") || "").trim());
  const note = String(data.get("note") || "").trim();
  if (!url) return;
  project.references.push({ id: uid("ref"), url, note, platform: detectPlatform(url), createdAt: now() });
  referenceForm.reset();
  updateStatus(project);
  saveState(`Added a ${detectPlatform(url)} reference to ${project.name}`);
});

referenceGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const project = currentProject();
  if (!project) return;
  const editId = target.dataset.editReference;
  const deleteId = target.dataset.deleteReference;

  if (deleteId) {
    project.references = project.references.filter((reference) => reference.id !== deleteId);
    updateStatus(project);
    saveState(`Deleted a reference from ${project.name}`);
  }

  if (editId) {
    const reference = project.references.find((item) => item.id === editId);
    if (!reference) return;
    const note = prompt("Update reference note", reference.note);
    if (note === null) return;
    reference.note = note;
    saveState(`Updated a reference note in ${project.name}`);
  }
});

document.querySelector("[data-generate-report]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  project.report = generateReport(project);
  updateStatus(project);
  saveState(`Generated Vision Report for ${project.name}`);
  showToast("Vision Report generated.");
});

document.querySelector("[data-ready-share]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  ensureReport(project);
  project.status = "Ready to Share";
  project.report = generateReport(project);
  saveState(`${project.name} is ready to share with LMDP`);
  showToast("Mission ready.");
});

document.querySelector("[data-copy-report]").addEventListener("click", async () => {
  const project = currentProject();
  if (!project) return;
  ensureReport(project);
  await navigator.clipboard.writeText(reportText(project));
  showToast("Vision Report copied.");
});

document.querySelector("[data-download-pdf]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  ensureReport(project);
  window.print();
});

document.querySelector("[data-whatsapp-report]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  ensureReport(project);
  const message = encodeURIComponent(`Hello LMDP. I completed my Vision Lab project and would like to discuss bringing it to life.\n\nPlease review my Vision Report.\n\n${reportText(project)}`);
  window.location.href = `https://wa.me/15618972555?text=${message}`;
});

document.querySelector("[data-email-report]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  ensureReport(project);
  const subject = encodeURIComponent(`Vision Lab Report: ${project.name}`);
  const body = encodeURIComponent(`Hello LMDP,\n\nI completed my Vision Lab project and would like to discuss bringing it to life.\n\nPlease review my Vision Report.\n\n${reportText(project)}`);
  window.location.href = `mailto:losmasdurosdelplaneta.llc@gmail.com?subject=${subject}&body=${body}`;
});

initialize();
