/* =====================================================================
   Le Grand Quiz du CE2 — logique du jeu
   ---------------------------------------------------------------------
   Une seule page pour deux écrans :
     - sans rien dans l'adresse      → ÉCRAN TÉLÉ (il garde les scores)
     - avec « ?maitre=... »          → TÉLÉCOMMANDE DU MAÎTRE (téléphone)
   La télé et le téléphone se parlent directement grâce à PeerJS.
   Les questions sont dans le fichier questions.js.
   ===================================================================== */
"use strict";

/* ---------- Matières : icône et couleur ---------- */
const MATIERES = {
  "Français":     { icone: "📖", couleur: "#9b4fd1", texte: "#fff" },
  "Maths":        { icone: "🔢", couleur: "#ff8c1a", texte: "#fff" },
  "Histoire-Géo": { icone: "🌍", couleur: "#1fa855", texte: "#fff" },
  "Sciences":     { icone: "🔬", couleur: "#00a0a6", texte: "#fff" },
  "Anglais":      { icone: "🗣️", couleur: "#e8408f", texte: "#fff" },
  "Art":          { icone: "🎨", couleur: "#ffc21a", texte: "#4a3200" },
};

const CLE_ETAT = "quizce2-etat";          // la partie en cours (sur la télé)
const CLE_DEJA = "quizce2-deja-posees";   // questions déjà posées (sur la télé)
const CLE_ID   = "quizce2-id-tele";       // identifiant de connexion de la télé
const EQUIPES = ["rouge", "bleu"];
const NOMS_DEFAUT = { rouge: "Équipe Rouge", bleu: "Équipe Bleue" };

