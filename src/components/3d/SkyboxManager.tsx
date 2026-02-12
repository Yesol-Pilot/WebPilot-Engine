import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Environment, Html } from '@react-three/drei';

interface SkyboxManagerProps {
    prompt: string;
    onLoad?: () => void;
}

export const SkyboxManager: React.FC<SkyboxManagerProps> = ({ prompt, onLoad }) => {
    const [textureUrl, setTextureUrl] = useState<string | null>(() => {
        // [FIX] Support direct file paths immediately in initializer
        if (prompt && (prompt.startsWith('/') || prompt.startsWith('http'))) {
            return prompt;
        }

        // [Optimization] Try to hydrate from session storage immediately
        if (typeof window !== 'undefined' && prompt) {
            try {
                const sessionKey = `skybox_attempt_${prompt.substring(0, 32)}_url`;
                const cached = sessionStorage.getItem(sessionKey);
                if (cached) {
                    console.log("[Skybox] Hydrated from cache:", cached);
                    return cached;
                }
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!prompt) return;

        // [FIX] If prompt is a direct URL, use it and skip generation
        if (prompt.startsWith('/') || prompt.startsWith('http')) {
            setTextureUrl(prompt);
            return;
        }

        // [FIX] If textureUrl is already set (e.g. direct path or cache), skip generation
        if (textureUrl) return;

        const generateSkybox = async () => {
            setLoading(true);
            try {
                // 1. Check Local Cache first - PRIORITY
                try {
                    const cacheRes = await axios.post('/api/skybox/find', { prompt });
                    if (cacheRes.data.found && cacheRes.data.filePath) {
                        console.log("Skybox found in cache:", cacheRes.data.filePath);
                        setTextureUrl(cacheRes.data.filePath);
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
                    // Fallback to default
                    setTextureUrl("https://images.unsplash.com/photo-1534237710405-c5ad0866a61c");
                    setLoading(false);
                    return;
                }

                // 2. Not in cache, call Blockade Labs API
                console.log("Generating new skybox for:", prompt);
                const response = await axios.post('https://backend.blockadelabs.com/api/v1/skybox', {
                    // [Refined Prompt] Enforce "Ground Level" perspective for infinite floor illusion
                    prompt: prompt + ", view from ground level, standing on floor, 1.7m eye height, straight horizon, high quality, 8k",
                    skybox_style_id: 10,
                    return_depth: true
                }, {
                    headers: { 'x-api-key': process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY }
                });

                const id = response.data.id;
                checkStatus(id);
            } catch (error: any) {
                // ... error handling ...
                if (error.response?.status === 403 || error.response?.status === 402) {
                    console.warn("[Skybox] Mocking Mode Activated: Insufficient API Credits or Invalid Key. Switching to callback.");
                } else {
                    console.error("Skybox generation failed:", error);
                }
                setTextureUrl("/skyboxes/skybox-14825994.jpg");
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

                        // Cache Logic...
                        const sessionKey = `skybox_attempt_${prompt.substring(0, 32)}`;
                        sessionStorage.setItem(sessionKey, "true");
                        sessionStorage.setItem(sessionKey + "_url", fileUrl);

                        try {
                            await axios.post('/api/skybox/save', {
                                prompt: prompt,
                                imageUrl: fileUrl,
                                depthMapUrl: res.data.request.depth_map_url
                            });
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
    }, [prompt, textureUrl]);

    if (loading) {
        return (
            <Html center>
                <div className="flex flex-col items-center justify-center bg-black/50 p-4 rounded-xl backdrop-blur-md border border-white/10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-white font-bold text-sm shadow-lg whitespace-nowrap">
                        🌌 배경 공간 생성 중...
                    </span>
                    <span className="text-xs text-gray-300 mt-1">약 10~20초 소요됩니다</span>
                </div>
            </Html>
        );
    }

    return (
        <>
            {textureUrl && (
                <group position={[0, 0, 0]}>
                    {/* [Fixed] Reset position to 0 to align with the physics floor. */}
                    <Environment
                        background={true}
                        files={textureUrl}
                    // [FIX] Removed 'ground' prop entirely to prevent clipping. 
                    // This reverts to an infinite sky sphere.
                    />
                </group>
            )}
        </>
    );
};
