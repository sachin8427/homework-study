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

test("history pages are standalone and registered under Social Science", () => {
  const catalog = fs.readFileSync(path.join(projectRoot, "assets", "catalog.js"), "utf8");
  const pages = [
    ["us-history-grade-5", "tools/social-science/us-history-grade-5/"],
    ["eastern-hemisphere-grade-6", "tools/social-science/eastern-hemisphere-grade-6/"]
  ];

  for (const [folder, catalogUrl] of pages) {
    const html = fs.readFileSync(path.join(projectRoot, "tools", "social-science", folder, "index.html"), "utf8");
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    assert.match(html, /href="\.\.\/\.\.\/\.\.\/subjects\/social-science\/"/);
    assert.doesNotMatch(html, /https?:\/\//);
    assert.match(catalog, new RegExp(catalogUrl.replaceAll("/", "\\/")));
    assert.equal(scripts.length, 1);
    assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
  }
});