/* ---------- Petits outils ---------- */
const $ = (s) => document.querySelector(s);
function esc(t) {
  return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function lire(cle, defaut) {
  try { const v = localStorage.getItem(cle); return v === null ? defaut : JSON.parse(v); } catch (e) { return defaut; }
}
function ecrire(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* stockage indisponible */ }
}
function autre(equipe) { return equipe === "rouge" ? "bleu" : "rouge"; }
function melanger(t) {
  const a = t.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/* « Équipe Rouge » → « L'Équipe Rouge » ; « Les Lions » reste « Les Lions » */
function avecArticle(nom) { return /^[ée]quipe\s/i.test(nom) ? "L'" + nom : nom; }
function etoiles(p) { return "⭐".repeat(p); }
function pluriel(n, mot) { return n + " " + mot + (Math.abs(n) > 1 ? "s" : ""); }
function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("visible");
  clearTimeout(toast.minuteur);
  toast.minuteur = setTimeout(() => t.classList.remove("visible"), 2600);
}
function nouvelId() { return "quizce2-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

/* Garder l'écran allumé (quand le navigateur le permet) */
let verrouEcran = null;
async function garderEcranAllume() {
  try {
    if ("wakeLock" in navigator && document.visibilityState === "visible" && !verrouEcran) {
      verrouEcran = await navigator.wakeLock.request("screen");
      verrouEcran.addEventListener("release", () => { verrouEcran = null; });
    }
  } catch (e) { /* pas grave */ }
}

/* =====================================================================
   QUESTIONS ET TIRAGE AU HASARD
   ===================================================================== */
function listeBrute() { return (typeof QUESTIONS !== "undefined" && Array.isArray(QUESTIONS)) ? QUESTIONS : []; }

function toutesLesQuestions() {
  const vues = new Set();
  const ok = [];
  listeBrute().forEach((q) => {
    if (!q || !MATIERES[q.matiere] || ![1, 2, 3].includes(q.points)) return;
    if (typeof q.question !== "string" || !q.question.trim()) return;
    if (q.reponse === undefined || q.reponse === null || !String(q.reponse).trim()) return;
    const texte = q.question.trim();
    if (vues.has(texte)) return; // doublon
    vues.add(texte);
    ok.push({ matiere: q.matiere, points: q.points, question: texte, reponse: String(q.reponse).trim() });
  });
  return ok;
}

function statistiques() {
  const toutes = toutesLesQuestions();
  const deja = new Set(lire(CLE_DEJA, []));
  return {
    total: toutes.length,
    neuves: toutes.filter((q) => !deja.has(q.question)).length,
    ignorees: listeBrute().length - toutes.length,
  };
}

function marquerPosee(q) {
  if (!q) return;
  const deja = lire(CLE_DEJA, []);
  if (!deja.includes(q.question)) { deja.push(q.question); ecrire(CLE_DEJA, deja); }
}

/* Choisit n questions en équilibrant les matières et les valeurs (1, 2, 3 points) */
function choisirEquilibre(pool, n) {
  const reste = melanger(pool);
  const choix = [];
  const parMatiere = {}, parPoints = {};
  while (choix.length < n && reste.length) {
    let meilleur = 0, meilleurScore = Infinity;
    reste.forEach((q, i) => {
      const s = (parMatiere[q.matiere] || 0) * 6 + (parPoints[q.points] || 0) * 3 + Math.random() * 2;
      if (s < meilleurScore) { meilleurScore = s; meilleur = i; }
    });
    const q = reste.splice(meilleur, 1)[0];
    choix.push(q);
    parMatiere[q.matiere] = (parMatiere[q.matiere] || 0) + 1;
    parPoints[q.points] = (parPoints[q.points] || 0) + 1;
  }
  return choix;
}

/* Mélange l'ordre en évitant deux fois de suite la même matière */
function ordonner(liste) {
  const reste = melanger(liste), res = [];
  while (reste.length) {
    const prec = res[res.length - 1];
    let i = reste.findIndex((q) => !prec || q.matiere !== prec.matiere);
    if (i < 0) i = 0;
    res.push(reste.splice(i, 1)[0]);
  }
  return res;
}

/* Tire n questions : d'abord celles jamais posées ; quand il n'y en a plus,
   on recommence un nouveau tour avec toutes les questions. */
function tirer(n, exclus) {
  const ex = new Set(exclus || []);
  const toutes = toutesLesQuestions().filter((q) => !ex.has(q.question));
  n = Math.min(n, toutes.length);
  const deja = new Set(lire(CLE_DEJA, []));
  const neuves = toutes.filter((q) => !deja.has(q.question));
  let choix = choisirEquilibre(neuves, Math.min(n, neuves.length));
  if (choix.length < n) {
    ecrire(CLE_DEJA, []); // toutes ont servi : on remet le compteur à zéro
    const pris = new Set(choix.map((q) => q.question));
    choix = choix.concat(choisirEquilibre(toutes.filter((q) => !pris.has(q.question)), n - choix.length));
  }
  return ordonner(choix);
}

/* =====================================================================
   ÉTAT DE LA PARTIE (gardé par la télé)
   ===================================================================== */
function etatInitial() {
  return {
    phase: "accueil",             // "accueil" | "question" | "fin"
    equipes: {
      rouge: { nom: NOMS_DEFAUT.rouge, score: 0 },
      bleu:  { nom: NOMS_DEFAUT.bleu,  score: 0 },
    },
    nbQuestions: 20,
    tirage: [],                   // les questions de la partie
    index: 0,                     // numéro de la question en cours (à partir de 0)
    bonus: null,                  // question bonus en cours (en cas d'égalité)
    bonusDeja: [],
    parole: null,                 // "rouge" | "bleu" | null
    rates: [],                    // équipes qui se sont trompées sur cette question
    resultat: null,               // "rouge" | "bleu" | "personne" | null
    montrerReponse: false,
  };
}
function questionCourante(e) { return e.bonus || e.tirage[e.index] || null; }
function remettreQuestion(e) { e.parole = null; e.rates = []; e.resultat = null; e.montrerReponse = false; }
function egalite(e) { return e.equipes.rouge.score === e.equipes.bleu.score; }
function gagnant(e) {
  if (egalite(e)) return null;
  return e.equipes.rouge.score > e.equipes.bleu.score ? "rouge" : "bleu";
}
function derniereQuestion(e) { return !!e.bonus || e.index + 1 >= e.tirage.length; }

/* =====================================================================
   SONS (fabriqués par le navigateur, pas de fichier à télécharger)
   ===================================================================== */
let ctxAudio = null;
function audio() {
  if (!ctxAudio) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctxAudio = new C();
  }
  return ctxAudio;
}
function note(freq, debut, duree, options) {
  const a = audio(); if (!a) return;
  const o = Object.assign({ type: "sine", volume: 0.25, glisse: null }, options);
  const t = a.currentTime + debut;
  const osc = a.createOscillator(), g = a.createGain();
  osc.type = o.type;
  osc.frequency.setValueAtTime(freq, t);
  if (o.glisse) osc.frequency.exponentialRampToValueAtTime(o.glisse, t + duree);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.volume, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + duree + 0.05);
}
function ding(debut) {
  // Sonnette de comptoir : plusieurs « harmoniques » de cloche
  const base = 1480;
  [[1, 0.32, 1.8], [2.32, 0.14, 1.1], [4.25, 0.08, 0.6], [6.63, 0.04, 0.35]]
    .forEach(([r, v, d]) => note(base * r, debut, d, { volume: v }));
}
const SONS = {
  sonnette() { ding(0); ding(0.22); },
  bonne()    { [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.11, 0.35, { type: "triangle", volume: 0.3 })); },
  mauvaise() { note(330, 0, 0.35, { type: "sawtooth", volume: 0.12, glisse: 220 }); note(220, 0.35, 0.6, { type: "sawtooth", volume: 0.12, glisse: 140 }); },
  debut()    { [392, 523, 659, 784].forEach((f, i) => note(f, i * 0.09, 0.25, { type: "square", volume: 0.07 })); },
  question() { note(880, 0, 0.18, { type: "triangle", volume: 0.2 }); note(1175, 0.12, 0.3, { type: "triangle", volume: 0.2 }); },
  victoire() {
    [[523, 0, .18], [523, .2, .18], [523, .4, .18], [698, .6, .9], [880, 1.0, .3], [1047, 1.3, 1.2]]
      .forEach(([f, d, l]) => { note(f, d, l, { type: "square", volume: 0.08 }); note(f / 2, d, l, { type: "triangle", volume: 0.2 }); });
  },
  egalite()  { [659, 523, 659, 523].forEach((f, i) => note(f, i * 0.2, 0.25, { type: "triangle", volume: 0.25 })); },
};
function jouer(nom) { try { if (SONS[nom]) SONS[nom](); } catch (e) { /* pas de son */ } }

