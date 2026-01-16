'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Report } from '@/lib/reports';
import GeneratedCover from './GeneratedCover';
import { motion, AnimatePresence } from 'framer-motion';

function ReportCard({ report }: { report: Report }) {
    return (
        <Link
            href={`/reports/${report.slug}`}
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-zinc-800"
        >
            {/* Cover Image Area */}
            <div className="h-48 overflow-hidden relative">
                <GeneratedCover slug={report.slug} className="w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-mono border border-gray-200 dark:border-zinc-700">
                    {report.date}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                    {report.tags && report.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:text-gray-100 transition-colors leading-tight">
                    {report.title}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                    {(() => {
                        const cleanContent = report.content.replace(/^# .+\n/, '');
                        const summary = cleanContent.split('\n').find(l => l.includes('Summary:') || l.includes('목표:') || (l.length > 30 && !l.startsWith('#') && !l.startsWith('```')));
                        return summary?.replace(/^[#-]\s*/, '').replace(/\*\*/g, '') || "No summary available.";
                    })()}
                </p>

                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                    Read Report
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </Link>
    );
}

export default function ReportsView({ dailyReports, docReports }: { dailyReports: Report[], docReports: Report[] }) {
    const [activeTab, setActiveTab] = useState<'docs' | 'daily'>('docs');

    return (
        <div className="container mx-auto px-4 max-w-6xl -mt-12 relative z-10">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
                <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-zinc-800 inline-flex">
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'docs'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        Engineering Docs
                    </button>
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'daily'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        Daily R&D Logs
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {(activeTab === 'docs' ? docReports : dailyReports).map((report) => (
                        <ReportCard key={report.slug} report={report} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {(activeTab === 'docs' ? docReports : dailyReports).length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No reports found in this section.</p>
                </div>
            )}
        </div>
    );
}
