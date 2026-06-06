import { blogPosts } from "@/data/blogs";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | Bite Instruments Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const categoryColors: Record<string, string> = {
    "Buying Guide": "bg-amber-500/15 text-amber-700 border-amber-500/30",
    "Safety & Compliance": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    "Manufacturing Science": "bg-blue-500/15 text-blue-700 border-blue-500/30",
    "Product Strategy": "bg-purple-500/15 text-purple-700 border-purple-500/30",
  };

  // Parse simple markdown-style bold and paragraphs
  const renderContent = (raw: string) => {
    return raw.split("\n\n").map((block, i) => {
      if (block.startsWith("**") && block.endsWith("**") && !block.slice(2).includes("**")) {
        return (
          <h3 key={i} className="text-lg font-bold text-slate-900 mt-8 mb-3 tracking-wide">
            {block.replace(/\*\*/g, "")}
          </h3>
        );
      }
      // Inline bold rendering
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-slate-700 text-base font-light leading-relaxed mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold text-slate-900">
                {part.replace(/\*\*/g, "")}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-10">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Article Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 flex-wrap mb-5">
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
          <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-500 text-sm font-light leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] font-black">B</span>
            {post.author}
          </div>
        </div>

        {/* Divider */}
        <div className={`h-1 rounded-full bg-gradient-to-r ${post.coverColor} mb-10`} />

        {/* Article Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back + CTA Row */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200">
          <Link
            href="/blog"
            className="flex-1 text-center py-4 rounded-xl border border-slate-200 font-bold uppercase tracking-widest text-xs text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-all"
          >
            ← Back to All Articles
          </Link>
          <Link
            href="/checkout"
            className="flex-1 text-center py-4 rounded-xl bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
          >
            Request Wholesale Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
