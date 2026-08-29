/*
 * Live Chinese -> English translator.
 *
 * Speech recognition runs in the browser (Web Speech API, which streams audio
 * to the browser's own speech service), so we get interim results while someone
 * is still talking. Each phrase is then posted to /api/translate, which keeps
 * the OpenAI key server side.
 *
 * Two kinds of translation happen:
 *   - draft:  the phrase is still being spoken. Debounced, shown greyed out,
 *             replaced constantly. This is what makes it feel "live".
 *   - final:  the recogniser settled on a phrase. Committed to the transcript.
 */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const els = {
    listenBtn: document.getElementById('listenBtn'),
    listenLabel: document.getElementById('listenLabel'),
    dialect: document.getElementById('dialectSelect'),
    status: document.getElementById('status'),
    statusDot: document.getElementById('statusDot'),
    errorBanner: document.getElementById('errorBanner'),
    supportBanner: document.getElementById('supportBanner'),
    feed: document.getElementById('feed'),
    emptyState: document.getElementById('emptyState'),
    liveLine: document.getElementById('liveLine'),
    liveEnglish: document.getElementById('liveEnglish'),
    liveChinese: document.getElementById('liveChinese'),
    chineseToggle: document.getElementById('chineseToggle'),
    scrollToggle: document.getElementById('scrollToggle'),
    fontUp: document.getElementById('fontUp'),
    fontDown: document.getElementById('fontDown'),
    copyBtn: document.getElementById('copyBtn'),
    saveBtn: document.getElementById('saveBtn'),
    clearBtn: document.getElementById('clearBtn')
};

const settings = {
    dialect: localStorage.getItem('lt.dialect') || 'zh-CN',
    showChinese: localStorage.getItem('lt.showChinese') !== 'false',
    autoScroll: localStorage.getItem('lt.autoScroll') !== 'false',
    fontSize: Number(localStorage.getItem('lt.fontSize')) || 30
};

const state = {
    recognition: null,
    wantsToListen: false,
    entries: [],
    entrySeq: 0,
    interim: '',
    draftSeq: 0,
    draftTimer: null,
    lastDraftText: '',
    restarts: [],
    wakeLock: null
};

/* ---------------------------------------------------------------- helpers */

const DRAFT_DEBOUNCE_MS = 650;
const MIN_DRAFT_CHARS = 4;
const TRANSLATION_CACHE = new Map();

function setStatus(message) {
    els.status.textContent = message;
}

function showError(message) {
    els.errorBanner.textContent = message;
    els.errorBanner.hidden = false;
}

function clearError() {
    els.errorBanner.hidden = true;
    els.errorBanner.textContent = '';
}

function timestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// The last few committed Chinese lines, used as conversational context.
function recentContext() {
    return state.entries.slice(-3).map(entry => entry.zh);
}

function scrollToBottom() {
    if (!settings.autoScroll) return;
    els.feed.scrollTop = els.feed.scrollHeight;
}

/* ------------------------------------------------------------ translation */

async function requestTranslation(text, { draft, context = [] }) {
    const cacheKey = `${draft ? 'd' : 'f'}:${text}`;
    if (TRANSLATION_CACHE.has(cacheKey)) return TRANSLATION_CACHE.get(cacheKey);

    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            draft,
            context,
            source: els.dialect.value.startsWith('yue') || els.dialect.value === 'zh-HK' ? 'Cantonese' : 'Chinese'
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || `Translation failed (${response.status})`);
    }

    const translation = (data.translation || '').trim();
    TRANSLATION_CACHE.set(cacheKey, translation);
    if (TRANSLATION_CACHE.size > 400) {
        TRANSLATION_CACHE.delete(TRANSLATION_CACHE.keys().next().value);
    }
    return translation;
}

/* ------------------------------------------------------------------ feed  */

function renderEntry(entry) {
    const node = document.createElement('article');
    node.className = 'lt-entry';
    node.dataset.entryId = entry.id;

    const time = document.createElement('span');
    time.className = 'lt-time';
    time.textContent = entry.time;

    const en = document.createElement('p');
    en.className = 'lt-en is-pending';
    en.textContent = 'translating…';

    const zh = document.createElement('p');
    zh.className = 'lt-zh';
    zh.lang = 'zh';
    zh.textContent = entry.zh;

    node.append(time, en, zh);
    els.feed.insertBefore(node, els.liveLine);
    els.emptyState.hidden = true;
    scrollToBottom();
    return node;
}

function updateEntry(entry, { text, failed = false }) {
    const node = els.feed.querySelector(`[data-entry-id="${entry.id}"] .lt-en`);
    if (!node) return;
    node.classList.remove('is-pending', 'is-failed');
    if (failed) node.classList.add('is-failed');
    node.textContent = text;
    scrollToBottom();
}

