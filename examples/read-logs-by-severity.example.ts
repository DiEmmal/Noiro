import { LogSeverity } from "../src/index.js";
import { logger } from "./index.example.js";

const logs = await logger.getLogsBySeverity(LogSeverity.debug);
console.log(logs);