# Portfolio chat frontend

React + Vite frontend for the Express backend in `../smart-portfilio-server-2.0`.

## Run it locally

Start the backend and the frontend in two terminals, from the `jitu-ai-portfolio` folder:

```bash
npm --prefix smart-portfilio-server-2.0 run dev
```

```bash
npm --prefix web run dev
```

Then open http://localhost:5173. In dev, Vite forwards `/api` to `http://localhost:3001`.

## Change the content

Name, greeting, suggestions, sidebar projects and social links are all in `src/site.config.ts`.

## Deploy

1. Deploy the backend and set `VITE_API_BASE_URL` to its URL when building this app (see `.env.example`).
2. Add the frontend's domain to `allowedOrigins` in the backend's `src/config.ts`, or the browser will block requests in production.
3. Run `npm run build` and host the `dist` folder on any static host.
