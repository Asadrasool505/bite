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

  let product: any = null;

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
    console.error("Supabase dynamic fetch failed, using local fallback:", err);
  }

  if (!product) {
    product = productsData.find((p) => p.id === id);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

