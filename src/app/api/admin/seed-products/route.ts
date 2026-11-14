import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { productsData } from '@/data/products';

// Helper function to extract steel type dynamically
function getSteelType(p: any): string {
  if (p.technical_specifications?.material) {
    return p.technical_specifications.material;
  }
  if (p.steel_type) {
    return p.steel_type;
  }

  const desc = (p.description || '').toLowerCase();
  if (desc.includes('cobalt steel') || desc.includes('japanese cobalt')) {
    return 'Premium Japanese Cobalt Steel';
  }
  if (desc.includes('molybdenum steel') || desc.includes('molybdenum')) {
    return 'Level 3 Molybdenum Steel';
  }
  if (desc.includes('440c stainless steel') || desc.includes('440c')) {
    return 'Japanese 440C Stainless Steel (Custom Steel Available)';
  }
  if (desc.includes('j2 stainless steel') || desc.includes('j2 steel')) {
    return 'Premium Japanese J2 Stainless Steel';
  }

  return 'Japanese 440C Stainless Steel (Custom Steel Available)';
}

// Helper function to extract hardness dynamically
function getHardness(p: any): string {
  if (p.technical_specifications?.hardness_rating) {
    return p.technical_specifications.hardness_rating;
  }
  if (p.hardness) {
    return p.hardness;
  }

  const desc = p.description || '';
  const hrcMatch = desc.match(/HRC\s*([0-9]+[-±\s]*[0-9]*)/i);
  if (hrcMatch) {
    return `${hrcMatch[0].toUpperCase()} Vacuum Heat Treated`;
  }

  return '60-61 HRC Vacuum Heat Treated';
}

export async function GET() {
  try {
    console.log(`🚀 STARTING MIGRATION: Seeding ${productsData.length} products into public.products table...`);

    const mappedProducts = productsData.map((p: any) => {
      const price1 = Number(p.price_tier_1 ?? p.price ?? 29.0);
      const price2 = Number(p.price_tier_2 ?? Math.round(price1 * 0.95 * 100) / 100);
      const price3 = Number(p.price_tier_3 ?? Math.round(price1 * 0.90 * 100) / 100);

      const imageUrl = Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : (typeof p.images === 'string' ? p.images : p.image_url || null);

      const techSpecs = {
        ...(p.technical_specifications || {}),
        ...(p.sku ? { sku: p.sku } : {}),
        ...(Array.isArray(p.sizes) ? { sizes: p.sizes } : {}),
      };

      return {
        id: p.id,
        slug: p.slug || p.id,
        name: p.name || p.title,
        title: p.title || p.name,
        category: p.category || 'straight-scissors',
        color: p.color || techSpecs.finish || null,
        steel_type: getSteelType(p),
        hardness: getHardness(p),
        size: p.size || '5.0" - 10.0" (Custom Available)',
        short_description: p.short_description || null,
        description: p.description || '',
        features: Array.isArray(p.features) ? p.features : [],
        meta_title: p.meta_title || null,
        meta_description: p.meta_description || null,
        seo_keywords: Array.isArray(p.seo_keywords) ? p.seo_keywords : [],
        image_url: imageUrl,
        images: Array.isArray(p.images) ? p.images : (imageUrl ? [imageUrl] : []),
        price: price1,
        price_tier_1: price1,
        price_tier_2: price2,
        price_tier_3: price3,
        bulk_pricing: p.bulk_pricing || {
          qty_1_to_9: price1,
          qty_10_to_49: price2,
          qty_50_plus: price3,
        },
        technical_specifications: techSpecs,
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
