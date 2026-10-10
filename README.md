# ShopBot – Embeddable AI Shopping Widget

Floating AI chat widget with voice input and voice replies, product catalogue,
add to cart and a mock purchase flow. Built with Next.js (App Router), TypeScript and Tailwind.
Mock data only, no backend.

## Setup
```bash
git clone <your-repo-url>
cd my-app
npm install
npm run dev
```
Open http://localhost:3000 in **Chrome or Edge** (voice needs the Web Speech API; mic works on localhost/HTTPS).

## Features
- Floating chat widget (full screen on mobile, auto dark mode)
- Voice input (mic) and spoken replies (🔊 toggle)
- Product catalogue (Shop tab with category filters, product cards in chat)
- Add to cart, quantity controls, cart saved in localStorage
- Mock checkout and order confirmation
- Chat commands: "show audio", "under 50", "add earbuds to cart", "my cart", "checkout"

## Embed on any website
1. Deploy this app (e.g. Vercel).
2. Add to any page: `<script src="https://YOUR-DOMAIN/embed.js"></script>`

Or inside a React/Next app: `<ChatWidget />`

## Structure
- `components/ChatWidget.tsx` – UI, voice, cart, checkout
- `lib/brain.ts` – mock assistant (replace with real LLM API call, same Reply shape)
- `lib/products.ts` – mock catalogue
- `app/embed/page.tsx` + `public/embed.js` – script-tag embed (iframe)