import type { LogEntity } from "../entities/log.entity.js";
import type { FilterLogsOptions } from "../types/interfaces/filterLogsOptions.interface.js";

export abstract class LogDatasource {
        abstract readLogs(options?: FilterLogsOptions): Promise<LogEntity[]>;
        abstract saveLog(log: LogEntity): Promise<void>;
        abstract deleteLogs(options: FilterLogsOptions): Promise<void>;
};