# Deploy + WhatsApp share (Save the Date)

## Deploy (Vercel)

1. Push this project to GitHub and import in [Vercel](https://vercel.com).
2. Framework: **Other** (static).
3. Build: `npm run build` (see `vercel.json`).
4. Output directory: `.` (project root).
5. Environment variable (recommended): `SITE_URL` = `https://your-project.vercel.app` (no trailing slash).

Preview image: **`share-source.jpg`** only (your couple photo, no generated OG cards).

## WhatsApp message template

```text
With love and blessings 💛
Antima & Saksham — Save the Date
5 December 2026 · Saryu Mahal, Jagatpura, Jaipur

Tap to open:
https://YOUR-DEPLOYED-URL/
```

Put the URL on its own line. The text above matches `share.whatsappText` in `js/wedding-config.js`.

## Refresh cached preview

WhatsApp caches link previews. After changes:

1. Replace `share-source.jpg` and redeploy.
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → paste your URL → **Scrape Again**.

## Preview image

- Use only `share-source.jpg` in the project root for WhatsApp link preview.
- Deploy build (`npm run build`) fills Open Graph URLs to point at that file.
