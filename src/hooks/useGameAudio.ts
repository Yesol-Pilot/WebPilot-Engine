import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudioStore } from '@/store/useAudioStore';
import { Scenario } from '@/types/schema';

export function useGameAudio(scenario: Scenario, sceneData: Scenario | null) {
    const { setBgmUrl, setNarrationUrl } = useAudioStore();
    const [isAudioGenerating, setIsAudioGenerating] = useState(false);

    useEffect(() => {
        // sceneData(Landing Page Context)가 없거나 이미 생성 중이면 중단
        if (!scenario || !sceneData || isAudioGenerating) return;

        const generateAudio = async () => {
            setIsAudioGenerating(true);
            console.log("🎵 Starting Audio Generation for:", scenario.title);

            try {
                // 1. Generate BGM (Parallel)
                if (scenario.theme) {
                    axios.post('/api/audio/bgm', {
                        prompt: scenario.theme,
                        instrumental: true
                    }).then(res => {
                        if (res.data.audioUrl) {
                            console.log("🎵 BGM Generated:", res.data.audioUrl);
                            setBgmUrl(res.data.audioUrl);
                        }
                    }).catch(err => console.error("BGM Gen Error:", err));
                }

                // 2. Generate Narration (Parallel)
                if (scenario.narrative && scenario.narrative.intro) {
                    fetch('/api/audio/speech', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: scenario.narrative.intro })
                    }).then(async res => {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        console.log("🗣️ Narration Generated:", url);
                        setNarrationUrl(url);
                    }).catch(err => console.error("Narration Gen Error:", err));
                }

            } catch (e) {
                console.error("Audio Orchestration Error", e);
            } finally {
                // Parallel Promises are handling their own completion
            }
        };

        generateAudio();
    }, [sceneData, scenario, isAudioGenerating, setBgmUrl, setNarrationUrl]); // sceneData change implies new session

    return {
        isAudioGenerating
    };
}
