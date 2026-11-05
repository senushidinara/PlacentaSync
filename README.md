<div align="center">

# 🌿 PlacentaSync

### A softer way to check in with you. 💛

<p>
  <strong>PlacentaSync</strong> is a calm, mobile-first maternal care companion for daily check-ins,
  breathing support, care-plan prompts, and care-team communication.
</p>

<p>
  <a href="https://github.com/senushidinara/PlacentaSync">
    <img src="https://img.shields.io/badge/GitHub-Source%20code-2f6260?style=for-the-badge&logo=github&logoColor=white" alt="GitHub source code">
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/senushidinara/PlacentaSync">
    <img src="https://img.shields.io/badge/Netlify-Deploy%20your%20copy-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Deploy to Netlify">
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

</div>

<p align="center">
  <img src="./public/placenta-sync-preview.svg" alt="PlacentaSync care companion preview" width="900">
</p>

## ✨ What it does

PlacentaSync turns a daily health moment into a gentle, structured ritual:

- 🌤️ **Daily check-in** — capture mood and body symptoms without judgment.
- 🌬️ **Breathe with baby** — start a simple one-minute breathing rhythm.
- 👶 **Baby’s little note** — receive a warm, week-aware encouragement.
- 🛡️ **Care plan** — keep the next small actions visible.
- 💬 **Care team** — create a clear path to ask for support.
- ☎️ **Urgent help** — keep emergency guidance easy to find.
- 📱 **Responsive by design** — comfortable on phones, tablets, and desktops.

> ⚕️ PlacentaSync is a support and communication tool, not a medical diagnosis. For urgent symptoms, contact a clinician or local emergency services.

## 🧭 Product flow

```mermaid
flowchart LR
    A[🌅 Open today's check-in] --> B[💛 Choose how you feel]
    B --> C[🩺 Notice symptoms]
    C --> D[✅ Save your check-in]
    D --> E[🌬️ Breathe with baby]
    E --> F[💬 Reach your care team]
```

## 🚀 Run it locally

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/senushidinara/PlacentaSync.git
cd PlacentaSync
npm install
npm run dev
```

For a production build:

```bash
npm run lint
npm run build
npm run preview
```

## 🌐 Netlify

The repository includes a ready-to-use `netlify.toml`:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| SPA fallback | `/* → /index.html` |

### Deploy it in one click

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/senushidinara/PlacentaSync">
  <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify">
</a>

After deployment, Netlify will provide the live URL for your site. The current repository does not yet have a verified Netlify site URL connected to it, so this README intentionally avoids publishing an unverified link.

## 🧱 Built with

⚛️ React · 🟦 TypeScript · ⚡ Vite · 🎨 Tailwind CSS · 🧩 Lucide React · 🌐 Netlify

## 🔒 Privacy-minded prototype

The current version is a client-only prototype. It does not require Firebase, PostgreSQL, Gemini, or a backend service, and it does not collect or transmit health data by itself.

## 📄 License

MIT
