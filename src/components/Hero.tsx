import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    title: "Discover Literary Treasures"
  },
  {
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    title: "Explore New Worlds"
  },
  {
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    title: "Find Your Next Adventure"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center 
                         max-w-[90%] sm:max-w-[80%] md:max-w-[70%] leading-tight drop-shadow-lg">
              {image.title}
            </h1>
          </div>
        </div>
      ))}
      
      {/* Navigation Buttons - Hidden on smallest screens */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full 
                 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all
                 hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full 
                 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all
                 hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Touch Swipe Areas - Visible only on small screens */}
      <button
        onClick={prevSlide}
        className="sm:hidden absolute left-0 top-0 h-full w-1/4 opacity-0"
        aria-label="Previous slide"
      />
      <button
        onClick={nextSlide}
        className="sm:hidden absolute right-0 top-0 h-full w-1/4 opacity-0"
        aria-label="Next slide"
      />
    </div>
  );
};

export default Hero;