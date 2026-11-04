import { useState, type ReactNode } from 'react';
import type { Project } from '../lib/parseReply';

function Thumbnail({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <div className="project__thumb">
      <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    </div>
  );
}

function Card({ project }: { project: Project }) {
  const body: ReactNode = (
    <>
      <Thumbnail src={project.thumbnail} />
      <div className="project__text">
        <h3>{project.title}</h3>
        {project.description && <p>{project.description}</p>}
      </div>
    </>
  );

  if (!project.link) return <div className="project">{body}</div>;
  return (
    <a className="project" href={project.link} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  );
}

export function ProjectCards({ projects }: { projects: Project[] }) {
  return (
    <div className="projects">
      {projects.map((project) => (
        <Card key={project.title} project={project} />
      ))}
    </div>
  );
}

export function ProjectsLoading() {
  return (
    <div className="projects" aria-label="Loading projects">
      <div className="project project--loading" />
      <div className="project project--loading" />
    </div>
  );
}
