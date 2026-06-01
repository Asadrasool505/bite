import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import HomeOEMTeaser from "@/components/HomeOEMTeaser";
import ExplodedView3D from "@/components/ExplodedView3D";
import ProductGrid from "@/components/ProductGrid";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-[#050814]">
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
