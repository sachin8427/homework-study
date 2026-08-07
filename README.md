# Homework Study

A GitHub Pages site for writing references and interactive study tools.

## Add a subject resource

Add one object to the `resources` list in `assets/catalog.js`:

```javascript
{
  title: "Page title",
  category: "math",
  url: "tools/math/path-to-page/",
  description: "A short explanation of the resource.",
  type: "Reference guide"
}
```

The matching subject page updates automatically. The home page links only to subjects, keeping individual resources organized one level below. Relative URLs work both in VS Code Live Server and on the GitHub Pages project site.

## Run basic tests

```powershell
node --test tests\sentence-workbench.test.js
```
