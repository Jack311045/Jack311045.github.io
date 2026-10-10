# Career portfolio

A standalone Eleventy site styled after the supplied VS Code reference. It has no backend. The tab bar is an accessible, same-page tab interface; the lower panel is decorative and never runs commands.

## Preview and build

```sh
npm ci
npm run preview
npm run build
```

The build writes static files to `_site/`. Deploy this folder to the root of the `Jack311045/Jack311045.github.io` GitHub Pages repository. The included Pages workflow builds and deploys when pushed to that repository's `main` branch.

## Update content

- Edit `src/_data/profile.json` for the short introduction and public contact links.
- Edit `src/_data/projects.json` for project summaries, contributions, technologies, verified results, and links. Keep ChessLens, Sustentra, and Recipe Discovery as the first three entries.
- Edit `src/_data/experience.json` for titles, dates, contributions, and verified results. Keep Sustentra, GigaCloud, and CITIC Securities as the first three entries.
- Edit `src/_data/skills.json` to add actual skills and coursework; label each course `Completed` or `In progress`.
- Add the approved PDF under `src/assets/resume/`, then set its site-relative path in `src/_data/resume.json`. The preview, open, and download links all point to this same file.

Do not publish contact details or resume claims until they are confirmed. Empty fields are intentionally omitted or shown as clearly marked placeholders.

To reorder additional entries, change their numeric `order`. The first three positions are checked at build time.

## Deploy

The workflow at `.github/workflows/pages.yml` assumes this folder's contents are at the root of the `Jack311045/Jack311045.github.io` repository. In the repository settings, enable GitHub Pages with **GitHub Actions** as the source. After a successful push, check the **Actions** tab and open the Pages URL shown in the deployment job.
