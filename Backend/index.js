const express = require("express");
const app = express();

require("dotenv").config();

app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT ${process.env.PORT}...`);
});

const dbConnect = require("./config/dbConnect.js");
dbConnect();