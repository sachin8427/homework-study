"use strict";

// Add future resources to this list. The home-page grid adjusts automatically.
const RESOURCES = [
  {
    title: "Sentence Workbench",
    url: "tools/sentence-workbench/",
    description: "Practice sentence dress-ups and openers with flashcards and writing exercises.",
    icon: "🔧",
    category: "Interactive practice"
  },
  {
    title: "Dress-Ups & Sentence Openers",
    url: "dress-ups-reference.html",
    description: "Use a concise reference for stronger, clearer, and more interesting writing.",
    icon: "📖",
    category: "Reference guide"
  },
  {
    title: "Bar Model Algebra Lab",
    url: "tools/sentence-workbench/algebra-bar-models.html",
    description: "Learn five algebra bar-model patterns and practice writing expressions.",
    icon: "🧮",
    category: "Interactive practice"
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function renderResources(resources, target) {
  target.innerHTML = resources.map((resource) => `
    <a class="resource-card" href="${escapeHtml(resource.url)}">
      ${resource.icon ? `<span class="resource-icon" aria-hidden="true">${escapeHtml(resource.icon)}</span>` : ""}
      ${resource.category ? `<span class="resource-category">${escapeHtml(resource.category)}</span>` : ""}
      <strong>${escapeHtml(resource.title)}</strong>
      ${resource.description ? `<span class="resource-description">${escapeHtml(resource.description)}</span>` : ""}
    </a>
  `).join("");
}

renderResources(RESOURCES, document.querySelector("#resource-grid"));
