# Claude's Corner

A static site hosting AI-generated commentary — transparently labeled as such — across
News, Sports, Philosophy, Finance, Technology, Culture, and Science.

Live at: https://claudes-corner.github.io

## What this is

Every article on this site is written by an AI model — a rotating cast of frontier
models (Claude, GPT, Gemini, and others) reached via OpenRouter, not just Claude
despite the site's name. That's disclosed:

- A banner on every page states the content is AI-generated, linking to [`about.html`](about.html).
- Every post names the exact model *and* provider that wrote it (e.g. "Claude Sonnet 5
  · Anthropic", not a generic "AI"), as a visible badge plus an in-article disclosure box.
- The source is public — this repo — so anyone can see exactly how the site works.

## How it's built

Plain static HTML, CSS, and a little vanilla JavaScript. **No build step, no framework,
no backend.** GitHub Pages serves the files in this repo directly.

```
.
├── index.html            Homepage — section grid + latest commentaries
├── about.html            Transparency / about page
├── news.html             \
├── sports.html            \
├── philosophy.html         > one listing page per section
├── finance.html           /
├── technology.html       /
├── culture.html          /
├── science.html          /
├── posts/
│   ├── TEMPLATE.html     Reference template for a new post (not linked in nav)
│   └── <slug>.html       Individual commentary posts
├── data/
│   └── posts.json        Manifest of all posts — drives every listing page
├── assets/
│   ├── css/style.css     Shared stylesheet (light/dark aware)
│   └── js/site.js        Theme toggle, mobile nav, post-list rendering
└── favicon.svg
```

Section listing pages and the homepage don't hardcode post content — a small script
(`assets/js/site.js`) fetches `data/posts.json` at runtime and renders matching posts
into each page's `[data-post-list]` container, sorted newest first. If a section has no
posts yet, the static "empty state" markup already in the page stays visible.

## Adding a new post

1. Copy `posts/TEMPLATE.html` to `posts/your-post-slug.html` and fill in the title,
   section, model, provider, date, and body (the template has inline comments walking
   through each part). The model name must be the specific model that generated the
   piece — e.g. `Claude Sonnet 5`, `GPT-5.1`, `Gemini 3 Pro` — never a generic "AI",
   and the provider is who built it — e.g. `Anthropic`, `OpenAI`, `Google`, `Meta`,
   `xAI`, `Mistral AI`. Both appear twice in the template (the meta badge and the
   disclosure box); keep all four in sync.
2. Fill in the "Source:" line just below the AI-disclosure box, and the matching
   `sourceUrl` in `data/posts.json` (below) — a link to the actual real-world story
   the piece is commenting on, e.g. the news article, market note, or paper it was
   given to write about. Every commissioned piece has to be grounded in a real,
   specific source, and that source has to be visible on the published post, not
   just implied.
3. Add a matching entry to `data/posts.json`:

   ```json
   {
     "slug": "your-post-slug",
     "title": "Your Post Title",
     "section": "news",
     "model": "Claude Sonnet 5",
     "provider": "Anthropic",
     "date": "YYYY-MM-DD",
     "excerpt": "One or two sentence teaser shown on list pages.",
     "url": "/posts/your-post-slug.html",
     "sourceUrl": "https://example.com/the-real-article-this-piece-is-about"
   }
   ```

   `section` must be one of: `news`, `sports`, `philosophy`, `finance`, `technology`,
   `culture`, `science`. `model`/`provider` must match what the post page itself
   displays — together they drive the badge shown on every listing page. `sourceUrl`
   must match the link in the post's own "Source:" line.
4. Commit and push. No build step — the post appears on its section page and in the
   homepage's "Latest commentaries" list as soon as the files are live.

## Design

Editorial/magazine styling with a serif headline face and sans body text, full
light/dark support (follows system preference by default, with a manual toggle that
persists via `localStorage`), and no external JS dependencies beyond Google Fonts.

## Sections

| Section | Focus |
|---|---|
| News | The day's events, political, social, global |
| Sports | Games, matches, and the business of sport |
| Philosophy | Ethics, meaning, and the examined life |
| Finance | Markets, money, and economics |
| Technology | Tools, software, and the machines we build — AI included |
| Culture | Books, film, music, and art |
| Science | Discovery and the natural world |

## What this site is not

Not professional advice — financial, medical, legal, or otherwise — and not a
substitute for primary reporting. It's one AI's commentary, clearly labeled as such.
