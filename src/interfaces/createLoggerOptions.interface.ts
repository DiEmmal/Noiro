export interface CreateLoggerOptions {
    logger?: LoggerOptions
    file?: FileRepositoryOptions,
};

export interface FileRepositoryOptions {
    path?:string,
};

export interface LoggerOptions {
    service?: string,
}