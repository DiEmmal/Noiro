import mongoose from "mongoose";
import { createLogger } from "../../src/index.js";

export const mongoUrl = "mongodb://noiro:123456@localhost:27017";
export const mongoDatabaseName = "noiro-logs";

export const createMongoLogger = () => createLogger({
    logger: {
        service: "mongo-example-service",
    },
    transport: {
        type: "mongo",
        url: mongoUrl,
        databaseName: mongoDatabaseName,
    },
});

export const closeMongoConnection = async (): Promise<void> => {
    await mongoose.disconnect();
};
