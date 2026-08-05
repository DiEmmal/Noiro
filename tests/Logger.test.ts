import { log } from "node:console";
import { LogSeverity } from "../src/index.js"
import { Logger } from "../src/logger.js"
import { describe, it, expect, vi, beforeAll } from "vitest"

describe('Logger', () => {
    const repository = {
        saveLog: vi.fn(),
        readLogs: vi.fn(),
        deleteLogs: vi.fn(),
    };

    const logger = new Logger(repository);

    beforeAll(() => {
        vi.clearAllMocks();
    })

    it('should call readLogs with severity', async () => {

        repository.readLogs.mockResolvedValue([]);

        await logger.getLogsBySeverity(LogSeverity.info);

        expect(repository.readLogs).toHaveBeenCalledWith(LogSeverity.info);

    });

    it('should read all logs', async () => {

        repository.readLogs.mockResolvedValue([]);

        await logger.getAllLogs();

        expect(repository.readLogs).toHaveBeenCalled();

    });

    it.each([
        {
            method: "debug",
            severity: LogSeverity.debug,
        },
        {
            method: "info",
            severity: LogSeverity.info,
        },
        {
            method: "warn",
            severity: LogSeverity.warn,
        },
        {
            method: "error",
            severity: LogSeverity.error,
        },
        {
            method: "fatal",
            severity: LogSeverity.fatal,
        }
    ] as const)(
        "should save $method log",
        async ({ method, severity }) => {

            repository.saveLog.mockResolvedValue(true);

            await logger[method](`Testing ${severity}`);

            expect(repository.saveLog).toHaveBeenCalled();
        }
    );

    it('should delete logs', async() => {
        repository.deleteLogs.mockResolvedValue(true);

        const itWasDeleted = await logger.deleteLogs();

        expect(itWasDeleted).toBeTruthy();
        expect(repository.deleteLogs).toHaveBeenCalled();
    });

    it('should delete logs with arguments',async () => {
        repository.deleteLogs.mockResolvedValue(true);

        await logger.deleteLogs({level: LogSeverity.debug, olderThan: 2, origin: 'test'});

        expect(repository.deleteLogs).toHaveBeenCalledWith({level: LogSeverity.debug, olderThan: 2, origin: 'test'});
    });

});