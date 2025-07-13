import { NotionBaseService } from './notion-base-service';

export interface ContentSection {
  id: string;
  title: string;
  content: string;
}

export class NotionContentService extends NotionBaseService {
  private mapPageToContentSection(page: any): ContentSection {
    return {
      id: page.id,
      title: page.properties.Nom?.title?.[0]?.plain_text || '',
      content: page.properties.Contenu?.rich_text?.[0]?.plain_text || '',
    };
  }

  async getContentSections(databaseId: string): Promise<ContentSection[]> {
    try {
      const response = await this.queryDatabase(databaseId, {
        sorts: [{ property: 'Nom', direction: 'ascending' }],
      });

      return response.results.map((page: any) => 
        this.mapPageToContentSection(page)
      );
    } catch (error) {
      console.error('Error querying Notion content:', error);
      return [];
    }
  }
}

// Service instance
export const notionContentService = new NotionContentService();