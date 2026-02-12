import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CreateWorldSchema, SetCameraSchema } from "../schemas.js";
import { pushToQueue } from "../queue.js"; // We need to extract pushToQueue helper

export function registerCoreTools(server: McpServer) {
    server.tool(
        "create_world",
        "Initializes a new 3D environment based on a narrative theme.",
        CreateWorldSchema.shape,
        async (args) => {
            const command = { type: 'create_world', payload: args, timestamp: Date.now() };
            await pushToQueue(command);
            return {
                content: [{ type: "text", text: `[MCP] Queued create_world: ${args.theme}` }]
            };
        }
    );

    server.tool(
        "set_camera",
        "Controls the camera angle/shot.",
        SetCameraSchema.shape,
        async (args) => {
            const command = { type: 'set_camera', payload: args, timestamp: Date.now() };
            await pushToQueue(command);
            return {
                content: [{ type: "text", text: `[MCP] Queued set_camera: ${args.shot_type}` }]
            };
        }
    );
}
