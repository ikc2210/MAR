import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/projects');

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  dateRange: string;
  status?: string;
}

export function getAllProjectSlugs(): string[] {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getProjectBySlug(slug: string): { meta: ProjectMeta; content: string } {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: data.tags ?? [],
      dateRange: data.dateRange ?? '',
      status: data.status,
    },
    content,
  };
}

export function getAllProjects(): ProjectMeta[] {
  return getAllProjectSlugs().map((slug) => getProjectBySlug(slug).meta);
}
