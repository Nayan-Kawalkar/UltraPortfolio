# UltraPortfolio

A chat-style portfolio for Nayan Kawalkar. Ask about my work and experience, and the bot answers in first person and shows project cards. There is also a terminal view and a contact form.

| Folder | What it is |
| --- | --- |
| `web/` | React and Vite frontend |
| `smart-portfilio-server-2.0/` | Express API with streaming chat over SSE and the contact form |

The bot's knowledge is in `smart-portfilio-server-2.0/Nayan Info.md`, and its behaviour is in `src/prompts.ts` in the same folder. The frontend's name, suggestions and links are in `web/src/site.config.ts`.

## Run it locally

Install both apps:

```bash
npm --prefix smart-portfilio-server-2.0 install
```

```bash
npm --prefix web install
```

Create `smart-portfilio-server-2.0/.env` with the variables below, then start each app in its own terminal:

```bash
npm --prefix smart-portfilio-server-2.0 run dev
```

```bash
npm --prefix web run dev
```

Open http://localhost:5173. In dev, Vite forwards `/api` to `http://localhost:3001`.

## Server environment variables

Required, or the server won't start:

- `OPENAI_BASE_URL` and `OPENAI_API_KEY`: an OpenAI-compatible LLM endpoint, such as OpenRouter
- `GEMINI_API_KEY`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `RESEND_API_KEY`: sends contact form messages
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: rate limiting
- `PORT`: defaults to 3001

## API

- `POST /api/chat`: takes `{ messages, sessionId }` and streams `token`, `done` and `error` events
- `POST /api/contact`: sends a contact form message
- `GET /api/health`: health check

## Deploy

Deploy the server and put its URL in `web/.env.production`. Add the frontend's domain to `allowedOrigins` in `smart-portfilio-server-2.0/src/config.ts`, or the browser will block its requests.
