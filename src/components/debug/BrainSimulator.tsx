'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/game';
import { Scenario } from '@/lib/schema/scene';

const DEFAULT_SCENARIO_JSON = `{
  "id": "scenario_001",
  "title": "Debug Scenario",
  "theme": "Horror",
  "atmosphere": "Dark Fog",
  "nodes": [
    {
      "id": "prop_chest",
      "name": "Cursed Chest",
      "type": "interactive_prop",
      "description": "An ancient chest oozing with dark energy.",
      "transform": {
        "position": [0, 0.5, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
      },
      "modelUrl": "chest_cursed",
      "affordances": ["open"],
      "relationships": []
    },
    {
      "id": "light_main",
      "name": "Spooky Light",
      "type": "light",
      "description": "A flickering light source.",
      "transform": {
        "position": [2, 3, 2],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
      },
      "modelUrl": "",
      "affordances": [],
      "relationships": []
    }
  ],
  "narrative": {
    "intro": "You find yourself in a dark void. A cursed chest lies before you.",
    "climax": "The chest opens...",
    "resolution": "It was empty."
  }
}`;

const GENERATORS = {
  horror: (text: string) => {
    const isMany = text.includes('many') || text.includes('two') || text.includes('lot');
    const nodes: any[] = [
      { id: "light", name: "Eerie Glow", type: "light", transform: { position: [2, 3, 2], rotation: [0, 0, 0], scale: [1, 1, 1] } }
    ];

    // Dynamically add objects
    nodes.push({ id: "chest_1", name: "Cursed Chest", type: "interactive_prop", modelUrl: "chest_cursed", transform: { position: [0, 0.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }, affordances: ["open"] });

    if (isMany) {
      nodes.push({ id: "chest_2", name: "Cursed Chest 2", type: "interactive_prop", modelUrl: "chest_cursed", transform: { position: [2, 0.5, 1], rotation: [0, -0.5, 0], scale: [1, 1, 1] }, affordances: ["open"] });
      nodes.push({ id: "chest_3", name: "Cursed Chest 3", type: "interactive_prop", modelUrl: "chest_cursed", transform: { position: [-2, 0.5, 1], rotation: [0, 0.5, 0], scale: [1, 1, 1] }, affordances: ["open"] });
    }

    return {
      id: `gen_horror_${Date.now()}`,
      theme: "Horror",
      atmosphere: text.includes("dark") ? "Dark Void" : "Misty Fog",
      nodes,
      narrative: { intro: isMany ? "You are surrounded by cursed chests..." : "A lone cursed chest lies ahead." }
    };
  },
  fantasy: (text: string) => {
    return {
      id: `gen_fantasy_${Date.now()}`,
      theme: "Fantasy",
      atmosphere: "Sunny Day",
      nodes: [
        { id: "tree", name: "Wisdom Tree", type: "static_mesh", modelUrl: "tree_ancient", transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] }, affordances: [] },
        { id: "sun", name: "Sunlight", type: "light", transform: { position: [10, 10, 5], rotation: [0, 0, 0], scale: [1, 1, 1] } }
      ],
      narrative: { intro: "A magical forest welcomes you." }
    };
  },
  scifi: (text: string) => {
    return {
      id: `gen_scifi_${Date.now()}`,
      theme: "Sci-Fi",
      atmosphere: "Neon City",
      nodes: [
        { id: "terminal", name: "Holo Terminal", type: "interactive_prop", modelUrl: "terminal_cyber", transform: { position: [0, 1, 0], rotation: [0, 0.5, 0], scale: [1, 1, 1] }, affordances: ["hack"] },
        { id: "neon", name: "Neon Light", type: "light", transform: { position: [-2, 2, -2], rotation: [0, 0, 0], scale: [1, 1, 1] } }
      ],
      narrative: { intro: "The neon lights of the cyberpunk city flicker." }
    };
  }
};

