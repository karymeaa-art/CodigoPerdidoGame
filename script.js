(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const screen = document.getElementById("screen");
  const toastNode = document.getElementById("toast");
  const titleScreen = document.getElementById("title-screen");
  const titlePanel = document.getElementById("title-panel");
  const W = canvas.width;
  const H = canvas.height;
  const SAVE_KEY = "codigoPerdido.save.v1";
  const colors = {
    cyan: "#62f4e3", purple: "#a38bff", pink: "#ff6fae",
    themes: [
      { sky: "#10132b", glow: "#2b5570", ground: "#18213a", accent: "#62f4e3" },
      { sky: "#17142f", glow: "#553b78", ground: "#24203e", accent: "#c29aff" },
      { sky: "#101c35", glow: "#246a83", ground: "#1c2a43", accent: "#57edff" },
      { sky: "#20162e", glow: "#783b82", ground: "#30203e", accent: "#ff75c7" },
      { sky: "#160e27", glow: "#873f74", ground: "#281a3a", accent: "#ff6fae" }
    ]
  };
  const levels = [
    { name: "Archivo dañado", subtitle: "ALMACÉN DE MEMORIAS", width: 1900, puzzle: "Ordena la secuencia para arrancar el archivo.", question: "¿Qué instrucción va primero?", options: ["INICIAR → LEER → GUARDAR", "BORRAR → APAGAR → INICIAR", "GUARDAR → LEER → BORRAR"], answer: 0, hint: "Primero se inicia un archivo antes de leerlo.", memory: "BYTE despierta entre archivos rotos. PIXEL: «Te estaba esperando… creo.»", secretMemory: "Un registro de BYTE anota que PIXEL fue creado para encontrar recuerdos que nadie más logra ver.", enemies: ["BUG"], skill: "DASH", platforms: [[0,470,510,70,0],[570,470,360,70,0],[990,470,390,70,0],[1450,470,450,70,0],[300,365,130,18,0],[680,330,150,18,1],[1080,360,130,18,0],[1300,300,150,18,1]], pickups: [[220,"coin"],[360,"memory"],[740,"coin"],[1120,"memory"],[1540,"secret"]] },
    { name: "Laberinto de datos", subtitle: "SERVIDORES EN SOMBRA", width: 2050, puzzle: "Encuentra el error en la rutina del Firewall.", question: "¿Cuál de estas secuencias es segura?", options: ["VERIFICAR → ABRIR", "ABRIR → VERIFICAR", "IGNORAR → BORRAR"], answer: 0, hint: "Verifica los permisos antes de abrir una puerta.", memory: "PIXEL recuerda una señal de auxilio en el laberinto.", secretMemory: "El archivo oculto contiene la señal de auxilio original; PIXEL la reconoce como un mensaje de BYTE.", enemies: ["BUG","BUG"], skill: "HACK", platforms: [[0,470,410,70,0],[480,470,320,70,0],[870,470,420,70,0],[1360,470,330,70,0],[1760,470,290,70,0],[180,365,160,18,0],[570,325,150,18,1],[950,360,160,18,0],[1190,300,150,18,1],[1500,350,140,18,0]], pickups: [[260,"coin"],[630,"memory"],[1020,"coin"],[1450,"memory"],[1820,"secret"]] },
    { name: "Zona Glitch", subtitle: "CIUDAD ENTRE REALIDADES", width: 2150, puzzle: "Conecta el circuito usando el orden correcto.", question: "¿Qué ruta lleva energía al núcleo?", options: ["FUENTE → PUENTE → NÚCLEO", "NÚCLEO → FUENTE → PUENTE", "PUENTE → NÚCLEO → FUENTE"], answer: 0, hint: "La energía sale de la fuente y termina en el núcleo.", memory: "BYTE: «Este error… reconoce mi firma.»", secretMemory: "La cámara conserva una copia de seguridad firmada por CORRUPT antes de que empezara la falla.", enemies: ["GLITCH","BUG"], skill: "FREEZE", platforms: [[0,470,350,70,0],[430,470,310,70,1],[820,470,360,70,0],[1260,470,330,70,1],[1660,470,490,70,0],[210,365,140,18,1],[530,320,150,18,0],[910,350,150,18,1],[1320,310,150,18,0],[1740,350,150,18,1]], pickups: [[150,"coin"],[500,"memory"],[950,"coin"],[1380,"memory"],[1880,"secret"]] },
    { name: "Núcleo del sistema", subtitle: "LABORATORIO ABANDONADO", width: 2200, puzzle: "Descifra la contraseña del registro sellado.", question: "¿Cuál es la clave del sistema?", options: ["BYTE-07", "PIXEL-00", "ERROR-99"], answer: 0, hint: "El registro muestra las iniciales de su creador: BYTE.", memory: "El registro revela que BYTE fue diseñado para proteger las memorias.", secretMemory: "El expediente de diseño muestra que PIXEL puede restaurar fragmentos sin borrar los recuerdos originales.", enemies: ["SENTINEL","BUG"], skill: "DOUBLE JUMP", platforms: [[0,470,420,70,0],[500,470,360,70,0],[930,470,330,70,0],[1330,470,330,70,0],[1730,470,470,70,0],[250,350,150,18,1],[600,305,160,18,0],[990,345,150,18,1],[1410,290,160,18,0],[1810,345,150,18,1]], pickups: [[310,"coin"],[680,"memory"],[1050,"coin"],[1490,"memory"],[1910,"secret"]] },
    { name: "El último error", subtitle: "NÚCLEO CENTRAL", width: 2250, puzzle: "CORRUPT te muestra la última secuencia.", question: "¿Qué debe hacer BYTE para liberar las memorias?", options: ["REPARAR → COMPARTIR", "REINICIAR → OLVIDAR", "OCULTAR → BLOQUEAR"], answer: 0, hint: "Las memorias se liberan cuando se reparan y se comparten.", memory: "CORRUPT: «Yo soy la versión que BYTE dejó atrás.»", secretMemory: "El archivo revela que BYTE y CORRUPT compartían los mismos recuerdos antes de separarse.", enemies: ["GLITCH","SENTINEL"], skill: "SHIELD", platforms: [[0,470,410,70,0],[500,470,350,70,0],[930,470,370,70,0],[1380,470,320,70,0],[1770,470,480,70,0],[250,350,150,18,1],[610,315,150,18,0],[1050,345,150,18,1],[1450,300,150,18,0],[1870,345,150,18,1]], pickups: [[300,"coin"],[680,"memory"],[1090,"coin"],[1510,"memory"],[1940,"secret"]] }
  ];
  const defaultSave = () => ({
    unlocked: 0, completed: [], endings: [], coins: 0, memories: 0, secrets: [],
    upgrades: [], decisions: [], settings: { volume: 0.25, mute: true, effectsEnabled: false, musicEnabled: true }, skin: 0,
    bestTimes: {}, score: 0, lastLevel: null, collected: []
  });
  let save = readSave();
  let mode = "title";
  let currentLevel = 0;
  let world = null;
  let camera = 0;
  let frame = 0;
  let lastTime = 0;
  let toastTimer = 0;
  let keys = new Set();
  let audioContext = null;
  let audioResumeRequest = null;
  let musicBuffer = null;
  let musicSource = null;
  let musicGain = null;
  let musicVolume = null;
  let lastPuzzleFeedback = "";

  function readSave() {
    const base = defaultSave();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      const settings = parsed.settings || {};
      return {
        ...base, ...parsed,
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        endings: Array.isArray(parsed.endings) ? parsed.endings : [],
        secrets: Array.isArray(parsed.secrets) ? parsed.secrets : [],
        upgrades: Array.isArray(parsed.upgrades) ? parsed.upgrades : [],
        collected: Array.isArray(parsed.collected) ? parsed.collected : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
        settings: {
          ...base.settings, ...settings,
          effectsEnabled: typeof settings.effectsEnabled === "boolean" ? settings.effectsEnabled : !settings.mute,
          musicEnabled: typeof settings.musicEnabled === "boolean" ? settings.musicEnabled : true
        }
      };
    } catch (error) {
      console.error("No se pudo leer el guardado:", error);
      return base;
    }
  }
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
    catch (error) { console.error("No se pudo guardar el progreso:", error); toast("No se pudo guardar. Revisa el almacenamiento del navegador."); }
  }
  function toast(message) {
    toastNode.textContent = message;
    toastNode.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastNode.classList.remove("show"), 2300);
  }
  function button(label, action, detail = "", disabled = false, primary = false) {
    return `<button class="menu-button${primary ? " primary" : ""}" data-action="${action}"${disabled ? " disabled" : ""}>${label}${detail ? `<small>${detail}</small>` : ""}</button>`;
  }
  function showScreen(html, wide = false) {
    screen.innerHTML = `<div class="screen-card${wide ? " wide" : ""}">${html}</div>`;
    screen.classList.remove("hidden");
  }
  function hideScreen() { screen.classList.add("hidden"); screen.innerHTML = ""; }
  function showTitleScreen() {
    mode = "title";
    hideScreen();
    titlePanel.hidden = true;
    titlePanel.innerHTML = "";
    titleScreen.hidden = false;
    const detail = document.getElementById("play-detail");
    if (detail) detail.textContent = save.lastLevel !== null
      ? `Continuar en el sector ${Math.min(save.lastLevel + 1, 5)} · progreso guardado`
      : "Iniciar una nueva partida";
  }
  function hideTitleScreen() {
    titleScreen.hidden = true;
    titlePanel.hidden = true;
    titlePanel.innerHTML = "";
  }
  function showTitlePanel(title, content) {
    titlePanel.innerHTML = `<section class="title-panel-card" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="eyebrow">CÓDIGO PERDIDO / SISTEMA</div><h2>${title}</h2>${content}
      <button class="back-button" data-title-action="back">← VOLVER A LA PANTALLA DE INICIO</button>
    </section>`;
    titlePanel.hidden = false;
    const firstButton = titlePanel.querySelector("button");
    if (firstButton) firstButton.focus();
  }
  function openTitleOptions() {
    const fullscreen = document.fullscreenEnabled
      ? `<div class="card-row"><div>PANTALLA<small>Alternar pantalla completa del navegador</small></div><button class="menu-button" data-title-action="fullscreen">${document.fullscreenElement ? "SALIR" : "COMPLETA"}</button></div>`
      : "";
    showTitlePanel("OPCIONES", `<p>Ajusta el audio del juego. La música y los efectos se generan localmente en el navegador.</p>
      <div class="card-row"><div>VOLUMEN GENERAL<small>Efectos y música</small></div><input class="title-settings-range" id="title-volume" type="range" min="0" max="1" step="0.05" value="${save.settings.volume}"></div>
      <div class="card-row"><div>MÚSICA<small>Banda ambiental sintetizada</small></div><button class="menu-button" data-title-action="music">${save.settings.musicEnabled ? "ACTIVADA" : "DESACTIVADA"}</button></div>
      <div class="card-row"><div>EFECTOS DE SONIDO<small>Saltos, acciones y hallazgos</small></div><button class="menu-button" data-title-action="effects">${save.settings.effectsEnabled ? "ACTIVADOS" : "DESACTIVADOS"}</button></div>
      ${fullscreen}
      <div class="title-panel-actions"><button class="menu-button" data-title-action="controls">CONTROLES</button><button class="menu-button" data-title-action="archive">PROGRESO Y ARCHIVO</button></div>`);
  }
  function openTitleControls() {
    showTitlePanel("CONTROLES", `<p>BYTE y PIXEL responden a estas teclas durante la partida.</p><div class="controls-grid">
      <div><span>Moverse</span><span class="key">A/D · ←/→</span></div><div><span>Saltar</span><span class="key">ESPACIO / ↑</span></div>
      <div><span>Dash</span><span class="key">SHIFT</span></div><div><span>Interactuar</span><span class="key">E</span></div>
      <div><span>Cambiar realidad</span><span class="key">R</span></div><div><span>Habilidad de PIXEL</span><span class="key">F</span></div>
      <div><span>Congelar</span><span class="key">Q</span></div><div><span>Escudo desbloqueable</span><span class="key">X</span></div>
      <div><span>Pausar</span><span class="key">ESC</span></div></div>
      <p class="panel-hint">En pantallas táctiles también aparecen controles en pantalla.</p>`);
  }
  function openTitleCredits() {
    showTitlePanel("CRÉDITOS", `<p><b>CÓDIGO PERDIDO: ESCAPE DEL SISTEMA</b></p>
      <div class="card-row"><div>DISEÑO Y DESARROLLO<small>Equipo creador de Código Perdido</small></div></div>
      <div class="card-row"><div>BYTE<small>Protagonista / Archivo 07</small></div></div>
      <div class="card-row"><div>PIXEL<small>Compañero y explorador de memorias</small></div></div>
      <div class="card-row"><div>TECNOLOGÍA<small>JavaScript · HTML5 Canvas · Web Audio</small></div></div>
      <p class="panel-hint">Arte y efectos visuales generados dentro del proyecto. Sin servicios ni recursos externos.</p>`);
  }
  function openExitConfirmation() {
    showTitlePanel("SALIR DEL JUEGO", `<p>Tu progreso se guarda en este navegador. Por seguridad, algunos navegadores no permiten que una página cierre su propia pestaña.</p>
      <p class="panel-hint">Puedes cerrar esta pestaña manualmente para salir. Si prefieres continuar, vuelve al menú principal.</p>
      <div class="title-panel-actions"><button class="menu-button primary" data-title-action="back">VOLVER AL MENÚ</button><button class="menu-button" data-title-action="close-window">INTENTAR CERRAR</button></div>`);
  }
  function mainMenu() {
    mode = "menu";
    hideTitleScreen();
    hideScreen();
    render();
    const continued = save.lastLevel !== null;
    showScreen(`<div class="eyebrow">UNA AVENTURA DE PLATAFORMAS / 2D</div>
      <h1>CÓDIGO<br><em>PERDIDO</em></h1>
      <p class="sub">BYTE despierta dentro de un sistema roto. Con PIXEL a su lado, deberá recuperar sus recuerdos y decidir qué merece ser salvado.</p>
      <div class="button-grid">
        ${button("NUEVA PARTIDA", "new", "Inicia una aventura desde el primer sector.", false, true)}
        ${button("CONTINUAR", "continue", `Sector ${Math.min(save.unlocked + 1, 5)} · ${save.memories} recuerdos`, !continued)}
        ${button("SELECCIÓN DE NIVEL", "levels", `${save.completed.length}/5 sectores completados`)}
        ${button("ÁRBOL DE HABILIDADES", "upgrades", `${save.coins} créditos disponibles`)}
        ${button("RECUERDOS", "memories", `${save.memories} fragmentos · ${save.secrets.length} archivos secretos`)}
        ${button("PERSONALIZAR BYTE", "skins", "Elige la apariencia del protagonista.")}
        ${button("CONTROLES", "controls", "Teclado y pantalla táctil")}
        ${button("CONFIGURACIÓN", "settings", "Audio y opciones")}
        ${button("CRÉDITOS", "credits", "Un juego independiente, hecho en Canvas.")}
        ${button("PANTALLA DE INICIO", "title", "Volver al menú principal.")}
      </div>`);
  }
  function menuBack(title, body, wide = false) {
    showScreen(`<div class="eyebrow">CÓDIGO PERDIDO</div><h2>${title}</h2>${body}<button class="back-button" data-action="menu">← VOLVER AL MENÚ</button>`, wide);
  }
  function openLevelSelect() {
    const rows = levels.map((level, i) => {
      const locked = i > save.unlocked;
      const complete = save.completed.includes(i);
      const time = save.bestTimes[i] ? ` · Récord ${formatTime(save.bestTimes[i])}` : "";
      return `<div class="card-row"><div>${String(i + 1).padStart(2, "0")} / ${level.name}<small>${level.subtitle}${complete ? " · COMPLETADO" : ""}${time}</small></div>${button(locked ? "BLOQUEADO" : "JUGAR", `level:${i}`, "", locked, !locked)}</div>`;
    }).join("");
    menuBack("SELECCIÓN DE SECTOR", `<p>Elige un sector desbloqueado. Puedes repetir niveles para buscar recuerdos y secretos.</p>${rows}`, true);
  }
  const upgradeList = [
    { id: "speed", name: "MOVILIDAD / Impulso", desc: "Aumenta la velocidad de BYTE.", cost: 5 },
    { id: "energy", name: "ENERGÍA / Batería", desc: "Aumenta la capacidad de energía.", cost: 6 },
    { id: "jump", name: "SALTO / Propulsor", desc: "Mejora el salto y el segundo impulso.", cost: 5 },
    { id: "pixel", name: "PIXEL / Escáner", desc: "Amplía el alcance de detección de secretos.", cost: 7 },
    { id: "shield", name: "DEFENSA / Blindaje", desc: "Reduce el daño recibido una vez por nivel.", cost: 8 }
  ];
  function openUpgrades() {
    const rows = upgradeList.map((item) => {
      const owned = save.upgrades.includes(item.id);
      return `<div class="card-row"><div>${item.name}<small>${item.desc} · ${item.cost} créditos</small></div>${button(owned ? "ADQUIRIDO" : "COMPRAR", `upgrade:${item.id}`, `${save.coins} créditos`, owned || save.coins < item.cost)}</div>`;
    }).join("");
    menuBack("ÁRBOL DE HABILIDADES", `<p>Los créditos se encuentran explorando los sectores. Las mejoras cambian las habilidades de BYTE.</p>${rows}`, true);
  }
  function openMemories() {
    const entries = levels.map((level, i) => {
      const secretFound = save.secrets.includes(`${i}-4`);
      return `<div class="card-row"><div>${String(i + 1).padStart(2, "0")} / ${level.name}<small>${save.completed.includes(i) ? level.memory : "ARCHIVO CIFRADO · Completa el sector para recuperarlo."}<br>${secretFound ? `ARCHIVO SECRETO · ${level.secretMemory}` : "ARCHIVO OCULTO · Usa el escáner de PIXEL para encontrar una cámara secreta."}</small></div><span class="eyebrow">${secretFound ? "SECRETO" : save.completed.includes(i) ? "RECUPERADO" : "???"}</span></div>`;
    }).join("");
    menuBack("ARCHIVO DE RECUERDOS", `<p>${save.memories} fragmentos recuperados · ${save.secrets.length}/5 secretos encontrados · Finales: ${save.endings.length}/3</p>${entries}`, true);
  }
  function openSkins() {
    const skins = ["Cian original", "Violeta", "Rosa"];
    const rows = skins.map((skin, index) => `<div class="card-row"><div>BYTE / ${skin}<small>${index === 0 ? "Apariencia de inicio" : "Apariencia alternativa desbloqueable"}</small></div>${button(save.skin === index ? "EQUIPADO" : "EQUIPAR", `skin:${index}`, "", save.skin === index || (index > 0 && save.secrets.length < index))}</div>`).join("");
    menuBack("PERSONALIZACIÓN", `<p>Encuentra archivos secretos para desbloquear colores alternativos.</p>${rows}`);
  }
  function openControls() {
    menuBack("CONTROLES", `<p>BYTE se mueve con fluidez por cada sector. Pulsa <span class="key">ESC</span> para pausar en cualquier momento.</p>
      <div class="controls-grid">
        <div><span>Moverse</span><span class="key">WASD / ← →</span></div><div><span>Saltar</span><span class="key">ESPACIO / ↑</span></div>
        <div><span>Dash</span><span class="key">SHIFT</span></div><div><span>Interactuar / Hack</span><span class="key">E</span></div>
        <div><span>Congelar</span><span class="key">Q</span></div><div><span>Cambiar realidad</span><span class="key">R</span></div>
        <div><span>Habilidad de PIXEL</span><span class="key">F</span></div><div><span>Escudo (al desbloquear)</span><span class="key">X</span></div>
        <div><span>Pausar</span><span class="key">ESC</span></div>
      </div><p style="margin-top:16px">En móvil, usa las flechas y los botones SALTO / USAR en pantalla. El progreso se guarda automáticamente.</p>`);
  }
  function openSettings() {
    const fullscreen = document.fullscreenEnabled
      ? `<div class="card-row"><div>PANTALLA<small>Alternar pantalla completa del navegador</small></div>${button(document.fullscreenElement ? "SALIR" : "COMPLETA", "fullscreen")}</div>`
      : "";
    menuBack("CONFIGURACIÓN", `<div class="card-row"><div>MÚSICA<small>Banda ambiental sintetizada</small></div><button class="menu-button" data-action="music">${save.settings.musicEnabled ? "ACTIVADA" : "DESACTIVADA"}</button></div>
      <div class="card-row"><div>EFECTOS DE SONIDO<small>Acciones, saltos y hallazgos</small></div><button class="menu-button" data-action="mute">${save.settings.effectsEnabled ? "ACTIVADOS" : "DESACTIVADOS"}</button></div>
      <div class="card-row"><div>VOLUMEN GENERAL<small>Ajusta música y efectos</small></div><input id="volume" type="range" min="0" max="1" step="0.05" value="${save.settings.volume}"></div>
      ${fullscreen}
      <div class="card-row"><div>BORRAR PROGRESO<small>Reinicia niveles, recuerdos y mejoras</small></div>${button("REINICIAR", "reset", "No se puede deshacer.")}</div>`);
  }
  function openCredits() {
    menuBack("CRÉDITOS", `<p><b>CÓDIGO PERDIDO: ESCAPE DEL SISTEMA</b><br>Un juego indie de plataformas construido con JavaScript puro y Canvas 2D.</p>
      <p>Diseño, código y mundo: tú y BYTE.<br>Compañero de aventura: PIXEL.<br>Música y efectos: síntesis procedural en el navegador.<br>Sin imágenes, librerías ni servicios externos.</p>`);
  }
  function beginNewGame() {
    const settings = { ...save.settings };
    save = defaultSave();
    save.settings = settings;
    persist();
    startLevel(0, true);
  }
  function startLevel(index, firstTime = false) {
    hideTitleScreen();
    currentLevel = index;
    save.lastLevel = index;
    persist();
    const data = levels[index];
    const secretPickup = data.pickups.find(([, type]) => type === "secret");
    const secretIndex = data.pickups.findIndex(([, type]) => type === "secret");
    const secretRoom = secretPickup ? {
      x: secretPickup[0], y: 205, width: 300, height: 215, floorY: 420,
      revealed: false, inside: false, collected: save.collected.includes(`${index}-${secretIndex}`),
      returnX: 0, returnY: 0
    } : null;
    const pickupList = data.pickups.map(([x, type], i) => ({
      x: type === "secret" ? secretRoom.x + 225 : x,
      y: type === "secret" ? secretRoom.floorY - 20 : (type === "memory" ? 390 : 425),
      type, id: `${index}-${i}`, collected: save.collected.includes(`${index}-${i}`)
    }));
    const enemyTypes = data.enemies;
    world = {
      width: data.width, platforms: data.platforms.map(([x,y,w,h,realm]) => ({x,y,w,h,realm})),
      secretRoom,
      pickups: pickupList, puzzleSolved: false, elapsed: 0, deaths: 0, message: "",
      exitX: data.width - 92, switches: 0, particles: [],
      enemies: enemyTypes.map((type, i) => ({ type, x: 470 + i * 570, y: 430, vx: i % 2 ? -1 : 1, alive: true, phase: Math.random() * 5, hp: 1 })),
      boss: index === 4 ? { x: data.width - 330, y: 356, hp: 3, phase: 1, defeated: false, attack: 0, flashed: 0 } : null,
      player: { x: 58, safeX: 58, y: 400, w: 28, h: 38, vx: 0, vy: 0, grounded: false, jumps: 0, health: 3, maxHealth: 3, energy: 100, maxEnergy: save.upgrades.includes("energy") ? 140 : 100, invuln: 0, dash: 0, dashCooldown: 0, shield: 0, frozen: 0, facing: 1 },
      pixel: { x: 25, y: 350, pulse: 0, shielded: false, hint: "" }
    };
    const upgraded = save.upgrades.includes("shield");
    if (upgraded) world.player.health = world.player.maxHealth = 4;
    camera = 0;
    mode = "playing";
    hideScreen();
    playTone(420, .08);
    if (firstTime && index === 0) showDialogue("PIXEL", "¡BYTE! Estás en el Archivo Dañado. Muévete con ← →, salta con ESPACIO y busca los fragmentos. Yo te seguiré.", "close-tutorial");
    else toast(`SECTOR ${index + 1}: ${data.name}`);
    persist();
    syncMusic();
  }
  function showDialogue(name, text, action = "resume") {
    mode = "dialog";
    showScreen(`<div class="eyebrow">TRANSMISIÓN ENTRANTE / ${name}</div><h2>${name === "PIXEL" ? "PIXEL" : "ARCHIVO RECUPERADO"}</h2><p>${text}</p>${button("CONTINUAR", action, "", false, true)}`);
  }
  function pauseGame() {
    if (mode === "playing") {
      mode = "paused";
      showScreen(`<div class="eyebrow">SECTOR ${currentLevel + 1} / PAUSA</div><h2>BYTE EN ESPERA</h2><p>El sistema guarda tu progreso automáticamente.</p><div class="button-grid">${button("CONTINUAR", "resume", "", false, true)}${button("CONTROLES", "controls-game")}${button("VOLVER AL MENÚ", "menu")}</div>`);
    } else if (mode === "paused") { mode = "playing"; hideScreen(); }
  }
  function showPuzzle(bossPuzzle = false) {
    mode = "puzzle";
    const data = levels[currentLevel];
    const choices = data.options.map((option, i) => `<button class="choice-button" data-action="answer:${i}"><span class="key">${i + 1}</span> &nbsp;${option}</button>`).join("");
    showScreen(`<div class="eyebrow">${bossPuzzle ? "CORRUPT / FASE 3" : `TERMINAL / SECTOR ${currentLevel + 1}`}</div><h2>${data.puzzle}</h2><p>${data.question}</p>${choices}<p id="feedback" style="color:#ff9ac4">${lastPuzzleFeedback}</p>${button("PEDIR PISTA A PIXEL", "hint", "PIXEL te ayudará a encontrar la lógica.")}<button class="back-button" data-action="puzzle-close">← VOLVER AL SECTOR</button>`);
  }
  function answerPuzzle(answer) {
    if (answer !== levels[currentLevel].answer) {
      lastPuzzleFeedback = "No exactamente. Revisa la secuencia e inténtalo otra vez.";
      playTone(160, .13);
      showPuzzle(currentLevel === 4 && world.boss && world.boss.phase === 3);
      return;
    }
    lastPuzzleFeedback = "";
    mode = "playing";
    hideScreen();
    playTone(740, .14);
    if (currentLevel === 4 && world.boss && world.boss.phase === 3) {
      if (!save.decisions.includes(`puzzle-${currentLevel}`)) save.decisions.push(`puzzle-${currentLevel}`);
      persist();
      world.boss.defeated = true;
      world.boss.hp = 0;
      toast("NÚCLEO DE CORRUPT DESACTIVADO");
      setTimeout(showFinalChoice, 650);
    } else {
      world.puzzleSolved = true;
      world.player.energy = Math.min(world.player.maxEnergy, world.player.energy + 30);
      toast("ACERTIJO RESUELTO · PUERTA DESBLOQUEADA");
      if (!save.decisions.includes(`puzzle-${currentLevel}`)) save.decisions.push(`puzzle-${currentLevel}`);
      persist();
    }
  }
  function showFinalChoice() {
    mode = "ending";
    const hasTruth = save.secrets.length >= 3;
    showScreen(`<div class="eyebrow">DECISIÓN FINAL / DESTINO DEL SISTEMA</div><h2>¿Qué hará BYTE?</h2><p>${levels[4].memory} Los recuerdos recuperados cambiarán el final.</p>
      ${button("LIBERACIÓN", "ending:liberacion", "Libera a los programas atrapados.", false, true)}
      ${button("REINICIO", "ending:reinicio", "Detiene la corrupción, aunque algunos recuerdos se perderán.")}
      ${button("REVELAR LA VERDAD", "ending:verdad", hasTruth ? "Confronta el origen de BYTE y del sistema." : `Encuentra 3 archivos secretos para desbloquear esta opción (${save.secrets.length}/3).`, !hasTruth)}
      <p>Archivos secretos: ${save.secrets.length}/5</p>`, true);
  }
  function finishEnding(type) {
    const endings = {
      liberacion: ["FINAL 1 / LIBERACIÓN", "BYTE comparte sus recuerdos con los programas atrapados. El sistema vuelve a iluminarse y PIXEL, por fin, recuerda su nombre."],
      reinicio: ["FINAL 2 / REINICIO", "BYTE reinicia el núcleo y detiene la corrupción. Algunas memorias desaparecen, pero todos reciben una nueva oportunidad."],
      verdad: ["FINAL 3 / VERDAD OCULTA", "BYTE descubre que CORRUPT es su versión anterior. Al integrar sus recuerdos, ambos se convierten en uno y el sistema conoce su verdadera historia."]
    };
    if (!endings[type]) {
      toast("Esa decisión no está disponible.");
      return;
    }
    if (type === "verdad" && save.secrets.length < 3) return;
    if (!save.endings.includes(type)) save.endings.push(type);
    if (!save.decisions.includes(`final-${type}`)) save.decisions.push(`final-${type}`);
    save.completed = Array.from(new Set([...save.completed, 4]));
    save.unlocked = 5;
    persist();
    mode = "ending";
    const content = endings[type];
    showScreen(`<div class="eyebrow">${content[0]}</div><h1><em>${type === "verdad" ? "VERDAD" : type.toUpperCase()}</em></h1><p>${content[1]}</p><p>Finales descubiertos: ${save.endings.length}/3 · Recuerdos: ${save.memories}</p><div class="button-grid">${button("VOLVER AL MENÚ", "menu", "", false, true)}${button("REPETIR SECTOR 5", "level:4")}</div>`);
    playTone(660, .35);
  }

  function interact() {
    if (mode !== "playing" || !world) return;
    const p = world.player;
    const room = world.secretRoom;
    if (room && room.inside) {
      if (p.x < room.x + 42) {
        room.inside = false;
        p.x = room.returnX;
        p.y = room.returnY;
        p.vx = 0;
        p.vy = 0;
        toast("CÁMARA SECRETA · REGRESO AL SECTOR");
      } else toast("PIXEL: «El acceso está detrás de nosotros.»");
      return;
    }
    if (room && !room.collected && Math.abs(p.x - room.x) < 52) {
      if (!room.revealed) {
        toast("PIXEL: «Hay una entrada oculta. Pulsa F para escanearla.»");
        return;
      }
      room.inside = true;
      room.returnX = p.x;
      room.returnY = p.y;
      p.x = room.x + 58;
      p.y = room.floorY - p.h;
      p.vx = 0;
      p.vy = 0;
      p.grounded = true;
      p.jumps = 0;
      toast("CÁMARA SECRETA · Explora y pulsa E junto a la entrada para salir.");
      return;
    }
    if (world.boss && !world.boss.defeated && Math.abs(p.x - world.boss.x) < 110) {
      const boss = world.boss;
      if (boss.phase === 1) {
        toast("PIXEL: «¡Usa DASH para golpear la defensa de CORRUPT!»");
      } else if (boss.phase === 2) {
        if (currentReality() === 1) {
          boss.hp--; boss.flashed = 18;
          if (boss.hp <= 0) boss.phase = 3;
          toast("HACK A DISTANCIA · DEFENSA DE CORRUPT DESACTIVADA");
        } else toast("Cambia a la realidad corrupta con R y usa HACK.");
      } else if (boss.phase === 3) showPuzzle(true);
      return;
    }
    if (Math.abs(p.x - 1040) < 90 && !world.puzzleSolved) { showPuzzle(); return; }
    if (Math.abs(p.x - 1040) < 90 && world.puzzleSolved) { toast("La puerta está abierta. ¡Continúa hacia la salida!"); return; }
    if (Math.abs(p.x - world.exitX) < 75) {
      if (!world.puzzleSolved && currentLevel < 4) { toast("La salida necesita energía. Busca el terminal y resuelve su acertijo con E."); return; }
      completeLevel();
      return;
    }
    if (Math.abs(p.x - 720) < 90 && currentLevel === 1) {
      if (currentReality() === 1) { activateDataBridge(); toast("PIXEL activó el puente de datos en la realidad corrupta."); }
      else toast("PIXEL: «Activa la realidad corrupta y pulsa F para llegar al interruptor.»");
      return;
    }
    toast("PIXEL: «No detecto nada que podamos activar aquí.»");
  }
  function currentReality() { return world ? world.reality || 0 : 0; }
  function canSwitchReality(nextReality) {
    if (world.secretRoom && world.secretRoom.inside) return true;
    const p = world.player;
    if (!p.grounded) return true;
    return world.platforms.some((platform) =>
      (platform.realm === 0 || platform.realm === nextReality) &&
      p.x + p.w > platform.x && p.x < platform.x + platform.w &&
      Math.abs(p.y + p.h - platform.y) <= 3
    );
  }
  function completeLevel() {
    const i = currentLevel;
    save.completed = Array.from(new Set([...save.completed, i]));
    save.unlocked = Math.max(save.unlocked, Math.min(4, i + 1));
    save.bestTimes[i] = Math.min(save.bestTimes[i] || Infinity, world.elapsed);
    save.score += 100 + world.pickups.filter((p) => p.collected).length * 20;
    if (!save.decisions.includes(`sector-${i}-complete`)) save.decisions.push(`sector-${i}-complete`);
    persist();
    playTone(650, .2);
    if (i === 4) {
      world.boss.defeated = true;
      showFinalChoice();
    } else {
      mode = "ending";
      showScreen(`<div class="eyebrow">SECTOR COMPLETADO / ${String(i + 1).padStart(2, "0")}</div><h2>${levels[i].name}</h2><p>${levels[i].memory}</p><p>Exploración: ${exploration()}% · Tiempo: ${formatTime(world.elapsed)} · Recuerdos: ${save.memories}</p><div class="button-grid">${button("SIGUIENTE SECTOR", `level:${i + 1}`, levels[i + 1].name, false, true)}${button("VOLVER AL MENÚ", "menu")}</div>`);
    }
  }
  function exploration() {
    if (!world) return 0;
    const total = world.pickups.length;
    const found = world.pickups.filter((item) => item.collected).length;
    return Math.round(found / total * 100);
  }
  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds || 0));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  }
  function buyUpgrade(id) {
    const item = upgradeList.find((entry) => entry.id === id);
    if (!item || save.upgrades.includes(id) || save.coins < item.cost) return;
    save.coins -= item.cost;
    save.upgrades.push(id);
    persist();
    toast(`${item.name} MEJORADO`);
    openUpgrades();
  }
  function unlockSkin(index) {
    if (index && save.secrets.length < index) return;
    save.skin = index;
    persist();
    openSkins();
  }

  function triggerPixel() {
    if (mode !== "playing" || !world) return;
    const p = world.player;
    world.pixel.pulse = 45;
    if (currentLevel === 1 && Math.abs(p.x - 720) < 160) {
      if (currentReality() === 1) {
        activateDataBridge();
        toast("PIXEL: «¡Puente de datos activado!»");
      } else toast("PIXEL: «El interruptor solo responde en la realidad corrupta.»");
      return;
    }
    const room = world.secretRoom;
    if (room && !room.collected && Math.abs(p.x - room.x) < 150) {
      room.revealed = true;
      toast("PIXEL ESCÁNER: «Entrada a cámara secreta detectada. Pulsa E junto al acceso.»");
      return;
    }
    const nearby = world.pickups.find((item) => !item.collected && Math.abs(item.x - p.x) < (save.upgrades.includes("pixel") ? 330 : 210));
    if (nearby) {
      world.pixel.hint = nearby.type === "secret" ? "ARCHIVO OCULTO" : nearby.type === "memory" ? "FRAGMENTO DE MEMORIA" : "CRÉDITOS";
      toast(`PIXEL ESCÁNER: ${world.pixel.hint} →`);
    } else if (!world.puzzleSolved) {
      toast(`PIXEL: «${levels[currentLevel].hint}»`);
    } else toast("PIXEL: «No detecto nada cerca. Sigamos explorando.»");
  }
  function damagePlayer() {
    const p = world.player;
    if (p.invuln > 0 || p.shield > 0) return;
    if (save.upgrades.includes("shield") && !world.shieldUsed) {
      world.shieldUsed = true;
      p.invuln = 90;
      toast("BLINDAJE DE PIXEL BLOQUEÓ EL IMPACTO");
      return;
    }
    p.health--;
    p.invuln = 100;
    p.vx = -p.facing * 4;
    p.vy = -5;
    playTone(120, .15);
    if (p.health <= 0) {
      world.deaths++;
      mode = "gameover";
      showScreen(`<div class="eyebrow">SEÑAL DE BYTE PERDIDA</div><h2>NO TE RINDAS</h2><p>PIXEL guardó tu progreso y tus recuerdos. Puedes volver a intentarlo.</p><div class="button-grid">${button("REINTENTAR SECTOR", `level:${currentLevel}`, "", false, true)}${button("VOLVER AL MENÚ", "menu")}</div>`);
    }
  }
  function useAbility(key) {
    if (mode !== "playing" || !world) return;
    const p = world.player;
    if (key === "Shift" && p.dashCooldown <= 0) {
      p.dash = 11;
      p.dashCooldown = 48;
      p.vx = p.facing * (save.upgrades.includes("speed") ? 12 : 10);
      p.vy = 0;
      burst(p.x + p.w / 2, p.y + p.h / 2, colors.cyan, 12);
      playTone(330, .07);
    } else if (key === "e" || key === "E") interact();
    else if ((key === "q" || key === "Q") && save.unlocked >= 2 && world.player.energy >= 20) {
      p.energy -= 20;
      p.frozen = 120;
      world.enemies.forEach((enemy) => enemy.frozen = 100);
      toast("FREEZE · SISTEMA DETENIDO");
    } else if ((key === "r" || key === "R") && save.unlocked >= 2 && p.energy >= 8) {
      const nextReality = currentReality() ? 0 : 1;
      if (!canSwitchReality(nextReality)) {
        toast("No puedes abandonar esa plataforma sin apoyo en la otra realidad.");
        return;
      }
      p.energy -= 8;
      world.reality = nextReality;
      burst(p.x, p.y, world.reality ? colors.pink : colors.cyan, 15);
      playTone(world.reality ? 560 : 430, .08);
      toast(world.reality ? "REALIDAD CORRUPTA" : "REALIDAD NORMAL");
    } else if (key === "f" || key === "F") triggerPixel();
    else if ((key === "x" || key === "X") && save.unlocked >= 4 && p.energy >= 24) {
      p.energy -= 24;
      p.shield = 110;
      toast("SHIELD · PIXEL PROTEGE A BYTE");
    }
  }

  function update(dt) {
    if (mode !== "playing" || !world) return;
    frame++;
    world.elapsed += dt;
    const p = world.player;
    const speed = save.upgrades.includes("speed") ? 4.1 : 3.4;
    const left = keys.has("ArrowLeft") || keys.has("a") || keys.has("A");
    const right = keys.has("ArrowRight") || keys.has("d") || keys.has("D");
    if (left) { p.vx = -speed; p.facing = -1; }
    else if (right) { p.vx = speed; p.facing = 1; }
    else if (p.dash <= 0) p.vx *= .78;
    if ((keys.has(" ") || keys.has("ArrowUp") || keys.has("w") || keys.has("W")) && !p.jumpHeld) {
      if (p.grounded || (save.unlocked >= 3 && p.jumps < 2)) {
        p.vy = p.grounded ? (save.upgrades.includes("jump") ? -12 : -10.5) : (save.upgrades.includes("jump") ? -10.5 : -9.5);
        p.grounded = false;
        p.jumps++;
        playTone(260, .05);
      }
      p.jumpHeld = true;
    }
    if (!(keys.has(" ") || keys.has("ArrowUp") || keys.has("w") || keys.has("W"))) p.jumpHeld = false;
    if (p.dash > 0) p.dash--;
    if (p.dashCooldown > 0) p.dashCooldown--;
    if (p.invuln > 0) p.invuln--;
    if (p.shield > 0) p.shield--;
    if (p.frozen > 0) p.frozen--;
    p.energy = Math.min(p.maxEnergy, p.energy + dt * 2.4);
    world.pixel.pulse = Math.max(0, world.pixel.pulse - 1);
    world.pixel.x += (p.x - 45 - world.pixel.x) * .075;
    world.pixel.y += (p.y - 36 + Math.sin(frame * .08) * 7 - world.pixel.y) * .06;

    p.vy = Math.min(12, p.vy + .48);
    const oldY = p.y;
    p.x += p.vx;
    p.x = Math.max(0, Math.min(world.width - p.w, p.x));
    if (world.secretRoom && world.secretRoom.inside) {
      p.x = Math.max(world.secretRoom.x + 12, Math.min(world.secretRoom.x + world.secretRoom.width - p.w - 12, p.x));
    }
    p.y += p.vy;
    p.grounded = false;
    if (world.secretRoom && world.secretRoom.inside) {
      const room = world.secretRoom;
      if (p.y < room.y + 12) {
        p.y = room.y + 12;
        p.vy = Math.max(0, p.vy);
      }
      if (p.vy >= 0 && oldY + p.h <= room.floorY + 3 && p.y + p.h >= room.floorY) {
        p.y = room.floorY - p.h;
        p.vy = 0;
        p.grounded = true;
        p.jumps = 0;
      }
    } else {
      for (const platform of world.platforms) {
        if (platform.realm !== 0 && platform.realm !== currentReality()) continue;
        if (p.vy >= 0 && oldY + p.h <= platform.y + 3 && p.y + p.h >= platform.y && p.x + p.w > platform.x && p.x < platform.x + platform.w) {
          p.y = platform.y - p.h;
          p.vy = 0;
          p.grounded = true;
          p.jumps = 0;
        }
      }
    }
    if (p.grounded && Math.abs(p.x - p.safeX) > 90) p.safeX = p.x;
    if (p.y > H + 50) {
      if (world.secretRoom && world.secretRoom.inside) {
        p.y = world.secretRoom.floorY - p.h;
        p.vy = 0;
      } else {
        p.x = Math.max(0, p.safeX - 90);
        p.safeX = p.x;
        p.y = 400;
        p.vy = 0;
        damagePlayer();
      }
    }
    camera += ((Math.max(0, Math.min(world.width - W, p.x - W * .38))) - camera) * .08;

    for (const item of world.pickups) {
      if (item.collected) continue;
      if (item.type === "secret" && !(world.secretRoom && world.secretRoom.inside)) continue;
      if (Math.abs(p.x + p.w / 2 - item.x) < 27 && Math.abs(p.y + p.h / 2 - item.y) < 32) collect(item);
    }
    if (!p.frozen && !(world.secretRoom && world.secretRoom.inside)) {
      for (const enemy of world.enemies) {
        if (!enemy.alive) continue;
        enemy.phase += dt;
        if (enemy.type === "GLITCH" && Math.floor(enemy.phase) % 4 === 0) enemy.hidden = true;
        else enemy.hidden = false;
        if (enemy.hidden) continue;
        const chase = Math.abs(p.x - enemy.x) < 230;
        if (chase) enemy.vx = Math.sign(p.x - enemy.x) * (enemy.type === "SENTINEL" ? .85 : 1.25);
        enemy.x += enemy.vx;
        if (enemy.x < 400 || enemy.x > world.width - 180) enemy.vx *= -1;
        if (p.dash > 0 && Math.abs(p.x - enemy.x) < 36 && Math.abs(p.y - enemy.y) < 45) {
          enemy.alive = false; burst(enemy.x, enemy.y, colors.pink, 12); save.score += 15; persist();
        } else if (Math.abs(p.x - enemy.x) < 27 && Math.abs(p.y - enemy.y) < 34) damagePlayer();
      }
    }
    if (world.boss && !world.boss.defeated && !(world.secretRoom && world.secretRoom.inside)) {
      const boss = world.boss;
      boss.y = 344 + Math.sin(frame * .035) * 26;
      boss.attack += dt;
      if (boss.flashed > 0) boss.flashed--;
      if (boss.attack > 4 && Math.abs(p.x - boss.x) < 300) {
        boss.attack = 0;
        if (Math.abs(p.x - boss.x) < 175 && Math.random() > .35) damagePlayer();
      }
      if (p.dash > 0 && boss.phase === 1 && Math.abs(p.x - boss.x) < 68) {
        boss.hp--;
        boss.flashed = 20;
        boss.phase = boss.hp <= 1 ? 2 : 1;
        p.dash = 0;
        toast("¡CORRUPT GOLPEADO! Pulsa E junto a él para continuar.");
      }
    }
    for (const particle of world.particles) {
      particle.x += particle.vx; particle.y += particle.vy; particle.life--;
    }
    world.particles = world.particles.filter((particle) => particle.life > 0);
  }
  function collect(item) {
    item.collected = true;
    if (!save.collected.includes(item.id)) save.collected.push(item.id);
    burst(item.x, item.y, item.type === "secret" ? colors.pink : colors.cyan, 10);
    if (item.type === "coin") { save.coins++; save.score += 10; toast("+1 CRÉDITO"); }
    if (item.type === "memory") { save.memories++; save.score += 25; toast("FRAGMENTO DE MEMORIA RECUPERADO"); }
    if (item.type === "secret") {
      if (!save.secrets.includes(item.id)) save.secrets.push(item.id);
      if (world.secretRoom) world.secretRoom.collected = true;
      save.score += 50;
      toast(`ARCHIVO SECRETO · ${levels[currentLevel].secretMemory}`);
    }
    persist();
    playTone(item.type === "secret" ? 820 : 620, .12);
  }
  function activateDataBridge() {
    if (world.switches) return;
    world.switches = 1;
    world.platforms.push({ x: 800, y: 470, w: 70, h: 70, realm: 1 });
  }
  function burst(x, y, color, count) {
    if (!world) return;
    for (let i = 0; i < count; i++) world.particles.push({ x, y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 15 + Math.random() * 20, color });
  }

  function roundedRect(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  }
  function drawBackground() {
    const theme = colors.themes[currentLevel] || colors.themes[0];
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, theme.sky); gradient.addColorStop(1, "#080a17");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * .68, 160, 10, W * .68, 160, 400);
    glow.addColorStop(0, `${theme.glow}80`); glow.addColorStop(1, `${theme.glow}00`);
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.save();
    for (let i = 0; i < 38; i++) {
      const x = ((i * 197 - camera * .24) % (W + 80) + W + 80) % (W + 80);
      const y = (i * 83) % 355;
      ctx.globalAlpha = .23 + (i % 4) * .1;
      ctx.fillStyle = i % 5 === 0 ? theme.accent : "#c2c8ff";
      ctx.fillRect(x, y, i % 3 === 0 ? 3 : 2, i % 3 === 0 ? 3 : 2);
    }
    ctx.globalAlpha = .12;
    for (let i = 0; i < 8; i++) {
      const x = i * 170 - (camera * .15 % 170);
      ctx.fillStyle = "#18213e";
      ctx.fillRect(x, 185 + (i % 3) * 26, 76, 240);
      ctx.fillStyle = theme.accent;
      for (let j = 0; j < 5; j++) ctx.fillRect(x + 12, 208 + (i % 3) * 26 + j * 32, 52, 2);
    }
    ctx.restore();
  }
  function drawPlatform(platform) {
    const x = platform.x - camera;
    if (x + platform.w < -10 || x > W + 10) return;
    const theme = colors.themes[currentLevel];
    ctx.fillStyle = platform.realm === 1 ? "#4b2d62" : theme.ground;
    ctx.fillRect(x, platform.y, platform.w, platform.h);
    ctx.fillStyle = platform.realm === 1 ? colors.pink : theme.accent;
    ctx.fillRect(x, platform.y, platform.w, 3);
    ctx.globalAlpha = .25;
    ctx.fillStyle = "#c8d6ff";
    for (let i = 10; i < platform.w; i += 28) ctx.fillRect(x + i, platform.y + 13, 12, 2);
    ctx.globalAlpha = 1;
  }
  function drawByte() {
    const p = world.player;
    const x = p.x - camera;
    if (p.invuln > 0 && frame % 8 < 4) return;
    const skin = [colors.cyan, colors.purple, colors.pink][save.skin] || colors.cyan;
    ctx.save();
    if (p.dash > 0) { ctx.globalAlpha = .72; ctx.fillStyle = skin; ctx.fillRect(x - p.facing * 20, p.y + 8, p.w, p.h - 8); ctx.globalAlpha = 1; }
    ctx.shadowColor = skin; ctx.shadowBlur = 14;
    roundedRect(x + 2, p.y + 9, 24, 25, 5, "#273551");
    ctx.fillStyle = skin; ctx.fillRect(x + 5, p.y + 5, 18, 19);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#07111d";
    ctx.fillRect(x + (p.facing > 0 ? 10 : 6), p.y + 11, 4, 5);
    ctx.fillRect(x + (p.facing > 0 ? 19 : 15), p.y + 11, 4, 5);
    ctx.fillStyle = "#f3fbff"; ctx.fillRect(x + 8, p.y + 28, 5, 9); ctx.fillRect(x + 18, p.y + 28, 5, 9);
    if (p.shield > 0) { ctx.strokeStyle = `${colors.cyan}aa`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x + 14, p.y + 20, 25, 31, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  function drawPixel() {
    const p = world.pixel;
    const x = p.x - camera;
    ctx.save();
    ctx.shadowColor = colors.cyan; ctx.shadowBlur = 16;
    ctx.fillStyle = "#d2fff9";
    ctx.beginPath(); ctx.arc(x, p.y + Math.sin(frame * .08) * 4, 10 + p.pulse * .05, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#163b4b"; ctx.fillRect(x - 4, p.y - 2, 2, 3); ctx.fillRect(x + 2, p.y - 2, 2, 3);
    ctx.restore();
  }
  function drawItems() {
    for (const item of world.pickups) {
      if (item.collected) continue;
      if (item.type === "secret" && !(world.secretRoom && world.secretRoom.inside)) continue;
      const x = item.x - camera;
      if (x < -40 || x > W + 40) continue;
      const color = item.type === "secret" ? colors.pink : item.type === "memory" ? colors.purple : colors.cyan;
      ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 16;
      ctx.fillStyle = color;
      if (item.type === "secret") {
        ctx.translate(x, item.y + Math.sin(frame * .06) * 4); ctx.rotate(Math.PI / 4); ctx.fillRect(-8, -8, 16, 16);
      } else {
        ctx.beginPath(); ctx.arc(x, item.y + Math.sin(frame * .07) * 4, item.type === "memory" ? 9 : 7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }
  function drawSecretRoom() {
    const room = world.secretRoom;
    if (!room) return;
    const x = room.x - camera;
    if (!room.inside) {
      if (!room.revealed || room.collected) return;
      ctx.save();
      ctx.globalAlpha = .8 + Math.sin(frame * .12) * .15;
      ctx.strokeStyle = colors.pink;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 9, 430, 42, 38);
      ctx.fillStyle = colors.pink;
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("E · CÁMARA", x + 12, 420);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.fillStyle = "#090b1df2";
    ctx.fillRect(x, room.y, room.width, room.height);
    ctx.strokeStyle = colors.pink;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, room.y, room.width, room.height);
    ctx.fillStyle = "#21152d";
    ctx.fillRect(x + 2, room.floorY, room.width - 4, H - room.floorY);
    ctx.fillStyle = colors.pink;
    ctx.fillRect(x + 2, room.floorY, room.width - 4, 3);
    ctx.textAlign = "center";
    ctx.font = "bold 12px monospace";
    ctx.fillText("CÁMARA DE MEMORIA", x + room.width / 2, room.y + 24);
    ctx.font = "10px monospace";
    ctx.fillStyle = "#c8bddc";
    ctx.fillText("E · SALIR", x + 24, room.floorY - 13);
    ctx.restore();
  }
  function drawEnemies() {
    for (const enemy of world.enemies) {
      if (!enemy.alive || enemy.hidden) continue;
      const x = enemy.x - camera;
      if (x < -40 || x > W + 40) continue;
      const color = enemy.type === "BUG" ? colors.pink : enemy.type === "GLITCH" ? colors.purple : "#ff9d59";
      ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillStyle = color;
      if (enemy.type === "SENTINEL") { ctx.beginPath(); ctx.moveTo(x, 411); ctx.lineTo(x + 21, 432); ctx.lineTo(x, 451); ctx.lineTo(x - 21, 432); ctx.fill(); }
      else { roundedRect(x - 14, 412, 28, 28, 5, color); ctx.fillStyle = "#161329"; ctx.fillRect(x - 7, 420, 4, 5); ctx.fillRect(x + 4, 420, 4, 5); }
      ctx.restore();
    }
  }
  function drawBoss() {
    const boss = world.boss;
    if (!boss || boss.defeated) return;
    const x = boss.x - camera;
    ctx.save();
    ctx.shadowColor = boss.flashed ? "#fff" : colors.pink; ctx.shadowBlur = 24;
    ctx.fillStyle = boss.flashed ? "#fff" : "#7e285d";
    ctx.beginPath(); ctx.moveTo(x, boss.y - 54); ctx.lineTo(x + 42, boss.y - 25); ctx.lineTo(x + 35, boss.y + 38); ctx.lineTo(x, boss.y + 55); ctx.lineTo(x - 35, boss.y + 38); ctx.lineTo(x - 42, boss.y - 25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = colors.pink; ctx.fillRect(x - 19, boss.y - 12, 12, 8); ctx.fillRect(x + 7, boss.y - 12, 12, 8);
    ctx.restore();
    ctx.fillStyle = "#29182d"; ctx.fillRect(x - 55, boss.y - 75, 110, 8);
    ctx.fillStyle = colors.pink; ctx.fillRect(x - 55, boss.y - 75, 110 * Math.max(0, boss.hp) / 3, 8);
    ctx.fillStyle = "#ffe4fa"; ctx.font = "10px monospace"; ctx.textAlign = "center"; ctx.fillText(`CORRUPT · FASE ${boss.phase}`, x, boss.y - 85);
  }
  function drawHUD() {
    const p = world.player;
    ctx.fillStyle = "#0a0d1de8"; ctx.fillRect(14, 13, 300, 75);
    ctx.strokeStyle = "#546082"; ctx.strokeRect(14, 13, 300, 75);
    ctx.fillStyle = "#fff"; ctx.font = "bold 12px monospace"; ctx.textAlign = "left";
    ctx.fillText(`BYTE  //  ${levels[currentLevel].name.toUpperCase()}`, 25, 31);
    ctx.fillStyle = "#261d35"; ctx.fillRect(25, 41, 106, 9);
    ctx.fillStyle = colors.pink; ctx.fillRect(25, 41, 106 * p.health / p.maxHealth, 9);
    ctx.fillStyle = "#e7eafa"; ctx.font = "9px monospace"; ctx.fillText("VIDA", 137, 49);
    ctx.fillStyle = "#1c2440"; ctx.fillRect(25, 59, 106, 8);
    ctx.fillStyle = colors.cyan; ctx.fillRect(25, 59, 106 * p.energy / p.maxEnergy, 8);
    ctx.fillStyle = "#b8c0da"; ctx.fillText("ENERGÍA", 137, 66);
    const reality = currentReality() ? "CORRUPTA" : "NORMAL";
    ctx.fillStyle = currentReality() ? colors.pink : colors.cyan;
    ctx.fillText(`REALIDAD ${reality}`, 199, 49);
    ctx.fillStyle = "#c6cce2"; ctx.fillText(`PIXEL ●   ${save.coins} CR`, 199, 66);
    ctx.fillStyle = "#090c1be8"; ctx.fillRect(W - 198, 13, 184, 52);
    ctx.strokeStyle = "#454a6d"; ctx.strokeRect(W - 198, 13, 184, 52);
    ctx.fillStyle = "#e9edff"; ctx.font = "10px monospace"; ctx.textAlign = "right";
    ctx.fillText(`MEM ${save.memories}   SECRETOS ${save.secrets.length}/5`, W - 25, 32);
    ctx.fillStyle = "#9ca6c8"; ctx.fillText(`EXP ${exploration()}%   ${formatTime(world.elapsed)}`, W - 25, 50);
    ctx.textAlign = "center"; ctx.fillStyle = "#dce6f9"; ctx.font = "10px monospace";
    const actions = ["SHIFT DASH", world.secretRoom && world.secretRoom.inside ? "E SALIR" : "E INTERACTUAR", ...(save.unlocked >= 2 ? ["R REALIDAD", "Q FREEZE"] : []), "F PIXEL", ...(save.unlocked >= 4 ? ["X SHIELD"] : [])].join("   ·   ");
    ctx.fillText(actions, W / 2, H - 14);
    if (!world.puzzleSolved && currentLevel < 5) {
      const markerX = 1040 - camera;
      if (markerX > 25 && markerX < W - 25) {
        ctx.fillStyle = colors.purple; ctx.fillText("E · TERMINAL", markerX, 420);
        ctx.fillRect(markerX - 2, 428, 4, 20);
      }
    }
    const exitX = world.exitX - camera;
    if (exitX > 10 && exitX < W - 10) {
      ctx.fillStyle = colors.cyan; ctx.fillText(currentLevel === 4 ? "CORRUPT" : "SALIDA →", exitX, 410);
      ctx.strokeStyle = colors.cyan; ctx.strokeRect(exitX - 24, 420, 48, 50);
    }
  }
  function render() {
    if (!world) {
      ctx.fillStyle = "#0b0d1d"; ctx.fillRect(0, 0, W, H);
      drawMenuBackdrop();
      return;
    }
    drawBackground();
    if (world.secretRoom && world.secretRoom.inside) {
      drawSecretRoom();
      drawItems();
      drawPixel();
      drawByte();
      for (const particle of world.particles) {
        ctx.globalAlpha = Math.min(1, particle.life / 15); ctx.fillStyle = particle.color; ctx.fillRect(particle.x - camera, particle.y, 3, 3);
      }
      ctx.globalAlpha = 1;
      drawHUD();
      if (mode === "paused") { ctx.fillStyle = "#080a1666"; ctx.fillRect(0, 0, W, H); }
      return;
    }
    if (currentReality()) {
      ctx.fillStyle = "#bb4eaa12"; ctx.fillRect(0, 0, W, H);
      if (frame % 9 === 0) { ctx.fillStyle = "#ff58c40d"; ctx.fillRect(Math.random() * W, Math.random() * H, 70, 2); }
    }
    for (const platform of world.platforms) if (platform.realm === 0 || platform.realm === currentReality()) drawPlatform(platform);
    drawSecretRoom();
    drawItems();
    drawEnemies();
    drawBoss();
    drawPixel();
    drawByte();
    for (const particle of world.particles) {
      ctx.globalAlpha = Math.min(1, particle.life / 15); ctx.fillStyle = particle.color; ctx.fillRect(particle.x - camera, particle.y, 3, 3);
    }
    ctx.globalAlpha = 1;
    drawHUD();
    if (mode === "paused") { ctx.fillStyle = "#080a1666"; ctx.fillRect(0, 0, W, H); }
  }
  function drawMenuBackdrop() {
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,"#11122a"); g.addColorStop(1,"#080a16");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    for (let i = 0; i < 28; i++) {
      const x = (i * 173 + frame * (i % 2 ? .18 : -.12) + W * 5) % W;
      const y = (i * 97) % H;
      ctx.globalAlpha = .3 + Math.sin(frame * .02 + i) * .2;
      ctx.fillStyle = i % 3 ? colors.cyan : colors.pink; ctx.fillRect(x,y,3,3);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#62f4e322";
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * 145, H); ctx.lineTo(W / 2 + i * 35 - 140, 180); ctx.stroke(); }
    ctx.font = "bold 48px monospace"; ctx.textAlign = "center"; ctx.fillStyle = "#62f4e31a"; ctx.fillText("BYTE_07", W / 2, 240);
  }
  function playTone(freq, duration) {
    if (!save.settings.effectsEnabled || save.settings.volume <= 0) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      resumeAudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = freq;
      gain.gain.setValueAtTime(save.settings.volume * .07, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch (error) { console.error("No se pudo iniciar el audio:", error); }
  }
  function createMusicBuffer() {
    if (musicBuffer) return musicBuffer;
    const sampleRate = audioContext.sampleRate;
    const duration = 8;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const samples = buffer.getChannelData(0);
    const roots = [55, 49, 41.2, 49];
    const melody = [220, 261.63, 329.63, 293.66, 196, 246.94, 293.66, 261.63, 164.81, 196, 246.94, 220, 196, 246.94, 293.66, 261.63];
    for (let i = 0; i < samples.length; i++) {
      const time = i / sampleRate;
      const chord = Math.floor(time / 2) % roots.length;
      const root = roots[chord];
      const noteIndex = Math.floor(time / .5) % melody.length;
      const noteTime = time % .5;
      const noteEnvelope = Math.sin(Math.PI * Math.min(1, noteTime / .5)) * Math.exp(-noteTime * 2.8);
      const pad = Math.sin(2 * Math.PI * root * time) * .27
        + Math.sin(2 * Math.PI * root * 1.5 * time) * .13
        + Math.sin(2 * Math.PI * root * 2 * time) * .08;
      const lead = Math.sin(2 * Math.PI * melody[noteIndex] * time) * noteEnvelope * .11;
      const edgeFade = Math.min(1, time / .12, (duration - time) / .12);
      samples[i] = (pad + lead) * Math.max(0, edgeFade);
    }
    musicBuffer = buffer;
    return musicBuffer;
  }
  function syncMusic() {
    const shouldPlay = mode === "playing" && save.settings.musicEnabled && save.settings.volume > 0;
    if (!shouldPlay) {
      if (musicSource) {
        try {
          musicGain.gain.setTargetAtTime(0, audioContext.currentTime, .08);
          musicSource.stop(audioContext.currentTime + .3);
        } catch (error) { console.error("No se pudo detener la música:", error); }
        musicSource = null;
        musicGain = null;
        musicVolume = null;
      }
      return;
    }
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      resumeAudioContext();
      if (musicSource) {
        const volume = save.settings.volume * .22;
        if (volume !== musicVolume) {
          musicGain.gain.setTargetAtTime(volume, audioContext.currentTime, .08);
          musicVolume = volume;
        }
        return;
      }
      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      source.buffer = createMusicBuffer();
      source.loop = true;
      gain.gain.value = save.settings.volume * .22;
      source.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
      musicSource = source;
      musicGain = gain;
      musicVolume = save.settings.volume * .22;
    } catch (error) { console.error("No se pudo iniciar la música:", error); }
  }
  function resumeAudioContext() {
    if (!audioContext || audioContext.state !== "suspended" || audioResumeRequest) return;
    audioResumeRequest = audioContext.resume()
      .catch((error) => console.error("No se pudo reanudar el audio:", error))
      .finally(() => { audioResumeRequest = null; });
  }
  function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    const transition = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    transition.catch((error) => {
      console.error("No se pudo cambiar a pantalla completa:", error);
      if (mode === "title") openTitleOptions();
      else openSettings();
      toast("El navegador no permitió cambiar la pantalla.");
    });
  }
  function loop(now) {
    const dt = Math.min(.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    syncMusic();
    update(dt);
    if (mode !== "title") {
      frame++;
      render();
    }
    requestAnimationFrame(loop);
  }

  titleScreen.addEventListener("click", (event) => {
    const target = event.target.closest("[data-title-action]");
    if (!target || target.disabled) return;
    const action = target.dataset.titleAction;
    if (action === "play") {
      if (save.lastLevel !== null) startLevel(Math.min(save.lastLevel, 4));
      else beginNewGame();
    } else if (action === "options") openTitleOptions();
    else if (action === "credits") openTitleCredits();
    else if (action === "exit") openExitConfirmation();
    else if (action === "archive") mainMenu();
    else if (action === "back") {
      titlePanel.hidden = true;
      titlePanel.innerHTML = "";
      const optionsButton = titleScreen.querySelector('[data-title-action="options"]');
      if (optionsButton) optionsButton.focus();
    } else if (action === "controls") openTitleControls();
    else if (action === "music") {
      save.settings.musicEnabled = !save.settings.musicEnabled;
      persist();
      openTitleOptions();
    } else if (action === "effects") {
      save.settings.effectsEnabled = !save.settings.effectsEnabled;
      save.settings.mute = !save.settings.effectsEnabled;
      persist();
      openTitleOptions();
    } else if (action === "fullscreen") toggleFullscreen();
    else if (action === "close-window") {
      window.close();
      if (!window.closed) openExitConfirmation();
    }
  });
  titleScreen.addEventListener("input", (event) => {
    if (event.target.id === "title-volume") {
      save.settings.volume = Number(event.target.value);
      persist();
      syncMusic();
    }
  });
  titleScreen.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !titlePanel.hidden) {
      titlePanel.hidden = true;
      titlePanel.innerHTML = "";
      const optionsButton = titleScreen.querySelector('[data-title-action="options"]');
      if (optionsButton) optionsButton.focus();
    } else if (titlePanel.hidden && ["ArrowUp", "ArrowDown"].includes(event.key)) {
      const buttons = Array.from(titleScreen.querySelectorAll(".title-menu .title-button"));
      if (!buttons.length) return;
      event.preventDefault();
      const current = buttons.indexOf(document.activeElement);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = current < 0
        ? (direction > 0 ? 0 : buttons.length - 1)
        : (current + direction + buttons.length) % buttons.length;
      buttons[next].focus();
    }
  });
  document.addEventListener("fullscreenchange", () => {
    if (!titlePanel.hidden && mode === "title") openTitleOptions();
  });

  screen.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || target.disabled) return;
    const action = target.dataset.action;
    if (action === "menu") mainMenu();
    else if (action === "title") showTitleScreen();
    else if (action === "new") beginNewGame();
    else if (action === "continue") startLevel(Math.min(save.lastLevel ?? save.unlocked, 4));
    else if (action === "levels") openLevelSelect();
    else if (action === "upgrades") openUpgrades();
    else if (action === "memories") openMemories();
    else if (action === "skins") openSkins();
    else if (action === "controls") openControls();
    else if (action === "controls-game") {
      showScreen(`<div class="eyebrow">CONTROLES DEL SECTOR</div><h2>CONTROLES</h2>
        <div class="controls-grid">
          <div><span>Moverse</span><span class="key">A/D · ←/→</span></div><div><span>Saltar</span><span class="key">ESPACIO / ↑</span></div>
          <div><span>Dash</span><span class="key">SHIFT</span></div><div><span>Interactuar / hack</span><span class="key">E</span></div>
          <div><span>Congelar</span><span class="key">Q</span></div><div><span>Cambiar realidad</span><span class="key">R</span></div>
          <div><span>Habilidad de PIXEL</span><span class="key">F</span></div><div><span>Escudo</span><span class="key">X</span></div>
        </div><button class="back-button" data-action="resume">← VOLVER AL SECTOR</button>`);
    }
    else if (action === "settings") openSettings();
    else if (action === "credits") openCredits();
    else if (action === "resume" || action === "close-tutorial") { mode = "playing"; hideScreen(); syncMusic(); }
    else if (action === "mute") { save.settings.effectsEnabled = !save.settings.effectsEnabled; save.settings.mute = !save.settings.effectsEnabled; persist(); openSettings(); }
    else if (action === "music") { save.settings.musicEnabled = !save.settings.musicEnabled; persist(); syncMusic(); openSettings(); }
    else if (action === "fullscreen") toggleFullscreen();
    else if (action === "reset") { save = defaultSave(); persist(); mainMenu(); toast("Progreso reiniciado."); }
    else if (action.startsWith("level:")) {
      const index = Number(action.split(":")[1]);
      if (index <= save.unlocked || index === currentLevel) startLevel(index);
    } else if (action.startsWith("upgrade:")) buyUpgrade(action.split(":")[1]);
    else if (action.startsWith("skin:")) unlockSkin(Number(action.split(":")[1]));
    else if (action.startsWith("answer:")) answerPuzzle(Number(action.split(":")[1]));
    else if (action === "hint") { lastPuzzleFeedback = levels[currentLevel].hint; showPuzzle(currentLevel === 4 && world.boss && world.boss.phase === 3); }
    else if (action === "puzzle-close") { mode = "playing"; hideScreen(); }
    else if (action.startsWith("ending:")) finishEnding(action.split(":")[1]);
  });
  screen.addEventListener("input", (event) => {
    if (event.target.id === "volume") {
      save.settings.volume = Number(event.target.value);
      persist();
      syncMusic();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft","ArrowRight","ArrowUp"," ","Shift"].includes(event.key)) event.preventDefault();
    if (event.key === "Escape") { if (mode !== "title") pauseGame(); return; }
    if (mode === "title") return;
    if (mode === "puzzle" && ["1","2","3"].includes(event.key)) { answerPuzzle(Number(event.key) - 1); return; }
    keys.add(event.key);
    if (event.repeat) return;
    if (event.key === "Shift") useAbility("Shift");
    else if (["e","E","q","Q","r","R","f","F","x","X"].includes(event.key)) useAbility(event.key);
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key));
  window.addEventListener("blur", () => keys.clear());
  document.querySelectorAll(".touch-controls button").forEach((buttonNode) => {
    const key = buttonNode.dataset.key;
    if (key) {
      buttonNode.addEventListener("pointerdown", (event) => { event.preventDefault(); keys.add(key); });
      for (const type of ["pointerup","pointercancel","pointerleave"]) buttonNode.addEventListener(type, () => keys.delete(key));
    }
    if (buttonNode.dataset.action === "jump") {
      buttonNode.addEventListener("pointerdown", (event) => { event.preventDefault(); keys.add(" "); });
      for (const type of ["pointerup","pointercancel","pointerleave"]) buttonNode.addEventListener(type, () => keys.delete(" "));
    }
    if (buttonNode.dataset.action === "interact") buttonNode.addEventListener("pointerdown", (event) => { event.preventDefault(); interact(); });
    const touchAbilities = { dash: "Shift", reality: "r", pixel: "f", freeze: "q", shield: "x" };
    if (touchAbilities[buttonNode.dataset.action]) {
      buttonNode.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        useAbility(touchAbilities[buttonNode.dataset.action]);
      });
    }
  });

  showTitleScreen();
  requestAnimationFrame(loop);
})();
