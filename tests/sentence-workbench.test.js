"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const toolRoot = path.join(projectRoot, "tools", "sentence-workbench");

function loadWorkbenchCore() {
  const source = fs.readFileSync(path.join(toolRoot, "app.js"), "utf8");
  const appElement = { innerHTML: "" };
  const context = {
    document: {
      querySelector: () => appElement,
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    setInterval: () => 0,
    console
  };

  vm.runInNewContext(
    `${source}\n;globalThis.workbenchTestApi = { TECHNIQUES, checkSentence, defaultProgress };`,
    context,
    { filename: "app.js" }
  );
  return context.workbenchTestApi;
}

test("workbench defines all 12 techniques and their progress records", () => {
  const { TECHNIQUES, defaultProgress } = loadWorkbenchCore();
  assert.equal(TECHNIQUES.length, 12);
  assert.equal(Object.keys(defaultProgress()).length, 12);
});

test("basic automatic sentence checks accept and reject representative input", () => {
  const { checkSentence } = loadWorkbenchCore();
  assert.equal(checkSentence("because", "We stayed in because it rained.").ok, true);
  assert.equal(checkSentence("because", "We stayed inside.").ok, false);
  assert.equal(checkSentence("vss", "Everyone froze.").ok, true);
  assert.equal(checkSentence("vss", "This sentence contains far too many words today.").ok, false);
});

test("standalone page uses its local stylesheet and script without CDN dependencies", () => {
  const html = fs.readFileSync(path.join(toolRoot, "index.html"), "utf8");
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="app\.js"/);
  assert.doesNotMatch(html, /https?:\/\//);
});

test("algebra lab is standalone and linked from the home catalog", () => {
  const algebraPath = path.join(projectRoot, "tools", "math", "algebra-bar-models", "index.html");
  const algebra = fs.readFileSync(algebraPath, "utf8");
  const homeCatalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const scripts = [...algebra.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.match(algebra, /href="\.\.\/\.\.\/\.\.\/subjects\/math\/"/);
  assert.doesNotMatch(algebra, /https?:\/\//);
  assert.match(homeCatalog, /tools\/math\/algebra-bar-models\//);
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});

test("equation solver is standalone and registered under Math", () => {
  const page = fs.readFileSync(path.join(projectRoot, "tools", "math", "equation-solver-lab", "index.html"), "utf8");
  const catalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.match(page, /href="\.\.\/\.\.\/\.\.\/subjects\/math\/"/);
  assert.doesNotMatch(page, /https?:\/\//);
  assert.match(catalog, /tools\/math\/equation-solver-lab\//);
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});

test("Grade 6 multi-variable expressions is linked under Math", () => {
  const page = fs.readFileSync(path.join(projectRoot, "tools", "math", "multi-variable-expressions-grade-6", "index.html"), "utf8");
  const catalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.match(page, /href="\.\.\/\.\.\/\.\.\/subjects\/math\/"/);
  assert.match(catalog, /tools\/math\/multi-variable-expressions-grade-6\//);
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});

test("claim, evidence, and reasoning lab is linked under Science", () => {
  const page = fs.readFileSync(path.join(projectRoot, "tools", "science", "claim-evidence-reasoning-lab", "index.html"), "utf8");
  const catalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.match(page, /href="\.\.\/\.\.\/\.\.\/subjects\/science\/"/);
  assert.match(catalog, /tools\/science\/claim-evidence-reasoning-lab\//);
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});

test("history pages and the Grade 6 hub are registered under Social Science", () => {
  const catalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const grade5 = fs.readFileSync(path.join(projectRoot, "tools", "social-science", "us-history-grade-5", "index.html"), "utf8");
  const grade6Root = path.join(projectRoot, "tools", "social-science", "eastern-hemisphere-grade-6");
  const hub = fs.readFileSync(path.join(grade6Root, "index.html"), "utf8");

  assert.match(grade5, /href="\.\.\/\.\.\/\.\.\/subjects\/social-science\/"/);
  assert.match(catalog, /tools\/social-science\/us-history-grade-5\//);
  assert.match(catalog, /tools\/social-science\/eastern-hemisphere-grade-6\//);
  assert.match(hub, /href="eastern-hemisphere\/"/);
  assert.match(hub, /href="archaeology-early-humans\/"/);

  for (const folder of ["eastern-hemisphere", "archaeology-early-humans"]) {
    const html = fs.readFileSync(path.join(grade6Root, folder, "index.html"), "utf8");
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    assert.match(html, /href="\.\.\/\.\.\/\.\.\/\.\.\/subjects\/social-science\/"/);
    assert.match(html, /href="\.\.\/">Grade 6 History &amp; Eastern Hemisphere<\/a>/);
    assert.equal(scripts.length, 1);
    assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
  }
});
