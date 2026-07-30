import { LogSeverity } from "../enums/logSeverity.enum.js";
import type { CreateLogEntity } from "../interfaces/createLogEntity.interface.js";

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

    static fromJSON(content: string): LogEntity {
        let log: any;
        try {
            log = JSON.parse(content);
        } catch (error) {

            throw (`fromJSON: invalid JSON`);

        };

        if (typeof log !== "object" || log === null) throw new Error('The log is not an object');

        if (typeof log.message !== 'string') throw new Error('The log has not a valid message property');

        if (typeof log.service !== 'string') throw new Error('The log has not a valid service property');

        if (typeof log.origin !== 'string') throw new Error('The log has not a valid origin property');

        if (!Object.values(LogSeverity).includes(log.level)) throw new Error('The log has not a valid level property');

        if (log.timestamp && typeof log.timestamp === 'string') {
            const date = new Date(log.timestamp);
            if (isNaN(date.getTime())) throw new Error('The log has not a valid timestamp property');
        } else throw new Error('The log has not a valid timestamp property');

        const logEntity: LogEntity = new LogEntity({
            ...log,
            timestamp: new Date(log.timestamp),
        });

        return logEntity;

    };


};