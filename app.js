// Add this import at the top of app.js
import { generateLyrics, generateMusic } from '/services/apiService.js';
import CONFIG from '/config.js';

// Add this at the start of the file, after imports
console.log('App.js loaded');

// Add event listener for Get Started button
document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            console.log('Get Started clicked');
            openModal();
        });
    } else {
        console.error('Get Started button not found');
    }
});

// Questions array - now organized in groups
const questionGroups = [
    {
        title: "Let's Start with the Basics",
        questions: [
            "What's your name?",
            "Which music style do you vibe with; pop, hip-hop, rock, jazz, EDM, reggae, classical, or something else?",
            "What mood would you like; epic and powerful, chill and uplifting, high-energy hype, others?"
        ]
    },
    {
        title: "Tell Us Your Story",
        questions: [
            "What's your big goal; new job, better body, or a thriving business, anything else?",
            "What's a win you're proud of; career growth, fitness, or overcoming family issues, anything else?"
        ]
    }
];

// State management
const state = {
    currentGroup: 0,
    answers: [],
    isListening: false,
    lyrics: null,
    audioUrl: null,
    videoUrl: null,
    isGenerating: false,
    chatMode: false,
    currentQuestion: 0,
    chatAnswers: [],
    error: null,
    generationStep: null
};

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

// Move DOM elements inside DOMContentLoaded
let modal, startButton, closeButton, questionDisplay, progressBar;
const audioContainer = document.createElement('div');
audioContainer.id = 'audio-container';
document.body.appendChild(audioContainer);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Initialize DOM elements
    modal = document.getElementById('questionnaireModal');
    startButton = document.getElementById('getStartedBtn');
    closeButton = document.querySelector('.close-button');
    questionDisplay = document.querySelector('.question-display');
    progressBar = document.querySelector('.progress-bar');
    
    console.log('Elements found:', {
        startButton,
        modal,
        closeButton,
        questionDisplay,
        progressBar
    });

    // Add event listeners
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Start button clicked');
            openModal();
        });
    } else {
        console.error('Start button not found!');
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Add styles
const styles = document.createElement('style');
styles.textContent = `
    #audio-container {
        margin: 20px auto;
        padding: 20px;
        max-width: 600px;
        border-radius: 8px;
        background: #f8f9fa;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .audio-player {
        text-align: center;
    }
    .audio-player h3 {
        margin: 0 0 15px 0;
        color: #333;
    }
    .audio-player audio {
        width: 100%;
        margin-bottom: 15px;
    }
    .audio-link {
        display: block;
        margin: 10px 0;
        color: #007bff;
        text-decoration: none;
    }
    .audio-link:hover {
        text-decoration: underline;
    }
    .loading {
        text-align: center;
        padding: 20px;
        color: #666;
    }
`;
document.head.appendChild(styles);

// Functions
function openModal() {
    if (!modal) return; // Guard against null element
    
    modal.classList.add('active');
    showOptions();
}

function closeModal() {
    modal.classList.remove('active');
    resetQuestionnaire();
}

function showOptions() {
    // Start form mode directly without showing options
    startFormMode();
}

function startFormMode() {
    state.chatMode = false;
    displayQuestion();
}

function displayQuestion() {
    const questionnaire = document.querySelector('.questionnaire-content');
    if (!questionnaire) return; // Guard against null element
    
    if (state.currentGroup < questionGroups.length) {
        const currentGroup = questionGroups[state.currentGroup];
        const questionsHtml = currentGroup.questions.map((q, index) => `
            <div class="question-item">
                <p class="question-text">${q}</p>
                <input type="text" class="text-input" data-index="${index}" placeholder="Type your answer here...">
            </div>
        `).join('');

        questionnaire.innerHTML = `
            <h3>${currentGroup.title}</h3>
            ${questionsHtml}
            <button class="next-group-button">Continue</button>
        `;

        setupGroupListeners();
        updateProgress();
    } else {
        handleCompletion();
    }
}

function setupGroupListeners() {
    const nextGroupButton = document.querySelector('.next-group-button');
    const micButtons = document.querySelectorAll('.mic-button');

    if (nextGroupButton) {
        nextGroupButton.addEventListener('click', handleNextGroup);
    }
    
    micButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.mic-button').dataset.index;
            toggleMicrophone(index);
        });
    });

    if (recognition) {
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            const activeInput = document.querySelector('.listening-for');
            if (activeInput) {
                activeInput.value = result;
                stopListening();
            }
        };
    }
}

