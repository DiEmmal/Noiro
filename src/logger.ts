import { LogEntity } from "./domain/entities/log.entity.js";
import type { LogRepository } from "./domain/repositories/log.repository.js";
import { LogSeverity } from "./domain/enums/logSeverity.enum.js";
import type { LoggerOptions } from "./interfaces/createLoggerOptions.interface.js";

export class Logger {
    private readonly service: string;

    constructor(
        private readonly logRepository: LogRepository,
        options?: LoggerOptions,    
    ) {
        this.service = options?.service ?? 'application-service'
    };

    async getLogsBySeverity(severityLevel: LogSeverity): Promise<LogEntity[]> {
        return this.logRepository.readLogs(severityLevel);
    };

    async getAllLogs(): Promise<LogEntity[]> {
        return this.logRepository.readLogs();
    };

    private async saveNewLog(message: string, origin: string, level: LogSeverity) {
        const newLog = new LogEntity({
            level,
            message,
            origin,
            service: this.service
        });
        return this.logRepository.saveLog(newLog)
    };

    async debug(message: string, origin: string = ''): Promise<void> {
        return this.saveNewLog(message, origin, LogSeverity.debug);
    };

    async info(message: string, origin: string = ''): Promise<void> {
        return this.saveNewLog(message, origin, LogSeverity.info,);
    };

    async warn(message: string, origin: string = ''): Promise<void> {
        return this.saveNewLog(message, origin, LogSeverity.warn,);
    };

    async error(message: string, origin: string = ''): Promise<void> {
        return this.saveNewLog(message, origin, LogSeverity.error,);
    };

    async fatal(message: string, origin: string = ''): Promise<void> {
        return this.saveNewLog(message, origin, LogSeverity.fatal,);
    };
};