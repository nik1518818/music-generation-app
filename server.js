const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const https = require('https');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create HTTPS agent that ignores self-signed certificate errors
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Get directory name in ES modules
const __filename = require('url').fileURLToPath(import.meta.url);
const __dirname = require('path').dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Get port from environment variable for cloud deployment
const port = process.env.PORT || 8080;

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
    console.log('- POST /api/openai/chat');
    console.log('- POST /api/v1/sonic/create');
    console.log('- GET /api/v1/sonic/task/:taskId');
});
