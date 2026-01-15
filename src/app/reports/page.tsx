import Link from 'next/link';
import { getAllReports } from '@/lib/reports';
import GeneratedCover from '@/components/GeneratedCover';

export default function ReportsPage() {
    const reports = getAllReports();

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-black pb-24">
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-20">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                        R&D ARCHIVE
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Visualizing the engineering journey of WebPilot Engine. <br />
                        <span className="text-sm font-mono mt-2 block text-gray-400">Total {reports.length} Reports Logged</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                        <Link
                            key={report.slug}
                            href={`/reports/${report.slug}`}
                            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-3xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Cover Image Area */}
                            <div className="h-48 overflow-hidden relative">
                                <GeneratedCover slug={report.slug} className="w-full h-full transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold font-mono">
                                    {report.date}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex gap-2 mb-4">
                                    {report.tags && report.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600 dark:text-gray-100 transition-colors leading-tight">
                                    {report.title}
                                </h2>

                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                                    {(() => {
                                        const cleanContent = report.content.replace(/^# .+\n/, '');
                                        const summary = cleanContent.split('\n').find(l => l.includes('Summary:') || l.includes('목표:') || (l.length > 30 && !l.startsWith('#') && !l.startsWith('```')));
                                        return summary?.replace(/^[#-]\s*/, '').replace(/\*\*/g, '') || "No summary available.";
                                    })()}
                                </p>

                                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-2 transition-transform">
                                    Read Report
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
