const CONFIG = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MUSICAPI_KEY: process.env.MUSICAPI_KEY,
    API_ENDPOINTS: {
        MUSICAPI: '/api/v1/sonic',
        OPENAI: '/api/openai/chat'
    }
};

export default CONFIG;