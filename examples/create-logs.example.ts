import { logger } from "./index.example.js";

await logger.debug('This is a debug log', 'create-logs.example.ts');
await logger.info('This is an info log', 'create-logs.example.ts');
await logger.warn('This is a warn log', 'create-logs.example.ts');
await logger.error('This is an error log', 'example.ts');
await logger.fatal('This is a fatal log', 'example.ts');