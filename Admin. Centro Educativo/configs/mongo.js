"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        mongoose.connection.on("error", () => {
            console.log("MongoDB | connection failed to MongoDB Service");
        });

        mongoose.connection.on("connecting", () => {
            console.log("MongoDB | connecting to MongoDB Service");
        });

        mongoose.connection.on("connected", () => {
            console.log("MongoDB | connected to MongoDB Service");
        });

        mongoose.connection.on("open", () => {
            console.log("MongoDB | connected to Database");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB | reconnected to MongoDB Service");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | disconnected from MongoDB Service");
        });

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    } catch (err) {
        console.log(`Database connection failed: ${err}`);
    }
};
