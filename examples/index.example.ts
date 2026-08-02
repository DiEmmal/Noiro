import { createLogger } from "../src/index.js";

export const logger = await createLogger({
    file: {
        path: 'example-logs',
    },
    logger: {
        service: 'example-service',
    }
});