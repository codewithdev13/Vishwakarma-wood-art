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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/hero_bg.png')" }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-[2px]"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
          Divine Craftsmanship. <br className="hidden md:block"/> Timeless Elegance.
        </h1>
        <p className="text-lg md:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-xl">
          Discover a curated collection of premium South Indian wooden temples and wood-turned art, meticulously handcrafted for your sacred space.
        </p>
        <button 
          onClick={handleScroll}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-wood rounded-full hover:bg-wood-dark hover:shadow-[0_0_25px_rgba(212,163,115,0.6)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood"
        >
          <span className="mr-2 text-lg uppercase tracking-wider">Discover the Divine</span>
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default HeroLanding;
