import type { LogRepository } from "./domain/repositories/log.repository.js";
import { FileLogRepository } from "./infrastructure/repositories/file-log.repository.js";
import type { CreateLoggerOptions } from "./interfaces/createLoggerOptions.interface.js";
import { Logger } from "./logger.js"

export const createLogger = async (options: CreateLoggerOptions = {}): Promise<Logger> => {
    const repositories: LogRepository[] = [];
    repositories.push(await FileLogRepository.create(options.file));

    return new Logger(
        repositories,
        options.logger,
    );
};