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
    { title: "Equation Solver Lab", category: "math", url: "tools/math/equation-solver-lab/", description: "Learn and practice solving one-step and two-step algebra equations.", type: "Interactive practice" },
    { title: "The Scientific Method Study Lab", category: "science", url: "tools/science/scientific-method-study-lab/", description: "Study scientific procedures, hypothesis writing, observations, and experiments.", type: "Study guide and practice" },
    { title: "Sentence Workbench", category: "writing", url: "tools/sentence-workbench/", description: "Practice sentence dress-ups and openers with flashcards and writing exercises.", type: "Interactive practice" },
    { title: "Prepositional Phrases Lab", category: "writing", url: "tools/writing/prepositional-phrases-lab/", description: "Find prepositional phrases and their objects, then identify each sentence's subject and verb.", type: "Study guide and practice" },
    { title: "Dress-Ups & Sentence Openers", category: "writing", url: "dress-ups-reference.html", description: "Use a concise reference for stronger, clearer, and more interesting writing.", type: "Reference guide" },
    { title: "Grade 5 U.S. History: 1763 to 1900s", category: "social-science", url: "tools/social-science/us-history-grade-5/", description: "Review key events from colonial resistance through westward expansion and industrial growth.", type: "Study guide and quiz" },
    { title: "Grade 6 History & Eastern Hemisphere", category: "social-science", url: "tools/social-science/eastern-hemisphere-grade-6/", description: "Explore Grade 6 history through Eastern Hemisphere geography, archaeology, early humans, and interactive review.", type: "Grade 6 resources" }
  ]
};
