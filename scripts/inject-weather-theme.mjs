import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Styles the live weather banner with this site's own fonts, colors and buttons.
// The banner's default style block sits in <body>, so these rules use higher specificity.
const style = `<style id="rh-weather-theme">html body .rh-live-weather{background:#20262a!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather:not([data-weather-phase*="warn"]):not([data-weather-phase*="emerg"]){border-top-color:#d6a23d!important}html body .rh-live-weather .rh-live-weather__status{color:#d6a23d!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather h2{font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:.02em!important;font-style:normal!important}html body .rh-live-weather .rh-live-weather__summary,html body .rh-live-weather .rh-live-weather__action,html body .rh-live-weather .rh-live-weather__source{font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather .rh-live-weather__button,html body .rh-live-weather .rh-live-weather__phone{border-radius:0px!important;text-transform:uppercase!important;letter-spacing:.06em!important;font-weight:700!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rh-live-weather .rh-live-weather__button{background:#d6a23d!important;color:#101820!important;border:1px solid #d6a23d!important}html body .rh-live-weather .rh-live-weather__phone{border-color:rgba(255,255,255,.6)!important}html body .rankhound-visible-phone{background:#20262a!important;border-radius:0px!important;border-left:4px solid #d6a23d!important;padding:8px 8px 8px 16px!important;gap:14px!important;box-shadow:0 12px 32px rgba(0,0,0,.3)!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rankhound-visible-phone span{color:rgba(255,255,255,.88)!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important}html body .rankhound-visible-phone a{background:#d6a23d!important;color:#101820!important;text-decoration:none!important;padding:9px 14px!important;border-radius:0px!important;font-family:Arial, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:normal!important}@media(max-width:650px){html body .rankhound-visible-phone{border-left:0!important;padding:5px!important;border-radius:0px!important}html body .rankhound-visible-phone a{padding:10px 14px!important;border-radius:0px!important}}</style>`;
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
