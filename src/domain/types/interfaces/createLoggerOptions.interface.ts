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
};

export interface MongoTransportOptions{
    type: 'mongo',
    url: string,
    databaseName: string,
}

export type TransportOptions = FileTransportOptions | MongoTransportOptions;