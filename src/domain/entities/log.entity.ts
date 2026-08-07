import { LogSeverity } from "../types/enums/logSeverity.enum.js";
import type { CreateLogEntity } from "../types/interfaces/createLogEntity.interface.js";
import type { Days } from "../types/days.type.js"
import type { FilterLogsOptions } from "../types/interfaces/filterLogsOptions.interface.js";

export class LogEntity {
    message: string;
    level: LogSeverity;
    timestamp: Date;
    service: string;
    origin: string;

    constructor(log: CreateLogEntity) {
        this.message = log.message;
        this.level = log.level;
        this.timestamp = log.timestamp ?? new Date();
        this.service = log.service;
        this.origin = log.origin;
    };

    public static fromJSON(content: string): LogEntity {
        let log: any;
        try {
            log = JSON.parse(content);
        } catch (error) {

            throw new Error(`fromJSON: invalid JSON`);

        };

        LogEntity.validateLog(log);

        const newLog: LogEntity = new LogEntity({
            ...log,
            timestamp: new Date(log.timestamp),
        });

        return newLog;

    };

    private static validateLog(log: any) {
        if (typeof log !== "object" || log === null) throw new Error('The log is not an object');

        if (!log.message) throw new Error('There is not message property');
        if (typeof log.message !== 'string') throw new Error('The log has not a valid message property');

        if (!log.service) throw new Error('There is not service property');
        if (typeof log.service !== 'string') throw new Error('The log has not a valid service property');

        if (!log.origin) throw new Error('There is not origin property');
        if (typeof log.origin !== 'string') throw new Error('The log has not a valid origin property');

        if (!log.level) throw new Error('There is not level property');
        if (!Object.values(LogSeverity).includes(log.level)) throw new Error('The log has not a valid level property');

        if (!log.timestamp) throw new Error('There is not timestamp property');
        if (typeof log.timestamp !== 'string'
            || Number.isNaN(new Date(log.timestamp).getTime())) {
            throw new Error('The log has not a valid timestamp property');
        }
    };

    public isOlderThan(days: Days): boolean {

        const miliseconds = days * 1000 * 60 * 60 * 24;

        return Date.now() - this.timestamp.getTime() > miliseconds;

    };

    public static filterLog(log: LogEntity, options: FilterLogsOptions) {
        if (options.level && log.level !== options.level) return false;
        if (options.origin && log.origin !== options.origin) return false;
        if (options.olderThan && !log.isOlderThan(options.olderThan)) return false;
        return true;
    };

};
