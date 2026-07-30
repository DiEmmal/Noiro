import type { LogEntity } from "../entities/log.entity.js";
import type { LogSeverity } from "../enums/logSeverity.enum.js";

export abstract class LogRepository {
    abstract readLogs(severity?: LogSeverity): Promise<LogEntity[]>;
    abstract saveLog(log: LogEntity): Promise<void>;
    // TODO
    // abstract deleteLogs(): Promise<boolean>;
};