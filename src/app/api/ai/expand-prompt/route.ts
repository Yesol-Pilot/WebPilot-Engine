/**
 * Stage 1: Prompt Expansion API Route
 */

import { createAIHandler, AIModelTier } from '../utils/gemini';

export const POST = createAIHandler('PromptExpansion', AIModelTier.ULTRA);
