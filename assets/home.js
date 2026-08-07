"use strict";

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

const catalog = window.STUDY_CATALOG;

document.querySelector("#category-grid").innerHTML = catalog.categories.map((category) => `
  <a class="resource-card category-card" href="subjects/${escapeHtml(category.id)}/">
    <span class="category-marker" aria-hidden="true">${escapeHtml(category.marker)}</span>
    <strong>${escapeHtml(category.title)}</strong>
    <span class="resource-description">${escapeHtml(category.description)}</span>
  </a>
`).join("");
