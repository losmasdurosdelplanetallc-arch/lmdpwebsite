const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const brand = document.querySelector(".brand");
const tabs = document.querySelectorAll(".tab");
const groups = document.querySelectorAll(".service-group");
const serviceItems = document.querySelectorAll(".price-list li");
const equipmentItems = document.querySelectorAll(".equipment-grid article");
const workTabs = document.querySelectorAll(".work-tab");
const workGroups = document.querySelectorAll(".work-group");
const briefForm = document.querySelector("#brief-form");
const whatsappButton = document.querySelector("#whatsapp-brief");
const emailButton = document.querySelector("#email-brief");
const packageButtons = document.querySelectorAll(".package-ask");
const missionOptions = document.querySelectorAll(".mission-option");
const studioBookingButtons = document.querySelectorAll(".studio-booking");
const studioSoundLinks = document.querySelectorAll("[data-work-jump]");
const studioViewer = document.querySelector("[data-studio-viewer]");
const studioImage = document.querySelector("[data-studio-image]");
const modeToggle = document.querySelector("#mode-toggle");
const modeLabel = document.querySelector(".mode-label");
const languageButtons = document.querySelectorAll("[data-language]");
const galaxyCanvas = document.querySelector("#galaxy-canvas");
const planetCursor = document.querySelector("#planet-cursor");
const heroGlobe = document.querySelector(".globe-lockup");
const heroGlobeCanvas = document.querySelector("[data-hero-globe-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
const attributeOriginals = new WeakMap();
const textOriginals = new WeakMap();

let currentLanguage = "en";
try {
  currentLanguage = localStorage.getItem("lmdp-language") || "en";
} catch {
  currentLanguage = "en";
}

const spanishText = {
  "Services": "Servicios",
  "Studio": "Estudio",
  "Work": "Trabajo",
  "Packages": "Paquetes",
  "Equipment": "Equipo",
  "About": "Quiénes Somos",
  "CHAT NOW": "CHAT AHORA",
  "Night": "Noche",
  "Day": "Día",
  "Multimedia services for artists and brands.": "Servicios multimedia para artistas y marcas.",
  "For the planet. Made in La Galaxia.": "Para el planeta. Hecho en La Galaxia.",
  "Start on WhatsApp": "Empezar por WhatsApp",
  "View services": "Ver servicios",
  "Music": "Música",
  "Visuals": "Visuales",
  "Content": "Contenido",
  "Branding": "Branding",
  "Events": "Eventos",
  "Professional services for artists & brands": "Servicios profesionales para artistas y marcas",
  "Everything from the first idea to the final rollout.": "Todo desde la primera idea hasta el lanzamiento final.",
  "We are Los Más Duros Del Planeta, a multimedia services business for artists and brands. We build music, visuals, content, branding, and event moments. Recording, mix, master, and studio lock-ins are made in La Galaxia, our physical home studio.": "Somos Los Más Duros Del Planeta, un negocio de servicios multimedia para artistas y marcas. Creamos música, visuales, contenido, branding y momentos de eventos. La grabación, mezcla, master y lock-ins de estudio se hacen en La Galaxia, nuestro estudio físico en casa.",
  "Music Production": "Producción Musical",
  "Recording, mix, master, beats, toplines, and lock-ins made inside La Galaxia.": "Grabación, mezcla, master, beats, toplines y lock-ins hechos dentro de La Galaxia.",
  "Visual Systems": "Sistemas Visuales",
  "Cover art, lyric videos, edits, photoshoots, merch, and identity design.": "Portadas, lyric videos, ediciones, photoshoots, merch y diseño de identidad.",
  "Rollout Energy": "Energía de Lanzamiento",
  "Content strategy, reels, event coverage, release planning, and brand moments.": "Estrategia de contenido, reels, cobertura de eventos, planificación de lanzamientos y momentos de marca.",
  "Browse one lane at a time.": "Explora una categoría a la vez.",
  "Strategy": "Estrategia",
  "Recording Session": "Sesión de Grabación",
  "Professional vocal recording inside La Galaxia, our physical home studio.": "Grabación vocal profesional dentro de La Galaxia, nuestro estudio físico en casa.",
  "Mix & Master": "Mezcla y Master",
  "Clean, industry-style mix and mastering finished through the La Galaxia workflow.": "Mezcla limpia de nivel industria y mastering terminado con el flujo de La Galaxia.",
  "Songwriting / Topline": "Composición / Topline",
  "Hooks, lyrics, toplines, and demo vocals for your record.": "Hooks, letras, toplines y voces demo para tu canción.",
  "Production / Beats": "Producción / Beats",
  "Custom instrumentals across genres, moods, and rollout goals.": "Instrumentales personalizados según género, mood y metas del lanzamiento.",
  "Studio Lock-In": "Lock-In de Estudio",
  "Four-hour creative session to record, create, and capture content.": "Sesión creativa de cuatro horas para grabar, crear y capturar contenido.",
  "Artist Development": "Desarrollo de Artista",
  "One-on-one guidance for your sound, brand, strategy, and growth.": "Guía uno a uno para tu sonido, marca, estrategia y crecimiento.",
  "Visuals & Design": "Visuales y Diseño",
  "Cover Art Design": "Diseño de Portada",
  "Custom single, EP, or album artwork.": "Arte personalizado para single, EP o álbum.",
  "Cover Art Portfolio": "Portafolio de Portadas",
  "Every release deserves its own visual universe.": "Cada lanzamiento merece su propio universo visual.",
  "Original cover concepts spanning photography, 3D typography, surreal worlds, Y2K graphics, and campaign-ready release systems.": "Conceptos originales de portada con fotografía, tipografía 3D, mundos surreales, gráficos Y2K y sistemas visuales listos para campaña.",
  "Lyric Video / Visualizer": "Lyric Video / Visualizer",
  "Engaging lyric videos and visualizers for your music.": "Lyric videos y visualizers atractivos para tu música.",
  "Lyric Video Examples": "Ejemplos de Lyric Videos",
  "Give every word its own visual world.": "Dale a cada palabra su propio mundo visual.",
  "Clickable references showing how typography, motion, color, and atmosphere can extend the identity of a song.": "Referencias interactivas que muestran cómo la tipografía, el movimiento, el color y la atmósfera pueden extender la identidad de una canción.",
  "Lyric Video": "Lyric Video",
  "Creative Visuals": "Visuales Creativos",
  "Creative visual formats": "Formatos de visuales creativos",
  "Event screens": "Pantallas para eventos",
  "Motion loops": "Loops animados",
  "Digital menus": "Menús digitales",
  "Release graphics": "Gráficos de lanzamiento",
  "Custom motion graphics, screen visuals, menus, branded loops, and visual assets for releases and events.": "Motion graphics, visuales para pantallas, menús, loops de marca y recursos visuales para lanzamientos y eventos.",
  "Motion + Branded Environments": "Motion + Ambientes de Marca",
  "Visual assets built beyond the usual post.": "Recursos visuales creados más allá del post tradicional.",
  "Creative loops, display graphics, event screens, specialty menus, and visual moments designed around the project world.": "Loops creativos, gráficos para displays, pantallas de eventos, menús especiales y momentos visuales diseñados alrededor del universo del proyecto.",
  "Video Editing": "Edición de Video",
  "Reels, music promos, teasers, YouTube content, and more.": "Reels, promos musicales, teasers, contenido para YouTube y más.",
  "Artist Photoshoot": "Photoshoot de Artista",
  "Creative photoshoots for branding, press kits, and social media.": "Photoshoots creativos para branding, press kits y redes sociales.",
  "Brand Identity Design": "Diseño de Identidad de Marca",
  "Logos, color palettes, type, and visual identity systems.": "Logos, paletas de color, tipografías y sistemas de identidad visual.",
  "Logo Design": "Diseño de Logos",
  "Marks built to be recognized.": "Marcas creadas para ser reconocidas.",
  "Custom wordmarks, illustrated identities, artist logos, and flexible brand marks designed for real-world use.": "Wordmarks personalizados, identidades ilustradas, logos de artistas y marcas flexibles creadas para uso real.",
  "Business Card Design": "Diseño de Tarjetas de Presentación",
  "Make the first impression feel like the whole brand.": "Haz que la primera impresión represente toda la marca.",
  "Custom front-and-back business card design, print-ready setup, QR integration, and polished presentation mockups.": "Diseño personalizado de tarjetas por ambos lados, archivos listos para imprimir, integración de QR y mockups de presentación pulidos.",
  "Starting at $100+": "Desde $100+",
  "Website Creation": "Creación de Páginas Web",
  "Responsive websites shaped around your brand, story, services, and audience.": "Páginas web responsivas creadas alrededor de tu marca, historia, servicios y audiencia.",
  "Designed + Built by LMDP": "Diseñado + Creado por LMDP",
  "This website is one of our references.": "Esta página web es una de nuestras referencias.",
  "The LMDP site was designed and developed by us, including its bilingual experience, responsive layouts, interactive details, service architecture, and branded visual system.": "La página de LMDP fue diseñada y desarrollada por nosotros, incluyendo su experiencia bilingüe, formatos responsivos, detalles interactivos, arquitectura de servicios y sistema visual de marca.",
  "Interactive galaxy": "Galaxia interactiva",
  "English + Spanish": "Inglés + Español",
  "Day + night modes": "Modos día + noche",
  "Mobile-first layouts": "Diseño mobile-first",
  "360 studio tour": "Tour 360 del estudio",
  "Animated service portfolio": "Portafolio animado de servicios",
  "Flyer Design": "Diseño de Flyers",
  "Custom promotional flyers for releases, performances, parties, launches, and events.": "Flyers promocionales personalizados para lanzamientos, presentaciones, fiestas y eventos.",
  "Event + Promo Graphics": "Gráficos de Eventos + Promoción",
  "Information that hits like artwork.": "Información que impacta como una obra visual.",
  "Bold layouts built to announce the moment, establish the visual energy, and stop the scroll.": "Diseños llamativos creados para anunciar el momento, establecer la energía visual y detener el scroll.",
  "Merch Design": "Diseño de Merch",
  "Custom shirt graphics, mockups, and print-ready files.": "Gráficos para camisetas, mockups y archivos listos para imprimir.",
  "Merch Collections": "Colecciones de Merch",
  "Wear the project. Carry the world with you.": "Viste el proyecto. Lleva su mundo contigo.",
  "Collection concepts, front-and-back layouts, mockups, print-ready graphics, and campaign imagery.": "Conceptos de colección, diseños de frente y espalda, mockups, gráficos listos para imprimir e imágenes de campaña.",
  "Content & Social": "Contenido y Redes",
  "Content Creation": "Creación de Contenido",
  "Purpose-built content for mobile audiences, shaped around your campaign, voice, and rollout goals.": "Contenido creado para audiencias móviles, diseñado alrededor de tu campaña, voz y objetivos de lanzamiento.",
  "Content creation deliverables": "Entregables de creación de contenido",
  "Short-form video": "Video corto",
  "Reels, TikToks, hooks, and scroll-stopping edits.": "Reels, TikToks, hooks y ediciones que detienen el scroll.",
  "Campaign content": "Contenido de campaña",
  "Launch assets that keep one visual world across every post.": "Piezas de lanzamiento que mantienen un mismo mundo visual en cada publicación.",
  "Product + lifestyle": "Producto + lifestyle",
  "Clean, intentional moments designed for the brand.": "Momentos limpios e intencionales diseñados para la marca.",
  "Behind the scenes": "Detrás de cámaras",
  "Real process, personality, and story-driven coverage.": "Proceso real, personalidad y cobertura guiada por la historia.",
  "Short-form content, product moments, lifestyle clips, branded reels, and social-first video packages.": "Contenido corto, momentos de producto, clips lifestyle, reels de marca y paquetes de video pensados para redes.",
  "Social-First Motion": "Movimiento para Redes",
  "Content built to keep the brand moving.": "Contenido creado para mantener la marca en movimiento.",
  "Tap any preview to play. These examples show product, lifestyle, promotional, and campaign content created for mobile audiences.": "Toca cualquier preview para reproducir. Estos ejemplos muestran contenido de producto, lifestyle, promoción y campaña creado para audiencias móviles.",
  "Content Strategy": "Estrategia de Contenido",
  "Rollout planning, content ideas, posting strategy, and more.": "Planificación de lanzamiento, ideas de contenido, estrategia de publicación y más.",
  "Monthly Content Packages": "Paquetes Mensuales de Contenido",
  "Consistent content to grow your brand every month.": "Contenido constante para crecer tu marca cada mes.",
  "Reel / TikTok Edits": "Ediciones para Reels / TikTok",
  "High-quality short-form edits that stop the scroll.": "Ediciones cortas de alta calidad que paran el scroll.",
  "Photography Bundles": "Paquetes de Fotografía",
  "Multiple looks, concepts, and edited photos.": "Varios looks, conceptos y fotos editadas.",
  "Rollout Packages": "Paquetes de Lanzamiento",
  "Full content rollouts for singles, projects, and brand moments.": "Lanzamientos completos de contenido para singles, proyectos y momentos de marca.",
  "Template Packs": "Paquetes de Plantillas",
  "Canva templates for artists: stories, posts, promos, and more.": "Plantillas de Canva para artistas: stories, posts, promos y más.",
  "Events & Experiences": "Eventos y Experiencias",
  "Event Coverage": "Cobertura de Eventos",
  "Photo and video coverage for performances, parties, launches, and creative events.": "Cobertura de foto y video para presentaciones, fiestas, lanzamientos y eventos creativos.",
  "Performance Content": "Contenido de Presentación",
  "Performance clips, backstage moments, crowd shots, and recap reels.": "Clips de presentación, momentos backstage, tomas del público y recap reels.",
  "See it in action": "Míralo en acción",
  "View La Salsa Vlog coverage": "Ver la cobertura de La Salsa Vlog",
  "Live performance photography": "Fotografía de presentaciones en vivo",
  "Capture the energy on stage.": "Captura la energía en el escenario.",
  "Artist-focused photos and content that preserve the movement, presence, and atmosphere of the performance.": "Fotos y contenido enfocados en el artista que preservan el movimiento, la presencia y la atmósfera de la presentación.",
  "Showcase Curation": "Curaduría de Showcase",
  "Lineup curation, event planning, promotion, and execution.": "Curaduría de lineup, planificación de evento, promoción y ejecución.",
  "See the experience": "Mira la experiencia",
  "View the 69AF showcase": "Ver el showcase de 69AF",
  "Release Party Planning": "Planificación de Release Party",
  "Planning and execution for a release experience that feels intentional.": "Planificación y ejecución para una experiencia de lanzamiento con intención.",
  "Release party reference": "Referencia de release party",
  "View the NOYNA 69AF release party": "Ver el release party 69AF de NOYNA",
  "Strategy & Business": "Estrategia y Negocio",
  "Creative Direction": "Dirección Creativa",
  "Moodboards, concepting, styling, visual direction, and more.": "Moodboards, conceptualización, styling, dirección visual y más.",
  "Electronic Press Kit": "Electronic Press Kit",
  "Professional EPKs to help you pitch and get booked.": "EPKs profesionales para ayudarte a presentar tu proyecto y conseguir oportunidades.",
  "Consulting / 1-on-1": "Consultoría / 1 a 1",
  "Business, branding, and creative consulting for your career.": "Consultoría de negocio, branding y creatividad para tu carrera.",
  "AI Visual Development": "Desarrollo Visual con IA",
  "AI-generated concepts, cover ideas, and visual world building.": "Conceptos generados con IA, ideas de portada y construcción de mundos visuales.",
  "Step Into La Galaxia Home Studio": "Entra a La Galaxia Home Studio",
  "360 home studio view": "Vista 360 del home studio",
  "Drag / swipe to look around": "Arrastra / desliza para mirar alrededor",
  "Record your next hit here": "Graba tu próximo hit aquí",
  "Private, vibey, and ready for the session.": "Privado, con vibra y listo para la sesión.",
  "La Galaxia is the physical home studio where LMDP records vocals, shapes ideas, builds references, and captures content around the music. Tour the room, then jump into the music production references to hear the sound created in this space.": "La Galaxia es el home studio físico donde LMDP graba voces, desarrolla ideas, crea referencias y captura contenido alrededor de la música. Recorre el cuarto y luego escucha las referencias de producción musical para oír el sonido creado en este espacio.",
  "Recording": "Grabación",
  "Vocal production": "Producción vocal",
  "Mix prep": "Preparación de mezcla",
  "Lock-ins": "Lock-ins",
  "Book La Galaxia": "Reservar La Galaxia",
  "Hear the sound": "Escuchar el sonido",
  "Our work": "Nuestro trabajo",
  "Proof of the quality.": "Prueba de la calidad.",
  "Music Videos": "Videos Musicales",
  "Visualizers": "Visualizers",
  "Animated, lyric, and release visuals built for repeat playback.": "Visuales animados, lyric y de lanzamiento creados para verse una y otra vez.",
  "YouTube playlist": "Playlist de YouTube",
  "Orly Flow visualizers": "Visualizers de Orly Flow",
  "Visualizer direction and rollout content by LMDP.": "Dirección de visualizer y contenido de lanzamiento por LMDP.",
  "Open on YouTube": "Abrir en YouTube",
  "3 videos": "3 videos",
  "Orly Flow visualizer": "Visualizer de Orly Flow",
  "\"Cual es tu destino?\" visualizers": "Visualizers de \"Cual es tu destino?\"",
  "Open full playlist": "Abrir playlist completa",
  "5 videos": "5 videos",
  "NOYNA visualizer": "Visualizer de NOYNA",
  "Animation visualizer": "Visualizer animado",
  "Stylized release content and animated visual direction.": "Contenido de lanzamiento estilizado y dirección visual animada.",
  "Motion systems": "Sistemas de movimiento",
  "Visual worlds made for repeat playback.": "Mundos visuales hechos para verse en repetición.",
  "Lyric motion, animated assets, cover systems, and rollout graphics that keep the release moving.": "Motion lyrics, assets animados, sistemas de portada y gráficos de rollout que mantienen el lanzamiento en movimiento.",
  "Performance, color, pacing, and artist identity in motion.": "Performance, color, ritmo e identidad del artista en movimiento.",
  "Music video": "Video musical",
  "Artist visuals and rollout style.": "Visuales de artista y estilo de lanzamiento.",
  "Performance, pacing, and atmosphere.": "Performance, ritmo y atmósfera.",
  "Color, performance, and artist identity.": "Color, performance e identidad de artista.",
  "Hear the vocal production, recording, mix, and master created through the La Galaxia workflow.": "Escucha la producción vocal, grabación, mezcla y master creados con el workflow de La Galaxia.",
  "Music production": "Producción musical",
  "Vocal production, mix, and master by LMDP.": "Producción vocal, mezcla y master por LMDP.",
  "Open on Spotify": "Abrir en Spotify",
  "Vocal production, recording, mix, and master by LMDP.": "Producción vocal, grabación, mezcla y master por LMDP.",
  "Recaps, release moments, crowd coverage, and rollout momentum.": "Recaps, momentos de lanzamiento, cobertura del público y momentum de rollout.",
  "Event coverage & vlog": "Cobertura de evento y vlog",
  "Recap energy, crowd moments, and social storytelling.": "Energía de recap, momentos del público y storytelling social.",
  "Release party": "Release party",
  "Event coverage built for rollout momentum.": "Cobertura de evento creada para impulsar el lanzamiento.",
  "Popular packages": "Paquetes populares",
  "Bundled for real rollouts.": "Paquetes para lanzamientos reales.",
  "Starter": "Inicial",
  "Single Starter Pack": "Paquete Inicial para Single",
  "Recording session, mix & master, cover art, two promo reels, and a mini photoshoot.": "Sesión de grabación, mezcla y master, portada, dos promo reels y mini photoshoot.",
  "Ask about this": "Preguntar por esto",
  "Best value": "Mejor valor",
  "Artist Growth Pack": "Paquete de Crecimiento Artístico",
  "Monthly content with four reels, photography bundle, strategy call, cover art, and ongoing support.": "Contenido mensual con cuatro reels, paquete de fotografía, llamada estratégica, portada y apoyo continuo.",
  "Full campaign": "Campaña completa",
  "Full Rollout Package": "Paquete de Rollout Completo",
  "Content strategy, cover art and visualizer, reels and promo content, photoshoot, release plan, and rollout.": "Estrategia de contenido, portada y visualizer, reels y contenido promo, photoshoot, plan de lanzamiento y rollout.",
  "Gear in the workflow.": "Equipo dentro del workflow.",
  "Green Screen Setup": "Setup de Green Screen",
  "Chroma key setup / clean cutouts / promo visuals": "Setup chroma key / recortes limpios / visuales promo",
  "Best for simple photoshoots, behind-the-scenes stills, social content, and clean starter visuals when the project needs solid photography without overcomplicating the setup.": "Ideal para photoshoots simples, fotos detrás de cámaras, contenido social y visuales iniciales limpios cuando el proyecto necesita buena fotografía sin complicar demasiado el setup.",
  "Best for vlogs, reels, talking-head content, product shots, creator videos, and fast autofocus scenes where the subject needs to stay sharp while moving.": "Ideal para vlogs, reels, contenido hablando a cámara, tomas de producto, videos de creadores y escenas con autoenfoque rápido donde el sujeto debe mantenerse nítido en movimiento.",
  "Best for high-end music videos, cinematic portraits, low-light scenes, brand campaigns, and projects that need richer detail, color, and a more premium visual feel.": "Ideal para videos musicales de alto nivel, retratos cinematográficos, escenas con poca luz, campañas de marca y proyectos que necesitan más detalle, color y un look más premium.",
  "Best for music videos, artist photos, promo content, BTS, and clean social media visuals when you need sharp images and smooth 4K video without a huge production setup.": "Ideal para videos musicales, fotos de artista, contenido promo, BTS y visuales limpios para redes cuando necesitas imagen nítida y video 4K fluido sin una producción enorme.",
  "Best for putting artists into custom worlds, branded backgrounds, lyric-video scenes, reaction clips, product promos, and surreal content without needing a full physical set.": "Ideal para poner artistas en mundos personalizados, fondos de marca, escenas de lyric video, clips de reacción, promos de producto y contenido surreal sin necesitar un set físico completo.",
  "Best for clean vocal recording, hooks, demos, voiceovers, podcasts, and intimate acoustic details. It captures a polished vocal sound while keeping background noise low.": "Ideal para grabar voces limpias, hooks, demos, voiceovers, podcasts y detalles acústicos íntimos. Captura una voz pulida manteniendo bajo el ruido de fondo.",
  "Best for premium lead vocals, detailed rap and singing takes, ad-libs, voiceovers, and sessions where the vocal needs to feel crisp, present, and release-ready.": "Ideal para voces principales premium, tomas detalladas de rap o canto, ad-libs, voiceovers y sesiones donde la voz necesita sentirse clara, presente y lista para lanzar.",
  "Best for interviews, vlogs, event coverage, BTS, tutorials, and talking-head content where people need to move freely while the audio stays clear.": "Ideal para entrevistas, vlogs, cobertura de eventos, BTS, tutoriales y contenido hablado donde las personas necesitan moverse libremente mientras el audio se mantiene claro.",
  "Best for recording vocals with high-quality conversion, monitoring with low latency, and using professional vocal processing while the artist performs.": "Ideal para grabar voces con conversión de alta calidad, monitorear con baja latencia y usar procesamiento vocal profesional mientras el artista interpreta.",
  "Best for mixing decisions, playback checks, beat work, vocal balance, and making sure the song translates clearly before it leaves La Galaxia.": "Ideal para decisiones de mezcla, revisar playback, trabajar beats, balancear voces y asegurar que la canción traduzca bien antes de salir de La Galaxia.",
  "Your browser does not support this video preview.": "Tu navegador no soporta esta vista previa de video.",
  "Green Screen Services": "Servicios de Green Screen",
  "Clean cutouts. Custom worlds. Promo-ready visuals.": "Recortes limpios. Mundos personalizados. Visuales listos para promo.",
  "We use green screen setups for visualizers, reels, performance clips, interviews, and branded concepts that need a flexible background or a more surreal visual world.": "Usamos green screen para visualizers, reels, clips de performance, entrevistas y conceptos de marca que necesitan un fondo flexible o un mundo visual más surreal.",
  "Who We Are": "Quiénes Somos",
  "We are Los Más Duros Del Planeta.": "Somos Los Más Duros Del Planeta.",
  "LMDP Crew": "Crew LMDP",
  "Built by creators. Made for the real.": "Creado por creadores. Hecho para los reales.",
  "A multimedia movement for artists, brands, and moments that need real energy.": "Un movimiento multimedia para artistas, marcas y momentos que necesitan energía real.",
  "Creative. Culture. Community. Worldwide.": "Creatividad. Cultura. Comunidad. Worldwide.",
  "Based in Miami, inspired by the world. The movement reaches beyond borders, but the roots stay here.": "Basados en Miami, inspirados por el mundo. El movimiento cruza fronteras, pero las raíces se quedan aquí.",
  "The Crew": "El Crew",
  "LMDP is a small, hands-on creative crew built by people who live the artist process from the inside. We understand the pressure of making something feel real, because we are creators too.": "LMDP es un crew creativo pequeño y práctico, creado por personas que viven el proceso artístico desde adentro. Entendemos la presión de hacer que algo se sienta real, porque también somos creadores.",
  "The Mission": "La Misión",
  "Our job is to help your idea feel focused, confident, and ready for the world. We care about the details that make a song, visual, shoot, rollout, or event feel intentional instead of random.": "Nuestra misión es ayudar a que tu idea se sienta enfocada, segura y lista para el mundo. Cuidamos los detalles que hacen que una canción, visual, sesión, rollout o evento se sienta intencional y no improvisado.",
  "Why We Exist": "Por Qué Existimos",
  "Independent creators often have the vision but not the full team around them. LMDP exists to be that creative support system: a place where ideas get organized, elevated, and executed with care.": "Los creadores independientes muchas veces tienen la visión, pero no el equipo completo alrededor. LMDP existe para ser ese sistema de apoyo creativo: un lugar donde las ideas se organizan, se elevan y se ejecutan con cuidado.",
  "Los Más Duros del Planeta (LMDP) is a Miami-based creative collective and multimedia company focused on bringing bold ideas to life through music, visuals, events, and culture-driven experiences. Founded by NOYNA, LMDP was created from a passion for independent artistry, creative freedom, and building opportunities for the next generation of creators.": "Los Más Duros del Planeta (LMDP) es un colectivo creativo y compañía multimedia basada en Miami, enfocada en darle vida a ideas fuertes a través de música, visuales, eventos y experiencias impulsadas por la cultura. Fundado por NOYNA, LMDP nace de una pasión por el arte independiente, la libertad creativa y crear oportunidades para la próxima generación de creadores.",
  "The Movement": "El Movimiento",
  "What started as a self-built movement between artists and creatives evolved into a full creative hub offering music production, recording, photography, videography, branding, content creation, event curation, and visual design. Every project is driven by storytelling, originality, and high-quality execution.": "Lo que empezó como un movimiento creado desde cero entre artistas y creativos evolucionó en un hub creativo completo que ofrece producción musical, grabación, fotografía, videografía, branding, creación de contenido, curaduría de eventos y diseño visual. Cada proyecto se mueve con storytelling, originalidad y ejecución de alta calidad.",
  "What We Do": "Lo Que Hacemos",
  "We bring ideas to life through a full spectrum of creative services: music production, recording, mixing and mastering, photography, videography, content creation, branding, event curation, and visual design. In the studio, on set, or on stage, every detail is handled with purpose and precision.": "Damos vida a ideas con una gama completa de servicios creativos: producción musical, grabación, mezcla y master, fotografía, videografía, creación de contenido, branding, curaduría de eventos y diseño visual. En el estudio, en set o en tarima, cada detalle se trabaja con propósito y precisión.",
  "Built By NOYNA": "Creado por NOYNA",
  "Founded by NOYNA, a creative with a vision bigger than the industry. LMDP was built on independence, discipline, and the belief that creators deserve real opportunities and real support to turn ideas into impact. This is more than a brand. It is a platform for the next generation.": "Fundado por NOYNA, una creativa con una visión más grande que la industria. LMDP fue construido sobre independencia, disciplina y la creencia de que los creadores merecen oportunidades reales y apoyo real para convertir ideas en impacto. Esto es más que una marca. Es una plataforma para la próxima generación.",
  "For Artists & Brands": "Para Artistas y Marcas",
  "We work with artists, brands, and visionaries who want more than average. From your first release to your biggest campaign, LMDP provides the creative firepower and strategy to help you stand out, connect, and leave a lasting impression.": "Trabajamos con artistas, marcas y visionarios que quieren más que lo promedio. Desde tu primer lanzamiento hasta tu campaña más grande, LMDP ofrece la fuerza creativa y la estrategia para ayudarte a destacar, conectar y dejar una impresión duradera.",
  "More Than A Company": "Más Que Una Compañía",
  "LMDP is a community built for creators who think big, move differently, and want to turn ideas into reality.": "LMDP es una comunidad hecha para creadores que piensan en grande, se mueven diferente y quieren convertir ideas en realidad.",
  "Latest + pinned posts": "Posts recientes y fijados",
  "Follow the drops, reels, BTS, and LMDP moments.": "Sigue los drops, reels, BTS y momentos de LMDP.",
  "Tap through to see the newest posts and pinned work directly on Instagram.": "Toca para ver los posts más nuevos y trabajos fijados directamente en Instagram.",
  "Start Your Mission": "Empieza Tu Misión",
  "Tell us what you are building.": "Cuéntanos qué estás creando.",
  "Tap a mission and the brief fills in for you.": "Toca una misión y el brief se llena por ti.",
  "LMDP Contact": "Contacto LMDP",
  "Business information": "Información del negocio",
  "Reach Los Más Duros Del Planeta directly for bookings, questions, and project details.": "Comunícate directamente con Los Más Duros Del Planeta para bookings, preguntas y detalles de proyectos.",
  "Record a Song": "Grabar una canción",
  "Shoot Content": "Grabar contenido",
  "Book Photography": "Reservar fotografía",
  "Build a Website": "Crear una página web",
  "Design Something": "Diseñar algo",
  "Edit Reels": "Editar reels",
  "Plan an Event": "Planificar un evento",
  "Green Screen Shoot": "Sesión con green screen",
  "Plan a Rollout": "Planificar un rollout",
  "Phone": "Teléfono",
  "Email": "Correo",
  "Based in": "Basado en",
  "Name": "Nombre",
  "Service": "Servicio",
  "Website / Digital": "Página web / Digital",
  "Popular Package": "Paquete popular",
  "Budget": "Presupuesto",
  "Project": "Proyecto",
  "Send WhatsApp brief": "Enviar brief por WhatsApp",
  "Email brief": "Enviar brief por email",
  "LMDP LLC · Miami, FL · Worldwide · Est. 2026": "LMDP LLC · Miami, FL · Worldwide · Est. 2026",
  "Let's create. Let's build. Let's take over.": "Vamos a crear. Vamos a construir. Vamos a dominar.",
  "Top": "Arriba",
};

const spanishAttributes = {
  "LMDP home": "Inicio LMDP",
  "Main navigation": "Navegación principal",
  "Language": "Idioma",
  "Switch to day mode": "Cambiar a modo día",
  "Switch to night mode": "Cambiar a modo noche",
  "Open menu": "Abrir menú",
  "LMDP services overview": "Resumen de servicios LMDP",
  "Core services": "Servicios principales",
  "LMDP studio highlights": "Puntos clave del estudio LMDP",
  "Service categories": "Categorías de servicios",
  "Interactive 360-style panoramic view of La Galaxia home studio": "Vista panorámica interactiva estilo 360 del home studio La Galaxia",
  "Merged panoramic 360-style view of La Galaxia home studio with artist lounge, colorful lights, TV visuals, vocal production desk, speakers, and recording setup": "Vista panorámica estilo 360 de La Galaxia home studio con lounge de artistas, luces de colores, visuales en TV, estación de producción vocal, bocinas y setup de grabación",
  "Studio vibe notes": "Notas de la vibra del estudio",
  "Work reference categories": "Categorías de referencias de trabajo",
  "Watch Yo Muero Millo by Orly Flow on YouTube": "Ver Yo Muero Millo de Orly Flow en YouTube",
  "Orly Flow visualizers": "Visualizers de Orly Flow",
  "Watch Perreo Airlines visualizer by NOYNA on YouTube": "Ver el visualizer Perreo Airlines de NOYNA en YouTube",
  "Cual es tu destino visualizers": "Visualizers de Cual es tu destino",
  "Watch Volando Bajito visualizer by Noisyyy on YouTube": "Ver el visualizer Volando Bajito de Noisyyy en YouTube",
  "Watch Las Dunks by Noisyyy on YouTube": "Ver Las Dunks de Noisyyy en YouTube",
  "Watch En Las Nubes by Noisyyy featuring Streetboy Flow on YouTube": "Ver En Las Nubes de Noisyyy con Streetboy Flow en YouTube",
  "Watch Pantycito Rosa by NATNAT on YouTube": "Ver Pantycito Rosa de NATNAT en YouTube",
  "69AF by NOYNA on Spotify": "69AF de NOYNA en Spotify",
  "Cual es tu destino by NOYNA on Spotify": "Cual es tu destino de NOYNA en Spotify",
  "Watch La Salsa Vlog by kendaya on YouTube": "Ver La Salsa Vlog de kendaya en YouTube",
  "Watch 69AF Release Party by NOYNA on YouTube": "Ver 69AF Release Party de NOYNA en YouTube",
  "Creative visual formats": "Formatos de visuales creativos",
  "Content creation deliverables": "Entregables de creación de contenido",
  "Performance content examples": "Ejemplos de contenido de presentación",
  "Artist performing live on stage photographed by LMDP": "Artista presentándose en vivo fotografiado por LMDP",
  "Close performance photograph of an artist singing on stage by LMDP": "Fotografía cercana de un artista cantando en vivo por LMDP",
  "Original LMDP crew photo": "Foto original del crew LMDP",
  "Open LMDP Instagram profile": "Abrir perfil de Instagram de LMDP",
  "Start your mission options": "Opciones para empezar tu misión",
  "Quick contact links": "Links rápidos de contacto",
  "Chat with LMDP on WhatsApp": "Chatea con LMDP por WhatsApp",
  "Follow LMDP on Instagram": "Sigue a LMDP en Instagram",
  "Back to top": "Volver arriba",
  "Your name": "Tu nombre",
  "Tell us what you want to build.": "Cuéntanos qué quieres crear.",
  "I want to book a recording session inside La Galaxia.": "Quiero reservar una sesión de grabación dentro de La Galaxia.",
  "I want to record a song with LMDP.": "Quiero grabar una canción con LMDP.",
  "I want to shoot content with LMDP.": "Quiero grabar contenido con LMDP.",
  "I want to book photography with LMDP.": "Quiero reservar fotografía con LMDP.",
  "I want LMDP to build a website.": "Quiero que LMDP cree una página web.",
  "I want LMDP to design something for my brand or rollout.": "Quiero que LMDP diseñe algo para mi marca o lanzamiento.",
  "I want LMDP to mix and master my song.": "Quiero que LMDP mezcle y masterice mi canción.",
  "I want LMDP to create cover art or a visual identity for my release.": "Quiero que LMDP cree una portada o identidad visual para mi lanzamiento.",
  "I want LMDP to edit reels, TikToks, or short-form promo content.": "Quiero que LMDP edite reels, TikToks o contenido promo corto.",
  "I want LMDP to cover or help plan an event.": "Quiero que LMDP cubra o ayude a planificar un evento.",
  "I want to book a green screen or creative content shoot with LMDP.": "Quiero reservar una sesión con green screen o contenido creativo con LMDP.",
  "I want LMDP to help plan a rollout for my song, project, brand, or event.": "Quiero que LMDP ayude a planificar el rollout de mi canción, proyecto, marca o evento.",
};

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function localizedText(value, language = currentLanguage) {
  if (language !== "es") return value;
  return spanishText[normalizeText(value)] || spanishAttributes[normalizeText(value)] || value;
}

function modeCopy(isDay) {
  if (currentLanguage === "es") {
    return {
      label: isDay ? "Día" : "Noche",
      aria: isDay ? "Cambiar a modo noche" : "Cambiar a modo día",
    };
  }

  return {
    label: isDay ? "Day" : "Night",
    aria: isDay ? "Switch to night mode" : "Switch to day mode",
  };
}

function updateModeLanguage() {
  const isDay = body.classList.contains("day-mode");
  const copy = modeCopy(isDay);
  modeToggle?.setAttribute("aria-label", copy.aria);

  if (modeLabel) {
    modeLabel.textContent = copy.label;
  }
}

function getOriginalAttribute(element, attribute) {
  let original = attributeOriginals.get(element);
  if (!original) {
    original = {};
    attributeOriginals.set(element, original);
  }

  if (!(attribute in original)) {
    original[attribute] = element.getAttribute(attribute) || "";
  }

  return original[attribute];
}

function applyLanguage(language) {
  currentLanguage = language === "es" ? "es" : "en";
  document.documentElement.lang = currentLanguage;

  languageButtons.forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return normalizeText(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    if (!textOriginals.has(node)) {
      textOriginals.set(node, node.nodeValue || "");
    }

    const original = textOriginals.get(node) || "";
    const translated = localizedText(original, currentLanguage);
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = currentLanguage === "es" && translated !== original
      ? `${leading}${translated}${trailing}`
      : original;
  });

  document.querySelectorAll("[aria-label], [placeholder], [title], [data-message], meta[name='description']").forEach((element) => {
    ["aria-label", "placeholder", "title", "data-message", "content"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;

      const original = getOriginalAttribute(element, attribute);
      element.setAttribute(attribute, localizedText(original, currentLanguage));
    });
  });

  document.title = currentLanguage === "es"
    ? "LMDP | Los Más Duros Del Planeta"
    : "LMDP | Los Más Duros Del Planeta";

  updateModeLanguage();

  try {
    localStorage.setItem("lmdp-language", currentLanguage);
  } catch {
    // Language switching still works when storage is unavailable.
  }
}

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
  updateModeLanguage();

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
applyLanguage(currentLanguage);

