import { notFound } from "next/navigation";
import productsData from "../../../../products.json";
import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from "@/lib/supabaseClient";

export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  // Prioritize local products.json file dataset first to eliminate database loading lag
  let product = productsData.find((p) => p.id === id);

  // If not found in local products.json, fetch dynamically from Supabase
  if (!product) {
    try {
      const { data, error } = await supabase
        .from('pet_products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        product = data;
      }
    } catch (err) {
      console.error("Supabase dynamic fetch failed for new product:", err);
    }
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

