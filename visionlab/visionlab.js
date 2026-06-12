const storageKey = "lmdp-visionlab-users";
const sessionKey = "lmdp-visionlab-session";
const themeKey = "lmdp-visionlab-theme";
const languageKey = "lmdp-visionlab-language";
const maxFeatured = 3;

const supabaseSettings = window.LMDP_SUPABASE_CONFIG || {};
const supabaseClient = window.supabase && supabaseSettings.url && supabaseSettings.anonKey
  ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey)
  : null;
const isSupabaseEnabled = Boolean(supabaseClient);
const moodBucket = supabaseSettings.moodBucket || "visionlab-moodboards";

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
  { name: "Lime", value: "#b7ff18" },
  { name: "Teal", value: "#22d3c5" },
  { name: "Pink", value: "#ff4fd8" },
  { name: "Purple", value: "#9d6bff" },
  { name: "Blue", value: "#27b7d7" },
  { name: "Sky", value: "#38bdf8" },
  { name: "Yellow", value: "#ffd95a" },
  { name: "Gold", value: "#d6b351" },
  { name: "Orange", value: "#ff8a3d" },
  { name: "Red", value: "#ff4b4b" },
  { name: "Silver", value: "#aab3bd" },
  { name: "White", value: "#f7f7f2" },
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
const modeLabel = document.querySelector(".mode-label");
const languageButtons = document.querySelectorAll("[data-language]");
const passwordToggles = document.querySelectorAll("[data-toggle-password]");
const guestAccessButton = document.querySelector("[data-guest-access]");
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
const feedbackModal = document.querySelector("[data-feedback-modal]");
const feedbackForm = document.querySelector("[data-feedback-form]");
const backTopButton = document.querySelector("[data-back-top]");

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
const reportLoading = document.querySelector("[data-report-loading]");
const reportLoadingBar = document.querySelector("[data-report-loading-bar]");
const missionBadge = document.querySelector("[data-mission-badge]");

let users = loadUsers();
let currentUserEmail = loadSession();
let supabaseSession = null;
let currentProjectId = null;
let toastTimer = null;
let activeLanguage = localStorage.getItem(languageKey) || "en";
let reportIsGenerating = false;

