import { defineCollection, z } from 'astro:content';

const galleryCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    featured: z.boolean().default(false),
    date: z.date(),
    category: z.string().optional(),
    alt: z.string().optional(),
  }),
});

export const collections = {
  gallery: galleryCollection,
};
