import { getReportBySlug, getAllReports } from '@/lib/reports';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Mermaid from '@/components/Mermaid';
import GeneratedCover from '@/components/GeneratedCover';

// Generate static params so the page can be static
export async function generateStaticParams() {
    const reports = getAllReports();
    return reports.map((report) => ({
        slug: report.slug,
    }));
}

export default async function ReportDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const report = getReportBySlug(params.slug);

    return (
        <article className="min-h-screen bg-[#FAFAFA] dark:bg-black">
            {/* Hero Section with Generative Art */}
            <div className="relative w-full h-[400px]">
                <GeneratedCover slug={params.slug} title={report.title} className="w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] dark:from-black to-transparent" />
            </div>

            {/* Meta Info Section */}
            <div className="container mx-auto px-4 max-w-4xl -mt-20 relative z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 p-8">
                    <Link href="/reports" className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mr-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </span>
                        Back to Archive
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium font-mono">
                        <span className="flex items-center text-gray-900 dark:text-gray-100">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {report.date}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        {report.tags && report.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 max-w-4xl py-12">
                <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-gray-100 dark:prose-img:border-zinc-800 font-sans"
                >
                    <ReactMarkdown components={{
                        code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            const isMermaid = match && match[1] === 'mermaid';

                            if (!inline && isMermaid) {
                                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                            }

                            return !inline && match ? (
                                <div className="relative group my-6">
                                    <div className="absolute right-0 top-0 bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-mono select-none">
                                        {match[1].toUpperCase()}
                                    </div>
                                    <code className={`${className} block bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed shadow-xl`} {...props}>
                                        {children}
                                    </code>
                                </div>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}>
                        {report.content}
                    </ReactMarkdown>
                </div>
            </div>
        </article>
    );
}
