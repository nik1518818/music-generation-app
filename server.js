import express from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create HTTPS agent that ignores self-signed certificate errors
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Get port from environment variable for cloud deployment
const port = process.env.PORT || 8080;

// Model used for live speech translation. Kept small/fast on purpose - the
// translator fires a request per spoken phrase, so latency matters more than
// raw quality here.
const TRANSLATE_MODEL = process.env.TRANSLATE_MODEL || 'gpt-4o-mini';

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// OpenAI proxy endpoint
app.post('/api/openai/chat', async (req, res) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to process OpenAI request' });
    }
});

// Live translation endpoint used by /live-translate.html
//
// The browser does the speech-to-text (Web Speech API, Chinese) and posts each
// phrase here; we translate it to English with the API key kept server side.
app.post('/api/translate', async (req, res) => {
    const { text, context = [], draft = false, source = 'Chinese' } = req.body || {};

    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Missing "text" to translate.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
            error: 'OPENAI_API_KEY is not configured on the server, so translation is unavailable.'
        });
    }

    // Interim ("draft") phrases are partial sentences - say so, otherwise the
    // model tries to invent an ending for them.
    const systemPrompt = [
        `You are a live interpreter. Translate ${source} speech into natural, conversational English.`,
        'Rules:',
        '- Output ONLY the English translation. No quotes, no pinyin, no notes, no explanation.',
        '- Keep the speaker\'s tone and register. Everyday speech should sound like everyday speech.',
        '- Keep names, numbers and places accurate. Leave a proper name as-is if you cannot translate it.',
        '- If the text is already English, return it unchanged.',
        '- If there is nothing meaningful to translate, return an empty string.',
        draft
            ? '- This is a partial sentence still being spoken. Translate what is there so far and do not invent an ending.'
            : '- This is a complete phrase. Translate it fully.'
    ].join('\n');

    const messages = [{ role: 'system', content: systemPrompt }];

    // Recent lines give the model enough thread to resolve pronouns and topic,
    // but they must not end up in the output.
    const recent = Array.isArray(context) ? context.filter(c => typeof c === 'string' && c.trim()).slice(-3) : [];
    if (recent.length) {
        messages.push({
            role: 'system',
            content: `Earlier in this same conversation (context only - do NOT translate or repeat these):\n${recent.join('\n')}`
        });
    }

    messages.push({ role: 'user', content: text });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: TRANSLATE_MODEL,
                messages,
                temperature: 0.2,
                max_tokens: Math.min(600, Math.max(60, text.length * 4))
            }),
            signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Translation API error:', data);
            return res.status(response.status).json({
                error: data?.error?.message || 'Translation request failed.'
            });
        }

        const translation = data?.choices?.[0]?.message?.content?.trim() ?? '';
        res.json({ translation, model: TRANSLATE_MODEL, draft: Boolean(draft) });
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Translation timed out for:', text);
            return res.status(504).json({ error: 'Translation timed out.' });
        }
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Failed to translate text.' });
    } finally {
        clearTimeout(timeout);
    }
});

// MusicAPI proxy endpoints
app.post('/api/v1/sonic/create', async (req, res) => {
    try {
        const response = await fetch('https://api.musicapi.ai/api/v1/sonic/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MUSICAPI_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(req.body),
            agent: httpsAgent
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('MusicAPI create error:', error);
        res.status(500).json({ error: 'Failed to create music task' });
    }
});

app.get('/api/v1/sonic/task/:taskId', async (req, res) => {
    try {
        const response = await fetch(`https://api.musicapi.ai/api/v1/sonic/task/${req.params.taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.MUSICAPI_KEY}`,
                'Accept': 'application/json'
            },
            agent: httpsAgent
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('MusicAPI task status error:', error);
        res.status(500).json({ error: 'Failed to check task status' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'music-page.html'));
});

app.get('/live-translate', (req, res) => {
    res.sendFile(path.join(__dirname, 'live-translate.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
});

// Handle 404s
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('- GET / (serves index.html)');
    console.log('- GET /live-translate (live Chinese to English translator)');
    console.log('- POST /api/openai/chat');
    console.log('- POST /api/translate');
    console.log('- POST /api/v1/sonic/create');
    console.log('- GET /api/v1/sonic/task/:taskId');
});
