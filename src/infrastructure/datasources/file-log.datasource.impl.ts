import fs from 'fs/promises';
import { join } from 'node:path';
import { LogRepository, type FileTransportOptions, type FilterLogsOptions, LogEntity } from '../../domain/index.js';


export class FileLogDatasourceImpl implements LogRepository {
    path: string;
    allLogsFile: boolean;
    maxLogsPerFile: number | undefined;
    fileExtension: '.log' | '.txt';

    private readonly logsFiles = {
        "all": "allLogs",
        "debug": 'debugLogs',
        "info": 'infoLogs',
        "warn": 'warnLogs',
        "error": 'errorLogs',
        "fatal": 'fatalLogs',
    };

    private constructor(options?: FileTransportOptions) {
        this.path = options?.path ?? 'logs';
        this.allLogsFile = options?.allLogsFile ?? true;
        this.maxLogsPerFile = options?.maxLogsPerFile;
        this.fileExtension = options?.fileExtension ?? '.log';
    };

    static async create(options?: FileTransportOptions) {
        const repository = new FileLogDatasourceImpl(options);
        await repository.directoryVerification();
        return repository;
    };

    async readLogs(options?: FilterLogsOptions): Promise<LogEntity[]> {
        const logs = await this.readAllLogs();
        if (!options) return logs

        return logs.filter(log => LogEntity.filterLog(log, options));
    };

    private async readAllLogs(): Promise<LogEntity[]> {
        if (this.allLogsFile) {
            return this.readLogsFromFile(join(this.path, `${this.logsFiles.all}${this.fileExtension}`));
        }

        const files = await fs.readdir(this.path);
        const severityFiles = Object.values(this.logsFiles)
            .filter(file => file !== this.logsFiles.all)
            .flatMap(file => files
                .filter(currentFile => currentFile === `${file}${this.fileExtension}`
                    || currentFile.startsWith(`${file}-`))
                .sort()
                .map(currentFile => join(this.path, currentFile)));

        const logs = await Promise.all(severityFiles.map(file => this.readLogsFromFile(file)));
        return logs.flat();
    };

    private async readLogsFromFile(filePath: string): Promise<LogEntity[]> {
        const content = await fs.readFile(filePath, 'utf-8');
        const trimmedContent = content.trim();
        if (trimmedContent === '') return [];

        return trimmedContent.split('\n').map(log => LogEntity.fromJSON(log));
    };

    private async lastFile(level: LogEntity['level']): Promise<string> {
        const fileName = `${this.logsFiles[level]}${this.fileExtension}`;

        const files = (await fs.readdir(this.path))
            .filter(file => file === fileName || /^.+-\d+\.(log|txt)$/.test(file))
            .filter(file => file.startsWith(this.logsFiles[level]));

        const fileNumbers = files
            .map(file => file.match(/-(\d+)\.(log|txt)$/)?.[1])
            .filter((number): number is string => number !== undefined)
            .map(Number);

        const lastNumber = fileNumbers.length > 0 ? Math.max(...fileNumbers) : 0;

        const lastFileName = lastNumber === 0
            ? fileName
            : `${this.logsFiles[level]}-${lastNumber}${this.fileExtension}`;

        const lastFilePath = join(this.path, lastFileName);

        const content = await fs.readFile(lastFilePath, 'utf-8');

        const logsInFile = content.trim() === '' ? 0 : content.trim().split('\n').length;

        return logsInFile >= this.maxLogsPerFile!
            ? join(this.path, `${this.logsFiles[level]}-${lastNumber + 1}${this.fileExtension}`)
            : lastFilePath;
    };

    async saveLog(log: LogEntity): Promise<void> {
        const filePath = this.maxLogsPerFile !== undefined
            ? await this.lastFile(log.level)
            : join(this.path, `${this.logsFiles[log.level]}${this.fileExtension}`);
        const logString = `${JSON.stringify(log)}\n`;

        await Promise.all(
            this.allLogsFile
                ? [
                    fs.appendFile(join(this.path, `${this.logsFiles.all}${this.fileExtension}`), logString),
                    fs.appendFile(filePath, logString),
                ]
                : [
                    fs.appendFile(filePath, logString),
                ]
        );

    };

    async deleteLogs(options: FilterLogsOptions = {}): Promise<void> {
        const logs = await this.readAllLogs();
        const remainingLogs = logs.filter(log => !LogEntity.filterLog(log, options));

        const files = await fs.readdir(this.path);
        const logFiles = files.filter(file =>
            file === `${this.logsFiles.all}${this.fileExtension}`
            || Object.values(this.logsFiles)
                .filter(logFile => logFile !== this.logsFiles.all)
                .some(logFile => file === `${logFile}${this.fileExtension}`
                    || file.startsWith(`${logFile}-`))
        );

        await Promise.all(logFiles.map(file => fs.rm(join(this.path, file))));
        await this.directoryVerification();

        for (const log of remainingLogs) {
            await this.saveLog(log);
        }
    };

    private async directoryVerification(): Promise<void> {
        await fs.mkdir(this.path, { recursive: true });

        await fs.appendFile(join(this.path, `${this.logsFiles.all}${this.fileExtension}`), '');

        await Promise.all(
            Object.values(this.logsFiles)
                .filter(file => file !== this.logsFiles.all)
                .map(file => fs.appendFile(join(this.path, `${file}${this.fileExtension}`), ''))
        );
    };

};