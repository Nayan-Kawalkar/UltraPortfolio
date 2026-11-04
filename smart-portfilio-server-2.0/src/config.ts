import 'dotenv/config';

// ── Validate required env vars ────────────────────────────────────
function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

/**
 * Optional env var — returns the value or undefined.
 * Used for keys that are only needed by specific commands (e.g. Notion for sync).
 */
function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const config = {
  // LLM configuration (OpenRouter) — models tried in order, next used on failure
  llm: {
    baseUrl: requireEnv('OPENAI_BASE_URL'),
    apiKey: requireEnv('OPENAI_API_KEY'),
    models: [
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'google/gemma-4-31b-it:free',
      'openrouter/free', // router: picks any free model, so one slug going away can't take chat down
    ],
  },

  // Gemini embeddings
  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
    embeddingModel: 'gemini-embedding-001',
    embeddingDimension: 3072,
  },

  // Supabase
  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    anonKey: process.env.SUPABASE_ANON_KEY ?? '',
  },

  // Notion — optional at server startup; required only when running `npm run sync`
  notion: {
    apiKey: optionalEnv('NOTION_API_KEY'),
  },

  // Server
  port: parseInt(process.env.PORT ?? '3001', 10),

  // CORS
  allowedOrigins: [
    'https://askakash.com',
    'https://predictable-feel-940249.framer.app',
    'https://ultrafolio.framer.website',
    /^https:\/\/.*\.framer\.app$/,   // Framer preview domains (regex for wildcard)
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',

  ],
} as const;
