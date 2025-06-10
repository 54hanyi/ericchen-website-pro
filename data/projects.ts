import projectsData from './projects.json';

export interface Project {
  title: string;
  description: string;
  detail: string; // Markdown string
  image: string;
  techStack: string[];
  demo: string;
  github: string;
}

export const projects: Project[] = projectsData;
