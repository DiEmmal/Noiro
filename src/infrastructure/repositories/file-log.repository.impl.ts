import { LogDatasource } from "../../domain/datasources/log.datasource.js";
import type { LogEntity } from "../../domain/entities/log.entity.js";
import { LogRepository } from "../../domain/repositories/log.repository.js";
import type { FilterLogsOptions } from "../../domain/types/interfaces/filterLogsOptions.interface.js";

export class FileLogRepositoryImpl implements LogRepository {

    constructor(
        private readonly logDatasource: LogDatasource,
    ){};

    readLogs(options?: FilterLogsOptions): Promise<LogEntity[]> {
        return this.logDatasource.readLogs(options);
    };
    saveLog(log: LogEntity): Promise<void> {
        return this.logDatasource.saveLog(log);
    };
    deleteLogs(options: FilterLogsOptions): Promise<void> {
        return this.logDatasource.deleteLogs(options);
    };

};