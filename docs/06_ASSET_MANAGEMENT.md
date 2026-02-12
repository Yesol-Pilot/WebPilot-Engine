# 📦 06. 에셋 관리

> 3,477개 총 에셋 (2,632 GLB) 인벤토리, 벡터 검색 파이프라인, 데이터베이스 스키마  
> **최종 업데이트**: 2026-02-12

---

## 🎯 에셋 시스템 개요

WebPilot Engine은 **3,477개 에셋** (2,632 GLB 3D 모델 포함)을 관리합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    Asset Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   검색 쿼리  │ ──▶│ Vector +    │ ──▶│  최적 매칭   │      │
│  │ "wooden table"│    │ Semantic    │    │ table.glb   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                               │
│  데이터 소스:                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │VectorSearch │    │SemanticCache│    │AssetRegistry │      │
│  │ (임베딩)    │    │ (캐시)      │    │ (레지스트리)  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 에셋 디렉터리 구조

```
public/models/
├── 📂 Kenney/              # Kenney.nl CC0 에셋팩 (~800개)
│   ├── buildings/          # 건물
│   ├── furniture/          # 가구
│   ├── nature/             # 자연
│   ├── props/              # 소품
│   └── vehicles/           # 탈것
│
├── 📂 PolyPizza/           # Poly Pizza (~600개)
│   ├── characters/
│   ├── environment/
│   └── props/
│
├── 📂 generated/           # 🆕 SDXL+TripoSR 자체 생성 (952개)
│   ├── buildings/          # 29개 카테고리 자동 분류
│   ├── creatures/
│   ├── weapons/
│   ├── nature/
│   └── ...                 # 전수 감사 손상률 0%
│
├── 📂 Quaternius/          # Quaternius CC0 팩 (~200개)
│   └── lowpoly/
│
└── 📂 Custom/              # 기타 에셋
    ├── environments/
    └── objects/
```

---

## 🗄️ 데이터베이스 스키마

### Prisma 스키마

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Asset3D {
  id          String   @id @default(cuid())
  name        String
  filePath    String   @unique
  category    String
  subCategory String?
  tags        String   // JSON array as string
  
  // 메타데이터
  fileSize    Int?
  polyCount   Int?
  hasTextures Boolean  @default(false)
  hasRig      Boolean  @default(false)
  
  // 원본 정보
  source      String   // "kenney", "polypizza", "sketchfab", "custom"
  license     String?
  
  // 시맨틱 정보
  keywords    String   // JSON array: ["table", "wooden", "medieval"]
  defaultRole String?  // SemanticRole 기본값
  
  // 타임스탬프
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([name])
}

model AssetUsage {
  id          String   @id @default(cuid())
  assetId     String
  sceneId     String
  usedAt      DateTime @default(now())
  
  @@index([assetId])
  @@index([sceneId])
}
```

### 카테고리 분류

| 카테고리 | 설명 | 예시 |
|----------|------|------|
| `environment` | 환경 전체 | 성, 던전, 숲 |
| `building` | 건물 | 집, 탑, 다리 |
| `furniture` | 가구 | 테이블, 의자, 침대 |
| `decoration` | 장식 | 촛불, 화분, 액자 |
| `character` | 캐릭터 | NPC, 몬스터 |
| `nature` | 자연물 | 나무, 바위, 꽃 |
| `props` | 소품 | 상자, 통, 책 |
| `vehicle` | 탈것 | 마차, 배, 자동차 |
| `lighting` | 조명 | 램프, 횃불, 샹들리에 |
| `effect` | 이펙트 | 불꽃, 연기 |

---

## 🔍 에셋 검색 파이프라인

### 3단계 폴백 전략

```typescript
// src/utils/smartAssetSearch.ts

