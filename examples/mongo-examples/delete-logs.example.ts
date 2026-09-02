import { closeMongoConnection, createMongoLogger } from "./config.example.js";

const logger = await createMongoLogger();

try {
    await logger.deleteLogs({ origin: "api" });
    console.log("MongoDB logs from the api origin deleted.");
} finally {
    await closeMongoConnection();
}
