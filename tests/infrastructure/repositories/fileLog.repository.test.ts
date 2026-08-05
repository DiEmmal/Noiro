import { it, expect, describe, beforeEach, vi, afterEach } from "vitest"
import { LogSeverity } from "../../../src/index.js";
import { FileLogRepository } from "../../../src/infrastructure/repositories/file-log.repository.js";
import { existsSync, rmSync } from 'fs';
import fs from 'fs/promises';
import { LogEntity } from "../../../src/domain/entities/log.entity.js";
import { join } from "path";

const testPath = 'tests-logs';

describe('FileLog Repository', () => {
    fs.writeFile = vi.fn();

    beforeEach(() => {

        if (existsSync(testPath)) {
            rmSync(testPath, {
                recursive: true,
                force: true,
            });
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

    it('should create a directory', async () => {

        await FileLogRepository.create({ path: testPath });

        expect(existsSync(testPath)).toBe(true);

    });

    it.each(Object.values(LogSeverity) as LogSeverity[])('should save logs with %s severity', async (severity) => {
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


    it('should delete all content from each .log file ', async () => {

        const repository = await FileLogRepository.create();

        const itWasDeleted = repository.deleteLogs();

        expect(itWasDeleted).toBeTruthy();
        expect(fs.writeFile).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), '');
    });

    it('should delete logs by options', async () => {
        
        const repository = await FileLogRepository.create({path: testPath});
        const log = new LogEntity({
            level: LogSeverity.debug,
            message: 'test-message',
            origin: 'fileLog test',
            service: 'testing',
        });

        repository.saveLog(log);

        await repository.deleteLogs({ level: LogSeverity.debug, olderThan: 1, origin: log.origin});


        expect(fs.writeFile).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalledTimes((await fs.readdir(testPath)).length);


    });

});