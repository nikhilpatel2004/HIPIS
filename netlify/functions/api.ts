import serverless from "serverless-http";
import { createServer } from "../../server/index";

// Lazy initialization to avoid build-time errors
let handler: any;

export const api = async (event: any, context: any) => {
  if (!handler) {
    const app = createServer();
    handler = serverless(app);
  }
  return handler(event, context);
};

export { api as handler };