const es = {
  "Back To Main Website": "Volver al sitio principal",
  "Night": "Noche",
  "Day": "Dia",
  "Sign Out": "Cerrar sesion",
  "Beta": "Beta",
  "Feedback": "Feedback",
  "Creative headquarters": "Centro creativo",
  "Organize your ideas. Build your vision. Bring it to life.": "Organiza tus ideas. Construye tu vision. Hazla realidad.",
  "Vision Lab helps artists, brands, businesses, and creators gather inspiration, plan projects, generate a clean creative brief, and send the vision to LMDP.": "Vision Lab ayuda a artistas, marcas, negocios y creadores a reunir inspiracion, planificar proyectos, generar un brief creativo y enviar la vision a LMDP.",
  "Project boards": "Tableros de proyecto",
  "Mood boards": "Mood boards",
  "Reference links": "Referencias",
  "Vision reports": "Reportes de vision",
  "Sign In": "Iniciar sesion",
  "Create Account": "Crear cuenta",
  "Reset Password": "Restablecer clave",
  "Email": "Correo",
  "Password": "Clave",
  "New Password": "Nueva clave",
  "Name": "Nombre",
  "Show": "Ver",
  "Hide": "Ocultar",
  "Enter Vision Lab": "Entrar a Vision Lab",
  "Create My Workspace": "Crear mi espacio",
  "Continue As Guest": "Continuar como invitado",
  "Your workspace saves privately in this browser until LMDP connects live account storage.": "Tu espacio se guarda en este navegador hasta que LMDP active el almacenamiento en vivo.",
  "My Projects": "Mis proyectos",
  "New Project": "Nuevo proyecto",
  "Welcome to Vision Lab.": "Bienvenido a Vision Lab.",
  "This is where ideas become reality. Create your first project and start building your vision.": "Aqui las ideas se vuelven realidad. Crea tu primer proyecto y empieza a construir tu vision.",
  "Create First Project": "Crear primer proyecto",
  "Featured Projects": "Proyectos destacados",
  "Pinned for quick access": "Fijados para acceso rapido",
  "Search projects": "Buscar proyectos",
  "Sort": "Ordenar",
  "Newest": "Mas recientes",
  "Oldest": "Mas antiguos",
  "Project Type": "Tipo de proyecto",
  "Recent Activity": "Actividad reciente",
  "Workspace pulse": "Movimiento del espacio",
  "Back To My Projects": "Volver a mis proyectos",
  "Project Workspace": "Espacio del proyecto",
  "Auto-save enabled": "Auto-guardado activo",
  "Duplicate": "Duplicar",
  "Delete": "Eliminar",
  "Project Cover": "Portada del proyecto",
  "Overview": "Resumen",
  "Mood Board": "Mood Board",
  "Reference Links": "Links de referencia",
  "Creative Direction": "Direccion creativa",
  "Brain Dump": "Descarga de ideas",
  "Vision Report": "Reporte de vision",
  "Future Tools": "Herramientas futuras",
  "Project Progress": "Progreso del proyecto",
  "Set the visual world.": "Define el mundo visual.",
  "Remove Cover": "Quitar portada",
  "Upload new cover": "Subir portada",
  "Drop a JPG, PNG, or WEBP here.": "Suelta un JPG, PNG o WEBP aqui.",
  "Select image from Mood Board": "Elegir imagen del Mood Board",
  "Every project gets a cover so your dashboard feels like a creative portfolio board.": "Cada proyecto tiene portada para que tu tablero se sienta como un portafolio creativo.",
  "Section 1": "Seccion 1",
  "Project Overview": "Resumen del proyecto",
  "Project Name": "Nombre del proyecto",
  "Main Goal": "Meta principal",
  "Project Color": "Color del proyecto",
  "Short Description": "Descripcion corta",
  "Collect the visual feeling.": "Reune la vibra visual.",
  "Drag and drop images here": "Arrastra imagenes aqui",
  "Upload multiple JPG, PNG, or WEBP files.": "Sube varios archivos JPG, PNG o WEBP.",
  "Section 3": "Seccion 3",
  "Link URL": "URL del link",
  "Note": "Nota",
  "Add Reference": "Agregar referencia",
  "Section 4": "Seccion 4",
  "Section 5": "Seccion 5",
  "Unlimited notes": "Notas ilimitadas",
  "Section 6-8": "Seccion 6-8",
  "Project Summary Generator": "Generador de resumen",
  "Generate Vision Report": "Generar reporte",
  "Mark As Ready To Share": "Marcar listo para compartir",
  "Copy Summary": "Copiar resumen",
  "Download PDF": "Descargar PDF",
  "Send to WhatsApp": "Enviar por WhatsApp",
  "Send via Email": "Enviar por email",
  "Generating Vision Report": "Generando reporte",
  "MISSION READY": "MISION LISTA",
  "Coming Soon": "Proximamente",
  "Voice Notes": "Notas de voz",
  "AI Creative Assistant": "Asistente creativo AI",
  "Project Tracking": "Seguimiento de proyecto",
  "Client Portal": "Portal de cliente",
  "File Delivery": "Entrega de archivos",
  "Revisions": "Revisiones",
  "Create your next vision.": "Crea tu proxima vision.",
  "Create Project": "Crear proyecto",
  "Mood Board Cover": "Portada del Mood Board",
  "Choose a cover image.": "Elige una portada.",
  "Vision Lab Beta": "Vision Lab Beta",
  "Help us improve.": "Ayudanos a mejorar.",
  "Tell us what would make Vision Lab smoother for your creative process.": "Dinos que haria Vision Lab mas comodo para tu proceso creativo.",
  "Send Feedback": "Enviar feedback",
  "Close modal": "Cerrar ventana",
  "Song": "Cancion",
  "Music Video": "Video musical",
  "Photoshoot": "Sesion de fotos",
  "Cover Art": "Cover art",
  "Branding": "Branding",
  "Website": "Website",
  "Social Media Content": "Contenido para redes",
  "Marketing Campaign": "Campana de marketing",
  "Event": "Evento",
  "Custom Project": "Proyecto custom",
  "Grow audience": "Crecer audiencia",
  "Launch music": "Lanzar musica",
  "Promote business": "Promover negocio",
  "Create content": "Crear contenido",
  "Capture memories": "Capturar memorias",
  "Increase sales": "Aumentar ventas",
  "Build a brand": "Construir una marca",
  "Open": "Abrir",
  "Pin": "Fijar",
  "Unpin": "Quitar",
  "Last updated": "Actualizado",
  "complete": "completo",
  "pinned": "fijados",
  "image": "imagen",
  "images": "imagenes",
  "reference": "referencia",
  "references": "referencias",
  "Overview Complete": "Resumen completo",
  "Mood Board Complete": "Mood Board completo",
  "References Complete": "Referencias completas",
  "Creative Direction Complete": "Direccion creativa completa",
  "Brain Dump Complete": "Descarga de ideas completa",
  "Vision Report Generated": "Reporte generado",
  "Live Vision Draft": "Borrador de vision",
  "Vision Report": "Reporte de vision",
  "Status": "Estado",
  "Description": "Descripcion",
  "Mood Board Image Count": "Cantidad de imagenes",
  "Reference Count": "Cantidad de referencias",
  "Brain Dump Summary": "Resumen de ideas",
  "References": "Referencias",
  "LMDP Next Step": "Proximo paso con LMDP",
  "Review the vision, confirm creative direction, and discuss the services needed to bring it to life.": "Revisar la vision, confirmar la direccion creativa y conversar sobre los servicios necesarios para hacerla realidad.",
  "No brain dump notes added yet.": "Todavia no hay notas.",
  "Not selected": "No seleccionado",
  "No description added yet.": "Todavia no hay descripcion.",
  "No creative direction added yet.": "Todavia no hay direccion creativa.",
  "No references added yet.": "Todavia no hay referencias.",
  "No note.": "Sin nota.",
  "Draft": "Borrador",
  "In Progress": "En progreso",
  "Ready to Share": "Listo para compartir",
  "Green": "Verde",
  "Lime": "Lima",
  "Teal": "Teal",
  "Pink": "Rosado",
  "Purple": "Morado",
  "Blue": "Azul",
  "Sky": "Cielo",
  "Yellow": "Amarillo",
  "Gold": "Dorado",
  "Orange": "Naranja",
  "Red": "Rojo",
  "Silver": "Plata",
  "White": "Blanco",
  "Black": "Negro",
  "Left": "Izquierda",
  "Right": "Derecha",
  "Edit": "Editar",
  "No recent activity yet.": "Todavia no hay actividad.",
  "New": "Nuevo",
  "No images yet. Add visual inspiration to build the world.": "Todavia no hay imagenes. Agrega inspiracion visual para construir el mundo.",
  "Add Instagram, TikTok, YouTube, Spotify, Pinterest, Behance, or Dribbble links.": "Agrega links de Instagram, TikTok, YouTube, Spotify, Pinterest, Behance o Dribbble.",
  "No note added.": "Sin nota.",
  "Your professional creative brief will appear here.": "Tu brief creativo profesional aparecera aqui.",
  "Live draft updates as you work. Press Generate Vision Report to finalize it.": "El borrador se actualiza mientras trabajas. Presiona Generar reporte para finalizarlo.",
  "Show password": "Mostrar clave",
  "Hide password": "Ocultar clave",
  "Back to top": "Volver arriba",
  "Top": "Arriba",
  "Workspace created.": "Espacio creado.",
  "Welcome back.": "Bienvenido de vuelta.",
  "Password reset email sent. Check your inbox.": "Email de restablecimiento enviado. Revisa tu correo.",
  "Vision Report generated.": "Reporte generado.",
  "That account already exists. Try signing in.": "Esa cuenta ya existe. Intenta iniciar sesion.",
  "No account found with that email.": "No encontramos una cuenta con ese correo.",
  "Password reset. You can sign in now.": "Clave actualizada. Ya puedes iniciar sesion.",
  "Password does not match.": "La clave no coincide.",
  "Image uploaded and visible in Mood Board.": "Imagen subida y visible en el Mood Board.",
  "Cover uploaded and visible.": "Portada subida y visible.",
  "Feedback sent to WhatsApp.": "Feedback enviado por WhatsApp.",
  "Guest workspace started.": "Espacio de invitado iniciado.",
};

