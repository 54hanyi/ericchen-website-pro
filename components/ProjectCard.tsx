'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const fromX = index % 2 === 0 ? -1000 : 1000;

  const cardVariants = {
    hidden: { opacity: 0, x: fromX },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'tween',
        ease: 'linear',
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      onClick={onClick}
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        boxShadow: '0px 10px 30px rgba(0, 255, 255, 0.15)',
      }}
      className="cursor-pointer flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-400 transition min-h-[360px]"
    >
      <div className="relative w-full md:w-2/5 h-60 md:h-auto">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-cyan-400 mb-3">{project.title}</h3>
          <p className="text-gray-300 mb-5 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs bg-cyan-900 text-cyan-300 px-3 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href={project.demo}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition text-sm"
          >
            Demo
          </Link>
          <Link
            href={project.github}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-300 hover:text-black transition text-sm"
          >
            GitHub
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
