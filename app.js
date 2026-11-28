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
var ex = d.ex || {d: 0, s: 0};
var NM = {d: "Impresión digital", s: "Serigrafía"}, SL = {d: "Digital", s: "Serigrafia"};
var cur = null, tab = "d", tabs, thumbs, plain, tag;
function clearEx() {
  if (!cur) return;
  cur = null;
  if (tag) tag.hidden = true;
  if (plain) plain.hidden = true;
  zb.classList.remove("big");
  if (thumbs) thumbs.querySelectorAll(".tb").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
}
function renderThumbs() {
  var h = "";
  for (var i = 1; i <= ex[tab]; i++) {
    h += '<button type="button" class="tb" data-i="' + i + '" aria-pressed="' + (cur && cur.t === tab && cur.i === i ? "true" : "false") + '" aria-label="Ver ejemplo de ' + NM[tab].toLowerCase() + " " + i + '"><img src="imag/' + d.f + "-Ejemplo-" + SL[tab] + "-" + i + '.webp" alt="" width="64" height="80" loading="lazy"></button>';
  }
  thumbs.innerHTML = h;
}
function setTab(t) {
  if (!ex[t] || !tabs) return;
  tab = t;
  tabs.querySelectorAll("[data-t]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-t") === t ? "true" : "false"); });
  renderThumbs();
}
function showEx(t, i) {
  cur = {t: t, i: i};
  im.hidden = true; hint.hidden = true;
  im.alt = "Ejemplo de bolsa con " + NM[t].toLowerCase() + " " + i;
  im.src = "imag/" + d.f + "-Ejemplo-" + SL[t] + "-" + i + ".webp";
  tag.textContent = NM[t];
  tag.hidden = false; plain.hidden = false;
  zb.classList.add("big");
  renderThumbs();
  upd();
}
if (ex.d || ex.s) {
  var box = document.createElement("div");
  box.className = "exs";
  var kinds = ["d", "s"].filter(function (t) { return ex[t]; });
  var bh = '<div class="exr"><span class="exl">Ejemplos:</span><div class="tabs" role="tablist">';
  kinds.forEach(function (t) { bh += '<button type="button" role="tab" data-t="' + t + '" aria-selected="false">' + NM[t] + "</button>"; });
  bh += '</div><button type="button" class="plain" hidden>← Bolsa lisa</button></div><div class="thumbs"></div><p class="exn">Imágenes de referencia. El resultado final depende de tu diseño.</p>';
  box.innerHTML = bh;
  gal.appendChild(box);
  tabs = box.querySelector(".tabs"); thumbs = box.querySelector(".thumbs"); plain = box.querySelector(".plain");
  tag = document.createElement("span"); tag.className = "extag"; tag.hidden = true; zb.appendChild(tag);
  tabs.addEventListener("click", function (e) { var b = e.target.closest("[data-t]"); if (b) setTab(b.getAttribute("data-t")); });
  thumbs.addEventListener("click", function (e) { var b = e.target.closest(".tb"); if (b) showEx(tab, +b.getAttribute("data-i")); });
  plain.addEventListener("click", function () { clearEx(); upd(); });
  setTab(kinds[0]);
}


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

im.addEventListener("load", function () { im.hidden = false; sv.style.display = "none"; hint.hidden = false; });
im.addEventListener("error", function () { im.hidden = true; sv.style.display = ""; hint.hidden = true; });

var dlg = document.getElementById("zm");
var di = dlg.querySelector("img");
zb.addEventListener("click", function () {
  if (im.hidden || !im.getAttribute("src")) return;
  di.src = im.src;
  di.alt = im.alt;
  dlg.showModal();
});
dlg.addEventListener("click", function () { dlg.close(); });

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
  if (!cur) {
    var src = "imag/" + d.f + "-" + CF[col] + (v ? "_valvula" : "") + ".webp";
    im.alt = d.n + " color " + col.toLowerCase() + (v ? " con válvula desgasificadora" : "");
    if (im.getAttribute("src") !== src) { im.hidden = true; sv.style.display = ""; hint.hidden = true; im.src = src; }
  }
  pp.querySelector("[data-wa]").href = wa("Hola, quiero cotizar: " + d.n + " de " + s[0] + ", color " + col.toLowerCase() + (v ? ", con válvula" : ", sin válvula") + (d.z ? " (zipper incluido)" : "") + ". Impresión: " + pr.toLowerCase() + ". Precio de referencia de la bolsa genérica: " + money(t) + " COP por unidad desde 100 bolsas." + (cur ? " Me gustó el ejemplo " + cur.i + " de " + NM[cur.t].toLowerCase() + "." : "") + " ¿Me ayudan con la cotización?");
}
k.querySelectorAll("input").forEach(function (x) { x.addEventListener("change", function () { clearEx(); upd(); }); });
k.querySelector(".pr").addEventListener("change", function () { var i = this.selectedIndex; if (i === 1) setTab("s"); if (i === 2) setTab("d"); upd(); });
upd();
})();
