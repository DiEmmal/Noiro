import type { LogEntity } from "../entities/log.entity.js";
import type { LogSeverity } from "../enums/logSeverity.enum.js";
import type { DeleteLogsOptions } from "../interfaces/deleteLogsOptions.interface.js";

export abstract class LogRepository {
    abstract readLogs(severity?: LogSeverity): Promise<LogEntity[]>;
    abstract saveLog(log: LogEntity): Promise<void>;
    abstract deleteLogs(options: DeleteLogsOptions): Promise<void>;
};