import { ChatOpenAI } from "@langchain/openai";
import { MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";

async function main() {
  // 1. Configure MCP servers
  const config = {
    mcpServers: {
      playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    },
  };
  const client = MCPClient.fromDict(config);

  // 2. Create LLM
  const llm = new ChatOpenAI({
    model: process.env.MODEL_NAME || "gpt-4o",
    apiKey: process.env.API_KEY,
    configuration: { baseURL: process.env.BASE_URL },
  });

  // 3. Instantiate agent
  const agent = new MCPAgent({ llm, client, maxSteps: 20 });

  // 4. Run query
  const result = await agent.run(
    "Find the best restaurant in Tokyo using Google Search"
  );
  console.log("Result:", result);
}

main().catch(console.error);
