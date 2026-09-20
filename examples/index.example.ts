import { createLogger } from "../src/index.js";

export const logger = await createLogger({
    transport: {
        type: 'file',
        path: './example-logs',
        maxLogsPerFile: 5,
        allLogsFile: true,
    },
    logger: {
        service: 'example-service',
    }
});