/* Confettis */
function couleursEquipe(eq) {
  return eq === "rouge" ? ["#ff3b3b", "#ffd23f", "#ffffff", "#ff9a8a"] : ["#2f7bff", "#ffd23f", "#ffffff", "#8fc1ff"];
}
function petitsConfettis(eq) {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 140, spread: 90, startVelocity: 45, origin: { x: eq === "rouge" ? 0.2 : 0.8, y: 0.2 }, colors: couleursEquipe(eq) });
}
function grandsConfettis(eq) {
  if (typeof confetti !== "function") return;
  const fin = Date.now() + 5000;
  const couleurs = couleursEquipe(eq);
  (function image() {
    confetti({ particleCount: 7, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: couleurs });
    confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: couleurs });
    if (Date.now() < fin) requestAnimationFrame(image);
  })();
}

/* =====================================================================
   ÉCRAN TÉLÉ
   ===================================================================== */
let etat = null;
let idTele = null;
let peer = null;
let connexions = [];
let essaisId = 0;
let sansTelDepuis = Date.now();
let scoresAffiches = { rouge: null, bleu: null };
const boiteQR = document.createElement("div");

function lienTelecommande() {
  return location.href.split(/[?#]/)[0] + "?maitre=" + encodeURIComponent(idTele);
}

function dessinerQR() {
  boiteQR.innerHTML = "";
  if (typeof QRCode === "undefined") { boiteQR.textContent = "QR code indisponible (pas d'Internet ?)"; return; }
  new QRCode(boiteQR, { text: lienTelecommande(), width: 512, height: 512, correctLevel: QRCode.CorrectLevel.M });
}

function placerQR() {
  const ici = etat.phase === "accueil" ? $("#app .place-qr") : $("#coin-qr .place-qr");
  if (ici && boiteQR.parentNode !== ici) ici.appendChild(boiteQR);
}

function modeTele() {
  document.body.classList.add("mode-tele");

  // On reprend la partie en cours si la page a été rechargée
  etat = lire(CLE_ETAT, null);
  if (!etat || !etat.equipes || !etat.phase) etat = etatInitial();
  etat = Object.assign(etatInitial(), etat);
  if (etat.phase === "question" && !questionCourante(etat)) etat.phase = "accueil";

  idTele = lire(CLE_ID, null);
  if (!idTele) { idTele = nouvelId(); ecrire(CLE_ID, idTele); }
  dessinerQR();

  // Un clic sur la télé active le son et le plein écran
  $("#voile-son").hidden = false;
  document.addEventListener("click", (ev) => {
    const a = audio(); if (a && a.state === "suspended") a.resume();
    $("#voile-son").hidden = true;
    garderEcranAllume();
    if (!ev.target.closest("a") && !document.fullscreenElement && document.documentElement.requestFullscreen && !modeTele.pleinEcranDemande) {
      modeTele.pleinEcranDemande = true;
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "f" || ev.key === "F") {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  document.addEventListener("visibilitychange", garderEcranAllume);

  rendreTele(null);
  if (typeof Peer === "undefined") { majConnexionTele("PeerJS n'a pas pu se charger : vérifiez la connexion Internet."); return; }
  lancerPeerTele();
  setInterval(surveillerTele, 4000);
}

function lancerPeerTele() {
  peer = new Peer(idTele);
  peer.on("open", () => { essaisId = 0; majConnexionTele(); });
  peer.on("connection", (c) => {
    c.dernier = Date.now();
    c.on("open", () => {
      if (!connexions.includes(c)) connexions.push(c);
      envoyerEtat(c);
      majConnexionTele();
    });
    c.on("data", (d) => {
      c.dernier = Date.now();
      if (!d || typeof d !== "object") return;
      if (d.type === "ping") { try { c.send({ type: "pong" }); } catch (e) {} }
      else if (d.type === "hello") envoyerEtat(c);
      else if (d.type === "cmd") appliquer(d);
    });
    const retirer = () => { connexions = connexions.filter((x) => x !== c); majConnexionTele(); };
    c.on("close", retirer);
    c.on("error", retirer);
  });
  peer.on("error", (err) => {
    console.warn("PeerJS (télé) :", err.type, err);
    if (err.type === "unavailable-id") {
      // L'ancien identifiant est encore réservé (page rouverte trop vite, ou autre onglet ouvert).
      essaisId++;
      if (essaisId >= 4) { idTele = nouvelId(); ecrire(CLE_ID, idTele); essaisId = 0; dessinerQR(); }
    }
    majConnexionTele();
  });
}

/* Toutes les 4 secondes : on vérifie que tout va bien et on répare si besoin */
function surveillerTele() {
  if (!peer || peer.destroyed) { lancerPeerTele(); }
  else if (peer.disconnected) { try { peer.reconnect(); } catch (e) {} }
  const maintenant = Date.now();
  connexions.forEach((c) => { if (maintenant - c.dernier > 15000) { try { c.close(); } catch (e) {} } });
  connexions = connexions.filter((c) => c.open && maintenant - c.dernier <= 15000);
  majConnexionTele();
}

function majConnexionTele(messageErreur) {
  const n = connexions.length;
  if (n > 0) sansTelDepuis = null; else if (sansTelDepuis === null) sansTelDepuis = Date.now();

  const st = $("#statut-tel");
  if (st) {
    let texte, classe = "";
    if (messageErreur) { texte = "⚠️ " + messageErreur; classe = "alerte"; }
    else if (location.protocol === "file:") { texte = "⚠️ Le jeu est ouvert depuis un fichier. Ouvrez-le depuis son adresse en ligne (GitHub Pages) pour que le téléphone puisse s'y connecter."; classe = "alerte"; }
    else if (n > 0) { texte = "✅ Téléphone connecté ! Le maître prépare la partie…"; classe = "ok"; }
    else if (peer && peer.open) { texte = "⏳ En attente du téléphone du maître…"; }
    else { texte = "📡 Connexion au serveur en cours…"; }
    st.textContent = texte;
    st.className = "statut " + classe;
  }

  const montrerCoin = etat.phase !== "accueil" && n === 0 && sansTelDepuis !== null && Date.now() - sansTelDepuis > 6000;
  $("#coin-qr").hidden = !montrerCoin;
  placerQR();
}

function messageEtat() { return { type: "etat", etat: etat, stats: statistiques() }; }
function envoyerEtat(c) { try { if (c.open) c.send(messageEtat()); } catch (e) {} }
function diffuser() { const m = messageEtat(); connexions.forEach((c) => { try { if (c.open) c.send(m); } catch (e) {} }); }

function nomPropre(v, defaut) {
  const t = String(v || "").trim().slice(0, 24);
  return t || defaut;
}

/* Le maître a appuyé sur un bouton : on modifie la partie */
function appliquer(cmd) {
  const e = etat;
  const q = questionCourante(e);
  const enQuestion = e.phase === "question" && q;
  let effet = null; // pour les animations / sons

  switch (cmd.action) {
    case "demarrer": {
      const noms = cmd.noms || {};
      e.equipes.rouge = { nom: nomPropre(noms.rouge, NOMS_DEFAUT.rouge), score: 0 };
      e.equipes.bleu  = { nom: nomPropre(noms.bleu,  NOMS_DEFAUT.bleu),  score: 0 };
      const total = toutesLesQuestions().length;
      if (!total) { toast("Aucune question valide dans questions.js"); return; }
      e.nbQuestions = Math.max(1, Math.min(parseInt(cmd.nb, 10) || 20, total));
      e.tirage = tirer(e.nbQuestions, []);
      e.index = 0; e.bonus = null; e.bonusDeja = [];
      remettreQuestion(e);
      e.phase = "question";
      marquerPosee(questionCourante(e));
      jouer("debut");
      effet = "nouvelle-question";
      break;
    }
    case "sonne": {
      const eq = cmd.equipe;
      if (!enQuestion || e.resultat || !EQUIPES.includes(eq) || e.rates.includes(eq) || e.parole === eq) return;
      e.parole = eq;
      jouer("sonnette");
      effet = "parole";
      break;
    }
    case "bonne": {
      if (!enQuestion || !e.parole || e.resultat) return;
      e.equipes[e.parole].score += q.points;
      e.resultat = e.parole;
      jouer("bonne");
      petitsConfettis(e.parole);
      effet = "bonne";
      break;
    }
    case "mauvaise": {
      if (!enQuestion || !e.parole || e.resultat) return;
      e.rates.push(e.parole);
      const suivante = autre(e.parole);
      if (!e.rates.includes(suivante)) { e.parole = suivante; }
      else { e.parole = null; e.resultat = "personne"; }
      jouer("mauvaise");
      effet = "mauvaise";
      break;
    }
    case "montrer": {
      if (!enQuestion) return;
      e.montrerReponse = !e.montrerReponse;
      effet = "reponse";
      break;
    }
    case "suivante": {
      if (!enQuestion) return;
      if (e.bonus) { e.bonusDeja.push(e.bonus.question); e.bonus = null; e.phase = "fin"; }
      else if (e.index + 1 >= e.tirage.length) { e.phase = "fin"; }
      else { e.index++; remettreQuestion(e); marquerPosee(questionCourante(e)); jouer("question"); effet = "nouvelle-question"; }
      if (e.phase === "fin") {
        remettreQuestion(e);
        effet = "fin";
        if (egalite(e)) jouer("egalite"); else { jouer("victoire"); grandsConfettis(gagnant(e)); }
      }
      break;
    }
    case "corriger": {
      const eq = cmd.equipe, d = Number(cmd.delta);
      if (!EQUIPES.includes(eq) || (d !== 1 && d !== -1) || e.phase === "accueil") return;
      e.equipes[eq].score = Math.max(0, e.equipes[eq].score + d);
      break;
    }
    case "bonus": {
      if (e.phase !== "fin" || !egalite(e)) return;
      const exclus = e.tirage.map((x) => x.question).concat(e.bonusDeja);
      const [b] = tirer(1, exclus);
      if (!b) { toast("Plus de question disponible pour le bonus"); return; }
      e.bonus = b;
      remettreQuestion(e);
      e.phase = "question";
      marquerPosee(b);
      jouer("question");
      effet = "nouvelle-question";
      break;
    }
    case "nouvelle": {
      e.phase = "accueil";
      e.tirage = []; e.index = 0; e.bonus = null; e.bonusDeja = [];
      e.equipes.rouge.score = 0; e.equipes.bleu.score = 0;
      remettreQuestion(e);
      break;
    }
    case "remettre": {
      ecrire(CLE_DEJA, []);
      break;
    }
    default: return;
  }

  ecrire(CLE_ETAT, e);
  rendreTele(effet);
  diffuser();
}

/* ---------- Dessin de l'écran télé ---------- */
function htmlCarteScore(eq, actif) {
  const s = etat.equipes[eq].score;
  const change = scoresAffiches[eq] !== null && scoresAffiches[eq] !== s;
  return `<div class="carte-score ${eq} ${actif ? "actif" : ""}">
      <div class="nom">${esc(etat.equipes[eq].nom)}</div>
      <div class="points ${change ? "pop" : ""}">${s}</div>
    </div>`;
}

function rendreTele(effet) {
  const e = etat;
  const app = $("#app");

  if (e.phase === "accueil") {
    const st = statistiques();
    app.innerHTML = `
      <div class="tele accueil">
        <h1 class="titre-jeu">🎉 Le Grand Quiz du CE2 🎉</h1>
        <div class="accueil-centre">
          <div class="carte-qr">
            <div class="place-qr"></div>
            <div class="lien-test"><a href="${esc(lienTelecommande())}" target="_blank" rel="noopener">lien de la télécommande</a></div>
          </div>
          <div class="accueil-texte">
            <p class="grand">📱 Maître, scanne ce code avec ton téléphone !</p>
            <p id="statut-tel" class="statut"></p>
            <div class="equipes-apercu">
              <span class="pastille-equipe rouge">${esc(e.equipes.rouge.nom)}</span>
              <span class="vs">contre</span>
              <span class="pastille-equipe bleu">${esc(e.equipes.bleu.nom)}</span>
            </div>
            <p class="petite-note">${st.neuves} questions jamais posées sur ${st.total}${st.ignorees ? ` · ⚠️ ${pluriel(st.ignorees, "question mal écrite")} dans questions.js` : ""}</p>
          </div>
        </div>
      </div>`;
  }

  else if (e.phase === "question") {
    const q = questionCourante(e);
    const m = MATIERES[q.matiere];
    const theme = e.parole || (e.resultat && e.resultat !== "personne" ? e.resultat : "neutre");
    const longueur = q.question.length;
    const classeQ = longueur > 90 ? "tres-longue" : longueur > 55 ? "longue" : "";
    const nouvelle = effet === "nouvelle-question";

    let bandeau;
    if (e.resultat === "personne") {
      bandeau = `<div class="bandeau calme ${effet === "mauvaise" ? "secoue" : ""}">😮 Personne n'a trouvé… pas de point cette fois !</div>`;
    } else if (e.resultat) {
      bandeau = `<div class="bandeau succes ${effet === "bonne" ? "pop" : ""}">✅ Bravo ${esc(avecArticle(e.equipes[e.resultat].nom))} ! +${pluriel(q.points, "point")}</div>`;
    } else if (e.parole && e.rates.length) {
      bandeau = `<div class="bandeau blanc-${e.parole} ${effet === "mauvaise" ? "pop" : ""}"><span class="petit">❌ Raté ! La parole passe à l'autre équipe…</span>${esc(avecArticle(e.equipes[e.parole].nom))} a la parole !</div>`;
    } else if (e.parole) {
      bandeau = `<div class="bandeau blanc-${e.parole} ${effet === "parole" ? "pop" : ""}">🔔 ${esc(avecArticle(e.equipes[e.parole].nom))} a la parole !</div>`;
    } else {
      bandeau = `<div class="bandeau calme">🔔 Tapez sur la sonnette pour répondre !</div>`;
    }

    app.innerHTML = `
      <div class="tele theme-${theme}">
        <header class="scores">
          ${htmlCarteScore("rouge", e.parole === "rouge")}
          <div class="compteur">${e.bonus ? `Question<b>⭐ BONUS ⭐</b>` : `Question<b>${e.index + 1} / ${e.tirage.length}</b>`}</div>
          ${htmlCarteScore("bleu", e.parole === "bleu")}
        </header>
        <main class="zone-question ${nouvelle ? "pop" : ""}">
          <div class="etiquettes">
            <span class="matiere" style="background:${m.couleur};color:${m.texte}">${m.icone} ${esc(q.matiere)}</span>
            <span class="valeur">${etoiles(q.points)} ${pluriel(q.points, "point")}</span>
          </div>
          <div class="question ${classeQ}">${esc(q.question)}</div>
          ${e.montrerReponse ? `<div class="reponse ${effet === "reponse" ? "pop" : ""}">💡 Réponse : ${esc(q.reponse)}</div>` : ""}
        </main>
        ${bandeau}
      </div>`;
  }

  else { // fin
    const g = gagnant(e);
    const scores = `<div class="scores-finaux">${htmlCarteScore("rouge", g === "rouge")}${htmlCarteScore("bleu", g === "bleu")}</div>`;
    if (g) {
      app.innerHTML = `
        <div class="tele fin theme-${g}">
          <div class="trophee ${effet === "fin" ? "pop" : "respire"}">🏆</div>
          <h1 class="titre-fin">${esc(avecArticle(e.equipes[g].nom))}<br>a gagné !</h1>
          ${scores}
        </div>`;
    } else {
      app.innerHTML = `
        <div class="tele fin">
          <div class="trophee ${effet === "fin" ? "pop" : "respire"}">🤝</div>
          <h1 class="titre-fin">Égalité !</h1>
          ${scores}
          <p class="sous-titre-fin">Une question bonus va départager les équipes…</p>
        </div>`;
    }
  }

  scoresAffiches = { rouge: e.equipes.rouge.score, bleu: e.equipes.bleu.score };
  majConnexionTele();
}

/* =====================================================================
   TÉLÉCOMMANDE DU MAÎTRE (téléphone)
   ===================================================================== */
let etatTel = null;
let statsTel = { total: 0, neuves: 0, ignorees: 0 };
let peerTel = null;
let connTel = null;
let dernierMsg = 0;
let derniereTentative = 0;
let idCible = null;

function modeTelephone(id) {
  idCible = id;
  document.body.classList.add("mode-tel");
  $("#barre-connexion").hidden = false;
  rendreTel();
  majBarre();

  document.addEventListener("click", clicTelephone);
  document.addEventListener("submit", (ev) => {
    if (ev.target.id !== "form-partie") return;
    ev.preventDefault();
    const f = ev.target;
    envoyer({ action: "demarrer", noms: { rouge: f.rouge.value, bleu: f.bleu.value }, nb: f.nb.value });
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { garderEcranAllume(); surveillerTel(); } });
  document.addEventListener("click", garderEcranAllume, { once: true });

  if (typeof Peer === "undefined") { $("#barre-connexion").textContent = "⚠️ PeerJS n'a pas pu se charger (Internet ?)"; return; }
  creerPeerTel();
  setInterval(surveillerTel, 3000);
}

function creerPeerTel() {
  try { if (peerTel) peerTel.destroy(); } catch (e) {}
  peerTel = new Peer();
  peerTel.on("open", () => { if (!(connTel && connTel.open)) connecterTel(); });
  peerTel.on("error", (err) => { console.warn("PeerJS (téléphone) :", err.type, err); majBarre(); });
}

function connecterTel() {
  if (!peerTel || !peerTel.open) return;
  derniereTentative = Date.now();
  if (connTel) { try { connTel.close(); } catch (e) {} }
  const c = peerTel.connect(idCible, { reliable: true });
  connTel = c;
  c.on("open", () => { if (c !== connTel) return; dernierMsg = Date.now(); c.send({ type: "hello" }); majBarre(); });
  c.on("data", (d) => {
    if (c !== connTel) return;
    dernierMsg = Date.now();
    if (d && d.type === "etat") { etatTel = d.etat; statsTel = d.stats || statsTel; rendreTel(); }
    majBarre();
  });
  c.on("close", () => { if (c === connTel) majBarre(); });
  c.on("error", () => { if (c === connTel) majBarre(); });
}

/* Toutes les 3 secondes : on vérifie la connexion et on se reconnecte si besoin */
function surveillerTel() {
  const maintenant = Date.now();
  if (!peerTel || peerTel.destroyed) { creerPeerTel(); majBarre(); return; }
  if (peerTel.disconnected) { try { peerTel.reconnect(); } catch (e) {} }
  if (connTel && connTel.open) {
    try { connTel.send({ type: "ping" }); } catch (e) {}
    if (maintenant - dernierMsg > 10000) connecterTel(); // plus de nouvelles : on relance
  } else if (peerTel.open && maintenant - derniereTentative > 5000) {
    connecterTel();
  }
  majBarre();
}

function estConnecte() { return !!(connTel && connTel.open && Date.now() - dernierMsg < 10000); }

function majBarre() {
  const b = $("#barre-connexion");
  const ok = estConnecte();
  b.classList.toggle("hors-ligne", !ok);
  b.textContent = ok ? "🟢 Connecté à la télé" : (etatTel ? "🟠 Reconnexion à la télé… (les scores sont gardés)" : "🟠 Connexion à la télé…");
  document.body.classList.toggle("hors-ligne", !ok);
}

function envoyer(cmd) {
  if (connTel && connTel.open) {
    try {
      connTel.send(Object.assign({ type: "cmd" }, cmd));
      if (navigator.vibrate) navigator.vibrate(25);
      return true;
    } catch (e) { /* on tombe plus bas */ }
  }
  toast("📡 Pas connecté à la télé… reconnexion en cours");
  surveillerTel();
  return false;
}

function clicTelephone(ev) {
  const nb = ev.target.closest("[data-nb]");
  if (nb) {
    const champ = $("#form-partie input[name=nb]");
    const max = statsTel.total || 999;
    champ.value = Math.max(1, Math.min(max, (parseInt(champ.value, 10) || 20) + Number(nb.dataset.nb)));
    return;
  }
  const b = ev.target.closest("[data-action]");
  if (!b || b.disabled) return;
  if (b.dataset.confirmer && !confirm(b.dataset.confirmer)) return;
  const cmd = { action: b.dataset.action };
  if (b.dataset.equipe) cmd.equipe = b.dataset.equipe;
  if (b.dataset.delta) cmd.delta = Number(b.dataset.delta);
  if (envoyer(cmd) && cmd.action === "remettre") toast("♻️ Toutes les questions sont de nouveau disponibles");
}

/* ---------- Dessin de la télécommande ---------- */
function htmlMiniScores(e, milieu) {
  return `<div class="mini-scores">
      <div class="ms rouge">${esc(e.equipes.rouge.nom)}<b>${e.equipes.rouge.score}</b></div>
      <div class="num">${milieu}</div>
      <div class="ms bleu">${esc(e.equipes.bleu.nom)}<b>${e.equipes.bleu.score}</b></div>
    </div>`;
}
function htmlCorrection(e) {
  const ligne = (eq) => `
    <div class="ligne-correction">
      <button class="petit-btn moins" data-action="corriger" data-equipe="${eq}" data-delta="-1" aria-label="Retirer un point">−1</button>
      <div class="nom ${eq}">${esc(e.equipes[eq].nom)}<b>${e.equipes[eq].score}</b></div>
      <button class="petit-btn" data-action="corriger" data-equipe="${eq}" data-delta="1" aria-label="Ajouter un point">+1</button>
    </div>`;
  return `<details class="pli" data-id="corriger"><summary>✏️ Corriger les points</summary>${ligne("rouge")}${ligne("bleu")}</details>`;
}
function htmlReglages(enPartie) {
  return `<details class="pli" data-id="reglages"><summary>⚙️ Réglages</summary>
      <p class="note-tel" id="stats-tel">📊 ${statsTel.neuves} questions jamais posées sur ${statsTel.total}</p>
      ${enPartie ? `<button class="btn-texte" data-action="nouvelle" data-confirmer="Arrêter cette partie et revenir au début ?">🔄 Arrêter et faire une nouvelle partie</button>` : ""}
      <button class="btn-texte" data-action="remettre" data-confirmer="Remettre toutes les questions ? Le jeu oubliera celles déjà posées.">♻️ Remettre toutes les questions</button>
    </details>`;
}

function rendreTel() {
  const app = $("#app");
  if (!etatTel) {
    app.innerHTML = `<div class="tel"><div class="attente"><div class="icone">📡</div>
      <h2>Connexion à la télé…</h2>
      <p class="note-tel">Vérifiez que la télé affiche bien le QR code du jeu.</p></div></div>`;
    return;
  }
  const e = etatTel;
  const ouverts = [...document.querySelectorAll("details[data-id]")].filter((d) => d.open).map((d) => d.dataset.id);

  if (e.phase === "accueil") {
    // On ne redessine pas le formulaire pendant que le maître écrit dedans
    if ($("#form-partie")) {
      const s = $("#stats-tel"); if (s) s.textContent = `📊 ${statsTel.neuves} questions jamais posées sur ${statsTel.total}`;
      return;
    }
    app.innerHTML = `
      <div class="tel">
        <h1>🎉 Nouvelle partie</h1>
        <form id="form-partie" class="form-partie" autocomplete="off">
          <label class="champ rouge">🔴 Nom de l'équipe rouge
            <input type="text" name="rouge" maxlength="24" value="${esc(e.equipes.rouge.nom)}"></label>
          <label class="champ bleu">🔵 Nom de l'équipe bleue
            <input type="text" name="bleu" maxlength="24" value="${esc(e.equipes.bleu.nom)}"></label>
          <div class="champ">🔢 Nombre de questions
            <div class="compteur-nb">
              <button type="button" class="petit-btn moins" data-nb="-1">−</button>
              <input name="nb" type="number" inputmode="numeric" min="1" max="${statsTel.total || 150}" value="${e.nbQuestions || 20}">
              <button type="button" class="petit-btn" data-nb="1">+</button>
            </div>
          </div>
          <button type="submit" class="gros vert">▶️ Commencer la partie</button>
        </form>
        ${htmlReglages(false)}
      </div>`;
  }

  else if (e.phase === "question") {
    const q = questionCourante(e);
    const m = MATIERES[q.matiere] || { icone: "", couleur: "#888", texte: "#fff" };
    const resolu = !!e.resultat;
    const nomP = e.parole ? esc(e.equipes[e.parole].nom) : "";

    let tour;
    if (e.resultat === "personne") tour = `<div class="tour">😮 Personne n'a trouvé — aucun point</div>`;
    else if (resolu) tour = `<div class="tour vert">✅ +${pluriel(q.points, "point")} pour ${esc(e.equipes[e.resultat].nom)}</div>`;
    else if (e.parole) tour = `<div class="tour ${e.parole}">${e.parole === "rouge" ? "🔴" : "🔵"} ${nomP} a la parole${e.rates.length ? " (l'autre équipe s'est trompée)" : ""}</div>`;
    else tour = `<div class="tour">🔔 En attente de la sonnette…</div>`;

    const peutSonner = (eq) => !resolu && !e.rates.includes(eq) && e.parole !== eq;
    const sousNom = (eq) => e.equipes[eq].nom !== NOMS_DEFAUT[eq] ? `<small>${esc(e.equipes[eq].nom)}</small>` : "";

    app.innerHTML = `
      <div class="tel">
        ${htmlMiniScores(e, e.bonus ? `<b>⭐</b>Bonus` : `Question<b>${e.index + 1} / ${e.tirage.length}</b>`)}
        <div class="carte">
          <div class="infos">
            <span class="chip" style="background:${m.couleur};color:${m.texte}">${m.icone} ${esc(q.matiere)}</span>
            <span class="chip pts">${etoiles(q.points)} ${pluriel(q.points, "point")}</span>
          </div>
          <div class="q">${esc(q.question)}</div>
          <div class="rep"><small>Réponse (vous seul la voyez)</small><b>${esc(q.reponse)}</b></div>
        </div>
        ${tour}
        <div class="grille2">
          <button class="gros rouge" data-action="sonne" data-equipe="rouge" ${peutSonner("rouge") ? "" : "disabled"}>🔴 Rouge a sonné${sousNom("rouge")}</button>
          <button class="gros bleu" data-action="sonne" data-equipe="bleu" ${peutSonner("bleu") ? "" : "disabled"}>🔵 Bleu a sonné${sousNom("bleu")}</button>
        </div>
        <div class="grille2">
          <button class="gros vert" data-action="bonne" ${e.parole && !resolu ? "" : "disabled"}>✅ Bonne réponse</button>
          <button class="gros ko" data-action="mauvaise" ${e.parole && !resolu ? "" : "disabled"}>❌ Mauvaise réponse</button>
        </div>
        <button class="gros violet" data-action="montrer">${e.montrerReponse ? "🙈 Cacher la réponse à la télé" : "📺 Montrer la réponse à la télé"}</button>
        <button class="gros jaune ${resolu ? "attire" : ""}" data-action="suivante">${derniereQuestion(e) ? "🏁 Voir le résultat final" : "⏭️ Question suivante"}</button>
        ${htmlCorrection(e)}
        ${htmlReglages(true)}
      </div>`;
  }

  else { // fin
    const g = gagnant(e);
    app.innerHTML = `
      <div class="tel">
        <div class="resultat-final ${g || ""}">
          <div class="icone">${g ? "🏆" : "🤝"}</div>
          <h2>${g ? esc(e.equipes[g].nom) + " a gagné !" : "Égalité !"}</h2>
        </div>
        ${htmlMiniScores(e, "Score<b>final</b>")}
        ${g ? "" : `<button class="gros jaune attire" data-action="bonus">⭐ Poser une question bonus</button>`}
        <button class="gros vert" data-action="nouvelle">🔄 Nouvelle partie</button>
        ${htmlCorrection(e)}
        ${htmlReglages(false)}
      </div>`;
  }

  ouverts.forEach((id) => { const d = document.querySelector(`details[data-id="${id}"]`); if (d) d.open = true; });
}

/* =====================================================================
   DÉMARRAGE : télé ou téléphone ?
   ===================================================================== */
(function demarrer() {
  const idMaitre = new URLSearchParams(location.search).get("maitre");
  if (idMaitre) modeTelephone(idMaitre);
  else modeTele();
})();
