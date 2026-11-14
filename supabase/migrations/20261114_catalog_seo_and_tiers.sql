-- Migration: Add SEO fields, color variant, and quantity-based bulk tier pricing (1-9, 10-49 5% off, 50+ 10% off)
-- Safe and idempotent for existing Bite Instruments Supabase databases.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS steel_type TEXT DEFAULT 'Japanese 440C Stainless Steel';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hardness TEXT DEFAULT '60-62 HRC Vacuum Heat Treated';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '5.0" - 10.0" (Custom Available)';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tier_1 NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tier_2 NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tier_3 NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS technical_specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill name/title and price/bulk_pricing on any existing rows where missing
UPDATE public.products
SET
    name = COALESCE(name, title),
    title = COALESCE(title, name),
    price = COALESCE(price, price_tier_1),
    price_tier_1 = COALESCE(price_tier_1, price),
    price_tier_2 = COALESCE(price_tier_2, ROUND(COALESCE(price, price_tier_1) * 0.95, 2)),
    price_tier_3 = COALESCE(price_tier_3, ROUND(COALESCE(price, price_tier_1) * 0.90, 2)),
    bulk_pricing = CASE
        WHEN bulk_pricing IS NULL OR bulk_pricing = '{}'::jsonb THEN
            jsonb_build_object(
                'qty_1_to_9', COALESCE(price_tier_1, price),
                'qty_10_to_49', COALESCE(price_tier_2, ROUND(COALESCE(price, price_tier_1) * 0.95, 2)),
                'qty_50_plus', COALESCE(price_tier_3, ROUND(COALESCE(price, price_tier_1) * 0.90, 2))
            )
        ELSE bulk_pricing
    END
WHERE price IS NOT NULL OR price_tier_1 IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON public.products (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- Ensure public product-images Storage bucket exists and allows public reads
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Allow catalog upsert access'
    ) THEN
        CREATE POLICY "Allow catalog upsert access" ON public.products FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read product-images'
    ) THEN
        CREATE POLICY "Public read product-images" ON storage.objects
            FOR SELECT USING (bucket_id = 'product-images');
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow upload product-images'
    ) THEN
        CREATE POLICY "Allow upload product-images" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'product-images');
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow update product-images'
    ) THEN
        CREATE POLICY "Allow update product-images" ON storage.objects
            FOR UPDATE USING (bucket_id = 'product-images');
    END IF;
END $$;

