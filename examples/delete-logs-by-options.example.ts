import { LogSeverity } from "../src/index.js";
import { logger } from "./index.example.js";

logger.deleteLogs({
    level: LogSeverity.error,
    origin: 'example.ts',
    olderThan: 0,
})