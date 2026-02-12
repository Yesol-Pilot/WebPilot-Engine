'use client';

import React, { useMemo } from 'react';

interface GeneratedCoverProps {
    slug: string;
    className?: string;
    title?: string;
}

export default function GeneratedCover({ slug, className = "", title }: GeneratedCoverProps) {
    const gradient = useMemo(() => {
        // Simple hash function to generate consistent numbers from string
        let hash = 0;
        for (let i = 0; i < slug.length; i++) {
            hash = slug.charCodeAt(i) + ((hash << 5) - hash);
        }

        const c1 = `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
        const c2 = `hsl(${Math.abs((hash + 120) % 360)}, 80%, 65%)`;
        const c3 = `hsl(${Math.abs((hash + 240) % 360)}, 60%, 55%)`;
        const angle = Math.abs(hash % 360);

        return `linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`;
    }, [slug]);

    const patternStyles = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < slug.length; i++) {
            hash = slug.charCodeAt(i) + ((hash << 5) - hash);
        }
        return {
            opacity: 0.3,
            backgroundImage: `radial-gradient(circle at ${Math.abs(hash % 100)}% ${Math.abs((hash >> 2) % 100)}%, white 0%, transparent 50%)`,
        };
    }, [slug]);

    return (
        <div
            className={`w-full h-full relative overflow-hidden ${className}`}
            style={{ background: gradient }}
        >
            <div className="absolute inset-0" style={patternStyles} />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

            {/* Optional: Abstract geometric shapes for more "Tech" feel */}
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-white/10 rotate-12 blur-3xl" />

            {title && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg text-center leading-tight">
                        {title}
                    </h1>
                </div>
            )}
        </div>
    );
}
