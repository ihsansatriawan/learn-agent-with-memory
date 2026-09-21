import { Agent, type AnyTool } from "@anvia/core";
import { BASE_INSTRUCTIONS } from "./prompts.js";
import { getModel } from "./models.js";
import { memoryStore } from "./memory.js";
import { createSummaryMemoryCompactor } from "@anvia/core";
import { createLoggerObserver } from "@anvia/logger";
import { logger } from "./logger.js";



const summaryModel = getModel("~openai/gpt-luna-latest");

const memoryCompactor = createSummaryMemoryCompactor({
	model: summaryModel
});

interface AgentOptions {
	modelId?: string;
	tools?: AnyTool[];
}

export function createAgent(options: AgentOptions = {}) {
	return new Agent({
		id: "assistant",
		model: getModel(options.modelId),
		instructions: BASE_INSTRUCTIONS,
		tools: options.tools ?? [],
		memory: {
			store: memoryStore,
			savePolicy: "turn",
			compaction: {
				compactor: memoryCompactor,
				trigger: {
					afterTokens: 20_000,
				},
			}
		},
		observability: {
      observers: { logger: createLoggerObserver({ logger }) },
    },
	})
}

