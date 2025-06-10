'use client';

import PageTransition from '../../components/PageTransition';
import { Project, projects } from '../../data/projects';
import ProjectCard from '../../components/ProjectCard';
import TagButton from '../../components/TagButton';
import ProjectModal from '../../components/ProjectModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };
const allTags: string[] = Array.from(new Set(projects.flatMap((p: Project) => p.techStack)));

export default function ProjectsPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const filteredProjects: Project[] = projects.filter(
    (p: Project) =>
      selectedTags.length === 0 || p.techStack.some((t: string) => selectedTags.includes(t))
  );

  const getNextProject = (): Project | null => {
    if (!selectedProject) return null;
    const idx = filteredProjects.findIndex((p: Project) => p.title === selectedProject.title);
    return filteredProjects[(idx + 1) % filteredProjects.length] || null;
  };

  const getPrevProject = (): Project | null => {
    if (!selectedProject) return null;
    const idx = filteredProjects.findIndex((p: Project) => p.title === selectedProject.title);
    return filteredProjects[(idx - 1 + filteredProjects.length) % filteredProjects.length] || null;
  };

  return (
    <PageTransition>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-cyan-400">我的作品集</h1>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {allTags.map((tag: string) => (
            <TagButton
              key={tag}
              tag={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTags.join(',')}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid gap-16"
          >
            {filteredProjects.map((project: Project, idx: number) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={idx}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onNext={() => setSelectedProject(getNextProject())}
              onPrev={() => setSelectedProject(getPrevProject())}
            />
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}
