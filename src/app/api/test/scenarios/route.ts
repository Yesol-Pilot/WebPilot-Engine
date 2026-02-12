import { NextResponse } from 'next/server';
import { DEFAULT_SCENARIO, getScenarioById, LEGACY_SCENARIOS } from '@/data/scenarios';

export async function GET() {
    const results = {
        defaultScenario: false,
        legacyScenario: false,
        scenarioById: false,
        legacyCount: 0,
        errors: [] as string[]
    };

    try {
        // 1. Check Default Scenario
        if (DEFAULT_SCENARIO && DEFAULT_SCENARIO.id === 'fantasy_demo_001') {
            results.defaultScenario = true;
        } else {
            results.errors.push(`Default Scenario mismatch: ${DEFAULT_SCENARIO?.id}`);
        }

        // 2. Check Legacy Access
        if (LEGACY_SCENARIOS && LEGACY_SCENARIOS['SortingCeremony']) {
            results.legacyScenario = true;
        } else {
            results.errors.push('Legacy SortingCeremony not found');
        }

        // 3. Check Helper Function
        const found = getScenarioById('fantasy_demo');
        if (found && found.id === 'fantasy_demo_001') {
            results.scenarioById = true;
        } else {
            results.errors.push(`getScenarioById failed for fantasy_demo (Got: ${found?.id})`);
        }

        // 4. Count Legacies
        results.legacyCount = Object.keys(LEGACY_SCENARIOS).length;

    } catch (e: unknown) {
        if (e instanceof Error) {
            results.errors.push(e.message);
        } else {
            results.errors.push(String(e));
        }
    }

    if (results.errors.length === 0) {
        return NextResponse.json({ success: true, results });
    } else {
        return NextResponse.json({ success: false, results }, { status: 500 });
    }
}
