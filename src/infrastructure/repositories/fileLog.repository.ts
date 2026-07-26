import fs from 'fs/promises';
import { LogEntity, } from '../../domain/entities/log.entity.js';
import type { LogRepository } from '../../domain/repositories/log.repository.js';
import { LogSeverity } from '../../domain/enums/logSeverity.enum.js';
import type { FileRepositoryOptions } from '../../interfaces/createLoggerOptions.interface.js'

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
    }

    async readLogs(severity?: LogSeverity): Promise<LogEntity[]> {
        if (severity) return this.transformLogs(severity);
        else return this.transformLogs();
    };

    private async transformLogs(severity?: LogSeverity): Promise<LogEntity[]> {
        let path: string;
        if (severity) path = `${this.path}/${this.logsFiles[severity]}`;
        else path = `${this.path}/${this.logsFiles.all}`
        const fileContent = await fs.readFile(path, 'utf-8')

        const logs = fileContent
            .trim()
            .split("\n")
            .map(log => LogEntity.fromJSON(log))
            .filter(log => log instanceof LogEntity)

        return logs;
    };

    async saveLog(log: LogEntity): Promise<void> {
        const filePath = `${this.path}/${this.logsFiles[log.level]}`;
        const logString = `${JSON.stringify(log)}\n`;

        await Promise.all([
            fs.appendFile(`${this.path}/${this.logsFiles.all}`, logString),
            fs.appendFile(filePath, logString),
        ]);

    };

    private async directoryVerification(): Promise<void> {
        await fs.mkdir(this.path, { recursive: true });
    };

};