function now() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function recordId(prefix = "id") {
  return isSupabaseEnabled && crypto.randomUUID ? crypto.randomUUID() : uid(prefix);
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

function ensureLocalUser(email, name = "Creator", id = "") {
  if (!users[email]) {
    users[email] = {
      id,
      email,
      name,
      passwordHash: "",
      projects: [],
      activity: [],
      createdAt: now(),
    };
  }
  if (id) users[email].id = id;
  if (name) users[email].name = name;
  return users[email];
}

function currentSupabaseUserId() {
  return supabaseSession?.user?.id || currentUser()?.id || "";
}

function dbProjectToApp(row, moodImages = [], references = []) {
  return {
    id: row.id,
    name: row.name || "Untitled Project",
    type: row.type || "Custom Project",
    status: row.status || "Draft",
    color: row.color || colorTags[0].value,
    description: row.description || "",
    goal: row.goal || goals[0],
    direction: row.direction || "",
    brainDump: row.brain_dump || "",
    moodBoard: moodImages
      .filter((image) => image.project_id === row.id)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((image) => ({
        id: image.id,
        name: image.name,
        data: image.url,
        url: image.url,
        path: image.path,
        createdAt: image.created_at,
      })),
    references: references
      .filter((reference) => reference.project_id === row.id)
      .map((reference) => ({
        id: reference.id,
        url: reference.url,
        note: reference.note,
        platform: reference.platform,
        thumbnail: reference.thumbnail || referenceThumbnail(reference.url, reference.platform),
        createdAt: reference.created_at,
      })),
    report: row.report || "",
    cover: row.cover || { type: "default", data: "" },
    pinned: Boolean(row.pinned),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function appProjectToDb(project) {
  return {
    id: project.id,
    user_id: currentSupabaseUserId(),
    name: project.name || "Untitled Project",
    type: project.type || "Custom Project",
    status: project.status || "Draft",
    color: project.color || colorTags[0].value,
    description: project.description || "",
    goal: project.goal || goals[0],
    direction: project.direction || "",
    brain_dump: project.brainDump || "",
    report: project.report || "",
    cover: project.cover || { type: "default", data: "" },
    pinned: Boolean(project.pinned),
    created_at: project.createdAt || now(),
    updated_at: project.updatedAt || now(),
  };
}

async function loadSupabaseWorkspace(session) {
  if (!isSupabaseEnabled || !session?.user) return;
  supabaseSession = session;
  const email = session.user.email.toLowerCase();
  const user = ensureLocalUser(email, session.user.user_metadata?.name || "Creator", session.user.id);

  const [{ data: projectRows, error: projectError }, { data: imageRows, error: imageError }, { data: referenceRows, error: referenceError }, { data: activityRows }] = await Promise.all([
    supabaseClient.from("vision_projects").select("*").order("updated_at", { ascending: false }),
    supabaseClient.from("vision_mood_images").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("vision_references").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("vision_activity").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  if (projectError || imageError || referenceError) {
    showToast("Supabase setup needs the Vision Lab SQL schema.");
    console.warn("Vision Lab Supabase load error", projectError || imageError || referenceError);
    return;
  }

  user.projects = (projectRows || []).map((project) => dbProjectToApp(project, imageRows || [], referenceRows || []));
  user.activity = (activityRows || []).map((item) => ({
    id: item.id,
    message: item.message,
    date: item.created_at,
  }));
  users[email] = user;
  currentUserEmail = email;
  saveSession(email);
  saveUsers();
}

async function syncProject(project) {
  if (!isSupabaseEnabled || !supabaseSession?.user || !project) return;
  const { error } = await supabaseClient.from("vision_projects").upsert(appProjectToDb(project));
  if (error) {
    console.warn("Vision Lab project sync error", error);
    showToast("Project saved locally. Supabase sync needs attention.");
  }
}

async function syncActivity(message, projectId = null) {
  if (!isSupabaseEnabled || !supabaseSession?.user || !message) return;
  await supabaseClient.from("vision_activity").insert({
    user_id: currentSupabaseUserId(),
    project_id: projectId,
    message,
  });
}

async function deleteSupabaseProject(id) {
  if (!isSupabaseEnabled || !supabaseSession?.user || !id) return;
  await supabaseClient.from("vision_projects").delete().eq("id", id);
}

async function uploadVisionImage(file, folder = "mood") {
  if (!isSupabaseEnabled || !supabaseSession?.user) return null;
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `${currentSupabaseUserId()}/${folder}/${uid("file")}-${safeName}`;
  const { error } = await supabaseClient.storage.from(moodBucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) {
    console.warn("Vision Lab upload error", error);
    showToast("Image saved locally. Supabase upload needs attention.");
    return null;
  }
  const { data } = supabaseClient.storage.from(moodBucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
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

function t(value) {
  return activeLanguage === "es" ? (es[value] || value) : value;
}

function applyLanguage(language) {
  activeLanguage = language;
  localStorage.setItem(languageKey, language);
  document.documentElement.lang = language;
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  translateStaticText();
  updateThemeLabel();
  fillSelects();
  renderDashboard();
  renderWorkspace();
}

function translateStaticText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "OPTION"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!node.__originalText) node.__originalText = node.nodeValue;
    const trimmed = node.__originalText.trim();
    node.nodeValue = node.__originalText.replace(trimmed, t(trimmed));
  });

  document.querySelectorAll("[placeholder], [aria-label]").forEach((element) => {
    ["placeholder", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const originalAttribute = `data-original-${attribute}`;
      if (!element.hasAttribute(originalAttribute)) element.setAttribute(originalAttribute, element.getAttribute(attribute));
      element.setAttribute(attribute, t(element.getAttribute(originalAttribute)));
    });
  });
}

function normalizeUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "reference";
  }
}

function youtubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
    const parts = parsed.pathname.split("/").filter(Boolean);
    const embedIndex = parts.findIndex((part) => ["embed", "shorts"].includes(part));
    return embedIndex >= 0 ? parts[embedIndex + 1] || "" : "";
  } catch {
    return "";
  }
}

function referenceThumbnail(url, platform) {
  const id = youtubeId(url);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  if (platform === "Spotify") return "";
  return "";
}

function referenceThumbMarkup(reference) {
  if (reference.thumbnail) {
    return `<div class="reference-thumb"><img src="${escapeHtml(reference.thumbnail)}" alt="${escapeHtml(reference.platform)} thumbnail"></div>`;
  }
  return `
    <div class="reference-thumb reference-thumb-placeholder">
      <strong>${escapeHtml((reference.platform || "R").slice(0, 1))}</strong>
      <small>${escapeHtml(domainFromUrl(reference.url))}</small>
    </div>
  `;
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
  syncActivity(message, currentProjectId);
}

function saveState(message) {
  const project = currentProject();
  if (project) {
    if (project.report) project.report = generateReport(project);
    project.updatedAt = now();
  }
  if (message) createActivity(message);
  saveUsers();
  syncProject(project);
  renderDashboard();
  renderWorkspace();
}

function defaultProject(name, type) {
  const date = now();
  return {
    id: recordId("project"),
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
  themeToggle.setAttribute("aria-pressed", String(isLight));
  updateThemeLabel();
  localStorage.setItem(themeKey, isLight ? "light" : "dark");
}

function updateThemeLabel() {
  if (modeLabel) modeLabel.textContent = document.body.classList.contains("light-mode") ? t("Day") : t("Night");
}

function fillSelects() {
  const typeOptions = projectTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(t(type))}</option>`).join("");
  document.querySelectorAll("select[data-field='type'], [data-new-project-type]").forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = typeOptions;
    if (currentValue) select.value = currentValue;
  });

  const goalSelect = document.querySelector("select[data-field='goal']");
  const goalValue = goalSelect.value;
  goalSelect.innerHTML = goals.map((goal) => `<option value="${escapeHtml(goal)}">${escapeHtml(t(goal))}</option>`).join("");
  if (goalValue) goalSelect.value = goalValue;

  const colorSelect = document.querySelector("select[data-field='color']");
  const colorValue = colorSelect.value;
  colorSelect.innerHTML = colorTags.map((tag) => `<option value="${tag.value}">${escapeHtml(t(tag.name))}</option>`).join("");
  if (colorValue) colorSelect.value = colorValue;
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
    ["Overview Complete", Boolean(project.name && project.type && project.description && project.goal), "project-overview"],
    ["Mood Board Complete", project.moodBoard.length > 0, "mood-board"],
    ["References Complete", project.references.length > 0, "reference-links"],
    ["Creative Direction Complete", Boolean(project.direction.trim()), "creative-direction"],
    ["Brain Dump Complete", Boolean(project.brainDump.trim()), "brain-dump"],
    ["Vision Report Generated", Boolean(project.report), "vision-report"],
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
          <span class="project-type">${escapeHtml(t(project.type))}</span>
          <span class="status-badge">${escapeHtml(t(project.status))}</span>
        </div>
        <h3>${escapeHtml(project.name)}</h3>
        <p class="project-updated">${escapeHtml(t("Last updated"))} ${formatDate(project.updatedAt)}</p>
        <div class="project-progress">
          <small>${progress}% ${escapeHtml(t("complete"))}</small>
          <div class="progress-track"><span style="width: ${progress}%"></span></div>
        </div>
        <div class="project-card-actions">
          <button type="button" data-open-project="${project.id}">${escapeHtml(t("Open"))}</button>
          <button type="button" data-pin-project="${project.id}">${escapeHtml(project.pinned ? t("Unpin") : t("Pin"))}</button>
          <button type="button" data-duplicate-project="${project.id}">${escapeHtml(t("Duplicate"))}</button>
          ${featured ? "" : `<button type="button" data-delete-project="${project.id}">${escapeHtml(t("Delete"))}</button>`}
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
  featureCount.textContent = `${pinned.length} / ${maxFeatured} ${t("pinned")}`;
  featuredGrid.innerHTML = pinned.map((project) => projectCard(project, true)).join("");
  projectGrid.innerHTML = filtered.map((project) => projectCard(project)).join("");
  activityList.innerHTML = (user.activity || []).length
    ? user.activity.map((item) => `<article class="activity-item"><p>${escapeHtml(item.message)}</p><span>${timeAgo(item.date)}</span></article>`).join("")
    : `<article class="activity-item"><p>${escapeHtml(t("No recent activity yet."))}</p><span>${escapeHtml(t("New"))}</span></article>`;
}

function renderWorkspace() {
  const project = currentProject();
  if (!project || workspaceView.classList.contains("is-hidden")) return;
  const progress = progressFor(project);
  workspaceName.textContent = project.name;
  workspaceType.textContent = t(project.type);
  workspaceUpdated.textContent = `${t("Last updated")} ${formatDate(project.updatedAt)}`;
  projectHeader.style.setProperty("--project-color", project.color || colorTags[0].value);
  workspaceView.style.setProperty("--project-color", project.color || colorTags[0].value);
  progressLabel.textContent = `${progress.percent}%`;
  progressBar.style.width = `${progress.percent}%`;
  progressList.innerHTML = progress.checks
    .map(([label, done, sectionId]) => `
      <li class="${done ? "is-complete" : ""}">
        <a href="#${sectionId}">${done ? "✓" : "•"} ${escapeHtml(t(label))}</a>
      </li>
    `)
    .join("");
  coverPreview.innerHTML = coverMarkup(project);
  missionBadge.classList.toggle("is-hidden", project.status !== "Ready to Share");
  imageCount.textContent = `${project.moodBoard.length} ${project.moodBoard.length === 1 ? t("image") : t("images")}`;
  referenceCount.textContent = `${project.references.length} ${project.references.length === 1 ? t("reference") : t("references")}`;
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
          <button type="button" data-move-image="${image.id}" data-direction="-1" ${index === 0 ? "disabled" : ""}>${escapeHtml(t("Left"))}</button>
          <button type="button" data-move-image="${image.id}" data-direction="1" ${index === project.moodBoard.length - 1 ? "disabled" : ""}>${escapeHtml(t("Right"))}</button>
          <button type="button" data-delete-image="${image.id}">${escapeHtml(t("Delete"))}</button>
        </div>
      </article>
    `).join("")
    : `<p class="project-updated">${escapeHtml(t("No images yet. Add visual inspiration to build the world."))}</p>`;
}

