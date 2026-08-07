"use strict";

// Single source of truth for subjects and resources.
window.STUDY_CATALOG = {
  categories: [
    { id: "language", title: "Language", description: "Grammar, vocabulary, and language skills.", marker: "LA" },
    { id: "math", title: "Math", description: "Concept guides, models, and problem-solving practice.", marker: "MA" },
    { id: "science", title: "Science", description: "Scientific ideas, investigations, and review.", marker: "SC" },
    { id: "social-science", title: "Social Science", description: "History, geography, civics, and society.", marker: "SS" },
    { id: "latin", title: "Latin", description: "Vocabulary, grammar, translation, and review.", marker: "LT" },
    { id: "reading", title: "Reading", description: "Comprehension, interpretation, and reading practice.", marker: "RE" },
    { id: "writing", title: "Writing", description: "References and practice for clear, strong writing.", marker: "WR" }
  ],
  resources: [
    { title: "Bar Model Algebra Lab", category: "math", url: "tools/math/algebra-bar-models/", description: "Learn five algebra bar-model patterns and practice writing expressions.", type: "Interactive practice" },
    { title: "Sentence Workbench", category: "writing", url: "tools/sentence-workbench/", description: "Practice sentence dress-ups and openers with flashcards and writing exercises.", type: "Interactive practice" },
    { title: "Dress-Ups & Sentence Openers", category: "writing", url: "dress-ups-reference.html", description: "Use a concise reference for stronger, clearer, and more interesting writing.", type: "Reference guide" }
  ]
};
