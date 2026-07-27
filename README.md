# Twitter Sentiment Analysis — Results Dashboard

A results dashboard for the [Twitter Sentiment Analysis](https://github.com/linson13/twitter-sentiment-analysis)
project — visualizes dataset composition, model performance, and real
sample predictions from the trained classifier.

Built with Vite + React + Tailwind + Recharts. All numbers on the page
come from `src/data/dashboard_data.json`, exported directly from the
trained model (nothing hand-typed).

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm install
npm run build
```

Output goes to `dist/` — a fully static site, no backend required.

## Deploy permanently (free) with Vercel

1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com and sign in with GitHub.
3. Click **Add New → Project**, select this repo.
4. Vercel auto-detects Vite. Leave the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**. You'll get a permanent `https://your-project.vercel.app` URL.
