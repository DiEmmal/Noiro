import mongoose from "mongoose";
import { LogSeverity } from "../../../../domain/index.js";

export const logSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: Object.values(LogSeverity)
    },
    timestamp: {
        type: Date,
        required: true
    },
    service: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
});

export const logModel = mongoose.model("Log", logSchema);