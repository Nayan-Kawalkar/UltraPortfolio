import { useId, useState, type ReactNode } from 'react';
import { site } from '../site.config';
import {
  ChevronIcon,
  FolderIcon,
  LinesIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  SparkOutline,
  XLogo,
} from './Icons';

interface SidebarProps {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onAskProject: (name: string) => void;
  onContact: () => void;
}

function LinkRow({ href, children }: { href: string; children: ReactNode }) {
  if (!href) {
    return (
      <span className="nav-row is-unset" aria-disabled="true" title="Link not added yet">
        {children}
      </span>
    );
  }
  return (
    <a className="nav-row" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function Sidebar({ open, busy, onClose, onNewChat, onAskProject, onContact }: SidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const listId = useId();
  const { links } = site;

  return (
    <>
      <button
        type="button"
        className="scrim"
        data-open={open}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside className="sidebar" data-open={open}>
        <nav aria-label="Main">
          <div className="nav-group">
            <button type="button" className="nav-row" onClick={onNewChat}>
              <SparkOutline />
              New Chat
            </button>
          </div>

          <div className="nav-group">
            <button
              type="button"
              className="nav-row"
              aria-expanded={projectsOpen}
              aria-controls={listId}
              onClick={() => setProjectsOpen((value) => !value)}
            >
              <FolderIcon />
              Project
              <ChevronIcon className="nav-row__chevron" data-open={projectsOpen} />
            </button>
            <div className="nav-sub" id={listId} data-open={projectsOpen}>
              <ul>
                {site.projects.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="nav-sub__item"
                      disabled={busy}
                      onClick={() => onAskProject(name)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <LinkRow href={links.blog}>
              <LinesIcon />
              Blogs
            </LinkRow>

            <button type="button" className="nav-row" onClick={onContact}>
              <PhoneIcon />
              Contact
            </button>
          </div>

          <div className="nav-group">
            <LinkRow href={links.twitter}>
              <XLogo />
              Twitter / X
            </LinkRow>
            <LinkRow href={links.linkedin}>
              <LinkedInIcon />
              LinkedIn
            </LinkRow>
            {links.email ? (
              <LinkRow href={`mailto:${links.email}`}>
                <MailIcon />
                Email
              </LinkRow>
            ) : (
              <button type="button" className="nav-row" onClick={onContact}>
                <MailIcon />
                Email
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
