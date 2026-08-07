import { LogSeverity } from "../src/index.js";
import { logger } from "./index.example.js";

const logs = await logger.getLogs({
    level: LogSeverity.debug,
    olderThan: 0,
    origin: 'create-logs.example.ts'
});
console.log(logs);