async function commitPhrase(chinese) {
    const zh = chinese.trim();
    if (!zh) return;

    // Grab the preceding lines before this one joins them - they give the model
    // enough thread to keep pronouns and topic straight across short phrases.
    const context = recentContext();

    const entry = { id: ++state.entrySeq, zh, en: '', time: timestamp() };
    state.entries.push(entry);
    renderEntry(entry);

    try {
        const english = await requestTranslation(zh, { draft: false, context });
        entry.en = english || zh;
        updateEntry(entry, { text: entry.en });
        clearError();
    } catch (error) {
        console.error('Translation failed:', error);
        entry.en = '';
        entry.failed = true;
        updateEntry(entry, { text: `⚠ ${error.message}`, failed: true });
        showError(`${error.message} — the Chinese transcript is still being captured.`);
    }
}

function setLiveLine(chinese, english) {
    if (!chinese) {
        els.liveLine.hidden = true;
        els.liveEnglish.textContent = '';
        els.liveChinese.textContent = '';
        return;
    }
    els.liveLine.hidden = false;
    els.emptyState.hidden = true;
    els.liveChinese.textContent = chinese;
    if (english !== undefined) els.liveEnglish.textContent = english;
    scrollToBottom();
}

function scheduleDraftTranslation() {
    clearTimeout(state.draftTimer);
    state.draftTimer = setTimeout(async () => {
        const text = state.interim.trim();
        if (text.length < MIN_DRAFT_CHARS || text === state.lastDraftText) return;

        state.lastDraftText = text;
        const seq = ++state.draftSeq;

        try {
            const english = await requestTranslation(text, { draft: true, context: recentContext() });
            // A newer draft (or a final result) landed while we were waiting.
            if (seq !== state.draftSeq || state.interim.trim() !== text) return;
            setLiveLine(text, english);
        } catch (error) {
            // Drafts are best-effort; the final translation is the one that matters.
            console.warn('Draft translation skipped:', error.message);
        }
    }, DRAFT_DEBOUNCE_MS);
}

/* ------------------------------------------------------- speech recognition */

function buildRecognition() {
    const recognition = new SpeechRecognition();
    recognition.lang = els.dialect.value;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        els.statusDot.classList.add('is-live');
        els.statusDot.classList.remove('is-error');
        setStatus('Listening… speak Chinese and the English will appear below.');
    };

    recognition.onresult = event => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            if (result.isFinal) {
                state.interim = '';
                state.lastDraftText = '';
                state.draftSeq++;          // invalidate any in-flight draft
                clearTimeout(state.draftTimer);
                setLiveLine('');
                commitPhrase(transcript);
            } else {
                interim += transcript;
            }
        }

        if (interim) {
            state.interim = interim;
            setLiveLine(interim);
            scheduleDraftTranslation();
        }
    };

    recognition.onerror = event => {
        // "no-speech" and "aborted" are routine in a long session; onend restarts.
        if (event.error === 'no-speech' || event.error === 'aborted') return;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            state.wantsToListen = false;
            els.statusDot.classList.add('is-error');
            showError('Microphone access was blocked. Allow the microphone for this site (padlock icon in the address bar) and press start again.');
        } else if (event.error === 'audio-capture') {
            state.wantsToListen = false;
            els.statusDot.classList.add('is-error');
            showError('No microphone was found. Plug one in or pick one in your system settings, then press start again.');
        } else if (event.error === 'network') {
            showError('Speech recognition lost its network connection. It will retry automatically.');
        } else {
            showError(`Speech recognition error: ${event.error}`);
        }
    };

    recognition.onend = () => {
        els.statusDot.classList.remove('is-live');
        if (!state.wantsToListen) {
            setStatus('Stopped. Press “Start listening” to pick back up.');
            syncListenButton();
            return;
        }

        // Chrome ends the session after a pause. Restart it, but back off if it
        // is failing instantly - otherwise a blocked mic spins forever.
        const now = Date.now();
        state.restarts = state.restarts.filter(t => now - t < 10000);
        state.restarts.push(now);

        if (state.restarts.length > 8) {
            state.wantsToListen = false;
            syncListenButton();
            showError('Speech recognition kept dropping out. Check the microphone and your connection, then press start again.');
            return;
        }

        setStatus('Reconnecting…');
        setTimeout(() => {
            if (state.wantsToListen) {
                try {
                    state.recognition.start();
                } catch (error) {
                    console.warn('Restart failed:', error);
                }
            }
        }, 250);
    };

    return recognition;
}

function syncListenButton() {
    const on = state.wantsToListen;
    els.listenBtn.setAttribute('aria-pressed', String(on));
    els.listenLabel.textContent = on ? 'Stop listening' : 'Start listening';
}

async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
        state.wakeLock = await navigator.wakeLock.request('screen');
    } catch {
        // Not critical - the screen may just dim.
    }
}

