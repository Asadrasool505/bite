"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  features?: string[];
  on_main_page?: boolean;
  technical_specifications?: {
    handle: string;
    edge: string;
    material: string;
    sizes: string[];
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const displayImage = product?.images && product.images.length > 0 
    ? product.images[0] 
    : "/assets/placeholder.png";

  return (
    <Link href={`/product/${product?.id}`} className="block h-full group">
      <div className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-white/5 bg-white/5 backdrop-blur-sm h-full group-hover:-translate-y-1 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.2)] flex flex-col">
        <div className="aspect-square relative w-full flex items-center justify-center p-6 bg-[#0A1128]/50">
          <Image
            src={displayImage}
            alt={product?.name || "Product Image"}
            fill
            className="object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-3 transition-colors text-gray-200 group-hover:text-yellow-400">
            {product?.name}
          </h3>
          <div className="text-xs md:text-sm text-gray-400 mb-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
          
          <div className="mt-auto pt-6 border-t border-yellow-500/10">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-yellow-500">Technical Specs:</p>
            <ul className="text-xs text-gray-400 space-y-2 mb-6">
              <li><strong className="text-gray-300">Handle:</strong> {product?.technical_specifications?.handle || "Ergonomic Offset"}</li>
              <li><strong className="text-gray-300">Edge:</strong> {product?.technical_specifications?.edge || "Semi-Convex"}</li>
            </ul>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-full text-center py-3 rounded-full font-bold uppercase tracking-widest text-xs text-yellow-500 border border-yellow-500/30 transition-all group-hover:bg-gradient-to-r group-hover:from-yellow-100 group-hover:via-yellow-400 group-hover:to-yellow-600 group-hover:text-[#0A1128] group-hover:border-transparent"
            >
              Add to Quote
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
