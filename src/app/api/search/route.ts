import { NextResponse } from 'next/server';
import { productsData } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toString() ?? '';

  // Clean and tokenize query
  const tokens = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // If no tokens, return all products (or empty) – here we return all
  const filtered = productsData.filter((product) => {
    const title = product.title?.toLowerCase() ?? '';
    // Explicitly type tag as string to avoid implicit 'any' in production builds
    const tags: string[] = product.tags?.map((t: string) => t.toLowerCase()) ?? [];
    const category = product.category?.toLowerCase() ?? '';

    // If no tokens, consider it a match (fallback)
    if (tokens.length === 0) return true;

    return tokens.some(
      (tok) =>
        title.includes(tok) ||
        category.includes(tok) ||
        tags.some((tag) => tag.includes(tok))
    );
  });

  // Ensure response is always a JSON array
  return NextResponse.json(filtered);
}
