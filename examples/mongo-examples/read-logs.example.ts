import { LogSeverity } from "../../src/domain/index.js";
import { closeMongoConnection, createMongoLogger } from "./config.example.js";

const logger = await createMongoLogger();

try {
    const logs = await logger.getLogs({
        level: LogSeverity.info,
        origin: "auth",
    });

    console.table(logs);
} finally {
    await closeMongoConnection();
}
