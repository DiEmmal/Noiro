import { createLogger } from "../src";

export const logger = await createLogger({
    file: {
        path: 'example-logs',
    },
    logger: {
        service: 'example-service',
    }
});