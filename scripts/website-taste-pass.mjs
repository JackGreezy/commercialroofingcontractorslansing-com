#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || process.cwd());
const publicDir = path.join(root, "public");
const styleTag = '<link href="/website-taste.css" id="rr-website-taste-css" rel="stylesheet"/>';
const scriptTag = '<script defer id="rr-website-taste-js" src="/website-taste.js"></script>';

const contactForm = `<form action="/api/submit" class="rr-contact-form" data-contact-form method="post">
<input name="page" type="hidden" value="/contact"/>
<input aria-hidden="true" autocomplete="off" class="hp-field" name="_company" tabindex="-1" type="text"/>
<label class="rr-contact-field">Name
<input autocomplete="name" name="name" placeholder="Your name" required type="text"/>
</label>
<label class="rr-contact-field">Phone
<input autocomplete="tel" name="phone" placeholder="Phone number" required type="tel"/>
</label>
<label class="rr-contact-field">Email
<input autocomplete="email" name="email" placeholder="Email address" required type="email"/>
</label>
<label class="rr-contact-field">Property Address
<input autocomplete="street-address" name="address" placeholder="Building address or roof location" required type="text"/>
</label>
<label class="rr-contact-field">What do you need?
<select name="serviceType" required>
<option value="">Choose one</option>
<option>Emergency Roof Leak Repair</option>
<option>Flat Roof Replacement Inspection</option>
<option>Commercial Roof Repair</option>
<option>Roof Coating Or Restoration</option>
<option>Commercial Roof Replacement</option>
<option>Roof Service Agreement</option>
<option>Not Sure Yet</option>
</select>
</label>
<label class="rr-contact-field">Timeline
<select name="timeline" required>
<option value="">Select a timeline</option>
<option>Emergency - active leak</option>
<option>Within 30 days</option>
<option>1-3 months</option>
<option>3-6 months</option>
<option>Planning / budgeting</option>
</select>
</label>
<label class="rr-contact-field rr-contact-field--full">Message
<textarea name="notes" placeholder="Tell us about the roof, issue, access, and schedule" required rows="7"></textarea>
</label>
<button class="rr-contact-submit" type="submit">Send Roof Request</button>
<p aria-live="polite" class="form-status" data-form-status role="status"></p>
</form>`;

const homeDecisionRail = `<section class="lansing-decision-rail" data-lansing-lead-paths>
<div class="lansing-shell">
<a href="/contact?request=emergency"><span>Roof leaking now</span><strong>Send an emergency roof request</strong><small>Share the leak location, building access, and what is below the roof.</small></a>
<a href="/contact?request=inspection"><span>Repair or replace?</span><strong>Request a flat-roof inspection</strong><small>Get field findings before committing to a major capital project.</small></a>
<a href="/services/silicone-roof-coatings"><span>Trying to extend roof life</span><strong>Check restoration fit</strong><small>Find out if the existing roof can support a coating or recover path.</small></a>
<a href="/services/preventive-maintenance-programs"><span>Managing the roof long term</span><strong>Set up ongoing service</strong><small>Put inspections, preventive work, and leak history on one schedule.</small></a>
</div></section>`;

const homeInspectionStory = `<section class="lansing-inspection-story" data-lansing-inspection-story>
<div class="lansing-shell lansing-story-grid">
<div class="lansing-story-image"><img src="/ours/services/commercial-roof-inspection-commercial-roofing-contractors-lansing-mi.webp" alt="Flat roof replacement inspection in Lansing, Michigan" loading="lazy" decoding="async"></div>
<div class="lansing-story-copy"><p class="lansing-kicker">Flat Roof Replacement Inspection</p><h2>Know what failed before deciding what to buy.</h2><p>Mid-Michigan roofs take on freeze and thaw cycles, ponding water, snow load, rooftop traffic, and years of small repairs. We inspect the membrane, seams, flashings, drains, penetrations, insulation risk, and visible deck concerns so the next move is based on the roof in front of you.</p><ul><li>Condition photos and failure areas</li><li>Repair, coating, recover, and replacement paths</li><li>Priorities for budgeting and bid review</li></ul><div class="lansing-actions"><a class="lansing-button" href="/contact?request=inspection">Request An Inspection</a><a class="lansing-text-link" href="/services/commercial-roof-inspection">See Inspection Details</a></div></div>
</div></section>`;

