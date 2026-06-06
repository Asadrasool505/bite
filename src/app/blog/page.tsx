import { blogPosts } from "@/data/blogs";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B Grooming Industry Blog | Bite Instruments Expert Resources",
  description:
    "Expert-authored articles on wholesale grooming scissors, 440C steel science, pet salon hygiene protocols, and grooming kit strategies for B2B buyers and distributors.",
};

export default function BlogPage() {
  const categoryColors: Record<string, string> = {
    "Buying Guide": "bg-amber-500/15 text-amber-700 border-amber-500/30",
    "Safety & Compliance": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    "Manufacturing Science": "bg-blue-500/15 text-blue-700 border-blue-500/30",
    "Product Strategy": "bg-purple-500/15 text-purple-700 border-purple-500/30",
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase mb-3">
            📰 Industry Intelligence
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 font-black tracking-wide mb-6">
            B2B Expert{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-slate-600 text-base font-light max-w-2xl mx-auto leading-relaxed">
            Expert-authored guides on wholesale procurement, material science, salon hygiene, and grooming kit strategy — written for commercial buyers, distributors, and salon operators.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Color Banner */}
              <div className={`h-3 bg-gradient-to-r ${post.coverColor}`} />

              <div className="p-8">
                {/* Meta Row */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      categoryColors[post.category] ?? "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{post.readTime}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-amber-700 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-200"
                  >
                    Read Article ➔
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 pointer-events-none" />
          <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-4">
            🏭 Ready to Order?
          </p>
          <h3 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
            Request a Factory-Direct Wholesale Quote
          </h3>
          <p className="text-slate-400 text-sm font-light mb-8 max-w-xl mx-auto leading-relaxed">
            Apply our B2B knowledge to your catalog strategy. Contact Bite Instruments for bulk pricing, sample kits, and custom OEM branding packages shipped from Sialkot.
          </p>
          <Link
            href="/checkout"
            className="inline-block px-10 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Submit Wholesale Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
