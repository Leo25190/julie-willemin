import { defineCollection, z } from 'astro:content';

const galleryCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    featured: z.boolean().default(false),
    date: z
      .string()
      .refine(
        (date) => {
          // Valide que la string peut être convertie en date
          return !isNaN(Date.parse(date));
        },
        {
          message: 'Date must be a valid date string (YYYY-MM-DD)',
        }
      )
      .transform((str) => new Date(str)),
    category: z.string().optional(),
    alt: z.string().optional(),
  }),
});

export const collections = {
  gallery: galleryCollection,
};
