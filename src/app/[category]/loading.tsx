export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full bg-[#050814] flex flex-col items-center justify-center">
      {/* Luxury pulsing gold ring */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-t-2 border-r-2 border-yellow-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-2 border-l-2 border-yellow-300 rounded-full animate-spin duration-700 reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-500 font-serif text-sm tracking-widest uppercase">Bite</span>
        </div>
      </div>
      <p className="text-gray-400 text-xs font-medium tracking-[0.2em] uppercase animate-pulse">Loading Catalog...</p>
    </div>
  );
}
