/* ==========================================================================
   CALENDRIER DE L'AVENT — LES SONS
   Tout est fabriqué par le navigateur, sans fichier à télécharger :
   grelots, boîte à musique, « Ohoo » de foule, et deux airs de Noël du
   domaine public : « Vive le vent » (Jingle Bells, J. Pierpont, 1857) et
   « Douce nuit » (F. Gruber, 1818).
   Le « Ohoo » et la musique peuvent être remplacés par vos propres fichiers
   (réglages fichierOhoo et fichierMusique dans cadeaux.js).
   Ce fichier n'a normalement pas besoin d'être modifié.
   ========================================================================== */
(function () {
  "use strict";

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, maitre = null, busFond = null;
  var actif = true, volume = 0.8, fichierOhoo = "", fichierMusique = "", avecFond = false;
  var groupes = [], elements = [], minuteries = [];
  var fondLance = false, fondMinuteur = null, fondElement = null;
  var NIVEAU_FOND = 0.3;

  /* ---------- Outils ---------- */
  var NOTES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function hz(nom, transpo) {
    var m = /^([A-G])([#b]?)(-?\d)$/.exec(nom);
    var midi = 12 * (+m[3] + 1) + NOTES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (transpo || 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  function enveloppe(p, t, pic, attaque, duree) {
    p.setValueAtTime(0.0001, t);
    p.exponentialRampToValueAtTime(Math.max(pic, 0.0002), t + attaque);
    p.exponentialRampToValueAtTime(0.0001, t + duree);
  }
  function bruitDe(ac) {
    if (!ac.__bruit) {
      var b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      ac.__bruit = b;
    }
    return ac.__bruit;
  }

  /* ---------- Instruments ---------- */
  // Boîte à musique : une note claire qui s'éteint doucement
  function boite(ac, dest, f, t, vel, duree) {
    duree = duree || 1.5;
    [[1, 1, 0.004, duree], [2, 0.22, 0.003, duree * 0.45], [3, 0.07, 0.002, duree * 0.18]].forEach(function (p) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = f * p[0];
      enveloppe(g.gain, t, vel * p[1], p[2], p[3]);
      o.connect(g); g.connect(dest);
      o.start(t); o.stop(t + p[3] + 0.05);
    });
  }
  // Grelot de traîneau : bruit métallique très court
  function grelot(ac, dest, t, vel) {
    var b = bruitDe(ac);
    for (var k = 0; k < 3; k++) {
      var tk = t + k * 0.011 + Math.random() * 0.006;
      var s = ac.createBufferSource(); s.buffer = b;
      var hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5200;
      var pk = ac.createBiquadFilter(); pk.type = "peaking"; pk.frequency.value = 7000 + Math.random() * 3000; pk.Q.value = 3; pk.gain.value = 12;
      var g = ac.createGain();
      enveloppe(g.gain, tk, vel * (1 - k * 0.25), 0.0015, 0.07 + Math.random() * 0.05);
      s.connect(hp); hp.connect(pk); pk.connect(g); g.connect(dest);
      s.start(tk, Math.random() * 0.7, 0.2);
      var o = ac.createOscillator(), go = ac.createGain();
      o.type = "sine"; o.frequency.value = 2600 + Math.random() * 1400;
      enveloppe(go.gain, tk, vel * 0.12, 0.001, 0.1);
      o.connect(go); go.connect(dest); o.start(tk); o.stop(tk + 0.12);
    }
  }
  // Basse ronde
  function basse(ac, dest, f, t, vel, duree) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = f;
    enveloppe(g.gain, t, vel, 0.01, duree);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + duree + 0.05);
  }
  // Coup de timbale sourd, pour faire monter le suspens
  function timbale(ac, dest, t, vel) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(58, t + 0.35);
    enveloppe(g.gain, t, vel, 0.004, 0.45);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.5);
  }
  // « Pop » du couvercle qui saute
  function pop(ac, dest, t) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(950, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.13);
    enveloppe(g.gain, t, 0.7, 0.002, 0.17);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.2);
    var s = ac.createBufferSource(); s.buffer = bruitDe(ac);
    var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
    var gs = ac.createGain(); enveloppe(gs.gain, t, 0.5, 0.001, 0.07);
    s.connect(lp); lp.connect(gs); gs.connect(dest); s.start(t, 0.1, 0.1);
  }
  // « Ohoo » : une petite foule émerveillée (voix d'hommes et de femmes)
  function ohoo(ac, dest, t) {
    var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3000;
    var sortie = ac.createGain(); sortie.gain.value = 1;
    lp.connect(sortie); sortie.connect(dest);
    var voix = [[110, 0.00, 1], [124, 0.05, 1], [139, 0.02, 1], [156, 0.09, 1], [196, 0.03, 1.12], [220, 0.07, 1.12], [247, 0.01, 1.12], [277, 0.06, 1.12]];
    voix.forEach(function (v) {
      var f0 = v[0] * (0.97 + Math.random() * 0.06), t0 = t + v[1], fm = v[2];
      var o = ac.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(f0 * 0.9, t0);
      o.frequency.linearRampToValueAtTime(f0 * 1.2, t0 + 0.34);   // « oo-OO… »
      o.frequency.linearRampToValueAtTime(f0 * 1.08, t0 + 0.75);
      o.frequency.linearRampToValueAtTime(f0 * 0.78, t0 + 1.7);   // « …ooh »
      var lfo = ac.createOscillator(), lg = ac.createGain();
      lfo.frequency.value = 4.8 + Math.random() * 1.6; lg.gain.value = f0 * 0.02;
      lfo.connect(lg); lg.connect(o.frequency);
      var amp = ac.createGain();
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(1, t0 + 0.18);
      amp.gain.setValueAtTime(1, t0 + 0.95);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.85);
      // Formants de la voyelle « o » qui se ferme en « ou »
      [[470, 6, 1], [840, 8, 0.5], [2650, 10, 0.07]].forEach(function (f) {
        var bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = f[1];
        bp.frequency.setValueAtTime(f[0] * fm * 1.05, t0);
        bp.frequency.linearRampToValueAtTime(f[0] * fm * 0.82, t0 + 1.5);
        var g = ac.createGain(); g.gain.value = f[2] * 0.62;
        o.connect(bp); bp.connect(g); g.connect(amp);
      });
      amp.connect(lp);
      o.start(t0); lfo.start(t0); o.stop(t0 + 1.95); lfo.stop(t0 + 1.95);
    });
    // un souffle léger pour l'effet de salle
    var s = ac.createBufferSource(); s.buffer = bruitDe(ac);
    var bs = ac.createBiquadFilter(); bs.type = "bandpass"; bs.frequency.value = 900; bs.Q.value = 1.2;
    var gs = ac.createGain();
    gs.gain.setValueAtTime(0.0001, t); gs.gain.exponentialRampToValueAtTime(0.05, t + 0.2); gs.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    s.connect(bs); bs.connect(gs); gs.connect(dest); s.start(t, 0, 1);
  }

  /* ---------- Les airs (domaine public) ---------- */
  // « Vive le vent » — refrain. [note, durée en temps]
  var VIVE_A = [["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4]];
  var VIVE_B1 = [["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5], ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1], ["D5", 2], ["G5", 2]];
  var VIVE_B2 = [["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5], ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1], ["C5", 4]];
  var VIVE_BASSE_A = ["C3", "C3", "C3", "C3"], VIVE_BASSE_B1 = ["F2", "C3", "G2", "G2"], VIVE_BASSE_B2 = ["F2", "C3", "G2", "C3"];
  // « Douce nuit » — [note, durée en croches], mesure à 6/8
  var DOUCE_NUIT = [
    ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3], ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
    ["D5", 2], ["D5", 1], ["B4", 3], ["C5", 2], ["C5", 1], ["G4", 3],
    ["A4", 2], ["A4", 1], ["C5", 1.5], ["B4", 0.5], ["A4", 1], ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
    ["A4", 2], ["A4", 1], ["C5", 1.5], ["B4", 0.5], ["A4", 1], ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
    ["D5", 2], ["D5", 1], ["F5", 1.5], ["D5", 0.5], ["B4", 1], ["C5", 3], ["E5", 3],
    ["C5", 1], ["G4", 1], ["E4", 1], ["G4", 1.5], ["F4", 0.5], ["D4", 1], ["C4", 6]
  ];
  var DOUCE_NUIT_BASSE = ["C3", "C3", "G2", "C3", "F2", "C3", "F2", "C3", "G2", "C3", "G2", "C3"];

  // Joue une mélodie ; renvoie l'instant de fin
  function melodie(ac, dest, notes, t, unite, vel, transpo, duree) {
    notes.forEach(function (n) {
      boite(ac, dest, hz(n[0], transpo), t, vel, Math.max(duree || 1.3, n[1] * unite * 1.2));
      t += n[1] * unite;
    });
    return t;
  }
  function lignesDeBasse(ac, dest, notes, t, mesure, vel, temps) {
    notes.forEach(function (n, i) {
      for (var k = 0; k < temps; k++) basse(ac, dest, hz(n), t + i * mesure + k * mesure / temps, vel, mesure / temps * 0.9);
    });
  }
  function grelotsEnRythme(ac, dest, t, fin, temps, vel) {
    for (var x = t, i = 0; x < fin - 0.01; x += temps, i++) grelot(ac, dest, x, i % 2 ? vel : vel * 0.55);
  }

  /* ---------- Les séquences ---------- */
  // Le suspens : trois salves de grelots calées sur les secousses du paquet
  function composerSuspense(ac, dest, t0) {
    [[0.61, 0.88, 0.45, "G5"], [1.11, 1.47, 0.7, "B5"], [1.69, 2.3, 1, "D6"]].forEach(function (s) {
      timbale(ac, dest, t0 + s[0], 0.55 * s[2] + 0.2);
      for (var x = s[0]; x < s[1]; x += 0.055) grelot(ac, dest, t0 + x + Math.random() * 0.01, 0.55 * s[2]);
      for (var y = s[0]; y < s[1]; y += 0.11) boite(ac, dest, hz(s[3]), t0 + y, 0.13 * s[2], 0.4);
    });
  }
  // L'ouverture : pop, pluie d'étoiles, « Ohoo », puis « Vive le vent »
  function composerEclat(ac, dest, t0, avecOhoo, avecMusique) {
    pop(ac, dest, t0);
    ["C6", "E6", "G6", "C7", "E7", "G7"].forEach(function (n, i) { boite(ac, dest, hz(n), t0 + 0.03 + i * 0.045, 0.22, 1.1); });
    if (avecOhoo !== false) ohoo(ac, dest, t0 + 0.08);
    if (avecMusique === false) return t0 + 2;
    return musiqueOuverture(ac, dest, t0 + 1.25);
  }
  function musiqueOuverture(ac, dest, debut) {
    var temps = 0.4, mesure = 4 * temps;
    var t = melodie(ac, dest, VIVE_A, debut, temps, 0.3);
    t = melodie(ac, dest, VIVE_B2, t, temps, 0.3);
    lignesDeBasse(ac, dest, VIVE_BASSE_A.concat(VIVE_BASSE_B2), debut, mesure, 0.16, 2);
    grelotsEnRythme(ac, dest, debut, t - mesure, temps, 0.35);
    // accord final et dernière secousse de grelots
    ["C5", "E5", "G5", "C6"].forEach(function (n, i) { boite(ac, dest, hz(n), t - mesure + i * 0.06, 0.18, 2.2); });
    for (var x = 0; x < 0.5; x += 0.05) grelot(ac, dest, t - mesure + x, 0.35);
    return t;
  }
  // La musique de fond : « Douce nuit » puis « Vive le vent », doucement
  function composerFond(ac, dest, t0) {
    var croche = 0.3, mesure68 = 6 * croche;
    var t = melodie(ac, dest, DOUCE_NUIT, t0, croche, 0.28, 12, 1.8);
    lignesDeBasse(ac, dest, DOUCE_NUIT_BASSE, t0, mesure68, 0.12, 1);
    t += 2.5;
    var temps = 0.54, mesure = 4 * temps, debut = t;
    [VIVE_A, VIVE_B1, VIVE_A, VIVE_B2].forEach(function (p) { t = melodie(ac, dest, p, t, temps, 0.26); });
    lignesDeBasse(ac, dest, VIVE_BASSE_A.concat(VIVE_BASSE_B1, VIVE_BASSE_A, VIVE_BASSE_B2), debut, mesure, 0.12, 2);
    grelotsEnRythme(ac, dest, debut, t, temps * 2, 0.18);
    return t + 3;
  }

  /* ---------- Lecture ---------- */
  function contexte() {
    if (!AC) return null;
    if (!ctx) {
      try { ctx = new AC(); } catch (e) { return null; }
      maitre = ctx.createGain(); maitre.gain.value = actif ? volume : 0;
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12; comp.knee.value = 8; comp.ratio.value = 4;
      maitre.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    debloquerIOS();
    return ctx;
  }
  function nouveauGroupe() {
    var g = ctx.createGain(); g.connect(maitre); groupes.push(g); return g;
  }
  function couperGroupes() {
    var maintenant = ctx ? ctx.currentTime : 0;
    groupes.forEach(function (g) {
      g.gain.setTargetAtTime(0, maintenant, 0.06);
      setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 700);
    });
    groupes = [];
  }
  function plusTard(f, ms) { minuteries.push(setTimeout(f, ms)); }
  function fichier(chemin, vol, boucle, siEchec) {
    var a = new Audio(chemin);
    a.volume = Math.max(0, Math.min(1, vol));
    a.loop = !!boucle;
    a.muted = !actif;
    a.addEventListener("error", function () { if (siEchec) siEchec(); });
    var p = a.play(); if (p && p.catch) p.catch(function () {});
    elements.push(a);
    return a;
  }
  function fondu(a, duree) {
    var v0 = a.volume, pas = 0;
    var id = setInterval(function () {
      pas++; a.volume = Math.max(0, v0 * (1 - pas / 10));
      if (pas >= 10) { clearInterval(id); a.pause(); }
    }, duree * 100);
  }
  function baisserFond(oui) {
    if (busFond && ctx) busFond.gain.setTargetAtTime(oui ? 0 : NIVEAU_FOND, ctx.currentTime, oui ? 0.15 : 1.2);
    if (fondElement) { if (oui) fondElement.pause(); else if (actif) { var p = fondElement.play(); if (p && p.catch) p.catch(function () {}); } }
  }

  function suspense() {
    if (!contexte()) return;
    arreter(true);
    baisserFond(true);
    composerSuspense(ctx, nouveauGroupe(), ctx.currentTime + 0.03);
  }
  function eclat() {
    if (!contexte()) return;
    arreter(true);
    baisserFond(true);
    var g = nouveauGroupe(), t0 = ctx.currentTime + 0.02;
    composerEclat(ctx, g, t0, !fichierOhoo, !fichierMusique);
    if (fichierOhoo) {
      fichier(fichierOhoo, volume, false, function () { if (ctx) ohoo(ctx, g, ctx.currentTime + 0.02); });
    }
    if (fichierMusique) {
      plusTard(function () {
        var a = fichier(fichierMusique, volume * 0.8, false, function () { if (ctx) musiqueOuverture(ctx, g, ctx.currentTime + 0.05); });
        plusTard(function () { fondu(a, 1.5); }, 14000);
      }, 1200);
    }
  }
  // arreter(true) : on enchaîne aussitôt sur un autre son, la musique de fond reste baissée
  function arreter(enchaine) {
    minuteries.forEach(clearTimeout); minuteries = [];
    couperGroupes();
    elements.forEach(function (a) { if (a !== fondElement) { try { a.pause(); } catch (e) {} } });
    elements = fondElement ? [fondElement] : [];
    if (!enchaine) baisserFond(false);
  }

  function cycleFond() {
    if (!ctx || !busFond) return;
    var debut = ctx.currentTime + 0.1;
    var fin = composerFond(ctx, busFond, debut);
    fondMinuteur = setTimeout(cycleFond, Math.max(1000, (fin - debut - 1.5) * 1000));
  }
  function demarrerFond() {
    if (!avecFond || fondLance) return;
    if (fichierMusique) {
      fondLance = true;
      fondElement = fichier(fichierMusique, volume * NIVEAU_FOND, true, function () { fondElement = null; fondLance = false; fichierMusique = ""; demarrerFond(); });
      return;
    }
    if (!contexte()) return;
    fondLance = true;
    busFond = ctx.createGain(); busFond.gain.value = NIVEAU_FOND; busFond.connect(maitre);
    cycleFond();
  }

  // iPhone et iPad coupent les sons des pages web quand le bouton « silencieux »
  // est enclenché : on demande au système de traiter le calendrier comme un lecteur
  // de musique, qui lui joue toujours.
  var iosDebloque = false;
  function debloquerIOS() {
    if (iosDebloque) return;
    iosDebloque = true;
    try { if (navigator.audioSession) { navigator.audioSession.type = "playback"; return; } } catch (e) {}
    var ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!ios) return;
    // anciens iOS : un fichier son muet, joué en boucle, ouvre la même porte
    var silence = new Audio("data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==");
    silence.loop = true;
    silence.setAttribute("playsinline", "");
    var p = silence.play(); if (p && p.catch) p.catch(function () {});
  }

  // Petit carillon d'essai, joué quand on réactive le son avec le bouton
  function essai() {
    if (!contexte()) return;
    var g = nouveauGroupe(), t = ctx.currentTime + 0.03;
    ["C6", "E6", "G6", "C7"].forEach(function (n, i) { boite(ctx, g, hz(n), t + i * 0.09, 0.3, 1.2); });
    for (var x = 0; x < 0.45; x += 0.05) grelot(ctx, g, t + x, 0.4);
  }

  function activer(oui) {
    actif = !!oui;
    if (maitre && ctx) maitre.gain.setTargetAtTime(actif ? volume : 0, ctx.currentTime, 0.05);
    elements.forEach(function (a) { a.muted = !actif; });
  }

  window.Sons = {
    reglages: function (o) {
      o = o || {};
      if (o.volume != null && isFinite(+o.volume)) volume = Math.max(0, Math.min(1, +o.volume));
      fichierOhoo = o.fichierOhoo || "";
      fichierMusique = o.fichierMusique || "";
      avecFond = !!o.musiqueDeFond;
    },
    activer: activer,
    estActif: function () { return actif; },
    disponible: function () { return !!AC; },
    suspense: suspense,
    eclat: eclat,
    arreter: function () { arreter(false); },
    demarrerFond: demarrerFond,
    essai: essai,
    // utilisé seulement pour les essais (rendu hors ligne)
    _composer: { suspense: composerSuspense, eclat: composerEclat, fond: composerFond }
  };
})();
