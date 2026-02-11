export type Article = {
  id: string;
  title: string;
  subtitle?: string;
  level: 1 | 2 | 3;
  readingTime: number;
  readingMinutes?: number;
  publishedAt: string;
  hook: string;
  learnings?: string[];
  sections?: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
  paragraphs?: string[];
  keyVocabulary?: string[];
  secondLens?: {
    title?: string;
    discussionTitle?: string;
    discussionParagraphs: string[];
    scriptureTitle?: string;
    scriptureReference?: string;
    scriptureVerses: string[];
    reference?: string;
    paragraphs?: string[];
  };
  bibleInsight?: {
    title: string;
    content: string;
    reference?: string;
  };
};
