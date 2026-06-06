import { blogPosts } from "@/data/blogs";
import Link from "next/link";

export default function BlogFeedPreview() {
  const previewPosts = blogPosts.slice(0, 3);

  return (
    <section className="w-full bg-[#F4F5F7] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase mb-2">
              📰 Industry Intelligence
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-black tracking-wide">
              B2B Expert{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Resources
              </span>
            </h2>
            <p className="text-slate-500 text-sm font-light mt-2 max-w-md leading-relaxed">
              Science-backed guides for wholesale buyers, distributors, and salon operators.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 hover:border-amber-500 hover:text-amber-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-200"
          >
            View All Articles ➔
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewPosts.map((post) => {
            const categoryColors: Record<string, string> = {
              "Buying Guide": "text-amber-600",
              "Safety & Compliance": "text-emerald-600",
              "Manufacturing Science": "text-blue-600",
              "Product Strategy": "text-purple-600",
            };

            return (
              <article
                key={post.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top colour stripe */}
                <div className={`h-1.5 bg-gradient-to-r ${post.coverColor}`} />

                <div className="p-6">
                  {/* Category + read time */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${categoryColors[post.category] ?? "text-slate-500"}`}>
                      {post.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[9px] text-slate-400 font-medium">{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-500 font-light leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read CTA */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Read Article
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