function renderReferences(project) {
  referenceGrid.innerHTML = project.references.length
    ? project.references.map((reference) => `
      <article class="reference-card">
        ${referenceThumbMarkup(reference)}
        <div class="reference-card-body">
          <span>${escapeHtml(reference.platform)}</span>
          <a href="${escapeHtml(reference.url)}" target="_blank" rel="noreferrer">${escapeHtml(reference.url)}</a>
          <p>${escapeHtml(reference.note || t("No note added."))}</p>
          <div class="project-card-actions">
            <button type="button" data-edit-reference="${reference.id}">${escapeHtml(t("Edit"))}</button>
            <button type="button" data-delete-reference="${reference.id}">${escapeHtml(t("Delete"))}</button>
          </div>
        </div>
      </article>
    `).join("")
    : `<p class="project-updated">${escapeHtml(t("Add Instagram, TikTok, YouTube, Spotify, Pinterest, Behance, or Dribbble links."))}</p>`;
}

function renderReport(project) {
  if (!project.report) {
    reportOutput.innerHTML = `${generateReport(project, true)}<p class="live-report-note">${escapeHtml(t("Live draft updates as you work. Press Generate Vision Report to finalize it."))}</p>`;
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
  copy.id = recordId("project");
  copy.name = `${source.name} Copy`;
  copy.pinned = false;
  copy.status = "Draft";
  copy.createdAt = now();
  copy.updatedAt = now();
  user.projects.unshift(copy);
  saveState(`Duplicated ${source.name}`);
  syncProject(copy);
  showToast("Project duplicated.");
}

function deleteProject(id) {
  const user = currentUser();
  const project = projects().find((item) => item.id === id);
  if (!user || !project) return;
  if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
  user.projects = user.projects.filter((item) => item.id !== id);
  deleteSupabaseProject(id);
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
  syncProject(project);
}

function updateStatus(project) {
  if (project.status === "Ready to Share") return;
  const progress = progressFor(project).percent;
  project.status = progress >= 60 ? "In Progress" : "Draft";
}

function readFiles(files) {
  return Promise.all([...files].filter((file) => /image\/(jpeg|png|webp)/.test(file.type)).map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: recordId("img"), name: file.name, data: reader.result, createdAt: now(), file });
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
  showToast(t("Image uploaded and visible in Mood Board."));

  if (isSupabaseEnabled && supabaseSession?.user) {
    const uploadedRows = [];
    for (const [index, image] of images.entries()) {
      const upload = await uploadVisionImage(image.file, "mood");
      if (!upload) continue;
      image.data = upload.url;
      image.url = upload.url;
      image.path = upload.path;
      if (project.cover?.moodId === image.id) project.cover.data = upload.url;
      uploadedRows.push({
        id: image.id,
        project_id: project.id,
        user_id: currentSupabaseUserId(),
        name: image.name,
        url: upload.url,
        path: upload.path,
        sort_order: project.moodBoard.length - images.length + index,
      });
    }
    if (uploadedRows.length) {
      await supabaseClient.from("vision_mood_images").upsert(uploadedRows);
      await syncProject(project);
      renderWorkspace();
    }
  }
}

