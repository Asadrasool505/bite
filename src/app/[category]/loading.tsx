export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full bg-[#F4F5F7] flex flex-col items-center justify-center">
      {/* Luxury pulsing gold ring */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-t-2 border-r-2 border-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-2 border-l-2 border-amber-300 rounded-full animate-spin duration-700"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-amber-600 font-serif text-sm tracking-widest uppercase font-bold">Bite</span>
        </div>
      </div>
      <p className="text-slate-900 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">Loading Catalog...</p>
    </div>
  );
}
