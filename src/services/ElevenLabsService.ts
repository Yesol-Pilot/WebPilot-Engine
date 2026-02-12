import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { prisma } from '@/lib/prisma';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Init Client
// Note: We initialize lazily or check key presence in methods to avoid build time errors if key is missing locally
let client: ElevenLabsClient | null = null;

const getClient = () => {
    if (!client && ELEVENLABS_API_KEY) {
        client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
    }
    return client;
};

export const ElevenLabsService = {
    /**
     * Text to Speech (TTS)
     * @param text Text to generate audio from
     * @param voiceId Voice ID to use
     */
    generateSpeech: async (text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM') => {
        const eleven = getClient();
        if (!eleven) throw new Error("ElevenLabs API Key is missing");

        try {
            const audioStream = await eleven.textToSpeech.convert(voiceId, {
                text,
                modelId: "eleven_multilingual_v2",
                voiceSettings: {
                    stability: 0.5,
                    similarityBoost: 0.5,
                }
            });

            // Convert ReadableStream to ArrayBuffer for API response
            const chunks: Uint8Array[] = [];
            for await (const chunk of audioStream as any) {
                chunks.push(chunk);
            }

            // [Usage Log]
            try {
                const today = new Date().toISOString().split('T')[0];
                const charCount = text.length;
                await prisma.apiUsage.upsert({
                    where: { date_provider: { date: today, provider: 'eleven' } },
                    update: { count: { increment: charCount } },
                    create: { date: today, provider: 'eleven', count: charCount }
                });
            } catch (e) {
                console.warn("[ElevenLabs] Usage log failed", e);
            }

            return Buffer.concat(chunks);

        } catch (error) {
            console.error("[ElevenLabs] TTS SDK Error:", error);
            throw error;
        }
    },

    /**
     * Text to Sound Effects (SFX)
     * @param prompt Description of the sound
     */
    generateSoundEffect: async (prompt: string) => {
        const eleven = getClient();
        if (!eleven) throw new Error("ElevenLabs API Key is missing");

        try {
            const audioStream = await eleven.textToSoundEffects.convert({
                text: prompt,
                durationSeconds: undefined,
                promptInfluence: 0.3
            });

            const chunks: Uint8Array[] = [];
            for await (const chunk of audioStream as any) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error("[ElevenLabs] SFX SDK Error:", error);
            throw error;
        }
    }
};
