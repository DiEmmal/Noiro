import { closeMongoConnection, createMongoLogger } from "./config.example.js";

const logger = await createMongoLogger();

try {
    await logger.debug("Debug message from MongoDB");
    await logger.info("User authenticated", "auth");
    await logger.warn("High response time detected", "api");
    await logger.error("Payment request failed", "payments");
    await logger.fatal("Critical service failure", "system");

    console.log("MongoDB example logs created.");
} finally {
    await closeMongoConnection();
}
