# Pictoria Kids — Website

Marketing landing page for [Pictoria Kids](https://github.com/diwesh87/pictoria-kids), a progressive-reveal guessing game for kids ages 4–8.

Static site, no build step:

- `index.html` — one-page landing site (hero, how it works, worlds, features, screenshot gallery, for parents, footer)
- `privacy.html` — hosted privacy policy
- `style.css` — design system, light/dark theme via CSS custom properties, matches the app's brand colors
- `script.js` — theme toggle, scroll reveal animations, interactive progressive-reveal demo
- `assets/` — icon, favicon, and app screenshots

## Local preview

```bash
python -m http.server 6262
```

Then open `http://localhost:6262`.

## Deploy

Designed to be served as-is from GitHub Pages (Settings → Pages → deploy from `main` branch, root).
