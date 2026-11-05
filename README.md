# PlacentaSync

PlacentaSync is a standalone, mobile-first maternal care companion. It gives expectant parents a calm place to record how they feel, notice symptoms, practice a one-minute breathing exercise, and reach their care team.

This repository is intentionally independent from the original Embrayo project. It contains only the PlacentaSync client and its deployment configuration.

## What is included

- Daily mood and symptom check-in
- One-minute “Breathe with baby” exercise
- Weekly baby note and care-plan prompts
- Care-team and urgent-help entry points
- Responsive React interface for phone, tablet, and desktop
- Netlify SPA deployment configuration

PlacentaSync is a support and communication tool, not a medical diagnosis. Urgent symptoms should always be discussed with a clinician or local emergency services.

## Local development

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run lint
npm run build
npm run preview
```

## Netlify

The included `netlify.toml` configures:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: all routes serve `index.html`

Import `senushidinara/PlacentaSync` into Netlify and use the default settings from `netlify.toml`. No secrets or external services are required for the current client-only prototype.

## License

MIT
