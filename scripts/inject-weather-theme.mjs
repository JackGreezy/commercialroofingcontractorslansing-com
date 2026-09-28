import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Styles the live weather banner with this site's own fonts, colors and buttons.
// The banner's default style block sits in <body>, so these rules use higher specificity.
const style = `<style id="rh-weather-theme">html body .rh-live-weather{background:#20262a!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather:not([data-weather-phase*="warn"]):not([data-weather-phase*="emerg"]){border-top-color:#d6a23d!important}html body .rh-live-weather .rh-live-weather__status{color:#d6a23d!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather h2{font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:.02em!important;font-style:normal!important}html body .rh-live-weather .rh-live-weather__summary,html body .rh-live-weather .rh-live-weather__action,html body .rh-live-weather .rh-live-weather__source{font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather .rh-live-weather__button,html body .rh-live-weather .rh-live-weather__phone{border-radius:0px!important;text-transform:uppercase!important;letter-spacing:.06em!important;font-weight:700!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather .rh-live-weather__button{background:#d6a23d!important;color:#101820!important;border:1px solid #d6a23d!important}html body .rh-live-weather .rh-live-weather__phone{border-color:rgba(255,255,255,.6)!important}</style>`;
const existing = /<style id="rh-weather-theme">[\s\S]*?<\/style>/;
async function htmlFiles(dir) {
  const out = [];
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await htmlFiles(abs));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(abs);
  }
  return out;
}
let changed = 0;
for (const dir of ["public", "rendered", "data/leak-first-rendered", "data/rendered-pages"]) {
  for (const file of await htmlFiles(path.join(process.cwd(), dir))) {
    const html = await readFile(file, "utf8");
    if (!/<\/head>/i.test(html)) continue;
    const next = existing.test(html) ? html.replace(existing, style) : html.replace(/<\/head>/i, `${style}</head>`);
    if (next === html) continue;
    await writeFile(file, next);
    changed += 1;
  }
}
console.log(`Weather banner theme stamped into ${changed} pages`);
