import type { LogRepository } from "./domain/repositories/log.repository.js";
import { FileLogRepositoryImpl } from "./infrastructure/repositories/file-log.repository.impl.js";
import { FileLogDatasourceImpl } from "./infrastructure/datasources/file-log.datasource.impl.js";
import type { CreateLoggerOptions, TransportOptions } from "./domain/types/interfaces/createLoggerOptions.interface.js";
import { Logger } from "./logger.js";
import type { LogDatasource } from "./domain/datasources/log.datasource.js";

export const createLogger = async (
    options: CreateLoggerOptions = {}
): Promise<Logger> => {
    const repository = await buildRepository(options.transport);

    return new Logger(repository, options.logger);
};

async function buildRepository(repositoryOptions?: TransportOptions): Promise<LogRepository> {
    const type = repositoryOptions?.type ?? 'file';

    let datasource: LogDatasource;

    switch (type) {
        case 'file':
            datasource = await FileLogDatasourceImpl.create(repositoryOptions);
            return new FileLogRepositoryImpl(datasource);
        default:
            datasource = await FileLogDatasourceImpl.create(repositoryOptions);
            return new FileLogRepositoryImpl(datasource);
    }
};