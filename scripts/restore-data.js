const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const csvPath = path.join(rootDir, 'only_pet_products.csv');
const jsonPath = path.join(rootDir, 'products.json');

// State-machine CSV Parser to support quotes & embedded newlines
function parseCSV(text) {
  const rows = [];
  let row = [];
  let col = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    
    if (c === '"') {
      if (inQuotes && next === '"') {
        col += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(col);
      col = "";
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(col);
      rows.push(row);
      row = [];
      col = "";
    } else {
      col += c;
    }
  }
  if (col || row.length > 0) {
    row.push(col);
    rows.push(row);
  }
  return rows;
}

function cleanDescription(descStr) {
  if (!descStr) return "";
  
  // Replace escaped newlines
  let cleaned = descStr.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  
  // Check if it already contains HTML tags.
  if (/<p|<ul|<ol|<li/i.test(cleaned)) {
    // Style paragraphs, lists, and items properly
    cleaned = cleaned.replace(/<p[^>]*>/gi, '<p class="mb-4 text-sm font-light leading-relaxed text-gray-300">');
    cleaned = cleaned.replace(/<ul[^>]*>/gi, '<ul class="list-disc pl-5 space-y-2 my-4 text-gray-300">');
    cleaned = cleaned.replace(/<li[^>]*>/gi, '<li class="font-light text-sm my-1 leading-relaxed">');
    return cleaned;
  }
  
  // If plain text, format it using paragraph/list blocks
  const blocks = cleaned.split("\n").map(b => b.trim()).filter(b => b.length > 0);
  const formattedBlocks = [];
  let inList = false;
  
  for (const b of blocks) {
    if (b.startsWith("•") || b.startsWith("*") || b.startsWith("-") || /^\d+\./.test(b)) {
      const bulletClean = b.replace(/^[•\*\-\d\.\s]+/, '').trim();
      if (!inList) {
        formattedBlocks.push('<ul class="list-disc pl-5 space-y-2 my-4 text-gray-300">');
        inList = true;
      }
      formattedBlocks.push(`<li class="font-light text-sm my-1 leading-relaxed">${bulletClean}</li>`);
    } else {
      if (inList) {
        formattedBlocks.push('</ul>');
        inList = false;
      }
      formattedBlocks.push(`<p class="mb-4 text-sm font-light leading-relaxed text-gray-300">${b}</p>`);
    }
  }
  if (inList) {
    formattedBlocks.push('</ul>');
  }
  return formattedBlocks.join("");
}

function runRestoration() {
  console.log("🚀 Loading only_pet_products.csv...");
  if (!fs.existsSync(csvPath)) {
    console.error("❌ ERROR: only_pet_products.csv not found!");
    process.exit(1);
  }
  
  const rawCSV = fs.readFileSync(csvPath, 'utf-8');
  const csvRows = parseCSV(rawCSV);
  if (csvRows.length === 0) {
    console.error("❌ ERROR: Parsed CSV is empty!");
    process.exit(1);
  }
  
  const headers = csvRows[0].map(h => h.trim().toLowerCase());
  const idIdx = headers.indexOf('id');
  const descIdx = headers.indexOf('description');
  
  if (idIdx === -1 || descIdx === -1) {
    console.error("❌ ERROR: CSV missing 'id' or 'description' columns!");
    process.exit(1);
  }
  
  const csvDescMap = {};
  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const id = row[idIdx] ? row[idIdx].trim() : "";
    const desc = row[descIdx] ? row[descIdx].trim() : "";
    if (id) {
      csvDescMap[`pet-${id}`] = desc;
    }
  }
  
  console.log(`ℹ️ Parsed ${Object.keys(csvDescMap).length} descriptions from CSV.`);
  
  console.log("🚀 Loading products.json...");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ ERROR: products.json not found!");
    process.exit(1);
  }
  
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  let restoreCount = 0;
  
  const updatedProducts = products.map((product) => {
    if (product.id.startsWith('pet-')) {
      const originalDesc = csvDescMap[product.id];
      if (originalDesc !== undefined) {
        product.description = cleanDescription(originalDesc);
        restoreCount++;
      } else {
        console.warn(`⚠️ Warning: No CSV description found for product ID ${product.id}`);
      }
    }
    return product;
  });
  
  console.log(`📊 Restoration Summary:`);
  console.log(`   - Total products in catalog: ${updatedProducts.length}`);
  console.log(`   - Total pet products restored: ${restoreCount}`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');
  console.log("✅ Successfully restored clean descriptions to products.json!");
}

runRestoration();
