# Noiro

`Noiro` is a small TypeScript logger to write and read logs by severity. It is designed as an educational project for learning Node.js, TypeScript, and software architecture.

## Installation

This library has no production dependencies.

To run the examples use the next scripts:

```bash
npx tsx examples/create-logs.example.ts
npx tsx examples/read-all-logs.example.ts
npx tsx examples/read-logs-by-options.example.ts
npx tsx examples/delete-all-logs.example.ts
npx tsx examples/delete-logs-by-options.example.ts
```


## Features

- Write logs with multiple severity levels.
- Read logs with severity, origin, and age filters.
- Delete logs with severity, origin, and age filters.
- JSON-based log storage.
- TypeScript support.

## Quick start

```ts
import { createLogger, LogSeverity } from "../src/index.js";

const logger = await createLogger({
  logger: {
    service: 'application-service',
  },
  file: {
    path: 'example-logs',
  }
});

await logger.debug('This is a debug log');
await logger.info('This is an info log');
await logger.warn('This is a warn log');
await logger.error('This is an error log');
await logger.fatal('This is a fatal log');

const logs = await logger.getLogs({ level: LogSeverity.error });

console.log(logs);

await logger.deleteLogs();
```

## API

### Writing logs
```ts
await logger.debug(message, origin);
// origin (string) property is optional
await logger.info(message);
await logger.warn(message);
await logger.error(message, origin);
await logger.fatal(message);
```

### Reading logs and deleting logs

```ts
await logger.getLogs();
await logger.getLogs({ level: LogSeverity.error });
await logger.deleteLogs();
await logger.deleteLogs({ olderThan: 7, origin: 'api' });
```

`FilterLogsOptions = { level?: LogSeverity, olderThan?: number, origin?: string }`

### LogEntity

```ts
interface LogEntity {
    message: string;
    level: LogSeverity;
    timestamp: Date;
    service: string;
    origin: string;
}
```

## Current Architecture

```
src/
  domain/
    entities/
    repositories/
    types/
      enums/
      interfaces/
  infrastructure/
    repositories/
  interfaces/
  createLogger.ts
  index.ts
  logger.ts
examples/
logs/
```
## Notes

This repository is meant to show my learning process honestly.

It is not presented as a finished or production-ready logger, but as a project that already has a working foundation and will continue to evolve.