function releaseWakeLock() {
    state.wakeLock?.release().catch(() => {});
    state.wakeLock = null;
}

function startListening() {
    if (!SpeechRecognition) return;
    clearError();
    state.wantsToListen = true;
    state.restarts = [];
    state.recognition = buildRecognition();
    syncListenButton();
    requestWakeLock();
    try {
        state.recognition.start();
    } catch (error) {
        console.warn('Could not start recognition:', error);
    }
}

function stopListening() {
    state.wantsToListen = false;
    clearTimeout(state.draftTimer);
    state.interim = '';
    setLiveLine('');
    releaseWakeLock();
    syncListenButton();
    try {
        state.recognition?.stop();
    } catch {
        // Already stopped.
    }
    setStatus('Stopped. Press “Start listening” to pick back up.');
}

/* ------------------------------------------------------------- transcript */

function transcriptText() {
    return state.entries
        .map(entry => `[${entry.time}] ${entry.en || '(not translated)'}\n           ${entry.zh}`)
        .join('\n\n');
}

/* ---------------------------------------------------------------- settings */

function applySettings() {
    document.body.classList.toggle('hide-chinese', !settings.showChinese);
    els.chineseToggle.setAttribute('aria-pressed', String(settings.showChinese));
    els.scrollToggle.setAttribute('aria-pressed', String(settings.autoScroll));
    document.documentElement.style.setProperty('--lt-feed-size', `${settings.fontSize}px`);
    els.dialect.value = settings.dialect;
}

function saveSetting(key, value) {
    localStorage.setItem(`lt.${key}`, String(value));
}

/* ------------------------------------------------------------------ events */

els.listenBtn.addEventListener('click', () => {
    state.wantsToListen ? stopListening() : startListening();
});

els.dialect.addEventListener('change', () => {
    settings.dialect = els.dialect.value;
    saveSetting('dialect', settings.dialect);
    if (state.wantsToListen) {
        // Rebuild so the new language takes effect immediately.
        stopListening();
        setTimeout(startListening, 300);
    }
});

els.chineseToggle.addEventListener('click', () => {
    settings.showChinese = !settings.showChinese;
    saveSetting('showChinese', settings.showChinese);
    applySettings();
});

els.scrollToggle.addEventListener('click', () => {
    settings.autoScroll = !settings.autoScroll;
    saveSetting('autoScroll', settings.autoScroll);
    applySettings();
    scrollToBottom();
});

els.fontUp.addEventListener('click', () => {
    settings.fontSize = Math.min(64, settings.fontSize + 4);
    saveSetting('fontSize', settings.fontSize);
    applySettings();
});

els.fontDown.addEventListener('click', () => {
    settings.fontSize = Math.max(16, settings.fontSize - 4);
    saveSetting('fontSize', settings.fontSize);
    applySettings();
});

els.copyBtn.addEventListener('click', async () => {
    if (!state.entries.length) return setStatus('Nothing to copy yet.');
    try {
        await navigator.clipboard.writeText(transcriptText());
        setStatus('Transcript copied to the clipboard.');
    } catch {
        setStatus('Could not copy — your browser blocked clipboard access.');
    }
});

els.saveBtn.addEventListener('click', () => {
    if (!state.entries.length) return setStatus('Nothing to save yet.');
    const blob = new Blob([transcriptText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
});

els.clearBtn.addEventListener('click', () => {
    if (state.entries.length && !confirm('Clear the whole transcript?')) return;
    state.entries = [];
    els.feed.querySelectorAll('.lt-entry').forEach(node => node.remove());
    setLiveLine('');
    els.emptyState.hidden = false;
    clearError();
});

// Space toggles listening, so you can start/stop without hunting for the button.
document.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.target.matches('input, select, textarea, button')) return;
    event.preventDefault();
    state.wantsToListen ? stopListening() : startListening();
});

// A backgrounded tab drops the wake lock; take it again on return.
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.wantsToListen) requestWakeLock();
});

window.addEventListener('beforeunload', () => {
    state.wantsToListen = false;
    releaseWakeLock();
});

/* -------------------------------------------------------------------- boot */

applySettings();
syncListenButton();

if (!SpeechRecognition) {
    els.listenBtn.disabled = true;
    els.supportBanner.hidden = false;
    els.supportBanner.textContent =
        'This browser cannot do live speech recognition. Open this page in Chrome or Edge (desktop or Android) — Safari and Firefox do not support Chinese speech input.';
    setStatus('Speech recognition unavailable in this browser.');
} else if (!window.isSecureContext) {
    els.listenBtn.disabled = true;
    els.supportBanner.hidden = false;
    els.supportBanner.textContent =
        'Microphone access needs HTTPS. Open this page over https:// or on localhost.';
    setStatus('Insecure connection — microphone blocked.');
}
