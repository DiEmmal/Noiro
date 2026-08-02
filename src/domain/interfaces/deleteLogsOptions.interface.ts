import type { LogSeverity } from "../enums/logSeverity.enum.js";
import type { Days } from "../types/days.type.js";

export interface DeleteLogsOptions {
    olderThan?: Days;
    level?: LogSeverity;
    origin?: string;
}