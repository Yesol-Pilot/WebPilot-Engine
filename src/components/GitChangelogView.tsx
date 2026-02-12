'use client';

import { GitChangelog, GitPush, GitCommit } from '@/lib/reports';
import { motion } from 'framer-motion';

function CommitItem({ commit }: { commit: GitCommit }) {
    return (
        <div className="flex items-start gap-3 py-2 group">
            <div className="mt-1 min-w-[5rem] flex items-center justify-end gap-2">
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${commit.filesChanged > 5 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                        'bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700'
                    }`}>
                    {commit.hash}
                </span>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-relaxed">
                    {commit.message}
                </p>
                {commit.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed border-t border-gray-200 dark:border-zinc-700/50 pt-1.5">
                        {commit.description}
                    </p>
                )}

                <div className="mt-2 flex items-center justify-end gap-3 text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-green-600 dark:text-green-400">+{commit.insertions}</span>
                    <span className="text-red-500 dark:text-red-400">-{commit.deletions}</span>
                    <span className="text-gray-500">{commit.filesChanged} files</span>
                </div>
            </div>
        </div>
    );
}

function PushTimelineItem({ push, index }: { push: GitPush; index: number }) {
    const date = new Date(push.timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const time = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    // 주요 카테고리 추출
    const mainCategory = push.category?.[0] || 'chore';
    const impactScore = (push.impact?.totalInsertions || 0) + (push.impact?.totalDeletions || 0);
    const isMajor = impactScore > 100 || mainCategory === 'feat';

    const colorClass =
        mainCategory === 'feat' ? 'bg-blue-500 shadow-blue-500/50' :
            mainCategory === 'fix' ? 'bg-red-500 shadow-red-500/50' :
                'bg-gray-400 dark:bg-gray-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 md:pl-32 py-6 first:pt-0 last:pb-0 group"
        >
            {/* Timeline Line */}
            <div className="absolute left-[19px] md:left-[7.5rem] top-0 bottom-0 w-px bg-gray-200 dark:bg-zinc-800 group-last:bottom-auto group-last:h-6" />

            {/* Date Badge (Desktop: Left, Mobile: Hidden/Top) */}
            <div className="hidden md:flex flex-col items-end absolute left-0 top-6 w-24 pr-8 text-right">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200 leading-none">{day}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{month}</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600 font-mono mt-1">{time}</span>
            </div>

            {/* Timeline Dot */}
            <div className={`absolute left-[11px] md:left-[7.25rem] top-8 w-4 h-4 rounded-full border-2 border-white dark:border-black z-10 ${colorClass} shadow-lg ring-4 ring-transparent group-hover:ring-gray-100 dark:group-hover:ring-zinc-800 transition-all`} />

            {/* Content Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mainCategory === 'feat' ? 'from-blue-500/10 to-transparent' :
                        mainCategory === 'fix' ? 'from-red-500/10 to-transparent' :
                            'from-gray-500/10 to-transparent'
                    } rounded-bl-full -mr-8 -mt-8 opacity-50`} />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="md:hidden flex items-baseline gap-1 text-gray-500 text-sm font-bold">
                                <span>{month} {day}</span>
                                <span className="text-xs font-normal opacity-70">({time})</span>
                            </div>
                            <div className="flex gap-1.5">
                                {push.category?.map(cat => (
                                    <span key={cat} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat === 'feat' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900' :
                                            cat === 'fix' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900' :
                                                'bg-gray-50 text-gray-600 border-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700'
                                        }`}>
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                            {push.summary}
                        </h3>
                    </div>

                    {/* Impact Stats Big */}
                    {push.impact && (
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-2 border border-gray-100 dark:border-zinc-800/50">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Files</span>
                                <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{push.impact.totalFilesChanged}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Changes</span>
                                <div className="text-sm font-mono font-bold">
                                    <span className="text-green-600">+{push.impact.totalInsertions}</span>
                                    <span className="mx-0.5 text-gray-300">/</span>
                                    <span className="text-red-500">-{push.impact.totalDeletions}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Commits List */}
                <div className="space-y-1">
                    {push.commits.map((commit, idx) => (
                        <CommitItem key={idx} commit={commit} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function GitChangelogView({ changelog }: { changelog: GitChangelog }) {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="relative">
                {changelog.pushHistory.map((push, index) => (
                    <PushTimelineItem key={index} push={push} index={index} />
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Last Updated: {new Date(changelog.lastUpdated).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
