import { it, expect, describe, beforeEach, test, afterEach } from "vitest"
import { createLogger, LogSeverity } from "../../../src/index.js";
import { FileLogRepository } from "../../../src/infrastructure/repositories/fileLog.repository.js";
import { existsSync, rmSync } from 'fs';
import { LogEntity } from "../../../src/domain/entities/log.entity.js";

const testPath = 'tests-logs';

describe('FileLog Repository', () => {
    beforeEach(() => {

        if (existsSync(testPath)) {
            rmSync(testPath, {
                recursive: true,
                force: true,
            });
        };
    });

    it('should create a directory', async () => {

        await FileLogRepository.create({ path: testPath });

        expect(existsSync(testPath)).toBe(true);

    });

    it.each(Object.values(LogSeverity) as LogSeverity[])('should save logs with $s severity', async (severity) => {
        const repository = await FileLogRepository.create({ path: testPath });

        const log = new LogEntity({
            level: severity,
            message: `${severity} test message`,
            origin: 'test.ts',
            service: 'test',
        });

        await repository.saveLog(log);

        const logs = await repository.readLogs(severity);

        expect(logs[0]).toBeInstanceOf(LogEntity);
        expect(logs[0]?.level).toBe(log.level);
        expect(logs[0]?.message).toBe(log.message);
        expect(logs[0]?.service).toBe(log.service);
        expect(logs[0]?.origin).toBe(log.origin);

    });

    it('should read and return all logs', async () => {
        const repository = await FileLogRepository.create({ path: testPath });
        const severities = Object.values(LogSeverity);
        const service = 'test', origin = 'test.ts';

        await Promise.all([
            severities.forEach(severity => {

                repository.saveLog(new LogEntity({
                    level: severity,
                    message: `Test ${severity} message`,
                    origin,
                    service,
                }));

            })
        ])

        const logs = await repository.readLogs();

        expect(logs).toHaveLength(severities.length);

        for (let severity of severities) {

            const log = logs.find(log => log.level === severity);

            expect(log?.level).toBe(severity);
            expect(log?.message).toBe(`Test ${severity} message`)
            expect(log?.service).toBe(service)
            expect(log?.origin).toBe(origin)

        };

    });

});