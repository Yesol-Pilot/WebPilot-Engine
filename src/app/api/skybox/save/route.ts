import { NextRequest, NextResponse } from 'next/server';




export async function POST(req: NextRequest) {
    try {
        const { prompt, imageUrl, depthMapUrl, meshUrl } = await req.json();

        if (!prompt || !imageUrl) {
            return NextResponse.json({ error: 'Missing prompt or imageUrl' }, { status: 400 });
        }

        // Serverless Environment: Cannot save to filesystem.
        // Returning success with the external URL directly.
        console.log(`[Save Skipped] Serverless environment detected. Original URL: ${imageUrl}`);

        return NextResponse.json({ success: true, url: imageUrl, depth: depthMapUrl, mesh: meshUrl });

    } catch (error: any) {
        console.error('Save skybox failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
