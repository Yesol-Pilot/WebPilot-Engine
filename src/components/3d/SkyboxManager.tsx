import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Environment } from '@react-three/drei';

interface SkyboxManagerProps {
    prompt: string;
    onLoad?: () => void;
}

export const SkyboxManager: React.FC<SkyboxManagerProps> = ({ prompt, onLoad }) => {
    const [textureUrl, setTextureUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!prompt) return;

        const generateSkybox = async () => {
            setLoading(true);
            try {
                // 1. Check Local Cache first - PRIORITY
                try {
                    const cacheRes = await axios.post('/api/skybox/find', { prompt });
                    if (cacheRes.data.found && cacheRes.data.url) {
                        console.log("Skybox found in cache:", cacheRes.data.url);
                        setTextureUrl(cacheRes.data.url);
                        setLoading(false);
                        if (onLoad) onLoad();
                        return;
                    }
                } catch (e) {
                    console.warn("Cache check failed, proceeding to generate", e);
                }

                // 0. Circuit Breaker: Check Session Storage to prevent loop
                const sessionKey = `skybox_attempt_${prompt.substring(0, 32)}`;
                if (sessionStorage.getItem(sessionKey)) {
                    console.warn(`[Skybox] Circuit Breaker: Skipping duplicate generation for "${prompt}"`);
                    // Try to recover url if saved, else stop
                    const savedUrl = sessionStorage.getItem(sessionKey + "_url");
                    if (savedUrl) {
                        setTextureUrl(savedUrl);
                        setLoading(false);
                        if (onLoad) onLoad();
                        return;
                    }
                    // If we attempted but have no URL, it might be a previous failure.
                    // But to be safe, DO NOT GENERATE again automatically.
                    // Fallback to default
                    setTextureUrl("https://images.unsplash.com/photo-1534237710405-c5ad0866a61c");
                    setLoading(false);
                    return;
                }

                // 2. Not in cache, call Blockade Labs API
                console.log("Generating new skybox for:", prompt);
                const response = await axios.post('https://backend.blockadelabs.com/api/v1/skybox', {
                    prompt: prompt,
                    skybox_style_id: 10,
                    return_depth: true
                }, {
                    headers: { 'x-api-key': process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY }
                });

                const id = response.data.id;
                checkStatus(id);
            } catch (error: any) {
                // Fallback for 403/Forbidden or other errors
                if (error.response?.status === 403 || error.response?.status === 402) {
                    console.warn("[Skybox] Mocking Mode Activated: Insufficient API Credits or Invalid Key. Switching to callback.");
                } else {
                    console.error("Skybox generation failed:", error);
                }

                // Use a default skybox so the scene isn't black
                setTextureUrl("/skyboxes/skybox-14825994.jpg"); // Fallback: Medieval Classroom (Recovered)
                setLoading(false);
            }
        };

        const checkStatus = async (id: string) => {
            const interval = setInterval(async () => {
                try {
                    const res = await axios.get(`https://backend.blockadelabs.com/api/v1/imagine/requests/${id}`, {
                        headers: { 'x-api-key': process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY }
                    });

                    if (res.data.request.status === 'complete') {
                        clearInterval(interval);
                        const fileUrl = res.data.request.file_url;
                        setTextureUrl(fileUrl);
                        setLoading(false);
                        if (onLoad) onLoad();

                        // [Circuit Breaker] Mark as attempted/success in session so we don't retry on reload
                        const sessionKey = `skybox_attempt_${prompt.substring(0, 32)}`;
                        sessionStorage.setItem(sessionKey, "true");
                        sessionStorage.setItem(sessionKey + "_url", fileUrl);

                        // 3. Save to Local Cache
                        try {
                            await axios.post('/api/skybox/save', {
                                prompt: prompt,
                                imageUrl: fileUrl,
                                depthMapUrl: res.data.request.depth_map_url
                            });
                            console.log("Skybox saved to cache");
                        } catch (e) {
                            console.error("Failed to save skybox to cache", e);
                        }

                    } else if (res.data.request.status === 'error') {
                        clearInterval(interval);
                        setLoading(false);
                    }
                } catch (e) {
                    clearInterval(interval);
                    setLoading(false);
                }
            }, 2000);
        };

        generateSkybox();
    }, [prompt]);

    if (loading) {
        // Optional: Return a loading placeholder skybox or nothing
        return null;
    }

    return (
        <>
            {textureUrl && <Environment background={true} files={textureUrl} />}
        </>
    );
};
