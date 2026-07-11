import React from 'react';

const HeroLanding = () => {
  const handleScroll = () => {
    const catalog = document.getElementById('product-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Live Wood Carving */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/ram_mandir_bg.png')" }}
        />
        {/* Darkened Overlay to ensure text pops and imagery feels moody/authentic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[1px]"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold text-[#f5ebd7] mb-4 tracking-wide drop-shadow-2xl">
            Vishwakarma Wood Art
          </h1>
          <p className="text-lg md:text-2xl text-stone-300 mb-12 max-w-3xl mx-auto font-light tracking-wide italic drop-shadow-xl border-t border-white/20 pt-4 mt-2">
            Crafting Divine Sanctums for Your Home. Preserving generational woodcraft traditions.
          </p>
          
          {/* Luxury Prominent CTA Button - Dark Brown with Gold Text */}
          <button 
            onClick={handleScroll}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-[#e6b35e] transition-all duration-300 bg-[#3e2723] border border-[#e6b35e] rounded-sm hover:bg-[#2c1b18] hover:shadow-[0_4px_30px_rgba(230,179,94,0.3)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e6b35e] uppercase tracking-[0.2em] cursor-pointer"
          >
            <span className="mr-3 text-lg">Discover the Divine</span>
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-y-1 text-[#e6b35e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Trust Signal Banner */}
      <div className="w-full bg-warm border-y border-[#d4af37]/20 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-stone-850 font-sans">
            <span className="text-[#d4af37] text-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="none" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </span>
            <span className="text-sm md:text-base tracking-wide font-medium text-stone-700">
              Proudly delivering handcrafted sanctums to Gujarati homes across the <span className="font-bold text-stone-900">UK</span>, <span className="font-bold text-stone-900">USA</span> & <span className="font-bold text-stone-900">Canada</span>.
            </span>
          </div>
          <div className="flex gap-3 items-center justify-center flex-wrap">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-bold text-stone-700 hover:-translate-y-0.5 transition-transform duration-300 select-none">
              <span className="text-sm">🇬🇧</span> UK
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-bold text-stone-700 hover:-translate-y-0.5 transition-transform duration-300 select-none">
              <span className="text-sm">🇺🇸</span> USA
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-sm text-xs font-bold text-stone-700 hover:-translate-y-0.5 transition-transform duration-300 select-none">
              <span className="text-sm">🇨🇦</span> Canada
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroLanding;
