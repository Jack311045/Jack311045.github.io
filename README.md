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

- Edit `src/_data/profile.json` for the 70–110 word introduction, verified education, and approved public contact links.
- Edit `src/_data/projects.json` for project summaries, contributions, technologies, verified results, and links. Keep ChessLens, Sustentra, and Recipe Discovery as the first three entries.
- Edit `src/_data/experience.json` for titles, dates, contributions, and verified results. Keep Sustentra, GigaCloud, and CITIC Securities as the first three entries.
- Edit `src/_data/skills.json` to add verified skills and coursework; label each course `Completed` or `In progress` and group it as `technical` or `additional`.
- The approved public resume is authored in `tools/public-resume.html`. To regenerate it on Windows, update that HTML, then print it to PDF with Chrome:

  ```powershell
  $root = (Get-Location).Path
  $source = [System.Uri](Join-Path $root "tools\public-resume.html")
  $target = Join-Path $root "src\assets\resume\jiaan-guo-resume-public.pdf"
  & "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-first-run --no-default-browser-check "--print-to-pdf=$target" $source.AbsoluteUri
  ```

  If Chrome is installed elsewhere, replace its executable path. The preview, open, and download links all use the path in `src/_data/resume.json`.
- Publish only confirmed facts and explicitly approved public details. Never add private source records, sensitive identifiers, or unreviewed original resume files to this repository.

To reorder additional entries, change their numeric `order`. The first three positions are checked at build time.

## Deploy

The workflow at `.github/workflows/pages.yml` assumes this folder's contents are at the root of the `Jack311045/Jack311045.github.io` repository. In the repository settings, enable GitHub Pages with **GitHub Actions** as the source. After a successful push, check the **Actions** tab and open the Pages URL shown in the deployment job.
