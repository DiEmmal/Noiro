import { LogEntity } from "./domain/entities/log.entity.js";
import type { LogRepository } from "./domain/repositories/log.repository.js";
import { LogSeverity } from "./domain/types/enums/logSeverity.enum.js";
import type { LoggerOptions } from "./interfaces/createLoggerOptions.interface.js";
import type { FilterLogsOptions } from "./domain/types/interfaces/filterLogsOptions.interface.js";

export class Logger {
    private readonly service: string;

    constructor(
        private readonly logRepositories: LogRepository[],
        options?: LoggerOptions,
    ) {
        this.service = options?.service ?? 'application-service'
    };

    async deleteLogs(options: FilterLogsOptions = {}): Promise<void> {
        await Promise.all(
            this.logRepositories.map(repository => repository.deleteLogs(options))
        );
    };

    async getLogs(options?: FilterLogsOptions): Promise<LogEntity[]> {
        const logs = await Promise.all(
            this.logRepositories.map(repository =>repository.readLogs(options))
        );
        return logs.flat();
    };

    private async saveNewLog(message: string, origin: string, level: LogSeverity): Promise<void> {
        const newLog = new LogEntity({
            level,
            message,
            origin,
            service: this.service
        });

        await Promise.all(
            this.logRepositories.map(repository => repository.saveLog(newLog))
        );
    };

    async debug(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin = 'application', LogSeverity.debug);
    };

    async info(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin = 'application', LogSeverity.info,);
    };

    async warn(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin = 'application', LogSeverity.warn,);
    };

    async error(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin = 'application', LogSeverity.error,);
    };

    async fatal(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin = 'application', LogSeverity.fatal,);
    };
};