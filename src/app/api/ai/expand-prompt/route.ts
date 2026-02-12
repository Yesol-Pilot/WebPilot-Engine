/**
 * Stage 1: Prompt Expansion API Route
 */

import { createAIHandler } from '../utils/gemini';

export const POST = createAIHandler('PromptExpansion');
