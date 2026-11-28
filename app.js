(function () {
"use strict";
var PHONE = "573000000000", V = 180;
var CF = {Blanca: "Blanco", Dorada: "Dorado", Negra: "Negro", Azul: "Azul", Roja: "Rojo", Kraft: "Kraft"};
var C = {
  Blanca: ["#FFFFFF", "#8d96a0"],
  Dorada: ["linear-gradient(135deg,#E8CB7C,#B88A2A)", "#B88A2A"],
  Negra: ["#151515", "#151515"],
  Azul: ["#1F4E9C", "#1F4E9C"],
  Roja: ["#B3261E", "#B3261E"],
  Kraft: ["#B58A5C", "#B58A5C"]
};
var P = {
  flow: {n: "Bolsa Flow Pack", f: "Flow-Pack", c: "Blanca,Dorada,Negra,Azul,Roja,Kraft", z: 0, ex: {d: 0, s: 0}, s: [["250 g", 1000], ["500 g", 1200]]},
  doy: {n: "Bolsa Doy Pack", f: "Doy-Pack", c: "Blanca,Dorada,Negra,Kraft", z: 1, ex: {d: 5, s: 5}, s: [["250 g", 1000], ["500 g", 1200]]},
  "4pro": {n: "Bolsa 4PRO", f: "4PRO", c: "Blanca,Dorada,Negra,Azul,Roja", z: 0, ex: {d: 5, s: 5}, s: [["250 g", 1100], ["500 g", 1500], ["1000 g", 1800]]}
};
function wa(m) { return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(m); }
function money(n) { return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

document.querySelectorAll("[data-wa]").forEach(function (a) {
  a.href = wa(a.getAttribute("data-wa") || "Hola, quiero cotizar bolsas para café");
  a.target = "_blank";
  a.rel = "noopener noreferrer";
});

/* Miniaturas del catálogo: si la foto no existe, queda la bolsa dibujada */
document.querySelectorAll(".card .thumb img").forEach(function (im) {
  var sv = im.parentNode.querySelector("svg");
  function ok() { im.hidden = false; if (sv) sv.style.display = "none"; }
  function bad() { im.hidden = true; if (sv) sv.style.display = ""; }
  if (im.complete) { im.naturalWidth ? ok() : bad(); }
  else { im.addEventListener("load", ok); im.addEventListener("error", bad); }
});

/* Preguntas frecuentes: una abierta a la vez */
var det = document.querySelectorAll(".faq details");
det.forEach(function (d) {
  d.addEventListener("toggle", function () {
    if (d.open) det.forEach(function (o) { if (o !== d) o.open = false; });
  });
});

/* Página de producto */
var pp = document.querySelector("[data-prod]");
if (!pp) return;
var d = P[pp.getAttribute("data-prod")];
var k = pp.querySelector(".cfg");
var th = pp.querySelector(".thumb");
var sv = th.querySelector("svg");
var im = th.querySelector("img");
var zb = pp.querySelector(".zoom");
var hint = pp.querySelector(".hint");
var gal = pp.querySelector(".gal");
var NM = {d: "Impresión digital", s: "Serigrafía"}, SL = {d: "Digital", s: "Serigrafia"};
var ex = d.ex || {d: 0, s: 0};
var mode = "info";

/* Selectores */
var h = '<div class="fld"><b>Elige el tamaño</b><div class="pills" role="radiogroup" aria-label="Tamaño de la bolsa">';
d.s.forEach(function (s, j) {
  h += '<label><input type="radio" name="s" value="' + j + '"' + (j ? "" : " checked") + "><span>" + s[0] + "</span></label>";
});
h += '</div></div><div class="fld"><b>Elige el color</b><div class="cols" role="radiogroup" aria-label="Color de la bolsa">';
d.c.split(",").forEach(function (c, j) {
  h += '<label><input type="radio" name="c" value="' + c + '"' + (j ? "" : " checked") + '><span style="background:' + C[c][0] + '" title="' + c + '"></span></label>';
});
h += '</div></div><fieldset class="adds"><legend>Aditamento opcional</legend><label><input type="checkbox" class="vl"> Válvula desgasificadora <em>+' + money(V) + "</em></label></fieldset>";
if (d.z) h += '<small class="note" style="margin:-6px 0 12px">Zipper resellable incluido, ya instalado.</small>';
h += '<label class="sel">Impresión<select class="pr"><option>Genérica (sin impresión)</option><option>Serigrafía (se cotiza)</option><option>Impresión digital (se cotiza)</option></select></label>';
k.innerHTML = h;

/* Botones de vista: ficha del producto / tu bolsa */
var vw = document.createElement("div");
vw.className = "vw";
vw.setAttribute("role", "group");
vw.setAttribute("aria-label", "Vista de la imagen");
vw.innerHTML = '<button type="button" data-v="info" aria-pressed="true">Ficha del producto</button><button type="button" data-v="bag" aria-pressed="false">Tu bolsa</button>';
gal.appendChild(vw);
vw.addEventListener("click", function (e) {
  var b = e.target.closest("[data-v]");
  if (!b) return;
  mode = b.getAttribute("data-v");
  upd();
});

/* Visor de imágenes (ampliar y ejemplos con anterior / siguiente) */
var dlg = document.getElementById("zm");
var di = dlg.querySelector("img");
var prev = document.createElement("button");
var next = document.createElement("button");
var cap = document.createElement("p");
prev.type = next.type = "button";
prev.className = "nv prev"; next.className = "nv next"; cap.className = "cap";
prev.setAttribute("aria-label", "Ejemplo anterior"); next.setAttribute("aria-label", "Ejemplo siguiente");
prev.textContent = "‹"; next.textContent = "›";
dlg.appendChild(prev); dlg.appendChild(next); dlg.appendChild(cap);
var list = [], idx = 0, single = true, sx = null;
function showV(n) {
  idx = (n + list.length) % list.length;
  var e = list[idx];
  di.src = e.src; di.alt = e.alt; cap.textContent = e.cap;
}
function openV(items, start) {
  list = items;
  single = items.length < 2;
  dlg.classList.toggle("viewer", !single);
  prev.hidden = next.hidden = cap.hidden = single;
  showV(start);
  if (!dlg.open) dlg.showModal();
}
prev.addEventListener("click", function (e) { e.stopPropagation(); showV(idx - 1); });
next.addEventListener("click", function (e) { e.stopPropagation(); showV(idx + 1); });
dlg.addEventListener("click", function (e) {
  if (e.target === dlg || e.target.classList.contains("x") || (single && e.target === di)) dlg.close();
});
dlg.addEventListener("keydown", function (e) {
  if (single) return;
  if (e.key === "ArrowLeft") showV(idx - 1);
  if (e.key === "ArrowRight") showV(idx + 1);
});
dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, {passive: true});
dlg.addEventListener("touchend", function (e) {
  if (single || sx === null) return;
  var dx = e.changedTouches[0].clientX - sx;
  sx = null;
  if (Math.abs(dx) > 45) showV(idx + (dx < 0 ? 1 : -1));
}, {passive: true});
zb.addEventListener("click", function () {
  if (im.hidden || !im.getAttribute("src")) return;
  openV([{src: im.src, alt: im.alt, cap: ""}], 0);
});

/* Ejemplos de personalización: todos visibles; al tocar se abre el visor */
var all = [];
["d", "s"].forEach(function (t) {
  for (var i = 1; i <= ex[t]; i++) {
    all.push({t: t, i: i, src: "imag/" + d.f + "-Ejemplo-" + SL[t] + "-" + i + ".webp", alt: "Ejemplo de bolsa con " + NM[t].toLowerCase() + " " + i, cap: NM[t] + " · ejemplo " + i + " de " + ex[t]});
  }
});
if (all.length) {
  var box = document.createElement("div");
  box.className = "exs";
  var eh = '<p class="exh">Ejemplos de personalización <span>Toca uno para verlo grande</span></p>';
  ["d", "s"].forEach(function (t) {
    if (!ex[t]) return;
    eh += '<div class="exg"><p class="exk">' + (t === "d" ? "Impresión digital" : "Serigrafía · 1 o 2 tintas") + '</p><div class="thumbs">';
    all.forEach(function (e, n) {
      if (e.t !== t) return;
      eh += '<button type="button" class="tb" data-n="' + n + '" aria-label="Ver ejemplo de ' + NM[t].toLowerCase() + " " + e.i + '"><img src="' + e.src.replace(".webp", "_mini.webp") + '" alt="" width="160" height="200" loading="lazy" onerror="this.onerror=null;this.src=\'' + e.src + "'\"></button>";
    });
    eh += "</div></div>";
  });
  eh += '<p class="exn">Imágenes de referencia. El resultado final depende de tu diseño.</p>';
  box.innerHTML = eh;
  gal.appendChild(box);
  box.addEventListener("click", function (e) {
    var b = e.target.closest(".tb");
    if (b) openV(all, +b.getAttribute("data-n"));
  });
}

im.addEventListener("load", function () { im.hidden = false; sv.style.display = "none"; hint.hidden = false; });
im.addEventListener("error", function () {
  im.hidden = true; sv.style.display = ""; hint.hidden = true;
  if (mode === "info") {
    vw.querySelector('[data-v="info"]').hidden = true;
    mode = "bag";
    upd();
  }
});

function upd() {
  var s = d.s[+pp.querySelector('input[name="s"]:checked').value];
  var col = pp.querySelector('input[name="c"]:checked').value;
  var pr = pp.querySelector(".pr").value;
  var v = pp.querySelector(".vl").checked;
  var t = s[1] + (v ? V : 0);
  pp.querySelector(".pv").textContent = money(t);
  pp.querySelector(".pl2").textContent = v ? "Tu selección" : "Bolsa básica";
  pp.querySelector(".stx").textContent = s[0] + " · " + col + (v ? " · con válvula" : " · sin válvula");
  pp.querySelector("meta[itemprop=price]").setAttribute("content", t);
  pp.querySelector("meta[itemprop=color]").setAttribute("content", col);
  pp.querySelector("meta[itemprop=size]").setAttribute("content", s[0]);
  th.style.color = C[col][1];

  var src, alt;
  if (mode === "info") {
    src = "imag/" + d.f + "-Ficha.webp";
    alt = "Ficha del producto: " + d.n + ", características y colores disponibles";
  } else {
    src = "imag/" + d.f + "-" + CF[col] + (v ? "_valvula" : "") + ".webp";
    alt = d.n + " color " + col.toLowerCase() + (v ? " con válvula desgasificadora" : "");
  }
  zb.classList.toggle("info", mode === "info");
  vw.querySelectorAll("[data-v]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === mode ? "true" : "false"); });
  im.alt = alt;
  if (im.getAttribute("src") !== src) { im.hidden = true; sv.style.display = ""; hint.hidden = true; im.src = src; }

  pp.querySelector("[data-wa]").href = wa("Hola, quiero cotizar: " + d.n + " de " + s[0] + ", color " + col.toLowerCase() + (v ? ", con válvula" : ", sin válvula") + (d.z ? " (zipper incluido)" : "") + ". Impresión: " + pr.toLowerCase() + ". Precio de referencia de la bolsa genérica: " + money(t) + " COP por unidad desde 100 bolsas. ¿Me ayudan con la cotización?");
}

/* El tamaño no cambia la foto; el color y la válvula sí */
k.querySelectorAll('input[name="s"]').forEach(function (x) { x.addEventListener("change", upd); });
k.querySelectorAll('input[name="c"], .vl').forEach(function (x) {
  x.addEventListener("change", function () { mode = "bag"; upd(); });
});
k.querySelector(".pr").addEventListener("change", upd);
upd();
})();
