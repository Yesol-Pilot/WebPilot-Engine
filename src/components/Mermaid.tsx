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
                }
            });
        }
    }, [chart]);

    return (
        <div className="my-8 flex justify-center bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-700 overflow-x-auto">
            <div ref={ref} className="mermaid-diagram" />
        </div>
    );
}
