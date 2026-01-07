import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

// Maximum wait time: 3 minutes
const MAX_RETRIES = 60;
const RETRY_INTERVAL = 3000; // 3 seconds

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Log API Key presence (masked)
        console.log(`[Tripo] API Key loaded: ${TRIPO_API_KEY ? 'Yes (' + TRIPO_API_KEY.slice(0, 4) + '...)' : 'No'}`);

        if (!TRIPO_API_KEY) {
            return NextResponse.json({ error: 'Tripo API Key is missing on server' }, { status: 500 });
        }

        // 1. Create Task
        try {
            const createResponse = await axios.post(
                API_URL,
                {
                    type: 'text_to_model',
                    prompt: prompt,
                },
                {
                    headers: {
                        Authorization: `Bearer ${TRIPO_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (createResponse.data.code !== 0) {
                throw new Error(`Tripo API Logic Error: ${createResponse.data.message}`);
            }

            const taskId = createResponse.data.data.task_id;
            console.log(`[Tripo] Task started: ${taskId} for prompt: "${prompt}"`);

            // 2. Poll for Result
            let attempts = 0;
            while (attempts < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                attempts++;

                const statusResponse = await axios.get(`${API_URL}/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${TRIPO_API_KEY}`,
                    },
                });

                const taskData = statusResponse.data.data;
                const status = taskData.status; // 'queued', 'running', 'success', 'failed', 'cancelled'

                console.log(`[Tripo] Polling ${taskId}: ${status} (${attempts}/${MAX_RETRIES})`);

                if (status === 'success') {
                    const modelUrl = taskData.output.model; // .glb URL
                    console.log(`[Tripo] Success! URL: ${modelUrl}`);

                    return NextResponse.json({ success: true, modelUrl, taskId });
                } else if (status === 'failed' || status === 'cancelled') {
                    // Return more detail on failure
                    return NextResponse.json({ error: 'Model generation failed', details: taskData }, { status: 500 });
                }
            }

        } catch (axiosError: any) {
            console.error("Axios Error Details:", axiosError.response?.data);

            // Handle Insufficient Credit specifically
            if (axiosError.response?.status === 403 || axiosError.response?.status === 402) {
                const message = axiosError.response?.data?.message || 'Insufficient API Credit';
                if (message.includes('Balance is not enough') || message.includes('credit')) {
                    return NextResponse.json({
                        success: false,
                        reason: 'insufficient_quota',
                        message: message
                    }, { status: 200 }); // Return 200 to let client handle it gracefully
                }
            }

            return NextResponse.json({
                error: axiosError.message,
                details: axiosError.response?.data
            }, { status: axiosError.response?.status || 500 });
        }

        return NextResponse.json({ error: 'Timeout waiting for model generation' }, { status: 504 });

    } catch (error: any) {
        console.error('Tripo generation failed (General):', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