const homeServiceStory = `<section class="lansing-service-story" data-lansing-service-story>
<div class="lansing-shell"><div><p class="lansing-kicker">Roof Service Agreements</p><h2>Stop restarting the roof conversation after every leak.</h2><p>A service agreement keeps inspections, drain checks, preventive repairs, storm notes, and recurring problem areas in one building record. Your team gets a clearer budget and fewer surprises when winter and spring weather test the roof.</p></div><div class="lansing-service-cards"><a href="/services/preventive-maintenance-programs"><strong>Planned roof care</strong><span>Schedule roof walks and small repairs before water reaches the interior.</span></a><a href="/services/commercial-roof-coatings"><strong>Restoration review</strong><span>Check whether coating can extend a dry, repairable roof.</span></a><a href="/services/commercial-reroofing"><strong>Replacement planning</strong><span>Build the scope around operations, access, weather, and the real assembly.</span></a></div><a class="lansing-button" href="/contact?request=service">Ask About A Service Agreement</a></div>
</section>`;

const stickyContact = `<a class="lansing-sticky-contact" href="/contact">Request Roof Help</a>`;

const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["assets-f", "ours", "images"].includes(entry.name)) continue;
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(item);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(item);
  }
};
walk(publicDir);

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = html
    .replace(/<a\b([^>]*?)href=["']tel:5555556149["']([^>]*)>555-555-6149<\/a>/gi, '<a$1href="/contact"$2>Request Roof Help</a>')
    .replace(/"telephone"\s*:\s*"555-555-6149"\s*,?/g, "")
    .replace(/tel:5555556149/gi, "/contact")
    .replace(/555-555-6149/g, "Request Roof Help")
    .replace(/—|&mdash;|&#8212;/g, "-");
  if (!html.includes('id="rr-website-taste-css"')) {
    html = html.replace(/<\/head>/i, `${styleTag}\n</head>`);
  }
  if (!html.includes('id="rr-website-taste-js"')) {
    html = html.replace(/<\/body>/i, `${scriptTag}\n</body>`);
  }
  if (path.basename(file) === "contact.html") {
    const formPattern = /<form\b(?=[^>]*(?:data-contact-form|action=["']\/api\/(?:contact|submit)["']))[\s\S]*?<\/form>/i;
    if (formPattern.test(html)) html = html.replace(formPattern, contactForm);
  }
  if (["index.html", "home.html"].includes(path.basename(file))) {
    html = html
      .replace(/<section class="lansing-decision-rail"[\s\S]*?<\/section>/gi, "")
      .replace(/<div class="lansing-hero-actions">[\s\S]*?<\/div>/gi, "");
    html = html
      .replace(/<h1><span class="text-white">[\s\S]*?<\/h1>\s*<p>[\s\S]*?<\/p>/i, '<h1><span class="text-white">Lansing Commercial Roof Help</span><br/><span class="text-green">from leak to long-term plan</span></h1><p>Emergency repair, flat-roof inspections, coatings, replacement, and service agreements for commercial buildings across Lansing and Mid-Michigan.</p><div class="lansing-hero-actions"><a href="/contact?request=emergency">Get Emergency Roof Help</a><a href="/contact?request=inspection">Request A Roof Inspection</a></div>')
      .replace(/(<\/section>)\s*(<div id="content-start">)/i, `$1${homeDecisionRail}$2`);
    if (!html.includes("data-lansing-inspection-story")) {
      html = html.replace(/(<div class="fl-row fl-row-full-width fl-row-bg-none fl-node-8dxfrb7iunks)/i, `${homeInspectionStory}$1`);
    }
    if (!html.includes("data-lansing-service-story")) {
      html = html.replace(/(<div class="fl-row fl-row-full-width fl-row-bg-color fl-node-60901535088bb)/i, `${homeServiceStory}$1`);
    }
  }
  if (!html.includes("lansing-sticky-contact")) html = html.replace(/<\/body>/i, `${stickyContact}</body>`);
  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`website-taste-pass: ${changed} page(s) updated`);
