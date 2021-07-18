const express = require('express')
const path = require("path");
const cors = require("cors");
const connectDB = require('./db');

const app = express()
connectDB();

app.use(cors());
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/authorization"));
app.use("/api/users", require("./routes/users"));
app.use("/api/templates", require("./routes/templates"));

app.use("/map", express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`Server started on port ${process.env.PORT}`);
});