import { type FilterLogsOptions, type FileTransportOptions, LogEntity, LogRepository, LogDatasource } from "../../domain/index.js";

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