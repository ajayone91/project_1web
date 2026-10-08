require("dotenv").config();

const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const initDb = async () => {
    try {
        await Listing.deleteMany({});

        const ownerId = new mongoose.Types.ObjectId("6a832769f039b7d0439bbc1a");

        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: ownerId,
        }));

        await Listing.insertMany(initData.data);
        console.log("Database initialized with sample data");

    } catch (err) {
        console.error("Error initializing database", err);
    }
};

async function main() {
    const mongoUri = process.env.ALTASDB;
    if (!mongoUri) {
        throw new Error("ALTASDB is not set in the environment");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    await initDb();
}

main().catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exitCode = 1;
});