import { projects } from '../../data/projects'
import ProjectCard from '../../components/ProjectCard'

export default function ProjectsPage() {
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">我的作品集</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}
