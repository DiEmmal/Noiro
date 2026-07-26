import { createLogger } from "../src/index.js"
import { Logger } from "../src/logger.js"
import { describe, it, expect } from "vitest"

const path = 'tests-logs'
const logger = await createLogger({
    file: {
        path
    },
    logger: {
        service: 'test',
    }
});

describe('createLogger', () => {

    it('should create a "Logger" instance', () => {

        expect(logger).toBeInstanceOf(Logger);

    });

});