import { Client } from '@notionhq/client';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

// Types for Notion properties
export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: any;
}

export interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
  created_time: string;
  last_edited_time: string;
}

export interface NotionResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

// Generic type for extracted data
export type ExtractedData = Record<string, any>;

// Imgur size suffixes for different image sizes
export type ImgurSize = 's' | 't' | 'm' | 'l' | 'h' | 'original';

// Utility function to transform imgur URLs with size parameter
function transformImgurUrl(url: string, size: ImgurSize = 'original'): string {
  if (!url || size === 'original') return url;
  
  // Check if it's an imgur URL
  const imgurRegex = /^https?:\/\/(i\.)?imgur\.com\/([a-zA-Z0-9]+)(\.[a-zA-Z]+)?$/;
  const match = url.match(imgurRegex);
  
  if (match) {
    const imageId = match[2];
    const extension = match[3] || '.jpg';
    return `https://i.imgur.com/${imageId}${size}${extension}`;
  }
  
  return url;
}

// Property extractors configuration by type
const propertyExtractors = {
  title: (property: NotionProperty) => property.title?.[0]?.plain_text || '',

  rich_text: (property: NotionProperty) =>
    property.rich_text?.[0]?.plain_text || '',

  url: (property: NotionProperty) => property.url || null,

  date: (property: NotionProperty) => property.date?.start || null,

  checkbox: (property: NotionProperty) => property.checkbox || false,

  select: (property: NotionProperty) => property.select?.name || null,

  multi_select: (property: NotionProperty) =>
    property.multi_select?.map((item: any) => item.name) || [],

  number: (property: NotionProperty) => property.number || null,

  files: (property: NotionProperty) => {
    if (!property.files || property.files.length === 0) return null;
    const file = property.files[0];
    return file.type === 'file' ? file.file.url : file.external.url;
  },
};

// Function to extract property value
function extractPropertyValue(property: NotionProperty): any {
  const extractor =
    propertyExtractors[property.type as keyof typeof propertyExtractors];
  return extractor ? extractor(property) : null;
}

// Function to transform Notion page to simple object
function transformNotionPage(page: NotionPage): ExtractedData {
  const result: ExtractedData = {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
  };

  // Extract all properties
  Object.entries(page.properties).forEach(([name, property]) => {
    result[name] = extractPropertyValue(property);
  });

  return result;
}

// Main service
export class NotionService {
  // Base query for a database
  async queryDatabase(
    databaseId: string,
    options?: {
      sorts?: Array<{
        property: string;
        direction: 'ascending' | 'descending';
      }>;
      filter?: any;
      page_size?: number;
    }
  ): Promise<ExtractedData[]> {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: options?.sorts || [],
        filter: options?.filter,
        page_size: options?.page_size || 100,
      });

      return response.results.map((page) =>
        transformNotionPage(page as NotionPage)
      );
    } catch (error) {
      console.error('Error querying Notion database:', error);
      return [];
    }
  }

  // Specific method for gallery
  async getGalleryImages(databaseId: string, imgurSize: ImgurSize = 'original'): Promise<GalleryImage[]> {
    const data = await this.queryDatabase(databaseId, {
      sorts: [{ property: 'Date', direction: 'descending' }],
    });

    return data.map((item) => ({
      id: item.id,
      title: item.Titre || '',
      description: item.Description || '',
      image: transformImgurUrl(item.Image || '', imgurSize),
      alt: item.Titre || '',
      category: item.Category || '',
      date: item.Date || '',
      featured: item.Featured || false,
    }));
  }

  // Method to get featured images only
  async getFeaturedImages(databaseId: string, imgurSize: ImgurSize = 'original'): Promise<GalleryImage[]> {
    const data = await this.queryDatabase(databaseId, {
      filter: {
        property: 'Featured',
        checkbox: {
          equals: true,
        },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
    });

    return data.map((item) => ({
      id: item.id,
      title: item.Titre || '',
      description: item.Description || '',
      image: transformImgurUrl(item.Image || '', imgurSize),
      alt: item.Titre || '',
      category: item.Category || '',
      date: item.Date || '',
      featured: item.Featured || false,
    }));
  }
}

// Specific types for gallery
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  date: string;
  featured: boolean;
}

// Service instance
export const notionService = new NotionService();
