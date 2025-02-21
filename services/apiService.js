import CONFIG from '../config.js';

export async function generateLyrics(userAnswers) {
    try {
        // Remove mock lyrics and use real API
        const prompt = createLyricsPrompt(userAnswers);
        console.log('Sending lyrics request to OpenAI with prompt:', prompt);
        
        const response = await fetch(CONFIG.API_ENDPOINTS.OPENAI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7
            })
        });

        console.log('OpenAI response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI error response:', errorData);
            try {
                const error = JSON.parse(errorData);
                throw new Error(error.error?.message || 'Failed to generate lyrics');
            } catch (e) {
                throw new Error(`Failed to generate lyrics: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('OpenAI response data:', data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected OpenAI response format:', data);
            throw new Error('Invalid response format from lyrics generation');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in generateLyrics:', error);
        throw error;
    }
}

// Temporary mock function
function generateMockLyrics(answers) {
    const [name, location, motivation, challenge, goal] = answers;
    return `
Verse 1:
From ${location}'s streets to the stars above
${name} stands tall with unshakeable love
${motivation} keeps the fire burning bright
Through every day and into the night

Chorus:
Never backing down, always pushing through
${name}'s got the power, making dreams come true
Facing ${challenge} with courage and grace
Nothing can stop you from winning this race

Verse 2:
${goal} is the target, clear in sight
Every step forward, winning the fight
Your story's proof that faith can soar
Breaking limits, opening every door

(Repeat Chorus)

Bridge:
The world's gonna know your name
Your spirit's an endless flame
Rising higher, breaking free
Becoming who you're meant to be

(Repeat Chorus)

Outro:
${name}, your time is now
Your story shows us all how
Dreams take flight when we dare to try
Now spread your wings and touch the sky
    `.trim();
}

async function pollForCompletion(taskId, maxAttempts = 30) {
    let attempts = 0;
    let waitTime = 5000; // Start with 5 seconds

    while (attempts < maxAttempts) {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts}, waiting ${waitTime/1000} seconds...`);
        
        // Wait before making request
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        const response = await fetch(`${CONFIG.API_ENDPOINTS.MUSICAPI}/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.MUSICAPI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Poll response status:', response.status);
        const data = await response.json();
        console.log('Poll response data:', data);

        if (response.status === 200) {
            if (data.code === 200 && Array.isArray(data.data) && data.data.length > 0) {
                // Find a result with audio_url
                const task = data.data.find(t => t.audio_url);
                if (task && task.audio_url) {
                    console.log('Music is ready! Download it here:', task.audio_url);
                    return {
                        audioUrl: task.audio_url,
                        imageUrl: task.image_url,
                        videoUrl: task.video_url,
                        duration: task.duration
                    };
                }
                // If we have data but no audio_url yet, keep polling
                console.log('Got response but no audio URL yet, continuing to poll...');
            } else if (data.type === 'not_found') {
                console.log(`Task not found. Retrying in ${waitTime/1000} seconds.`);
            } else {
                console.log('Unexpected response, but continuing to poll:', data);
            }
        } else {
            console.error('Failed to check status. Response:', data);
            // Don't throw error, keep polling
            console.log('Will retry despite error...');
        }

        attempts++;
        // Don't increase wait time too much
        if (waitTime < 10000) { // Cap at 10 seconds
            waitTime *= 1.5; // Slower backoff
        }
    }

    throw new Error('Maximum polling attempts reached without getting audio URL');
}

export async function generateMusic(lyrics, style = 'pop', mood = 'uplifting') {
    try {
        console.log('Starting music generation with:', { lyrics, style, mood });
        
        // Step 1: Submit generation request
        const requestBody = {
            custom_mode: true,
            prompt: lyrics,
            title: `${style} ${mood} song`,
            tags: style.toLowerCase(),
            negative_tags: '',
            gpt_description_prompt: mood.toLowerCase(),
            make_instrumental: false,
            mv: 'sonic-v3-5'
        };
        
        console.log('Sending request to musicapi.ai:', requestBody);
        
        const response = await fetch(`${CONFIG.API_ENDPOINTS.MUSICAPI}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${CONFIG.MUSICAPI_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Initial response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from API:', errorText);
            try {
                const error = JSON.parse(errorText);
                throw new Error(error.error || error.message || 'Failed to generate music');
            } catch (e) {
                throw new Error(`Failed to generate music: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Generation response:', data);
        
        // Handle both old and new response formats
        const taskId = data.task_id || (data.data && data.data.task_id);
        if (!taskId) {
            console.error('No task ID in response:', data);
            throw new Error('No task ID received from music generation');
        }

        console.log('Received task ID:', taskId);

        // Step 2: Poll for completion
        const result = await pollForCompletion(taskId);
        console.log('Received final result:', result);
        
        return result;
    } catch (error) {
        console.error('Error in generateMusic:', error);
        throw error;
    }
}

function generateMockAudio(style = 'pop', mood = 'uplifting') {
    // Ensure we have a valid style string
    const safeStyle = String(style || 'pop').toLowerCase();
    
    console.log('Generating mock audio for style:', safeStyle);
    
    // Return a sample audio URL based on style and mood
    const mockAudios = {
        'pop': 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
        'rock': 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
        'hip-hop': 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
        'electronic': 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
        'jazz': 'https://assets.mixkit.co/music/preview/mixkit-jazz-loop-249.mp3',
        'classical': 'https://assets.mixkit.co/music/preview/mixkit-classical-strings-2-695.mp3',
        'default': 'https://assets.mixkit.co/music/preview/mixkit-uplifting-guitars-114.mp3'
    };

    return mockAudios[safeStyle] || mockAudios.default;
}

async function waitForGeneration(projectId) {
    const maxAttempts = 30; // Maximum number of attempts (5 minutes total with 10-second intervals)
    let attempts = 0;

    console.log('Starting polling for clip ID:', projectId);

    while (attempts < maxAttempts) {
        const response = await fetch(`${CONFIG.API_ENDPOINTS.BEATOVEN}/projects/${projectId}`, {
            headers: {
                'X-API-KEY': CONFIG.BEATOVEN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to check generation status');
        }

        const data = await response.json();
        
        if (data.status === 'completed') {
            return data.download_url;
        } else if (data.status === 'failed') {
            throw new Error('Music generation failed');
        }

        // Wait for 10 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
    }

    throw new Error('Music generation timed out');
}

function mapStyleToGenre(style) {
    const styleMap = {
        'pop': 'pop',
        'rock': 'rock',
        'hip-hop': 'hiphop',
        'electronic': 'electronic',
        'jazz': 'jazz',
        'classical': 'classical',
        'ambient': 'ambient'
    };

    return styleMap[style.toLowerCase()] || 'pop'; // Default to pop if style not found
}

function mapMoodToBeatoven(mood) {
    const moodMap = {
        'epic and powerful': 'powerful',
        'chill and uplifting': 'peaceful',
        'high-energy hype': 'energetic',
        'peaceful': 'peaceful',
        'romantic': 'romantic',
        'sad': 'sad',
        'happy': 'happy'
    };

    return moodMap[mood.toLowerCase()] || 'peaceful'; // Default to peaceful if mood not found
}

function createLyricsPrompt(answers) {
    return `Create uplifting song lyrics about ${answers[0]}.
    Music style: ${answers[1]}
    Desired mood: ${answers[2]}
    Their goal: ${answers[3]}
    Challenge they've overcome: ${answers[4]}
    
    Create emotional, personal lyrics that tell their story in a ${answers[1]} style with a ${answers[2]} mood.
    Focus on their achievement in overcoming ${answers[4]} and their ambition to ${answers[3]}.
    Include a chorus and 2-3 verses.
    Make it inspiring and empowering.`;
}