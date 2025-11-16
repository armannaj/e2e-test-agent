# 🤖 E2E Agent

An AI-powered testing framework that uses LLM agents to execute natural language test cases. Write tests in plain English and let AI agents interact with your applications to verify behavior.

## 🌟 What is E2E Agent?

E2E Agent is a revolutionary testing approach that combines:

- **LLM-powered agents** (via LangChain) for intelligent test execution
- **Natural language test cases** written in plain English
- **Automated browser interactions** (via Playwright MCP server)

Instead of writing brittle selector-based tests, you describe what you want to test in natural language, and the AI agent figures out how to do it.

## 🎯 Why This Approach is Better

### Traditional Testing

```javascript
// Brittle, breaks when UI changes
await page.goto("https://playwright.dev");
await page.locator("#main-content").scrollIntoView();
await page.click('button[data-testid="get-started-btn"]');
await expect(page.locator(".sidebar-menu")).toBeVisible();
```

**Problems:**

- ❌ Breaks when CSS selectors change
- ❌ Requires constant maintenance
- ❌ No understanding of context or intent
- ❌ Fragile across UI updates

### E2E Agent Approach

```plaintext
open playwright.dev
scroll all the way down,
click on "Get started",
check if the page side menu is visible.
```

**Benefits:**

- ✅ **Intent-based**: Describes _what_ to do, not _how_
- ✅ **Self-healing**: AI adapts to UI changes automatically
- ✅ **Readable**: Anyone can write and understand tests
- ✅ **Resilient**: Survives refactors and redesigns
- ✅ **Context-aware**: AI understands page structure and user intent
- ✅ **No maintenance**: Tests rarely need updates when UI changes

## 🚀 How It Works

```
┌─────────────────┐
│  Test Files     │ Plain English test steps
│  (.test files)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TestAgent      │ Orchestrates test execution
│  Class          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LLM Agent      │ Interprets tests & decides actions
│  (GPT-4o)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MCP Tools      │ Browser automation, web search, etc.
│  (Playwright)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Your App       │ Real interactions, real results
└─────────────────┘
```

1. **Write tests** in natural language (`.test` files)
2. **TestAgent** reads and enriches each test with context (date/time, output format)
3. **LLM Agent** interprets the test steps and plans actions
4. **Results** are collected and summarized

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/armannaj/e2e-test-agent
cd e2e-test-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
MODEL_NAME="gpt-4o"
API_KEY="your-openai-api-key"
BASE_URL="https://api.openai.com/v1"
TESTS_DIR="./tests"
```

## 🎮 Usage

### Running Tests

```bash
# Development mode (with live reloading)
npm run dev

# Production mode (build first)
npm run build
npm start
```

### Writing Tests

Create `.test` files in your `tests/` directory:

**Example: `tests/1.test`**

```plaintext
open playwright.dev
scroll all the way down,
click on "Get started",
check if the page side menu is visible.
```

**Example: `tests/2.test`**

```plaintext
navigate to github.com
search for "typescript"
click on the first repository
verify the repository has a README file
```

### Programmatic Usage

```typescript
import { TestAgent } from "./TestAgent.js";

const testAgent = new TestAgent({
  modelName: "gpt-4o",
  apiKey: process.env.API_KEY!,
  baseURL: process.env.BASE_URL,
  testsDir: "./tests",
  maxSteps: 20,
});

// Run all tests
const results = await testAgent.runAllTests();
testAgent.printSummary(results);

// Or run a specific test
const result = await testAgent.runSingleTest("./tests/1.test", 1);
```

## 🔧 Configuration

### Environment Variables

| Variable     | Description                     | Default        |
| ------------ | ------------------------------- | -------------- |
| `MODEL_NAME` | LLM model to use                | `gpt-4o`       |
| `API_KEY`    | OpenAI API key                  | Required       |
| `BASE_URL`   | API base URL                    | OpenAI default |
| `TESTS_DIR`  | Directory containing test files | `./tests`      |

### Custom MCP Servers

```typescript
const testAgent = new TestAgent({
  apiKey: "...",
  mcpServers: {
    playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    filesystem: {
      command: "npx",
      args: ["@modelcontextprotocol/server-filesystem"],
    },
    // Add more MCP servers as needed
  },
});
```

## 📊 Test Results

Test Agent provides detailed results for each test:

```
============================================================
Running Test #1: 1.test
============================================================

Test Content:
open playwright.dev
scroll all the way down,
click on "Get started",
check if the page side menu is visible.

Result: {
  "success": true,
  "steps_completed": [
    "Opened playwright.dev",
    "Scrolled to bottom",
    "Clicked Get started button",
    "Verified sidebar visibility"
  ],
  "observations": "All steps completed successfully",
  "final_status": "passed"
}

============================================================
TEST SUMMARY
============================================================
✅ PASSED - Test #1: 1.test

Total: 1 | Passed: 1 | Failed: 0
```

## 🐛 Debugging

Use VS Code's built-in debugger:

1. Open Run & Debug panel (Cmd+Shift+D / Ctrl+Shift+D)
2. Select "Debug TypeScript"
3. Press F5
4. Set breakpoints in your code

## 🏗️ Project Structure

```
e2e-test-agent/
├── index.ts              # Entry point
├── TestAgent.ts          # Core TestAgent class
├── tests/                # Test files directory
│   └── 1.test           # Example test
├── .env                  # Environment configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🤝 Contributing

Contributions are welcome! This framework can be extended with:

- More MCP servers (database access, API testing, etc.)
- Custom test reporters
- Parallel test execution
- Test retry mechanisms
- Screenshot/video capture on failures

## 📝 License

MIT

## 🔗 Resources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [LangChain](https://js.langchain.com/)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)
- [OpenAI API](https://platform.openai.com/)

---

**Built with ❤️ using AI agents and natural language**
