# Portfolio

A static portfolio site — no build step, no dependencies. Open `index.html`
in a browser, or serve the folder:

```
python -m http.server 8000
```

## Structure

```
index.html          the index of work (masthead, tabs, project + publication lists)
style.css           the whole design system — palette, type scale, layout
script.js           tab switching, scroll reveal, theme toggle, scroll progress
<Project Name>/
  index.html        the case study
  project.css       page-specific styles, layered on ../style.css
  *.png|jpg|gif     figures for that case study only
```

Every case study loads `../style.css` first, then its own `project.css`.
Shared design decisions belong in `style.css`; only page-specific layout
belongs in a `project.css`.

Type is Fraunces throughout, loaded from Google Fonts, with a Georgia
fallback stack so the page stays readable offline.

## Source code

The case studies are write-ups. The code they describe lives in its own
repository, linked from each project page under "View source on GitHub".
