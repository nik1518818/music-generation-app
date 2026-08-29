# Music Generation App

This app generates music using OpenAI for lyrics and MusicAPI for the music generation. It features a beautiful UI for displaying the generated music, lyrics, and accompanying visuals.

## Features
- **Live Chinese → English translation** (`/live-translate.html`) — real-time speech captions for a Chinese conversation
- Generate lyrics using OpenAI
- Create music based on lyrics, style, and mood
- Beautiful display page with music player, lyrics, and visuals
- Download options for the generated music
- Responsive design

## Deployment Instructions

### Prerequisites
- Node.js 14+ installed
- OpenAI API key
- MusicAPI key

### Environment Variables
Create a `.env` file with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
MUSICAPI_KEY=your_musicapi_key
TRANSLATE_MODEL=gpt-4o-mini   # optional, model used for live translation
```

### Local Development
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Deployment to Vercel
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel:
- Go to your project settings
- Add OPENAI_API_KEY and MUSICAPI_KEY
- Redeploy if needed

### Deployment to Cloudflare
1. Install Wrangler:
```bash
npm i -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
wrangler deploy
```

4. Add environment variables in Cloudflare:
- Go to Workers & Pages
- Select your project
- Add OPENAI_API_KEY and MUSICAPI_KEY in Settings > Environment Variables

## Live Chinese → English Translation

Open `/live-translate.html`, press **Start listening**, and allow microphone
access. As people speak Chinese, English sentences appear on screen — a greyed
out draft line updates while someone is mid-sentence, and it firms up into a
finished line when they pause.

Put the laptop or phone on the table between everyone and read along.

### How it works
1. The browser's Web Speech API transcribes the Chinese audio, streaming
   interim results while a person is still speaking.
2. Each phrase is posted to `/api/translate`, which asks OpenAI for a natural
   English translation. The last few lines are sent as context so pronouns and
   topic carry across short phrases.
3. Finished phrases are appended to the transcript; the in-progress phrase is
   shown separately and replaced as the recogniser revises it.

### Controls
| Control | What it does |
| --- | --- |
| Speech | Mandarin (Mainland / Taiwan) or Cantonese (Hong Kong) |
| Start / Stop listening | Also bound to the space bar |
| 中 Show Chinese | Show or hide the original Chinese under each line |
| ⬇ Auto-scroll | Follow the newest line, or stay put to read back |
| A− / A+ | Caption size, for reading across a table |
| Copy / Save .txt | Export the bilingual transcript |
| Clear | Wipe the transcript |

Preferences are remembered in the browser. On a phone or laptop the screen is
kept awake while listening.

### Browser support
Speech recognition needs **Chrome or Edge** (desktop or Android). Safari and
Firefox do not support Chinese speech input, and the page says so instead of
failing silently. The microphone also requires HTTPS (or `localhost`).

### Privacy
Audio goes to the browser's own speech service for transcription, and the
recognised text goes to OpenAI for translation. Nothing is stored on the
server — the transcript lives only in the open tab until you save or clear it.

## Project Structure
- `server.js` - Express server with API endpoints
- `app.js` - Main application logic
- `music-page.html` - Custom display page
- `live-translate.html` / `live-translate.js` / `live-translate.css` - Live Chinese → English translator
- `config.js` - Configuration and endpoints
- `vercel.json` - Vercel deployment configuration

## API Endpoints
- POST `/api/openai/chat` - Generate lyrics
- POST `/api/translate` - Translate a Chinese phrase to English (`{ text, draft, context, source }`)
- POST `/api/v1/sonic/create` - Create music generation task
- GET `/api/v1/sonic/task/:taskId` - Check task status

## Pages
- `/` - Main application
- `/music-page` - Custom display page for generated music
- `/live-translate.html` - Live Chinese → English translator

## Security Notes
- API keys are stored as environment variables
- All API requests are proxied through the server
- CORS is enabled for all routes
