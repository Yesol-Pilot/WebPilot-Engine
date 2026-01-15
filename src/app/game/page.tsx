'use client';

import GameClient from '@/components/game/GameClient';
import { HOUSE_SCENARIOS } from '@/data/houseScenarios';

export default function GamePage() {
    // Default to Gryffindor common room unless generated data overrides it in GameClient
    return <GameClient initialScenario={HOUSE_SCENARIOS.Gryffindor} />;
}
