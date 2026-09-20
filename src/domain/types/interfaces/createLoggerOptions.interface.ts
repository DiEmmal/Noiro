import type { LogSeverity } from "../index.js";

export interface CreateLoggerOptions {
    logger?: LoggerOptions,
    transport?: TransportOptions,
};

export interface LoggerOptions {
    service?: string,
    defaultOrigin?: string
};

export interface FileTransportOptions {
    type: 'file',
    path?: string,
    allLogsFile?: boolean,
    maxLogsPerFile?: number,
    fileExtension?: '.log' | '.txt';
};

export interface MongoTransportOptions {
    type: 'mongo',
    url: string,
    databaseName: string,
    collectionName?: string,
};

export type TransportOptions = FileTransportOptions | MongoTransportOptions;