import { LogSeverity } from "../src/index.js"
import { Logger } from "../src/logger.js"
import { describe, it, expect, vi } from "vitest"

describe('Logger', () => {

    it('should call readLogs with severity', async () => {

        const repository = {
            saveLog: vi.fn(),
            readLogs: vi.fn()
        };

        repository.readLogs.mockResolvedValue([]);

        const logger = new Logger(repository);

        await logger.getLogsBySeverity(LogSeverity.info);

        expect(repository.readLogs).toHaveBeenCalledWith(LogSeverity.info);

    });

    it('should read all logs', async () => {

        const repository = {
            saveLog: vi.fn(),
            readLogs: vi.fn(),
        };

        repository.readLogs.mockResolvedValue([]);

        const logger = new Logger(repository);

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

            const repository = {
                saveLog: vi.fn(),
                readLogs: vi.fn(),
            };

            repository.saveLog.mockResolvedValue(true);

            const logger = new Logger(repository);

            await logger[method](`Testing ${severity}`);

            expect(repository.saveLog).toHaveBeenCalled();
        }
    );

})