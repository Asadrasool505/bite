import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import HomeOEMTeaser from "@/components/HomeOEMTeaser";
import ExplodedView3D from "@/components/ExplodedView3D";
import ProductGrid from "@/components/ProductGrid";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-[#F4F5F7]">
      <Hero />
      <TrustBanner />
      <HomeOEMTeaser />
      <ExplodedView3D />
      <ProductGrid />
      <NewArrivals />
      <Testimonials />
    </main>
  );
}
