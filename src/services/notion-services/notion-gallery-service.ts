import type { GalleryImage } from '../../types';
import { NotionBaseService } from './notion-base-service';

// Imgur size suffixes for different image sizes
export type ImgurSize = 's' | 't' | 'm' | 'l' | 'h' | 'original';

export class NotionGalleryService extends NotionBaseService {
  // Utility function to transform imgur URLs with size parameter
  private transformImgurUrl(url: string, size: ImgurSize = 'original'): string {
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

  private mapPageToGalleryImage(page: any, imgurSize: ImgurSize): GalleryImage {
    return {
      id: page.id,
      title: page.properties.Titre?.title?.[0]?.plain_text || '',
      image: this.transformImgurUrl(page.properties.Image?.url || '', imgurSize),
      alt: page.properties.Titre?.title?.[0]?.plain_text || '',
      tags: page.properties.Category?.rich_text?.[0]?.plain_text 
        ? page.properties.Category.rich_text[0].plain_text.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [],
      date: page.properties.Date?.date?.start || '',
      featured: page.properties.Featured?.checkbox || false,
    };
  }

  // Get all gallery images
  async getGalleryImages(
    databaseId: string,
    imgurSize: ImgurSize = 'original'
  ): Promise<GalleryImage[]> {
    try {
      const response = await this.queryDatabase(databaseId, {
        sorts: [{ property: 'Date', direction: 'descending' }],
      });

      return response.results.map((page: any) => 
        this.mapPageToGalleryImage(page, imgurSize)
      );
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
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Featured',
          checkbox: {
            equals: true,
          },
        },
        sorts: [{ property: 'Date', direction: 'descending' }],
      });

      return response.results.map((page: any) => 
        this.mapPageToGalleryImage(page, imgurSize)
      );
    } catch (error) {
      console.error('Error querying Notion featured images:', error);
      return [];
    }
  }
}

// Service instance
export const notionGalleryService = new NotionGalleryService();