"use strict";

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

const catalog = window.STUDY_CATALOG;
const categoryId = document.body.dataset.category;
const category = catalog.categories.find((item) => item.id === categoryId);
const resources = catalog.resources.filter((item) => item.category === categoryId);
const content = document.querySelector("#category-content");

if (!category) {
  content.innerHTML = "<h1>Subject not found</h1>";
} else {
  document.title = `${category.title} | Homework Study`;
  content.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../">Home</a><span aria-hidden="true">/</span><span>${escapeHtml(category.title)}</span></nav>
    <section class="intro"><p class="eyebrow">${escapeHtml(category.marker)} · Subject</p><h1>${escapeHtml(category.title)}</h1><p>${escapeHtml(category.description)}</p></section>
    <section aria-labelledby="resources-title"><h2 id="resources-title" class="section-title">Resources</h2>
      ${resources.length ? `<div class="resource-grid">${resources.map((resource) => `
        <a class="resource-card" href="../../${escapeHtml(resource.url)}"><span class="resource-category">${escapeHtml(resource.type)}</span><strong>${escapeHtml(resource.title)}</strong><span class="resource-description">${escapeHtml(resource.description)}</span></a>
      `).join("")}</div>` : `<div class="empty-state"><strong>Resources coming soon.</strong><span>This subject is ready for future homework and study pages.</span></div>`}
    </section>`;
}
