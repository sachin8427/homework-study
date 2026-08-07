"use strict";

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

const catalog = window.STUDY_CATALOG;
const categoryMap = new Map(catalog.categories.map((category) => [category.id, category]));

document.querySelector("#category-grid").innerHTML = catalog.categories.map((category) => `
  <a class="resource-card category-card" href="subjects/${escapeHtml(category.id)}/">
    <span class="category-marker" aria-hidden="true">${escapeHtml(category.marker)}</span>
    <strong>${escapeHtml(category.title)}</strong>
    <span class="resource-description">${escapeHtml(category.description)}</span>
  </a>
`).join("");

document.querySelector("#featured-grid").innerHTML = catalog.resources.filter((resource) => resource.featured).map((resource) => `
  <a class="resource-card" href="${escapeHtml(resource.url)}">
    <span class="resource-category">${escapeHtml(categoryMap.get(resource.category)?.title || resource.type)}</span>
    <strong>${escapeHtml(resource.title)}</strong>
    <span class="resource-description">${escapeHtml(resource.description)}</span>
  </a>
`).join("");
