const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(cookieParser());
app.use(express.json());

const authRoutes = require("./routes/auth.js");
app.use("/api/v1", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT ${process.env.PORT}...`);
});

const dbConnect = require("./config/dbConnect.js");
dbConnect();