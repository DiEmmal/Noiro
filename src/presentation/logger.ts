import { type FilterLogsOptions, type LoggerOptions, LogSeverity, LogRepository, LogEntity } from "../domain/index.js";

export class Logger {
    private readonly service: string;
    private readonly defaultOrigin: string;

    constructor(
        private readonly logRepository: LogRepository,
        options?: LoggerOptions,
    ) {
        this.service = options?.service ?? 'application-service';
        this.defaultOrigin = options?.defaultOrigin ?? 'application';
    };

    async deleteLogs(options: FilterLogsOptions = {}): Promise<void> {
        return this.logRepository.deleteLogs(options);
    };

    async getLogs(options?: FilterLogsOptions): Promise<LogEntity[]> {
        return this.logRepository.readLogs(options);
    };

    private async saveNewLog(message: string, origin: string, level: LogSeverity): Promise<void> {
        const newLog = new LogEntity({
            level,
            message,
            origin,
            service: this.service
        });

        await this.logRepository.saveLog(newLog);
    };

    async debug(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin ?? this.defaultOrigin, LogSeverity.debug);
    };

    async info(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin ?? this.defaultOrigin, LogSeverity.info,);
    };

    async warn(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin ?? this.defaultOrigin, LogSeverity.warn,);
    };

    async error(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin ?? this.defaultOrigin, LogSeverity.error,);
    };

    async fatal(message: string, origin?: string): Promise<void> {
        return this.saveNewLog(message, origin ?? this.defaultOrigin, LogSeverity.fatal,);
    };
};