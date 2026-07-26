import { describe, it, expect, } from "vitest";
import { LogEntity } from "../../../src/domain/entities/log.entity.js";
import { LogSeverity } from "../../../src/index.js";
describe('Log Entity', () => {

    it('should create a valid instance', () => {
        const newLog = {
            message: 'Testing message',
            level: LogSeverity.info,
            timestamp: new Date(),
            origin: 'test.ts',
            service: 'test',
        }

        const newLogEntity = new LogEntity(newLog);

        expect(newLogEntity.level).toBe(newLog.level);
        expect(newLogEntity.message).toBe(newLog.message);
        expect(newLogEntity.timestamp).toBeInstanceOf(Date);
        expect(Number.isNaN(newLogEntity.timestamp?.getTime())).toBe(false);
        expect(newLogEntity.timestamp?.getTime()).toBe(newLog.timestamp.getTime());
        expect(newLogEntity.service).toBe(newLog.service);
        expect(newLogEntity.origin).toBe(newLog.origin);

    });

    it('should create a timestamp if it is not provided', () => {
        const newLog = {
            message: 'Testing message',
            level: LogSeverity.info,
            service: 'test',
            origin: 'test.ts'
        };
        const newLogEntity = new LogEntity(newLog)

        expect(newLogEntity.timestamp).toBeInstanceOf(Date);
        expect(Number.isNaN(newLogEntity.timestamp?.getTime())).toBe(false);
    });

    it('should create a valid LogEntity from JSON', () => {
        const newLog = {
            message: 'Testing message',
            level: LogSeverity.info,
            timestamp: new Date(),
            service: 'test',
            origin: 'test.ts'
        };

        const logStringify = JSON.stringify(newLog);

        const log = LogEntity.fromJSON(logStringify);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log?.message).toBe(newLog.message);
        expect(log?.level).toBe(newLog.level);
        expect(log?.timestamp?.getTime()).toBe(newLog.timestamp.getTime());
        expect(log?.service).toBe(newLog.service);
        expect(log?.origin).toBe(newLog.origin);

    });

});