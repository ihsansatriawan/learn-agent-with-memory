import { createPinoLogger } from "@anvia/logger";

export const logger = createPinoLogger({
  name: "assistant-agent",
  level: "info",
  pinoOptions: {
    transport: {
      target: "pino-pretty",
    },
  },
});