modeToggle?.addEventListener("click", () => {
  setSiteMode(body.classList.contains("day-mode") ? "night" : "day");
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language || "en");
  });
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

serviceItems.forEach((item) => {
  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.setAttribute("aria-expanded", "false");

  const toggleService = () => {
    const open = !item.classList.contains("is-open");
    item.closest(".price-list")?.querySelectorAll("li.is-open").forEach((activeItem) => {
      if (activeItem !== item) {
        activeItem.classList.remove("is-open");
        activeItem.setAttribute("aria-expanded", "false");
      }
    });
    item.classList.toggle("is-open", open);
    item.setAttribute("aria-expanded", String(open));
  };

  item.addEventListener("click", toggleService);
  item.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleService();
  });

  item.querySelectorAll(".service-showcase").forEach((showcase) => {
    showcase.addEventListener("click", (event) => event.stopPropagation());
  });
});

equipmentItems.forEach((item) => {
  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.setAttribute("aria-expanded", "false");

  const toggleEquipment = () => {
    const open = !item.classList.contains("is-open");
    item.closest(".equipment-grid")?.querySelectorAll("article.is-open").forEach((activeItem) => {
      if (activeItem !== item) {
        activeItem.classList.remove("is-open");
        activeItem.setAttribute("aria-expanded", "false");
      }
    });
    item.classList.toggle("is-open", open);
    item.setAttribute("aria-expanded", String(open));
  };

  item.addEventListener("click", toggleEquipment);
  item.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleEquipment();
  });
});

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

studioSoundLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.dataset.workJump;
    const targetTab = [...workTabs].find((tab) => tab.dataset.workFilter === target);
    if (!targetTab) return;

    event.preventDefault();
    activateWorkTab(targetTab);
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function briefPlainText() {
  if (!briefForm) {
    return currentLanguage === "es"
      ? "Quiero crear algo con LMDP."
      : "I want to build something with LMDP.";
  }

  const form = new FormData(briefForm);
  const name = form.get("name") || "Not provided";
  const service = form.get("service") || "Not selected";
  const budget = form.get("budget") || "Not provided";
  const message = form.get("message") || (currentLanguage === "es" ? "Quiero crear algo con LMDP." : "I want to build something with LMDP.");

  if (currentLanguage === "es") {
    const displayService = localizedText(String(service), "es");
    return `Brief de proyecto LMDP\n\nNombre: ${name}\nServicio: ${displayService}\nPresupuesto: ${budget}\nProyecto: ${message}`;
  }

  return `LMDP project brief\n\nName: ${name}\nService: ${service}\nBudget: ${budget}\nProject: ${message}`;
}

function briefText() {
  return encodeURIComponent(briefPlainText());
}

whatsappButton?.addEventListener("click", () => {
  window.location.href = `https://wa.me/15618972555?text=${briefText()}`;
});

