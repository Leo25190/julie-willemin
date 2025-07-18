import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GalleryImage } from '../types';

interface ImageCarouselProps {
  images: GalleryImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  // Preload current, next, and previous images
  useEffect(() => {
    const imagesToLoad = new Set<number>();
    
    // Always load current image
    imagesToLoad.add(currentIndex);
    
    // Load next image
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    imagesToLoad.add(nextIndex);
    
    // Load previous image
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    imagesToLoad.add(prevIndex);

    // Update loaded images state
    setLoadedImages(prev => {
      const newSet = new Set([...prev, ...imagesToLoad]);
      return newSet;
    });

    // Preload the images
    imagesToLoad.forEach(index => {
      if (images[index]) {
        const img = new Image();
        img.src = images[index].image;
      }
    });
  }, [currentIndex, images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>Aucune image à afficher</p>
      </div>
    );
  }

  return (
    <div className='relative w-full max-w-4xl mx-auto'>
      {/* Image principale */}
      <div className='relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0'
          >
            <img
              src={images[currentIndex].image}
              alt={images[currentIndex].alt}
              className='w-full h-full object-cover'
              loading={loadedImages.has(currentIndex) ? 'eager' : 'lazy'}
              onLoad={() => setLoadedImages(prev => new Set([...prev, currentIndex]))}
            />
            <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end'>
              <div className='p-4 text-white w-full'>
                <h3 className='text-lg md:text-xl font-semibold mb-1'>
                  {images[currentIndex].title}
                </h3>
                {images[currentIndex].tags.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {images[currentIndex].tags.map((tag, index) => (
                      <span 
                        key={index}
                        className='inline-block px-2 py-1 bg-primary rounded text-xs'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200'
              aria-label='Image précédente'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200'
              aria-label='Image suivante'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </>
        )}
      </div>

      {/* Indicateurs */}
      {images.length > 1 && (
        <div className='flex justify-center mt-4 space-x-3'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-5 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bouton voir plus */}
      <div className='text-center mt-6'>
        <a
          href='/gallery'
          className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-colors duration-300 font-medium'
        >
          <Eye className='w-5 h-5' />
          Voir toute la galerie
        </a>
      </div>
    </div>
  );
}
