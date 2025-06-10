'use client';

import { motion } from 'framer-motion';
import { useEffect, MouseEvent } from 'react';
import { Project } from '../data/projects';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ProjectModal({ project, onClose, onNext, onPrev }: ProjectModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev]);

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-800 rounded-2xl p-11 max-w-2xl w-full shadow-2xl"
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full shadow-md transition"
        >
          <X size={36} className="text-cyan-400 hover:text-cyan-600" />
        </button>

        {/* 左右箭頭 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-[-12px] top-1/2 p-2 rounded-full transition z-100"
        >
          <ChevronLeft size={60} className="text-cyan-400 hover:text-cyan-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-[-12px] top-1/2 p-2 rounded-full transition z-100"
        >
          <ChevronRight size={60} className="text-cyan-400 hover:text-cyan-600" />
        </button>

        {/* 內容區塊 */}
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">{project.title}</h2>

        <div className="w-full h-64 relative mb-6">
          <Image src={project.image} alt={project.title} fill className="object-cover rounded-lg" />
        </div>

        {typeof project.detail === 'string' ? (
          <p className="text-gray-300 mb-6 whitespace-pre-line">{project.detail}</p>
        ) : (
          <ul className="list-disc pl-5 text-gray-300 mb-6">
            {project.detail.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        <p className="text-gray-300 mb-4">{project.description}</p>
        <p className="text-gray-400 mb-6 leading-relaxed whitespace-pre-line">{project.detail}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs bg-cyan-900 text-cyan-300 px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <a
            href={project.demo}
            target="_blank"
            className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition text-sm"
          >
            查看 Demo
          </a>
          <a
            href={project.github}
            target="_blank"
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-300 hover:text-black transition text-sm"
          >
            查看 GitHub
          </a>
        </div>
      </motion.div>
    </div>
  );
}
