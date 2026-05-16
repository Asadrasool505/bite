import productsData from "../../products.json";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section id="collection" className="py-24 px-8 min-h-screen w-full bg-[#050814]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-gray-200 mb-6">
            Professional Grooming Essentials
          </h2>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {productsData
            .filter((product: any) => product.on_main_page !== false)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
}
