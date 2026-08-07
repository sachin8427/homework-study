"use strict";

const TECHNIQUES = [
  { id: "adj", num: 1, cat: "dressup", name: "Quality Adjective", remember: "Tells what kind or what a noun is like.", formula: "quality adjective + noun", bank: ["colorful", "tiny", "enormous", "shiny", "brave", "gentle", "friendly", "fluffy", "ancient", "delicious"], examples: ["The colorful bird sang.", "The tiny ant carried a leaf.", "We crossed the ancient bridge."], lookFor: "A specific word that helps the reader picture the noun." },
  { id: "verb", num: 2, cat: "dressup", name: "Strong Verb", remember: "Swaps a weak, ordinary verb for a precise action word.", formula: "subject + strong verb", bank: ["sprinted", "dashed", "whispered", "shouted", "pounced", "grabbed", "soared", "rescued", "wandered", "blasted"], examples: ["The lion pounced on its prey.", "Emma sprinted to school.", "The eagle soared above the mountains."], lookFor: "Weak verbs like went, got, said, made, or looked that could be replaced." },
  { id: "lyadv", num: 3, cat: "dressup", name: "-ly Adverb", remember: "Tells how an action happens.", formula: "verb + -ly adverb", bank: ["quickly", "carefully", "happily", "quietly", "proudly", "slowly", "gently", "eagerly", "softly", "bravely"], examples: ["She smiled happily.", "Dad drove carefully.", "The soldier fought bravely."], lookFor: "A word ending in -ly that answers ‘How did it happen?’" },
  { id: "because", num: 4, cat: "dressup", name: "Because Clause", remember: "Explains why something happened.", formula: "complete thought + because + reason", bank: ["because"], examples: ["We stayed inside because it rained.", "She smiled because she won.", "He wore a jacket because it was cold."], lookFor: "A clear reason that answers ‘Why?’" },
  { id: "whowhich", num: 5, cat: "dressup", name: "Who/Which Clause", remember: "Adds extra information about a noun—who for people, which for things or animals.", formula: "noun, who/which + extra info, + rest", bank: ["who", "which"], examples: ["Mia, who loves animals, adopted a puppy.", "The bicycle, which had a flat tire, leaned against the wall."], lookFor: "A person or thing that could use extra description." },
  { id: "asia", num: 6, cat: "dressup", name: "WWW.ASIA Clause", remember: "Starts with a subordinating word and cannot stand alone.", formula: "WWW.ASIA clause, complete thought", bank: ["when", "while", "where", "as", "since", "if", "although"], examples: ["When the bell rang, the students hurried outside.", "Since the trail was muddy, we walked carefully."], lookFor: "A dependent clause joined to a complete thought." },
  { id: "subject", num: 7, cat: "opener", name: "Subject Opener (S)", remember: "Starts directly with the person, place, animal, or thing doing the action.", formula: "subject + verb", bank: [], examples: ["The dog chased the ball.", "Our class visited the museum.", "Maya opened the mysterious box."], lookFor: "The sentence begins with its subject." },
  { id: "prep", num: 8, cat: "opener", name: "Prepositional Opener (P)", remember: "Starts with a phrase that tells where, when, or which direction.", formula: "prepositional phrase, + complete thought", bank: ["after", "before", "beneath", "beside", "during", "inside", "near", "over", "through", "under"], examples: ["After lunch, we played outside.", "Beneath the bridge, the water rushed past."], lookFor: "An opening phrase starting with a preposition, with a comma after it." },
  { id: "lyopen", num: 9, cat: "opener", name: "-ly Opener (LY)", remember: "Starts with an -ly adverb telling how the action happens.", formula: "-ly adverb, + complete thought", bank: ["carefully", "eagerly", "gently", "nervously", "proudly", "quickly", "quietly", "sadly", "slowly", "suddenly"], examples: ["Carefully, Ava carried the glass vase.", "Suddenly, thunder shook the house."], lookFor: "An -ly word at the start, followed by a comma." },
  { id: "ingopen", num: 10, cat: "opener", name: "-ing Opener (ING)", remember: "Starts with an -ing action; its doer must come right after the comma.", formula: "-ing phrase, + doer + verb", bank: ["running", "smiling", "carrying", "looking", "climbing", "hoping", "listening", "shivering"], examples: ["Running down the path, Liam chased the bus.", "Carrying a lantern, the guide entered the cave."], lookFor: "The noun after the comma must be doing the -ing action." },
  { id: "clopen", num: 11, cat: "opener", name: "Clausal Opener (CL)", remember: "Starts with a dependent clause telling when, why, where, or under what condition.", formula: "dependent clause, + complete thought", bank: ["when", "while", "where", "as", "since", "if", "although", "because"], examples: ["Because the road was icy, school opened late.", "If the rain stops, we will play outside."], lookFor: "A dependent clause, then a comma, then a complete thought." },
  { id: "vss", num: 12, cat: "opener", name: "Very Short Sentence (VSS)", remember: "A complete sentence of 2–5 words, used for emphasis.", formula: "2–5 words + end punctuation", bank: [], examples: ["Everyone froze.", "It was gone.", "What a surprise!"], lookFor: "A brief, complete thought used sparingly for punch." }
];

