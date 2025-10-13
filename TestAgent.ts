import { ChatOpenAI } from "@langchain/openai";
import { MCPAgent, MCPClient } from "mcp-use";
import * as fs from "fs/promises";
import * as path from "path";

export interface TestResult {
  testFile: string;
  testNumber: number;
  prompt: string;
  result: any;
  success: boolean;
  error?: string;
}

export interface TestAgentConfig {
  modelName?: string;
  apiKey: string;
  baseURL?: string;
  testsDir?: string;
  maxSteps?: number;
  mcpServers?: Record<string, { command: string; args: string[] }>;
}

export class TestAgent {
  private agent: MCPAgent;
  private testsDir: string;

  constructor(config: TestAgentConfig) {
    this.testsDir = config.testsDir || "./tests";

    const mcpConfig = {
      mcpServers: config.mcpServers || {
        playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
      },
    };
    const client = MCPClient.fromDict(mcpConfig);

    const llm = new ChatOpenAI({
      model: config.modelName || "gpt-4o",
      apiKey: config.apiKey,
      configuration: { baseURL: config.baseURL },
    });

    this.agent = new MCPAgent({
      llm,
      client,
      maxSteps: config.maxSteps || 20,
    });
  }

  async getTestFiles(): Promise<string[]> {
    const files = await fs.readdir(this.testsDir);
    return files
      .filter((file) => file.endsWith(".test"))
      .sort()
      .map((file) => path.join(this.testsDir, file));
  }

  async readTestContent(filePath: string): Promise<string> {
    return await fs.readFile(filePath, "utf-8");
  }

  buildTestPrompt(testContent: string): string {
    const currentDateTime = new Date().toISOString();
    return `
Current Date/Time: ${currentDateTime}

Instructions:
- Follow the test steps below carefully
- Return your response in JSON format with the following structure:
  {
    "success": boolean,
    "steps_completed": string[],
    "observations": string,
    "final_status": string
  }

Test Steps:
${testContent}
`.trim();
  }

  async runSingleTest(
    testFile: string,
    testNumber: number
  ): Promise<TestResult> {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Running Test #${testNumber}: ${path.basename(testFile)}`);
    console.log("=".repeat(60));

    try {
      const testContent = await this.readTestContent(testFile);
      console.log(`\nTest Content:\n${testContent}\n`);

      const prompt = this.buildTestPrompt(testContent);
      const result = await this.agent.run(prompt);

      console.log(`\nResult:`, result);

      return {
        testFile: path.basename(testFile),
        testNumber,
        prompt: testContent,
        result,
        success: true,
      };
    } catch (error) {
      console.error(`\nError running test:`, error);
      return {
        testFile: path.basename(testFile),
        testNumber,
        prompt: "",
        result: null,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async runAllTests(): Promise<TestResult[]> {
    const testFiles = await this.getTestFiles();
    console.log(
      `\nFound ${testFiles.length} test file(s):\n${testFiles
        .map((f) => `  - ${path.basename(f)}`)
        .join("\n")}`
    );

    const results: TestResult[] = [];
    for (let i = 0; i < testFiles.length; i++) {
      const result = await this.runSingleTest(testFiles[i], i + 1);
      results.push(result);
    }

    return results;
  }

  printSummary(results: TestResult[]): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log("TEST SUMMARY");
    console.log("=".repeat(60));

    results.forEach((r) => {
      const status = r.success ? "✅ PASSED" : "❌ FAILED";
      console.log(`${status} - Test #${r.testNumber}: ${r.testFile}`);
      if (r.error) {
        console.log(`  Error: ${r.error}`);
      }
    });

    const passed = results.filter((r) => r.success).length;
    console.log(
      `\nTotal: ${results.length} | Passed: ${passed} | Failed: ${
        results.length - passed
      }`
    );
  }
}
