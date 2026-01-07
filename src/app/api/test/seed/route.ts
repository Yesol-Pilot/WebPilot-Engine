import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const prompt = "medieval fantasy classroom, magical runes, floating candles, wooden desks, sunlight through stained glass";
        const filePath = "/skyboxes/medieval_classroom.jpg";

        console.log(`Seeding skybox: ${prompt}`);

        await prisma.skybox.upsert({
            where: { prompt: prompt },
            update: { filePath: filePath },
            create: {
                prompt: prompt,
                filePath: filePath,
                styleId: 10
            }
        });

        return NextResponse.json({ success: true, message: "Seeding successful" });
    } catch (e: any) {
        console.error("Seeding failed:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
