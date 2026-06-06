import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { productsData } from '@/data/products';

// Helper function to extract steel type dynamically
function getSteelType(p: any): string {
  if (p.technical_specifications?.material) {
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
function getHardness(p: any): string {
  const desc = p.description || '';
  
  // Try to parse HRC values from the description text (e.g. HRC 58-60 or HRC 60±2)
  const hrcMatch = desc.match(/HRC\s*([0-9]+[-±\s]*[0-9]*)/i);
  if (hrcMatch) {
    return `${hrcMatch[0].toUpperCase()} Vacuum Heat Treated`;
  }
  
  const material = (p.technical_specifications?.material || '').toLowerCase();
  if (material.includes('vg10') || material.includes('cobalt')) {
    return '60-62 HRC Vacuum Heat Treated';
  }
  if (material.includes('j2')) {
    return '58-60 HRC Vacuum Heat Treated';
  }
  
  return '58-60 HRC Vacuum Heat Treated';
}

export async function GET() {
  try {
    console.log(`🚀 STARTING MIGRATION: Seeding ${productsData.length} products into public.products table...`);

    const mappedProducts = productsData.map((p: any) => {
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

    // To prevent hitting bulk insert constraints, we do it in a single high-performance upsert/insert statement
    const { data, error } = await supabase
      .from('products')
      .upsert(mappedProducts, { onConflict: 'id' });

    if (error) {
      console.error("❌ SUPABASE SEEDING FAILURE:", error.message, error.details);
      return NextResponse.json({ 
        success: false, 
        error: error.message, 
        details: error.details 
      }, { status: 500 });
    }

    console.log(`✅ SEEDING COMPLETE: Successfully seeded ${mappedProducts.length} products into Supabase.`);
    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${mappedProducts.length} products into Supabase.`,
      count: mappedProducts.length
    });

  } catch (error: any) {
    console.error('❌ SEEDING FATAL ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
