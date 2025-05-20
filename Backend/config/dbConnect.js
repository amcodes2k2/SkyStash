require("dotenv").config();
const mongoose = require("mongoose");

function dbConnect()
{
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Successfully connected with database...");
    })
    .catch((error) => {
        console.log(error);
        console.log("Failed to connect with database...");

        process.exit(1);
    });
}

module.exports = dbConnect;