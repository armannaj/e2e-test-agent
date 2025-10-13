import "dotenv/config";
import { TestAgent } from "./TestAgent.js";

async function main() {
  console.log(`Using tests directory: ${process.env.TESTS_DIR || "./tests"}`);

  const testAgent = new TestAgent({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.API_KEY!,
    baseURL: process.env.BASE_URL,
    testsDir: process.env.TESTS_DIR,
    maxSteps: 20,
  });

  const results = await testAgent.runAllTests();
  testAgent.printSummary(results);
}

main().catch(console.error);