export default function BrainSimulator() {
  const [mode, setMode] = useState<'story' | 'json'>('story');
  const [storyInput, setStoryInput] = useState("");
  const [jsonInput, setJsonInput] = useState(DEFAULT_SCENARIO_JSON);
  const loadScenario = useGameStore((state) => state.loadScenario);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiHealth, setApiHealth] = useState<{ healthy: boolean; configured: number; total: number } | null>(null);

  // API 헬스 체크 (마운트 시 1회)
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.report) {
          setApiHealth({
            healthy: data.healthy,
            configured: data.report.summary.configured,
            total: data.report.summary.total,
          });
        }
      })
      .catch(() => setApiHealth({ healthy: false, configured: 0, total: 6 }));
  }, []);

  const loadPreset = (type: keyof typeof GENERATORS) => {
    const scenario = GENERATORS[type]("");
    setJsonInput(JSON.stringify(scenario, null, 2));
    setError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/scenario/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: storyInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'AI Generation Failed');
      }

      // Auto-Inject to Engine
      setJsonInput(JSON.stringify(data, null, 2));
      loadScenario(data); // <--- DIRECT INJECTION

      // Show success feedback instead of switching to JSON mode immediately
      // allowing user to see the 3D scene (UI can be minimized or show toast)
      // For now, staying in story mode but clearing error to show it worked
      setError("✨ Scene Generated & Injected!");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulate = () => {
    try {
      const scenario = JSON.parse(jsonInput) as Scenario;
      loadScenario(scenario);
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50 w-96 bg-black/90 text-white p-4 rounded-xl border border-gray-700 shadow-2xl font-sans">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-cyan-400">🧠 WebPilot Brain</h3>
          {apiHealth && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${apiHealth.healthy ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'}`}
              title={`API: ${apiHealth.configured}/${apiHealth.total} 설정됨`}
            >
              {apiHealth.configured}/{apiHealth.total}
            </span>
          )}
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setMode('story')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'story' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            aria-label="Switch to Story Mode"
          >
            Story
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'json' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            aria-label="Switch to JSON Mode"
          >
            JSON (Debug)
          </button>
        </div>
      </div>

      {mode === 'story' ? (
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
            <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">User Input (Scenario)</label>
            <textarea
              className="w-full h-32 bg-transparent text-white text-sm focus:outline-none resize-none"
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              placeholder="예시: 어두운 숲속에 버려진 저주받은 상자 두 개가 놓여있다..."
              aria-label="Story Input"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/20'}`}
            aria-label="Generate Scene Button"
          >
            {isGenerating ? '🤖 AI Generating...' : '✨ GENERATE SCENE'}
          </button>

          <div className="text-xs text-gray-500 text-center">
            Try: &quot;Many chests&quot;, &quot;Dark forest&quot;, &quot;Future city&quot;
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            <button onClick={() => loadPreset('horror')} className="whitespace-nowrap px-3 py-1 bg-red-900/30 hover:bg-red-800/50 text-red-200 text-xs rounded border border-red-800/50 transition-colors">🔴 Horror</button>
            <button onClick={() => loadPreset('fantasy')} className="whitespace-nowrap px-3 py-1 bg-green-900/30 hover:bg-green-800/50 text-green-200 text-xs rounded border border-green-800/50 transition-colors">🟢 Fantasy</button>
            <button onClick={() => loadPreset('scifi')} className="whitespace-nowrap px-3 py-1 bg-blue-900/30 hover:bg-blue-800/50 text-blue-200 text-xs rounded border border-blue-800/50 transition-colors">🔵 Sci-Fi</button>
          </div>

          <textarea
            className="w-full h-64 bg-gray-900 border border-gray-600 p-2 text-xs font-mono text-green-400 rounded focus:border-purple-500 focus:outline-none"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            aria-label="JSON Output"
          />

          {error && (
            <div className={`p-2 rounded text-xs border ${error.startsWith('✨') ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
              {error}
            </div>
          )}

          <button
            onClick={handleSimulate}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded font-bold transition-colors shadow-lg shadow-purple-900/20"
            aria-label="Inject JSON Button"
          >
            🚀 INJECT TO ENGINE
          </button>
        </div>
      )}
    </div>
  );
}
