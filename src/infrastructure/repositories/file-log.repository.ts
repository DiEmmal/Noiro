import fs from 'fs/promises';
import { LogEntity, } from '../../domain/entities/log.entity.js';
import type { LogRepository } from '../../domain/repositories/log.repository.js';
import { LogSeverity } from '../../domain/enums/logSeverity.enum.js';
import type { FileRepositoryOptions } from '../../interfaces/createLoggerOptions.interface.js';
import { join } from 'node:path';
import type { DeleteLogsOptions } from '../../domain/interfaces/deleteLogsOptions.interface.js';


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

    private constructor(options: FileRepositoryOptions) {
        this.path = options.path ?? 'logs';
    };

    static async create(options: FileRepositoryOptions = {}) {
        const repository = new FileLogRepository(options);
        await repository.directoryVerification();
        return repository;
    };

    async readLogs(severity?: LogSeverity): Promise<LogEntity[]> {
        let path: string;
        if (severity) path = join(this.path, this.logsFiles[severity]);
        else path = join(this.path, this.logsFiles.all);

        const fileContent = await fs.readFile(path, 'utf-8');

        if (fileContent === '') return [];

        const stringLogs = fileContent
            .trim()
            .split("\n");

        const logs = stringLogs
            .map(log => LogEntity.fromJSON(log));

        return logs;
    };

    async saveLog(log: LogEntity): Promise<void> {
        const filePath = join(this.path, this.logsFiles[log.level]);;
        const logString = `${JSON.stringify(log)}\n`;

        await Promise.all([
            fs.appendFile(join(this.path, this.logsFiles.all), logString),
            fs.appendFile(filePath, logString),
        ]);

    };

    async deleteLogs(options: DeleteLogsOptions = {}): Promise<void> {
        if (Object.keys(options).length === 0) {
            await this.deleteAllLogs();
            return;
        }

        const allLogs: Record<LogSeverity, LogEntity[]> = { debug: [], error: [], fatal: [], info: [], warn: [] };

        for (let level of Object.values(LogSeverity)) {
            allLogs[level] = await this.readLogs(level);
        };

        const filterLogs = (log: LogEntity): boolean => {
            if (options.level && log.level === options.level) return false;
            if (options.origin && log.origin === options.origin) return false;
            if(options.olderThan && LogEntity.isOlderThan(log, options.olderThan)) return false;
            return true;
        };

        for (let level of Object.values(LogSeverity)) {
            allLogs[level] = allLogs[level].filter(log => filterLogs(log));
        };

        await this.deleteAllLogs();

        for(let level of Object.values(LogSeverity)) {
            for (const log of allLogs[level]) await this.saveLog(log);
        };

        return;
    };

    private async deleteAllLogs(): Promise<void> {
        await Promise.all(Object.values(this.logsFiles)
            .map(file =>
                fs.writeFile(join(this.path, file), '')
            ));
    };



    private async directoryVerification(): Promise<void> {
        await fs.mkdir(this.path, { recursive: true });
    };

};