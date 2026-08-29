import { createLogger } from "../src/index.js";

export const logger = await createLogger({
    transport: {
        type: 'file',
        path: './example-logs',
    },
    logger: {
        service: 'example-service',
    }
});