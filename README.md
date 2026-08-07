# Homework Study

A GitHub Pages site for writing references and interactive study tools.

## Add a page to the home page

Add one object to the `RESOURCES` list in `assets/home.js`:

```javascript
{
  title: "Page title",
  url: "path-to-page/",
  description: "A short explanation of the resource.",
  icon: "📝",
  category: "Reference guide"
}
```

The home-page grid adapts automatically to the number of entries. Relative URLs work both in VS Code Live Server and on the GitHub Pages project site.

## Run basic tests

```powershell
node --test tests\sentence-workbench.test.js
```
