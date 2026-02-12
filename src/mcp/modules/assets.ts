import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SpawnActorSchema, OptimizeAssetSchema } from "../schemas.js";
import { pushToQueue } from "../queue.js";
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);

export function registerAssetTools(server: McpServer) {
    server.tool(
        "spawn_actor",
        "Spawns a 3D object/character at a specific location.",
        SpawnActorSchema.shape,
        async (args) => {
            const command = { type: 'spawn_actor', payload: args, timestamp: Date.now() };
            await pushToQueue(command);
            return {
                content: [{ type: "text", text: `[MCP] Queued spawn_actor: ${args.name}` }]
            };
        }
    );

    server.tool(
        "optimize_asset",
        "Runs Blender in background to decimate/optimize a 3D mesh.",
        OptimizeAssetSchema.shape,
        async (args) => {
            try {
                // Determine paths
                const scriptPath = path.join(process.cwd(), 'scripts', 'blender', 'optimize_mesh.py');
                // Hardcoded path for the pilot environment
                const blenderCmd = 'C:\\Program Files\\Blender Foundation\\Blender 5.0\\blender.exe';


                const input = args.input_path;
                const output = args.output_path || input.replace('.glb', '_optimized.glb');

                console.log(`[MCP] Optimizing: ${input} -> ${output}`);

                // Exec: blender -b -P script.py -- --input in.glb --output out.glb --ratio 0.5
                const cmd = `"${blenderCmd}" -b -P "${scriptPath}" -- --input "${input}" --output "${output}" --ratio ${args.ratio}`;

                const { stdout } = await execAsync(cmd);

                return {
                    content: [
                        { type: "text", text: `Optimization complete: ${output}` },
                        { type: "text", text: `Logs: ${stdout.substring(0, 200)}...` }
                    ]
                };
            } catch (e: any) {
                return {
                    isError: true,
                    content: [{ type: "text", text: `Blender optimization failed: ${e.message}` }]
                };
            }
        }
    );
}
