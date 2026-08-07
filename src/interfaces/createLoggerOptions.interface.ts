export interface CreateLoggerOptions {
    logger?: LoggerOptions
    file?: FileRepositoryOptions,
};

export interface LoggerOptions {
    service?: string,
}

export interface FileRepositoryOptions {
    path?:string,
};