function handleNextGroup() {
    const inputs = document.querySelectorAll('.text-input');
    const answers = Array.from(inputs).map(input => input.value.trim());
    
    if (answers.every(answer => answer)) {
        state.answers.push(...answers);
        state.currentGroup++;
        displayQuestion();
    } else {
        alert('Please answer all questions before continuing.');
    }
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressBar || !progressText) return; // Guard against null elements
    
    const progress = (state.currentGroup / questionGroups.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Group ${state.currentGroup + 1} of ${questionGroups.length}`;
}

function toggleMicrophone(inputIndex) {
    const inputs = document.querySelectorAll('.text-input');
    const currentInput = inputs[inputIndex];
    
    if (!state.isListening) {
        startListening(currentInput);
    } else {
        stopListening();
    }
}

async function handleCompletion(answers = null) {
    try {
        state.isGenerating = true;
        state.generationStep = 'lyrics';
        displayFinalResult(); // Show initial loading state

        // Get all answers if not provided
        const allAnswers = answers || state.answers;
        
        // Generate lyrics using OpenAI
        const lyrics = await generateLyrics(allAnswers);
        state.lyrics = lyrics;

        // Get style and mood from answers
        const style = allAnswers[1]; // Second question is about music style
        const mood = allAnswers[2];  // Third question is about mood
        
        // Update state to show we're generating music
        state.generationStep = 'music';
        displayFinalResult();
        
        // Generate music using musicapi.ai
        const result = await generateMusic(lyrics, style, mood);
        state.audioUrl = result.audioUrl;
        
        // Open both the audio URL and our custom page
        window.open(result.audioUrl, '_blank'); // Original audio URL in one tab
        
        // Open our custom page with all parameters
        const musicPageUrl = new URL('/music-page', window.location.origin);
        musicPageUrl.searchParams.set('audio', result.audioUrl);
        musicPageUrl.searchParams.set('image', result.imageUrl);
        musicPageUrl.searchParams.set('lyrics', lyrics);
        musicPageUrl.searchParams.set('style', style);
        musicPageUrl.searchParams.set('mood', mood);
        window.open(musicPageUrl.toString(), '_blank');

        // Also update the UI for users who don't get redirected
        const audioContainer = document.createElement('div');
        audioContainer.className = 'audio-container';
        
        const audioTitle = document.createElement('h3');
        audioTitle.textContent = 'Your Generated Music';
        audioContainer.appendChild(audioTitle);

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = result.audioUrl;
        audioContainer.appendChild(audio);

        // Add download link
        const downloadLink = document.createElement('a');
        downloadLink.href = result.audioUrl;
        downloadLink.download = 'generated-music.mp3';
        downloadLink.className = 'download-button';
        downloadLink.textContent = '⬇️ Download Music';
        audioContainer.appendChild(downloadLink);

        // Add view full page link
        const viewPageLink = document.createElement('a');
        viewPageLink.href = musicPageUrl.toString();
        viewPageLink.className = 'view-page-button';
        viewPageLink.textContent = '🎵 View Full Page';
        viewPageLink.target = '_blank';
        audioContainer.appendChild(viewPageLink);

        // Add to page
        document.getElementById('response-container').appendChild(audioContainer);

        // Add some basic styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .audio-container {
                margin: 20px 0;
                padding: 20px;
                border-radius: 8px;
                background: #f5f5f5;
                text-align: center;
            }
            .audio-container h3 {
                margin: 0 0 15px 0;
                color: #333;
            }
            .audio-container audio {
                width: 100%;
                max-width: 500px;
                margin-bottom: 15px;
            }
            .download-button, .view-page-button {
                display: inline-block;
                padding: 10px 20px;
                background: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px;
            }
            .view-page-button {
                background: #28a745;
            }
            .download-button:hover {
                background: #0056b3;
            }
            .view-page-button:hover {
                background: #218838;
            }
            .loading-message {
                padding: 20px;
                text-align: center;
                color: #666;
            }
        `;
        document.head.appendChild(styleElement);

        // Display the final result
        state.generationStep = 'complete';
        displayFinalResult();
    } catch (error) {
        state.error = error.message;
        displayFinalResult();
    } finally {
        state.isGenerating = false;
    }
}

function displayFinalResult() {
    const modalContent = document.querySelector('.modal-content');
    
    if (state.isGenerating) {
        let loadingMessage = 'Please wait...';
        if (state.generationStep === 'lyrics') {
            loadingMessage = 'Creating your personalized lyrics...';
        } else if (state.generationStep === 'music') {
            loadingMessage = `Composing your anthem...\nThis typically takes about 1 minute.\nChecking status every 3 seconds...`;
        }
        
        modalContent.innerHTML = `
            <h2>Creating Your Anthem</h2>
            <div class="loading-spinner"></div>
            <p style="white-space: pre-line">${loadingMessage}</p>
            ${state.lyrics ? `
                <div class="lyrics-container">
                    <h3>Your Lyrics:</h3>
                    <pre>${state.lyrics}</pre>
                </div>
            ` : ''}
            <div id="status-updates" class="status-updates"></div>
        `;
        return;
    }

    if (state.error) {
        modalContent.innerHTML = `
            <h2>Oops! Something went wrong</h2>
            <p class="error-message">${state.error}</p>
            <div id="status-updates" class="status-updates"></div>
            <button class="retry-button" onclick="retryGeneration()">Try Again</button>
        `;
        return;
    }

    modalContent.innerHTML = `
        <h2>Your Personalized Anthem</h2>
        <div class="lyrics-container">
            <pre>${state.lyrics}</pre>
        </div>
        <div class="player-container">
            ${state.audioUrl ? `
                <audio controls>
                    <source src="${state.audioUrl}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>
                <a href="${state.audioUrl}" download="your_anthem.mp3" class="download-button">Download Your Anthem</a>
            ` : '<div class="loading-spinner"></div>'}
        </div>
        <button class="retry-button" onclick="resetQuestionnaire()">Create Another Anthem</button>
    `;
}

window.updateStatusMessage = function(message) {
    const statusDiv = document.getElementById('status-updates');
    if (statusDiv) {
        const timestamp = new Date().toLocaleTimeString();
        statusDiv.innerHTML += `<div>${timestamp}: ${message}</div>`;
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }
};

function retryGeneration() {
    state.currentGroup = 0;
    state.answers = [];
    state.isGenerating = false;
    state.error = null;
    displayQuestion();
}

function resetQuestionnaire() {
    state.currentGroup = 0;
    state.answers = [];
    state.isListening = false;
}