emailButton?.addEventListener("click", () => {
  const subject = encodeURIComponent(currentLanguage === "es" ? "Brief de Proyecto LMDP" : "LMDP Project Brief");
  window.location.href = `mailto:losmasdurosdelplaneta.llc@gmail.com?subject=${subject}&body=${briefText()}`;
});

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!briefForm) return;

    const service = briefForm.elements.service;
    const message = briefForm.elements.message;
    service.value = "Popular Package";
    message.value = currentLanguage === "es"
      ? `Quiero preguntar sobre el paquete ${localizedText(button.dataset.package || "", "es")}.`
      : `I want to ask about the ${button.dataset.package}.`;
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

studioBookingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!briefForm) return;

    const service = briefForm.elements.service;
    const message = briefForm.elements.message;
    service.value = button.dataset.service || "Music Production";
    message.value = button.dataset.message || "I want to book a recording session inside La Galaxia.";
  });
});

function setupStudioViewer() {
  if (!studioViewer || !(studioImage instanceof HTMLImageElement)) return;

  let position = 0.68;
  let dragging = false;
  let lastX = 0;

  function maxShift() {
    return Math.max(0, studioImage.offsetWidth - studioViewer.clientWidth);
  }

  function clamp(value) {
    return Math.min(1, Math.max(0, value));
  }

  function render() {
    const shift = maxShift();
    studioImage.style.transform = `translate3d(${-position * shift}px, 0, 0)`;
  }

  function setPosition(value) {
    position = clamp(value);
    render();
  }

  function startDrag(event) {
    dragging = true;
    lastX = event.clientX;
    studioViewer.setPointerCapture?.(event.pointerId);
    studioViewer.classList.add("is-dragging");
  }

  function drag(event) {
    if (!dragging) return;

    const shift = maxShift();
    const delta = event.clientX - lastX;
    lastX = event.clientX;
    if (shift > 0) setPosition(position - delta / shift);
  }

  function endDrag(event) {
    dragging = false;
    studioViewer.releasePointerCapture?.(event.pointerId);
    studioViewer.classList.remove("is-dragging");
  }

  studioImage.addEventListener("load", render);
  window.addEventListener("resize", render);
  studioViewer.addEventListener("pointerdown", startDrag);
  studioViewer.addEventListener("pointermove", drag);
  studioViewer.addEventListener("pointerup", endDrag);
  studioViewer.addEventListener("pointercancel", endDrag);
  studioViewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition(position - 0.08);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition(position + 0.08);
    }
  });

  if (studioImage.complete) render();
}

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
  if (!planetCursor || reduceMotion.matches) return;

  const current = { x: -100, y: -100 };
  const target = { x: -100, y: -100 };
  let visible = false;
  let enabled = false;

  const canShowCursor = (event) => {
    if (window.innerWidth < 760) return false;
    return event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "";
  };

  const enableCursor = () => {
    if (enabled) return;
    enabled = true;
    body.classList.add("has-planet-cursor");
  };

  const disableCursor = () => {
    enabled = false;
    visible = false;
    mouse.active = false;
    planetCursor.style.opacity = "0";
    body.classList.remove("has-planet-cursor");
  };

  window.addEventListener("pointermove", (event) => {
    if (!canShowCursor(event)) {
      disableCursor();
      return;
    }

    enableCursor();
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

  window.addEventListener("resize", () => {
    if (window.innerWidth < 760) disableCursor();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!enabled) return;

    const targetElement = event.target;
    if (!(targetElement instanceof Element)) return;

    if (!targetElement.closest("a, button, .tab, .work-tab, input, textarea, select")) return;

    planetCursor.classList.remove("is-clicking");
    void planetCursor.offsetWidth;
    planetCursor.classList.add("is-clicking");
    window.setTimeout(() => planetCursor.classList.remove("is-clicking"), 430);
  });

  document.addEventListener("pointerover", (event) => {
    if (!enabled) return;

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

function setupHeroGlobeDrag() {
  if (!heroGlobe) return;

  const canvas = heroGlobeCanvas;
  const ctx = canvas?.getContext("2d");
  const useCanvasGlobe = Boolean(canvas && ctx);

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let rotateX = 0;
  let rotateY = 0;
  let targetPitch = 0.08;
  let targetYaw = -0.5;
  let pitch = targetPitch;
  let yaw = targetYaw;
  let frameId = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function applyRotation() {
    if (useCanvasGlobe) return;
    heroGlobe.style.setProperty("--globe-drag-x", `${rotateX.toFixed(2)}deg`);
    heroGlobe.style.setProperty("--globe-drag-y", `${rotateY.toFixed(2)}deg`);
  }

  if (useCanvasGlobe) {
    const landShapes = [
      [
        [-168, 61], [-155, 68], [-138, 70], [-125, 64], [-113, 58], [-100, 54],
        [-83, 52], [-63, 46], [-69, 36], [-82, 29], [-94, 20], [-109, 23],
        [-122, 32], [-134, 39], [-148, 45]
      ],
      [
        [-94, 17], [-83, 13], [-78, 6], [-81, -4], [-75, -14], [-68, -24],
        [-63, -36], [-70, -51], [-78, -55], [-82, -42], [-88, -30],
        [-86, -14], [-91, -1], [-97, 9]
      ],
      [[-55, 77], [-35, 74], [-18, 66], [-21, 58], [-38, 57], [-52, 63]],
      [
        [-12, 36], [2, 44], [19, 47], [36, 42], [42, 34], [29, 28],
        [12, 30], [-1, 27], [-10, 29]
      ],
      [
        [-18, 32], [-3, 35], [15, 34], [31, 25], [42, 10], [44, -4],
        [38, -18], [28, -30], [14, -36], [-3, -30], [-12, -17],
        [-17, -2], [-23, 13]
      ],
      [
        [32, 54], [56, 58], [82, 57], [104, 52], [127, 44], [148, 32],
        [140, 18], [122, 10], [100, 15], [83, 7], [66, 10], [51, 20],
        [39, 31]
      ],
      [[68, 25], [81, 27], [90, 19], [88, 8], [78, 6], [70, 14]],
      [[98, 6], [113, 7], [126, 0], [121, -8], [108, -9], [99, -2]],
      [[113, -20], [132, -16], [151, -24], [154, -37], [137, -44], [118, -39]],
      [[45, -12], [51, -20], [49, -28], [42, -30], [39, -21]]
    ];

    const cloudBands = [
      [[-160, 14], [-125, 19], [-85, 16], [-44, 22], [-8, 19], [32, 24], [78, 19], [128, 22], [170, 17]],
      [[-170, -24], [-130, -19], [-88, -23], [-50, -17], [-10, -22], [34, -17], [75, -21], [116, -16], [166, -20]],
      [[-148, 42], [-106, 45], [-68, 40], [-25, 46], [18, 42], [60, 48], [105, 43], [150, 46]]
    ];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function projectPoint(lonDeg, latDeg, size) {
      const radius = size * 0.46;
      const lon = lonDeg * Math.PI / 180 + yaw;
      const lat = latDeg * Math.PI / 180;
      const x = Math.cos(lat) * Math.sin(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(lon);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const tiltedY = y * cosPitch - z * sinPitch;
      const tiltedZ = y * sinPitch + z * cosPitch;

      return {
        x: size / 2 + x * radius,
        y: size / 2 - tiltedY * radius,
        z: tiltedZ
      };
    }

    function drawProjectedLine(points, size, strokeStyle, lineWidth) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      let drawing = false;
      points.forEach(([lon, lat]) => {
        const point = projectPoint(lon, lat, size);
        if (point.z < 0.02) {
          drawing = false;
          return;
        }

        if (!drawing) {
          ctx.moveTo(point.x, point.y);
          drawing = true;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();
    }

    function drawLandShape(shape, size) {
      const projected = shape.map(([lon, lat]) => projectPoint(lon, lat, size));
      const averageZ = projected.reduce((sum, point) => sum + point.z, 0) / projected.length;
      if (averageZ < 0.01) return;

      ctx.beginPath();
      projected.forEach((point, index) => {
        const next = projected[(index + 1) % projected.length];
        const midX = (point.x + next.x) / 2;
        const midY = (point.y + next.y) / 2;
        if (index === 0) ctx.moveTo(midX, midY);
        else ctx.quadraticCurveTo(point.x, point.y, midX, midY);
      });
      ctx.closePath();
      const landGradient = ctx.createLinearGradient(size * 0.22, size * 0.18, size * 0.78, size * 0.82);
      landGradient.addColorStop(0, "#c6f35d");
      landGradient.addColorStop(0.45, "#9cd23f");
      landGradient.addColorStop(1, "#5f9f2c");
      ctx.fillStyle = landGradient;
      ctx.strokeStyle = "rgba(4, 20, 11, 0.58)";
      ctx.lineJoin = "round";
      ctx.lineWidth = size * 0.006;
      ctx.fill();
      ctx.stroke();
    }

    function drawCloudBand(points, size) {
      const projected = points.map(([lon, lat]) => projectPoint(lon, lat, size));
      ctx.beginPath();
      let drawing = false;
      projected.forEach((point, index) => {
        if (point.z < 0.04) {
          drawing = false;
          return;
        }

        if (!drawing) {
          ctx.moveTo(point.x, point.y);
          drawing = true;
          return;
        }

        const previous = projected[index - 1];
        const controlX = previous.x + (point.x - previous.x) * 0.54;
        const controlY = previous.y + (point.y - previous.y) * 0.54 - size * 0.014;
        ctx.quadraticCurveTo(controlX, controlY, point.x, point.y);
      });
      ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
      ctx.lineCap = "round";
      ctx.lineWidth = size * 0.022;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = size * 0.044;
      ctx.stroke();
    }

    function drawGlobe() {
      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const radius = size * 0.46;
      const center = size / 2;

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.save();
      ctx.translate((rect.width - size) / 2, (rect.height - size) / 2);

      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(center - radius * 0.42, center - radius * 0.36, radius * 0.06, center, center, radius * 1.08);
      ocean.addColorStop(0, "#9bf6ff");
      ocean.addColorStop(0.24, "#37c8e4");
      ocean.addColorStop(0.58, "#139fc8");
      ocean.addColorStop(0.82, "#087bb1");
      ocean.addColorStop(1, "#064474");
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, size, size);

      landShapes.forEach((shape) => drawLandShape(shape, size));
      cloudBands.forEach((band) => drawCloudBand(band, size));

      const shade = ctx.createRadialGradient(center - radius * 0.42, center - radius * 0.46, radius * 0.12, center + radius * 0.3, center + radius * 0.24, radius * 1.06);
      shade.addColorStop(0, "rgba(255, 255, 255, 0.34)");
      shade.addColorStop(0.4, "rgba(255, 255, 255, 0.02)");
      shade.addColorStop(0.76, "rgba(3, 13, 21, 0.28)");
      shade.addColorStop(1, "rgba(0, 0, 0, 0.68)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, size, size);

      ctx.restore();

      ctx.save();
      ctx.translate((rect.width - size) / 2, (rect.height - size) / 2);
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(5, 17, 20, 0.82)";
      ctx.lineWidth = size * 0.01;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(center, center, radius + size * 0.012, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(109, 232, 255, 0.32)";
      ctx.lineWidth = size * 0.018;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(center - radius * 0.33, center - radius * 0.37, radius * 0.18, radius * 0.08, -0.7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.26)";
      ctx.fill();
      ctx.restore();
    }

    function renderGlobe() {
      if (!dragging && !reduceMotion.matches) targetYaw += 0.0045;
      yaw += (targetYaw - yaw) * 0.16;
      pitch += (targetPitch - pitch) * 0.16;
      drawGlobe();
      frameId = requestAnimationFrame(renderGlobe);
    }

    heroGlobe.classList.add("has-3d-globe");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    frameId = requestAnimationFrame(renderGlobe);

    window.addEventListener("pagehide", () => {
      if (frameId) cancelAnimationFrame(frameId);
    }, { once: true });
  }

  heroGlobe.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    heroGlobe.classList.add("is-dragging");
    heroGlobe.setPointerCapture?.(event.pointerId);
  });

  heroGlobe.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    if (useCanvasGlobe) {
      targetYaw += deltaX * 0.014;
      targetPitch = clamp(targetPitch - deltaY * 0.006, -0.45, 0.45);
    } else {
      rotateY = (rotateY + deltaX * 0.55) % 360;
      rotateX = clamp(rotateX - deltaY * 0.28, -24, 24);
    }
    lastX = event.clientX;
    lastY = event.clientY;
    applyRotation();
  });

  function stopDrag(event) {
    if (!dragging) return;
    dragging = false;
    heroGlobe.classList.remove("is-dragging");
    if (event?.pointerId !== undefined) heroGlobe.releasePointerCapture?.(event.pointerId);
  }

  heroGlobe.addEventListener("pointerup", stopDrag);
  heroGlobe.addEventListener("pointercancel", stopDrag);
  heroGlobe.addEventListener("lostpointercapture", stopDrag);
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
  }, { rootMargin: "220px 0px", threshold: 0.12 });

  videos.forEach((video) => observer.observe(video));
}

setupGalaxy();
setupPlanetCursor();
setupScrollVideos();
setupStudioViewer();
