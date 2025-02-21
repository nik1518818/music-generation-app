# Music Generation App

This app generates music using OpenAI for lyrics and MusicAPI for the music generation. It features a beautiful UI for displaying the generated music, lyrics, and accompanying visuals.

## Features
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

## Project Structure
- `server.js` - Express server with API endpoints
- `app.js` - Main application logic
- `music-page.html` - Custom display page
- `config.js` - Configuration and endpoints
- `vercel.json` - Vercel deployment configuration

## API Endpoints
- POST `/api/openai/chat` - Generate lyrics
- POST `/api/v1/sonic/create` - Create music generation task
- GET `/api/v1/sonic/task/:taskId` - Check task status

## Pages
- `/` - Main application
- `/music-page` - Custom display page for generated music

## Security Notes
- API keys are stored as environment variables
- All API requests are proxied through the server
- CORS is enabled for all routes
