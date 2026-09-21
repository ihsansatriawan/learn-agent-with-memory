import { Agent } from "@anvia/core";
import { getModel } from "./models.js";
import { Studio } from "@anvia/studio";
import { BASE_INSTRUCTIONS } from "./prompts.js";
import { memoryStore } from "./memory.js";
import { weatherTool } from "./tools/weather.js";
import { createSummaryMemoryCompactor } from "@anvia/core";


const model = getModel("~openai/gpt-luna-latest");
const summaryModel = getModel("~openai/gpt-luna-latest");

const memoryCompactor = createSummaryMemoryCompactor({
  model: summaryModel
});

const agent = new Agent({
  id: "assistant",
  model,
  instructions: BASE_INSTRUCTIONS,
  tools: [weatherTool],
  memory: {
    store: memoryStore,
    savePolicy: "turn",
    compaction: {
      compactor: memoryCompactor,
      trigger: {
        afterTokens: 200
      },
    }
  }
});

const studio = new Studio([agent]).start();
