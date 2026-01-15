import { NextRequest, NextResponse } from 'next/server';

// Mock in-memory job store
const jobs: Record<string, { status: string; url?: string; startTime: number }> = {};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Simulate creating a job
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        jobs[jobId] = {
            status: 'pending',
            startTime: Date.now()
        };

        // Simulate async processing (Mock Result: a simple cube or existing asset)
        // In a real scenario, this would call Hyper3D API
        setTimeout(() => {
            jobs[jobId].status = 'completed';
            jobs[jobId].url = '/assets/models/barrel.glb'; // Fallback file for testing
        }, 5000); // 5 seconds delay

        return NextResponse.json({ jobId, status: 'pending' });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId || !jobs[jobId]) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const job = jobs[jobId];
    return NextResponse.json(job);
}
