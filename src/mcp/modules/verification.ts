import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pushToQueue } from "../queue.js";

export function registerVerificationTools(server: McpServer) {
    server.tool(
        "verify_scene",
        "Requests a Visual Question Answering (VQA) check on the current scene.",
        {
            check_points: z.array(z.string()).describe("List of visual elements to verify (e.g. ['is dark', 'has fog'])"),
            narrative_intent: z.string().describe("The original intent of the scene")
        },
        async (args) => {
            // In a real implementation, this would:
            // 1. Dispatch a 'capture_screenshot' command to Frontend
            // 2. Wait for image upload
            // 3. Send image to Gemini Vision

            console.log(`[MCP] Verifying Scene: ${args.narrative_intent}`);

            // For now, we just log it as a command so the Frontend knows we are 'checking'
            // We reuse the generic command structure
            const command = {
                type: 'verify_scene',
                payload: args,
                timestamp: Date.now()
            };
            await pushToQueue(command);

            return {
                content: [{
                    type: "text",
                    text: `[MCP] Verification requested for: ${args.narrative_intent}`
                }]
            };
        }
    );
}
