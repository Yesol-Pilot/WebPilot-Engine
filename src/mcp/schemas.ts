import { z } from 'zod';

export const CreateWorldSchema = z.object({
    id: z.string().describe("Unique Scenario ID"),
    theme: z.string().describe("General theme (e.g. 'Cyberpunk', 'Medieval', 'Horror')"),
    atmosphere: z.string().optional().describe("Lighting/Fog description (e.g. 'Dark and foggy', 'Bright sunlight')"),
    narrative_intro: z.string().describe("Intro text for the UI overlay")
});

export const SpawnActorSchema = z.object({
    id: z.string().describe("Unique Node ID"),
    type: z.enum(['static_mesh', 'interactive_prop', 'light', 'spawn_point']),
    name: z.string(),
    description: z.string().describe("Visual description for generative model"),
    position: z.tuple([z.number(), z.number(), z.number()]).default([0, 0, 0])
});

export const SetCameraSchema = z.object({
    target_id: z.string().optional().describe("ID of object to focus on"),
    shot_type: z.enum(['wide', 'closeup', 'over_shoulder', 'top_down']),
    duration: z.number().default(1.0).describe("Transition duration in seconds")
});

export const OptimizeAssetSchema = z.object({
    input_path: z.string().describe("Absolute path to input GLB file"),
    output_path: z.string().optional().describe("Absolute path to output GLB file"),
    ratio: z.number().default(0.5).describe("Decimation ratio (0.1 to 1.0)")
});
