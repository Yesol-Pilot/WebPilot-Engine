import { getDailyReports, getDocReports } from '@/lib/reports';
import ReportsView from '@/components/ReportsView';

export const metadata = {
    title: 'R&D Archive | WebPilot Engine',
    description: 'Engineering documentation and daily R&D logs.',
};

export default function ReportsPage() {
    const dailyReports = getDailyReports();
    const docReports = getDocReports();

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-black pb-24">
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-20">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                        R&D ARCHIVE
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Visualizing the engineering journey of WebPilot Engine.
                    </p>
                </div>
            </div>

            <ReportsView dailyReports={dailyReports} docReports={docReports} />
        </div>
    );
}