async function setUploadedCover(files) {
  const project = currentProject();
  if (!project || !files?.length) return;
  const [image] = await readFiles(files);
  if (!image) return;
  project.cover = { type: "upload", data: image.data };
  saveState(`Updated cover for ${project.name}`);
  showToast(t("Cover uploaded and visible."));

  if (isSupabaseEnabled && supabaseSession?.user) {
    const upload = await uploadVisionImage(image.file, "covers");
    if (upload) {
      project.cover = { type: "upload", data: upload.url, path: upload.path };
      saveState(`Synced cover for ${project.name}`);
    }
  }
}

function generateReport(project, draft = false) {
  const brainSummary = project.brainDump.trim()
    ? project.brainDump.trim().split(/\s+/).slice(0, 54).join(" ") + (project.brainDump.trim().split(/\s+/).length > 54 ? "..." : "")
    : t("No brain dump notes added yet.");
  const visualMarkup = project.moodBoard.length
    ? `
      <h4>${escapeHtml(t("Mood Board"))}</h4>
      <div class="report-visual-grid">
        ${project.moodBoard.slice(0, 8).map((image) => `<img src="${escapeHtml(image.data)}" alt="${escapeHtml(image.name || "Mood board image")}">`).join("")}
      </div>
    `
    : "";
  const referenceMarkup = project.references.length
    ? `
      <h4>${escapeHtml(t("References"))}</h4>
      <div class="report-reference-list">
        ${project.references.map((ref) => `
          <a href="${escapeHtml(ref.url)}" target="_blank" rel="noreferrer">
            ${ref.thumbnail ? `<img src="${escapeHtml(ref.thumbnail)}" alt="${escapeHtml(ref.platform)} thumbnail">` : `<span class="report-reference-fallback">${escapeHtml((ref.platform || "R").slice(0, 1))}</span>`}
            <span><strong>${escapeHtml(ref.platform)}:</strong> ${escapeHtml(ref.note || ref.url)}</span>
          </a>
        `).join("")}
      </div>
    `
    : `<h4>${escapeHtml(t("References"))}</h4><p>${escapeHtml(t("No references added yet."))}</p>`;
  return `
    <h3>${draft ? escapeHtml(t("Live Vision Draft")) : escapeHtml(t("Vision Report"))}: ${escapeHtml(project.name)}</h3>
    <p><strong>${escapeHtml(t("Project Type"))}:</strong> ${escapeHtml(t(project.type))}</p>
    <p><strong>${escapeHtml(t("Status"))}:</strong> ${escapeHtml(t(project.status))}</p>
    <p><strong>${escapeHtml(t("Main Goal"))}:</strong> ${escapeHtml(t(project.goal || "Not selected"))}</p>
    <p><strong>${escapeHtml(t("Description"))}:</strong> ${escapeHtml(project.description || t("No description added yet."))}</p>
    <p><strong>${escapeHtml(t("Creative Direction"))}:</strong> ${escapeHtml(project.direction || t("No creative direction added yet."))}</p>
    <p><strong>${escapeHtml(t("Mood Board Image Count"))}:</strong> ${project.moodBoard.length}</p>
    <p><strong>${escapeHtml(t("Reference Count"))}:</strong> ${project.references.length}</p>
    <p><strong>${escapeHtml(t("Brain Dump Summary"))}:</strong> ${escapeHtml(brainSummary)}</p>
    ${visualMarkup}
    ${referenceMarkup}
    <p><strong>${escapeHtml(t("LMDP Next Step"))}:</strong> ${escapeHtml(t("Review the vision, confirm creative direction, and discuss the services needed to bring it to life."))}</p>
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

async function initialize() {
  fillSelects();
  applyTheme(localStorage.getItem(themeKey) || "dark");
  applyLanguage(activeLanguage);

  if (isSupabaseEnabled) {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await loadSupabaseWorkspace(data.session);
      setView("dashboard");
      renderDashboard();
      return;
    }
  }

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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language || "en"));
});

passwordToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.closest(".password-field")?.querySelector("input");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? t("Hide") : t("Show");
    button.setAttribute("aria-label", show ? t("Hide password") : t("Show password"));
  });
});

guestAccessButton?.addEventListener("click", () => {
  const email = "guest@visionlab.local";
  const guest = ensureLocalUser(email, "Guest Creator", "guest");
  guest.isGuest = true;
  currentUserEmail = email;
  currentProjectId = null;
  supabaseSession = null;
  saveSession(email);
  saveUsers();
  setView("dashboard");
  renderDashboard();
  showToast(t("Guest workspace started."));
});

authForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const type = form.dataset.authForm;

    if (isSupabaseEnabled) {
      if (type === "create") {
        const { data: authData, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { name: String(data.get("name") || "Creator").trim() } },
        });
        if (error) {
          authNote.textContent = error.message;
          return;
        }
        const session = authData.session || (await supabaseClient.auth.getSession()).data.session;
        if (session) await loadSupabaseWorkspace(session);
        setView("dashboard");
        renderDashboard();
        showToast(t("Workspace created."));
        return;
      }

      if (type === "reset") {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.href,
        });
        authNote.textContent = error ? error.message : t("Password reset email sent. Check your inbox.");
        return;
      }

      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        authNote.textContent = error.message;
        return;
      }
      await loadSupabaseWorkspace(authData.session);
      setView("dashboard");
      renderDashboard();
      showToast(t("Welcome back."));
      return;
    }

    if (type === "create") {
      if (users[email]) {
        authNote.textContent = t("That account already exists. Try signing in.");
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
      showToast(t("Workspace created."));
      return;
    }

    if (!users[email]) {
      authNote.textContent = t("No account found with that email.");
      return;
    }

    if (type === "reset") {
      users[email].passwordHash = hashPassword(password);
      saveUsers();
      authNote.textContent = t("Password reset. You can sign in now.");
      document.querySelector("[data-auth-tab='signin']").click();
      return;
    }

    if (users[email].passwordHash !== hashPassword(password)) {
      authNote.textContent = t("Password does not match.");
      return;
    }

    currentUserEmail = email;
    saveSession(email);
    setView("dashboard");
    renderDashboard();
    showToast(t("Welcome back."));
  });
});

signOutButton.addEventListener("click", async () => {
  if (isSupabaseEnabled) await supabaseClient.auth.signOut();
  supabaseSession = null;
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
document.querySelector("[data-open-feedback]").addEventListener("click", () => feedbackModal.showModal());
document.querySelector("[data-close-feedback]").addEventListener("click", () => feedbackModal.close());

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(feedbackForm);
  const feedback = String(data.get("feedback") || "").trim();
  if (!feedback) return;
  const user = currentUser();
  const message = encodeURIComponent(`Vision Lab Beta Feedback\n\nFrom: ${user?.email || "Visitor"}\n\n${feedback}`);
  feedbackForm.reset();
  feedbackModal.close();
  showToast(t("Feedback sent to WhatsApp."));
  window.open(`https://wa.me/15618972555?text=${message}`, "_blank", "noopener");
});

backTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  backTopButton.classList.toggle("is-visible", window.scrollY > 520);
});

newProjectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = currentUser();
  if (!user) return;
  const data = new FormData(newProjectForm);
  const project = defaultProject(String(data.get("name") || "").trim(), String(data.get("type") || "Custom Project"));
  user.projects.unshift(project);
  currentProjectId = project.id;
  createActivity(`Created ${project.name} project`);
  saveUsers();
  await syncProject(project);
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
    if (field.dataset.field === "type") workspaceType.textContent = t(field.value);
    updateStatus(project);
    project.updatedAt = now();
    saveUsers();
    syncProject(project);
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

moodGrid.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const project = currentProject();
  if (!project) return;

  const deleteId = target.dataset.deleteImage;
  const moveId = target.dataset.moveImage;
  if (deleteId) {
    const image = project.moodBoard.find((item) => item.id === deleteId);
    project.moodBoard = project.moodBoard.filter((image) => image.id !== deleteId);
    if (project.cover.moodId === deleteId) project.cover = { type: "default", data: "" };
    updateStatus(project);
    saveState(`Deleted a mood board image from ${project.name}`);
    if (isSupabaseEnabled && supabaseSession?.user) {
      await supabaseClient.from("vision_mood_images").delete().eq("id", deleteId);
      if (image?.path) await supabaseClient.storage.from(moodBucket).remove([image.path]);
    }
  }

  if (moveId) {
    const index = project.moodBoard.findIndex((image) => image.id === moveId);
    const nextIndex = index + Number(target.dataset.direction || 0);
    if (index >= 0 && nextIndex >= 0 && nextIndex < project.moodBoard.length) {
      const [image] = project.moodBoard.splice(index, 1);
      project.moodBoard.splice(nextIndex, 0, image);
      saveState(`Rearranged mood board for ${project.name}`);
      if (isSupabaseEnabled && supabaseSession?.user) {
        await Promise.all(project.moodBoard.map((item, sortIndex) => (
          supabaseClient.from("vision_mood_images").update({ sort_order: sortIndex }).eq("id", item.id)
        )));
      }
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
  const platform = detectPlatform(url);
  const reference = {
    id: recordId("ref"),
    url,
    note,
    platform,
    thumbnail: referenceThumbnail(url, platform),
    createdAt: now(),
  };
  project.references.push(reference);
  referenceForm.reset();
  updateStatus(project);
  saveState(`Added a ${platform} reference to ${project.name}`);
  if (isSupabaseEnabled && supabaseSession?.user) {
    supabaseClient.from("vision_references").upsert({
      id: reference.id,
      project_id: project.id,
      user_id: currentSupabaseUserId(),
      url: reference.url,
      note: reference.note,
      platform: reference.platform,
      thumbnail: reference.thumbnail || "",
    });
  }
});

