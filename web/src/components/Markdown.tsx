import ReactMarkdown, { type Components } from 'react-markdown';

const components: Components = {
  // react-markdown blanks unsafe URLs, which leaves the link text to show as plain text.
  a: ({ href, children }) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <>{children}</>
    ),
};

// Images are dropped so a model reply can't make the visitor's browser load a remote URL.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown components={components} disallowedElements={['img']} unwrapDisallowed>
        {children}
      </ReactMarkdown>
    </div>
  );
}
