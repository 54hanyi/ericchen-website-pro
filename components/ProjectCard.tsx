'use client';

import Link from 'next/link';
import { Project } from '../data/projects';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="border border-gray-700 p-6 rounded-xl bg-black hover:border-cyan-400 transition">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-400 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.map((tech) => (
          <span key={tech} className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-300">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <Link href={project.github} className="underline text-cyan-400">
          GitHub
        </Link>
        <Link href={project.demo} className="underline text-cyan-400">
          Demo
        </Link>
      </div>
    </div>
  );
}
