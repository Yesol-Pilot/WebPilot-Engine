'use client';

import { useState } from 'react';
import type { SceneGraphType } from '@/types/schema';

export default function TestScenePage() {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [result, setResult] = useState<SceneGraphType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('prompt', prompt);

        try {
            const response = await fetch('/api/scene-analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze scene');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Image-to-Scenario Analyzer (Gemini 3 Pro)</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Analyze the hidden danger in this scene..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                    >
                        {loading ? 'Analyzing with Gemini 3 Pro...' : 'Analyze Scene'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p className="font-bold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6">
                        <div className="border-b pb-4">
                            <h2 className="text-2xl font-semibold text-gray-900">Analysis Result</h2>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Scenario Narrative</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{result.scenario_narrative}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Atmosphere</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.atmosphere.map((keyword, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Objects ({result.objects.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.objects.map((obj, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg border ${obj.is_interactive ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800">{obj.name}</h4>
                                            {obj.is_interactive && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full border border-green-200">Interactive</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{obj.spatial_desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Raw JSON</h3>
                            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
