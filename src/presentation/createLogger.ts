import type { CreateLoggerOptions, TransportOptions, LogRepository } from "../domain/index.js";
import { Logger } from "./logger.js";

export const createLogger = async (options: CreateLoggerOptions = {}): Promise<Logger> => {
    const repository = await buildTransport(options.transport);

    return new Logger(repository, options.logger);
};

export const buildTransport = async (options?: TransportOptions): Promise<LogRepository> => {

    const resolvedOptions = options ?? { type: 'file' };

    switch (resolvedOptions.type) {
        case 'file': {
            const { FileLogDatasourceImpl } = await import("../infrastructure/datasources/index.js");
            const { FileLogRepositoryImpl } = await import("../infrastructure/repositories/index.js");

            const datasource = await FileLogDatasourceImpl.create(resolvedOptions);
            return new FileLogRepositoryImpl(datasource);
        };
        case 'mongo': {
            const { MongoLogDatasourceImpl } = await import("../infrastructure/datasources/index.js");
            const { MongoLogRepositoryImpl } = await import("../infrastructure/repositories/index.js");

            const datasource = await MongoLogDatasourceImpl.create(resolvedOptions);
            return new MongoLogRepositoryImpl(datasource);
        };
        
        default: {
            throw new Error(`Transport is not supported.`);
        };
    };
};