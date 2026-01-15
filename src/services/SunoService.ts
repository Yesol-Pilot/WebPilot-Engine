import axios from 'axios';

/**
 * Service for sunoapi.org (Unofficial Suno API Wrapper)
 * Documentation: https://sunoapi.org/docs
 */
export const SunoService = {
    generateMusic: async (prompt: string, instrumental: boolean = true) => {
        const apiKey = process.env.SUNO_API_KEY;
        const API_URL = "https://api.sunoapi.org/api/v1/generate";

        if (!apiKey) throw new Error("Suno API Key is missing");

        console.log(`[Suno] Requesting music from sunoapi.org: "${prompt}"`);

        try {
            const response = await axios.post(
                API_URL,
                {
                    prompt: prompt,
                    model: "suno-v3-5", // or v3
                    is_custom: false, // Simple generation mode
                    tags: instrumental ? "instrumental" : "",
                    title: "Generated World Music",
                    make_instrumental: instrumental,
                    wait_audio: true // Wait for audio to be ready? (Depends on provider capability, usually false for long gens)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // sunoapi.org usually returns a list of clips.
            // Structure: { code: 200, data: [ { audio_url: "...", ... }, ... ] }
            // Or might vary. We'll log and parse carefully.

            console.log('[Suno] Response:', response.data);

            const clips = response.data.data || response.data; // Handle potential wrapper
            if (Array.isArray(clips) && clips.length > 0) {
                return clips[0].audio_url; // Return first song
            }

            throw new Error("No audio URL found in response");

        } catch (error: any) {
            console.error('[Suno] API Error (Graceful Fallback):', error.response?.data || error.message);
            // Return null instead of throwing to prevent app-wide 500 errors
            return null;
        }
    }
};
