const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read env variables manually from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("❌ ERROR: Could not find Supabase URL or Anon Key in .env.local");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log(`🔗 Supabase URL: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Read products.json
const productsPath = path.join(__dirname, '..', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Helper function to extract steel type dynamically
function getSteelType(p) {
  if (p.technical_specifications && p.technical_specifications.material) {
    return p.technical_specifications.material;
  }
  
  const desc = (p.description || '').toLowerCase();
  if (desc.includes('cobalt steel') || desc.includes('japanese cobalt')) {
    return 'Premium Japanese Cobalt Steel';
  }
  if (desc.includes('molybdenum steel') || desc.includes('molybdenum')) {
    return 'Level 3 Molybdenum Steel';
  }
  if (desc.includes('440c stainless steel') || desc.includes('440c')) {
    return 'Japanese 440C Stainless Steel';
  }
  if (desc.includes('j2 stainless steel') || desc.includes('j2 steel')) {
    return 'Premium Japanese J2 Stainless Steel';
  }
  
  return 'Japanese J2 Stainless Steel';
}

// Helper function to extract hardness dynamically
function getHardness(p) {
  const desc = p.description || '';
  
  // Try to parse HRC values from the description text (e.g. HRC 58-60 or HRC 60±2)
  const hrcMatch = desc.match(/HRC\s*([0-9]+[-±\s]*[0-9]*)/i);
  if (hrcMatch) {
    return `${hrcMatch[0].toUpperCase()} Vacuum Heat Treated`;
  }
  
  const material = (p.technical_specifications && p.technical_specifications.material || '').toLowerCase();
  if (material.includes('vg10') || material.includes('cobalt')) {
    return '60-62 HRC Vacuum Heat Treated';
  }
  if (material.includes('j2')) {
    return '58-60 HRC Vacuum Heat Treated';
  }
  
  return '58-60 HRC Vacuum Heat Treated';
}

async function seed() {
  try {
    console.log(`🚀 STARTING SEEDING: Formatting ${productsData.length} products...`);
    
    const mappedProducts = productsData.map((p) => {
      const price1 = Number(p.price || 25.0);
      const price2 = Number(p.price_tier_2 || (price1 * 0.85));
      const price3 = Number(p.price_tier_3 || (price1 * 0.70));
      
      const imageUrl = Array.isArray(p.images) && p.images.length > 0 
        ? p.images[0] 
        : (typeof p.images === 'string' ? p.images : null);

      return {
        id: p.id,
        title: p.name,
        description: p.description || '',
        price_tier_1: price1,
        price_tier_2: price2,
        price_tier_3: price3,
        category: p.category || 'Grooming Shears',
        image_url: imageUrl,
        steel_type: getSteelType(p),
        hardness: getHardness(p)
      };
    });

    console.log("📤 Sending to Supabase products table...");
    
    const { error } = await supabase
      .from('products')
      .upsert(mappedProducts, { onConflict: 'id' });

    if (error) {
      console.error("❌ SUPABASE MIGRATION FAILURE:", error.message, error.details);
      process.exit(1);
    }

    console.log(`\n==================================================`);
    console.log(`✅ Successfully seeded ${mappedProducts.length} products into Supabase.`);
    console.log(`==================================================\n`);
  } catch (err) {
    console.error("❌ Seeding failed with fatal error:", err);
    process.exit(1);
  }
}

seed();
