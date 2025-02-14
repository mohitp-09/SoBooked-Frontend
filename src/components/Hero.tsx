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
    <div className="relative h-[600px] overflow-hidden">
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
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
              {image.title}
            </h1>
          </div>
        </div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;