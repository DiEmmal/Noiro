import mongoose from "mongoose";

export interface MongoOptions {
    url: string,
    dbName: string,
}

export class MongoDatabase {

    static async connect(options: MongoOptions): Promise<void> {
        const { url, dbName } = options;

        try {

            await mongoose.connect(url, {
                dbName,
            });

            console.log('Connected to MongoDB');

        } catch (error) {
            console.log('Error connecting to MongoDB');

            throw error;
        };
    };

}