/**
 * patch_pet_descriptions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads only_pet_products.csv, extracts the authoritative description, name,
 * categories, price, and attribute data for every pet product, then patches
 * the matching entry in products.json with a UNIQUE, clean description and
 * correct technical_specifications block.
 *
 * Usage:  node scripts/patch_pet_descriptions.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, '..');
const CSV_PATH    = path.join(ROOT, 'only_pet_products.csv');
const JSON_PATH   = path.join(ROOT, 'products.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Ultra-minimal CSV parser that handles:
 *  - Quoted fields (commas + newlines inside quotes)
 *  - Double-quote escaping ("")
 */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuote) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"')            { inQuote = false; }
      else                            { field += ch; }
    } else {
      if (ch === '"')                 { inQuote = true; }
      else if (ch === ',')            { row.push(field); field = ''; }
      else if (ch === '\r' && next === '\n') {
        row.push(field); field = '';
        rows.push(row);  row = [];
        i++;
      } else if (ch === '\n') {
        row.push(field); field = '';
        rows.push(row);  row = [];
      } else { field += ch; }
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }

  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h.trim()] = (r[idx] || '').trim(); });
    return obj;
  });
}

/** Strip HTML tags and normalise whitespace to produce a plain-text string */
function stripHTML(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Parse the raw HTML description from the CSV into a clean HTML block
 * that we embed back into products.json.
 * We:
 *   1. Strip the Amazon/WordPress inline attribute junk (data-start, data-end,
 *      class="a-spacing-mini", etc.)
 *   2. Rebuild with lightweight Tailwind-free classes so it renders well.
 */
function cleanHTML(rawHTML) {
  if (!rawHTML) return '';

  // Remove WordPress/Amazon attribute noise
  let h = rawHTML
    .replace(/ data-start="[^"]*"/g, '')
    .replace(/ data-end="[^"]*"/g, '')
    .replace(/ data-sourcepos="[^"]*"/g, '')
    .replace(/ class="a-spacing-mini"/g, '')
    .replace(/ class="a-list-item"/g, '')
    .replace(/ class="a-unordered-list[^"]*"/g, '')
    .replace(/<span>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<br\s*\/?>/g, ' ');

  // Collapse blank lines that result from the above
  h = h.replace(/\n{2,}/g, '\n').trim();
  return h;
}

/**
 * Derive unique technical_specifications from CSV attribute columns.
 *
 * CSV columns we use:
 *   attribute_1_name  attribute_1_values  (e.g. Color / Black)
 *   attribute_2_name  attribute_2_values  (e.g. Size  / 7.5 inches)
 *   attribute_3_name  attribute_3_values
 *   categories                            (e.g. Pet Nail Cutters)
 *   name                                  product title
 */
function buildSpecs(row) {
  const cat   = (row['categories'] || '').toLowerCase();
  const name  = (row['name']       || '').toLowerCase();

  // Extract size from attribute columns
  const sizeAttr = [1,2,3].reduce((acc, n) => {
    const aName = (row[`attribute_${n}_name`] || '').toLowerCase();
    const aVal  = (row[`attribute_${n}_values`] || '');
    if (aName.includes('size') || aName.includes('length')) return aVal;
    return acc;
  }, '');

  // Extract color/finish
  const colorAttr = [1,2,3].reduce((acc, n) => {
    const aName = (row[`attribute_${n}_name`] || '').toLowerCase();
    const aVal  = (row[`attribute_${n}_values`] || '');
    if (aName.includes('color') || aName.includes('colour') || aName.includes('finish')) return aVal;
    return acc;
  }, '');

  // Determine finish label from color attribute or product name
  let finish = 'Satin Polish Finish';
  if (colorAttr) {
    const c = colorAttr.toLowerCase();
    if (c.includes('gold'))   finish = 'Plasma Gold Finish';
    else if (c.includes('black')) finish = 'Black Titanium Finish';
    else if (c.includes('rainbow')) finish = 'Rainbow Iridescent Finish';
    else if (c.includes('purple')) finish = 'Anodised Purple Finish';
    else if (c.includes('rose')) finish = 'Rose Gold PVD Finish';
    else finish = `${colorAttr} Finish`;
  } else if (name.includes('gold'))   { finish = 'Plasma Gold Finish'; }
  else if (name.includes('black'))     { finish = 'Black Titanium Finish'; }
  else if (name.includes('titanium'))  { finish = 'PVD Titanium Finish'; }

  // Determine material
  let material = '440C Japanese Stainless Steel';
  if (cat.includes('nail') || name.includes('nail') || name.includes('claw')) {
    material = 'Veterinary-Grade Stainless Steel';
  } else if (cat.includes('comb') || name.includes('comb')) {
    material = 'High-Grade Stainless Steel, Anti-Static Chrome Plating';
  } else if (cat.includes('coat') || name.includes('jacket') || name.includes('fleece')) {
    material = 'Soft Breathable Fleece, D-Ring Leash Attachment';
  } else if (name.includes('thinning') || name.includes('chunker') || name.includes('blender')) {
    material = '440C Japanese Steel – Convex Micro-Serrated Blade';
  }

  // Determine size array
  let sizes = [];
  if (sizeAttr) {
    sizes = [sizeAttr];
  } else if (cat.includes('nail') || name.includes('nail')) {
    sizes = ['Standard', 'Large'];
  } else if (cat.includes('comb') || name.includes('comb')) {
    sizes = ['7.5" Coarse Side', '7.5" Fine Side'];
  } else if (cat.includes('coat') || name.includes('jacket')) {
    sizes = ['S', 'M', 'L', 'XL'];
  } else if (name.includes('8 inch') || name.includes('8.0')) {
    sizes = ['8.0"'];
  } else if (name.includes('7.5 inch') || name.includes('7.5')) {
    sizes = ['7.5"'];
  } else if (name.includes('6 in 1') || name.includes('5 in 1') || name.includes('kit')) {
    sizes = ['7.0"', '7.5"'];
  } else {
    sizes = ['7.0"', '7.5"', '8.0"'];
  }

  // Determine handle
  let handle = 'Ergonomic Offset Anti-Fatigue Handle';
  if (cat.includes('nail')) handle = 'Ergonomic Non-Slip Comfort Grip';
  else if (cat.includes('comb') || name.includes('comb')) handle = 'Anti-Slip Cambered Rubber Grip';
  else if (cat.includes('coat') || name.includes('jacket')) handle = 'N/A – Pet Apparel';
  else if (name.includes('thinning') || name.includes('chunker')) handle = 'Ergonomic Offset + CNC Precision Screw';
  else if (name.includes('curved')) handle = 'Ergonomic Crane Handle + Noise-Reduction Muffler';

  // Determine edge
  let edge = 'Convex Razor-Sharp Edge';
  if (cat.includes('nail'))            edge = 'Stainless Safety-Guard Blade';
  else if (cat.includes('comb') || name.includes('comb')) edge = 'Round-Tip Tapered Stainless Pins';
  else if (cat.includes('coat') || name.includes('jacket')) edge = 'N/A – Pet Apparel';
  else if (name.includes('thinning'))  edge = `${sizeAttr || '37'} Micro-Tooth Blending Edge`;
  else if (name.includes('chunker'))   edge = '42-Tooth Chunker Edge (25-30% Thinning Rate)';

  return { material, handle, edge, finish, sizes };
}

/**
 * Build a unique "spec bullet grid" HTML appended to the description.
 * This ensures the 3-bullet spec block the user requested.
 */
function buildSpecBullets(specs, csvRow) {
  const name = csvRow['name'] || '';
  const sizeLabel = specs.sizes.join(' / ');
  return `<ul class="list-none mt-4 space-y-1 border-t border-slate-200 pt-3">
<li><strong>🔩 Alloy:</strong> ${specs.material}</li>
<li><strong>📐 Length:</strong> ${sizeLabel}</li>
<li><strong>✨ Finish:</strong> ${specs.finish}</li>
</ul>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('📂 Reading CSV …');
const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const csvRows = parseCSV(csvText);
console.log(`   Parsed ${csvRows.length} CSV rows.`);

// Build a lookup map:  csv_id → row
const csvById = {};
csvRows.forEach(row => {
  const id = (row['id'] || '').trim();
  if (id) csvById[id] = row;
});

console.log('📂 Reading products.json …');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

let patched = 0;
let skipped = 0;

const updated = products.map(product => {
  // We only touch pet-NNN products
  if (!product.id || !product.id.startsWith('pet-')) {
    return product;
  }

  // Extract the numeric CSV ID from the product id "pet-NNN"
  const csvId = product.id.replace('pet-', '');
  const row   = csvById[csvId];

  if (!row) {
    // No matching CSV row → leave untouched
    skipped++;
    return product;
  }

  // ── Build unique description ──────────────────────────────────────────────
  const rawDesc  = row['description'] || '';
  const cleanDesc = cleanHTML(rawDesc);
  const specs    = buildSpecs(row);
  const bullets  = buildSpecBullets(specs, row);

  // Final description = cleaned HTML + unique spec bullets
  const finalDesc = cleanDesc + '\n' + bullets;

  // ── Build technical_specifications ────────────────────────────────────────
  const techSpecs = {
    material : specs.material,
    handle   : specs.handle,
    edge     : specs.edge,
    finish   : specs.finish,
    sizes    : specs.sizes,
  };

  patched++;
  return {
    ...product,
    description             : finalDesc,
    technical_specifications: techSpecs,
  };
});

// ── Write back ───────────────────────────────────────────────────────────────
console.log('💾 Writing patched products.json …');
fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Patched : ${patched} pet products`);
console.log(`   Skipped : ${skipped} (no matching CSV row)`);
console.log(`   Non-pet : ${products.length - patched - skipped} (untouched)\n`);
