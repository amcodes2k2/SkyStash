const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("dotenv").config();

app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: [process.env.FRONTEND_BASE_URL], credentials: true}));

app.get("/", (req, res) => {
    res.send("SkyStash backend is up and running...");
});

const authRoutes = require("./routes/auth.js");
app.use("/api/v1", authRoutes);

const fileHandlingRoutes = require("./routes/fileHandling.js");
app.use("/api/v1", fileHandlingRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT ${process.env.PORT}...`);
});

const dbConnect = require("./config/dbConnect.js");
dbConnect();