import { X } from 'lucide-react';
import { useState } from 'react';
import type { GalleryImage } from '../types';

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Get all unique tags
  const allTags = [
    'all',
    ...new Set(images.flatMap((img) => img.tags).filter(Boolean)),
  ];

  // Filter images by tag
  const filteredImages =
    selectedTag === 'all'
      ? images
      : images.filter((img) => img.tags.includes(selectedTag));

  return (
    <div className='w-full'>
      {/* Tag filters */}
      {allTags.length > 1 && (
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className='px-4 py-2 rounded-full transition-colors'
              style={{
                backgroundColor:
                  selectedTag === tag
                    ? 'var(--color-primary)'
                    : 'var(--color-button)',
                color: selectedTag === tag ? 'white' : 'var(--text)',
              }}
            >
              {tag === 'all' ? 'All' : tag}
            </button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className='group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-200'
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.image}
              alt={image.alt}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center'>
              <div className='text-white text-center opacity-0 group-hover:opacity-100 transition-opacity p-4'>
                <h3 className='font-semibold text-lg mb-2'>{image.title}</h3>
                {image.tags.length > 0 && (
                  <div className='flex flex-wrap justify-center gap-1'>
                    {image.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='text-xs px-2 py-1 rounded-full'
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className='text-center py-8'>
          <p style={{ color: 'var(--text)', opacity: 0.6 }}>
            No images found for this tag.
          </p>
        </div>
      )}

      {/* Modal for selected image */}
      {selectedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <div
            className='rounded-lg overflow-hidden max-w-4xl max-h-[90vh] w-full'
            style={{ backgroundColor: 'rgb(var(--color-background))' }}
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
              <h2
                className='text-2xl font-bold mb-4'
                style={{ color: 'var(--text)' }}
              >
                {selectedImage.title}
              </h2>
              <div className='flex items-center justify-between'>
                {selectedImage.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {selectedImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='text-white px-3 py-1 rounded-full text-sm'
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <span
                  className='text-sm'
                  style={{ color: 'var(--text)', opacity: 0.6 }}
                >
                  {new Date(selectedImage.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
