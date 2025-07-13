import { Client } from '@notionhq/client';

export class NotionBaseService {
  protected notion: Client;

  constructor() {
    this.notion = new Client({
      auth: import.meta.env.NOTION_API_KEY,
    });
  }

  protected async queryDatabase(databaseId: string, options: any = {}) {
    try {
      return await this.notion.databases.query({
        database_id: databaseId,
        ...options,
      });
    } catch (error) {
      console.error(`Error querying Notion database ${databaseId}:`, error);
      throw error;
    }
  }
}