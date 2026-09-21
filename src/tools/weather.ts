import { createTool } from "@anvia/core";
import { z } from "zod";

export const weatherTool = createTool({
  name: "getWeather",
  description: "Get the weather for a city",
  inputSchema: z.object({
    location: z.string(),
  }),
  execute: async (args) => {
    return `The weather in ${args.location} is sunny at 35 degrees`;
  },
});