export async function searchAsset(
    description: string,
    options?: SearchOptions
): Promise<AssetMatch | null> {
    
    // ─────────────────────────────────────
    // 1단계: AssetRegistry 메모리 검색 (가장 빠름)
    // ─────────────────────────────────────
    const registryMatch = AssetRegistry.search(description);
    if (registryMatch && registryMatch.confidence > 0.8) {
        console.log(`[AssetSearch] Registry hit: ${registryMatch.path}`);
        return registryMatch;
    }
    
    // ─────────────────────────────────────
    // 2단계: Prisma DB 검색 (전체 인벤토리)
    // ─────────────────────────────────────
    const dbMatch = await searchPrismaDB(description);
    if (dbMatch) {
        console.log(`[AssetSearch] DB hit: ${dbMatch.filePath}`);
        return {
            path: dbMatch.filePath,
            name: dbMatch.name,
            category: dbMatch.category,
            confidence: 0.7
        };
    }
    
    // ─────────────────────────────────────
    // 3단계: API 폴백 (/api/resources/match)
    // ─────────────────────────────────────
    try {
        const response = await fetch('/api/resources/match', {
            method: 'POST',
            body: JSON.stringify({ description })
        });
        const data = await response.json();
        
        if (data.filePath) {
            console.log(`[AssetSearch] API hit: ${data.filePath}`);
            return {
                path: data.filePath,
                name: data.name,
                category: data.category,
                confidence: data.confidence || 0.5
            };
        }
    } catch (error) {
        console.warn('[AssetSearch] API fallback failed:', error);
    }
    
    // ─────────────────────────────────────
    // 매칭 실패 → null 반환 (Placeholder 사용)
    // ─────────────────────────────────────
    console.log(`[AssetSearch] No match for: "${description}"`);
    return null;
}
```

### AssetRegistry 상세

```typescript
// src/data/AssetRegistry.ts

interface AssetEntry {
    path: string;
    name: string;
    category: string;
    keywords: string[];
    aliases?: string[];         // 별칭 (예: "candle" → "촛불", "bougie")
    defaultRole?: SemanticRole;
    defaultScale?: number;
}

class AssetRegistryClass {
    private assets: Map<string, AssetEntry> = new Map();
    private keywordIndex: Map<string, string[]> = new Map(); // keyword → paths
    
    constructor() {
        this.loadFromData();
        this.buildKeywordIndex();
    }
    
    /**
     * 설명으로 에셋 검색
     */
    search(description: string): AssetMatch | null {
        const normalizedDesc = description.toLowerCase().trim();
        const words = normalizedDesc.split(/\s+/);
        
        let bestMatch: { path: string; score: number } | null = null;
        
        for (const [path, entry] of this.assets) {
            let score = 0;
            
            // 이름 정확 매칭
            if (entry.name.toLowerCase() === normalizedDesc) {
                score += 100;
            }
            
            // 별칭 매칭
            if (entry.aliases?.some(a => a.toLowerCase() === normalizedDesc)) {
                score += 90;
            }
            
            // 키워드 매칭
            for (const word of words) {
                if (entry.keywords.some(k => k.toLowerCase().includes(word))) {
                    score += 10;
                }
            }
            
            // 카테고리 관련성
            if (normalizedDesc.includes(entry.category.toLowerCase())) {
                score += 5;
            }
            
            if (!bestMatch || score > bestMatch.score) {
                bestMatch = { path, score };
            }
        }
        
        if (bestMatch && bestMatch.score > 0) {
            const entry = this.assets.get(bestMatch.path)!;
            return {
                path: bestMatch.path,
                name: entry.name,
                category: entry.category,
                confidence: Math.min(1, bestMatch.score / 100)
            };
        }
        
        return null;
    }
    
    /**
     * 카테고리로 에셋 목록 조회
     */
    getByCategory(category: string): AssetEntry[] {
        const results: AssetEntry[] = [];
        for (const entry of this.assets.values()) {
            if (entry.category === category) {
                results.push(entry);
            }
        }
        return results;
    }
    
    /**
     * 전체 에셋 수
     */
    get count(): number {
        return this.assets.size;
    }
}

