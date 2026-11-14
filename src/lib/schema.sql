-- SQL Schema for Bite Instruments Products Table & Storage
-- Run this directly in your Supabase SQL Editor (idempotent / safe to re-run)

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE,
    slug TEXT UNIQUE,
    name TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    steel_type TEXT DEFAULT 'Japanese 440C Stainless Steel',
    hardness TEXT DEFAULT '60-62 HRC Vacuum Heat Treated',
    size TEXT DEFAULT '5.0" - 10.0" (Custom Available)',
    sizes TEXT[],
    short_description TEXT,
    description TEXT,
    features TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    seo_keywords TEXT[],
    image_url TEXT,
    images TEXT[],
    price NUMERIC(10,2),
    price_tier_1 NUMERIC(10,2), -- 1-9 pcs (base retail/wholesale)
    price_tier_2 NUMERIC(10,2), -- 10-49 pcs (5% off)
    price_tier_3 NUMERIC(10,2), -- 50+ pcs (10% off)
    bulk_pricing JSONB DEFAULT '{}'::jsonb,
    technical_specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add new columns if public.products already existed
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

-- Indexes for fast lookup by slug & category
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON public.products (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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
END $$;

-- Storage bucket for optimized product WebP images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
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

-- Quotes table for export requests
CREATE TABLE IF NOT EXISTS public.quotes (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2),
    status TEXT DEFAULT 'pending'
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quotes' AND policyname = 'Allow public insert access'
    ) THEN
        CREATE POLICY "Allow public insert access" ON public.quotes FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quotes' AND policyname = 'Allow authenticated read access'
    ) THEN
        CREATE POLICY "Allow authenticated read access" ON public.quotes FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;