const STORAGE_KEY = "sentence-workbench-progress-v2";
const app = document.querySelector("#app");
const state = { screen: "home", feature: 0, filter: "all", card: 0, flipped: false, selected: "adj", result: null, text: "", progress: loadProgress() };

function defaultProgress() {
  return Object.fromEntries(TECHNIQUES.map((item) => [item.id, { known: false, practiced: 0, lastResult: null }]));
}

function loadProgress() {
  const fallback = defaultProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return fallback;
    for (const item of TECHNIQUES) fallback[item.id] = { ...fallback[item.id], ...(saved[item.id] || {}) };
  } catch (_) {}
  return fallback;
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch (_) {}
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

function chip(item) {
  return `<span class="chip ${item.cat}">${item.cat === "dressup" ? "Dress-Up" : "Opener"} ${item.num}</span>`;
}

function render() {
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.screen === state.screen));
  if (state.screen === "home") renderHome();
  if (state.screen === "flashcards") renderFlashcards();
  if (state.screen === "practice") renderPractice();
}

function renderHome() {
  const item = TECHNIQUES[state.feature];
  const known = Object.values(state.progress).filter((entry) => entry.known).length;
  app.innerHTML = `<section class="page">
    <div class="hero">
      <div class="hero-copy"><p class="eyebrow">12 tools on the bench</p><h1>Build stronger sentences</h1><p>Tap a tool, flip a card, or write your own.</p></div>
      <div class="feature-wrap"><article class="feature">
        <div class="feature-head">${chip(item)}<div class="dots">${TECHNIQUES.map((_, index) => `<span class="dot ${index === state.feature ? "active" : ""}"></span>`).join("")}</div></div>
        <h2>${item.name}</h2><blockquote>“${item.examples[0]}”</blockquote>
      </article></div>
    </div>
    <section class="panel progress-card"><div><p class="progress-title">${known} / 12 tools mastered</p><p class="muted">Keep flipping and writing to fill the bench.</p></div><div class="progress-ring">${known}</div></section>
    <div class="choice-grid">
      <button class="choice" type="button" data-go="flashcards"><strong>&#128214; Flashcards</strong><span>Flip through all 12 tools—formulas, word banks, and examples.</span></button>
      <button class="choice" type="button" data-go="practice"><strong>&#9997;&#65039; Practice Writing</strong><span>Pick a tool and write your own sentence with it.</span></button>
    </div>
  </section>`;
}

function filteredTechniques() {
  return TECHNIQUES.filter((item) => state.filter === "all" || item.cat === state.filter);
}

