'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'inherit',
});

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.contentLoaded();
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            mermaid.render(id, chart).then((result) => {
                if (ref.current) {
                    ref.current.innerHTML = result.svg;
                    // Force SVG to take full width while maintaining aspect ratio
                    const svg = ref.current.querySelector('svg');
                    if (svg) {
                        svg.style.width = '100%';
                        svg.style.height = 'auto';
                        svg.style.maxWidth = '100%';
                    }
                }
            });
        }
    }, [chart]);

    return (
        <div className="mermaid-container my-10 flex flex-col items-center bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
            <div ref={ref} className="mermaid-diagram w-full flex justify-center" />
        </div>
    );
}
