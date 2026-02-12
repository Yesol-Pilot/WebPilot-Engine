/**
 * LearningEnvironments.ts
 * 
 * 학습 주제별 3D 환경 프리셋
 */

export interface EnvironmentPreset {
    name: string;
    skybox: string;
    lighting: {
        ambient: string;
        directional: string;
        intensity: number;
    };
    particles?: {
        type: string;
        count: number;
        color: string;
    };
    fog?: {
        color: string;
        near: number;
        far: number;
    };
    atmosphere?: {
        mood: string;
        time: 'day' | 'night' | 'sunset' | 'dawn';
    };
}

/**
 * 학습 주제별 환경 프리셋
 */
export const LEARNING_ENVIRONMENTS: Record<string, EnvironmentPreset> = {
    // 수학
    math: {
        name: '수학의 우주',
        skybox: 'space',
        lighting: {
            ambient: '#1a1a2e',
            directional: '#4a90d9',
            intensity: 0.8
        },
        particles: {
            type: 'numbers',
            count: 50,
            color: '#00ffff'
        },
        atmosphere: {
            mood: 'calm',
            time: 'night'
        }
    },

    // 분수 (수학 하위)
    fraction: {
        name: '분수의 세계',
        skybox: 'gradient',
        lighting: {
            ambient: '#2d3436',
            directional: '#74b9ff',
            intensity: 0.9
        },
        particles: {
            type: 'pie_slices',
            count: 30,
            color: '#ffeaa7'
        },
        atmosphere: {
            mood: 'focused',
            time: 'day'
        }
    },

    // 과학
    science: {
        name: '실험실',
        skybox: 'lab',
        lighting: {
            ambient: '#ffffff',
            directional: '#dfe6e9',
            intensity: 1.2
        },
        particles: {
            type: 'molecules',
            count: 40,
            color: '#a29bfe'
        },
        fog: {
            color: '#dfe6e9',
            near: 10,
            far: 100
        },
        atmosphere: {
            mood: 'curious',
            time: 'day'
        }
    },

    // 역사
    history: {
        name: '시간의 복도',
        skybox: 'ancient',
        lighting: {
            ambient: '#4a3728',
            directional: '#f5cd79',
            intensity: 0.6
        },
        particles: {
            type: 'dust',
            count: 100,
            color: '#d4a762'
        },
        fog: {
            color: '#3d3d3d',
            near: 5,
            far: 50
        },
        atmosphere: {
            mood: 'mysterious',
            time: 'sunset'
        }
    },

    // 언어
    language: {
        name: '문자의 정원',
        skybox: 'garden',
        lighting: {
            ambient: '#55efc4',
            directional: '#81ecec',
            intensity: 1.0
        },
        particles: {
            type: 'letters',
            count: 60,
            color: '#00b894'
        },
        atmosphere: {
            mood: 'playful',
            time: 'day'
        }
    },

    // 기본/일반
    general: {
        name: '학습 공간',
        skybox: 'neutral',
        lighting: {
            ambient: '#636e72',
            directional: '#b2bec3',
            intensity: 0.8
        },
        atmosphere: {
            mood: 'neutral',
            time: 'day'
        }
    }
};

/**
 * 주제에 맞는 환경 프리셋 가져오기
 */
export function getEnvironmentPreset(topic: string): EnvironmentPreset {
    // 직접 매칭
    if (LEARNING_ENVIRONMENTS[topic]) {
        return LEARNING_ENVIRONMENTS[topic];
    }

    // 키워드 매칭
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('분수') || topicLower.includes('fraction')) {
        return LEARNING_ENVIRONMENTS.fraction;
    }
    if (topicLower.includes('수학') || topicLower.includes('math')) {
        return LEARNING_ENVIRONMENTS.math;
    }
    if (topicLower.includes('과학') || topicLower.includes('science')) {
        return LEARNING_ENVIRONMENTS.science;
    }
    if (topicLower.includes('역사') || topicLower.includes('history')) {
        return LEARNING_ENVIRONMENTS.history;
    }
    if (topicLower.includes('언어') || topicLower.includes('language')) {
        return LEARNING_ENVIRONMENTS.language;
    }

    // 기본값
    return LEARNING_ENVIRONMENTS.general;
}

export default LEARNING_ENVIRONMENTS;
