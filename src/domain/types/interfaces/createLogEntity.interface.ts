import type { LogSeverity } from "../enums/logSeverity.enum.js";

export interface CreateLogEntity {
    message: string;
    level: LogSeverity;
    service: string;
    timestamp?: Date;
    origin: string,
};