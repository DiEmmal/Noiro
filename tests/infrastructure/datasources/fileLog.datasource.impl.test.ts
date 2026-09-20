import { it, expect, describe, beforeEach, vi, afterEach } from "vitest"
import { FileLogDatasourceImpl } from "../../../src/infrastructure/index.js";
import { existsSync, rmSync } from 'fs';
import fs from 'fs/promises';
import { LogSeverity, LogEntity, } from "../../../src/domain/index.js";

const testPath = 'tests-logs';

describe('FileLog Datasource Implementation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        if (existsSync(testPath)) {
            rmSync(testPath, {
                recursive: true,
                force: true,
            });
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
        if (existsSync(testPath)) {
            rmSync(testPath, {
                recursive: true,
                force: true,
            });
        };
    })

    it('should create a directory (file)', async () => {

        await FileLogDatasourceImpl.create({ type: 'file', path: testPath });

        expect(existsSync(testPath)).toBe(true);

    });

    it.each(Object.values(LogSeverity) as LogSeverity[])('should save logs with %s severity', async (severity) => {
        const repository = await FileLogDatasourceImpl.create({ type: 'file', path: testPath });

        const log = new LogEntity({
            level: severity,
            message: `${severity} test message`,
            origin: 'test.ts',
            service: 'test',
        });

        await repository.saveLog(log);

        const logs = await repository.readLogs({
            level: severity,
        });

        expect(logs[0]).toBeInstanceOf(LogEntity);
        expect(logs[0]?.level).toBe(log.level);
        expect(logs[0]?.message).toBe(log.message);
        expect(logs[0]?.service).toBe(log.service);
        expect(logs[0]?.origin).toBe(log.origin);

    });

    it('should rotate severity logs with numbered files when maxLogsPerFile is set', async () => {
        const repository = await FileLogDatasourceImpl.create({
            type: 'file',
            path: testPath,
            maxLogsPerFile: 2,
        });

        for (let index = 0; index < 3; index++) {
            await repository.saveLog(new LogEntity({
                level: LogSeverity.debug,
                message: `debug message ${index}`,
                origin: 'test.ts',
                service: 'test',
            }));
        }

        const firstFile = await fs.readFile(`${testPath}/debugLogs.log`, 'utf-8');
        const secondFile = await fs.readFile(`${testPath}/debugLogs-1.log`, 'utf-8');

        expect(firstFile.trim().split('\n')).toHaveLength(2);
        expect(secondFile.trim().split('\n')).toHaveLength(1);
        expect(secondFile).toContain('debug message 2');
    });

    it.each([true, false])('should respect allLogsFile=%s with rotated files', async (allLogsFile) => {
        const repository = await FileLogDatasourceImpl.create({
            type: 'file',
            path: testPath,
            allLogsFile,
            maxLogsPerFile: 2,
        });

        for (let index = 0; index < 3; index++) {
            await repository.saveLog(new LogEntity({
                level: LogSeverity.info,
                message: `info message ${index}`,
                origin: 'test.ts',
                service: 'test',
            }));
        }

        expect(await repository.readLogs()).toHaveLength(3);

        const allLogs = await fs.readFile(`${testPath}/allLogs.log`, 'utf-8');
        expect(allLogs.trim() === '').toBe(!allLogsFile);
        expect(existsSync(`${testPath}/allLogs`)).toBe(false);
    });

    it('should read and return all logs (file)', async () => {
        const repository = await FileLogDatasourceImpl.create({ type: 'file', path: testPath });
        const severities = Object.values(LogSeverity);
        const service = 'test', origin = 'test.ts';

        for (const severity of severities) {
            await repository.saveLog(new LogEntity({
                level: severity,
                message: `Test ${severity} message`,
                origin,
                service,
            }));
        }

        const logs = await repository.readLogs();

        expect(logs).toHaveLength(severities.length);

        for (const severity of severities) {
            const log = logs.find(log => log.level === severity);

            expect(log?.level).toBe(severity);
            expect(log?.message).toBe(`Test ${severity} message`);
            expect(log?.service).toBe(service);
            expect(log?.origin).toBe(origin);
        }
    });


    it('should delete logs (file)', async () => {

        const repository = await FileLogDatasourceImpl.create({ type: 'file', path: testPath });

        await repository.deleteLogs();

        const logs = await repository.readLogs();
        expect(logs).toHaveLength(0);
    });

    it('should delete logs by options (file)', async () => {

        const repository = await FileLogDatasourceImpl.create({ type: 'file', path: testPath });
        const log = new LogEntity({
            level: LogSeverity.debug,
            message: 'test-message',
            origin: 'fileLog test',
            service: 'testing',
        });

        await repository.saveLog(log);

        await repository.deleteLogs({ level: LogSeverity.debug, origin: log.origin });

        const logs = await repository.readLogs();
        expect(logs).toHaveLength(0);
    });

});