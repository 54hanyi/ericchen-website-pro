import type { Frontmatter } from './frontmatter';

export type Note = {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  date?: string;
};

export interface NoteMeta {
  slug: string;
  frontmatter: Frontmatter;
}
