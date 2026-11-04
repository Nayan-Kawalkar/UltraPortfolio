/**
 * Everything visitors read that isn't a chat reply lives here.
 *
 * `name` has to match who the backend answers as (PROFILE in the server's
 * src/prompts.ts), otherwise the greeting and the replies disagree.
 */
export const site = {
  name: 'Nayan',
  tagline: 'Ask me anything or pick a suggestion below.',

  suggestions: [
    'What can you help me with?',
    'Give me a quick summary of your capabilities.',
    'How do I get started?',
    'What topics do you know best?',
  ],

  // Listed under "Project" in the sidebar. Clicking one asks the chat about it, so
  // the details always come from the backend. Keep in step with "Nayan Info.md".
  projects: ['NexBot', 'AXIOM', 'NOVA', 'Luxeria'],

  // An empty link shows as unavailable in the sidebar.
  // An empty `email` makes the Email row open the contact form instead.
  links: {
    blog: '',
    twitter: '',
    linkedin: 'https://www.linkedin.com/in/nayankawalkar/',
    email: 'kawalkarnayan07@gmail.com',
  },
};
