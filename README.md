# Noiro

`Noiro` is a small TypeScript logger to write and read logs by severity. It is designed as an educational project for learning Node.js, TypeScript, and software architecture.

## Installation

To use all transports, install the project dependencies:

```bash
npm install
```

To use only the file transport, install the file example dependency:

```bash
npm install --save-dev tsx
```

To run the examples, use the following commands:

```bash
npx tsx examples/create-logs.example.ts
npx tsx examples/read-all-logs.example.ts
npx tsx examples/read-logs-by-options.example.ts
npx tsx examples/delete-all-logs.example.ts
npx tsx examples/delete-logs-by-options.example.ts
```

To run the MongoDB examples with Docker:

```bash
docker compose up -d
npx tsx examples/mongo-examples/create-logs.example.ts
npx tsx examples/mongo-examples/read-logs.example.ts
npx tsx examples/mongo-examples/delete-logs.example.ts
docker compose down
```

The examples use the local MongoDB connection `mongodb://noiro:123456@localhost:27017/?authSource=admin` and the `noiro-logs` database.

## Features

- Write logs with multiple severity levels.
- Read logs with severity, origin, and age filters.
- Delete logs with severity, origin, and age filters.
- JSON-based log storage.
- TypeScript support.
- File-based and MongoDB log transports.
- MongoDB filtering by severity, origin, and age.
- Configurable file path and MongoDB database connection.

## Quick start

### File Transport

```ts
import { createLogger, LogSeverity } from "../src/index.js";

const logger = await createLogger({
  logger: {
    service: "application-service",
  },
  transport: {
    type: "file",
    path: "example-logs",
  },
});

await logger.debug("This is a debug log");
await logger.info("This is an info log");
await logger.warn("This is a warn log");
await logger.error("This is an error log");
await logger.fatal("This is a fatal log");

const logs = await logger.getLogs({ level: LogSeverity.error });

console.log(logs);

await logger.deleteLogs();
```

### MongoDB transport

```ts
import { createLogger } from 'noiro';

const logger = await createLogger({
  logger: {
    service: 'application-service',
  },
  transport: {
    type: 'mongo',
    url: 'mongodb://localhost:27017',
    databaseName: 'application-logs',
  },
});

await logger.info('User authenticated', 'auth');

const logs = await logger.getLogs({
  level: 'info',
  origin: 'auth',
});
```

MongoDB must be running before creating a logger with the MongoDB transport.

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
await logger.deleteLogs({ olderThan: 7, origin: "api" });
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
    datasources/
    entities/
    repositories/
    types/
      enums/
      interfaces/
  infrastructure/
    data/
      mongo/
        models/
    datasources/
    repositories/
  presentation/
    createLogger.ts
    logger.ts
  index.ts
examples/
logs/
```

## Notes

This repository is meant to show my learning process honestly.

It is not presented as a finished or production-ready logger, but as a project that already has a working foundation and will continue to evolve.
