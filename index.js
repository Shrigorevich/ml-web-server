import express from 'express';
import path from "path";
import cors from "cors";
import connectDB from './db.js';
import authorization from "./routes/authorization.js";
import users from "./routes/users.js";
import templates from "./routes/templates.js";

const app = express()
connectDB();

app.use(cors());
import { config } from 'dotenv';
config();

app.use(express.json({ extended: true }));
app.use("/api/auth", authorization);
app.use("/api/users", users);
app.use("/api/templates", templates);

app.use("/templates", express.static(path.join("./", "public")));

app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`Server started on port ${process.env.PORT}`);
});