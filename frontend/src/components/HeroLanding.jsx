import React from 'react';

const HeroLanding = () => {
  const handleScroll = () => {
    const catalog = document.getElementById('product-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
          Crafting Divine Sanctums for Your Home. Since [Insert Year Your Family Started].
        </p>
        
        {/* Luxury Prominent CTA Button - Dark Brown with Gold Text */}
        <button 
          onClick={handleScroll}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-[#e6b35e] transition-all duration-300 bg-[#3e2723] border border-[#e6b35e] rounded-sm hover:bg-[#2c1b18] hover:shadow-[0_4px_30px_rgba(230,179,94,0.3)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e6b35e] uppercase tracking-[0.2em]"
        >
          <span className="mr-3 text-lg">Discover the Divine</span>
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-y-1 text-[#e6b35e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroLanding;
