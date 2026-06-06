const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'only_pet_products.csv');
const TS_PATH = path.join(__dirname, '..', 'src', 'data', 'only_pet_products.ts');

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

function cleanHTML(rawHTML) {
  if (!rawHTML) return '';
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
  h = h.replace(/\n{2,}/g, '\n').trim();
  return h;
}

function buildSpecs(row) {
  const cat   = (row['categories'] || '').toLowerCase();
  const name  = (row['name']       || '').toLowerCase();

  const sizeAttr = [1,2,3].reduce((acc, n) => {
    const aName = (row[`attribute_${n}_name`] || '').toLowerCase();
    const aVal  = (row[`attribute_${n}_values`] || '');
    if (aName.includes('size') || aName.includes('length')) return aVal;
    return acc;
  }, '');

  const colorAttr = [1,2,3].reduce((acc, n) => {
    const aName = (row[`attribute_${n}_name`] || '').toLowerCase();
    const aVal  = (row[`attribute_${n}_values`] || '');
    if (aName.includes('color') || aName.includes('colour') || aName.includes('finish')) return aVal;
    return acc;
  }, '');

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

  let handle = 'Ergonomic Offset Anti-Fatigue Handle';
  if (cat.includes('nail')) handle = 'Ergonomic Non-Slip Comfort Grip';
  else if (cat.includes('comb') || name.includes('comb')) handle = 'Anti-Slip Cambered Rubber Grip';
  else if (cat.includes('coat') || name.includes('jacket')) handle = 'N/A – Pet Apparel';
  else if (name.includes('thinning') || name.includes('chunker')) handle = 'Ergonomic Offset + CNC Precision Screw';
  else if (name.includes('curved')) handle = 'Ergonomic Crane Handle + Noise-Reduction Muffler';

  let edge = 'Convex Razor-Sharp Edge';
  if (cat.includes('nail'))            edge = 'Stainless Safety-Guard Blade';
  else if (cat.includes('comb') || name.includes('comb')) edge = 'Round-Tip Tapered Stainless Pins';
  else if (cat.includes('coat') || name.includes('jacket')) edge = 'N/A – Pet Apparel';
  else if (name.includes('thinning'))  edge = `${sizeAttr || '37'} Micro-Tooth Blending Edge`;
  else if (name.includes('chunker'))   edge = '42-Tooth Chunker Edge (25-30% Thinning Rate)';

  return { material, handle, edge, finish, sizes };
}

function buildSpecBullets(specs, csvRow) {
  const name = csvRow['name'] || '';
  const sizeLabel = specs.sizes.join(' / ');
  return `<ul class="list-none mt-4 space-y-1 border-t border-slate-200 pt-3">
<li><strong>🔩 Alloy:</strong> ${specs.material}</li>
<li><strong>📐 Length:</strong> ${sizeLabel}</li>
<li><strong>✨ Finish:</strong> ${specs.finish}</li>
</ul>`;
}

console.log('Reading CSV...');
const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(csvText);

const products = rows.map((row) => {
  const id = (row['id'] || '').trim();
  const rawDesc = row['description'] || '';
  const cleanDesc = cleanHTML(rawDesc);
  const specs = buildSpecs(row);
  const bullets = buildSpecBullets(specs, row);
  const finalDesc = cleanDesc + '\n' + bullets;

  // Determine images
  const rawImages = row['images'] || '';
  let images = [];
  if (rawImages) {
    images = rawImages.split(',').map(img => img.trim()).filter(Boolean);
  }

  // Categories mapping
  const category = row['categories'] || 'Pet Straight Scissors';

  return {
    id: `pet-${id}`,
    name: row['name'] || '',
    sku: row['sku'] || `BITE-PET-${id}`,
    description: finalDesc,
    category: category,
    images: images,
    technical_specifications: {
      material: specs.material,
      handle: specs.handle,
      edge: specs.edge,
      finish: specs.finish,
      sizes: specs.sizes
    }
  };
});

const tsContent = `// Autogenerated from only_pet_products.csv
export interface PetProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  images: string[];
  technical_specifications: {
    material: string;
    handle: string;
    edge: string;
    finish: string;
    sizes: string[];
  };
}

export const only_pet_products: PetProduct[] = ${JSON.stringify(products, null, 2)};
`;

const dir = path.dirname(TS_PATH);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(TS_PATH, tsContent, 'utf8');
console.log('Done generating TS file!');
