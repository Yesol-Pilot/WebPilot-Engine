/**
 * /api/assets/similar - 유사 에셋 검색 API
 * 
 * USN Phase 4: 기하학적 유사도 기반 검색
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    arrayToFeatureVector,
    assetRegistry,
    generateSimilarityReport
} from '@/utils/GeometricFeatureVector';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            featureVector,      // 12D 배열 또는 객체
            limit = 10,
            minSimilarity = 0.3,
            categoryFilter,
            excludeIds = []
        } = body;

        if (!featureVector) {
            return NextResponse.json({
                success: false,
                error: 'featureVector is required'
            }, { status: 400 });
        }

        // Feature Vector 변환
        const queryVector = Array.isArray(featureVector)
            ? arrayToFeatureVector(featureVector)
            : featureVector;

        // 유사 에셋 검색
        const results = assetRegistry.findSimilar(queryVector, {
            limit,
            minSimilarity,
            categoryFilter,
            excludeIds
        });

        // 리포트 생성
        const report = generateSimilarityReport(queryVector, results);

        return NextResponse.json({
            success: true,
            data: {
                results,
                count: results.length,
                report
            }
        });

    } catch (error) {
        console.error('[API] /api/assets/similar 오류:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');

        let assets;

        if (category) {
            assets = assetRegistry.getByCategory(category);
        } else if (tag) {
            assets = assetRegistry.searchByTag(tag);
        } else {
            assets = assetRegistry.getAll();
        }

        return NextResponse.json({
            success: true,
            data: {
                assets: assets.map(a => ({
                    id: a.id,
                    path: a.path,
                    name: a.name,
                    category: a.category,
                    tags: a.tags,
                    shape: getShapeFromVector(a.featureVector),
                    similarity: 1.0 // 자기 자신
                })),
                count: assets.length
            }
        });

    } catch (error) {
        console.error('[API] /api/assets/similar GET 오류:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function getShapeFromVector(fv: ReturnType<typeof arrayToFeatureVector>): string {
    if (fv.shapeElongated === 1) return 'elongated';
    if (fv.shapeFlat === 1) return 'flat';
    if (fv.shapeCubic === 1) return 'cubic';
    return 'irregular';
}
