import { Agent } from "@anvia/core";
import { getModel } from "./models.js";
import { Studio } from "@anvia/studio";
import { BASE_INSTRUCTIONS } from "./prompts.js";

const model = getModel("~openai/gpt-luna-latest");

const agent = new Agent({
  id: "assistant",
  model,
  instructions: BASE_INSTRUCTIONS,
});

const studio = new Studio([agent]).start();
