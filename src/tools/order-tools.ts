import { createTool } from "@anvia/core";
import { z } from "zod";

interface OrderToolDeps {
  service: {
    getOrderStatus: (orderId: string) => string;
  };
}

export function createOrderTool(deps: OrderToolDeps) {
  return createTool({
    name: "order",
    description: "Use this tool to query an order.",
    inputSchema: z.object({
      orderId: z.string(),
    }),
    execute: async (args) => {
      // Business logic to query the order status
      return deps.service.getOrderStatus(args.orderId);
    },
  });
}
