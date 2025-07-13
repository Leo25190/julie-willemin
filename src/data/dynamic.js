import { notionContentService } from '../services/notion-services/index.ts';

// Static fallback data
const staticData = {
  myBio: `Un pb est survenu, impossible de charger le contenu depuis Notion. Voici un aperçu de mon parcours`,

  aboutMe: `Un pb est survenu, impossible de charger le contenu depuis Notion. Voici un aperçu de mon parcours`,

  contactText: `Un pb est survenu, impossible de charger le contenu depuis Notion. Voici un aperçu de mon parcours`,
};

// Function to get content from Notion with fallback
export async function getDynamicContent() {
  const databaseId = '22f2a789ee4c8086af2beb86ac6eb926';

  try {
    const sections = await notionContentService.getContentSections(databaseId);

    // Create content object from Notion data
    const content = {};
    sections.forEach((section) => {
      const key = section.title.toLowerCase().replace(/\s+/g, '');
      content[key] = section.content;
    });

    // Return with fallbacks
    return {
      myBio: content.mybio || content.bio || staticData.myBio,
      aboutMe: content.aboutme || content.about || staticData.aboutMe,
      contactText:
        content.contacttext || content.contact || staticData.contactText,
    };
  } catch (error) {
    console.error(
      'Failed to fetch content from Notion, using static data:',
      error
    );
    return staticData;
  }
}
