import type { Days } from "../days.type.js";
import type { LogSeverity } from "../enums/logSeverity.enum.js";


export interface FilterLogsOptions {
    olderThan?: Days;
    level?: LogSeverity;
    origin?: string;
};