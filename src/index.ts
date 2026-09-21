
import { Studio } from "@anvia/studio";
import { createAgent } from "./agents.js";

import { getPaymentSTatusTool, submitPaymentTool, summarizeIPLTool } from "./tools/ipl-tools.js";
import { mockIplService } from "./services/mock-ipl-services.js";


const paymentStatusTool = getPaymentSTatusTool({ service: mockIplService });
const paymentSubmitTool = submitPaymentTool({ service: mockIplService });
const summaryTool = summarizeIPLTool({ service: mockIplService });



const agent = createAgent({
	tools: [paymentStatusTool, paymentSubmitTool, summaryTool],
});

const studio = new Studio([agent]).start();
