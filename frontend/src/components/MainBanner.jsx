import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const slides = [
  assets.banner1,
  assets.banner3,
  assets.banner4,
  assets.banner5,
  assets.main_banner_bg,
];

const AUTO_DELAY = 5000;

const MainBanner = () => {
  const [current, setCurrent] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const touchStartX = React.useRef(0);

  // ✅ Auto slide with pause on hover
  React.useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_DELAY);

    return () => clearInterval(interval);
  }, [isHovering]);

  // ✅ Manual controls
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // ✅ Touch swipe (mobile premium feel)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <div
      className="relative w-full h-[420px] md:h-[560px] overflow-hidden rounded-2xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ✅ Slides */}
      {slides.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="banner"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
            index === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* ✅ Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* ✅ Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-2xl text-white">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 animate-fadeInUp">
          Freshness you can trust, savings you will love
        </h1>

        <p className="text-sm md:text-base text-white/90 mb-6 animate-fadeInUp delay-100">
          Farm-fresh groceries delivered fast at unbeatable prices.
        </p>

        <div className="flex flex-wrap gap-4 animate-fadeInUp delay-200">
          {/* Primary */}
          <Link
            to="/products"
            className="flex items-center gap-2 bg-[#22A45D] hover:bg-[#1C8A4E] px-6 py-3 rounded-full font-semibold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Shop Now
            <img src={assets.white_arrow_icon} alt="arrow" className="w-4 h-4" />
          </Link>

          {/* Secondary */}
          <Link
            to="/products"
            className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Explore Deals
            <img src={assets.black_arrow_icon} alt="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ✅ Arrow Controls (appear on hover desktop) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition"
      >
        ›
      </button>

      {/* ✅ Progress bar timer (premium touch) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 overflow-hidden">
        <div
          key={current}
          className="h-full bg-[#22A45D] animate-progress"
        />
      </div>

      {/* ✅ Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-[#22A45D]" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
