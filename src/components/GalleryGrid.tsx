import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  date: string;
  featured: boolean;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Get all unique categories
  const categories = [
    'all',
    ...new Set(images.map((img) => img.category).filter(Boolean)),
  ];

  // Filter images by category
  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='w-full'>
      {/* Category filters */}
      {categories.length > 1 && (
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      >
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            variants={item}
            className='group relative aspect-square overflow-hidden rounded-lg cursor-pointer'
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.image}
              alt={image.alt}
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center'>
              <div className='text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4'>
                <h3 className='font-semibold text-lg mb-1'>{image.title}</h3>
                {image.category && (
                  <span className='text-sm bg-primary px-2 py-1 rounded'>
                    {image.category}
                  </span>
                )}
                {image.featured && (
                  <div className='mt-2'>
                    <span className='text-xs bg-yellow-500 px-2 py-1 rounded'>
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredImages.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500'>No images found for this category.</p>
        </div>
      )}

      {/* Modal for selected image */}
      {selectedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className='bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-4xl max-h-[90vh] w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative'>
              <img
                src={selectedImage.image}
                alt={selectedImage.alt}
                className='w-full max-h-[70vh] object-contain'
              />
              <button
                onClick={() => setSelectedImage(null)}
                className='absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75'
              >
                <X className='w-6 h-6' />
              </button>
            </div>
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-2'>{selectedImage.title}</h2>
              {selectedImage.description && (
                <p className='text-gray-600 dark:text-gray-300 mb-3'>
                  {selectedImage.description}
                </p>
              )}
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  {selectedImage.category && (
                    <span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.featured && (
                    <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm'>
                      Featured
                    </span>
                  )}
                </div>
                <span className='text-sm text-gray-500'>
                  {new Date(selectedImage.date).toLocaleDateString('en-US')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