export const AssetRegistry = new AssetRegistryClass();
```

### API 엔드포인트

```typescript
// src/app/api/resources/match/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const { description, category } = await request.json();
    
    // 1. 정확한 이름 매칭
    const exactMatch = await prisma.asset3D.findFirst({
        where: {
            name: { contains: description, mode: 'insensitive' }
        }
    });
    
    if (exactMatch) {
        return NextResponse.json({
            filePath: exactMatch.filePath,
            name: exactMatch.name,
            category: exactMatch.category,
            confidence: 0.9
        });
    }
    
    // 2. 키워드 매칭
    const keywordMatch = await prisma.asset3D.findFirst({
        where: {
            keywords: { contains: description.toLowerCase() }
        }
    });
    
    if (keywordMatch) {
        return NextResponse.json({
            filePath: keywordMatch.filePath,
            name: keywordMatch.name,
            category: keywordMatch.category,
            confidence: 0.7
        });
    }
    
    // 3. 카테고리 폴백
    if (category) {
        const categoryMatch = await prisma.asset3D.findFirst({
            where: { category }
        });
        
        if (categoryMatch) {
            return NextResponse.json({
                filePath: categoryMatch.filePath,
                name: categoryMatch.name,
                category: categoryMatch.category,
                confidence: 0.4
            });
        }
    }
    
    return NextResponse.json({ filePath: null }, { status: 404 });
}
```

---

## 📊 에셋 통계

### 전체 에셋 분포 (3,477개)

| Type | Count | Source |
|:-----|------:|:-------|
| 3D Models (GLB) | 2,632 | SDXL+TripoSR + CC0 |
| BGM | 20 | ElevenLabs AI |
| SFX | 94 | Freesound CC0 + ElevenLabs |
| Ambient | 114 | Freesound CC0 |
| Skybox | 60 | Blockade Labs + Poly Haven |
| HDRI | 30 | Poly Haven CC0 |
| PBR Textures | 334 | Kenney + Poly Haven CC0 |
| Particles | 193 | Kenney CC0 |

### GLB 소스별 분포 (2,632개)

| 소스 | 개수 | 라이선스 |
|------|------|----------|
| Generated (SDXL+TripoSR) | 952 | 자체 생성 |
| Kenney | 800 | CC0 |
| PolyPizza | 600 | Various |
| Quaternius | 200 | CC0 |
| Custom/Other | 80 | Mixed |

> 29개 카테고리, 전수 감사 손상률 0%, 밀봉률 83%

---

## 🔧 에셋 관리 유틸리티

### 에셋 스캔 스크립트

```typescript
// scripts/scanAssets.ts

import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const MODELS_DIR = path.join(process.cwd(), 'public/models');

async function scanAndRegister() {
    const files = scanDirectory(MODELS_DIR, '.glb');
    
    for (const filePath of files) {
        const relativePath = filePath.replace(process.cwd() + '/public', '');
        const name = path.basename(filePath, '.glb');
        const category = inferCategory(filePath);
        const keywords = extractKeywords(name, filePath);
        
        await prisma.asset3D.upsert({
            where: { filePath: relativePath },
            create: {
                name,
                filePath: relativePath,
                category,
                tags: JSON.stringify([]),
                keywords: JSON.stringify(keywords),
                source: inferSource(filePath)
            },
            update: {
                name,
                category,
                keywords: JSON.stringify(keywords)
            }
        });
    }
    
    console.log(`✅ ${files.length}개 에셋 등록 완료`);
}

function scanDirectory(dir: string, extension: string): string[] {
    const results: string[] = [];
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            results.push(...scanDirectory(fullPath, extension));
        } else if (entry.name.endsWith(extension)) {
            results.push(fullPath);
        }
    }
    
    return results;
}

function inferCategory(filePath: string): string {
    const lower = filePath.toLowerCase();
    
    if (lower.includes('/furniture/')) return 'furniture';
    if (lower.includes('/nature/')) return 'nature';
    if (lower.includes('/buildings/')) return 'building';
    if (lower.includes('/characters/')) return 'character';
    if (lower.includes('/props/')) return 'props';
    if (lower.includes('/vehicles/')) return 'vehicle';
    if (lower.includes('/decorations/')) return 'decoration';
    if (lower.includes('/environment/')) return 'environment';
    if (lower.includes('/lighting/')) return 'lighting';
    
    return 'props'; // 기본값
}

scanAndRegister();
```

### 에셋 프리로드

```typescript
// src/utils/assetPreloader.ts

import { useGLTF } from '@react-three/drei';

const PRELOAD_ASSETS = [
    '/models/Kenney/furniture/table.glb',
    '/models/Kenney/furniture/chair.glb',
    '/models/Harry/candle.glb',
    // ... 자주 사용되는 에셋
];

/**
 * 앱 시작 시 자주 사용되는 에셋 프리로드
 */
export function preloadCommonAssets(): void {
    PRELOAD_ASSETS.forEach(path => {
        useGLTF.preload(path);
    });
}

/**
 * 씬 기반 에셋 프리로드
 */
export function preloadSceneAssets(nodes: SceneNode[]): void {
    nodes.forEach(node => {
        if (node.modelUrl) {
            useGLTF.preload(node.modelUrl);
        }
    });
}
```

---

## ⚠️ 하드코딩 금지 원칙

```typescript
// ❌ 절대 하지 말 것
if (concept.includes('castle')) return '/models/castle.glb';
if (concept.includes('candle')) return '/models/candle.glb';

// ✅ 올바른 방법: 시맨틱 벡터 검색
const result = await VectorSearchService.search(concept);
return result?.path || null;
```

**이유:**

- 확장성 없음 (새 에셋마다 코드 수정)
- 유지보수 비용 증가
- 동적 에셋 추가 불가
