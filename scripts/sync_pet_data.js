const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error("❌ ERROR: .env.local file not found at", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
  console.error("❌ ERROR: Supabase credentials missing from .env.local!");
  process.exit(1);
}

const supabaseUrl = supabaseUrlMatch[1].trim();
const supabaseKey = supabaseKeyMatch[1].trim();

console.log("ℹ️ Supabase URL:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Helper functions for formatting descriptions (HTML paragraphs & bullets)
function cleanDescription(descStr) {
  if (!descStr) return "";
  
  // Replace escaped newlines
  let cleaned = descStr.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  
  // Split into blocks and filter empty ones
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
  
  const finalHtml = formattedBlocks.join("");
  return finalHtml ? finalHtml : `<p class="text-sm font-light text-gray-300">${descStr}</p>`;
}

// Helper to parse price float
function parsePrice(priceStr) {
  if (!priceStr || priceStr.trim() === "") return 25.0;
  try {
    const cleaned = priceStr.replace("$", "").replace(/\s/g, "").replace(",", ".").trim();
    return Math.round(parseFloat(cleaned) * 100) / 100 || 25.0;
  } catch (e) {
    return 25.0;
  }
}

// Helper to categorize into our 5 groups
function mapCategory(categoryStr, productName) {
  const catLower = String(categoryStr || "").toLowerCase();
  const nameLower = String(productName || "").toLowerCase();
  
  if (catLower.includes("nail cutter") || catLower.includes("nail clipper") || nameLower.includes("nail cutter") || nameLower.includes("nail clipper")) {
    return "Pet Nail Cutters";
  }
  if (catLower.includes("comb") || nameLower.includes("comb")) {
    return "Pet Combs";
  }
  if (catLower.includes("curved") || nameLower.includes("curved")) {
    return "Curved Scissors";
  }
  if (catLower.includes("blender") || catLower.includes("thinning") || catLower.includes("chunker") ||
      nameLower.includes("blender") || nameLower.includes("thinning") || nameLower.includes("chunker")) {
    return "Blenders & Thinning Scissors";
  }
  if (catLower.includes("straight") || nameLower.includes("straight")) {
    return "Pet Straight Scissors";
  }
  if (catLower.includes("nail") || nameLower.includes("nail")) {
    return "Pet Nail Cutters";
  }
  if (catLower.includes("kit") || nameLower.includes("set")) {
    if (nameLower.includes("curved")) return "Curved Scissors";
    if (nameLower.includes("straight")) return "Pet Straight Scissors";
    return "Pet Straight Scissors";
  }
  return "Pet Straight Scissors";
}

// 3. State-machine CSV Parser to support quotes & embedded newlines
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

// 4. Main script execution
async function runSync() {
  console.log("🚀 STARTING: Automated pet grooming database sync pipeline...");
  
  const csvPath = path.join(rootDir, "only_pet_products.csv");
  const imagesDir = path.join(rootDir, "public", "assets", "image");
  
  if (!fs.existsSync(csvPath)) {
    console.error("❌ ERROR: CSV file not found at:", csvPath);
    process.exit(1);
  }
  
  // Compile list of local image files for precise mapping
  let localImages = [];
  if (fs.existsSync(imagesDir)) {
    localImages = fs.readdirSync(imagesDir);
    console.log(`ℹ️ Found ${localImages.length} local image files inside public/assets/image.`);
  } else {
    console.warn(`⚠️ WARNING: Local images folder not found at ${imagesDir}`);
  }
  
  // Read CSV and parse rows
  const rawData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(rawData);
  
  if (rows.length === 0) {
    console.error("❌ ERROR: Parsed CSV is empty!");
    process.exit(1);
  }
  
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const productRows = rows.slice(1);
  
  console.log(`ℹ️ Parsed ${productRows.length} rows from only_pet_products.csv`);
  
  const parsedProducts = [];
  let missingImagesCount = 0;
  
  for (const row of productRows) {
    if (row.length < 2) continue;
    
    // Map columns dynamically based on headers
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = row[idx] ? row[idx].trim() : "";
    });
    
    const pId = rowObj.id;
    const name = rowObj.name;
    const description = rowObj.description;
    const regularPrice = rowObj.regular_price;
    const categoriesRaw = rowObj.categories;
    const imagesRaw = rowObj.images;
    const stockRaw = rowObj.stock;
    const inStockRaw = rowObj.in_stock;
    const sku = rowObj.sku;
    
    if (!pId || !name) continue;
    
    // Clean calculations
    const priceVal = parsePrice(regularPrice);
    const categoryMapped = mapCategory(categoriesRaw, name);
    
    // Compute 3 B2B pricing tiers
    const priceTier1 = priceVal;
    const priceTier2 = Math.round(priceVal * 0.85 * 100) / 100;
    const priceTier3 = Math.round(priceVal * 0.70 * 100) / 100;
    
    // Stock parsing
    let stockCount = 10;
    const inStockBool = inStockRaw === "1";
    if (stockRaw && !isNaN(stockRaw)) {
      stockCount = parseInt(stockRaw, 10);
    } else if (!inStockBool) {
      stockCount = 0;
    }
    
    // Exact Image matching
    const mappedImages = [];
    const imageUrls = imagesRaw ? imagesRaw.split(",").map(u => u.trim()).filter(Boolean) : [];
    
    for (const url of imageUrls) {
      const filename = path.basename(url);
      const baseName = path.parse(filename).name.toLowerCase();
      
      let foundMatch = false;
      for (const localFile of localImages) {
        if (localFile.toLowerCase().includes(baseName)) {
          mappedImages.push(`/assets/image/${localFile}`);
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch) {
        missingImagesCount++;
        // Fallback standard image
        mappedImages.push("/assets/image/17_shopify_image_7_DogGroomingScissorsKitBlack-300x300.jpg");
      }
    }
    
    if (mappedImages.length === 0) {
      mappedImages.push("/assets/image/17_shopify_image_7_DogGroomingScissorsKitBlack-300x300.jpg");
    }
    
    // Compile row schema for Supabase
    const dbProductObj = {
      id: `pet-${pId}`,
      name: name,
      description: cleanDescription(description),
      sku: sku || `BITE-PET-${pId}`,
      categories: categoryMapped,
      images: mappedImages, // text[] array compatibility or JSONB/text string
      price_tier_1: priceTier1,
      price_tier_2: priceTier2,
      price_tier_3: priceTier3,
      stock: stockCount
    };
    
    parsedProducts.push(dbProductObj);
  }
  
  console.log(`ℹ️ Successfully built ${parsedProducts.length} clean products. Processing database insertion...`);
  console.log(`ℹ️ Image matcher summary: verified local files with ${missingImagesCount} fallbacks.`);
  
  // Bulk upload to pet_products table in Supabase
  let successCount = 0;
  let failCount = 0;
  
  // Upsert products in chunks of 20 to avoid large payload failures or network limits
  const chunkSize = 20;
  for (let i = 0; i < parsedProducts.length; i += chunkSize) {
    const chunk = parsedProducts.slice(i, i + chunkSize);
    
    const { data, error } = await supabase
      .from('pet_products')
      .upsert(chunk, { onConflict: 'id' });
      
    if (error) {
      console.error(`❌ ERROR inserting chunk ${i / chunkSize + 1}:`, error.message, error.details);
      failCount += chunk.length;
    } else {
      successCount += chunk.length;
      console.log(`✅ Chunk ${i / chunkSize + 1} uploaded successfully (${successCount}/${parsedProducts.length}).`);
    }
  }
  
  console.log("\n📊 SYNC SUMMARY:");
  console.log(`   - Total Processed Products: ${parsedProducts.length}`);
  console.log(`   - Successful Uploads:      ${successCount}`);
  console.log(`   - Failed Uploads:          ${failCount}`);
  
  if (failCount > 0) {
    console.error("\n❌ ERROR: Sync completed with errors. Please check the RLS policy on the 'pet_products' table in Supabase and ensure anonymous inserts are enabled!");
    process.exit(1);
  } else {
    console.log("\n🎉 SUCCESS: All B2B Pet Grooming Instruments migrated flawlessly directly to Supabase!");
    process.exit(0);
  }
}

runSync().catch(err => {
  console.error("💥 CRITICAL ERROR in sync execution:", err);
  process.exit(1);
});
