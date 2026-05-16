const fs = require('fs');
const path = require('path');

const categories = [
  "straight-shears", "curved-shears", "thinning-shears", "chunker-shears", "lefty-shears",
  "finishing-combs", "undercoat-rakes", "slicker-brushes",
  "essential-kits", "master-sets",
  "maintenance-oil", "shear-cases", "ring-inserts"
];

const basePath = "c:/Users/Administrator/Downloads/bite-instruments-web/src/app";

categories.forEach(cat => {
  const dir = path.join(basePath, cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const title = cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const componentName = title.replace(/ /g, '') + 'Page';
  
  const content = `import Link from "next/link";

export default function ${componentName}() {
  return (
    <div className="min-h-screen w-full bg-[#050814] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest mb-4">
            ${title}
          </h1>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
        </div>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center transition-all hover:border-yellow-500/30">
              <div className="w-full h-40 bg-black/20 rounded-xl mb-6 flex items-center justify-center border border-white/5">
                <span className="text-gray-600 text-sm font-medium tracking-widest uppercase">Placeholder</span>
              </div>
              <h3 className="text-white font-medium text-sm mb-2 uppercase tracking-wider">${title} Item {i + 1}</h3>
              <p className="text-yellow-500 font-bold tracking-widest text-sm">$0.00</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-gray-600 hover:border-white pb-1">
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log('Created ' + cat);
});
