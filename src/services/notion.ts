import { Client } from '@notionhq/client';
import type { GalleryImage } from '../types';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

// Imgur size suffixes for different image sizes
export type ImgurSize = 's' | 't' | 'm' | 'l' | 'h' | 'original';

// Utility function to transform imgur URLs with size parameter
function transformImgurUrl(url: string, size: ImgurSize = 'original'): string {
  if (!url || size === 'original') return url;

  // Check if it's an imgur URL
  const imgurRegex =
    /^https?:\/\/(i\.)?imgur\.com\/([a-zA-Z0-9]+)(\.[a-zA-Z]+)?$/;
  const match = url.match(imgurRegex);

  if (match) {
    const imageId = match[2];
    const extension = match[3] || '.jpg';
    return `https://i.imgur.com/${imageId}${size}${extension}`;
  }

  return url;
}

// Simplified gallery-only service
export class NotionService {
  // Get all gallery images
  async getGalleryImages(
    databaseId: string,
    imgurSize: ImgurSize = 'original'
  ): Promise<GalleryImage[]> {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [{ property: 'Date', direction: 'descending' }],
      });

      return response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Titre?.title?.[0]?.plain_text || '',
        description:
          page.properties.Description?.rich_text?.[0]?.plain_text || '',
        image: transformImgurUrl(page.properties.Image?.url || '', imgurSize),
        alt: page.properties.Titre?.title?.[0]?.plain_text || '',
        category: page.properties.Category?.select?.name || '',
        date: page.properties.Date?.date?.start || '',
        featured: page.properties.Featured?.checkbox || false,
      }));
    } catch (error) {
      console.error('Error querying Notion gallery:', error);
      return [];
    }
  }

  // Get featured images only
  async getFeaturedImages(
    databaseId: string,
    imgurSize: ImgurSize = 'original'
  ): Promise<GalleryImage[]> {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Featured',
          checkbox: {
            equals: true,
          },
        },
        sorts: [{ property: 'Date', direction: 'descending' }],
      });

      return response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Titre?.title?.[0]?.plain_text || '',
        description:
          page.properties.Description?.rich_text?.[0]?.plain_text || '',
        image: transformImgurUrl(page.properties.Image?.url || '', imgurSize),
        alt: page.properties.Titre?.title?.[0]?.plain_text || '',
        category: page.properties.Category?.select?.name || '',
        date: page.properties.Date?.date?.start || '',
        featured: page.properties.Featured?.checkbox || false,
      }));
    } catch (error) {
      console.error('Error querying Notion featured images:', error);
      return [];
    }
  }
}

// Service instance
export const notionService = new NotionService();
