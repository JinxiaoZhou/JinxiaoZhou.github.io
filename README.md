# Jinxiao (Johnny) Zhou — Portfolio

A hand-built, dependency-free portfolio site. Bilingual (English primary, 中文 switchable), light/dark themes, and ready to publish on GitHub Pages.

## Structure

```
portfolio/
├── index.html                  # All content (English is baked in for SEO)
├── assets/
│   ├── css/style.css           # Design tokens + components
│   ├── js/i18n.js              # Chinese translation dictionary
│   ├── js/main.js              # Language, theme, nav, scroll behaviour
│   └── Jinxiao-Zhou-Resume.pdf # ← put your résumé PDF here
├── .nojekyll                   # Tells GitHub Pages to serve files as-is
└── README.md
```

## Run locally

Just open `index.html` in a browser. For a closer match to production, serve it:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

## Deploy to GitHub Pages

### Option A — User site (`https://<username>.github.io`)

```bash
cd portfolio
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root`** → Save.
The site goes live at `https://<username>.github.io`.

### Option B — Project site (`https://<username>.github.io/<repo>`)

Push the same files to any repo (e.g. `portfolio`), then point Pages at `main` / `root`.
The site goes live at `https://<username>.github.io/portfolio/`.

All asset paths are relative, so both options work without changes.

### Option C — Custom domain

Add a file named `CNAME` (no extension) containing your bare domain, then configure the DNS records GitHub documents for Pages.

## Before you publish

- [ ] Drop your résumé PDF at `assets/Jinxiao-Zhou-Resume.pdf`. If the file is missing, the "Download résumé" button hides itself automatically — no broken link either way.
- [ ] Review whether you want your e-mail address publicly visible. Phone number is intentionally **not** on the page.
- [ ] Pick the deployed URL and paste it into your LinkedIn profile and résumé header.
- [ ] Optional: add `og:image` in `index.html` (a 1200×630 preview image) so link previews look sharp.

## Editing content

Text lives in two places:

1. **English** — directly in `index.html`. Each translatable element carries a `data-i18n="key"` attribute.
2. **Chinese** — in the `zh` object inside `assets/js/i18n.js`, keyed to match.

To add a new translated line: add the English text to the markup with a `data-i18n="section.key"` attribute, then add the matching Chinese entry to `i18n.js`. Any key without a Chinese translation simply falls back to English.

Attribute variants:

| Attribute | Use for |
|---|---|
| `data-i18n` | Plain text content |
| `data-i18n-html` | Content containing inline markup (e.g. the hero name) |
| `data-i18n-aria` | `aria-label` values |

## Design system

| Token group | Values |
|---|---|
| Type scale | 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 px, fluid hero `clamp(2.25rem, 7vw, 3.75rem)` |
| Line height | 1.15 headings · 1.68 body |
| Spacing | 8px baseline grid (`--sp-1` … `--sp-10`) |
| Breakpoints | 320 base → 576 → 768 → 992 → 1200 |
| Motion | 150 / 220 / 300 ms, `cubic-bezier(.2,.7,.3,1)`, transforms & opacity only |

Accessibility: semantic landmarks, skip link, visible focus rings, `aria-pressed` on the language control, `prefers-reduced-motion` support, and body text contrast above WCAG 2.2 AA in both themes.
