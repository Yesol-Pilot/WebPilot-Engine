import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCoreTools } from "./modules/core";
import { registerAssetTools } from "./modules/assets";
import { registerKnowledgeTools } from "./modules/knowledge";
import { registerVerificationTools } from "./modules/verification";

// Initialize MCP Server
const server = new McpServer({
    name: "WebPilot-Engine",
    version: "2.0.0"
});

// Register Modules
registerCoreTools(server);
registerAssetTools(server);
registerKnowledgeTools(server);
registerVerificationTools(server);

// Transport Setup
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("WebPilot MCP Server running on stdio... (Modular Architecture)");
}

main().catch((error) => {
    console.error("Fatal error in MCP server:", error);
    process.exit(1);
});

