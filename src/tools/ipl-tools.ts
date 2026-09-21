import { createTool } from "@anvia/core";
import { z } from "zod";

interface IplToolDeps {
  service: {
    getPaymentStatus: (noRumah: string, month: string) => string;
    submitPayment: (noRumah: string, month: string) => string;
    summarizeIPL: (noRumah: string) => string;
  };
}

export function getPaymentSTatusTool(deps: IplToolDeps) {
  return createTool({
    name: "get-payment-status",
    description: "Use this tool to query payment status for a given month and no rumah..",
    inputSchema: z.object({
      noRumah: z.string(),
      month: z.string(),
    }),
    execute: async (args) => {
      // Business logic to query the order status
      return deps.service.getPaymentStatus(args.noRumah, args.month);
    },
  });
}

export function submitPaymentTool(deps: IplToolDeps) {
  return createTool({
    name: "submit-payment",
    description: "Use this tool to submit payment for a given month and no rumah..",
    inputSchema: z.object({
      noRumah: z.string(),
      month: z.string(),
    }),
    execute: async (args) => {
      // Business logic to submit the payment
      return deps.service.submitPayment(args.noRumah, args.month);
    },
  });
}

export function summarizeIPLTool(deps: IplToolDeps) {
  return createTool({
    name: "summarize-ipl",
    description: "Use this tool to summarize payment for a given no rumah",
    inputSchema: z.object({
      noRumah: z.string(),
    }),
    execute: async (args) => {
      // Business logic to summarize the payment status
      return deps.service.summarizeIPL(args.noRumah);
    },
  });
}
