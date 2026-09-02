import { type FilterLogsOptions, LogDatasource, LogEntity, LogSeverity, type MongoTransportOptions } from "../../domain/index.js";
import { MongoDatabase } from "../data/mongo/init.js";
import { logModel } from "../data/mongo/models/log.model.js";

export class MongoLogDatasourceImpl implements LogDatasource {

    private constructor() { };

    static async create(options: MongoTransportOptions): Promise<MongoLogDatasourceImpl> {

        await MongoDatabase.connect({
            dbName: options.databaseName,
            url: options.url,
        });

        return new MongoLogDatasourceImpl();
        
    };


    async readLogs(options: FilterLogsOptions = {}): Promise<LogEntity[]> {

        const query = MongoLogDatasourceImpl.filterToMongoQuery(options);

        const logs = await logModel.find(query);

        return logs.map(log => LogEntity.fromObject(log));

    };

    async saveLog(log: LogEntity): Promise<void> {

        await logModel.create(log);

    };

    async deleteLogs(options: FilterLogsOptions = {}): Promise<void> {

        const query = MongoLogDatasourceImpl.filterToMongoQuery(options);

        await logModel.deleteMany(query);

    };

    private static filterToMongoQuery(options: FilterLogsOptions): { origin?: string, level?: LogSeverity, timestamp?: { $lt: Date } } {

        const query: { origin?: string, level?: LogSeverity, timestamp?: { $lt: Date } } = {};

        if (options?.origin) {
            query.origin = options.origin;
        };

        if (options?.level) {
            query.level = options.level;
        };

        if (options.olderThan !== undefined) {
            const miliseconds = options.olderThan * 24 * 60 * 60 * 1000;

            query.timestamp = { $lt: new Date(Date.now() - miliseconds) };
        };

        return query;
    };

};