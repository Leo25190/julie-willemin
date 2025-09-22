import { NotionBaseService } from './notion-base-service';

export interface ActivityItem {
  id: string;
  name: string;
  type: string[];
  dates: { start: string; end?: string };
  location?: string;
  summary: string;
  slug: string;
}

export class NotionActivitiesService extends NotionBaseService {
  private getProp(page: any, keys: string[]): any {
    for (const key of keys) {
      if (page.properties?.[key] != null) return page.properties[key];
    }
    return undefined;
  }

  private plainText(prop: any): string {
    if (!prop) return '';
    if (prop.type === 'title' || prop.type === 'rich_text') {
      const arr = prop[prop.type] as any[];
      return arr?.map((t: any) => t.plain_text).join('') ?? '';
    }
    if (typeof prop === 'string') return prop;
    return '';
  }

  private multiSelectNames(prop: any): string[] {
    if (!prop || prop.type !== 'multi_select') return [];
    return (prop.multi_select as any[])?.map((o: any) => o.name) ?? [];
  }

  private dateRange(prop: any): { start: string; end?: string } {
    if (!prop || prop.type !== 'date') return { start: '' };
    return { start: prop.date?.start ?? '', end: prop.date?.end ?? undefined };
  }

  private slugFrom(prop: any, fallbackName: string): string {
    // Formula or text
    if (!prop) return this.slugify(fallbackName);
    if (prop.type === 'rich_text') {
      const t = this.plainText(prop).trim();
      return t || this.slugify(fallbackName);
    }
    if (prop.type === 'formula') {
      const f = prop.formula?.string ?? '';
      return f || this.slugify(fallbackName);
    }
    return this.slugify(fallbackName);
  }

  private slugify(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private mapPage(page: any): ActivityItem {
    const nameProp = this.getProp(page, ['Titre', 'Name', 'Nom']);
    const typeProp = this.getProp(page, [
      'Type',
      'Activity Type',
      'Activité',
      'Activite',
    ]);
    const startDateProp = this.getProp(page, [
      'Début',
      'Start',
      'Dates',
      'Date',
    ]);
    const endDateProp = this.getProp(page, ['Fin', 'End']);
    const locationProp = this.getProp(page, ['Lieu', 'Location']);
    const summaryProp = this.getProp(page, [
      'Description',
      'Short summary',
      'Résumé',
      'Resume',
      'Summary',
    ]);
    const structureProp = this.getProp(page, [
      'Structure',
      'Organisation',
      'Organization',
    ]);
    const slugProp = this.getProp(page, ['Slug']);

    const name = this.plainText(nameProp);

    // Handle Type - it's a select, not multi_select in your database
    let type: string[] = [];
    if (typeProp && typeProp.type === 'select' && typeProp.select) {
      type = [typeProp.select.name];
    } else {
      type = this.multiSelectNames(typeProp);
    }

    // Handle separate start and end dates
    const startDate = this.dateRange(startDateProp).start;
    const endDate = this.dateRange(endDateProp).start;
    const dates = {
      start: startDate,
      end: endDate || undefined,
    };

    const location =
      this.plainText(locationProp) ||
      this.plainText(structureProp) ||
      undefined;
    const summary = this.plainText(summaryProp);
    const slug = this.slugFrom(slugProp, name);

    return {
      id: page.id,
      name,
      type,
      dates,
      location,
      summary,
      slug,
    };
  }

  async getActivities(): Promise<ActivityItem[]> {
    const databaseId = import.meta.env.NOTION_ACTIVITIES_DATABASE_ID;
    if (!databaseId) {
      throw new Error(
        'NOTION_ACTIVITIES_DATABASE_ID environment variable is not set'
      );
    }

    const response = await this.queryDatabase(databaseId, {
      sorts: [
        { property: 'Début', direction: 'descending' },
        { property: 'Titre', direction: 'ascending' },
      ],
    });
    return response.results.map((p: any) => this.mapPage(p));
  }
}

export const notionActivitiesService = new NotionActivitiesService();
