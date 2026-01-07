import axios from 'axios';
import { Scenario } from '@/types/schema';

export const GeminiService = {
    /**
     * Translates image and prompt into a structured 3D scenario
     * @param imageFile User uploaded image file
     * @param prompt Optional additional instructions
     * @returns Parsed Scenario object
     */
    analyzeImage: async (input: File | string, prompt?: string): Promise<Scenario> => {
        // 1. Convert to Base64 if input is File
        let base64Image: string;

        if (typeof input === 'string') {
            base64Image = input;
        } else {
            base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(input);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        }

        // 2. Call Next.js API Route (Server-side proxy)
        const response = await axios.post('/api/analyze', {
            image: base64Image,
            prompt
        });

        // 3. Return JSON data
        // Assuming API returns the raw JSON directly
        return response.data;
    }
};
