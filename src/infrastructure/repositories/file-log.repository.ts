import fs from 'fs/promises';
import { LogEntity, } from '../../domain/entities/log.entity.js';
import type { LogRepository } from '../../domain/repositories/log.repository.js';
import { LogSeverity } from '../../domain/types/enums/logSeverity.enum.js';
import type { FileRepositoryOptions } from '../../interfaces/createLoggerOptions.interface.js';
import { join } from 'node:path';
import type { FilterLogsOptions } from '../../domain/types/interfaces/filterLogsOptions.interface.js';


export class FileLogRepository implements LogRepository {
    path: string;

    private readonly logsFiles = {
        "all": "allLogs.log",
        "debug": 'debugLogs.log',
        "info": 'infoLogs.log',
        "warn": 'warnLogs.log',
        "error": 'errorLogs.log',
        "fatal": 'fatalLogs.log',
    };

    private constructor(options?: FileRepositoryOptions) {
        this.path = options?.path ?? 'logs';
    };

    static async create(options?: FileRepositoryOptions) {
        const repository = new FileLogRepository(options);
        await repository.directoryVerification();
        return repository;
    };

    async readLogs(options?: FilterLogsOptions): Promise<LogEntity[]> {
        const logs = await this.readAllLogs();
        if (!options) return logs

        return logs.filter(log => LogEntity.filterLog(log, options));
    };

    private async readAllLogs(): Promise<LogEntity[]> {
        const content = await fs.readFile(join(this.path, this.logsFiles.all), 'utf-8');
        const trimmedContent = content.trim();
        if (trimmedContent === '') return [];

        const logs = trimmedContent
            .split("\n")
            .map(log => LogEntity.fromJSON(log));
        return logs
    };

    async saveLog(log: LogEntity): Promise<void> {
        const filePath = join(this.path, this.logsFiles[log.level]);;
        const logString = `${JSON.stringify(log)}\n`;

        await Promise.all([
            fs.appendFile(join(this.path, this.logsFiles.all), logString),
            fs.appendFile(filePath, logString),
        ]);

    };

    async deleteLogs(options: FilterLogsOptions = {}): Promise<void> {
        const logs = this.readAllLogs();

        const remainingLogs = (await logs).filter(log => !LogEntity.filterLog(log, options));

        await this.deleteAllLogs();

        for (const log of remainingLogs) {
            await this.saveLog(log);
        };
    };

    private async deleteAllLogs(): Promise<void> {
        await Promise.all(Object.values(this.logsFiles)
            .map(file =>
                fs.writeFile(join(this.path, file), '')
            ));
    };

    private async directoryVerification(): Promise<void> {
        await fs.mkdir(this.path, { recursive: true });
        await Promise.all(
            Object.values(this.logsFiles).map(
                file => fs.appendFile(join(this.path, file), '')
            )
        );
    };

};
