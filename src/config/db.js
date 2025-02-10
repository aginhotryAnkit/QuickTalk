const mongo = require('mongoose');
require('dotenv').config();

mongo.set("debug", true);

async function connectDB() {
    try {
        console.log("Connecting MongoDB Server");
        await mongo.connect(process.env.MONGO_URL);
        console.log("MongoDB Server connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        throw new Error(err.message);
    }
}

module.exports = connectDB;
