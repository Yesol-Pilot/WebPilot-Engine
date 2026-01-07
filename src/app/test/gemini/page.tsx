'use client';

import { useState } from 'react';
import { GeminiService } from '@/services/GeminiService';
import { Scenario } from '@/types/schema';

export default function GeminiTestPage() {
    const [image, setImage] = useState<File | null>(null);
    const [result, setResult] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await GeminiService.analyzeImage(image);
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during analysis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Gemini Vision & Semiotics Test</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <label className="block mb-2 font-medium">Upload an Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
                {image && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                        <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-64 rounded border" />
                    </div>
                )}
            </div>

            <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${!image || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Semiotics... (Deep Think)
                    </span>
                ) : 'Analyze & Extract Scenario'}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-8 space-y-6">
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <h2 className="text-2xl font-bold text-green-800 mb-2">{result.title}</h2>
                        <p className="text-green-700 italic">"{result.narrative_arc.intro}"</p>
                    </div>

                    <div className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-96">
                        <h3 className="text-white font-bold mb-2">Raw JSON Data</h3>
                        <pre className="text-sm font-mono">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