referenceGrid.addEventListener("click", async (event) => {
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
    if (isSupabaseEnabled && supabaseSession?.user) {
      await supabaseClient.from("vision_references").delete().eq("id", deleteId);
    }
  }

  if (editId) {
    const reference = project.references.find((item) => item.id === editId);
    if (!reference) return;
    const note = prompt("Update reference note", reference.note);
    if (note === null) return;
    reference.note = note;
    saveState(`Updated a reference note in ${project.name}`);
    if (isSupabaseEnabled && supabaseSession?.user) {
      await supabaseClient.from("vision_references").update({ note }).eq("id", editId);
    }
  }
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runReportGeneration(project) {
  if (reportIsGenerating) return;
  reportIsGenerating = true;
  reportLoading?.classList.remove("is-hidden");
  if (reportLoadingBar) reportLoadingBar.style.width = "0%";
  for (const value of [24, 48, 72, 100]) {
    await delay(180);
    if (reportLoadingBar) reportLoadingBar.style.width = `${value}%`;
  }
  project.report = generateReport(project);
  updateStatus(project);
  saveState(`Generated Vision Report for ${project.name}`);
  reportLoading?.classList.add("is-hidden");
  reportIsGenerating = false;
  showToast(t("Vision Report generated."));
}

document.querySelector("[data-generate-report]").addEventListener("click", () => {
  const project = currentProject();
  if (!project) return;
  runReportGeneration(project);
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
