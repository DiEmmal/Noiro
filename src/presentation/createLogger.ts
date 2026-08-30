import type { CreateLoggerOptions, TransportOptions, LogRepository } from "../domain/index.js";
import { Logger } from "./logger.js";

export const createLogger = async (options: CreateLoggerOptions = {}): Promise<Logger> => {
    const repository = await buildTransport(options.transport);

    return new Logger(repository, options.logger);
};

export const buildTransport = async (options?: TransportOptions): Promise<LogRepository> => {
    const type = options?.type ?? 'file';

    switch (type) {
        case 'file': {
            const { FileLogDatasourceImpl } = await import("../infrastructure/datasources/index.js");
            const { FileLogRepositoryImpl } = await import("../infrastructure/repositories/index.js");

            const datasource = await FileLogDatasourceImpl.create(options);
            return new FileLogRepositoryImpl(datasource);
        };
        default: {
            throw new Error(`Transport type "${type}" is not supported.`);
        };
    };
};