function renderFlashcards() {
  const list = filteredTechniques();
  const item = list[state.card] || list[0];
  const face = state.flipped ? `<h2>${item.name}</h2><p>${item.remember}</p>
    ${item.bank.length ? `<p class="label">Word bank</p><div class="word-bank">${item.bank.map((word) => `<span class="word ${item.cat}">${word}</span>`).join("")}</div>` : ""}
    <p class="label">Examples</p><ul class="examples">${item.examples.map((example) => `<li>“${example}”</li>`).join("")}</ul><p class="look-for">Look for: ${item.lookFor}</p>`
    : `${chip(item)}<h2>${item.name}</h2><p class="formula">${item.formula}</p><p class="tap-hint">Tap card to flip</p>`;
  app.innerHTML = `<section class="page">
    <div class="filters">${[["all", "All 12"], ["dressup", "Dress-Ups"], ["opener", "Openers"]].map(([value, label]) => `<button type="button" class="pill ${state.filter === value ? "active" : ""}" data-filter="${value}">${label}</button>`).join("")}</div>
    <p class="counter">${state.card + 1} of ${list.length}</p>
    <article class="flashcard ${state.flipped ? "flashcard-back" : ""} ${item.cat === "opener" ? "opener-border" : ""}" data-flip tabindex="0" role="button" aria-label="Flip ${item.name} flashcard">${face}</article>
    <div class="card-actions"><button class="round-button" type="button" data-card="-1" aria-label="Previous card">&#8249;</button>
      <div>${state.flipped ? `<button class="action review" type="button" data-known="false">&#8634; Review again</button> <button class="action known" type="button" data-known="true">&#10003; Got it</button>` : ""}</div>
      <button class="round-button" type="button" data-card="1" aria-label="Next card">&#8250;</button></div>
  </section>`;
}

function renderPractice() {
  const item = TECHNIQUES.find((entry) => entry.id === state.selected);
  app.innerHTML = `<section class="page">
    <div class="section-head"><h1>Pick a tool</h1><button class="surprise" type="button" data-random>&#10024; Surprise me</button></div>
    <div class="tool-picker">${TECHNIQUES.map((entry) => `<button type="button" class="tool-button ${entry.cat} ${entry.id === item.id ? "active" : ""}" data-tool="${entry.id}">${entry.num}. ${entry.name.split(" (")[0]}</button>`).join("")}</div>
    <section class="panel practice-card">${chip(item)}<h2>${item.name}</h2><p class="formula">${item.formula}</p><p>${item.remember}</p>
      ${item.bank.length ? `<div class="word-bank">${item.bank.map((word) => `<span class="word ${item.cat}">${word}</span>`).join("")}</div>` : ""}
      <label class="label" for="sentence">Your sentence</label><textarea id="sentence" rows="3" placeholder="Write your sentence here...">${escapeHtml(state.text)}</textarea>
      <button class="submit" type="button" data-check ${state.text.trim() ? "" : "disabled"}>Check my sentence</button>
      ${state.result ? `<div class="feedback ${state.result.mode === "self" ? "self" : state.result.ok ? "good" : "bad"}" role="status">${state.result.mode === "self" ? "✨" : state.result.ok ? "✓" : "✗"} ${state.result.message}</div>` : ""}
    </section>
  </section>`;
}

function checkSentence(id, raw) {
  const text = raw.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const first = (words[0] || "").replace(/[^a-z']/gi, "").toLowerCase();
  const punctuated = /[.!?]$/.test(text);
  const auto = (ok, success, failure) => ({ mode: "auto", ok, message: ok ? success : failure });
  if (!text) return auto(false, "", "Write a sentence first.");
  if (id === "because") return auto(/\bbecause\b/i.test(text) && punctuated, "Found ‘because’—nice reason clause!", !/\bbecause\b/i.test(text) ? "Add ‘because’ to explain why." : "Add end punctuation.");
  if (id === "whowhich") return auto(/,\s*(who|which)\b/i.test(text) && punctuated, "Comma + who/which—that's the pattern!", "Use a comma followed by who or which, and finish with punctuation.");
  if (["asia", "clopen", "prep"].includes(id)) {
    const item = TECHNIQUES.find((entry) => entry.id === id);
    const ok = item.bank.includes(first) && text.includes(",");
    return auto(ok, "The opener and comma are in place!", `Start with one of the suggested opener words, then add a comma.`);
  }
  if (id === "lyopen") return auto(first.endsWith("ly") && text.includes(","), "Starts with an -ly word and a comma!", "Start with an -ly word followed by a comma.");
  if (id === "ingopen") return auto(first.endsWith("ing") && text.includes(","), "Nice -ing opener! Check that its doer follows the comma.", "Start with an -ing phrase followed by a comma.");
  if (id === "vss") return auto(words.length >= 2 && words.length <= 5 && punctuated, "Short and punchy—that's a VSS.", "Use 2–5 words and end punctuation.");
  if (id === "lyadv") return { mode: "self", ok: null, message: words.some((word) => word.replace(/[^a-z]/gi, "").toLowerCase().endsWith("ly")) ? "I spotted an -ly word. You be the judge!" : "Try adding an -ly word." };
  if (["adj", "verb"].includes(id)) {
    const item = TECHNIQUES.find((entry) => entry.id === id);
    const found = item.bank.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
    return { mode: "self", ok: null, message: found ? `I spotted a word from the bank. Great choice!` : `Your own word works, or try “${item.bank[Math.floor(Math.random() * item.bank.length)]}.”` };
  }
  return { mode: "self", ok: null, message: id === "subject" ? "Does it begin directly with the subject?" : "Read it back and compare it with the formula." };
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button, [data-flip]");
  if (!button) return;
  if (button.dataset.screen || button.dataset.go) { state.screen = button.dataset.screen || button.dataset.go; render(); return; }
  if (button.dataset.filter) { state.filter = button.dataset.filter; state.card = 0; state.flipped = false; render(); return; }
  if (button.hasAttribute("data-flip")) { state.flipped = !state.flipped; render(); return; }
  if (button.dataset.card) { const list = filteredTechniques(); state.card = (state.card + Number(button.dataset.card) + list.length) % list.length; state.flipped = false; render(); return; }
  if (button.dataset.known) { const item = filteredTechniques()[state.card]; state.progress[item.id].known = button.dataset.known === "true"; saveProgress(); state.card = (state.card + 1) % filteredTechniques().length; state.flipped = false; render(); return; }
  if (button.dataset.tool) { state.selected = button.dataset.tool; state.text = ""; state.result = null; render(); return; }
  if (button.hasAttribute("data-random")) { state.selected = TECHNIQUES[Math.floor(Math.random() * TECHNIQUES.length)].id; state.text = ""; state.result = null; render(); return; }
  if (button.hasAttribute("data-check")) { state.result = checkSentence(state.selected, state.text); const progress = state.progress[state.selected]; progress.practiced += 1; if (state.result.mode === "auto" && state.result.ok) progress.known = true; progress.lastResult = state.result.ok; saveProgress(); render(); }
});

document.addEventListener("input", (event) => {
  if (event.target.id !== "sentence") return;
  state.text = event.target.value;
  state.result = null;
  const submit = document.querySelector("[data-check]");
  if (submit) submit.disabled = !state.text.trim();
});

document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.hasAttribute("data-flip")) { event.preventDefault(); state.flipped = !state.flipped; render(); }
});

setInterval(() => { if (state.screen === "home") { state.feature = (state.feature + 1) % TECHNIQUES.length; renderHome(); } }, 3200);
render();
